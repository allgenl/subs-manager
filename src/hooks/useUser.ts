'use client';

import { useEffect, useState } from 'react';

interface UserData {
  id: string;
  email: string;
  displayName: string | null;
  user_metadata?: { full_name?: string };
  created_at?: string;
}

// Module-level cache — survives across component mounts (SPA navigation)
let cachedUser: UserData | null | undefined = undefined;

export function useUser() {
  const [user, setUser] = useState<UserData | null>(cachedUser ?? null);
  const [loading, setLoading] = useState(cachedUser === undefined);

  useEffect(() => {
    // If already cached, skip fetch
    if (cachedUser !== undefined) {
      setUser(cachedUser);
      setLoading(false);
      return;
    }

    fetch('/api/auth/me')
      .then((r) => r.json())
      .then((data) => {
        const u = data.user
          ? { ...data.user, user_metadata: { full_name: data.user.displayName } }
          : null;
        cachedUser = u;
        setUser(u);
        setLoading(false);
      })
      .catch(() => {
        cachedUser = null;
        setLoading(false);
      });
  }, []);

  const signOut = async () => {
    cachedUser = undefined;
    await fetch('/api/auth/logout', { method: 'POST' });
    window.location.href = '/login';
  };

  return { user, loading, signOut };
}
