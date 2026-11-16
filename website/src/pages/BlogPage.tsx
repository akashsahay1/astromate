import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageBanner from "@/components/PageBanner";
import Blog from "@/components/Blog";
import { useT } from "@/hooks/useLang";
import banner from "@/assets/banners/blog-banner.jpg";

const BlogPage = () => {
  const t = useT();
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <PageBanner
        image={banner}
        title={t("Blog & Articles", "ब्लॉग एवं लेख")}
        subtitle={t("Articles on astrology, Vastu and spirituality by our expert astrologers", "ज्योतिष, वास्तु और आध्यात्मिकता पर हमारे विशेषज्ञ ज्योतिषियों द्वारा लिखे गए लेख")}
      />
      <Blog />
      <Footer />
    </div>
  );
};

export default BlogPage;
