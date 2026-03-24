import { CATEGORY_CONFIG } from './constants';
import { Category } from '@/types/subscription';

export function getCategoryGradient(category: Category | string): string {
  const config = CATEGORY_CONFIG[category as Category];
  if (!config) return 'from-gray-500 to-gray-600';

  const gradients: Record<string, string> = {
    streaming: 'from-red-500 to-rose-600',
    music: 'from-green-500 to-emerald-600',
    gaming: 'from-purple-500 to-violet-600',
    cloud: 'from-blue-500 to-sky-600',
    productivity: 'from-orange-500 to-amber-600',
    news: 'from-cyan-500 to-teal-600',
    fitness: 'from-lime-500 to-green-600',
    education: 'from-fuchsia-500 to-purple-600',
    finance: 'from-emerald-500 to-teal-600',
    other: 'from-gray-500 to-slate-600',
  };

  return gradients[category] || 'from-gray-500 to-gray-600';
}
