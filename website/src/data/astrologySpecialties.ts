export const astrologySpecialties = [
  { label: "Vedic Astrology", aliases: ["वैदिक", "वैदिक ज्योतिष"] },
  { label: "Tarot Reading", aliases: ["टैरो", "टैरो कार्ड"] },
  { label: "Numerology", aliases: ["अंकज्योतिष", "अंक ज्योतिष"] },
  { label: "Face Reading", aliases: ["फेस रीडिंग", "मुखाकृति"] },
  { label: "Palmistry", aliases: ["हस्तरेखा", "हस्त रेखा"] },
  { label: "Vastu Shastra", aliases: ["वास्तु", "वास्तु शास्त्र"] },
  { label: "Life Coach", aliases: ["लाइफ कोच"] },
  { label: "Lal Kitab", aliases: ["लाल किताब"] },
  { label: "Prashna Astrology", aliases: ["प्रश्न", "प्रश्न कुंडली", "Prashna Jyotish"] },
  { label: "Nadi Astrology", aliases: ["नाड़ी", "Nadi"] },
  { label: "Tarot Coach", aliases: ["टैरो कोच"] },
  { label: "Name Numerology", aliases: ["नाम अंकज्योतिष", "नाम अंक ज्योतिष"] },
  { label: "Psychology", aliases: ["मनोविज्ञान"] },
  { label: "Kundali Reading", aliases: ["कुंडली", "कुंडली विश्लेषण"] },
  { label: "Vedic Numerology", aliases: ["वैदिक अंकज्योतिष", "वैदिक अंक ज्योतिष"] },
  { label: "Western", aliases: ["Western Astrology", "पाश्चात्य ज्योतिष"] },
  { label: "Nadi", aliases: ["नाड़ी", "Nadi Astrology"] },
  { label: "KP System", aliases: ["KP Astrology", "केपी", "कृष्णमूर्ति"] },
];

export const specialtyLabels = astrologySpecialties.map(({ label }) => label);

export function matchesAstrologySpecialty(text: string, label: string) {
  const normalize = (value: string) => value.trim().toLocaleLowerCase();
  const specialty = astrologySpecialties.find((item) => item.label === label);
  const values = text.split(/[,;|]/).map(normalize);
  return [label, ...(specialty?.aliases ?? [])].some((alias) => values.includes(normalize(alias)));
}