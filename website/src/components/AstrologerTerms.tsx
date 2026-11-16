import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { ASTROLOGER_TERMS, ASTROLOGER_TERMS_INTRO, ASTROLOGER_TERMS_INTRO_EN, TERMS_EFFECTIVE_DATE } from "@/data/astrologerTerms";
import { useLang, useT } from "@/hooks/useLang";

export function AstrologerTermsContent() {
  const t = useT();
  const { lang } = useLang();
  return (
    <div className="space-y-5 text-sm">
      <p className="text-xs text-muted-foreground">{t("Effective Date", "प्रभावी तिथि")}: {TERMS_EFFECTIVE_DATE}</p>
      <p className="text-muted-foreground">{t(ASTROLOGER_TERMS_INTRO_EN, ASTROLOGER_TERMS_INTRO)}</p>
      {ASTROLOGER_TERMS.map((s) => (
        <div key={s.title} className="space-y-1.5">
          <h3 className="font-semibold text-foreground">{t(s.titleEn, s.title)}</h3>
          {s.intro && <p className="text-muted-foreground">{t(s.introEn ?? s.intro, s.intro)}</p>}
          <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
            {(lang === "en" ? s.pointsEn : s.points).map((p, i) => (
              <li key={i}>{p}</li>
            ))}
          </ul>
        </div>
      ))}
      <p className="text-xs text-muted-foreground border-t pt-3">
        {t(
          "By completing registration, you confirm that you have read, understood and accepted these terms and conditions.",
          "रजिस्ट्रेशन पूरा करके आप पुष्टि करते हैं कि आपने इन नियमों व शर्तों को पढ़ा, समझा और स्वीकार किया है।"
        )}
      </p>
    </div>
  );
}

export function AstrologerTermsDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const t = useT();
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{t("Astrologer / Pandit — Terms & Conditions", "Astrologer / Pandit — नियम व शर्तें")}</DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[65vh] pr-4">
          <AstrologerTermsContent />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

export function TermsAgreementCheckbox({
  checked,
  onChange,
  id = "astro-terms",
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  id?: string;
}) {
  const [open, setOpen] = useState(false);
  const t = useT();
  return (
    <>
      <div className="flex items-start gap-2 rounded-xl border border-border bg-muted/40 p-3">
        <Checkbox id={id} checked={checked} onCheckedChange={(v) => onChange(v === true)} className="mt-0.5" />
        <label htmlFor={id} className="text-xs leading-relaxed text-muted-foreground cursor-pointer">
          {t("I have read the Astrologer / Pandit", "मैंने Astrologer / Pandit")}{" "}
          <button
            type="button"
            onClick={(e) => { e.preventDefault(); setOpen(true); }}
            className="text-primary underline font-medium"
          >
            {t("Terms & Conditions", "नियम व शर्तें")}
          </button>{" "}
          {t("and fully accept them.", "पढ़ ली हैं और उन्हें पूरी तरह स्वीकार करता/करती हूँ।")}
        </label>
      </div>
      <AstrologerTermsDialog open={open} onOpenChange={setOpen} />
    </>
  );
}
