import { createContext, useContext, useState, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle2, CreditCard, Smartphone, Building2, Loader2 } from "lucide-react";
import { createPaidBooking, BookingData } from "@/lib/bookings";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useT } from "@/hooks/useLang";

type Step = "pay" | "processing" | "success";

const METHODS = [
  { id: "upi", label: "UPI / QR", icon: Smartphone },
  { id: "card", label: "Credit / Debit Card", icon: CreditCard },
  { id: "netbanking", label: "Net Banking", icon: Building2 },
];

interface Ctx {
  startBooking: (data: BookingData) => void;
}

const BookingFlowContext = createContext<Ctx>({ startBooking: () => {} });
export const useBookingFlow = () => useContext(BookingFlowContext);

export function BookingFlowProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<BookingData | null>(null);
  const [step, setStep] = useState<Step>("pay");
  const [method, setMethod] = useState("upi");
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const t = useT();

  const startBooking = (d: BookingData) => {
    if (!user) { navigate("/auth"); return; }
    setData(d);
    setMethod("upi");
    setStep("pay");
  };

  const base = Math.round(Number(data?.amount || 0));
  const total = base;


  const pay = async () => {
    if (!data) return;
    setStep("processing");
    await new Promise((r) => setTimeout(r, 1200)); // payment gateway simulation
    const res = await createPaidBooking({ ...data, amount: total }, method);
    if (res.error === "login_required") {
      setData(null);
      navigate("/auth");
      return;
    }
    if (!res.success) {
      setStep("pay");
      toast({ title: t("Payment failed", "भुगतान विफल"), description: res.error, variant: "destructive" });
      return;
    }
    setStep("success");
  };

  const close = () => setData(null);


  return (
    <BookingFlowContext.Provider value={{ startBooking }}>
      {children}
      <Dialog open={!!data} onOpenChange={(o) => { if (!o) close(); }}>
        <DialogContent className="max-w-[420px]">
          {step === "success" ? (
            <div className="text-center py-4">
              <CheckCircle2 className="mx-auto h-14 w-14 text-primary mb-3" />
              <DialogHeader>
                <DialogTitle className="text-center text-xl">{t("Booking confirmed! ✅", "बुकिंग सफल! ✅")}</DialogTitle>
              </DialogHeader>
              <p className="text-sm text-muted-foreground mt-2">
                {t(
                  `Your booking for ${data?.serviceName} is confirmed. Payment received: ₹${total.toLocaleString()}`,
                  `${data?.serviceName} की बुकिंग confirm हो गई है। भुगतान प्राप्त हुआ: ₹${total.toLocaleString()}`,
                )}
              </p>

              <div className="mt-5 flex gap-2">
                <Button variant="outline" className="flex-1" onClick={close}>{t("Close", "बंद करें")}</Button>
                <Button className="flex-1" onClick={() => { close(); navigate("/profile?tab=bookings"); }}>
                  {t("View my bookings", "मेरी बुकिंग देखें")}
                </Button>
              </div>
            </div>
          ) : (
            <>
              <DialogHeader>
                <DialogTitle>{t("Make payment", "भुगतान करें")}</DialogTitle>
              </DialogHeader>
              <div className="rounded-xl border border-border bg-secondary/30 p-4">
                <p className="text-sm font-semibold text-foreground">{data?.serviceName}</p>
                <p className="text-xs text-muted-foreground">{data?.packageName}</p>
                <div className="mt-3 space-y-1.5 border-t border-border pt-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{t("Service fee", "सेवा शुल्क")}</span>
                    <span className="font-medium text-foreground">₹{base.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between border-t border-border pt-2">
                    <span className="text-sm font-medium text-muted-foreground">{t("Total amount", "कुल राशि")}</span>
                    <span className="text-lg font-bold text-primary">₹{total.toLocaleString()}</span>
                  </div>
                </div>


              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium">{t("Choose a payment method", "भुगतान का तरीका चुनें")}</p>
                {METHODS.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setMethod(m.id)}
                    disabled={step === "processing"}
                    className={`flex w-full items-center gap-3 rounded-xl border-2 px-4 py-3 text-sm font-medium transition-all ${
                      method === m.id
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border bg-background text-muted-foreground hover:border-primary/40"
                    }`}
                  >
                    <m.icon className="h-4 w-4" />
                    {m.label}
                  </button>
                ))}
              </div>

              <Button onClick={pay} className="w-full h-11 font-semibold" disabled={step === "processing"}>
                {step === "processing" ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> {t("Processing payment...", "भुगतान हो रहा है...")}</>
                ) : (
                  t(`Pay ₹${total.toLocaleString()}`, `₹${total.toLocaleString()} का भुगतान करें`)
                )}
              </Button>
              <p className="text-center text-xs text-muted-foreground">
                {t("Your booking is confirmed only after payment.", "भुगतान के बाद ही आपकी बुकिंग confirm होगी।")}
              </p>
            </>
          )}
        </DialogContent>
      </Dialog>
    </BookingFlowContext.Provider>
  );
}
