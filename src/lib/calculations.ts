import { Subscription, Category, Currency } from '@/types/subscription';

export type ConvertFn = (amount: number, from: Currency, to: Currency) => number;

export function toMonthlyCost(sub: Subscription, targetCurrency?: Currency, convert?: ConvertFn): number {
  if (!sub.isActive) return 0;

  const price = sub.isShared && sub.myShare ? sub.myShare : sub.price;

  let raw: number;
  switch (sub.frequency) {
    case 'monthly':
      raw = price; break;
    case 'yearly':
      raw = price / 12; break;
    case 'weekly':
      raw = price * (365.25 / 12 / 7); break;
    case 'custom':
      if (!sub.customFrequencyDays || sub.customFrequencyDays <= 0) return 0;
      raw = price * (30 / sub.customFrequencyDays); break;
    default:
      return 0;
  }

  if (targetCurrency && convert && sub.currency !== targetCurrency) {
    return convert(raw, sub.currency, targetCurrency);
  }
  return raw;
}

export function totalMonthlySpending(subs: Subscription[], targetCurrency?: Currency, convert?: ConvertFn): number {
  return subs.reduce((sum, sub) => sum + toMonthlyCost(sub, targetCurrency, convert), 0);
}

export function savingsBreakdown(totalMonthly: number) {
  return {
    perDay: totalMonthly / 30,
    perWeek: totalMonthly / (365.25 / 12 / 7),
    perMonth: totalMonthly,
    perYear: totalMonthly * 12,
  };
}

export function spendingByCategory(subs: Subscription[], targetCurrency?: Currency, convert?: ConvertFn): Partial<Record<Category, number>> {
  const result: Partial<Record<Category, number>> = {};
  for (const sub of subs) {
    if (!sub.isActive) continue;
    const monthly = toMonthlyCost(sub, targetCurrency, convert);
    result[sub.category] = (result[sub.category] || 0) + monthly;
  }
  return result;
}

export function upcomingPayments(subs: Subscription[], days: number): Subscription[] {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const cutoff = new Date(now);
  cutoff.setDate(cutoff.getDate() + days);

  return subs
    .filter((sub) => {
      if (!sub.isActive) return false;
      const payDate = new Date(sub.nextPaymentDate);
      payDate.setHours(0, 0, 0, 0);
      return payDate >= now && payDate <= cutoff;
    })
    .sort((a, b) => new Date(a.nextPaymentDate).getTime() - new Date(b.nextPaymentDate).getTime());
}

export function advancePaymentDate(sub: Subscription): string {
  const payDate = new Date(sub.nextPaymentDate);
  const now = new Date();
  now.setHours(0, 0, 0, 0);

  while (payDate < now) {
    switch (sub.frequency) {
      case 'monthly':
        payDate.setMonth(payDate.getMonth() + 1);
        break;
      case 'yearly':
        payDate.setFullYear(payDate.getFullYear() + 1);
        break;
      case 'weekly':
        payDate.setDate(payDate.getDate() + 7);
        break;
      case 'custom':
        payDate.setDate(payDate.getDate() + (sub.customFrequencyDays || 30));
        break;
    }
  }

  return payDate.toISOString().split('T')[0];
}

export function countActiveSubscriptions(subs: Subscription[]): number {
  return subs.filter((s) => s.isActive).length;
}

export function mostExpensiveSubscription(subs: Subscription[], targetCurrency?: Currency, convert?: ConvertFn): Subscription | null {
  const active = subs.filter((s) => s.isActive);
  if (active.length === 0) return null;
  return active.reduce((max, sub) =>
    toMonthlyCost(sub, targetCurrency, convert) > toMonthlyCost(max, targetCurrency, convert) ? sub : max
  );
}

export function averageMonthlyCost(subs: Subscription[], targetCurrency?: Currency, convert?: ConvertFn): number {
  const active = subs.filter((s) => s.isActive);
  if (active.length === 0) return 0;
  return totalMonthlySpending(subs, targetCurrency, convert) / active.length;
}
