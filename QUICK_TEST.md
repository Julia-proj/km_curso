# Быстрый тест dev-режима

## 🚀 Что тестировать

### 1. На localhost (должно работать СЕЙЧАС):
```bash
npm run dev
```

Открой: http://localhost:3000

**Проверь:**
- ✅ Главная страница загружается
- ✅ `/dashboard` - открывается без логина
- ✅ `/dashboard/diagnostika` - форма AI-анализа доступна
- ✅ Загрузи фото волос - анализ должен работать
- ✅ `/dashboard/lessons` - уроки видны
- ✅ `/dashboard/downloads` - кнопки скачивания видны

### 2. В Vercel (после push):
```bash
git add .
git commit -m "fix: dev bypass для Supabase и AI анализа"
git push
```

Vercel создаст preview-деплой автоматически.

**Проверь на preview URL:**
- ✅ `/dashboard` - работает без логина
- ✅ `/dashboard/diagnostika` - AI-анализ работает
- ✅ Нет ошибок "Supabase credentials are not configured"

## 🐛 Если что-то не работает:

### Ошибка: "Supabase credentials are not configured"
**Причина:** Переменная окружения не подхватилась.

**Решение:**
1. Проверь `.env.local`:
   ```
   NEXT_PUBLIC_DEV_BYPASS_PAYWALL=true
   ```
2. Перезапусти dev-сервер:
   ```bash
   # Ctrl+C для остановки
   npm run dev
   ```

### Ошибка: AI-анализ не возвращает результат
**Причина:** OpenAI API key не настроен.

**Что делает mock:**
- Mock Supabase не блокирует запрос
- AI-анализ всё равно идёт через реальный OpenAI
- Нужен валидный `OPENAI_API_KEY` в `.env.local`

**Если нет OpenAI ключа:**
- AI-анализ вернёт ошибку, НО
- Ошибка будет от OpenAI, не от Supabase ✅
- Это значит, что обход Supabase РАБОТАЕТ

## 📊 Логи для проверки

В консоли dev-сервера не должно быть:
- ❌ "Supabase credentials are not configured"
- ❌ "Failed to create Supabase client"

Может быть (это нормально):
- ⚠️ "OPENAI_API_KEY is not configured" (если нет ключа)
- ⚠️ "Failed to analyze image" (если нет OpenAI)

## ✅ Критерий успеха

**Dev-режим работает, если:**
1. Dashboard открывается без логина
2. НЕТ ошибок про Supabase credentials
3. AI-анализ доходит до OpenAI (даже если там ошибка)
4. Страницы грузятся без 500 ошибок

**Production НЕ затронут, если:**
1. На main-ветке (production URL) требуется логин
2. Без оплаты нет доступа к курсу
3. Всё работает как раньше
