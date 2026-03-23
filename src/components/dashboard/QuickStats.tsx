'use client';

import { useSubscriptions } from '@/context/SubscriptionContext';
import { formatCurrency } from '@/lib/utils';
import Card from '@/components/ui/Card';
import { CreditCard, TrendingUp, Star, Hash } from 'lucide-react';

export default function QuickStats() {
  const { activeCount, mostExpensive, averageCost, savings, settings } = useSubscriptions();
  const cur = settings.defaultCurrency;

  const stats = [
    {
      label: 'Активных подписок',
      value: activeCount.toString(),
      icon: Hash,
      color: 'text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-900/30',
    },
    {
      label: 'Самая дорогая',
      value: mostExpensive ? mostExpensive.name : '—',
      icon: Star,
      color: 'text-amber-600 bg-amber-50 dark:text-amber-400 dark:bg-amber-900/30',
    },
    {
      label: 'Средняя стоимость',
      value: formatCurrency(averageCost, cur) + '/мес',
      icon: TrendingUp,
      color: 'text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-900/30',
    },
    {
      label: 'В год всего',
      value: formatCurrency(savings.perYear, cur),
      icon: CreditCard,
      color: 'text-violet-600 bg-violet-50 dark:text-violet-400 dark:bg-violet-900/30',
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.label} className="flex items-start gap-3">
          <div className={`rounded-lg p-2 ${stat.color}`}>
            <stat.icon size={18} />
          </div>
          <div className="min-w-0">
            <p className="text-xs text-gray-500 dark:text-gray-400">{stat.label}</p>
            <p className="mt-0.5 text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">
              {stat.value}
            </p>
          </div>
        </Card>
      ))}
    </div>
  );
}
