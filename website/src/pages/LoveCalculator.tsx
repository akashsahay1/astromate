import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Heart, Sparkles } from "lucide-react";
import { useT } from "@/hooks/useLang";

// [from, to, Hindi, English]
const messages: [number, number, string, string][] = [
  [0, 30, "थोड़ी मुश्किल है... पर कोशिश जारी रखो!", "A bit tricky... but keep trying!"],
  [30, 50, "दोस्ती पक्की है, प्यार का देखना पड़ेगा!", "The friendship is solid — love remains to be seen!"],
  [50, 70, "अच्छी केमिस्ट्री है! काफ़ी संभावनाएँ हैं।", "Great chemistry! Lots of potential here."],
  [70, 85, "वाह! दिल से दिल मिलता है तुम्हारा!", "Wow! Your hearts are truly in sync!"],
  [85, 95, "एक दूसरे के लिए बने हो तुम!", "You two are made for each other!"],
  [95, 100, "परफेक्ट मैच! सच में सोलमेट्स हो!", "Perfect match! True soulmates!"],
];

const LoveCalculator = () => {
  const t = useT();
  const [n1, setN1] = useState("");
  const [n2, setN2] = useState("");
  const [result, setResult] = useState<{ score: number; msg: string; msgEn: string } | null>(null);

  const calc = () => {
    if (!n1.trim() || !n2.trim()) return;
    const combined = (n1 + n2).toLowerCase().replace(/\s/g, "");
    let hash = 0;
    for (let i = 0; i < combined.length; i++) hash = (hash * 31 + combined.charCodeAt(i)) % 100;
    const score = Math.max(10, Math.min(99, (hash + combined.length * 7) % 100));
    let [, , msg, msgEn] = messages[messages.length - 1];
    for (const [lo, hi, text, textEn] of messages) { if (score >= lo && score < hi) { msg = text; msgEn = textEn; break; } }
    setResult({ score, msg, msgEn });
  };

  const reset = () => { setN1(""); setN2(""); setResult(null); };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-12 flex justify-center">
        <div className="w-full max-w-md">
          <header className="text-center mb-8">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-semibold text-primary">
              <Sparkles className="h-3.5 w-3.5" /> {t("Love Calculator", "लव कैलकुलेटर")}
            </span>
            <h1 className="mt-4 text-3xl font-bold text-foreground flex items-center justify-center gap-2">
              {t("Measure Your Love", "प्यार नापें")} <Heart className="h-6 w-6 text-primary fill-primary" />
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">{t("Enter your name and your partner's name", "अपना और पार्टनर का नाम डालें")}</p>
          </header>

          <div className="rounded-2xl border border-border bg-card p-7 shadow-sm">
            <label className="block text-xs font-medium uppercase tracking-wide text-muted-foreground mb-1.5">{t("Your name", "आपका नाम")}</label>
            <input value={n1} onChange={(e) => setN1(e.target.value)} maxLength={40} placeholder={t("e.g. Rahul", "जैसे: राहुल")}
              className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm text-foreground outline-none focus:border-primary mb-4" />

            <div className="text-center text-2xl text-primary/60 my-2">💕</div>

            <label className="block text-xs font-medium uppercase tracking-wide text-muted-foreground mb-1.5">{t("Partner's name", "पार्टनर का नाम")}</label>
            <input value={n2} onChange={(e) => setN2(e.target.value)} maxLength={40} placeholder={t("e.g. Priya", "जैसे: प्रिया")}
              onKeyDown={(e) => e.key === "Enter" && calc()}
              className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm text-foreground outline-none focus:border-primary mb-5" />

            <button onClick={calc}
              className="w-full rounded-lg bg-primary py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors">
              {t("Calculate Love", "प्यार नापो")} ❤️
            </button>

            {result && (
              <div className="mt-7 text-center animate-fade-in">
                <p className="text-sm text-muted-foreground">{n1} &amp; {n2}</p>
                <p className="mt-3 text-5xl font-bold text-primary">{result.score}%</p>
                <div className="my-4 h-2 w-full rounded-full bg-muted overflow-hidden">
                  <div className="h-2 rounded-full gradient-primary transition-all duration-1000" style={{ width: `${result.score}%` }} />
                </div>
                <p className="text-sm text-foreground leading-relaxed">{t(result.msgEn, result.msg)}</p>
                <button onClick={reset} className="mt-5 rounded-lg border border-border px-5 py-2 text-xs text-muted-foreground hover:bg-muted transition-colors">
                  {t("Try again", "दोबारा try करें")}
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default LoveCalculator;
