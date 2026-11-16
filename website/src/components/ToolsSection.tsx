import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { getPanchang } from "@/lib/panchang";
import { useT } from "@/hooks/useLang";

const ToolsSection = () => {
  const navigate = useNavigate();
  const t = useT();
  const today = new Date();
  const panchang = getPanchang(today.getFullYear(), today.getMonth() + 1, today.getDate());
  const todayStr = `${String(today.getDate()).padStart(2, "0")}/${String(today.getMonth() + 1).padStart(2, "0")}/${today.getFullYear()}`;
  const [kundliForm, setKundliForm] = useState({
    name: "",
    gender: "male",
    day: "22",
    month: "1",
    year: "2026",
    hour: "12",
    minute: "00",
    place: ""
  });

  const [loshuForm, setLoshuForm] = useState({
    name: "",
    gender: "male",
    day: "22",
    month: "1",
    year: "2026"
  });

  const [luckyDob, setLuckyDob] = useState("");

  const [numerologyForm, setNumerologyForm] = useState({
    name: "",
    mobile: "",
    day: "22",
    month: "1",
    year: "2026"
  });

  return (
    <section className="py-8 lg:py-10 bg-secondary/20" aria-labelledby="tools-section-title">
      <div className="container mx-auto px-4">
        <div className="mb-7 text-center">
          <h2 id="tools-section-title" className="font-sans text-2xl font-bold leading-relaxed text-primary lg:text-3xl">
            {t("Astrology & Numerology", "ज्योतिष और अंकज्योतिष")}
          </h2>
          <p className="mx-auto mt-2 max-w-3xl font-sans text-sm leading-relaxed text-muted-foreground">
            {t("Kundli, Panchang, Lo Shu Grid, mobile number and lucky number — get instant reports from your birth details.", "कुंडली, पंचांग, लो शू ग्रिड, मोबाइल नंबर और लकी नंबर — अपनी जन्म जानकारी से तुरंत रिपोर्ट पाएँ।")}
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          
          {/* Kundli / Birth Chart Card */}
          <div className="bg-gradient-to-b from-orange-400 to-orange-500 rounded-xl shadow-lg overflow-hidden">
            <div className="px-5 py-4">
              <h3 className="text-xl font-bold text-white">Kundli / Birth Chart</h3>
              <p className="text-sm text-orange-100">Enter Birth Details</p>
            </div>
            <div className="px-5 pb-5 space-y-3">
              <Input 
                placeholder="Name" 
                value={kundliForm.name}
                onChange={(e) => setKundliForm({...kundliForm, name: e.target.value})}
                className="bg-orange-300/50 border-0 placeholder:text-orange-100 text-white"
              />
              
              <div className="grid grid-cols-3 gap-2">
                <Input 
                  placeholder="DD" 
                  value={kundliForm.day} 
                  onChange={(e) => setKundliForm({...kundliForm, day: e.target.value})} 
                  className="bg-orange-300/50 border-0 text-center text-white placeholder:text-orange-100" 
                />
                <Input 
                  placeholder="MM" 
                  value={kundliForm.month} 
                  onChange={(e) => setKundliForm({...kundliForm, month: e.target.value})} 
                  className="bg-orange-300/50 border-0 text-center text-white placeholder:text-orange-100" 
                />
                <Input 
                  placeholder="YYYY" 
                  value={kundliForm.year} 
                  onChange={(e) => setKundliForm({...kundliForm, year: e.target.value})} 
                  className="bg-orange-300/50 border-0 text-center text-white placeholder:text-orange-100" 
                />
              </div>

              <div className="space-y-1">
                <p className="text-sm text-orange-100">{t("Birth Time", "जन्म समय")}</p>
                <div className="grid grid-cols-2 gap-2">
                  <Input 
                    placeholder="HH" 
                    value={kundliForm.hour} 
                    onChange={(e) => setKundliForm({...kundliForm, hour: e.target.value})} 
                    className="bg-orange-300/50 border-0 text-center text-white placeholder:text-orange-100" 
                  />
                  <Input 
                    placeholder="MM" 
                    value={kundliForm.minute} 
                    onChange={(e) => setKundliForm({...kundliForm, minute: e.target.value})} 
                    className="bg-orange-300/50 border-0 text-center text-white placeholder:text-orange-100" 
                  />
                </div>
              </div>

              <Input 
                placeholder={t("Birth Place", "जन्म स्थान (Birth Place)")} 
                value={kundliForm.place}
                onChange={(e) => setKundliForm({...kundliForm, place: e.target.value})}
                className="bg-orange-300/50 border-0 placeholder:text-orange-100 text-white"
              />

              
              <div className="space-y-1">
                <p className="text-sm text-orange-100">{t("Gender", "लिंग")}</p>
                <RadioGroup 
                  value={kundliForm.gender} 
                  onValueChange={(val) => setKundliForm({...kundliForm, gender: val})}
                  className="flex gap-6"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="male" id="kundli-male" className="border-white text-white" />
                    <Label htmlFor="kundli-male" className="text-white">{t("Male", "पुरुष")}</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="female" id="kundli-female" className="border-white text-white" />
                    <Label htmlFor="kundli-female" className="text-white">{t("Female", "महिला")}</Label>
                  </div>
                </RadioGroup>
              </div>
              
              <Button 
                className="w-full bg-white hover:bg-gray-100 text-orange-600 font-bold mt-2"
                onClick={() => navigate('/free-kundli')}
              >
                CONTINUE
              </Button>
            </div>
          </div>


          <div className="bg-gradient-to-b from-[#8b1a1a] to-[#6b1010] rounded-xl shadow-lg overflow-hidden">
            <div className="px-5 py-4">
              <h3 className="text-xl font-bold text-[#ffe080]">Panchang</h3>
              <p className="text-sm text-amber-100">{todayStr} · {t(panchang.var, panchang.varHi)}</p>
              <p className="text-xs text-amber-200/90">{t("New Delhi, India", "नई दिल्ली, भारत")}</p>
            </div>
            <div className="px-5 pb-5 space-y-3">
              <div className="bg-[#c8a040]/20 rounded-lg p-3 space-y-2 text-sm text-amber-50">
                <p className="flex justify-between"><span className="text-amber-200">{t("Day", "वार")}</span><span>{t(panchang.var, panchang.varHi)}</span></p>
                <p className="flex justify-between"><span className="text-amber-200">{t("Month", "मास")}</span><span>{t(panchang.masa, panchang.masaHi)}</span></p>
                <p className="flex justify-between"><span className="text-amber-200">{t("Tithi", "तिथि")}</span><span>{t(panchang.tithi, panchang.tithiHi)}</span></p>
                <p className="flex justify-between"><span className="text-amber-200">{t("Paksha", "पक्ष")}</span><span>{t(panchang.paksha, panchang.pakshaHi)}</span></p>
                <p className="flex justify-between"><span className="text-amber-200">{t("Nakshatra", "नक्षत्र")}</span><span>{t(panchang.nakshatra, panchang.nakshatraHi)}</span></p>
                <p className="flex justify-between"><span className="text-amber-200">{t("Samvat", "संवत्")}</span><span>{panchang.samvat}</span></p>
              </div>
              <Button 
                className="w-full bg-[#c8a040] hover:bg-[#b8902f] text-[#4a1010] font-bold mt-2"
                onClick={() => navigate('/panchang')}
              >
                {t("View Panchang", "पंचांग देखें")}
              </Button>
            </div>
          </div>

          <div className="bg-gradient-to-b from-purple-500 to-purple-600 rounded-xl shadow-lg overflow-hidden">
            <div className="px-5 py-4">
              <h3 className="text-xl font-bold text-white">Lo Shu Grid Calculator</h3>
              <p className="text-sm text-purple-200">{t("Enter your birth date", "अपनी जन्मांक दर्ज करें")}</p>
            </div>
            <div className="px-5 pb-5 space-y-3">
              <Input 
                placeholder="Name" 
                value={loshuForm.name}
                onChange={(e) => setLoshuForm({...loshuForm, name: e.target.value})}
                className="bg-purple-400/50 border-0 placeholder:text-purple-200 text-white"
              />
              
              <div className="grid grid-cols-3 gap-2">
                <Input 
                  placeholder="DD" 
                  value={loshuForm.day} 
                  onChange={(e) => setLoshuForm({...loshuForm, day: e.target.value})} 
                  className="bg-purple-400/50 border-0 text-center text-white placeholder:text-purple-200" 
                />
                <Input 
                  placeholder="MM" 
                  value={loshuForm.month} 
                  onChange={(e) => setLoshuForm({...loshuForm, month: e.target.value})} 
                  className="bg-purple-400/50 border-0 text-center text-white placeholder:text-purple-200" 
                />
                <Input 
                  placeholder="YYYY" 
                  value={loshuForm.year} 
                  onChange={(e) => setLoshuForm({...loshuForm, year: e.target.value})} 
                  className="bg-purple-400/50 border-0 text-center text-white placeholder:text-purple-200" 
                />
              </div>
              
              <div className="space-y-1">
                <p className="text-sm text-purple-200">{t("Gender", "लिंग")}</p>
                <RadioGroup 
                  value={loshuForm.gender} 
                  onValueChange={(val) => setLoshuForm({...loshuForm, gender: val})}
                  className="flex gap-6"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="male" id="loshu-male" className="border-white text-white" />
                    <Label htmlFor="loshu-male" className="text-white">{t("Male", "पुरुष")}</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="female" id="loshu-female" className="border-white text-white" />
                    <Label htmlFor="loshu-female" className="text-white">{t("Female", "महिला")}</Label>
                  </div>
                </RadioGroup>
              </div>
              
              <Button 
                className="w-full bg-white hover:bg-gray-100 text-purple-600 font-bold mt-2"
                onClick={() => navigate(`/loshu-grid?name=${encodeURIComponent(loshuForm.name)}&dob=${loshuForm.day.padStart(2,'0')}/${loshuForm.month.padStart(2,'0')}/${loshuForm.year}&gender=${loshuForm.gender}`)}
              >
                CONTINUE
              </Button>
            </div>
          </div>

          {/* Numerology Calculator Card */}
          <div className="bg-gradient-to-b from-purple-500 to-purple-600 rounded-xl shadow-lg overflow-hidden">
            <div className="px-5 py-4">
              <h3 className="text-xl font-bold text-white">Mobile Numerology Calculator</h3>
              <p className="text-sm text-purple-200">{t("Detailed numerology reading for your number and birth date", "विस्तृत न्यूमेरोलॉजी रीडिंग और जन्म के बारे में")}</p>
            </div>
            <div className="px-5 pb-5 space-y-3">
              <Input 
                placeholder="Name" 
                value={numerologyForm.name}
                onChange={(e) => setNumerologyForm({...numerologyForm, name: e.target.value})}
                className="bg-purple-400/50 border-0 placeholder:text-purple-200 text-white"
              />
              
              <div className="grid grid-cols-3 gap-2">
                <Input 
                  placeholder="DD" 
                  value={numerologyForm.day} 
                  onChange={(e) => setNumerologyForm({...numerologyForm, day: e.target.value})} 
                  className="bg-purple-400/50 border-0 text-center text-white placeholder:text-purple-200" 
                />
                <Input 
                  placeholder="MM" 
                  value={numerologyForm.month} 
                  onChange={(e) => setNumerologyForm({...numerologyForm, month: e.target.value})} 
                  className="bg-purple-400/50 border-0 text-center text-white placeholder:text-purple-200" 
                />
                <Input 
                  placeholder="YYYY" 
                  value={numerologyForm.year} 
                  onChange={(e) => setNumerologyForm({...numerologyForm, year: e.target.value})} 
                  className="bg-purple-400/50 border-0 text-center text-white placeholder:text-purple-200" 
                />
              </div>
              
              <div className="space-y-1">
                <p className="text-sm text-purple-200">{t("Mobile Number", "मोबाइल नंबर")}</p>
                <Input 
                  placeholder="9876543210" 
                  value={numerologyForm.mobile}
                  onChange={(e) => setNumerologyForm({...numerologyForm, mobile: e.target.value.replace(/\D/g, '').slice(0, 10)})}
                  className="bg-purple-400/50 border-0 placeholder:text-purple-200 text-white"
                  maxLength={10}
                  type="tel"
                />
              </div>
              
              <Button 
                className="w-full bg-white hover:bg-gray-100 text-purple-600 font-bold mt-2"
                onClick={() => navigate(`/numerology?name=${encodeURIComponent(numerologyForm.name)}&dob=${numerologyForm.day.padStart(2,'0')}/${numerologyForm.month.padStart(2,'0')}/${numerologyForm.year}&mobile=${numerologyForm.mobile}`)}
              >
                CONTINUE
              </Button>
            </div>
          </div>

          {/* Lucky number Calculator Card */}
          <div className="bg-gradient-to-b from-[#4c1d8a] to-[#6a2fb5] rounded-xl shadow-lg overflow-hidden">
            <div className="px-5 py-4">
              <h3 className="text-xl font-bold text-white">Lucky number Calculator</h3>
              <p className="text-sm text-purple-200">{t("Find your lucky number from your date of birth", "जन्म तिथि से अपना भाग्यशाली अंक जानें")}</p>
            </div>
            <div className="px-5 pb-5 space-y-3">
              <div className="space-y-1">
                <p className="text-sm text-purple-200">{t("Date of Birth", "जन्म तिथि")}</p>
                <Input
                  placeholder="dd/mm/yyyy"
                  value={luckyDob}
                  onChange={(e) => {
                    const d = e.target.value.replace(/\D/g, "").slice(0, 8);
                    let f = d;
                    if (d.length > 4) f = d.slice(0, 2) + "/" + d.slice(2, 4) + "/" + d.slice(4);
                    else if (d.length > 2) f = d.slice(0, 2) + "/" + d.slice(2);
                    setLuckyDob(f);
                  }}
                  inputMode="numeric"
                  maxLength={10}
                  className="bg-purple-400/40 border-0 placeholder:text-purple-200 text-white text-center tracking-widest"
                />
              </div>
              <div className="rounded-lg bg-white/10 p-3 text-xs text-purple-100 leading-relaxed">
                {t("Your lucky number — from the first digit of your birth date and the last digit of your birth year — with its meaning, lucky colour and lucky day.", "जन्म तिथि के पहले अंक और जन्म वर्ष के अंतिम अंक से बना आपका लकी नंबर, उसका अर्थ, शुभ रंग और शुभ दिन।")}
              </div>
              <Button
                className="w-full bg-white hover:bg-gray-100 text-[#4c1d8a] font-bold mt-2"
                onClick={() => navigate(`/lucky-number${luckyDob ? `?dob=${encodeURIComponent(luckyDob)}` : ""}`)}
              >
                CONTINUE
              </Button>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

export default ToolsSection;
