'use client';

import { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { useSubscriptions } from '@/context/SubscriptionContext';
import { CATEGORY_CONFIG } from '@/lib/constants';
import { formatCurrency } from '@/lib/utils';
import Card from '@/components/ui/Card';
import { Category } from '@/types/subscription';

export default function CategoryPieChart() {
  const { byCategory, settings } = useSubscriptions();
  const cur = settings.defaultCurrency;

  const data = useMemo(() => {
    return Object.entries(byCategory)
      .filter(([, value]) => value > 0)
      .map(([key, value]) => ({
        name: CATEGORY_CONFIG[key as Category].label,
        value: Math.round(value * 100) / 100,
        color: CATEGORY_CONFIG[key as Category].color,
      }))
      .sort((a, b) => b.value - a.value);
  }, [byCategory]);

  if (data.length === 0) return null;

  return (
    <Card>
      <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-4">
        Расходы по категориям
      </h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={90}
              paddingAngle={3}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={index} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: number) => formatCurrency(value, cur)}
              contentStyle={{
                backgroundColor: 'var(--background)',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '13px',
              }}
            />
            <Legend
              formatter={(value) => (
                <span className="text-xs text-gray-600 dark:text-gray-400">{value}</span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
