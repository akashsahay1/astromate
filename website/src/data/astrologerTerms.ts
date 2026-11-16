// Astrologer / Pandit Terms and Conditions — Astromate
// (NAAMRE SERVICES (OPC) PRIVATE LIMITED)
// Hindi fields are the original text; *En fields are the English versions.

export const TERMS_EFFECTIVE_DATE = "05/12/2026";

export interface TermsSection {
  title: string;
  titleEn: string;
  intro?: string;
  introEn?: string;
  points: string[];
  pointsEn: string[];
}

export const ASTROLOGER_TERMS_INTRO =
  'Astromate ("हम", "प्लेटफ़ॉर्म") — NAAMRE SERVICES (OPC) PRIVATE LIMITED द्वारा संचालित — पर Astrologer / Pandit के रूप में रजिस्ट्रेशन करने से पहले कृपया ये नियम व शर्तें ध्यान से पढ़ें। रजिस्ट्रेशन पूरा करने पर आप इन शर्तों से बंधे होने की सहमति देते हैं।';

export const ASTROLOGER_TERMS_INTRO_EN =
  'Please read these terms and conditions carefully before registering as an Astrologer / Pandit on Astromate ("we", "the Platform"), operated by NAAMRE SERVICES (OPC) PRIVATE LIMITED. By completing registration, you agree to be bound by these terms.';

export const ASTROLOGER_TERMS: TermsSection[] = [
  {
    title: "1. सेवाओं की प्रकृति",
    titleEn: "1. Nature of Services",
    points: [
      "Astromate ज्योतिष, अंकज्योतिष, हस्तरेखा, वास्तु, टैरो और पूजा सेवाएं चैट, कॉल, वीडियो कॉल या in-person सत्र के माध्यम से उपलब्ध कराता है।",
      "ये सेवाएं मार्गदर्शन, जानकारी और मनोरंजन के उद्देश्य से दी जाती हैं।",
      "ज्योतिष एक विश्वास प्रणाली है, कोई प्रमाणित विज्ञान नहीं — भविष्यवाणी या उपाय किसी परिणाम की गारंटी नहीं देते।",
      "मेडिकल, कानूनी, वित्तीय, मानसिक स्वास्थ्य या निवेश सलाह देना सख्त मना है।",
    ],
    pointsEn: [
      "Astromate provides astrology, numerology, palmistry, vastu, tarot and puja services through chat, call, video call or in-person sessions.",
      "These services are provided for guidance, information and entertainment purposes.",
      "Astrology is a belief system, not a proven science — predictions or remedies do not guarantee any outcome.",
      "Giving medical, legal, financial, mental health or investment advice is strictly prohibited.",
    ],
  },
  {
    title: "2. पात्रता",
    titleEn: "2. Eligibility",
    points: [
      "आपकी आयु कम से कम 18 वर्ष होनी चाहिए।",
      "रजिस्ट्रेशन में दी गई सभी जानकारी (नाम, अनुभव, प्रमाणपत्र, आधार, बैंक विवरण) सही, पूर्ण व वर्तमान होनी चाहिए।",
      "गलत या भ्रामक जानकारी पाए जाने पर अकाउंट बिना नोटिस निलंबित किया जा सकता है।",
    ],
    pointsEn: [
      "You must be at least 18 years of age.",
      "All information provided during registration (name, experience, certificates, Aadhaar, bank details) must be correct, complete and current.",
      "If false or misleading information is found, the account may be suspended without notice.",
    ],
  },
  {
    title: "3. अकाउंट रजिस्ट्रेशन",
    titleEn: "3. Account Registration",
    points: [
      "अकाउंट मोबाइल नंबर / ईमेल के माध्यम से बनाया जाएगा और Admin approval के बाद ही सक्रिय होगा।",
      "अपने लॉगिन क्रेडेंशियल गोपनीय रखना और अकाउंट पर हुई सभी गतिविधियों की जिम्मेदारी आपकी है।",
      "अनधिकृत उपयोग की जानकारी तुरंत हमें दें।",
    ],
    pointsEn: [
      "The account will be created using a mobile number / email and will become active only after Admin approval.",
      "You are responsible for keeping your login credentials confidential and for all activity on your account.",
      "Inform us immediately of any unauthorized use.",
    ],
  },
  {
    title: "4. शुल्क व भुगतान",
    titleEn: "4. Fees and Payment",
    points: [
      "परामर्श शुल्क प्लेटफ़ॉर्म पर प्रदर्शित होंगे और मोड (चैट/कॉल/वीडियो) व अवधि के अनुसार भिन्न हो सकते हैं।",
      "सभी भुगतान प्लेटफ़ॉर्म के माध्यम से ही किए जाएंगे; प्लेटफ़ॉर्म कमीशन काटकर शेष राशि payout के रूप में दी जाएगी।",
      "लागू कर (GST आदि) नियमानुसार लागू होंगे।",
      "तकनीकी कारणों से सत्र बाधित होने पर rescheduling या wallet credit हमारे विवेक पर दिया जा सकता है।",
    ],
    pointsEn: [
      "Consultation fees will be displayed on the Platform and may vary by mode (chat/call/video) and duration.",
      "All payments will be made only through the Platform; the remaining amount after deducting the platform commission will be paid out as a payout.",
      "Applicable taxes (GST etc.) will apply as per the rules.",
      "If a session is interrupted for technical reasons, rescheduling or wallet credit may be given at our discretion.",
    ],
  },
  {
    title: "5. रद्दीकरण व रिफंड",
    titleEn: "5. Cancellation and Refund",
    points: [
      "बुकिंग के समय बताई गई समय-सीमा के भीतर ही रद्दीकरण मान्य होगा।",
      "सत्र शुरू हो जाने के बाद सामान्यतः कोई रिफंड नहीं होगा, सिवाय हमारी ओर से तकनीकी विफलता के।",
      "स्वीकृत रिफंड सामान्यतः 7–10 कार्य दिवसों में प्रोसेस किए जाएंगे।",
    ],
    pointsEn: [
      "Cancellation will be valid only within the time limit stated at the time of booking.",
      "Once a session has started, there will generally be no refund, except in the case of a technical failure on our side.",
      "Approved refunds will generally be processed within 7–10 working days.",
    ],
  },
  {
    title: "6. आचरण संहिता",
    titleEn: "6. Conduct",
    intro: "प्लेटफ़ॉर्म का उपयोग करते हुए आप सहमत हैं कि आप:",
    introEn: "While using the Platform, you agree that you will not:",
    points: [
      "किसी भी गैरकानूनी उद्देश्य के लिए प्लेटफ़ॉर्म का उपयोग नहीं करेंगे।",
      "किसी उपयोगकर्ता या प्रतिनिधि के साथ अभद्र, अपमानजनक या धमकी भरा व्यवहार नहीं करेंगे।",
      "बिना लिखित अनुमति किसी परामर्श (ऑडियो/वीडियो/चैट) को रिकॉर्ड या साझा नहीं करेंगे।",
      "अपनी पहचान, आयु या योग्यता के बारे में गलत जानकारी नहीं देंगे।",
      "प्लेटफ़ॉर्म शुल्क से बचने के लिए यूज़र को बाहर सेवा हेतु आमंत्रित नहीं करेंगे।",
      "काला जादू, तंत्र-मंत्र या डर दिखाकर पैसे मांगने जैसी प्रथाओं का प्रचार नहीं करेंगे।",
    ],
    pointsEn: [
      "Use the Platform for any unlawful purpose.",
      "Behave in an indecent, abusive or threatening manner towards any user or representative.",
      "Record or share any consultation (audio/video/chat) without written permission.",
      "Give false information about your identity, age or qualifications.",
      "Invite users to take services outside the Platform in order to avoid platform fees.",
      "Promote practices such as black magic, tantra-mantra or demanding money by instilling fear.",
    ],
  },
  {
    title: "7. गारंटी का अस्वीकरण",
    titleEn: "7. Disclaimer",
    points: [
      "किसी भी भविष्यवाणी, रत्न, उपाय या अनुष्ठान की सटीकता या परिणाम की गारंटी नहीं दी जाती।",
      "उपयोगकर्ता द्वारा लिए गए निर्णय पूर्णतः उनके अपने विवेक व जोखिम पर होते हैं।",
      "रत्न, पूजा या उत्पाद की सिफारिश पूर्णतः वैकल्पिक है।",
    ],
    pointsEn: [
      "No guarantee is given of the accuracy or outcome of any prediction, gemstone, remedy or ritual.",
      "Decisions taken by users are entirely at their own discretion and risk.",
      "Recommendations of gemstones, pujas or products are entirely optional.",
    ],
  },
  {
    title: "8. देयता की सीमा",
    titleEn: "8. Limitation of Liability",
    points: [
      "कानून द्वारा अनुमत सीमा तक, Astromate किसी भी प्रत्यक्ष, अप्रत्यक्ष या परिणामी नुकसान के लिए उत्तरदायी नहीं होगा।",
      "किसी दावे में हमारी कुल देयता संबंधित परामर्श के लिए वास्तव में भुगतान की गई राशि से अधिक नहीं होगी।",
    ],
    pointsEn: [
      "To the extent permitted by law, Astromate shall not be liable for any direct, indirect or consequential loss.",
      "Our total liability in any claim shall not exceed the amount actually paid for the consultation concerned.",
    ],
  },
  {
    title: "9. बौद्धिक संपदा",
    titleEn: "9. Intellectual Property",
    points: [
      "प्लेटफ़ॉर्म का लोगो, टेक्स्ट, ग्राफ़िक्स व डिज़ाइन Astromate या उसके लाइसेंसर की संपत्ति है।",
      "बिना लिखित अनुमति किसी सामग्री की नकल, वितरण या व्युत्पन्न कार्य निषिद्ध है।",
    ],
    pointsEn: [
      "The Platform's logo, text, graphics and design are the property of Astromate or its licensors.",
      "Copying, distributing or creating derivative works of any content without written permission is prohibited.",
    ],
  },
  {
    title: "10. गोपनीयता",
    titleEn: "10. Privacy",
    points: [
      "आपकी व्यक्तिगत जानकारी का उपयोग हमारी Privacy Policy के अनुसार होगा।",
      "उपयोगकर्ताओं की जन्म-जानकारी व निजी विवरण को गोपनीय रखना अनिवार्य है।",
    ],
    pointsEn: [
      "Your personal information will be used in accordance with our Privacy Policy.",
      "Keeping users' birth details and private information confidential is mandatory.",
    ],
  },
  {
    title: "11. स्वतंत्र पेशेवर",
    titleEn: "11. Independent Professionals",
    points: [
      "प्लेटफ़ॉर्म पर empanelled ज्योतिषी/पंडित स्वतंत्र पेशेवर हैं, कर्मचारी नहीं।",
      "Astromate यूज़र और ज्योतिषी के बीच संपर्क की सुविधा देता है; व्यक्तिगत सलाह की जिम्मेदारी संबंधित ज्योतिषी की है।",
    ],
    pointsEn: [
      "Astrologers/Pandits empanelled on the Platform are independent professionals, not employees.",
      "Astromate facilitates contact between users and astrologers; responsibility for individual advice lies with the astrologer concerned.",
    ],
  },
  {
    title: "12. संचार सहमति",
    titleEn: "12. Communication Consent",
    points: [
      "रजिस्ट्रेशन करने पर आप बुकिंग, ऑफ़र व अपडेट संबंधी SMS/WhatsApp/ईमेल/कॉल प्राप्त करने की सहमति देते हैं।",
      "प्रचार संदेशों से आप कभी भी opt-out कर सकते हैं।",
    ],
    pointsEn: [
      "By registering, you consent to receive SMS/WhatsApp/email/calls about bookings, offers and updates.",
      "You may opt out of promotional messages at any time.",
    ],
  },
  {
    title: "13. निलंबन व समाप्ति",
    titleEn: "13. Suspension and Termination",
    points: [
      "शर्तों के उल्लंघन, धोखाधड़ी या किसी अन्य कारण से हम बिना नोटिस अकाउंट निलंबित या समाप्त कर सकते हैं।",
      "समाप्ति के बाद भी देयता, बौद्धिक संपदा व विवाद समाधान से जुड़ी शर्तें लागू रहेंगी।",
    ],
    pointsEn: [
      "We may suspend or terminate an account without notice for breach of these terms, fraud or any other reason.",
      "Terms relating to liability, intellectual property and dispute resolution will continue to apply even after termination.",
    ],
  },
  {
    title: "14. शिकायत निवारण",
    titleEn: "14. Grievance Redressal",
    points: [
      "शिकायत के लिए संपर्क करें: Astromate Support Team — support@astromate.online",
      "शिकायतों का समाधान सामान्यतः 15–30 दिनों में किया जाएगा।",
    ],
    pointsEn: [
      "For grievances, contact: Astromate Support Team — support@astromate.online",
      "Grievances will generally be resolved within 15–30 days.",
    ],
  },
  {
    title: "15. लागू कानून",
    titleEn: "15. Governing Law",
    points: [
      "ये शर्तें भारत के कानूनों द्वारा शासित होंगी।",
      "किसी भी विवाद पर रांची, झारखंड के न्यायालयों का विशेष क्षेत्राधिकार होगा।",
    ],
    pointsEn: [
      "These terms shall be governed by the laws of India.",
      "The courts of Ranchi, Jharkhand shall have exclusive jurisdiction over any dispute.",
    ],
  },
  {
    title: "16. शर्तों में संशोधन",
    titleEn: "16. Amendments",
    points: [
      "हम किसी भी समय इन शर्तों में बदलाव कर सकते हैं; संशोधित तिथि इसी पेज पर दिखाई जाएगी।",
      "बदलाव के बाद सेवाओं का उपयोग जारी रखना आपकी स्वीकृति मानी जाएगी।",
    ],
    pointsEn: [
      "We may change these terms at any time; the revised date will be shown on this page.",
      "Continuing to use the services after a change will be deemed your acceptance.",
    ],
  },
  {
    title: "17. फोर्स मेज्योर व वैधता",
    titleEn: "17. Force Majeure & Severability",
    points: [
      "हमारे नियंत्रण से बाहर की परिस्थितियों (सर्वर आउटेज, प्राकृतिक आपदा, सरकारी प्रतिबंध) के लिए हम उत्तरदायी नहीं होंगे।",
      "किसी प्रावधान के अमान्य होने पर शेष शर्तें पूर्ण रूप से प्रभावी रहेंगी।",
    ],
    pointsEn: [
      "We shall not be liable for circumstances beyond our control (server outages, natural disasters, government restrictions).",
      "If any provision is held invalid, the remaining terms shall remain in full effect.",
    ],
  },
];
