import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageBanner from "@/components/PageBanner";
import Services from "@/components/Services";
import { useT } from "@/hooks/useLang";
import banner from "@/assets/banners/pricing-banner.jpg";

const PricingPage = () => {
  const t = useT();
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <PageBanner
        image={banner}
        title={t("Pricing Plans", "मूल्य योजना")}
        subtitle={t("Choose the consultation that fits your needs", "अपनी आवश्यकताओं के अनुरूप परामर्श सेवा चुनें")}
      />
      <Services />
      <Footer />
    </div>
  );
};

export default PricingPage;
