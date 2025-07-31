'use client';

import Link from 'next/link';
import { useAuth } from '@/utils/auth';
import { COLORS } from '@/utils/style';

export function TopNav() {
  const { user, loading, logout } = useAuth();

  return (
    <header
      style={{
        background: COLORS.surface,
        borderBottom: `1.5px solid ${COLORS.secondary}`,
        padding: '0.7rem 2.2rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <span style={{ fontWeight: 600, letterSpacing: 1, color: COLORS.accent, fontSize: 21 }}>
        Tic Tac Toe
      </span>
      <nav>
        {loading ? (
          <span style={{ color: COLORS.secondary, fontStyle: 'italic' }}>Loading...</span>
        ) : user ? (
          <>
            <span style={{ marginRight: 14, color: COLORS.primary }}>
              {user.username}
            </span>
            <button
              onClick={logout}
              style={{
                color: COLORS.accent,
                background: 'none',
                border: `1.5px solid ${COLORS.accent}77`,
                borderRadius: '0.5em',
                padding: '0.43em 1.1em',
                fontFamily: 'inherit',
                fontWeight: 500,
                cursor: 'pointer',
                marginLeft: 8,
                transition: 'background 0.14s',
              }}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link href="/auth/login" style={{ color: COLORS.primary, marginRight: 16 }}>
              Login
            </Link>
            <Link href="/auth/register" style={{ color: COLORS.accent }}>
              Register
            </Link>
          </>
        )}
      </nav>
    </header>
  );
}
