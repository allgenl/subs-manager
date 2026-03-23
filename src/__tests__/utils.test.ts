import { describe, it, expect } from 'vitest';
import { cn, formatCurrency, daysUntil } from '@/lib/utils';

describe('cn', () => {
  it('joins class names', () => {
    expect(cn('a', 'b', 'c')).toBe('a b c');
  });

  it('filters falsy values', () => {
    expect(cn('a', false, null, undefined, 'b')).toBe('a b');
  });

  it('returns empty string for no classes', () => {
    expect(cn()).toBe('');
  });
});

describe('formatCurrency', () => {
  it('formats RUB with symbol after', () => {
    const result = formatCurrency(1000, 'RUB');
    expect(result).toContain('₽');
    expect(result).toMatch(/1[\s\u00A0]?000\s*₽/);
  });

  it('formats USD with symbol before', () => {
    const result = formatCurrency(99.99, 'USD');
    expect(result).toMatch(/^\$/);
  });

  it('formats EUR with symbol before', () => {
    const result = formatCurrency(50, 'EUR');
    expect(result).toMatch(/^€/);
  });
});

function toLocalDateString(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

describe('daysUntil', () => {
  it('returns 0 for today', () => {
    expect(daysUntil(toLocalDateString(new Date()))).toBe(0);
  });

  it('returns positive for future date', () => {
    const future = new Date();
    future.setDate(future.getDate() + 5);
    expect(daysUntil(toLocalDateString(future))).toBe(5);
  });

  it('returns negative for past date', () => {
    const past = new Date();
    past.setDate(past.getDate() - 3);
    expect(daysUntil(toLocalDateString(past))).toBe(-3);
  });
});
