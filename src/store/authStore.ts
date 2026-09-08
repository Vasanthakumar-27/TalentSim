import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { ApiError, authApi } from '../services/api';

export type AuthUser = {
  id?: string;
  name: string;
  email: string;
};

interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  authError: string;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const STORAGE_KEY = 'talentsim-auth';
const TOKEN_KEY = 'talentsim-token';

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const normalizeName = (value: string) => value.trim() || 'TalentSim User';
const normalizeEmail = (value: string) => value.trim().toLowerCase();

const readStoredUser = (): AuthUser | null => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<AuthUser>;
    if (!parsed?.name || !parsed?.email) return null;
    return {
      name: normalizeName(parsed.name),
      email: normalizeEmail(parsed.email),
    };
  } catch {
    return null;
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [authError, setAuthError] = useState('');

  useEffect(() => {
    setUser(readStoredUser());
  }, []);

  useEffect(() => {
    if (!user) {
      localStorage.removeItem(STORAGE_KEY);
      return;
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  }, [user]);

  const value = useMemo<AuthContextValue>(() => ({
    user,
    isAuthenticated: Boolean(user),
    authError,
    login: async (email, password) => {
      setAuthError('');
      try {
        const response = await authApi.login(email, password);
        localStorage.setItem(TOKEN_KEY, response.accessToken);
        setUser(response.user);
        return true;
      } catch (error) {
        if (error instanceof ApiError) {
          setAuthError(error.message);
          return false;
        }
        setAuthError(error instanceof Error ? error.message : 'Unable to connect to the backend.');
        if (!import.meta.env.DEV) return false;
        // Keep the local demo flow usable before the API environment is configured.
      }
      const stored = readStoredUser();
      if (!stored) return false;
      if (stored.email !== normalizeEmail(email)) return false;
      if (!password || password.length < 6) return false;
      setUser(stored);
      return true;
    },
    register: async (name, email, password) => {
      setAuthError('');
      const trimmedName = normalizeName(name);
      const trimmedEmail = normalizeEmail(email);
      if (!trimmedName || !trimmedEmail || !password || password.length < 6) return false;

      try {
        const response = await authApi.register(trimmedName, trimmedEmail, password);
        localStorage.setItem(TOKEN_KEY, response.accessToken);
        setUser(response.user);
        return true;
      } catch (error) {
        if (error instanceof ApiError) {
          setAuthError(error.message);
          return false;
        }
        setAuthError(error instanceof Error ? error.message : 'Unable to connect to the backend.');
        if (!import.meta.env.DEV) return false;
        // Keep the local demo flow usable before the API environment is configured.
      }

      const nextUser = { name: trimmedName, email: trimmedEmail };
      setUser(nextUser);
      return true;
    },
    logout: () => {
      localStorage.removeItem(TOKEN_KEY);
      setUser(null);
    },
  }), [authError, user]);

  return React.createElement(AuthContext.Provider, { value }, children);
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
