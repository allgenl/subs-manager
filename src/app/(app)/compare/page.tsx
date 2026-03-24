'use client';

import { useState } from 'react';
import { useSubscriptions } from '@/context/SubscriptionContext';
import { toMonthlyCost } from '@/lib/calculations';
import { formatCurrency } from '@/lib/utils';
import { CATEGORY_CONFIG, FREQUENCY_LABELS } from '@/lib/constants';
import { Category } from '@/types/subscription';
import Card from '@/components/ui/Card';
import PageTransition from '@/components/motion/PageTransition';
import EmptyState from '@/components/ui/EmptyState';
import { Scale, Plus, X } from 'lucide-react';

export default function ComparePage() {
  const { subscriptions, settings, convertCurrency } = useSubscriptions();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const cur = settings.defaultCurrency;

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id)
        ? prev.filter((i) => i !== id)
        : prev.length < 4 ? [...prev, id] : prev
    );
  };

  const selected = subscriptions.filter((s) => selectedIds.includes(s.id));
  const available = subscriptions.filter((s) => !selectedIds.includes(s.id));

  if (subscriptions.length < 2) {
    return (
      <EmptyState
        icon={<Scale size={48} />}
        title="Недостаточно подписок"
        description="Добавьте минимум 2 подписки для сравнения"
      />
    );
  }

  return (
    <PageTransition>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Сравнение</h1>

        {/* Selector */}
        <Card>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
            Выберите до 4 подписок для сравнения
          </p>
          <div className="flex flex-wrap gap-2">
            {available.map((sub) => (
              <button
                key={sub.id}
                onClick={() => toggleSelect(sub.id)}
                className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-3 py-1.5 text-sm transition-colors hover:border-blue-300 hover:bg-blue-50 dark:border-gray-700 dark:bg-gray-900 dark:hover:border-blue-600 dark:hover:bg-blue-900/20"
              >
                <Plus size={12} />
                {sub.name}
              </button>
            ))}
          </div>
          {selected.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
              {selected.map((sub) => (
                <button
                  key={sub.id}
                  onClick={() => toggleSelect(sub.id)}
                  className="inline-flex items-center gap-1.5 rounded-full bg-blue-100 px-3 py-1.5 text-sm font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                >
                  {sub.name}
                  <X size={12} />
                </button>
              ))}
            </div>
          )}
        </Card>

        {/* Comparison table */}
        {selected.length >= 2 && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="py-3 pr-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400">
                    Параметр
                  </th>
                  {selected.map((sub) => (
                    <th
                      key={sub.id}
                      className="py-3 px-4 text-left text-xs font-semibold text-gray-900 dark:text-gray-100"
                    >
                      {sub.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                <Row label="Цена">
                  {selected.map((sub) => (
                    <td key={sub.id} className="px-4 py-3 font-semibold text-gray-900 dark:text-gray-100">
                      {formatCurrency(sub.price, sub.currency)}
                    </td>
                  ))}
                </Row>
                <Row label="В месяц">
                  {selected.map((sub) => {
                    const monthly = toMonthlyCost({ ...sub, isActive: true }, cur, convertCurrency);
                    const isMin = monthly === Math.min(...selected.map((s) => toMonthlyCost({ ...s, isActive: true }, cur, convertCurrency)));
                    return (
                      <td key={sub.id} className={`px-4 py-3 font-semibold ${isMin ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-900 dark:text-gray-100'}`}>
                        {formatCurrency(monthly, cur)}
                        {isMin && selected.length > 1 && <span className="ml-1 text-xs">мин</span>}
                      </td>
                    );
                  })}
                </Row>
                <Row label="В год">
                  {selected.map((sub) => (
                    <td key={sub.id} className="px-4 py-3 text-gray-700 dark:text-gray-300">
                      {formatCurrency(toMonthlyCost({ ...sub, isActive: true }, cur, convertCurrency) * 12, cur)}
                    </td>
                  ))}
                </Row>
                <Row label="Частота">
                  {selected.map((sub) => (
                    <td key={sub.id} className="px-4 py-3 text-gray-700 dark:text-gray-300">
                      {FREQUENCY_LABELS[sub.frequency]}
                    </td>
                  ))}
                </Row>
                <Row label="Категория">
                  {selected.map((sub) => (
                    <td key={sub.id} className="px-4 py-3 text-gray-700 dark:text-gray-300">
                      {CATEGORY_CONFIG[sub.category as Category]?.label ?? sub.category}
                    </td>
                  ))}
                </Row>
                <Row label="Статус">
                  {selected.map((sub) => (
                    <td key={sub.id} className="px-4 py-3">
                      <span className={`text-xs font-medium ${sub.isActive ? 'text-emerald-600' : 'text-gray-400'}`}>
                        {sub.isActive ? 'Активна' : 'На паузе'}
                      </span>
                    </td>
                  ))}
                </Row>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </PageTransition>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <tr>
      <td className="py-3 pr-4 text-xs font-medium text-gray-500 dark:text-gray-400 whitespace-nowrap">
        {label}
      </td>
      {children}
    </tr>
  );
}
