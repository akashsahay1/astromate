import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageBanner from "@/components/PageBanner";
import MantraJaapServices from "@/components/MantraJaapServices";
import { useT } from "@/hooks/useLang";
import banner from "@/assets/banners/mantra-banner.jpg";

const VedMantraPage = () => {
  const t = useT();
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <PageBanner
        image={banner}
        title={t("Vedic Mantra Jaap", "वेद मंत्र जाप")}
        subtitle={t("Sacred Vedic rituals • Graha Shanti • Divine blessings", "पवित्र वैदिक अनुष्ठान • ग्रह शांति • दैवीय आशीर्वाद")}
      />
      <MantraJaapServices />
      <Footer />
    </div>
  );
};

export default VedMantraPage;
