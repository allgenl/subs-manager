'use client';

import PaymentCalendar from '@/components/calendar/PaymentCalendar';
import { useSubscriptions } from '@/context/SubscriptionContext';
import { exportToICS } from '@/lib/ics-export';
import { Button } from '@heroui/react';
import { Calendar as CalendarIcon } from 'lucide-react';

export default function CalendarPage() {
  const { subscriptions } = useSubscriptions();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Календарь платежей</h1>
        <Button
          size="sm"
          variant="outline"
          onPress={() => exportToICS(subscriptions)}
        >
          <CalendarIcon size={14} />
          Экспорт .ics
        </Button>
      </div>
      <PaymentCalendar />
    </div>
  );
}
