# Dev Bypass: Инструкция по настройке

## ✅ Что добавлено

Добавлен автоматический обход paywall, Supabase И оплаты для preview-деплоев в Vercel:

```typescript
const isDevBypass = process.env.NEXT_PUBLIC_DEV_BYPASS_PAYWALL === 'true' || 
                   process.env.VERCEL_ENV === 'preview'
```

Теперь dev-режим активируется автоматически:
- На localhost (через `.env.local`)
- На всех preview-деплоях в Vercel (автоматически)

## 📋 Где работает обход

### Frontend (проверка доступа):
1. **Middleware** (`src/lib/supabase/middleware.ts`) - пропускает без авторизации
2. **Dashboard** (`src/app/dashboard/page.tsx`) - даёт полный доступ к курсу
3. **Diagnostika** (`src/app/dashboard/diagnostika/page.tsx`) - разрешает AI-анализ
4. **Downloads** (`src/app/dashboard/downloads/page.tsx`) - показывает файлы для скачивания

### Backend API (Supabase + AI):
5. **API Access** (`src/app/api/user/access/route.ts`) - возвращает полный доступ
6. **API Diagnose** (`src/app/api/diagnose/route.ts`) - глубокий AI-анализ волос
7. **API Scan** (`src/app/api/scan/route.ts`) - быстрый AI-анализ
8. **API Lesson Progress** (`src/app/api/lesson-progress/route.ts`) - прогресс уроков
9. **Core Supabase** (`src/lib/supabase.ts`) - базовый helper

### Payment (оплата):
10. **PaymentModal** (`src/components/PaymentModal.tsx`) - обход Stripe оплаты
11. **Checkout Success** (`src/app/checkout/success/page.tsx`) - страница успеха без auth

### Что делают mock-клиенты:
- Возвращают успешные ответы вместо обращения к Supabase
- Имитируют загрузку фото в storage
- Позволяют AI-анализу работать без реальной БД
- **Bypass оплаты Stripe** - сразу перенаправляют на success
- Не требуют настройки Supabase credentials

## 🚀 Как проверить

### На localhost:
```bash
npm run dev
# Открой http://localhost:3000
```

**Проверь:**
1. `/offer` - выбор тарифа
2. Нажми "Получить полный доступ"
3. В модальном окне увидишь чекбокс "Dev mode"
4. Поставь галочку (или она уже стоит)
5. Нажми "Карта любой страны"
6. Перенаправит на `/checkout/success` БЕЗ реальной оплаты
7. Открой `/dashboard` - полный доступ к курсу

### В Vercel preview:
1. Push изменения в ветку (не main)
2. Vercel создаст preview-деплой автоматически
3. Открой preview URL
4. Перейди на `/offer`
5. Выбери тариф
6. Dev mode **включён автоматически** (disabled checkbox)
7. Оплата проходит без Stripe
8. Dashboard открыт, курс доступен

### В production:
⚠️ **НЕ работает** - только на localhost и preview

## 🔒 Безопасность

- ✅ В production проверка оплаты работает полностью
- ✅ В production требуются реальные Supabase credentials
- ✅ В production оплата идёт через реальный Stripe
- ✅ `VERCEL_ENV === 'preview'` срабатывает только на preview-деплоях
- ✅ `VERCEL_ENV === 'production'` на боевом сайте - обход НЕ активен
- ✅ Mock-клиенты не сохраняют данные, только имитируют успех

## 🛠️ Опционально: ручная настройка в Vercel

Если хочешь контролировать вручную:

1. Vercel Dashboard → Settings → Environment Variables
2. Добавь:
   - Name: `NEXT_PUBLIC_DEV_BYPASS_PAYWALL`
   - Value: `true`
   - Environments: **только Preview и Development** (НЕ Production!)
3. Redeploy

## 🧪 Что теперь работает в dev-режиме:

- ✅ Вход в dashboard без логина
- ✅ Доступ ко всем урокам курса
- ✅ Скачивание методички и курса
- ✅ Быстрый AI-анализ волос (/scan)
- ✅ Глубокий AI-анализ волос (/dashboard/diagnostika)
- ✅ Сохранение прогресса уроков
- ✅ Проверка доступа пользователя
- ✅ **Обход оплаты Stripe**
- ✅ **Страница успешной оплаты без auth**

## 💳 Особенности PaymentModal:

### На localhost:
- Показывает чекбокс "Dev mode (bypass Stripe, только localhost)"
- Можно включать/выключать вручную
- При включённом dev mode - сразу на success страницу

### На Vercel preview:
- Чекбокс показан, но disabled (неактивен)
- Надпись: "Dev mode (auto-enabled для preview)"
- Dev mode включён автоматически
- Оплата проходит без Stripe

### В production:
- Чекбокса нет
- Dev mode выключен
- Оплата идёт через реальный Stripe

## 📝 Изменённые файлы

### Frontend:
- `src/lib/supabase/middleware.ts`
- `src/app/dashboard/page.tsx`
- `src/app/dashboard/diagnostika/page.tsx`
- `src/app/dashboard/downloads/page.tsx`
- `src/components/PaymentModal.tsx` **(новое)**
- `src/app/checkout/success/page.tsx` **(новое)**

### Backend API:
- `src/lib/supabase.ts` (основной helper)
- `src/app/api/user/access/route.ts`
- `src/app/api/diagnose/route.ts`
- `src/app/api/scan/route.ts`
- `src/app/api/lesson-progress/route.ts`


