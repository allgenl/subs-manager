'use client';

import { Category } from '@/types/subscription';
import { CATEGORY_CONFIG } from '@/lib/constants';
import { useSubscriptions } from '@/context/SubscriptionContext';

interface CategoryBadgeProps {
  category: Category | string;
  size?: 'sm' | 'md';
}

export default function CategoryBadge({ category, size = 'sm' }: CategoryBadgeProps) {
  const { settings } = useSubscriptions();

  const builtIn = CATEGORY_CONFIG[category as Category];
  const custom = settings.customCategories?.find((c) => c.id === category);

  const label = builtIn?.label ?? custom?.label ?? category;
  const color = builtIn?.color ?? custom?.color ?? '#8E8E93';

  return (
    <span
      className={`inline-flex items-center rounded-full font-medium ${
        size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm'
      }`}
      style={{
        backgroundColor: `${color}15`,
        color: color,
      }}
    >
      {label}
    </span>
  );
}
