import { createContext, useContext } from "react";

// ponytail: no website login yet — accounts live in the Astromate app; /auth shows the GetApp page.
// When website login is added, back this with the API's /auth endpoints (same OTP flow as the app).
type AuthUser = { id: string; email?: string; user_metadata?: Record<string, string> };
type AuthContextType = { user: AuthUser | null; loading: boolean; signOut: () => Promise<void> };

const value: AuthContextType = { user: null, loading: false, signOut: async () => {} };
const AuthContext = createContext<AuthContextType>(value);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
