import { Category } from '@/types/subscription';
import { CATEGORY_CONFIG } from '@/lib/constants';

interface CategoryBadgeProps {
  category: Category;
  size?: 'sm' | 'md';
}

export default function CategoryBadge({ category, size = 'sm' }: CategoryBadgeProps) {
  const config = CATEGORY_CONFIG[category];

  return (
    <span
      className={`inline-flex items-center rounded-full font-medium ${
        size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm'
      }`}
      style={{
        backgroundColor: `${config.color}15`,
        color: config.color,
      }}
    >
      {config.label}
    </span>
  );
}
