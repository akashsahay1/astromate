import { createContext, useContext, useState, ReactNode } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Smartphone } from "lucide-react";
import type { BookingData } from "@/lib/bookings";
import { useT } from "@/hooks/useLang";

// Consultations, Pooja and Mantra Jaap are booked in the Astromate app (per client: web = account + shop only).
// Products are bought on the website through the cart instead (src/lib/cart.ts), not through this dialog.
interface Ctx {
  startBooking: (data: BookingData) => void;
}

const BookingFlowContext = createContext<Ctx>({ startBooking: () => {} });

export function BookingFlowProvider({ children }: { children: ReactNode }) {
  const t = useT();
  const [data, setData] = useState<BookingData | null>(null);

  return (
    <BookingFlowContext.Provider value={{ startBooking: setData }}>
      {children}
      <Dialog open={!!data} onOpenChange={(o) => { if (!o) setData(null); }}>
        <DialogContent className="max-w-[420px] text-center">
          <DialogHeader>
            <Smartphone className="mx-auto h-12 w-12 text-primary" />
            <DialogTitle className="text-center">{t("Continue in the Astromate app", "Astromate ऐप में जारी रखें")}</DialogTitle>
            <DialogDescription className="text-center">
              {data?.serviceName}
              <br />
              {t(
                "Bookings, chat and calls happen in the Astromate app, using the same account and wallet as this website.",
                "बुकिंग, चैट और कॉल Astromate ऐप में होते हैं — इसी वेबसाइट वाले खाते और वॉलेट से।",
              )}
            </DialogDescription>
          </DialogHeader>
          <Button asChild className="w-full">
            <a href="/#app-download" onClick={() => setData(null)}>{t("Download the app", "ऐप डाउनलोड करें")}</a>
          </Button>
        </DialogContent>
      </Dialog>
    </BookingFlowContext.Provider>
  );
}

export const useBookingFlow = () => useContext(BookingFlowContext);
