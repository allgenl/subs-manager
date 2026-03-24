'use client';

import { useState, useMemo, useCallback } from 'react';
import { useSubscriptions } from '@/context/SubscriptionContext';
import { Subscription, Category } from '@/types/subscription';
import { toMonthlyCost } from '@/lib/calculations';
import { CATEGORIES, CATEGORY_CONFIG } from '@/lib/constants';
import { cn } from '@/lib/utils';
import SubscriptionCard from './SubscriptionCard';
import SortableSubscriptionCard from './SortableSubscriptionCard';
import EmptyState from '@/components/ui/EmptyState';
import { AnimatedList, AnimatedItem } from '@/components/motion/AnimatedList';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import { SortableContext, rectSortingStrategy } from '@dnd-kit/sortable';
import SubscriptionRow from './SubscriptionRow';
import { CreditCard, LayoutGrid, List, CheckSquare, Archive, Pause } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@heroui/react';

type SortOption = 'name' | 'price' | 'date' | 'manual';
type FilterStatus = 'all' | 'active' | 'paused';

export default function SubscriptionList() {
  const { subscriptions, archiveSubscription, toggleActive } = useSubscriptions();
  const [sortBy, setSortBy] = useState<SortOption>('date');
  const [filterCategory, setFilterCategory] = useState<Category | 'all'>('all');
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const [filterTag, setFilterTag] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [maxPrice, setMaxPrice] = useState<number | null>(null);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const selectMode = selected.size > 0;

  const toggleSelect = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const selectAll = () => {
    if (selected.size === filtered.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(filtered.map((s) => s.id)));
    }
  };

  const bulkArchive = () => {
    selected.forEach((id) => archiveSubscription(id));
    setSelected(new Set());
  };

  const bulkTogglePause = () => {
    selected.forEach((id) => toggleActive(id));
    setSelected(new Set());
  };

  const allTags = [...new Set(subscriptions.flatMap((s) => s.tags || []))];

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  );

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    // DnD reorder is visual only in localStorage mode
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    // For now, visual feedback only — order persists within session
  }, []);

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

    if (maxPrice !== null) {
      result = result.filter((s) => s.price <= maxPrice);
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
      case 'manual':
        // Keep current order
        break;
    }

    return result;
  }, [subscriptions, sortBy, filterCategory, filterStatus, filterTag, maxPrice, searchQuery]);

  const priceMax = useMemo(() => Math.max(...subscriptions.map((s) => s.price), 0), [subscriptions]);

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
            <option value="manual">Вручную</option>
          </select>
          <div className="flex rounded-lg border border-gray-300 dark:border-gray-700 overflow-hidden">
            <button
              onClick={() => setViewMode('grid')}
              className={cn(
                'p-2 transition-colors',
                viewMode === 'grid'
                  ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
                  : 'text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
              )}
              aria-label="Сетка"
            >
              <LayoutGrid size={16} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={cn(
                'p-2 transition-colors',
                viewMode === 'list'
                  ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
                  : 'text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
              )}
              aria-label="Список"
            >
              <List size={16} />
            </button>
          </div>
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

      {priceMax > 0 && (
        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-500 dark:text-gray-400 shrink-0">Макс. цена:</span>
          <input
            type="range"
            min={0}
            max={priceMax}
            value={maxPrice ?? priceMax}
            onChange={(e) => {
              const val = parseInt(e.target.value);
              setMaxPrice(val >= priceMax ? null : val);
            }}
            className="flex-1 h-1.5 accent-blue-600"
          />
          <span className="text-xs font-medium text-gray-700 dark:text-gray-300 w-20 text-right">
            {maxPrice !== null ? `≤ ${maxPrice}` : 'Все'}
          </span>
        </div>
      )}

      {/* Bulk actions bar */}
      <div className="flex items-center gap-2">
        <button
          onClick={selectAll}
          className={cn(
            'flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors',
            selectMode
              ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
              : 'bg-gray-100 text-gray-500 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400'
          )}
        >
          <CheckSquare size={14} />
          {selectMode ? `${selected.size} выбрано` : 'Выбрать'}
        </button>
        {selectMode && (
          <>
            <Button size="sm" variant="outline" onPress={bulkTogglePause}>
              <Pause size={14} />
              Пауза/Старт
            </Button>
            <Button size="sm" variant="outline" onPress={bulkArchive}>
              <Archive size={14} />
              В архив
            </Button>
            <button
              onClick={() => setSelected(new Set())}
              className="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400"
            >
              Отменить
            </button>
          </>
        )}
      </div>

      {viewMode === 'list' ? (
        <div className="space-y-2">
          {filtered.map((sub) => (
            <div key={sub.id} className="flex items-center gap-2">
              {selectMode && (
                <input
                  type="checkbox"
                  checked={selected.has(sub.id)}
                  onChange={() => toggleSelect(sub.id)}
                  className="h-4 w-4 rounded border-gray-300 shrink-0"
                />
              )}
              <div className="flex-1" onClick={selectMode ? () => toggleSelect(sub.id) : undefined}>
                <SubscriptionRow subscription={sub} />
              </div>
            </div>
          ))}
        </div>
      ) : sortBy === 'manual' ? (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={filtered.map((s) => s.id)} strategy={rectSortingStrategy}>
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {filtered.map((sub) => (
                <SortableSubscriptionCard key={sub.id} subscription={sub} />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      ) : (
        <AnimatedList className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((sub) => (
            <AnimatedItem key={sub.id}>
              <div className="relative">
                {selectMode && (
                  <input
                    type="checkbox"
                    checked={selected.has(sub.id)}
                    onChange={() => toggleSelect(sub.id)}
                    className="absolute top-2 left-2 z-10 h-4 w-4 rounded border-gray-300"
                  />
                )}
                <div onClick={selectMode ? () => toggleSelect(sub.id) : undefined}>
                  <SubscriptionCard subscription={sub} />
                </div>
              </div>
            </AnimatedItem>
          ))}
        </AnimatedList>
      )}

      {filtered.length === 0 && subscriptions.length > 0 && (
        <p className="text-center text-sm text-gray-500 dark:text-gray-400 py-8">
          Ничего не найдено
        </p>
      )}
    </div>
  );
}
