import { Category, Currency, PaymentFrequency } from '@/types/subscription';

export interface PopularSubscription {
  name: string;
  price: number;
  currency: Currency;
  frequency: PaymentFrequency;
  category: Category;
}

export const POPULAR_SUBSCRIPTIONS: PopularSubscription[] = [
  { name: 'Netflix', price: 999, currency: 'RUB', frequency: 'monthly', category: 'streaming' },
  { name: 'YouTube Premium', price: 299, currency: 'RUB', frequency: 'monthly', category: 'streaming' },
  { name: 'Spotify', price: 199, currency: 'RUB', frequency: 'monthly', category: 'music' },
  { name: 'Яндекс Плюс', price: 299, currency: 'RUB', frequency: 'monthly', category: 'streaming' },
  { name: 'Apple Music', price: 199, currency: 'RUB', frequency: 'monthly', category: 'music' },
  { name: 'iCloud+ 50GB', price: 99, currency: 'RUB', frequency: 'monthly', category: 'cloud' },
  { name: 'iCloud+ 200GB', price: 299, currency: 'RUB', frequency: 'monthly', category: 'cloud' },
  { name: 'Xbox Game Pass', price: 699, currency: 'RUB', frequency: 'monthly', category: 'gaming' },
  { name: 'PlayStation Plus', price: 3999, currency: 'RUB', frequency: 'yearly', category: 'gaming' },
  { name: 'ChatGPT Plus', price: 20, currency: 'USD', frequency: 'monthly', category: 'productivity' },
  { name: 'Notion', price: 10, currency: 'USD', frequency: 'monthly', category: 'productivity' },
  { name: 'Figma', price: 15, currency: 'USD', frequency: 'monthly', category: 'productivity' },
  { name: 'Google One 100GB', price: 139, currency: 'RUB', frequency: 'monthly', category: 'cloud' },
  { name: 'VK Музыка', price: 149, currency: 'RUB', frequency: 'monthly', category: 'music' },
  { name: 'Кинопоиск', price: 299, currency: 'RUB', frequency: 'monthly', category: 'streaming' },
];
