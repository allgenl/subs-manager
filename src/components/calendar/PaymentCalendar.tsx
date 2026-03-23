'use client';

import { useState, useMemo } from 'react';
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  format,
  isSameMonth,
  isSameDay,
  isToday,
  addMonths,
  subMonths,
} from 'date-fns';
import { ru } from 'date-fns/locale';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useSubscriptions } from '@/context/SubscriptionContext';
import { formatCurrency, cn } from '@/lib/utils';
import Card from '@/components/ui/Card';
import { Subscription } from '@/types/subscription';

export default function PaymentCalendar() {
  const { subscriptions, settings } = useSubscriptions();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const days = useMemo(() => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const calStart = startOfWeek(monthStart, { weekStartsOn: 1 });
    const calEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });
    return eachDayOfInterval({ start: calStart, end: calEnd });
  }, [currentMonth]);

  const paymentsByDate = useMemo(() => {
    const map = new Map<string, Subscription[]>();
    for (const sub of subscriptions) {
      if (!sub.isActive) continue;
      const key = sub.nextPaymentDate;
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(sub);
    }
    return map;
  }, [subscriptions]);

  const selectedPayments = useMemo(() => {
    if (!selectedDate) return [];
    const key = format(selectedDate, 'yyyy-MM-dd');
    return paymentsByDate.get(key) || [];
  }, [selectedDate, paymentsByDate]);

  const weekDays = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <Card className="lg:col-span-2">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 capitalize">
            {format(currentMonth, 'LLLL yyyy', { locale: ru })}
          </h3>
          <div className="flex gap-1">
            <button
              onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
              className="rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
              className="rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-px">
          {weekDays.map((day) => (
            <div
              key={day}
              className="p-2 text-center text-xs font-medium text-gray-500 dark:text-gray-400"
            >
              {day}
            </div>
          ))}
          {days.map((day) => {
            const key = format(day, 'yyyy-MM-dd');
            const payments = paymentsByDate.get(key) || [];
            const isCurrentMonth = isSameMonth(day, currentMonth);
            const isSelected = selectedDate && isSameDay(day, selectedDate);

            return (
              <button
                key={key}
                onClick={() => setSelectedDate(day)}
                className={cn(
                  'relative flex flex-col items-center rounded-lg p-2 text-sm transition-colors',
                  !isCurrentMonth && 'text-gray-300 dark:text-gray-700',
                  isCurrentMonth && 'text-gray-900 dark:text-gray-100',
                  isToday(day) && 'font-bold',
                  isSelected && 'bg-blue-50 ring-2 ring-blue-500 dark:bg-blue-900/30',
                  !isSelected && 'hover:bg-gray-50 dark:hover:bg-gray-800/50'
                )}
              >
                <span>{format(day, 'd')}</span>
                {payments.length > 0 && (
                  <div className="mt-0.5 flex gap-0.5">
                    {payments.slice(0, 3).map((_, i) => (
                      <div
                        key={i}
                        className="h-1.5 w-1.5 rounded-full bg-blue-500"
                      />
                    ))}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </Card>

      <Card>
        <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">
          {selectedDate
            ? format(selectedDate, 'd MMMM yyyy', { locale: ru })
            : 'Выберите дату'}
        </h3>
        {selectedDate && selectedPayments.length === 0 && (
          <p className="text-sm text-gray-500 dark:text-gray-400 py-4 text-center">
            Нет платежей в этот день
          </p>
        )}
        <div className="space-y-3">
          {selectedPayments.map((sub) => (
            <div
              key={sub.id}
              className="flex items-center justify-between rounded-lg border border-gray-200 p-3 dark:border-gray-700"
            >
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{sub.name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{sub.category}</p>
              </div>
              <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                {formatCurrency(sub.price, sub.currency)}
              </span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
