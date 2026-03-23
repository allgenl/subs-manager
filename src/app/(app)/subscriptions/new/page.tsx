'use client';

import SubscriptionForm from '@/components/subscriptions/SubscriptionForm';

export default function NewSubscriptionPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Новая подписка</h1>
      <SubscriptionForm mode="create" />
    </div>
  );
}
