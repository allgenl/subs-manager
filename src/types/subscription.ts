export type PaymentFrequency = 'monthly' | 'yearly' | 'weekly' | 'custom';

export type Currency = 'RUB' | 'USD' | 'EUR';

export type Category =
  | 'streaming'
  | 'music'
  | 'gaming'
  | 'cloud'
  | 'productivity'
  | 'news'
  | 'fitness'
  | 'education'
  | 'finance'
  | 'other';

export interface Subscription {
  id: string;
  name: string;
  price: number;
  currency: Currency;
  frequency: PaymentFrequency;
  customFrequencyDays?: number;
  category: Category;
  nextPaymentDate: string;
  startDate: string;
  notes?: string;
  color?: string;
  isActive: boolean;
  reminderDaysBefore?: number;
  isShared?: boolean;
  totalMembers?: number;
  myShare?: number;
  createdAt: string;
  updatedAt: string;
}

export interface AppSettings {
  defaultCurrency: Currency;
  monthlyBudget?: number;
  theme: 'light' | 'dark' | 'system';
}

export interface AppState {
  subscriptions: Subscription[];
  settings: AppSettings;
}
