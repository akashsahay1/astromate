import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { MessageSquare, Phone, Star, Video } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { api } from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";
import { useT } from "@/hooks/useLang";
import { useToast } from "@/hooks/use-toast";
import { AppCta, ListState, Panel, rupees, statusLabel, when } from "./shared";

type Consultation = {
  id: string; astrologer_name: string; astrologer_image: string; type: "chat" | "call" | "video";
  duration: string; amount: number; created_at: string; status: string; rating?: number;
};

export const Consultations = () => {
  const t = useT();
  // ponytail: first 50 only; add paging (offset param) when needed
  const q = useQuery({
    queryKey: ["account", "consultations"],
    queryFn: async () => (await api("/customers/consultations/history?limit=50")).data.consultations as Consultation[],
  });
  const icon = { chat: MessageSquare, call: Phone, video: Video };
  const typeLabel = { chat: t("Chat", "चैट"), call: t("Call", "कॉल"), video: t("Video call", "वीडियो कॉल") };

  return (
    <div className="space-y-6">
      <Panel title={t("Consultation history", "परामर्श इतिहास")}>
        <ListState isLoading={q.isLoading} error={q.error} empty={!q.data?.length}
          emptyText={t("No consultations yet. Talk to an astrologer in the Astromate app.", "अभी कोई परामर्श नहीं। Astromate ऐप में ज्योतिषी से बात करें।")} />
        <ul className="divide-y">
          {q.data?.map((c) => {
            const Icon = icon[c.type] ?? Phone;
            return (
              <li key={c.id} className="py-3 flex items-center gap-3">
                {c.astrologer_image
                  ? <img src={c.astrologer_image} alt="" className="w-11 h-11 rounded-full object-cover border shrink-0" />
                  : <div className="w-11 h-11 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold shrink-0">{c.astrologer_name[0]}</div>}
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{c.astrologer_name}</p>
                  <p className="text-xs text-muted-foreground">
                    <Icon className="w-3.5 h-3.5 inline -mt-0.5 mr-1" />{typeLabel[c.type] ?? c.type} · {c.duration} · {when(c.created_at)}
                  </p>
                  {c.status === "cancelled" && <Badge variant="secondary" className="mt-1">{statusLabel(t, c.status)}</Badge>}
                </div>
                <div className="text-right shrink-0">
                  <p className="font-semibold">{rupees(c.amount)}</p>
                  {c.rating ? <p className="text-xs text-muted-foreground flex items-center justify-end gap-0.5"><Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />{c.rating}</p> : null}
                </div>
              </li>
            );
          })}
        </ul>
      </Panel>
      <AppCta />
    </div>
  );
};

type Order = {
  _id: string; order_number: string; status: string; payment_status: string; payment_method: string;
  total_amount: number; created_at: string; tracking_number?: string;
  items: { product_id: string; product_name: string; quantity: number; total_price: number; product_image: string | null }[];
};

// Backend refuses cancelling once shipped; out_for_delivery is past that point too.
const canCancel = (o: Order) => !["shipped", "out_for_delivery", "delivered", "cancelled", "refunded", "payment_failed"].includes(o.status);

export const Orders = () => {
  const t = useT();
  const { toast } = useToast();
  const qc = useQueryClient();
  const { refreshUser } = useAuth();
  const [cancelling, setCancelling] = useState<Order | null>(null);
  // ponytail: first 50 only; add paging (page param) when needed
  const q = useQuery({ queryKey: ["account", "orders"], queryFn: async () => (await api("/orders?limit=50")).orders as Order[] });

  const cancel = async (o: Order) => {
    try {
      const r = await api(`/orders/${o._id}`, { method: "PUT", body: { status: "cancelled", reason: "Cancelled by customer from website" } });
      toast({
        title: t("Order cancelled", "ऑर्डर रद्द हो गया"),
        description: r.refunded_to_wallet ? t(`${rupees(r.refunded_to_wallet)} refunded to your wallet`, `${rupees(r.refunded_to_wallet)} आपके वॉलेट में वापस आ गए`)
          : o.payment_status === "paid" ? t("Your refund will be processed to the original payment method.", "आपका रिफ़ंड मूल भुगतान माध्यम में भेजा जाएगा।") : undefined,
      });
      refreshUser();
    } catch (err) {
      toast({ title: t("Could not cancel", "रद्द नहीं हो सका"), description: (err as Error).message, variant: "destructive" });
    }
    qc.invalidateQueries({ queryKey: ["account", "orders"] });
  };

  return (
    <Panel title={t("My orders", "मेरे ऑर्डर")} action={<Button asChild variant="link" size="sm"><Link to="/shop">{t("Visit shop", "शॉप देखें")}</Link></Button>}>
      <ListState isLoading={q.isLoading} error={q.error} empty={!q.data?.length} emptyText={t("You have not placed any orders yet.", "आपने अभी तक कोई ऑर्डर नहीं किया है।")} />
      <div className="space-y-4">
        {q.data?.map((o) => (
          <div key={o._id} className="border rounded-xl p-4">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
              <div>
                <p className="font-semibold">#{o.order_number}</p>
                <p className="text-xs text-muted-foreground">{when(o.created_at)}</p>
              </div>
              <div className="flex gap-2 flex-wrap">
                <Badge variant={o.status === "cancelled" || o.status === "payment_failed" ? "destructive" : o.status === "delivered" ? "default" : "secondary"}>
                  {statusLabel(t, o.status)}
                </Badge>
                {o.payment_status !== "paid" && o.status !== "cancelled" && (
                  <Badge variant="outline">{t("Payment", "भुगतान")}: {statusLabel(t, o.payment_status)}</Badge>
                )}
              </div>
            </div>
            <ul className="space-y-2 mb-3">
              {o.items.map((it) => (
                <li key={it.product_id} className="flex items-center gap-3 text-sm">
                  {it.product_image
                    ? <img src={it.product_image} alt="" className="w-10 h-10 rounded-md object-cover border shrink-0" />
                    : <div className="w-10 h-10 rounded-md bg-muted shrink-0" />}
                  <span className="flex-1 min-w-0 truncate">{it.product_name} × {it.quantity}</span>
                  <span className="whitespace-nowrap">{rupees(it.total_price)}</span>
                </li>
              ))}
            </ul>
            <div className="flex flex-wrap items-center justify-between gap-2 border-t pt-3">
              <p className="text-sm">
                {t("Total", "कुल")}: <span className="font-bold">{rupees(o.total_amount)}</span>
                {o.tracking_number && <span className="text-muted-foreground"> · {t("Tracking", "ट्रैकिंग")}: {o.tracking_number}</span>}
              </p>
              {canCancel(o) && <Button variant="outline" size="sm" onClick={() => setCancelling(o)}>{t("Cancel order", "ऑर्डर रद्द करें")}</Button>}
            </div>
          </div>
        ))}
      </div>

      <AlertDialog open={!!cancelling} onOpenChange={(open) => !open && setCancelling(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("Cancel this order?", "यह ऑर्डर रद्द करें?")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t(`Order #${cancelling?.order_number} will be cancelled. This cannot be undone.`, `ऑर्डर #${cancelling?.order_number} रद्द हो जाएगा। इसे वापस नहीं किया जा सकता।`)}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("Keep order", "ऑर्डर रखें")}</AlertDialogCancel>
            <AlertDialogAction onClick={() => cancelling && cancel(cancelling)}>{t("Yes, cancel", "हाँ, रद्द करें")}</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Panel>
  );
};
