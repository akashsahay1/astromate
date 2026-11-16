export const consultationTopics = [
  { id: "love", label: "प्रेम और रिश्ते", labelEn: "Love & Relationships", keywords: ["प्रेम", "रिश्त", "टैरो"] },
  { id: "marriage", label: "विवाह और कुंडली", labelEn: "Marriage & Kundli", keywords: ["विवाह", "कुंडली", "मांगलिक"] },
  { id: "career", label: "करियर", labelEn: "Career", keywords: ["करियर", "लाइफ कोच"] },
  { id: "vastu", label: "वास्तु", labelEn: "Vastu", keywords: ["वास्तु"] },
  { id: "business", label: "व्यापार और धन", labelEn: "Business & Wealth", keywords: ["व्यापार", "अंकज्योतिष", "अंक ज्योतिष"] },
  { id: "family", label: "स्वास्थ्य और परिवार", labelEn: "Health & Family", keywords: ["वैदिक", "जीवन मार्गदर्शन"] },
] as const;

export function matchesConsultationTopic(text: string, topic: typeof consultationTopics[number]) {
  return topic.keywords.some((keyword) => text.includes(keyword));
}