import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { AstrologerTermsContent } from "@/components/AstrologerTerms";
import { useT } from "@/hooks/useLang";

const AstrologerTerms = () => {
  const t = useT();
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-center mb-8 text-primary">
            {t("Astrologer / Pandit Terms & Conditions", "Astrologer / Pandit नियम व शर्तें")}
          </h1>
          <div className="bg-card rounded-2xl p-6 md:p-8 shadow-lg border">
            <AstrologerTermsContent />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AstrologerTerms;
