import { useQuery } from "@tanstack/react-query";
import { useLang } from "@/hooks/useLang";

// Website content from the Astromate API (MongoDB). File name kept so existing imports work.
export const API = import.meta.env.VITE_API_URL || "https://api.astromate.online/api";

export async function fetchSite<T = any>(table: string, id?: string): Promise<T> {
  const r = await fetch(`${API}/site/${table}${id ? `?id=${encodeURIComponent(id)}` : ""}`);
  if (!r.ok) throw new Error(`${table} ${r.status}`);
  return (await r.json()).data;
}

const useSite = (table: string) => {
  const q = useQuery({ queryKey: ["site", table], queryFn: () => fetchSite<any[]>(table), staleTime: 5 * 60_000 });
  return { data: q.data ?? [], loading: q.isLoading, refetch: q.refetch };
};

export const usePoojaServices = () => useSite("pooja_services");
export const useMantraServices = () => useSite("mantra_services");
export const useProducts = () => useSite("products");
export const useBlogPosts = () => useSite("blog_posts");
export const useHomepageSteps = () => useSite("homepage_steps");
export const useTestimonials = () => useSite("testimonials");
export const useHoroscopes = () => useSite("horoscopes");
export const useNakshatras = () => useSite("nakshatras");
export const useAstrologyArticles = () => useSite("astrology_articles");
export const useManoBeliefs = () => useSite("mano_beliefs");

// Editable section titles (site_content key/value rows)
export function useSiteContent() {
  const { data, loading, refetch } = useSite("site_content");
  const { lang } = useLang();
  const content: Record<string, string> = {};
  data.forEach((r: any) => { content[r.key] = (lang === "en" && r.value_en) || r.value; });
  return { content, loading, refetch };
}
