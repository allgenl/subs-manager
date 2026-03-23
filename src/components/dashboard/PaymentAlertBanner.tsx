'use client';

import { useSubscriptions } from '@/context/SubscriptionContext';
import { useNotifications } from '@/hooks/useNotifications';
import { formatCurrency } from '@/lib/utils';
import { daysUntil, cn } from '@/lib/utils';
import { Bell, BellOff } from 'lucide-react';
import { Button } from '@heroui/react';

export default function PaymentAlertBanner() {
  const { subscriptions } = useSubscriptions();
  const { permission, requestPermission, getUpcomingAlerts, isSupported } =
    useNotifications(subscriptions);

  const alerts = getUpcomingAlerts(3);

  if (alerts.length === 0 && permission === 'granted') return null;

  return (
    <div className="space-y-2">
      {alerts.map((sub) => {
        const days = daysUntil(sub.nextPaymentDate);
        return (
          <div
            key={sub.id}
            className={cn(
              'flex items-center gap-3 rounded-lg border p-3',
              days === 0
                ? 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20'
                : 'border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-900/20'
            )}
          >
            <Bell
              size={16}
              className={days === 0 ? 'text-red-500' : 'text-amber-500'}
            />
            <p className="flex-1 text-sm text-gray-900 dark:text-gray-100">
              <span className="font-medium">{sub.name}</span>
              {' — '}
              <span className="font-semibold">
                {formatCurrency(sub.price, sub.currency)}
              </span>
              {' '}
              {days === 0 ? 'сегодня' : days === 1 ? 'завтра' : `через ${days} дн.`}
            </p>
          </div>
        );
      })}

      {isSupported && permission === 'default' && (
        <div className="flex items-center gap-3 rounded-lg border border-blue-200 bg-blue-50 p-3 dark:border-blue-800 dark:bg-blue-900/20">
          <BellOff size={16} className="text-blue-500" />
          <p className="flex-1 text-sm text-gray-700 dark:text-gray-300">
            Включите уведомления, чтобы не пропустить списания
          </p>
          <Button size="sm" onPress={requestPermission}>
            Включить
          </Button>
        </div>
      )}
    </div>
  );
}
