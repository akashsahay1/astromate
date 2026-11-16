// Razorpay Checkout for the website (wallet recharge, shop orders). The order is created and verified by our API;
// this only loads Razorpay's script and opens its payment popup.
declare global { interface Window { Razorpay?: any } }

let loading: Promise<void> | null = null;
export const loadRazorpay = () =>
  (loading ??= new Promise<void>((resolve, reject) => {
    if (window.Razorpay) return resolve();
    const s = document.createElement("script");
    s.src = "https://checkout.razorpay.com/v1/checkout.js";
    s.onload = () => resolve();
    s.onerror = () => { loading = null; reject(new Error("Could not load Razorpay. Check your connection.")); };
    document.body.appendChild(s);
  }));

export type RazorpayResult = { razorpay_payment_id: string; razorpay_order_id: string; razorpay_signature: string };

/** Opens the Razorpay popup. Resolves with the payment ids on success; rejects if the user closes it or payment fails. */
export async function payWithRazorpay(opts: {
  key: string; orderId: string; amountPaise: number; name?: string; description?: string;
  prefill?: { name?: string; email?: string; contact?: string };
}): Promise<RazorpayResult> {
  await loadRazorpay();
  return new Promise((resolve, reject) => {
    const rzp = new window.Razorpay({
      key: opts.key,
      order_id: opts.orderId,
      amount: opts.amountPaise,
      currency: "INR",
      name: opts.name || "Astromate",
      description: opts.description,
      prefill: opts.prefill,
      theme: { color: "#DB0007" },
      handler: (r: RazorpayResult) => resolve(r),
      modal: { ondismiss: () => reject(new Error("Payment cancelled")) },
    });
    rzp.on("payment.failed", (r: any) => reject(new Error(r?.error?.description || "Payment failed")));
    rzp.open();
  });
}
