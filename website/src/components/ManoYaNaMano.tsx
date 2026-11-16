import { useEffect, useState } from "react";
import { fetchSite } from "@/hooks/useSupabaseData";
import { usePick, useT } from "@/hooks/useLang";

type Point = { heading: string; text: string };
type Belief = { id?: string; title: string; title_en?: string; points: Point[]; points_en?: Point[] };

const FALLBACK: Belief[] = [
  {
    title: "बीमारी नहीं छोड़ रही पीछा?",
    title_en: "Can't Shake Off an Illness?",
    points_en: [
      { heading: "Mirror and bed:", text: "Make sure no bedroom mirror reflects your body while you sleep." },
      { heading: "North-East corner:", text: "Don't keep heavy items or a dustbin in this corner." },
      { heading: "Gomti Chakra:", text: "The Gomti Chakra is believed to bring positive energy into the home." },
    ],
    points: [
      { heading: "शीशा और बिस्तर:", text: "बेडरूम में दर्पण (आईना) ऐसा न हो, जिसमें सोते समय शरीर का प्रतिबिंब (Reflection) दिखाई दे।" },
      { heading: "उत्तर-पूर्व (North-East) कोना:", text: "इस कोने में भारी सामान या डस्टबिन न रखें।" },
      { heading: "गोमती चक्र:", text: "गोमती चक्र को घर में सकारात्मक ऊर्जा लाने वाला माना जाता है।" },
    ],
  },
];

const ManoYaNaMano = () => {
  const [beliefs, setBeliefs] = useState<Belief[]>(FALLBACK);
  const t = useT();
  const pick = usePick();

  useEffect(() => {
    (async () => {
      const data = await fetchSite<any[]>("mano_beliefs").catch(() => null);
      if (data && data.length) {
        setBeliefs(data.map((r: any) => ({ id: r.id, title: r.title, title_en: r.title_en, points: (r.points as Point[]) || [], points_en: r.points_en as Point[] | undefined })));
      }
    })();
  }, []);

  return (
    <section id="mano-ya-na-mano" className="py-8 lg:py-12 bg-[#FDF6E3]">
      <div className="max-w-[1280px] mx-auto px-6">
        {/* Header */}
        <h2 className="font-serif text-3xl lg:text-4xl font-bold text-[#1A1A1A] mb-1.5">
          {t("Believe It or Not", "मानो या ना मानो")}
        </h2>
        <p className="text-[0.95rem] text-muted-foreground mb-8">
          {t("Simple remedies rooted in traditional Vastu and astrology beliefs", "परंपरागत वास्तु और ज्योतिष मान्यताओं पर आधारित सरल उपाय")}
        </p>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-5">
          {beliefs.map((belief, idx) => (
            <div
              key={belief.id || idx}
              className="relative bg-[#FFFDF5] rounded-[14px] border border-[hsl(40,50%,85%)] shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 p-5 pt-6 overflow-hidden"
            >
              {/* Folded corner */}
              <div className="absolute top-0 right-0 w-0 h-0 border-t-[26px] border-l-[26px] border-t-primary border-l-transparent" />

              <h3 className="font-serif text-lg font-bold text-primary mb-4 pr-6 leading-snug">
                {pick(belief, "title")}
              </h3>

              <div className="space-y-3">
                {(pick(belief, "points") as Point[]).map((point, i) => (
                  <p key={i} className="text-[0.8rem] text-muted-foreground leading-relaxed">
                    <span className="font-semibold text-foreground">{point.heading} </span>
                    {point.text}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ManoYaNaMano;
