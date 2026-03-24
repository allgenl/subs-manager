'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Pencil, Trash2, Pause, Play } from 'lucide-react';
import { Subscription } from '@/types/subscription';
import { useSubscriptions } from '@/context/SubscriptionContext';
import { toMonthlyCost } from '@/lib/calculations';
import { formatCurrency, formatDateShort, daysUntil, cn } from '@/lib/utils';
import { FREQUENCY_LABELS } from '@/lib/constants';
import CategoryBadge from './CategoryBadge';
import ConfirmDialog from '@/components/ui/ConfirmDialog';

interface SubscriptionCardProps {
  subscription: Subscription;
}

export default function SubscriptionCard({ subscription: sub }: SubscriptionCardProps) {
  const { deleteSubscription, toggleActive } = useSubscriptions();
  const [showDelete, setShowDelete] = useState(false);

  const monthly = toMonthlyCost({ ...sub, isActive: true });
  const days = daysUntil(sub.nextPaymentDate);

  return (
    <>
      <div
        className={cn(
          'group relative rounded-xl border bg-white p-4 shadow-sm transition-all hover:shadow-md dark:bg-gray-900',
          sub.isActive
            ? 'border-gray-200 dark:border-gray-800'
            : 'border-dashed border-gray-300 opacity-60 dark:border-gray-700'
        )}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 truncate">
                {sub.name}
              </h3>
              {!sub.isActive && (
                <span className="text-xs text-gray-400 dark:text-gray-500">на паузе</span>
              )}
            </div>
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <CategoryBadge category={sub.category} />
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {FREQUENCY_LABELS[sub.frequency]}
              </span>
              {sub.tags?.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-violet-50 px-2 py-0.5 text-[10px] font-medium text-violet-600 dark:bg-violet-900/20 dark:text-violet-400"
                >
                  #{tag}
                </span>
              ))}
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-bold text-gray-900 dark:text-gray-100">
                {sub.isShared && sub.myShare
                  ? formatCurrency(sub.myShare, sub.currency)
                  : formatCurrency(sub.price, sub.currency)}
              </span>
              {sub.isShared && sub.totalMembers && (
                <span className="text-xs text-blue-500 dark:text-blue-400">
                  ({formatCurrency(sub.price, sub.currency)} / {sub.totalMembers})
                </span>
              )}
              {sub.frequency !== 'monthly' && (
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  (~{formatCurrency(monthly, sub.currency)}/мес)
                </span>
              )}
            </div>
          </div>

          <div className="text-right shrink-0">
            <p className="text-xs text-gray-500 dark:text-gray-400">Следующий платёж</p>
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
              {formatDateShort(sub.nextPaymentDate)}
            </p>
            {days >= 0 && (
              <p
                className={cn(
                  'text-xs mt-0.5',
                  days <= 3 ? 'text-red-500' : days <= 7 ? 'text-amber-500' : 'text-gray-400'
                )}
              >
                {days === 0 ? 'Сегодня' : days === 1 ? 'Завтра' : `через ${days} дн.`}
              </p>
            )}
          </div>
        </div>

        <div className="mt-3 flex items-center gap-1 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
          <Link
            href={`/subscriptions/${sub.id}`}
            aria-label={`Редактировать ${sub.name}`}
            className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-300"
          >
            <Pencil size={16} />
          </Link>
          <button
            onClick={() => toggleActive(sub.id)}
            className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-300"
            title={sub.isActive ? 'Приостановить' : 'Возобновить'}
          >
            {sub.isActive ? <Pause size={16} /> : <Play size={16} />}
          </button>
          <button
            onClick={() => setShowDelete(true)}
            aria-label={`Удалить ${sub.name}`}
            className="rounded-lg p-2 text-gray-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20 dark:hover:text-red-400"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      <ConfirmDialog
        open={showDelete}
        onClose={() => setShowDelete(false)}
        onConfirm={() => deleteSubscription(sub.id)}
        title="Удалить подписку"
        message={`Вы уверены, что хотите удалить "${sub.name}"? Это действие нельзя отменить.`}
        confirmText="Удалить"
      />
    </>
  );
}
