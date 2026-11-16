import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { AlertTriangle } from "lucide-react";
import { useT } from "@/hooks/useLang";

const Disclaimer = () => {
  const t = useT();
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-8 text-primary">
            {t("Disclaimer", "अस्वीकरण")}
          </h1>
          
          <div className="prose prose-lg max-w-none bg-card rounded-2xl p-8 shadow-lg border">
            {/* Important Notice */}
            <div className="bg-destructive/10 border-l-4 border-destructive p-6 rounded-r-lg mb-8">
              <div className="flex items-center gap-3 mb-4">
                <AlertTriangle className="h-8 w-8 text-destructive" />
                <h2 className="text-xl font-bold text-destructive m-0">{t("Important Notice", "महत्वपूर्ण सूचना")}</h2>
              </div>
              <p className="text-muted-foreground m-0">
                {t(
                  "All services provided by Astromate are for entertainment and guidance purposes only. They are not a substitute for medical, legal, financial or mental health advice.",
                  "Astromate द्वारा प्रदान की जाने वाली सभी सेवाएं केवल मनोरंजन और मार्गदर्शन के उद्देश्य से हैं। यह चिकित्सा, कानूनी, वित्तीय या मानसिक स्वास्थ्य सलाह का विकल्प नहीं है।"
                )}
              </p>
            </div>

            <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">{t("Nature of Services", "सेवाओं की प्रकृति")}</h2>
            <p className="text-muted-foreground mb-6">
              {t(
                "Astromate is an astrological consultation platform that provides Vedic astrology, numerology, tarot, vastu and other related services. All our services:",
                "Astromate एक ज्योतिषीय परामर्श मंच है जो वैदिक ज्योतिष, अंक ज्योतिष, टैरो, वास्तु और अन्य संबंधित सेवाएं प्रदान करता है। हमारी सभी सेवाएं:"
              )}
            </p>
            <ul className="list-disc list-inside text-muted-foreground mb-6 space-y-2">
              <li>{t("Are for guidance and entertainment only", "केवल मार्गदर्शन और मनोरंजन के लिए हैं")}</li>
              <li>{t("Are provided on an \"as-is\" basis", "\"जैसा है\" (as-is) आधार पर प्रदान की जाती हैं")}</li>
              <li>{t("Do not guarantee any results", "किसी भी परिणाम की गारंटी नहीं देती हैं")}</li>
              <li>{t("Are not a substitute for professional advice", "पेशेवर सलाह का विकल्प नहीं हैं")}</li>
            </ul>

            <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">{t("No Guarantees", "कोई गारंटी नहीं")}</h2>
            <p className="text-muted-foreground mb-6">
              {t(
                "Astromate and its astrologers do not guarantee any specific outcome or the accuracy of any prediction. Astrology is an ancient discipline and its interpretation may be subjective. Seek appropriate professional advice for any important decision.",
                "Astromate और इसके ज्योतिषी किसी भी विशिष्ट परिणाम या भविष्यवाणी की सटीकता की गारंटी नहीं देते हैं। ज्योतिष एक प्राचीन विद्या है और इसकी व्याख्या व्यक्तिगत हो सकती है। किसी भी महत्वपूर्ण निर्णय के लिए उचित पेशेवर सलाह लें।"
              )}
            </p>

            <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">{t("Health Disclaimer", "स्वास्थ्य संबंधी अस्वीकरण")}</h2>
            <p className="text-muted-foreground mb-6">
              {t(
                "Our services are not a substitute for any kind of medical treatment or mental health care. If you are facing any health problem, please consult a qualified doctor.",
                "हमारी सेवाएं किसी भी प्रकार के चिकित्सा उपचार या मानसिक स्वास्थ्य देखभाल का विकल्प नहीं हैं। यदि आप किसी स्वास्थ्य समस्या का सामना कर रहे हैं, तो कृपया योग्य चिकित्सक से परामर्श लें।"
              )}
            </p>

            <div className="bg-primary/10 border-l-4 border-primary p-6 rounded-r-lg mb-8">
              <p className="text-foreground font-semibold m-0">
                {t(
                  "⚠️ If you are struggling with thoughts of suicide or are in immediate danger, please contact a licensed professional or emergency services immediately. Astromate is not a suicide helpline.",
                  "⚠️ यदि आप आत्महत्या के विचारों से जूझ रहे हैं या तत्काल खतरे में हैं, तो कृपया तुरंत किसी लाइसेंस प्राप्त पेशेवर या आपातकालीन सेवाओं से संपर्क करें। Astromate आत्महत्या हेल्पलाइन नहीं है।"
                )}
              </p>
            </div>

            <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">{t("Financial Disclaimer", "वित्तीय अस्वीकरण")}</h2>
            <p className="text-muted-foreground mb-6">
              {t(
                "Responsibility for any financial decision made on the basis of an astrological consultation rests entirely with the user. Consult a certified financial advisor for investment or business decisions.",
                "ज्योतिषीय परामर्श के आधार पर किए गए किसी भी वित्तीय निर्णय की जिम्मेदारी पूर्णतः उपयोगकर्ता की है। निवेश या व्यावसायिक निर्णयों के लिए प्रमाणित वित्तीय सलाहकार से परामर्श लें।"
              )}
            </p>

            <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">{t("Third-Party Astrologers", "तृतीय-पक्ष ज्योतिषी")}</h2>
            <p className="text-muted-foreground mb-6">
              {t(
                "Astromate is a platform that connects astrologers and users. Each astrologer is personally responsible for their own advice and services. Astromate does not take responsibility for the accuracy or suitability of advice given by astrologers.",
                "Astromate एक मंच है जो ज्योतिषियों और उपयोगकर्ताओं को जोड़ता है। प्रत्येक ज्योतिषी अपनी सलाह और सेवाओं के लिए स्वयं जिम्मेदार है। Astromate ज्योतिषियों द्वारा दी गई सलाह की सटीकता या उपयुक्तता की जिम्मेदारी नहीं लेता।"
              )}
            </p>

            <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">{t("Remedies and Gemstones", "उपाय और रत्न")}</h2>
            <p className="text-muted-foreground mb-6">
              {t(
                "The purchase and use of astrological remedies, yantras, gemstones or other items is entirely at the user's discretion. We do not guarantee the effectiveness of any remedy. Consult an expert before wearing any gemstone.",
                "ज्योतिषीय उपाय, यंत्र, रत्न या अन्य सामग्री की खरीद और उपयोग पूर्णतः उपयोगकर्ता के विवेक पर है। हम किसी भी उपाय की प्रभावशीलता की गारंटी नहीं देते। कोई भी रत्न धारण करने से पहले विशेषज्ञ से परामर्श लें।"
              )}
            </p>

            <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">{t("Black Magic and Occult", "काला जादू और तंत्र")}</h2>
            <p className="text-muted-foreground mb-6">
              {t(
                "Astromate does not support or promote black magic, tantra-mantra, voodoo or any other harmful practices of any kind. Any account found to be involved in such activity will be suspended immediately.",
                "Astromate किसी भी प्रकार के काला जादू, तंत्र-मंत्र, वूडू या अन्य हानिकारक प्रथाओं का समर्थन या प्रचार नहीं करता। ऐसी किसी भी गतिविधि में शामिल पाए जाने पर खाता तुरंत निलंबित कर दिया जाएगा।"
              )}
            </p>

            <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">{t("Limitation of Liability", "देयता की सीमा")}</h2>
            <p className="text-muted-foreground mb-6">
              {t(
                "Under no circumstances shall Astromate, its owners, employees or astrologers be liable for any direct, indirect, incidental, special or consequential damages arising from the use of our services.",
                "किसी भी परिस्थिति में Astromate, इसके मालिक, कर्मचारी या ज्योतिषी किसी भी प्रत्यक्ष, अप्रत्यक्ष, आकस्मिक, विशेष या परिणामी क्षति के लिए उत्तरदायी नहीं होंगे जो हमारी सेवाओं के उपयोग से उत्पन्न हो।"
              )}
            </p>

            <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">{t("Acceptance", "स्वीकृति")}</h2>
            <p className="text-muted-foreground mb-6">
              {t(
                "By using our services, you confirm that you have read and understood this disclaimer and agree to it. If you do not agree with these terms, please do not use our services.",
                "हमारी सेवाओं का उपयोग करके, आप इस अस्वीकरण को पढ़ने और समझने की पुष्टि करते हैं और इससे सहमत होते हैं। यदि आप इन शर्तों से सहमत नहीं हैं, तो कृपया हमारी सेवाओं का उपयोग न करें।"
              )}
            </p>

            <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">{t("Contact Us", "संपर्क करें")}</h2>
            <p className="text-muted-foreground mb-4">
              {t("For any questions or concerns, please contact us:", "किसी भी प्रश्न या चिंता के लिए, कृपया हमसे संपर्क करें:")}
            </p>
            <ul className="list-none text-muted-foreground mb-6 space-y-2">
              <li><strong>{t("Email:", "ईमेल:")}</strong> support@astromate.online</li>
              <li><strong>{t("Address:", "पता:")}</strong> Near- DAV Nageswar Public School, Tetri, Chandaghasi, Ranchi-834010, Jharkhand</li>
            </ul>

            <p className="text-sm text-muted-foreground mt-8 border-t pt-4">
              {t("Last Updated: January 2026", "अंतिम अपडेट: जनवरी 2026")}
            </p>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Disclaimer;
