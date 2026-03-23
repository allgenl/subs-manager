import { z } from 'zod/v4';

export const PaymentFrequencySchema = z.enum(['monthly', 'yearly', 'weekly', 'custom']);

export const CurrencySchema = z.enum(['RUB', 'USD', 'EUR']);

export const CategorySchema = z.enum([
  'streaming',
  'music',
  'gaming',
  'cloud',
  'productivity',
  'news',
  'fitness',
  'education',
  'finance',
  'other',
]);

export const SubscriptionSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1, 'Введите название'),
  price: z.number().positive('Введите корректную сумму'),
  currency: CurrencySchema,
  frequency: PaymentFrequencySchema,
  customFrequencyDays: z.number().int().positive('Введите количество дней').optional(),
  category: CategorySchema,
  nextPaymentDate: z.string().min(1, 'Укажите дату следующего платежа'),
  startDate: z.string(),
  notes: z.string().optional(),
  color: z.string().optional(),
  isActive: z.boolean(),
  reminderDaysBefore: z.number().int().nonnegative().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

/** Schema for form submission (without auto-generated fields) */
export const SubscriptionFormSchema = z
  .object({
    name: z.string().min(1, 'Введите название'),
    price: z.number().positive('Введите корректную сумму'),
    currency: CurrencySchema,
    frequency: PaymentFrequencySchema,
    customFrequencyDays: z.number().int().positive('Введите количество дней').optional(),
    category: CategorySchema,
    nextPaymentDate: z.string().min(1, 'Укажите дату следующего платежа'),
    startDate: z.string(),
    notes: z.string().optional(),
    isActive: z.boolean(),
  })
  .refine(
    (data) => data.frequency !== 'custom' || (data.customFrequencyDays && data.customFrequencyDays > 0),
    {
      message: 'Введите количество дней',
      path: ['customFrequencyDays'],
    }
  );

export const AppSettingsSchema = z.object({
  defaultCurrency: CurrencySchema,
  monthlyBudget: z.number().nonnegative().optional(),
  theme: z.enum(['light', 'dark', 'system']),
});

export const AppStateSchema = z.object({
  subscriptions: z.array(SubscriptionSchema),
  settings: AppSettingsSchema,
});

/** Schema for validating imported JSON files */
export const ImportDataSchema = z.object({
  subscriptions: z.array(SubscriptionSchema),
  settings: AppSettingsSchema,
  exportedAt: z.string().optional(),
  version: z.number().optional(),
});

export type SubscriptionFormData = z.infer<typeof SubscriptionFormSchema>;
