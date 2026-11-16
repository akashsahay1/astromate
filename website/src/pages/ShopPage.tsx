import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageBanner from "@/components/PageBanner";
import Products from "@/components/Products";
import { useT } from "@/hooks/useLang";
import banner from "@/assets/banners/shop-banner.jpg";

const ShopPage = () => {
  const t = useT();
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <PageBanner
        image={banner}
        title={t("Shop", "शॉप")}
        subtitle={t("Rudraksha, gemstones, yantras and pooja essentials — certified and energised", "रुद्राक्ष, रत्न, यंत्र और पूजा सामग्री — प्रमाणित एवं अभिमंत्रित")}
      />
      <Products />
      <Footer />
    </div>
  );
};

export default ShopPage;
