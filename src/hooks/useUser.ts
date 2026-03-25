'use client';

import { useState, useEffect, useCallback } from 'react';

interface UserData {
  id: string;
  email: string;
  displayName: string | null;
  user_metadata?: { full_name?: string };
  created_at?: string;
}

// Decode JWT payload without verification (client-side only, for display)
function parseJwt(token: string): Record<string, unknown> | null {
  try {
    const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    const bytes = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
    return JSON.parse(new TextDecoder().decode(bytes));
  } catch {
    return null;
  }
}

function getUserFromCookie(): UserData | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.split('; ').find((c) => c.startsWith('subs-session='));
  if (!match) return null;

  const payload = parseJwt(match.split('=').slice(1).join('='));
  if (!payload?.sub) return null;

  return {
    id: payload.sub as string,
    email: (payload.email as string) || '',
    displayName: (payload.name as string) || null,
    user_metadata: { full_name: (payload.name as string) || undefined },
  };
}

export function useUser() {
  const [user, setUser] = useState<UserData | null>(null);

  useEffect(() => {
    setUser(getUserFromCookie());
  }, []);

  const signOut = useCallback(async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    window.location.href = '/login';
  }, []);

  return { user, loading: false, signOut };
}
