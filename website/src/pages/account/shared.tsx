import { Loader2, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useT } from "@/hooks/useLang";

export const rupees = (n?: number) => `₹${Number(n || 0).toLocaleString("en-IN", { maximumFractionDigits: 2 })}`;

export const when = (d?: string) => {
  const date = d ? new Date(d) : null;
  return date && !isNaN(+date) ? date.toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" }) : "";
};

export const Panel = ({ title, children, action }: { title?: string; children: React.ReactNode; action?: React.ReactNode }) => (
  <div className="bg-card rounded-2xl p-5 lg:p-6 shadow-lg border">
    {(title || action) && (
      <div className="flex items-center justify-between gap-3 mb-4">
        {title && <h2 className="text-lg font-bold">{title}</h2>}
        {action}
      </div>
    )}
    {children}
  </div>
);

/** Loading / error / empty states for a list query. Returns null when there is data to show. */
export const ListState = ({ isLoading, error, empty, emptyText }: { isLoading: boolean; error: unknown; empty: boolean; emptyText: string }) =>
  isLoading ? <div className="py-10 flex justify-center"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
  : error ? <p className="py-8 text-center text-destructive text-sm">{(error as Error).message}</p>
  : empty ? <p className="py-8 text-center text-muted-foreground text-sm">{emptyText}</p>
  : null;

const STATUS: Record<string, [string, string]> = {
  pending: ["Pending", "लंबित"], confirmed: ["Confirmed", "कन्फ़र्म"], processing: ["Processing", "तैयार हो रहा है"],
  shipped: ["Shipped", "भेज दिया गया"], out_for_delivery: ["Out for delivery", "डिलीवरी के लिए निकला"], delivered: ["Delivered", "डिलीवर हो गया"],
  cancelled: ["Cancelled", "रद्द"], refunded: ["Refunded", "रिफ़ंड हो गया"], payment_failed: ["Payment failed", "भुगतान विफल"],
  failed: ["Failed", "विफल"], awaiting_payment: ["Awaiting payment", "भुगतान बाकी"], paid: ["Paid", "भुगतान हो गया"], completed: ["Completed", "पूरा हुआ"],
};
/** Translated label for an API status value (falls back to the raw value). */
export const statusLabel = (t: (en: string, hi: string) => string, s?: string) =>
  s && STATUS[s] ? t(...STATUS[s]) : (s || "").replace(/_/g, " ");

/** Chat and calls happen in the app; the website points customers there. */
export const AppCta = () => {
  const t = useT();
  return (
    <div className="bg-primary/5 border border-primary/20 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center gap-4">
      <Smartphone className="w-8 h-8 text-primary shrink-0" />
      <div className="flex-1">
        <p className="font-semibold">{t("Chat or call with astrologers", "ज्योतिषियों से चैट या कॉल करें")}</p>
        <p className="text-sm text-muted-foreground">
          {t("Consultations happen in the Astromate app, using the same account and wallet.",
            "परामर्श Astromate ऐप में होते हैं, इसी अकाउंट और वॉलेट से।")}
        </p>
      </div>
      <Button asChild variant="cta"><a href="/#app-download">{t("Continue in the Astromate app", "Astromate ऐप में जारी रखें")}</a></Button>
    </div>
  );
};

