import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { decodeJwt, extractUserId, extractRole, isExpired } from "./jwt";
import { setAuthState } from "./store";
import { authService } from "@/lib/services/auth.service";
import { UserRole } from "@/types";
import type { AuthResponse, LoginRequest, SignupRequest, UserResponse } from "@/types";

const TOKEN_KEY = "HireMe.token";
const USER_KEY = "HireMe.user";

interface AuthContextValue {
  token: string | null;
  user: UserResponse | null;
  userId: string | null;
  role: UserRole | null;
  isAuthenticated: boolean;
  isReady: boolean;
  isAdmin: boolean;
  isEmployer: boolean;
  isCandidate: boolean;
  hasRole: (role: UserRole) => boolean;
  login: (data: LoginRequest) => Promise<AuthResponse>;
  signup: (data: SignupRequest) => Promise<AuthResponse>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function readStored(): { token: string | null; user: UserResponse | null } {
  if (typeof window === "undefined") return { token: null, user: null };
  try {
    const token = localStorage.getItem(TOKEN_KEY);
    const rawUser = localStorage.getItem(USER_KEY);
    const user = rawUser ? (JSON.parse(rawUser) as UserResponse) : null;
    if (token) {
      const payload = decodeJwt(token);
      if (isExpired(payload)) {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
        return { token: null, user: null };
      }
    }
    return { token, user };
  } catch {
    return { token: null, user: null };
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<UserResponse | null>(null);
  const [isReady, setIsReady] = useState(false);

  // Hydrate from localStorage on mount (client only).
  useEffect(() => {
    const { token: t, user: u } = readStored();
    setToken(t);
    setUser(u);
    const payload = t ? decodeJwt(t) : null;
    const userIdFromJwt = extractUserId(payload);
    const fallbackId = u?.id !== undefined ? String(u.id) : null;
    setAuthState(t, userIdFromJwt ?? fallbackId);
    setIsReady(true);
  }, []);

  const persist = useCallback((res: AuthResponse) => {
    const t = res.jwt ?? res.token ?? null;
    const u = res.user ?? null;
    if (typeof window !== "undefined") {
      if (t) localStorage.setItem(TOKEN_KEY, t);
      else localStorage.removeItem(TOKEN_KEY);
      if (u) localStorage.setItem(USER_KEY, JSON.stringify(u));
      else localStorage.removeItem(USER_KEY);
    }
    setToken(t);
    setUser(u);
    const payload = t ? decodeJwt(t) : null;
    const userIdFromJwt = extractUserId(payload);
    const fallbackId = u?.id !== undefined ? String(u.id) : null;
    setAuthState(t, userIdFromJwt ?? fallbackId);
  }, []);

  const login = useCallback(
    async (data: LoginRequest) => {
      const res = await authService.login(data);
      persist(res);
      return res;
    },
    [persist],
  );

  const signup = useCallback(
    async (data: SignupRequest) => {
      const res = await authService.signup(data);
      persist(res);
      return res;
    },
    [persist],
  );

  const logout = useCallback(() => {
    if (typeof window !== "undefined") {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
    }
    setToken(null);
    setUser(null);
    setAuthState(null, null);
  }, []);

  const value = useMemo<AuthContextValue>(() => {
    const payload = token ? decodeJwt(token) : null;
    const userIdFromJwt = extractUserId(payload);
    const fallbackId = user?.id !== undefined ? String(user.id) : null;
    const userId = userIdFromJwt ?? fallbackId;
    const roleStr = extractRole(payload) ?? user?.role ?? null;
    const role = (roleStr as UserRole) ?? null;
    return {
      token,
      user,
      userId,
      role,
      isAuthenticated: !!token,
      isReady,
      isAdmin: role === UserRole.ROLE_ADMIN,
      isEmployer: role === UserRole.ROLE_EMPLOYER,
      isCandidate: role === UserRole.ROLE_JOB_SEEKER,
      hasRole: (r: UserRole) => role === r,
      login,
      signup,
      logout,
    };
  }, [token, user, isReady, login, signup, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
  return ctx;
}
