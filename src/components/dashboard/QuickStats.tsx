'use client';

import { useSubscriptions } from '@/context/SubscriptionContext';
import { formatCurrency } from '@/lib/utils';
import { Card, CardHeader, CardContent, CardFooter, CardTitle, CardDescription, CardAction } from '@/components/ui/Card';
import { AnimatedList, AnimatedItem } from '@/components/motion/AnimatedList';
import { CreditCard, TrendingUp, Star, Hash } from 'lucide-react';

export default function QuickStats() {
  const { activeCount, mostExpensive, averageCost, savings, settings } = useSubscriptions();
  const cur = settings.defaultCurrency;

  const stats = [
    {
      label: 'Активных подписок',
      value: activeCount.toString(),
      icon: Hash,
      description: 'Подписки отслеживаются',
      subtext: 'в данный момент',
    },
    {
      label: 'Самая дорогая',
      value: mostExpensive?.name ?? '—',
      icon: Star,
      description: mostExpensive
        ? formatCurrency(mostExpensive.price, mostExpensive.currency)
        : '—',
      subtext: mostExpensive ? `за ${mostExpensive.frequency === 'monthly' ? 'месяц' : 'год'}` : '',
    },
    {
      label: 'Средняя стоимость',
      value: formatCurrency(averageCost, cur) + '/мес',
      icon: TrendingUp,
      description: formatCurrency(averageCost * 12, cur) + ' в год',
      subtext: 'на одну подписку',
    },
    {
      label: 'Расходы в год',
      value: formatCurrency(savings.perYear, cur),
      icon: CreditCard,
      description: formatCurrency(savings.perYear / 12, cur) + ' в месяц',
      subtext: 'все активные подписки',
    },
  ];

  return (
    <AnimatedList className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {stats.map((stat) => (
        <AnimatedItem key={stat.label}>
          <Card className="justify-between bg-background shadow-sm gap-1">
            <CardHeader className="pb-0">
              <CardDescription>{stat.label}</CardDescription>
              <CardAction>
                <span className={`flex h-8 w-8 items-center justify-center text-red-500/75 dark:text-red-400 border-red-500/75 border-solid border-1 rounded-md`}>
                  <stat.icon size={14} />
                </span>
              </CardAction>
            </CardHeader>
            <CardContent className="pt-2 pb-2">
              <CardTitle className="text-2xl font-bold truncate">{stat.value}</CardTitle>
            </CardContent>
            <CardFooter className="flex-col items-start gap-0.5 border-t-0 bg-transparent p-4 pt-0">
              <span className="text-sm font-semibold">{stat.description}</span>
              <span className="text-xs text-muted-foreground">{stat.subtext}</span>
            </CardFooter>
          </Card>
        </AnimatedItem>
      ))}
    </AnimatedList>
  );
}
