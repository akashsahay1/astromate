export interface PoojaPackage {
  badge: string;
  name: string;
  sub: string;
  price: string;
}

export interface PoojaBenefit {
  title: string;
  text: string;
}

export interface PoojaFaq {
  q: string;
  a: string;
}

export interface PoojaService {
  id: string;
  title: string;
  enTitle: string;
  desc: string;
  descEn: string;
  enDesc: string;
  about: string;
  aboutEn: string;
  price: string;
  gradient: string;
  image?: string;
  benefits: PoojaBenefit[];
  receive: string[];
  process: string[];
  packages: PoojaPackage[];
  faqs: PoojaFaq[];
}

export const poojaServices: PoojaService[] = [
  {
    id: "ganesh",
    title: "श्री गणेश पूजा",
    enTitle: "Ganesh Pooja",
    desc: "भगवान गणेश को समर्पित, जिन्हें 'बाधाओं को दूर करने वाले' देवता के रूप में जाना जाता है।",
    descEn: "Dedicated to Lord Ganesha, revered as the remover of obstacles.",
    enDesc: "Sacred Ritual for Lord Ganesha Worship",
    about: "श्री गणेश पूजा विघ्नहर्ता भगवान गणेश को समर्पित एक पवित्र अनुष्ठान है। गणेश जी को प्रथम पूज्य माना जाता है और किसी भी शुभ कार्य की शुरुआत उनकी पूजा से होती है। यह पूजा जीवन की बाधाओं को दूर करने, बुद्धि प्राप्त करने और समृद्धि लाने के लिए की जाती है।",
    aboutEn: "Shri Ganesh Pooja is a sacred ritual dedicated to Lord Ganesha, the Vighnaharta (remover of obstacles). Ganesha is worshipped first, and every auspicious undertaking begins with his pooja. It is performed to clear obstacles in life, gain wisdom and bring prosperity.",
    price: "₹2,100",
    gradient: "from-orange-500 via-amber-400 to-orange-600",
    benefits: [
      { title: "Obstacle Removal", text: "Removes all obstacles from personal and professional life, ensuring smooth progress in every endeavor." },
      { title: "New Beginnings", text: "Blesses new ventures, businesses, marriages, and any auspicious start with divine energy." },
      { title: "Wisdom & Intelligence", text: "Enhances intellect, decision-making ability, and overall mental clarity for better outcomes." },
    ],
    receive: ["Puja video on WhatsApp within 3-4 days", "Divine Aashirwad Box delivered in 8-10 days", "Personalized Sankalp with your name", "Prasad blessed by Panditji", "Digital Puja Certificate", "Ganesh Yantra (Energized)"],
    process: ["Book your puja online by selecting date and package", "Provide your name, gotra, and sankalp details", "Panditji performs the complete puja on the chosen date", "Receive live video or recorded puja video on WhatsApp", "Aashirwad box with prasad delivered to your home"],
    packages: [
      { badge: "1 Person", name: "Live Pooja Via Video Call", sub: "Pooja Prasad · Video Call with Pandit", price: "₹3,100" },
      { badge: "1 Person", name: "Pooja", sub: "Pooja Prasad", price: "₹2,100" },
    ],
    faqs: [
      { q: "Can I do this puja for my family?", a: "Yes, the Sankalp will include all family members names and gotras." },
      { q: "How will I receive the prasad?", a: "Prasad and Aashirwad Box will be delivered to your registered address within 8-10 business days." },
      { q: "Is the pandit experienced?", a: "All our pandits are verified, highly experienced, and trained in Vedic rituals for 20+ years." },
    ],
  },
  {
    id: "hanuman",
    title: "हनुमान जी की पूजा",
    enTitle: "Hanuman Pooja",
    desc: "शक्ति और भक्ति के लिए भगवान हनुमान की पूजा।",
    descEn: "Worship of Lord Hanuman for strength and devotion.",
    enDesc: "Sacred Ritual for Lord Hanuman Worship",
    about: "हनुमान जी की पूजा बजरंगबली को समर्पित है। हनुमान जी शक्ति, भक्ति और साहस के प्रतीक हैं। यह पूजा भय निवारण, शनि दोष शांति और मानसिक शक्ति प्राप्ति के लिए की जाती है।",
    aboutEn: "Hanuman Pooja is dedicated to Bajrangbali. Hanuman ji is the embodiment of strength, devotion and courage. This pooja is performed to overcome fear, pacify Shani Dosha and gain mental strength.",
    price: "₹1,100",
    gradient: "from-red-700 via-red-500 to-indigo-900",
    benefits: [
      { title: "Fear Removal", text: "Removes fear and anxiety, providing courage and confidence in all aspects of life." },
      { title: "Shani Dosh Relief", text: "Powerful remedy for Shani Dosh and Sade Sati effects on your horoscope." },
      { title: "Strength & Protection", text: "Grants physical and mental strength, divine protection from negative energies." },
    ],
    receive: ["Puja video on WhatsApp", "Aashirwad Box with Prasad", "Personalized Sankalp", "Hanuman Yantra", "Digital Puja Certificate", "Sindoor Prasad"],
    process: ["Book puja by selecting your preferred date", "Share your name, gotra and sankalp details", "Panditji performs puja with Hanuman Chalisa path", "Receive complete puja video on WhatsApp", "Prasad delivered to your doorstep"],
    packages: [
      { badge: "1 Person", name: "Live Pooja Via Video Call", sub: "Pooja Prasad · Video Call with Pandit", price: "₹2,100" },
      { badge: "1 Person", name: "Pooja", sub: "Pooja Prasad", price: "₹1,100" },
    ],
    faqs: [
      { q: "On which day is this puja most effective?", a: "Tuesday and Saturday are considered the most auspicious days for Hanuman Puja." },
      { q: "Can women participate?", a: "Yes, everyone can participate. Hanuman ji blesses all devotees equally." },
    ],
  },
  {
    id: "satyanarayan",
    title: "श्री सत्यनारायण पूजा",
    enTitle: "Satyanarayan Pooja",
    desc: "यह अनुष्ठान भगवान विष्णु को समर्पित है। यह अक्सर गृह प्रवेश या विवाह समारोहों में किया जाता है।",
    descEn: "A ritual dedicated to Lord Vishnu, often performed at housewarmings and weddings.",
    enDesc: "Sacred Ritual for Lord Satyanarayan Worship",
    about: "श्री सत्यनारायण पूजा भगवान विष्णु के सत्य स्वरूप को समर्पित है। यह पूजा मनोकामना पूर्ति, पारिवारिक सुख और समृद्धि के लिए की जाती है। पूर्णिमा के दिन यह पूजा विशेष फलदायी मानी जाती है।",
    aboutEn: "Shri Satyanarayan Pooja is dedicated to Lord Vishnu in his form as the embodiment of truth. It is performed for the fulfilment of wishes, family happiness and prosperity, and is considered especially fruitful on Purnima (full moon day).",
    price: "₹2,100",
    gradient: "from-blue-800 via-purple-700 to-blue-600",
    benefits: [
      { title: "Wish Fulfillment", text: "Fulfills heartfelt desires and brings divine grace into your life." },
      { title: "Family Harmony", text: "Strengthens family bonds and brings peace and happiness in domestic life." },
      { title: "Prosperity", text: "Attracts wealth, success, and overall prosperity for the household." },
    ],
    receive: ["Puja video on WhatsApp", "Aashirwad Box with Prasad", "Personalized Sankalp", "Satyanarayan Katha Book", "Digital Puja Certificate", "Panchamrit Prasad"],
    process: ["Book puja online with your details", "Share name, gotra and sankalp information", "Panditji performs full Satyanarayan Katha", "Receive complete puja video", "Prasad box delivered to your home"],
    packages: [
      { badge: "1 Person", name: "Live Pooja Via Video Call", sub: "Pooja Prasad · Video Call with Pandit", price: "₹3,100" },
      { badge: "1 Person", name: "Pooja", sub: "Pooja Prasad", price: "₹2,100" },
    ],
    faqs: [
      { q: "When is the best time for this puja?", a: "Purnima (full moon day) is considered the most auspicious for Satyanarayan Puja." },
      { q: "Can the whole family participate?", a: "Yes, this puja is meant for the entire family's wellbeing and all members can join." },
    ],
  },
  {
    id: "navgrah",
    title: "नवग्रह पूजा",
    enTitle: "Navgrah Pooja",
    desc: "नौ खगोलीय पिंडों (सूर्य, चंद्रमा, मंगल, बुध, बृहस्पति, शुक्र, शनि, राहु और केतु) की पूजा।",
    descEn: "Worship of the nine celestial bodies (Sun, Moon, Mars, Mercury, Jupiter, Venus, Saturn, Rahu and Ketu).",
    enDesc: "Sacred Ritual for Nine Planets Worship",
    about: "नवग्रह पूजा नौ ग्रहों की शांति के लिए विशेष अनुष्ठान है। कुंडली में ग्रहों की प्रतिकूल स्थिति के कारण आने वाली समस्याओं का निवारण इस पूजा से किया जाता है। यह जीवन में संतुलन और सकारात्मकता लाती है।",
    aboutEn: "Navgrah Pooja is a special ritual to pacify the nine planets. It remedies problems caused by unfavourable planetary positions in the kundli (birth chart) and brings balance and positivity into life.",
    price: "₹11,000",
    gradient: "from-violet-800 via-purple-600 to-indigo-900",
    benefits: [
      { title: "Planetary Peace", text: "Pacifies all nine planets and reduces their negative effects on your life." },
      { title: "Dosha Removal", text: "Removes planetary doshas from your horoscope for smoother life journey." },
      { title: "Life Balance", text: "Brings overall balance, harmony and positive energy in all aspects of life." },
    ],
    receive: ["Puja video on WhatsApp", "Aashirwad Box with Prasad", "Personalized Sankalp", "Navgrah Yantra (Energized)", "Digital Puja Certificate", "Nine Grains Prasad"],
    process: ["Share your Kundali details for analysis", "Panditji identifies problematic planetary positions", "Complete Navgrah Shanti puja performed", "Each planet propitiated with specific mantras", "Video and Yantra delivered to you"],
    packages: [
      { badge: "1 Person", name: "Premium Puja with Havan", sub: "Yantra + Prasad · Video Call with Pandit", price: "₹15,000" },
      { badge: "1 Person", name: "Live Pooja Via Video Call", sub: "Pooja Prasad · Video Call with Pandit", price: "₹13,000" },
      { badge: "1 Person", name: "Pooja", sub: "Pooja Prasad", price: "₹11,000" },
    ],
    faqs: [
      { q: "Do I need my birth chart?", a: "Yes, sharing your birth details helps Panditji customize the puja for your specific planetary positions." },
      { q: "How often should this be done?", a: "Once a year or during major planetary transits (dasha changes) is recommended." },
    ],
  },
  {
    id: "mangal",
    title: "मंगल दोष पूजा",
    enTitle: "Mangal Dosh Nivaran Puja",
    desc: "जन्म कुंडली में मंगल की प्रतिकूल स्थिति होने पर उसे शांत करने के लिए यह अनुष्ठान किया जाता है।",
    descEn: "Performed to pacify Mars when it is unfavourably placed in the birth chart.",
    enDesc: "For Mangaldosh Shanti and Positive Results",
    about: "मंगल दोष निवारण पूजा उन व्यक्तियों के लिए है जिनकी कुंडली में मंगल ग्रह प्रतिकूल स्थिति में है। यह दोष विवाह में बाधा, वैवाहिक कलह और स्वास्थ्य समस्याओं का कारण बन सकता है। इस पूजा से मंगल ग्रह की शांति होती है।",
    aboutEn: "Mangal Dosha Nivaran Pooja is for those whose kundli has Mars in an unfavourable position. This dosha can cause delays in marriage, marital discord and health problems. The pooja brings peace to Mars.",
    price: "₹11,000",
    gradient: "from-indigo-950 via-red-600 to-red-900",
    benefits: [
      { title: "Mangal Dosh Shanti", text: "Pacifies the negative effects of Mars in your horoscope for harmonious life." },
      { title: "Marriage Obstacle Removal", text: "Removes barriers in finding a suitable match and ensures happy married life." },
      { title: "Health Benefits", text: "Addresses health issues caused by malefic Mars placement in the birth chart." },
    ],
    receive: ["Puja video on WhatsApp", "Aashirwad Box with Prasad", "Personalized Sankalp", "Mars Yantra (Energized)", "Digital Puja Certificate", "Red Coral recommendation"],
    process: ["Share kundali details for Mangal Dosh analysis", "Pandit confirms severity of Mangal Dosh", "Puja performed on Tuesday at Mangal Mandir", "Red flower, red lentils (masoor dal) offered", "Hanuman Chalisa and Mars mantras recited", "Video and yantra delivered to you"],
    packages: [
      { badge: "1 Person", name: "Premium Puja with Havan", sub: "Yantra + Prasad · Video Call with Pandit", price: "₹15,000" },
      { badge: "1 Person", name: "Live Pooja Via Video Call", sub: "Pooja Prasad · Video Call with Pandit", price: "₹13,000" },
      { badge: "1 Person", name: "Pooja", sub: "Pooja Prasad", price: "₹11,000" },
    ],
    faqs: [
      { q: "Is this puja necessary before marriage?", a: "If your Kundali shows Mangal Dosh, this puja is highly recommended before marriage for marital harmony." },
      { q: "How many times should this puja be done?", a: "Ideally performed once before marriage. In severe cases, it may be recommended annually on Tuesdays." },
    ],
  },
  {
    id: "shani",
    title: "शनि दोष पूजा",
    enTitle: "Shani Dosha Nivaran Puja",
    desc: "शनि ग्रह के प्रतिकूल प्रभाव को शांत करने के लिए यह अनुष्ठान किया जाता है।",
    descEn: "Performed to pacify the adverse effects of Saturn.",
    enDesc: "A Powerful Ritual for Shani Dosha Relief",
    about: "शनि दोष निवारण पूजा साढ़े साती, शनि दशा या शनि की प्रतिकूल स्थिति से पीड़ित व्यक्तियों के लिए है। शनि देव न्याय के देवता हैं और उनकी कृपा से जीवन में स्थिरता, सफलता और मानसिक शांति प्राप्त होती है।",
    aboutEn: "Shani Dosha Nivaran Pooja is for those affected by Sade Sati, Shani Dasha or an unfavourable Saturn. Shani Dev is the god of justice, and his grace brings stability, success and peace of mind.",
    price: "₹7,500",
    gradient: "from-gray-950 via-indigo-950 to-black",
    benefits: [
      { title: "Sade Sati Relief", text: "Reduces the challenging effects of Sade Sati period on your career and personal life." },
      { title: "Shani Dosh Removal", text: "Pacifies Saturn's malefic effects and brings stability to your horoscope." },
      { title: "Mental Peace", text: "Provides mental tranquility and relief from anxiety caused by Saturn's influence." },
    ],
    receive: ["Puja video on WhatsApp", "Aashirwad Box with Prasad", "Personalized Sankalp", "Shani Yantra (Energized)", "Digital Puja Certificate", "Black Sesame Prasad"],
    process: ["Share your Kundali for Shani analysis", "Panditji determines the impact of Saturn", "Puja performed on Saturday at Shani temple", "Til (sesame), mustard oil offered to Shani Dev", "Shani Stotra and mantras recited 108 times", "Video, Yantra and Prasad delivered"],
    packages: [
      { badge: "1 Person", name: "Premium Puja with Havan", sub: "Yantra + Prasad · Video Call with Pandit", price: "₹11,000" },
      { badge: "1 Person", name: "Live Pooja Via Video Call", sub: "Pooja Prasad · Video Call with Pandit", price: "₹9,500" },
      { badge: "1 Person", name: "Pooja", sub: "Pooja Prasad", price: "₹7,500" },
    ],
    faqs: [
      { q: "How long does Sade Sati last?", a: "Sade Sati lasts approximately 7.5 years. This puja helps mitigate its effects throughout the period." },
      { q: "Should I do this puja every Saturday?", a: "The main puja is done once. Regular Saturday prayers to Shani Dev are additionally beneficial." },
    ],
  },
  {
    id: "prem",
    title: "प्रेम प्राप्ति पूजा",
    enTitle: "Prem Prapti Siddh Puja",
    desc: "कामदेव या भगवान कृष्ण को समर्पित, ताकि सच्चा प्यार मिल सके।",
    descEn: "Dedicated to Kamadeva or Lord Krishna, to help you find true love.",
    enDesc: "A Powerful Puja to Attract Love",
    about: "प्रेम प्राप्ति सिद्ध पूजा सच्चा प्यार पाने और रिश्तों में सुधार के लिए की जाती है। यह पूजा भगवान कृष्ण और राधा रानी को समर्पित है। यह प्रेम, वैवाहिक सुख और रिश्तों में मधुरता लाने के लिए विशेष रूप से प्रभावी है।",
    aboutEn: "Prem Prapti Siddh Pooja is performed to find true love and improve relationships. Dedicated to Lord Krishna and Radha Rani, it is especially effective for bringing love, marital happiness and sweetness into relationships.",
    price: "₹5,000",
    gradient: "from-pink-800 via-pink-500 to-pink-900",
    benefits: [
      { title: "Attract True Love", text: "Helps attract a loving and compatible life partner into your life." },
      { title: "Relationship Improvement", text: "Strengthens existing relationships and resolves conflicts between partners." },
      { title: "Marital Bliss", text: "Enhances love, understanding, and harmony in married life." },
    ],
    receive: ["Puja video on WhatsApp", "Aashirwad Box with Prasad", "Personalized Sankalp", "Love Yantra (Energized)", "Digital Puja Certificate", "Rose Petal Prasad"],
    process: ["Book puja with your details and intentions", "Share your name and gotra for Sankalp", "Puja performed with rose flowers and sweets", "Krishna-Radha mantras and love sutras recited", "Video and Prasad delivered to you"],
    packages: [
      { badge: "1 Person", name: "Live Pooja Via Video Call", sub: "Pooja Prasad · Video Call with Pandit", price: "₹7,000" },
      { badge: "1 Person", name: "Pooja", sub: "Pooja Prasad", price: "₹5,000" },
    ],
    faqs: [
      { q: "Will this help me find my soulmate?", a: "This puja creates positive energy around you that attracts compatible and loving partners." },
      { q: "Can couples do this together?", a: "Yes, couples can jointly participate to strengthen their bond and love." },
    ],
  },
  {
    id: "kasht",
    title: "संपूर्ण कष्ट निवारण महा पूजा",
    enTitle: "Sampurn Kasht Nivaran Maha Puja",
    desc: "यह एक व्यापक अनुष्ठान है जिसे एक साथ कई जीवन समस्याओं के समाधान के लिए बनाया गया है।",
    descEn: "A comprehensive ritual designed to resolve many of life's problems at once.",
    enDesc: "A Divine Ritual for Removal of All Difficulties",
    about: "संपूर्ण कष्ट निवारण महा पूजा सभी प्रकार की समस्याओं के समाधान के लिए एक व्यापक अनुष्ठान है। यह पूजा ग्रह दोष, स्वास्थ्य समस्या, आर्थिक कठिनाई, पारिवारिक कलह और अन्य जीवन की समस्याओं का समाधान करती है।",
    aboutEn: "Sampurn Kasht Nivaran Maha Pooja is a comprehensive ritual to resolve all kinds of difficulties. It addresses Graha Dosha, health issues, financial hardship, family discord and other problems in life.",
    price: "₹5,000",
    gradient: "from-red-950 via-red-900 to-red-950",
    benefits: [
      { title: "All Problem Solution", text: "Comprehensive solution addressing multiple life challenges simultaneously." },
      { title: "Planetary Peace", text: "Pacifies all malefic planetary influences causing difficulties in your life." },
      { title: "Prosperity & Growth", text: "Opens pathways for prosperity, growth, and positive transformations." },
    ],
    receive: ["Puja video on WhatsApp", "Aashirwad Box with Prasad", "Personalized Sankalp", "Sarva Dosha Nivaran Yantra", "Digital Puja Certificate", "Special Havan Prasad"],
    process: ["Share your problems and Kundali details", "Panditji analyzes root cause of difficulties", "Comprehensive Maha Puja performed", "Multiple deity invocations and Havan", "Video and special Prasad delivered"],
    packages: [
      { badge: "1 Person", name: "Live Pooja Via Video Call", sub: "Pooja Prasad · Video Call with Pandit", price: "₹7,000" },
      { badge: "1 Person", name: "Pooja", sub: "Pooja Prasad", price: "₹5,000" },
    ],
    faqs: [
      { q: "What kind of problems can this solve?", a: "This comprehensive puja addresses health, financial, career, relationship, and spiritual issues all at once." },
      { q: "Is one puja enough?", a: "For most people, one comprehensive session is sufficient. Severe cases may benefit from follow-up sessions." },
    ],
  },
  {
    id: "kaalsarp",
    title: "काल सर्प दोष पूजा",
    enTitle: "Trimbakeshwar Kaal Sarp Puja",
    desc: "यह क्रिया तब की जाती है जब सभी ग्रह राहु और केतु के बीच स्थित हों।",
    descEn: "Performed when all the planets lie between Rahu and Ketu.",
    enDesc: "Sacred Ritual for Kaal Sarp Dosha Shanti",
    about: "काल सर्प दोष पूजा त्र्यंबकेश्वर ज्योतिर्लिंग में की जाती है। जब कुंडली में सभी ग्रह राहु और केतु के बीच आ जाते हैं, तब काल सर्प दोष बनता है। यह दोष जीवन में कई प्रकार की बाधाएं उत्पन्न करता है।",
    aboutEn: "Kaal Sarp Dosha Pooja is performed at the Trimbakeshwar Jyotirlinga. Kaal Sarp Dosha forms when all planets in the kundli fall between Rahu and Ketu, and it creates many kinds of obstacles in life.",
    price: "₹11,000",
    gradient: "from-green-950 via-green-700 to-green-950",
    benefits: [
      { title: "Kaal Sarp Shanti", text: "Pacifies the dreaded Kaal Sarp Dosha for lasting peace and progress." },
      { title: "Rahu-Ketu Balance", text: "Balances the shadow planets' influence on your destiny and karma." },
      { title: "Life Stability", text: "Brings stability, removes sudden obstacles and unexpected setbacks." },
    ],
    receive: ["Puja video on WhatsApp", "Aashirwad Box with Prasad", "Personalized Sankalp", "Kaal Sarp Yantra (Energized)", "Digital Puja Certificate", "Nag Devta Prasad"],
    process: ["Share Kundali for Kaal Sarp Dosha verification", "Panditji confirms type and severity of dosha", "Puja performed at Trimbakeshwar temple", "Nagbali and special rituals performed", "Sarpa Suktam and specific mantras recited", "Video and Yantra delivered to you"],
    packages: [
      { badge: "1 Person", name: "Premium Puja with Havan", sub: "Yantra + Prasad · Video Call with Pandit", price: "₹15,000" },
      { badge: "1 Person", name: "Live Pooja Via Video Call", sub: "Pooja Prasad · Video Call with Pandit", price: "₹13,000" },
      { badge: "1 Person", name: "Pooja", sub: "Pooja Prasad", price: "₹11,000" },
    ],
    faqs: [
      { q: "How do I know if I have Kaal Sarp Dosha?", a: "If all 7 planets in your birth chart fall between Rahu and Ketu, you have Kaal Sarp Dosha." },
      { q: "Why Trimbakeshwar specifically?", a: "Trimbakeshwar is one of the 12 Jyotirlingas and is considered the most powerful place for Kaal Sarp Dosha Nivaran." },
    ],
  },
  {
    id: "grahpravesh",
    title: "गृह प्रवेश पूजा",
    enTitle: "Grah Pravesh",
    desc: "यह स्थान से नकारात्मक ऊर्जा को दूर करता है और परिवार के समृद्ध जीवन को सुनिश्चित करता है।",
    descEn: "Clears negative energy from the space and ensures a prosperous life for the family.",
    enDesc: "Sacred Ritual for New Home Blessing",
    about: "गृह प्रवेश पूजा नए घर में प्रवेश करने से पहले की जाने वाली महत्वपूर्ण पूजा है। यह वास्तु दोष निवारण, नकारात्मक ऊर्जा को दूर करने और घर में सुख-समृद्धि लाने के लिए की जाती है।",
    aboutEn: "Griha Pravesh Pooja is an important pooja performed before moving into a new home. It is done to remedy Vastu Dosha, clear negative energy and bring happiness and prosperity into the home.",
    price: "₹5,100",
    gradient: "from-green-800 via-lime-500 to-green-700",
    benefits: [
      { title: "Vastu Shanti", text: "Removes Vastu doshas and negative energies from the new home." },
      { title: "Negativity Removal", text: "Cleanses the space of any negative vibrations for a fresh positive start." },
      { title: "Home Happiness", text: "Ensures peace, prosperity, and harmony for all family members in the new home." },
    ],
    receive: ["Puja video on WhatsApp", "Aashirwad Box with Prasad", "Personalized Sankalp", "Vastu Yantra (Energized)", "Digital Puja Certificate", "Sacred Thread Prasad"],
    process: ["Book puja before your home entry date", "Share your name, gotra and new home details", "Panditji performs Vastu Shanti and Griha Pravesh puja", "Havan performed for purification of the space", "Prasad and Yantra delivered to your new home"],
    packages: [
      { badge: "1 Person", name: "Live Pooja Via Video Call", sub: "Pooja Prasad · Video Call with Pandit", price: "₹7,100" },
      { badge: "1 Person", name: "Pooja", sub: "Pooja Prasad", price: "₹5,100" },
    ],
    faqs: [
      { q: "When should Griha Pravesh be done?", a: "On an auspicious date (muhurat) selected based on your horoscope before moving into the new home." },
      { q: "Can this be done for rented homes?", a: "Yes, this puja is beneficial for any new home whether owned or rented." },
    ],
  },
  {
    id: "lakshmi",
    title: "लक्ष्मी पूजा",
    enTitle: "Lakshmi Pooja",
    desc: "धन की देवी की पूजा। यह पूजा मुख्य रूप से दिवाली के दौरान और शुक्रवार को की जाती है।",
    descEn: "Worship of the Goddess of Wealth, performed mainly during Diwali and on Fridays.",
    enDesc: "Sacred Ritual for Lord Lakshmi Worship",
    about: "लक्ष्मी पूजा धन की देवी माता लक्ष्मी को समर्पित है। यह पूजा आर्थिक समृद्धि, व्यापार वृद्धि और धन प्राप्ति के लिए की जाती है। दिवाली और शुक्रवार को यह पूजा विशेष रूप से फलदायी मानी जाती है।",
    aboutEn: "Lakshmi Pooja is dedicated to Mata Lakshmi, the Goddess of Wealth. It is performed for financial prosperity, business growth and wealth, and is considered especially fruitful on Diwali and Fridays.",
    price: "₹5,100",
    gradient: "from-amber-800 via-yellow-500 to-amber-700",
    benefits: [
      { title: "Wealth Attraction", text: "Attracts financial prosperity and abundance into your life and business." },
      { title: "Business Growth", text: "Blesses your business ventures with growth, profit, and new opportunities." },
      { title: "Financial Stability", text: "Provides lasting financial stability and removes obstacles to wealth creation." },
    ],
    receive: ["Puja video on WhatsApp", "Aashirwad Box with Prasad", "Personalized Sankalp", "Lakshmi Yantra (Energized)", "Digital Puja Certificate", "Kamal Gatta Mala"],
    process: ["Book puja with your financial goals", "Share name, gotra and Sankalp details", "Panditji performs Lakshmi puja with specific mantras", "Lotus flowers and special offerings presented", "Video, Yantra and Prasad delivered"],
    packages: [
      { badge: "1 Person", name: "Live Pooja Via Video Call", sub: "Pooja Prasad · Video Call with Pandit", price: "₹7,100" },
      { badge: "1 Person", name: "Pooja", sub: "Pooja Prasad", price: "₹5,100" },
    ],
    faqs: [
      { q: "Is this only for Diwali?", a: "While Diwali is the most auspicious time, Lakshmi Puja can be performed any Friday for financial blessings." },
      { q: "Can I do this for my business?", a: "Absolutely! Many business owners perform this puja for business growth and prosperity." },
    ],
  },
  {
    id: "rudra",
    title: "रुद्राभिषेक",
    enTitle: "Rudra Abhishek",
    desc: "शिव लिंग को पवित्र तरल पदार्थों (दूध, शहद, घी) से स्नान कराने की विधि।",
    descEn: "The ritual of bathing the Shiva Linga with sacred offerings (milk, honey, ghee).",
    enDesc: "For peace, purification, and Lord Shiva's blessings",
    about: "रुद्राभिषेक भगवान शिव की सबसे पवित्र पूजा विधियों में से एक है। इसमें शिव लिंग पर दूध, दही, शहद, घी, गंगाजल और अन्य पवित्र द्रव्यों से अभिषेक किया जाता है। यह पूजा शांति, शुद्धि और शिव कृपा प्राप्ति के लिए की जाती है।",
    aboutEn: "Rudrabhishek is one of the most sacred forms of worship of Lord Shiva. The Shiva Linga is bathed with milk, curd, honey, ghee, Gangajal and other sacred offerings. It is performed for peace, purification and Lord Shiva's grace.",
    price: "₹5,100",
    gradient: "from-slate-900 via-blue-900 to-slate-800",
    benefits: [
      { title: "Shiva's Grace", text: "Receives the direct blessings and grace of Lord Shiva for spiritual growth." },
      { title: "Peace & Purification", text: "Purifies mind, body, and soul, bringing deep inner peace and clarity." },
      { title: "Disease Removal", text: "Addresses health issues and provides healing energy through divine intervention." },
    ],
    receive: ["Puja video on WhatsApp", "Aashirwad Box with Prasad", "Personalized Sankalp", "Rudraksha Mala (Energized)", "Digital Puja Certificate", "Bhasma Prasad"],
    process: ["Book puja with your preferred date", "Share name, gotra and Sankalp details", "Panditji performs Rudra Abhishek with sacred liquids", "108 Rudra mantras chanted during Abhishek", "Video, Rudraksha and Prasad delivered"],
    packages: [
      { badge: "1 Person", name: "Live Pooja Via Video Call", sub: "Pooja Prasad · Video Call with Pandit", price: "₹7,100" },
      { badge: "1 Person", name: "Pooja", sub: "Pooja Prasad", price: "₹5,100" },
    ],
    faqs: [
      { q: "What day is best for Rudra Abhishek?", a: "Monday is considered the most auspicious day. Maha Shivaratri and Shravan month are also highly recommended." },
      { q: "What items are used in Abhishek?", a: "Milk, curd, honey, ghee, sugarcane juice, Gangajal, and sandalwood paste are used." },
    ],
  },
];
