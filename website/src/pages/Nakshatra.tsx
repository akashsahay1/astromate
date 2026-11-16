import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useNakshatras } from "@/hooks/useSupabaseData";
import { ArrowLeft, Sparkles, Briefcase, Heart, Activity, Coins } from "lucide-react";
import { usePick, useT } from "@/hooks/useLang";

const FILTERS = ["All", "Divine", "Human", "Demon"];

const Nakshatra = () => {
  const { data, loading } = useNakshatras();
  const t = useT();
  const pick = usePick();
  const [selected, setSelected] = useState<any>(null);
  const [filter, setFilter] = useState("All");

  const filtered = filter === "All" ? data : data.filter((n) => n.nature === filter);

  if (selected) {
    const n = selected;
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container mx-auto px-4 py-8 max-w-4xl">
          <button onClick={() => setSelected(null)} className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline mb-6">
            <ArrowLeft className="h-4 w-4" /> {t("All Nakshatras", "सभी नक्षत्र")}
          </button>

          <div className="rounded-2xl gradient-primary text-primary-foreground p-8 flex items-center gap-5">
            <div className="h-20 w-20 rounded-2xl bg-primary-foreground/15 flex items-center justify-center text-4xl">{n.emoji}</div>
            <div>
              <h1 className="text-3xl font-bold">{pick(n, "name")} <span className="text-primary-foreground/70 text-xl">{t("", n.hindi)}</span></h1>
              <p className="mt-1 text-primary-foreground/80">{pick(n, "span")}</p>
              <div className="mt-2 flex gap-2 flex-wrap">
                <span className="rounded-full bg-primary-foreground/15 px-3 py-1 text-xs font-medium">{t("Lord", "स्वामी")}: {pick(n, "lord")}</span>
                <span className="rounded-full bg-primary-foreground/15 px-3 py-1 text-xs font-medium">{pick(n, "nature")}</span>
              </div>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-3">
            {[[t("Element", "तत्व"), pick(n, "element")], [t("Symbol", "चिन्ह"), pick(n, "symbol")], [t("Quality", "गुण"), pick(n, "quality")], [t("Direction", "दिशा"), pick(n, "direction")], [t("Deity", "देवता"), pick(n, "deity")], [t("Gana", "गण"), pick(n, "gana")], [t("Yoni", "योनि"), pick(n, "yoni")]].filter(x => x[1]).map(([k, v]) => (
              <div key={k as string} className="rounded-lg border border-border bg-card p-3">
                <p className="text-xs text-muted-foreground">{k}</p>
                <p className="text-sm font-medium text-foreground">{v}</p>
              </div>
            ))}
          </div>

          <section className="mt-8">
            <h2 className="text-xl font-semibold text-foreground mb-2">{t("Overview", "परिचय")}</h2>
            <p className="text-muted-foreground leading-relaxed">{pick(n, "summary")}</p>
          </section>

          <div className="mt-8 grid md:grid-cols-2 gap-6">
            <div className="rounded-xl border border-border bg-card p-5">
              <h3 className="font-semibold text-foreground mb-3">{t("Key Traits", "मुख्य गुण")}</h3>
              <ul className="space-y-2">{(pick(n, "traits") || []).map((tr: string, i: number) => <li key={i} className="flex gap-2 text-sm text-muted-foreground"><span className="text-primary">•</span>{tr}</li>)}</ul>
            </div>
            <div className="rounded-xl border border-border bg-card p-5">
              <h3 className="font-semibold text-foreground mb-3">{t("Strengths", "शक्तियाँ")}</h3>
              <div className="flex flex-wrap gap-2">{(pick(n, "strengths") || []).map((s: string) => <span key={s} className="rounded-full bg-primary/10 text-primary px-3 py-1 text-xs font-medium">{s}</span>)}</div>
              <h3 className="font-semibold text-foreground mb-2 mt-4">{t("Areas for Growth", "विकास क्षेत्र")}</h3>
              <div className="flex flex-wrap gap-2">{(pick(n, "growth") || []).map((s: string) => <span key={s} className="rounded-full bg-muted text-muted-foreground px-3 py-1 text-xs font-medium">{s}</span>)}</div>
            </div>
          </div>

          <div className="mt-6 grid md:grid-cols-2 gap-6">
            {[{ icon: Briefcase, t: t("Career", "करियर"), b: pick(n, "career") }, { icon: Heart, t: t("Relationships", "रिश्ते"), b: pick(n, "relationships") }, { icon: Coins, t: t("Finance", "धन"), b: pick(n, "finance") }, { icon: Activity, t: t("Health", "स्वास्थ्य"), b: pick(n, "health") }].filter(s => s.b).map((s, i) => (
              <div key={i} className="rounded-xl border border-border bg-card p-5">
                <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2"><s.icon className="h-4 w-4 text-primary" />{s.t}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{s.b}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[[t("Lucky Number", "लकी नंबर"), n.lucky_num], [t("Lucky Colour", "लकी रंग"), pick(n, "lucky_color")], [t("Lucky Gemstone", "लकी रत्न"), pick(n, "lucky_gem")]].filter(x => x[1]).map(([k, v]) => (
              <div key={k as string} className="rounded-lg border border-border bg-card p-4 text-center">
                <p className="text-xs text-muted-foreground">{k}</p>
                <p className="text-sm font-semibold text-primary">{v}</p>
              </div>
            ))}
          </div>

          {pick(n, "spiritual") && (
            <div className="mt-6 rounded-xl border border-primary/20 bg-primary/5 p-5">
              <h3 className="font-semibold text-foreground mb-2">{t("Spiritual Significance", "आध्यात्मिक महत्व")}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed italic">{pick(n, "spiritual")}</p>
            </div>
          )}
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-10">
        <header className="text-center mb-8">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-semibold text-primary">
            <Sparkles className="h-3.5 w-3.5" /> {t("Nakshatra", "नक्षत्र")}
          </span>
          <h1 className="mt-4 text-3xl sm:text-4xl font-bold text-foreground">{t("The World of the 27 Nakshatras", "27 नक्षत्रों का संसार")}</h1>
          <p className="mt-2 text-muted-foreground">{t("A detailed guide to every nakshatra in Vedic astrology", "वैदिक ज्योतिष के अनुसार हर नक्षत्र का विस्तृत विवरण")}</p>
        </header>

        <div className="flex justify-center gap-2 flex-wrap mb-8">
          {FILTERS.map((f) => (
            <button key={f} onClick={() => setFilter(f)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium border transition-colors ${filter === f ? "bg-primary text-primary-foreground border-primary" : "bg-card text-muted-foreground border-border hover:border-primary/40"}`}>
              {f === "All" ? t("All", "सभी") : f}
            </button>
          ))}
        </div>

        {loading ? (
          <p className="text-center text-muted-foreground">{t("Loading…", "लोड हो रहा है…")}</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 max-w-5xl mx-auto">
            {filtered.map((n) => (
              <button key={n.id} onClick={() => setSelected(n)}
                className="group text-center rounded-xl border border-border bg-card p-4 transition-all hover:-translate-y-1 hover:shadow-lg hover:border-primary/40">
                <span className="text-3xl">{n.emoji}</span>
                <h3 className="mt-2 font-semibold text-sm text-foreground">{pick(n, "name")}</h3>
                {t("", n.hindi) && <p className="text-xs text-muted-foreground">{n.hindi}</p>}
                <p className="mt-1 text-[0.7rem] text-primary">{pick(n, "lord")}</p>
              </button>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Nakshatra;
