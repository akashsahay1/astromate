import { Clock, MessageSquare, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { consultationServices as services, serviceSlug } from "@/data/consultationServices";
import { Badge } from "@/components/ui/badge";
import { useBookingFlow } from "@/components/BookingFlowProvider";
import { useT } from "@/hooks/useLang";


const toAmount = (p: string) => Number(String(p).replace(/[^\d.]/g, "")) || 0;

const Services = () => {
  const navigate = useNavigate();
  const { startBooking } = useBookingFlow();
  const t = useT();

  const book = (service: typeof services[0]) => {
    startBooking({
      serviceType: "consultation",
      serviceId: service.title,
      serviceName: t(service.titleEn, service.title),
      amount: toAmount(service.price),
      packageName: t(service.categoryEn, service.category),
    });
  };


  return (
    <section id="services" className="py-8 lg:py-12 bg-[#FDF6E3]">
      <div className="max-w-[1280px] mx-auto px-6">
        {/* Header */}
        <h2 className="font-serif text-3xl lg:text-4xl font-bold text-[#1A1A1A] mb-1.5">
          {t("Pricing Plans", "मूल्य योजना")}
        </h2>
        <p className="text-[0.95rem] text-muted-foreground mb-8">
          {t("Choose the service that fits your needs", "अपनी आवश्यकताओं के अनुरूप सेवा चुनें")}
        </p>

        {/* Services Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-5">
          {services.map((service) => (
            <div
              key={service.title}
              onClick={() => navigate(`/pricing/${serviceSlug(service.title)}`)}
              className="bg-[#FFFDF5] rounded-[14px] overflow-hidden border border-[hsl(40,50%,85%)] shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col"
            >
              {/* Image Header */}
              <div className="relative h-[150px] overflow-hidden">
                <span className="absolute top-2 left-2 bg-black/60 text-white text-[9px] px-2 py-0.5 rounded font-semibold z-10">
                  Astromate
                </span>
                <Badge className="absolute top-2 right-2 bg-white/90 text-foreground hover:bg-white z-10 text-[10px]">
                  <Star className="h-3 w-3 fill-rating text-rating mr-0.5" />
                  {service.rating}
                </Badge>
                <img
                  src={service.image}
                  alt={t(service.titleEn, service.title)}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 px-3 py-2 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-10">
                  <p className="text-white text-[0.82rem] font-bold font-serif leading-tight">{t(service.titleEn, service.title)}</p>
                  <span className="text-white/80 text-[0.62rem] block mt-0.5">{t(service.categoryEn, service.category)}</span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-3.5 flex-1 flex flex-col">
                <p className="text-[0.77rem] text-muted-foreground leading-relaxed line-clamp-2 flex-1">{t(service.descriptionEn, service.description)}</p>
                <div className="flex items-center gap-3 text-[0.7rem] text-muted-foreground mt-2">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {t(service.durationEn, service.duration)}
                  </span>
                  <span className="flex items-center gap-1">
                    <MessageSquare className="h-3 w-3" />
                    {t(service.consultationsEn, service.consultations)}
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-2 flex-wrap">
                  <span className="text-[#FF6B1A] font-bold text-[0.93rem] bg-orange-50 px-2.5 py-0.5 rounded-full border border-orange-200">
                    {service.price}
                  </span>
                  {service.originalPrice && (
                    <span className="text-[0.7rem] text-muted-foreground line-through">{service.originalPrice}</span>
                  )}
                </div>
              </div>

              {/* Card Actions */}
              <div className="flex items-center gap-2.5 px-3.5 py-2.5 border-t border-[hsl(40,50%,90%)]">
                <button
                  onClick={(e) => { e.stopPropagation(); book(service); }}
                  className="flex-1 bg-cta text-cta-foreground py-2 rounded-lg text-[0.86rem] font-semibold hover:bg-cta-hover transition-colors"
                >
                  {t("Book now", "अभी बुक करें")}
                </button>
              </div>

            </div>
          ))}
        </div>
      </div>

    </section>
  );
};

export default Services;
