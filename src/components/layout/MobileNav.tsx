'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  CreditCard,
  BarChart3,
  Calendar,
  Settings,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/', label: 'Главная', icon: LayoutDashboard },
  { href: '/subscriptions', label: 'Подписки', icon: CreditCard },
  { href: '/analytics', label: 'Аналитика', icon: BarChart3 },
  { href: '/calendar', label: 'Календарь', icon: Calendar },
  { href: '/settings', label: 'Настройки', icon: Settings },
];

export default function MobileNav() {
  const pathname = usePathname();

  return (
    <nav aria-label="Мобильная навигация" className="fixed bottom-0 left-0 right-0 z-30 border-t border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950 lg:hidden pb-[env(safe-area-inset-bottom)]">
      <div className="flex items-center justify-around py-1.5">
        {navItems.map((item) => {
          const isActive =
            item.href === '/'
              ? pathname === '/'
              : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex flex-col items-center gap-0.5 px-3 py-2 text-xs transition-colors min-h-[44px] justify-center',
                isActive
                  ? 'text-blue-600 dark:text-blue-400'
                  : 'text-gray-500 dark:text-gray-400'
              )}
            >
              <item.icon size={20} />
              <span className="truncate max-w-[56px]">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
