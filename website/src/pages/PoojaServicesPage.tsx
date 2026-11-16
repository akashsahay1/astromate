import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageBanner from "@/components/PageBanner";
import PoojaServices from "@/components/PoojaServices";
import { useT } from "@/hooks/useLang";
import banner from "@/assets/banners/pooja-banner.jpg";

const PoojaServicesPage = () => {
  const t = useT();
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <PageBanner
        image={banner}
        title={t("Pooja Services", "पूजा सेवाएं")}
        subtitle={t("Book online poojas at renowned temples in your name and gotra", "अपने नाम और गोत्र के साथ प्रसिद्ध मंदिरों में ऑनलाइन पूजा बुक करें")}
      />
      <PoojaServices />
      <Footer />
    </div>
  );
};

export default PoojaServicesPage;
