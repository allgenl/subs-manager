'use client';

import { useEffect, useState } from 'react';

interface UserData {
  id: string;
  email: string;
  displayName: string | null;
  user_metadata?: { full_name?: string };
  created_at?: string;
}

export function useUser() {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/auth/me')
      .then((r) => r.json())
      .then((data) => {
        if (data.user) {
          setUser({
            ...data.user,
            user_metadata: { full_name: data.user.displayName },
          });
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const signOut = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    window.location.href = '/login';
  };

  return { user, loading, signOut };
}
