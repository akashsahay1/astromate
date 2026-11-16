import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAstrologyArticles } from "@/hooks/useSupabaseData";
import { ArrowLeft, Sparkles, ArrowRight, Check } from "lucide-react";
import { usePick, useT } from "@/hooks/useLang";

const AboutAstrology = () => {
  const { data, loading } = useAstrologyArticles();
  const tr = useT();
  const pick = usePick();
  const [selected, setSelected] = useState<any>(null);

  if (selected) {
    const a = selected;
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container mx-auto px-4 py-8 max-w-4xl">
          <button onClick={() => setSelected(null)} className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline mb-6">
            <ArrowLeft className="h-4 w-4" /> {tr("All Topics", "सभी विषय")}
          </button>

          <div className="rounded-2xl gradient-primary text-primary-foreground p-8">
            <h1 className="text-3xl font-bold">{pick(a, "title")}</h1>
            {pick(a, "hero_sub") && <p className="mt-2 text-primary-foreground/85">{pick(a, "hero_sub")}</p>}
          </div>

          {pick(a, "intro") && <p className="mt-8 text-muted-foreground leading-relaxed">{pick(a, "intro")}</p>}

          {pick(a, "section_a") && <h2 className="mt-8 text-xl font-semibold text-foreground">{pick(a, "section_a")}</h2>}
          <div className="mt-4 grid sm:grid-cols-2 gap-4">
            {(pick(a, "grid_cards") || []).map((c: any, i: number) => (
              <div key={i} className="rounded-xl border border-border bg-card p-5">
                <h3 className="font-semibold text-foreground">{c.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{c.desc}</p>
              </div>
            ))}
          </div>

          {pick(a, "section_b") && <h2 className="mt-8 text-xl font-semibold text-foreground">{pick(a, "section_b")}</h2>}
          <div className="mt-4 space-y-3">
            {(pick(a, "spreads") || []).map((s: any, i: number) => (
              <div key={i} className="rounded-xl border border-border bg-card p-5 flex gap-4">
                <div className="h-8 w-8 shrink-0 rounded-full bg-primary/10 text-primary flex items-center justify-center font-semibold">{i + 1}</div>
                <div>
                  <h3 className="font-semibold text-foreground">{s.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {pick(a, "section_c") && <h2 className="mt-8 text-xl font-semibold text-foreground">{pick(a, "section_c")}</h2>}
          <ul className="mt-4 grid sm:grid-cols-2 gap-3">
            {(pick(a, "reveals") || []).map((r: string, i: number) => (
              <li key={i} className="flex gap-2 text-sm text-muted-foreground"><Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />{r}</li>
            ))}
          </ul>

          {(pick(a, "cta_title") || pick(a, "cta_sub")) && (
            <div className="mt-10 rounded-2xl border border-primary/20 bg-primary/5 p-8 text-center">
              {pick(a, "cta_title") && <h3 className="text-xl font-semibold text-foreground">{pick(a, "cta_title")}</h3>}
              {pick(a, "cta_sub") && <p className="mt-2 text-sm text-muted-foreground">{pick(a, "cta_sub")}</p>}
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
        <header className="text-center mb-10">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-semibold text-primary">
            <Sparkles className="h-3.5 w-3.5" /> {tr("About Astrology", "ज्योतिष के बारे में")}
          </span>
          <h1 className="mt-4 text-3xl sm:text-4xl font-bold text-foreground">{tr("The World of Astrology", "ज्योतिष की दुनिया")}</h1>
          <p className="mt-2 text-muted-foreground">{tr("Explore the different branches of astrology and our services", "ज्योतिष की विभिन्न विधाओं और सेवाओं को जानें")}</p>
        </header>

        {loading ? (
          <p className="text-center text-muted-foreground">{tr("Loading…", "लोड हो रहा है…")}</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-5xl mx-auto">
            {data.map((t) => (
              <button key={t.id} onClick={() => setSelected(t)}
                className="group text-left rounded-xl border border-border bg-card p-6 transition-all hover:-translate-y-1 hover:shadow-lg hover:border-primary/40 relative min-h-[150px] flex flex-col">
                <h3 className="font-bold text-foreground pr-8">{pick(t, "title")}</h3>
                <p className="mt-2 text-sm text-muted-foreground flex-1">{pick(t, "short")}</p>
                <span className="absolute bottom-5 right-5 h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center group-hover:scale-110 transition-transform">
                  <ArrowRight className="h-4 w-4" />
                </span>
              </button>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default AboutAstrology;
