import { Link } from "react-router-dom";
import LegalPage, { ADDRESS, COMPANY, SUPPORT_EMAIL, SUPPORT_PHONE, SUPPORT_TEL } from "@/components/LegalPage";
import { useT } from "@/hooks/useLang";

// ponytail: drafted from how the app actually handles wallet, sessions, orders and refunds (admin/src/lib/orders.ts,
// payments/razorpay/refund). Have the client / a lawyer review before relying on them; keep them in step with the app.
const UPDATED = { en: "16 November 2026", hi: "16 नवंबर 2026" };
const Mail = () => <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>;

export const RefundPolicy = () => {
  const t = useT();
  return (
    <LegalPage title={t("Refund & Cancellation Policy", "रिफंड और रद्दीकरण नीति")} updated={t(UPDATED.en, UPDATED.hi)}>
      <p>
        {t(
          `This policy explains how cancellations and refunds work on Astromate (website and mobile app), operated by ${COMPANY}. By making a payment on Astromate you agree to this policy along with our `,
          `यह नीति बताती है कि ${COMPANY} द्वारा संचालित Astromate (वेबसाइट और मोबाइल ऐप) पर रद्दीकरण और रिफंड कैसे होते हैं। Astromate पर भुगतान करके आप इस नीति और हमारी `,
        )}
        <Link to="/terms-of-service">{t("Terms of Use", "उपयोग की शर्तें")}</Link>
        {t(".", " से सहमत होते हैं।")}
      </p>

      <h2>{t("1. Wallet recharges", "1. वॉलेट रिचार्ज")}</h2>
      <ul>
        <li>{t(
          "Consultations (chat, call and video) are paid from your Astromate wallet. Money added to the wallet is used for services on Astromate and is not normally refundable to your bank account.",
          "परामर्श (चैट, कॉल और वीडियो) का भुगतान आपके Astromate वॉलेट से होता है। वॉलेट में जोड़ी गई राशि Astromate की सेवाओं के लिए है और सामान्यतः बैंक खाते में वापस नहीं की जाती।",
        )}</li>
        <li>{t(
          "If you were charged but the wallet was not credited, or you were charged twice for the same recharge, write to us with the payment reference. After verification the amount is credited to your wallet or refunded to the original payment method.",
          "यदि आपसे राशि कट गई लेकिन वॉलेट में नहीं जुड़ी, या एक ही रिचार्ज के लिए दो बार राशि कटी, तो भुगतान संदर्भ (payment reference) के साथ हमें लिखें। जाँच के बाद राशि आपके वॉलेट में जोड़ दी जाएगी या मूल भुगतान माध्यम में वापस कर दी जाएगी।",
        )}</li>
      </ul>

      <h2>{t("2. Consultations (chat, call, video)", "2. परामर्श (चैट, कॉल, वीडियो)")}</h2>
      <ul>
        <li>{t(
          "Consultations are billed per minute at the astrologer's displayed rate, only for the time the session is connected.",
          "परामर्श का शुल्क ज्योतिषी की दर्शाई गई दर पर प्रति मिनट लिया जाता है, केवल उतने समय का जितनी देर सेशन जुड़ा रहता है।",
        )}</li>
        <li>{t(
          "You can end a session at any time; billing stops when the session ends.",
          "आप कभी भी सेशन समाप्त कर सकते हैं; सेशन समाप्त होते ही शुल्क लगना बंद हो जाता है।",
        )}</li>
        <li>{t(
          "If a session drops because of a technical fault on our side, or the astrologer was unresponsive, report it within 7 days from the app or by email. After review, the affected amount is credited back to your wallet.",
          "यदि हमारी तकनीकी खराबी के कारण सेशन टूट जाए, या ज्योतिषी ने जवाब न दिया हो, तो 7 दिनों के भीतर ऐप से या ईमेल द्वारा सूचित करें। समीक्षा के बाद प्रभावित राशि आपके वॉलेट में वापस जोड़ दी जाएगी।",
        )}</li>
        <li>
          {t(
            "Refunds are not given because you disagree with or are unhappy about a prediction or advice. Astrology is guidance, not a guaranteed outcome; see our ",
            "किसी भविष्यवाणी या सलाह से असहमति या असंतोष के कारण रिफंड नहीं दिया जाता। ज्योतिष मार्गदर्शन है, निश्चित परिणाम की गारंटी नहीं; देखें हमारा ",
          )}
          <Link to="/disclaimer">{t("Disclaimer", "अस्वीकरण")}</Link>.
        </li>
      </ul>

      <h2>{t("3. Pooja and Mantra Jaap bookings", "3. पूजा और मंत्र जाप बुकिंग")}</h2>
      <ul>
        <li>{t(
          "You can cancel a booking up to 24 hours before the scheduled time for a full refund.",
          "निर्धारित समय से 24 घंटे पहले तक बुकिंग रद्द करने पर पूरा रिफंड मिलेगा।",
        )}</li>
        <li>{t(
          "Cancellations within 24 hours of the scheduled time are not refundable, because arrangements (pandit, samagri) are already made.",
          "निर्धारित समय से 24 घंटे के भीतर रद्द करने पर रिफंड नहीं मिलेगा, क्योंकि व्यवस्थाएँ (पंडित, सामग्री) पहले ही हो चुकी होती हैं।",
        )}</li>
        <li>{t(
          "If we cannot perform a booked service, we will offer a new date or a full refund.",
          "यदि हम बुक की गई सेवा नहीं कर पाते, तो हम नई तिथि या पूरा रिफंड देंगे।",
        )}</li>
      </ul>

      <h2>{t("4. Product orders (shop)", "4. उत्पाद ऑर्डर (शॉप)")}</h2>
      <ul>
        <li>{t("You can cancel an order any time before it is shipped.", "ऑर्डर भेजे (शिप) जाने से पहले आप उसे कभी भी रद्द कर सकते हैं।")}</li>
        <li>{t(
          "Orders paid from the wallet are refunded to the wallet immediately on cancellation.",
          "वॉलेट से भुगतान किए गए ऑर्डर रद्द होते ही राशि तुरंत वॉलेट में वापस आ जाती है।",
        )}</li>
        <li>{t(
          "Orders paid by card, UPI or net banking are refunded to the original payment method.",
          "कार्ड, UPI या नेट बैंकिंग से भुगतान किए गए ऑर्डर की राशि मूल भुगतान माध्यम में वापस की जाती है।",
        )}</li>
        <li>{t(
          "Once shipped, an order cannot be cancelled. If an item arrives damaged, defective or wrong, contact us within 48 hours of delivery with photos, and we will replace it or refund it.",
          "शिप होने के बाद ऑर्डर रद्द नहीं किया जा सकता। यदि सामान क्षतिग्रस्त, खराब या गलत पहुँचे, तो डिलीवरी के 48 घंटों के भीतर फोटो के साथ हमसे संपर्क करें; हम उसे बदल देंगे या रिफंड करेंगे।",
        )}</li>
        <li>{t(
          "Energised or personalised items (for example energised gemstones, yantras or rudraksha) cannot be returned unless they arrive damaged or wrong.",
          "अभिमंत्रित (energised) या व्यक्तिगत रूप से तैयार वस्तुएँ (जैसे अभिमंत्रित रत्न, यंत्र या रुद्राक्ष) वापस नहीं ली जातीं, जब तक वे क्षतिग्रस्त या गलत न पहुँचें।",
        )}</li>
      </ul>

      <h2>{t("5. Refund timelines", "5. रिफंड की समय-सीमा")}</h2>
      <ul>
        <li>{t("Wallet credits are applied immediately after approval.", "स्वीकृति के तुरंत बाद राशि वॉलेट में जोड़ दी जाती है।")}</li>
        <li>{t(
          "Refunds to the original payment method are processed through our payment partner (Razorpay) within 5–7 working days of approval. Your bank may take a few additional days to show it.",
          "मूल भुगतान माध्यम में रिफंड हमारे भुगतान पार्टनर (Razorpay) के माध्यम से स्वीकृति के 5–7 कार्य दिवसों में प्रोसेस होता है। आपके बैंक में दिखने में कुछ अतिरिक्त दिन लग सकते हैं।",
        )}</li>
      </ul>

      <h2>{t("6. How to request a refund", "6. रिफंड का अनुरोध कैसे करें")}</h2>
      <p>
        {t("Email ", "")}<Mail />{t(
          " with your registered phone number, the order or session ID, and a short description. We reply within 2 working days.",
          " पर अपना पंजीकृत फोन नंबर, ऑर्डर या सेशन ID और संक्षिप्त विवरण भेजें। हम 2 कार्य दिवसों में उत्तर देते हैं।",
        )}
      </p>
    </LegalPage>
  );
};

export const ShippingPolicy = () => {
  const t = useT();
  return (
    <LegalPage title={t("Shipping & Delivery Policy", "शिपिंग और डिलीवरी नीति")} updated={t(UPDATED.en, UPDATED.hi)}>
      <p>{t(
        `This policy applies to physical products bought from the Astromate shop, operated by ${COMPANY}.`,
        `यह नीति ${COMPANY} द्वारा संचालित Astromate शॉप से खरीदे गए भौतिक उत्पादों पर लागू होती है।`,
      )}</p>

      <h2>{t("1. Where we ship", "1. हम कहाँ भेजते हैं")}</h2>
      <p>{t("We currently ship within India only.", "फिलहाल हम केवल भारत के भीतर ही सामान भेजते हैं।")}</p>

      <h2>{t("2. Dispatch and delivery time", "2. डिस्पैच और डिलीवरी का समय")}</h2>
      <ul>
        <li>{t(
          "Orders are dispatched within 2–4 working days of payment. Energised items may need up to 7 working days, as they are prepared after the order.",
          "भुगतान के 2–4 कार्य दिवसों में ऑर्डर डिस्पैच किए जाते हैं। अभिमंत्रित वस्तुओं में 7 कार्य दिवस तक लग सकते हैं, क्योंकि वे ऑर्डर के बाद तैयार की जाती हैं।",
        )}</li>
        <li>{t(
          "Delivery usually takes 3–7 working days after dispatch, depending on your location and the courier.",
          "डिस्पैच के बाद डिलीवरी में आमतौर पर 3–7 कार्य दिवस लगते हैं, जो आपके स्थान और कूरियर पर निर्भर है।",
        )}</li>
        <li>{t(
          "Delivery dates are estimates; delays caused by couriers, weather or public holidays are outside our control.",
          "डिलीवरी की तिथियाँ अनुमानित हैं; कूरियर, मौसम या सार्वजनिक छुट्टियों के कारण होने वाली देरी हमारे नियंत्रण में नहीं है।",
        )}</li>
      </ul>

      <h2>{t("3. Shipping charges", "3. शिपिंग शुल्क")}</h2>
      <p>{t("Any shipping charge is shown at checkout before you pay.", "कोई भी शिपिंग शुल्क भुगतान से पहले चेकआउट पर दिखाया जाता है।")}</p>

      <h2>{t("4. Tracking", "4. ट्रैकिंग")}</h2>
      <p>{t(
        "Once your order ships, its status and tracking details appear in the Orders section of the Astromate app.",
        "ऑर्डर शिप होने के बाद उसकी स्थिति और ट्रैकिंग विवरण Astromate ऐप के ऑर्डर सेक्शन में दिखाई देते हैं।",
      )}</p>

      <h2>{t("5. Digital services", "5. डिजिटल सेवाएँ")}</h2>
      <p>{t(
        "Consultations, reports, Pooja and Mantra Jaap services are delivered online or performed at the scheduled time; nothing is shipped for them.",
        "परामर्श, रिपोर्ट, पूजा और मंत्र जाप सेवाएँ ऑनलाइन दी जाती हैं या निर्धारित समय पर की जाती हैं; इनके लिए कुछ भी भेजा नहीं जाता।",
      )}</p>

      <h2>{t("6. Damaged or missing parcels", "6. क्षतिग्रस्त या गुम पार्सल")}</h2>
      <p>
        {t("If a parcel arrives damaged or does not arrive, contact ", "यदि पार्सल क्षतिग्रस्त पहुँचे या न पहुँचे, तो डिलीवरी तिथि के 48 घंटों के भीतर ")}
        <Mail />
        {t(" within 48 hours of the delivery date. See our ", " पर संपर्क करें। देखें हमारी ")}
        <Link to="/refund-policy">{t("Refund & Cancellation Policy", "रिफंड और रद्दीकरण नीति")}</Link>.
      </p>
    </LegalPage>
  );
};

export const CookiePolicy = () => {
  const t = useT();
  return (
    <LegalPage title={t("Cookie Policy", "कुकी नीति")} updated={t(UPDATED.en, UPDATED.hi)}>
      <p>{t(
        "This policy explains how the Astromate website uses cookies and similar browser storage.",
        "यह नीति बताती है कि Astromate वेबसाइट कुकीज़ और इसी तरह के ब्राउज़र स्टोरेज का उपयोग कैसे करती है।",
      )}</p>

      <h2>{t("1. What we use", "1. हम क्या उपयोग करते हैं")}</h2>
      <ul>
        <li>
          <strong>{t("Preferences (local storage):", "प्राथमिकताएँ (लोकल स्टोरेज):")}</strong>{" "}
          {t(
            "we remember the language you choose (English or Hindi) in your browser so the site opens in that language next time.",
            "आपके द्वारा चुनी गई भाषा (अंग्रेज़ी या हिंदी) आपके ब्राउज़र में याद रखी जाती है, ताकि अगली बार साइट उसी भाषा में खुले।",
          )}
        </li>
        <li>
          <strong>{t("No advertising or tracking cookies:", "कोई विज्ञापन या ट्रैकिंग कुकी नहीं:")}</strong>{" "}
          {t(
            "the website does not use advertising cookies, analytics trackers or third-party marketing pixels.",
            "वेबसाइट विज्ञापन कुकीज़, एनालिटिक्स ट्रैकर या थर्ड-पार्टी मार्केटिंग पिक्सेल का उपयोग नहीं करती।",
          )}
        </li>
      </ul>

      <h2>{t("2. Third-party services", "2. थर्ड-पार्टी सेवाएँ")}</h2>
      <p>{t(
        "Pages load fonts from Google Fonts and some images from image hosting services. These providers may receive your IP address when your browser fetches the files, under their own privacy policies. Payments in the app are processed by Razorpay, which may set its own cookies during checkout.",
        "पेज Google Fonts से फ़ॉन्ट और कुछ इमेज होस्टिंग सेवाओं से चित्र लोड करते हैं। फ़ाइलें लोड होते समय ये सेवाएँ अपनी गोपनीयता नीतियों के अनुसार आपका IP पता प्राप्त कर सकती हैं। ऐप में भुगतान Razorpay द्वारा प्रोसेस होते हैं, जो चेकआउट के दौरान अपनी कुकीज़ सेट कर सकता है।",
      )}</p>

      <h2>{t("3. Managing storage", "3. स्टोरेज प्रबंधन")}</h2>
      <p>{t(
        "You can clear cookies and site data at any time in your browser settings. The site works without them; it will simply open in English.",
        "आप ब्राउज़र सेटिंग्स में कभी भी कुकीज़ और साइट डेटा साफ़ कर सकते हैं। साइट इनके बिना भी काम करती है; बस यह अंग्रेज़ी में खुलेगी।",
      )}</p>

      <h2>{t("4. Changes", "4. बदलाव")}</h2>
      <p>
        {t(
          "If we add analytics or other cookies in future, we will update this page and, where required, ask for your consent first. See also our ",
          "यदि भविष्य में हम एनालिटिक्स या अन्य कुकीज़ जोड़ते हैं, तो इस पेज को अपडेट करेंगे और जहाँ आवश्यक हो, पहले आपकी सहमति लेंगे। यह भी देखें: हमारी ",
        )}
        <Link to="/privacy-policy">{t("Privacy Policy", "गोपनीयता नीति")}</Link>.
      </p>
    </LegalPage>
  );
};

export const ContactPage = () => {
  const t = useT();
  return (
    <LegalPage title={t("Contact Us", "संपर्क करें")} updated={t(UPDATED.en, UPDATED.hi)}>
      <p>{t(
        "We're here to help with consultations, payments, orders and astrologer registration.",
        "परामर्श, भुगतान, ऑर्डर और ज्योतिषी पंजीकरण से जुड़ी किसी भी सहायता के लिए हम उपलब्ध हैं।",
      )}</p>
      <ul>
        <li><strong>{t("Email:", "ईमेल:")}</strong> <Mail /></li>
        <li><strong>{t("Phone:", "फ़ोन:")}</strong> <a href={SUPPORT_TEL}>{SUPPORT_PHONE}</a></li>
        <li><strong>{t("Business name:", "व्यवसाय का नाम:")}</strong> {COMPANY}</li>
        <li><strong>{t("Registered address:", "पंजीकृत पता:")}</strong> {ADDRESS}</li>
        <li>
          <strong>{t("Support hours:", "सहायता का समय:")}</strong>{" "}
          {t(
            "10:00 AM – 7:00 PM IST, Monday to Saturday. Astrologers on the app are available 24/7.",
            "सुबह 10:00 से शाम 7:00 बजे (IST), सोमवार से शनिवार। ऐप पर ज्योतिषी 24/7 उपलब्ध हैं।",
          )}
        </li>
      </ul>
      <h2>{t("Grievance Officer", "शिकायत अधिकारी")}</h2>
      <p>
        {t(
          "In line with the Information Technology Act, 2000 and the rules made under it, complaints about content or the use of your data can be sent to our Grievance Officer at ",
          "सूचना प्रौद्योगिकी अधिनियम, 2000 और उसके अंतर्गत बने नियमों के अनुसार, सामग्री या आपके डेटा के उपयोग से जुड़ी शिकायतें हमारे शिकायत अधिकारी को ",
        )}
        <Mail />
        {t(
          ". We acknowledge complaints within 24 hours and resolve them within 15 days.",
          " पर भेजी जा सकती हैं। हम 24 घंटों में शिकायत की पावती देते हैं और 15 दिनों में उसका समाधान करते हैं।",
        )}
      </p>
    </LegalPage>
  );
};
