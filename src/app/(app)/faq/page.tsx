'use client';

import { useState } from 'react';
import PageTransition from '@/components/motion/PageTransition';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

const faqs = [
  {
    q: 'Как добавить подписку?',
    a: 'Нажмите кнопку «Добавить» в верхнем правом углу или клавишу N на клавиатуре.',
  },
  {
    q: 'Где хранятся мои данные?',
    a: 'Данные хранятся в localStorage браузера и синхронизируются с Supabase при авторизации.',
  },
  {
    q: 'Как экспортировать данные?',
    a: 'Перейдите в Настройки → Данные. Доступен экспорт в JSON, CSV и PDF.',
  },
  {
    q: 'Как работают семейные подписки?',
    a: 'При создании подписки включите «Семейная подписка» и укажите количество участников. Стоимость автоматически разделится.',
  },
  {
    q: 'Можно ли использовать оффлайн?',
    a: 'Да! SubsManager — PWA приложение. Установите его через браузер и используйте без интернета.',
  },
  {
    q: 'Как быстро найти подписку?',
    a: 'Нажмите ⌘K (Ctrl+K) для быстрого поиска по всем подпискам и страницам.',
  },
  {
    q: 'Как настроить уведомления?',
    a: 'При первом визите появится предложение включить уведомления. Также можно настроить напоминание за N дней для каждой подписки.',
  },
  {
    q: 'Как добавить в Google Calendar?',
    a: 'На странице Календарь нажмите «Экспорт .ics» и импортируйте файл в Google Calendar.',
  },
];

export default function FAQPage() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <PageTransition>
      <div className="space-y-6 max-w-2xl">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Частые вопросы</h1>
        <div className="space-y-2">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="rounded-lg border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900"
            >
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="flex w-full items-center justify-between p-4 text-left"
              >
                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {faq.q}
                </span>
                <ChevronDown
                  size={16}
                  className={cn(
                    'shrink-0 text-gray-400 transition-transform',
                    open === i && 'rotate-180'
                  )}
                />
              </button>
              {open === i && (
                <div className="px-4 pb-4 text-sm text-gray-600 dark:text-gray-400">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </PageTransition>
  );
}
