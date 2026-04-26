import { createContext, useEffect, useState, type ReactNode } from 'react';
import { authApi } from '../lib/api/auth';
import { AUTH_UNAUTHORIZED_EVENT } from '../lib/api/client';
import type { AuthCredentials, User } from '../types';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (credentials: AuthCredentials) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('admin_token');
      if (token) {
        try {
          const userData = await authApi.me();
          setUser(userData);
        } catch {
          localStorage.removeItem('admin_token');
        }
      }
      setIsLoading(false);
    };

    const handleUnauthorized = () => {
      setUser(null);
      localStorage.removeItem('admin_token');
    };

    void initAuth();
    window.addEventListener(AUTH_UNAUTHORIZED_EVENT, handleUnauthorized);

    return () => {
      window.removeEventListener(AUTH_UNAUTHORIZED_EVENT, handleUnauthorized);
    };
  }, []);

  const login = async (credentials: AuthCredentials) => {
    const { token, user: userData } = await authApi.login(credentials);
    localStorage.setItem('admin_token', token);
    setUser(userData);
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } finally {
      setUser(null);
      localStorage.removeItem('admin_token');
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isLoading, 
      login, 
      logout, 
      isAuthenticated: !!user 
    }}>
      {children}
    </AuthContext.Provider>
  );
}
