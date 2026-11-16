import { useHomepageSteps, useSiteContent } from "@/hooks/useSupabaseData";
import { usePick, useT } from "@/hooks/useLang";

const fallbackSteps = [
  {
    title: "अपनी जानकारी साझा करें",
    title_en: "Share Your Details",
    description_en: "Date, time and place of birth — that's all we need. Ready in 30 seconds, no lengthy sign-up.",
    description:
      "जन्म तिथि, समय और स्थान — बस ये तीन बातें बताएं। केवल 30 सेकंड में तैयार, कोई लंबी साइनअप प्रक्रिया नहीं।",
  },
  {
    title: "अपना ज्योतिषी चुनें",
    title_en: "Choose Your Astrologer",
    description_en: "Filter by expertise, language, price and experience. Read genuine reviews and see who's online right now.",
    description:
      "विशेषज्ञता, भाषा, मूल्य और अनुभव के अनुसार छाँटें। असली समीक्षाएं पढ़ें और देखें इस समय कौन ऑनलाइन है।",
  },
  {
    title: "चैट या कॉल शुरू करें",
    title_en: "Start a Chat or Call",
    description_en: "No bookings, no waiting. Just tap 'Connect' and start talking instantly — pause or switch astrologers whenever you like.",
    description:
      "न कोई बुकिंग, न कोई इंतज़ार। बस 'कनेक्ट' दबाएं और तुरंत बातचीत शुरू करें — रुकें या ज्योतिषी बदलें, आपकी मर्ज़ी।",
  },
  {
    title: "स्पष्ट मार्गदर्शन पाएं",
    title_en: "Get Clear Guidance",
    description_en: "Career, relationships or life's dilemmas — get balanced, trustworthy answers to every question, not just guesswork.",
    description:
      "करियर, रिश्ते या जीवन की उलझनें — हर सवाल का संतुलित और भरोसेमंद उत्तर पाएं, सिर्फ़ अनुमान नहीं।",
  },
  {
    title: "खुशहाल जीवन जिएं",
    title_en: "Live a Happier Life",
    description_en: "With the right guidance, shape your career, relationships and life with confidence — and enjoy every moment to the fullest.",
    description:
      "सही मार्गदर्शन के साथ अपने करियर, रिश्तों और जीवन को आत्मविश्वास से संवारें — हर पल को पूरी खुशी और सुकून के साथ जिएं और जीवन का भरपूर आनंद लें।",
  },
];

const HowItWorks = () => {
  const { data } = useHomepageSteps();
  const { content } = useSiteContent();
  const t = useT();
  const pick = usePick();
  const steps = data.length > 0 ? data : fallbackSteps;
  const numWords: Record<number, string> = { 3: "तीन", 4: "चार", 5: "पाँच", 6: "छह" };
  const numWordsEn: Record<number, string> = { 3: "Three", 4: "Four", 5: "Five", 6: "Six" };
  const countWord = t(numWordsEn[steps.length], numWords[steps.length]) || `${steps.length}`;
  const eyebrow = content.howitworks_eyebrow || t("How It Works", "हम कैसे काम करते हैं");
  const heading = (content.howitworks_heading || t("It's Simple — Just {count} Steps", "असली सच — सिर्फ़ {count} चरण")).replace(
    "{count}",
    countWord
  );
  const colsClass =
    steps.length >= 5
      ? "lg:grid-cols-5"
      : steps.length === 4
      ? "lg:grid-cols-4"
      : "lg:grid-cols-3";

  return (
    <section className="py-10 lg:py-14 bg-background">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 lg:mb-16">
          <h2 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground">
            {heading}
          </h2>
        </div>

        <div className={`grid sm:grid-cols-2 ${colsClass} gap-x-6 gap-y-12 relative`}>
          {steps.map((step, i) => (
            <div key={step.title} className="flex flex-col items-center text-center">
              <div className="relative mb-6">
                <div className="w-16 h-16 rounded-full bg-[radial-gradient(circle_at_30%_30%,hsl(var(--hero-gold-light)),hsl(var(--hero-gold)))] flex items-center justify-center shadow-lg shadow-[hsl(var(--hero-gold)/0.4)]">
                  <span className="text-2xl font-extrabold text-[hsl(var(--hero-dark-brown))]">
                    {i + 1}
                  </span>
                </div>
              </div>
              <h3 className="font-bold text-lg text-foreground">{pick(step, "title")}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                {pick(step, "description")}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
