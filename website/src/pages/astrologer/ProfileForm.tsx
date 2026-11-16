import { useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { BadgeCheck, Camera, Loader2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { API, api } from "@/lib/api";
import { useAuth, type AuthUser } from "@/hooks/useAuth";
import { useLang, useT } from "@/hooks/useLang";
import { astrologySpecialties } from "@/data/astrologySpecialties";

// Same limits as admin/src/lib/rate-validation.ts (RATE_LIMITS) — the API rejects anything outside them.
export const RATE_LIMITS = { chat: { min: 5, max: 500 }, call: { min: 10, max: 1000 }, video: { min: 15, max: 1500 } } as const;
const IFSC = /^[A-Z]{4}0[A-Z0-9]{6}$/;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const IMAGE_TYPES = "image/jpeg,image/png,image/webp,image/heic,image/heif";
const MAX_FILE = 10 * 1024 * 1024; // backend limit

/** skills / languages / qualifications come back as an array or a comma string depending on who wrote them. */
export const toList = (v: unknown): string[] =>
  (Array.isArray(v) ? v : typeof v === "string" ? v.split(",") : []).map((s) => String(s).trim()).filter(Boolean);

type Fields = Record<
  | "full_name" | "email" | "phone" | "gender" | "date_of_birth" | "address" | "city" | "state" | "country" | "zip"
  | "experience_years" | "qualifications" | "bio" | "chat_rate" | "call_rate" | "video_rate"
  | "account_holder_name" | "account_number" | "account_number_confirm" | "ifsc_code" | "bank_name" | "upi_id",
  string
>;

const initial = (u: AuthUser): Fields => {
  const s = (v: unknown) => (v === undefined || v === null || v === 0 ? "" : String(v));
  return {
    full_name: s(u.full_name), email: s(u.email_address), phone: s(u.phone_number).replace(/^\+91/, ""),
    gender: s(u.gender), date_of_birth: s(u.date_of_birth).slice(0, 10),
    address: s(u.address), city: s(u.city), state: s(u.state), country: s(u.country) || "India", zip: s(u.zip),
    experience_years: s(u.experience_years), qualifications: toList(u.qualifications).join(", "), bio: s(u.bio),
    chat_rate: s(u.chat_rate), call_rate: s(u.call_rate), video_rate: s(u.video_rate),
    // ponytail: GET users/profile reads bank_details.* but PUT stores these top-level, so they never prefill (backend gap)
    account_holder_name: s(u.account_holder_name), account_number: s(u.account_number), account_number_confirm: s(u.account_number),
    ifsc_code: s(u.ifsc_code), bank_name: s(u.bank_name), upi_id: s(u.upi_id),
  };
};

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <section className="rounded-2xl border bg-card p-5 lg:p-6 shadow-sm space-y-4">
    <h2 className="text-lg font-semibold text-primary">{title}</h2>
    {children}
  </section>
);

/**
 * The full astrologer profile (the app's completion wizard on one page): personal, address, professional,
 * rates, bank + PAN, terms. Saves through PUT users/profile exactly like the app.
 */
const ProfileForm = ({ user, onDone, submitLabel }: { user: AuthUser; onDone: () => void; submitLabel: string }) => {
  const t = useT();
  const { lang } = useLang();
  const { refreshUser } = useAuth();
  const [f, setF] = useState<Fields>(() => initial(user));
  const [skills, setSkills] = useState<string[]>(() => toList(user.skills));
  const [languages, setLanguages] = useState<string[]>(() => toList(user.languages));
  const [photo, setPhoto] = useState<File | null>(null);
  const [pan, setPan] = useState<File | null>(null);
  const [terms, setTerms] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<string, string>>>({});
  const [serverError, setServerError] = useState("");
  const [busy, setBusy] = useState(false);
  // email OTP (app: edit_personal_info → otp_verification purpose email_verification)
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [emailBusy, setEmailBusy] = useState(false);
  const [emailMsg, setEmailMsg] = useState("");
  const formRef = useRef<HTMLFormElement>(null);
  const photoUrl = useMemo(() => (photo ? URL.createObjectURL(photo) : user.profile_image), [photo, user.profile_image]);

  const options = useQuery({
    queryKey: ["astrologer-options"],
    // ponytail: plain fetch, no headers — the API answers the CORS preflight for /astrologer-options with 401 (non-GET = admin-only)
    queryFn: async (): Promise<{ skills: string[]; languages: string[] }> => {
      const r = await fetch(`${API}/astrologer-options/active`);
      if (!r.ok) throw new Error(String(r.status));
      return (await r.json()).data;
    },
    staleTime: 10 * 60_000,
  });

  const set = (k: keyof Fields) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setF((p) => ({ ...p, [k]: e.target.value }));
    setErrors((p) => ({ ...p, [k]: undefined }));
  };

  const emailVerified = user.email_verified === true && !!user.email_address
    && f.email.trim().toLowerCase() === String(user.email_address).toLowerCase();
  const phoneLocked = user.phone_verified === true && !!user.phone_number;

  const skillLabel = (s: string) => {
    if (lang !== "hi") return s;
    const k = s.toLowerCase();
    const m = astrologySpecialties.find((x) => x.label.toLowerCase() === k || x.label.toLowerCase().startsWith(k + " ")
      || x.aliases.some((a) => a.toLowerCase() === k));
    return m?.aliases.find((a) => /[ऀ-ॿ]/.test(a)) ?? s;
  };

  const pickFile = (setter: (f: File | null) => void, key: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    if (file && file.size > MAX_FILE) {
      setErrors((p) => ({ ...p, [key]: t("File too large. Maximum size is 10MB.", "फ़ाइल बहुत बड़ी है। अधिकतम आकार 10MB है।") }));
      e.target.value = "";
      return;
    }
    setErrors((p) => ({ ...p, [key]: undefined }));
    setter(file);
  };

  const sendEmailOtp = async () => {
    if (!EMAIL.test(f.email.trim())) {
      setErrors((p) => ({ ...p, email: t("Enter a valid email address", "मान्य ईमेल पता दर्ज करें") }));
      return;
    }
    setEmailBusy(true); setEmailMsg("");
    try {
      await api("/auth/send-otp", { body: { identifier: f.email.trim().toLowerCase(), auth_type: "email" } });
      setOtp(""); setOtpSent(true);
    } catch (e) { setEmailMsg(e instanceof Error ? e.message : String(e)); } finally { setEmailBusy(false); }
  };

  const verifyEmailOtp = async () => {
    setEmailBusy(true); setEmailMsg("");
    const email = f.email.trim().toLowerCase();
    try {
      // verify only — the tokens it may return are ignored, the astrologer stays logged in as themselves
      await api("/auth/verify-otp", { body: { identifier: email, otp, auth_type: "email" } });
      await api("/users/profile", { method: "PUT", body: { email_address: email, email_verified: true } });
      await refreshUser();
      setOtpSent(false);
      setErrors((p) => ({ ...p, email: undefined }));
    } catch (e) { setEmailMsg(e instanceof Error ? e.message : String(e)); } finally { setEmailBusy(false); }
  };

  const validate = () => {
    const e: Record<string, string> = {};
    const req = t("Required", "आवश्यक");
    if (f.full_name.trim().length < 2) e.full_name = t("Name must be at least 2 characters", "नाम कम से कम 2 अक्षरों का हो");
    if (!EMAIL.test(f.email.trim())) e.email = t("Enter a valid email address", "मान्य ईमेल पता दर्ज करें");
    else if (!emailVerified) e.email = t("Please verify your email with the OTP", "कृपया OTP से अपना ईमेल सत्यापित करें");
    if (!/^[6-9]\d{9}$/.test(f.phone.replace(/\D/g, "").slice(-10)) || f.phone.replace(/\D/g, "").length < 10)
      e.phone = t("Enter a valid 10-digit mobile number", "मान्य 10 अंकों का मोबाइल नंबर दर्ज करें");
    if (!f.gender) e.gender = req;
    for (const k of ["address", "city", "state", "country"] as const) if (!f[k].trim()) e[k] = req;
    if (!/^[A-Za-z0-9 -]{3,10}$/.test(f.zip.trim())) e.zip = t("Enter a valid PIN / ZIP code", "मान्य पिन कोड दर्ज करें");
    const exp = Number(f.experience_years);
    if (!Number.isInteger(exp) || exp < 1 || exp > 50) e.experience_years = t("Experience must be 1–50 years", "अनुभव 1–50 वर्ष होना चाहिए");
    if (!toList(f.qualifications).length) e.qualifications = t("Add at least one qualification", "कम से कम एक योग्यता जोड़ें");
    if (skills.length < 2) e.skills = t("Select at least 2 skills", "कम से कम 2 कौशल चुनें");
    if (!languages.length) e.languages = t("Select at least one language", "कम से कम एक भाषा चुनें");
    if (f.bio.trim().length < 50) e.bio = t("Bio should be at least 50 characters", "परिचय कम से कम 50 अक्षरों का हो");
    for (const k of ["chat", "call", "video"] as const) {
      const v = Number(f[`${k}_rate`]), { min, max } = RATE_LIMITS[k];
      if (!f[`${k}_rate`] || isNaN(v) || v < min || v > max) e[`${k}_rate`] = t(`Between ₹${min} and ₹${max} per minute`, `₹${min} से ₹${max} प्रति मिनट के बीच`);
    }
    if (!f.account_holder_name.trim()) e.account_holder_name = req;
    if (!/^\d{9,18}$/.test(f.account_number.trim())) e.account_number = t("Enter a valid account number (9–18 digits)", "मान्य खाता संख्या दर्ज करें (9–18 अंक)");
    if (f.account_number_confirm.trim() !== f.account_number.trim()) e.account_number_confirm = t("Account numbers do not match", "खाता संख्या मेल नहीं खाती");
    if (!IFSC.test(f.ifsc_code.trim().toUpperCase())) e.ifsc_code = t("Enter a valid IFSC code (e.g. SBIN0001234)", "मान्य IFSC कोड दर्ज करें (जैसे SBIN0001234)");
    if (!f.bank_name.trim()) e.bank_name = req;
    if (f.upi_id.trim() && !/^[\w.-]{2,}@[A-Za-z]{2,}$/.test(f.upi_id.trim())) e.upi_id = t("Enter a valid UPI ID (e.g. name@bank)", "मान्य UPI ID दर्ज करें (जैसे name@bank)");
    if (!terms) e.terms = t("Please accept the Astrologer Terms", "कृपया ज्योतिषी शर्तें स्वीकार करें");
    return e;
  };

  const submit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    setServerError("");
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length) {
      requestAnimationFrame(() => formRef.current?.querySelector("[data-error]")?.scrollIntoView({ behavior: "smooth", block: "center" }));
      return;
    }
    setBusy(true);
    try {
      // 1) the data, as JSON so numbers stay numbers (multipart turns everything into strings)
      await api("/users/profile", {
        method: "PUT",
        body: {
          full_name: f.full_name.trim(),
          ...(!phoneLocked && { phone_number: `+91${f.phone.replace(/\D/g, "").slice(-10)}` }),
          gender: f.gender, date_of_birth: f.date_of_birth || undefined,
          address: f.address.trim(), city: f.city.trim(), state: f.state.trim(), country: f.country.trim(), zip: f.zip.trim(),
          experience_years: Number(f.experience_years),
          qualifications: toList(f.qualifications).join(", "), // same comma strings the app sends
          skills: skills.join(", "), languages: languages.join(", "),
          bio: f.bio.trim(),
          chat_rate: Number(f.chat_rate), call_rate: Number(f.call_rate), video_rate: Number(f.video_rate),
          account_holder_name: f.account_holder_name.trim(), account_number: f.account_number.trim(),
          ifsc_code: f.ifsc_code.trim().toUpperCase(), bank_name: f.bank_name.trim(), upi_id: f.upi_id.trim() || undefined,
        },
      });
      // 2) files, multipart like the app (profile_image / pan_card_image)
      if (photo || pan) {
        const fd = new FormData();
        if (photo) fd.append("profile_image", photo);
        if (pan) fd.append("pan_card_image", pan);
        await api("/users/profile", { method: "PUT", body: fd });
      }
      await refreshUser();
      onDone();
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      setServerError(err instanceof Error ? err.message : String(err));
    } finally { setBusy(false); }
  };

  const Err = ({ k }: { k: string }) => (errors[k] ? <p data-error className="text-xs text-destructive">{errors[k]}</p> : null);
  const field = (k: keyof Fields, label: string, props: React.ComponentProps<typeof Input> = {}) => (
    <div className="space-y-1.5">
      <Label htmlFor={k}>{label}</Label>
      <Input id={k} value={f[k]} onChange={set(k)} aria-invalid={!!errors[k]} {...props} />
      <Err k={k} />
    </div>
  );
  const chips = (all: string[], sel: string[], setSel: (v: string[]) => void, key: string, label: (s: string) => string = (s) => s) => (
    <div className="flex flex-wrap gap-2">
      {/* keep anything already saved even if the admin has since deactivated that option */}
      {[...new Set([...all, ...sel])].map((o) => {
        const on = sel.includes(o);
        return (
          <button type="button" key={o} aria-pressed={on}
            onClick={() => { setSel(on ? sel.filter((x) => x !== o) : [...sel, o]); setErrors((p) => ({ ...p, [key]: undefined })); }}
            className={`rounded-full border px-3 py-1.5 text-sm transition-colors ${on ? "border-primary bg-primary text-primary-foreground" : "bg-background hover:border-primary"}`}>
            {label(o)}
          </button>
        );
      })}
      {options.isLoading && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
    </div>
  );
  const selectCls = "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm";

  return (
    <form ref={formRef} onSubmit={submit} noValidate className="space-y-5">
      <Section title={t("Personal details", "व्यक्तिगत विवरण")}>
        <div className="flex items-center gap-4">
          <label className="relative cursor-pointer">
            <div className="h-20 w-20 overflow-hidden rounded-full border-2 border-primary/30 bg-secondary">
              {photoUrl
                ? <img src={photoUrl} alt="" className="h-full w-full object-cover" />
                : <Camera className="m-auto mt-6 h-8 w-8 text-muted-foreground" />}
            </div>
            <span className="absolute bottom-0 right-0 rounded-full bg-primary p-1.5 text-primary-foreground"><Camera className="h-3.5 w-3.5" /></span>
            <input type="file" accept={IMAGE_TYPES} className="sr-only" onChange={pickFile(setPhoto, "photo")} aria-label={t("Profile photo", "प्रोफ़ाइल फ़ोटो")} />
          </label>
          <div className="text-sm">
            <p className="font-medium">{t("Profile photo", "प्रोफ़ाइल फ़ोटो")}</p>
            <p className="text-muted-foreground">{t("A clear photo of your face. JPG/PNG/WebP, up to 10MB.", "आपके चेहरे की साफ़ फ़ोटो। JPG/PNG/WebP, 10MB तक।")}</p>
            <Err k="photo" />
          </div>
        </div>
        {field("full_name", t("Full name", "पूरा नाम"), { autoComplete: "name" })}

        <div className="space-y-1.5">
          <Label htmlFor="email">{t("Email address", "ईमेल पता")}</Label>
          <div className="flex gap-2">
            <Input id="email" type="email" autoComplete="email" value={f.email} aria-invalid={!!errors.email}
              onChange={(e) => { set("email")(e); setOtpSent(false); }} />
            {emailVerified
              ? <span className="flex items-center gap-1 whitespace-nowrap text-sm text-green-600"><BadgeCheck className="h-4 w-4" />{t("Verified", "सत्यापित")}</span>
              : <Button type="button" variant="outline" disabled={emailBusy} onClick={sendEmailOtp}>
                  {emailBusy && !otpSent && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {otpSent ? t("Resend", "फिर भेजें") : t("Verify", "सत्यापित करें")}
                </Button>}
          </div>
          {otpSent && !emailVerified && (
            <div className="flex flex-wrap items-center gap-3 rounded-md bg-secondary p-3">
              <span className="text-sm">{t("Enter the 4-digit code sent to your email", "ईमेल पर भेजा गया 4 अंकों का कोड दर्ज करें")}</span>
              <InputOTP maxLength={4} value={otp} onChange={setOtp} onComplete={() => !emailBusy && verifyEmailOtp()}>
                <InputOTPGroup>{[0, 1, 2, 3].map((i) => <InputOTPSlot key={i} index={i} />)}</InputOTPGroup>
              </InputOTP>
              <Button type="button" size="sm" disabled={otp.length !== 4 || emailBusy} onClick={verifyEmailOtp}>
                {emailBusy && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}{t("Confirm", "पुष्टि करें")}
              </Button>
            </div>
          )}
          {emailMsg && <p className="text-xs text-destructive">{emailMsg}</p>}
          <Err k="email" />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="phone">{t("Mobile number", "मोबाइल नंबर")}</Label>
          <div className="flex gap-2">
            <span className="flex items-center rounded-md border bg-secondary px-3 text-sm">+91</span>
            <Input id="phone" type="tel" inputMode="numeric" autoComplete="tel-national" value={f.phone} onChange={set("phone")}
              readOnly={phoneLocked} aria-invalid={!!errors.phone} className={phoneLocked ? "bg-muted" : ""} />
          </div>
          <Err k="phone" />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="gender">{t("Gender", "लिंग")}</Label>
            <select id="gender" value={f.gender} onChange={set("gender")} className={selectCls} aria-invalid={!!errors.gender}>
              <option value="">{t("Select", "चुनें")}</option>
              <option value="male">{t("Male", "पुरुष")}</option>
              <option value="female">{t("Female", "महिला")}</option>
              <option value="other">{t("Other", "अन्य")}</option>
            </select>
            <Err k="gender" />
          </div>
          {field("date_of_birth", t("Date of birth (optional)", "जन्म तिथि (वैकल्पिक)"), { type: "date", max: new Date().toISOString().slice(0, 10) })}
        </div>
      </Section>

      <Section title={t("Address", "पता")}>
        {field("address", t("Address", "पता"), { autoComplete: "street-address" })}
        <div className="grid gap-4 sm:grid-cols-2">
          {field("city", t("City", "शहर"), { autoComplete: "address-level2" })}
          {field("state", t("State", "राज्य"), { autoComplete: "address-level1" })}
          {field("country", t("Country", "देश"), { autoComplete: "country-name" })}
          {field("zip", t("PIN code", "पिन कोड"), { autoComplete: "postal-code", inputMode: "numeric" })}
        </div>
      </Section>

      <Section title={t("Professional details", "पेशेवर विवरण")}>
        <div className="grid gap-4 sm:grid-cols-2">
          {field("experience_years", t("Experience (years)", "अनुभव (वर्ष)"), { type: "number", min: 1, max: 50, inputMode: "numeric" })}
          {field("qualifications", t("Qualifications (comma separated)", "योग्यताएँ (अल्पविराम से अलग)"), { placeholder: t("e.g. Jyotish Acharya, M.A. Astrology", "जैसे ज्योतिष आचार्य, एम.ए. ज्योतिष") })}
        </div>
        <div className="space-y-1.5">
          <Label>{t("Skills (select at least 2)", "कौशल (कम से कम 2 चुनें)")}</Label>
          {chips(options.data?.skills ?? [], skills, setSkills, "skills", skillLabel)}
          <Err k="skills" />
        </div>
        <div className="space-y-1.5">
          <Label>{t("Languages you consult in", "परामर्श की भाषाएँ")}</Label>
          {chips(options.data?.languages ?? [], languages, setLanguages, "languages")}
          <Err k="languages" />
        </div>
        {options.isError && <p className="text-xs text-destructive">{t("Could not load options. Refresh the page.", "विकल्प लोड नहीं हो सके। पेज रीफ़्रेश करें।")}</p>}
        <div className="space-y-1.5">
          <Label htmlFor="bio">{t("About you", "आपके बारे में")}</Label>
          <Textarea id="bio" rows={5} value={f.bio} onChange={set("bio")} aria-invalid={!!errors.bio}
            placeholder={t("Your approach, specialities and what clients can expect (min 50 characters)", "आपकी पद्धति, विशेषज्ञता और ग्राहक क्या उम्मीद करें (कम से कम 50 अक्षर)")} />
          <p className="text-xs text-muted-foreground">{f.bio.trim().length}/50</p>
          <Err k="bio" />
        </div>
      </Section>

      <Section title={t("Consultation rates (₹ per minute)", "परामर्श दरें (₹ प्रति मिनट)")}>
        <div className="grid gap-4 sm:grid-cols-3">
          {(["chat", "call", "video"] as const).map((k) =>
            <div key={k}>{field(`${k}_rate`, {
              chat: t("Chat", "चैट"), call: t("Voice call", "वॉइस कॉल"), video: t("Video call", "वीडियो कॉल"),
            }[k] + ` (₹${RATE_LIMITS[k].min}–${RATE_LIMITS[k].max})`, { type: "number", inputMode: "decimal", min: RATE_LIMITS[k].min, max: RATE_LIMITS[k].max })}</div>)}
        </div>
      </Section>

      <Section title={t("Bank details for payouts", "भुगतान हेतु बैंक विवरण")}>
        {field("account_holder_name", t("Account holder name", "खाताधारक का नाम"))}
        <div className="grid gap-4 sm:grid-cols-2">
          {field("account_number", t("Account number", "खाता संख्या"), { inputMode: "numeric", autoComplete: "off" })}
          {field("account_number_confirm", t("Confirm account number", "खाता संख्या की पुष्टि करें"), { inputMode: "numeric", autoComplete: "off", onPaste: (e) => e.preventDefault() })}
          {field("ifsc_code", t("IFSC code", "IFSC कोड"), { className: "uppercase", autoComplete: "off" })}
          {field("bank_name", t("Bank name", "बैंक का नाम"))}
        </div>
        {field("upi_id", t("UPI ID (optional)", "UPI ID (वैकल्पिक)"), { placeholder: "name@bank" })}
        <div className="space-y-1.5">
          <Label>{t("PAN card (optional)", "पैन कार्ड (वैकल्पिक)")}</Label>
          <label className="flex cursor-pointer items-center gap-3 rounded-md border border-dashed p-3 text-sm hover:border-primary">
            <Upload className="h-5 w-5 text-muted-foreground" />
            <span className="flex-1 truncate">
              {pan ? pan.name : user.pan_card_url ? t("PAN card uploaded — tap to replace", "पैन कार्ड अपलोड है — बदलने के लिए टैप करें") : t("Upload a photo of your PAN card", "अपने पैन कार्ड की फ़ोटो अपलोड करें")}
            </span>
            {!pan && user.pan_card_url && <img src={user.pan_card_url} alt="" className="h-10 w-16 rounded object-cover" />}
            <input type="file" accept={IMAGE_TYPES} className="sr-only" onChange={pickFile(setPan, "pan")} />
          </label>
          <Err k="pan" />
        </div>
      </Section>

      <div className="space-y-4 rounded-2xl border bg-card p-5 lg:p-6 shadow-sm">
        <label className="flex items-start gap-2 text-sm text-muted-foreground">
          <Checkbox checked={terms} onCheckedChange={(v) => { setTerms(v === true); setErrors((p) => ({ ...p, terms: undefined })); }} className="mt-0.5" />
          <span>
            {t("I confirm these details are correct and I accept the ", "मैं पुष्टि करता/करती हूँ कि ये विवरण सही हैं और मैं ")}
            <Link to="/astrologer-terms" target="_blank" className="text-primary underline">{t("Astrologer Terms", "ज्योतिषी शर्तें")}</Link>
            {t(".", " स्वीकार करता/करती हूँ।")}
          </span>
        </label>
        <Err k="terms" />
        {Object.values(errors).some(Boolean) && (
          <p className="text-sm text-destructive">{t("Please fix the highlighted fields.", "कृपया चिह्नित फ़ील्ड ठीक करें।")}</p>
        )}
        {serverError && <p role="alert" className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">{serverError}</p>}
        <Button type="submit" className="w-full" size="lg" disabled={busy}>
          {busy && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}{submitLabel}
        </Button>
      </div>
    </form>
  );
};

export default ProfileForm;
