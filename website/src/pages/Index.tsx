import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import ToolsSection from "@/components/ToolsSection";
import HowItWorks from "@/components/HowItWorks";
import Testimonials from "@/components/Testimonials";

import WhyChooseUs from "@/components/WhyChooseUs";
import Astrologers from "@/components/Astrologers";
import ZodiacSigns from "@/components/ZodiacSigns";
import ConsultationTopics from "@/components/ConsultationTopics";
import Services from "@/components/Services";
import Products from "@/components/Products";
import PoojaServices from "@/components/PoojaServices";
import MantraJaapServices from "@/components/MantraJaapServices";
import Blog from "@/components/Blog";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import WhatIsAstrology from "@/components/WhatIsAstrology";
import AstrologyAppBanner from "@/components/AstrologyAppBanner";
import ManoYaNaMano from "@/components/ManoYaNaMano";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Hero />
      <Astrologers />
      <ToolsSection />
      <ConsultationTopics />
      <ZodiacSigns />
      <Services />
      <PoojaServices />
      <MantraJaapServices />
      <WhyChooseUs />
      <Products />
      <ManoYaNaMano />
      <HowItWorks />

      <Blog />
      <AstrologyAppBanner />
      <WhatIsAstrology />
      <Testimonials />
      <Contact />
      <Footer />
    </div>
  );
};

export default Index;
