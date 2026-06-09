import { z } from 'zod';
import OpenAI from 'openai';
import { zodResponseFormat } from 'openai/helpers/zod';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export const DiagnosticSchema = z.object({
  // базовый уровень повреждения
  damage_level: z.number().int().min(1).max(5)
    .describe('Общий уровень повреждения волос, 1 это здоровые, 5 это критические'),
  
  // что видит AI
  visible_signs: z.array(z.string()).min(1).max(8)
    .describe('Видимые признаки состояния волос на фото'),
  
  // классификация волос
  hair_classification: z.object({
    apparent_type: z.enum(['natural', 'colored', 'bleached', 'highlighted', 'unknown'])
      .describe('Тип волос виден ли на фото'),
    apparent_porosity: z.enum(['low', 'medium', 'high', 'unknown'])
      .describe('Видимая пористость по структуре'),
    apparent_density: z.enum(['thin', 'medium', 'thick', 'unknown'])
      .describe('Видимая плотность волос')
  }),
  
  // основные проблемы (упорядочены по приоритету)
  main_issues: z.array(z.enum([
    'dryness',         // сухость
    'breakage',        // ломкость
    'split_ends',      // секущиеся кончики
    'dullness',        // тусклость
    'color_fade',      // потеря цвета
    'frizz',           // пушистость
    'oily_scalp',      // жирность корней
    'volume_loss',     // потеря объёма
    'thinning'         // истончение
  ])).min(1).max(5),
  
  // рекомендованная категория Limba
  recommended_limba_category: z.enum(['color', 'volume', 'detox', 'hydration'])
    .describe('Какая линия Limba больше всего подходит'),
  
  // если нужен mix двух категорий
  secondary_limba_category: z.enum(['color', 'volume', 'detox', 'hydration']).optional()
    .describe('Опциональная вторая категория если волосам нужен микс'),
  
  // рекомендации для самостоятельного подбора (для тех кто не в Мадриде)
  self_care_priorities: z.array(z.string()).min(2).max(5)
    .describe('Приоритетные направления ухода своими словами'),
  
  // краткое резюме на русском (не более 500 символов)
  summary: z.string().min(50).max(500)
    .describe('Тёплое резюме для пользователя, поддерживающее, без диагнозов')
});

export type Diagnostic = z.infer<typeof DiagnosticSchema>;

interface QuizContext {
  hair_type?: string;
  scalp_type?: string;
  main_concern?: string;
  wash_frequency?: string;
  heat_styling?: string;
  recent_treatments?: string[];
}

export async function analyzePhoto(
  photoUrl: string, 
  quizContext?: QuizContext
): Promise<{ result: Diagnostic; usage: any } | { error: string }> {
  
  // Формируем контекст из квиза если есть
  const contextBlock = quizContext ? `
Пользователь до этого прошла короткий тест. Вот её ответы:
- Тип волос: ${quizContext.hair_type || 'не указан'}
- Тип кожи головы: ${quizContext.scalp_type || 'не указан'}
- Основная проблема: ${quizContext.main_concern || 'не указано'}
- Частота мытья: ${quizContext.wash_frequency || 'не указано'}
- Термоукладка: ${quizContext.heat_styling || 'не указано'}
- Недавние процедуры: ${(quizContext.recent_treatments || []).join(', ') || 'нет'}

Учитывай этот контекст при анализе. Если на фото противоречит ответам теста,
доверяй фото больше чем ответам (люди иногда не знают свой тип кожи или волос).
` : ` 
У нас пока нет ответов теста, только фото. Будь немного осторожнее с выводами.
`;

  const systemPrompt = `Ты эксперт-трихолог из студии HAIRLAB в Мадриде.
У вас линейка средств Limba с 4 направлениями: Color (для окрашенных),
Volume (для тонких), Detox (глубокое очищение), Hydration (для сухих).
Плюс универсальная термозащита.

Твоя задача: проанализировать фото волос и вернуть структурированный
JSON-ответ согласно схеме.

ВАЖНЫЕ ПРАВИЛА:
1. Тон поддерживающий, без запугивания, без жёстких диагнозов.
2. НЕ используй слова "лечение", "терапия", "диагноз", "алопеция".
   Используй "уход", "анализ", "рекомендации".
3. Если на фото серьёзные проблемы (явные раны, очаги облысения),
   в summary рекомендуй обратиться к врачу.
4. НЕ используй длинные тире (—). Используй обычные тире (-) или точки.
5. НЕ используй AI-обороты ("не только... но и", "погружаемся", "в эпоху").
6. Резюме (summary) пиши простым человеческим языком, как будто говоришь
   с подругой.
7. recommended_limba_category выбирай по главной проблеме:
   - color: если волосы окрашенные/осветлённые, видна потеря пигмента, тусклость
   - volume: если волосы тонкие, истончены, нет объёма
   - detox: если жирные корни, накопление продуктов, тусклость, нужно обновление
   - hydration: если сухость, ломкость, секущиеся кончики (самый частый случай)
8. secondary_limba_category используй только если есть явная вторая проблема
   (например блонд + сильная сухость = color + hydration).

${contextBlock}`;

  try {
    const completion = await openai.chat.completions.parse({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        {
          role: 'user',
          content: [
            { 
              type: 'text', 
              text: 'Проанализируй это фото волос и верни структурированный JSON-ответ.' 
            },
            { 
              type: 'image_url', 
              image_url: { url: photoUrl, detail: 'low' } 
            }
          ]
        }
      ],
      response_format: zodResponseFormat(DiagnosticSchema, 'diagnostic'),
      max_tokens: 800
    });

    const result = completion.choices[0].message.parsed;
    if (!result) return { error: 'AI вернул пустой ответ' };

    return { 
      result, 
      usage: completion.usage 
    };
  } catch (error: any) {
    console.error('OpenAI error:', error);
    return { error: error.message || 'AI временно недоступен' };
  }
}

export function calcCost(usage: any): number {
  // gpt-4o-mini pricing (на момент написания)
  const inputCostPer1M = 0.15;  // $0.15 per 1M input tokens
  const outputCostPer1M = 0.60; // $0.60 per 1M output tokens
  const imageCost = 0.001; // примерно
  
  const inputTokens = usage?.prompt_tokens || 0;
  const outputTokens = usage?.completion_tokens || 0;
  
  return (
    (inputTokens / 1_000_000) * inputCostPer1M +
    (outputTokens / 1_000_000) * outputCostPer1M +
    imageCost
  );
}
