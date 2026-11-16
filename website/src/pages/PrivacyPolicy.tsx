import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useT } from "@/hooks/useLang";

const PrivacyPolicy = () => {
  const t = useT();
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-8 text-primary">
            {t("Privacy Policy", "गोपनीयता नीति")}
          </h1>
          
          <div className="prose prose-lg max-w-none bg-card rounded-2xl p-8 shadow-lg border">
            <p className="text-muted-foreground mb-6">
              {t(
                "Astromate (\"we\", \"our\", \"Astromate\"), operated by Naamre Services (OPC) Pvt. Ltd., is committed to safeguarding the privacy of its users, including both astrologers and clients, whether registered or not. This Privacy Policy outlines how we collect, use, store, and disclose your information in compliance with applicable data protection laws.",
                "Astromate (\"हम\", \"हमारा\", \"Astromate\"), जिसका संचालन Naamre Services (OPC) Pvt. Ltd. द्वारा किया जाता है, अपने उपयोगकर्ताओं की गोपनीयता की सुरक्षा के लिए प्रतिबद्ध है, जिनमें ज्योतिषी और ग्राहक दोनों शामिल हैं, चाहे वे पंजीकृत हों या नहीं। यह गोपनीयता नीति बताती है कि हम लागू डेटा संरक्षण कानूनों के अनुपालन में आपकी जानकारी कैसे एकत्र, उपयोग, संग्रहीत और प्रकट करते हैं।"
              )}
            </p>

            <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">{t("User Consent", "उपयोगकर्ता सहमति")}</h2>
            <p className="text-muted-foreground mb-6">
              {t(
                "By accessing or using the Astromate platform, you consent to this Privacy Policy. Continued use of the platform indicates your unconditional consent to our practices regarding your personal data. By using this website, you also consent to receive communications from us via WhatsApp and other communication channels.",
                "Astromate प्लेटफ़ॉर्म तक पहुँचकर या उसका उपयोग करके, आप इस गोपनीयता नीति के लिए सहमति देते हैं। प्लेटफ़ॉर्म का निरंतर उपयोग आपके व्यक्तिगत डेटा से संबंधित हमारी प्रथाओं के प्रति आपकी बिना शर्त सहमति दर्शाता है। इस वेबसाइट का उपयोग करके, आप WhatsApp और अन्य संचार माध्यमों से हमसे संदेश प्राप्त करने की भी सहमति देते हैं।"
              )}
            </p>

            <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">{t("Information We Collect", "हम क्या जानकारी एकत्र करते हैं")}</h2>
            <ul className="list-disc list-inside text-muted-foreground mb-6 space-y-3">
              <li><strong>{t("Personal Data:", "व्यक्तिगत डेटा:")}</strong> {t("We collect personal information that you provide when creating an account, including your name, contact number, email, date of birth, gender, and any other details you voluntarily provide.", "खाता बनाते समय आप जो व्यक्तिगत जानकारी देते हैं, हम उसे एकत्र करते हैं, जिसमें आपका नाम, संपर्क नंबर, ईमेल, जन्म तिथि, लिंग और स्वेच्छा से दिया गया कोई भी अन्य विवरण शामिल है।")}</li>
              <li><strong>{t("Payment Information:", "भुगतान जानकारी:")}</strong> {t("To process transactions, we collect payment details through secure third-party payment gateways.", "लेन-देन संसाधित करने के लिए, हम सुरक्षित तृतीय-पक्ष पेमेंट गेटवे के माध्यम से भुगतान विवरण एकत्र करते हैं।")}</li>
              <li><strong>{t("Device Data:", "डिवाइस डेटा:")}</strong> {t("We automatically gather technical data, such as IP addresses, browser type, device identifiers, and cookies, to enhance your experience and provide a personalized experience.", "आपके अनुभव को बेहतर बनाने और व्यक्तिगत अनुभव प्रदान करने के लिए, हम स्वचालित रूप से तकनीकी डेटा एकत्र करते हैं, जैसे IP पते, ब्राउज़र का प्रकार, डिवाइस पहचानकर्ता और कुकीज़।")}</li>
              <li><strong>{t("Usage Data:", "उपयोग डेटा:")}</strong> {t("We may collect data regarding your interactions with our platform, including your preferences, to optimize our services and offerings.", "अपनी सेवाओं और पेशकशों को बेहतर बनाने के लिए, हम हमारे प्लेटफ़ॉर्म के साथ आपकी गतिविधियों से संबंधित डेटा एकत्र कर सकते हैं, जिसमें आपकी प्राथमिकताएं शामिल हैं।")}</li>
              <li><strong>{t("Chat History:", "चैट इतिहास:")}</strong> {t("We may collect the information you share with Astrologers via Chat or Voice & Video channels for internal audit and training purposes.", "आंतरिक ऑडिट और प्रशिक्षण के उद्देश्य से, हम वह जानकारी एकत्र कर सकते हैं जो आप चैट या वॉयस व वीडियो माध्यमों से ज्योतिषियों के साथ साझा करते हैं।")}</li>
            </ul>

            <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">{t("How We Use Your Information", "हम आपकी जानकारी का उपयोग कैसे करते हैं")}</h2>
            <p className="text-muted-foreground mb-4">{t("We use the information we collect for the following purposes:", "हम एकत्र की गई जानकारी का उपयोग निम्नलिखित उद्देश्यों के लिए करते हैं:")}</p>
            <ul className="list-disc list-inside text-muted-foreground mb-6 space-y-3">
              <li><strong>{t("Service Delivery:", "सेवा प्रदान करना:")}</strong> {t("To facilitate consultations, communication between astrologers and clients, and process transactions.", "परामर्श, ज्योतिषियों और ग्राहकों के बीच संवाद की सुविधा देने और लेन-देन संसाधित करने के लिए।")}</li>
              <li><strong>{t("Personalization:", "वैयक्तिकरण:")}</strong> {t("To customize your experience and recommend relevant content and services.", "आपके अनुभव को अनुकूलित करने और प्रासंगिक सामग्री व सेवाओं की सिफारिश करने के लिए।")}</li>
              <li><strong>{t("Marketing and Communication:", "मार्केटिंग और संचार:")}</strong> {t("To send promotional offers, newsletters, and updates through email, SMS, and WhatsApp.", "ईमेल, SMS और WhatsApp के माध्यम से प्रचार ऑफ़र, न्यूज़लेटर और अपडेट भेजने के लिए।")}</li>
              <li><strong>{t("Customer Support:", "ग्राहक सहायता:")}</strong> {t("To respond to your inquiries and provide assistance.", "आपकी पूछताछ का उत्तर देने और सहायता प्रदान करने के लिए।")}</li>
              <li><strong>{t("Analytics and Improvements:", "विश्लेषण और सुधार:")}</strong> {t("To analyse usage patterns, improve service quality, and develop new features.", "उपयोग के पैटर्न का विश्लेषण करने, सेवा की गुणवत्ता सुधारने और नई सुविधाएं विकसित करने के लिए।")}</li>
            </ul>

            <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">{t("Data Sharing and Disclosure", "डेटा साझाकरण और प्रकटीकरण")}</h2>
            <p className="text-muted-foreground mb-4">
              {t(
                "Astromate does not sell or rent your personal data to third parties. However, we may share your data under the following circumstances:",
                "Astromate आपका व्यक्तिगत डेटा तृतीय पक्षों को न तो बेचता है और न ही किराए पर देता है। हालांकि, हम निम्नलिखित परिस्थितियों में आपका डेटा साझा कर सकते हैं:"
              )}
            </p>
            <ul className="list-disc list-inside text-muted-foreground mb-6 space-y-3">
              <li><strong>{t("Service Providers:", "सेवा प्रदाता:")}</strong> {t("With trusted third-party vendors who assist with business operations, such as payment processors and hosting services.", "विश्वसनीय तृतीय-पक्ष विक्रेताओं के साथ जो व्यावसायिक संचालन में सहायता करते हैं, जैसे पेमेंट प्रोसेसर और होस्टिंग सेवाएं।")}</li>
              <li><strong>{t("Legal Obligations:", "कानूनी दायित्व:")}</strong> {t("When required by law or to protect our rights, privacy, safety, or property.", "जब कानून द्वारा आवश्यक हो या हमारे अधिकारों, गोपनीयता, सुरक्षा या संपत्ति की रक्षा के लिए।")}</li>
              <li><strong>{t("Business Transfers:", "व्यवसाय हस्तांतरण:")}</strong> {t("In the event of mergers, acquisitions, or asset sales, user data may be transferred.", "विलय, अधिग्रहण या संपत्ति की बिक्री की स्थिति में, उपयोगकर्ता डेटा हस्तांतरित किया जा सकता है।")}</li>
            </ul>

            <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">{t("Data Security", "डेटा सुरक्षा")}</h2>
            <p className="text-muted-foreground mb-6">
              {t(
                "We implement industry-standard security measures, such as encryption and access controls, to safeguard your data. Despite our efforts, no system is completely secure, and we cannot guarantee absolute security.",
                "आपके डेटा की सुरक्षा के लिए हम एन्क्रिप्शन और एक्सेस नियंत्रण जैसे उद्योग-मानक सुरक्षा उपाय लागू करते हैं। हमारे प्रयासों के बावजूद, कोई भी प्रणाली पूरी तरह सुरक्षित नहीं होती, और हम पूर्ण सुरक्षा की गारंटी नहीं दे सकते।"
              )}
            </p>

            <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">{t("Data Retention", "डेटा प्रतिधारण")}</h2>
            <p className="text-muted-foreground mb-6">
              {t(
                "We retain personal data only for as long as necessary for the purposes outlined in this policy, unless a longer retention period is required by law. Users may request data deletion by following the account deletion instructions within the app.",
                "हम व्यक्तिगत डेटा को केवल उतने समय तक रखते हैं जितना इस नीति में बताए गए उद्देश्यों के लिए आवश्यक है, जब तक कि कानून द्वारा अधिक समय तक रखना आवश्यक न हो। उपयोगकर्ता ऐप में दिए गए खाता हटाने के निर्देशों का पालन करके डेटा हटाने का अनुरोध कर सकते हैं।"
              )}
            </p>

            <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">{t("Your Rights", "आपके अधिकार")}</h2>
            <p className="text-muted-foreground mb-6">
              {t(
                "Depending on your jurisdiction, you may have rights regarding your personal data, including the right to access, update, or delete your information. You can exercise these rights by contacting us at support@astromate.online.",
                "आपके क्षेत्राधिकार के आधार पर, आपके व्यक्तिगत डेटा के संबंध में आपके कुछ अधिकार हो सकते हैं, जिनमें अपनी जानकारी तक पहुँचने, उसे अपडेट करने या हटाने का अधिकार शामिल है। आप support@astromate.online पर हमसे संपर्क करके इन अधिकारों का उपयोग कर सकते हैं।"
              )}
            </p>

            <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">{t("Camera, Voice and Microphone Access", "कैमरा, वॉयस और माइक्रोफ़ोन एक्सेस")}</h2>
            <p className="text-muted-foreground mb-6">
              {t(
                "Astromate requires microphone, camera access solely to enable audio, video interactions for voice and video inputs. This access is used only during active sessions and is not stored or shared.",
                "Astromate को माइक्रोफ़ोन और कैमरा एक्सेस केवल वॉयस और वीडियो इनपुट के लिए ऑडियो व वीडियो बातचीत सक्षम करने हेतु आवश्यक है। इस एक्सेस का उपयोग केवल सक्रिय सत्रों के दौरान किया जाता है और इसे न तो संग्रहीत किया जाता है और न ही साझा किया जाता है।"
              )}
            </p>

            <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">{t("Cookies and Tracking Technologies", "कुकीज़ और ट्रैकिंग तकनीकें")}</h2>
            <p className="text-muted-foreground mb-6">
              {t(
                "We use cookies and similar technologies to collect data and enhance user experience. Users can manage cookie preferences through browser settings.",
                "हम डेटा एकत्र करने और उपयोगकर्ता अनुभव को बेहतर बनाने के लिए कुकीज़ और इसी तरह की तकनीकों का उपयोग करते हैं। उपयोगकर्ता ब्राउज़र सेटिंग्स के माध्यम से कुकी प्राथमिकताएं प्रबंधित कर सकते हैं।"
              )}
            </p>

            <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">{t("Children's Privacy", "बच्चों की गोपनीयता")}</h2>
            <p className="text-muted-foreground mb-6">
              {t(
                "Astromate services are intended for users aged 18 and above. We do not knowingly collect personal information from minors. If we learn that we have collected data from a child under 18, we will take steps to delete such information promptly.",
                "Astromate की सेवाएं 18 वर्ष और उससे अधिक आयु के उपयोगकर्ताओं के लिए हैं। हम जानबूझकर नाबालिगों से व्यक्तिगत जानकारी एकत्र नहीं करते। यदि हमें पता चलता है कि हमने 18 वर्ष से कम आयु के किसी बच्चे का डेटा एकत्र किया है, तो हम ऐसी जानकारी को तुरंत हटाने के लिए कदम उठाएंगे।"
              )}
            </p>

            <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">{t("Changes to This Privacy Policy", "इस गोपनीयता नीति में परिवर्तन")}</h2>
            <p className="text-muted-foreground mb-6">
              {t(
                "This policy may be updated from time to time to reflect changes in our practices or legal requirements. We encourage periodic review of this policy.",
                "हमारी प्रथाओं या कानूनी आवश्यकताओं में बदलाव को दर्शाने के लिए इस नीति को समय-समय पर अपडेट किया जा सकता है। हम इस नीति की समय-समय पर समीक्षा करने के लिए प्रोत्साहित करते हैं।"
              )}
            </p>

            <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">{t("Contact Us", "संपर्क करें")}</h2>
            <p className="text-muted-foreground mb-4">
              {t("For questions or concerns about this policy, please contact us:", "इस नीति के बारे में प्रश्नों या चिंताओं के लिए, कृपया हमसे संपर्क करें:")}
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

export default PrivacyPolicy;
