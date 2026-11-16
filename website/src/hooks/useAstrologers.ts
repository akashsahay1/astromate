import { useQuery } from "@tanstack/react-query";
import { useLang } from "@/hooks/useLang";

// Verified astrologers from the Astromate backend (same list the app shows).
const API = import.meta.env.VITE_API_URL || "https://api.astromate.online/api";

const hindi: Record<string, string> = {
  Hindi: "हिंदी", English: "अंग्रेजी", Sanskrit: "संस्कृत", Bengali: "बंगाली", Marathi: "मराठी", Gujarati: "गुजराती",
  Punjabi: "पंजाबी", Tamil: "तमिल", Telugu: "तेलुगु", Kannada: "कन्नड़", Malayalam: "मलयालम", Odia: "ओड़िया",
};

export type Astrologer = {
  id: string;
  name: string;
  specialty: string;
  languages: string[];
  experienceYears: number;
  consultations: number;
  chatPrice: number;
  callPrice: number;
  rating: number;
  available: boolean;
  image: string;
  about: string;
};

type ApiAstrologer = {
  id: string; full_name: string; skills?: string[]; languages?: string[]; experience_years?: number;
  total_consultations?: number; chat_rate: number; call_rate: number; rating?: number; is_online?: boolean;
  profile_image?: string | null; bio?: string;
};

export function useAstrologers() {
  const { lang } = useLang();
  return useQuery({
    queryKey: ["astrologers"],
    staleTime: 60_000,
    queryFn: async (): Promise<Astrologer[]> => {
      const r = await fetch(`${API}/astrologers/available?featured=false&limit=50`);
      if (!r.ok) throw new Error(`astrologers ${r.status}`);
      const j = await r.json();
      return (j.data?.astrologers ?? []).map((a: ApiAstrologer) => ({
        id: a.id,
        name: a.full_name,
        specialty: (a.skills ?? []).join(", "),
        languages: a.languages ?? [],
        experienceYears: a.experience_years ?? 0,
        consultations: a.total_consultations ?? 0,
        chatPrice: a.chat_rate,
        callPrice: a.call_rate,
        rating: a.rating ?? 0,
        available: !!a.is_online,
        image: a.profile_image || "/placeholder.svg",
        about: a.bio ?? "",
      }));
    },
    // Languages arrive in English from the API; show Hindi names when the site is in Hindi.
    select: (list) => (lang === "hi" ? list.map((a) => ({ ...a, languages: a.languages.map((l) => hindi[l] ?? l) })) : list),
  });
}
