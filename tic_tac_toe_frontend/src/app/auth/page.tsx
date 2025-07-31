'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/utils/auth.tsx';
import { COLORS } from '@/utils/style';

type Mode = 'login' | 'register';

export default function AuthPage({
  searchParams,
}: {
  searchParams: { mode?: Mode };
}) {
  const [mode, setMode] = useState<Mode>(searchParams?.mode === 'register' ? 'register' : 'login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState<string | null>(null);
  const { login, register, loading } = useAuth();
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    try {
      if (mode === 'login') {
        await login(username, password);
      } else {
        await register(username, password);
      }
      window.localStorage.setItem('username', username);
      router.replace('/');
    } catch (e) {
      setErr(e instanceof Error ? e.message : 'Unknown error');
    }
  }

  return (
    <main
      style={{
        minHeight: '70vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: COLORS.background,
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          background: COLORS.surface,
          padding: '2.2em 2.8em',
          borderRadius: 15,
          boxShadow: '0 5px 32px #0005',
          display: 'flex',
          flexDirection: 'column',
          gap: '1em',
          width: 340,
        }}
      >
        <h2 style={{ color: COLORS.accent, textAlign: 'center', marginBottom: '.7em' }}>
          {mode === 'login' ? 'Sign In' : 'Register'}
        </h2>
        <input
          type="text"
          placeholder="Username"
          required
          value={username}
          autoComplete="username"
          minLength={3}
          maxLength={18}
          onChange={e => setUsername(e.target.value)}
          style={{
            background: COLORS.background,
            color: COLORS.text,
            border: `1.5px solid ${COLORS.secondary}`,
            borderRadius: 8,
            padding: '0.8em 1em',
            fontSize: 16,
          }}
        />
        <input
          type="password"
          placeholder="Password"
          required
          minLength={4}
          maxLength={30}
          value={password}
          autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
          onChange={e => setPassword(e.target.value)}
          style={{
            background: COLORS.background,
            color: COLORS.text,
            border: `1.5px solid ${COLORS.secondary}`,
            borderRadius: 8,
            padding: '0.8em 1em',
            fontSize: 16,
          }}
        />
        {err && <div style={{ color: COLORS.error, fontWeight: 600, textAlign: 'center' }}>{err}</div>}
        <button
          type="submit"
          disabled={loading}
          style={{
            padding: '0.8em 1em',
            marginTop: '.2em',
            background: COLORS.primary,
            color: COLORS.accent,
            border: 'none',
            borderRadius: 8,
            fontWeight: 'bold',
            fontSize: 17,
            cursor: loading ? 'not-allowed' : 'pointer',
          }}
        >
          {loading ? 'Please wait...' : (mode === 'login' ? 'Login' : 'Register')}
        </button>
        <div style={{ color: COLORS.secondary, textAlign: 'center', marginTop: 10 }}>
          {mode === 'login' ? (
            <span>
              Don&apos;t have an account?{' '}
              <button type="button" style={{
                color: COLORS.accent, background: 'none', border: 'none',
                cursor: 'pointer', fontWeight: 600
              }} onClick={() => setMode('register')}>Register</button>
            </span>
          ) : (
            <span>
              Already have an account?{' '}
              <button type="button" style={{
                color: COLORS.primary, background: 'none', border: 'none',
                cursor: 'pointer', fontWeight: 600
              }} onClick={() => setMode('login')}>Login</button>
            </span>
          )}
        </div>
      </form>
    </main>
  );
}
