'use client';

import { useEffect, useState, useCallback } from 'react';
import { Subscription } from '@/types/subscription';
import { daysUntil } from '@/lib/utils';
import { formatCurrency } from '@/lib/utils';

export function useNotifications(subscriptions: Subscription[]) {
  const [permission, setPermission] = useState<NotificationPermission>('default');

  useEffect(() => {
    if ('Notification' in window) {
      setPermission(Notification.permission);
    }
  }, []);

  const requestPermission = useCallback(async () => {
    if (!('Notification' in window)) return 'denied' as const;
    const result = await Notification.requestPermission();
    setPermission(result);
    return result;
  }, []);

  const getUpcomingAlerts = useCallback(
    (daysBefore: number = 1) => {
      return subscriptions.filter((sub) => {
        if (!sub.isActive) return false;
        const days = daysUntil(sub.nextPaymentDate);
        const reminder = sub.reminderDaysBefore ?? daysBefore;
        return days >= 0 && days <= reminder;
      });
    },
    [subscriptions]
  );

  const sendNotification = useCallback(
    (sub: Subscription) => {
      if (permission !== 'granted' || !('Notification' in window)) return;

      const days = daysUntil(sub.nextPaymentDate);
      const when =
        days === 0 ? 'сегодня' : days === 1 ? 'завтра' : `через ${days} дн.`;

      new Notification(`Списание ${when}`, {
        body: `${sub.name} — ${formatCurrency(sub.price, sub.currency)}`,
        icon: '/icons/icon-192.png',
        tag: `payment-${sub.id}`,
      });
    },
    [permission]
  );

  // Auto-notify on mount (once per session)
  useEffect(() => {
    if (permission !== 'granted') return;

    const notifiedKey = 'subs-notified-date';
    const today = new Date().toISOString().split('T')[0];
    if (sessionStorage.getItem(notifiedKey) === today) return;

    const alerts = getUpcomingAlerts();
    alerts.forEach(sendNotification);

    if (alerts.length > 0) {
      sessionStorage.setItem(notifiedKey, today);
    }
  }, [permission, getUpcomingAlerts, sendNotification]);

  return {
    permission,
    requestPermission,
    getUpcomingAlerts,
    sendNotification,
    isSupported: typeof window !== 'undefined' && 'Notification' in window,
  };
}
