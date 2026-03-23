export default function SubscriptionCardSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="animate-pulse rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900"
        >
          <div className="flex items-start justify-between mb-3">
            <div className="space-y-2 flex-1">
              <div className="h-4 w-32 rounded bg-gray-200 dark:bg-gray-700" />
              <div className="flex gap-2">
                <div className="h-5 w-16 rounded-full bg-gray-200 dark:bg-gray-700" />
                <div className="h-5 w-20 rounded-full bg-gray-100 dark:bg-gray-800" />
              </div>
            </div>
          </div>
          <div className="flex items-end justify-between mt-3">
            <div className="space-y-1">
              <div className="h-5 w-24 rounded bg-gray-200 dark:bg-gray-700" />
              <div className="h-3 w-16 rounded bg-gray-100 dark:bg-gray-800" />
            </div>
            <div className="h-3 w-28 rounded bg-gray-200 dark:bg-gray-700" />
          </div>
        </div>
      ))}
    </div>
  );
}
