'use client';

import SpendingChart from '@/components/analytics/SpendingChart';
import CategoryPieChart from '@/components/analytics/CategoryPieChart';
import FrequencyBreakdown from '@/components/analytics/FrequencyBreakdown';
import { useSubscriptions } from '@/context/SubscriptionContext';
import EmptyState from '@/components/ui/EmptyState';
import Button from '@/components/ui/Button';
import Link from 'next/link';
import { BarChart3 } from 'lucide-react';

export default function AnalyticsPage() {
  const { subscriptions } = useSubscriptions();

  if (subscriptions.filter((s) => s.isActive).length === 0) {
    return (
      <EmptyState
        icon={<BarChart3 size={48} />}
        title="Нет данных для аналитики"
        description="Добавьте активные подписки, чтобы увидеть статистику"
        action={
          <Link href="/subscriptions/new">
            <Button>Добавить подписку</Button>
          </Link>
        }
      />
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Аналитика</h1>
      <SpendingChart />
      <div className="grid gap-6 lg:grid-cols-2">
        <CategoryPieChart />
        <FrequencyBreakdown />
      </div>
    </div>
  );
}
