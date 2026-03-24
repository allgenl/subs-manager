'use client';

import { useEffect, useState, useCallback } from 'react';
import { Currency } from '@/types/subscription';

interface ExchangeRates {
  RUB: number;
  USD: number;
  EUR: number;
}

const CACHE_KEY = 'subs-exchange-rates';
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

const FALLBACK_RATES: ExchangeRates = {
  USD: 1,
  EUR: 0.92,
  RUB: 92,
};

export function useExchangeRates() {
  const [rates, setRates] = useState<ExchangeRates>(FALLBACK_RATES);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      try {
        const { rates: cachedRates, timestamp } = JSON.parse(cached);
        if (Date.now() - timestamp < CACHE_DURATION) {
          setRates(cachedRates);
          setLoading(false);
          return;
        }
      } catch {
        // Invalid cache, fetch fresh
      }
    }

    fetch('https://api.exchangerate-api.com/v4/latest/USD')
      .then((r) => r.json())
      .then((data) => {
        const newRates: ExchangeRates = {
          USD: 1,
          EUR: data.rates?.EUR ?? FALLBACK_RATES.EUR,
          RUB: data.rates?.RUB ?? FALLBACK_RATES.RUB,
        };
        setRates(newRates);
        localStorage.setItem(CACHE_KEY, JSON.stringify({
          rates: newRates,
          timestamp: Date.now(),
        }));
      })
      .catch(() => {
        // Use fallback rates
      })
      .finally(() => setLoading(false));
  }, []);

  const convert = useCallback(
    (amount: number, from: Currency, to: Currency): number => {
      if (from === to) return amount;
      const inUSD = amount / rates[from];
      return inUSD * rates[to];
    },
    [rates]
  );

  return { rates, loading, convert };
}
