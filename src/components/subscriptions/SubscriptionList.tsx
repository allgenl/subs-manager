'use client';

import { useState, useMemo } from 'react';
import { useSubscriptions } from '@/context/SubscriptionContext';
import { Subscription, Category } from '@/types/subscription';
import { toMonthlyCost } from '@/lib/calculations';
import { CATEGORIES, CATEGORY_CONFIG } from '@/lib/constants';
import SubscriptionCard from './SubscriptionCard';
import EmptyState from '@/components/ui/EmptyState';
import { AnimatedList, AnimatedItem } from '@/components/motion/AnimatedList';
import { CreditCard } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@heroui/react';

type SortOption = 'name' | 'price' | 'date';
type FilterStatus = 'all' | 'active' | 'paused';

export default function SubscriptionList() {
  const { subscriptions } = useSubscriptions();
  const [sortBy, setSortBy] = useState<SortOption>('date');
  const [filterCategory, setFilterCategory] = useState<Category | 'all'>('all');
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const [filterTag, setFilterTag] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const allTags = [...new Set(subscriptions.flatMap((s) => s.tags || []))];

  const filtered = useMemo(() => {
    let result = [...subscriptions];

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter((s) => s.name.toLowerCase().includes(q));
    }

    if (filterCategory !== 'all') {
      result = result.filter((s) => s.category === filterCategory);
    }

    if (filterStatus === 'active') {
      result = result.filter((s) => s.isActive);
    } else if (filterStatus === 'paused') {
      result = result.filter((s) => !s.isActive);
    }

    if (filterTag) {
      result = result.filter((s) => s.tags?.includes(filterTag));
    }

    switch (sortBy) {
      case 'name':
        result.sort((a, b) => a.name.localeCompare(b.name, 'ru'));
        break;
      case 'price':
        result.sort((a, b) => toMonthlyCost(b) - toMonthlyCost(a));
        break;
      case 'date':
        result.sort(
          (a, b) =>
            new Date(a.nextPaymentDate).getTime() - new Date(b.nextPaymentDate).getTime()
        );
        break;
    }

    return result;
  }, [subscriptions, sortBy, filterCategory, filterStatus, filterTag, searchQuery]);

  if (subscriptions.length === 0) {
    return (
      <EmptyState
        icon={<CreditCard size={48} />}
        title="Нет подписок"
        description="Добавьте свою первую подписку, чтобы начать отслеживать расходы"
        action={
          <Link href="/subscriptions/new">
            <Button>Добавить подписку</Button>
          </Link>
        }
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <input
          type="text"
          placeholder="Поиск..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full sm:w-64 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
        />

        <div className="flex items-center gap-2">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as FilterStatus)}
            className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
          >
            <option value="all">Все</option>
            <option value="active">Активные</option>
            <option value="paused">На паузе</option>
          </select>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
          >
            <option value="date">По дате</option>
            <option value="price">По цене</option>
            <option value="name">По имени</option>
          </select>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setFilterCategory('all')}
          className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
            filterCategory === 'all'
              ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400'
          }`}
        >
          Все
        </button>
        {CATEGORIES.map((cat) => {
          const hasItems = subscriptions.some((s) => s.category === cat);
          if (!hasItems) return null;
          return (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat === filterCategory ? 'all' : cat)}
              className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                filterCategory === cat
                  ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400'
              }`}
            >
              {CATEGORY_CONFIG[cat].label}
            </button>
          );
        })}
      </div>

      {allTags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setFilterTag(filterTag === tag ? null : tag)}
              className={`rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors ${
                filterTag === tag
                  ? 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400'
                  : 'bg-gray-50 text-gray-500 hover:bg-gray-100 dark:bg-gray-800/50 dark:text-gray-500 dark:hover:bg-gray-800'
              }`}
            >
              #{tag}
            </button>
          ))}
        </div>
      )}

      <AnimatedList className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {filtered.map((sub) => (
          <AnimatedItem key={sub.id}>
            <SubscriptionCard subscription={sub} />
          </AnimatedItem>
        ))}
      </AnimatedList>

      {filtered.length === 0 && subscriptions.length > 0 && (
        <p className="text-center text-sm text-gray-500 dark:text-gray-400 py-8">
          Ничего не найдено
        </p>
      )}
    </div>
  );
}
