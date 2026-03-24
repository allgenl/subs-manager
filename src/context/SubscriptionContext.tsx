'use client';

import { createContext, useContext, ReactNode, useCallback, useMemo } from 'react';
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
  addSubscription: (data: Omit<Subscription, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateSubscription: (id: string, data: Partial<Subscription>) => void;
  deleteSubscription: (id: string) => void;
  toggleActive: (id: string) => void;
  archiveSubscription: (id: string) => void;
  restoreSubscription: (id: string) => void;
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

export function SubscriptionProvider({ children }: { children: ReactNode }) {
  const [subscriptions, setSubscriptions] = useLocalStorage<Subscription[]>('subs-manager-data', []);
  const [settings, setSettings] = useLocalStorage<AppSettings>('subs-manager-settings', DEFAULT_SETTINGS);
  const { convert: convertCurrency } = useExchangeRates();

  const addSubscription = useCallback(
    (data: Omit<Subscription, 'id' | 'createdAt' | 'updatedAt'>) => {
      const now = new Date().toISOString();
      const newSub: Subscription = {
        ...data,
        id: crypto.randomUUID(),
        createdAt: now,
        updatedAt: now,
      };
      setSubscriptions((prev) => [...prev, newSub]);
    },
    [setSubscriptions]
  );

  const updateSubscription = useCallback(
    (id: string, data: Partial<Subscription>) => {
      setSubscriptions((prev) =>
        prev.map((sub) =>
          sub.id === id ? { ...sub, ...data, updatedAt: new Date().toISOString() } : sub
        )
      );
    },
    [setSubscriptions]
  );

  const deleteSubscription = useCallback(
    (id: string) => {
      setSubscriptions((prev) => prev.filter((sub) => sub.id !== id));
    },
    [setSubscriptions]
  );

  const toggleActive = useCallback(
    (id: string) => {
      setSubscriptions((prev) =>
        prev.map((sub) =>
          sub.id === id
            ? { ...sub, isActive: !sub.isActive, updatedAt: new Date().toISOString() }
            : sub
        )
      );
    },
    [setSubscriptions]
  );

  const archiveSubscription = useCallback(
    (id: string) => {
      setSubscriptions((prev) =>
        prev.map((sub) =>
          sub.id === id
            ? { ...sub, isArchived: true, isActive: false, updatedAt: new Date().toISOString() }
            : sub
        )
      );
    },
    [setSubscriptions]
  );

  const restoreSubscription = useCallback(
    (id: string) => {
      setSubscriptions((prev) =>
        prev.map((sub) =>
          sub.id === id
            ? { ...sub, isArchived: false, isActive: true, updatedAt: new Date().toISOString() }
            : sub
        )
      );
    },
    [setSubscriptions]
  );

  const updateSettingsFn = useCallback(
    (partial: Partial<AppSettings>) => {
      setSettings((prev) => ({ ...prev, ...partial }));
    },
    [setSettings]
  );

  const importData = useCallback(
    (subs: Subscription[], newSettings: AppSettings) => {
      setSubscriptions(subs);
      setSettings(newSettings);
    },
    [setSubscriptions, setSettings]
  );

  // Auto-advance past payment dates
  const processedSubs = useMemo(() => {
    let changed = false;
    const updated = subscriptions.map((sub) => {
      if (!sub.isActive) return sub;
      const advanced = advancePaymentDate(sub);
      if (advanced !== sub.nextPaymentDate) {
        changed = true;
        return { ...sub, nextPaymentDate: advanced };
      }
      return sub;
    });
    if (changed) {
      setSubscriptions(updated);
    }
    return updated;
  }, [subscriptions, setSubscriptions]);

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
      activeSubs, archivedSubs, settings, addSubscription, updateSubscription,
      deleteSubscription, toggleActive, archiveSubscription, restoreSubscription,
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
