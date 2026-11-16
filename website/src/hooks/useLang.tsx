import { createContext, useContext, useEffect, useState } from "react";

// Site language: English by default, Hindi when the visitor switches. Remembered in this browser.
export type Lang = "en" | "hi";
const KEY = "astromate-lang";

const read = (): Lang => {
  try { return localStorage.getItem(KEY) === "hi" ? "hi" : "en"; } catch { return "en"; }
};

const LangContext = createContext<{ lang: Lang; setLang: (l: Lang) => void }>({ lang: "en", setLang: () => {} });

export function LangProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>(read);
  useEffect(() => {
    document.documentElement.lang = lang;
    try { localStorage.setItem(KEY, lang); } catch { /* private mode */ }
  }, [lang]);
  return <LangContext.Provider value={{ lang, setLang: setLangState }}>{children}</LangContext.Provider>;
}

export const useLang = () => useContext(LangContext);

/** Pick the string for the current language: t("Home", "होम") */
export const useT = () => {
  const { lang } = useLang();
  return (en: string, hi: string) => (lang === "hi" ? hi : en);
};

/**
 * Pick a field from an API/database row for the current language: pick(row, "name") returns row.name_en in English
 * (falling back to the Hindi row.name if no translation exists), and row.name in Hindi. Works for nested values too.
 */
export const usePick = () => {
  const { lang } = useLang();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (row: any, field: string) => (lang === "en" && row?.[`${field}_en`] != null ? row[`${field}_en`] : row?.[field]);
};
