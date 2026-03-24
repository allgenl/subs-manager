'use client';

import { useExchangeRates } from '@/hooks/useExchangeRates';
import Card from '@/components/ui/Card';
import { RefreshCw } from 'lucide-react';

export default function ExchangeRatesCard() {
  const { rates, loading } = useExchangeRates();

  return (
    <Card>
      <div className="flex items-center gap-2 mb-3">
        <RefreshCw size={14} className={`text-gray-500 ${loading ? 'animate-spin' : ''}`} />
        <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
          Курсы валют
        </h2>
      </div>
      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-lg bg-gray-50 p-3 text-center dark:bg-gray-800">
          <p className="text-xs text-gray-500 dark:text-gray-400">USD/RUB</p>
          <p className="text-lg font-bold text-gray-900 dark:text-gray-100">
            {rates.RUB.toFixed(2)}
          </p>
        </div>
        <div className="rounded-lg bg-gray-50 p-3 text-center dark:bg-gray-800">
          <p className="text-xs text-gray-500 dark:text-gray-400">EUR/RUB</p>
          <p className="text-lg font-bold text-gray-900 dark:text-gray-100">
            {(rates.RUB / rates.EUR).toFixed(2)}
          </p>
        </div>
        <div className="rounded-lg bg-gray-50 p-3 text-center dark:bg-gray-800">
          <p className="text-xs text-gray-500 dark:text-gray-400">EUR/USD</p>
          <p className="text-lg font-bold text-gray-900 dark:text-gray-100">
            {(1 / rates.EUR).toFixed(4)}
          </p>
        </div>
      </div>
      <p className="mt-2 text-xs text-gray-400">Обновляются каждые 24 часа</p>
    </Card>
  );
}
