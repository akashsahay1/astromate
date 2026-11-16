import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useT } from "@/hooks/useLang";

import { zodiacImage } from "@/data/signImages";

const zodiacSigns = [
  { name: "मेष", nameEn: "Aries", vedic: "Mesh", datesEn: "21 March – 19 April", elementEn: "Fire", planetEn: "Mars", descriptionEn: "Aries natives are bold, energetic and born leaders. They are pioneers when it comes to starting something new.", luckyColorEn: "Blood Red", dates: "21 मार्च - 19 अप्रैल", emoji: "♈", element: "अग्नि", planet: "मंगल", description: "मेष राशि के जातक साहसी, ऊर्जावान और नेतृत्व करने वाले होते हैं। ये लोग नए कार्य शुरू करने में अग्रणी होते हैं।", quality: "चर", lucky: "मंगलवार, लाल रंग, 9 अंक", luckyColor: "रक्त-लाल", luckyNumbers: "9, 18", finances: 75, love: 85, career: 70, travel: 60, health: 65, gradient: "from-red-500 to-orange-500" },
  { name: "वृषभ", nameEn: "Taurus", vedic: "Vrishabh", datesEn: "20 April – 20 May", elementEn: "Earth", planetEn: "Venus", descriptionEn: "Taurus natives are patient, practical and dependable. They value financial stability.", luckyColorEn: "Green", dates: "20 अप्रैल - 20 मई", emoji: "♉", element: "पृथ्वी", planet: "शुक्र", description: "वृषभ राशि के जातक धैर्यवान, व्यावहारिक और विश्वसनीय होते हैं। ये आर्थिक स्थिरता को महत्व देते हैं।", quality: "स्थिर", lucky: "शुक्रवार, हरा रंग, 6 अंक", luckyColor: "हरा", luckyNumbers: "6, 15", finances: 80, love: 70, career: 75, travel: 55, health: 70, gradient: "from-green-500 to-emerald-600" },
  { name: "मिथुन", nameEn: "Gemini", vedic: "Mithun", datesEn: "21 May – 20 June", elementEn: "Air", planetEn: "Mercury", descriptionEn: "Gemini natives are intelligent, curious and great conversationalists, gifted with many talents.", luckyColorEn: "Yellow", dates: "21 मई - 20 जून", emoji: "♊", element: "वायु", planet: "बुध", description: "मिथुन राशि के जातक बुद्धिमान, जिज्ञासु और बातचीत में निपुण होते हैं। ये बहुमुखी प्रतिभा के धनी होते हैं।", quality: "द्विस्वभाव", lucky: "बुधवार, पीला रंग, 5 अंक", luckyColor: "पीला", luckyNumbers: "5, 14", finances: 65, love: 80, career: 85, travel: 70, health: 60, gradient: "from-yellow-400 to-amber-500" },
  { name: "कर्क", nameEn: "Cancer", vedic: "Kark", datesEn: "21 June – 22 July", elementEn: "Water", planetEn: "Moon", descriptionEn: "Cancer natives are emotional, caring and deeply attached to home and family. They are highly intuitive.", luckyColorEn: "White", dates: "21 जून - 22 जुलाई", emoji: "♋", element: "जल", planet: "चंद्र", description: "कर्क राशि के जातक भावनात्मक, देखभाल करने वाले और घर-परिवार से जुड़े होते हैं। ये सहज ज्ञान वाले होते हैं।", quality: "चर", lucky: "सोमवार, सफेद रंग, 2 अंक", luckyColor: "सफेद", luckyNumbers: "2, 11", finances: 70, love: 90, career: 65, travel: 50, health: 75, gradient: "from-cyan-400 to-blue-500" },
  { name: "सिंह", nameEn: "Leo", vedic: "Simha", datesEn: "23 July – 22 August", elementEn: "Fire", planetEn: "Sun", descriptionEn: "Leo natives are confident, generous and natural leaders. They are creative and ambitious.", luckyColorEn: "Golden", dates: "23 जुलाई - 22 अगस्त", emoji: "♌", element: "अग्नि", planet: "सूर्य", description: "सिंह राशि के जातक आत्मविश्वासी, उदार और नेतृत्व करने वाले होते हैं। ये रचनात्मक और महत्वाकांक्षी होते हैं।", quality: "स्थिर", lucky: "रविवार, सुनहरा रंग, 1 अंक", luckyColor: "सुनहरा", luckyNumbers: "1, 10", finances: 85, love: 75, career: 90, travel: 65, health: 70, gradient: "from-amber-500 to-orange-600" },
  { name: "कन्या", nameEn: "Virgo", vedic: "Kanya", datesEn: "23 August – 22 September", elementEn: "Earth", planetEn: "Mercury", descriptionEn: "Virgo natives are analytical, organised and helpful, with a sharp eye for detail.", luckyColorEn: "Green", dates: "23 अगस्त - 22 सितंबर", emoji: "♍", element: "पृथ्वी", planet: "बुध", description: "कन्या राशि के जातक विश्लेषणात्मक, व्यवस्थित और मददगार होते हैं। ये विस्तार पर ध्यान देते हैं।", quality: "द्विस्वभाव", lucky: "बुधवार, हरा रंग, 5 अंक", luckyColor: "हरा", luckyNumbers: "5, 23", finances: 75, love: 65, career: 80, travel: 55, health: 85, gradient: "from-emerald-500 to-teal-600" },
  { name: "तुला", nameEn: "Libra", vedic: "Tula", datesEn: "23 September – 22 October", elementEn: "Air", planetEn: "Venus", descriptionEn: "Libra natives are balanced, fair-minded and diplomatic. They value beauty and harmony.", luckyColorEn: "Blue", dates: "23 सितंबर - 22 अक्टूबर", emoji: "♎", element: "वायु", planet: "शुक्र", description: "तुला राशि के जातक संतुलित, न्यायप्रिय और कूटनीतिक होते हैं। ये सौंदर्य और सद्भाव को महत्व देते हैं।", quality: "चर", lucky: "शुक्रवार, नीला रंग, 6 अंक", luckyColor: "नीला", luckyNumbers: "6, 24", finances: 70, love: 88, career: 72, travel: 68, health: 65, gradient: "from-pink-400 to-rose-500" },
  { name: "वृश्चिक", nameEn: "Scorpio", vedic: "Vrishchik", datesEn: "23 October – 21 November", elementEn: "Water", planetEn: "Mars", descriptionEn: "Scorpio natives are intense, mysterious and determined — a symbol of transformation and rebirth.", luckyColorEn: "Red", dates: "23 अक्टूबर - 21 नवंबर", emoji: "♏", element: "जल", planet: "मंगल", description: "वृश्चिक राशि के जातक गहन, रहस्यमय और दृढ़ निश्चयी होते हैं। ये परिवर्तन और पुनर्जन्म के प्रतीक हैं।", quality: "स्थिर", lucky: "मंगलवार, लाल रंग, 9 अंक", luckyColor: "लाल", luckyNumbers: "9, 27", finances: 78, love: 92, career: 85, travel: 60, health: 70, gradient: "from-red-600 to-rose-800" },
  { name: "धनु", nameEn: "Sagittarius", vedic: "Dhanu", datesEn: "22 November – 21 December", elementEn: "Fire", planetEn: "Jupiter", descriptionEn: "Sagittarius natives are optimistic, adventurous seekers of knowledge, drawn to travel and philosophy.", luckyColorEn: "Yellow", dates: "22 नवंबर - 21 दिसंबर", emoji: "♐", element: "अग्नि", planet: "बृहस्पति", description: "धनु राशि के जातक आशावादी, साहसी और ज्ञान के खोजी होते हैं। ये यात्रा और दर्शन में रुचि रखते हैं।", quality: "द्विस्वभाव", lucky: "गुरुवार, पीला रंग, 3 अंक", luckyColor: "पीला", luckyNumbers: "3, 12", finances: 72, love: 78, career: 70, travel: 95, health: 68, gradient: "from-violet-500 to-purple-600" },
  { name: "मकर", nameEn: "Capricorn", vedic: "Makar", datesEn: "22 December – 19 January", elementEn: "Earth", planetEn: "Saturn", descriptionEn: "Capricorn natives are ambitious, disciplined and practical. They achieve success through hard work.", luckyColorEn: "Blood Red", dates: "22 दिसंबर - 19 जनवरी", emoji: "♑", element: "पृथ्वी", planet: "शनि", description: "मकर राशि के जातक महत्वाकांक्षी, अनुशासित और व्यावहारिक होते हैं। ये कड़ी मेहनत से सफलता पाते हैं।", quality: "चर", lucky: "शनिवार, काला रंग, 8 अंक", luckyColor: "रक्त-लाल", luckyNumbers: "24, 9", finances: 84, love: 96, career: 44, travel: 66, health: 25, gradient: "from-slate-600 to-gray-800" },
  { name: "कुंभ", nameEn: "Aquarius", vedic: "Kumbh", datesEn: "20 January – 18 February", elementEn: "Air", planetEn: "Saturn", descriptionEn: "Aquarius natives are innovative, independent and humanitarian, with a keen interest in social reform.", luckyColorEn: "Blue", dates: "20 जनवरी - 18 फरवरी", emoji: "♒", element: "वायु", planet: "शनि", description: "कुंभ राशि के जातक नवीन विचारों वाले, स्वतंत्र और मानवतावादी होते हैं। ये समाज सुधार में रुचि रखते हैं।", quality: "स्थिर", lucky: "शनिवार, नीला रंग, 4 अंक", luckyColor: "नीला", luckyNumbers: "4, 22", finances: 68, love: 72, career: 78, travel: 80, health: 65, gradient: "from-sky-500 to-blue-600" },
  { name: "मीन", nameEn: "Pisces", vedic: "Meen", datesEn: "19 February – 20 March", elementEn: "Water", planetEn: "Jupiter", descriptionEn: "Pisces natives are compassionate, imaginative and spiritual, and gifted in art and music.", luckyColorEn: "Yellow", dates: "19 फरवरी - 20 मार्च", emoji: "♓", element: "जल", planet: "बृहस्पति", description: "मीन राशि के जातक सहानुभूतिपूर्ण, कल्पनाशील और आध्यात्मिक होते हैं। ये कला और संगीत में निपुण होते हैं।", quality: "द्विस्वभाव", lucky: "गुरुवार, पीला रंग, 3 अंक", luckyColor: "पीला", luckyNumbers: "3, 21", finances: 65, love: 88, career: 70, travel: 72, health: 60, gradient: "from-teal-400 to-cyan-600" },
];

// Circular Progress Component
const CircularProgress = ({ value, label, color }: { value: number; label: string; color: string }) => {
  const circumference = 2 * Math.PI * 40;
  const strokeDashoffset = circumference - (value / 100) * circumference;
  
  return (
    <div className="flex flex-col items-center">
      <div className="relative w-20 h-20">
        <svg className="w-20 h-20 transform -rotate-90">
          <circle cx="40" cy="40" r="40" stroke="currentColor" strokeWidth="6" fill="transparent" className="text-muted/30" />
          <circle cx="40" cy="40" r="40" stroke={color} strokeWidth="6" fill="transparent" strokeDasharray={circumference} strokeDashoffset={strokeDashoffset} strokeLinecap="round" />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-sm font-bold">{value}%</span>
        </div>
      </div>
      <span className="text-xs mt-1 text-center">{label}</span>
    </div>
  );
};

const ZodiacSigns = () => {
  const navigate = useNavigate();
  const [selectedSign, setSelectedSign] = useState<typeof zodiacSigns[0] | null>(null);
  const t = useT();

  return (
    <section id="zodiac" className="py-8 lg:py-12 bg-[#FDF6E3]">
      <div className="max-w-[1280px] mx-auto px-6">
        {/* Header */}
        <h2 className="font-serif text-3xl lg:text-4xl font-bold text-[#171452] mb-1.5">
          {t("Zodiac Signs", "राशि चक्र")}
        </h2>
        <p className="text-[0.95rem] text-muted-foreground mb-8">
          {t("Pick your sign and read today's horoscope", "अपनी राशि चुनें और आज का राशिफल जानें")}
        </p>

        {/* Zodiac Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-5">
          {zodiacSigns.map((sign) => (
            <div
              key={sign.name}
              onClick={() => navigate("/horoscope")}
              className="bg-[#FFFDF5] rounded-[14px] overflow-hidden border border-[hsl(40,50%,85%)] shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col"
            >
              {/* Image Header with Gradient */}
              <div className={`relative h-[120px] bg-gradient-to-br ${sign.gradient} flex items-center justify-center overflow-hidden`}>
                <span className="absolute top-2 left-2 bg-black/60 text-white text-[9px] px-2 py-0.5 rounded font-semibold z-10">
                  Astromate
                </span>
                {zodiacImage(sign.nameEn) ? (
                  <img src={zodiacImage(sign.nameEn)} alt={t(sign.nameEn, sign.name)} loading="lazy" className="w-20 h-20 rounded-full object-cover border-2 border-white/80 relative z-10 drop-shadow-lg" />
                ) : (
                  <span className="text-5xl relative z-10 drop-shadow-lg">{sign.emoji}</span>
                )}
                <div className="absolute bottom-0 left-0 right-0 px-3 py-2 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-10">
                  <p className="text-white text-[0.82rem] font-bold font-serif leading-tight">{t(`${sign.nameEn} (${sign.vedic})`, sign.name)}</p>
                  <span className="text-white/80 text-[0.62rem] block mt-0.5">{t(sign.datesEn, sign.dates)}</span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-3.5 flex-1 flex flex-col">
                <p className="text-[0.77rem] text-muted-foreground leading-relaxed line-clamp-2 flex-1">{t(sign.descriptionEn, sign.description)}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-[0.7rem] bg-purple-50 text-purple-700 px-2 py-0.5 rounded-full border border-purple-200 font-medium">{t(sign.planetEn, sign.planet)}</span>
                  <span className="text-[0.7rem] bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full border border-amber-200 font-medium">{t(sign.elementEn, sign.element)}</span>
                </div>
              </div>

              {/* Card Actions */}
              <div className="flex items-center gap-2.5 px-3.5 py-2.5 border-t border-[hsl(40,50%,90%)]">
                <button
                  onClick={(e) => { e.stopPropagation(); navigate("/horoscope"); }}
                  className="flex-1 bg-[#171452] text-white py-2 rounded-lg text-[0.86rem] font-semibold hover:bg-[#1e1a6e] transition-colors"
                >
                  {t("View Horoscope", "राशिफल देखें")}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Zodiac Detail Dialog */}
      <Dialog open={!!selectedSign} onOpenChange={() => setSelectedSign(null)}>
        <DialogContent className="max-w-2xl bg-gradient-to-br from-rose-50 to-pink-100 border-none p-0 overflow-hidden">
          <DialogHeader className="sr-only">
            <DialogTitle>{selectedSign && t(`${selectedSign.nameEn} Horoscope`, `${selectedSign.name} राशिफल`)}</DialogTitle>
          </DialogHeader>
          
          <div className="flex items-center justify-between p-4 border-b border-rose-200">
            <h2 className="text-2xl font-bold text-rose-700">
              <span className="text-rose-800">{selectedSign && t(`${selectedSign.nameEn} (${selectedSign.vedic})`, selectedSign.name)}</span>
            </h2>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 space-y-4">
                <p className="text-sm text-gray-700 leading-relaxed">
                  {selectedSign && t(`${selectedSign.descriptionEn} Today is a day to celebrate your achievements. Your risks pay off, bringing favourable results and solid gains from the ventures you have taken on.`, `${selectedSign.description} आज उपलब्धियों का जश्न मनाएं। आपके जोखिम लेने का लाभ मिलता है, अनुकूल परिणाम मिलते हैं और आपके द्वारा किए गए उद्यमों से पर्याप्त लाभ मिलता है।`)}
                </p>
                <div className="flex flex-wrap gap-6 pt-2">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-700">Lucky Color:</span>
                    <span className="text-gray-600">{selectedSign && t(selectedSign.luckyColorEn, selectedSign.luckyColor)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-700">Lucky Numbers:</span>
                    <span className="text-gray-600">{selectedSign?.luckyNumbers}</span>
                  </div>
                </div>
              </div>
              <div className="flex justify-center">
                {selectedSign && zodiacImage(selectedSign.nameEn) ? (
                  <img src={zodiacImage(selectedSign.nameEn)} alt={t(selectedSign.nameEn, selectedSign.name)} className="w-40 h-40 rounded-full object-cover" />
                ) : (
                  <span className="text-8xl">{selectedSign?.emoji}</span>
                )}
              </div>
            </div>
            
            <div className="flex flex-wrap justify-center gap-4 mt-8 pt-6 border-t border-rose-200">
              <CircularProgress value={selectedSign?.finances || 0} label="Finances" color="#22c55e" />
              <CircularProgress value={selectedSign?.love || 0} label="Love" color="#ef4444" />
              <CircularProgress value={selectedSign?.career || 0} label="Career" color="#eab308" />
              <CircularProgress value={selectedSign?.travel || 0} label="Travel" color="#06b6d4" />
              <CircularProgress value={selectedSign?.health || 0} label="Health" color="#f97316" />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default ZodiacSigns;
