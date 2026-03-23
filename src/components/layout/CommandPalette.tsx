'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Command } from 'cmdk';
import { useSubscriptions } from '@/context/SubscriptionContext';
import {
  LayoutDashboard,
  CreditCard,
  BarChart3,
  Calendar,
  Settings,
  Plus,
  Search,
  UserCircle,
} from 'lucide-react';

const pages = [
  { name: 'Главная', href: '/', icon: LayoutDashboard },
  { name: 'Подписки', href: '/subscriptions', icon: CreditCard },
  { name: 'Аналитика', href: '/analytics', icon: BarChart3 },
  { name: 'Календарь', href: '/calendar', icon: Calendar },
  { name: 'Настройки', href: '/settings', icon: Settings },
  { name: 'Профиль', href: '/profile', icon: UserCircle },
  { name: 'Новая подписка', href: '/subscriptions/new', icon: Plus },
];

export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const { subscriptions } = useSubscriptions();

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  const navigate = (href: string) => {
    setOpen(false);
    router.push(href);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div className="fixed inset-0 bg-black/50" onClick={() => setOpen(false)} />
      <div className="fixed top-[20%] left-1/2 w-full max-w-lg -translate-x-1/2">
        <Command
          className="rounded-xl border border-gray-200 bg-white shadow-2xl dark:border-gray-700 dark:bg-gray-900"
          label="Командная палитра"
        >
          <div className="flex items-center gap-2 border-b border-gray-200 px-3 dark:border-gray-700">
            <Search size={16} className="text-gray-400" />
            <Command.Input
              placeholder="Поиск страниц и подписок..."
              className="w-full bg-transparent py-3 text-sm text-gray-900 outline-none placeholder:text-gray-400 dark:text-gray-100"
            />
          </div>
          <Command.List className="max-h-72 overflow-y-auto p-2">
            <Command.Empty className="py-6 text-center text-sm text-gray-500">
              Ничего не найдено
            </Command.Empty>

            <Command.Group heading="Страницы" className="text-xs font-medium text-gray-500 dark:text-gray-400 px-2 py-1.5">
              {pages.map((page) => (
                <Command.Item
                  key={page.href}
                  value={page.name}
                  onSelect={() => navigate(page.href)}
                  className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 data-[selected=true]:bg-gray-100 dark:data-[selected=true]:bg-gray-800"
                >
                  <page.icon size={16} />
                  {page.name}
                </Command.Item>
              ))}
            </Command.Group>

            {subscriptions.length > 0 && (
              <Command.Group heading="Подписки" className="text-xs font-medium text-gray-500 dark:text-gray-400 px-2 py-1.5">
                {subscriptions.map((sub) => (
                  <Command.Item
                    key={sub.id}
                    value={sub.name}
                    onSelect={() => navigate(`/subscriptions/${sub.id}`)}
                    className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 data-[selected=true]:bg-gray-100 dark:data-[selected=true]:bg-gray-800"
                  >
                    <CreditCard size={16} />
                    {sub.name}
                  </Command.Item>
                ))}
              </Command.Group>
            )}
          </Command.List>

          <div className="border-t border-gray-200 px-3 py-2 dark:border-gray-700">
            <p className="text-xs text-gray-400">
              <kbd className="rounded bg-gray-100 px-1.5 py-0.5 font-mono dark:bg-gray-800">⌘K</kbd> для открытия
            </p>
          </div>
        </Command>
      </div>
    </div>
  );
}
