'use client';

import { useState, FormEvent } from 'react';
import Link from 'next/link';
import { Button } from '@heroui/react';
import Input from '@/components/ui/Input';
import { toast } from 'sonner';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || 'Ошибка входа');
        setLoading(false);
        return;
      }

      toast.success('Вы вошли!');
      window.location.href = '/';
    } catch {
      toast.error('Ошибка сети');
      setLoading(false);
    }
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <h1 className="mb-6 text-center text-xl font-semibold text-gray-900 dark:text-gray-100">
        Войти в аккаунт
      </h1>

      <form onSubmit={handleLogin} className="space-y-4">
        <Input
          id="email"
          label="Email"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoFocus
        />
        <Input
          id="password"
          label="Пароль"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <Button type="submit" className="w-full" isDisabled={loading}>
          {loading ? 'Вход...' : 'Войти'}
        </Button>
      </form>

      <p className="mt-4 text-center text-sm text-gray-500 dark:text-gray-400">
        Нет аккаунта?{' '}
        <Link href="/register" className="text-blue-600 hover:underline dark:text-blue-400">
          Зарегистрироваться
        </Link>
      </p>
    </div>
  );
}
