import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Phone, MessageCircle, Check, Shield, Award, Star } from "lucide-react";
import { fetchSite } from "@/hooks/useSupabaseData";
import { poojaImages } from "@/data/poojaImages";
import { useBookingFlow } from "@/components/BookingFlowProvider";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useT, usePick } from "@/hooks/useLang";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const PoojaDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const { startBooking } = useBookingFlow();
  const [booking, setBooking] = useState(false);
  const t = useT();
  const pick = usePick();
  const [pooja, setPooja] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPooja = async () => {
      const data = await fetchSite("pooja_services", id).catch(() => null);
      setPooja(data);
      setLoading(false);
    };
    if (id) fetchPooja();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FDF6E3]">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!pooja) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FDF6E3]">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-[#171452] mb-4">{t("Pooja not found", "पूजा नहीं मिली")}</h2>
          <button onClick={() => navigate("/")} className="text-[#171452] underline">{t("Go Back", "वापस जाएं")}</button>
        </div>
      </div>
    );
  }

  const handleBooking = async () => {
    if (!user) { navigate("/auth"); return; }
    startBooking({
      serviceType: "pooja",
      serviceId: pooja.id,
      serviceName: pooja.name,
      amount: pooja.price,
      packageName: "Standard",
    });
  };

  const imgSrc = poojaImages[pooja.slug] || pooja.image_url;

  return (
    <div className="min-h-screen bg-[#FDF6E3]">
      <Navbar />
      
      <div className="max-w-[1200px] mx-auto px-6">
        <button onClick={() => navigate(-1)} className="inline-flex items-center gap-1.5 text-[#171452] text-sm font-semibold py-3 hover:underline">
          <ArrowLeft className="h-4 w-4" /> {t("Go Back", "वापस जाएं")}
        </button>
      </div>

      <div className="max-w-[1200px] mx-auto px-6 pb-12 grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-8">
        {/* LEFT */}
        <div>
          {/* Hero */}
          <div className="relative rounded-2xl overflow-hidden h-[280px] lg:h-[340px] bg-gradient-to-br from-indigo-500 to-purple-600 flex items-end">
            {imgSrc ? (
              <img src={imgSrc} alt={pick(pooja, "name")} className="absolute inset-0 w-full h-full object-cover" />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-7xl opacity-30">🪔</span>
              </div>
            )}
            <div className="absolute top-3.5 left-3.5 z-10">
              <span className="bg-white/15 backdrop-blur-sm border border-white/30 rounded-lg px-3 py-1 text-white text-sm font-bold">
                Astro<span className="text-[#F5D78E]">mate</span>
              </span>
            </div>
            <div className="relative z-10 p-6 lg:p-7 bg-gradient-to-t from-black/85 via-black/30 to-transparent w-full">
              <span className="text-3xl block mb-2">🪔</span>
              <h1 className="font-serif text-2xl lg:text-3xl text-[#FFD700] leading-tight drop-shadow-lg">{pick(pooja, "name")}</h1>
              <p className="text-white/90 text-sm mt-1.5">{pick(pooja, "category")}</p>
            </div>
          </div>

          {/* About */}
          <div className="mt-5 space-y-4">
            <div className="bg-white rounded-[14px] p-5 border border-[hsl(40,50%,90%)] shadow-sm">
              <h3 className="text-[1.05rem] font-bold text-[#171452] mb-3">{t("About This Pooja", "इस पूजा के बारे में")}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{pick(pooja, "description")}</p>
            </div>

            <div className="bg-white rounded-[14px] p-5 border border-[hsl(40,50%,90%)] shadow-sm">
              <h3 className="text-[1.05rem] font-bold text-[#171452] mb-3">{t("Pooja Details", "पूजा विवरण")}</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-[#FFF8E7] rounded-[10px] p-3.5">
                  <p className="text-[0.75rem] text-muted-foreground">{t("Category", "श्रेणी")}</p>
                  <p className="font-bold text-sm text-[#2C1010]">{pick(pooja, "category")}</p>
                </div>
                {pooja.duration && (
                  <div className="bg-[#FFF8E7] rounded-[10px] p-3.5">
                    <p className="text-[0.75rem] text-muted-foreground">{t("Duration", "अवधि")}</p>
                    <p className="font-bold text-sm text-[#2C1010]">{pick(pooja, "duration")}</p>
                  </div>
                )}
                <div className="bg-[#FFF8E7] rounded-[10px] p-3.5">
                  <p className="text-[0.75rem] text-muted-foreground">{t("Rating", "रेटिंग")}</p>
                  <p className="font-bold text-sm text-[#2C1010]">⭐ {pooja.rating}</p>
                </div>
                <div className="bg-[#FFF8E7] rounded-[10px] p-3.5">
                  <p className="text-[0.75rem] text-muted-foreground">{t("Bookings", "बुकिंग")}</p>
                  <p className="font-bold text-sm text-[#2C1010]">{pooja.bookings_count}+ {t("bookings", "बुकिंग")}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-[14px] p-5 border border-[hsl(40,50%,90%)] shadow-sm">
              <h3 className="text-[1.05rem] font-bold text-[#171452] mb-3">{t("What You Will Receive", "आपको क्या मिलेगा")}</h3>
              <div className="space-y-2">
                {[t("Pooja performed by Panditji in your name and gotra", "आपके नाम और गोत्र के साथ पंडितजी द्वारा पूजा"), t("Pooja video on WhatsApp", "WhatsApp पर पूजा वीडियो"), t("Divine Aashirwad (blessings) Box delivered to your home", "दिव्य आशीर्वाद बॉक्स आपके घर"), t("Energised Yantra and Prasad", "ऊर्जावान यंत्र और प्रसाद")].map((item, i) => (
                  <div key={i} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                    <Check className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" /> {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT SIDEBAR */}
        <div className="space-y-4">
          <div className="bg-white rounded-[14px] p-5 border border-[hsl(40,50%,85%)] shadow-md sticky top-5">
            <h3 className="text-lg font-bold text-[#2C1010] mb-3.5">{t("Book Pooja", "पूजा बुक करें")}</h3>

            <div className="bg-[#FFF8E7] rounded-[10px] p-3.5 mb-4">
              <h4 className="text-[0.82rem] font-bold text-[#2C1010] mb-2">{t("Included in all packages:", "सभी पैकेज में शामिल:")}</h4>
              <div className="space-y-1.5">
                {[t("Panditji performs the pooja in your name and gotra", "आपके नाम और गोत्र से पंडितजी पूजा करेंगे"), t("Pooja video sent on WhatsApp", "WhatsApp पर पूजा वीडियो मिलेगा"), t("Divine Aashirwad Box delivered to your home", "दिव्य आशीर्वाद बॉक्स आपके घर")].map((item, i) => (
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
              <span className="float-right font-bold text-lg text-[#2C1010]">₹{Number(pooja.price).toLocaleString()}</span>
              <span className="font-bold text-sm text-[#171452] block clear-both">{pick(pooja, "name")}</span>
              <span className="text-[0.78rem] text-muted-foreground mt-0.5 block">{pick(pooja, "category")}</span>
            </div>

            <button
              disabled={booking}
              onClick={handleBooking}
              className="w-full bg-[#171452] text-white py-3.5 rounded-[10px] text-[0.95rem] font-bold hover:bg-[#1e1a6e] transition-colors mt-2"
            >
              {booking ? t("Booking...", "बुक हो रहा है...") : user ? t("Book Now", "अभी बुक करें") : t("Log in to Book", "लॉगिन करके बुक करें")}
            </button>

          </div>

          <div className="bg-white rounded-[14px] p-4 border border-[hsl(40,50%,85%)] shadow-sm">
            <h4 className="text-[0.95rem] font-bold mb-2.5">{t("Need Help?", "सहायता चाहिए?")}</h4>
            <div className="space-y-2">
              <div className="flex items-center gap-2.5 text-sm text-muted-foreground"><Phone className="h-4 w-4" /> +91 98765 43210</div>
              <div className="flex items-center gap-2.5 text-sm text-muted-foreground"><MessageCircle className="h-4 w-4" /> {t("Chat on WhatsApp", "WhatsApp पर चैट करें")}</div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default PoojaDetail;
