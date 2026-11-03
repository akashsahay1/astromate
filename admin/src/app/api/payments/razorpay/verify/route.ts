import { NextRequest, NextResponse } from 'next/server';
import { SecurityMiddleware } from '@/lib/security';
import { getRazorpayConfig, hmacMatches, fetchPayment, settleRazorpayPayment } from '@/lib/razorpay';

/** App callback after Razorpay checkout. Purpose and amount come from the stored transaction, not the body. */
export async function POST(request: NextRequest) {
  let user;
  try {
    user = await SecurityMiddleware.authenticateRequest(request);
  } catch {
    return NextResponse.json({ success: false, error: 'AUTHENTICATION_REQUIRED', message: 'Valid authentication token is required' }, { status: 401 });
  }

  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = await request.json();
    if (typeof razorpay_order_id !== 'string' || typeof razorpay_payment_id !== 'string' || typeof razorpay_signature !== 'string') {
      return NextResponse.json({ success: false, error: 'MISSING_PAYMENT_DATA', message: 'Required payment verification data is missing' }, { status: 400 });
    }

    const cfg = await getRazorpayConfig();
    if (!cfg) {
      return NextResponse.json({ success: false, error: 'PAYMENT_SERVICE_ERROR', message: 'Payment verification service is temporarily unavailable' }, { status: 503 });
    }

    if (!hmacMatches(cfg.keySecret, `${razorpay_order_id}|${razorpay_payment_id}`, razorpay_signature)) {
      return NextResponse.json({ success: false, error: 'PAYMENT_VERIFICATION_FAILED', message: 'Payment verification failed. Please contact support if amount was deducted.' }, { status: 400 });
    }

    // Signature proves Razorpay issued this payment for this order. The API lookup adds status/amount checks
    // when Razorpay is reachable; if it is down we still settle on the signature (the webhook re-checks later).
    const details = await fetchPayment(razorpay_payment_id, cfg).catch(() => null);
    if (details && details.status !== 'captured' && details.status !== 'authorized') {
      return NextResponse.json({ success: false, error: 'PAYMENT_NOT_CAPTURED', message: `Payment ${details.status}. Please try again or contact support.` }, { status: 400 });
    }

    const result = await settleRazorpayPayment({
      razorpayOrderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
      paidAmountPaise: details ? Number(details.amount) : undefined,
      userId: user.userId as string,
      details: details ?? undefined,
    });
    if (!result.ok) {
      return NextResponse.json({ success: false, error: result.error, message: result.message }, { status: result.status });
    }

    return NextResponse.json({
      success: true,
      message: 'Payment verified and processed successfully',
      data: {
        payment_id: razorpay_payment_id,
        order_id: razorpay_order_id,
        amount: result.transaction.amount,
        purpose: result.transaction.purpose,
        status: 'completed',
      },
    });
  } catch (error) {
    console.error('Payment verification error:', error);
    return NextResponse.json({ success: false, error: 'INTERNAL_SERVER_ERROR', message: 'Payment verification failed due to server error. Please contact support.' }, { status: 500 });
  }
}
