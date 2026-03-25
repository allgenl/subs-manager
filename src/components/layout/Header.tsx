'use client';

import Link from 'next/link';
import { Plus, CreditCard } from 'lucide-react';
import { Button } from '@heroui/react';

export default function Header() {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-background/80 px-4 backdrop-blur-sm lg:px-6">
      <div className="flex items-center gap-2">
        <CreditCard className="h-5 w-5 text-blue-600 dark:text-blue-400 lg:hidden" />
        <span className="text-base font-bold text-gray-900 dark:text-gray-100 lg:hidden">SubsManager</span>
      </div>
      <div className="flex items-center gap-3">
        <Link href="/subscriptions/new">
          <Button size="sm" variant="primary">
            <Plus size={16} />
            <span className="hidden sm:inline">Добавить</span>
          </Button>
        </Link>
      </div>
    </header>
  );
}
