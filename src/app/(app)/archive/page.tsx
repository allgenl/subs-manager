'use client';

import { useSubscriptions } from '@/context/SubscriptionContext';
import { formatCurrency, formatDate } from '@/lib/utils';
import EmptyState from '@/components/ui/EmptyState';
import PageTransition from '@/components/motion/PageTransition';
import { Button } from '@heroui/react';
import { Archive, RotateCcw, Trash2 } from 'lucide-react';

export default function ArchivePage() {
  const { archivedSubscriptions, restoreSubscription, deleteSubscription } = useSubscriptions();

  if (archivedSubscriptions.length === 0) {
    return (
      <EmptyState
        icon={<Archive size={48} />}
        title="Архив пуст"
        description="Архивированные подписки появятся здесь"
      />
    );
  }

  return (
    <PageTransition>
      <div className="space-y-6 max-w-3xl">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Архив</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {archivedSubscriptions.length} подписок в архиве
        </p>

        <div className="space-y-2">
          {archivedSubscriptions.map((sub) => (
            <div
              key={sub.id}
              className="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-4 py-3 dark:border-gray-800 dark:bg-gray-900"
            >
              <div>
                <p className="font-medium text-gray-900 dark:text-gray-100">{sub.name}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {formatCurrency(sub.price, sub.currency)} &middot; Архивирована {formatDate(sub.updatedAt)}
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onPress={() => restoreSubscription(sub.id)}
                >
                  <RotateCcw size={14} />
                  Восстановить
                </Button>
                <Button
                  size="sm"
                  variant="danger"
                  onPress={() => deleteSubscription(sub.id)}
                >
                  <Trash2 size={14} />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </PageTransition>
  );
}
