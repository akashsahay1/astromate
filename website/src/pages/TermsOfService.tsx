import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useT } from "@/hooks/useLang";

const TermsOfService = () => {
  const t = useT();
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-8 text-primary">
            {t("Terms of Use", "उपयोग की शर्तें")}
          </h1>
          
          <div className="prose prose-lg max-w-none bg-card rounded-2xl p-8 shadow-lg border">
            <p className="text-muted-foreground mb-6">
              {t(
                "Welcome to Astromate, your personal Astro consultation platform. This Agreement sets out the legally binding terms for your use of the Site, usage and membership. This Agreement may be modified by Us from time to time. The access, membership and rights of admissions are reserved.",
                "Astromate में आपका स्वागत है, जो आपका व्यक्तिगत ज्योतिष परामर्श मंच है। यह अनुबंध साइट के आपके उपयोग, प्रयोग और सदस्यता के लिए कानूनी रूप से बाध्यकारी शर्तें निर्धारित करता है। हमारे द्वारा समय-समय पर इस अनुबंध में संशोधन किया जा सकता है। पहुँच, सदस्यता और प्रवेश के अधिकार सुरक्षित हैं।"
              )}
            </p>
            
            <p className="text-muted-foreground mb-6">
              {t(
                "This Terms of Use is published in accordance with the Rule 3 (1) of the Information Technology (Intermediaries Guidelines and Digital Media Ethics Code) Rules, 2021.",
                "उपयोग की ये शर्तें Information Technology (Intermediaries Guidelines and Digital Media Ethics Code) Rules, 2021 के नियम 3 (1) के अनुसार प्रकाशित की गई हैं।"
              )}
            </p>

            <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">{t("General Description", "सामान्य विवरण")}</h2>
            <p className="text-muted-foreground mb-4">
              {t(
                "The Site/App (\"We/Site/Us\") offers astrological content, reports, data, and consultations through video chat, Call and email (hereinafter referred to as \"Content\") via the Site and Mobile applications, and other electronic mediums. We provide both \"Free Services\" and \"Paid Services\" (collectively referred to as \"Services\"). To access the Site/App and avail the Services, you are required to register as a member on the Site/App.",
                "साइट/ऐप (\"हम/साइट/हमें\") साइट और मोबाइल एप्लिकेशन तथा अन्य इलेक्ट्रॉनिक माध्यमों के ज़रिए ज्योतिषीय सामग्री, रिपोर्ट, डेटा और वीडियो चैट, कॉल व ईमेल के माध्यम से परामर्श (जिन्हें आगे \"सामग्री\" कहा गया है) प्रदान करती है। हम \"निःशुल्क सेवाएं\" और \"सशुल्क सेवाएं\" (जिन्हें सामूहिक रूप से \"सेवाएं\" कहा गया है) दोनों प्रदान करते हैं। साइट/ऐप तक पहुँचने और सेवाओं का लाभ उठाने के लिए आपको साइट/ऐप पर सदस्य के रूप में पंजीकरण करना आवश्यक है।"
              )}
            </p>
            
            <p className="text-muted-foreground mb-4">{t("By registering on the Site/App you agree to:", "साइट/ऐप पर पंजीकरण करके आप सहमत होते हैं कि आप:")}</p>
            <ul className="list-disc list-inside text-muted-foreground mb-6 space-y-2">
              <li>{t(
                "Provide current, complete, and accurate information as prompted by the Site/App. Creating a user profile with Astromate involves providing specific information, including your phone number/email for OTP verification.",
                "साइट/ऐप द्वारा माँगे जाने पर वर्तमान, पूर्ण और सटीक जानकारी प्रदान करेंगे। Astromate पर उपयोगकर्ता प्रोफ़ाइल बनाने के लिए विशिष्ट जानकारी देनी होती है, जिसमें OTP सत्यापन हेतु आपका फ़ोन नंबर/ईमेल शामिल है।"
              )}</li>
              <li>{t(
                "Maintain and update the provided information as required, ensuring that it remains current and accurate.",
                "दी गई जानकारी को आवश्यकतानुसार बनाए रखेंगे और अपडेट करेंगे, ताकि वह वर्तमान और सटीक बनी रहे।"
              )}</li>
            </ul>

            <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">{t("User Consent", "उपयोगकर्ता सहमति")}</h2>
            <p className="text-muted-foreground mb-6">
              {t(
                "By registering, accessing and using the Site/App, you (\"Member,\" \"You,\" \"Your\") confirm that you understand and unconditionally consent to the Terms of Usage. If you do not agree to the Terms, please do not click the \"I AGREE\" button. By using this Site/App, you give your consent to receive communications from us via SMS/WhatsApp/Email/Call.",
                "साइट/ऐप पर पंजीकरण करके, उस तक पहुँचकर और उसका उपयोग करके, आप (\"सदस्य\", \"आप\", \"आपका\") पुष्टि करते हैं कि आप उपयोग की शर्तों को समझते हैं और उन पर बिना शर्त सहमति देते हैं। यदि आप शर्तों से सहमत नहीं हैं, तो कृपया \"I AGREE\" बटन पर क्लिक न करें। इस साइट/ऐप का उपयोग करके, आप हमसे SMS/WhatsApp/ईमेल/कॉल के माध्यम से संदेश प्राप्त करने की सहमति देते हैं।"
              )}
            </p>

            <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">{t("Registration and Eligibility", "पंजीकरण और पात्रता")}</h2>
            <p className="text-muted-foreground mb-6">
              {t(
                "By using this Site/App, you confirm that you are over the age of 18 and legally capable of entering into a binding contract under the Indian Contract Act, 1872. We shall not be held responsible for any misuse of the services by minors by misrepresenting the age.",
                "इस साइट/ऐप का उपयोग करके, आप पुष्टि करते हैं कि आपकी आयु 18 वर्ष से अधिक है और आप Indian Contract Act, 1872 के तहत बाध्यकारी अनुबंध करने में कानूनी रूप से सक्षम हैं। आयु की गलत जानकारी देकर नाबालिगों द्वारा सेवाओं के किसी भी दुरुपयोग के लिए हमें जिम्मेदार नहीं ठहराया जाएगा।"
              )}
            </p>

            <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">{t("Feature \"Call with Astrologer\"", "ज्योतिषी से कॉल")}</h2>
            <p className="text-muted-foreground mb-6">
              {t(
                "The Site/App offers a service that allows you to have a conversation with an astrologer via various modes of communication such as Chat, Voice, & Video calling. By agreeing to these Terms of Usage, you provide your unconditional consent to the Site/App to arrange for these communications on your registered mobile number.",
                "साइट/ऐप एक ऐसी सेवा प्रदान करती है जिससे आप चैट, वॉयस और वीडियो कॉलिंग जैसे विभिन्न संचार माध्यमों से ज्योतिषी से बातचीत कर सकते हैं। उपयोग की इन शर्तों से सहमत होकर, आप साइट/ऐप को अपने पंजीकृत मोबाइल नंबर पर ये संचार व्यवस्थित करने के लिए बिना शर्त सहमति देते हैं।"
              )}
            </p>

            <h3 className="text-xl font-semibold text-foreground mt-6 mb-3">{t("First Free Chat/Call", "पहला मुफ्त चैट/कॉल")}</h3>
            <ul className="list-disc list-inside text-muted-foreground mb-6 space-y-2">
              <li>{t("We offer each unique user a first free chat or call, with a maximum duration of 3 minutes.", "हम प्रत्येक अद्वितीय उपयोगकर्ता को अधिकतम 3 मिनट की अवधि का पहला मुफ्त चैट या कॉल प्रदान करते हैं।")}</li>
              <li>{t("We reserve the right to withdraw this promotion at any time without giving prior notice.", "हम बिना पूर्व सूचना के किसी भी समय इस प्रमोशन को वापस लेने का अधिकार सुरक्षित रखते हैं।")}</li>
            </ul>

            <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">{t("Content/Service", "सामग्री/सेवा")}</h2>
            <ul className="list-disc list-inside text-muted-foreground mb-6 space-y-2">
              <li>{t("Any information provided on or by the Site/App should not be considered as medical, legal, financial or mental health advice.", "साइट/ऐप पर या उसके द्वारा दी गई किसी भी जानकारी को चिकित्सा, कानूनी, वित्तीय या मानसिक स्वास्थ्य सलाह नहीं माना जाना चाहिए।")}</li>
              <li>{t("Site/App does not provide any guarantees regarding the services or advice rendered by third-party service providers.", "साइट/ऐप तृतीय-पक्ष सेवा प्रदाताओं द्वारा दी गई सेवाओं या सलाह के संबंध में कोई गारंटी नहीं देती।")}</li>
              <li>{t("Site/App does not guarantee any specific outcomes or results from the services provided.", "साइट/ऐप प्रदान की गई सेवाओं से किसी विशिष्ट नतीजे या परिणाम की गारंटी नहीं देती।")}</li>
            </ul>

            <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">{t("User Obligation", "उपयोगकर्ता दायित्व")}</h2>
            <p className="text-muted-foreground mb-4">{t("While using the Site/App, the User agrees not to:", "साइट/ऐप का उपयोग करते समय, उपयोगकर्ता सहमत है कि वह:")}</p>
            <ul className="list-disc list-inside text-muted-foreground mb-6 space-y-2">
              <li>{t("Post inappropriate, false, misleading, or harmful content", "अनुचित, झूठी, भ्रामक या हानिकारक सामग्री पोस्ट नहीं करेगा")}</li>
              <li>{t("Share unauthorized content or infringe intellectual property rights", "अनधिकृत सामग्री साझा नहीं करेगा या बौद्धिक संपदा अधिकारों का उल्लंघन नहीं करेगा")}</li>
              <li>{t("Collect personal information of other members for solicitation", "याचना (solicitation) के लिए अन्य सदस्यों की व्यक्तिगत जानकारी एकत्र नहीं करेगा")}</li>
              <li>{t("Send unsolicited communications or spam", "अवांछित संदेश या स्पैम नहीं भेजेगा")}</li>
              <li>{t("Distribute harmful files or viruses", "हानिकारक फ़ाइलें या वायरस नहीं फैलाएगा")}</li>
              <li>{t("Interfere with platform access or attempt unauthorized access", "प्लेटफ़ॉर्म की पहुँच में बाधा नहीं डालेगा या अनधिकृत पहुँच का प्रयास नहीं करेगा")}</li>
            </ul>

            <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">{t("Content Policies", "सामग्री नीतियां")}</h2>
            <p className="text-muted-foreground mb-4">
              {t(
                "We do not allow accounts that contain or promote sexual content, profanity, hate speech, violence, terrorist content, or content related to dangerous products. Accounts that violate these policies are subject to immediate deletion without refunds.",
                "हम ऐसे खातों की अनुमति नहीं देते जिनमें यौन सामग्री, अपशब्द, घृणास्पद भाषण, हिंसा, आतंकवादी सामग्री या खतरनाक उत्पादों से संबंधित सामग्री हो या जो इनका प्रचार करें। इन नीतियों का उल्लंघन करने वाले खाते बिना किसी धनवापसी के तुरंत हटाए जा सकते हैं।"
              )}
            </p>
            <p className="text-muted-foreground mb-6">
              {t(
                "We strictly prohibit users from engaging in or promoting any form of black magic, witchcraft, voodoo, tantrism, or any related occult practices.",
                "हम उपयोगकर्ताओं को किसी भी प्रकार के काला जादू, जादू-टोना, वूडू, तंत्र-विद्या या किसी भी संबंधित गुप्त (occult) प्रथा में शामिल होने या उसका प्रचार करने से सख्ती से प्रतिबंधित करते हैं।"
              )}
            </p>

            <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">{t("Refund Policy", "धनवापसी नीति")}</h2>
            <h3 className="text-xl font-semibold text-foreground mt-6 mb-3">{t("Refunds on Wallet Recharges", "वॉलेट रिचार्ज पर धनवापसी")}</h3>
            <p className="text-muted-foreground mb-4">
              {t(
                "Once a member adds funds to their wallet, those funds can only be refunded if the refund request reaches us within 48 hours of the wallet credit and no portion of the credited amount has been used.",
                "सदस्य द्वारा अपने वॉलेट में राशि जोड़ने के बाद, वह राशि केवल तभी वापस की जा सकती है जब धनवापसी का अनुरोध वॉलेट में राशि जमा होने के 48 घंटों के भीतर हमें प्राप्त हो और जमा की गई राशि का कोई भी हिस्सा उपयोग न किया गया हो।"
              )}
            </p>
            <h3 className="text-xl font-semibold text-foreground mt-6 mb-3">{t("Refunds of Service Charges", "सेवा शुल्क की धनवापसी")}</h3>
            <p className="text-muted-foreground mb-6">
              {t(
                "Refunds will only be considered under specific circumstances such as network issues, consultant communication problems, or inappropriate responses. No refund will be provided for inaccuracies in consultation or if incorrect contact information is provided.",
                "धनवापसी पर केवल विशिष्ट परिस्थितियों में ही विचार किया जाएगा, जैसे नेटवर्क समस्याएं, परामर्शदाता से संवाद में समस्याएं या अनुचित उत्तर। परामर्श में अशुद्धियों के लिए या गलत संपर्क जानकारी दिए जाने पर कोई धनवापसी नहीं की जाएगी।"
              )}
            </p>

            <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">{t("Disclaimer", "अस्वीकरण")}</h2>
            <p className="text-muted-foreground mb-4">
              {t(
                "The Site/App offers services through a verified panel of astrologers. These services are provided on an \"as is\" basis without any warranty. The Site/App is not responsible for the accuracy of consultations, technical difficulties, or any damages arising from the use of services.",
                "साइट/ऐप ज्योतिषियों के सत्यापित पैनल के माध्यम से सेवाएं प्रदान करती है। ये सेवाएं बिना किसी वारंटी के \"जैसी हैं\" आधार पर प्रदान की जाती हैं। साइट/ऐप परामर्श की सटीकता, तकनीकी कठिनाइयों या सेवाओं के उपयोग से उत्पन्न किसी भी क्षति के लिए जिम्मेदार नहीं है।"
              )}
            </p>
            <p className="text-muted-foreground mb-6 bg-destructive/10 p-4 rounded-lg border-l-4 border-destructive">
              <strong>{t("Important:", "महत्वपूर्ण:")}</strong>{" "}
              {t(
                "The Services offered by the Site/App are for entertainment purposes only. The Site/App is not a suicide helpline. If you are contemplating suicide or in immediate danger, please seek help from a licensed professional immediately.",
                "साइट/ऐप द्वारा प्रदान की जाने वाली सेवाएं केवल मनोरंजन के उद्देश्य से हैं। साइट/ऐप आत्महत्या हेल्पलाइन नहीं है। यदि आप आत्महत्या के बारे में सोच रहे हैं या तत्काल खतरे में हैं, तो कृपया तुरंत किसी लाइसेंस प्राप्त पेशेवर से सहायता लें।"
              )}
            </p>

            <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">{t("Dispute Resolution", "विवाद समाधान")}</h2>
            <p className="text-muted-foreground mb-6">
              {t(
                "Any dispute arising in operation of the above firm will be settled within Ranchi jurisdiction (Jharkhand High Court).",
                "उपरोक्त फर्म के संचालन में उत्पन्न होने वाले किसी भी विवाद का निपटारा रांची क्षेत्राधिकार (झारखंड उच्च न्यायालय) के अंतर्गत किया जाएगा।"
              )}
            </p>

            <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">{t("Contact Us", "संपर्क करें")}</h2>
            <p className="text-muted-foreground mb-4">
              {t("For any questions regarding these Terms of Service, please contact us at:", "सेवा की इन शर्तों के संबंध में किसी भी प्रश्न के लिए, कृपया हमसे यहाँ संपर्क करें:")}
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

export default TermsOfService;
