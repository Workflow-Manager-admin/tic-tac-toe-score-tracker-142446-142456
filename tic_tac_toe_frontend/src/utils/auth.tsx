'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { apiFetch } from './api';

export interface User {
  id: string;
  username: string;
  score: number;
}

interface AuthContextProps {
  user: User | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

// PUBLIC_INTERFACE
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  async function refresh() {
    setLoading(true);
    try {
      const me = await apiFetch<User>('/users/me');
      setUser(me);
    } catch {
      setUser(null);
    }
    setLoading(false);
  }

  useEffect(() => {
    refresh();
  }, []);

  async function login(username: string, password: string) {
    setLoading(true);
    await apiFetch('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
    await refresh();
    setLoading(false);
  }

  async function register(username: string, password: string) {
    setLoading(true);
    await apiFetch('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
    await refresh();
    setLoading(false);
  }

  async function logout() {
    setLoading(true);
    await apiFetch('/auth/logout', { method: 'POST' });
    setUser(null);
    setLoading(false);
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, refresh }}>
      {children}
    </AuthContext.Provider>
  );
}

// PUBLIC_INTERFACE
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
