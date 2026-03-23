'use client';

import { useSubscriptions } from '@/context/SubscriptionContext';
import { formatCurrency } from '@/lib/utils';
import Card from '@/components/ui/Card';
import { TrendingUp, Wallet, CalendarDays, PiggyBank } from 'lucide-react';

export default function TotalSpending() {
  const { totalMonthly, savings, settings } = useSubscriptions();
  const cur = settings.defaultCurrency;

  const items = [
    {
      label: 'В день',
      value: formatCurrency(savings.perDay, cur),
      icon: CalendarDays,
      color: 'text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-900/30',
    },
    {
      label: 'В неделю',
      value: formatCurrency(savings.perWeek, cur),
      icon: Wallet,
      color: 'text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-900/30',
    },
    {
      label: 'В месяц',
      value: formatCurrency(savings.perMonth, cur),
      icon: TrendingUp,
      color: 'text-violet-600 bg-violet-50 dark:text-violet-400 dark:bg-violet-900/30',
    },
    {
      label: 'В год',
      value: formatCurrency(savings.perYear, cur),
      icon: PiggyBank,
      color: 'text-amber-600 bg-amber-50 dark:text-amber-400 dark:bg-amber-900/30',
    },
  ];

  return (
    <Card className="bg-gradient-to-br from-blue-600 to-blue-700 text-white border-0 dark:from-blue-700 dark:to-blue-800">
      <p className="text-sm font-medium text-blue-100">Общие расходы на подписки</p>
      <p className="mt-1 text-4xl font-bold">
        {formatCurrency(totalMonthly, cur)}
        <span className="text-lg font-normal text-blue-200">/мес</span>
      </p>
      <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {items.map((item) => (
          <div
            key={item.label}
            className="rounded-lg bg-white/10 p-3 backdrop-blur-sm"
          >
            <p className="text-xs text-blue-100">{item.label}</p>
            <p className="mt-1 text-sm font-semibold">{item.value}</p>
          </div>
        ))}
      </div>
    </Card>
  );
}
