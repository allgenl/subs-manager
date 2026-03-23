'use client';

import { createContext, useContext, ReactNode, useCallback, useMemo } from 'react';
import { Subscription, AppSettings, Category } from '@/types/subscription';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { DEFAULT_SETTINGS } from '@/lib/constants';
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
}

const SubscriptionContext = createContext<SubscriptionContextType | null>(null);

export function SubscriptionProvider({ children }: { children: ReactNode }) {
  const [subscriptions, setSubscriptions] = useLocalStorage<Subscription[]>('subs-manager-data', []);
  const [settings, setSettings] = useLocalStorage<AppSettings>('subs-manager-settings', DEFAULT_SETTINGS);

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

  const totalMonthly = useMemo(() => totalMonthlySpending(processedSubs), [processedSubs]);
  const savings = useMemo(() => savingsBreakdown(totalMonthly), [totalMonthly]);
  const byCategory = useMemo(() => spendingByCategory(processedSubs), [processedSubs]);
  const upcoming7 = useMemo(() => upcomingPayments(processedSubs, 7), [processedSubs]);
  const upcoming30 = useMemo(() => upcomingPayments(processedSubs, 30), [processedSubs]);
  const activeCount = useMemo(() => countActiveSubscriptions(processedSubs), [processedSubs]);
  const mostExpensive = useMemo(() => mostExpensiveSubscription(processedSubs), [processedSubs]);
  const averageCost = useMemo(() => averageMonthlyCost(processedSubs), [processedSubs]);

  const value = useMemo(
    () => ({
      subscriptions: processedSubs,
      settings,
      addSubscription,
      updateSubscription,
      deleteSubscription,
      toggleActive,
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
    }),
    [
      processedSubs, settings, addSubscription, updateSubscription,
      deleteSubscription, toggleActive, updateSettingsFn, importData,
      totalMonthly, savings, byCategory, upcoming7, upcoming30,
      activeCount, mostExpensive, averageCost,
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
