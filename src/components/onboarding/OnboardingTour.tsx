'use client';

import { useState, useEffect } from 'react';
import { Button } from '@heroui/react';
import { X, ArrowRight } from 'lucide-react';

const steps = [
  {
    title: 'Добро пожаловать в SubsManager!',
    description: 'Управляйте подписками, отслеживайте расходы и планируйте бюджет.',
  },
  {
    title: 'Добавляйте подписки',
    description: 'Нажмите "Добавить" в верхнем правом углу, чтобы добавить свою первую подписку.',
  },
  {
    title: 'Анализируйте расходы',
    description: 'Перейдите в раздел "Аналитика" для просмотра статистики и графиков.',
  },
  {
    title: 'Быстрый доступ',
    description: 'Нажмите ⌘K (Ctrl+K) для быстрого поиска и навигации по приложению.',
  },
];

const STORAGE_KEY = 'subs-onboarding-completed';

export default function OnboardingTour() {
  const [step, setStep] = useState(0);
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem(STORAGE_KEY)) {
      setShow(true);
    }
  }, []);

  const handleClose = () => {
    setShow(false);
    localStorage.setItem(STORAGE_KEY, 'true');
  };

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      handleClose();
    }
  };

  if (!show) return null;

  const current = steps[step];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/60" />
      <div className="relative z-10 w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl dark:bg-gray-900">
        <button
          onClick={handleClose}
          className="absolute right-4 top-4 rounded-lg p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          aria-label="Закрыть"
        >
          <X size={20} />
        </button>

        <div className="mb-4 flex gap-1">
          {steps.map((_, i) => (
            <div
              key={i}
              className={`h-1 flex-1 rounded-full ${
                i <= step ? 'bg-blue-500' : 'bg-gray-200 dark:bg-gray-700'
              }`}
            />
          ))}
        </div>

        <h2 className="mb-2 text-lg font-semibold text-gray-900 dark:text-gray-100">
          {current.title}
        </h2>
        <p className="mb-6 text-sm text-gray-600 dark:text-gray-400">
          {current.description}
        </p>

        <div className="flex items-center justify-between">
          <button
            onClick={handleClose}
            className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            Пропустить
          </button>
          <Button onPress={handleNext}>
            {step < steps.length - 1 ? (
              <>
                Далее <ArrowRight size={16} />
              </>
            ) : (
              'Начать'
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
