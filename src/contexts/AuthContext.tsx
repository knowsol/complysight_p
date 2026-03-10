'use client';

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";

import { setTheme, type ThemeSite } from "@/lib/theme/colors";
import type { User } from "@/types/user";

export type AuthUser = Pick<User, 'userId' | 'userNm' | 'userRole' | 'useYn'>;

type AuthState = {
  ok: boolean;
  user: AuthUser | null;
  site: ThemeSite | null;
};

interface AuthContextValue {
  auth: AuthState;
  isAuthenticated: boolean;
  user: AuthUser | null;
  site: ThemeSite | null;
  pg: string;
  setPg: (page: string) => void;
  login: (user: AuthUser, site: ThemeSite) => void;
  logout: () => void;
  switchSite: () => void;
}

const initialAuth: AuthState = { ok: false, user: null, site: null };

const AuthContext = createContext<AuthContextValue>({
  auth: initialAuth,
  isAuthenticated: false,
  user: null,
  site: null,
  pg: '',
  setPg: () => {},
  login: () => {},
  logout: () => {},
  switchSite: () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [auth, setAuth] = useState<AuthState>(initialAuth);
  const [pg, setPg] = useState("");

  const login = useCallback((user: AuthUser, site: ThemeSite) => {
    if (!user) {
      return;
    }
    setTheme(site);
    setAuth({ ok: true, user, site });
    setPg(site === "m" ? "md" : "sd");
  }, []);

  const logout = useCallback(() => {
    setTheme("s");
    setAuth(initialAuth);
    setPg("");
  }, []);

  const switchSite = useCallback(() => {
    if (!auth.site) {
      return;
    }
    const ns: ThemeSite = auth.site === "m" ? "s" : "m";
    setTheme(ns);
    setAuth((prev) => ({ ...prev, site: ns }));
    setPg(ns === "m" ? "md" : "sd");
  }, [auth.site]);

  const value = useMemo(
    () => ({ auth, isAuthenticated: auth.ok, user: auth.user, site: auth.site, pg, setPg, login, logout, switchSite }),
    [auth, pg, login, logout, switchSite],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextValue => useContext(AuthContext);
