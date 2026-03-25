'use client';

import { useState } from 'react';
import { useSubscriptions } from '@/context/SubscriptionContext';
import { formatCurrency, daysUntil } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select';
import { CalendarClock } from 'lucide-react';

type Period = 'day' | 'week' | 'month' | 'year';

const PERIOD_OPTIONS: { value: Period; label: string }[] = [
  { value: 'day', label: 'За день' },
  { value: 'week', label: 'За неделю' },
  { value: 'month', label: 'За месяц' },
  { value: 'year', label: 'За год' },
];

const PERIOD_SUFFIX: Record<Period, string> = {
  day: '/день',
  week: '/нед',
  month: '/мес',
  year: '/год',
};

export default function TotalSpending() {
  const { savings, settings, upcoming7 } = useSubscriptions();
  const [period, setPeriod] = useState<Period>('month');
  const cur = settings.defaultCurrency;

  const amounts: Record<Period, number> = {
    day: savings.perDay,
    week: savings.perWeek,
    month: savings.perMonth,
    year: savings.perYear,
  };

  const next = upcoming7.slice(0, 4);

  return (
    <Card className="bg-background shadow-sm">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div>
            <CardTitle>Платежи по подпискам</CardTitle>
          </div>
          <Select value={period} onValueChange={(v) => setPeriod(v as Period)}>
            <SelectTrigger size="sm">
              <SelectValue>{PERIOD_OPTIONS.find((o) => o.value === period)?.label}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              {PERIOD_OPTIONS.map((o) => (
                <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <span className="text-4xl font-bold tracking-tight">
            {formatCurrency(amounts[period], cur)}
          </span>
          <span className="ml-1 text-lg text-muted-foreground">
            {PERIOD_SUFFIX[period]}
          </span>
        </div>

        {next.length > 0 && (
          <div className="space-y-1">
            <p className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
              <CalendarClock size={12} />
              Ближайшие платежи
            </p>
            <div className="divide-y divide-border rounded-lg border border-border">
              {next.map((sub) => {
                const days = daysUntil(sub.nextPaymentDate);
                return (
                  <div key={sub.id} className="flex items-center justify-between px-3 py-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="truncate text-sm font-medium">{sub.name}</span>
                      <span className="shrink-0 text-xs text-muted-foreground">
                        {days === 0 ? 'сегодня' : days === 1 ? 'завтра' : `через ${days} дн.`}
                      </span>
                    </div>
                    <span className="ml-3 shrink-0 text-sm font-semibold">
                      {formatCurrency(sub.price, sub.currency)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
