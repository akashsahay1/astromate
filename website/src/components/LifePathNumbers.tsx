import { useState, useEffect } from "react";
import { Eye, Clock, ChevronLeft, ChevronRight, Sparkles, Star } from "lucide-react";
import { useLang } from "@/hooks/useLang";

const lifePathData = [
  { number: 1, title: "The Leader", titleHi: "नेता", description: "Represents leadership, independence, and new beginnings", views: 3984, date: "Mar 18, 2025", icon: "♈" },
  { number: 2, title: "The Peacemaker", titleHi: "शांतिदूत", description: "Symbolizes harmony, cooperation, and balance in relationships", views: 3003, date: "Feb 22, 2025", icon: "♉" },
  { number: 3, title: "The Creator", titleHi: "रचनाकार", description: "Embodies creativity, self-expression, and joyful communication", views: 2793, date: "Jan 13, 2025", icon: "♊" },
  { number: 4, title: "The Builder", titleHi: "निर्माता", description: "Signifies stability, practicality, and strong foundations", views: 2974, date: "Mar 4, 2025", icon: "♋" },
  { number: 5, title: "The Freedom Seeker", titleHi: "स्वतंत्रता", description: "Represents change, versatility, and freedom of expression", views: 2173, date: "Jan 9, 2025", icon: "♌" },
  { number: 6, title: "The Nurturer", titleHi: "पालनकर्ता", description: "Symbolizes love, nurturing, and responsibility towards family", views: 1860, date: "Jan 27, 2025", icon: "♍" },
  { number: 7, title: "The Seeker", titleHi: "खोजकर्ता", description: "Embodies spiritual wisdom, introspection, and inner knowledge", views: 1564, date: "Jan 21, 2025", icon: "♎" },
  { number: 8, title: "The Powerhouse", titleHi: "शक्तिशाली", description: "Signifies material success, authority, and abundance", views: 2812, date: "Mar 14, 2025", icon: "♏" },
  { number: 9, title: "The Humanitarian", titleHi: "मानवतावादी", description: "Represents compassion, completion, and humanitarian service", views: 2951, date: "Mar 13, 2025", icon: "♐" },
  { number: 10, title: "The Innovator", titleHi: "नवप्रवर्तक", description: "Symbolizes innovation, leadership, and pioneering spirit", views: 3553, date: "Jan 15, 2025", icon: "♑" },
  { number: 11, title: "The Inspirer", titleHi: "प्रेरणादायक", description: "Embodies inspiration, optimism, and spiritual enlightenment", views: 3869, date: "Mar 11, 2025", icon: "♒" },
  { number: 12, title: "The Analyst", titleHi: "विश्लेषक", description: "Represents analytical thinking, harmony, and mediation", views: 3355, date: "Jan 17, 2025", icon: "♓" },
  { number: 13, title: "The Visionary", titleHi: "दूरदर्शी", description: "Signifies vision, imagination, and creative manifestation", views: 1666, date: "Jan 16, 2025", icon: "✦" },
  { number: 14, title: "The Freedom", titleHi: "मुक्ति", description: "Symbolizes freedom, exploration, and personal liberty", views: 2359, date: "Feb 16, 2025", icon: "☽" },
  { number: 15, title: "The Healer", titleHi: "चिकित्सक", description: "Embodies healing abilities, nurturing, and emotional depth", views: 3115, date: "Mar 8, 2025", icon: "☿" },
  { number: 16, title: "The Awakening", titleHi: "जागृति", description: "Represents spiritual awakening and higher consciousness", views: 2843, date: "Mar 1, 2025", icon: "♀" },
  { number: 17, title: "The Star", titleHi: "तारा", description: "Signifies hope, inspiration, and spiritual guidance", views: 1439, date: "Feb 6, 2025", icon: "☉" },
  { number: 18, title: "The Manifester", titleHi: "प्रकटकर्ता", description: "Symbolizes material mastery and powerful manifestation", views: 3606, date: "Feb 20, 2025", icon: "♂" },
  { number: 19, title: "The Teacher", titleHi: "गुरु", description: "Embodies wisdom, teaching, and humanitarian leadership", views: 2950, date: "Feb 9, 2025", icon: "♃" },
  { number: 20, title: "The Awakener", titleHi: "जागरण", description: "Represents awakening consciousness and inner transformation", views: 1749, date: "Feb 24, 2025", icon: "♄" },
  { number: 21, title: "The Intuitive", titleHi: "अंतर्ज्ञानी", description: "Signifies intuition, sensitivity, and psychic abilities", views: 3039, date: "Mar 6, 2025", icon: "⛢" },
  { number: 22, title: "The Master Builder", titleHi: "महानिर्माता", description: "Symbolizes master building and large-scale manifestation", views: 2401, date: "Jan 17, 2025", icon: "♆" },
  { number: 23, title: "The Compassionate", titleHi: "करुणाशील", description: "Embodies compassion, service, and universal love", views: 1211, date: "Jan 18, 2025", icon: "♇" },
  { number: 24, title: "The Warrior", titleHi: "योद्धा", description: "Represents courage, determination, and warrior spirit", views: 1832, date: "Feb 19, 2025", icon: "⚔" },
  { number: 25, title: "The Adventure", titleHi: "साहसिक", description: "Signifies adventure, curiosity, and life experience", views: 1928, date: "Feb 24, 2025", icon: "⚡" },
  { number: 26, title: "The Diplomat", titleHi: "राजनयिक", description: "Symbolizes diplomacy, cooperation, and peaceful resolution", views: 2744, date: "Jan 22, 2025", icon: "⚖" },
  { number: 27, title: "The Idealist", titleHi: "आदर्शवादी", description: "Embodies idealism, vision, and spiritual purpose", views: 3522, date: "Feb 20, 2025", icon: "✧" },
  { number: 28, title: "The Abundance", titleHi: "समृद्धि", description: "Represents material abundance and prosperity", views: 2523, date: "Feb 9, 2025", icon: "❖" },
  { number: 29, title: "The Spiritual", titleHi: "आध्यात्मिक", description: "Signifies spiritual mastery and enlightenment", views: 1070, date: "Jan 19, 2025", icon: "☸" },
  { number: 30, title: "The Expression", titleHi: "अभिव्यक्ति", description: "Symbolizes self-expression, creativity, and communication", views: 1125, date: "Jan 4, 2025", icon: "❂" },
  { number: 31, title: "The Master Teacher", titleHi: "महागुरु", description: "Embodies master teaching and spiritual leadership", views: 3344, date: "Feb 28, 2025", icon: "✡" },
];

const colors = [
  "text-red-600 bg-red-100", "text-amber-600 bg-amber-100", "text-amber-600 bg-amber-100",
  "text-emerald-600 bg-emerald-100", "text-rose-600 bg-rose-100", "text-red-600 bg-red-100",
  "text-red-600 bg-red-100", "text-yellow-600 bg-yellow-100", "text-red-600 bg-red-100",
  "text-amber-600 bg-amber-100", "text-fuchsia-600 bg-fuchsia-100", "text-teal-600 bg-teal-100",
  "text-orange-600 bg-orange-100", "text-amber-600 bg-amber-100", "text-green-600 bg-green-100",
  "text-red-700 bg-red-100", "text-amber-500 bg-amber-100", "text-rose-700 bg-rose-100",
  "text-amber-700 bg-amber-100", "text-red-700 bg-red-100", "text-red-700 bg-red-100",
  "text-emerald-700 bg-emerald-100", "text-pink-600 bg-pink-100", "text-red-700 bg-red-100",
  "text-amber-700 bg-amber-100", "text-slate-600 bg-slate-100", "text-red-600 bg-red-100",
  "text-yellow-700 bg-yellow-100", "text-red-800 bg-red-100", "text-orange-700 bg-orange-100",
  "text-red-800 bg-red-100",
];

const LifePathNumbers = () => {
  const { lang } = useLang();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(6);
  const totalSlides = Math.ceil(lifePathData.length / itemsPerView);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) setItemsPerView(3);
      else if (window.innerWidth < 1024) setItemsPerView(4);
      else setItemsPerView(6);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % totalSlides);
    }, 5000);
    return () => clearInterval(timer);
  }, [totalSlides]);

  const goToPrev = () => setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
  const goToNext = () => setCurrentIndex((prev) => (prev + 1) % totalSlides);

  const visibleItems = lifePathData.slice(
    currentIndex * itemsPerView,
    currentIndex * itemsPerView + itemsPerView
  );

  return (
    <section className="py-16 bg-background relative overflow-hidden">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-medium mb-3">
            <Sparkles className="w-4 h-4" />
            <span>Numerology Insights</span>
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-3">
            Life Path Numbers <span className="text-gradient">1–31</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Discover the hidden meanings behind life path numbers and unlock the secrets of numerology, karma, and spirituality.
          </p>
        </div>

        {/* Cards Row */}
        <div className="relative">
          <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4 transition-all duration-500">
            {visibleItems.map((item, idx) => {
              const colorClass = colors[(item.number - 1) % colors.length];
              return (
                <div
                  key={item.number}
                  className="group bg-card rounded-xl border border-border p-4 text-center hover:shadow-lg hover:border-primary/30 hover:-translate-y-1 transition-all duration-300 cursor-pointer"
                >
                  {/* Icon */}
                  <div className={`w-14 h-14 mx-auto rounded-xl ${colorClass} flex items-center justify-center text-2xl mb-3 group-hover:scale-110 transition-transform duration-300`}>
                    {item.icon}
                  </div>

                  {/* Number */}
                  <div className="text-xs font-bold text-muted-foreground mb-1">#{item.number}</div>

                  {/* Title (Hindi mode adds the English name underneath) */}
                  <h3 className="text-sm font-bold text-foreground mb-0.5 leading-tight">
                    {lang === "hi" ? item.titleHi : item.title}
                  </h3>

                  {lang === "hi" && (
                    <p className="text-xs text-muted-foreground leading-tight">
                      {item.title}
                    </p>
                  )}

                  {/* Views */}
                  <div className="flex items-center justify-center gap-1 mt-2 text-muted-foreground">
                    <Eye className="h-3 w-3" />
                    <span className="text-[10px] font-medium">{item.views.toLocaleString()}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Navigation */}
          <div className="flex justify-center items-center gap-3 mt-8">
            <button
              onClick={goToPrev}
              className="p-2 rounded-full border border-border bg-card text-muted-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-300"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            <div className="flex gap-1.5">
              {Array.from({ length: totalSlides }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    index === currentIndex ? "bg-primary w-6" : "bg-muted w-2"
                  }`}
                />
              ))}
            </div>

            <button
              onClick={goToNext}
              className="p-2 rounded-full border border-border bg-card text-muted-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-300"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LifePathNumbers;
