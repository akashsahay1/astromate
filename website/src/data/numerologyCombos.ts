export type ComboType = "good" | "mixed" | "bad";

export interface ComboInfo {
  pair: string;        // display e.g. "23 / 32"
  title: string;
  titleEn: string;
  type: ComboType;
  labh: string;        // फायदा
  nuksan: string;      // नुकसान
  labhEn: string;
  nuksanEn: string;
}

// key = दो अंकों का संयोजन (दोनों क्रम अलग-अलग key के रूप में जोड़े गए हैं)
const RAW: { keys: string[]; data: Omit<ComboInfo, "pair"> }[] = [
  {
    keys: ["12"],
    data: {
      title: "नेतृत्व और विकास",
      type: "good",
      labh: "आत्मविश्वास बढ़ाता है, नए अवसर दिलाता है और मेहनत से आर्थिक प्रगति करवाता है।",
      nuksan: "कभी-कभी अहंकार व जल्दबाज़ी में लिए निर्णय नुकसान करा सकते हैं।",
      titleEn: "Leadership & Growth",
      labhEn: "Boosts confidence, opens new opportunities and brings financial progress through hard work.",
      nuksanEn: "Ego and hasty decisions can sometimes cause losses.",
    },
  },
  {
    keys: ["21"],
    data: {
      title: "High Expenses / Money Saving Problems / Financial Struggles",
      type: "bad",
      labh: "मेहनत व संपर्कों से आय के रास्ते बनते हैं।",
      nuksan: "अत्यधिक खर्च, बचत न कर पाना और लगातार आर्थिक संघर्ष की स्थिति बनाता है।",
      titleEn: "High Expenses / Money Saving Problems / Financial Struggles",
      labhEn: "Hard work and contacts create avenues of income.",
      nuksanEn: "Brings excessive spending, an inability to save and constant financial struggle.",
    },
  },

  {
    keys: ["23", "32"],
    data: {
      title: "अवसर, संचार, नेटवर्किंग",
      type: "good",
      labh: "सबसे ज़्यादा सहयोग और अवसर देता है — कम्युनिकेशन, लोकप्रियता व सामाजिक सहयोग बढ़ाता है।",
      nuksan: "बहुत अधिक सामाजिक व्यस्तता से फोकस और समय का बिखराव हो सकता है।",
      titleEn: "Opportunity, Communication, Networking",
      labhEn: "Gives the most support and opportunities — boosts communication, popularity and social support.",
      nuksanEn: "Too much social activity can scatter your focus and time.",
    },
  },
  {
    keys: ["14", "41"],
    data: {
      title: "नए अवसर व बुद्धिमत्ता (सावधानी सहित)",
      type: "mixed",
      labh: "व्यापार व करियर में व्यावहारिक प्रगति, तकनीकी व नई सोच वाले कार्यों में सफलता।",
      nuksan: "अनियोजित खर्च और आर्थिक असंतुलन की प्रवृत्ति — बजट पर नियंत्रण ज़रूरी।",
      titleEn: "New Opportunities & Intelligence (with caution)",
      labhEn: "Practical progress in business and career; success in technical and innovative work.",
      nuksanEn: "Tendency toward unplanned spending and financial imbalance — keeping a budget is essential.",
    },
  },
  {
    keys: ["24", "42"],
    data: {
      title: "लोगों का सहयोग व रिश्ते",
      type: "mixed",
      labh: "रिश्तों और स्थिर प्रगति के लिए सहायक, संतुलित विकास देता है।",
      nuksan: "चंद्र-राहु योग से मानसिक तनाव, भ्रम व नींद संबंधी परेशानी दे सकता है।",
      titleEn: "Support from People & Relationships",
      labhEn: "Helpful for relationships and steady progress; gives balanced growth.",
      nuksanEn: "The Moon-Rahu yoga can cause mental stress, confusion and sleep problems.",
    },
  },
  {
    keys: ["46", "64"],
    data: {
      title: "स्थिरता, नेतृत्व, अधिकार",
      type: "mixed",
      labh: "आर्थिक उन्नति और नेतृत्व क्षमता को मजबूत करता है।",
      nuksan: "त्वचा, पाचन व मलाशय (बवासीर सहित) से जुड़ी समस्याओं की संभावना।",
      titleEn: "Stability, Leadership, Authority",
      labhEn: "Strengthens financial growth and leadership ability.",
      nuksanEn: "Possible problems with skin, digestion and the rectum (including piles).",
    },
  },
  {
    keys: ["50", "05"],
    data: {
      title: "व्यापार विस्तार, धन प्रवाह",
      type: "good",
      labh: "बिज़नेस ग्रोथ और नए अवसरों के लिए उत्कृष्ट, धन का प्रवाह बनाए रखता है।",
      nuksan: "शून्य की अधिकता ऊर्जा को बिखेर सकती है — निर्णय में देरी।",
      titleEn: "Business Expansion, Money Flow",
      labhEn: "Excellent for business growth and new opportunities; keeps money flowing.",
      nuksanEn: "Too many zeros can scatter energy — delays in decisions.",
    },
  },
  {
    keys: ["15", "51"],
    data: {
      title: "धन, लोकप्रियता व पहचान",
      type: "good",
      labh: "धन, प्रतिष्ठा और आर्थिक मजबूती देता है, मेहनत का पूरा फल दिलाता है।",
      nuksan: "दिखावे व विलासिता पर अधिक खर्च की प्रवृत्ति।",
      titleEn: "Wealth, Popularity & Recognition",
      labhEn: "Brings wealth, prestige and financial strength; you reap the full reward of your efforts.",
      nuksanEn: "Tendency to overspend on show and luxury.",
    },
  },
  {
    keys: ["33"],
    data: {
      title: "क्लाइंट सपोर्ट, सेवा, प्रतिष्ठा",
      type: "good",
      labh: "जनसंपर्क, शिक्षण व प्रतिष्ठा के लिए बहुत लाभकारी।",
      nuksan: "अत्यधिक सलाह देने की आदत से दूसरों पर निर्भरता बढ़ सकती है।",
      titleEn: "Client Support, Service, Reputation",
      labhEn: "Very beneficial for public relations, teaching and reputation.",
      nuksanEn: "A habit of giving too much advice can make others dependent on you.",
    },
  },
  {
    keys: ["34", "43"],
    data: {
      title: "श्वसन संवेदनशीलता",
      type: "bad",
      labh: "तकनीकी व अनुसंधान कार्यों में गहरी सोच देता है।",
      nuksan: "सांस से जुड़ी समस्याओं व एलर्जी की प्रवृत्ति दर्शा सकता है।",
      titleEn: "Respiratory Sensitivity",
      labhEn: "Gives deep thinking in technical and research work.",
      nuksanEn: "May indicate a tendency toward breathing problems and allergies.",
    },
  },
  {
    keys: ["29", "92"],
    data: {
      title: "धन और सफलता",
      type: "good",
      labh: "धन लाभ, बिज़नेस ग्रोथ और भौतिक सुख-सुविधाएँ आकर्षित करता है।",
      nuksan: "भावनात्मक उतार-चढ़ाव और जल्दबाज़ी में टकराव संभव।",
      titleEn: "Wealth & Success",
      labhEn: "Attracts financial gains, business growth and material comforts.",
      nuksanEn: "Emotional ups and downs and conflicts from haste are possible.",
    },
  },
  {
    keys: ["13"],
    data: {
      title: "संघर्ष के बाद स्थायी सफलता",
      type: "good",
      labh: "स्वतंत्र व दृढ़ स्वभाव देता है; निरंतर प्रयास से करियर व जीवन में स्थायी सफलता मिलती है।",
      nuksan: "शुरुआत में देरी व बाधाएं संभव — धैर्य रखें।",
      titleEn: "Lasting Success After Struggle",
      labhEn: "Gives an independent, determined nature; steady effort brings lasting success in career and life.",
      nuksanEn: "Early delays and obstacles are possible — be patient.",
    },
  },
  {
    keys: ["31"],
    data: {
      title: "ज्ञान व संचार से सफलता",
      type: "good",
      labh: "करियर ग्रोथ, प्रमोशन व प्रोफेशनल सफलता को सपोर्ट करता है। मजबूत संचार, सलाहकारी व प्रभाव डालने की क्षमता देता है — जॉब्स, कंसल्टेंट, एडवाइज़र, मेंटर व गवर्नमेंट रोल्स के लिए उत्कृष्ट।",
      nuksan: "बुद्धिमान व व्यावहारिक होने पर भी कभी-कभी अत्यधिक विश्लेषण से निर्णय में देरी हो सकती है।",
      titleEn: "Success Through Knowledge & Communication",
      labhEn: "Supports career growth, promotions and professional success. Gives strong communication, advisory and influencing skills — excellent for jobs, consultants, advisors, mentors and government roles.",
      nuksanEn: "Even when wise and practical, over-analysis can sometimes delay decisions.",
    },
  },
  {
    keys: ["59", "95"],
    data: {
      title: "सुरक्षा और समृद्धि",
      type: "good",
      labh: "आर्थिक सुरक्षा देता है, आय को स्थिर करता है और दीर्घकालिक समृद्धि देता है।",
      nuksan: "जोखिम भरे निवेश की ओर झुकाव बढ़ सकता है।",
      titleEn: "Security & Prosperity",
      labhEn: "Gives financial security, stabilises income and brings long-term prosperity.",
      nuksanEn: "May increase the pull toward risky investments.",
    },
  },
  {
    keys: ["66"],
    data: {
      title: "वैभव और प्रचुरता",
      type: "good",
      labh: "आराम, ऐश्वर्य और संपत्ति के योग बनाता है, आर्थिक स्थिति मजबूत करता है।",
      nuksan: "भोग-विलास व फिजूलखर्ची की प्रवृत्ति।",
      titleEn: "Luxury & Abundance",
      labhEn: "Creates yogas for comfort, luxury and property; strengthens your finances.",
      nuksanEn: "Tendency toward indulgence and wasteful spending.",
    },
  },
  {
    keys: ["69", "96"],
    data: {
      title: "रचनात्मकता एवं व्यावसायिक फोकस",
      type: "mixed",
      labh: "कला, डिज़ाइन, मीडिया, विज्ञापन व मनोरंजन में सफलता के अच्छे योग।",
      nuksan: "विपरीत लिंग से जुड़े विवाद व मानसिक अस्थिरता की संभावना।",
      titleEn: "Creativity & Professional Focus",
      labhEn: "Good prospects of success in art, design, media, advertising and entertainment.",
      nuksanEn: "Possible disputes involving the opposite sex and mental instability.",
    },
  },
  {
    keys: ["78", "87"],
    data: {
      title: "रिलेशनशिप व इंडस्ट्री फोकस",
      type: "mixed",
      labh: "आध्यात्मिक हीलिंग, एनर्जी हीलिंग, ध्यान, काउंसलिंग व मार्गदर्शन के लिए उत्कृष्ट।",
      nuksan: "रिश्तों में दूरी, अकेलापन और कर्मफल जनित विलंब दे सकता है।",
      titleEn: "Relationship & Industry Focus",
      labhEn: "Excellent for spiritual healing, energy healing, meditation, counselling and guidance.",
      nuksanEn: "Can bring distance in relationships, loneliness and karmic delays.",
    },
  },
  {
    keys: ["79", "97"],
    data: {
      title: "हेल्थकेयर व संबंधित व्यवसायों के लिए उपयुक्त",
      type: "mixed",
      labh: "चिकित्सा व हेल्थकेयर करियर के लिए शुभ, रक्त संबंधी स्वास्थ्य के प्रति सजगता देता है।",
      nuksan: "रक्त-संबंधी समस्याओं की प्रवृत्ति — नियमित जाँच आवश्यक।",
      titleEn: "Suited to Healthcare & Related Professions",
      labhEn: "Auspicious for medical and healthcare careers; keeps you mindful of blood-related health.",
      nuksanEn: "Tendency toward blood-related problems — regular check-ups are essential.",
    },
  },
  {
    keys: ["36", "63"],
    data: {
      title: "बहुमुखी एवं आध्यात्मिक संयोजन",
      type: "good",
      labh: "मल्टी-टैलेंटेड, धार्मिक व आध्यात्मिक प्रवृत्ति, नैतिक मूल्यों को महत्व।",
      nuksan: "गुरु-शुक्र मतभेद से खर्च व पारिवारिक अपेक्षाओं का दबाव।",
      titleEn: "Versatile & Spiritual Combination",
      labhEn: "Multi-talented, religious and spiritual nature; values ethics.",
      nuksanEn: "Jupiter-Venus friction brings pressure from expenses and family expectations.",
    },
  },
  {
    keys: ["37", "73"],
    data: {
      title: "ज्ञान एवं सफलता संयोजन",
      type: "good",
      labh: "ज्ञान, अनुभव व बुद्धिमत्ता के बल पर सफलता, मार्गदर्शन व शिक्षा में पहचान।",
      nuksan: "अत्यधिक विश्लेषण से निर्णय में देरी हो सकती है।",
      titleEn: "Knowledge & Success Combination",
      labhEn: "Success through knowledge, experience and intelligence; recognition in guidance and education.",
      nuksanEn: "Over-analysis can delay decisions.",
    },
  },
  {
    keys: ["38", "83"],
    data: {
      title: "कंसल्टेंट व रियल एस्टेट संयोजन",
      type: "good",
      labh: "कंसल्टिंग, रियल एस्टेट, प्रॉपर्टी, कंस्ट्रक्शन व इंफ्रास्ट्रक्चर के लिए उत्कृष्ट।",
      nuksan: "कार्यभार अधिक होने से तनाव व जिम्मेदारियों का बोझ।",
      titleEn: "Consultant & Real Estate Combination",
      labhEn: "Excellent for consulting, real estate, property, construction and infrastructure.",
      nuksanEn: "Heavy workload brings stress and the burden of responsibility.",
    },
  },
  {
    keys: ["47"],
    data: {
      title: "बुद्धिमान व विश्लेषणात्मक व्यक्तित्व",
      type: "good",
      labh: "सर्विस इंडस्ट्री, कंसल्टिंग, शिक्षा व रिसर्च में अच्छा प्रदर्शन, समस्या-समाधान की क्षमता।",
      nuksan: "अंतर्मुखी स्वभाव व अत्यधिक संदेह मानसिक थकान दे सकता है।",
      titleEn: "Intelligent & Analytical Personality",
      labhEn: "Performs well in the service industry, consulting, education and research; strong problem-solving ability.",
      nuksanEn: "An introverted nature and excessive doubt can cause mental fatigue.",
    },
  },
  {
    keys: ["74"],
    data: {
      title: "अति-विश्लेषण व धीमी प्रगति",
      type: "bad",
      labh: "गहरी सोच व विश्लेषण क्षमता देता है।",
      nuksan: "अत्यधिक सोच-विचार से निर्णय में देरी, मानसिक थकान व प्रगति में बाधा संभव।",
      titleEn: "Over-analysis & Slow Progress",
      labhEn: "Gives deep thinking and analytical ability.",
      nuksanEn: "Overthinking can delay decisions, cause mental fatigue and hold back progress.",
    },
  },
  {
    keys: ["49", "94"],
    data: {
      title: "निरंतर मेहनत से सफलता",
      type: "good",
      labh: "सरकारी सेवा, रक्षा, एविएशन, हॉस्पिटैलिटी व हेल्थकेयर में अच्छे अवसर।",
      nuksan: "सफलता देर से मिलती है — अनुशासन व धैर्य आवश्यक।",
      titleEn: "Success Through Consistent Hard Work",
      labhEn: "Good opportunities in government service, defence, aviation, hospitality and healthcare.",
      nuksanEn: "Success comes late — discipline and patience are essential.",
    },
  },
  {
    keys: ["25", "52"],
    data: {
      title: "स्ट्रेटेजिक थिंकर व एडवाइज़र",
      type: "good",
      labh: "प्रैक्टिकल समाधान देने की क्षमता, तार्किक दृष्टिकोण व दीर्घकालिक संबंध।",
      nuksan: "अत्यधिक व्यावहारिकता से भावनात्मक दूरी बन सकती है।",
      titleEn: "Strategic Thinker & Advisor",
      labhEn: "Ability to offer practical solutions, a logical outlook and long-term relationships.",
      nuksanEn: "Being overly practical can create emotional distance.",
    },
  },
  {
    keys: ["55"],
    data: {
      title: "उत्तम संचार गुणवत्ता",
      type: "good",
      labh: "व्यापार, मार्केटिंग, सेल्स व पब्लिक डीलिंग के लिए शुभ; रिश्तों में समझ बढ़ाता है।",
      nuksan: "अत्यधिक चंचलता व एक साथ कई काम करने से बिखराव।",
      titleEn: "Excellent Communication",
      labhEn: "Auspicious for business, marketing, sales and public dealing; improves understanding in relationships.",
      nuksanEn: "Restlessness and multitasking can scatter your energy.",
    },
  },
  {
    keys: ["89", "98"],
    data: {
      title: "अथॉरिटी व प्रोफेशनल सक्सेस",
      type: "good",
      labh: "लीगल एडवाइज़र, बिज़नेस कंसल्टेंट व प्रोफेशनल एक्सपर्ट्स के लिए उत्कृष्ट; उच्च पद दिलाता है।",
      nuksan: "भाई-बहनों से मतभेद व आक्रामकता बढ़ने की संभावना।",
      titleEn: "Authority & Professional Success",
      labhEn: "Excellent for legal advisors, business consultants and professional experts; brings high positions.",
      nuksanEn: "Possible disagreements with siblings and increased aggression.",
    },
  },
  {
    keys: ["57", "75"],
    data: {
      title: "एक्सीलेंट कम्युनिकेशन व लीडरशिप",
      type: "good",
      labh: "मार्केटिंग, सेल्स, एजुकेशन, मीडिया व काउंसलिंग के लिए उपयुक्त; कोच बनने की क्षमता।",
      nuksan: "अत्यधिक आत्मविश्वास कभी-कभी दूसरों को हावी लग सकता है।",
      titleEn: "Excellent Communication & Leadership",
      labhEn: "Suited to marketing, sales, education, media and counselling; potential to become a coach.",
      nuksanEn: "Overconfidence can sometimes come across as domineering.",
    },
  },
  {
    keys: ["68", "86"],
    data: {
      title: "हेल्थकेयर प्रोफेशनल्स के लिए बना संयोजन",
      type: "mixed",
      labh: "डॉक्टर, नर्स, सर्जन, फिजियोथेरेपी व थेरेपी क्षेत्र के लिए अनुकूल।",
      nuksan: "हेल्थकेयर से न जुड़े होने पर बार-बार स्वास्थ्य चुनौतियों का सामना।",
      titleEn: "A Combination Made for Healthcare Professionals",
      labhEn: "Favourable for doctors, nurses, surgeons, physiotherapy and therapy.",
      nuksanEn: "If you are not in healthcare, you may face repeated health challenges.",
    },
  },
  {
    keys: ["17", "71"],
    data: {
      title: "नौकरी एवं सेवा क्षेत्र के लिए शुभ",
      type: "good",
      labh: "करियर में प्रगति, उन्नति व स्थिरता का समर्थन करता है।",
      nuksan: "स्वतंत्र व्यापार के लिए उतना अनुकूल नहीं — जोखिम से बचें।",
      titleEn: "Auspicious for Jobs & the Service Sector",
      labhEn: "Supports career progress, advancement and stability.",
      nuksanEn: "Not as favourable for independent business — avoid risks.",
    },
  },
  {
    keys: ["19", "91"],
    data: {
      title: "व्यापार एवं उद्यमिता के लिए शुभ",
      type: "good",
      labh: "नेतृत्व क्षमता, व्यवसाय विस्तार व नए अवसरों में सहयोग करता है।",
      nuksan: "अत्यधिक आक्रामक निर्णय व प्रतिस्पर्धा में टकराव।",
      titleEn: "Auspicious for Business & Entrepreneurship",
      labhEn: "Supports leadership, business expansion and new opportunities.",
      nuksanEn: "Overly aggressive decisions and clashes with competitors.",
    },
  },
  {
    keys: ["16", "61"],
    data: {
      title: "स्वास्थ्य, धन व रिश्तों में बाधा",
      type: "bad",
      labh: "आत्मनिरीक्षण और सतर्कता बढ़ाता है, संयम सिखाता है।",
      nuksan: "मूत्र मार्ग (UTI), आर्थिक चुनौतियाँ, नौकरी में रुकावट, दुर्घटना की आशंका, रिश्तों व जीवनसाथी के स्वास्थ्य पर प्रभाव।",
      titleEn: "Obstacles in Health, Wealth & Relationships",
      labhEn: "Encourages introspection and caution; teaches restraint.",
      nuksanEn: "Urinary tract issues (UTI), financial challenges, job setbacks, risk of accidents, and effects on relationships and your spouse's health.",
    },
  },
  {
    keys: ["18", "81"],
    data: {
      title: "सूर्य-शनि — पिता-पुत्र संबंधों के लिए शुभ नहीं",
      type: "bad",
      labh: "कठिन परिश्रम व अनुशासन से देर में स्थायी सफलता संभव।",
      nuksan: "आर्थिक संघर्ष, कर्ज, धन हानि, विलंबित प्रगति और पिता से मतभेद।",
      titleEn: "Sun-Saturn — Not Good for Father-Son Relations",
      labhEn: "Lasting success is possible, though late, through hard work and discipline.",
      nuksanEn: "Financial struggle, debt, money loss, delayed progress and disagreements with your father.",
    },
  },
  {
    keys: ["27", "72"],
    data: {
      title: "छूटे हुए अवसर",
      type: "bad",
      labh: "अंतर्ज्ञान व आध्यात्मिक रुझान बढ़ाता है।",
      nuksan: "गलत निर्णय से अवसर छूटना और आर्थिक हानि की संभावना।",
      titleEn: "Missed Opportunities",
      labhEn: "Enhances intuition and spiritual inclination.",
      nuksanEn: "Wrong decisions can lead to missed opportunities and financial loss.",
    },
  },
  {
    keys: ["35", "53"],
    data: {
      title: "आर्थिक असंतुलन",
      type: "bad",
      labh: "संचार व नेटवर्किंग की अच्छी क्षमता देता है।",
      nuksan: "खर्च अधिक, बचत कम — धन का प्रवाह रुकने की प्रवृत्ति।",
      titleEn: "Financial Imbalance",
      labhEn: "Gives good communication and networking ability.",
      nuksanEn: "High spending, low savings — a tendency for money flow to get blocked.",
    },
  },
  {
    keys: ["67", "76"],
    data: {
      title: "वैवाहिक जीवन में समृद्धि",
      type: "good",
      labh: "रिश्तों में गहराई, वैवाहिक जीवन में स्थिरता व आर्थिक समृद्धि देता है।",
      nuksan: "व्यस्तता से संवाद कम हो सकता है — समय निकालें।",
      titleEn: "Prosperity in Married Life",
      labhEn: "Brings depth in relationships, stability in marriage and financial prosperity.",
      nuksanEn: "Busy schedules can reduce communication — make time for each other.",
    },
  },
  {
    keys: ["48", "84"],
    data: {
      title: "तनाव व दीर्घकालिक चुनौतियाँ",
      type: "bad",
      labh: "कठिन परिस्थितियों में सहनशक्ति व धैर्य विकसित करता है।",
      nuksan: "मानसिक दबाव, चिंता, दीर्घकालिक स्वास्थ्य समस्याएँ व दुर्घटना की प्रवृत्ति।",
      titleEn: "Stress & Long-term Challenges",
      labhEn: "Builds endurance and patience in difficult situations.",
      nuksanEn: "Mental pressure, anxiety, long-term health problems and a tendency toward accidents.",
    },
  },
  {
    keys: ["44"],
    data: {
      title: "दोहरा राहु — प्रयोग न करें",
      type: "bad",
      labh: "कोई विशेष लाभ नहीं — केवल अत्यधिक जोखिम-प्रवृत्ति।",
      nuksan: "बाधाएँ, अस्थिरता व नकारात्मकता; अचानक हानि, मानसिक तनाव व भ्रम की स्थिति।",
      titleEn: "Double Rahu — Avoid Using",
      labhEn: "No real benefit — only an excessive appetite for risk.",
      nuksanEn: "Obstacles, instability and negativity; sudden losses, mental stress and confusion.",
    },
  },
  {
    keys: ["28", "82"],
    data: {
      title: "चंद्र-शनि — भावनात्मक भारीपन",
      type: "bad",
      labh: "गंभीरता व जिम्मेदारी की भावना देता है।",
      nuksan: "उदासी, अकेलापन व मानसिक तनाव की प्रवृत्ति।",
      titleEn: "Moon-Saturn — Emotional Heaviness",
      labhEn: "Gives seriousness and a sense of responsibility.",
      nuksanEn: "Tendency toward sadness, loneliness and mental stress.",
    },
  },
  {
    keys: ["26", "62"],
    data: {
      title: "चंद्र-शुक्र असंतुलन",
      type: "bad",
      labh: "कला व सौंदर्य के प्रति रुचि बढ़ाता है।",
      nuksan: "भावनात्मक निर्भरता और रिश्तों में उतार-चढ़ाव।",
      titleEn: "Moon-Venus Imbalance",
      labhEn: "Increases interest in art and beauty.",
      nuksanEn: "Emotional dependence and ups and downs in relationships.",
    },
  },
  {
    keys: ["45", "54"],
    data: {
      title: "राहु-बुध — अस्थिर निर्णय",
      type: "bad",
      labh: "तेज़ दिमाग और नई तकनीक में रुचि।",
      nuksan: "जल्दबाज़ी, अफवाह व गलत सलाह से नुकसान की संभावना।",
      titleEn: "Rahu-Mercury — Unstable Decisions",
      labhEn: "Sharp mind and interest in new technology.",
      nuksanEn: "Possible losses from haste, rumours and bad advice.",
    },
  },
  {
    keys: ["10", "20", "30", "40", "60", "70", "80", "90"],
    data: {
      title: "शून्य युक्त संयोजन",
      type: "bad",
      labh: "किसी अंक की ऊर्जा को दिशा मिलने पर परिणाम बढ़ सकते हैं।",
      nuksan: "शून्य ऊर्जा को खाली करता है — परिणाम में देरी व अस्थिरता देता है।",
      titleEn: "Combinations with Zero",
      labhEn: "Results can grow when a digit's energy gets direction.",
      nuksanEn: "Zero drains energy — causes delays and instability in results.",
    },
  },
  {
    keys: ["11"],
    data: {
      title: "अंतर्ज्ञान व आध्यात्मिक शक्ति",
      type: "good",
      labh: "मास्टर नंबर — अंतर्ज्ञान, मानसिक शक्ति व आध्यात्मिक उन्नति देता है।",
      nuksan: "अत्यधिक संवेदनशीलता से निर्णय प्रभावित हो सकते हैं।",
      titleEn: "Intuition & Spiritual Power",
      labhEn: "Master number — gives intuition, mental strength and spiritual growth.",
      nuksanEn: "Excessive sensitivity can affect decisions.",
    },
  },
  {
    keys: ["22"],
    data: {
      title: "मास्टर बिल्डर — बड़ी उपलब्धियाँ",
      type: "good",
      labh: "बड़े लक्ष्य, व्यवस्थित निर्माण व स्थायी सफलता का योग देता है।",
      nuksan: "अत्यधिक परिश्रम व जिम्मेदारी का बोझ महसूस हो सकता है।",
      titleEn: "Master Builder — Great Achievements",
      labhEn: "Brings big goals, systematic building and lasting success.",
      nuksanEn: "You may feel burdened by overwork and responsibility.",
    },
  },
  {
    keys: ["39"],
    data: {
      title: "रचनात्मकता व दूरदर्शिता",
      type: "good",
      labh: "कला, शिक्षा व मार्गदर्शन के कार्यों में सफलता देता है।",
      nuksan: "अत्यधिक विचारशीलता से निर्णय में देरी हो सकती है।",
      titleEn: "Creativity & Vision",
      labhEn: "Brings success in art, education and guidance work.",
      nuksanEn: "Too much deliberation can delay decisions.",
    },
  },
  {
    keys: ["56"],
    data: {
      title: "अस्थिर निर्णय व बिखराव",
      type: "bad",
      labh: "तकनीकी व नए विचारों में रुचि देता है।",
      nuksan: "जल्दबाज़ी में निर्णय, धन का बिखराव व मित्रों से मतभेद संभव।",
      titleEn: "Unstable Decisions & Scattered Energy",
      labhEn: "Gives interest in technology and new ideas.",
      nuksanEn: "Hasty decisions, scattered money and disagreements with friends are possible.",
    },
  },
  {
    keys: ["58"],
    data: {
      title: "आर्थिक अनियमितता",
      type: "bad",
      labh: "मेहनत से आय के अवसर बनते हैं।",
      nuksan: "खर्च अनियंत्रित, बचत में बाधा व योजनाओं में विलंब देता है।",
      titleEn: "Financial Irregularity",
      labhEn: "Hard work creates income opportunities.",
      nuksanEn: "Uncontrolled spending, difficulty saving and delays in plans.",
    },
  },
  {
    keys: ["77"],
    data: {
      title: "आध्यात्मिक व कम्युनिकेशन शक्ति",
      type: "good",
      labh: "मार्गदर्शन, काउंसलिंग, शिक्षा व मीडिया में उत्कृष्ट सफलता देता है।",
      nuksan: "आत्मविश्वास की अधिकता से कभी दूसरों पर हावी होने की प्रवृत्ति।",
      titleEn: "Spiritual & Communication Power",
      labhEn: "Brings outstanding success in guidance, counselling, education and media.",
      nuksanEn: "Overconfidence can sometimes make you dominate others.",
    },
  },
  {
    keys: ["85"],
    data: {
      title: "शनि-बुध — संघर्ष व देरी",
      type: "bad",
      labh: "अनुशासन व परिश्रम से स्थायी सफलता संभव।",
      nuksan: "कार्यों में देरी, आर्थिक दबाव व मानसिक तनाव की प्रवृत्ति।",
      titleEn: "Saturn-Mercury — Struggle & Delays",
      labhEn: "Lasting success is possible through discipline and hard work.",
      nuksanEn: "Tendency toward delays in work, financial pressure and mental stress.",
    },
  },
  {
    keys: ["88"],
    data: {
      title: "धन व अथॉरिटी का संयोजन",
      type: "good",
      labh: "आर्थिक उन्नति, उच्च पद व प्रशासनिक शक्ति देता है।",
      nuksan: "कठोर व्यवहार व निरंतर कार्यभार से तनाव संभव।",
      titleEn: "Combination of Wealth & Authority",
      labhEn: "Brings financial growth, high positions and administrative power.",
      nuksanEn: "Harsh behaviour and constant workload can cause stress.",
    },
  },
  {
    keys: ["93"],
    data: {
      title: "सेवा व समृद्धि",
      type: "good",
      labh: "समाज सेवा, हेल्थकेयर व धार्मिक कार्यों के साथ आर्थिक समृद्धि देता है।",
      nuksan: "दूसरों की मदद में अपना समय-धन अधिक लग सकता है।",
      titleEn: "Service & Prosperity",
      labhEn: "Brings financial prosperity along with social service, healthcare and religious work.",
      nuksanEn: "Helping others may take up too much of your own time and money.",
    },
  },
  {
    keys: ["99"],
    data: {
      title: "मानवता व परिपूर्णता",
      type: "good",
      labh: "परोपकार, उदारता व सम्मान का योग देता है; कार्य पूर्णता की ओर ले जाता है।",
      nuksan: "भावुकता में लिए निर्णय कभी-कभी नुकसान करा सकते हैं।",
      titleEn: "Humanity & Fulfilment",
      labhEn: "Brings philanthropy, generosity and respect; leads work to completion.",
      nuksanEn: "Emotional decisions can sometimes cause losses.",
    },
  },
];

// उपयोगकर्ता द्वारा तय श्रेणियाँ — ये सभी entry types पर लागू होंगी
const GOOD_KEYS = new Set([
  "11", "12", "13", "15", "17", "19", "22", "23", "25", "29", "31", "32", "33",
  "36", "37", "38", "39", "47", "49", "51", "52", "55", "57", "59", "63", "67",
  "69", "71", "73", "75", "76", "77", "78", "83", "87", "88", "91", "92", "93",
  "94", "95", "96", "99",
]);

// 74 व 81 दोनों lists में थे — समस्याग्रस्त (bad) रखा गया है
const BAD_KEYS = new Set([
  "14", "16", "18", "21", "24", "26", "27", "28", "34", "35", "41", "42", "43",
  "44", "45", "46", "48", "53", "54", "56", "58", "61", "62", "64", "68", "72",
  "74", "79", "81", "82", "84", "85", "86", "89", "97", "98",
]);

export const COMBO_INFO: Record<string, ComboInfo> = RAW.reduce((acc, entry) => {
  const pair = entry.keys.join(" / ");
  entry.keys.forEach((k) => {
    const type: ComboType = BAD_KEYS.has(k) ? "bad" : GOOD_KEYS.has(k) ? "good" : entry.data.type;
    acc[k] = { pair, ...entry.data, type };
  });
  return acc;
}, {} as Record<string, ComboInfo>);

export const getComboInfo = (combo: string): ComboInfo | undefined => COMBO_INFO[combo];
