import { useState } from "react";
import { Link, Navigate, useNavigate, useSearchParams } from "react-router-dom";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { api, ApiError } from "@/lib/api";
import { useAuth, type AuthUser } from "@/hooks/useAuth";
import { useT } from "@/hooks/useLang";

// Where a logged-in user belongs.
export const homeFor = (u: AuthUser) => (u.user_type === "astrologer" ? "/astrologer" : "/account");

// Same rules as the backend (PasswordSecurity.validatePasswordStrength).
export const passwordRules = (p: string) => [
  { ok: p.length >= 8, en: "At least 8 characters", hi: "कम से कम 8 अक्षर" },
  { ok: /[A-Z]/.test(p), en: "An uppercase letter", hi: "एक बड़ा अक्षर (A-Z)" },
  { ok: /[a-z]/.test(p), en: "A lowercase letter", hi: "एक छोटा अक्षर (a-z)" },
  { ok: /\d/.test(p), en: "A number", hi: "एक अंक" },
  { ok: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(p), en: "A special character (e.g. @ # !)", hi: "एक विशेष चिह्न (जैसे @ # !)" },
];

export const PasswordInput = ({ id, value, onChange, autoComplete }: { id: string; value: string; onChange: (v: string) => void; autoComplete: string }) => {
  const [show, setShow] = useState(false);
  const t = useT();
  return (
    <div className="relative">
      <Input id={id} type={show ? "text" : "password"} value={value} autoComplete={autoComplete} onChange={(e) => onChange(e.target.value)} className="pr-10" />
      <button type="button" onClick={() => setShow(!show)} aria-label={show ? t("Hide password", "पासवर्ड छिपाएँ") : t("Show password", "पासवर्ड दिखाएँ")}
        className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground">
        {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      </button>
    </div>
  );
};

/**
 * Email + password login and signup for customers and astrologers (/auth, /auth?role=astrologer, &mode=signup).
 * Uses the same accounts as the app: POST auth/login, POST auth/register (auth_type 'email').
 */
const Auth = () => {
  const t = useT();
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const { user, loading, login } = useAuth();
  const role = params.get("role") === "astrologer" ? "astrologer" : "customer";
  const redirect = params.get("redirect");
  const mode = params.get("mode") === "signup" || (role === "astrologer" && params.get("mode") !== "login") ? "signup" : "login";
  const setMode = (m: "login" | "signup") => { const p = new URLSearchParams(params); p.set("mode", m); setParams(p, { replace: true }); setError(""); };

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [agree, setAgree] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  if (!loading && user) return <Navigate to={redirect || homeFor(user)} replace />;

  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  const phone10 = phone.replace(/\D/g, "");
  const phoneOk = !phone10 || /^[6-9]\d{9}$/.test(phone10);
  const rules = passwordRules(password);
  const canSignup = name.trim().length >= 2 && emailOk && phoneOk && rules.every((r) => r.ok) && password === confirm && agree;

  const finish = async (d: { access_token: string; refresh_token: string }) => {
    const u = await login(d);
    if (!u) throw new Error(t("Could not load your account. Please try again.", "आपका खाता लोड नहीं हो सका। कृपया पुनः प्रयास करें।"));
    navigate(redirect || homeFor(u), { replace: true });
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true); setError("");
    try {
      if (mode === "login") {
        const j = await api("/auth/login", { body: { identifier: email.trim().toLowerCase(), auth_type: "email", password } });
        await finish(j.data ?? j);
      } else {
        const j = await api("/auth/register", {
          body: {
            full_name: name.trim(), email_address: email.trim().toLowerCase(), password, user_type: role, auth_type: "email",
            ...(phone10 && { phone_number: phone10, country_code: "+91" }),
          },
        });
        await finish(j.data ?? j);
      }
    } catch (err) {
      const code = err instanceof ApiError ? err.code : "";
      setError(
        code === "INVALID_CREDENTIALS" ? t("Wrong email or password.", "ईमेल या पासवर्ड गलत है।")
        : code === "USER_NOT_REGISTERED" ? t("No account with this email. Please sign up.", "इस ईमेल से कोई खाता नहीं है। कृपया साइन अप करें।")
        : code === "NO_PASSWORD_SET" ? t("This account has no password yet. Use 'Forgot password' to set one.", "इस खाते का पासवर्ड नहीं है। 'पासवर्ड भूल गए' से पासवर्ड सेट करें।")
        : code === "ACCOUNT_LOCKED" ? t("Too many wrong attempts. Please try again in a few minutes.", "बहुत सारे गलत प्रयास। कुछ मिनट बाद पुनः प्रयास करें।")
        : err instanceof Error ? err.message : String(err),
      );
    } finally { setBusy(false); }
  };

  const title = role === "astrologer"
    ? (mode === "signup" ? t("Join Astromate as an Astrologer", "Astromate पर ज्योतिषी के रूप में जुड़ें") : t("Astrologer Login", "ज्योतिषी लॉगिन"))
    : (mode === "signup" ? t("Create your account", "अपना खाता बनाएँ") : t("Welcome back", "फिर से स्वागत है"));

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-10 lg:py-16">
        <div className="mx-auto max-w-md rounded-2xl border bg-card p-6 lg:p-8 shadow-lg">
          <div className="mb-6 grid grid-cols-2 gap-2 rounded-full bg-secondary p-1" role="tablist">
            {(["login", "signup"] as const).map((m) => (
              <button key={m} role="tab" aria-selected={mode === m} onClick={() => setMode(m)}
                className={`rounded-full py-2 text-sm font-medium transition-colors ${mode === m ? "bg-card shadow text-foreground" : "text-muted-foreground"}`}>
                {m === "login" ? t("Login", "लॉगिन") : t("Sign up", "साइन अप")}
              </button>
            ))}
          </div>
          <h1 className="text-2xl font-bold text-center">{title}</h1>
          {role === "astrologer" && mode === "signup" && (
            <p className="mt-1 text-center text-sm text-muted-foreground">
              {t("Create your account, then complete your profile for approval.", "खाता बनाएँ, फिर स्वीकृति के लिए अपनी प्रोफ़ाइल पूरी करें।")}
            </p>
          )}

          <form onSubmit={submit} className="mt-6 space-y-4">
            {mode === "signup" && (
              <div className="space-y-2">
                <Label htmlFor="name">{t("Full name", "पूरा नाम")}</Label>
                <Input id="name" autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} />
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">{t("Email address", "ईमेल पता")}</Label>
              <Input id="email" type="email" inputMode="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
            </div>
            {mode === "signup" && (
              <div className="space-y-2">
                <Label htmlFor="phone">{t("Mobile number", "मोबाइल नंबर")} <span className="text-muted-foreground font-normal">{t("(optional)", "(वैकल्पिक)")}</span></Label>
                <div className="flex gap-2">
                  <span className="flex items-center rounded-md border bg-secondary px-3 text-sm">+91</span>
                  <Input id="phone" type="tel" inputMode="numeric" autoComplete="tel-national" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="98XXXXXXXX" />
                </div>
                {!phoneOk && <p className="text-xs text-destructive">{t("Enter a valid 10-digit mobile number.", "मान्य 10 अंकों का मोबाइल नंबर दर्ज करें।")}</p>}
              </div>
            )}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">{t("Password", "पासवर्ड")}</Label>
                {mode === "login" && (
                  <Link to="/forgot-password" className="text-xs text-primary hover:underline">{t("Forgot password?", "पासवर्ड भूल गए?")}</Link>
                )}
              </div>
              <PasswordInput id="password" value={password} onChange={setPassword} autoComplete={mode === "login" ? "current-password" : "new-password"} />
              {mode === "signup" && password && (
                <ul className="grid grid-cols-1 gap-0.5 text-xs sm:grid-cols-2">
                  {rules.map((r) => <li key={r.en} className={r.ok ? "text-green-600" : "text-muted-foreground"}>{r.ok ? "✓" : "•"} {t(r.en, r.hi)}</li>)}
                </ul>
              )}
            </div>
            {mode === "signup" && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="confirm">{t("Confirm password", "पासवर्ड की पुष्टि करें")}</Label>
                  <PasswordInput id="confirm" value={confirm} onChange={setConfirm} autoComplete="new-password" />
                  {confirm && confirm !== password && <p className="text-xs text-destructive">{t("Passwords don't match.", "पासवर्ड मेल नहीं खाते।")}</p>}
                </div>
                <label className="flex items-start gap-2 text-sm text-muted-foreground">
                  <Checkbox checked={agree} onCheckedChange={(v) => setAgree(v === true)} className="mt-0.5" />
                  <span>
                    {t("I agree to the ", "मैं ")}
                    <Link to={role === "astrologer" ? "/astrologer-terms" : "/terms-of-service"} className="text-primary underline">
                      {role === "astrologer" ? t("Astrologer Terms", "ज्योतिषी शर्तों") : t("Terms of Use", "उपयोग की शर्तों")}
                    </Link>
                    {t(" and ", " और ")}
                    <Link to="/privacy-policy" className="text-primary underline">{t("Privacy Policy", "गोपनीयता नीति")}</Link>
                    {t(".", " से सहमत हूँ।")}
                  </span>
                </label>
              </>
            )}
            {error && <p role="alert" className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">{error}</p>}
            <Button type="submit" className="w-full" disabled={busy || (mode === "login" ? !emailOk || !password : !canSignup)}>
              {busy && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {mode === "login" ? t("Login", "लॉगिन") : t("Create account", "खाता बनाएँ")}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            {role === "customer"
              ? <>{t("Are you an astrologer? ", "क्या आप ज्योतिषी हैं? ")}<Link to="/auth?role=astrologer" className="text-primary font-medium hover:underline">{t("Join as Astrologer", "ज्योतिषी बनें")}</Link></>
              : <>{t("Looking for a consultation? ", "परामर्श चाहिए? ")}<Link to="/auth" className="text-primary font-medium hover:underline">{t("Customer login", "ग्राहक लॉगिन")}</Link></>}
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Auth;
