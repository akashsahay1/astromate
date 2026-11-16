import { useNavigate } from "react-router-dom";
import { usePoojaServices } from "@/hooks/useSupabaseData";
import { poojaImages } from "@/data/poojaImages";
import { useBookingFlow } from "@/components/BookingFlowProvider";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useT, usePick } from "@/hooks/useLang";
import { useState } from "react";

const PoojaCard = ({ pooja }: { pooja: any }) => {
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
      serviceType: "pooja",
      serviceId: pooja.id,
      serviceName: pooja.name,
      amount: pooja.price,
      packageName: "Standard",
    });
  };

  return (
    <div
      onClick={() => navigate(`/pooja/${pooja.id}`)}
      className="bg-[#FFFDF5] rounded-[14px] overflow-hidden border border-[hsl(40,50%,85%)] shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col"
    >
      <div className="relative h-[165px] bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center overflow-hidden">
        <span className="absolute top-2 left-2 bg-black/60 text-white text-[9px] px-2 py-0.5 rounded font-semibold z-10">
          Astromate
        </span>
        {(poojaImages[pooja.slug] || pooja.image_url) ? (
          <img src={poojaImages[pooja.slug] || pooja.image_url} alt={pick(pooja, "name")} className="absolute inset-0 w-full h-full object-cover" />
        ) : (
          <span className="text-5xl relative z-10 drop-shadow-lg">🪔</span>
        )}
        <div className="absolute bottom-0 left-0 right-0 px-3 py-2 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-10">
          <p className="text-white text-[0.82rem] font-bold font-serif leading-tight">{pick(pooja, "name")}</p>
          <span className="text-white/80 text-[0.62rem] block mt-0.5">{pick(pooja, "category")}</span>
        </div>
      </div>

      <div className="p-3.5 flex-1 flex flex-col">
        <p className="text-[0.77rem] text-muted-foreground leading-relaxed line-clamp-2 flex-1">{pick(pooja, "description")}</p>
        <div className="flex items-center gap-2 mt-2 flex-wrap">
          <span className="text-[#FF6B1A] font-bold text-[0.93rem] bg-orange-50 px-2.5 py-0.5 rounded-full border border-orange-200">
            ₹{Number(pooja.price).toLocaleString()}
          </span>
          {pooja.original_price > 0 && pooja.original_price > pooja.price && (
            <>
              <span className="text-[0.7rem] text-muted-foreground line-through">₹{Number(pooja.original_price).toLocaleString()}</span>
              <span className="text-[0.63rem] text-[hsl(355,80%,55%)] font-bold">
                {Math.round(((pooja.original_price - pooja.price) / pooja.original_price) * 100)}% OFF
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

const PoojaServices = () => {
  const { data: poojaServices, loading } = usePoojaServices();
  const t = useT();
  const group1 = poojaServices.slice(0, 8);
  const group2 = poojaServices.slice(8);

  if (loading) {
    return (
      <section id="pooja" className="py-8 lg:py-12 bg-[#FDF6E3]">
        <div className="max-w-[1280px] mx-auto px-6 text-center text-muted-foreground">Loading...</div>
      </section>
    );
  }

  return (
    <section id="pooja" className="py-8 lg:py-12 bg-[#FDF6E3]">
      <div className="max-w-[1280px] mx-auto px-6">
        <h2 className="font-serif text-3xl lg:text-4xl font-bold text-[#1A1A1A] mb-1.5">
          {t("Pooja Services", "पूजा सेवाएं")}
        </h2>
        <p className="text-[0.95rem] text-muted-foreground mb-8">
          {t("Book online poojas at renowned temples, performed in your name and gotra", "अपने नाम और गोत्र के साथ प्रसिद्ध मंदिरों में ऑनलाइन पूजा बुक करें")}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
          {group1.map((pooja) => (
            <PoojaCard key={pooja.id} pooja={pooja} />
          ))}
        </div>

        {group2.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {group2.map((pooja) => (
              <PoojaCard key={pooja.id} pooja={pooja} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default PoojaServices;
