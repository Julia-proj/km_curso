# Тест AI-анализа в dev режиме

## ✅ Что исправлено

### Проблема:
В dev режиме mock Supabase возвращал URL `https://placeholder.com/mock.jpg`, который OpenAI не мог загрузить.

### Решение:
Теперь в dev режиме изображение конвертируется в **base64 data URL** и передаётся напрямую в OpenAI.

## 🧪 Как протестировать

### Шаг 1: Проверь OpenAI API ключ
```bash
# Открой .env.local и проверь:
OPENAI_API_KEY=sk-proj-...
```

⚠️ **Важно:** OpenAI API ключ НУЖЕН даже в dev режиме (для реального AI-анализа).

### Шаг 2: Перезапусти dev server
```bash
# Ctrl+C для остановки
npm run dev
```

### Шаг 3: Открой консоль и тестируй
1. Открой http://localhost:3000/dashboard/diagnostika
2. Открой DevTools Console (F12)
3. Загрузи фото волос (любое фото с волосами)
4. Нажми "Анализировать"

### Ожидаемые логи в консоли:

```
[uploadImageToSupabase] Dev mode: using base64 data URL
[POST] Analysis attempt 1/2
[analyzeImageWithOpenAI] Starting analysis...
[analyzeImageWithOpenAI] Image URL type: base64 data URL
[analyzeImageWithOpenAI] OpenAI response received
[analyzeImageWithOpenAI] Analysis complete: {
  damageLevel: 3,
  signsCount: 5,
  recommendationsCount: 6
}
```

### ✅ Успешный результат:
- Появится карточка с результатом анализа
- Уровень повреждения от 1 до 5
- Список признаков состояния
- Рекомендации по уходу

## 🐛 Возможные ошибки

### Ошибка: "OPENAI_API_KEY is not configured"
**Причина:** Отсутствует API ключ OpenAI

**Решение:**
1. Получи ключ на https://platform.openai.com/api-keys
2. Добавь в `.env.local`:
   ```
   OPENAI_API_KEY=sk-proj-your-key-here
   ```
3. Перезапусти dev server

### Ошибка: "Failed to analyze image"
**Причина:** Ошибка от OpenAI API

**Проверь в логах:**
```
[POST] Analysis attempt 1 failed: [детали ошибки]
```

**Возможные причины:**
- Недостаточно средств на OpenAI аккаунте
- Неверный API ключ
- Превышен rate limit
- Проблема с сетью

### Ошибка: "Image too large"
**Причина:** Фото больше 5MB

**Решение:**
- Используй фото меньше 5MB
- Или сожми изображение перед загрузкой

## 🔍 Debug

### Проверь что base64 работает:
В консоли после загрузки файла должно быть:
```javascript
[uploadImageToSupabase] Dev mode: using base64 data URL
```

Если этого НЕТ:
- Dev bypass не активен
- Проверь `.env.local`: `NEXT_PUBLIC_DEV_BYPASS_PAYWALL=true`

### Проверь что OpenAI получает изображение:
```javascript
[analyzeImageWithOpenAI] Image URL type: base64 data URL
```

Если `external URL`:
- Dev bypass не сработал
- Идёт попытка загрузить через Supabase

## 📊 Как работает dev режим:

### На localhost/preview:
1. Файл загружается с клиента
2. Конвертируется в base64
3. Создаётся data URL: `data:image/jpeg;base64,/9j/4AAQ...`
4. Передаётся напрямую в OpenAI Vision API
5. OpenAI анализирует и возвращает JSON
6. Результат показывается пользователю

### В production:
1. Файл загружается в Supabase Storage
2. Создаётся signed URL (действует 1 час)
3. Signed URL передаётся в OpenAI
4. OpenAI загружает изображение по URL
5. Анализ и результат
6. Данные сохраняются в Supabase

## 💰 Стоимость

GPT-4o-mini Vision:
- Input: ~$0.15 за 1M tokens
- Output: ~$0.60 за 1M tokens
- Изображение + анализ: ~$0.001-0.005 за запрос

В dev режиме **используется реальный OpenAI API** = реальные деньги.

## ✨ Преимущества base64 подхода:

- ✅ Не нужен Supabase в dev режиме
- ✅ Работает без интернета (локально)
- ✅ Быстрее (нет загрузки в storage)
- ✅ Не сохраняет данные (privacy)
- ❌ Требует реальный OpenAI ключ
- ❌ Тратит реальные деньги на API
