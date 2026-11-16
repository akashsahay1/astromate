import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AstrologyAppBanner from "@/components/AstrologyAppBanner";
import { useT } from "@/hooks/useLang";

// ponytail: website login/signup/profile land here until the site is connected to the Astromate API; the app has all of it.
const GetApp = () => {
  const t = useT();
  return (
  <div className="min-h-screen bg-background">
    <Navbar />
    <section className="container mx-auto px-4 pt-10 text-center">
      <h1 className="text-2xl font-bold lg:text-3xl">{t("Login, consultations and bookings are on the", "लॉगिन, परामर्श और बुकिंग")} <span className="text-primary">{t("Astromate app", "Astromate ऐप")}</span>{t("", " पर")}</h1>
      <p className="mt-2 text-muted-foreground">{t('Want to join as an astrologer? Download the app and choose "Join as Astrologer".', 'ज्योतिषी के रूप में जुड़ना चाहते हैं? ऐप डाउनलोड करें और "ज्योतिषी के रूप में जुड़ें" चुनें।')}</p>
    </section>
    <AstrologyAppBanner />
    <Footer />
  </div>
  );
};

export default GetApp;
