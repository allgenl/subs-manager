import { describe, it, expect } from 'vitest';
import {
  SubscriptionSchema,
  SubscriptionFormSchema,
  AppSettingsSchema,
  ImportDataSchema,
} from '@/lib/schemas';

describe('SubscriptionSchema', () => {
  const validSub = {
    id: '550e8400-e29b-41d4-a716-446655440000',
    name: 'Netflix',
    price: 999,
    currency: 'RUB',
    frequency: 'monthly',
    category: 'streaming',
    nextPaymentDate: '2026-04-01',
    startDate: '2026-01-01',
    isActive: true,
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
  };

  it('validates correct subscription', () => {
    expect(SubscriptionSchema.safeParse(validSub).success).toBe(true);
  });

  it('rejects empty name', () => {
    const result = SubscriptionSchema.safeParse({ ...validSub, name: '' });
    expect(result.success).toBe(false);
  });

  it('rejects negative price', () => {
    const result = SubscriptionSchema.safeParse({ ...validSub, price: -10 });
    expect(result.success).toBe(false);
  });

  it('rejects invalid currency', () => {
    const result = SubscriptionSchema.safeParse({ ...validSub, currency: 'GBP' });
    expect(result.success).toBe(false);
  });

  it('rejects invalid category', () => {
    const result = SubscriptionSchema.safeParse({ ...validSub, category: 'unknown' });
    expect(result.success).toBe(false);
  });
});

describe('SubscriptionFormSchema', () => {
  const validForm = {
    name: 'Spotify',
    price: 199,
    currency: 'RUB',
    frequency: 'monthly',
    category: 'music',
    nextPaymentDate: '2026-04-01',
    startDate: '2026-01-01',
    isActive: true,
  };

  it('validates correct form data', () => {
    expect(SubscriptionFormSchema.safeParse(validForm).success).toBe(true);
  });

  it('requires customFrequencyDays when frequency is custom', () => {
    const result = SubscriptionFormSchema.safeParse({
      ...validForm,
      frequency: 'custom',
    });
    expect(result.success).toBe(false);
  });

  it('accepts custom frequency with days', () => {
    const result = SubscriptionFormSchema.safeParse({
      ...validForm,
      frequency: 'custom',
      customFrequencyDays: 14,
    });
    expect(result.success).toBe(true);
  });
});

describe('AppSettingsSchema', () => {
  it('validates correct settings', () => {
    const result = AppSettingsSchema.safeParse({
      defaultCurrency: 'RUB',
      theme: 'dark',
    });
    expect(result.success).toBe(true);
  });

  it('rejects invalid theme', () => {
    const result = AppSettingsSchema.safeParse({
      defaultCurrency: 'RUB',
      theme: 'neon',
    });
    expect(result.success).toBe(false);
  });
});

describe('ImportDataSchema', () => {
  it('validates import data with subscriptions and settings', () => {
    const result = ImportDataSchema.safeParse({
      subscriptions: [
        {
          id: '550e8400-e29b-41d4-a716-446655440000',
          name: 'Test',
          price: 100,
          currency: 'RUB',
          frequency: 'monthly',
          category: 'other',
          nextPaymentDate: '2026-04-01',
          startDate: '2026-01-01',
          isActive: true,
          createdAt: '2026-01-01T00:00:00Z',
          updatedAt: '2026-01-01T00:00:00Z',
        },
      ],
      settings: {
        defaultCurrency: 'RUB',
        theme: 'system',
      },
    });
    expect(result.success).toBe(true);
  });

  it('rejects missing settings', () => {
    const result = ImportDataSchema.safeParse({
      subscriptions: [],
    });
    expect(result.success).toBe(false);
  });
});
