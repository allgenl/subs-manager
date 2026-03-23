'use client';

import SubscriptionList from '@/components/subscriptions/SubscriptionList';
import PageTransition from '@/components/motion/PageTransition';
import { useSubscriptions } from '@/context/SubscriptionContext';
import { formatCurrency } from '@/lib/utils';

export default function SubscriptionsPage() {
  const { totalMonthly, activeCount, settings } = useSubscriptions();

  return (
    <PageTransition>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Подписки</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {activeCount} активных &middot; {formatCurrency(totalMonthly, settings.defaultCurrency)}/мес
            </p>
          </div>
        </div>
        <SubscriptionList />
      </div>
    </PageTransition>
  );
}
