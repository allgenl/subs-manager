import { Subscription } from '@/types/subscription';

export const PLACEHOLDER_SUBSCRIPTIONS: Omit<Subscription, 'id' | 'createdAt' | 'updatedAt'>[] = [
  {
    name: 'Netflix',
    price: 999,
    currency: 'RUB',
    frequency: 'monthly',
    category: 'streaming',
    nextPaymentDate: getDateInDays(5),
    startDate: getDateInDays(-60),
    isActive: true,
    notes: 'Семейный план',
  },
  {
    name: 'Spotify',
    price: 199,
    currency: 'RUB',
    frequency: 'monthly',
    category: 'music',
    nextPaymentDate: getDateInDays(12),
    startDate: getDateInDays(-90),
    isActive: true,
  },
  {
    name: 'iCloud+ 200GB',
    price: 299,
    currency: 'RUB',
    frequency: 'monthly',
    category: 'cloud',
    nextPaymentDate: getDateInDays(20),
    startDate: getDateInDays(-180),
    isActive: true,
  },
];

function getDateInDays(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().split('T')[0];
}
