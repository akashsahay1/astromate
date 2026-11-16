// Artwork from the client (Arvind ji, 2026-11-16): zodiac portraits and nakshatra symbols.
const zodiacFiles = import.meta.glob("@/assets/zodiac/*.webp", { eager: true, import: "default" }) as Record<string, string>;
const nakshatraFiles = import.meta.glob("@/assets/nakshatra/*.webp", { eager: true, import: "default" }) as Record<string, string>;

const byName = (files: Record<string, string>) =>
  Object.fromEntries(Object.entries(files).map(([path, url]) => [path.split("/").pop()!.replace(".webp", ""), url]));
const zodiac = byName(zodiacFiles);
const nakshatra = byName(nakshatraFiles);

/** Portrait for a sign by English name ("Aries" … "Pisces"). */
export const zodiacImage = (nameEn?: string) => (nameEn ? zodiac[nameEn.toLowerCase()] : undefined);

/** Symbol for a nakshatra by its position, 1 = Ashwini … 27 = Revati. */
export const nakshatraIcon = (position: number) => nakshatra[String(position)];
