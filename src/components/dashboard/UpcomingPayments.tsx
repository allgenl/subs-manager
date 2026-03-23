'use client';

import Link from 'next/link';
import { useSubscriptions } from '@/context/SubscriptionContext';
import { formatCurrency, formatDateShort, daysUntil, cn } from '@/lib/utils';
import Card from '@/components/ui/Card';
import { Calendar, ArrowRight } from 'lucide-react';

export default function UpcomingPayments() {
  const { upcoming30 } = useSubscriptions();
  const display = upcoming30.slice(0, 6);

  if (display.length === 0) {
    return (
      <Card>
        <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">
          Ближайшие платежи
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 py-4 text-center">
          Нет платежей в ближайшие 30 дней
        </p>
      </Card>
    );
  }

  return (
    <Card>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
          Ближайшие платежи
        </h3>
        <Link
          href="/calendar"
          className="text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400 flex items-center gap-1"
        >
          Все <ArrowRight size={12} />
        </Link>
      </div>
      <div className="space-y-3">
        {display.map((sub) => {
          const days = daysUntil(sub.nextPaymentDate);
          return (
            <div key={sub.id} className="flex items-center justify-between">
              <div className="flex items-center gap-3 min-w-0">
                <div className="rounded-lg bg-gray-100 p-2 dark:bg-gray-800">
                  <Calendar size={14} className="text-gray-500 dark:text-gray-400" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                    {sub.name}
                  </p>
                  <p
                    className={cn(
                      'text-xs',
                      days <= 3
                        ? 'text-red-500'
                        : days <= 7
                        ? 'text-amber-500'
                        : 'text-gray-400 dark:text-gray-500'
                    )}
                  >
                    {formatDateShort(sub.nextPaymentDate)}
                    {days === 0 ? ' — сегодня' : days === 1 ? ' — завтра' : ` — через ${days} дн.`}
                  </p>
                </div>
              </div>
              <span className="text-sm font-semibold text-gray-900 dark:text-gray-100 shrink-0">
                {formatCurrency(sub.price, sub.currency)}
              </span>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
