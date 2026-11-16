import { SUPPORT_PHONE, SUPPORT_TEL } from "@/components/LegalPage";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Phone, MessageCircle, Check, Clock, Star, MessageSquare } from "lucide-react";
import { consultationServices, serviceSlug } from "@/data/consultationServices";
import { useBookingFlow } from "@/components/BookingFlowProvider";
import { useAuth } from "@/hooks/useAuth";
import { useLang, useT } from "@/hooks/useLang";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const toAmount = (p: string) => Number(String(p).replace(/[^\d.]/g, "")) || 0;

const ServiceDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { startBooking } = useBookingFlow();
  const t = useT();
  const { lang } = useLang();

  const decoded = slug ? decodeURIComponent(slug) : "";
  const service = consultationServices.find(
    (s) => serviceSlug(s.title) === slug || s.title.replace(/\s+/g, "-") === decoded || s.title === decoded
  );

  if (!service) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FDF6E3]">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-[#171452] mb-4">{t("Service not found", "सेवा नहीं मिली")}</h2>
          <button onClick={() => navigate("/pricing")} className="text-[#171452] underline">{t("Go back", "वापस जाएं")}</button>
        </div>
      </div>
    );
  }

  const handleBooking = () => {
    if (!user) { navigate("/auth"); return; }
    startBooking({
      serviceType: "consultation",
      serviceId: service.title,
      serviceName: t(service.titleEn, service.title),
      amount: toAmount(service.price),
      packageName: t(service.categoryEn, service.category),
    });
  };

  return (
    <div className="min-h-screen bg-[#FDF6E3]">
      <Navbar />

      <div className="max-w-[1200px] mx-auto px-6">
        <button onClick={() => navigate(-1)} className="inline-flex items-center gap-1.5 text-[#171452] text-sm font-semibold py-3 hover:underline">
          <ArrowLeft className="h-4 w-4" /> {t("Go back", "वापस जाएं")}
        </button>
      </div>

      <div className="max-w-[1200px] mx-auto px-6 pb-12 grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-8">
        {/* LEFT */}
        <div>
          <div className="relative rounded-2xl overflow-hidden h-[280px] lg:h-[340px] bg-gradient-to-br from-indigo-500 to-purple-600 flex items-end">
            <img src={service.image} alt={t(service.titleEn, service.title)} className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute top-3.5 left-3.5 z-10">
              <span className="bg-white/15 backdrop-blur-sm border border-white/30 rounded-lg px-3 py-1 text-white text-sm font-bold">
                Astro<span className="text-[#F5D78E]">mate</span>
              </span>
            </div>
            <div className="relative z-10 p-6 lg:p-7 bg-gradient-to-t from-black/85 via-black/30 to-transparent w-full">
              <h1 className="text-2xl lg:text-3xl font-bold text-[#FFD700] leading-tight drop-shadow-lg">{t(service.titleEn, service.title)}</h1>
              <p className="text-white/90 text-sm mt-1.5">{t(service.categoryEn, service.category)}</p>
            </div>
          </div>

          <div className="mt-5 space-y-4">
            <div className="bg-white rounded-[14px] p-5 border border-[hsl(40,50%,90%)] shadow-sm">
              <h3 className="text-[1.05rem] font-bold text-[#171452] mb-3">{t("About this service", "इस सेवा के बारे में")}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{t(service.fullDescriptionEn, service.fullDescription)}</p>
            </div>

            <div className="bg-white rounded-[14px] p-5 border border-[hsl(40,50%,90%)] shadow-sm">
              <h3 className="text-[1.05rem] font-bold text-[#171452] mb-3">{t("Service details", "सेवा विवरण")}</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-[#FFF8E7] rounded-[10px] p-3.5">
                  <p className="text-[0.75rem] text-muted-foreground">{t("Category", "श्रेणी")}</p>
                  <p className="font-bold text-sm text-[#2C1010]">{t(service.categoryEn, service.category)}</p>
                </div>
                <div className="bg-[#FFF8E7] rounded-[10px] p-3.5">
                  <p className="text-[0.75rem] text-muted-foreground">{t("Duration", "अवधि")}</p>
                  <p className="font-bold text-sm text-[#2C1010] flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {t(service.durationEn, service.duration)}</p>
                </div>
                <div className="bg-[#FFF8E7] rounded-[10px] p-3.5">
                  <p className="text-[0.75rem] text-muted-foreground">{t("Rating", "रेटिंग")}</p>
                  <p className="font-bold text-sm text-[#2C1010] flex items-center gap-1"><Star className="h-3.5 w-3.5 fill-rating text-rating" /> {service.rating}</p>
                </div>
                <div className="bg-[#FFF8E7] rounded-[10px] p-3.5">
                  <p className="text-[0.75rem] text-muted-foreground">{t("Consultations", "परामर्श")}</p>
                  <p className="font-bold text-sm text-[#2C1010] flex items-center gap-1"><MessageSquare className="h-3.5 w-3.5" /> {t(service.consultationsEn, service.consultations)}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-[14px] p-5 border border-[hsl(40,50%,90%)] shadow-sm">
              <h3 className="text-[1.05rem] font-bold text-[#171452] mb-3">{t("What you get", "आपको क्या मिलेगा")}</h3>
              <div className="space-y-2">
                {(lang === "en" ? service.featuresEn : service.features).map((item, i) => (
                  <div key={i} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                    <Check className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" /> {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div className="space-y-4">
          <div className="bg-white rounded-[14px] p-5 border border-[hsl(40,50%,85%)] shadow-md sticky top-5">
            <h3 className="text-lg font-bold text-[#2C1010] mb-3.5">{t("Book a consultation", "परामर्श बुक करें")}</h3>

            <div className="bg-[#FFF8E7] rounded-[10px] p-3.5 mb-4">
              <h4 className="text-[0.82rem] font-bold text-[#2C1010] mb-2">{t("Includes:", "इसमें शामिल:")}</h4>
              <div className="space-y-1.5">
                {(lang === "en" ? service.featuresEn : service.features).slice(0, 3).map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-[0.8rem] text-muted-foreground">
                    <Check className="h-3 w-3 text-green-600 flex-shrink-0" /> {item}
                  </div>
                ))}
              </div>
            </div>

            <div className="border-2 border-[#171452] bg-[#FFF5F5] rounded-xl p-4 mb-4">
              <span className="inline-block bg-orange-50 text-[#FF6B1A] text-[0.72rem] font-bold px-2 py-0.5 rounded-[10px] border border-orange-200 mb-1.5">
                Standard Package
              </span>
              <span className="float-right font-bold text-lg text-[#2C1010]">{service.price}</span>
              <span className="font-bold text-sm text-[#171452] block clear-both">{t(service.titleEn, service.title)}</span>
              {service.originalPrice && (
                <span className="text-[0.78rem] text-muted-foreground mt-0.5 block line-through">{service.originalPrice}</span>
              )}
            </div>

            <button
              onClick={handleBooking}
              className="w-full bg-cta text-cta-foreground py-3.5 rounded-[10px] text-[0.95rem] font-bold hover:bg-cta-hover transition-colors mt-2"
            >
              {user ? t("Book now", "अभी बुक करें") : t("Log in to book", "लॉगिन करके बुक करें")}
            </button>
          </div>

          <div className="bg-white rounded-[14px] p-4 border border-[hsl(40,50%,85%)] shadow-sm">
            <h4 className="text-[0.95rem] font-bold mb-2.5">{t("Need help?", "सहायता चाहिए?")}</h4>
            <div className="space-y-2">
              <div className="flex items-center gap-2.5 text-sm text-muted-foreground"><Phone className="h-4 w-4" /> <a href={SUPPORT_TEL} className="hover:text-primary">{SUPPORT_PHONE}</a></div>
              <div className="flex items-center gap-2.5 text-sm text-muted-foreground"><MessageCircle className="h-4 w-4" /> {t("Chat on WhatsApp", "WhatsApp पर चैट करें")}</div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ServiceDetail;
