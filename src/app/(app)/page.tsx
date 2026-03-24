'use client';

import TotalSpending from '@/components/dashboard/TotalSpending';
import QuickStats from '@/components/dashboard/QuickStats';
import UpcomingPayments from '@/components/dashboard/UpcomingPayments';
import BudgetProgress from '@/components/dashboard/BudgetProgress';
import PaymentAlertBanner from '@/components/dashboard/PaymentAlertBanner';
import MigrationPrompt from '@/components/migration/MigrationPrompt';
import { useSubscriptions } from '@/context/SubscriptionContext';
import EmptyState from '@/components/ui/EmptyState';
import Link from 'next/link';
import PageTransition from '@/components/motion/PageTransition';
import { LayoutDashboard } from 'lucide-react';
import { Button } from '@heroui/react';

export default function DashboardPage() {
  const { subscriptions } = useSubscriptions();

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
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Главная</h1>
        <MigrationPrompt />
        <PaymentAlertBanner />
        <TotalSpending />
        <QuickStats />
        <div className="grid gap-6 lg:grid-cols-2">
          <UpcomingPayments />
          <BudgetProgress />
        </div>
      </div>
    </PageTransition>
  );
}
