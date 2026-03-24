'use client';

import { lazy, Suspense } from 'react';
import FrequencyBreakdown from '@/components/analytics/FrequencyBreakdown';
import MonthlyTrend from '@/components/analytics/MonthlyTrend';
import PaymentHistory from '@/components/analytics/PaymentHistory';
import { useSubscriptions } from '@/context/SubscriptionContext';
import EmptyState from '@/components/ui/EmptyState';
import { Button } from '@heroui/react';
import Link from 'next/link';
import { BarChart3 } from 'lucide-react';

const SpendingChart = lazy(() => import('@/components/analytics/SpendingChart'));
const CategoryPieChart = lazy(() => import('@/components/analytics/CategoryPieChart'));

function ChartSkeleton() {
  return (
    <div className="animate-pulse rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div className="h-4 w-32 rounded bg-gray-200 dark:bg-gray-700 mb-4" />
      <div className="h-64 rounded bg-gray-100 dark:bg-gray-800" />
    </div>
  );
}

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
      <MonthlyTrend />
      <Suspense fallback={<ChartSkeleton />}>
        <SpendingChart />
      </Suspense>
      <div className="grid gap-6 lg:grid-cols-2">
        <Suspense fallback={<ChartSkeleton />}>
          <CategoryPieChart />
        </Suspense>
        <FrequencyBreakdown />
      </div>
      <PaymentHistory />
    </div>
  );
}
