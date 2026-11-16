export interface MantraJaapBenefit {
  icon: string;
  title: string;
  desc: string;
}

export interface MantraJaapProcess {
  title: string;
  desc: string;
}

export interface MantraJaapPackage {
  name: string;
  desc: string;
  price: string;
}

export interface MantraJaapFaq {
  q: string;
  a: string;
}

export interface MantraJaapService {
  id: string;
  category: 'navagraha' | 'devata';
  emoji: string;
  gradient: string;
  tag: string;
  tagEn: string;
  rating: string;
  titleHindi: string;
  titleDetail: string;
  subtitle: string;
  shortDesc: string;
  shortDescEn: string;
  about: string;
  price: string;
  benefits: MantraJaapBenefit[];
  receive: string[];
  process: MantraJaapProcess[];
  packages: MantraJaapPackage[];
  faqs: MantraJaapFaq[];
}

export const mantraJaapServices: MantraJaapService[] = [
  {
    id: 'surya',
    category: 'navagraha',
    emoji: '☀️',
    gradient: 'from-amber-500 to-red-500',
    tag: 'ग्रह • सूर्य',
    tagEn: "Planet • Sun",
    rating: '4.9',
    titleHindi: 'सूर्य वेद मंत्र जाप',
    titleDetail: 'Surya Ved Mantra Jaap',
    subtitle: 'A Powerful Ritual for Sun Strengthening and Success',
    shortDesc: 'जन्म कुंडली में सूर्य को मजबूत करें। आत्मविश्वास, सफलता और सम्मान पाएं।',
    shortDescEn: "Strengthen the Sun in your birth chart. Gain confidence, success and respect.",
    about: 'Performed to strengthen the Sun (Surya) in your horoscope. Recommended during Surya Mahadasha or Antardasha, or if the Sun is weak in your birth chart. It helps bring confidence, success, respect, and vitality in life.',
    price: '₹35,000',
    benefits: [
      { icon: '⭐', title: 'Confidence & Leadership', desc: 'Boosts self-confidence, leadership qualities, and helps in gaining respect and authority' },
      { icon: '💼', title: 'Career Success', desc: 'Removes obstacles in career, brings promotions, and helps in government-related matters' },
      { icon: '❤️', title: 'Health & Vitality', desc: 'Improves overall health, strengthens bones and eyesight, and boosts physical energy' },
    ],
    receive: ['Vedik Mantra Jaap video on WhatsApp within 3–4 days', 'Divine Aashirwad Box delivered in 8–10 days', 'Personalized Sankalp with your name', 'Prasad blessed during the puja ritual'],
    process: [
      { title: 'Book & Share Details', desc: 'Provide your name, gotra, and date of birth for personalized Sankalp' },
      { title: 'Vedik Mantra Jaap Scheduled', desc: 'Panditji schedules the puja on auspicious Sunday (Ravivar)' },
      { title: 'Live or Recorded Ritual', desc: 'Attend via video call or receive full puja video on WhatsApp within 3–4 days' },
      { title: 'Receive Prasad & Blessings', desc: 'Divine Aashirwad Box delivered to your doorstep in 8–10 business days' },
    ],
    packages: [
      { name: '31,000 Jaap', desc: '7 Days', price: '₹35,000' },
      { name: '51,000 Jaap', desc: '15 Days', price: '₹55,000' },
      { name: '1.25 Lakh Jaap', desc: '30 Days', price: '₹1,10,000' },
    ],
    faqs: [
      { q: 'Who should perform Surya Mantra Jaap?', a: 'Anyone with a weak Sun in their horoscope, facing low confidence, career obstacles, or going through Surya Mahadasha should perform this Jaap.' },
      { q: 'How will I receive the puja video?', a: 'The puja video will be sent to your WhatsApp within 3–4 days of the ritual.' },
    ],
  },
  {
    id: 'chandra',
    category: 'navagraha',
    emoji: '🌙',
    gradient: 'from-cyan-500 to-blue-500',
    tag: 'ग्रह • चंद्रमा',
    tagEn: "Planet • Moon",
    rating: '4.8',
    titleHindi: 'चंद्रमा वेद मंत्र जाप',
    titleDetail: 'Chandrama Ved Mantra Jaap',
    subtitle: 'A Powerful Ritual for Moon Strengthening and Mental Peace',
    shortDesc: 'मानसिक शांति, भावनात्मक स्थिरता और जीवन में संतुलन के लिए।',
    shortDescEn: "For peace of mind, emotional stability and balance in life.",
    about: 'Performed to strengthen the Moon (Chandra) in your horoscope. Recommended during Chandra Dasha or Antardasha, or if the Moon is weak in your birth chart. It helps bring emotional peace, mental clarity, stability, and balance in life.',
    price: '₹35,000',
    benefits: [
      { icon: '🧘', title: 'Mental Peace', desc: 'Brings calmness, reduces anxiety, and improves emotional stability and mental health' },
      { icon: '💧', title: 'Emotional Balance', desc: 'Helps overcome mood swings, emotional turbulence, and brings harmony in relationships' },
      { icon: '😴', title: 'Better Sleep', desc: 'Improves sleep quality, reduces insomnia and restlessness caused by weak Moon' },
    ],
    receive: ['Vedik Mantra Jaap video on WhatsApp within 3–4 days', 'Divine Aashirwad Box delivered in 8–10 days', 'Personalized Sankalp with your name', 'Prasad blessed during the puja ritual'],
    process: [
      { title: 'Book & Share Details', desc: 'Provide your name, gotra, and date of birth for personalized Sankalp' },
      { title: 'Vedik Mantra Jaap Scheduled', desc: 'Panditji schedules the puja on Purnima or an auspicious Moon day' },
      { title: 'Live or Recorded Ritual', desc: 'Attend via video call or receive full puja video on WhatsApp within 3–4 days' },
      { title: 'Receive Prasad & Blessings', desc: 'Divine Aashirwad Box delivered to your doorstep in 8–10 business days' },
    ],
    packages: [
      { name: '31,000 Jaap', desc: '7 Days', price: '₹35,000' },
      { name: '51,000 Jaap', desc: '15 Days', price: '₹55,000' },
      { name: '1.25 Lakh Jaap', desc: '30 Days', price: '₹1,10,000' },
    ],
    faqs: [
      { q: 'What is Chandrama Ved Mantra Jaap?', a: 'It is a Vedic ritual to strengthen the Moon and reduce mental disturbances, emotional imbalance, and effects of Chandra Dasha.' },
      { q: 'How will I receive the puja video?', a: 'The puja video will be sent to your WhatsApp within 3–4 days of the ritual.' },
      { q: 'What details do I need to provide?', a: 'Your full name, gotra, date of birth, and city of birth for personalized Sankalp.' },
    ],
  },
  {
    id: 'mangal',
    category: 'navagraha',
    emoji: '🔥',
    gradient: 'from-orange-500 to-red-600',
    tag: 'ग्रह • मंगल',
    tagEn: "Planet • Mars",
    rating: '4.7',
    titleHindi: 'मंगल वेद मंत्र जाप',
    titleDetail: 'Mangal Ved Mantra Jaap',
    subtitle: 'A Powerful Ritual for Mars Strengthening and Courage',
    shortDesc: 'साहस, ऊर्जा और निर्णय क्षमता बढ़ाएं। मंगल दोष से मुक्ति पाएं।',
    shortDescEn: "Boost courage, energy and decisiveness. Find relief from Mangal Dosha.",
    about: 'Performed to strengthen Mars (Mangal) in your horoscope. Helpful during Mangal Mahadasha or Antardasha, or if Mars is weak or malefic. It brings courage, stability, energy, and better decision-making in life.',
    price: '₹35,000',
    benefits: [
      { icon: '💪', title: 'Courage & Energy', desc: 'Boosts physical strength, courage, and mental determination to overcome life challenges' },
      { icon: '💼', title: 'Career Growth', desc: 'Removes obstacles in career, helps in competitive fields, sports, and leadership roles' },
      { icon: '❤️', title: 'Mangal Dosha Relief', desc: 'Reduces the effects of Mangal Dosha in marriage and relationships' },
    ],
    receive: ['Vedik Mantra Jaap video on WhatsApp within 3–4 days', 'Divine Aashirwad Box delivered in 8–10 days', 'Personalized Sankalp with your name', 'Prasad blessed during the puja ritual'],
    process: [
      { title: 'Book & Share Details', desc: 'Provide your name, gotra, and date of birth for personalized Sankalp' },
      { title: 'Vedik Mantra Jaap Scheduled', desc: 'Panditji schedules the puja on auspicious Tuesday (Mangalvar)' },
      { title: 'Live or Recorded Ritual', desc: 'Attend via video call or receive full puja video on WhatsApp within 3–4 days' },
      { title: 'Receive Prasad & Blessings', desc: 'Divine Aashirwad Box delivered to your doorstep in 8–10 business days' },
    ],
    packages: [
      { name: '31,000 Jaap', desc: '7 Days', price: '₹35,000' },
      { name: '51,000 Jaap', desc: '15 Days', price: '₹55,000' },
      { name: '1.25 Lakh Jaap', desc: '30 Days', price: '₹1,10,000' },
    ],
    faqs: [
      { q: 'What is Mangal Dosha?', a: 'Mangal Dosha occurs when Mars is placed in certain houses in the birth chart, causing delays in marriage and conflicts in relationships.' },
      { q: 'How will I receive the puja video?', a: 'The puja video will be sent to your WhatsApp within 3–4 days of the ritual.' },
    ],
  },
  {
    id: 'budh',
    category: 'navagraha',
    emoji: '💚',
    gradient: 'from-emerald-500 to-emerald-600',
    tag: 'ग्रह • बुध',
    tagEn: "Planet • Mercury",
    rating: '4.8',
    titleHindi: 'बुध वेद मंत्र जाप',
    titleDetail: 'Budh Ved Mantra Jaap',
    subtitle: 'A Powerful Ritual for Mercury Strengthening and Intelligence',
    shortDesc: 'बुद्धि, संचार कौशल और व्यापार में सफलता के लिए।',
    shortDescEn: "For intellect, communication skills and success in business.",
    about: 'Performed to strengthen Mercury (Budh) in your horoscope. Beneficial during Budh Mahadasha or when Mercury is weak. It enhances intelligence, communication, business skills, and clarity of thought.',
    price: '₹35,000',
    benefits: [
      { icon: '🧠', title: 'Intelligence & Memory', desc: 'Enhances memory, analytical thinking, and quick learning ability' },
      { icon: '💬', title: 'Communication Skills', desc: 'Improves public speaking, writing skills, and overall communication' },
      { icon: '💼', title: 'Business Success', desc: 'Brings clarity in business decisions and helps in trade and commerce' },
    ],
    receive: ['Vedik Mantra Jaap video on WhatsApp within 3–4 days', 'Divine Aashirwad Box delivered in 8–10 days', 'Personalized Sankalp with your name', 'Prasad blessed during the puja ritual'],
    process: [
      { title: 'Book & Share Details', desc: 'Provide your name, gotra, and date of birth for personalized Sankalp' },
      { title: 'Vedik Mantra Jaap Scheduled', desc: 'Panditji schedules the puja on auspicious Wednesday (Budhvar)' },
      { title: 'Live or Recorded Ritual', desc: 'Attend via video call or receive full puja video on WhatsApp within 3–4 days' },
      { title: 'Receive Prasad & Blessings', desc: 'Divine Aashirwad Box delivered to your doorstep in 8–10 business days' },
    ],
    packages: [
      { name: '31,000 Jaap', desc: '7 Days', price: '₹35,000' },
      { name: '51,000 Jaap', desc: '15 Days', price: '₹55,000' },
      { name: '1.25 Lakh Jaap', desc: '30 Days', price: '₹1,10,000' },
    ],
    faqs: [
      { q: 'Who should do Budh Mantra Jaap?', a: 'Anyone facing weak Mercury effects — poor communication, confusion in decisions, business losses, or Budh Mahadasha should perform this Jaap.' },
      { q: 'How will I receive the puja video?', a: 'The puja video will be sent to your WhatsApp within 3–4 days of the ritual.' },
    ],
  },
  {
    id: 'brihaspati',
    category: 'navagraha',
    emoji: '🟡',
    gradient: 'from-amber-500 to-amber-600',
    tag: 'ग्रह • बृहस्पति',
    tagEn: "Planet • Jupiter",
    rating: '4.9',
    titleHindi: 'बृहस्पति वेद मंत्र जाप',
    titleDetail: 'Brihaspati (Jupiter) Ved Mantra Jaap',
    subtitle: 'A Powerful Ritual for Jupiter Strengthening and Wisdom',
    shortDesc: 'ज्ञान, धन वृद्धि, करियर स्थिरता और आध्यात्मिक प्रगति के लिए।',
    shortDescEn: "For wisdom, growing wealth, career stability and spiritual progress.",
    about: 'Performed to strengthen Jupiter (Brihaspati) in your horoscope. Highly recommended during Brihaspati Mahadasha or Antardasha, or when Jupiter is weak. It enhances wisdom, financial growth, career stability, and spiritual progress.',
    price: '₹35,000',
    benefits: [
      { icon: '📚', title: 'Wisdom & Knowledge', desc: 'Enhances wisdom, spiritual knowledge, and higher learning abilities' },
      { icon: '💰', title: 'Financial Growth', desc: 'Brings financial abundance, removes money blockages, and improves wealth' },
      { icon: '🌱', title: 'Spiritual Progress', desc: 'Accelerates spiritual growth and helps in finding life purpose and dharma' },
    ],
    receive: ['Vedik Mantra Jaap video on WhatsApp within 3–4 days', 'Divine Aashirwad Box delivered in 8–10 days', 'Personalized Sankalp with your name', 'Prasad blessed during the puja ritual'],
    process: [
      { title: 'Book & Share Details', desc: 'Provide your name, gotra, and date of birth for personalized Sankalp' },
      { title: 'Vedik Mantra Jaap Scheduled', desc: 'Panditji schedules the puja on auspicious Thursday (Guruvar)' },
      { title: 'Live or Recorded Ritual', desc: 'Attend via video call or receive full puja video on WhatsApp within 3–4 days' },
      { title: 'Receive Prasad & Blessings', desc: 'Divine Aashirwad Box delivered to your doorstep in 8–10 business days' },
    ],
    packages: [
      { name: '31,000 Jaap', desc: '7 Days', price: '₹35,000' },
      { name: '51,000 Jaap', desc: '15 Days', price: '₹55,000' },
      { name: '1.25 Lakh Jaap', desc: '30 Days', price: '₹1,10,000' },
    ],
    faqs: [
      { q: 'Who should perform Brihaspati Jaap?', a: 'People facing weak Jupiter — financial struggles, lack of wisdom, marital issues, or Guru Mahadasha should perform this Jaap.' },
      { q: 'How will I receive the puja video?', a: 'The puja video will be sent to your WhatsApp within 3–4 days of the ritual.' },
    ],
  },
  {
    id: 'shukra',
    category: 'navagraha',
    emoji: '💎',
    gradient: 'from-pink-500 to-violet-500',
    tag: 'ग्रह • शुक्र',
    tagEn: "Planet • Venus",
    rating: '4.8',
    titleHindi: 'शुक्र वेद मंत्र जाप',
    titleDetail: 'Shukra (Venus) Ved Mantra Jaap',
    subtitle: 'A Sacred Ritual for Venus Strengthening and Love',
    shortDesc: 'प्रेम, सौंदर्य, समृद्धि और रिश्तों में सुधार के लिए।',
    shortDescEn: "For love, beauty, prosperity and better relationships.",
    about: 'Performed to strengthen Venus (Shukra) in your horoscope. Ideal during Shukra Mahadasha or Antardasha, or when Venus is weak. Enhances love, beauty, luxury, wealth, relationships, and creativity.',
    price: '₹35,000',
    benefits: [
      { icon: '❤️', title: 'Love & Relationships', desc: 'Improves romantic relationships, removes obstacles in marriage, and brings harmony' },
      { icon: '✨', title: 'Beauty & Charisma', desc: 'Enhances personal charm, beauty, and artistic talents' },
      { icon: '💰', title: 'Wealth & Luxury', desc: 'Attracts material comforts, luxury, and financial prosperity' },
    ],
    receive: ['Vedik Mantra Jaap video on WhatsApp within 3–4 days', 'Divine Aashirwad Box delivered in 8–10 days', 'Personalized Sankalp with your name', 'Prasad blessed during the puja ritual'],
    process: [
      { title: 'Book & Share Details', desc: 'Provide your name, gotra, and date of birth for personalized Sankalp' },
      { title: 'Vedik Mantra Jaap Scheduled', desc: 'Panditji schedules the puja on auspicious Friday (Shukravar)' },
      { title: 'Live or Recorded Ritual', desc: 'Attend via video call or receive full puja video on WhatsApp within 3–4 days' },
      { title: 'Receive Prasad & Blessings', desc: 'Divine Aashirwad Box delivered to your doorstep in 8–10 business days' },
    ],
    packages: [
      { name: '31,000 Jaap', desc: '7 Days', price: '₹35,000' },
      { name: '51,000 Jaap', desc: '15 Days', price: '₹55,000' },
      { name: '1.25 Lakh Jaap', desc: '30 Days', price: '₹1,10,000' },
    ],
    faqs: [
      { q: 'Who should perform Shukra Jaap?', a: 'Anyone facing weak Venus effects — relationship issues, lack of creativity, financial troubles, or Shukra Mahadasha should perform this Jaap.' },
      { q: 'How will I receive the puja video?', a: 'The puja video will be sent to your WhatsApp within 3–4 days of the ritual.' },
    ],
  },
  {
    id: 'shani',
    category: 'navagraha',
    emoji: '🪐',
    gradient: 'from-slate-600 to-slate-800',
    tag: 'ग्रह • शनि',
    tagEn: "Planet • Saturn",
    rating: '4.9',
    titleHindi: 'शनि वेद मंत्र जाप',
    titleDetail: 'Shani (Saturn) Ved Mantra Jaap',
    subtitle: 'A Powerful Ritual for Shani Dosha Relief and Mental Peace',
    shortDesc: 'शनि महादशा, साढ़ेसाती में राहत। बाधाओं और देरी से मुक्ति पाएं।',
    shortDescEn: "Relief during Shani Mahadasha and Sade Sati. Freedom from obstacles and delays.",
    about: 'Performed to mitigate the effects of Sade Sati or a weak Saturn (Shani) in the horoscope. This powerful puja involves Vedic rituals, mantra recitation, and sacred offerings to appease Lord Shani and bring relief from his malefic influence.',
    price: '₹35,000',
    benefits: [
      { icon: '⭐', title: 'Sade Sati Relief', desc: "Mitigates the Sade Sati period. Reduces hardships, delays, and physical ailments caused by Saturn's influence" },
      { icon: '🧘', title: 'Mental Peace', desc: 'Brings inner calm, reduces anxiety, and helps overcome fear and mental blockages caused by Shani Dasha' },
      { icon: '💼', title: 'Career & Finance', desc: 'Removes obstacles in career, helps overcome financial delays and brings stability and progress' },
      { icon: '❤️', title: 'Health & Relationships', desc: 'Improves health and harmony in relationships, reduces conflicts and brings balance back' },
    ],
    receive: ['Vedik Mantra Jaap video on WhatsApp within 3–4 days', 'Divine Aashirwad Box delivered in 8–10 days', 'Personalized Sankalp with your name', 'Prasad blessed during the puja ritual'],
    process: [
      { title: 'Book & Share Details', desc: 'Select your package and provide your name, gotra, and date of birth for personalized Sankalp' },
      { title: 'Vedik Mantra Jaap Scheduled', desc: 'Our experienced Panditji will schedule the puja on an auspicious Saturday (Shanivar)' },
      { title: 'Live or Recorded Ritual', desc: 'Attend via video call or receive full puja video on WhatsApp within 3–4 days' },
      { title: 'Receive Prasad & Blessings', desc: 'Divine Aashirwad Box delivered to your doorstep in 8–10 business days' },
    ],
    packages: [
      { name: '31,000 Jaap', desc: '7 Days', price: '₹35,000' },
      { name: '51,000 Jaap', desc: '15 Days', price: '₹55,000' },
      { name: '1.25 Lakh Jaap', desc: '30 Days', price: '₹1,10,000' },
    ],
    faqs: [
      { q: 'What is Shani Dosha Nivaran Vedik Mantra Jaap?', a: 'It is a Vedic ritual performed to pacify Lord Shani and reduce the malefic effects of Saturn, especially during Sade Sati or Shani Mahadasha.' },
      { q: 'How will I receive the puja video?', a: 'The puja video will be sent directly to your WhatsApp number within 3–4 days after the ritual is performed.' },
      { q: 'What details do I need to provide?', a: 'You need to share your full name, gotra, date of birth, and city of birth for a personalized Sankalp during the puja.' },
      { q: 'When will I receive the Aashirwad Box?', a: 'The Divine Aashirwad Box containing blessed prasad and sacred items will be delivered to your doorstep within 8–10 business days.' },
      { q: 'Can I attend the puja live?', a: 'Yes! With the "Live Vedik Mantra Jaap Via Video Call" package, you can join the entire ritual via video call and interact directly with Panditji.' },
    ],
  },
  {
    id: 'rahu',
    category: 'navagraha',
    emoji: '🐍',
    gradient: 'from-violet-600 to-indigo-600',
    tag: 'ग्रह • राहु',
    tagEn: "Planet • Rahu",
    rating: '4.7',
    titleHindi: 'राहु वेद मंत्र जाप',
    titleDetail: 'Rahu Ved Mantra Jaap',
    subtitle: "A Powerful Ritual to Neutralize Rahu's Malefic Effects",
    shortDesc: 'राहु के नकारात्मक प्रभाव को कम करें। भ्रम और मानसिक तनाव से राहत।',
    shortDescEn: "Reduce Rahu's negative influence. Relief from confusion and mental stress.",
    about: "Performed to reduce the negative effects of Rahu and make it favorable. Beneficial during Rahu Mahadasha or Antardasha. Helps neutralize Rahu's malefic influence and supports positive transformation, especially when facing confusion, sudden changes, or mental stress.",
    price: '₹35,000',
    benefits: [
      { icon: '🧠', title: 'Mental Clarity', desc: "Reduces confusion, overthinking, and irrational fears caused by Rahu's influence" },
      { icon: '🔄', title: 'Positive Transformation', desc: "Turns Rahu's disruptive energy into positive transformation and growth" },
      { icon: '🛡️', title: 'Protection', desc: 'Protects from hidden enemies, black magic, and negative energies' },
    ],
    receive: ['Vedik Mantra Jaap video on WhatsApp within 3–4 days', 'Divine Aashirwad Box delivered in 8–10 days', 'Personalized Sankalp with your name', 'Prasad blessed during the puja ritual'],
    process: [
      { title: 'Book & Share Details', desc: 'Provide your name, gotra, and date of birth for personalized Sankalp' },
      { title: 'Vedik Mantra Jaap Scheduled', desc: 'Panditji schedules the puja on an auspicious Rahu Kaal day' },
      { title: 'Live or Recorded Ritual', desc: 'Attend via video call or receive full puja video on WhatsApp within 3–4 days' },
      { title: 'Receive Prasad & Blessings', desc: 'Divine Aashirwad Box delivered to your doorstep in 8–10 business days' },
    ],
    packages: [
      { name: '31,000 Jaap', desc: '7 Days', price: '₹35,000' },
      { name: '51,000 Jaap', desc: '15 Days', price: '₹55,000' },
      { name: '1.25 Lakh Jaap', desc: '30 Days', price: '₹1,10,000' },
    ],
    faqs: [
      { q: 'Who should perform Rahu Jaap?', a: 'Anyone experiencing sudden life changes, mental stress, confusion, or going through Rahu Mahadasha should perform this Jaap.' },
      { q: 'How will I receive the puja video?', a: 'The puja video will be sent to your WhatsApp within 3–4 days of the ritual.' },
    ],
  },
  {
    id: 'ketu',
    category: 'navagraha',
    emoji: '🌀',
    gradient: 'from-cyan-600 to-teal-600',
    tag: 'ग्रह • केतु',
    tagEn: "Planet • Ketu",
    rating: '4.6',
    titleHindi: 'केतु वेद मंत्र जाप',
    titleDetail: 'Ketu Ved Mantra Jaap',
    subtitle: "A Powerful Ritual to Remove Ketu's Negative Effects",
    shortDesc: 'केतु के दुष्प्रभाव हटाएं। आध्यात्मिक विकास और आंतरिक शांति पाएं।',
    shortDescEn: "Remove Ketu's ill effects. Gain spiritual growth and inner peace.",
    about: 'Performed to pacify Ketu and remove its negative effects. Recommended during Ketu Mahadasha or Antardasha. Helps bring clarity, spiritual growth, and inner peace.',
    price: '₹35,000',
    benefits: [
      { icon: '🕊️', title: 'Inner Peace', desc: 'Brings deep inner peace, reduces spiritual confusion and existential anxiety' },
      { icon: '🌟', title: 'Spiritual Growth', desc: 'Accelerates spiritual awakening and helps attain higher consciousness' },
      { icon: '🛡️', title: 'Ketu Dosha Relief', desc: 'Reduces the malefic effects of Ketu and brings stability in life' },
    ],
    receive: ['Vedik Mantra Jaap video on WhatsApp within 3–4 days', 'Divine Aashirwad Box delivered in 8–10 days', 'Personalized Sankalp with your name', 'Prasad blessed during the puja ritual'],
    process: [
      { title: 'Book & Share Details', desc: 'Provide your name, gotra, and date of birth for personalized Sankalp' },
      { title: 'Vedik Mantra Jaap Scheduled', desc: 'Panditji schedules the puja on an auspicious day' },
      { title: 'Live or Recorded Ritual', desc: 'Attend via video call or receive full puja video on WhatsApp within 3–4 days' },
      { title: 'Receive Prasad & Blessings', desc: 'Divine Aashirwad Box delivered to your doorstep in 8–10 business days' },
    ],
    packages: [
      { name: '31,000 Jaap', desc: '7 Days', price: '₹35,000' },
      { name: '51,000 Jaap', desc: '15 Days', price: '₹55,000' },
      { name: '1.25 Lakh Jaap', desc: '30 Days', price: '₹1,10,000' },
    ],
    faqs: [
      { q: 'Who should perform Ketu Jaap?', a: 'Anyone experiencing spiritual confusion, unexplained fears, or going through Ketu Mahadasha should perform this Jaap.' },
      { q: 'How will I receive the puja video?', a: 'The puja video will be sent to your WhatsApp within 3–4 days of the ritual.' },
    ],
  },
  {
    id: 'lakshmi',
    category: 'navagraha',
    emoji: '🌸',
    gradient: 'from-amber-500 to-orange-500',
    tag: 'देवी • लक्ष्मी',
    tagEn: "Goddess • Lakshmi",
    rating: '4.9',
    titleHindi: 'महा लक्ष्मी मंत्र जाप',
    titleDetail: 'Maha Lakshmi Mantra Jaap',
    subtitle: 'A Sacred Ritual for Financial Abundance and Prosperity',
    shortDesc: 'आर्थिक समृद्धि, धन बाधाओं को दूर करें। माँ लक्ष्मी का आशीर्वाद पाएं।',
    shortDescEn: "Financial prosperity and removal of money blocks. Receive Maa Lakshmi's blessings.",
    about: 'Performed for financial abundance, removal of money blockages, and overall prosperity. Highly recommended for those facing financial challenges, business stagnation, or a lack of prosperity and peace in life. Invokes the blessings of Goddess Lakshmi.',
    price: '₹35,000',
    benefits: [
      { icon: '💰', title: 'Financial Abundance', desc: 'Removes money blockages and brings consistent flow of wealth and prosperity' },
      { icon: '💼', title: 'Business Growth', desc: 'Helps overcome business stagnation and brings new opportunities for growth' },
      { icon: '🏠', title: 'Peace & Harmony', desc: 'Brings peace, happiness, and harmony to the household and family life' },
    ],
    receive: ['Vedik Mantra Jaap video on WhatsApp within 3–4 days', 'Divine Aashirwad Box delivered in 8–10 days', 'Personalized Sankalp with your name', 'Prasad blessed during the puja ritual'],
    process: [
      { title: 'Book & Share Details', desc: 'Provide your name, gotra, and date of birth for personalized Sankalp' },
      { title: 'Vedik Mantra Jaap Scheduled', desc: 'Panditji schedules the puja on auspicious Friday (Shukravar) or Purnima' },
      { title: 'Live or Recorded Ritual', desc: 'Attend via video call or receive full puja video on WhatsApp within 3–4 days' },
      { title: 'Receive Prasad & Blessings', desc: 'Divine Aashirwad Box delivered to your doorstep in 8–10 business days' },
    ],
    packages: [
      { name: '31,000 Jaap', desc: '7 Days', price: '₹35,000' },
      { name: '51,000 Jaap', desc: '15 Days', price: '₹55,000' },
      { name: '1.25 Lakh Jaap', desc: '30 Days', price: '₹1,10,000' },
    ],
    faqs: [
      { q: 'Who should perform Maha Lakshmi Jaap?', a: 'Anyone facing financial difficulties, business losses, debt problems, or lack of prosperity should perform this Jaap.' },
      { q: 'How will I receive the puja video?', a: 'The puja video will be sent to your WhatsApp within 3–4 days of the ritual.' },
    ],
  },
  {
    id: 'mahamrityunjaya',
    category: 'navagraha',
    emoji: '🔱',
    gradient: 'from-slate-500 to-slate-600',
    tag: 'देव • शिव',
    tagEn: "God • Shiva",
    rating: '4.9',
    titleHindi: 'महामृत्युंजय मंत्र जाप',
    titleDetail: 'Mahamrityunjaya Mantra Jaap',
    subtitle: 'A Powerful Ritual for Health Recovery and Divine Protection',
    shortDesc: 'स्वास्थ्य लाभ, अचानक बीमारी से सुरक्षा। मारकेश ग्रह के प्रभाव से मुक्ति।',
    shortDescEn: "For healing and protection from sudden illness. Relief from the effects of Marakesh planets.",
    about: 'Performed for health recovery, protection from sudden health issues, and removal of Markesh graha effects. Ideal for those facing chronic illness, unexpected health problems, or under the influence of Markesh planets. Brings divine protection and supports healing.',
    price: '₹35,000',
    benefits: [
      { icon: '❤️', title: 'Health Recovery', desc: 'Supports recovery from chronic illness and unexpected health problems' },
      { icon: '🛡️', title: 'Divine Protection', desc: 'Provides protection from accidents, sudden death, and Markesh graha effects' },
      { icon: '🧘', title: 'Mental Strength', desc: 'Brings mental courage to overcome illness and difficult life situations' },
    ],
    receive: ['Vedik Mantra Jaap video on WhatsApp within 3–4 days', 'Divine Aashirwad Box delivered in 8–10 days', 'Personalized Sankalp with your name', 'Prasad blessed during the puja ritual'],
    process: [
      { title: 'Book & Share Details', desc: 'Provide your name, gotra, and date of birth for personalized Sankalp' },
      { title: 'Vedik Mantra Jaap Scheduled', desc: 'Panditji schedules the puja on auspicious Monday (Somvar) or Pradosh' },
      { title: 'Live or Recorded Ritual', desc: 'Attend via video call or receive full puja video on WhatsApp within 3–4 days' },
      { title: 'Receive Prasad & Blessings', desc: 'Divine Aashirwad Box delivered to your doorstep in 8–10 business days' },
    ],
    packages: [
      { name: '31,000 Jaap', desc: '7 Days', price: '₹35,000' },
      { name: '51,000 Jaap', desc: '15 Days', price: '₹55,000' },
      { name: '1.25 Lakh Jaap', desc: '30 Days', price: '₹1,10,000' },
    ],
    faqs: [
      { q: 'What is Mahamrityunjaya Mantra Jaap?', a: 'It is one of the most powerful Vedic mantras of Lord Shiva, performed for protection from untimely death, illness, and Markesh graha effects.' },
      { q: 'How will I receive the puja video?', a: 'The puja video will be sent to your WhatsApp within 3–4 days of the ritual.' },
      { q: 'Can this help with serious illness?', a: 'Yes, this Jaap is specifically recommended for those facing serious or chronic illness. It invokes divine healing energy of Lord Mahamrityunjaya (Lord Shiva).' },
    ],
  },
  {
    id: 'baglamukhi',
    category: 'navagraha',
    emoji: '⚡',
    gradient: 'from-yellow-500 to-yellow-600',
    tag: 'देवी • बगलामुखी',
    tagEn: "Goddess • Baglamukhi",
    rating: '4.8',
    titleHindi: 'बगलामुखी मंत्र जाप',
    titleDetail: 'Baglamukhi Mantra Jaap',
    subtitle: 'A Powerful Ritual for Protection from Enemies and Legal Victory',
    shortDesc: 'शत्रुओं से सुरक्षा, कोर्ट केस में जीत। विरोधियों पर नियंत्रण पाएं।',
    shortDescEn: "Protection from enemies and victory in court cases. Gain control over opponents.",
    about: 'Performed for protection from enemies, victory in legal matters, and control over opponents. Highly effective for those facing legal disputes, jealous rivals, or any hidden enemies. Helps in silencing negativity and gaining dominance.',
    price: '₹35,000',
    benefits: [
      { icon: '⚖️', title: 'Legal Victory', desc: 'Highly effective for winning court cases, legal disputes, and property matters' },
      { icon: '🛡️', title: 'Enemy Protection', desc: 'Protects from hidden enemies, jealous rivals, and negative influences' },
      { icon: '🔇', title: 'Silence Opposition', desc: 'Silences critics and opponents, helps gain dominance in challenging situations' },
    ],
    receive: ['Vedik Mantra Jaap video on WhatsApp within 3–4 days', 'Divine Aashirwad Box delivered in 8–10 days', 'Personalized Sankalp with your name', 'Prasad blessed during the puja ritual'],
    process: [
      { title: 'Book & Share Details', desc: 'Provide your name, gotra, and date of birth for personalized Sankalp' },
      { title: 'Vedik Mantra Jaap Scheduled', desc: 'Panditji schedules the puja on an auspicious Tuesday or Navami' },
      { title: 'Live or Recorded Ritual', desc: 'Attend via video call or receive full puja video on WhatsApp within 3–4 days' },
      { title: 'Receive Prasad & Blessings', desc: 'Divine Aashirwad Box delivered to your doorstep in 8–10 business days' },
    ],
    packages: [
      { name: '31,000 Jaap', desc: '7 Days', price: '₹35,000' },
      { name: '51,000 Jaap', desc: '15 Days', price: '₹55,000' },
      { name: '1.25 Lakh Jaap', desc: '30 Days', price: '₹1,10,000' },
    ],
    faqs: [
      { q: 'Who should perform Baglamukhi Jaap?', a: 'Anyone facing legal disputes, hidden enemies, jealous rivals, or workplace politics should perform this Jaap for protection and victory.' },
      { q: 'How will I receive the puja video?', a: 'The puja video will be sent to your WhatsApp within 3–4 days of the ritual.' },
    ],
  },
];
