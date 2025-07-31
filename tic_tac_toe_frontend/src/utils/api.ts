'use client';

const API_BASE_URL = process.env.NEXT_PUBLIC_TTT_API_URL || 'http://localhost:8000';

export async function apiFetch<T>(
  path: string,
  options?: RequestInit
): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: { ...(options?.headers || {}), 'Content-Type': 'application/json' },
    credentials: 'include',
  });
  if (!res.ok) {
    throw new Error((await res.json()).detail || res.statusText);
  }
  return res.json();
}
