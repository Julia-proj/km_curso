# Master Prompt — HAIRLAB (km_curso)

Этот файл — контекст для AI-ассистентов и новых разработчиков. Здесь описано,
что это за проект, как устроены потоки (воронка, авторизация, оплата, AI),
правила кода, SEO и аналитика.

## О проекте

HAIRLAB — сайт-воронка авторского курса по восстановлению волос (Елена,
Мадрид). Продаются два продукта через Stripe:

- **Полный курс (38€)** — видеоуроки + методички + AI-анализ волос + Telegram-канал
- **Методичка (12€)** — только PDF-гайды

## Технологии

- **Next.js 16 (App Router, Turbopack)** — ВАЖНО: версия с breaking changes,
  перед написанием кода читай доки в `node_modules/next/dist/docs/`
  (см. AGENTS.md). Middleware называется `src/proxy.ts` (не middleware.ts).
- **TypeScript**, **Tailwind CSS v4** (+ дизайн-токены `km-` в globals.css), **Framer Motion**
- **Supabase** — Google OAuth (PKCE) + Postgres (доступы, прогресс уроков) + Storage (фото)
- **Stripe** — checkout + вебхук
- **OpenAI** — AI-анализ фото волос (`src/lib/ai/diagnose.ts`)
- **Vercel** — хостинг, Analytics, Speed Insights
- Шрифты через `next/font/google`: Inter (body), Manrope (заголовки UI),
  Playfair Display (hero, только веса 400/500), Fraunces (только /result и
  /scan, `preload: false`)

## Воронка (продуктовая логика)

1. Лендинг `/` → бесплатный тест `/quiz` (zustand + localStorage `km-quiz`)
2. Результат теста `/result` → **бесплатный урок `/lesson`** (подарок)
3. Выбор тарифа `/offer` → Stripe Checkout → `/checkout/success`
4. Личный кабинет `/dashboard` (после Google-входа): видеоуроки, методички,
   **AI-анализ** (`/dashboard/diagnostika`), Telegram
5. AI-анализ доступен ТОЛЬКО с полным курсом. Работает по фото; если тест
   пройден — его ответы прикладываются для точности (если нет — показывается
   подсказка пройти тест, но анализ не блокируется)

## Авторизация и доступы

- Вход только через Google: `/auth/login` → `supabase.auth.signInWithOAuth`
  (redirectTo = `window.location.origin` — НЕ env, чтобы PKCE-cookie и callback
  были на одном домене) → `/auth/callback` (обмен кода, upsert профиля)
- `profiles.id` = `auth.users.id` (миграция `008_profiles_auth_sync.sql`:
  триггер `on_auth_user_created` + RLS «по id ИЛИ по email»)
- Доступы: `profiles.has_full_course`, `profiles.has_methodichka`.
  Выставляются Stripe-вебхуком (`/api/stripe/webhook`) по email покупателя,
  либо админ-allowlist `ADMIN_EMAILS` (env, выставляется в auth callback)
- Проверка доступа в клиенте: `fetchProfileAccess()` из
  `src/lib/profile-access.ts` (ищет по id, потом по email)
- `/dashboard/*` защищён в `src/proxy.ts`; страницы уроков и диагностики
  дополнительно проверяют `has_full_course`
- Неоплатившим кабинет показывает экран «Доступ не открыт» с кнопкой покупки
  (НЕ молчаливый редирект)
- Dev-режим: `NEXT_PUBLIC_DEV_BYPASS_PAYWALL=true` в `.env.local` — пропускает
  оплату локально. НИКОГДА не включать на Vercel.

## База данных (Supabase)

- `profiles`: id (= auth.uid), email (unique), full_name, has_full_course,
  has_methodichka, stripe_customer_id. RLS: своя строка по id или email.
- `lesson_progress`: user_id → profiles(id) ON UPDATE CASCADE, completed int[],
  last_viewed. API: `/api/lesson-progress` (серверный Supabase-клиент —
  НЕ createBrowserClient на сервере!)
- Миграции в `supabase/migrations/` — выполнять по порядку в SQL Editor,
  НЕ перезапускать старые скрипты поверх новых.

## Переменные окружения (Vercel)

| Переменная | Что это |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase клиент |
| `SUPABASE_SERVICE_ROLE_KEY` | серверные операции (вебхук, callback) |
| `STRIPE_SECRET_KEY` / `STRIPE_WEBHOOK_SECRET` / `STRIPE_PRICE_COURSE` / `STRIPE_PRICE_GUIDE` | Stripe |
| `NEXT_PUBLIC_SITE_URL` или `NEXT_PUBLIC_URL` | канонический домен (для Stripe URL и метаданных) |
| `ADMIN_EMAILS` | через запятую; полный доступ без оплаты |
| `OPENAI_API_KEY` | AI-анализ |
| `NEXT_PUBLIC_GA_ID` | Google Analytics 4 (`G-XXXXXXXXXX`), без него GA не грузится |
| `RESEND_API_KEY` | письма |

## SEO

Что уже сделано в коде:

- `src/app/robots.ts` → `/robots.txt`: закрыты `/dashboard/`, `/auth/`,
  `/checkout/`, `/api/`, `/result`, `/scan/`; указан sitemap
- `src/app/sitemap.ts` → `/sitemap.xml`: только публичные страницы
  (`/`, `/quiz`, `/offer`, `/lesson`)
- Метаданные (title, description, Open Graph, ru_RU) в `src/app/layout.tsx`;
  `metadataBase` берётся из `NEXT_PUBLIC_SITE_URL`

Правила при добавлении страниц:

- Новой публичной странице — свой `export const metadata` (title + description)
  и строка в `sitemap.ts`
- Приватные страницы (кабинет, оплата) в sitemap НЕ добавлять
- Один `<h1>` на страницу, у картинок осмысленный `alt`
- Производительность = SEO: не анимировать первый экран из `opacity: 0`,
  не добавлять полноэкранных лоадеров (уже удалён LoadingScreen — не возвращать),
  контраст текста ≥ 4.5:1

### Подключение Google Search Console (делается один раз, руками)

1. Зайди на https://search.google.com/search-console → «Добавить ресурс»
2. Выбери «Доменный ресурс» и введи свой домен (или «Префикс URL» с
   `https://домен`)
3. Подтверждение: для доменного — TXT-запись в DNS (если домен куплен через
   Vercel: Vercel → Domains → DNS → Add Record → TXT). Для префикса — можно
   HTML-тегом: Google даст `<meta name="google-site-verification" …>`, его
   значение добавляется в `layout.tsx` → `metadata.verification.google`
4. После подтверждения: Search Console → «Файлы Sitemap» → отправь
   `https://домен/sitemap.xml`
5. Через несколько дней появятся данные: запросы, показы, клики, позиции

## Аналитика

Уже подключено:

- **Vercel Analytics + Speed Insights** — `layout.tsx`, работают сразу,
  смотреть в Vercel → проект → Analytics / Speed Insights
- **Google Analytics 4** — компонент `src/components/GoogleAnalytics.tsx`,
  включается переменной `NEXT_PUBLIC_GA_ID`

### Подключение GA4 (делается один раз, руками)

1. https://analytics.google.com → Админ → «Создать ресурс» (часовой пояс,
   валюта EUR)
2. «Потоки данных» → «Веб» → URL сайта → создать поток
3. Скопируй **Measurement ID** вида `G-XXXXXXXXXX`
4. Vercel → Settings → Environment Variables → `NEXT_PUBLIC_GA_ID` =
   `G-XXXXXXXXXX` (Production) → Redeploy
5. Проверка: открой сайт → GA4 «Отчёты → В реальном времени» — должен
   появиться твой визит

Какие события стоит добавить позже (через `gtag('event', …)`):
начало теста, завершение теста, клик «Выбрать тариф», успешная оплата
(на `/checkout/success`), вход в кабинет, запуск AI-анализа.

## Правила кода (сохраняются из прежней версии)

- Контент — в `src/config/*` (landing-content.ts и др.), не хардкодить в компонентах
- Клиентские компоненты — `"use client"`; named exports; типизировать пропсы; без `any`
- Стили: Tailwind-классы; `km-`-утилиты для повторяющихся паттернов; инлайн-стили
  только для динамики
- Картинки: `next/image`; above-the-fold — `priority`, остальное lazy; `sizes` обязателен
- Анимации: `@/lib/animations` (fadeUp, ease, viewport); НЕ анимировать
  first-screen контент из невидимого состояния (LCP)
- `export const dynamic` / `revalidate` — ТОЛЬКО в серверных компонентах
  (в `"use client"`-файле это роняет сборку Next 16)
- Mobile-first, проверка на всех брейкпоинтах
- Платёжные ссылки — `getPaymentLink()` из `config/payments.ts`
- Header (offer/lesson/уроки) и NavSection (лендинг) — разные компоненты;
  NavSection после входа показывает имя пользователя
- Коммиты: conventional commits (`feat:`, `fix:`, …), тестировать локально
  (`npx next build`) перед пушем

## Чек-лист перед деплоем

- [ ] `npx next build` проходит без ошибок
- [ ] Никаких `NEXT_PUBLIC_DEV_BYPASS_PAYWALL` на Vercel
- [ ] Новые страницы: metadata + sitemap (если публичные)
- [ ] Контраст и размеры тап-зон (Lighthouse Accessibility ≥ 95)
- [ ] Supabase: redirect URL `https://домен/auth/callback` в Auth → URL Configuration
