import { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Calculator, Sparkles, AlertCircle, Lightbulb, CheckCircle, XCircle, Star, Phone, Briefcase, DollarSign, AlertTriangle, History, Trash2, ArrowLeft } from 'lucide-react';
import { getComboInfo, type ComboInfo } from '@/data/numerologyCombos';
import { useT, useLang } from '@/hooks/useLang';


// Constants
const CHALDEAN_MAP: { [key: string]: number } = {
  'A': 1, 'I': 1, 'J': 1, 'Q': 1, 'Y': 1,
  'B': 2, 'K': 2, 'R': 2,
  'C': 3, 'G': 3, 'L': 3, 'S': 3,
  'D': 4, 'M': 4, 'T': 4,
  'E': 5, 'H': 5, 'N': 5, 'X': 5,
  'U': 6, 'V': 6, 'W': 6,
  'O': 7, 'Z': 7,
  'F': 8, 'P': 8
};

const PROBLEMATIC_COMBOS = [
  '18', '81', '36', '63', '24', '42', '26', '62',
  '48', '84', '49', '94', '46', '64', '45', '54',
  '23', '32', '44',
  '10', '20', '30', '40', '50', '60', '70', '80', '90'
];

const friendshipChart: { [key: number]: { friends: number[]; enemies: number[] } } = {
  1: { friends: [1, 2, 3, 5, 6, 7, 9], enemies: [4, 8] },
  2: { friends: [1, 2, 3, 5, 6, 7], enemies: [4, 8, 9] },
  3: { friends: [1, 2, 3, 4, 5, 7, 9], enemies: [6, 8] },
  4: { friends: [1, 3, 5, 6, 7], enemies: [2, 4, 8, 9] },
  5: { friends: [1, 2, 3, 5, 6, 7, 9], enemies: [4, 8] },
  6: { friends: [1, 2, 4, 5, 6, 7, 8, 9], enemies: [3] },
  7: { friends: [1, 2, 3, 4, 5, 6, 7, 9], enemies: [8] },
  8: { friends: [3, 5, 6, 7, 9], enemies: [1, 2, 4, 8] },
  9: { friends: [1, 3, 5, 6, 7, 9], enemies: [2, 4, 8] }
};

interface NumerologyResult {
  namank: number;
  moolank: number;
  bhagyank: number;
  mobileYog: number;
  fullMobile: string;
  pos7: string;
  pos8: string;
  pos9: string;
  pos10: string;
  allComboIssues: { combination: string; positions: string; startPos: number }[];
  name: string;
  dob: string;
}

interface SavedReport extends NumerologyResult {
  id: number;
  timestamp: string;
}

// Helper Functions
const toSingleDigit = (n: number): number => {
  while (n > 9) n = n.toString().split('').reduce((a, d) => a + parseInt(d), 0);
  return n;
};

const calculateNumerology = (num: string, forceSingleDigit = false): number => {
  let sum = num.split('').reduce((acc, digit) => acc + (parseInt(digit) || 0), 0);
  if (forceSingleDigit) {
    while (sum > 9) {
      sum = sum.toString().split('').reduce((acc, digit) => acc + parseInt(digit), 0);
    }
  } else {
    while (sum > 9 && sum !== 11 && sum !== 22 && sum !== 33) {
      sum = sum.toString().split('').reduce((acc, digit) => acc + parseInt(digit), 0);
    }
  }
  return sum;
};

const calculateNameNumber = (name: string): number => {
  const cleanName = name.toUpperCase().replace(/[^A-Z]/g, '');
  let sum = 0;
  for (const char of cleanName) {
    sum += CHALDEAN_MAP[char] || 0;
  }
  // Always reduce to single digit
  while (sum > 9) {
    sum = sum.toString().split('').reduce((acc, digit) => acc + parseInt(digit), 0);
  }
  return sum;
};

const checkAllCombinations = (mobile: string) => {
  const allIssues: { combination: string; positions: string; startPos: number }[] = [];
  for (let i = 0; i < mobile.length - 1; i++) {
    const combo = `${mobile[i]}${mobile[i + 1]}`;
    if (PROBLEMATIC_COMBOS.includes(combo)) {
      allIssues.push({
        combination: combo,
        positions: `${i + 1}-${i + 2}`,
        startPos: i
      });
    }
  }
  return allIssues;
};

const validateDate = (dateStr: string): boolean => {
  const pattern = /^(\d{2})\/(\d{2})\/(\d{4})$/;
  if (!pattern.test(dateStr)) return false;
  
  const [day, month, year] = dateStr.split('/').map(Number);
  if (month < 1 || month > 12) return false;
  if (day < 1 || day > 31) return false;
  if (year < 1900 || year > 2100) return false;
  
  return true;
};

const getPlanetName = (digit: number, en = false): string => {
  const planets: { [key: number]: string } = {
    1: 'सूर्य', 2: 'चंद्र', 3: 'बृहस्पति', 4: 'राहु',
    5: 'बुध', 6: 'शुक्र', 7: 'केतु', 8: 'शनि', 9: 'मंगल', 0: 'शून्य'
  };
  const planetsEn: { [key: number]: string } = {
    1: 'Sun', 2: 'Moon', 3: 'Jupiter', 4: 'Rahu',
    5: 'Mercury', 6: 'Venus', 7: 'Ketu', 8: 'Saturn', 9: 'Mars', 0: 'Zero'
  };
  return (en ? planetsEn : planets)[digit] || '';
};

const getCommonFriends = (moolank: number, bhagyank: number): number[] => {
  const moolankFriends = friendshipChart[moolank]?.friends || [];
  const bhagyankFriends = friendshipChart[bhagyank]?.friends || [];
  return moolankFriends.filter(digit => bhagyankFriends.includes(digit));
};

const getCombinationName = (combo: string): string => {
  const names: { [key: string]: string } = {
    '18': '☀️⚫ सूर्य-शनि', '81': '⚫☀️ शनि-सूर्य',
    '36': '🔮💔 गुरु-शुक्र', '63': '💔🔮 शुक्र-गुरु',
    '24': '🌙😵 चंद्र-राहु', '42': '😵🌙 राहु-चंद्र',
    '26': '🌙😢 चंद्र-शनि', '62': '😢🌙 शनि-चंद्र',
    '44': '😵😵 दोहरा राहु'
  };
  return names[combo] || '⚠️ समस्याग्रस्त';
};

// Position Analysis Component
function PositionAnalysis({ results }: { results: NumerologyResult }) {
  const t = useT();
  const { lang } = useLang();
  const getPositionAnalysis = (digit: string, position: number): string => {
    const d = parseInt(digit);
    const analyses: { [key: number]: { [key: number]: string } } = {
      7: {
        1: t("Sun (1) gives you authority and leadership in conversation. You state your views clearly and firmly. People take you seriously and you naturally become an authority figure. Your communication style reflects confidence and determination.", 'सूर्य (1) आपको बातचीत में अधिकार और नेतृत्व देगा। आप अपनी राय स्पष्ट और दृढ़ता से रखते हैं। लोग आपकी बात को गंभीरता से लेते हैं और आप naturally एक authority figure बन जाते हैं। आपकी communication style में confidence और determination झलकता है।'),
        2: t("Moon (2) gives you emotional intelligence and sensitivity. You understand people's feelings and connect with them empathetically. Your communication style is gentle and caring.", 'चंद्र (2) आपको emotional intelligence और sensitivity प्रदान करता है। आप लोगों की भावनाओं को समझते हैं और उनके साथ empathetically connect करते हैं। आपकी communication style gentle और caring होती है।'),
        3: t("Jupiter (3) gives you wisdom, knowledge and guru-like qualities. Whatever you say is educational and insightful. People follow your advice and see you as a mentor.", 'बृहस्पति (3) आपको wisdom, knowledge और guru-like qualities देता है। आप जो भी बोलते हैं वो educational और insightful होता है। लोग आपकी सलाह को मानते हैं और आपको एक mentor के रूप में देखते हैं।'),
        4: t("Rahu (4) gives you an unconventional, unique communication style. You speak from different perspectives, and your words carry mystery and intrigue.", 'राहु (4) आपको unconventional और unique communication style देता है। आप different perspectives से बात करते हैं। आपकी बातों में mystery और intrigue होता है।'),
        5: t("Mercury (5) gives you exceptional communication skills, quick thinking and versatility. You are witty and intelligent in conversation. This is the most auspicious digit for sales, marketing and networking.", 'बुध (5) आपको exceptional communication skills, quick thinking और versatility प्रदान करता है। आप बातचीत में witty और intelligent होते हैं। यह अंक sales, marketing और networking के लिए सबसे शुभ है।'),
        6: t("Venus (6) gives you charm, grace and magnetic appeal. Your communication style is pleasant and engaging, and people enjoy talking to you.", 'शुक्र (6) आपको charm, grace और attraction power देता है। आपकी communication style pleasant और appealing होती है। लोग आपसे बात करना enjoy करते हैं।'),
        7: t("Ketu (7) gives you spiritual wisdom, deep thinking and a unique perspective. You don't stay on the surface; you explore the deeper meaning.", 'केतु (7) आपको spiritual wisdom, deep thinking और unique perspective देता है। आप surface level की बात नहीं करते, बल्कि deeper meaning explore करते हैं।'),
        8: t("Saturn (8) gives you discipline, structure and authority. You speak in a systematic, organised way, and your communication has seriousness and depth.", 'शनि (8) आपको discipline, structure और authority प्रदान करता है। आप systematic और organized तरीके से बात करते हैं। आपकी communication में seriousness और depth होती है।'),
        9: t("Mars (9) gives you energy, passion and enthusiasm. You speak with zeal and excitement, and your communication style has fire and intensity.", 'मंगल (9) आपको energy, passion और enthusiasm प्रदान करता है। आप जोश और excitement के साथ बात करते हैं। आपकी communication style में fire और intensity होती है।'),
        0: t("Zero (0) symbolises complete potential and infinite possibilities. You take a balanced, holistic approach.", 'शून्य (0) complete potential और infinite possibilities का प्रतीक है। आप balanced और holistic approach रखते हैं।')
      },
      8: {
        1: t("Sun (1) brings power and authority to your communication style. You speak directly and clearly, and people see you as decisive and strong-minded.", 'सूर्य (1) आपकी communication style में power और authority लाता है। आप सीधे और स्पष्ट तरीके से अपनी बात रखते हैं। लोग आपको decisive और strong-minded समझते हैं।'),
        2: t("Moon (2) brings empathy, compassion and understanding to your words. You listen patiently and offer people emotional support.", 'चंद्र (2) आपकी बातों में empathy, compassion और understanding लाता है। आप धैर्यपूर्वक लोगों की बात सुनते हैं और उन्हें emotional support provide करते हैं।'),
        3: t("Jupiter (3) brings intellectual depth and a philosophical approach to your communication. You are skilled at explaining complex ideas simply.", 'बृहस्पति (3) आपकी communication style में intellectual depth और philosophical approach लाता है। आप complex concepts को simply explain करने में माहिर हैं।'),
        4: t("Rahu (4) brings innovation and creativity to your words. You suggest unconventional solutions, and your communication has an element of surprise.", 'राहु (4) आपकी बातों में innovation और creativity लाता है। आप unconventional solutions suggest करते हैं। आपकी communication में element of surprise होता है।'),
        5: t("Mercury (5) makes your communication smart, effective and result-oriented. You get your point across clearly in few words. This is the most powerful digit for business communication.", 'बुध (5) आपकी communication को smart, effective और result-oriented बनाता है। आप कम शब्दों में अपनी बात clearly convey कर देते हैं। यह अंक business communication के लिए सबसे powerful है।'),
        6: t("Venus (6) brings sweetness, politeness and appeal to your communication. You speak tactfully and don't offend people.", 'शुक्र (6) आपकी communication में sweetness, politeness और appeal लाता है। आप tactfully बात करते हैं और लोगों को offend नहीं करते।'),
        7: t("Ketu (7) brings depth, mystery and a philosophical touch to your words. You see things from a different perspective.", 'केतु (7) आपकी बातों में depth, mystery और philosophical touch लाता है। आप different perspective से चीजों को देखते हैं।'),
        8: t("Saturn (8) brings maturity, discipline and practicality to your words. You take a realistic, grounded approach, and your communication is honest and direct.", 'शनि (8) आपकी बातों में maturity, discipline और practicality लाता है। आप realistic और grounded approach रखते हैं। आपकी communication में honesty और directness होती है।'),
        9: t("Mars (9) brings confidence, boldness and assertiveness to your communication. You speak your mind fearlessly.", 'मंगल (9) आपकी communication में confidence, boldness और assertiveness लाता है। आप fearlessly अपनी बात रखते हैं।'),
        0: t("Zero (0) makes your communication universal and all-encompassing.", 'शून्य (0) आपकी communication को universal और all-encompassing बनाता है।')
      },
      9: {
        1: t("With Sun (1), people see you as a successful, influential and impressive person. Your image is authoritative and respectable.", 'सूर्य (1) से लोग आपको एक successful, influential और प्रभावशाली व्यक्ति के रूप में देखते हैं। आपकी image authoritative और respectable बनती है।'),
        2: t("With Moon (2), people see you as caring, supportive and trustworthy. You come across as reliable and understanding.", 'चंद्र (2) से लोग आपको caring, supportive और trustworthy मानते हैं। आपकी image एक reliable और understanding person की बनती है।'),
        3: t("With Jupiter (3), people see you as a scholar, a wise person and an expert. Your reputation is authoritative and respectable.", 'बृहस्पति (3) से लोग आपको एक विद्वान, ज्ञानी और expert के रूप में देखते हैं। आपकी reputation authoritative और respectable बनती है।'),
        4: t("With Rahu (4), people see you as innovative, modern and forward-thinking. Your image is cutting-edge and progressive.", 'राहु (4) से लोग आपको innovative, modern और forward-thinking मानते हैं। आपकी image cutting-edge और progressive बनती है।'),
        5: t("With Mercury (5), people see you as intelligent, sharp and business-savvy. You come across as a smart, capable professional.", 'बुध (5) से लोग आपको बुद्धिमान, तेज़, और business-savvy मानते हैं। आपकी image एक smart और capable professional की बनती है।'),
        6: t("With Venus (6), people see your services as premium, luxurious and high-quality. Your image is elegant and sophisticated.", 'शुक्र (6) से लोग आपकी services को premium, luxurious और high-quality मानते हैं। आपकी image elegant और sophisticated बनती है।'),
        7: t("With Ketu (7), people see you as unique, different and special. Your image is unconventional and mysterious.", 'केतु (7) से लोग आपको unique, different और special मानते हैं। आपकी image unconventional और mysterious बनती है।'),
        8: t("With Saturn (8), people see you as experienced, reliable and established. Your image is traditional and trustworthy.", 'शनि (8) से लोग आपको experienced, reliable और established मानते हैं। आपकी image traditional और trustworthy बनती है।'),
        9: t("With Mars (9), people see you as powerful, effective and result-oriented. You come across as strong and capable.", 'मंगल (9) से लोग आपको powerful, effective और result-oriented मानते हैं। आपकी image एक strong और capable person की बनती है।'),
        0: t("With Zero (0), people see you as complete, balanced and well-rounded.", 'शून्य (0) से लोग आपको complete, balanced और well-rounded मानते हैं।')
      },
      10: {
        1: t("Sun (1) gives callers the energy to take immediate action. When someone talks to you, they find the ability to make decisions.", 'सूर्य (1) caller को immediate action लेने की energy देता है। जब कोई आपसे बात करता है तो उसमें निर्णय लेने की क्षमता आ जाती है।'),
        2: t("Moon (2) leaves callers with a sense of emotional satisfaction and peace. After the conversation they feel understood and supported.", 'चंद्र (2) caller में emotional satisfaction और peace की feeling पैदा करता है। बात के बाद वे खुद को समझा हुआ और supported महसूस करते हैं।'),
        3: t("Jupiter (3) gives callers clarity and the right direction. After the conversation they feel confident and enlightened.", 'बृहस्पति (3) caller को clarity और right direction provide करता है। बात के बाद वे confident और enlightened feel करते हैं।'),
        4: t("Rahu (4) sparks curiosity and a sense of exploration in callers. After the conversation they feel motivated to try something new.", 'राहु (4) caller में curiosity और exploration की feeling जगाता है। बात के बाद वे something new try करने को motivated होते हैं।'),
        5: t("Mercury (5) gives callers the energy to act quickly and make smart decisions. This is the most auspicious digit for business and commerce.", 'बुध (5) caller को quick action लेने और smart decisions करने की energy देता है। यह अंक व्यापार और commerce के लिए सबसे शुभ है।'),
        6: t("Venus (6) gives callers satisfaction, pleasure and a positive experience. After the conversation they feel happy and content.", 'शुक्र (6) caller को satisfaction, pleasure और positive experience provide करता है। बात के बाद वे happy और content feel करते हैं।'),
        7: t("Ketu (7) brings a sense of transformation and realisation to callers. After the conversation they start thinking differently.", 'केतु (7) caller में transformation और realization की feeling पैदा करता है। बात के बाद वे differently think करने लगते हैं।'),
        8: t("Saturn (8) gives callers a sense of stability and long-term commitment. After the conversation they feel secure and grounded.", 'शनि (8) caller में stability और long-term commitment की feeling आती है। बात के बाद वे secure और grounded feel करते हैं।'),
        9: t("Mars (9) gives universal energy and complete satisfaction. This number symbolises completion and fulfilment.", 'मंगल (9) universal energy और complete satisfaction प्रदान करता है। यह number completion और fulfillment का प्रतीक है।'),
        0: t("Zero (0) gives callers a feeling of infinite possibilities and endless potential.", 'शून्य (0) caller में infinite possibilities और endless potential की feeling पैदा करता है।')
      }
    };
    return analyses[position]?.[d] || t("Analysis in progress...", 'विश्लेषण जारी है...');
  };

  // Colors for positions 7-10
  const getPositionColor = (idx: number) => {
    if (idx < 6) return { bg: 'bg-orange-100', border: 'border-orange-300', text: 'text-orange-800' };
    switch (idx) {
      case 6: return { bg: 'bg-blue-400', border: 'border-blue-500', text: 'text-white' }; // Position 7
      case 7: return { bg: 'bg-primary', border: 'border-primary/50', text: 'text-white' }; // Position 8
      case 8: return { bg: 'bg-yellow-400', border: 'border-yellow-500', text: 'text-yellow-900' }; // Position 9
      case 9: return { bg: 'bg-primary', border: 'border-primary/50', text: 'text-white' }; // Position 10
      default: return { bg: 'bg-gray-100', border: 'border-gray-300', text: 'text-gray-800' };
    }
  };

  return (
    <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl shadow-xl border-2 border-orange-200 overflow-hidden mb-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-100 to-amber-100 px-6 py-4 border-b border-orange-200">
        <h3 className="text-xl font-bold text-orange-800 flex items-center justify-center gap-2">
          {t("📱 Mobile Number Position Analysis", "📱 मोबाइल नंबर पोजीशन विश्लेषण")}
        </h3>
        <p className="text-center text-orange-700 mt-1">
          {t("Your number:", "आपका नंबर:")} <span className="font-bold text-orange-900">{results.fullMobile}</span>
        </p>
      </div>

      <div className="p-6">
        {/* Position Grid - Like the image */}
        <div className="flex justify-center gap-2 mb-6 flex-wrap">
          {results.fullMobile.split('').map((digit, idx) => {
            const colors = getPositionColor(idx);
            return (
              <div 
                key={idx} 
                className={`relative flex flex-col items-center justify-center w-12 h-16 md:w-14 md:h-20 rounded-lg border-2 ${colors.bg} ${colors.border} shadow-md transition-transform hover:scale-105`}
              >
                {/* Position number - top right corner */}
                <span className={`absolute top-1 right-1.5 text-xs font-medium ${idx < 6 ? 'text-orange-600' : colors.text} opacity-80`}>
                  {idx + 1}
                </span>
                {/* Digit */}
                <span className={`text-2xl md:text-3xl font-bold ${colors.text}`}>
                  {digit}
                </span>
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex justify-center gap-4 mb-6 flex-wrap text-xs">
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 bg-orange-100 border border-orange-300 rounded"></div>
            <span className="text-gray-600">{t("Regular (1-6)", "सामान्य (1-6)")}</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 bg-blue-400 rounded"></div>
            <span className="text-gray-600">{t("7th", "7वीं")}</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 bg-primary rounded"></div>
            <span className="text-gray-600">{t("8th/10th", "8वीं/10वीं")}</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 bg-yellow-400 rounded"></div>
            <span className="text-gray-600">{t("9th", "9वीं")}</span>
          </div>
        </div>

        {/* All Combination Analysis (लाभ व हानि) */}
        {(() => {
          const pairs = results.fullMobile
            .split('')
            .slice(0, -1)
            .map((d, i) => ({ combo: `${d}${results.fullMobile[i + 1]}`, positions: `${i + 1}-${i + 2}` }))
            .map((p) => ({ ...p, info: getComboInfo(p.combo) }))
            .filter((p) => p.info) as { combo: string; positions: string; info: ComboInfo }[];

          if (pairs.length === 0) return null;

          const bad = pairs.filter((p) => p.info.type === 'bad');
          const mixed = pairs.filter((p) => p.info.type === 'mixed');
          const good = pairs.filter((p) => p.info.type === 'good');

          const tone = {
            bad: { wrap: 'bg-red-50 border-red-300', chip: 'bg-red-600', head: 'text-red-700', card: 'border-red-200' },
            mixed: { wrap: 'bg-amber-50 border-amber-300', chip: 'bg-amber-600', head: 'text-amber-800', card: 'border-amber-200' },
            good: { wrap: 'bg-primary/5 border-primary/20', chip: 'bg-primary', head: 'text-primary', card: 'border-primary/20' },
          } as const;

          const Group = ({
            list,
            type,
            title,
          }: { list: typeof pairs; type: 'bad' | 'mixed' | 'good'; title: string }) => {
            if (list.length === 0) return null;
            const tc = tone[type];
            return (
              <div className={`${tc.wrap} border-2 rounded-xl p-4 mb-4`}>
                <h4 className={`font-bold ${tc.head} flex items-center gap-2 mb-3`}>
                  <AlertTriangle className="w-5 h-5" />
                  {title} ({list.length})
                </h4>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                  {list.map((p, idx) => (
                    <div key={`${p.combo}-${idx}`} className={`bg-white border ${tc.card} rounded-lg p-3`}>
                      <div className="flex items-start gap-3">
                        <span className={`${tc.chip} text-white font-bold text-sm px-2.5 py-1 rounded-md whitespace-nowrap`}>
                          {p.info.pair}
                        </span>
                        <div className="min-w-0">
                          <p className="font-bold text-gray-800 text-sm leading-snug">{t(p.info.titleEn, p.info.title)}</p>
                          <p className="text-[11px] text-gray-500 mt-0.5">{t("Position", "पोजीशन")} {p.positions} · {t("Combination", "संयोजन")} {p.combo}</p>
                        </div>
                      </div>
                      <p className="text-xs text-primary mt-2 leading-relaxed">
                        <span className="font-semibold">{t("Benefit: ", "लाभ: ")}</span>{t(p.info.labhEn, p.info.labh)}
                      </p>
                      {type === 'bad' && (
                        <p className="text-xs text-red-700 mt-1 leading-relaxed">
                          <span className="font-semibold">{t("Drawback: ", "नुकसान: ")}</span>{t(p.info.nuksanEn, p.info.nuksan)}
                        </p>
                      )}

                    </div>
                  ))}
                </div>
              </div>
            );
          };

          return (
            <div className="mb-6">
              <Group list={bad} type="bad" title={t("⚠️ Problematic Combinations Found", "⚠️ समस्याग्रस्त संयोजन पाए गए")} />
              <Group list={mixed} type="mixed" title={t("⚖️ Mixed Combinations", "⚖️ मिश्रित संयोजन")} />
              <Group list={good} type="good" title={t("✅ Auspicious Combinations", "✅ शुभ संयोजन")} />
            </div>
          );
        })()}


        {/* Position Analysis Cards */}
        <div className="space-y-4">
          <h4 className="text-lg font-bold text-orange-800 text-center mb-4">
            {t("🔍 Detailed Analysis of the Last 4 Digits", "🔍 अंतिम 4 अंकों का विस्तृत विश्लेषण")}
          </h4>

          <div className="bg-blue-50 border-l-4 border-blue-500 rounded-r-xl p-4 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center text-white text-xl font-bold shadow">
                {results.pos7}
              </div>
              <h5 className="font-bold text-blue-900">{t("Position 7", "7वीं पोजीशन")} - {getPlanetName(parseInt(results.pos7), lang === 'en')}</h5>
            </div>
            <p className="text-sm text-gray-700 leading-relaxed">{getPositionAnalysis(results.pos7, 7)}</p>
          </div>

          <div className="bg-primary/5 border-l-4 border-primary/50 rounded-r-xl p-4 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-white text-xl font-bold shadow">
                {results.pos8}
              </div>
              <h5 className="font-bold text-primary">{t("Position 8", "8वीं पोजीशन")} - {getPlanetName(parseInt(results.pos8), lang === 'en')}</h5>
            </div>
            <p className="text-sm text-gray-700 leading-relaxed">{getPositionAnalysis(results.pos8, 8)}</p>
          </div>

          <div className="bg-yellow-50 border-l-4 border-yellow-500 rounded-r-xl p-4 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-yellow-500 rounded-lg flex items-center justify-center text-yellow-900 text-xl font-bold shadow">
                {results.pos9}
              </div>
              <h5 className="font-bold text-yellow-900">{t("Position 9", "9वीं पोजीशन")} - {getPlanetName(parseInt(results.pos9), lang === 'en')}</h5>
            </div>
            <p className="text-sm text-gray-700 leading-relaxed">{getPositionAnalysis(results.pos9, 9)}</p>
          </div>

          <div className="bg-primary/5 border-l-4 border-primary/50 rounded-r-xl p-4 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-white text-xl font-bold shadow">
                {results.pos10}
              </div>
              <h5 className="font-bold text-primary">{t("Position 10", "10वीं पोजीशन")} - {getPlanetName(parseInt(results.pos10), lang === 'en')}</h5>
            </div>
            <p className="text-sm text-gray-700 leading-relaxed">{getPositionAnalysis(results.pos10, 10)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Number Analysis Component
function NumberAnalysis({ results }: { results: NumerologyResult }) {
  const t = useT();
  return (
    <div className="bg-white rounded-2xl shadow-xl border-2 border-red-300 overflow-hidden mb-6">
      <div className="bg-gradient-to-r from-red-500 to-red-600 p-4">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <Star className="w-5 h-5" />
          {t("🔴 Complete Analysis of Your Numbers", "🔴 आपकी संख्याओं का संपूर्ण विश्लेषण")}
        </h3>
      </div>
      <div className="p-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gradient-to-br from-blue-100 to-blue-50 rounded-xl p-4 text-center border border-blue-200">
            <p className="text-sm text-blue-700 mb-1">{t("Name Number", "नाम अंक")}</p>
            <p className="text-4xl font-bold text-blue-600">{results.namank}</p>
          </div>
          <div className="bg-gradient-to-br from-primary/10 to-primary/10 rounded-xl p-4 text-center border border-primary/20">
            <p className="text-sm text-primary mb-1">{t("Bhagyank (Destiny No.)", "भाग्यांक")}</p>
            <p className="text-4xl font-bold text-primary">{toSingleDigit(results.bhagyank)}</p>
          </div>
          <div className="bg-gradient-to-br from-purple-100 to-purple-50 rounded-xl p-4 text-center border border-purple-200">
            <p className="text-sm text-purple-700 mb-1">{t("Moolank (Root No.)", "मूलांक")}</p>
            <p className="text-4xl font-bold text-purple-600">{results.moolank}</p>
          </div>
          <div className="bg-gradient-to-br from-orange-100 to-orange-50 rounded-xl p-4 text-center border border-orange-200">
            <p className="text-sm text-orange-700 mb-1">{t("Mobile Total", "मोबाइल योग")}</p>
            <p className="text-4xl font-bold text-orange-600">{results.mobileYog}</p>
          </div>
        </div>

        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-4 text-center">
          <p className="text-sm text-gray-700">
            {t("✏️ Mobile number total:", "✏️ मोबाइल नंबर का कुल योग:")} {results.fullMobile.split('').join(' + ')} = {results.mobileYog} {t("(single digit)", "(एकल अंक)")}
          </p>
        </div>
      </div>
    </div>
  );
}

// Personal Suggestions Component
function PersonalSuggestions() {
  const t = useT();
  return (
    <div className="bg-white rounded-2xl shadow-xl border-2 border-amber-300 overflow-hidden mb-6">
      <div className="bg-gradient-to-r from-amber-500 to-amber-600 p-4">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <Lightbulb className="w-5 h-5" />
          {t("🌟 Personal Suggestions", "🌟 व्यक्तिगत सुझाव")}
        </h3>
      </div>
      <div className="p-6 space-y-4">
        <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <Briefcase className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
            <div>
              <h4 className="font-semibold text-primary">{t("✅ Career:", "✅ करियर:")}</h4>
              <p className="text-sm text-primary mt-1">
                {t("Your numbers point to success in leadership positions. Fields related to communication and management suit you best. You will perform excellently in public speaking, training, consulting or customer-facing roles.", "आपके अंकों के अनुसार leadership position में सफलता मिल सकती है। Communication और management से जुड़े क्षेत्र आपके लिए उत्तम हैं। आप public speaking, training, consulting, या customer-facing roles में excellent perform करेंगे।")}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <DollarSign className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
            <div>
              <h4 className="font-semibold text-blue-800">{t("💰 Wealth:", "💰 धन:")}</h4>
              <p className="text-sm text-blue-700 mt-1">
                {t("A balanced approach will bring financial gains. Think carefully before investing. Long-term plans will succeed. Focus on building multiple income sources.", "संतुलित दृष्टिकोण से धन लाभ होगा। निवेश से पहले सोच-समझकर निर्णय लें। लंबी अवधि की योजनाएं सफल रहेंगी। Multiple income sources बनाने पर focus करें।")}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <Star className="w-5 h-5 text-purple-600 mt-1 flex-shrink-0" />
            <div>
              <h4 className="font-semibold text-purple-800">{t("🌟 Fortune:", "🌟 भाग्य:")}</h4>
              <p className="text-sm text-purple-700 mt-1">
                {t("Keep your energy positive. Your efforts will surely succeed. Focus on building good relationships with people — networking is the key to unlocking your fortune.", "सकारात्मक ऊर्जा बनाए रखें। आपके प्रयास निश्चित रूप से सफल होंगे। लोगों से अच्छे संबंध बनाने पर focus करें। Networking आपके भाग्य को खोलने की key है।")}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-center">
          <p className="text-sm text-amber-800">
            {t("💡 Remember: numerology is a guide. Your actions and efforts are what truly determine your success.", "💡 याद रखें: अंक ज्योतिष एक मार्गदर्शक है। आपके कर्म और प्रयास ही आपकी सफलता निर्धारित करते हैं।")}
          </p>
        </div>
      </div>
    </div>
  );
}

// Detailed Recommendations Component
function DetailedRecommendations({ moolank, bhagyank, currentResults }: { moolank: number; bhagyank: number; currentResults: NumerologyResult }) {
  const [selectedComboIndex, setSelectedComboIndex] = useState(0);
  const t = useT();
  const { lang } = useLang();

  const positionReasons: { [key: number]: { pos7: string; pos8: string; pos9: string; pos10: string } } = {
    1: {
      pos7: t("Sun (1) gives you authority and leadership in conversation.", 'सूर्य (1) आपको बातचीत में अधिकार और नेतृत्व देगा।'),
      pos8: t("Sun (1) brings power and authority to your communication style.", 'सूर्य (1) आपकी communication style में power और authority लाता है।'),
      pos9: t("With Sun (1), people see you as a successful person.", 'सूर्य (1) से लोग आपको एक successful व्यक्ति के रूप में देखते हैं।'),
      pos10: t("Sun (1) gives callers the energy to take immediate action.", 'सूर्य (1) caller को immediate action लेने की energy देता है।')
    },
    2: {
      pos7: t("Moon (2) gives you emotional intelligence.", 'चंद्र (2) आपको emotional intelligence प्रदान करता है।'),
      pos8: t("Moon (2) brings empathy to your words.", 'चंद्र (2) आपकी बातों में empathy लाता है।'),
      pos9: t("With Moon (2), people see you as caring.", 'चंद्र (2) से लोग आपको caring मानते हैं।'),
      pos10: t("Moon (2) gives emotional satisfaction.", 'चंद्र (2) emotional satisfaction देता है।')
    },
    3: {
      pos7: t("Jupiter (3) gives you wisdom and knowledge.", 'बृहस्पति (3) आपको wisdom और knowledge देता है।'),
      pos8: t("Jupiter (3) brings intellectual depth.", 'बृहस्पति (3) intellectual depth लाता है।'),
      pos9: t("With Jupiter (3), people see you as an expert.", 'बृहस्पति (3) से लोग आपको expert मानते हैं।'),
      pos10: t("Jupiter (3) provides clarity.", 'बृहस्पति (3) clarity provide करता है।')
    },
    4: {
      pos7: t("Rahu (4) gives you a unique communication style.", 'राहु (4) आपको unique communication style देता है।'),
      pos8: t("Rahu (4) brings innovation and creativity.", 'राहु (4) innovation और creativity लाता है।'),
      pos9: t("With Rahu (4), people see you as innovative.", 'राहु (4) से लोग आपको innovative मानते हैं।'),
      pos10: t("Rahu (4) sparks curiosity.", 'राहु (4) curiosity जगाता है।')
    },
    5: {
      pos7: t("Mercury (5) gives you exceptional communication skills.", 'बुध (5) आपको exceptional communication skills प्रदान करता है।'),
      pos8: t("Mercury (5) makes your communication smart.", 'बुध (5) आपकी communication को smart बनाता है।'),
      pos9: t("With Mercury (5), people see you as intelligent.", 'बुध (5) से लोग आपको बुद्धिमान मानते हैं।'),
      pos10: t("Mercury (5) gives the energy for quick action.", 'बुध (5) quick action की energy देता है।')
    },
    6: {
      pos7: t("Venus (6) gives you charm and grace.", 'शुक्र (6) आपको charm और grace देता है।'),
      pos8: t("Venus (6) brings sweetness and politeness.", 'शुक्र (6) sweetness और politeness लाता है।'),
      pos9: t("With Venus (6), people see your services as premium.", 'शुक्र (6) से लोग आपकी services को premium मानते हैं।'),
      pos10: t("Venus (6) provides satisfaction.", 'शुक्र (6) satisfaction provide करता है।')
    },
    7: {
      pos7: t("Ketu (7) gives you spiritual wisdom.", 'केतु (7) आपको spiritual wisdom देता है।'),
      pos8: t("Ketu (7) brings depth and mystery.", 'केतु (7) depth और mystery लाता है।'),
      pos9: t("With Ketu (7), people see you as unique.", 'केतु (7) से लोग आपको unique मानते हैं।'),
      pos10: t("Ketu (7) creates a feeling of transformation.", 'केतु (7) transformation की feeling पैदा करता है।')
    },
    8: {
      pos7: t("Saturn (8) gives you discipline.", 'शनि (8) आपको discipline प्रदान करता है।'),
      pos8: t("Saturn (8) brings maturity and discipline.", 'शनि (8) maturity और discipline लाता है।'),
      pos9: t("With Saturn (8), people see you as reliable.", 'शनि (8) से लोग आपको reliable मानते हैं।'),
      pos10: t("Saturn (8) gives a feeling of stability.", 'शनि (8) stability की feeling देता है।')
    },
    9: {
      pos7: t("Mars (9) gives you energy and passion.", 'मंगल (9) आपको energy और passion देता है।'),
      pos8: t("Mars (9) brings confidence and boldness.", 'मंगल (9) confidence और boldness लाता है।'),
      pos9: t("With Mars (9), people see you as powerful.", 'मंगल (9) से लोग आपको powerful मानते हैं।'),
      pos10: t("Mars (9) gives complete satisfaction.", 'मंगल (9) complete satisfaction देता है।')
    },
    0: {
      pos7: t("Zero (0) symbolises complete potential.", 'शून्य (0) complete potential का प्रतीक है।'),
      pos8: t("Zero (0) makes communication universal.", 'शून्य (0) universal communication बनाता है।'),
      pos9: t("With Zero (0), people see you as balanced.", 'शून्य (0) से लोग आपको balanced मानते हैं।'),
      pos10: t("Zero (0) gives infinite possibilities.", 'शून्य (0) infinite possibilities देता है।')
    }
  };

  const rec = useMemo(() => {
    const commonFriends = getCommonFriends(moolank, bhagyank);

    const selectBestDigit = (position: string, friends: number[]): number => {
      const priorities: { [key: string]: number[] } = {
        pos7: [3, 5, 1, 7, 9, 6, 2],
        pos8: [1, 5, 3, 9, 6, 7, 2],
        pos9: [6, 5, 3, 1, 9, 7, 2],
        pos10: [5, 1, 9, 3, 6, 7, 2]
      };

      for (const digit of priorities[position]) {
        if (friends.includes(digit)) return digit;
      }
      return friends[0] || 1;
    };

    const generateCombinations = (friends: number[]) => {
      const combinations: { pos7: number; pos8: number; pos9: number; pos10: number }[] = [];
      const used = new Set<string>();
      const friendsList = [...friends];

      if (friendsList.length === 0) return combinations;

      const strategies: Array<(offset?: number) => { pos7: number; pos8: number; pos9: number; pos10: number }> = [
        () => ({
          pos7: selectBestDigit('pos7', friendsList),
          pos8: selectBestDigit('pos8', friendsList),
          pos9: selectBestDigit('pos9', friendsList),
          pos10: selectBestDigit('pos10', friendsList)
        }),
        (offset: number = 0) => ({
          pos7: friendsList[offset % friendsList.length],
          pos8: friendsList[(offset + 1) % friendsList.length],
          pos9: friendsList[(offset + 2) % friendsList.length],
          pos10: friendsList[(offset + 3) % friendsList.length]
        })
      ];

      let attempts = 0;
      let strategyIndex = 0;

      while (combinations.length < 6 && attempts < 50) {
        let combo;

        if (strategyIndex === 0) {
          combo = strategies[0]();
        } else {
          combo = strategies[1](strategyIndex - 1);
        }

        const comboKey = `${combo.pos7}${combo.pos8}${combo.pos9}${combo.pos10}`;

        if (!used.has(comboKey)) {
          combinations.push(combo);
          used.add(comboKey);
          strategyIndex++;
        }

        attempts++;
      }

      return combinations;
    };

    const allCombinations = generateCombinations(commonFriends);
    const moolankEnemies = friendshipChart[moolank]?.enemies || [];
    const bhagyankEnemies = friendshipChart[bhagyank]?.enemies || [];
    const allEnemies = [...new Set([...moolankEnemies, ...bhagyankEnemies])];

    return {
      totalSum: commonFriends.map(n => n.toString()),
      avoid: allEnemies.map(n => n.toString()),
      specialNote: t(`As per Moolank ${moolank} and Bhagyank ${bhagyank}, use only the friendly numbers ${commonFriends.join(', ')}.`, `मूलांक ${moolank} और भाग्यांक ${bhagyank} के अनुसार केवल मित्र अंक ${commonFriends.join(', ')} का उपयोग करें।`),
      commonFriends: commonFriends,
      allCombinations: allCombinations
    };
  }, [moolank, bhagyank, lang]);

  const currentCombo = `${currentResults.pos7}${currentResults.pos8}${currentResults.pos9}${currentResults.pos10}`;
  const selectedCombo = rec.allCombinations[selectedComboIndex] || { pos7: 1, pos8: 1, pos9: 1, pos10: 1 };

  const getReasonText = (digit: number, pos: 'pos7' | 'pos8' | 'pos9' | 'pos10'): string => {
    return positionReasons[digit]?.[pos] || t("This digit is auspicious.", 'यह अंक शुभ है।');
  };

  const bestRec = {
    pos7: { digit: selectedCombo.pos7.toString(), planet: getPlanetName(selectedCombo.pos7, lang === 'en'), reason: getReasonText(selectedCombo.pos7, 'pos7') },
    pos8: { digit: selectedCombo.pos8.toString(), planet: getPlanetName(selectedCombo.pos8, lang === 'en'), reason: getReasonText(selectedCombo.pos8, 'pos8') },
    pos9: { digit: selectedCombo.pos9.toString(), planet: getPlanetName(selectedCombo.pos9, lang === 'en'), reason: getReasonText(selectedCombo.pos9, 'pos9') },
    pos10: { digit: selectedCombo.pos10.toString(), planet: getPlanetName(selectedCombo.pos10, lang === 'en'), reason: getReasonText(selectedCombo.pos10, 'pos10') }
  };

  const needsChange = {
    pos7: currentResults.pos7 !== bestRec.pos7.digit,
    pos8: currentResults.pos8 !== bestRec.pos8.digit,
    pos9: currentResults.pos9 !== bestRec.pos9.digit,
    pos10: currentResults.pos10 !== bestRec.pos10.digit
  };

  const hasAnyChange = needsChange.pos7 || needsChange.pos8 || needsChange.pos9 || needsChange.pos10;

  return (
    <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl shadow-xl border-2 border-indigo-300 p-6 mb-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-indigo-900 flex items-center justify-center">
          <Lightbulb className="w-8 h-8 mr-3 text-yellow-500" />
          {t(`Special Suggestions for Moolank ${moolank} and Bhagyank ${bhagyank}`, `मूलांक ${moolank} और भाग्यांक ${bhagyank} के अनुसार विशेष सुझाव`)}
        </h2>
      </div>

      <div className="space-y-6">
        <div className="bg-yellow-100 border-2 border-yellow-400 rounded-lg p-4">
          <p className="text-sm text-gray-800">
            <strong>{t("⚠️ Important:", "⚠️ महत्वपूर्ण:")}</strong> {rec.specialNote}
          </p>
        </div>

        {hasAnyChange ? (
          <div className="bg-gradient-to-br from-red-50 to-orange-50 border-2 border-orange-300 rounded-xl p-6">
            <div className="flex items-center justify-center mb-4">
              <AlertCircle className="w-6 h-6 text-orange-600 mr-2" />
              <h3 className="text-xl font-bold text-orange-900">{t("Your Number Needs Changes", "आपके नंबर में बदलाव की आवश्यकता")}</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl p-4 border-2 border-red-300">
                <h4 className="text-center font-bold text-red-800 mb-4">{t("Current (last 4 digits):", "वर्तमान (आखिरी 4 अंक):")}</h4>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { pos: 'pos7', val: currentResults.pos7, change: needsChange.pos7 },
                    { pos: 'pos8', val: currentResults.pos8, change: needsChange.pos8 },
                    { pos: 'pos9', val: currentResults.pos9, change: needsChange.pos9 },
                    { pos: 'pos10', val: currentResults.pos10, change: needsChange.pos10 }
                  ].map(({ pos, val, change }, idx) => (
                    <div key={pos} className={`text-center p-4 rounded-lg border-2 ${change ? 'bg-red-100 border-red-400' : 'bg-primary/10 border-primary/50'}`}>
                      <div className="text-xs text-gray-600 mb-1">Pos {idx + 7}</div>
                      <div className="text-3xl font-bold text-gray-800">{val}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-xl p-4 border-2 border-primary/50">
                <h4 className="text-center font-bold text-primary mb-4">{t("Suggested (ideal):", "सुझाए गए (आदर्श):")}</h4>
                <div className="grid grid-cols-4 gap-2">
                  {[bestRec.pos7, bestRec.pos8, bestRec.pos9, bestRec.pos10].map((rec, idx) => (
                    <div key={idx} className="bg-primary/10 border-2 border-primary/50 text-center p-4 rounded-lg">
                      <div className="text-xs text-gray-600 mb-1">Pos {idx + 7}</div>
                      <div className="text-3xl font-bold text-primary">{rec.digit}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-gradient-to-br from-primary/10 to-primary/10 border-2 border-primary/50 rounded-xl p-6">
            <div className="flex items-center justify-center mb-4">
              <CheckCircle className="w-8 h-8 text-primary mr-3" />
              <h3 className="text-xl font-bold text-primary">{t("Your number is perfectly aligned!", "आपका नंबर पूर्ण रूप से सही है!")}</h3>
            </div>
          </div>
        )}

        <div className="bg-gradient-to-r from-primary/10 to-primary/10 border-2 border-primary/50 rounded-xl p-6">
          <h3 className="text-lg font-bold text-primary mb-4 text-center">
            {t("✨ Auspicious Last-4-Digit Options for You", "✨ आपके लिए शुभ अंतिम 4 अंकों के विकल्प")}
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {rec.allCombinations.map((combo, idx) => {
              const comboNumber = `${combo.pos7}${combo.pos8}${combo.pos9}${combo.pos10}`;
              const isMatching = comboNumber === currentCombo;
              const isSelected = idx === selectedComboIndex;
              return (
                <button
                  key={idx}
                  onClick={() => setSelectedComboIndex(idx)}
                  className={`${isSelected
                    ? 'bg-gradient-to-br from-blue-200 to-indigo-200 border-4 border-blue-600 shadow-xl'
                    : isMatching
                      ? 'bg-gradient-to-br from-yellow-100 to-amber-100 border-4 border-yellow-500'
                      : 'bg-white border-2 border-primary/50'
                    } rounded-lg p-4 text-center transition-all relative`}
                >
                  <div className="text-xs text-gray-500 mb-2">{t("Option", "विकल्प")} {idx + 1}</div>
                  <div className={`text-4xl font-bold ${isSelected ? 'text-blue-800' : isMatching ? 'text-yellow-700' : 'text-primary'}`}>
                    {comboNumber}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-bold text-lg text-indigo-900 mb-3">{t("🎯 Analysis of Each Position:", "🎯 प्रत्येक स्थिति का विश्लेषण:")}</h3>

          {[
            { pos: 'pos7', label: t("7th", '7वीं'), color: 'blue', rec: bestRec.pos7 },
            { pos: 'pos8', label: t("8th", '8वीं'), color: 'yellow', rec: bestRec.pos8 },
            { pos: 'pos9', label: t("9th", '9वीं'), color: 'indigo', rec: bestRec.pos9 },
            { pos: 'pos10', label: t("10th", '10वीं'), color: 'purple', rec: bestRec.pos10 }
          ].map(({ label, color, rec: r }) => (
            <div key={label} className={`bg-${color}-50 border-l-4 border-${color}-500 rounded-lg p-4`}>
              <div className="flex items-start">
                <div className={`bg-${color}-500 text-white rounded-full w-12 h-12 flex items-center justify-center text-2xl font-bold mr-4 flex-shrink-0`}>
                  {r.digit}
                </div>
                <div>
                  <h4 className={`font-bold text-${color}-900 mb-1`}>{label} {t("Position", "स्थिति")} - {r.planet}</h4>
                  <p className="text-sm text-gray-700">{r.reason}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-indigo-100 border-2 border-blue-400 shadow-lg rounded-xl p-6">
          <h4 className="font-bold text-blue-900 mb-4 flex items-center text-lg">
            <Star className="w-6 h-6 mr-2 text-yellow-500" />
            {t("Common Friendly Numbers", "साझा मित्र अंक")}
          </h4>
          <div className="bg-white rounded-xl p-4 border-2 border-primary/50">
            <p className="text-sm font-semibold text-gray-700 mb-3 text-center">{t("✨ Use only these digits:", "✨ केवल इन अंकों का उपयोग करें:")}</p>
            <div className="flex flex-wrap gap-3 justify-center">
              {rec.commonFriends.map((num) => (
                <div key={num} className="bg-gradient-to-br from-primary/80 to-primary/80 text-white px-5 py-3 rounded-xl font-bold text-2xl shadow-lg">
                  {num}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-primary/5 border-2 border-primary/50 rounded-lg p-4">
            <h4 className="font-bold text-primary mb-3 flex items-center">
              <CheckCircle className="w-5 h-5 mr-2" />
              {t("Auspicious Total Numbers", "शुभ योग अंक")}
            </h4>
            <div className="flex flex-wrap gap-2">
              {rec.totalSum.map((num) => (
                <span key={num} className="bg-primary/10 text-primary px-3 py-2 rounded-lg font-bold text-lg">
                  {num}
                </span>
              ))}
            </div>
          </div>

          <div className="bg-red-50 border-2 border-red-400 rounded-lg p-4">
            <h4 className="font-bold text-red-900 mb-3 flex items-center">
              <XCircle className="w-5 h-5 mr-2" />
              {t("Avoid These Numbers", "इन अंकों से बचें")}
            </h4>
            <div className="flex flex-wrap gap-2">
              {rec.avoid.map((num) => (
                <span key={num} className="bg-red-200 text-red-800 px-3 py-2 rounded-lg font-bold text-lg">
                  {num}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Main Component
// ===== अंकों की गिनती (Digit Frequency) =====
function DigitFrequency({ mobile }: { mobile: string }) {
  const t = useT();
  return (
    <div className="bg-white rounded-2xl shadow-xl border-2 border-indigo-200 overflow-hidden mb-6">
      <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 p-4">
        <h3 className="text-lg font-bold text-white">{t("🔢 Digit Count", "🔢 अंकों की गिनती")}</h3>
      </div>
      <div className="p-6">
        <div className="grid grid-cols-5 md:grid-cols-10 gap-2">
          {Array.from({ length: 10 }, (_, d) => {
            const c = mobile.split(String(d)).length - 1;
            return (
              <div key={d} className={`rounded-xl p-2 text-center ${c === 0 ? 'bg-gray-50 opacity-50' : 'bg-indigo-50 border border-indigo-200'}`}>
                <p className="text-xl font-bold text-indigo-700">{d}</p>
                <p className="text-xs text-gray-500">{t(`${c} times`, `${c} बार`)}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ===== मोबाइल अंक से अनुकूलता =====
function CompatibilityCard({ results }: { results: NumerologyResult }) {
  const t = useT();
  const relation = (a: number, b: number): { cls: string; label: string } => {
    if (a === b) return { cls: 'good', label: t("Same number (best)", 'समान अंक (श्रेष्ठ)') };
    if (friendshipChart[a]?.friends.includes(b)) return { cls: 'good', label: t("Friend", 'मित्र') };
    if (friendshipChart[a]?.enemies.includes(b)) return { cls: 'bad', label: t("Enemy", 'शत्रु') };
    return { cls: 'neutral', label: t("Neutral", 'सम') };
  };
  const badgeCls: { [k: string]: string } = {
    good: 'bg-primary/10 text-primary',
    bad: 'bg-red-100 text-red-700',
    neutral: 'bg-gray-100 text-gray-600',
  };
  const rows: [string, number][] = [
    [t(`Moolank ${results.moolank}`, `मूलांक ${results.moolank}`), results.moolank],
    [t(`Bhagyank ${results.bhagyank}`, `भाग्यांक ${results.bhagyank}`), results.bhagyank],
    [t(`Name Number ${results.namank}`, `नामांक ${results.namank}`), results.namank],
  ];
  return (
    <div className="bg-white rounded-2xl shadow-xl border-2 border-purple-200 overflow-hidden mb-6">
      <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-4">
        <h3 className="text-lg font-bold text-white">{t("🤝 Compatibility with Mobile Number", "🤝 मोबाइल अंक से अनुकूलता")}</h3>
      </div>
      <div className="p-6 divide-y divide-gray-100">
        {rows.map(([label, num]) => {
          const rel = relation(results.mobileYog, num);
          return (
            <div key={label} className="flex items-center justify-between py-3">
              <p className="text-sm text-gray-700">{t(`Mobile number ${results.mobileYog} and ${label}`, `मोबाइल अंक ${results.mobileYog} और ${label}`)}</p>
              <span className={`text-xs font-bold rounded-full px-3 py-1 ${badgeCls[rel.cls]}`}>{rel.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ===== विशेष नियम जाँच =====
function SpecialRulesCard({ results }: { results: NumerologyResult }) {
  const t = useT();
  const rel = (a: number, b: number): { ok: boolean; label: string } => {
    if (a === 0 || b === 0) return { ok: false, label: t("0 has no friendly numbers", '0 का मित्र अंक नहीं') };
    if (a === b) return { ok: true, label: t("Same number (best)", 'समान अंक (श्रेष्ठ)') };
    if (friendshipChart[a]?.friends.includes(b)) return { ok: true, label: t("Friend", 'मित्र') };
    if (friendshipChart[a]?.enemies.includes(b)) return { ok: false, label: t("Enemy", 'शत्रु') };
    return { ok: false, label: t("Neutral", 'सम') };
  };
  const birthCheck = (a: number) => {
    const r1 = rel(a, results.moolank);
    const r2 = rel(a, results.bhagyank);
    return { ok: r1.ok || r2.ok, detail: t(`Moolank ${results.moolank}: ${r1.label} | Bhagyank ${results.bhagyank}: ${r2.label}`, `मूलांक ${results.moolank}: ${r1.label} | भाग्यांक ${results.bhagyank}: ${r2.label}`) };
  };
  const d7 = Number(results.pos7), d8 = Number(results.pos8), d9 = Number(results.pos9), d10 = Number(results.pos10);
  const r1 = birthCheck(d7);
  const r2 = rel(d10, d7);
  const r3 = rel(d8, d9);
  const r4 = rel(d9, d8);
  const r5 = birthCheck(results.mobileYog);
  const ruleRows = [
    { ok: r1.ok, title: t(`7th digit (${d7}) should be a friend of your birth numbers`, `7वाँ अंक (${d7}) जन्म तिथि के मित्र अंक में हो`), detail: r1.detail },
    { ok: r2.ok, title: t(`10th digit (${d10}) should be a friend of the 7th digit (${d7})`, `10वाँ अंक (${d10}) 7वें अंक (${d7}) का मित्र हो`), detail: r2.label },
    { ok: r3.ok, title: t(`8th digit (${d8}) should be a friend of the 9th digit (${d9})`, `8वाँ अंक (${d8}) 9वें अंक (${d9}) का मित्र हो`), detail: r3.label },
    { ok: r4.ok, title: t(`9th digit (${d9}) should be a friend of the 8th digit (${d8})`, `9वाँ अंक (${d9}) 8वें अंक (${d8}) का मित्र हो`), detail: r4.label },
    { ok: r5.ok, title: t(`Mobile total (${results.mobileYog}) should be a friend of your birth numbers`, `मोबाइल कुल अंक (${results.mobileYog}) जन्म तिथि के मित्र अंक में हो`), detail: r5.detail },
  ];
  const passed = ruleRows.filter(r => r.ok).length;
  const verdictCls = passed === ruleRows.length ? 'bg-primary/5 text-primary border-primary/20' : passed === 0 ? 'bg-red-50 text-red-700 border-red-200' : 'bg-amber-50 text-amber-700 border-amber-200';
  return (
    <div className="bg-white rounded-2xl shadow-xl border-2 border-blue-200 overflow-hidden mb-6">
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-4">
        <h3 className="text-lg font-bold text-white">{t("📏 Special Rules Check", "📏 विशेष नियम जाँच")}</h3>
      </div>
      <div className="p-6 divide-y divide-gray-100">
        {ruleRows.map((r, i) => (
          <div key={i} className="flex items-center justify-between gap-4 py-3">
            <div>
              <p className="text-sm font-semibold text-gray-800">{r.title}</p>
              <p className="text-xs text-gray-500 mt-0.5">{r.detail}</p>
            </div>
            <span className={`text-xs font-bold rounded-full px-3 py-1 whitespace-nowrap ${r.ok ? 'bg-primary/10 text-primary' : 'bg-red-100 text-red-700'}`}>
              {r.ok ? t("✓ Pass", '✓ पास') : t("✗ Fail", '✗ फेल')}
            </span>
          </div>
        ))}
        <div className={`mt-4 rounded-xl border p-4 text-center text-sm font-semibold ${verdictCls}`}>
          {t(`${passed} of ${ruleRows.length} rules met`, `${ruleRows.length} में से ${passed} नियम पूरे`)}
        </div>
      </div>
    </div>
  );
}

// ===== मूलांक अनुसार विशेष स्थिति जाँच =====
const MOOLANK_RULES: { [k: number]: { positions: number[]; digits: number[] } } = {
  1: { positions: [5, 9], digits: [3, 9] },
  2: { positions: [2, 7], digits: [1, 5] },
  3: { positions: [3, 6, 9], digits: [1, 5, 3, 9] },
  4: { positions: [5, 7], digits: [1, 9, 6] },
  5: { positions: [2, 7, 9], digits: [1, 5, 3] },
  6: { positions: [3, 6, 9], digits: [5, 9, 6] },
  7: { positions: [3, 5, 8], digits: [1, 7, 9, 6] },
  8: { positions: [3, 5, 8], digits: [5, 3, 6] },
  9: { positions: [2, 6, 9], digits: [1, 3, 9] },
};

function MoolankRuleCard({ results }: { results: NumerologyResult }) {
  const t = useT();
  const rule = MOOLANK_RULES[results.moolank];
  if (!rule) return null;
  const hits = rule.positions.map(pos => {
    const dg = results.fullMobile.charAt(pos - 1);
    return { pos, dg, ok: rule.digits.includes(Number(dg)) };
  });
  const matched = hits.find(h => h.ok);
  return (
    <div className="bg-white rounded-2xl shadow-xl border-2 border-primary/20 overflow-hidden mb-6">
      <div className="bg-gradient-to-r from-primary/80 to-primary/80 p-4">
        <h3 className="text-lg font-bold text-white">{t("🎯 Moolank-based Position Check", "🎯 मूलांक अनुसार विशेष स्थिति जाँच")}</h3>
      </div>
      <div className="p-6">
        <p className="text-sm text-gray-600 mb-4">
          {t("For Moolank", "मूलांक")} <b className="text-gray-800">{results.moolank}</b> {t(`— at least one of positions ${rule.positions.join(', ')} should hold one of the digits ${rule.digits.join(', ')}.`, `के लिए स्थिति ${rule.positions.join(', ')} में से किसी एक पर अंक ${rule.digits.join(', ')} में से कोई एक होना चाहिए।`)}
        </p>
        <div className={`grid gap-2 mb-4`} style={{ gridTemplateColumns: `repeat(${rule.positions.length}, 1fr)` }}>
          {hits.map(h => (
            <div key={h.pos} className={`rounded-xl p-3 text-center ${h.ok ? 'bg-primary/10 border border-primary/20' : 'bg-gray-50 border border-gray-200'}`}>
              <p className={`text-2xl font-bold ${h.ok ? 'text-primary' : 'text-gray-500'}`}>{h.dg}</p>
              <p className="text-xs text-gray-500">{t("Position", "स्थिति")} {h.pos}</p>
            </div>
          ))}
        </div>
        <div className={`rounded-xl border p-4 text-center text-sm font-semibold ${matched ? 'bg-primary/5 text-primary border-primary/20' : 'bg-red-50 text-red-700 border-red-200'}`}>
          {matched ? t(`✓ Rule met — the required digit is at position ${matched.pos}.`, `✓ नियम पूरा हुआ — स्थिति ${matched.pos} पर आवश्यक अंक मौजूद है।`) : t("✗ Rule not met — none of the given positions has a required digit.", '✗ नियम पूरा नहीं हुआ — दी गई स्थितियों में से किसी पर भी आवश्यक अंक नहीं है।')}
        </div>
      </div>
    </div>
  );
}

export default function NumerologyCalculator() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const t = useT();
  const { lang } = useLang();
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [dob, setDob] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState<NumerologyResult | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isCalculating, setIsCalculating] = useState(false);
  const [savedReports, setSavedReports] = useState<SavedReport[]>([]);
  const [currentView, setCurrentView] = useState<'calculator' | 'reports'>('calculator');

  // Pre-fill from URL params and auto-calculate
  const [autoCalculated, setAutoCalculated] = useState(false);
  useEffect(() => {
    const paramName = searchParams.get('name');
    const paramDob = searchParams.get('dob');
    const paramMobile = searchParams.get('mobile');
    if (paramName && !name) setName(paramName);
    if (paramDob && !dob) setDob(paramDob);
    if (paramMobile && !mobile) setMobile(paramMobile);
    
    if (paramName && paramDob && paramMobile && !autoCalculated) {
      setAutoCalculated(true);
      setTimeout(() => {
        document.getElementById('numerology-calculate-btn')?.click();
      }, 200);
    }
  }, [searchParams]);

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!name.trim()) {
      newErrors.name = t("Please enter your name", 'कृपया नाम दर्ज करें');
    }

    const cleanMobile = mobile.replace(/\D/g, '');
    if (!cleanMobile) {
      newErrors.mobile = t("Please enter your mobile number", 'कृपया मोबाइल नंबर दर्ज करें');
    } else if (cleanMobile.length !== 10) {
      newErrors.mobile = t("Please enter a 10-digit mobile number", 'कृपया 10 अंकों का मोबाइल नंबर दर्ज करें');
    }

    if (!dob) {
      newErrors.dob = t("Please enter your date of birth", 'कृपया जन्म तिथि दर्ज करें');
    } else if (!validateDate(dob)) {
      newErrors.dob = t("Please enter the date in the correct format (dd/mm/yyyy)", 'कृपया सही तारीख फॉर्मेट में दर्ज करें (dd/mm/yyyy)');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCalculate = async () => {
    if (!validateForm()) return;

    setIsCalculating(true);

    try {
      const cleanMobile = mobile.replace(/\D/g, '');
      const namank = calculateNameNumber(name);
      const [day, month, year] = dob.split('/');
      const bhagyank = calculateNumerology(day + month + year, true);
      const moolank = calculateNumerology(day);
      const mobileYog = calculateNumerology(cleanMobile, true);

      const pos7 = cleanMobile[6];
      const pos8 = cleanMobile[7];
      const pos9 = cleanMobile[8];
      const pos10 = cleanMobile[9];

      const allCombos = checkAllCombinations(cleanMobile);

      const calculatedResults: NumerologyResult = {
        namank,
        bhagyank,
        moolank,
        mobileYog,
        pos7,
        pos8,
        pos9,
        pos10,
        fullMobile: cleanMobile,
        allComboIssues: allCombos,
        name,
        dob
      };

      setResults(calculatedResults);
      setShowResults(true);

      const newReport: SavedReport = {
        id: Date.now(),
        timestamp: new Date().toLocaleString(lang === 'hi' ? 'hi-IN' : 'en-IN'),
        ...calculatedResults
      };
      setSavedReports(prev => [newReport, ...prev]);

      await new Promise(resolve => setTimeout(resolve, 500));

    } catch (error) {
      console.error('Calculation error:', error);
      setErrors({ general: t("Something went wrong with the calculation. Please try again.", 'गणना में त्रुटि हुई। कृपया पुनः प्रयास करें।') });
    } finally {
      setIsCalculating(false);
    }
  };

  const handleDeleteReport = (id: number) => {
    setSavedReports(prev => prev.filter(report => report.id !== id));
  };

  const handleLoadReport = (report: SavedReport) => {
    setName(report.name);
    setMobile(report.fullMobile);
    setDob(report.dob);
    setResults({ ...report, bhagyank: toSingleDigit(report.bhagyank) });
    setShowResults(true);
    setCurrentView('calculator');
  };

  const handleNewCalculation = () => {
    setName('');
    setMobile('');
    setDob('');
    setResults(null);
    setShowResults(false);
    setErrors({});
    setCurrentView('calculator');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      <main className="min-h-[calc(100vh-8rem)]">
        {currentView === 'calculator' ? (
          <div className="max-w-4xl mx-auto p-4">
            <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-purple-900 text-white rounded-2xl shadow-2xl p-8 mb-6 mt-6">
              <div className="flex items-center justify-center mb-4">
                <Calculator className="w-12 h-12 mr-3 animate-pulse" />
                <h1 className="text-3xl md:text-4xl font-bold">Mobile Numerology Calculator</h1>
              </div>
              <p className="text-center text-sm md:text-base opacity-90">
                {t("Find the numerology of your name and mobile number — Moolank, Name Number and full analysis", "नाम और मोबाइल नंबर का मूलांक, नामांक निकालने और अंक ज्योतिष विश्लेषण")}
              </p>
            </div>

            {showResults && results && (
              <div className="mb-4">
                <button
                  onClick={() => { setShowResults(false); setResults(null); navigate(-1); }}
                  className="flex items-center gap-2 text-purple-700 hover:text-purple-900 font-semibold transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                  {t("Go Back", "वापस जाएं")}
                </button>
              </div>
            )}

            {!showResults && (
            <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 mb-6">
              <h2 className="text-center text-2xl font-bold text-gray-800 mb-2">{t("Enter Your Details", "अपनी जानकारी दर्ज करें")}</h2>
              <p className="text-center text-sm text-gray-600 mb-6">{t("Fill in your details for a free astrology analysis", "मुफ्त ज्योतिष विश्लेषण के लिए विवरण भरें")}</p>

              {errors.general && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded">
                  <div className="flex items-center">
                    <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
                    <p className="text-red-700">{errors.general}</p>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold flex items-center text-gray-700">
                    <span className="mr-2">👤</span> {t("Enter name:", "नाम दर्ज करें:")}
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      setErrors(prev => ({ ...prev, name: '' }));
                    }}
                    placeholder="Radha Kishore"
                    className={`w-full px-4 py-3 rounded-lg border-2 transition-colors ${errors.name
                      ? 'border-red-300 focus:border-red-500'
                      : 'border-purple-200 focus:border-purple-500'
                      } focus:outline-none`}
                  />
                  {errors.name && (
                    <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold flex items-center text-gray-700">
                    <span className="mr-2">📱</span> {t("Mobile number:", "मोबाइल नंबर:")}
                  </label>
                  <input
                    type="tel"
                    value={mobile}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '').slice(0, 10);
                      setMobile(value);
                      setErrors(prev => ({ ...prev, mobile: '' }));
                    }}
                    placeholder="9876543210"
                    maxLength={10}
                    className={`w-full px-4 py-3 rounded-lg border-2 transition-colors ${errors.mobile
                      ? 'border-red-300 focus:border-red-500'
                      : 'border-purple-200 focus:border-purple-500'
                      } focus:outline-none`}
                  />
                  {errors.mobile && (
                    <p className="text-red-500 text-xs mt-1">{errors.mobile}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold flex items-center text-gray-700">
                    <span className="mr-2">📅</span> {t("Date of birth:", "जन्म तिथि:")}
                  </label>
                  <input
                    type="text"
                    value={dob}
                    onChange={(e) => {
                      let val = e.target.value.replace(/[^\d]/g, '');
                      if (val.length > 8) val = val.slice(0, 8);
                      if (val.length >= 5) {
                        val = val.slice(0, 2) + '/' + val.slice(2, 4) + '/' + val.slice(4);
                      } else if (val.length >= 3) {
                        val = val.slice(0, 2) + '/' + val.slice(2);
                      }
                      setDob(val);
                      setErrors(prev => ({ ...prev, dob: '' }));
                    }}
                    placeholder="dd/mm/yyyy"
                    maxLength={10}
                    className={`w-full px-4 py-3 rounded-lg border-2 transition-colors ${errors.dob
                      ? 'border-red-300 focus:border-red-500'
                      : 'border-purple-200 focus:border-purple-500'
                      } focus:outline-none`}
                  />
                  {errors.dob && (
                    <p className="text-red-500 text-xs mt-1">{errors.dob}</p>
                  )}
                </div>
              </div>

              <button
                id="numerology-calculate-btn"
                onClick={handleCalculate}
                disabled={isCalculating}
                className="w-full bg-purple-900 text-white py-4 px-6 rounded-xl text-lg font-bold hover:bg-purple-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all shadow-lg flex items-center justify-center"
              >
                <Sparkles className="w-6 h-6 mr-2" />
                {isCalculating ? t("Calculating...", 'गणना हो रही है...') : t("🔮 Calculate Full Report", '🔮 संपूर्ण गणना करें')}
              </button>
            </div>
            )}

            {showResults && results && (
              <div className="space-y-6">
                <NumberAnalysis results={results} />
                <DigitFrequency mobile={results.fullMobile} />
                <PositionAnalysis results={results} />
                <CompatibilityCard results={results} />
                <SpecialRulesCard results={results} />
                <MoolankRuleCard results={results} />
                <DetailedRecommendations
                  moolank={results.moolank}
                  bhagyank={results.bhagyank}
                  currentResults={results}
                />
                <PersonalSuggestions />
              </div>
            )}
          </div>
        ) : (
          <div className="max-w-6xl mx-auto p-4">
            <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 mt-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                  <History className="w-8 h-8 mr-3 text-purple-600" />
                  {t("Saved Reports", "सहेजी गई रिपोर्ट्स")}
                </h2>
                {savedReports.length > 0 && (
                  <button
                    onClick={handleNewCalculation}
                    className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-all flex items-center"
                  >
                    <Calculator className="w-5 h-5 mr-2" />
                    {t("New Calculation", "नई गणना")}
                  </button>
                )}
              </div>

              {savedReports.length === 0 ? (
                <div className="text-center py-12">
                  <History className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg mb-4">{t("No reports saved yet", "कोई रिपोर्ट सहेजी नहीं गई है")}</p>
                  <button
                    onClick={() => setCurrentView('calculator')}
                    className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-all"
                  >
                    {t("Create Your First Report", "पहली रिपोर्ट बनाएं")}
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {savedReports.map((report) => (
                    <div
                      key={report.id}
                      className="bg-gradient-to-r from-purple-50 to-indigo-50 border-2 border-purple-200 rounded-xl p-6"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-bold text-gray-800 mb-1">{report.name}</h3>
                          <p className="text-sm text-gray-600">📱 {report.fullMobile}</p>
                          <p className="text-sm text-gray-600">📅 {report.dob}</p>
                          <p className="text-xs text-gray-500 mt-2">⏰ {report.timestamp}</p>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleLoadReport(report)}
                            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-all text-sm flex items-center"
                          >
                            <Calculator className="w-4 h-4 mr-1" />
                            {t("View", "देखें")}
                          </button>
                          <button
                            onClick={() => handleDeleteReport(report.id)}
                            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-all text-sm flex items-center"
                          >
                            <Trash2 className="w-4 h-4 mr-1" />
                            {t("Delete", "हटाएं")}
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        <div className="bg-white rounded-lg p-3 text-center border border-purple-200">
                          <p className="text-xs text-gray-600 mb-1">{t("Name Number", "नामांक")}</p>
                          <p className="text-2xl font-bold text-purple-600">{report.namank}</p>
                        </div>
                        <div className="bg-white rounded-lg p-3 text-center border border-indigo-200">
                          <p className="text-xs text-gray-600 mb-1">{t("Bhagyank", "भाग्यांक")}</p>
                          <p className="text-2xl font-bold text-indigo-600">{toSingleDigit(report.bhagyank)}</p>
                        </div>
                        <div className="bg-white rounded-lg p-3 text-center border border-pink-200">
                          <p className="text-xs text-gray-600 mb-1">{t("Moolank", "मूलांक")}</p>
                          <p className="text-2xl font-bold text-pink-600">{report.moolank}</p>
                        </div>
                        <div className="bg-white rounded-lg p-3 text-center border border-blue-200">
                          <p className="text-xs text-gray-600 mb-1">{t("Mobile Total", "मोबाइल योग")}</p>
                          <p className="text-2xl font-bold text-blue-600">{report.mobileYog}</p>
                        </div>
                      </div>

                      {report.allComboIssues.length > 0 && (
                        <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-3">
                          <p className="text-sm font-semibold text-red-800 mb-2">
                            {t("⚠️ Problematic combinations:", "⚠️ समस्याग्रस्त संयोजन:")} {report.allComboIssues.length}
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {report.allComboIssues.map((issue, idx) => (
                              <span key={idx} className="bg-red-200 text-red-800 px-2 py-1 rounded text-xs font-medium">
                                {issue.combination}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
