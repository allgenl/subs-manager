export default function AnalyticsLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-7 w-32 rounded bg-gray-200 dark:bg-gray-700" />
      {/* Trend skeleton */}
      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-gray-200 dark:bg-gray-700" />
          <div className="space-y-2">
            <div className="h-6 w-40 rounded bg-gray-200 dark:bg-gray-700" />
            <div className="h-4 w-56 rounded bg-gray-100 dark:bg-gray-800" />
          </div>
        </div>
      </div>
      {/* Chart skeleton */}
      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div className="h-4 w-48 rounded bg-gray-200 dark:bg-gray-700 mb-4" />
        <div className="h-64 rounded bg-gray-100 dark:bg-gray-800" />
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <div className="h-4 w-40 rounded bg-gray-200 dark:bg-gray-700 mb-4" />
          <div className="h-48 rounded bg-gray-100 dark:bg-gray-800" />
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <div className="h-4 w-36 rounded bg-gray-200 dark:bg-gray-700 mb-4" />
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-8 rounded bg-gray-100 dark:bg-gray-800" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
