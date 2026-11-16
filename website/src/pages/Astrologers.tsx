import { useState } from "react";
import { specialtyLabels, matchesAstrologySpecialty } from "@/data/astrologySpecialties";
import { useSearchParams } from "react-router-dom";
import { consultationTopics, matchesConsultationTopic } from "@/data/consultationTopics";
import { Star, Search, MessageSquare, Clock, Phone } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { useAstrologers, type Astrologer } from "@/hooks/useAstrologers";
import { useT } from "@/hooks/useLang";
import logoIcon from "@/assets/logo-icon.png";


const categories = ["सभी", ...specialtyLabels];


const AstrologersPage = () => {
  const t = useT();
  const [searchParams, setSearchParams] = useSearchParams();
  const topic = consultationTopics.find((item) => item.id === searchParams.get("topic"));
  const [activeCat, setActiveCat] = useState("सभी");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Astrologer | null>(null);
  const [sheetType, setSheetType] = useState<"chat" | "call" | null>(null);
  const { data: astrologers = [], isLoading } = useAstrologers();

  const openChat = (a: Astrologer) => { setSelected(a); setSheetType("chat"); };
  const openCall = (a: Astrologer) => { setSelected(a); setSheetType("call"); };

  const filtered = astrologers.filter((a) => {
    const text = `${a.specialty} ${a.about}`;
    const categoryMatch = activeCat === "सभी" || matchesAstrologySpecialty(a.specialty, activeCat);
    const topicMatch = !topic || matchesConsultationTopic(text, topic);
    const query = search.trim().toLowerCase();
    return categoryMatch && topicMatch && `${a.name} ${text} ${a.languages.join(" ")}`.toLowerCase().includes(query);
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Content */}
      <section className="relative bg-secondary/30 py-10 lg:py-14">
        {/* Faint logo watermark across content */}
        <img
          src={logoIcon}
          alt=""
          aria-hidden
          className="pointer-events-none fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[520px] max-w-[80vw] opacity-[0.035] select-none z-0"
        />

        <div className="container mx-auto px-4 relative z-10">
          {/* Compact title, categories and search */}
          <div className="mb-8 flex flex-col gap-4">
            <div className="min-w-0">
              <h1 className="text-2xl font-bold lg:text-3xl">
                {topic ? t(`Astrologers for ${topic.labelEn}`, `${topic.label} के ज्योतिषी`) : <>{t("Our", "हमारे")} <span className="text-primary">{t("Expert Astrologers", "विशेषज्ञ ज्योतिषी")}</span></>}
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                {t("Consult experienced, verified astrologers", "अनुभवी और प्रमाणित ज्योतिषियों से परामर्श लें")}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              {categories.map((cat) => (
                <Button
                  key={cat}
                  variant={activeCat === cat ? "default" : "outline"}
                  size="sm"
                  aria-pressed={activeCat === cat}
                  onClick={() => { setActiveCat(cat); if (cat === "सभी") setSearchParams({}); }}
                  className="rounded-full"
                >
                  {cat === "सभी" ? t("All", "सभी") : cat}
                </Button>
              ))}
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  aria-label={t("Search astrologers", "ज्योतिषी खोजें")}
                  placeholder={t("Search astrologers...", "ज्योतिषी खोजें...")}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="rounded-full bg-card pl-9"
                />
              </div>
            </div>
          </div>

          {/* Grid */}
          {topic && <Button variant="link" className="mb-4 h-auto p-0 text-primary" onClick={() => { setSearchParams({}); setActiveCat("सभी"); }}>{t("View all astrologers", "सभी ज्योतिषी देखें")}</Button>}
          {!isLoading && filtered.length === 0 && <p role="status" className="py-10 text-center text-muted-foreground">{t("No astrologers found for this selection.", "इस चयन में कोई ज्योतिषी नहीं मिले।")}</p>}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {filtered.map((a) => (
              <div
                key={a.id}
                className="bg-card rounded-2xl overflow-hidden border border-border card-shadow hover:card-shadow-hover transition-shadow duration-300"
              >
                {/* Image */}
                <div className="relative">
                  <img
                    src={a.image}
                    alt={a.name}
                    className="w-full h-56 object-cover"
                  />
                  {a.available && (
                    <Badge className="absolute top-3 right-3 bg-cta text-cta-foreground">
                      ● {t("Available", "उपलब्ध")}
                    </Badge>
                  )}
                  <div className="absolute bottom-3 left-3 flex items-center gap-1 bg-black/60 text-white px-2 py-1 rounded-full text-sm">
                    <Star className="h-4 w-4 fill-rating text-rating" />
                    {a.rating}
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 space-y-3">
                  <div>
                    <h3 className="font-semibold text-lg text-foreground">{a.name}</h3>
                    <p className="text-sm text-muted-foreground">{a.specialty}</p>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {a.experienceYears} {t("yrs", "वर्ष")}
                    </span>
                    {a.consultations > 0 && <span className="flex items-center gap-1">
                      <MessageSquare className="h-4 w-4" />
                      {a.consultations} {t("consultations", "परामर्श")}
                    </span>}
                  </div>

                  {/* Languages */}
                  <div className="flex flex-wrap gap-1">
                    {a.languages.map((lang) => (
                      <Badge key={lang} variant="secondary" className="text-xs">
                        {lang}
                      </Badge>
                    ))}
                  </div>

                  {/* Pricing */}
                  <div className="flex items-center justify-between text-sm pt-1">
                    <span className="text-muted-foreground">{t("Chat:", "चैट:")}</span>
                    <span className="font-semibold text-foreground">₹{a.chatPrice}/min</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{t("Call:", "कॉल:")}</span>
                    <span className="font-semibold text-foreground">₹{a.callPrice}/min</span>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 text-primary border-primary"
                      onClick={() => openChat(a)}
                    >
                      {t("Chat", "चैट करें")}
                    </Button>
                    <Button
                      size="sm"
                      className="flex-1 bg-cta text-cta-foreground hover:bg-cta-hover"
                      onClick={() => openCall(a)}
                    >
                      {t("Call", "कॉल करें")}
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      <Footer />

      {/* Chat / Call Sheet */}
      <Sheet open={!!sheetType} onOpenChange={(o) => { if (!o) { setSelected(null); setSheetType(null); } }}>
        <SheetContent className="w-full sm:max-w-md">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-3">
              <img
                src={selected?.image}
                alt={selected?.name}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div>
                <p className="text-left">{selected?.name}</p>
                <p className="text-sm font-normal text-muted-foreground">{selected?.specialty}</p>
              </div>
            </SheetTitle>
            <SheetDescription className="text-left pt-4">
              {selected?.about}
            </SheetDescription>
          </SheetHeader>

          <div className="mt-6 space-y-4">
            <div className="bg-muted/50 rounded-lg p-6 text-center space-y-3">
              {sheetType === "chat" ? <MessageSquare className="h-12 w-12 mx-auto text-primary" /> : <Phone className="h-12 w-12 mx-auto text-primary" />}
              <p className="font-semibold">
                {sheetType === "chat" ? t("Chat", "चैट") : t("Call", "कॉल")} ₹{selected?.[sheetType === "chat" ? "chatPrice" : "callPrice"]}/{t("min", "मिनट")}
              </p>
              <p className="text-sm text-muted-foreground">
                {t(`Download the Astromate app to ${sheetType === "chat" ? "chat" : "talk"} with ${selected?.name ?? ""}.`, `${selected?.name ?? ""} से ${sheetType === "chat" ? "चैट" : "कॉल"} करने के लिए Astromate ऐप डाउनलोड करें।`)}
              </p>
            </div>
            <Button asChild className="w-full bg-primary hover:bg-primary/90">
              <a href="/#app-download" onClick={() => { setSelected(null); setSheetType(null); }}>{t("Download the Astromate App", "Astromate ऐप डाउनलोड करें")}</a>
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default AstrologersPage;
