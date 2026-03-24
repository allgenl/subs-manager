import Card from '@/components/ui/Card';
import PageTransition from '@/components/motion/PageTransition';
import { CreditCard } from 'lucide-react';

const techStack = [
  'Next.js 16', 'React 19', 'TypeScript', 'Tailwind CSS 4', 'HeroUI v3',
  'Supabase', 'Framer Motion', 'Zod', 'Vitest', 'Recharts',
  'cmdk', '@dnd-kit', 'jsPDF', 'PWA',
];

export default function AboutPage() {
  return (
    <PageTransition>
      <div className="space-y-6 max-w-2xl">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">О приложении</h1>

        <Card>
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 dark:bg-blue-900/30">
              <CreditCard className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h2 className="font-semibold text-gray-900 dark:text-gray-100">SubsManager</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">v1.0.0</p>
            </div>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Менеджер подписок с открытым исходным кодом. Отслеживайте расходы,
            анализируйте траты, получайте уведомления о предстоящих платежах.
          </p>
        </Card>

        <Card>
          <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">
            Технологии
          </h3>
          <div className="flex flex-wrap gap-2">
            {techStack.map((tech) => (
              <span
                key={tech}
                className="rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs font-medium text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
              >
                {tech}
              </span>
            ))}
          </div>
        </Card>

        <Card>
          <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">
            Возможности
          </h3>
          <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
            <li>Управление подписками (CRUD, теги, папки, категории)</li>
            <li>Аналитика расходов и графики трендов</li>
            <li>Календарь платежей с экспортом в .ics</li>
            <li>Push-уведомления о предстоящих списаниях</li>
            <li>PWA — работает оффлайн, устанавливается как приложение</li>
            <li>Семейные/совместные подписки с расчётом долей</li>
            <li>Экспорт в PDF, CSV, JSON</li>
            <li>Command Palette (⌘K) для быстрой навигации</li>
            <li>REST API для интеграций</li>
            <li>Drag-and-Drop сортировка</li>
          </ul>
        </Card>
      </div>
    </PageTransition>
  );
}
