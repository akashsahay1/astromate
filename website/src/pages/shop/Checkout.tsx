import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { CheckCircle2, Loader2, MapPin, Plus } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { useT } from "@/hooks/useLang";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/api";
import { payWithRazorpay } from "@/lib/razorpay";
import { cart, inr, shippingFor, useCartItems, useProductText } from "@/lib/cart";

// Same flow as the app (mobileapp/lib/screens/shop/checkout.dart): POST /orders (server prices it) →
// wallet: paid on creation | razorpay: /payments/razorpay/create-order for that order → popup → /payments/razorpay/verify.

type Address = {
  _id: string; label?: string; full_name: string; phone_number: string; address_line_1: string; address_line_2?: string;
  city: string; state: string; postal_code: string; country?: string; is_default?: boolean;
};
type Order = { _id: string; order_number: string; total_amount: number; payment_status: string; status: string };

const EMPTY = { full_name: "", phone_number: "", address_line_1: "", address_line_2: "", city: "", state: "", postal_code: "" };

const Checkout = () => {
  const t = useT();
  const text = useProductText();
  const { toast } = useToast();
  const { user, loading: authLoading, refreshUser } = useAuth();
  const { items, valid, subtotal, ok, loading } = useCartItems();

  const addresses = useQuery({ queryKey: ["addresses"], queryFn: async () => (await api<{ addresses: Address[] }>("/addresses")).addresses, enabled: !!user });
  const config = useQuery({ queryKey: ["app-config"], queryFn: async () => (await api("/app-config")).config, enabled: !!user, staleTime: 10 * 60_000 });

  const [addrId, setAddrId] = useState<string>("");
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [method, setMethod] = useState<"razorpay" | "wallet">("razorpay");
  const [busy, setBusy] = useState(false);
  // An unpaid Razorpay order from this visit: retrying pays it instead of creating a duplicate (if nothing changed).
  const [pending, setPending] = useState<{ key: string; order: Order } | null>(null);
  const [done, setDone] = useState<{ order: Order; verified: boolean } | null>(null);

  const list = addresses.data ?? [];
  useEffect(() => {
    if (!addresses.isSuccess) return;
    if (!list.length) setAdding(true);
    else if (!list.some((a) => a._id === addrId)) setAddrId((list.find((a) => a.is_default) ?? list[0])._id);
  }, [addresses.isSuccess, list, addrId]);
  useEffect(() => {
    if (user) setForm((f) => ({ ...f, full_name: f.full_name || user.full_name || "", phone_number: f.phone_number || (user.phone_number || "").replace(/\D/g, "").slice(-10) }));
  }, [user]);

  if (authLoading) return <Shell><Loader2 className="h-6 w-6 animate-spin mx-auto text-muted-foreground" /></Shell>;
  if (!user) return <Navigate to="/auth?redirect=/checkout" replace />;

  if (done) {
    return (
      <Shell>
        <div className="bg-white rounded-[14px] p-8 text-center border border-[hsl(40,50%,85%)] max-w-lg mx-auto">
          <CheckCircle2 className="h-14 w-14 text-green-600 mx-auto mb-3" />
          <h1 className="font-serif text-2xl font-bold text-[#171452] mb-2">{t("Order placed!", "ऑर्डर हो गया!")}</h1>
          <p className="text-muted-foreground">{t("Order number", "ऑर्डर नंबर")}: <span className="font-bold text-foreground">{done.order.order_number}</span></p>
          <p className="text-muted-foreground mb-2">{t("Amount", "राशि")}: <span className="font-bold text-foreground">{inr(done.order.total_amount)}</span></p>
          {!done.verified && (
            <p className="text-sm text-amber-700 bg-amber-50 rounded-lg p-3 my-3">
              {t("Your payment was received and is being confirmed. If the order still shows unpaid in a few minutes, contact support with your order number.",
                "आपका भुगतान मिल गया है और पुष्टि की जा रही है। अगर कुछ मिनट बाद भी ऑर्डर अनपेड दिखे, तो ऑर्डर नंबर के साथ सपोर्ट से संपर्क करें।")}
            </p>
          )}
          <div className="flex flex-col sm:flex-row gap-3 justify-center mt-5">
            <Button asChild className="bg-cta text-cta-foreground hover:bg-cta-hover"><Link to="/account/orders">{t("View my orders", "मेरे ऑर्डर देखें")}</Link></Button>
            <Button asChild variant="outline"><Link to="/shop">{t("Continue shopping", "खरीदारी जारी रखें")}</Link></Button>
          </div>
        </div>
      </Shell>
    );
  }

  if (!loading && items.length === 0) {
    return (
      <Shell>
        <div className="bg-white rounded-[14px] p-10 text-center border border-[hsl(40,50%,85%)] max-w-lg mx-auto">
          <p className="text-muted-foreground mb-5">{t("Your cart is empty.", "आपका कार्ट खाली है।")}</p>
          <Button asChild className="bg-cta text-cta-foreground hover:bg-cta-hover"><Link to="/shop">{t("Browse the shop", "शॉप देखें")}</Link></Button>
        </div>
      </Shell>
    );
  }

  const gstRate = Number(config.data?.commission?.gstRate ?? 18);
  const shipping = shippingFor(subtotal);
  const tax = Math.round(subtotal * gstRate) / 100;
  const total = Math.round((subtotal + shipping + tax) * 100) / 100;
  const wallet = Number(user.wallet_balance ?? 0);
  const address = list.find((a) => a._id === addrId);

  const saveAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const r = await api<{ address_id: string }>("/addresses", { body: { ...form, country: "India", address_type: "home" } });
      await addresses.refetch();
      setAddrId(r.address_id);
      setAdding(false);
      setForm({ ...EMPTY, full_name: form.full_name, phone_number: form.phone_number });
    } catch (err: any) {
      toast({ title: t("Could not save address", "पता सेव नहीं हो सका"), description: err.message, variant: "destructive" });
    } finally { setSaving(false); }
  };

  const placeOrder = async () => {
    if (!address) return;
    setBusy(true);
    const key = JSON.stringify([address._id, method, valid.map((i) => [i.id, i.qty])]);
    let order = pending?.key === key ? pending.order : null;
    try {
      if (!order) {
        const r = await api<{ order: Order }>("/orders", {
          body: {
            items: valid.map((i) => ({ product_id: i.id, quantity: i.qty })),
            shipping_address: { ...address, pincode: address.postal_code },
            payment_method: method,
          },
        });
        order = r.order;
      }

      if (method === "wallet") { // the server debits the wallet and marks the order paid on creation
        cart.clear();
        refreshUser();
        setDone({ order, verified: true });
        return;
      }

      setPending({ key, order });
      const rp = await api("/payments/razorpay/create-order", {
        body: { purpose: "product_purchase", order_type: "order", order_id: order._id, receipt: `order_${order.order_number}`.slice(0, 40) },
      });
      const keyId = config.data?.razorpay?.keyId || (await api("/app-config")).config?.razorpay?.keyId;
      if (!keyId) throw new Error(t("Online payment is not available right now.", "ऑनलाइन भुगतान अभी उपलब्ध नहीं है।"));
      const paid = await payWithRazorpay({
        key: keyId, orderId: rp.data.id, amountPaise: rp.data.amount,
        description: `Order #${order.order_number}`,
        prefill: { name: user.full_name, email: user.email_address, contact: user.phone_number },
      }).catch((e: Error) => {
        // closed popup / failed card: the order stays unpaid; the button retries it
        toast({ title: e.message, description: t("Your order is saved. You can try paying again.", "आपका ऑर्डर सेव है। आप फिर से भुगतान कर सकते हैं।"), variant: "destructive" });
        return null;
      });
      if (!paid) return;

      let verified = true;
      try { await api("/payments/razorpay/verify", { body: paid }); }
      catch { verified = false; } // money taken; the Razorpay webhook settles it if verify didn't
      cart.clear();
      setPending(null);
      setDone({ order: { ...order, payment_status: verified ? "paid" : order.payment_status }, verified });
    } catch (err: any) {
      toast({ title: t("Could not place order", "ऑर्डर नहीं हो सका"), description: err.message, variant: "destructive" });
    } finally { setBusy(false); }
  };

  const field = (name: keyof typeof EMPTY, en: string, hi: string, extra: React.InputHTMLAttributes<HTMLInputElement> = {}) => (
    <div className={name === "address_line_1" || name === "address_line_2" ? "sm:col-span-2" : ""}>
      <Label htmlFor={`a-${name}`} className="text-xs">{t(en, hi)}</Label>
      <Input id={`a-${name}`} value={form[name]} onChange={(e) => setForm({ ...form, [name]: e.target.value })} required={name !== "address_line_2"} {...extra} />
    </div>
  );

  return (
    <Shell>
      <h1 className="font-serif text-3xl font-bold text-[#171452] mb-6">{t("Checkout", "चेकआउट")}</h1>
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6">
        <div className="space-y-5">
          <section className="bg-white rounded-[14px] p-5 border border-[hsl(40,50%,85%)]">
            <h2 className="font-bold text-lg text-[#2C1010] mb-3 flex items-center gap-2"><MapPin className="h-5 w-5" /> {t("Shipping address", "शिपिंग पता")}</h2>
            {addresses.isLoading && <p className="text-sm text-muted-foreground">{t("Loading...", "लोड हो रहा है...")}</p>}
            {addresses.isError && (
              <p className="text-sm text-destructive">{t("Could not load your addresses.", "आपके पते लोड नहीं हो सके।")}{" "}
                <button className="underline" onClick={() => addresses.refetch()}>{t("Try again", "फिर से कोशिश करें")}</button></p>
            )}
            <div className="space-y-2">
              {list.map((a) => (
                <label key={a._id} className={`flex gap-3 p-3 rounded-lg border cursor-pointer ${addrId === a._id ? "border-[#171452] bg-[#171452]/5" : "border-border"}`}>
                  <input type="radio" name="address" className="mt-1" checked={addrId === a._id} onChange={() => setAddrId(a._id)} />
                  <span className="text-sm">
                    <span className="font-semibold">{a.full_name}</span> · {a.phone_number}<br />
                    {a.address_line_1}{a.address_line_2 ? `, ${a.address_line_2}` : ""}, {a.city}, {a.state} {a.postal_code}
                  </span>
                </label>
              ))}
            </div>
            {adding ? (
              <form onSubmit={saveAddress} className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                {field("full_name", "Full name", "पूरा नाम", { autoComplete: "name" })}
                {field("phone_number", "Mobile number", "मोबाइल नंबर", { inputMode: "numeric", pattern: "[6-9][0-9]{9}", title: t("10-digit mobile number", "10 अंकों का मोबाइल नंबर"), autoComplete: "tel-national" })}
                {field("address_line_1", "House no., street", "मकान नं., गली", { autoComplete: "address-line1" })}
                {field("address_line_2", "Area, landmark (optional)", "क्षेत्र, लैंडमार्क (वैकल्पिक)", { autoComplete: "address-line2" })}
                {field("city", "City", "शहर", { autoComplete: "address-level2" })}
                {field("state", "State", "राज्य", { autoComplete: "address-level1" })}
                {field("postal_code", "PIN code", "पिन कोड", { inputMode: "numeric", pattern: "[1-9][0-9]{5}", title: t("6-digit PIN code", "6 अंकों का पिन कोड"), autoComplete: "postal-code" })}
                <div className="sm:col-span-2 flex gap-2">
                  <Button type="submit" disabled={saving} className="bg-[#171452] hover:bg-[#171452]/90">{saving ? t("Saving...", "सेव हो रहा है...") : t("Save address", "पता सेव करें")}</Button>
                  {list.length > 0 && <Button type="button" variant="ghost" onClick={() => setAdding(false)}>{t("Cancel", "रद्द करें")}</Button>}
                </div>
              </form>
            ) : (
              <button onClick={() => setAdding(true)} className="mt-3 text-sm font-semibold text-[#171452] flex items-center gap-1 hover:underline">
                <Plus className="h-4 w-4" /> {t("Add a new address", "नया पता जोड़ें")}
              </button>
            )}
          </section>

          <section className="bg-white rounded-[14px] p-5 border border-[hsl(40,50%,85%)]">
            <h2 className="font-bold text-lg text-[#2C1010] mb-3">{t("Payment", "भुगतान")}</h2>
            <label className={`flex gap-3 p-3 rounded-lg border cursor-pointer mb-2 ${method === "razorpay" ? "border-[#171452] bg-[#171452]/5" : "border-border"}`}>
              <input type="radio" name="pay" checked={method === "razorpay"} onChange={() => setMethod("razorpay")} />
              <span className="text-sm">{t("UPI, card, net banking (Razorpay)", "UPI, कार्ड, नेट बैंकिंग (Razorpay)")}</span>
            </label>
            <label className={`flex gap-3 p-3 rounded-lg border ${wallet < total ? "opacity-60 cursor-not-allowed" : "cursor-pointer"} ${method === "wallet" ? "border-[#171452] bg-[#171452]/5" : "border-border"}`}>
              <input type="radio" name="pay" disabled={wallet < total} checked={method === "wallet"} onChange={() => setMethod("wallet")} />
              <span className="text-sm">
                {t("Astromate wallet", "Astromate वॉलेट")} — {t("balance", "बैलेंस")} {inr(wallet)}
                {wallet < total && <span className="block text-xs text-muted-foreground">{t("Not enough balance for this order", "इस ऑर्डर के लिए बैलेंस कम है")}</span>}
              </span>
            </label>
          </section>
        </div>

        <aside className="bg-white rounded-[14px] p-5 border border-[hsl(40,50%,85%)] shadow-sm h-fit lg:sticky lg:top-20">
          <h2 className="font-bold text-lg text-[#2C1010] mb-3">{t("Order summary", "ऑर्डर सारांश")}</h2>
          <div className="space-y-2 mb-3">
            {items.map(({ id, qty, product }) => (
              <div key={id} className="flex justify-between gap-2 text-sm">
                <span className="line-clamp-2">{product ? text(product, "name") : "…"} × {qty}</span>
                <span className="whitespace-nowrap">{product ? inr(product.price * qty) : ""}</span>
              </div>
            ))}
          </div>
          <div className="border-t pt-3 space-y-1 text-sm">
            <div className="flex justify-between"><span>{t("Subtotal", "उप-योग")}</span><span>{inr(subtotal)}</span></div>
            <div className="flex justify-between"><span>{t("Shipping", "शिपिंग")}</span><span>{shipping ? inr(shipping) : t("Free", "फ्री")}</span></div>
            <div className="flex justify-between"><span>GST ({gstRate}%)</span><span>{inr(tax)}</span></div>
            <div className="flex justify-between font-bold text-base pt-1"><span>{t("Total", "कुल")}</span><span>{inr(total)}</span></div>
          </div>
          <Button className="w-full mt-4 bg-cta text-cta-foreground hover:bg-cta-hover" disabled={busy || !ok || !address} onClick={placeOrder}>
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : pending ? t(`Retry payment · ${inr(total)}`, `फिर से भुगतान करें · ${inr(total)}`) : t(`Place order · ${inr(total)}`, `ऑर्डर करें · ${inr(total)}`)}
          </Button>
          {!loading && !ok && (
            <p className="text-xs text-destructive mt-2">{t("Some items are unavailable.", "कुछ आइटम उपलब्ध नहीं हैं।")} <Link to="/cart" className="underline">{t("Update cart", "कार्ट अपडेट करें")}</Link></p>
          )}
          {!address && !addresses.isLoading && <p className="text-xs text-muted-foreground mt-2">{t("Add a shipping address to continue.", "आगे बढ़ने के लिए शिपिंग पता जोड़ें।")}</p>}
        </aside>
      </div>
    </Shell>
  );
};

const Shell = ({ children }: { children: React.ReactNode }) => (
  <div className="min-h-screen bg-[#FDF6E3]">
    <Navbar />
    <div className="max-w-[1100px] mx-auto px-4 sm:px-6 py-8">{children}</div>
    <Footer />
  </div>
);

export default Checkout;
