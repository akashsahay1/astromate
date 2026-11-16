import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Loader2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/api";
import { useT } from "@/hooks/useLang";
import { PasswordInput, passwordRules } from "@/pages/Auth";

const Shell = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="min-h-screen bg-background flex flex-col">
    <Navbar />
    <main className="flex-1 container mx-auto px-4 py-10 lg:py-16">
      <div className="mx-auto max-w-md rounded-2xl border bg-card p-6 lg:p-8 shadow-lg">
        <h1 className="text-2xl font-bold text-center mb-6">{title}</h1>
        {children}
      </div>
    </main>
    <Footer />
  </div>
);

/** /forgot-password — emails a reset link (POST auth/forgot-password). */
export const ForgotPassword = () => {
  const t = useT();
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true); setError("");
    try { await api("/auth/forgot-password", { body: { email: email.trim().toLowerCase() } }); setSent(true); }
    catch (err) { setError(err instanceof Error ? err.message : String(err)); }
    finally { setBusy(false); }
  };

  return (
    <Shell title={t("Forgot password", "पासवर्ड भूल गए")}>
      {sent ? (
        <div className="space-y-4 text-center">
          <p className="text-sm text-muted-foreground">
            {t(
              "If an account exists for this email, we've sent a link to reset your password. It's valid for 1 hour — check your spam folder too.",
              "यदि इस ईमेल से खाता है, तो हमने पासवर्ड रीसेट करने का लिंक भेज दिया है। यह 1 घंटे तक मान्य है — स्पैम फ़ोल्डर भी देखें।",
            )}
          </p>
          <Link to="/auth" className="text-primary hover:underline text-sm">{t("Back to login", "लॉगिन पर वापस जाएँ")}</Link>
        </div>
      ) : (
        <form onSubmit={submit} className="space-y-4">
          <p className="text-sm text-muted-foreground">{t("Enter your account email and we'll send you a reset link.", "अपना खाता ईमेल दर्ज करें, हम आपको रीसेट लिंक भेजेंगे।")}</p>
          <div className="space-y-2">
            <Label htmlFor="email">{t("Email address", "ईमेल पता")}</Label>
            <Input id="email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          {error && <p role="alert" className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">{error}</p>}
          <Button type="submit" className="w-full" disabled={!ok || busy}>
            {busy && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}{t("Send reset link", "रीसेट लिंक भेजें")}
          </Button>
          <p className="text-center"><Link to="/auth" className="text-sm text-primary hover:underline">{t("Back to login", "लॉगिन पर वापस जाएँ")}</Link></p>
        </form>
      )}
    </Shell>
  );
};

/** /reset-password?token=… — the link from the email (POST auth/reset-password). */
export const ResetPassword = () => {
  const t = useT();
  const [params] = useSearchParams();
  const token = params.get("token") || "";
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const rules = passwordRules(password);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true); setError("");
    try { await api("/auth/reset-password", { body: { token, newPassword: password, confirmPassword: confirm } }); setDone(true); }
    catch (err) { setError(err instanceof Error ? err.message : String(err)); }
    finally { setBusy(false); }
  };

  return (
    <Shell title={t("Set a new password", "नया पासवर्ड सेट करें")}>
      {done ? (
        <div className="space-y-4 text-center">
          <p className="text-sm text-muted-foreground">{t("Your password has been changed. You can now log in.", "आपका पासवर्ड बदल दिया गया है। अब आप लॉगिन कर सकते हैं।")}</p>
          <Button asChild className="w-full"><Link to="/auth">{t("Go to login", "लॉगिन करें")}</Link></Button>
        </div>
      ) : !token ? (
        <p className="text-center text-sm text-muted-foreground">
          {t("This reset link is incomplete. ", "यह रीसेट लिंक अधूरा है। ")}
          <Link to="/forgot-password" className="text-primary hover:underline">{t("Request a new one", "नया लिंक मँगाएँ")}</Link>
        </p>
      ) : (
        <form onSubmit={submit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="password">{t("New password", "नया पासवर्ड")}</Label>
            <PasswordInput id="password" value={password} onChange={setPassword} autoComplete="new-password" />
            {password && (
              <ul className="grid grid-cols-1 gap-0.5 text-xs sm:grid-cols-2">
                {rules.map((r) => <li key={r.en} className={r.ok ? "text-green-600" : "text-muted-foreground"}>{r.ok ? "✓" : "•"} {t(r.en, r.hi)}</li>)}
              </ul>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirm">{t("Confirm new password", "नए पासवर्ड की पुष्टि करें")}</Label>
            <PasswordInput id="confirm" value={confirm} onChange={setConfirm} autoComplete="new-password" />
            {confirm && confirm !== password && <p className="text-xs text-destructive">{t("Passwords don't match.", "पासवर्ड मेल नहीं खाते।")}</p>}
          </div>
          {error && (
            <p role="alert" className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
              {error} <Link to="/forgot-password" className="underline">{t("Request a new link", "नया लिंक मँगाएँ")}</Link>
            </p>
          )}
          <Button type="submit" className="w-full" disabled={busy || !rules.every((r) => r.ok) || password !== confirm}>
            {busy && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}{t("Change password", "पासवर्ड बदलें")}
          </Button>
        </form>
      )}
    </Shell>
  );
};
