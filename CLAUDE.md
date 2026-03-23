# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
bun run dev      # Start dev server
bun run build    # Production build (includes TypeScript check)
bun run lint     # ESLint
```

## Architecture

**SubsManager** — Russian-language subscription tracker built on Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS 4, HeroUI v3. No backend — all data lives in localStorage.

### Data Flow

Types (`src/types/subscription.ts`) → Context (`src/context/SubscriptionContext.tsx`) → Components → Pages

- **SubscriptionProvider** wraps the app in root layout, exposes CRUD methods and derived computed values (totalMonthly, savings, byCategory, upcoming payments, etc.)
- **useLocalStorage hook** handles SSR-safe persistence with a `mounted` flag to prevent hydration mismatches
- All mutations go through context methods which auto-persist to localStorage
- localStorage keys: `subs-manager-data`, `subs-manager-settings`
- Context auto-advances past payment dates on load

### Key Directories

- `src/app/` — Route pages (dashboard `/`, `/subscriptions`, `/analytics`, `/calendar`, `/settings`)
- `src/components/ui/` — Reusable primitives (Button with variants, Input, Select, Card, Modal)
- `src/components/{dashboard,subscriptions,analytics,calendar}/` — Feature components
- `src/components/layout/` — Sidebar (desktop), MobileNav (bottom tabs), Header
- `src/lib/calculations.ts` — `toMonthlyCost()` normalizes any payment frequency to monthly; savings, category aggregation, upcoming payments
- `src/lib/constants.ts` — Category colors/labels, frequency labels, currency symbols (all in Russian)

### Important Patterns

- **All pages are `'use client'`** — no server components beyond layout. State depends on browser localStorage.
- **Theme**: inline `<script>` in `<head>` (`theme-script.tsx`) reads localStorage before hydration to prevent flash. Uses Tailwind `.dark` class on `<html>`.
- **Multi-currency**: each subscription has its own currency (RUB/USD/EUR); display uses `settings.defaultCurrency`.
- **Recharts tooltips**: use `(value) => formatCurrency(Number(value), cur)` — don't type the parameter as `number` directly (Recharts types expect `ValueType | undefined`).

### UI Conventions

- All user-facing text is in Russian
- **HeroUI v3** (`@heroui/react`) — compound component library, no provider needed. Styles via `@import "@heroui/styles"` in `globals.css` (already includes Tailwind CSS).
- `cn()` utility for conditional class joining (not clsx — custom implementation in `lib/utils.ts`)
- Toast notifications via `sonner`
- Icons from `lucide-react`

## Next.js 16 Note

This uses Next.js 16.2.1 which has breaking changes from older versions. Check `node_modules/next/dist/docs/` before using APIs that may have changed.
