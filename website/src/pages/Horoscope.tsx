import { zodiacImage } from "@/data/signImages";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useHoroscopes } from "@/hooks/useSupabaseData";
import { ArrowLeft, Sparkles, Heart, Briefcase, Activity, Star } from "lucide-react";
import { useLang, usePick, useT } from "@/hooks/useLang";

// Vedic sign names shown next to the English name in English mode (keyed by the row's name_en)
const VEDIC: Record<string, string> = {
  Aries: "Mesh", Taurus: "Vrishabh", Gemini: "Mithun", Cancer: "Kark", Leo: "Simha", Virgo: "Kanya",
  Libra: "Tula", Scorpio: "Vrishchik", Sagittarius: "Dhanu", Capricorn: "Makar", Aquarius: "Kumbh", Pisces: "Meen",
};

const Horoscope = () => {
  const { data, loading } = useHoroscopes();
  const { lang } = useLang();
  const t = useT();
  const pick = usePick();
  const [selected, setSelected] = useState<any>(null);

  const lines = (txt?: string) => (txt || "").split("\n").filter(Boolean);

  if (selected) {
    const r = selected;
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container mx-auto px-4 py-8 max-w-4xl">
          <button
            onClick={() => setSelected(null)}
            className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline mb-6"
          >
            <ArrowLeft className="h-4 w-4" /> {t("All Signs", "सभी राशियाँ")}
          </button>

          <div className="rounded-2xl gradient-primary text-primary-foreground p-8 flex items-center gap-5">
            <div className="h-20 w-20 shrink-0 overflow-hidden rounded-2xl bg-primary-foreground/15 flex items-center justify-center text-4xl">
              {zodiacImage(r.name_en) ? <img src={zodiacImage(r.name_en)} alt="" className="h-full w-full object-cover" /> : r.symbol}
            </div>
            <div>
              <h1 className="text-3xl font-bold">{pick(r, "name")} <span className="text-primary-foreground/70 text-xl">({lang === "hi" ? r.name_en : VEDIC[r.name_en] ?? r.name_en})</span></h1>
              <p className="mt-1 text-primary-foreground/80">{pick(r, "date_range")}</p>
              <div className="mt-2 flex gap-2 flex-wrap">
                {(pick(r, "tags") || []).map((tag: string) => (
                  <span key={tag} className="rounded-full bg-primary-foreground/15 px-3 py-1 text-xs font-medium">{tag}</span>
                ))}
              </div>
            </div>
          </div>

          <section className="mt-8 space-y-2">
            <h2 className="text-xl font-semibold text-foreground flex items-center gap-2"><Star className="h-5 w-5 text-primary" /> {t("Overview", "परिचय")}</h2>
            {lines(pick(r, "about")).map((p, i) => <p key={i} className="text-muted-foreground leading-relaxed">{p}</p>)}
          </section>

          <div className="mt-8 grid md:grid-cols-2 gap-6">
            <div className="rounded-xl border border-border bg-card p-5">
              <h3 className="font-semibold text-foreground mb-3">{t("Positive Traits", "सकारात्मक गुण")}</h3>
              <ul className="space-y-2">
                {(pick(r, "positive") || []).map((p: string, i: number) => (
                  <li key={i} className="flex gap-2 text-sm text-muted-foreground"><span className="text-primary">+</span>{p}</li>
                ))}
              </ul>
            </div>
            <div className="rounded-xl border border-border bg-card p-5">
              <h3 className="font-semibold text-foreground mb-3">{t("Challenges", "चुनौतियाँ")}</h3>
              <ul className="space-y-2">
                {(pick(r, "negative") || []).map((p: string, i: number) => (
                  <li key={i} className="flex gap-2 text-sm text-muted-foreground"><span className="text-destructive">−</span>{p}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-6 grid md:grid-cols-2 gap-6">
            {[
              { icon: Heart, title: t("Love Life", "प्रेम जीवन"), body: pick(r, "love") },
              { icon: Sparkles, title: t("Compatible Signs", "अनुकूल राशियाँ"), body: pick(r, "compatible") },
              { icon: Briefcase, title: t("Career", "करियर"), body: pick(r, "career") },
              { icon: Briefcase, title: t("Career Paths", "करियर क्षेत्र"), body: pick(r, "career_paths") },
              { icon: Activity, title: t("Health", "स्वास्थ्य"), body: pick(r, "health") },
            ].filter(s => s.body).map((s, i) => (
              <div key={i} className="rounded-xl border border-border bg-card p-5">
                <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2"><s.icon className="h-4 w-4 text-primary" />{s.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{s.body}</p>
              </div>
            ))}
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-10">
        <header className="text-center mb-10">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-semibold text-primary">
            <Sparkles className="h-3.5 w-3.5" /> {t("Zodiac", "राशि चक्र")}
          </span>
          <h1 className="mt-4 text-3xl sm:text-4xl font-bold text-foreground">{t("Know Your Zodiac Sign", "अपनी राशि जानें")}</h1>
          <p className="mt-2 text-muted-foreground">{t("Detailed traits, love, career and health guidance for all 12 signs", "12 राशियों के विस्तृत गुण, प्रेम, करियर और स्वास्थ्य मार्गदर्शन")}</p>
        </header>

        {loading ? (
          <p className="text-center text-muted-foreground">{t("Loading…", "लोड हो रहा है…")}</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
            {data.map((r) => (
              <button
                key={r.id}
                onClick={() => setSelected(r)}
                className="group text-left rounded-xl border border-border bg-card p-5 transition-all hover:-translate-y-1 hover:shadow-lg hover:border-primary/40"
              >
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-primary/10 flex items-center justify-center text-2xl text-primary">{zodiacImage(r.name_en) ? <img src={zodiacImage(r.name_en)} alt="" loading="lazy" className="h-full w-full object-cover" /> : r.symbol}</div>
                  <div>
                    <h3 className="font-bold text-foreground">{pick(r, "name")}</h3>
                    <p className="text-xs text-muted-foreground">{lang === "hi" ? r.name_en : VEDIC[r.name_en] ?? r.name_en}</p>
                  </div>
                </div>
                <p className="mt-3 text-xs text-muted-foreground line-clamp-3">{pick(r, "summary")}</p>
                <p className="mt-3 text-xs font-medium text-primary group-hover:underline">{t("View Details →", "विस्तार देखें →")}</p>
              </button>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Horoscope;
