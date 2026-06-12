# Тест Payment Bypass

## 🧪 Как проверить на localhost

### Шаг 1: Перезапусти dev server
```bash
# Останови текущий сервер (Ctrl+C)
npm run dev
```

### Шаг 2: Открой консоль браузера
1. Открой http://localhost:3000/offer
2. Открой DevTools (F12)
3. Перейди на вкладку Console

### Шаг 3: Проверь модалку оплаты
1. Нажми "Получить полный доступ" на курсе
2. Откроется модальное окно
3. **В консоли** должно появиться:
```
[PaymentModal] Dev bypass check: {
  hostname: "localhost",
  isLocal: true,
  hasDevEnv: true,
  isPreviewEnv: false,
  isVercelPreview: false,
  devBypass: true,
  NEXT_PUBLIC_DEV_BYPASS_PAYWALL: "true",
  NEXT_PUBLIC_VERCEL_ENV: undefined
}
```

### Шаг 4: Проверь чекбокс
**Должен быть виден чекбокс:**
- ☑️ Dev mode (bypass Stripe, только localhost)
- Галочка **должна стоять автоматически**
- Можно снять и поставить обратно

### Шаг 5: Проверь bypass
1. Убедись что чекбокс включён
2. Нажми "Карта любой страны"
3. **Должно сразу** перенаправить на `/checkout/success`
4. НЕ должно показывать форму email
5. НЕ должно открывать Stripe

### Если НЕ работает:

#### Проблема 1: Чекбокс не виден
**Причина:** переменная окружения не загружена

**Решение:**
1. Останови dev server (Ctrl+C)
2. Проверь `.env.local`:
   ```
   NEXT_PUBLIC_DEV_BYPASS_PAYWALL=true
   ```
3. Запусти снова: `npm run dev`
4. Hard refresh в браузере (Ctrl+Shift+R)

#### Проблема 2: Чекбокс виден, но не кликается
**Причина:** disabled по ошибке

**Решение:**
1. Открой консоль
2. Проверь что `isPreview: false` (на localhost)
3. Если `isPreview: true` - это ошибка, сообщи

#### Проблема 3: Нажатие не работает
**Причина:** `devMode` сбрасывается

**Решение:**
1. В консоли после нажатия должно быть:
   ```
   [PaymentModal] Dev bypass activated, redirecting to success
   ```
2. Если этого нет - devMode = false

## 🔍 Debug информация

### Что проверить в консоли:

1. **При открытии модалки:**
```javascript
[PaymentModal] Dev bypass check: {...}
```
- `isLocal` должен быть `true`
- `hasDevEnv` должен быть `true`
- `devBypass` должен быть `true`

2. **При клике на кнопку:**
```javascript
[PaymentModal] Dev bypass activated, redirecting to success
```

3. **Если этого нет:**
- Открой React DevTools
- Найди компонент `PaymentModal`
- Проверь state: `devMode`, `isLocalhost`, `isPreview`

## 🌐 Проверка на Vercel Preview

### После deploy:
1. Открой preview URL (из Vercel dashboard)
2. Перейди на `/offer`
3. Открой консоль (F12)
4. Нажми "Получить полный доступ"
5. **В консоли должно быть:**
```
[PaymentModal] Dev bypass check: {
  hostname: "km-curso-xxx.vercel.app",
  isLocal: false,
  hasDevEnv: false (или true, если добавил в Vercel),
  isPreviewEnv: true,
  isVercelPreview: true,
  devBypass: true
}
```

### Ожидаемое поведение:
- ✅ Чекбокс виден
- ✅ Чекбокс **disabled** (нельзя снять)
- ✅ Надпись: "Dev mode (auto-enabled для preview)"
- ✅ Клик сразу ведёт на success

## 📊 Возможные значения devBypass

| Среда | isLocal | hasDevEnv | isPreviewEnv | devBypass |
|-------|---------|-----------|--------------|-----------|
| localhost с .env.local | ✅ | ✅ | ❌ | ✅ |
| localhost без .env.local | ✅ | ❌ | ❌ | ✅ (isLocal) |
| Vercel Preview | ❌ | ❌ | ✅ | ✅ |
| Vercel Production | ❌ | ❌ | ❌ | ❌ |

## 🐛 Если всё равно не работает

Добавь больше логов в `handleStripeClick`:

```typescript
const handleStripeClick = () => {
  console.log('[handleStripeClick] Called with:', {
    devMode,
    isLocalhost,
    isPreview,
    condition: devMode && (isLocalhost || isPreview)
  })
  
  // ... rest of code
}
```

И проверь что выводится при клике.
