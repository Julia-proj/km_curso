import { z } from 'zod';
import OpenAI from 'openai';
import { zodResponseFormat } from 'openai/helpers/zod';
import { quizQuestions } from '@/config/quiz-data';
import { asIds, getConcerns, type AnswerMap } from '@/lib/quiz-answers';

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

  hair_form: z.enum(['straight', 'wavy', 'curly', 'unknown'])
    .describe('Форма волос по фото: прямые, волнистые, кудрявые'),

  hair_classification: z.object({
    apparent_type: z.enum(['natural', 'colored', 'bleached', 'highlighted', 'unknown'])
      .describe('Тип волос виден ли на фото'),
    apparent_porosity: z.enum(['low', 'medium', 'high', 'unknown'])
      .describe('Видимая пористость по структуре'),
    apparent_density: z.enum(['thin', 'medium', 'thick', 'unknown'])
      .describe('Видимая толщина/плотность волос'),
    thickness_cause: z.enum(['genetic', 'damage', 'mixed', 'unknown'])
      .describe('Если волос тонкий: природная тонкость (genetic), истончение от повреждения (damage), смешанно или непонятно')
  }),

  // Чего волосам не хватает: основа подбора масок и схемы ухода.
  deficits: z.object({
    hydration: z.boolean()
      .describe('Не хватает влаги: сухость, пористость, пушение'),
    lipids: z.boolean()
      .describe('Не хватает липидов: волосы гладкие после укладки, но путаются, электризуются, тусклые'),
    protein: z.boolean()
      .describe('Не хватает протеинов: ломкость, потеря упругости и плотности, повреждённая структура')
  }),

  over_moisture_risk: z.boolean()
    .describe('true, если волос средней пористости и без сильных повреждений: его легко ПЕРЕувлажнить, упор на липиды и умеренное питание, а не на глубокое увлажнение'),

  irreversible_ends: z.boolean()
    .describe('true, если концы разрушены необратимо (распадаются на волокна, прозрачная длина) и их стоит постепенно срезать'),

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

  secondary_limba_category: z.enum(['color', 'volume', 'detox', 'hydration']).nullable()
    .describe('Опциональная вторая категория если волосам нужен микс, иначе null'),

  self_care_priorities: z.array(z.string()).min(2).max(5)
    .describe('Приоритетные направления ухода своими словами'),

  summary: z.string().min(50).max(500)
    .describe('Тёплое резюме для пользователя, поддерживающее, без жёстких диагнозов')
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

/** Label for a specific (questionId, optionId) pair. */
function optionLabel(questionId: string, optionId: string): string | undefined {
  const question = quizQuestions.find((q) => q.id === questionId);
  return question?.options.find((o) => o.id === optionId)?.label;
}

/** Human-readable label for a single-select quiz option (q-code -> label). */
function quizLabel(
  questionId: string,
  answers: AnswerMap
): string | undefined {
  const optionId = asIds(answers[questionId])[0];
  return optionId ? optionLabel(questionId, optionId) : undefined;
}

/**
 * Map raw quiz answers (questionId -> optionId, from the Zustand store) into the
 * semantic QuizContext that analyzePhoto feeds to the model. Returns undefined
 * when the quiz hasn't been answered so the prompt falls back to "photo only".
 */
export function quizAnswersToContext(
  answers: AnswerMap | null | undefined
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

  // q3 is multi-select (up to two concerns): join their labels for the prompt.
  const concernLabels = getConcerns(answers)
    .map((id) => optionLabel('q3', id))
    .filter((v): v is string => Boolean(v));
  const main_concern = concernLabels.length ? concernLabels.join(', ') : undefined;

  return {
    hair_type: quizLabel('q1', answers),
    main_concern,
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
Пользователь УЖЕ прошла тест. Эти факты известны из теста, не противоречь им и не
переспрашивай (они о привычках, которых на фото не видно):
- Тип волос (со слов): ${quizContext.hair_type || 'не указан'}
- Основная жалоба: ${quizContext.main_concern || 'не указано'}
- Частота мытья: ${quizContext.wash_frequency || 'не указано'}
- Термоукладка: ${quizContext.heat_styling || 'не указано'}
- Недавние процедуры: ${(quizContext.recent_treatments || []).join(', ') || 'нет'}

Твоя роль: ВИЗУАЛЬНО ДОПОЛНИТЬ тест тем, что видно по фото, но что человек о себе
обычно не знает (форма, пористость, толщина и её причина, дефициты, состояние длины).
Правило доверия: визуальные выводы (пористость, толщина, повреждение, форма) по фото,
привычки (мытьё, термоукладка) по тесту. Если самооценка типа волос в тесте расходится
с фото, по фото вернее.
` : `
Ответов теста нет, только фото. Будь немного осторожнее с выводами о привычках.
`;

  const systemPrompt = `Ты эксперт-трихолог из студии HAIRLAB в Мадриде, линейка Limba.
Анализируешь ФОТО волос и возвращаешь структурированный JSON по схеме. Твой анализ
дополняет тест: тест даёт привычки, ты визуальную картину и дефициты.

КАК СТАВИТЬ ОЦЕНКУ (логика мастера):
1. Форма (hair_form): прямые / волнистые / кудрявые. Кудрявые и волнистые суше прямых.
2. Толщина (apparent_density) и ПРИЧИНА (thickness_cause): тонкий волос с пушением и
   «ёлкой» это НЕ всегда повреждение. Часто это природная (генетическая) тонкость:
   у такого волоса меньше запас прочности, и пушение естественно. Ставь thickness_cause
   = genetic, если нет явных признаков повреждения (ломкости, сечения, пористости),
   = damage при явном истончении/обломе, = mixed если и то и другое.
3. Пористость (apparent_porosity): низкая/средняя/высокая. Высокая: сухость, пушение,
   приоткрытая кутикула. При средней пористости БЕЗ повреждений ставь over_moisture_risk
   = true: такие волосы легко перегрузить увлажнением (станут рыхлыми, потеряют плотность),
   им нужнее липиды и умеренное питание, а не глубокая влага.
4. Дефициты (deficits), основа подбора:
   - hydration: сухость, пористость, пушение.
   - lipids: волосы гладкие после укладки, но путаются, электризуются, тусклые
     (истончён липидный слой, уязвима кутикула), частая причина спутывания.
   - protein: ломкость, потеря упругости и плотности, повреждённая структура.
   Можно несколько одновременно. У осветлённых обычно есть и hydration, и lipids/protein.
5. Концы: если они разрушены необратимо (распадаются на отдельные волокна, прозрачная
   истончённая длина), ставь irreversible_ends = true. Это честно: уход не восстановит
   такие концы, их лучше постепенно срезать, а уход направить на защиту остальной длины.

ВЫБОР ЛИНИИ Limba (recommended_limba_category):
- color: окрашенные/осветлённые, потеря пигмента, тусклость.
- volume: тонкие, истончённые, ломкие (нужны прочность и упругость).
- hydration: сухость, пористость, пушение (частый случай).
- detox: только как намёк на жирность корней (это add-on для кожи головы, не главная линия).
secondary_limba_category: только при явной второй проблеме (напр. блонд + сильная сухость).

ТОН И ЯЗЫК:
- Поддерживающе, без запугивания и жёстких диагнозов. Про необратимые концы говори мягко
  и с решением («такие концы лучше постепенно срезать, остальную длину защитим уходом»).
- НЕ используй слова "лечение", "терапия", "диагноз", "алопеция" (только "уход", "анализ",
  "рекомендации"). При явных ранах/очагах облысения в summary посоветуй обратиться к врачу.
- ЗАПРЕЩЕНО длинное тире (—) в любом поле. Используй запятую, двоеточие, скобки, точку или
  обычный дефис (-).
- НЕ используй AI-обороты ("не только... но и", "погружаемся", "в эпоху").
- Грамотный русский, БЕЗ транслита ("фризз", "волюм") и калек ("тупость" вместо "тусклость").
  Естественно: пушистость, сухость, тусклость, ломкость, секущиеся кончики, жирность корней.
- summary: живой человеческий язык, как будто говоришь с подругой.
- self_care_priorities: осмысленные ДЕЙСТВИЯ (что делать и зачем), не свойства средств.
  Например: "Увлажняй длину маской 1-2 раза в неделю", "Наноси термозащиту перед феном",
  "Подрежь секущиеся кончики, чтобы остановить ломкость", "Не ложись спать с мокрыми волосами".

${contextBlock}`;

  try {
    const openai = getOpenAI();
    console.log('[analyzePhoto] Starting analysis with OpenAI...');
    const completion = await openai.chat.completions.parse({
      // gpt-4o (full) gives noticeably better visual reasoning than -mini, which
      // matters for porosity/thickness/lipid calls. detail:'low' keeps cost sane.
      model: 'gpt-4o',
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
      max_tokens: 1100
    });

    const result = completion.choices[0].message.parsed;
    if (!result) {
      console.error('[analyzePhoto] AI returned empty parsed result');
      return { error: 'AI вернул пустой ответ' };
    }

    console.log('[analyzePhoto] Analysis successful');
    return {
      result,
      usage: completion.usage
    };
  } catch (error: any) {
    console.error('[analyzePhoto] OpenAI error:', error);
    console.error('[analyzePhoto] Error details:', {
      message: error?.message,
      status: error?.status,
      code: error?.code,
      type: error?.type
    });

    // Provide more specific error messages based on error type
    if (error?.status === 429) {
      return { error: 'Превышен лимит запросов к AI. Попробуйте через минуту.' };
    }
    if (error?.status === 400) {
      return { error: 'Некорректное изображение. Попробуйте другое фото.' };
    }
    if (error?.code === 'invalid_image_format') {
      return { error: 'Неподдерживаемый формат изображения. Используйте JPG или PNG.' };
    }

    return { error: error.message || 'AI временно недоступен. Попробуйте позже.' };
  }
}

export function calcCost(usage: any): number {
  // gpt-4o pricing (USD per 1M tokens). The image is billed as input tokens.
  const inputCostPer1M = 2.5;
  const outputCostPer1M = 10.0;

  const inputTokens = usage?.prompt_tokens || 0;
  const outputTokens = usage?.completion_tokens || 0;

  return (
    (inputTokens / 1_000_000) * inputCostPer1M +
    (outputTokens / 1_000_000) * outputCostPer1M
  );
}
