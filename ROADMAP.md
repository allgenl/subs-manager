# SubsManager — Roadmap для портфолио

## Epic: Качество кода и UX

### SUBS-1: Добавить Zod-схемы валидации данных
- **Тип:** Task | **Приоритет:** High | **Порядок:** 1 | **Оценка:** 2ч
- **Описание:** Создать `src/lib/schemas.ts` с Zod-схемами для Subscription и AppSettings. Заменить ручную валидацию в SubscriptionForm и при импорте JSON. Переиспользовать схемы на клиенте и сервере.
- **Навыки:** TypeScript, runtime validation, data integrity

### SUBS-2: Error boundary, loading states, 404 страница
- **Тип:** Task | **Приоритет:** High | **Порядок:** 2 | **Оценка:** 2ч
- **Описание:** Создать `error.tsx` (глобальный error boundary), `loading.tsx` (скелетоны), `not-found.tsx` (кастомная 404). Добавить скелетон для списка подписок.
- **Навыки:** React Error Boundaries, Suspense, UX

### SUBS-3: Добавить анимации (Framer Motion)
- **Тип:** Task | **Приоритет:** Medium | **Порядок:** 3 | **Оценка:** 3ч
- **Описание:** Установить framer-motion. Анимация появления карточек (staggered list), переходы между страницами, анимированный прогресс-бар бюджета, micro-interactions на кнопках и тоглах.
- **Навыки:** Framer Motion, UI/UX, анимации

---

## Epic: Full-Stack (Supabase)

### SUBS-4: Настроить Supabase: база данных и RLS
- **Тип:** Task | **Приоритет:** Critical | **Порядок:** 5 | **Оценка:** 3ч | **Блокирует:** SUBS-5, SUBS-6, SUBS-7
- **Описание:** Установить `@supabase/supabase-js`, `@supabase/ssr`. Создать таблицы `profiles`, `subscriptions` в Supabase с Row Level Security. Создать клиенты `src/lib/supabase/client.ts` и `server.ts`.
- **Навыки:** PostgreSQL, Supabase, RLS, cloud infrastructure

### SUBS-5: Реализовать авторизацию
- **Тип:** Task | **Приоритет:** Critical | **Порядок:** 6 | **Оценка:** 4ч | **Блокируется:** SUBS-4
- **Описание:** Supabase Auth: email/password + OAuth (Google, GitHub). Страницы `/login` и `/register`. Middleware для защиты роутов. Route groups: `(auth)` для публичных, `(app)` для защищённых. Профиль пользователя.
- **Навыки:** Auth, OAuth, Next.js Middleware, Security

### SUBS-6: Server Actions для CRUD подписок
- **Тип:** Task | **Приоритет:** High | **Порядок:** 7 | **Оценка:** 4ч | **Блокируется:** SUBS-4, SUBS-5
- **Описание:** Создать `src/app/actions/subscriptions.ts` с серверными мутациями. Оптимистичные обновления через useOptimistic. Сохранить fallback на localStorage для оффлайн-режима.
- **Навыки:** Next.js Server Actions, useOptimistic, API design

### SUBS-7: REST API endpoint для подписок
- **Тип:** Task | **Приоритет:** Medium | **Порядок:** 18 | **Оценка:** 2ч | **Блокируется:** SUBS-4
- **Описание:** Создать `src/app/api/subscriptions/route.ts` — GET и POST endpoints. Валидация через Zod. Для демонстрации навыка API design.
- **Навыки:** Next.js API Routes, REST, request validation

### SUBS-8: Миграция данных из localStorage в Supabase
- **Тип:** Task | **Приоритет:** Medium | **Порядок:** 19 | **Оценка:** 2ч | **Блокируется:** SUBS-5
- **Описание:** При первом логине предложить импортировать данные из localStorage в Supabase. Компонент `MigrationPrompt` с прогресс-баром.
- **Навыки:** Data migration, UX onboarding

---

## Epic: Продвинутые фичи

### SUBS-9: PWA — Progressive Web App
- **Тип:** Feature | **Приоритет:** Medium | **Порядок:** 8 | **Оценка:** 3ч
- **Описание:** Создать `manifest.json` с иконками. Настроить Service Worker (serwist или next-pwa). Оффлайн-режим: работа с localStorage при отсутствии сети, синхронизация при восстановлении. Install prompt.
- **Навыки:** PWA, Service Worker, offline-first

### SUBS-10: Уведомления о предстоящих платежах
- **Тип:** Feature | **Приоритет:** Medium | **Порядок:** 9 | **Оценка:** 2ч
- **Описание:** Хук `useNotifications.ts` — запрос разрешения, планирование push-уведомлений за N дней до платежа. Баннер в dashboard «Завтра списание X — Y ₽». Поле `reminderDaysBefore` уже есть в модели.
- **Навыки:** Notifications API, Browser APIs, UX

### SUBS-11: Shared/семейные подписки
- **Тип:** Feature | **Приоритет:** Low | **Порядок:** 16 | **Оценка:** 3ч
- **Описание:** Пометка подписки как shared: поля `isShared`, `totalMembers`, `myShare`. В расчётах использовать долю вместо полной цены. UI: показывать «999 ₽ / 4 = 250 ₽ с тебя».
- **Навыки:** Data modeling, бизнес-логика

### SUBS-12: Drag-and-Drop сортировка подписок
- **Тип:** Feature | **Приоритет:** Low | **Порядок:** 17 | **Оценка:** 3ч
- **Описание:** Установить `@dnd-kit/core`, `@dnd-kit/sortable`. Ручная сортировка подписок в списке. Сохранение порядка в `sortOrder`.
- **Навыки:** DnD, @dnd-kit, advanced UI interactions

---

## Epic: Тестирование

### SUBS-13: Unit-тесты (Vitest)
- **Тип:** Task | **Приоритет:** High | **Порядок:** 4 | **Оценка:** 3ч
- **Описание:** Установить vitest, @testing-library/react, jsdom. Тесты для `calculations.ts` (все функции расчётов), `utils.ts` (форматирование), Zod-схем. Настроить `vitest.config.ts`.
- **Навыки:** Vitest, unit testing, TDD

### SUBS-14: Компонентные тесты
- **Тип:** Task | **Приоритет:** Medium | **Порядок:** 10 | **Оценка:** 3ч | **Блокируется:** SUBS-13
- **Описание:** Тесты: SubscriptionForm (валидация, submit, create/edit), SubscriptionCard (действия), SubscriptionList (фильтрация, сортировка).
- **Навыки:** React Testing Library, component testing

### SUBS-15: E2E-тесты (Playwright)
- **Тип:** Task | **Приоритет:** Medium | **Порядок:** 11 | **Оценка:** 3ч
- **Описание:** Установить @playwright/test. Сценарии: полный CRUD подписки, логин → создание → выход → вход → проверка данных. Конфиг с auto-start dev server.
- **Навыки:** Playwright, E2E testing, CI readiness

---

## Epic: DX и Production

### SUBS-16: CI/CD — GitHub Actions
- **Тип:** Task | **Приоритет:** High | **Порядок:** 12 | **Оценка:** 2ч
- **Описание:** `.github/workflows/ci.yml`: lint, type check (`tsc --noEmit`), unit tests, build, E2E tests (Playwright). Запуск на push и PR.
- **Навыки:** GitHub Actions, CI/CD, DevOps

### SUBS-17: Accessibility (a11y)
- **Тип:** Task | **Приоритет:** Medium | **Порядок:** 13 | **Оценка:** 3ч
- **Описание:** ARIA labels на интерактивных элементах, role атрибуты, focus trap в модалках, skip-to-content, клавиатурная навигация по списку. Установить `eslint-plugin-jsx-a11y`.
- **Навыки:** WCAG, accessibility, inclusive design

### SUBS-18: SEO и метаданные
- **Тип:** Task | **Приоритет:** Low | **Порядок:** 15 | **Оценка:** 1.5ч
- **Описание:** Open Graph мета-теги, `robots.txt`, `sitemap.ts`, structured data (JSON-LD). Metadata API на каждой странице.
- **Навыки:** SEO, Next.js Metadata API

### SUBS-19: Оптимизация производительности
- **Тип:** Task | **Приоритет:** Medium | **Порядок:** 14 | **Оценка:** 2ч
- **Описание:** React.lazy + Suspense для Recharts (~200KB). Dynamic imports для модалок. Bundle analyzer. Web Vitals мониторинг. Цель: Lighthouse > 90.
- **Навыки:** Code splitting, lazy loading, performance profiling

---

## Порядок выполнения

| # | Задача | Оценка | Навыки |
|---|--------|--------|--------|
| 1 | SUBS-1 — Zod-схемы | 2ч | TypeScript, validation |
| 2 | SUBS-2 — Error/Loading/404 | 2ч | React, UX |
| 3 | SUBS-3 — Анимации | 3ч | Framer Motion |
| 4 | SUBS-13 — Unit-тесты | 3ч | Vitest, TDD |
| 5 | SUBS-4 — Supabase setup | 3ч | PostgreSQL, RLS |
| 6 | SUBS-5 — Авторизация | 4ч | Auth, OAuth, Middleware |
| 7 | SUBS-6 — Server Actions | 4ч | Next.js, useOptimistic |
| 8 | SUBS-9 — PWA | 3ч | Service Worker, offline |
| 9 | SUBS-10 — Уведомления | 2ч | Notifications API |
| 10 | SUBS-14 — Компонентные тесты | 3ч | React Testing Library |
| 11 | SUBS-15 — E2E Playwright | 3ч | E2E testing |
| 12 | SUBS-16 — CI/CD | 2ч | GitHub Actions |
| 13 | SUBS-17 — Accessibility | 3ч | WCAG, a11y |
| 14 | SUBS-19 — Performance | 2ч | Code splitting, Lighthouse |
| 15 | SUBS-18 — SEO | 1.5ч | Metadata, Open Graph |
| 16 | SUBS-11 — Shared подписки | 3ч | Data modeling |
| 17 | SUBS-12 — Drag-and-Drop | 3ч | @dnd-kit |
| 18 | SUBS-7 — REST API | 2ч | API Routes |
| 19 | SUBS-8 — Миграция данных | 2ч | Data migration |
|   | **Итого** | **~50ч** | |

---

## Демонстрируемые навыки

- **TypeScript** — strict mode, Zod, generics
- **React 19** — hooks, context, useOptimistic, Suspense, error boundaries
- **Next.js 16** — App Router, Server Actions, API Routes, middleware, metadata
- **PostgreSQL** — Supabase, RLS, миграции
- **Auth** — OAuth, session management, protected routes
- **Testing** — Vitest, React Testing Library, Playwright
- **CSS/Tailwind** — responsive, dark mode, анимации
- **Framer Motion** — transitions, staggered animations
- **PWA** — offline, manifest, service worker
- **CI/CD** — GitHub Actions pipeline
- **Accessibility** — ARIA, keyboard nav, WCAG
- **Performance** — code splitting, lazy loading, bundle analysis
- **DevOps** — linting, type checking, automated testing
