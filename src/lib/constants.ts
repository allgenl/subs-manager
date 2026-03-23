import { Category, Currency, PaymentFrequency } from '@/types/subscription';

export const CATEGORY_CONFIG: Record<Category, { label: string; color: string; icon: string }> = {
  streaming: { label: 'Стриминг', color: '#E50914', icon: 'Tv' },
  music: { label: 'Музыка', color: '#1DB954', icon: 'Music' },
  gaming: { label: 'Игры', color: '#9146FF', icon: 'Gamepad2' },
  cloud: { label: 'Облако', color: '#4285F4', icon: 'Cloud' },
  productivity: { label: 'Продуктивность', color: '#FF9500', icon: 'Briefcase' },
  news: { label: 'Новости', color: '#1DA1F2', icon: 'Newspaper' },
  fitness: { label: 'Фитнес', color: '#34C759', icon: 'Dumbbell' },
  education: { label: 'Образование', color: '#AF52DE', icon: 'GraduationCap' },
  finance: { label: 'Финансы', color: '#30D158', icon: 'Wallet' },
  other: { label: 'Другое', color: '#8E8E93', icon: 'MoreHorizontal' },
};

export const FREQUENCY_LABELS: Record<PaymentFrequency, string> = {
  monthly: 'Ежемесячно',
  yearly: 'Ежегодно',
  weekly: 'Еженедельно',
  custom: 'Другое',
};

export const CURRENCY_SYMBOLS: Record<Currency, string> = {
  RUB: '₽',
  USD: '$',
  EUR: '€',
};

export const CATEGORIES: Category[] = [
  'streaming', 'music', 'gaming', 'cloud', 'productivity',
  'news', 'fitness', 'education', 'finance', 'other',
];

export const CURRENCIES: Currency[] = ['RUB', 'USD', 'EUR'];

export const FREQUENCIES: PaymentFrequency[] = ['monthly', 'yearly', 'weekly', 'custom'];

export const DEFAULT_SETTINGS = {
  defaultCurrency: 'RUB' as Currency,
  theme: 'system' as const,
};
