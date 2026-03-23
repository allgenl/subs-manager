'use client';

import { useEffect } from 'react';
import { Button } from '@heroui/react';
import { AlertTriangle, RotateCcw } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
        <AlertTriangle className="h-8 w-8 text-red-600 dark:text-red-400" />
      </div>
      <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
        Что-то пошло не так
      </h2>
      <p className="max-w-md text-sm text-gray-500 dark:text-gray-400">
        Произошла непредвиденная ошибка. Попробуйте перезагрузить страницу.
      </p>
      <Button onPress={reset} variant="primary">
        <RotateCcw size={16} />
        Попробовать снова
      </Button>
    </div>
  );
}
