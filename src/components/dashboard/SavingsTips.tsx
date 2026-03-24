'use client';

import { useMemo } from 'react';
import { useSubscriptions } from '@/context/SubscriptionContext';
import { toMonthlyCost } from '@/lib/calculations';
import { formatCurrency } from '@/lib/utils';
import Card from '@/components/ui/Card';
import { Lightbulb } from 'lucide-react';

export default function SavingsTips() {
  const { subscriptions, settings, convertCurrency } = useSubscriptions();
  const cur = settings.defaultCurrency;

  const tips = useMemo(() => {
    const result: string[] = [];
    const active = subscriptions.filter((s) => s.isActive);

    // Tip: yearly is cheaper
    const monthlyOnly = active.filter((s) => s.frequency === 'monthly');
    if (monthlyOnly.length >= 3) {
      const yearlyEquiv = monthlyOnly.reduce((s, sub) => s + sub.price * 12, 0);
      const savings = yearlyEquiv * 0.15; // ~15% savings typical
      result.push(`Перейдите на годовые планы для ${monthlyOnly.length} подписок — экономия до ${formatCurrency(savings, cur)}/год`);
    }

    // Tip: paused subscriptions
    const paused = subscriptions.filter((s) => !s.isActive && !s.isArchived);
    if (paused.length > 0) {
      result.push(`У вас ${paused.length} подписок на паузе. Рассмотрите их отмену если не планируете возобновлять.`);
    }

    // Tip: expensive subscription
    const expensive = active.filter((s) => toMonthlyCost(s, cur, convertCurrency) > 1000);
    if (expensive.length > 0) {
      result.push(`${expensive[0].name} стоит ${formatCurrency(toMonthlyCost(expensive[0], cur, convertCurrency), cur)}/мес — проверьте, есть ли более дешёвая альтернатива.`);
    }

    // Tip: many subscriptions in same category
    const categoryCounts = new Map<string, number>();
    active.forEach((s) => categoryCounts.set(s.category, (categoryCounts.get(s.category) || 0) + 1));
    for (const [cat, count] of categoryCounts) {
      if (count >= 3) {
        result.push(`У вас ${count} подписок в категории "${cat}". Возможно, часть из них дублирует функционал.`);
      }
    }

    return result;
  }, [subscriptions, cur, convertCurrency]);

  if (tips.length === 0) return null;

  return (
    <Card>
      <div className="flex items-center gap-2 mb-3">
        <Lightbulb size={16} className="text-amber-500" />
        <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
          Советы по экономии
        </h3>
      </div>
      <ul className="space-y-2">
        {tips.map((tip, i) => (
          <li key={i} className="text-sm text-gray-600 dark:text-gray-400 flex gap-2">
            <span className="text-amber-500 shrink-0">•</span>
            {tip}
          </li>
        ))}
      </ul>
    </Card>
  );
}
