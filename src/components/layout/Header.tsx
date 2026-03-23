'use client';

import Link from 'next/link';
import { Plus, CreditCard } from 'lucide-react';
import { Button } from '@heroui/react';
import ThemeToggle from './ThemeToggle';

export default function Header() {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-gray-200 bg-white/80 px-4 backdrop-blur-sm dark:border-gray-800 dark:bg-gray-950/80 lg:px-6">
      <div className="flex items-center gap-2 lg:hidden">
        <CreditCard className="h-6 w-6 text-blue-600 dark:text-blue-400" />
        <span className="text-lg font-bold text-gray-900 dark:text-gray-100">SubsManager</span>
      </div>
      <div className="hidden lg:block" />
      <div className="flex items-center gap-3">
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
