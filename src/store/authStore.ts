import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

export type AuthUser = {
  name: string;
  email: string;
};

interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => boolean;
  register: (name: string, email: string, password: string) => boolean;
  logout: () => void;
}

const STORAGE_KEY = 'talentsim-auth';

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
    login: (email, password) => {
      const stored = readStoredUser();
      if (!stored) return false;
      if (stored.email !== normalizeEmail(email)) return false;
      if (!password || password.length < 6) return false;
      setUser(stored);
      return true;
    },
    register: (name, email, password) => {
      const trimmedName = normalizeName(name);
      const trimmedEmail = normalizeEmail(email);
      if (!trimmedName || !trimmedEmail || !password || password.length < 6) return false;
      const nextUser = { name: trimmedName, email: trimmedEmail };
      setUser(nextUser);
      return true;
    },
    logout: () => setUser(null),
  }), [user]);

  return React.createElement(AuthContext.Provider, { value }, children);
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
