import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { fetchCurrentUser } from "./auth";

interface UserData {
  email?: string;
  [key: string]: unknown;
}

interface AuthContextValue {
  user: UserData | null;
  loading: boolean;
  setUser: (user: UserData | null) => void;
}

const AuthContext = createContext<AuthContextValue>({ user: null, loading: true, setUser: () => {} });

export function useAuth(): AuthContextValue {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    fetchCurrentUser().then((u) => {
      if (!cancelled) {
        setUser(u);
        setLoading(false);
      }
    });
    return () => { cancelled = true; };
  }, []);

  const handleSetUser = useCallback((u: UserData | null) => setUser(u), []);

  return (
    <AuthContext.Provider value={{ user, loading, setUser: handleSetUser }}>
      {children}
    </AuthContext.Provider>
  );
}
