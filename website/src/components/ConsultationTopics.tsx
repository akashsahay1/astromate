import { Link } from "react-router-dom";
import { ArrowRight, Heart, Gem, BriefcaseBusiness, House, ChartNoAxesCombined, HeartPulse } from "lucide-react";
import { Button } from "@/components/ui/button";
import { consultationTopics } from "@/data/consultationTopics";
import { useT } from "@/hooks/useLang";

const icons = [Heart, Gem, BriefcaseBusiness, House, ChartNoAxesCombined, HeartPulse];

const cardStyles = [
  { box: "bg-rose-500/15 text-rose-600", art: "text-rose-500/10", count: "4,280+" },
  { box: "bg-orange-500/15 text-orange-600", art: "text-orange-500/10", count: "3,150+" },
  { box: "bg-red-500/15 text-red-600", art: "text-red-500/10", count: "2,940+" },
  { box: "bg-red-500/15 text-red-600", art: "text-red-500/10", count: "1,870+" },
  { box: "bg-amber-500/15 text-amber-600", art: "text-amber-500/10", count: "2,460+" },
  { box: "bg-pink-500/15 text-pink-600", art: "text-pink-500/10", count: "1,620+" },
];

const ConsultationTopics = () => {
  const t = useT();
  return (
  <section className="bg-background py-10 lg:py-14" aria-labelledby="consultation-topics-title">
    <div className="mx-auto max-w-[1280px] px-6">
      <div className="mb-7 flex flex-wrap items-center justify-between gap-4">
        <h2 id="consultation-topics-title" className="text-2xl font-bold leading-relaxed text-foreground lg:text-3xl">
          {t("Talk to an", "आज ही बात करें")} <span className="text-primary">{t("Expert Astrologer Today", "विशेषज्ञ ज्योतिषी से")}</span>
        </h2>
        <Button asChild variant="outline" className="border-primary/25 text-primary hover:bg-secondary hover:text-primary">
          <Link to="/astrologers">{t("View all astrologers", "सभी ज्योतिषी देखें")} <ArrowRight aria-hidden="true" /></Link>
        </Button>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {consultationTopics.map((topic, index) => {
          const Icon = icons[index];
          const style = cardStyles[index % cardStyles.length];
          return (
            <Link
              key={topic.id}
              to={`/astrologers?topic=${topic.id}`}
              className="group relative flex min-h-[170px] flex-col justify-between overflow-hidden rounded-xl border border-border bg-card p-5 card-shadow transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:card-shadow-hover"
            >
              {Icon && (
                <Icon
                  aria-hidden="true"
                  className={`pointer-events-none absolute -right-4 -top-4 h-28 w-28 rotate-12 ${style.art} transition-transform duration-300 group-hover:rotate-6 group-hover:scale-110`}
                />
              )}
              <span className={`relative flex h-11 w-11 items-center justify-center rounded-lg ${style.box}`}>
                {Icon && <Icon aria-hidden="true" className="h-5 w-5" />}
              </span>
              <span className="relative mt-6 flex w-full items-end justify-between gap-3">
                <span>
                  <span className="block text-base font-semibold text-card-foreground">{t(topic.labelEn, topic.label)}</span>
                  <span className="mt-1 block text-xs text-muted-foreground">{style.count} {t("astrologers available", "ज्योतिषी उपलब्ध")}</span>
                </span>
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-secondary text-primary transition-all duration-300 group-hover:bg-primary group-hover:text-primary-foreground">
                  <ArrowRight aria-hidden="true" className="h-4 w-4 transition-transform motion-safe:group-hover:translate-x-0.5" />
                </span>
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  </section>
  );
};

export default ConsultationTopics;
