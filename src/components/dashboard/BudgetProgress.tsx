'use client';

import { useSubscriptions } from '@/context/SubscriptionContext';
import { formatCurrency } from '@/lib/utils';
import Card from '@/components/ui/Card';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

export default function BudgetProgress() {
  const { totalMonthly, settings } = useSubscriptions();

  if (!settings.monthlyBudget) {
    return null;
  }

  const percentage = Math.min((totalMonthly / settings.monthlyBudget) * 100, 100);
  const remaining = settings.monthlyBudget - totalMonthly;
  const cur = settings.defaultCurrency;

  return (
    <Card>
      <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">
        Бюджет
      </h3>
      <div className="space-y-3">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {formatCurrency(totalMonthly, cur)}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              из {formatCurrency(settings.monthlyBudget, cur)}
            </p>
          </div>
          <span
            className={cn(
              'text-sm font-semibold',
              remaining >= 0
                ? 'text-emerald-600 dark:text-emerald-400'
                : 'text-red-600 dark:text-red-400'
            )}
          >
            {remaining >= 0
              ? `Остаток: ${formatCurrency(remaining, cur)}`
              : `Превышение: ${formatCurrency(Math.abs(remaining), cur)}`}
          </span>
        </div>

        <div className="h-3 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
          <motion.div
            className={cn(
              'h-full rounded-full',
              percentage < 75
                ? 'bg-emerald-500'
                : percentage < 90
                ? 'bg-amber-500'
                : 'bg-red-500'
            )}
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          />
        </div>

        <p className="text-xs text-gray-500 dark:text-gray-400 text-right">
          {percentage.toFixed(0)}% использовано
        </p>
      </div>
    </Card>
  );
}
