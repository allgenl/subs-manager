'use client';

import { useParams, useRouter } from 'next/navigation';
import { useSubscriptions } from '@/context/SubscriptionContext';
import SubscriptionForm from '@/components/subscriptions/SubscriptionForm';
import EmptyState from '@/components/ui/EmptyState';
import Button from '@/components/ui/Button';
import { AlertCircle } from 'lucide-react';

export default function EditSubscriptionPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { subscriptions } = useSubscriptions();

  const subscription = subscriptions.find((s) => s.id === id);

  if (!subscription) {
    return (
      <EmptyState
        icon={<AlertCircle size={48} />}
        title="Подписка не найдена"
        description="Возможно, она была удалена"
        action={
          <Button onClick={() => router.push('/subscriptions')}>
            К списку подписок
          </Button>
        }
      />
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
        Редактировать: {subscription.name}
      </h1>
      <SubscriptionForm mode="edit" initialData={subscription} />
    </div>
  );
}
