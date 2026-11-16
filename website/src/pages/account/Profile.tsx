import { useState } from "react";
import { Camera, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/api";
import { useAuth, type AuthUser } from "@/hooks/useAuth";
import { useT } from "@/hooks/useLang";
import { useToast } from "@/hooks/use-toast";
import { Panel } from "./shared";

// The app stores birth time as "hh:mm AM" and date of birth as an ISO string; <input> wants "HH:mm" and "YYYY-MM-DD".
const toInputTime = (s = "") => {
  const m = s.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)?$/i);
  if (!m) return "";
  let h = +m[1] % 12;
  if (m[3]?.toUpperCase() === "PM") h += 12;
  else if (!m[3]) h = +m[1];
  return `${String(h).padStart(2, "0")}:${m[2]}`;
};
const toAppTime = (s: string) => {
  if (!s) return "";
  const [h, m] = s.split(":").map(Number);
  return `${String(h % 12 || 12).padStart(2, "0")}:${String(m).padStart(2, "0")} ${h < 12 ? "AM" : "PM"}`;
};

const fromUser = (u: AuthUser) => ({
  full_name: u.full_name || "", gender: u.gender || "", date_of_birth: String(u.date_of_birth || "").slice(0, 10),
  birth_time: toInputTime(u.birth_time), birth_place: u.birth_place || "",
  address: u.address || "", city: u.city || "", state: u.state || "", zip: u.zip || "",
});

const selectCls = "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

const Profile = () => {
  const t = useT();
  const { toast } = useToast();
  const { user, refreshUser } = useAuth();
  const [form, setForm] = useState(() => fromUser(user!));
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setForm({ ...form, [k]: e.target.value });

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.full_name.trim()) return toast({ title: t("Please enter your name", "कृपया अपना नाम लिखें"), variant: "destructive" });
    setSaving(true);
    try {
      await api("/users/profile", {
        method: "PUT",
        body: {
          ...form, full_name: form.full_name.trim(),
          date_of_birth: form.date_of_birth ? `${form.date_of_birth}T00:00:00.000` : "",
          birth_time: toAppTime(form.birth_time),
        },
      });
      const u = await refreshUser();
      if (u) setForm(fromUser(u));
      toast({ title: t("Profile saved", "प्रोफ़ाइल सेव हो गई") });
    } catch (err) {
      toast({ title: t("Could not save", "सेव नहीं हो सका"), description: (err as Error).message, variant: "destructive" });
    } finally { setSaving(false); }
  };

  const upload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) return toast({ title: t("Image must be under 10 MB", "फ़ोटो 10 MB से छोटी होनी चाहिए"), variant: "destructive" });
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("profile_image", file);
      await api("/users/profile", { method: "PUT", body: fd });
      await refreshUser();
      toast({ title: t("Photo updated", "फ़ोटो बदल गई") });
    } catch (err) {
      toast({ title: t("Upload failed", "अपलोड नहीं हुआ"), description: (err as Error).message, variant: "destructive" });
    } finally { setUploading(false); }
  };

  const field = (k: keyof typeof form, label: string, type = "text") => (
    <div className="space-y-1.5">
      <Label htmlFor={k}>{label}</Label>
      <Input id={k} type={type} value={form[k]} onChange={set(k)} />
    </div>
  );

  return (
    <div className="space-y-6">
    <Panel title={t("My profile", "मेरी प्रोफ़ाइल")}>
      <div className="flex items-center gap-4 mb-6">
        {user?.profile_image
          ? <img src={user.profile_image} alt="" className="w-20 h-20 rounded-full object-cover border" />
          : <div className="w-20 h-20 rounded-full bg-primary/10 text-primary flex items-center justify-center text-2xl font-bold">{(user?.full_name || "?")[0].toUpperCase()}</div>}
        <Button asChild variant="outline" size="sm" disabled={uploading}>
          <label className="cursor-pointer">
            {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Camera className="w-4 h-4" />}
            {t("Change photo", "फ़ोटो बदलें")}
            <input type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={upload} disabled={uploading} />
          </label>
        </Button>
      </div>

      <form onSubmit={save} className="grid sm:grid-cols-2 gap-4">
        {field("full_name", t("Full name", "पूरा नाम"))}
        <div className="space-y-1.5">
          <Label htmlFor="gender">{t("Gender", "लिंग")}</Label>
          <select id="gender" value={form.gender} onChange={set("gender")} className={selectCls}>
            <option value="">{t("Select", "चुनें")}</option>
            <option value="male">{t("Male", "पुरुष")}</option>
            <option value="female">{t("Female", "महिला")}</option>
            <option value="other">{t("Other", "अन्य")}</option>
          </select>
        </div>
        <div className="space-y-1.5">
          <Label>{t("Phone number", "फ़ोन नंबर")}</Label>
          <Input value={user?.phone_number || ""} disabled />
        </div>
        <div className="space-y-1.5">
          {/* ponytail: email change needs the app's OTP verification flow, so it is read-only here */}
          <Label>{t("Email", "ईमेल")}</Label>
          <Input value={user?.email_address || ""} disabled placeholder="—" />
        </div>
        {field("date_of_birth", t("Date of birth", "जन्म तिथि"), "date")}
        {field("birth_time", t("Time of birth", "जन्म समय"), "time")}
        {field("birth_place", t("Place of birth", "जन्म स्थान"))}
        {field("city", t("City", "शहर"))}
        {field("state", t("State", "राज्य"))}
        {field("zip", t("PIN code", "पिन कोड"))}
        <div className="sm:col-span-2">{field("address", t("Address", "पता"))}</div>
        <div className="sm:col-span-2">
          <Button type="submit" disabled={saving} className="w-full sm:w-auto">
            {saving && <Loader2 className="w-4 h-4 animate-spin" />}{t("Save changes", "बदलाव सेव करें")}
          </Button>
        </div>
      </form>
    </Panel>
    <ChangePassword />
    </div>
  );
};

const ChangePassword = () => {
  const t = useT();
  const { toast } = useToast();
  const [pw, setPw] = useState({ current: "", next: "", confirm: "" });
  const [saving, setSaving] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pw.next.length < 8) return toast({ title: t("New password must be at least 8 characters", "नया पासवर्ड कम से कम 8 अक्षर का होना चाहिए"), variant: "destructive" });
    if (pw.next !== pw.confirm) return toast({ title: t("Passwords do not match", "पासवर्ड मेल नहीं खाते"), variant: "destructive" });
    setSaving(true);
    try {
      await api("/auth/change-password", { body: { current_password: pw.current, new_password: pw.next } });
      setPw({ current: "", next: "", confirm: "" });
      toast({ title: t("Password changed", "पासवर्ड बदल गया") });
    } catch (err) {
      toast({ title: t("Could not change password", "पासवर्ड नहीं बदल सका"), description: (err as Error).message, variant: "destructive" });
    } finally { setSaving(false); }
  };

  const input = (k: keyof typeof pw, label: string, autoComplete: string) => (
    <div className="space-y-1.5">
      <Label htmlFor={`pw-${k}`}>{label}</Label>
      <Input id={`pw-${k}`} type="password" autoComplete={autoComplete} required value={pw[k]} onChange={(e) => setPw({ ...pw, [k]: e.target.value })} />
    </div>
  );

  return (
    <Panel title={t("Change password", "पासवर्ड बदलें")}>
      <form onSubmit={submit} className="grid sm:grid-cols-3 gap-4">
        {input("current", t("Current password", "मौजूदा पासवर्ड"), "current-password")}
        {input("next", t("New password", "नया पासवर्ड"), "new-password")}
        {input("confirm", t("Confirm new password", "नया पासवर्ड दोबारा"), "new-password")}
        <div className="sm:col-span-3">
          <Button type="submit" disabled={saving} className="w-full sm:w-auto">
            {saving && <Loader2 className="w-4 h-4 animate-spin" />}{t("Update password", "पासवर्ड अपडेट करें")}
          </Button>
        </div>
      </form>
    </Panel>
  );
};

export default Profile;
