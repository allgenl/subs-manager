'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@heroui/react';
import Input from '@/components/ui/Input';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      toast.error('Пароль должен быть не менее 6 символов');
      return;
    }
    setLoading(true);

    const supabase = createClient();
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: name },
        emailRedirectTo: `${window.location.origin}/callback`,
      },
    });

    if (error) {
      toast.error(error.message);
      setLoading(false);
      return;
    }

    // If email confirmation is disabled, user is immediately logged in
    if (data.session) {
      toast.success('Аккаунт создан!');
      window.location.href = '/';
    } else {
      toast.success('Проверьте email для подтверждения');
      window.location.href = '/login';
    }
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <h1 className="mb-6 text-center text-xl font-semibold text-gray-900 dark:text-gray-100">
        Создать аккаунт
      </h1>

      <form onSubmit={handleRegister} className="space-y-4">
        <Input
          id="name"
          label="Имя"
          placeholder="Иван Иванов"
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoFocus
        />
        <Input
          id="email"
          label="Email"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          id="password"
          label="Пароль"
          type="password"
          placeholder="Минимум 6 символов"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <Button type="submit" className="w-full" isDisabled={loading}>
          {loading ? 'Регистрация...' : 'Зарегистрироваться'}
        </Button>
      </form>

      <p className="mt-4 text-center text-sm text-gray-500 dark:text-gray-400">
        Уже есть аккаунт?{' '}
        <Link href="/login" className="text-blue-600 hover:underline dark:text-blue-400">
          Войти
        </Link>
      </p>
    </div>
  );
}
