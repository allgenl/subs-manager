'use client';

import { useMemo } from 'react';
import { useSubscriptions } from '@/context/SubscriptionContext';
import Card from '@/components/ui/Card';

const DAYS = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

export default function WeekdayStats() {
  const { subscriptions } = useSubscriptions();

  const data = useMemo(() => {
    const counts = new Array(7).fill(0);
    subscriptions.forEach((sub) => {
      if (!sub.isActive) return;
      const day = new Date(sub.nextPaymentDate).getDay();
      // Convert Sunday=0 to Monday-based index
      counts[day === 0 ? 6 : day - 1]++;
    });
    const max = Math.max(...counts, 1);
    return counts.map((count, i) => ({ day: DAYS[i], count, pct: (count / max) * 100 }));
  }, [subscriptions]);

  return (
    <Card>
      <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">
        Платежи по дням недели
      </h3>
      <div className="flex items-end gap-2 h-24">
        {data.map((d) => (
          <div key={d.day} className="flex-1 flex flex-col items-center gap-1">
            <div
              className="w-full rounded-t bg-blue-500 dark:bg-blue-400 transition-all min-h-[2px]"
              style={{ height: `${d.pct}%` }}
            />
            <span className="text-[10px] text-gray-500 dark:text-gray-400">{d.day}</span>
            <span className="text-[10px] font-medium text-gray-700 dark:text-gray-300">{d.count}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}
