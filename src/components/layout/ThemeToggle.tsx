'use client';

import { useEffect, useState } from 'react';
import { ToggleButton } from '@heroui/react';
import { Sun, Moon } from 'lucide-react';

export default function ThemeToggle() {
  const [dark, setDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setDark(document.documentElement.classList.contains('dark'));
    setMounted(true);
  }, []);

  const toggle = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle('dark', next);
    const value = next ? 'dark' : 'light';
    localStorage.setItem('theme', value);
    document.cookie = `theme=${value};path=/;max-age=31536000;samesite=lax`;
  };

  if (!mounted) return <div className="h-9 w-9" />;

  return (
    <ToggleButton
      isSelected={dark}
      onPress={toggle}
      aria-label="Переключить тему"
      size="sm"
      variant="ghost"
    >
      {dark ? <Sun size={18} /> : <Moon size={18} />}
    </ToggleButton>
  );
}
