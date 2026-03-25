'use client';

import TotalSpending from '@/components/dashboard/TotalSpending';
import QuickStats from '@/components/dashboard/QuickStats';
import UpcomingPayments from '@/components/dashboard/UpcomingPayments';
import BudgetProgress from '@/components/dashboard/BudgetProgress';
import PaymentAlertBanner from '@/components/dashboard/PaymentAlertBanner';
import { useSubscriptions } from '@/context/SubscriptionContext';
import { useDashboardConfig, WIDGET_LABELS, type WidgetKey } from '@/hooks/useDashboardConfig';
import EmptyState from '@/components/ui/EmptyState';
import Link from 'next/link';
import PageTransition from '@/components/motion/PageTransition';
import { LayoutDashboard, Settings2, Eye, EyeOff } from 'lucide-react';
import { Button } from '@heroui/react';
import { useState } from 'react';

export default function DashboardPage() {
  const { subscriptions } = useSubscriptions();
  const { isVisible, toggleWidget } = useDashboardConfig();
  const [showConfig, setShowConfig] = useState(false);

  if (subscriptions.length === 0) {
    return (
      <EmptyState
        icon={<LayoutDashboard size={48} />}
        title="Добро пожаловать в SubsManager!"
        description="Добавьте свои подписки, чтобы увидеть статистику расходов"
        action={
          <Link href="/subscriptions/new">
            <Button>Добавить первую подписку</Button>
          </Link>
        }
      />
    );
  }

  return (
    <PageTransition>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Главная</h1>
          <button
            onClick={() => setShowConfig(!showConfig)}
            className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-300"
            title="Настроить виджеты"
          >
            <Settings2 size={18} />
          </button>
        </div>

        {showConfig && (
          <div className="flex flex-wrap gap-2 rounded-lg border border-gray-200 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-800/50">
            {(Object.keys(WIDGET_LABELS) as WidgetKey[]).map((key) => (
              <button
                key={key}
                onClick={() => toggleWidget(key)}
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                  isVisible(key)
                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                    : 'bg-gray-200 text-gray-500 dark:bg-gray-700 dark:text-gray-500'
                }`}
              >
                {isVisible(key) ? <Eye size={12} /> : <EyeOff size={12} />}
                {WIDGET_LABELS[key]}
              </button>
            ))}
          </div>
        )}

{isVisible('alerts') && <PaymentAlertBanner />}
        {isVisible('totalSpending') && <TotalSpending />}
        {isVisible('quickStats') && <QuickStats />}
        <div className="grid gap-6 lg:grid-cols-2">
          {isVisible('upcoming') && <UpcomingPayments />}
          {isVisible('budget') && <BudgetProgress />}
        </div>
      </div>
    </PageTransition>
  );
}
