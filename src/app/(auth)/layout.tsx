import { CreditCard } from 'lucide-react';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-8 dark:bg-gray-950">
      <div className="w-full max-w-sm space-y-6 sm:max-w-md">
        <div className="flex items-center justify-center gap-2">
          <CreditCard className="h-8 w-8 text-blue-600 dark:text-blue-400" />
          <span className="text-2xl font-bold text-gray-900 dark:text-gray-100">SubsManager</span>
        </div>
        {children}
      </div>
    </div>
  );
}
