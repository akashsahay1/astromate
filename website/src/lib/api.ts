// Astromate API client for the website: same endpoints and tokens as the mobile app.
export const API = import.meta.env.VITE_API_URL || "https://api.astromate.online/api";

const KEY = "astromate-auth";
type Tokens = { access_token: string; refresh_token: string };

export const tokens = {
  get(): Tokens | null {
    try { return JSON.parse(localStorage.getItem(KEY) || "null"); } catch { return null; }
  },
  set(t: Tokens | null) {
    try { t ? localStorage.setItem(KEY, JSON.stringify(t)) : localStorage.removeItem(KEY); } catch { /* private mode */ }
    window.dispatchEvent(new Event("astromate-auth"));
  },
};

export class ApiError extends Error {
  constructor(message: string, public status: number, public code?: string, public body?: any) { super(message); }
}

// Single-flight refresh, like the app's dio client.
let refreshing: Promise<boolean> | null = null;
function refresh(): Promise<boolean> {
  return (refreshing ??= (async () => {
    const t = tokens.get();
    if (!t?.refresh_token) return false;
    try {
      const r = await fetch(`${API}/auth/refresh`, {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ refresh_token: t.refresh_token }),
      });
      const j = await r.json();
      const d = j.data ?? j;
      if (!r.ok || !d?.access_token) return false;
      tokens.set({ access_token: d.access_token, refresh_token: d.refresh_token ?? t.refresh_token });
      return true;
    } catch { return false; }
  })().finally(() => { refreshing = null; }));
}

/**
 * Call the API. JSON in, JSON out. Sends the access token when logged in, refreshes it once on 401,
 * and throws ApiError with the server's message on failure. Pass FormData as body for uploads.
 */
export async function api<T = any>(path: string, opts: { method?: string; body?: unknown; retry?: boolean } = {}): Promise<T> {
  const t = tokens.get();
  const isForm = opts.body instanceof FormData;
  const r = await fetch(`${API}${path}`, {
    method: opts.method || (opts.body ? "POST" : "GET"),
    headers: { ...(isForm ? {} : { "Content-Type": "application/json" }), ...(t && { Authorization: `Bearer ${t.access_token}` }) },
    body: opts.body === undefined ? undefined : isForm ? (opts.body as FormData) : JSON.stringify(opts.body),
  });
  if (r.status === 401 && t && opts.retry !== false && (await refresh())) return api<T>(path, { ...opts, retry: false });
  let j: any = null;
  try { j = await r.json(); } catch { /* empty body */ }
  if (!r.ok || j?.success === false) {
    if (r.status === 401 && t) tokens.set(null); // session over
    throw new ApiError(j?.message || j?.error || `Request failed (${r.status})`, r.status, j?.error, j);
  }
  return j as T;
}
