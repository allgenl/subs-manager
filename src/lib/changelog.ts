export interface ChangelogEntry {
  version: string;
  date: string;
  changes: string[];
}

export const CHANGELOG: ChangelogEntry[] = [
  {
    version: '1.3.0',
    date: '2026-03-24',
    changes: [
      'Архив подписок вместо удаления',
      'Массовые действия (bulk select)',
      'Фильтр по ценовому диапазону',
      'Сравнение подписок',
      'Grid/List режим отображения',
      'Дублирование подписок',
      'FAQ страница',
    ],
  },
  {
    version: '1.2.0',
    date: '2026-03-24',
    changes: [
      'Command Palette (⌘K)',
      'Теги для подписок',
      'Кастомные категории',
      'Папки для группировки',
      'Экспорт в PDF/CSV/ICS',
      'Онбординг тур',
      'Профиль пользователя',
    ],
  },
  {
    version: '1.1.0',
    date: '2026-03-24',
    changes: [
      'Supabase авторизация',
      'Server Actions для CRUD',
      'REST API endpoints',
      'PWA — оффлайн режим',
      'Push уведомления',
      'Framer Motion анимации',
      'Accessibility (a11y)',
    ],
  },
  {
    version: '1.0.0',
    date: '2026-03-24',
    changes: [
      'Начальный релиз',
      'Dashboard с аналитикой',
      'CRUD подписок',
      'Zod валидация',
      'Unit тесты (Vitest)',
      'CI/CD GitHub Actions',
      'Тёмная тема',
    ],
  },
];
