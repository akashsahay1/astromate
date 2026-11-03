import crypto from 'crypto';
import type { Document, WithId } from 'mongodb';
import DatabaseService from '@/lib/database';
import { markOrderPaid } from '@/lib/orders';

export async function getRazorpayConfig(): Promise<{ keyId: string; keySecret: string; webhookSecret?: string } | null> {
  const settings = await (await DatabaseService.getCollection('app_settings')).findOne({ type: 'general' });
  const rp = settings?.razorpay as Record<string, string> | undefined;
  if (!rp?.keyId || !rp?.keySecret) return null;
  return { keyId: rp.keyId, keySecret: rp.keySecret, webhookSecret: rp.webhookSecret || process.env.RAZORPAY_WEBHOOK_SECRET };
}

export function hmacMatches(secret: string, payload: string, signature: string): boolean {
  const expected = crypto.createHmac('sha256', secret).update(payload).digest('hex');
  return typeof signature === 'string' && signature.length === expected.length &&
    crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature));
}

export async function fetchPayment(paymentId: string, cfg: { keyId: string; keySecret: string }): Promise<Record<string, unknown> | null> {
  const res = await fetch(`https://api.razorpay.com/v1/payments/${encodeURIComponent(paymentId)}`, {
    headers: { Authorization: `Basic ${Buffer.from(`${cfg.keyId}:${cfg.keySecret}`).toString('base64')}` },
  });
  return res.ok ? res.json() : null;
}

export type SettleResult =
  | { ok: true; transaction: WithId<Document>; alreadySettled?: boolean }
  | { ok: false; status: number; error: string; message: string };

/**
 * The ONLY place a Razorpay payment turns into money or a paid order.
 *
 * The pending transaction (created by /payments/razorpay/create-order for this user + Razorpay order)
 * is claimed with a single atomic pending→completed update, so the app callback, the legacy recharge
 * route and the webhook can all race and the wallet is credited exactly once. Purpose and amount come
 * from that stored transaction, never from the client.
 *
 * Callers must have proven the payment belongs to `razorpayOrderId` (checkout signature, webhook
 * signature, or Razorpay API lookup) before calling.
 */
export async function settleRazorpayPayment(opts: {
  razorpayOrderId: string;
  paymentId: string;
  paidAmountPaise?: number; // from Razorpay when known — must match the stored amount
  userId?: string;          // set when called on behalf of an authenticated user
  details?: Document;
}): Promise<SettleResult> {
  const txns = await DatabaseService.getCollection('transactions');
  const owner = opts.userId ? { user_id: opts.userId } : {};
  const pending = await txns.findOne({ razorpay_order_id: opts.razorpayOrderId, payment_method: 'razorpay', ...owner });
  if (!pending) return { ok: false, status: 404, error: 'PAYMENT_TRANSACTION_NOT_FOUND', message: 'Payment transaction not found' };
  if (pending.status === 'completed') return { ok: true, transaction: pending, alreadySettled: true };

  const amount = Number(pending.amount);
  if (opts.paidAmountPaise !== undefined && opts.paidAmountPaise !== Math.round(amount * 100)) {
    await txns.updateOne({ _id: pending._id, status: 'pending' }, { $set: { status: 'failed', failure_reason: 'Amount mismatch with Razorpay', payment_id: opts.paymentId, updated_at: new Date() } });
    return { ok: false, status: 400, error: 'AMOUNT_MISMATCH', message: 'Payment amount does not match order amount' };
  }

  // atomic claim — only one caller gets past this line
  const claimed = await txns.findOneAndUpdate(
    { _id: pending._id, status: { $in: ['pending', 'failed'] } },
    { $set: { status: 'completed', payment_id: opts.paymentId, verified_at: new Date(), updated_at: new Date(), ...(opts.details && { razorpay_payment_details: opts.details }) } },
    { returnDocument: 'after' },
  );
  if (!claimed) return { ok: true, transaction: pending, alreadySettled: true };

  if (claimed.purpose === 'wallet_recharge') {
    await (await DatabaseService.getCollection('users')).updateOne(
      { user_id: claimed.user_id },
      { $inc: { wallet_balance: amount }, $currentDate: { updated_at: true } },
    );
  } else if (claimed.purpose === 'product_purchase') {
    const order = await (await DatabaseService.getCollection('orders')).findOne({ razorpay_order_id: opts.razorpayOrderId, user_id: claimed.user_id });
    if (order) await markOrderPaid(order, opts.paymentId);
    else console.error(`Paid Razorpay order ${opts.razorpayOrderId} has no matching shop order — needs manual review`);
  }
  return { ok: true, transaction: claimed };
}
