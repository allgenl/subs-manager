'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export function useKeyboardShortcuts() {
  const router = useRouter();

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      // Don't trigger in inputs
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if (e.key === 'n' && !e.metaKey && !e.ctrlKey) {
        // 'n' → new subscription
        router.push('/subscriptions/new');
      } else if (e.key === 'h' && !e.metaKey && !e.ctrlKey) {
        router.push('/');
      } else if (e.key === 's' && !e.metaKey && !e.ctrlKey) {
        router.push('/subscriptions');
      } else if (e.key === 'a' && !e.metaKey && !e.ctrlKey) {
        router.push('/analytics');
      }
    };

    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [router]);
}
