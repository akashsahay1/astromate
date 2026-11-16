import { Sparkles, ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useT } from "@/hooks/useLang";

import astro1 from "@/assets/astro-1.webp";
import astro3 from "@/assets/astro-3.webp";
import astro4 from "@/assets/astro-4.webp";
import astro5 from "@/assets/astro-5.webp";
import astro6 from "@/assets/astro-6.webp";

const heroImages = [
  { src: astro1, alt: "पंडित जी – वैदिक ज्योतिषी", altEn: "Pandit ji – Vedic astrologer" },
  { src: astro6, alt: "महिला ज्योतिषी – वैदिक विशेषज्ञ", altEn: "Female astrologer – Vedic expert" },
  { src: astro3, alt: "वरिष्ठ पंडित – वैदिक आचार्य", altEn: "Senior Pandit – Vedic Acharya" },
  { src: astro4, alt: "महिला ज्योतिषी – अंक ज्योतिष विशेषज्ञ", altEn: "Female astrologer – Numerology expert" },
  { src: astro5, alt: "महिला ज्योतिषी – कुंडली विशेषज्ञ", altEn: "Female astrologer – Kundli expert" },
];

// दिन के अनुसार ऑनलाइन ज्योतिषी संख्या (रवि→शनि)
const DAY_COUNTS = ["856+", "356+", "522+", "412+", "298+", "651+", "575+"];

const stats = [
  { value: "09", label: "भाषाओं+", labelEn: "Languages+" },
  { value: "100%", label: "Private consultation", labelEn: "Private consultation" },
  { value: "100+", label: "विशेषज्ञ ज्योतिषी", labelEn: "Expert astrologers" },
  { value: "4.9★", label: "रेटिंग", labelEn: "Rating" },
];


const Hero = () => {
  const navigate = useNavigate();
  const t = useT();
  const [active, setActive] = useState(0);
  const onlineCount = DAY_COUNTS[new Date().getDay()];

  useEffect(() => {
    const id = setInterval(() => {
      setActive((i) => (i + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(id);
  }, []);


  return (
    <section className="relative overflow-hidden bg-[linear-gradient(135deg,hsl(240_20%_99%)_0%,hsl(243_40%_96%)_100%)]">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid lg:grid-cols-[1fr_440px] items-center gap-8 min-h-[480px] lg:min-h-[560px]">

          {/* Left content */}
          <div className="py-10 lg:py-16 text-center lg:text-left">
            {/* Live astrologers online */}
            <div className="flex items-center justify-center lg:justify-start">

              <span className="inline-flex items-center gap-2 rounded-full border border-[hsl(142_71%_45%/0.3)] bg-[hsl(142_71%_45%/0.08)] px-3.5 py-1.5 text-xs sm:text-sm font-semibold text-[hsl(142_71%_30%)]">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[hsl(142_71%_45%)] opacity-75" />
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[hsl(142_71%_45%)]" />
                </span>
                {onlineCount} Top Rated astrologers online now
              </span>
            </div>


            {/* Heading */}
            <h1 className="mt-5 font-bold leading-tight text-3xl sm:text-4xl lg:text-5xl text-foreground">
              {t("Discover Your", "अपने")}{" "}
              <span className="text-[hsl(var(--hero-saffron))]">{t("Future", "भविष्य")}</span>{" "}
              {t("", "को जानें")}
              <br />
              {t("with", "विश्वसनीय")}{" "}
              <span className="text-primary">{t("Trusted Astrology", "ज्योतिष")}</span>{" "}
              {t("", "के साथ")}
            </h1>

            {/* Description */}
            <p className="mt-4 mx-auto lg:mx-0 max-w-xl text-sm sm:text-base text-muted-foreground">
              {t(
                "Connect with India's verified, experienced astrologers. Get Kundli analysis, horoscopes, marriage matching and career guidance.",
                "भारत के प्रमाणित और अनुभवी ज्योतिषियों से जुड़ें। कुंडली विश्लेषण, राशिफल, विवाह मेचिंग और करियर मार्गदर्शन प्राप्त करें।",
              )}
            </p>

            {/* CTA buttons */}
            <div className="mt-7 flex flex-wrap items-center justify-center lg:justify-start gap-3">
              <button
                onClick={() => navigate("/free-kundli")}
                className="inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/25 hover:scale-105 transition-transform"
              >
                {t("Get Free Kundli", "फ्री कुंडली बनाएं")}
                <Sparkles className="h-4 w-4" />
              </button>
              <button
                onClick={() => document.getElementById("app-download")?.scrollIntoView({ behavior: "smooth" })}
                className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-background px-7 py-3 text-sm font-bold text-primary hover:bg-primary/5 transition-colors"
              >
                {t("Download App", "ऐप डाउनलोड करें")}
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>

            {/* Stats */}
            <div className="mt-10 grid grid-cols-4 gap-3 max-w-lg mx-auto lg:mx-0">
              {stats.map((s) => (
                <div key={s.label} className="text-center lg:text-left">
                  <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-primary">
                    {s.value}
                  </div>
                  <div className="mt-1 text-[0.7rem] sm:text-xs text-muted-foreground">
                    {t(s.labelEn, s.label)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right image – auto-rotating astrologers */}
          <div className="relative hidden lg:block h-[560px] self-end">
            {heroImages.map((img, i) => (
              <img
                key={img.src}
                src={img.src}
                alt={t(img.altEn, img.alt)}
                loading={i === 0 ? "eager" : "lazy"}
                className={`absolute inset-0 mx-auto h-[560px] w-auto object-contain object-bottom transition-opacity duration-1000 ease-in-out ${
                  i === active ? "opacity-100" : "opacity-0"
                }`}
              />
            ))}
          </div>

        </div>
      </div>
    </section>
  );
};

export default Hero;
