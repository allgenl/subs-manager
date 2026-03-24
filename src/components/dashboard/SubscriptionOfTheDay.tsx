'use client';

import { useMemo } from 'react';
import { useSubscriptions } from '@/context/SubscriptionContext';
import { formatCurrency } from '@/lib/utils';
import { CATEGORY_CONFIG } from '@/lib/constants';
import { Category } from '@/types/subscription';
import Card from '@/components/ui/Card';
import { Sparkles } from 'lucide-react';

export default function SubscriptionOfTheDay() {
  const { subscriptions, settings } = useSubscriptions();

  const sub = useMemo(() => {
    const active = subscriptions.filter((s) => s.isActive);
    if (active.length === 0) return null;
    // Deterministic "random" based on date
    const dayIndex = new Date().getDate() % active.length;
    return active[dayIndex];
  }, [subscriptions]);

  if (!sub) return null;

  const catConfig = CATEGORY_CONFIG[sub.category as Category];

  return (
    <Card className="bg-gradient-to-r from-violet-50 to-purple-50 border-violet-200 dark:from-violet-900/10 dark:to-purple-900/10 dark:border-violet-800">
      <div className="flex items-center gap-2 mb-2">
        <Sparkles size={14} className="text-violet-500" />
        <span className="text-xs font-medium text-violet-600 dark:text-violet-400">Подписка дня</span>
      </div>
      <p className="font-semibold text-gray-900 dark:text-gray-100">{sub.name}</p>
      <p className="text-sm text-gray-600 dark:text-gray-400">
        {formatCurrency(sub.price, sub.currency)} · {catConfig?.label ?? sub.category}
      </p>
    </Card>
  );
}
