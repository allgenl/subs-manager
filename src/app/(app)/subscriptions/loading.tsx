import SubscriptionCardSkeleton from '@/components/ui/SubscriptionCardSkeleton';

export default function SubscriptionsLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="h-7 w-40 rounded bg-gray-200 dark:bg-gray-700" />
        <div className="h-9 w-32 rounded-lg bg-gray-200 dark:bg-gray-700" />
      </div>

      {/* Filters skeleton */}
      <div className="flex flex-wrap gap-3">
        <div className="h-9 w-48 rounded-lg bg-gray-200 dark:bg-gray-700" />
        <div className="h-9 w-32 rounded-lg bg-gray-200 dark:bg-gray-700" />
        <div className="h-9 w-28 rounded-lg bg-gray-200 dark:bg-gray-700" />
        <div className="h-9 w-28 rounded-lg bg-gray-200 dark:bg-gray-700" />
      </div>

      <SubscriptionCardSkeleton />
    </div>
  );
}
