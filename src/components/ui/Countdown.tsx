'use client';

import { useState, useEffect } from 'react';

export default function Countdown({ targetDate }: { targetDate: string }) {
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    const calc = () => {
      const now = new Date();
      const target = new Date(targetDate + 'T00:00:00');
      const diff = target.getTime() - now.getTime();

      if (diff <= 0) {
        setTimeLeft('Сегодня');
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

      if (days > 0) {
        setTimeLeft(`${days}д ${hours}ч`);
      } else {
        const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        setTimeLeft(`${hours}ч ${mins}м`);
      }
    };

    calc();
    const interval = setInterval(calc, 60000);
    return () => clearInterval(interval);
  }, [targetDate]);

  return (
    <span className="tabular-nums text-xs font-medium text-gray-500 dark:text-gray-400">
      {timeLeft}
    </span>
  );
}
