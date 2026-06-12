# Dev Bypass: Инструкция по настройке

## ✅ Что сделано

Добавлен автоматический обход paywall И Supabase для preview-деплоев в Vercel:

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

### Что делают mock-клиенты:
- Возвращают успешные ответы вместо обращения к Supabase
- Имитируют загрузку фото в storage
- Позволяют AI-анализу работать без реальной БД
- Не требуют настройки Supabase credentials

## 🚀 Как проверить

### На localhost:
```bash
npm run dev
# Открой http://localhost:3000/dashboard
# Доступ открыт без регистрации и оплаты
# Глубокий анализ работает без Supabase
```

### В Vercel:
1. Push изменения в ветку (не main)
2. Vercel создаст preview-деплой автоматически
3. Открой preview URL
4. Перейди на `/dashboard` - доступ открыт
5. Попробуй глубокий анализ - работает без ошибок Supabase

### В production:
⚠️ **НЕ работает** - только на localhost и preview

## 🔒 Безопасность

- ✅ В production проверка оплаты работает полностью
- ✅ В production требуются реальные Supabase credentials
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

## 📝 Изменённые файлы

### Frontend:
- `src/lib/supabase/middleware.ts`
- `src/app/dashboard/page.tsx`
- `src/app/dashboard/diagnostika/page.tsx`
- `src/app/dashboard/downloads/page.tsx`

### Backend API:
- `src/lib/supabase.ts` (основной helper)
- `src/app/api/user/access/route.ts`
- `src/app/api/diagnose/route.ts`
- `src/app/api/scan/route.ts`
- `src/app/api/lesson-progress/route.ts`

