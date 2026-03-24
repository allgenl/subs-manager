'use client';

import { useState, useEffect, useCallback } from 'react';

export type WidgetKey = 'totalSpending' | 'quickStats' | 'upcoming' | 'budget' | 'alerts';

interface DashboardConfig {
  visibleWidgets: WidgetKey[];
}

const DEFAULT_CONFIG: DashboardConfig = {
  visibleWidgets: ['totalSpending', 'quickStats', 'upcoming', 'budget', 'alerts'],
};

const STORAGE_KEY = 'subs-dashboard-config';

export const WIDGET_LABELS: Record<WidgetKey, string> = {
  alerts: 'Уведомления о платежах',
  totalSpending: 'Общие расходы',
  quickStats: 'Быстрая статистика',
  upcoming: 'Ближайшие платежи',
  budget: 'Бюджет',
};

export function useDashboardConfig() {
  const [config, setConfig] = useState<DashboardConfig>(DEFAULT_CONFIG);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setConfig(JSON.parse(raw));
    } catch { /* use default */ }
  }, []);

  const save = useCallback((newConfig: DashboardConfig) => {
    setConfig(newConfig);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newConfig));
  }, []);

  const toggleWidget = useCallback((key: WidgetKey) => {
    save({
      ...config,
      visibleWidgets: config.visibleWidgets.includes(key)
        ? config.visibleWidgets.filter((k) => k !== key)
        : [...config.visibleWidgets, key],
    });
  }, [config, save]);

  const isVisible = useCallback((key: WidgetKey) => {
    return config.visibleWidgets.includes(key);
  }, [config]);

  return { config, toggleWidget, isVisible };
}
