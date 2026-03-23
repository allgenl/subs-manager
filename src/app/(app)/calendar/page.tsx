'use client';

import PaymentCalendar from '@/components/calendar/PaymentCalendar';

export default function CalendarPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Календарь платежей</h1>
      <PaymentCalendar />
    </div>
  );
}
