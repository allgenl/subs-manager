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
  isArchived?: boolean;
  folderId?: string;
  reminderDaysBefore?: number;
  tags?: string[];
  trialEndsAt?: string;
  isShared?: boolean;
  totalMembers?: number;
  myShare?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CustomCategory {
  id: string;
  label: string;
  color: string;
}

export interface Folder {
  id: string;
  name: string;
  color: string;
}

export interface AppSettings {
  defaultCurrency: Currency;
  monthlyBudget?: number;
  theme: 'light' | 'dark' | 'system';
  customCategories?: CustomCategory[];
  folders?: Folder[];
}

export interface AppState {
  subscriptions: Subscription[];
  settings: AppSettings;
}
