# SOURCE_OF_TRUTH.md - Конституция проекта HAIRLAB

**Версия:** 1.0
**Статус:** Active
**Правило:** Любой агент / чат / промпт читает этот файл ПЕРВЫМ.

---

## 1. О проекте

**Название:** HAIRLAB / Keratin Madrid
**Продукт:** Домашняя система восстановления волос
**Эксперт:** Елена, мастер из Мадрида, 6 лет, 5000+ клиенток
**Instagram:** @keratin_madrid
**Сайт:** keratin-madrid.com
**Продукты MVP-0:**
- Full Course: 38€ (видео + AI + кабинет + методички)
- KM Guide: 12€ (две методички в PDF: 81 и 19 страниц)

**Целевая аудитория:** Русскоговорящие девушки 25-40 лет, которые тратят деньги на уход, но не видят результата.

---

## 2. Стек и версии

```
Next.js           15.x (App Router, RSC, Server Actions)
React             19.x
TypeScript        5.x (strict: true)
Tailwind CSS      4.x
Framer Motion     12.x
Zustand           5.x
Supabase JS       2.x
Stripe SDK        latest
Resend            latest
Node.js           20 LTS
Package manager   npm
```

**Хостинг:** Vercel
**База:** Supabase (Postgres)
**Платежи:** Stripe Checkout
**AI:** Anthropic Claude API (claude-sonnet-4-20250514)
**Email:** Resend + React Email

---

## 3. Структура папок

```
src/
├── app/              # Next.js App Router (pages, layouts, API routes)
├── components/
│   ├── ui/           # Атомы: Button, Card, Badge, Input, Container
│   ├── blocks/       # Секции лендинга
│   ├── quiz/         # Квиз
│   ├── offer/        # Оффер
│   ├── dashboard/    # Личный кабинет
│   └── shared/       # Header, Footer, CookieConsent
├── lib/              # Утилиты, клиенты (stripe, supabase, ai)
├── hooks/            # React hooks
├── stores/           # Zustand stores
├── types/            # TypeScript типы
└── config/           # Тексты, данные квиза, продукты, флаги
```

---

## 4. SOLID и архитектурные правила

### 4.1 Single Responsibility

Каждый файл делает одно. Компонент рендерит UI. Hook управляет логикой. Store хранит состояние. Config хранит данные.

```
НЕТ: QuizPage.tsx содержит и вопросы, и скоринг, и рендер, и API-вызов
ДА:  QuizPage.tsx -> useQuiz() hook -> quiz-store -> quiz-data.ts
```

### 4.2 Open/Closed

Компоненты расширяются через пропсы и композицию, а не через правку внутренностей.

```tsx
// ДА: Button принимает variant
<Button variant="primary">Текст</Button>
<Button variant="ghost">Текст</Button>

// НЕТ: копируем Button и правим стили внутри
```

### 4.3 Liskov Substitution

Если компонент принимает `ReactNode` в children - в него можно вложить что угодно, и ничего не сломается.

### 4.4 Interface Segregation

Типы компонентов содержат только те пропсы, которые компонент реально использует. Никаких "на всякий случай".

```tsx
// НЕТ:
type ButtonProps = {
  variant: string;
  size: string;
  icon: ReactNode;
  iconPosition: 'left' | 'right';
  tooltip: string;
  analytics: object;
  // ...ещё 20 пропсов
}

// ДА:
type ButtonProps = {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  className?: string;
}
```

### 4.5 Dependency Inversion

Компоненты не импортируют Stripe/Supabase/Resend напрямую. Они вызывают функции из `lib/`, которые абстрагируют зависимость.

```tsx
// НЕТ: import stripe from 'stripe' внутри компонента
// ДА:  import { createCheckoutSession } from '@/lib/stripe'
```

---

## 5. Дизайн-система (обновлено по референсу CodeBeauty)

### 5.1 Палитра

```css
:root {
  /* Фоны */
  --color-bg:           #FAF7F4;     /* тёплый крем */
  --color-bg-warm:      #F3ECE4;     /* секции с акцентом */
  --color-bg-dark:      #1A1613;     /* тёмные секции (hero, акцент) */
  --color-surface:      #FFFFFF;     /* карточки */

  /* Текст */
  --color-text:         #1A1613;     /* основной */
  --color-text-soft:    #6B5E54;     /* второстепенный */
  --color-text-muted:   #A89B91;     /* подсказки, overlines */
  --color-text-on-dark: #FAF7F4;     /* текст на тёмном фоне */

  /* Акценты */
  --color-accent:       #C4956A;     /* CTA, золотистый */
  --color-accent-hover: #B07E52;
  --color-accent-soft:  #F0E4D8;     /* бейджи */
  --color-rose:         #D4A0A0;     /* мягкий розовый, декор */
  --color-rose-soft:    #F2E0E0;     /* фон для розовых акцентов */

  /* Утилитарные */
  --color-border:       #E8DDD4;
  --color-success:      #7BAF6E;
  --color-error:        #C76B6B;
}
```

**Правило:** Розовый - декоративный акцент (линии, иконки, hover-состояния). Не основной цвет. Чёрный (bg-dark) - для контрастных секций (Hero, разделители). Бежевый - доминирующий фон.

### 5.2 Типографика

```
Display:    font-display  32/38 -> 56/64px  weight 500
H1:         font-display  28/34 -> 44/52px  weight 500
H2:         font-display  24/30 -> 36/44px  weight 500
H3:         font-body     20/26 -> 24/32px  weight 600
Body:       font-body     16/26px           weight 400
Body small: font-body     14/22px           weight 400
Caption:    font-body     12/18px           weight 500
Overline:   font-body     11/16px           weight 500, tracking 3px, uppercase

Шрифты:
--font-display: 'Playfair Display', serif
--font-body:    'Inter', sans-serif
```

**Правило Overline (из CodeBeauty):**
Overline пишется с разрядкой: `п р о в е р ь   с е б я`. Не capitals, не bold. Мелкий, спейсированный, muted цвет.

### 5.3 Spacing

```
4px   - micro (между иконкой и текстом)
8px   - xs
12px  - sm
16px  - md (базовый gap)
24px  - lg
32px  - xl
48px  - 2xl
64px  - 3xl (между секциями mobile)
96px  - 4xl (между секциями desktop)
```

### 5.4 Скругления

```
--radius-sm:   8px   (мелкие элементы, инпуты)
--radius-md:   12px  (карточки)
--radius-lg:   16px  (большие карточки)
--radius-xl:   24px  (модалки, hero-блоки)
--radius-full: 9999px (кнопки, бейджи)
```

### 5.5 Тени

```
--shadow-sm:  0 1px 2px rgba(26,22,19,0.04)
--shadow-md:  0 4px 12px rgba(26,22,19,0.06)
--shadow-lg:  0 8px 24px rgba(26,22,19,0.08)
```

### 5.6 Breakpoints

```
sm:  640px
md:  768px
lg:  1024px
xl:  1280px

Контейнер: max-width 1120px, padding 0 16px (mobile), 0 24px (desktop)
```

---

## 6. UX/UI правила (никогда не нарушать)

### 6.1 Layout Stability (CLS = 0)

```
ПРАВИЛО: Каждый элемент, который загружается асинхронно, имеет
зарезервированное пространство (explicit width/height или aspect-ratio).

- Изображения: ВСЕГДА width + height или aspect-ratio в CSS
- Шрифты: font-display: swap + preload + size-adjust
- Видео: aspect-ratio: 16/9, placeholder перед загрузкой
- Кнопки с loading: min-width, чтобы не прыгали при смене текста
- Аккордеон FAQ: анимация height через grid-template-rows, не display:none
```

### 6.2 Mobile-First

Пишем стили для 375px, потом добавляем через `md:` и `lg:`. Никогда наоборот.

```tsx
// ДА:
<h1 className="text-3xl md:text-5xl lg:text-6xl">

// НЕТ:
<h1 className="text-6xl md:text-5xl sm:text-3xl">
```

### 6.3 Touch Targets

Минимальный размер кликабельного элемента: 44x44px (Apple HIG).
Кнопки: минимум 48px высоты.
Отступ между кликабельными элементами: минимум 8px.

### 6.4 Scroll Behaviour

```
- Переход между секциями: smooth scroll
- Анимации при скролле: Framer Motion useInView
- threshold: 0.2 (элемент виден на 20%)
- Анимация: opacity 0->1, translateY 20px->0, duration 0.6s
- Stagger для списков: 0.1s между элементами
- ЗАПРЕЩЕНО: parallax, horizontal scroll, scroll hijacking
```

### 6.5 Навигация

```
- Header: sticky top, blur backdrop, border-bottom при скролле
- Высота header: 64px mobile, 72px desktop
- Z-index header: 50
- Footer: не sticky, обычный блок внизу
```

### 6.6 Загрузка

```
- Skeleton вместо spinner для контентных блоков
- Spinner только для действий (оплата, отправка)
- Optimistic UI для квиза (мгновенный переход, без ожидания)
```

---

## 7. Правила текста (анти-AI)

### 7.1 Структурные правила

```
- Чередуй длину предложений: короткое (5-7 слов), среднее (10-15), длинное (18-22)
- Не начинай два абзаца подряд с одинаковой конструкции
- Не используй больше 3 пунктов в одном списке без текстового блока между ними
- Абзацы: максимум 3-4 предложения
- Каждый экран должен иметь один CTA, не два, не три
```

### 7.2 Тон

```
- Как Елена говорит подруге за кофе
- Уверенно, но не давяще
- Конкретно: не "средства могут не подходить", а "маска за 40€, а волосы через два дня как солома"
- Без канцелярита: не "данный продукт", а "курс" или "гайд"
- Без восхваления: не "невероятная система", а описание что внутри
```

### 7.3 Запрещённые конструкции

Полный список в COPY_GUIDE.md раздел 11.

Ключевые:
- Длинное тире "—" - ЗАПРЕЩЕНО (только дефис "-")
- Emoji - ЗАПРЕЩЕНО
- "В современном мире" - ЗАПРЕЩЕНО
- "Это не просто X, это Y" - ЗАПРЕЩЕНО
- "Только сегодня" - ЗАПРЕЩЕНО

### 7.4 Тест перед публикацией

1. Прочитай вслух. Звучит как нейросеть? Переделай.
2. Покажи маме / подруге. Понятно с первого раза? Нет - упрости.
3. Убери каждое третье прилагательное. Стало хуже? Значит оно было нужно. Не стало? Значит нет.

---

## 8. Performance (Core Web Vitals)

### Целевые метрики

```
LCP  (Largest Contentful Paint):  < 2.5s
FID  (First Input Delay):         < 100ms
CLS  (Cumulative Layout Shift):   < 0.1
INP  (Interaction to Next Paint): < 200ms
TTFB (Time to First Byte):        < 800ms
```

### Как достигаем

```
- Next.js ISR для статических страниц
- next/image для всех изображений (WebP, lazy loading)
- next/font для шрифтов (preload, swap)
- Dynamic import для тяжёлых компонентов (видеоплеер, quiz)
- Минимум JS в начальной загрузке (RSC по умолчанию)
- 'use client' только там, где нужна интерактивность
- Stripe.js загружается лениво (только на checkout странице)
- Analytics (PostHog/Plausible) - async, defer
```

---

## 9. Безопасность

```
- Stripe webhook: ОБЯЗАТЕЛЬНАЯ верификация signature
- Supabase RLS: включен для всех таблиц
- API routes: rate limiting через middleware
- AI endpoint: максимум 3 запроса/час/пользователь
- Env variables: НИКОГДА не в коде, только в .env.local и Vercel settings
- CORS: настроен на конкретные домены
- CSP headers: настроены в next.config.ts
- Никаких секретных ключей с префиксом NEXT_PUBLIC_
```

---

## 10. Git и деплой

```
Ветки:
- main        -> production (auto-deploy Vercel)
- dev         -> preview (auto-deploy Vercel)
- feature/*   -> PR в dev

Commits: Conventional Commits
- feat: новая фича
- fix: баг
- style: стили
- refactor: рефакторинг
- docs: документация
- chore: настройка

CI (GitHub Actions):
- На каждый PR: lint + type-check + build
- На merge в main: lint + type-check + build + deploy
```

---

## 11. Env Variables

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxx
SUPABASE_SERVICE_ROLE_KEY=xxx        # Только серверная сторона!

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_xxx
STRIPE_SECRET_KEY=sk_xxx             # Только серверная сторона!
STRIPE_WEBHOOK_SECRET=whsec_xxx
STRIPE_PRICE_COURSE=price_xxx
STRIPE_PRICE_GUIDE=price_xxx

# AI
ANTHROPIC_API_KEY=sk-ant-xxx         # Только серверная сторона!

# Email
RESEND_API_KEY=re_xxx                # Только серверная сторона!

# Feature Flags
COURSE_STATUS=prelaunch              # 'live' | 'prelaunch'
```

---

## 12. Чеклист: что проверить перед деплоем любой фичи

```
[ ] TypeScript: ноль ошибок (npm run type-check)
[ ] Lint: ноль warnings (npm run lint)
[ ] Mobile: проверил на 375px
[ ] CLS: ноль сдвигов при загрузке
[ ] Текст: проверил по COPY_GUIDE, нет запрещённых конструкций
[ ] Кнопки: min-height 48px, работают hover/active/disabled
[ ] Изображения: width+height указаны, WebP, lazy load
[ ] Тёмные секции: текст читабелен, контраст AA
[ ] Loading states: есть skeleton или spinner
[ ] Error states: есть fallback UI
```
