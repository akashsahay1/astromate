import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { api, tokens } from "@/lib/api";

// Logged-in Astromate user (same account as the app). Fields as returned by GET /users/profile.
export type AuthUser = {
  id: string;
  user_id: string;
  user_type: "customer" | "astrologer" | string;
  full_name?: string;
  email_address?: string;
  phone_number?: string;
  country_code?: string;
  profile_image?: string | null;
  account_status?: string;
  verification_status?: string;
  rejection_reason?: string;
  wallet_balance?: number;
  [key: string]: any;
};

type AuthContextType = {
  user: AuthUser | null;
  loading: boolean;
  /** Store tokens from verify-otp / register and load the profile. */
  login: (t: { access_token: string; refresh_token: string }) => Promise<AuthUser | null>;
  /** Re-fetch the profile (after edits, recharge, approval…). */
  refreshUser: () => Promise<AuthUser | null>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  user: null, loading: true, login: async () => null, refreshUser: async () => null, signOut: async () => {},
});

const fetchProfile = async (): Promise<AuthUser | null> => {
  if (!tokens.get()) return null;
  try {
    const j = await api("/users/profile");
    const u = j.data?.user ?? j.user ?? j.data;
    return u ? { ...u, id: u.user_id ?? u.id } : null;
  } catch { return null; }
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    const u = await fetchProfile();
    setUser(u);
    return u;
  }, []);

  useEffect(() => {
    refreshUser().finally(() => setLoading(false));
    // another tab logged in/out, or the API client dropped an expired session
    const onChange = () => { if (!tokens.get()) setUser(null); };
    window.addEventListener("astromate-auth", onChange);
    window.addEventListener("storage", refreshUser);
    return () => { window.removeEventListener("astromate-auth", onChange); window.removeEventListener("storage", refreshUser); };
  }, [refreshUser]);

  const login = useCallback(async (t: { access_token: string; refresh_token: string }) => {
    tokens.set(t);
    return refreshUser();
  }, [refreshUser]);

  const signOut = useCallback(async () => {
    const t = tokens.get();
    if (t) api("/auth/logout", { method: "POST", body: { refresh_token: t.refresh_token } }).catch(() => {});
    tokens.set(null);
    setUser(null);
  }, []);

  return <AuthContext.Provider value={{ user, loading, login, refreshUser, signOut }}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
