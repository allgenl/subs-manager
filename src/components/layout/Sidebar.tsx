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
import { useSubscriptions } from '@/context/SubscriptionContext';
import { formatCurrency } from '@/lib/utils';

const navItems = [
  { href: '/', label: 'Главная', icon: LayoutDashboard },
  { href: '/subscriptions', label: 'Подписки', icon: CreditCard },
  { href: '/analytics', label: 'Аналитика', icon: BarChart3 },
  { href: '/calendar', label: 'Календарь', icon: Calendar },
  { href: '/settings', label: 'Настройки', icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { totalMonthly, settings } = useSubscriptions();

  return (
    <aside className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 border-r border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950">
      <div className="flex h-16 items-center gap-2 px-6 border-b border-gray-200 dark:border-gray-800">
        <CreditCard className="h-6 w-6 text-blue-600 dark:text-blue-400" />
        <span className="text-lg font-bold text-gray-900 dark:text-gray-100">SubsManager</span>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
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
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-900 dark:hover:text-gray-200'
              )}
            >
              <item.icon size={20} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-gray-200 p-4 dark:border-gray-800">
        <div className="rounded-lg bg-gray-50 p-3 dark:bg-gray-900">
          <p className="text-xs text-gray-500 dark:text-gray-400">В месяц</p>
          <p className="text-lg font-bold text-gray-900 dark:text-gray-100">
            {formatCurrency(totalMonthly, settings.defaultCurrency)}
          </p>
        </div>
      </div>
    </aside>
  );
}
