import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useT } from "@/hooks/useLang";

export const COMPANY = "NAAMRE SERVICES (OPC) PRIVATE LIMITED";
export const SUPPORT_EMAIL = "support@astromate.online";
export const SUPPORT_PHONE = "+91 95070 00066";
export const SUPPORT_TEL = "tel:+919507000066";
export const ADDRESS = "Near DAV Nageswar Public School, Tetri, Chandaghasi, Ranchi 834010, Jharkhand, India";

// Shared shell for the policy pages: same look as the existing Terms / Privacy pages.
const LegalPage = ({ title, updated, children }: { title: string; updated: string; children: React.ReactNode }) => {
  const t = useT();
  return (
  <div className="min-h-screen bg-background">
    <Navbar />
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl lg:text-4xl font-bold text-center mb-2 text-primary">{title}</h1>
        <p className="text-center text-sm text-muted-foreground mb-8">{t("Last updated", "अंतिम अपडेट")}: {updated}</p>
        <div className="bg-card rounded-2xl p-6 lg:p-8 shadow-lg border space-y-4 text-muted-foreground leading-relaxed [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-foreground [&_h2]:mt-8 [&_h2]:mb-2 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-2 [&_strong]:text-foreground [&_a]:text-primary [&_a]:underline">
          {children}
        </div>
      </div>
    </div>
    <Footer />
  </div>
  );
};

export default LegalPage;
