// Ashtakoot Guna Milan — Moon sidereal longitude (Meeus low-precision) + Lahiri ayanamsa

const D2R = Math.PI / 180;
const norm360 = (x: number) => ((x % 360) + 360) % 360;

function julianDay(y: number, m: number, d: number, hourDecimal: number) {
  if (m <= 2) { y -= 1; m += 12; }
  const A = Math.floor(y / 100);
  const B = 2 - A + Math.floor(A / 4);
  return Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (m + 1)) + d + hourDecimal / 24 + B - 1524.5;
}

function moonSiderealLongitude(dob: string, tob?: string) {
  const [y, m, d] = dob.split("-").map(Number);
  let hh = 12, mm = 0;
  if (tob) { [hh, mm] = tob.split(":").map(Number); }
  const JD = julianDay(y, m, d, hh + mm / 60 - 5.5);
  const T = (JD - 2451545.0) / 36525;

  const Lp = norm360(218.3164477 + 481267.88123421 * T - 0.0015786 * T * T + T ** 3 / 538841 - T ** 4 / 65194000);
  const Dd = norm360(297.8501921 + 445267.1114034 * T - 0.0018819 * T * T + T ** 3 / 545868 - T ** 4 / 113065000);
  const M = norm360(357.5291092 + 35999.0502909 * T - 0.0001536 * T * T + T ** 3 / 24490000);
  const Mp = norm360(134.9633964 + 477198.8675055 * T + 0.0087414 * T * T + T ** 3 / 69699 - T ** 4 / 14712000);
  const F = norm360(93.272095 + 483202.0175233 * T - 0.0036539 * T * T - T ** 3 / 3526000 + T ** 4 / 863310000);

  const s = (deg: number) => Math.sin(deg * D2R);
  const dL =
    6.288774 * s(Mp) + 1.274027 * s(2 * Dd - Mp) + 0.658314 * s(2 * Dd) + 0.213618 * s(2 * Mp)
    - 0.185116 * s(M) - 0.114332 * s(2 * F) + 0.058793 * s(2 * Dd - 2 * Mp) + 0.057066 * s(2 * Dd - M - Mp)
    + 0.053322 * s(2 * Dd + Mp) + 0.045758 * s(2 * Dd - M) - 0.040923 * s(M - Mp) - 0.03472 * s(Dd)
    - 0.030383 * s(M + Mp) + 0.015327 * s(2 * Dd - 2 * F) - 0.012528 * s(Mp + 2 * F) + 0.01098 * s(Mp - 2 * F)
    + 0.010675 * s(4 * Dd - Mp) + 0.010034 * s(3 * Mp) + 0.008548 * s(4 * Dd - 2 * Mp) - 0.007888 * s(2 * Dd + M - Mp);

  const ayanamsa = 23.853 + 0.013969 * (T * 100);
  return norm360(norm360(Lp + dL) - ayanamsa);
}

const NAK_SPAN = 360 / 27;
const PADA_SPAN = NAK_SPAN / 4;

const NAKSHATRAS = [
  { name: "Ashwini", gana: "Deva", yoni: "Horse", nadi: "Aadi" },
  { name: "Bharani", gana: "Manushya", yoni: "Elephant", nadi: "Madhya" },
  { name: "Krittika", gana: "Rakshasa", yoni: "Sheep", nadi: "Antya" },
  { name: "Rohini", gana: "Manushya", yoni: "Serpent", nadi: "Antya" },
  { name: "Mrigashira", gana: "Deva", yoni: "Serpent", nadi: "Madhya" },
  { name: "Ardra", gana: "Manushya", yoni: "Dog", nadi: "Aadi" },
  { name: "Punarvasu", gana: "Deva", yoni: "Cat", nadi: "Aadi" },
  { name: "Pushya", gana: "Deva", yoni: "Sheep", nadi: "Madhya" },
  { name: "Ashlesha", gana: "Rakshasa", yoni: "Cat", nadi: "Antya" },
  { name: "Magha", gana: "Rakshasa", yoni: "Rat", nadi: "Antya" },
  { name: "Purva Phalguni", gana: "Manushya", yoni: "Rat", nadi: "Madhya" },
  { name: "Uttara Phalguni", gana: "Manushya", yoni: "Cow", nadi: "Aadi" },
  { name: "Hasta", gana: "Deva", yoni: "Buffalo", nadi: "Aadi" },
  { name: "Chitra", gana: "Rakshasa", yoni: "Tiger", nadi: "Madhya" },
  { name: "Swati", gana: "Deva", yoni: "Buffalo", nadi: "Antya" },
  { name: "Vishakha", gana: "Rakshasa", yoni: "Tiger", nadi: "Antya" },
  { name: "Anuradha", gana: "Deva", yoni: "Deer", nadi: "Madhya" },
  { name: "Jyeshtha", gana: "Rakshasa", yoni: "Deer", nadi: "Aadi" },
  { name: "Mula", gana: "Rakshasa", yoni: "Dog", nadi: "Aadi" },
  { name: "Purva Ashadha", gana: "Manushya", yoni: "Monkey", nadi: "Madhya" },
  { name: "Uttara Ashadha", gana: "Manushya", yoni: "Mongoose", nadi: "Antya" },
  { name: "Shravana", gana: "Deva", yoni: "Monkey", nadi: "Antya" },
  { name: "Dhanishta", gana: "Rakshasa", yoni: "Lion", nadi: "Madhya" },
  { name: "Shatabhisha", gana: "Rakshasa", yoni: "Horse", nadi: "Aadi" },
  { name: "Purva Bhadrapada", gana: "Manushya", yoni: "Lion", nadi: "Aadi" },
  { name: "Uttara Bhadrapada", gana: "Manushya", yoni: "Cow", nadi: "Madhya" },
  { name: "Revati", gana: "Deva", yoni: "Elephant", nadi: "Antya" },
];

const RASHIS = ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"];
const RASHIS_HI = ["मेष", "वृषभ", "मिथुन", "कर्क", "सिंह", "कन्या", "तुला", "वृश्चिक", "धनु", "मकर", "कुम्भ", "मीन"];
const RASHI_LORD = ["Mars", "Venus", "Mercury", "Moon", "Sun", "Mercury", "Venus", "Mars", "Jupiter", "Saturn", "Saturn", "Jupiter"];
const RASHI_VARNA = ["Kshatriya", "Vaishya", "Shudra", "Brahmin", "Kshatriya", "Vaishya", "Shudra", "Brahmin", "Kshatriya", "Vaishya", "Shudra", "Brahmin"];
const VARNA_RANK: Record<string, number> = { Shudra: 1, Vaishya: 2, Kshatriya: 3, Brahmin: 4 };
const RASHI_VASHYA_GROUP = ["Chatushpada", "Chatushpada", "Manav", "Jalachar", "Vanachar", "Manav", "Manav", "Keeta", "Chatushpada", "Chatushpada", "Manav", "Jalachar"];

const FRIENDSHIP: Record<string, { friend: string[]; enemy: string[] }> = {
  Sun: { friend: ["Moon", "Mars", "Jupiter"], enemy: ["Venus", "Saturn"] },
  Moon: { friend: ["Sun", "Mercury"], enemy: [] },
  Mars: { friend: ["Sun", "Moon", "Jupiter"], enemy: ["Mercury"] },
  Mercury: { friend: ["Sun", "Venus"], enemy: ["Moon"] },
  Jupiter: { friend: ["Sun", "Moon", "Mars"], enemy: ["Mercury", "Venus"] },
  Venus: { friend: ["Mercury", "Saturn"], enemy: ["Sun", "Moon"] },
  Saturn: { friend: ["Mercury", "Venus"], enemy: ["Sun", "Moon", "Mars"] },
};
const relationScore = (a: string, b: string) =>
  a === b || FRIENDSHIP[a].friend.includes(b) ? 2 : FRIENDSHIP[a].enemy.includes(b) ? 0 : 1;

const YONI_ENEMIES = [["Cow", "Tiger"], ["Horse", "Buffalo"], ["Elephant", "Lion"], ["Dog", "Deer"], ["Serpent", "Mongoose"], ["Rat", "Cat"]];
const isYoniEnemy = (a: string, b: string) => YONI_ENEMIES.some((p) => (p[0] === a && p[1] === b) || (p[0] === b && p[1] === a));

const VASHYA_MATRIX: Record<string, number> = {
  "Chatushpada-Chatushpada": 2, "Chatushpada-Manav": 1, "Chatushpada-Jalachar": 1, "Chatushpada-Vanachar": 0, "Chatushpada-Keeta": 1,
  "Manav-Manav": 2, "Manav-Jalachar": 1, "Manav-Vanachar": 0, "Manav-Keeta": 1,
  "Jalachar-Jalachar": 2, "Jalachar-Vanachar": 0, "Jalachar-Keeta": 1,
  "Vanachar-Vanachar": 2, "Vanachar-Keeta": 0, "Keeta-Keeta": 2,
};
const vashyaScore = (g1: string, g2: string) => VASHYA_MATRIX[`${g1}-${g2}`] ?? VASHYA_MATRIX[`${g2}-${g1}`] ?? 1;

export type Chart = ReturnType<typeof getChart>;

export function getChart(dob: string, tob?: string) {
  const lon = moonSiderealLongitude(dob, tob);
  const nakIndex = Math.floor(lon / NAK_SPAN);
  const rashiIndex = Math.floor(lon / 30);
  return {
    lon,
    nakIndex,
    pada: Math.floor((lon % NAK_SPAN) / PADA_SPAN) + 1,
    rashiIndex,
    nak: NAKSHATRAS[nakIndex],
    rashi: RASHIS[rashiIndex],
    rashiHi: RASHIS_HI[rashiIndex],
    rashiLord: RASHI_LORD[rashiIndex],
  };
}

export type Person = { name: string; gender: string; dob: string; tob?: string; pob: string };

export function computeMatch(you: Person, partner: Person) {
  const cy = getChart(you.dob, you.tob);
  const cp = getChart(partner.dob, partner.tob);
  const rows: { name: string; nameHi: string; max: number; pts: number; desc: string; descEn: string }[] = [];

  const varnaY = RASHI_VARNA[cy.rashiIndex], varnaP = RASHI_VARNA[cp.rashiIndex];
  rows.push({ name: "Varna", nameHi: "वर्ण", max: 1, pts: VARNA_RANK[varnaY] >= VARNA_RANK[varnaP] ? 1 : 0, desc: `आध्यात्मिक अनुकूलता · ${varnaY} & ${varnaP}`, descEn: `Spiritual compatibility · ${varnaY} & ${varnaP}` });

  rows.push({ name: "Vashya", nameHi: "वश्य", max: 2, pts: vashyaScore(RASHI_VASHYA_GROUP[cy.rashiIndex], RASHI_VASHYA_GROUP[cp.rashiIndex]), desc: "आपसी आकर्षण और प्रभाव", descEn: "Mutual attraction and influence" });

  const taraScore = (fromIdx: number, toIdx: number) => {
    const count = ((toIdx - fromIdx + 27) % 27) + 1;
    return [2, 4, 6, 8, 9].includes(((count - 1) % 9) + 1) ? 1.5 : 0;
  };
  rows.push({ name: "Tara", nameHi: "तारा", max: 3, pts: taraScore(cy.nakIndex, cp.nakIndex) + taraScore(cp.nakIndex, cy.nakIndex), desc: "स्वास्थ्य एवं कुशलता", descEn: "Health and well-being" });

  const yoniPts = cy.nak.yoni === cp.nak.yoni ? 4 : isYoniEnemy(cy.nak.yoni, cp.nak.yoni) ? 0 : 2;
  rows.push({ name: "Yoni", nameHi: "योनि", max: 4, pts: yoniPts, desc: `शारीरिक अनुकूलता · ${cy.nak.yoni} & ${cp.nak.yoni}`, descEn: `Physical compatibility · ${cy.nak.yoni} & ${cp.nak.yoni}` });

  const maitriPts = Math.round(((relationScore(cy.rashiLord, cp.rashiLord) + relationScore(cp.rashiLord, cy.rashiLord)) / 4) * 5);
  rows.push({ name: "Graha Maitri", nameHi: "ग्रह मैत्री", max: 5, pts: maitriPts, desc: `मानसिक अनुकूलता · ${cy.rashiLord} & ${cp.rashiLord}`, descEn: `Mental compatibility · ${cy.rashiLord} & ${cp.rashiLord}` });

  const ganaPts = cy.nak.gana === cp.nak.gana ? 6 : [cy.nak.gana, cp.nak.gana].sort().join("-") === "Deva-Manushya" ? 5 : 0;
  rows.push({ name: "Gana", nameHi: "गण", max: 6, pts: ganaPts, desc: `स्वभाव · ${cy.nak.gana} & ${cp.nak.gana}`, descEn: `Temperament · ${cy.nak.gana} & ${cp.nak.gana}` });

  const d1 = ((cp.rashiIndex - cy.rashiIndex + 12) % 12) + 1;
  const d2 = ((cy.rashiIndex - cp.rashiIndex + 12) % 12) + 1;
  rows.push({ name: "Bhakoot", nameHi: "भकूट", max: 7, pts: [2, 6, 8, 12].includes(d1) || [2, 6, 8, 12].includes(d2) ? 0 : 7, desc: "प्रेम, परिवार एवं समृद्धि", descEn: "Love, family and prosperity" });

  rows.push({ name: "Nadi", nameHi: "नाड़ी", max: 8, pts: cy.nak.nadi === cp.nak.nadi ? 0 : 8, desc: `वंश अनुकूलता · ${cy.nak.nadi} & ${cp.nak.nadi}`, descEn: `Progeny and genetic compatibility · ${cy.nak.nadi} & ${cp.nak.nadi}` });

  const total = rows.reduce((s, r) => s + r.pts, 0);
  return { rows, total, chartYou: cy, chartPartner: cp };
}

export function verdictFor(total: number) {
  if (total >= 28) return { label: "उत्तम मिलान", sub: "अधिकांश कूटों में मजबूत अनुकूलता दिख रही है।", labelEn: "Excellent match", subEn: "Strong compatibility across most kootas.", tone: "good" as const };
  if (total >= 20) return { label: "अच्छा मिलान", sub: "सामान्यतः शुभ मिलान, कुछ बिंदुओं पर चर्चा उपयुक्त रहेगी।", labelEn: "Good match", subEn: "Generally auspicious; a few points are worth discussing.", tone: "good" as const };
  if (total >= 14) return { label: "औसत मिलान", sub: "अनुकूल है, कमजोर पक्षों के लिए ज्योतिषी से परामर्श लें।", labelEn: "Average match", subEn: "Compatible — consult an astrologer about the weaker areas.", tone: "avg" as const };
  return { label: "विचार आवश्यक", sub: "अनुकूलता कम है — विस्तृत परामर्श की सलाह दी जाती है।", labelEn: "Needs careful thought", subEn: "Compatibility is low — a detailed consultation is recommended.", tone: "bad" as const };
}
