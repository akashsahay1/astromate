import { Apple } from "lucide-react";
import { specialtyLabels } from "@/data/astrologySpecialties";
import astrologerWoman from "@/assets/astrologer-woman.webp";
import { useT } from "@/hooks/useLang";

const specialties = specialtyLabels;

const languages = [
  "हिन्दी",
  "English",
  "தமிழ்",
  "తెలుగు",
  "বাংলা",
  "मराठी",
  "ಕನ್ನಡ",
  "ਪੰਜਾਬੀ",
  "ગુજરાતી",
  "Malayalam",
  "Sindhi",
  "Bhojpuri",
  "Assamese",
  "Sanskrit",
  "Nepali",
];

const stats = [
  { num: "50K+", label: "संतुष्ट ग्राहक", labelEn: "Happy customers" },
  { num: "100+", label: "विशेषज्ञ ज्योतिषी", labelEn: "Expert astrologers" },
  { num: "4.9★", label: "रेटिंग", labelEn: "Rating" },
];

const Marquee = ({
  items,
  reverse,
  sep,
  className,
}: {
  items: string[];
  reverse?: boolean;
  sep: string;
  className: string;
}) => {
  const doubled = [...items, ...items];
  return (
    <div
      className="relative z-[2] w-full overflow-hidden"
      style={{
        WebkitMaskImage:
          "linear-gradient(90deg, transparent 0, #000 8%, #000 92%, transparent 100%)",
        maskImage:
          "linear-gradient(90deg, transparent 0, #000 8%, #000 92%, transparent 100%)",
      }}
    >
      <div
        className={`flex w-max motion-reduce:animate-none ${reverse ? "animate-[marquee-right_60s_linear_infinite]" : "animate-[marquee-left_64s_linear_infinite]"}`}
      >
        {doubled.map((word, i) => (
          <span key={i} className={`flex items-center gap-3.5 whitespace-nowrap px-3.5 ${className}`}>
            {word}
            <span className="text-[hsl(var(--hero-gold-light))]">{sep}</span>
          </span>
        ))}
      </div>
    </div>
  );
};

const AstrologyAppBanner = () => {
  const t = useT();
  return (
    <section id="app-download" className="container mx-auto px-4 lg:px-8 py-8 lg:py-12">
      <style>{`
        @keyframes marquee-left { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        @keyframes marquee-right { from { transform: translateX(-50%); } to { transform: translateX(0); } }
      `}</style>

      {/* Hero */}
      <div
        className="relative flex flex-wrap items-center justify-between gap-10 overflow-hidden rounded-3xl px-8 py-12 lg:px-14"
        style={{
          background:
            "radial-gradient(ellipse at 15% 20%, hsl(var(--primary) / 0.55) 0%, transparent 45%), radial-gradient(ellipse at 55% 75%, hsl(var(--hero-saffron) / 0.45) 0%, transparent 55%), radial-gradient(ellipse at 90% 40%, hsl(358 100% 8% / 0.9) 0%, transparent 60%), hsl(0 0% 9%)",
        }}
      >
        {/* Text */}
        <div className="relative z-[2] max-w-[480px]">
          <div className="mb-4 text-xs font-bold uppercase tracking-[2.5px] text-primary-foreground/60">
            Astromate for iOS &amp; Android
          </div>
          <h2 className="mb-4 text-3xl font-extrabold leading-tight text-primary-foreground lg:text-[42px]">
            {t("India's Astrology App", "भारत का ज्योतिष ऐप")}
          </h2>
          <p className="mb-7 max-w-[420px] text-sm leading-relaxed text-primary-foreground/70">
            {t(
              "Predictions 24/7: Kundli, horoscopes and live chat with astrologers! Your first chat for just ₹1, plus free Kundli and Muhurat alerts — all in one app!",
              "भविष्यवाणी 24/7: कुंडली, राशिफल और लाइव ज्योतिषियों से चैट! पहली चैट मात्र ₹1 में या फ्री कुंडली व मुहूर्त अलर्ट्स — सब कुछ एक ही ऐप पर!",
            )}
          </p>

          <div className="mb-8 flex flex-wrap gap-3.5">
            <a
              href="#"
              className="flex items-center gap-2.5 rounded-xl border border-primary-foreground/25 bg-[hsl(243_55%_6%)] px-4 py-2 text-primary-foreground transition-colors hover:border-[hsl(var(--hero-gold))]"
            >
              <Apple className="h-6 w-6" />
              <span className="flex flex-col leading-tight">
                <span className="text-[9px] uppercase tracking-wide opacity-80">Download on the</span>
                <span className="text-[15px] font-bold">App Store</span>
              </span>
            </a>
            <a
              href="#"
              className="flex items-center gap-2.5 rounded-xl border border-primary-foreground/25 bg-[hsl(243_55%_6%)] px-4 py-2 text-primary-foreground transition-colors hover:border-[hsl(var(--hero-gold))]"
            >
              <svg viewBox="0 0 24 24" className="h-6 w-6">
                <path fill="hsl(var(--hero-gold-light))" d="M3.6 2.6c-.3.3-.5.7-.5 1.2v16.4c0 .5.2.9.5 1.2l.1.1L13.3 12 3.7 2.5l-.1.1z" />
                <path fill="hsl(var(--hero-saffron))" d="M16.4 15.2l-3.1-3.2 3.1-3.1 3.7 2.1c1 .6 1 1.6 0 2.2l-3.7 2z" />
              </svg>
              <span className="flex flex-col leading-tight">
                <span className="text-[9px] uppercase tracking-wide opacity-80">Get it on</span>
                <span className="text-[15px] font-bold">Google Play</span>
              </span>
            </a>
          </div>

          <div className="flex flex-wrap gap-10">
            {stats.map((s) => (
              <div key={s.label}>
                <div className="mb-1 text-xl font-extrabold text-primary-foreground">{s.num}</div>
                <div className="text-xs text-primary-foreground/55">{t(s.labelEn, s.label)}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Phone */}
        <div className="relative z-[2] hidden shrink-0 sm:block">
          <div className="relative rounded-[38px] border-[3px] border-[hsl(243_30%_20%)] bg-[hsl(243_40%_10%)] p-2.5 shadow-2xl">
            <div className="absolute left-1/2 top-4 z-10 h-2 w-16 -translate-x-1/2 rounded-md bg-[hsl(243_55%_6%)]" />
            <div
              className="relative flex h-[490px] w-[240px] flex-col items-center justify-end overflow-hidden rounded-[28px]"
              style={{
                background:
                  "radial-gradient(ellipse at 30% 20%, hsl(var(--hero-gold) / 0.35) 0%, transparent 50%), radial-gradient(circle, hsl(358 100% 14%) 0%, hsl(0 0% 6%) 80%)",
              }}
            >
              <div className="absolute left-[18px] right-[18px] top-9 z-[3] text-sm font-semibold leading-snug text-primary-foreground">
                {t("India's", "भारत का")}
                <br />
                {t("Astrology App", "ज्योतिष ऐप")}
              </div>
              <img
                src={astrologerWoman}
                alt={t("Expert astrologer", "विशेषज्ञ ज्योतिषी")}
                className="absolute inset-0 z-[1] h-full w-full object-cover"
              />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[3] h-24 bg-gradient-to-t from-[hsl(243_55%_6%)] to-transparent" />
            </div>
          </div>
        </div>
      </div>

      {/* Marquee banner */}
      <div
        className="relative mt-6 flex min-h-[230px] flex-col items-center justify-center overflow-hidden rounded-3xl px-5 py-8"
        style={{
          background:
            "radial-gradient(ellipse at 8% 30%, hsl(var(--primary) / 0.55) 0%, hsl(var(--primary) / 0.2) 30%, transparent 60%), radial-gradient(ellipse at 50% 60%, hsl(var(--hero-saffron) / 0.45) 0%, hsl(var(--hero-saffron) / 0.2) 40%, transparent 70%), hsl(0 0% 7%)",
        }}
      >
        <div className="relative z-[2] mb-6 text-center text-xs font-semibold uppercase tracking-[3px] text-primary-foreground/60">
          {t(
            `${languages.length} languages & ${specialties.length} specialities • India's app with 24/7 live chat!`,
            `${languages.length} भाषाएँ और ${specialties.length} विशेषज्ञताएँ • 24/7 लाइव चैट के साथ भारत का ऐप!`,
          )}
        </div>

        <Marquee
          items={specialties}
          sep="✦"
          className="text-xl font-bold text-primary-foreground lg:text-3xl"
        />
        <div className="h-6" />
        <Marquee
          items={languages}
          reverse
          sep="·"
          className="text-base font-medium text-primary-foreground/80 lg:text-xl"
        />
      </div>
    </section>
  );
};

export default AstrologyAppBanner;
