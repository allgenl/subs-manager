'use client';

import { useMemo } from 'react';
import { useSubscriptions } from '@/context/SubscriptionContext';
import { toMonthlyCost } from '@/lib/calculations';
import { formatCurrency } from '@/lib/utils';
import { FREQUENCY_LABELS } from '@/lib/constants';
import { PaymentFrequency } from '@/types/subscription';
import Card from '@/components/ui/Card';

export default function FrequencyBreakdown() {
  const { subscriptions, settings, convertCurrency } = useSubscriptions();
  const cur = settings.defaultCurrency;

  const breakdown = useMemo(() => {
    const result: Record<string, { count: number; total: number }> = {};

    for (const sub of subscriptions) {
      if (!sub.isActive) continue;
      const key = sub.frequency;
      if (!result[key]) result[key] = { count: 0, total: 0 };
      result[key].count++;
      result[key].total += toMonthlyCost(sub, cur, convertCurrency);
    }

    return Object.entries(result)
      .map(([freq, data]) => ({
        frequency: freq as PaymentFrequency,
        label: FREQUENCY_LABELS[freq as PaymentFrequency],
        ...data,
      }))
      .sort((a, b) => b.total - a.total);
  }, [subscriptions, cur, convertCurrency]);

  if (breakdown.length === 0) return null;

  const maxTotal = Math.max(...breakdown.map((b) => b.total));

  return (
    <Card>
      <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-4">
        По частоте оплаты
      </h3>
      <div className="space-y-4">
        {breakdown.map((item) => (
          <div key={item.frequency}>
            <div className="flex items-center justify-between mb-1.5">
              <div>
                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {item.label}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                  {item.count} подп.
                </span>
              </div>
              <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                {formatCurrency(item.total, cur)}/мес
              </span>
            </div>
            <div className="h-2 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
              <div
                className="h-full rounded-full bg-blue-500 transition-all duration-500"
                style={{ width: `${(item.total / maxTotal) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
