// Lightweight Panchang calculation (shared)
export const TITHIS_HI = ["प्रतिपदा","द्वितीया","तृतीया","चतुर्थी","पंचमी","षष्ठी","सप्तमी","अष्टमी","नवमी","दशमी","एकादशी","द्वादशी","त्रयोदशी","चतुर्दशी","पूर्णिमा","प्रतिपदा","द्वितीया","तृतीया","चतुर्थी","पंचमी","षष्ठी","सप्तमी","अष्टमी","नवमी","दशमी","एकादशी","द्वादशी","त्रयोदशी","चतुर्दशी","अमावस्या"];
export const NAKSHATRAS_HI = ["अश्विनी","भरणी","कृत्तिका","रोहिणी","मृगशिरा","आर्द्रा","पुनर्वसु","पुष्य","आश्लेषा","मघा","पूर्वा फाल्गुनी","उत्तरा फाल्गुनी","हस्त","चित्रा","स्वाति","विशाखा","अनुराधा","ज्येष्ठा","मूल","पूर्वाषाढ़ा","उत्तराषाढ़ा","श्रवण","धनिष्ठा","शतभिषा","पूर्वा भाद्रपद","उत्तरा भाद्रपद","रेवती"];
// English names, same order as the Hindi lists above/below
export const TITHIS_EN = ["Pratipada","Dwitiya","Tritiya","Chaturthi","Panchami","Shashthi","Saptami","Ashtami","Navami","Dashami","Ekadashi","Dwadashi","Trayodashi","Chaturdashi","Purnima","Pratipada","Dwitiya","Tritiya","Chaturthi","Panchami","Shashthi","Saptami","Ashtami","Navami","Dashami","Ekadashi","Dwadashi","Trayodashi","Chaturdashi","Amavasya"];
export const NAKSHATRAS_EN = ["Ashwini","Bharani","Krittika","Rohini","Mrigashira","Ardra","Punarvasu","Pushya","Ashlesha","Magha","Purva Phalguni","Uttara Phalguni","Hasta","Chitra","Swati","Vishakha","Anuradha","Jyeshtha","Mula","Purva Ashadha","Uttara Ashadha","Shravana","Dhanishtha","Shatabhisha","Purva Bhadrapada","Uttara Bhadrapada","Revati"];
export const HINDU_MASA_EN = ["Chaitra","Vaishakha","Jyeshtha","Ashadha","Shravana","Bhadrapada","Ashwina","Kartika","Margashirsha","Pausha","Magha","Phalguna"];
export const VARS_EN = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
export const PAKSHA_EN = ["Shukla Paksha","Krishna Paksha"];
export const YOGAS = ["Vishkambha","Preeti","Ayushman","Saubhagya","Shobhana","Atiganda","Sukarma","Dhriti","Shula","Ganda","Vriddhi","Dhruva","Vyaghata","Harshana","Vajra","Siddhi","Vyatipata","Variyan","Parigha","Shiva","Siddha","Sadhya","Shubha","Shukla","Brahma","Indra","Vaidhriti"];
export const HINDU_MASA_HI = ["चैत्र","वैशाख","ज्येष्ठ","आषाढ़","श्रावण","भाद्रपद","आश्विन","कार्तिक","मार्गशीर्ष","पौष","माघ","फाल्गुन"];
export const VARS_HI = ["रविवार","सोमवार","मंगलवार","बुधवार","गुरुवार","शुक्रवार","शनिवार"];
export const PAKSHA_HI = ["शुक्ल पक्ष","कृष्ण पक्ष"];

export function julianDay(y: number, m: number, d: number) {
  const a = Math.floor((14 - m) / 12), yr = y + 4800 - a, mn = m + 12 * a - 3;
  let j = d + Math.floor((153 * mn + 2) / 5) + 365 * yr + Math.floor(yr / 4);
  if (y > 1582 || (y === 1582 && m > 10) || (y === 1582 && m === 10 && d >= 15)) j += -Math.floor(yr / 100) + Math.floor(yr / 400) - 32045;
  else j -= 32083;
  return j;
}

export function getPanchang(year: number, month: number, day: number) {
  const jd = julianDay(year, month, day);
  const dow = (jd + 1) % 7;
  const syn = 29.53058867;
  const la = ((jd - 2451550.1) % syn + syn) % syn;
  const tNum = Math.floor(la / syn * 30) % 30;
  const paksha = tNum < 15 ? 0 : 1;
  const nPer = 27.32166;
  const na = ((jd - 2451549.5) % nPer + nPer) % nPer;
  const nNum = Math.floor(na / nPer * 27);
  const yNum = Math.floor((jd - 2451545.0) % 27 + 27) % 27;
  const masaNum = (((Math.floor((jd - 2451548.5) / 29.53) % 12) + 12) % 12);
  const samvat = year + 57 + (month >= 4 ? 0 : -1);

  return {
    var: VARS_EN[dow], varHi: VARS_HI[dow],
    tithi: TITHIS_EN[tNum], tithiHi: TITHIS_HI[tNum],
    paksha: PAKSHA_EN[paksha], pakshaHi: PAKSHA_HI[paksha],
    nakshatra: NAKSHATRAS_EN[nNum], nakshatraHi: NAKSHATRAS_HI[nNum],
    yoga: YOGAS[yNum],
    masa: HINDU_MASA_EN[masaNum], masaHi: HINDU_MASA_HI[masaNum],
    samvat,
  };
}
