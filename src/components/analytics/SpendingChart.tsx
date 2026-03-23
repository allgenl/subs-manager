'use client';

import { useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useSubscriptions } from '@/context/SubscriptionContext';
import { toMonthlyCost } from '@/lib/calculations';
import { formatCurrency } from '@/lib/utils';
import Card from '@/components/ui/Card';

export default function SpendingChart() {
  const { subscriptions, settings } = useSubscriptions();
  const cur = settings.defaultCurrency;

  const data = useMemo(() => {
    const months = [];
    const now = new Date();

    for (let i = 0; i < 12; i++) {
      const date = new Date(now.getFullYear(), now.getMonth() + i, 1);
      const monthLabel = date.toLocaleDateString('ru-RU', { month: 'short' });

      let total = 0;
      for (const sub of subscriptions) {
        if (!sub.isActive) continue;
        const monthly = toMonthlyCost(sub);

        if (sub.frequency === 'yearly') {
          const payDate = new Date(sub.nextPaymentDate);
          if (payDate.getMonth() === date.getMonth()) {
            total += sub.price;
          } else {
            total += monthly;
          }
        } else {
          total += monthly;
        }
      }

      months.push({ name: monthLabel, total: Math.round(total * 100) / 100 });
    }

    return months;
  }, [subscriptions]);

  if (subscriptions.filter((s) => s.isActive).length === 0) {
    return null;
  }

  return (
    <Card>
      <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-4">
        Прогноз расходов (12 месяцев)
      </h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 12, fill: '#9ca3af' }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              tick={{ fontSize: 12, fill: '#9ca3af' }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => `${v}`}
            />
            <Tooltip
              formatter={(value) => [formatCurrency(Number(value), cur), 'Расходы']}
              contentStyle={{
                backgroundColor: 'var(--background)',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '13px',
              }}
            />
            <Area
              type="monotone"
              dataKey="total"
              stroke="#3b82f6"
              strokeWidth={2}
              fill="url(#colorTotal)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
