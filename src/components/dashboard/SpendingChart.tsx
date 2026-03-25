'use client';

import { useMemo } from 'react';
import { useSubscriptions } from '@/context/SubscriptionContext';
import { formatCurrency } from '@/lib/utils';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/Card';
import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from '@/components/ui/chart';
import { TrendingUp } from 'lucide-react';

const MONTH_LABELS = ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'];

const chartConfig = {
  spending: {
    label: 'Расходы',
    color: 'var(--chart-1)',
  },
  label: {
    color: 'var(--background)',
  },
} satisfies ChartConfig;

function getIntervalDays(frequency: string, customDays?: number): number {
  switch (frequency) {
    case 'daily': return 1;
    case 'weekly': return 7;
    case 'monthly': return 30.4375;
    case 'yearly': return 365.25;
    default: return customDays ?? 30;
  }
}

export default function SpendingChart() {
  const { subscriptions, settings, convertCurrency } = useSubscriptions();
  const cur = settings.defaultCurrency;

  const chartData = useMemo(() => {
    const now = new Date();
    const year = now.getFullYear();
    const currentMonth = now.getMonth();

    const monthlyTotals = Array(currentMonth + 1).fill(0);

    for (const sub of subscriptions) {
      if (!sub.isActive || sub.isArchived) continue;
      const intervalMs = getIntervalDays(sub.frequency, sub.customFrequencyDays) * 86400000;
      let date = new Date(sub.nextPaymentDate);
      date.setHours(0, 0, 0, 0);

      const yearStart = new Date(year, 0, 1);
      const yearEnd = new Date(year, currentMonth + 1, 0);

      while (date > yearStart) date = new Date(date.getTime() - intervalMs);
      while (date <= yearEnd) {
        if (date >= yearStart && date.getFullYear() === year) {
          const m = date.getMonth();
          if (m <= currentMonth) {
            monthlyTotals[m] += convertCurrency(sub.price, sub.currency, cur);
          }
        }
        date = new Date(date.getTime() + intervalMs);
      }
    }

    return monthlyTotals.map((total, i) => ({
      month: MONTH_LABELS[i],
      spending: Math.round(total),
    }));
  }, [subscriptions, cur, convertCurrency]);

  const total = chartData.reduce((s, d) => s + d.spending, 0);
  const currentMonthSpending = chartData.at(-1)?.spending ?? 0;

  return (
    <Card className="bg-background shadow-sm">
      <CardHeader>
        <CardTitle>Расходы по месяцам</CardTitle>
        <CardDescription>{new Date().getFullYear()} год</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-48 w-full">
          <BarChart
            accessibilityLayer
            data={chartData}
            layout="vertical"
            margin={{ right: 48 }}
          >
            <CartesianGrid horizontal={false} />
            <YAxis dataKey="month" type="category" tickLine={false} axisLine={false} hide />
            <XAxis dataKey="spending" type="number" hide />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  indicator="line"
                  formatter={(value) => formatCurrency(Number(value), cur)}
                />
              }
            />
            <Bar dataKey="spending" fill="var(--color-spending)" radius={4}>
              <LabelList
                dataKey="month"
                position="insideLeft"
                offset={8}
                className="fill-(--color-label)"
                fontSize={12}
              />
              <LabelList
                dataKey="spending"
                position="right"
                offset={8}
                className="fill-foreground"
                fontSize={11}
                formatter={(v: number) => v > 0 ? formatCurrency(v, cur) : ''}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-1 border-t-0 bg-transparent text-sm">
        <div className="flex gap-2 font-medium leading-none">
          В этом месяце {formatCurrency(currentMonthSpending, cur)} <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Итого за {new Date().getFullYear()} год: {formatCurrency(total, cur)}
        </div>
      </CardFooter>
    </Card>
  );
}
