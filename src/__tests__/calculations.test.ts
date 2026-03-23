import { describe, it, expect } from 'vitest';
import { Subscription } from '@/types/subscription';
import {
  toMonthlyCost,
  totalMonthlySpending,
  savingsBreakdown,
  spendingByCategory,
  upcomingPayments,
  advancePaymentDate,
  countActiveSubscriptions,
  mostExpensiveSubscription,
  averageMonthlyCost,
} from '@/lib/calculations';

function makeSub(overrides: Partial<Subscription> = {}): Subscription {
  return {
    id: '1',
    name: 'Test',
    price: 100,
    currency: 'RUB',
    frequency: 'monthly',
    category: 'streaming',
    nextPaymentDate: '2026-04-01',
    startDate: '2026-01-01',
    isActive: true,
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
    ...overrides,
  };
}

describe('toMonthlyCost', () => {
  it('returns price for monthly subscription', () => {
    expect(toMonthlyCost(makeSub({ price: 500 }))).toBe(500);
  });

  it('divides yearly price by 12', () => {
    expect(toMonthlyCost(makeSub({ price: 1200, frequency: 'yearly' }))).toBe(100);
  });

  it('converts weekly to monthly', () => {
    const result = toMonthlyCost(makeSub({ price: 100, frequency: 'weekly' }));
    expect(result).toBeCloseTo(100 * (365.25 / 12 / 7), 2);
  });

  it('converts custom frequency to monthly', () => {
    const result = toMonthlyCost(makeSub({ price: 300, frequency: 'custom', customFrequencyDays: 15 }));
    expect(result).toBe(600); // 300 * (30/15)
  });

  it('returns 0 for inactive subscriptions', () => {
    expect(toMonthlyCost(makeSub({ isActive: false }))).toBe(0);
  });

  it('returns 0 for custom with no days', () => {
    expect(toMonthlyCost(makeSub({ frequency: 'custom', customFrequencyDays: 0 }))).toBe(0);
  });
});

describe('totalMonthlySpending', () => {
  it('sums up monthly costs', () => {
    const subs = [makeSub({ price: 100 }), makeSub({ price: 200 })];
    expect(totalMonthlySpending(subs)).toBe(300);
  });

  it('returns 0 for empty list', () => {
    expect(totalMonthlySpending([])).toBe(0);
  });
});

describe('savingsBreakdown', () => {
  it('calculates breakdown from monthly total', () => {
    const result = savingsBreakdown(3000);
    expect(result.perMonth).toBe(3000);
    expect(result.perYear).toBe(36000);
    expect(result.perDay).toBe(100);
  });
});

describe('spendingByCategory', () => {
  it('groups spending by category', () => {
    const subs = [
      makeSub({ category: 'streaming', price: 100 }),
      makeSub({ category: 'streaming', price: 200 }),
      makeSub({ category: 'music', price: 50 }),
    ];
    const result = spendingByCategory(subs);
    expect(result.streaming).toBe(300);
    expect(result.music).toBe(50);
  });

  it('skips inactive subscriptions', () => {
    const subs = [makeSub({ category: 'streaming', isActive: false })];
    expect(spendingByCategory(subs)).toEqual({});
  });
});

function toLocal(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

describe('upcomingPayments', () => {
  it('returns payments within specified days', () => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 8);

    const subs = [
      makeSub({ id: '1', nextPaymentDate: toLocal(tomorrow) }),
      makeSub({ id: '2', nextPaymentDate: toLocal(nextWeek) }),
    ];

    const result = upcomingPayments(subs, 7);
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('1');
  });

  it('excludes inactive subscriptions', () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const subs = [makeSub({ isActive: false, nextPaymentDate: toLocal(tomorrow) })];
    expect(upcomingPayments(subs, 7)).toHaveLength(0);
  });
});

describe('advancePaymentDate', () => {
  it('advances monthly past date', () => {
    const sub = makeSub({ nextPaymentDate: '2020-01-15', frequency: 'monthly' });
    const result = advancePaymentDate(sub);
    expect(new Date(result) >= new Date()).toBe(true);
  });

  it('advances yearly past date', () => {
    const sub = makeSub({ nextPaymentDate: '2020-01-15', frequency: 'yearly' });
    const result = advancePaymentDate(sub);
    expect(new Date(result) >= new Date()).toBe(true);
  });

  it('keeps future date unchanged', () => {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 30);
    const dateStr = futureDate.toISOString().split('T')[0];
    const sub = makeSub({ nextPaymentDate: dateStr });
    expect(advancePaymentDate(sub)).toBe(dateStr);
  });
});

describe('countActiveSubscriptions', () => {
  it('counts active only', () => {
    const subs = [
      makeSub({ isActive: true }),
      makeSub({ isActive: false }),
      makeSub({ isActive: true }),
    ];
    expect(countActiveSubscriptions(subs)).toBe(2);
  });
});

describe('mostExpensiveSubscription', () => {
  it('returns most expensive active sub', () => {
    const subs = [
      makeSub({ id: '1', price: 100 }),
      makeSub({ id: '2', price: 500 }),
      makeSub({ id: '3', price: 200 }),
    ];
    expect(mostExpensiveSubscription(subs)?.id).toBe('2');
  });

  it('returns null for empty list', () => {
    expect(mostExpensiveSubscription([])).toBeNull();
  });
});

describe('averageMonthlyCost', () => {
  it('calculates average for active subs', () => {
    const subs = [
      makeSub({ price: 100 }),
      makeSub({ price: 300 }),
    ];
    expect(averageMonthlyCost(subs)).toBe(200);
  });

  it('returns 0 for no active subs', () => {
    expect(averageMonthlyCost([])).toBe(0);
  });
});
