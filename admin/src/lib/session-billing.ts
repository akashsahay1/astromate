import type { Document, WithId } from 'mongodb';
import DatabaseService from '@/lib/database';
import NotificationService from '@/lib/notifications';

export type ChargeResult =
  | { ok: true; amountDeducted: number }
  | { ok: false; reason: 'insufficient_balance' | 'concurrent_update' | 'user_not_found'; required?: number; balance?: number };

/** Platform commission % for a session type. Accepts every session_type the app and socket server use. */
async function platformCommissionRate(sessionType: string, astrologer: Document | null): Promise<number> {
  const settings = await (await DatabaseService.getCollection('app_settings')).findOne({ type: 'general' });
  const defaultRate = (settings?.commission?.defaultRate as number | undefined) ?? 20;
  const pct = astrologer?.commission_percentage ?? {};
  if (sessionType === 'chat') return pct.chat ?? defaultRate;
  if (sessionType === 'video_call' || sessionType === 'video') return pct.video ?? defaultRate;
  return pct.call ?? defaultRate; // voice_call, audio_call, call
}

/**
 * Raise a session's billed total to `newTotal`, moving only the difference.
 *
 * All money moves are atomic so concurrent requests (customer + astrologer phones, retries,
 * socket end + REST end) can never charge the same minutes twice or overdraw the wallet:
 *  1. compare-and-set the session total (fails if another request already moved it)
 *  2. debit the customer only if the balance covers it ($inc with $gte guard)
 *  3. credit the astrologer only after the debit succeeded
 */
export async function chargeSessionTo(
  session: WithId<Document>,
  newTotal: number,
  durationMinutes: number,
): Promise<ChargeResult> {
  const sessions = await DatabaseService.getCollection('sessions');
  const users = await DatabaseService.getCollection('users');

  const currentTotal: number = session.total_amount || 0;
  const delta = Math.round((newTotal - currentTotal) * 100) / 100;
  if (delta <= 0) return { ok: true, amountDeducted: 0 };

  // 1. claim the delta
  const claimed = await sessions.updateOne(
    { _id: session._id, total_amount: session.total_amount ?? { $exists: false } },
    { $set: { total_amount: newTotal, duration_minutes: durationMinutes, billing_updated_at: new Date() } },
  );
  if (claimed.modifiedCount === 0) return { ok: false, reason: 'concurrent_update' };

  // 2. debit customer
  const debited = await users.updateOne(
    { user_id: session.user_id, wallet_balance: { $gte: delta } },
    { $inc: { wallet_balance: -delta }, $currentDate: { updated_at: true } },
  );
  if (debited.modifiedCount === 0) {
    // roll back the claim so the session total stays what was actually paid
    await sessions.updateOne(
      { _id: session._id, total_amount: newTotal },
      { $set: { total_amount: currentTotal, duration_minutes: session.duration_minutes ?? 0 } },
    );
    const user = await users.findOne({ user_id: session.user_id }, { projection: { wallet_balance: 1 } });
    if (!user) return { ok: false, reason: 'user_not_found' };
    return { ok: false, reason: 'insufficient_balance', required: delta, balance: user.wallet_balance || 0 };
  }

  // 3. credit astrologer + transaction records
  const sessionType: string = session.session_type || 'voice_call';
  const sessionId = String(session._id);
  const astrologer = await users.findOne({ user_id: session.astrologer_id }, { projection: { commission_percentage: 1 } });
  const commissionRate = await platformCommissionRate(sessionType, astrologer);
  const astrologerPct = (100 - commissionRate) / 100;

  if (astrologer) {
    await users.updateOne(
      { user_id: session.astrologer_id },
      { $inc: { wallet_balance: delta * astrologerPct }, $currentDate: { updated_at: true } },
    );
  }

  const txns = await DatabaseService.getCollection('transactions');
  const now = new Date();
  const stamp = Date.now();
  const rand = () => Math.random().toString(36).slice(2, 8);
  const upsert = (filter: Document, amount: number, description: string, extra: Document) =>
    txns.updateOne(filter, {
      $set: { amount, description, status: 'completed', updated_at: now },
      $setOnInsert: { transaction_id: `txn_${stamp}_${rand()}`, created_at: now, ...extra },
    }, { upsert: true });

  await upsert(
    { user_id: session.user_id, transaction_type: 'debit', session_id: sessionId, service_type: sessionType },
    newTotal, `Payment for ${sessionType} session (${durationMinutes} minutes)`,
    { reference_id: `PAY${stamp}`, user_type: 'customer', payment_method: 'wallet' },
  );
  if (astrologer) {
    await upsert(
      { user_id: session.astrologer_id, recipient_user_id: session.astrologer_id, transaction_type: 'credit', session_id: sessionId, service_type: sessionType },
      newTotal * astrologerPct, `Earnings from ${sessionType} session (${durationMinutes} minutes)`,
      { reference_id: `ERN${stamp}`, user_type: 'astrologer', payment_method: 'wallet' },
    );
  }
  await upsert(
    { transaction_type: 'commission', session_id: sessionId, service_type: sessionType },
    newTotal * (commissionRate / 100), `Platform commission for ${sessionType} session (${durationMinutes} minutes)`,
    { reference_id: `COM${stamp}`, user_type: 'platform', payment_method: 'internal' },
  );

  try {
    await NotificationService.sendSessionPaymentDebitNotification(session.user_id, sessionType, newTotal, durationMinutes);
    if (astrologer) {
      await NotificationService.sendSessionPaymentCreditNotification(session.astrologer_id, sessionType, newTotal * astrologerPct, durationMinutes);
    }
  } catch (e) {
    console.error('Failed to send payment notifications:', e);
  }

  return { ok: true, amountDeducted: delta };
}
