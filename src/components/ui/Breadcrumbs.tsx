'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight, Home } from 'lucide-react';

const ROUTE_LABELS: Record<string, string> = {
  '': 'Главная',
  subscriptions: 'Подписки',
  analytics: 'Аналитика',
  calendar: 'Календарь',
  settings: 'Настройки',
  profile: 'Профиль',
  archive: 'Архив',
  compare: 'Сравнение',
  new: 'Новая',
};

export default function Breadcrumbs() {
  const pathname = usePathname();
  const segments = pathname.split('/').filter(Boolean);

  if (segments.length === 0) return null;

  const crumbs = segments.map((seg, i) => ({
    label: ROUTE_LABELS[seg] || seg,
    href: '/' + segments.slice(0, i + 1).join('/'),
    isLast: i === segments.length - 1,
  }));

  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 mb-4">
      <Link href="/" className="hover:text-gray-700 dark:hover:text-gray-300">
        <Home size={12} />
      </Link>
      {crumbs.map((crumb) => (
        <span key={crumb.href} className="flex items-center gap-1">
          <ChevronRight size={10} />
          {crumb.isLast ? (
            <span className="text-gray-900 dark:text-gray-100 font-medium">{crumb.label}</span>
          ) : (
            <Link href={crumb.href} className="hover:text-gray-700 dark:hover:text-gray-300">
              {crumb.label}
            </Link>
          )}
        </span>
      ))}
    </nav>
  );
}
