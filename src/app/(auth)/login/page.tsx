'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@heroui/react';
import Input from '@/components/ui/Input';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';
import { Mail, GitBranch } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      toast.error(error.message);
      setLoading(false);
      return;
    }

    router.push('/');
    router.refresh();
  };

  const handleOAuth = async (provider: 'google' | 'github') => {
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: `${window.location.origin}/callback` },
    });
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

      <div className="my-4 flex items-center gap-3">
        <div className="h-px flex-1 bg-gray-200 dark:bg-gray-800" />
        <span className="text-xs text-gray-500 dark:text-gray-400">или</span>
        <div className="h-px flex-1 bg-gray-200 dark:bg-gray-800" />
      </div>

      <div className="space-y-2">
        <Button
          variant="outline"
          className="w-full"
          onPress={() => handleOAuth('github')}
        >
          <GitBranch size={16} />
          Войти через GitHub
        </Button>
        <Button
          variant="outline"
          className="w-full"
          onPress={() => handleOAuth('google')}
        >
          <Mail size={16} />
          Войти через Google
        </Button>
      </div>

      <p className="mt-4 text-center text-sm text-gray-500 dark:text-gray-400">
        Нет аккаунта?{' '}
        <Link href="/register" className="text-blue-600 hover:underline dark:text-blue-400">
          Зарегистрироваться
        </Link>
      </p>
    </div>
  );
}
