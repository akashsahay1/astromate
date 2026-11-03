import { NextRequest, NextResponse } from 'next/server';
import { getRazorpayConfig, hmacMatches, settleRazorpayPayment } from '@/lib/razorpay';

/**
 * Razorpay webhook (Dashboard → Webhooks → https://api.astromate.online/api/payments/razorpay/webhook,
 * events: payment.captured). Settles payments the app never confirmed (app killed, network drop).
 * Secret: app_settings.razorpay.webhookSecret or RAZORPAY_WEBHOOK_SECRET.
 */
export async function POST(request: NextRequest) {
  const raw = await request.text();
  const cfg = await getRazorpayConfig();
  if (!cfg?.webhookSecret) return NextResponse.json({ error: 'Webhook not configured' }, { status: 503 });
  if (!hmacMatches(cfg.webhookSecret, raw, request.headers.get('x-razorpay-signature') || '')) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  const event = JSON.parse(raw);
  const payment = event?.payload?.payment?.entity;
  if (event?.event !== 'payment.captured' || !payment?.order_id) return NextResponse.json({ ok: true });

  const result = await settleRazorpayPayment({
    razorpayOrderId: payment.order_id,
    paymentId: payment.id,
    paidAmountPaise: Number(payment.amount),
    details: payment,
  });
  // 404 = not one of ours (e.g. another integration on the same account) — acknowledge so Razorpay stops retrying
  if (!result.ok && result.status !== 404) console.error('Razorpay webhook settle failed:', payment.order_id, result);
  return NextResponse.json({ ok: true });
}
