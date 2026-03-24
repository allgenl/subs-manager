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

export default function SubscriptionRow({ subscription: sub }: { subscription: Subscription }) {
  const { deleteSubscription, toggleActive } = useSubscriptions();
  const [showDelete, setShowDelete] = useState(false);

  const monthly = toMonthlyCost({ ...sub, isActive: true });
  const days = daysUntil(sub.nextPaymentDate);

  return (
    <>
      <div
        className={cn(
          'flex items-center gap-3 rounded-lg border bg-white px-4 py-3 transition-colors hover:bg-gray-50 dark:bg-gray-900 dark:hover:bg-gray-800/50',
          sub.isActive
            ? 'border-gray-200 dark:border-gray-800'
            : 'border-dashed border-gray-300 opacity-60 dark:border-gray-700'
        )}
      >
        <div className="flex-1 min-w-0 flex items-center gap-3">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="font-medium text-sm text-gray-900 dark:text-gray-100 truncate">
                {sub.name}
              </span>
              {!sub.isActive && (
                <span className="text-[10px] text-gray-400">пауза</span>
              )}
            </div>
            <div className="flex items-center gap-2 mt-0.5">
              <CategoryBadge category={sub.category} />
              <span className="text-xs text-gray-400">{FREQUENCY_LABELS[sub.frequency]}</span>
            </div>
          </div>
        </div>

        <div className="text-right shrink-0 mr-2">
          <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
            {formatCurrency(sub.price, sub.currency)}
          </p>
          {sub.frequency !== 'monthly' && (
            <p className="text-[10px] text-gray-400">~{formatCurrency(monthly, sub.currency)}/мес</p>
          )}
        </div>

        <div className="text-right shrink-0 w-20">
          <p className="text-xs text-gray-500">{formatDateShort(sub.nextPaymentDate)}</p>
          <p className={cn(
            'text-[10px]',
            days <= 3 ? 'text-red-500' : days <= 7 ? 'text-amber-500' : 'text-gray-400'
          )}>
            {days === 0 ? 'сегодня' : days === 1 ? 'завтра' : `${days} дн.`}
          </p>
        </div>

        <div className="flex items-center gap-0.5 shrink-0">
          <Link
            href={`/subscriptions/${sub.id}`}
            className="rounded p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <Pencil size={14} />
          </Link>
          <button
            onClick={() => toggleActive(sub.id)}
            className="rounded p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            {sub.isActive ? <Pause size={14} /> : <Play size={14} />}
          </button>
          <button
            onClick={() => setShowDelete(true)}
            className="rounded p-1.5 text-gray-400 hover:text-red-500"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      <ConfirmDialog
        open={showDelete}
        onClose={() => setShowDelete(false)}
        onConfirm={() => deleteSubscription(sub.id)}
        title="Удалить подписку"
        message={`Удалить "${sub.name}"?`}
        confirmText="Удалить"
      />
    </>
  );
}
