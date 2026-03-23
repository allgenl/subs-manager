import Link from 'next/link';
import { Home, Search } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
        <Search className="h-8 w-8 text-gray-400 dark:text-gray-500" />
      </div>
      <h1 className="text-6xl font-bold text-gray-200 dark:text-gray-800">404</h1>
      <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
        Страница не найдена
      </h2>
      <p className="max-w-md text-sm text-gray-500 dark:text-gray-400">
        Такой страницы не существует. Возможно, она была удалена или вы перешли по неверной ссылке.
      </p>
      <Link
        href="/"
        className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
      >
        <Home size={16} />
        На главную
      </Link>
    </div>
  );
}
