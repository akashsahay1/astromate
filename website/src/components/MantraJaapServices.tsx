import { useNavigate } from "react-router-dom";
import { useMantraServices } from "@/hooks/useSupabaseData";
import { mantraJaapImages } from "@/data/mantraJaapImages";
import { useBookingFlow } from "@/components/BookingFlowProvider";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useT, usePick } from "@/hooks/useLang";
import { useState } from "react";

const MantraJaapCard = ({ jaap }: { jaap: any }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const { startBooking } = useBookingFlow();
  const [booking, setBooking] = useState(false);
  const t = useT();
  const pick = usePick();

  const handleBook = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) { navigate("/auth"); return; }
    startBooking({
      serviceType: "mantra_jaap",
      serviceId: jaap.id,
      serviceName: jaap.name,
      amount: jaap.price,
      packageName: "Standard",
    });
  };

  return (
    <div
      onClick={() => navigate(`/mantra-jaap/${jaap.id}`)}
      className="bg-[#FFFDF5] rounded-[14px] overflow-hidden border border-[hsl(40,50%,85%)] shadow-md hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 cursor-pointer flex flex-col"
    >
      <div className="relative h-[165px] bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center overflow-hidden">
        <span className="absolute top-2 left-2 bg-black/60 text-white text-[9px] px-2 py-0.5 rounded font-semibold z-10">
          Astromate
        </span>
        <span className="absolute top-2 right-2 bg-white/90 rounded-full px-2 py-0.5 text-[0.65rem] font-semibold flex items-center gap-0.5 z-10">
          ⭐ {jaap.rating}
        </span>
        {(mantraJaapImages[jaap.slug] || jaap.image_url) ? (
          <img src={mantraJaapImages[jaap.slug] || jaap.image_url} alt={pick(jaap, "name")} className="absolute inset-0 w-full h-full object-cover" />
        ) : (
          <span className="text-5xl relative z-10 drop-shadow-lg">🕉️</span>
        )}
        <div className="absolute bottom-0 left-0 right-0 px-3 py-2 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-10">
          <p className="text-white text-[0.82rem] font-bold font-serif leading-tight">{pick(jaap, "name")}</p>
          <span className="text-white/80 text-[0.62rem] block mt-0.5">{pick(jaap, "subtitle") || pick(jaap, "deity")}</span>
        </div>
      </div>

      <div className="p-3.5 flex-1 flex flex-col">
        <p className="text-[0.77rem] text-muted-foreground leading-relaxed line-clamp-2 flex-1">
          {pick(jaap, "description")}
        </p>
        <div className="flex items-center gap-2 mt-2 flex-wrap">
          <span className="text-[#FF6B1A] font-bold text-[0.93rem] bg-orange-50 px-2.5 py-0.5 rounded-full border border-orange-200">
            ₹{Number(jaap.price).toLocaleString()}
          </span>
          {jaap.original_price > 0 && jaap.original_price > jaap.price && (
            <>
              <span className="text-[0.7rem] text-muted-foreground line-through">₹{Number(jaap.original_price).toLocaleString()}</span>
              <span className="text-[0.63rem] text-[hsl(355,80%,55%)] font-bold">
                {Math.round(((jaap.original_price - jaap.price) / jaap.original_price) * 100)}% OFF
              </span>
            </>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2.5 px-3.5 py-2.5 border-t border-[hsl(40,50%,90%)]">
        <button
          onClick={handleBook}
          disabled={booking}
          className="flex-1 bg-cta text-cta-foreground py-2 rounded-lg text-[0.86rem] font-semibold hover:bg-cta-hover transition-colors disabled:opacity-60"
        >
          {booking ? t("Booking...", "बुक हो रहा है...") : t("Book Now", "अभी बुक करें")}
        </button>
      </div>
    </div>
  );
};

const MantraJaapServices = () => {
  const { data: mantraServices, loading } = useMantraServices();
  const t = useT();

  if (loading) {
    return (
      <section id="mantra-jaap" className="py-8 lg:py-12 bg-[#FDF6E3]">
        <div className="max-w-[1280px] mx-auto px-6 text-center text-muted-foreground">Loading...</div>
      </section>
    );
  }

  return (
    <section id="mantra-jaap" className="py-8 lg:py-12 bg-[#FDF6E3]">
      <div className="max-w-[1280px] mx-auto px-6">
        <h2 className="font-serif text-3xl lg:text-4xl font-bold text-[#171452] mb-1.5">
          {t("Vedic Mantra Jaap", "वेद मंत्र जाप")}
        </h2>
        <p className="text-[0.95rem] text-muted-foreground mb-8">
          {t("Sacred Vedic rituals • Graha Shanti (planetary peace) • Divine blessings", "पवित्र वैदिक अनुष्ठान • ग्रह शांति • दैवीय आशीर्वाद")}
        </p>

        <div className="flex items-center gap-2 mb-4">
          <span className="text-base font-bold text-[#1a1a2e]">🪐 {t("Navagraha Mantra Jaap", "नवग्रह मंत्र जाप")}</span>
          <span className="flex-1 h-0.5 bg-gradient-to-r from-purple-200 to-transparent" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
          {mantraServices.map((jaap) => (
            <MantraJaapCard key={jaap.id} jaap={jaap} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default MantraJaapServices;
