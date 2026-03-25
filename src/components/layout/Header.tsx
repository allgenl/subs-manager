'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, CreditCard } from 'lucide-react';
import { Button } from '@heroui/react';
import ThemeToggle from './ThemeToggle';
import { useUser } from '@/hooks/useUser';
import { SidebarTrigger } from '@/components/ui/sidebar';

export default function Header() {
  const { user } = useUser();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-gray-200 bg-white/80 px-4 backdrop-blur-sm dark:border-gray-800 dark:bg-gray-950/80 lg:px-6">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="-ml-1" />
        <CreditCard className="h-5 w-5 text-blue-600 dark:text-blue-400 lg:hidden" />
        <span className="text-base font-bold text-gray-900 dark:text-gray-100 lg:hidden">SubsManager</span>
      </div>
      <div className="flex items-center gap-3">
        {mounted && user && (
          <span className="hidden text-sm text-gray-500 dark:text-gray-400 sm:inline">
            {user.email}
          </span>
        )}
        <ThemeToggle />
        <Link href="/subscriptions/new">
          <Button size="sm">
            <Plus size={16} />
            <span className="hidden sm:inline">Добавить</span>
          </Button>
        </Link>
      </div>
    </header>
  );
}
