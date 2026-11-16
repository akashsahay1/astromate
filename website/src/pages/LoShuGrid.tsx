import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useT } from '@/hooks/useLang';

interface ResultType {
  allDigits: number[];
  digitsWithoutZero: number[];
  driverNumber: number;
  conductorNumber: number;
  kuaNumber: number;
  kuaCalculation: string;
  nameNumber: number;
  nameSum: number;
  nameBreakdown: string[];
  frequency: Record<number, number>;
  daySum: number;
  conductorSum: number;
  yearSum: number;
}

export default function LoShuGrid() {
  const t = useT();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [name, setName] = useState('');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState('male');
  const [result, setResult] = useState<ResultType | null>(null);
  const [selectedPlane, setSelectedPlane] = useState<string | null>(null);
  const [autoCalculated, setAutoCalculated] = useState(false);

  // Auto-fill and calculate from URL params
  useEffect(() => {
    if (autoCalculated) return;
    const paramName = searchParams.get('name');
    const paramDob = searchParams.get('dob');
    const paramGender = searchParams.get('gender');
    if (paramName) setName(paramName);
    if (paramDob) setDob(paramDob);
    if (paramGender) setGender(paramGender);
    if (paramDob && paramName) {
      setAutoCalculated(true);
      // Delay to let state update
      setTimeout(() => {
        const calcBtn = document.getElementById('loshu-calculate-btn');
        if (calcBtn) calcBtn.click();
      }, 100);
    }
  }, [searchParams, autoCalculated]);

  const calculateGrid = () => {
    if (!dob) {
      alert(t("Please enter your date of birth", 'कृपया जन्म तिथि दर्ज करें'));
      return;
    }

    if (!name.trim()) {
      alert(t("Please enter your name", 'कृपया नाम दर्ज करें'));
      return;
    }

    const parts = dob.split(/[/-]/);
    if (parts.length !== 3) {
      alert(t("Please enter the date in DD/MM/YYYY format", 'कृपया DD/MM/YYYY प्रारूप में तिथि दर्ज करें'));
      return;
    }

    const day = parts[0];
    const month = parts[1];
    const year = parts[2];

    const allDigits = (day + month + year).split('').map(Number);
    const digitsWithoutZero = allDigits.filter(d => d !== 0);

    const nameLetters = name.toUpperCase().replace(/[^A-Z]/g, '');
    const letterValues: Record<string, number> = {
      'A': 1, 'I': 1, 'J': 1, 'Q': 1, 'Y': 1,
      'B': 2, 'K': 2, 'R': 2,
      'C': 3, 'G': 3, 'L': 3, 'S': 3,
      'D': 4, 'M': 4, 'T': 4,
      'E': 5, 'H': 5, 'N': 5, 'X': 5,
      'U': 6, 'V': 6, 'W': 6,
      'O': 7, 'Z': 7,
      'F': 8, 'P': 8
    };

    let nameSum = 0;
    const nameBreakdown: string[] = [];
    for (const letter of nameLetters) {
      const value = letterValues[letter] || 0;
      nameSum += value;
      nameBreakdown.push(`${letter}=${value}`);
    }
    
    let nameNumber = nameSum;
    while (nameNumber > 9) {
      nameNumber = nameNumber.toString().split('').reduce((sum, d) => sum + parseInt(d), 0);
    }

    const daySum = day.split('').reduce((sum, d) => sum + parseInt(d), 0);
    const driverNumber = daySum > 9 ? daySum.toString().split('').reduce((sum, d) => sum + parseInt(d), 0) : daySum;

    let conductorSum = allDigits.reduce((sum, d) => sum + d, 0);
    let conductorNumber = conductorSum;
    while (conductorNumber > 9) {
      conductorNumber = conductorNumber.toString().split('').reduce((sum, d) => sum + parseInt(d), 0);
    }

    const yearSum = year.split('').reduce((sum, d) => sum + parseInt(d), 0);
    let kuaBase = yearSum > 9 ? yearSum.toString().split('').reduce((sum, d) => sum + parseInt(d), 0) : yearSum;
    
    let kuaNumber: number;
    let kuaCalculation: string;
    if (gender === 'male') {
      kuaNumber = 11 - kuaBase;
      kuaCalculation = `11 - ${kuaBase} = ${kuaNumber}`;
      if (kuaNumber > 9) {
        const temp = kuaNumber;
        kuaNumber = kuaNumber.toString().split('').reduce((sum, d) => sum + parseInt(d), 0);
        kuaCalculation = `11 - ${kuaBase} = ${temp} → ${kuaNumber}`;
      }
    } else {
      kuaNumber = 4 + kuaBase;
      kuaCalculation = `4 + ${kuaBase} = ${kuaNumber}`;
      if (kuaNumber > 9) {
        const temp = kuaNumber;
        kuaNumber = kuaNumber.toString().split('').reduce((sum, d) => sum + parseInt(d), 0);
        kuaCalculation = `4 + ${kuaBase} = ${temp} → ${temp.toString().split('').join('+')} = ${kuaNumber}`;
      }
    }

    const frequency: Record<number, number> = {};
    for (let i = 1; i <= 9; i++) {
      frequency[i] = digitsWithoutZero.filter(d => d === i).length;
    }

    setResult({
      allDigits,
      digitsWithoutZero,
      driverNumber,
      conductorNumber,
      kuaNumber,
      kuaCalculation,
      nameNumber,
      nameSum,
      nameBreakdown,
      frequency,
      daySum,
      conductorSum,
      yearSum: kuaBase
    });
  };

  const renderGrid = () => {
    if (!result) return null;

    const grid = [
      [4, 9, 2],
      [3, 5, 7],
      [8, 1, 6]
    ];

    const planetNames: Record<number, string> = {
      4: t("Rahu", 'राहु'),
      9: t("Mars", 'मंगल'),
      2: t("Moon", 'चंद्र'),
      3: t("Jupiter", 'बृहस्पति'),
      5: t("Mercury", 'बुध'),
      7: t("Ketu", 'केतु'),
      8: t("Saturn", 'शनि'),
      1: t("Sun", 'सूर्य'),
      6: t("Venus", 'शुक्र')
    };

    const getNumbersForCell = (num: number) => {
      const numbers: { value: number; type: string; label?: string }[] = [];
      
      for (let i = 0; i < result.frequency[num]; i++) {
        numbers.push({ value: num, type: 'frequency' });
      }
      
      if (num === result.driverNumber) {
        numbers.push({ value: num, type: 'driver', label: 'D' });
      }
      if (num === result.conductorNumber) {
        numbers.push({ value: num, type: 'conductor', label: 'C' });
      }
      if (num === result.kuaNumber) {
        numbers.push({ value: num, type: 'kua', label: 'K' });
      }
      if (num === result.nameNumber) {
        numbers.push({ value: num, type: 'name', label: 'N' });
      }
      
      return numbers;
    };

    return (
      <div className="grid grid-cols-3 gap-0 w-full max-w-md mx-auto mt-6 border-4 border-accent">
        {grid.map((row, i) => (
          row.map((num, j) => {
            const cellNumbers = getNumbersForCell(num);
            const hasNumbers = cellNumbers.length > 0;
            return (
              <div
                key={`${i}-${j}`}
                className={`aspect-square flex flex-col items-center justify-center p-3 border-2 border-accent ${hasNumbers ? 'bg-primary' : 'bg-card'}`}
              >
                <div className={`text-sm font-semibold mb-1 ${hasNumbers ? 'text-primary-foreground' : 'text-primary'}`}>
                  {planetNames[num]}
                </div>
                <div className={`text-2xl font-bold mb-1 ${hasNumbers ? 'text-primary-foreground' : 'text-primary'}`}>
                  {num}
                </div>
                <div className="flex flex-wrap items-center justify-center gap-1">
                  {cellNumbers.length > 0 && (
                    cellNumbers.map((item, idx) => (
                      <div key={idx} className="text-xl font-bold text-primary-foreground">
                        {item.value}
                        {item.label && (
                          <sup className="text-xs">{item.label}</sup>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })
        ))}
      </div>
    );
  };

  const planeDetails: Record<string, { title: string; emoji: string; numbers: number[]; description: string; strong: string; weak: string }> = {
    thought: {
      title: t("4-3-8: Thought Plane", '4-3-8: विचार तल'),
      emoji: '🧠',
      numbers: [4, 3, 8],
      description: t("Mental power and the ability to think. This plane reflects your intellect, analytical thinking and mental clarity.", 'मानसिक शक्ति और सोचने की क्षमता। यह तल आपकी बौद्धिक क्षमता, विश्लेषणात्मक सोच और मानसिक स्पष्टता को दर्शाता है।'),
      strong: t("Deep thinkers, philosophers, strategists. Excellent at analysing complex situations.", 'गहरे विचारक, दार्शनिक, रणनीतिकार। जटिल स्थितियों का विश्लेषण करने में उत्कृष्ट।'),
      weak: t("Confusion, lack of clarity or difficulty making decisions. Analytical skills need developing.", 'भ्रम, स्पष्टता की कमी, या निर्णय लेने में कठिनाई। विश्लेषणात्मक कौशल विकसित करने की आवश्यकता।')
    },
    will: {
      title: t("9-5-1: Willpower Plane", '9-5-1: इच्छाशक्ति तल'),
      emoji: '💪',
      numbers: [9, 5, 1],
      description: t("Determination and willpower. This plane reflects your inner strength, courage and resolve to reach your goals.", 'दृढ़ संकल्प और इच्छाशक्ति। यह तल आपकी आंतरिक शक्ति, साहस और लक्ष्य प्राप्त करने का दृढ़ संकल्प दर्शाता है।'),
      strong: t("Natural leaders with strong self-confidence. They face challenges head-on and inspire others.", 'प्राकृतिक नेता, मजबूत आत्मविश्वास वाले। चुनौतियों का सामना करते हैं और दूसरों को प्रेरित करते हैं।'),
      weak: t("Lack of confidence or dependence on others. Need to build confidence and take more initiative.", 'आत्मविश्वास की कमी या दूसरों पर निर्भरता। आत्मविश्वास बनाने और अधिक पहल करने की आवश्यकता।')
    },
    action: {
      title: t("2-7-6: Action Plane", '2-7-6: कर्म तल'),
      emoji: '🎯',
      numbers: [2, 7, 6],
      description: t("Practical action and execution. This plane reflects your ability to turn ideas and plans into reality.", 'व्यावहारिक कार्य और कार्यान्वयन। यह तल विचारों और योजनाओं को वास्तविकता में बदलने की आपकी क्षमता को दर्शाता है।'),
      strong: t("Doers and implementers. They don't just talk \u2014 they act and deliver results.", 'कर्ता और कार्यान्वयनकर्ता। सिर्फ बात नहीं करते, कार्य करते हैं और परिणाम देते हैं।'),
      weak: t("Procrastination or struggling to carry out plans. Living in a world of ideas without execution.", 'विलंब या योजनाओं को क्रियान्वित करने में संघर्ष। बिना कार्यान्वयन के विचारों की दुनिया में रहना।')
    },
    emotional: {
      title: t("3-5-7: Emotional Plane", '3-5-7: भावनात्मक तल'),
      emoji: '❤️',
      numbers: [3, 5, 7],
      description: t("Emotional balance and sensitivity. This plane reflects your emotional intelligence and your ability to understand and manage feelings.", 'भावनात्मक संतुलन और संवेदनशीलता। यह तल आपकी भावनात्मक बुद्धिमत्ता और भावनाओं को समझने और प्रबंधित करने की क्षमता दर्शाता है।'),
      strong: t("Caring and understanding; they maintain harmonious relationships. High emotional intelligence.", 'देखभाल करने वाले, समझदार, सामंजस्यपूर्ण संबंध बनाए रखते हैं। उच्च भावनात्मक बुद्धिमत्ता।'),
      weak: t("Emotional instability or difficulty forming deep bonds. Can be overly rational and detached.", 'भावनात्मक अस्थिरता या गहरे संबंध बनाने में कठिनाई। अत्यधिक तर्कसंगत और अलग हो सकते हैं।')
    },
    mental: {
      title: t("4-9-2: Mental Plane", '4-9-2: मानसिक तल'),
      emoji: '🛠️',
      numbers: [4, 9, 2],
      description: t("Planning and organising ability. This plane reflects your ability to organise, plan and structure things.", 'योजना और संगठन क्षमता। यह तल चीजों को व्यवस्थित, योजनाबद्ध और संरचित करने की आपकी क्षमता को दर्शाता है।'),
      strong: t("Great planners, organisers and managers. Excellent at building systems and processes.", 'महान योजनाकार, संगठनकर्ता और प्रबंधक। सिस्टम और प्रक्रियाएं बनाने में उत्कृष्ट।'),
      weak: t("Struggles with organisation and planning. Difficulty bringing order out of chaos.", 'संगठन और योजना में संघर्ष। अराजकता से व्यवस्था बनाने में कठिनाई।')
    },
    practical: {
      title: t("8-1-6: Practical Plane", '8-1-6: व्यावहारिक तल'),
      emoji: '🏆',
      numbers: [8, 1, 6],
      description: t("Material success and stability. This plane reflects your ability to achieve material success, financial stability and worldly accomplishments.", 'भौतिक सफलता और स्थिरता। यह तल भौतिक सफलता, वित्तीय स्थिरता और सांसारिक उपलब्धियों को प्राप्त करने की आपकी क्षमता को दर्शाता है।'),
      strong: t("Good at earning money, building wealth and managing resources. They achieve tangible results and material success.", 'पैसा कमाने, धन बनाने और संसाधनों के प्रबंधन में अच्छे। ठोस परिणाम और भौतिक सफलता प्राप्त करते हैं।'),
      weak: t("Financial struggles or lack of material success. Overly idealistic without a practical footing.", 'वित्तीय संघर्ष या भौतिक सफलता की कमी। व्यावहारिक आधार के बिना अत्यधिक आदर्शवादी।')
    },
    superSuccess: {
      title: t("4-5-6: Golden Success Line", '4-5-6: महा सफलता रेखा'),
      emoji: '⭐',
      numbers: [4, 5, 6],
      description: t("The highest success indicator \u2014 the Golden Triangle. This is the most powerful line in the Lo Shu Grid.", 'सर्वोच्च सफलता संकेतक - स्वर्ण त्रिभुज। यह लो शू ग्रिड की सबसे शक्तिशाली रेखा है।'),
      strong: t("Great heights in your chosen field, excellent fortune and all-round prosperity. A perfect balance of mind (4-Rahu), communication (5-Mercury) and luxury (6-Venus).", 'चुने हुए क्षेत्र में महान ऊंचाइयां, उत्कृष्ट भाग्य, सर्वांगीण समृद्धि। मन (4-राहु), संचार (5-बुध), और विलासिता (6-शुक्र) का सही संतुलन।'),
      weak: t("The potential for success is there, but reaching your goals needs more effort or a more strategic approach.", 'सफलता की क्षमता है, लेकिन लक्ष्य प्राप्त करने के लिए अधिक मेहनत या रणनीतिक होने की आवश्यकता।')
    },
    success: {
      title: t("2-5-8: Success Line", '2-5-8: सफलता रेखा'),
      emoji: '🌟',
      numbers: [2, 5, 8],
      description: t("Financial success and wealth gains \u2014 the Silver Line. This is the second most powerful success indicator.", 'वित्तीय सफलता और धन लाभ - रजत रेखा। यह दूसरा सबसे शक्तिशाली सफलता संकेतक है।'),
      strong: t("Become wealthy through business or investments. The right mix of intuition (2-Moon), communication (5-Mercury) and discipline (8-Saturn) for financial success.", 'व्यापार या निवेश के माध्यम से धनवान बनते हैं। वित्तीय सफलता के लिए अंतर्ज्ञान (2-चंद्र), संचार (5-बुध), और अनुशासन (8-शनि) का सही मिश्रण।'),
      weak: t("Need to work on business skills or financial planning to achieve prosperity.", 'समृद्धि प्राप्त करने के लिए व्यावसायिक कौशल या वित्तीय योजना पर काम करने की आवश्यकता।')
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-card rounded-lg shadow-lg p-6 border-t-4 border-primary">
            <h1 className="text-3xl font-bold text-center mb-6 text-primary">
              Lo Shu Grid Calculator
            </h1>

            {result && (
              <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 mb-4 text-primary hover:text-primary/80 font-semibold transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                {t("Go back", "वापस जाएं")}
              </button>
            )}

            {!result && (
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    {t("Name", "नाम")}
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-foreground"
                    placeholder={t("Enter your name", "अपना नाम दर्ज करें")}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    {t("Date of birth (DD/MM/YYYY)", "जन्म तिथि (DD/MM/YYYY)")}
                  </label>
                  <input
                    type="text"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-foreground"
                    placeholder="15/03/1977"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    {t("Gender", "लिंग")}
                  </label>
                  <div className="flex gap-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        value="male"
                        checked={gender === 'male'}
                        onChange={(e) => setGender(e.target.value)}
                        className="mr-2 accent-primary"
                      />
                      {t("Male", "पुरुष")}
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        value="female"
                        checked={gender === 'female'}
                        onChange={(e) => setGender(e.target.value)}
                        className="mr-2 accent-primary"
                      />
                      {t("Female", "महिला")}
                    </label>
                  </div>
                </div>

                <button
                  id="loshu-calculate-btn"
                  onClick={calculateGrid}
                  className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-semibold hover:opacity-90 transition-colors"
                >
                  {t("Calculate", "गणना करें")}
                </button>
              </div>
            )}

            {result && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-2 text-center">{t("Lo Shu Grid", "लो शू ग्रिड")}</h3>
                  {renderGrid()}
                  <div className="text-xs text-muted-foreground mt-4 text-center space-y-1">
                    <p>{t("Numbers show how often each digit appears in the date of birth", "संख्याएं जन्म तिथि में आवृत्ति दर्शाती हैं")}</p>
                    <p className="flex justify-center gap-4 mt-2 flex-wrap">
                      <span><sup className="font-bold text-primary">D</sup> = {t("Driver", "ड्राइवर")}</span>
                      <span><sup className="font-bold text-primary">C</sup> = {t("Conductor", "कंडक्टर")}</span>
                      <span><sup className="font-bold text-primary">K</sup> = {t("Kua", "कुआ")}</span>
                      <span><sup className="font-bold text-primary">N</sup> = {t("Name", "नाम")}</span>
                    </p>
                  </div>

                  {/* Planes Analysis */}
                  <div className="mt-6 space-y-3">
                    <h3 className="text-lg font-semibold text-center mb-4 text-primary">{t("Plane analysis — click to see details", "तल विश्लेषण - विवरण देखने के लिए क्लिक करें")}</h3>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {Object.entries(planeDetails).map(([key, plane]) => (
                        <div 
                          key={key}
                          onClick={() => setSelectedPlane(key)}
                          className="bg-card p-3 rounded-lg border-2 border-primary cursor-pointer hover:shadow-md transition-shadow"
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xl">{plane.emoji}</span>
                            <h4 className="font-bold text-sm text-primary">{plane.title}</h4>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {t("Count", "गणना")}: {plane.numbers.reduce((sum, n) => sum + (result.frequency[n] || 0), 0)}
                          </p>
                        </div>
                      ))}
                    </div>

                    {/* Detailed View */}
                    {selectedPlane && planeDetails[selectedPlane] && (
                      <div className="mt-4 bg-card p-4 rounded-lg border-2 border-primary shadow-lg">
                        <div className="flex justify-between items-start mb-3">
                          <h3 className="text-lg font-bold text-primary">
                            {planeDetails[selectedPlane].emoji} {planeDetails[selectedPlane].title}
                          </h3>
                          <button 
                            onClick={() => setSelectedPlane(null)}
                            className="text-muted-foreground hover:text-foreground text-xl"
                          >
                            ×
                          </button>
                        </div>
                        <div className="text-sm text-foreground space-y-2">
                          <p><strong>{t("Count", "गणना")}: {planeDetails[selectedPlane].numbers.reduce((sum, n) => sum + (result.frequency[n] || 0), 0)}</strong></p>
                          <p className="leading-relaxed">{planeDetails[selectedPlane].description}</p>
                          <p className="leading-relaxed"><strong>{t("Strong", "मजबूत")}:</strong> {planeDetails[selectedPlane].strong}</p>
                          <p className="leading-relaxed"><strong>{t("Weak", "कमजोर")}:</strong> {planeDetails[selectedPlane].weak}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Number Meanings */}
          <div className="bg-card rounded-lg shadow-lg p-6 mt-4">
            <h2 className="text-2xl font-bold mb-4 text-center text-primary">
              {t("Detailed meaning of each Lo Shu number", "प्रत्येक लो शू संख्या का विस्तृत अर्थ")}
            </h2>
            
            <div className="space-y-4 text-sm leading-relaxed">
              {[
                { num: 1, planet: t("Sun", 'सूर्य'), desc: t("Related to career and communication. The Yang number 1 shows how a person responds to and communicates with others. It is ruled by the Sun, which signifies self-confidence.", 'यह करियर और संचार से संबंधित है। यांग संख्या 1 दर्शाती है कि व्यक्ति दूसरों के साथ कैसे प्रतिक्रिया और संवाद करता है। इसका स्वामी सूर्य है जो आत्मविश्वास दर्शाता है।'), missing: t("Lack of confidence and self-esteem. Poor communication skills. Difficulty expressing ideas and opinions.", 'आत्मविश्वास और आत्मसम्मान की कमी। खराब संचार कौशल। विचारों और राय व्यक्त करने में कठिनाई।') },
                { num: 2, planet: t("Moon", 'चंद्र'), desc: t("Related to love and marriage. The Yin number 2 describes relationships and partnerships. It is ruled by the Moon, which signifies happiness, sensitivity and intuition.", 'यह प्रेम और विवाह से संबंधित है। यिन संख्या 2 संबंधों और साझेदारी का वर्णन करती है। इसका स्वामी चंद्रमा है जो खुशी, संवेदनशीलता और अंतर्ज्ञान दर्शाता है।'), missing: t("Emotional instability and mood swings. Difficulty maintaining relationships. Lack of patience and cooperation.", 'भावनात्मक अस्थिरता और मूड स्विंग। संबंध बनाए रखने में कठिनाई। धैर्य और सहयोग की कमी।') },
                { num: 3, planet: t("Jupiter", 'बृहस्पति'), desc: t("Linked to knowledge and planning. The Yang number 3 describes memory and thinking abilities. It is ruled by Jupiter, which signifies intellectual ability.", 'यह ज्ञान और योजना से जुड़ा है। यांग संख्या 3 स्मृति शक्ति और सोचने की क्षमताओं का वर्णन करती है। इसका स्वामी बृहस्पति है जो बौद्धिक क्षमता दर्शाता है।'), missing: t("Lack of creativity and imagination. Poor planning and organisational skills. Difficulty learning new things.", 'रचनात्मकता और कल्पना की कमी। खराब योजना और संगठनात्मक कौशल। नई चीजें सीखने में कठिनाई।') },
                { num: 4, planet: t("Rahu", 'राहु'), desc: t("Related to wealth, gains and prosperity. The Yin number 4 describes discipline, self-control, balance and a hardworking nature.", 'यह धन, लाभ और समृद्धि से संबंधित है। यिन संख्या 4 अनुशासन, आत्म-नियंत्रण, संतुलन और मेहनती स्वभाव का वर्णन करती है।'), missing: t("Lack of stability and grounding in life. Poor financial management. Difficulty keeping up discipline and routine.", 'जीवन में स्थिरता और आधार की कमी। खराब वित्तीय प्रबंधन। अनुशासन और दिनचर्या बनाए रखने में कठिनाई।') },
                { num: 5, planet: t("Mercury", 'बुध'), desc: t("The most important number in the Lo Shu Grid. It represents balance, health and the centre of everything. The Yang number 5 is ruled by Mercury, which signifies intelligence and business skill.", 'लो शू ग्रिड में सबसे महत्वपूर्ण संख्या। यह संतुलन, स्वास्थ्य और सब कुछ का केंद्र दर्शाती है। यांग संख्या 5 का स्वामी बुध है जो बुद्धि और व्यापार कौशल दर्शाता है।'), missing: t("This is the most significant missing number! A complete lack of balance in every area of life. Poor health and weak immunity.", 'यह सबसे महत्वपूर्ण लापता संख्या है! जीवन के सभी क्षेत्रों में संतुलन की पूर्ण कमी। खराब स्वास्थ्य और कमजोर प्रतिरक्षा।') },
                { num: 6, planet: t("Venus", 'शुक्र'), desc: t("Related to family, responsibility and luxury. The Yin number 6 is ruled by Venus, which signifies love, beauty, art and material comforts.", 'यह परिवार, जिम्मेदारी और विलासिता से संबंधित है। यिन संख्या 6 का स्वामी शुक्र है जो प्रेम, सौंदर्य, कला और भौतिक सुख दर्शाता है।'), missing: t("Lack of responsibility and accountability. Family problems and disputes. No interest in luxury or beauty.", 'जिम्मेदारी और जवाबदेही की कमी। पारिवारिक समस्याएं और विवाद। विलासिता या सौंदर्य में रुचि नहीं।') },
                { num: 7, planet: t("Ketu", 'केतु'), desc: t("Related to spirituality, intuition and inner wisdom. The Yang number 7 is ruled by Ketu, which signifies mysticism and spiritual growth.", 'यह आध्यात्मिकता, अंतर्ज्ञान और आंतरिक ज्ञान से संबंधित है। यांग संख्या 7 का स्वामी केतु है जो रहस्यवाद और आध्यात्मिक विकास दर्शाता है।'), missing: t("Lack of spiritual connection and inner peace. No interest in self-improvement or meditation. Poor analytical skills.", 'आध्यात्मिक संबंध और आंतरिक शांति की कमी। आत्म-सुधार या ध्यान में रुचि नहीं। खराब विश्लेषणात्मक कौशल।') },
                { num: 8, planet: t("Saturn", 'शनि'), desc: t("Related to discipline, hard work and material success. The Yin number 8 is ruled by Saturn, which signifies authority, perseverance and achievement through effort.", 'यह अनुशासन, कड़ी मेहनत और भौतिक सफलता से संबंधित है। यिन संख्या 8 का स्वामी शनि है जो अधिकार, दृढ़ता और प्रयास से उपलब्धि दर्शाता है।'), missing: t("Lack of discipline and structure in life. Laziness and procrastination. Difficulty achieving long-term goals.", 'जीवन में अनुशासन और संरचना की कमी। आलस्य और विलंब। दीर्घकालिक लक्ष्य प्राप्त करने में कठिनाई।') },
                { num: 9, planet: t("Mars", 'मंगल'), desc: t("Related to energy, passion and leadership. The Yang number 9 is ruled by Mars, which signifies courage, aggression and fighting spirit.", 'यह ऊर्जा, जुनून और नेतृत्व से संबंधित है। यांग संख्या 9 का स्वामी मंगल है जो साहस, आक्रामकता और लड़ाई की भावना दर्शाता है।'), missing: t("Lack of energy, enthusiasm and vitality. No fighting spirit or courage. Inactivity and an inability to take action.", 'ऊर्जा, उत्साह और जीवंतता की कमी। लड़ाई की भावना या साहस नहीं। निष्क्रियता और कार्रवाई करने में असमर्थता।') }
              ].map((item) => (
                <div key={item.num} className="border-l-4 border-primary pl-4 py-2">
                  <h3 className="font-bold text-base mb-2 text-primary">■ {t("Number", "संख्या")} {item.num} ({item.planet})</h3>
                  <p className="text-foreground">{item.desc}</p>
                  <div className="mt-2 p-2 bg-destructive/10 border-l-2 border-destructive">
                    <p className="text-destructive text-sm">
                      <strong>{t(`Missing number ${item.num}`, `लापता संख्या ${item.num}`)}:</strong> {item.missing}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Chaldean Chart */}
          <div className="bg-card rounded-lg shadow-lg p-4 mt-4">
            <h3 className="font-semibold mb-2 text-center text-primary">{t("Chaldean Numerology Chart", "कैल्डियन न्यूमेरोलॉजी चार्ट")}</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse mx-auto max-w-lg">
                <thead>
                  <tr className="bg-primary text-primary-foreground">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map(n => (
                      <th key={n} className="border border-border p-2">{n}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="text-center">
                  {[
                    ['A', 'B', 'C', 'D', 'E', 'U', 'O', 'F'],
                    ['I', 'K', 'G', 'M', 'H', 'V', 'Z', 'P'],
                    ['J', 'R', 'L', 'T', 'N', 'W', '', ''],
                    ['Q', '', 'S', '', 'X', '', '', ''],
                    ['Y', '', '', '', '', '', '', '']
                  ].map((row, i) => (
                    <tr key={i} className={i % 2 === 0 ? 'bg-muted/50' : 'bg-card'}>
                      {row.map((letter, j) => (
                        <td key={j} className={`border border-border p-2 font-semibold ${!letter ? 'bg-muted' : ''}`}>
                          {letter}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
