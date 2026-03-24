'use client';

import { useMemo } from 'react';
import { useSubscriptions } from '@/context/SubscriptionContext';
import { toMonthlyCost } from '@/lib/calculations';
import { formatCurrency } from '@/lib/utils';
import Card from '@/components/ui/Card';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function MonthlyTrend() {
  const { subscriptions, settings, convertCurrency } = useSubscriptions();
  const cur = settings.defaultCurrency;

  const { currentMonth, previousMonth, diff, percentage } = useMemo(() => {
    const now = new Date();
    const thisMonth = now.getMonth();
    const thisYear = now.getFullYear();

    let current = 0;
    let previous = 0;

    for (const sub of subscriptions) {
      if (!sub.isActive) continue;
      const monthly = toMonthlyCost(sub, cur, convertCurrency);
      const startDate = new Date(sub.startDate);

      // Current month
      if (startDate <= now) {
        current += monthly;
      }

      // Previous month
      const prevMonthDate = new Date(thisYear, thisMonth - 1, 15);
      if (startDate <= prevMonthDate) {
        previous += monthly;
      }
    }

    const d = current - previous;
    const pct = previous > 0 ? ((d / previous) * 100) : 0;

    return {
      currentMonth: current,
      previousMonth: previous,
      diff: d,
      percentage: pct,
    };
  }, [subscriptions, cur, convertCurrency]);

  const isUp = diff > 0;
  const isDown = diff < 0;
  const isFlat = diff === 0;

  return (
    <Card>
      <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">
        Тренд расходов
      </h3>
      <div className="flex items-center gap-4">
        <div
          className={cn(
            'flex h-12 w-12 items-center justify-center rounded-xl',
            isUp ? 'bg-red-50 dark:bg-red-900/20' : isDown ? 'bg-emerald-50 dark:bg-emerald-900/20' : 'bg-gray-100 dark:bg-gray-800'
          )}
        >
          {isUp ? (
            <TrendingUp className="h-6 w-6 text-red-500" />
          ) : isDown ? (
            <TrendingDown className="h-6 w-6 text-emerald-500" />
          ) : (
            <Minus className="h-6 w-6 text-gray-400" />
          )}
        </div>
        <div>
          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {formatCurrency(currentMonth, cur)}
            <span className="text-sm font-normal text-gray-500 dark:text-gray-400">/мес</span>
          </p>
          {!isFlat && (
            <p
              className={cn(
                'text-sm font-medium',
                isUp ? 'text-red-500' : 'text-emerald-500'
              )}
            >
              {isUp ? '+' : ''}{formatCurrency(diff, cur)} ({percentage.toFixed(1)}%)
              {' '}vs прошлый месяц
            </p>
          )}
          {isFlat && (
            <p className="text-sm text-gray-500">Без изменений</p>
          )}
        </div>
      </div>
    </Card>
  );
}
