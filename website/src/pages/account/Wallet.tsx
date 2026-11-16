import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowDownLeft, ArrowUpRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/api";
import { payWithRazorpay } from "@/lib/razorpay";
import { useAuth } from "@/hooks/useAuth";
import { useT } from "@/hooks/useLang";
import { useToast } from "@/hooks/use-toast";
import { ListState, Panel, rupees, statusLabel, when } from "./shared";

// Limits enforced by POST /payments/razorpay/create-order.
const MIN = 10, MAX = 50000;
const QUICK = [100, 200, 500, 1000, 2000];

type Txn = { _id: string; type: "credit" | "debit" | string; amount: number; description: string; created_at: string; status: string };

const Wallet = () => {
  const t = useT();
  const { toast } = useToast();
  const qc = useQueryClient();
  const { user, refreshUser } = useAuth();
  const [amount, setAmount] = useState("500");
  const [paying, setPaying] = useState(false);

  // ponytail: first 50 transactions only; add "load more" (offset param) when someone needs older ones
  const txns = useQuery({
    queryKey: ["account", "transactions"],
    queryFn: async () => (await api("/customers/wallet/transactions?limit=50")).data.transactions as Txn[],
  });

  const recharge = async () => {
    const amt = Number(amount);
    if (!Number.isFinite(amt) || amt < MIN || amt > MAX) {
      return toast({ title: t(`Enter an amount between ₹${MIN} and ₹${MAX.toLocaleString("en-IN")}`, `₹${MIN} से ₹${MAX.toLocaleString("en-IN")} के बीच राशि लिखें`), variant: "destructive" });
    }
    setPaying(true);
    try {
      const [cfg, order] = await Promise.all([
        api("/app-config"),
        api("/payments/razorpay/create-order", { body: { amount: amt, currency: "INR", purpose: "wallet_recharge", order_type: "wallet" } }),
      ]);
      const key = cfg.config?.razorpay?.keyId;
      if (!key) throw new Error(t("Payments are unavailable right now", "अभी भुगतान उपलब्ध नहीं है"));
      const paid = await payWithRazorpay({
        key, orderId: order.data.id, amountPaise: order.data.amount,
        description: t("Wallet recharge", "वॉलेट रिचार्ज"),
        prefill: { name: user?.full_name, email: user?.email_address, contact: user?.phone_number },
      });
      await api("/payments/razorpay/verify", { body: paid });
      toast({ title: t(`${rupees(amt)} added to your wallet`, `${rupees(amt)} आपके वॉलेट में जुड़ गए`) });
    } catch (err) {
      const msg = (err as Error).message;
      if (msg !== "Payment cancelled") toast({ title: t("Recharge failed", "रिचार्ज नहीं हुआ"), description: msg, variant: "destructive" });
    } finally {
      setPaying(false);
      refreshUser();
      qc.invalidateQueries({ queryKey: ["account", "transactions"] });
    }
  };

  return (
    <div className="space-y-6">
      <Panel>
        <p className="text-sm text-muted-foreground">{t("Wallet balance", "वॉलेट बैलेंस")}</p>
        <p className="text-3xl font-bold text-primary mb-5">{rupees(user?.wallet_balance)}</p>
        <p className="font-semibold mb-3">{t("Add money", "पैसे जोड़ें")}</p>
        <div className="flex flex-wrap gap-2 mb-3">
          {QUICK.map((q) => (
            <Button key={q} type="button" size="sm" variant={amount === String(q) ? "default" : "outline"} onClick={() => setAmount(String(q))}>
              {rupees(q)}
            </Button>
          ))}
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">₹</span>
            <Input type="number" inputMode="numeric" min={MIN} max={MAX} value={amount} onChange={(e) => setAmount(e.target.value)}
              className="pl-7" aria-label={t("Amount", "राशि")} />
          </div>
          <Button variant="cta" onClick={recharge} disabled={paying}>
            {paying && <Loader2 className="w-4 h-4 animate-spin" />}{t("Proceed to pay", "भुगतान करें")}
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          {t(`Min ₹${MIN}, max ₹${MAX.toLocaleString("en-IN")} per recharge. Secure payment by Razorpay.`,
            `एक बार में कम से कम ₹${MIN}, अधिकतम ₹${MAX.toLocaleString("en-IN")}। Razorpay द्वारा सुरक्षित भुगतान।`)}
        </p>
      </Panel>

      <Panel title={t("Transactions", "लेन-देन")}>
        <ListState isLoading={txns.isLoading} error={txns.error} empty={!txns.data?.length} emptyText={t("No transactions yet", "अभी कोई लेन-देन नहीं")} />
        <ul className="divide-y">
          {txns.data?.map((x) => {
            const credit = x.type === "credit";
            return (
              <li key={x._id} className="py-3 flex items-center gap-3">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${credit ? "bg-green-500/10 text-green-600" : "bg-primary/10 text-primary"}`}>
                  {credit ? <ArrowDownLeft className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{x.description}</p>
                  <p className="text-xs text-muted-foreground">{when(x.created_at)}{x.status !== "completed" && ` · ${statusLabel(t, x.status)}`}</p>
                </div>
                <p className={`font-semibold whitespace-nowrap ${credit ? "text-green-600" : ""} ${x.status !== "completed" ? "opacity-50" : ""}`}>
                  {credit ? "+" : "−"}{rupees(x.amount)}
                </p>
              </li>
            );
          })}
        </ul>
      </Panel>
    </div>
  );
};

export default Wallet;
