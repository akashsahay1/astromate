import { useEffect, useMemo, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useT } from "@/hooks/useLang";

// ===== DATA =====
const TITHIS = ["Pratipada","Dwitiya","Tritiya","Chaturthi","Panchami","Shashthi","Saptami","Ashtami","Navami","Dashami","Ekadashi","Dwadashi","Trayodashi","Chaturdashi","Purnima","Pratipada","Dwitiya","Tritiya","Chaturthi","Panchami","Shashthi","Saptami","Ashtami","Navami","Dashami","Ekadashi","Dwadashi","Trayodashi","Chaturdashi","Amavasya"];
const TITHIS_HI = ["प्रतिपदा","द्वितीया","तृतीया","चतुर्थी","पंचमी","षष्ठी","सप्तमी","अष्टमी","नवमी","दशमी","एकादशी","द्वादशी","त्रयोदशी","चतुर्दशी","पूर्णिमा","प्रतिपदा","द्वितीया","तृतीया","चतुर्थी","पंचमी","षष्ठी","सप्तमी","अष्टमी","नवमी","दशमी","एकादशी","द्वादशी","त्रयोदशी","चतुर्दशी","अमावस्या"];
const NAKSHATRAS = ["Ashwini","Bharani","Krittika","Rohini","Mrigashira","Ardra","Punarvasu","Pushya","Ashlesha","Magha","Purva Phalguni","Uttara Phalguni","Hasta","Chitra","Swati","Vishakha","Anuradha","Jyeshtha","Mula","Purva Ashadha","Uttara Ashadha","Shravana","Dhanishtha","Shatabhisha","Purva Bhadrapada","Uttara Bhadrapada","Revati"];
const RASHIS = ["Mesha","Vrishabha","Mithuna","Karka","Simha","Kanya","Tula","Vrishchika","Dhanu","Makara","Kumbha","Meena"];
const YOGAS = ["Vishkambha","Preeti","Ayushman","Saubhagya","Shobhana","Atiganda","Sukarma","Dhriti","Shula","Ganda","Vriddhi","Dhruva","Vyaghata","Harshana","Vajra","Siddhi","Vyatipata","Variyan","Parigha","Shiva","Siddha","Sadhya","Shubha","Shukla","Brahma","Indra","Vaidhriti"];
const KARANAS = ["Bava","Balava","Kaulava","Taitila","Gara","Vanija","Vishti","Shakuni","Chatushpada","Naga","Kinstughna"];
const HINDU_MASA = ["Chaitra","Vaishakha","Jyeshtha","Ashadha","Shravana","Bhadrapada","Ashwina","Kartika","Margashirsha","Pausha","Magha","Phalguna"];
const HINDU_MASA_HI = ["चैत्र","वैशाख","ज्येष्ठ","आषाढ़","श्रावण","भाद्रपद","आश्विन","कार्तिक","मार्गशीर्ष","पौष","माघ","फाल्गुन"];
const VARS = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
const VARS_HI = ["रविवार","सोमवार","मंगलवार","बुधवार","गुरुवार","शुक्रवार","शनिवार"];
const VARS_SHORT = [["SUN","रवि"],["MON","सोम"],["TUE","मंगल"],["WED","बुध"],["THU","गुरु"],["FRI","शुक्र"],["SAT","शनि"]];
const MONTHS_EN = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const PAKSHA = ["Shukla","Krishna"];
const PAKSHA_HI = ["शुक्ल पक्ष","कृष्ण पक्ष"];
const MOON_PHASES = ["🌑","🌒","🌓","🌔","🌕","🌖","🌗","🌘"];

const FIXED_FESTS: Record<string, string> = {
  "1-1":"New Year's Day","1-14":"Makar Sankranti","1-15":"Pongal",
  "1-26":"Republic Day","2-14":"Valentine's Day",
  "3-25":"Holi (approx)","4-14":"Baisakhi",
  "5-1":"Labour Day","6-21":"Yoga Day",
  "8-15":"Independence Day","10-2":"Gandhi Jayanti",
  "10-24":"Dussehra (approx)","10-31":"Diwali (approx)",
  "11-14":"Children's Day","12-25":"Christmas",
};

function julianDay(y: number, m: number, d: number) {
  const a = Math.floor((14 - m) / 12), yr = y + 4800 - a, mn = m + 12 * a - 3;
  let j = d + Math.floor((153 * mn + 2) / 5) + 365 * yr + Math.floor(yr / 4);
  if (y > 1582 || (y === 1582 && m > 10) || (y === 1582 && m === 10 && d >= 15)) j += -Math.floor(yr / 100) + Math.floor(yr / 400) - 32045;
  else j -= 32083;
  return j;
}

function getPanchang(year: number, month: number, day: number) {
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
  const kNum = Math.floor(la / syn * 60) % 11;
  const masaNum = (((Math.floor((jd - 2451548.5) / 29.53) % 12) + 12) % 12);
  const samvat = year + 57 + (month >= 4 ? 0 : -1);
  const moonPhase = MOON_PHASES[Math.floor(la / syn * 8) % 8];
  const rashiNum = Math.floor((jd - 2451549.5) / 27.32166 * 12) % 12;
  const rashiDeg = Math.floor(((jd - 2451549.5) / 27.32166 * 360) % 30);
  const nDeg = Math.floor((na / nPer * 27 - nNum) * 60);

  const dayOfYear = Math.floor(jd - julianDay(year, 1, 1));
  const B = 2 * Math.PI * (dayOfYear - 81) / 364;
  const ET = 9.87 * Math.sin(2 * B) - 7.53 * Math.cos(B) - 1.5 * Math.sin(B);
  const decl = 23.45 * Math.sin(2 * Math.PI * (284 + dayOfYear) / 365) * Math.PI / 180;
  const lat = 28.6 * Math.PI / 180;
  const HA = Math.acos(-Math.tan(lat) * Math.tan(decl)) * 180 / Math.PI;
  const srMin = Math.round(720 - 4 * (77.2 + HA) - ET);
  const ssMin = Math.round(720 - 4 * (77.2 - HA) - ET);
  const fmt = (m: number) => { const h = Math.floor(m / 60) % 24, mn = ((m % 60) + 60) % 60; return `${String(h).padStart(2, "0")}:${String(mn).padStart(2, "0")}`; };

  const rahuKaal = ["12:00","07:30","15:00","12:00","13:30","10:30","09:00"];
  const rahuEnd = ["13:30","09:00","16:30","13:30","15:00","12:00","10:30"];

  const fests: string[] = [];
  const fk = `${month}-${day}`;
  if (FIXED_FESTS[fk]) fests.push(FIXED_FESTS[fk]);
  if (tNum === 14 && masaNum === 0) fests.push("Holika Dahan");
  if (tNum === 15 && masaNum === 0) fests.push("Holi");
  if (tNum === 0 && masaNum === 0) fests.push("Gudi Padwa / Ugadi");
  if (tNum === 8 && masaNum === 4) fests.push("Janmashtami");
  if (tNum === 4 && masaNum === 3) fests.push("Akshaya Tritiya");
  if (tNum === 13 && masaNum === 6) fests.push("Dussehra");
  if (tNum === 13 && masaNum === 7) fests.push("Diwali");
  if (tNum === 10 && masaNum === 7) fests.push("Dhanteras");
  if (tNum === 14 && masaNum === 7) fests.push("Govardhan Puja");
  if (tNum === 2 && masaNum === 7) fests.push("Bhai Dooj");
  if (tNum === 14 && masaNum === 10) fests.push("Maha Shivaratri");
  if (tNum === 8 && masaNum === 0) fests.push("Ram Navami");
  if (tNum === 0 && masaNum === 6) fests.push("Navratri Begin");
  if (tNum === 10 && masaNum === 6) fests.push("Navratri 2nd");
  if (tNum === 4 && masaNum === 4) fests.push("Hariyali Teej");
  if (tNum === 3 && masaNum === 7) fests.push("Karwa Chauth");
  if (tNum === 10 && masaNum === 7) fests.push("Chhath Puja");
  if (tNum === 14 && masaNum === 11) fests.push("Holi (Purnima)");
  if (dow === 0 && tNum >= 14) fests.push("Soma Pradosh Vrat");
  if (tNum === 12) fests.push("Pradosh Vrat");
  if (tNum === 10 && (dow === 1 || dow === 3)) fests.push("Ekadashi Vrat");
  if (tNum === 3) fests.push("Vinayaka Chaturthi");

  return {
    dow, var: VARS[dow], varHi: VARS_HI[dow],
    tithi: TITHIS[tNum], tithiHi: TITHIS_HI[tNum], tNum,
    paksha: PAKSHA[paksha], pakshaHi: PAKSHA_HI[paksha],
    nakshatra: NAKSHATRAS[nNum], nDeg, nNum,
    yoga: YOGAS[yNum], karana: KARANAS[kNum],
    masa: HINDU_MASA[masaNum], masaHi: HINDU_MASA_HI[masaNum], masaNum,
    samvat, moonPhase,
    rashi: RASHIS[rashiNum % 12], rashiDeg,
    sunrise: fmt(srMin), sunset: fmt(ssMin),
    rahuKaal: `${rahuKaal[dow]}–${rahuEnd[dow]}`,
    abhijit: "11:48–12:36",
    fests, jd,
    lunarAge: Math.round(la * 10) / 10,
  };
}

const Panchang = () => {
  const t = useT();
  const today = new Date();
  const [curY, setCurY] = useState(today.getFullYear());
  const [curM, setCurM] = useState(today.getMonth());
  const [selKey, setSelKey] = useState<string | null>(`${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`);
  const [gotoStr, setGotoStr] = useState("");

  const prevMonth = () => {
    let m = curM - 1, y = curY;
    if (m < 0) { m = 11; y--; }
    if (y < 2020) return;
    setCurM(m); setCurY(y);
  };
  const nextMonth = () => {
    let m = curM + 1, y = curY;
    if (m > 11) { m = 0; y++; }
    if (y > 2099) return;
    setCurM(m); setCurY(y);
  };
  const goToday = () => {
    setCurY(today.getFullYear()); setCurM(today.getMonth());
    setSelKey(`${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`);
  };
  const gotoDateFn = () => {
    const pts = gotoStr.split("/");
    if (pts.length < 3) return;
    const d = +pts[0], m = +pts[1] - 1, y = +pts[2];
    if (y < 2020 || y > 2099 || isNaN(d) || isNaN(m) || isNaN(y)) return;
    setCurY(y); setCurM(m); setSelKey(`${y}-${m}-${d}`);
  };

  const firstDay = new Date(curY, curM, 1).getDay();
  const dim = new Date(curY, curM + 1, 0).getDate();
  const todayKey = `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`;

  const p1 = getPanchang(curY, curM + 1, 1);
  const p15 = getPanchang(curY, curM + 1, Math.min(15, dim));
  const hd = (curY === today.getFullYear() && curM === today.getMonth()) ? today.getDate() : 1;
  const hp = getPanchang(curY, curM + 1, hd);

  // build week rows
  const rows = useMemo(() => {
    const cells: (number | null)[] = [];
    for (let i = 0; i < firstDay; i++) cells.push(null);
    for (let d = 1; d <= dim; d++) cells.push(d);
    while (cells.length % 7 !== 0) cells.push(null);
    const out: (number | null)[][] = [];
    for (let i = 0; i < cells.length; i += 7) out.push(cells.slice(i, i + 7));
    return out;
  }, [firstDay, dim]);

  const sel = selKey ? selKey.split("-").map(Number) : null;
  const selDetail = sel && sel[0] === curY && sel[1] === curM ? getPanchang(curY, curM + 1, sel[2]) : null;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="panchang-app" style={{ background: "#efeefb", fontFamily: "'Segoe UI',Arial,sans-serif", fontSize: 12, color: "#312e81" }}>
        {/* TOP NAV */}
        <div style={{ background: "#312e81", color: "#fff", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "6px 12px" }}>
          <span onClick={prevMonth} style={{ fontSize: 20, cursor: "pointer", padding: "0 10px", userSelect: "none" }}>‹</span>
          <div style={{ textAlign: "center", lineHeight: 1.3 }}>
            <div style={{ fontSize: 18, fontWeight: 700 }}>{MONTHS_EN[curM]} {curY}</div>
            <div style={{ fontSize: 12, opacity: 0.85 }}>{p1.masa} – {p15.masa} {p1.samvat}</div>
          </div>
          <span onClick={nextMonth} style={{ fontSize: 20, cursor: "pointer", padding: "0 10px", userSelect: "none" }}>›</span>
        </div>

        {/* SELECTORS */}
        <div style={{ display: "flex", gap: 8, alignItems: "center", background: "#c8a040", padding: "4px 10px", flexWrap: "wrap" }}>
          <label style={{ fontSize: 12, color: "#312e81", fontWeight: 600 }}>{t("Year:", "वर्ष:")}</label>
          <select value={curY} onChange={(e) => setCurY(+e.target.value)} style={{ background: "#312e81", color: "#fff", border: "none", borderRadius: 4, padding: "5px 8px", fontSize: 13, cursor: "pointer" }}>
            {Array.from({ length: 80 }, (_, i) => 2020 + i).map((y) => <option key={y} value={y}>{y}</option>)}
          </select>
          <label style={{ fontSize: 12, color: "#312e81", fontWeight: 600 }}>{t("Month:", "माह:")}</label>
          <select value={curM} onChange={(e) => setCurM(+e.target.value)} style={{ background: "#312e81", color: "#fff", border: "none", borderRadius: 4, padding: "5px 8px", fontSize: 13, cursor: "pointer" }}>
            {MONTHS_EN.map((m, i) => <option key={m} value={i}>{m}</option>)}
          </select>
          <button onClick={goToday} style={ctrlBtn}>{t("Today", "आज")}</button>
        </div>

        {/* CONTROLS */}
        <div style={{ background: "#c8a040", padding: "6px 10px", display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
          <div style={{ background: "#fff", border: "1px solid #999", borderRadius: 4, padding: "4px 8px", fontSize: 13, display: "flex", alignItems: "center", gap: 5, color: "#333", minWidth: 160 }}>📍 New Delhi, India</div>
          <div style={{ background: "#fff", border: "1px solid #999", borderRadius: 4, padding: "4px 8px", fontSize: 13, color: "#333", display: "flex", alignItems: "center", gap: 5 }}>
            📅 <input type="text" value={gotoStr} onChange={(e) => setGotoStr(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") gotoDateFn(); }} placeholder="DD/MM/YYYY" style={{ border: "none", outline: "none", fontSize: 13, background: "transparent", width: 100 }} />
          </div>
          <button onClick={gotoDateFn} style={ctrlBtn}>{t("Go", "जाएं")}</button>
        </div>

        {/* PANCHANG HEADER */}
        <div style={{ background: "#8b6914", color: "#fff", padding: "8px 12px", display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 8 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ fontSize: 32 }}>{hp.moonPhase}</div>
            <div>
              <div style={{ fontSize: 16, fontWeight: 700, color: "#ffe080" }}>{hp.masaNum + 1}, {hp.masa}</div>
              <div style={{ fontSize: 12, color: "#ffe0a0" }}>{t(`${hp.paksha} Paksha, ${hp.tithi}`, `${hp.pakshaHi}, ${hp.tithiHi}`)}</div>
              <div style={{ fontSize: 11, color: "#ffd080" }}>{hp.samvat} Vikrama Samvata</div>
              <div style={{ fontSize: 11, color: "#ffd080" }}>New Delhi, India</div>
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 22, fontWeight: 700, color: "#ffe080" }}>{hd}</div>
            <div style={{ fontSize: 14, color: "#ffe0a0" }}>{MONTHS_EN[curM]} {curY}</div>
            <div style={{ fontSize: 12, color: "#ffd080" }}>{hp.var}</div>
          </div>
        </div>

        {/* CALENDAR TABLE */}
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 700 }}>
            <thead>
              <tr>
                {VARS_SHORT.map(([en, hi], i) => (
                  <th key={en} style={{ background: "#312e81", color: "#fff", textAlign: "center", padding: "5px 3px", fontWeight: 600, border: "1px solid #252270", width: "14.28%" }}>
                    <span style={{ fontSize: 10, opacity: 0.8 }}>{en}</span><br /><span style={{ fontSize: 13 }}>{t(VARS[i], hi)}</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((week, ri) => (
                <tr key={ri}>
                  {week.map((d, ci) => {
                    if (!d) return <td key={ci} style={{ border: "1px solid #c8a040", background: "#e7e6f3", width: "14.28%" }} />;
                    const p = getPanchang(curY, curM + 1, d);
                    const key = `${curY}-${curM}-${d}`;
                    const isToday = key === todayKey, isSel = selKey === key, isSun = p.dow === 0;
                    const tdStyle: React.CSSProperties = {
                      border: isToday ? "2px solid #312e81" : isSel ? "2px solid #4f46e5" : "1px solid #c8a040",
                      verticalAlign: "top", padding: 0, width: "14.28%",
                      background: isSel ? "#efeefb" : isToday ? "#faf9ff" : "#f7f6fd",
                    };
                    return (
                      <td key={ci} style={tdStyle}>
                        <div style={{ padding: "3px 4px", minHeight: 100 }} onClick={() => setSelKey(key)}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 2 }}>
                            <span style={{ fontSize: 18, fontWeight: 700, color: isSun ? "#4f46e5" : "#312e81", cursor: "pointer", lineHeight: 1 }}>{d}</span>
                            <span style={{ fontSize: 11, color: "#666", fontWeight: 600, lineHeight: 1, marginTop: 3 }}>{p.tNum < 15 ? p.tNum + 1 : p.tNum - 14}</span>
                          </div>
                          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 9, color: "#4338ca", marginBottom: 2 }}>
                            <span>☀ {p.sunrise}</span><span>{p.sunset} ☀</span>
                          </div>
                          <div style={{ fontSize: 9, color: "#4338ca", fontWeight: 600, marginBottom: 1 }}>{p.paksha} {p.tithi}</div>
                          {p.fests.length > 0 && (
                            <div style={{ fontSize: 9, color: "#312e81", fontWeight: 700, marginBottom: 1, lineHeight: 1.3 }}>
                              {p.fests.slice(0, 2).map((f, i) => <div key={i}>{f}</div>)}
                            </div>
                          )}
                          <div style={{ fontSize: 9, color: "#444", marginTop: 1 }}>{p.moonPhase} {p.rashi}</div>
                          <div style={{ fontSize: 9, color: "#555", marginTop: 1 }}>☆ {p.nakshatra} {p.nDeg}:{String(Math.floor(p.nDeg * 0.8) % 60).padStart(2, "0")}+</div>
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* DETAIL PANEL */}
        {selDetail && sel && (
          <div style={{ background: "#f7f6fd", borderTop: "3px solid #312e81" }}>
            <div style={{ background: "#312e81", color: "#fff", padding: "8px 12px", fontSize: 14, fontWeight: 700, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span>{sel[2]} {MONTHS_EN[curM]} {curY} — {t(selDetail.var, selDetail.varHi)} — {t("Detailed Panchang", "विस्तृत पंचांग")}</span>
              <span onClick={() => setSelKey(null)} style={{ cursor: "pointer", fontSize: 18, padding: "0 4px" }}>✕</span>
            </div>
            <div style={{ padding: "10px 12px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(150px,1fr))", gap: 8, marginBottom: 10 }}>
                {([
                  [t("Day (Vaar)", "वार (Var)"), t(selDetail.var, `${selDetail.var} / ${selDetail.varHi}`)],
                  [t("Tithi", "तिथि (Tithi)"), t(`${selDetail.paksha} Paksha ${selDetail.tithi}`, `${selDetail.pakshaHi} ${selDetail.tithiHi} (${selDetail.tithi})`)],
                  [t("Nakshatra", "नक्षत्र (Nakshatra)"), selDetail.nakshatra],
                  [t("Moon Sign (Rashi)", "राशि (Rashi)"), `${selDetail.rashi} ${selDetail.rashiDeg}°`],
                  [t("Yoga", "योग (Yoga)"), selDetail.yoga],
                  [t("Karana", "करण (Karana)"), selDetail.karana],
                  [t("Hindu Month", "हिंदी मास"), t(selDetail.masa, `${selDetail.masaHi} (${selDetail.masa})`)],
                  [t("Vikram Samvat", "विक्रम संवत"), `${selDetail.samvat}`],
                  [t("Sunrise", "सूर्योदय"), selDetail.sunrise],
                  [t("Sunset", "सूर्यास्त"), selDetail.sunset],
                  [t("Moon Age", "चंद्र आयु"), `${selDetail.lunarAge} days`],
                  [t("Moon Phase", "चंद्र चिह्न"), selDetail.moonPhase],
                ] as [string, string][]).map(([l, v]) => (
                  <div key={l} style={{ background: "#312e81", color: "#fff", borderRadius: 6, padding: "8px 10px" }}>
                    <div style={{ fontSize: 10, opacity: 0.8, marginBottom: 3, textTransform: "uppercase" }}>{l}</div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "#ffe080" }}>{v}</div>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 8 }}>
                {selDetail.fests.length > 0 ? (
                  <>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "#312e81", marginBottom: 5 }}>🎉 {t("Festivals / Special Days", "त्यौहार / विशेष दिन")}</div>
                    {selDetail.fests.map((f, i) => (
                      <div key={i} style={{ padding: "5px 8px", borderLeft: "3px solid #312e81", marginBottom: 4, background: "#efeefb", fontSize: 12, color: "#312e81" }}>{f}</div>
                    ))}
                  </>
                ) : (
                  <div style={{ fontSize: 12, color: "#888", fontStyle: "italic" }}>{t("No special festivals.", "कोई विशेष त्यौहार नहीं।")}</div>
                )}
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 8 }}>
                {[[t("Rahu Kaal", "राहु काल"), selDetail.rahuKaal], [t("Abhijit Muhurat", "अभिजित मुहूर्त"), selDetail.abhijit]].map(([l, v]) => (
                  <div key={l} style={{ background: "#d6d3f0", borderRadius: 6, padding: "7px 10px" }}>
                    <div style={{ fontSize: 10, color: "#4338ca", marginBottom: 2, textTransform: "uppercase", fontWeight: 600 }}>{l}</div>
                    <div style={{ fontSize: 12, color: "#312e81", fontWeight: 600 }}>{v}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

const ctrlBtn: React.CSSProperties = {
  background: "#312e81", color: "#fff", border: "none", borderRadius: 4,
  padding: "5px 10px", cursor: "pointer", fontSize: 11, textAlign: "center",
  lineHeight: 1.3, minWidth: 60,
};

export default Panchang;
