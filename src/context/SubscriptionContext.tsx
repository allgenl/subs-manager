'use client';

import { createContext, useContext, ReactNode, useCallback, useMemo, useState, useEffect } from 'react';
import { Subscription, AppSettings, Category, Currency } from '@/types/subscription';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { DEFAULT_SETTINGS } from '@/lib/constants';
import { useExchangeRates } from '@/hooks/useExchangeRates';
import {
  totalMonthlySpending,
  savingsBreakdown,
  spendingByCategory,
  upcomingPayments,
  countActiveSubscriptions,
  mostExpensiveSubscription,
  averageMonthlyCost,
  advancePaymentDate,
} from '@/lib/calculations';

interface SubscriptionContextType {
  subscriptions: Subscription[];
  settings: AppSettings;
  loading: boolean;
  addSubscription: (data: Omit<Subscription, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateSubscription: (id: string, data: Partial<Subscription>) => Promise<void>;
  deleteSubscription: (id: string) => Promise<void>;
  toggleActive: (id: string) => Promise<void>;
  archiveSubscription: (id: string) => Promise<void>;
  restoreSubscription: (id: string) => Promise<void>;
  archivedSubscriptions: Subscription[];
  updateSettings: (settings: Partial<AppSettings>) => void;
  importData: (subs: Subscription[], settings: AppSettings) => void;
  // Derived
  totalMonthly: number;
  savings: ReturnType<typeof savingsBreakdown>;
  byCategory: Partial<Record<Category, number>>;
  upcoming7: Subscription[];
  upcoming30: Subscription[];
  activeCount: number;
  mostExpensive: Subscription | null;
  averageCost: number;
  convertCurrency: (amount: number, from: Currency, to: Currency) => number;
}

const SubscriptionContext = createContext<SubscriptionContextType | null>(null);

async function apiFetch(url: string, options?: RequestInit) {
  const res = await fetch(url, { credentials: 'include', ...options });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export function SubscriptionProvider({ children }: { children: ReactNode }) {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useLocalStorage<AppSettings>('subs-manager-settings', DEFAULT_SETTINGS);
  const { convert: convertCurrency } = useExchangeRates();

  // Load from API on mount
  useEffect(() => {
    apiFetch('/api/subscriptions')
      .then(({ data }) => setSubscriptions(data ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const addSubscription = useCallback(async (data: Omit<Subscription, 'id' | 'createdAt' | 'updatedAt'>) => {
    const { data: newSub } = await apiFetch('/api/subscriptions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    setSubscriptions((prev) => [...prev, newSub]);
  }, []);

  const updateSubscription = useCallback(async (id: string, data: Partial<Subscription>) => {
    await apiFetch(`/api/subscriptions/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    setSubscriptions((prev) =>
      prev.map((s) => s.id === id ? { ...s, ...data, updatedAt: new Date().toISOString() } : s)
    );
  }, []);

  const deleteSubscription = useCallback(async (id: string) => {
    await apiFetch(`/api/subscriptions/${id}`, { method: 'DELETE' });
    setSubscriptions((prev) => prev.filter((s) => s.id !== id));
  }, []);

  const toggleActive = useCallback(async (id: string) => {
    const sub = subscriptions.find((s) => s.id === id);
    if (!sub) return;
    await updateSubscription(id, { isActive: !sub.isActive });
  }, [subscriptions, updateSubscription]);

  const archiveSubscription = useCallback(async (id: string) => {
    await updateSubscription(id, { isArchived: true, isActive: false });
  }, [updateSubscription]);

  const restoreSubscription = useCallback(async (id: string) => {
    await updateSubscription(id, { isArchived: false, isActive: true });
  }, [updateSubscription]);

  const updateSettingsFn = useCallback((partial: Partial<AppSettings>) => {
    setSettings((prev) => ({ ...prev, ...partial }));
  }, [setSettings]);

  const importData = useCallback((subs: Subscription[], newSettings: AppSettings) => {
    setSubscriptions(subs);
    setSettings(newSettings);
  }, [setSettings]);

  // Auto-advance past payment dates (in-memory only)
  const processedSubs = useMemo(() => {
    return subscriptions.map((sub) => {
      if (!sub.isActive) return sub;
      const advanced = advancePaymentDate(sub);
      return advanced !== sub.nextPaymentDate ? { ...sub, nextPaymentDate: advanced } : sub;
    });
  }, [subscriptions]);

  const activeSubs = useMemo(() => processedSubs.filter((s) => !s.isArchived), [processedSubs]);
  const archivedSubs = useMemo(() => processedSubs.filter((s) => s.isArchived), [processedSubs]);

  const cur = settings.defaultCurrency;
  const totalMonthly = useMemo(() => totalMonthlySpending(activeSubs, cur, convertCurrency), [activeSubs, cur, convertCurrency]);
  const savings = useMemo(() => savingsBreakdown(totalMonthly), [totalMonthly]);
  const byCategory = useMemo(() => spendingByCategory(activeSubs, cur, convertCurrency), [activeSubs, cur, convertCurrency]);
  const upcoming7 = useMemo(() => upcomingPayments(activeSubs, 7), [activeSubs]);
  const upcoming30 = useMemo(() => upcomingPayments(activeSubs, 30), [activeSubs]);
  const activeCount = useMemo(() => countActiveSubscriptions(activeSubs), [activeSubs]);
  const mostExpensive = useMemo(() => mostExpensiveSubscription(activeSubs, cur, convertCurrency), [activeSubs, cur, convertCurrency]);
  const averageCost = useMemo(() => averageMonthlyCost(activeSubs, cur, convertCurrency), [activeSubs, cur, convertCurrency]);

  const value = useMemo(
    () => ({
      subscriptions: activeSubs,
      settings,
      loading,
      addSubscription,
      updateSubscription,
      deleteSubscription,
      toggleActive,
      archiveSubscription,
      restoreSubscription,
      archivedSubscriptions: archivedSubs,
      updateSettings: updateSettingsFn,
      importData,
      totalMonthly,
      savings,
      byCategory,
      upcoming7,
      upcoming30,
      activeCount,
      mostExpensive,
      averageCost,
      convertCurrency,
    }),
    [
      activeSubs, archivedSubs, settings, loading,
      addSubscription, updateSubscription, deleteSubscription,
      toggleActive, archiveSubscription, restoreSubscription,
      updateSettingsFn, importData,
      totalMonthly, savings, byCategory, upcoming7, upcoming30,
      activeCount, mostExpensive, averageCost, convertCurrency,
    ]
  );

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  );
}

export function useSubscriptions() {
  const context = useContext(SubscriptionContext);
  if (!context) {
    throw new Error('useSubscriptions must be used within a SubscriptionProvider');
  }
  return context;
}
