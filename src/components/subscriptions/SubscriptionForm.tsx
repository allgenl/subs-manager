'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Subscription, PaymentFrequency, Currency, Category } from '@/types/subscription';
import { useSubscriptions } from '@/context/SubscriptionContext';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import { Button } from '@heroui/react';
import {
  CATEGORIES,
  CATEGORY_CONFIG,
  CURRENCIES,
  CURRENCY_SYMBOLS,
  FREQUENCIES,
  FREQUENCY_LABELS,
} from '@/lib/constants';
import TagInput from '@/components/ui/TagInput';
import { SubscriptionFormSchema } from '@/lib/schemas';
import { toast } from 'sonner';

interface SubscriptionFormProps {
  initialData?: Subscription;
  mode: 'create' | 'edit';
}

export default function SubscriptionForm({ initialData, mode }: SubscriptionFormProps) {
  const router = useRouter();
  const { addSubscription, updateSubscription, settings, subscriptions } = useSubscriptions();

  const allTags = [...new Set(subscriptions.flatMap((s) => s.tags || []))];

  const [name, setName] = useState(initialData?.name || '');
  const [price, setPrice] = useState(initialData?.price?.toString() || '');
  const [currency, setCurrency] = useState<Currency>(initialData?.currency || settings.defaultCurrency);
  const [frequency, setFrequency] = useState<PaymentFrequency>(initialData?.frequency || 'monthly');
  const [customDays, setCustomDays] = useState(initialData?.customFrequencyDays?.toString() || '30');
  const [category, setCategory] = useState<Category>(initialData?.category || 'other');
  const [nextPaymentDate, setNextPaymentDate] = useState(
    initialData?.nextPaymentDate || new Date().toISOString().split('T')[0]
  );
  const [startDate, setStartDate] = useState(
    initialData?.startDate || new Date().toISOString().split('T')[0]
  );
  const [notes, setNotes] = useState(initialData?.notes || '');
  const [tags, setTags] = useState<string[]>(initialData?.tags || []);
  const [isShared, setIsShared] = useState(initialData?.isShared || false);
  const [totalMembers, setTotalMembers] = useState(initialData?.totalMembers?.toString() || '2');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const data = {
      name: name.trim(),
      price: parseFloat(price),
      currency,
      frequency,
      customFrequencyDays: frequency === 'custom' ? parseInt(customDays) : undefined,
      category,
      nextPaymentDate,
      startDate,
      notes: notes.trim() || undefined,
      isActive: initialData?.isActive ?? true,
      tags: tags.length > 0 ? tags : undefined,
      isShared,
      totalMembers: isShared ? parseInt(totalMembers) : undefined,
      myShare: isShared ? parseFloat(price) / parseInt(totalMembers || '1') : undefined,
    };

    const result = SubscriptionFormSchema.safeParse(data);
    if (!result.success) {
      const newErrors: Record<string, string> = {};
      for (const issue of result.error.issues) {
        const key = String(issue.path[0]);
        if (!newErrors[key]) newErrors[key] = issue.message;
      }
      setErrors(newErrors);
      return;
    }
    setErrors({});

    if (mode === 'create') {
      addSubscription(data);
      toast.success('Подписка добавлена');
    } else if (initialData) {
      updateSubscription(initialData.id, data);
      toast.success('Подписка обновлена');
    }

    router.push('/subscriptions');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 max-w-lg">
      <Input
        id="name"
        label="Название"
        placeholder="Netflix, Spotify, YouTube Premium..."
        value={name}
        onChange={(e) => setName(e.target.value)}
        error={errors.name}
        autoFocus
      />

      <div className="grid grid-cols-2 gap-4">
        <Input
          id="price"
          label="Сумма"
          type="number"
          step="0.01"
          min="0"
          placeholder="0.00"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          error={errors.price}
        />
        <Select
          id="currency"
          label="Валюта"
          value={currency}
          onChange={(e) => setCurrency(e.target.value as Currency)}
          options={CURRENCIES.map((c) => ({ value: c, label: `${c} (${CURRENCY_SYMBOLS[c]})` }))}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Select
          id="frequency"
          label="Частота оплаты"
          value={frequency}
          onChange={(e) => setFrequency(e.target.value as PaymentFrequency)}
          options={FREQUENCIES.map((f) => ({ value: f, label: FREQUENCY_LABELS[f] }))}
        />
        {frequency === 'custom' && (
          <Input
            id="customDays"
            label="Каждые N дней"
            type="number"
            min="1"
            value={customDays}
            onChange={(e) => setCustomDays(e.target.value)}
            error={errors.customDays}
          />
        )}
      </div>

      <Select
        id="category"
        label="Категория"
        value={category}
        onChange={(e) => setCategory(e.target.value as Category)}
        options={[
          ...CATEGORIES.map((c) => ({ value: c, label: CATEGORY_CONFIG[c].label })),
          ...(settings.customCategories || []).map((c) => ({ value: c.id, label: c.label })),
        ]}
      />

      <div className="grid grid-cols-2 gap-4">
        <Input
          id="startDate"
          label="Дата начала"
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
        <Input
          id="nextPaymentDate"
          label="Следующий платёж"
          type="date"
          value={nextPaymentDate}
          onChange={(e) => setNextPaymentDate(e.target.value)}
          error={errors.nextPaymentDate}
        />
      </div>

      <TagInput tags={tags} onChange={setTags} suggestions={allTags} />

      <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={isShared}
            onChange={(e) => setIsShared(e.target.checked)}
            className="rounded border-gray-300 dark:border-gray-600"
          />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Семейная/совместная подписка
          </span>
        </label>
        {isShared && (
          <div className="mt-3 space-y-2">
            <Input
              id="totalMembers"
              label="Количество участников"
              type="number"
              min="2"
              value={totalMembers}
              onChange={(e) => setTotalMembers(e.target.value)}
            />
            {price && parseInt(totalMembers) > 1 && (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {price} ₽ / {totalMembers} ={' '}
                <span className="font-semibold text-gray-900 dark:text-gray-100">
                  {(parseFloat(price) / parseInt(totalMembers)).toFixed(0)} ₽ с тебя
                </span>
              </p>
            )}
          </div>
        )}
      </div>

      <div className="space-y-1">
        <label htmlFor="notes" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Заметки
        </label>
        <textarea
          id="notes"
          className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-500"
          rows={3}
          placeholder="Дополнительные заметки..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </div>

      <div className="flex gap-3 pt-2">
        <Button type="submit">
          {mode === 'create' ? 'Добавить подписку' : 'Сохранить'}
        </Button>
        <Button type="button" variant="ghost" onPress={() => router.back()}>
          Отмена
        </Button>
      </div>
    </form>
  );
}
