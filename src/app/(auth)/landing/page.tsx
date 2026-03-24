import Link from 'next/link';
import {
  CreditCard,
  BarChart3,
  Bell,
  Shield,
  Smartphone,
  Zap,
  ArrowRight,
  Calendar,
  PieChart,
  Command,
} from 'lucide-react';

const features = [
  {
    icon: CreditCard,
    title: 'Управление подписками',
    description: 'Добавляйте, редактируйте и отслеживайте все свои подписки в одном месте.',
    color: 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
  },
  {
    icon: BarChart3,
    title: 'Детальная аналитика',
    description: 'Графики расходов, категории, тренды — полная картина ваших трат.',
    color: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400',
  },
  {
    icon: Calendar,
    title: 'Календарь платежей',
    description: 'Визуальный календарь с предстоящими списаниями по всем подпискам.',
    color: 'bg-violet-50 text-violet-600 dark:bg-violet-900/30 dark:text-violet-400',
  },
  {
    icon: Bell,
    title: 'Уведомления',
    description: 'Push-уведомления о предстоящих платежах, чтобы ничего не пропустить.',
    color: 'bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400',
  },
  {
    icon: PieChart,
    title: 'Бюджет и экономия',
    description: 'Установите месячный бюджет и следите за процентом использования.',
    color: 'bg-rose-50 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400',
  },
  {
    icon: Shield,
    title: 'Безопасность',
    description: 'Supabase Auth, Row Level Security — ваши данные под защитой.',
    color: 'bg-cyan-50 text-cyan-600 dark:bg-cyan-900/30 dark:text-cyan-400',
  },
  {
    icon: Smartphone,
    title: 'PWA — работает оффлайн',
    description: 'Установите как приложение на телефон. Работает без интернета.',
    color: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400',
  },
  {
    icon: Command,
    title: 'Быстрые действия',
    description: 'Нажмите ⌘K для мгновенного поиска и навигации по приложению.',
    color: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
  },
];

const stats = [
  { value: '10+', label: 'Категорий подписок' },
  { value: '3', label: 'Валюты (₽, $, €)' },
  { value: 'PWA', label: 'Работает оффлайн' },
  { value: '∞', label: 'Подписок' },
];

const techStack = [
  'Next.js 16', 'React 19', 'TypeScript', 'Tailwind CSS 4',
  'Supabase', 'Framer Motion', 'Zod', 'Vitest',
  'HeroUI', 'Recharts', 'PWA',
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      {/* Hero */}
      <section className="relative overflow-hidden px-4 pt-20 pb-32">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-violet-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950" />
        <div className="relative mx-auto max-w-4xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-1.5 text-sm font-medium text-blue-700 dark:border-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
            <Zap size={14} />
            Open Source проект для портфолио
          </div>

          <h1 className="mb-6 text-5xl font-extrabold tracking-tight text-gray-900 dark:text-gray-100 sm:text-6xl">
            Контролируйте свои{' '}
            <span className="bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">
              подписки
            </span>
          </h1>

          <p className="mx-auto mb-10 max-w-2xl text-lg text-gray-600 dark:text-gray-400">
            SubsManager помогает отслеживать все подписки, анализировать расходы
            и не пропускать платежи. Бесплатно и с открытым кодом.
          </p>

          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-8 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 transition-all hover:bg-blue-700 hover:shadow-xl"
            >
              Начать бесплатно
              <ArrowRight size={16} />
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-8 py-3 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              Войти в аккаунт
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-gray-200 bg-gray-50 py-12 dark:border-gray-800 dark:bg-gray-900/50">
        <div className="mx-auto grid max-w-4xl grid-cols-2 gap-8 px-4 sm:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">{stat.value}</p>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4">
        <div className="mx-auto max-w-5xl">
          <div className="mb-12 text-center">
            <h2 className="mb-3 text-3xl font-bold text-gray-900 dark:text-gray-100">
              Всё для управления подписками
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Полный набор инструментов для контроля ежемесячных расходов
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="rounded-2xl border border-gray-200 bg-white p-6 transition-shadow hover:shadow-lg dark:border-gray-800 dark:bg-gray-900"
              >
                <div className={`mb-4 inline-flex rounded-xl p-3 ${feature.color}`}>
                  <feature.icon size={22} />
                </div>
                <h3 className="mb-2 font-semibold text-gray-900 dark:text-gray-100">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="border-t border-gray-200 bg-gray-50 py-16 px-4 dark:border-gray-800 dark:bg-gray-900/50">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="mb-8 text-2xl font-bold text-gray-900 dark:text-gray-100">
            Технологический стек
          </h2>
          <div className="flex flex-wrap justify-center gap-3">
            {techStack.map((tech) => (
              <span
                key={tech}
                className="rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4">
        <div className="mx-auto max-w-2xl rounded-2xl bg-gradient-to-br from-blue-600 to-violet-600 p-10 text-center shadow-xl">
          <h2 className="mb-4 text-3xl font-bold text-white">
            Начните экономить уже сегодня
          </h2>
          <p className="mb-8 text-blue-100">
            Зарегистрируйтесь бесплатно и возьмите свои подписки под контроль
          </p>
          <Link
            href="/register"
            className="inline-flex items-center gap-2 rounded-xl bg-white px-8 py-3 text-sm font-semibold text-blue-700 shadow-lg transition-all hover:shadow-xl"
          >
            Создать аккаунт
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-8 px-4 dark:border-gray-800">
        <div className="mx-auto max-w-4xl flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
          <div className="flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            <span className="font-semibold text-gray-900 dark:text-gray-100">SubsManager</span>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Проект для портфолио. Создан с Next.js 16 + Supabase.
          </p>
        </div>
      </footer>
    </div>
  );
}
