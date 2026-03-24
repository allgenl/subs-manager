'use client';

import { useMemo } from 'react';
import { useSubscriptions } from '@/context/SubscriptionContext';
import { formatCurrency, formatDate } from '@/lib/utils';
import Card from '@/components/ui/Card';
import { History } from 'lucide-react';

interface PaymentRecord {
  id: string;
  subscriptionName: string;
  amount: number;
  currency: 'RUB' | 'USD' | 'EUR';
  date: Date;
  category: string;
}

export default function PaymentHistory() {
  const { subscriptions } = useSubscriptions();

  const history = useMemo(() => {
    const records: PaymentRecord[] = [];
    const now = new Date();

    for (const sub of subscriptions) {
      if (!sub.isActive) continue;

      // Generate past payment dates based on frequency
      const startDate = new Date(sub.startDate);
      let current = new Date(startDate);

      while (current <= now) {
        if (current >= startDate) {
          records.push({
            id: `${sub.id}-${current.toISOString()}`,
            subscriptionName: sub.name,
            amount: sub.isShared && sub.myShare ? sub.myShare : sub.price,
            currency: sub.currency,
            date: new Date(current),
            category: sub.category,
          });
        }

        switch (sub.frequency) {
          case 'monthly':
            current = new Date(current.getFullYear(), current.getMonth() + 1, current.getDate());
            break;
          case 'yearly':
            current = new Date(current.getFullYear() + 1, current.getMonth(), current.getDate());
            break;
          case 'weekly':
            current = new Date(current.getTime() + 7 * 24 * 60 * 60 * 1000);
            break;
          case 'custom':
            current = new Date(current.getTime() + (sub.customFrequencyDays || 30) * 24 * 60 * 60 * 1000);
            break;
        }
      }
    }

    // Sort by date descending, limit to last 50
    return records
      .sort((a, b) => b.date.getTime() - a.date.getTime())
      .slice(0, 50);
  }, [subscriptions]);

  if (history.length === 0) {
    return null;
  }

  // Group by month
  const grouped = history.reduce((acc, record) => {
    const key = record.date.toLocaleDateString('ru-RU', { month: 'long', year: 'numeric' });
    if (!acc[key]) acc[key] = [];
    acc[key].push(record);
    return acc;
  }, {} as Record<string, PaymentRecord[]>);

  return (
    <Card>
      <div className="flex items-center gap-2 mb-4">
        <History size={16} className="text-gray-500" />
        <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
          История платежей
        </h3>
      </div>
      <div className="space-y-4 max-h-96 overflow-y-auto">
        {Object.entries(grouped).map(([month, records]) => (
          <div key={month}>
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2 capitalize">
              {month}
            </p>
            <div className="space-y-2">
              {records.map((record) => (
                <div
                  key={record.id}
                  className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2 dark:bg-gray-800/50"
                >
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {record.subscriptionName}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {formatDate(record.date.toISOString())}
                    </p>
                  </div>
                  <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                    -{formatCurrency(record.amount, record.currency)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
