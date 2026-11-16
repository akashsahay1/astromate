import { useState } from "react";
import { Navigate } from "react-router-dom";
import { AlertTriangle, CheckCircle2, Clock, Loader2, LogOut, Pencil, Smartphone, Star } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useAuth, type AuthUser } from "@/hooks/useAuth";
import { useLang, useT } from "@/hooks/useLang";
import ProfileForm, { toList } from "./ProfileForm";

/** Mirrors isAstrologerProfileComplete in admin/src/app/api/users/profile/route.ts (what sets profile_submitted_at). */
const isComplete = (u: AuthUser) =>
  !!String(u.full_name ?? "").trim() && !!String(u.email_address ?? "").trim() && u.email_verified === true
  && !!String(u.bio ?? "").trim() && Number(u.experience_years) > 0
  && toList(u.languages).length > 0 && toList(u.skills).length > 0
  && [u.chat_rate, u.call_rate, u.video_rate].some((r) => Number(r) > 0);

/**
 * /astrologer — the astrologer's web home through the whole approval lifecycle:
 * incomplete → profile form; complete → under review; rejected → reason + fix & resubmit; verified → go to the app.
 */
const AstrologerHome = () => {
  const t = useT();
  const { user, loading, signOut } = useAuth();
  const [editing, setEditing] = useState(false);
  const [saved, setSaved] = useState(false);

  if (loading) return <Shell><Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" /></Shell>;
  if (!user) return <Navigate to="/auth?role=astrologer" replace />;
  if (user.user_type !== "astrologer") return <Navigate to="/account" replace />;

  const status = user.verification_status;
  const done = () => { setEditing(false); setSaved(true); };
  const form = (title: string, intro: string, label: string) => (
    <>
      <Header title={title} intro={intro} />
      {editing && <button onClick={() => setEditing(false)} className="mb-4 text-sm text-primary hover:underline">← {t("Cancel editing", "संपादन रद्द करें")}</button>}
      <ProfileForm user={user} onDone={done} submitLabel={label} />
    </>
  );

  let body: React.ReactNode;
  if (status === "verified") {
    body = <Approved user={user} />;
  } else if (status === "rejected") {
    body = editing
      ? form(t("Update your profile", "अपनी प्रोफ़ाइल अपडेट करें"), t("Fix the points mentioned by our team and resubmit.", "हमारी टीम द्वारा बताए गए बिंदु ठीक करें और फिर से जमा करें।"), t("Resubmit for review", "समीक्षा के लिए फिर से जमा करें"))
      : (
        <div className="space-y-5">
          <Card tone="destructive" icon={<AlertTriangle className="h-7 w-7" />} title={t("Your profile needs changes", "आपकी प्रोफ़ाइल में बदलाव चाहिए")}>
            <p>{t("Our team reviewed your profile and could not approve it yet.", "हमारी टीम ने आपकी प्रोफ़ाइल देखी पर अभी स्वीकृत नहीं कर सकी।")}</p>
            <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-destructive">{t("Reason", "कारण")}</p>
              <p className="mt-1 whitespace-pre-line text-foreground">{user.rejection_reason || t("No reason provided", "कोई कारण नहीं दिया गया")}</p>
            </div>
            {saved && <p className="text-sm text-green-700">{t("Changes saved. Our team will review your updated profile.", "बदलाव सहेजे गए। हमारी टीम आपकी अपडेट प्रोफ़ाइल की समीक्षा करेगी।")}</p>}
            <Button onClick={() => { setSaved(false); setEditing(true); }}><Pencil className="mr-2 h-4 w-4" />{t("Fix & resubmit", "ठीक करें और फिर से जमा करें")}</Button>
          </Card>
          <Summary user={user} />
        </div>
      );
  } else if (editing || !isComplete(user)) {
    body = form(
      editing ? t("Edit your profile", "अपनी प्रोफ़ाइल संपादित करें") : t("Complete your astrologer profile", "अपनी ज्योतिषी प्रोफ़ाइल पूरी करें"),
      t("Fill in all sections below. Once submitted, our team reviews your profile — usually within 24–48 hours.", "नीचे सभी भाग भरें। जमा करने के बाद हमारी टीम आपकी प्रोफ़ाइल की समीक्षा करती है — आमतौर पर 24–48 घंटों में।"),
      editing ? t("Save changes", "बदलाव सहेजें") : t("Submit for approval", "स्वीकृति के लिए जमा करें"),
    );
  } else {
    body = <Pending user={user} onEdit={() => setEditing(true)} />;
  }

  return (
    <Shell>
      {body}
      <button onClick={signOut} className="mx-auto mt-8 flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
        <LogOut className="h-4 w-4" />{t("Log out", "लॉग आउट")}
      </button>
    </Shell>
  );
};

const Shell = ({ children }: { children: React.ReactNode }) => (
  <div className="min-h-screen bg-background flex flex-col">
    <Navbar />
    <main className="flex-1 container mx-auto px-4 py-10 lg:py-14"><div className="mx-auto max-w-3xl">{children}</div></main>
    <Footer />
  </div>
);

const Header = ({ title, intro }: { title: string; intro: string }) => (
  <div className="mb-6 text-center">
    <h1 className="text-2xl lg:text-3xl font-bold text-primary">{title}</h1>
    <p className="mt-2 text-sm text-muted-foreground">{intro}</p>
  </div>
);

const Card = ({ tone, icon, title, children }: { tone: "primary" | "destructive" | "success"; icon: React.ReactNode; title: string; children: React.ReactNode }) => {
  const c = { primary: "bg-primary/10 text-primary", destructive: "bg-destructive/10 text-destructive", success: "bg-green-100 text-green-700" }[tone];
  return (
    <div className="rounded-2xl border bg-card p-6 lg:p-8 shadow-lg space-y-4 text-muted-foreground">
      <div className="flex items-center gap-3">
        <span className={`rounded-full p-3 ${c}`}>{icon}</span>
        <h1 className="text-xl lg:text-2xl font-bold text-foreground">{title}</h1>
      </div>
      {children}
    </div>
  );
};

const fmtDate = (d: unknown, lang: string) => {
  const x = d ? new Date(String(d)) : null;
  return x && !isNaN(+x) ? x.toLocaleDateString(lang === "hi" ? "hi-IN" : "en-IN", { day: "numeric", month: "long", year: "numeric" }) : null;
};

const Pending = ({ user, onEdit }: { user: AuthUser; onEdit: () => void }) => {
  const t = useT();
  const { lang } = useLang();
  const submitted = fmtDate(user.profile_submitted_at, lang);
  return (
    <div className="space-y-5">
      <Card tone="primary" icon={<Clock className="h-7 w-7" />} title={t("Your profile is under review", "आपकी प्रोफ़ाइल की समीक्षा हो रही है")}>
        <p>{t("Thanks for joining Astromate! Our team is verifying your details. This usually takes 24–48 hours.", "Astromate से जुड़ने के लिए धन्यवाद! हमारी टीम आपके विवरण की जाँच कर रही है। इसमें आमतौर पर 24–48 घंटे लगते हैं।")}</p>
        {submitted && <p className="text-sm">{t("Submitted on", "जमा करने की तिथि")}: <strong className="text-foreground">{submitted}</strong></p>}
        <div>
          <p className="font-semibold text-foreground">{t("What happens next", "आगे क्या होगा")}</p>
          <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm">
            <li>{t("We check your profile, experience and bank details.", "हम आपकी प्रोफ़ाइल, अनुभव और बैंक विवरण जाँचते हैं।")}</li>
            <li>{t("You get an email once you're approved — or told what to fix.", "स्वीकृति मिलने पर — या क्या ठीक करना है — आपको ईमेल मिलेगा।")}</li>
            <li>{t("After approval, go online in the Astromate app and start taking consultations.", "स्वीकृति के बाद Astromate ऐप में ऑनलाइन होकर परामर्श शुरू करें।")}</li>
          </ol>
        </div>
        <p className="text-sm">{t("You can still update your profile while waiting.", "प्रतीक्षा के दौरान भी आप अपनी प्रोफ़ाइल अपडेट कर सकते हैं।")}</p>
        <div className="flex flex-wrap gap-3">
          <Button variant="outline" onClick={onEdit}><Pencil className="mr-2 h-4 w-4" />{t("Edit profile", "प्रोफ़ाइल संपादित करें")}</Button>
          <Button asChild variant="ghost"><a href="/#app-download"><Smartphone className="mr-2 h-4 w-4" />{t("Get the app", "ऐप पाएँ")}</a></Button>
        </div>
      </Card>
      <Summary user={user} />
    </div>
  );
};

const Approved = ({ user }: { user: AuthUser }) => {
  const t = useT();
  return (
    <div className="space-y-5">
      <Card tone="success" icon={<CheckCircle2 className="h-7 w-7" />} title={t("You're approved!", "आप स्वीकृत हो गए हैं!")}>
        <p>{t("Welcome to Astromate. Your profile is live for customers.", "Astromate में आपका स्वागत है। आपकी प्रोफ़ाइल ग्राहकों के लिए लाइव है।")}</p>
        <Button asChild size="lg" className="w-full sm:w-auto">
          <a href="/#app-download"><Smartphone className="mr-2 h-5 w-5" />{t("Continue in the Astromate app to go online and take consultations", "ऑनलाइन होने और परामर्श लेने के लिए Astromate ऐप में जारी रखें")}</a>
        </Button>
      </Card>
      <Summary user={user} showStats />
    </div>
  );
};

/** Read-only view of what customers / the review team see. */
const Summary = ({ user, showStats }: { user: AuthUser; showStats?: boolean }) => {
  const t = useT();
  const rows: [string, React.ReactNode][] = [
    [t("Experience", "अनुभव"), user.experience_years ? `${user.experience_years} ${t("years", "वर्ष")}` : "—"],
    [t("Skills", "कौशल"), toList(user.skills).join(", ") || "—"],
    [t("Languages", "भाषाएँ"), toList(user.languages).join(", ") || "—"],
    [t("Qualifications", "योग्यताएँ"), toList(user.qualifications).join(", ") || "—"],
    [t("Location", "स्थान"), [user.city, user.state].filter(Boolean).join(", ") || "—"],
  ];
  return (
    <div className="rounded-2xl border bg-card p-6 shadow-sm">
      <div className="flex items-center gap-4">
        <div className="h-16 w-16 shrink-0 overflow-hidden rounded-full bg-secondary">
          {user.profile_image && <img src={user.profile_image} alt="" className="h-full w-full object-cover" />}
        </div>
        <div className="min-w-0">
          <p className="truncate text-lg font-semibold">{user.full_name}</p>
          <p className="truncate text-sm text-muted-foreground">{user.email_address}{user.phone_number && ` · ${user.phone_number}`}</p>
          {showStats && (
            <p className="mt-1 flex items-center gap-1 text-sm">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              {Number(user.rating || 0).toFixed(1)} · {user.total_reviews || 0} {t("reviews", "समीक्षाएँ")} · {user.total_consultations || 0} {t("consultations", "परामर्श")}
            </p>
          )}
        </div>
      </div>
      <div className="mt-5 grid grid-cols-3 gap-3 text-center">
        {([["chat_rate", t("Chat", "चैट")], ["call_rate", t("Call", "कॉल")], ["video_rate", t("Video", "वीडियो")]] as const).map(([k, l]) => (
          <div key={k} className="rounded-xl bg-secondary p-3">
            <p className="text-xs text-muted-foreground">{l}</p>
            <p className="font-semibold text-primary">₹{user[k] || 0}<span className="text-xs text-muted-foreground">/{t("min", "मिनट")}</span></p>
          </div>
        ))}
      </div>
      <dl className="mt-5 space-y-2 text-sm">
        {rows.map(([k, v]) => (
          <div key={k} className="flex gap-3"><dt className="w-28 shrink-0 text-muted-foreground">{k}</dt><dd className="min-w-0 break-words">{v}</dd></div>
        ))}
      </dl>
      {user.bio && <p className="mt-4 whitespace-pre-line border-t pt-4 text-sm text-muted-foreground">{user.bio}</p>}
    </div>
  );
};

export default AstrologerHome;
