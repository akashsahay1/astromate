import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useT } from "@/hooks/useLang";

type Meaning = { title: string; text: string; benefit: string; color: string; day: string; titleEn: string; textEn: string; benefitEn: string; colorEn: string; dayEn: string };

const MEANINGS: Record<number, Meaning> = {
  0: {
    title: "शून्य - अनंत संभावनाएं",
    text: "आप में असीम क्षमता है। आप नए सिरे से शुरुआत करने और खुद को हर बार फिर से गढ़ने में विश्वास रखते हैं।",
    benefit: "फायदा: नई शुरुआत करने का साहस आपको मुश्किल हालातों से भी उबार लेगा।",
    color: "रंग: सफेद", day: "दिन: रविवार",
    titleEn: "Zero - Infinite Possibilities",
    textEn: "You have limitless potential. You believe in starting afresh and reinventing yourself again and again.",
    benefitEn: "Benefit: The courage to begin anew will carry you through even the toughest times.",
    colorEn: "Colour: White", dayEn: "Day: Sunday",
  },
  1: {
    title: "एक - नेतृत्व करने वाले",
    text: "आप स्वाभाविक नेता हैं। आत्मनिर्भरता, आत्मविश्वास और नई राह बनाने की क्षमता आपकी पहचान है।",
    benefit: "फायदा: करियर में आगे बढ़ने और खुद के फैसले लेने में यह अंक आपकी मदद करेगा।",
    color: "रंग: लाल", day: "दिन: रविवार",
    titleEn: "One - The Leader",
    textEn: "You are a natural leader. Self-reliance, confidence and the ability to forge new paths define you.",
    benefitEn: "Benefit: This number will help you advance in your career and make your own decisions.",
    colorEn: "Colour: Red", dayEn: "Day: Sunday",
  },
  2: {
    title: "दो - संतुलन के साधक",
    text: "आप संवेदनशील और सहयोगी स्वभाव के हैं। रिश्तों में संतुलन बनाना और दूसरों को साथ लेकर चलना आपकी खूबी है।",
    benefit: "फायदा: रिश्तों में मिठास और टीम वर्क में यह अंक आपको फायदा देगा।",
    color: "रंग: सफेद", day: "दिन: सोमवार",
    titleEn: "Two - The Seeker of Balance",
    textEn: "You are sensitive and cooperative by nature. Keeping relationships balanced and bringing others along is your strength.",
    benefitEn: "Benefit: This number brings sweetness to relationships and success in teamwork.",
    colorEn: "Colour: White", dayEn: "Day: Monday",
  },
  3: {
    title: "तीन - रचनात्मक ऊर्जा",
    text: "आप में रचनात्मकता और अभिव्यक्ति की गहरी शक्ति है। बातचीत, कला और नए विचारों में आप सहज महसूस करते हैं।",
    benefit: "फायदा: लेखन, कला या सार्वजनिक बोलचाल से जुड़े कामों में यह अंक तरक्की दिलाएगा।",
    color: "रंग: पीला", day: "दिन: गुरुवार",
    titleEn: "Three - Creative Energy",
    textEn: "You have a deep power of creativity and expression. You feel at ease with conversation, art and new ideas.",
    benefitEn: "Benefit: This number brings growth in writing, art or public speaking.",
    colorEn: "Colour: Yellow", dayEn: "Day: Thursday",
  },
  4: {
    title: "चार - मेहनती और स्थिर",
    text: "आप अनुशासित, व्यवस्थित और भरोसेमंद व्यक्ति हैं। ठोस नींव पर काम करना और जिम्मेदारी निभाना आपकी ताकत है।",
    benefit: "फायदा: मेहनत से बनाई हर चीज़ लंबे समय तक टिकेगी, स्थिरता और भरोसा आपको सफलता देंगे।",
    color: "रंग: नीला", day: "दिन: रविवार",
    titleEn: "Four - Hardworking and Steady",
    textEn: "You are disciplined, organised and dependable. Building on solid foundations and fulfilling responsibilities is your strength.",
    benefitEn: "Benefit: Whatever you build through hard work will last; stability and trust will bring you success.",
    colorEn: "Colour: Blue", dayEn: "Day: Sunday",
  },
  5: {
    title: "पांच - स्वतंत्र और साहसी",
    text: "आप बदलाव और रोमांच पसंद करते हैं। नई जगहें, नए अनुभव और आज़ादी आपको सबसे ज्यादा आकर्षित करते हैं।",
    benefit: "फायदा: यात्रा, नए मौके और बदलाव आपके लिए तरक्की के रास्ते खोलेंगे।",
    color: "रंग: हल्का हरा", day: "दिन: बुधवार",
    titleEn: "Five - Free and Adventurous",
    textEn: "You love change and adventure. New places, new experiences and freedom attract you the most.",
    benefitEn: "Benefit: Travel, new opportunities and change will open paths to progress for you.",
    colorEn: "Colour: Light green", dayEn: "Day: Wednesday",
  },
  6: {
    title: "छह - देखभाल करने वाले",
    text: "परिवार, रिश्ते और जिम्मेदारी आपके लिए सबसे अहम हैं। आप दूसरों की देखभाल करने में सुकून पाते हैं।",
    benefit: "फायदा: परिवार और घर से जुड़े मामलों में यह अंक सुख-शांति और सहयोग लाएगा।",
    color: "रंग: गुलाबी", day: "दिन: शुक्रवार",
    titleEn: "Six - The Caregiver",
    textEn: "Family, relationships and responsibility matter most to you. You find peace in caring for others.",
    benefitEn: "Benefit: This number brings happiness, peace and support in family and home matters.",
    colorEn: "Colour: Pink", dayEn: "Day: Friday",
  },
  7: {
    title: "सात - चिंतनशील और गहन",
    text: "आप में गहरी सोच और आत्मनिरीक्षण की प्रवृत्ति है। आध्यात्मिकता और ज्ञान की खोज आपको प्रिय है।",
    benefit: "फायदा: पढ़ाई, शोध और आत्मविश्लेषण से जुड़े कामों में यह अंक गहराई और स्पष्टता देगा।",
    color: "रंग: बैंगनी", day: "दिन: मंगलवार",
    titleEn: "Seven - Reflective and Deep",
    textEn: "You have a tendency towards deep thought and introspection. Spirituality and the pursuit of knowledge are dear to you.",
    benefitEn: "Benefit: This number gives depth and clarity in study, research and self-reflection.",
    colorEn: "Colour: Purple", dayEn: "Day: Tuesday",
  },
  8: {
    title: "आठ - महत्वाकांक्षी और सफल",
    text: "आप में शक्ति, अनुशासन और सफलता पाने का जज्बा है। धन और प्रतिष्ठा अर्जित करना आपके स्वभाव में है।",
    benefit: "फायदा: व्यापार, धन और करियर में बड़े लक्ष्य हासिल करने की क्षमता यह अंक देता है।",
    color: "रंग: काला", day: "दिन: शनिवार",
    titleEn: "Eight - Ambitious and Successful",
    textEn: "You have power, discipline and the drive to succeed. Earning wealth and prestige is in your nature.",
    benefitEn: "Benefit: This number gives you the ability to achieve big goals in business, wealth and career.",
    colorEn: "Colour: Black", dayEn: "Day: Saturday",
  },
  9: {
    title: "नौ - दयालु और आदर्शवादी",
    text: "आप उदार, सहानुभूतिपूर्ण और बड़े लक्ष्यों की ओर प्रेरित रहते हैं। दूसरों की भलाई सोचना आपकी फितरत है।",
    benefit: "फायदा: समाज सेवा, नेतृत्व और बड़े सपनों को पूरा करने में यह अंक साथ देगा।",
    color: "रंग: लाल", day: "दिन: मंगलवार",
    titleEn: "Nine - Kind and Idealistic",
    textEn: "You are generous, compassionate and driven towards big goals. Thinking of others' welfare is in your nature.",
    benefitEn: "Benefit: This number supports you in social service, leadership and fulfilling big dreams.",
    colorEn: "Colour: Red", dayEn: "Day: Tuesday",
  },
};

const DigitCard = ({ label, digit }: { label: string; digit: number }) => {
  const t = useT();
  const info = MEANINGS[digit];
  return (
    <>
      <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground mt-5 mb-2">{label}</p>
      <div className="flex gap-3 bg-card border border-border rounded-xl p-4">
        <div className="flex-shrink-0 w-10 h-10 rounded-full gradient-primary text-primary-foreground font-bold flex items-center justify-center">
          {digit}
        </div>
        <div>
          <p className="font-bold text-primary text-[0.95rem] mb-1.5">{t(info.titleEn, info.title)}</p>
          <p className="text-sm text-muted-foreground leading-relaxed mb-2">{t(info.textEn, info.text)}</p>
          <p className="text-sm text-foreground bg-secondary/40 rounded-lg px-3 py-2 mb-2 leading-relaxed">{t(info.benefitEn, info.benefit)}</p>
          <div className="flex gap-2 flex-wrap">
            <span className="text-xs font-semibold text-primary bg-secondary rounded-full px-3 py-1">{t(info.colorEn, info.color)}</span>
            <span className="text-xs font-semibold text-primary bg-secondary rounded-full px-3 py-1">{t(info.dayEn, info.day)}</span>
          </div>
        </div>
      </div>
    </>
  );
};

const LuckyNumber = () => {
  const t = useT();
  const [params] = useSearchParams();
  const [dob, setDob] = useState(params.get("dob") || "");
  const [error, setError] = useState(false);
  const [result, setResult] = useState<{ d1: number; d2: number } | null>(null);

  const onDobChange = (raw: string) => {
    const digits = raw.replace(/\D/g, "").slice(0, 8);
    let out = digits;
    if (digits.length > 4) out = `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
    else if (digits.length > 2) out = `${digits.slice(0, 2)}/${digits.slice(2)}`;
    setDob(out);
  };

  const calculate = () => {
    const m = dob.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
    const day = m ? parseInt(m[1], 10) : NaN;
    const mon = m ? parseInt(m[2], 10) : NaN;
    const yr = m ? parseInt(m[3], 10) : NaN;
    if (!m || isNaN(day) || isNaN(mon) || isNaN(yr) || day < 1 || day > 31 || mon < 1 || mon > 12 || yr < 1900) {
      setError(true); setResult(null); return;
    }
    setError(false);
    const ddStr = String(day).padStart(2, "0");
    const d1 = day < 10 ? day : parseInt(ddStr[0], 10);
    const d2 = parseInt(String(yr)[3], 10);
    setResult({ d1, d2 });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="py-10 px-4">
        <div className="max-w-[640px] mx-auto">
          <div className="gradient-primary rounded-[20px] px-6 py-9 text-center shadow-lg">
            <h1 className="text-2xl font-bold text-primary-foreground m-0">Lucky number Calculator</h1>
            <p className="text-sm text-primary-foreground/80 mt-1">{t("Lucky number Calculator", "लकी नंबर कैलकुलेटर")}</p>
          </div>

          <div className="bg-card rounded-[20px] mt-5 px-6 py-8 shadow-md text-center border border-border">
            <h2 className="text-xl font-bold mb-1.5">{t("Enter your details", "अपनी जानकारी दर्ज करें")}</h2>
            <p className="text-sm text-muted-foreground mb-6">{t("Fill in your details for a free astrology analysis", "मुफ्त ज्योतिष विश्लेषण के लिए विवरण भरें")}</p>

            <p className="text-[0.95rem] font-semibold text-primary mb-2.5 text-left">{t("Date of birth", "जन्म तिथि")}</p>
            <Input
              value={dob}
              onChange={(e) => onDobChange(e.target.value)}
              placeholder="dd/mm/yyyy"
              inputMode="numeric"
              aria-label={t("Date of birth", "जन्म तिथि")}
              className="w-full text-center text-lg font-semibold rounded-xl bg-primary/80 text-primary-foreground placeholder:text-primary-foreground/60 border-0 h-12 focus-visible:ring-2 focus-visible:ring-primary"
            />
            {error && <p className="text-destructive text-[13px] mt-2.5">{t("Please enter a valid date of birth (dd/mm/yyyy).", "कृपया सही जन्म तिथि (dd/mm/yyyy) डालें।")}</p>}


            <Button onClick={calculate} className="w-full mt-6 py-6 text-base font-semibold gradient-primary text-primary-foreground hover:opacity-90">
              {t("Calculate", "संपूर्ण गणना करें")}
            </Button>

            {result && (
              <div className="mt-6 bg-secondary/30 border border-border rounded-[14px] p-5 text-left">
                <div className="gradient-primary rounded-xl p-5 text-center">
                  <p className="text-primary-foreground/80 text-[13px] m-0">{t("Your lucky number", "आपका लकी नंबर")}</p>
                  <div className="text-primary-foreground text-4xl font-bold mt-1">{`${result.d1}${result.d2}`}</div>
                </div>

                <DigitCard label={t(`First digit (${result.d1})`, `पहला अंक (${result.d1})`)} digit={result.d1} />
                <DigitCard label={t(`Second digit (${result.d2})`, `दूसरा अंक (${result.d2})`)} digit={result.d2} />

                <div className="mt-5 bg-accent/10 border border-accent/40 rounded-xl px-5 py-4">
                  <p className="font-bold text-accent-foreground mb-1.5">{t("Overall benefit in life", "जीवन में कुल फायदा")}</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {t(`Your lucky number is formed by combining ${result.d1} and ${result.d2}. This means your life will be influenced by ${MEANINGS[result.d1].titleEn.split(" - ")[1]} as well as ${MEANINGS[result.d2].titleEn.split(" - ")[1]}. This combination will help you bring balance to your decisions, strength to your relationships and new opportunities in your career.`, `आपका लकी नंबर ${result.d1} और ${result.d2} के मेल से बना है। इसका मतलब है कि आपके जीवन में ${MEANINGS[result.d1].title.split(" - ")[1]} के साथ-साथ ${MEANINGS[result.d2].title.split(" - ")[1]} का भी असर रहेगा। यह मेल आपको फैसले लेने में संतुलन, रिश्तों में मजबूती और करियर में नए मौके दिलाने में मदद करेगा।`)}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default LuckyNumber;
