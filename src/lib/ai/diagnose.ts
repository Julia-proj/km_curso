import { z } from 'zod';
import OpenAI from 'openai';
import { zodResponseFormat } from 'openai/helpers/zod';
import { quizQuestions } from '@/config/quiz-data';

function getOpenAI() {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY is not configured');
  }
  return new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
}

export const DiagnosticSchema = z.object({
  damage_level: z.number().int().min(1).max(5)
    .describe('Общий уровень повреждения волос, 1 это здоровые, 5 это критические'),
  
  visible_signs: z.array(z.string()).min(1).max(8)
    .describe('Видимые признаки состояния волос на фото'),
  
  hair_classification: z.object({
    apparent_type: z.enum(['natural', 'colored', 'bleached', 'highlighted', 'unknown'])
      .describe('Тип волос виден ли на фото'),
    apparent_porosity: z.enum(['low', 'medium', 'high', 'unknown'])
      .describe('Видимая пористость по структуре'),
    apparent_density: z.enum(['thin', 'medium', 'thick', 'unknown'])
      .describe('Видимая плотность волос')
  }),
  
  main_issues: z.array(z.enum([
    'dryness',
    'breakage',
    'split_ends',
    'dullness',
    'color_fade',
    'frizz',
    'oily_scalp',
    'volume_loss',
    'thinning'
  ])).min(1).max(5),
  
  recommended_limba_category: z.enum(['color', 'volume', 'detox', 'hydration'])
    .describe('Какая линия Limba больше всего подходит'),
  
  secondary_limba_category: z.enum(['color', 'volume', 'detox', 'hydration']).optional()
    .describe('Опциональная вторая категория если волосам нужен микс'),
  
  self_care_priorities: z.array(z.string()).min(2).max(5)
    .describe('Приоритетные направления ухода своими словами'),
  
  summary: z.string().min(50).max(500)
    .describe('Тёплое резюме для пользователя, поддерживающее, без диагнозов')
});

export type Diagnostic = z.infer<typeof DiagnosticSchema>;

export interface QuizContext {
  hair_type?: string;
  scalp_type?: string;
  main_concern?: string;
  wash_frequency?: string;
  heat_styling?: string;
  recent_treatments?: string[];
}

/** Human-readable label for a selected quiz option (q-code -> label). */
function quizLabel(
  questionId: string,
  answers: Record<string, string>
): string | undefined {
  const optionId = answers[questionId];
  if (!optionId) return undefined;
  const question = quizQuestions.find((q) => q.id === questionId);
  return question?.options.find((o) => o.id === optionId)?.label;
}

/**
 * Map raw quiz answers (questionId -> optionId, from the Zustand store) into the
 * semantic QuizContext that analyzePhoto feeds to the model. Returns undefined
 * when the quiz hasn't been answered so the prompt falls back to "photo only".
 */
export function quizAnswersToContext(
  answers: Record<string, string> | null | undefined
): QuizContext | undefined {
  if (!answers || Object.keys(answers).length === 0) return undefined;

  // Heat styling is spread across q4 (flat iron), q5 (blow dryer), q6 (styler).
  const heavyIron = answers['q4'] === 'q4_a' || answers['q4'] === 'q4_b';
  const styler = answers['q6'] === 'q6_a';
  const blowDries = answers['q5'] === 'q5_b';
  const heat_styling = heavyIron || styler
    ? 'часто (утюжок/стайлер)'
    : blowDries
      ? 'регулярно сушит феном'
      : 'редко';

  const recent_treatments = [quizLabel('q9', answers)].filter(
    (v): v is string => Boolean(v)
  );

  return {
    hair_type: quizLabel('q1', answers),
    main_concern: quizLabel('q3', answers),
    wash_frequency: quizLabel('q2', answers),
    heat_styling,
    recent_treatments,
  };
}

export async function analyzePhoto(
  photoUrl: string, 
  quizContext?: QuizContext
): Promise<{ result: Diagnostic; usage: any } | { error: string }> {
  
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
    const openai = getOpenAI();
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
  const inputCostPer1M = 0.15;
  const outputCostPer1M = 0.60;
  const imageCost = 0.001;
  
  const inputTokens = usage?.prompt_tokens || 0;
  const outputTokens = usage?.completion_tokens || 0;
  
  return (
    (inputTokens / 1_000_000) * inputCostPer1M +
    (outputTokens / 1_000_000) * outputCostPer1M +
    imageCost
  );
}
