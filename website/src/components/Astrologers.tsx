import { useState } from "react";
import { specialtyLabels, matchesAstrologySpecialty } from "@/data/astrologySpecialties";
import { Star, Clock, MessageSquare, Phone, X, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { useAstrologers, type Astrologer } from "@/hooks/useAstrologers";
import { useT } from "@/hooks/useLang";


const categories = ["सभी", ...specialtyLabels];


const Astrologers = () => {
  const t = useT();
  const [selectedAstrologer, setSelectedAstrologer] = useState<Astrologer | null>(null);
  const [sheetType, setSheetType] = useState<"chat" | "call" | null>(null);

  const handleChat = (astrologer: Astrologer) => {
    setSelectedAstrologer(astrologer);
    setSheetType("chat");
  };

  const handleCall = (astrologer: Astrologer) => {
    setSelectedAstrologer(astrologer);
    setSheetType("call");
  };

  const closeSheet = () => {
    setSelectedAstrologer(null);
    setSheetType(null);
  };

  const [activeCat, setActiveCat] = useState("सभी");
  const [search, setSearch] = useState("");

  const { data: astrologers = [], isLoading } = useAstrologers();

  const filtered = astrologers.filter((a) => {
    const catOk =
      activeCat === "सभी" ||
      matchesAstrologySpecialty(a.specialty, activeCat);
    const q = search.trim().toLowerCase();
    const searchOk =
      !q ||
      a.name.toLowerCase().includes(q) ||
      a.specialty.toLowerCase().includes(q) ||
      a.languages.some((l) => l.toLowerCase().includes(q));
    return catOk && searchOk;
  });

  return (
    <section id="astrologers" className="py-10 lg:py-14 bg-secondary/30">
      <div className="container mx-auto px-4">
        {/* Header row: title + filters + search */}
        <div className="flex flex-col gap-4 mb-8">
          <div>
            <h2 className="text-2xl lg:text-3xl font-bold">
              {t("Our", "हमारे")} <span className="text-primary">{t("Expert Astrologers", "विशेषज्ञ ज्योतिषी")}</span>
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
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
                className="rounded-full"
                onClick={() => setActiveCat(cat)}
              >
                {cat === "सभी" ? t("All", "सभी") : cat}
              </Button>
            ))}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={t("Search astrologers...", "ज्योतिषी खोजें...")}
                className="pl-9 w-full sm:w-64 rounded-full bg-card"
              />
            </div>
          </div>
        </div>

        {/* Astrologer Cards */}
        {!isLoading && filtered.length === 0 && <p role="status" className="py-10 text-center text-muted-foreground">{t("No astrologers found for this selection.", "इस चयन में कोई ज्योतिषी नहीं मिले।")}</p>}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">

          {filtered.map((astrologer) => (
            <div
              key={astrologer.id}
              className="bg-card rounded-2xl overflow-hidden card-shadow hover:card-shadow-hover transition-shadow duration-300"
            >
              {/* Image */}
              <div className="relative">
                <img
                  src={astrologer.image}
                  alt={astrologer.name}
                  className="w-full h-56 object-cover"
                />
                {/* Availability Badge */}
                {astrologer.available && (
                  <Badge className="absolute top-3 right-3 bg-cta text-cta-foreground">
                    ● {t("Available", "उपलब्ध")}
                  </Badge>
                )}
                {/* Rating */}
                <div className="absolute bottom-3 left-3 flex items-center gap-1 bg-black/60 text-white px-2 py-1 rounded-full text-sm">
                  <Star className="h-4 w-4 fill-rating text-rating" />
                  {astrologer.rating}
                </div>
              </div>

              {/* Content */}
              <div className="p-4 space-y-3">
                <div>
                  <h3 className="font-semibold text-lg">{astrologer.name}</h3>
                  <p className="text-sm text-muted-foreground">{astrologer.specialty}</p>
                </div>

                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {astrologer.experienceYears} {t("yrs experience", "वर्ष का अनुभव")}
                  </span>
                  {astrologer.consultations > 0 && <span className="flex items-center gap-1">
                    <MessageSquare className="h-4 w-4" />
                    {astrologer.consultations} {t("consultations", "परामर्श")}
                  </span>}
                </div>

                {/* Languages */}
                <div className="flex flex-wrap gap-1">
                  {astrologer.languages.map((lang) => (
                    <Badge key={lang} variant="secondary" className="text-xs">
                      {lang}
                    </Badge>
                  ))}
                </div>

                {/* Rates */}
                <div className="flex items-center justify-between rounded-lg bg-secondary/60 px-3 py-2 text-xs">
                  <span className="flex items-center gap-1 text-muted-foreground">
                    <MessageSquare className="h-3.5 w-3.5" />
                    {t("Chat", "चैट")} <span className="font-semibold text-foreground">₹{astrologer.chatPrice}/{t("min", "मिनट")}</span>
                  </span>
                  <span className="flex items-center gap-1 text-muted-foreground">
                    <Phone className="h-3.5 w-3.5" />
                    {t("Call", "कॉल")} <span className="font-semibold text-foreground">₹{astrologer.callPrice}/{t("min", "मिनट")}</span>
                  </span>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1 text-primary border-primary"
                    onClick={() => handleChat(astrologer)}
                  >
                    {t("Chat", "चैट करें")}
                  </Button>
                  <Button 
                    size="sm" 
                    className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
                    onClick={() => handleCall(astrologer)}
                  >
                    {t("Call", "कॉल करें")}
                  </Button>
                </div>

              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat/Call Sheet */}
      <Sheet open={!!sheetType} onOpenChange={closeSheet}>
        <SheetContent className="w-full sm:max-w-md">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-3">
              <img
                src={selectedAstrologer?.image}
                alt={selectedAstrologer?.name}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div>
                <p className="text-left">{selectedAstrologer?.name}</p>
                <p className="text-sm font-normal text-muted-foreground">{selectedAstrologer?.specialty}</p>
              </div>
            </SheetTitle>
            <SheetDescription className="text-left pt-4">
              {selectedAstrologer?.about}
            </SheetDescription>
          </SheetHeader>

          <div className="mt-6 space-y-4">
            <div className="bg-muted/50 rounded-lg p-6 text-center space-y-3">
              {sheetType === "chat" ? <MessageSquare className="h-12 w-12 mx-auto text-primary" /> : <Phone className="h-12 w-12 mx-auto text-primary" />}
              <p className="font-semibold">
                {sheetType === "chat" ? t("Chat", "चैट") : t("Call", "कॉल")} ₹{selectedAstrologer?.[sheetType === "chat" ? "chatPrice" : "callPrice"]}/{t("min", "मिनट")}
              </p>
              <p className="text-sm text-muted-foreground">
                {t(`Download the Astromate app to ${sheetType === "chat" ? "chat" : "talk"} with ${selectedAstrologer?.name ?? ""}.`, `${selectedAstrologer?.name ?? ""} से ${sheetType === "chat" ? "चैट" : "कॉल"} करने के लिए Astromate ऐप डाउनलोड करें।`)}
              </p>
            </div>
            <Button asChild className="w-full bg-primary hover:bg-primary/90">
              <a href="/#app-download" onClick={closeSheet}>{t("Download the Astromate App", "Astromate ऐप डाउनलोड करें")}</a>
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </section>
  );
};

export default Astrologers;