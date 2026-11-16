import { SUPPORT_PHONE, SUPPORT_TEL } from "@/components/LegalPage";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Phone, MessageCircle, Check, Shield, Star } from "lucide-react";
import { fetchSite } from "@/hooks/useSupabaseData";
import { mantraJaapImages } from "@/data/mantraJaapImages";
import { useBookingFlow } from "@/components/BookingFlowProvider";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useT, usePick } from "@/hooks/useLang";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const MantraJaapDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const { startBooking } = useBookingFlow();
  const [booking, setBooking] = useState(false);
  const t = useT();
  const pick = usePick();
  const [jaap, setJaap] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJaap = async () => {
      const data = await fetchSite("mantra_services", id).catch(() => null);
      setJaap(data);
      setLoading(false);
    };
    if (id) fetchJaap();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f5f0e8]">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!jaap) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f5f0e8]">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-[#1A1A1A] mb-4">{t("Mantra Jaap not found", "मंत्र जाप नहीं मिला")}</h2>
          <button onClick={() => navigate("/")} className="text-[#1A1A1A] underline">{t("Go Back", "वापस जाएं")}</button>
        </div>
      </div>
    );
  }

  const handleBooking = async () => {
    if (!user) { navigate("/auth"); return; }
    startBooking({
      serviceType: "mantra_jaap",
      serviceId: jaap.id,
      serviceName: jaap.name,
      amount: jaap.price,
      packageName: "Standard",
    });
  };

  const imgSrc = mantraJaapImages[jaap.slug] || jaap.image_url;

  return (
    <div className="min-h-screen bg-[#f5f0e8]">
      <Navbar />

      <div className="max-w-[1060px] mx-auto px-4">
        <button onClick={() => navigate(-1)} className="inline-flex items-center gap-1.5 text-[#1A1A1A] text-sm font-semibold py-3 hover:underline">
          <ArrowLeft className="h-4 w-4" /> {t("Go Back", "वापस जाएं")}
        </button>
      </div>

      <div className="max-w-[1060px] mx-auto px-4 pb-12 grid grid-cols-1 lg:grid-cols-[1fr_330px] gap-5 items-start">
        {/* LEFT */}
        <div>
          <div className="relative rounded-2xl overflow-hidden min-h-[240px] bg-gradient-to-br from-red-500 to-red-600 flex items-end mb-4">
            {imgSrc ? (
              <img src={imgSrc} alt={pick(jaap, "name")} className="absolute inset-0 w-full h-full object-cover" />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-7xl opacity-30">🕉️</span>
              </div>
            )}
            <div className="absolute top-4 left-4 z-10">
              <span className="bg-white/15 backdrop-blur-sm border border-white/30 rounded-lg px-3 py-1 text-white text-sm font-bold">
                Astro<span className="text-[#F5D78E]">mate</span>
              </span>
            </div>
            <div className="relative z-10 p-6 bg-gradient-to-t from-black/85 via-black/30 to-transparent w-full">
              <h1 className="text-[1.7rem] font-extrabold text-white leading-tight drop-shadow-lg">{pick(jaap, "name")}</h1>
              <p className="text-white/90 text-[0.8rem] mt-1">{pick(jaap, "subtitle") || pick(jaap, "deity")}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-white rounded-[14px] p-5 shadow-sm">
              <h3 className="text-[0.97rem] font-bold text-[#1A1A1A] mb-3">{t("About This Mantra Jaap", "इस मंत्र जाप के बारे में")}</h3>
              <p className="text-[0.82rem] text-muted-foreground leading-relaxed">{pick(jaap, "description")}</p>
            </div>

            <div className="bg-white rounded-[14px] p-5 shadow-sm">
              <h3 className="text-[0.97rem] font-bold text-[#1A1A1A] mb-3">{t("Mantra Jaap Details", "मंत्र जाप विवरण")}</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-[#fffbf0] border border-amber-200 rounded-[10px] p-3.5">
                  <p className="text-[0.75rem] text-muted-foreground">{t("Deity", "देवता")}</p>
                  <p className="font-bold text-sm text-[#2C1010]">{pick(jaap, "deity")}</p>
                </div>
                <div className="bg-[#fffbf0] border border-amber-200 rounded-[10px] p-3.5">
                  <p className="text-[0.75rem] text-muted-foreground">{t("Number of Chants", "जाप संख्या")}</p>
                  <p className="font-bold text-sm text-[#2C1010]">{pick(jaap, "chants")}</p>
                </div>
                <div className="bg-[#fffbf0] border border-amber-200 rounded-[10px] p-3.5">
                  <p className="text-[0.75rem] text-muted-foreground">{t("Rating", "रेटिंग")}</p>
                  <p className="font-bold text-sm text-[#2C1010]">⭐ {jaap.rating}</p>
                </div>
                <div className="bg-[#fffbf0] border border-amber-200 rounded-[10px] p-3.5">
                  <p className="text-[0.75rem] text-muted-foreground">{t("Bookings", "बुकिंग")}</p>
                  <p className="font-bold text-sm text-[#2C1010]">{jaap.bookings_count}+ {t("bookings", "बुकिंग")}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-[14px] p-5 shadow-sm">
              <h3 className="text-[0.97rem] font-bold text-[#1A1A1A] mb-3">{t("What You Will Receive", "आपको क्या मिलेगा")}</h3>
              <div className="space-y-2">
                {[t("Jaap performed by Panditji in your name and gotra", "आपके नाम और गोत्र के साथ पंडितजी द्वारा जाप"), t("Jaap video on WhatsApp", "WhatsApp पर जाप वीडियो"), t("Divine Aashirwad (blessings) Box delivered to your home", "दिव्य आशीर्वाद बॉक्स आपके घर"), t("Energised Yantra and Prasad", "ऊर्जावान यंत्र और प्रसाद")].map((item, i) => (
                  <div key={i} className="flex items-start gap-2.5 text-[0.82rem] text-muted-foreground">
                    <Check className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" /> {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT SIDEBAR */}
        <div className="lg:sticky lg:top-4 space-y-4">
          <div className="bg-white rounded-2xl p-5 shadow-lg">
            <h3 className="text-[0.97rem] font-bold text-[#1A1A1A] mb-3.5">{t("Book Mantra Jaap", "मंत्र जाप बुक करें")}</h3>

            <div className="bg-[#fffbf0] border border-amber-200 rounded-[10px] p-3 mb-4">
              <h4 className="text-[0.72rem] font-bold text-amber-800 mb-1.5">{t("Included in all packages:", "सभी पैकेज में शामिल:")}</h4>
              <div className="space-y-1">
                {[t("Jaap in your name and gotra", "आपके नाम और गोत्र से जाप"), t("Jaap video on WhatsApp", "WhatsApp पर जाप वीडियो"), t("Divine Aashirwad Box", "दिव्य आशीर्वाद बॉक्स")].map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-[0.73rem] text-muted-foreground">
                    <Check className="h-3 w-3 text-green-600 flex-shrink-0" /> {item}
                  </div>
                ))}
              </div>
            </div>

            <div className="border-2 border-[#1A1A1A] bg-[#FFF6E0] rounded-xl p-4 mb-4">
              <span className="inline-block bg-orange-50 text-[#FF6B1A] text-[0.72rem] font-bold px-2 py-0.5 rounded-[10px] border border-orange-200 mb-1.5">
                Standard Package
              </span>
              <span className="float-right font-bold text-lg text-[#2C1010]">₹{Number(jaap.price).toLocaleString()}</span>
              <span className="font-bold text-sm text-[#1A1A1A] block clear-both">{pick(jaap, "name")}</span>
              <span className="text-[0.78rem] text-muted-foreground mt-0.5 block">{pick(jaap, "deity")} • {pick(jaap, "chants")} {t("chants", "जाप")}</span>
            </div>

            <button
              disabled={booking}
              onClick={handleBooking}
              className="w-full bg-[#1A1A1A] text-white py-3.5 rounded-[10px] text-[0.88rem] font-bold hover:bg-[#A30005] transition-colors"
            >
              {booking ? t("Booking...", "बुक हो रहा है...") : user ? t("Book Now", "अभी बुक करें") : t("Log in to Book", "लॉगिन करके बुक करें")}
            </button>

          </div>

          <div className="bg-white rounded-[14px] p-4 shadow-sm">
            <h4 className="text-[0.95rem] font-bold mb-2.5">{t("Need Help?", "सहायता चाहिए?")}</h4>
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

export default MantraJaapDetail;
