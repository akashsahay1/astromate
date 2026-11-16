import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useLang, useT } from "@/hooks/useLang";
import { computeMatch, verdictFor, type Person } from "@/lib/kundliMilan";

const emptyPerson: Person = { name: "", gender: "Male", dob: "", tob: "", pob: "" };

const PersonForm = ({
  title,
  value,
  onChange,
}: {
  title: string;
  value: Person;
  onChange: (p: Person) => void;
}) => {
  const t = useT();
  return (
  <div className="space-y-4">
    <h3 className="text-sm font-bold text-foreground">{title}</h3>

    <div className="space-y-1.5">
      <Label className="text-xs uppercase tracking-wide text-muted-foreground">Name*</Label>
      <Input value={value.name} onChange={(e) => onChange({ ...value, name: e.target.value })} placeholder={t("Full name", "पूरा नाम")} />
    </div>

    <div className="space-y-1.5">
      <Label className="text-xs uppercase tracking-wide text-muted-foreground">Gender</Label>
      <div className="flex gap-2">
        {["Male", "Female", "Other"].map((g) => (
          <button
            key={g}
            type="button"
            onClick={() => onChange({ ...value, gender: g })}
            className={`flex-1 rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
              value.gender === g
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-background text-muted-foreground hover:border-primary/40"
            }`}
          >
            {g}
          </button>
        ))}
      </div>
    </div>

    <div className="grid grid-cols-2 gap-3">
      <div className="space-y-1.5">
        <Label className="text-xs uppercase tracking-wide text-muted-foreground">Birth Date*</Label>
        <Input type="date" value={value.dob} onChange={(e) => onChange({ ...value, dob: e.target.value })} />
      </div>
      <div className="space-y-1.5">
        <Label className="text-xs uppercase tracking-wide text-muted-foreground">Birth Time</Label>
        <Input type="time" value={value.tob} onChange={(e) => onChange({ ...value, tob: e.target.value })} />
      </div>
    </div>

    <div className="space-y-1.5">
      <Label className="text-xs uppercase tracking-wide text-muted-foreground">Birth Place*</Label>
      <Input value={value.pob} onChange={(e) => onChange({ ...value, pob: e.target.value })} placeholder={t("City, State, Country", "शहर, राज्य, देश")} />
    </div>
  </div>
  );
};

const KundliMilan = () => {
  const t = useT();
  const { lang } = useLang();
  const [you, setYou] = useState<Person>({ ...emptyPerson });
  const [partner, setPartner] = useState<Person>({ ...emptyPerson, gender: "Female" });
  const [error, setError] = useState(false);
  const [result, setResult] = useState<ReturnType<typeof computeMatch> | null>(null);

  const handleMatch = () => {
    const ok = [you, partner].every((p) => p.name.trim() && p.dob && p.pob.trim());
    if (!ok) {
      setError(true);
      setResult(null);
      return;
    }
    setError(false);
    setResult(computeMatch(you, partner));
  };

  const fmt = (n: number) => (Number.isInteger(n) ? n : n.toFixed(1));
  const verdict = result ? verdictFor(result.total) : null;
  const toneClass =
    verdict?.tone === "good" ? "text-primary" : verdict?.tone === "avg" ? "text-[hsl(var(--hero-saffron))]" : "text-destructive";

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-border bg-card p-6 shadow-lg">
        <h2 className="mb-5 text-lg font-bold text-foreground">{t("Enter the birth details of the bride and groom", "वर एवं वधू की जन्म जानकारी दर्ज करें")}</h2>
        <div className="grid gap-8 md:grid-cols-2">
          <PersonForm title={t("Your details", "आपकी जानकारी")} value={you} onChange={setYou} />
          <PersonForm title={t("Partner's details", "साथी की जानकारी")} value={partner} onChange={setPartner} />
        </div>

        <div className="mt-6 text-center">
          <Button
            onClick={handleMatch}
            className="w-full py-6 text-base font-semibold sm:w-auto sm:px-10"
          >
            {t("Match Kundli", "कुंडली मिलान करें")} →
          </Button>
          {error && <p className="mt-3 text-sm text-destructive">{t("Please fill in all fields marked *.", "कृपया * वाले सभी फ़ील्ड भरें।")}</p>}
        </div>
      </div>

      {result && verdict && (
        <div className="rounded-2xl border border-border bg-card p-6 shadow-lg">
          <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-center">
            <div className="flex h-24 w-24 shrink-0 flex-col items-center justify-center rounded-full bg-primary text-primary-foreground">
              <span className="text-3xl font-bold leading-none">{fmt(result.total)}</span>
              <span className="text-xs opacity-80">/ 36</span>
            </div>
            <div className="text-center sm:text-left">
              <p className="font-semibold text-foreground">
                {you.name} ({you.gender}) &amp; {partner.name} ({partner.gender})
              </p>
              <p className={`text-lg font-bold ${toneClass}`}>
                {t(verdict.labelEn, verdict.label)} · {Math.round((result.total / 36) * 100)}%
              </p>
              <p className="mt-1 text-sm text-muted-foreground">{t(verdict.subEn, verdict.sub)}</p>
            </div>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {[
              { p: you, c: result.chartYou },
              { p: partner, c: result.chartPartner },
            ].map(({ p, c }) => (
              <div key={p.name} className="rounded-xl border border-border bg-secondary/40 p-4 text-sm">
                <p className="font-semibold text-foreground">{t(`${p.name}'s birth details`, `${p.name} की जन्म जानकारी`)}</p>
                <p className="mt-1 text-muted-foreground">
                  {t(`Moon sign: ${c.rashi} · Nakshatra: ${c.nak.name} (Pada ${c.pada})`, `चंद्र राशि: ${c.rashiHi} (${c.rashi}) · नक्षत्र: ${c.nak.name} (पद ${c.pada})`)}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-6 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
                  <th className="py-2 pr-3">{t("Koota", "कूट")}</th>
                  <th className="py-2 pr-3">{t("What it shows", "क्या दर्शाता है")}</th>
                  <th className="py-2 text-right">{t("Points", "अंक")}</th>
                </tr>
              </thead>
              <tbody>
                {result.rows.map((r) => (
                  <tr key={r.name} className="border-b border-border/60">
                    <td className="py-2 pr-3 font-semibold text-foreground">{t(r.name, r.nameHi)}{lang === "hi" && <> <span className="font-normal text-muted-foreground">({r.name})</span></>}</td>
                    <td className="py-2 pr-3 text-muted-foreground">{t(r.descEn, r.desc)}</td>
                    <td className="py-2 text-right font-semibold text-foreground">{fmt(r.pts)} / {r.max}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="mt-5 text-xs leading-relaxed text-muted-foreground">
            {t("This is calculated from the Moon's actual position (Nakshatra and Rashi) at birth, using classical Ashtakoot Guna Milan rules and the Lahiri ayanamsa. Birth time is taken as IST (UTC+5:30); if no time is given, 12:00 noon is used. Manglik Dosha is not included here. Always consult a qualified astrologer before making marriage decisions.", "यह गणना जन्म समय पर चंद्रमा की वास्तविक स्थिति (नक्षत्र एवं राशि) से शास्त्रीय अष्टकूट गुण मिलान नियमों और लाहिड़ी अयनांश के आधार पर की गई है। जन्म समय IST (UTC+5:30) माना गया है; समय न देने पर दोपहर 12:00 लिया जाता है। मंगल दोष यहाँ सम्मिलित नहीं है। विवाह संबंधी निर्णय हेतु योग्य ज्योतिषी से परामर्श अवश्य लें।")}
          </p>
        </div>
      )}
    </div>
  );
};

export default KundliMilan;
