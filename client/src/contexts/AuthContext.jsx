import { createContext, useCallback, useEffect, useState } from 'react';
import { authApi } from '../services/authApi.js';
import { setAccessToken } from '../services/axiosInstance.js';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // On first load, attempt a silent refresh using the httpOnly cookie so a
  // page reload doesn't force a fresh login.
  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const res = await authApi.refresh();
        if (cancelled) return;
        setAccessToken(res.data.accessToken);
        setUser(res.data.user);
      } catch {
        setAccessToken(null);
        setUser(null);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const login = useCallback(async (email, password) => {
    const res = await authApi.login({ email, password });
    setAccessToken(res.data.accessToken);
    setUser(res.data.user);
    return res;
  }, []);

  const register = useCallback((name, email, password) => {
    return authApi.register({ name, email, password });
  }, []);

  const logout = useCallback(async () => {
    await authApi.logout().catch(() => {});
    setAccessToken(null);
    setUser(null);
  }, []);

  const value = {
    user,
    isLoading,
    isAuthenticated: Boolean(user),
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
