/**
 * Pure, deterministic recommendation helpers shared by the Supabase-backed
 * engine (engine.ts) and the static care page (/dashboard/care).
 *
 * No side effects, no I/O — easy to test and reuse.
 */

import type { LimbaCategory } from '@/config/limba-products'
import { getProductsByIds } from '@/config/limba-products'
import type { SavedDiagnosis, HairDeficits, Porosity } from '@/lib/progress'
import { quizQuestions } from '@/config/quiz-data'
import { getConcerns, asIds } from '@/lib/quiz-answers'

export type QuizAnswers = Record<string, string | string[]>

/** Universal heat-protection advice line — single source of truth. */
export const HEAT_PROTECTION_ADVICE =
  'Используй термозащиту перед каждой горячей укладкой (фен, утюжок, стайлер), это базовый шаг для всех типов волос.'

/** True when the quiz answers indicate blow-drying, flat iron or styler use. */
export function usesHeatStyling(answers: QuizAnswers): boolean {
  const iron = answers['q4'] // утюжок
  const dryer = answers['q5'] // фен
  const styler = answers['q6'] // брашинг/стайлер
  return (
    iron === 'q4_a' ||
    iron === 'q4_b' ||
    dryer === 'q5_b' ||
    styler === 'q6_a'
  )
}

/** True when the user washes hair daily (detox tendency). */
export function washesDaily(answers: QuizAnswers): boolean {
  return answers['q2'] === 'q2_a'
}

/** Thermo protection is recommended for heat styling or heavier damage. */
export function needsHeatProtection(answers: QuizAnswers, damageLevel: number): boolean {
  return usesHeatStyling(answers) || damageLevel >= 4
}

/**
 * Oily-scalp signal — the scalp PEEL is suggested on top of the green shampoo
 * when the user washes daily (oily-prone scalp) or signs mention oiliness.
 */
export function needsScalpDetox(answers: QuizAnswers, signs: string[] = []): boolean {
  const oilyMentioned = signs.some((s) => /жир|сальн|себум|корн/i.test(s))
  const oilyConcern = getConcerns(answers).includes('q3_f')
  return washesDaily(answers) || oilyMentioned || oilyConcern
}

/**
 * The green detox shampoo is recommended for (almost) everyone. Frequency
 * depends on how often the hair is washed: rare washers (раз в неделю) use it
 * once every 2-3 weeks, everyone else once a week.
 */
export function detoxFrequencyAdvice(answers: QuizAnswers): string {
  const rare = answers['q2'] === 'q2_d' // моет голову раз в неделю
  return rare
    ? 'Зелёный детокс-шампунь: раз в 2-3 недели, мягко очищает кожу головы (ты моешь голову редко).'
    : 'Зелёный детокс-шампунь: раз в неделю, очищает кожу головы от налёта и себума.'
}

/**
 * Resolve the mask for a category. Hydration splits into a hydrating mask
 * (default) vs a disciplining mask when the main concern is tangling.
 */
export function resolveMaskId(primary: LimbaCategory, answers: QuizAnswers): string {
  if (primary === 'hydration' && getConcerns(answers).includes('q3_c')) {
    return 'limba-discipline-mask'
  }
  return `limba-${primary}-mask`
}

/**
 * Ensure the heat-protection advice is present in a free-text recommendation
 * list when the user uses heat styling. Returns a new array (pure).
 */
export function ensureHeatProtectionAdvice(
  recommendations: string[],
  answers: QuizAnswers
): string[] {
  if (!usesHeatStyling(answers)) return recommendations
  const already = recommendations.some((r) => /термозащит/i.test(r))
  return already ? recommendations : [...recommendations, HEAT_PROTECTION_ADVICE]
}

/**
 * Infer the primary (and optional secondary) Limba line from quiz answers.
 * Detox is never primary — it's a scalp add-on (see needsScalpDetox).
 * Deterministic scoring; defaults to hydration (the most common need).
 */
type PrimaryCategory = Exclude<LimbaCategory, 'detox'>

export function inferCategory(answers: QuizAnswers): {
  primary: PrimaryCategory
  secondary?: PrimaryCategory
} {
  const score: Record<PrimaryCategory, number> = {
    color: 0,
    volume: 0,
    hydration: 0,
  }

  // Q1 — hair type
  switch (answers['q1']) {
    case 'q1_b': // окрашенные тон в тон
      score.color += 3
      break
    case 'q1_c': // осветлённые/мелированные
      score.color += 1
      score.hydration += 2
      break
    case 'q1_d': // сильный блонд
      score.color += 1
      score.hydration += 3
      break
  }

  // Q3 — main concern(s). Up to two are selected; weights add up so two
  // concerns naturally produce a primary + secondary line.
  for (const concern of getConcerns(answers)) {
    switch (concern) {
      case 'q3_a': // сухость и пушистость
        score.hydration += 3
        break
      case 'q3_b': // ломкость и потеря длины
        score.volume += 2
        score.hydration += 1
        break
      case 'q3_c': // путаются / плохо расчёсываются
        score.hydration += 2
        break
      case 'q3_d': // тусклость
        score.color += 1
        break
      case 'q3_e': // секущиеся кончики — лёгкая гидрация, защита длины
        score.hydration += 2
        break
      case 'q3_g': // тоньше / потеря объёма
        score.volume += 2
        break
      // q3_f (жирнятся) — это кожа головы, не волокно: детокс не primary,
      // обрабатывается в needsScalpDetox.
    }
  }

  const ordered = (Object.keys(score) as PrimaryCategory[]).sort(
    (a, b) => score[b] - score[a]
  )

  const primary: PrimaryCategory =
    score[ordered[0]] > 0 ? ordered[0] : 'hydration'
  const secondary =
    ordered[1] !== primary && score[ordered[1]] > 0 ? ordered[1] : undefined

  return { primary, secondary }
}

export interface ProductIdOptions {
  needsHeatProtection: boolean
  needsDetox: boolean
}

/**
 * Build the ordered list of product ids for a pack. Shared by engine + care.
 * Ids match the static catalog and the Supabase product ids.
 */
export function buildProductIds(
  primary: LimbaCategory,
  secondary: LimbaCategory | undefined,
  opts: ProductIdOptions
): string[] {
  const ids: string[] = [
    `limba-${primary}-shampoo`,
    `limba-${primary}-conditioner`,
    `limba-${primary}-mask`,
  ]

  if (secondary) ids.push(`limba-${secondary}-mask`)

  if (opts.needsHeatProtection) ids.push('limba-heat-protection')

  if (opts.needsDetox) {
    if (!ids.includes('limba-detox-shampoo')) ids.push('limba-detox-shampoo')
    ids.push('limba-scalp-peel')
  }

  // De-dupe while keeping order
  return [...new Set(ids)]
}

// ───────────────────────────────────────────────────────────────────────────
// Rich care plan (test + AI), modelled on Elena's reference diagnoses.
// See docs/elena-diagnosis-examples.md. Everything here is deterministic so it
// can be reviewed and adjusted without touching the AI prompt.
// ───────────────────────────────────────────────────────────────────────────

/** Short product name (без слова "Limba") for schedule/reason text. */
function shortName(id: string): string {
  const p = getProductsByIds([id])[0]
  if (!p) return id
  return p.name.replace(/^(Маска|Кондиционер|Шампунь|Крем-термозащита|Крем|Спрей-термозащита|Спрей-финиш|Пептидная маска)\s+Limba\s*/i, '').trim() || p.name
}

// ── Structure (q11) & porosity photo (q12) ─────────────────────────────────
// The whole product selection is TEST-driven (q1, q3, q4-6, q11, q12, score) so
// the same answers always give the same products, regardless of photo lighting.
// The AI photo (d) is used only for the "что показал AI" display and small
// advice add-ons (e.g. cutting destroyed ends), never to flip products.

/** Porosity picked in the picture question (q12), if answered. */
export function quizPorosity(a: QuizAnswers): Porosity | undefined {
  switch (a['q12']) {
    case 'q12_a': return 'low'
    case 'q12_b': return 'medium'
    case 'q12_c': return 'high'
    default: return undefined
  }
}

/** Hair feels thin by structure (q11_b) or the user names volume loss (q3_g). */
function quizSaysThin(a: QuizAnswers): boolean {
  return a['q11'] === 'q11_b' || getConcerns(a).includes('q3_g')
}

/** Hair is curly by structure (q11_f). */
function quizSaysCurly(a: QuizAnswers): boolean {
  return a['q11'] === 'q11_f'
}

/** Cumulative test score (same scale as the quiz store: >9 = high damage). */
function testScore(a: QuizAnswers): number {
  return quizQuestions.reduce((sum, q) => {
    const ids = asIds(a[q.id])
    if (ids.length === 0) return sum
    // Multi-select questions contribute the MAX selected score (same as the store).
    const scores = ids.map((id) => q.options.find((o) => o.id === id)?.score ?? 0)
    return sum + Math.max(...scores)
  }, 0)
}

/** Heavy damage inferred from the TEST only (stable, photo-independent). */
function testDamageHigh(a: QuizAnswers): boolean {
  return a['q1'] === 'q1_d' || getConcerns(a).includes('q3_b') || testScore(a) > 9
}

/**
 * Colored / bleached / toned hair → pink Color Prolonger. From the TEST (q1)
 * so photo lighting can never flip it.
 */
function isColoredHair(primary: PrimaryCategory, a: QuizAnswers): boolean {
  return (
    primary === 'color' ||
    a['q1'] === 'q1_b' ||
    a['q1'] === 'q1_c' ||
    a['q1'] === 'q1_d'
  )
}

/**
 * Porous / curly / dry / fluffy / strongly tangling hair → green Hydrating.
 * Fully test-driven (q3 concern, q11 structure, q12 porosity photo).
 */
function needsHydrationPair(a: QuizAnswers): boolean {
  const concerns = getConcerns(a)
  return (
    concerns.includes('q3_a') || // сухость и пушистость
    concerns.includes('q3_c') || // путаются, плохо расчёсываются
    concerns.includes('q3_e') || // секущиеся кончики — увлажнение и защита длины
    ['q11_a', 'q11_c', 'q11_d', 'q11_e'].includes(a['q11'] as string) || // пушистые / сухие / запутываются
    quizSaysCurly(a) || // q11_f кудрявые, пористые
    quizPorosity(a) === 'high'
  )
}

/**
 * What the hair lacks — TEST-driven for stability. The AI photo deficits are
 * shown separately in the "что показал AI" block but do NOT drive products.
 */
export function resolveDeficits(answers: QuizAnswers): HairDeficits {
  const concerns = getConcerns(answers)
  return {
    hydration:
      concerns.includes('q3_a') ||
      ['q11_a', 'q11_c', 'q11_f'].includes(answers['q11'] as string) ||
      quizPorosity(answers) === 'high',
    protein:
      concerns.includes('q3_b') ||
      concerns.includes('q3_g') ||
      quizSaysThin(answers) ||
      testDamageHigh(answers),
    lipids:
      concerns.includes('q3_c') ||
      concerns.includes('q3_d') ||
      concerns.includes('q3_e') ||
      answers['q11'] === 'q11_d' ||
      answers['q11'] === 'q11_e',
  }
}

const MASK = {
  color: 'limba-color-mask',        // Color Prolonger (розовая) — поддержка цвета
  rejuvenating: 'limba-volume-mask', // Rejuvenating (фиолетовая) — протеины + липиды
  hydrating: 'limba-hydration-mask', // Antioxidant Hydrating (зелёная) — влага
  discipline: 'limba-discipline-mask', // Discipline (бежевая) — дисциплина, средняя пористость
  peptide: 'limba-peptide-mask',    // Instant Transformation — прочность / несмывашка
} as const

/**
 * The two rotation masks in priority order: [главная, дополнительная].
 * Bucket mask (need-specific) leads in most cases; Rejuvenating (фиолетовая)
 * covers protein + lipids and is the usual second. On heavy damage (from the
 * TEST) Rejuvenating becomes главная. Peptide is handled separately in
 * buildCarePlan (conditional, not part of this pair).
 *   1. Colored / bleached / toned     → главная Color, доп Rejuvenating
 *   2. Porous / curly / dry / tangling → главная Hydrating, доп Rejuvenating
 *   3. Everyone else                   → главная Discipline, доп Rejuvenating
 */
export function pickMasks(primary: PrimaryCategory, answers: QuizAnswers): string[] {
  let bucketMask: string
  if (isColoredHair(primary, answers)) {
    bucketMask = MASK.color
  } else if (needsHydrationPair(answers)) {
    bucketMask = MASK.hydrating
  } else {
    bucketMask = MASK.discipline
  }

  const repairFirst = testDamageHigh(answers)
  const masks = repairFirst
    ? [MASK.rejuvenating, bucketMask]
    : [bucketMask, MASK.rejuvenating]
  return [...new Set(masks)]
}

/** Conditioner by thickness first, then colour/porosity (test-driven). */
export function pickConditioner(primary: PrimaryCategory, answers: QuizAnswers): string {
  if (quizSaysThin(answers)) return 'limba-volume-conditioner' // Bodifying, не утяжеляет
  if (primary === 'color' || isColoredHair(primary, answers)) return 'limba-color-conditioner' // Intense Color
  if (quizPorosity(answers) === 'high' || quizSaysCurly(answers)) return 'limba-detox-conditioner' // Detangling
  return 'limba-hydration-conditioner' // Nourishing
}

/**
 * Single thermal protection (system picks, no human choice from three):
 *   dry / porous / curly / tangling → Mango cream (rich, влага, анти-пушение)
 *   else active heat styling        → Glaze cream (крем-термозащита перед сушкой)
 *   else                            → Protein spray (универсальный: тепло + UV + распутывание)
 * The chosen product goes into the core set ("Твой набор").
 */
export function pickThermalProtection(answers: QuizAnswers): string {
  if (needsHydrationPair(answers)) return 'limba-mango-cream'
  if (usesHeatStyling(answers)) return 'limba-glaze-cream'
  return 'limba-heat-protection'
}

/** Human-readable wash-by-wash rotation, like Elena writes. */
export function buildSchedule(masks: string[], conditioner: string, answers: QuizAnswers): string[] {
  const cond = shortName(conditioner)
  const condGap = quizSaysThin(answers) ? 'следующие 2 мытья' : 'следующее мытьё'
  if (masks.length === 0) return []
  if (masks.length === 1) {
    return [
      `${shortName(masks[0])}: 1-2 раза в неделю, выдержка 20-30 минут.`,
      `${cond}: в остальные мытья головы.`,
    ]
  }
  // Two (or more) masks in rotation, conditioner in between.
  const a = shortName(masks[0])
  const b = shortName(masks[1])
  const steps = [
    `1 мытьё: ${a} (20-30 минут).`,
    `${condGap}: ${cond}.`,
    `Затем ${b} (20-30 минут).`,
    `${condGap}: ${cond}.`,
    `Дальше снова ${a}, и по кругу.`,
  ]
  if (masks[2]) {
    steps.push(`Дополнительно ${shortName(masks[2])}, как уход на влажные волосы для прочности.`)
  }
  return steps
}

/** Behaviour / routine advice — test-driven, with one AI add-on for ends. */
export function buildRegimen(answers: QuizAnswers, d: SavedDiagnosis): string[] {
  const tips: string[] = []
  if (usesHeatStyling(answers)) {
    tips.push('Сократи горячую укладку и всегда наноси термозащиту перед феном, утюжком и стайлером.')
  }
  if (answers['q5'] === 'q5_c') {
    tips.push('Не ложись спать с мокрыми волосами и не держи их долго в полотенце, мокрый волос уязвим.')
  }
  if (quizPorosity(answers) === 'high') {
    tips.push('Метод Prep: за 10-15 минут до мытья нанеси кондиционер на длину, чтобы снизить потерю влаги.')
  }
  if (quizSaysCurly(answers)) {
    tips.push('Кудрявый метод: формируй завиток на влажные волосы, суши диффузором на средней температуре, после высыхания не расчёсывай.')
  }
  if (quizSaysThin(answers)) {
    tips.push('Бережно расчёсывай, не носи тугие резинки, меньше трения: тонкому волосу важнее защита, чем тяжёлое питание.')
  }
  if (d.irreversibleEnds) {
    tips.push('Повреждённые концы лучше постепенно срезать: уход не восстановит разрушенный волос, но защитит остальную длину.')
  }
  if (testDamageHigh(answers)) {
    tips.push('Раз в 3-4 недели делай профессиональное восстановление, особое внимание липидному этапу.')
  }
  return tips
}

export interface CarePlan {
  primary: PrimaryCategory
  secondary?: PrimaryCategory
  shampoo: string
  conditioner: string
  /** The recommended (главная) mask — shown as «твоя маска». */
  primaryMask: string
  /** Single thermal protection (spray/glaze/mango) — part of the core set. */
  thermalProtection: string
  /** Optional second mask for alternation (one), shown softly. */
  additionalMask?: string
  /** Peptide treatment, only on heavier damage. */
  peptideMask?: string
  /** Finishing spray (Golden Hour), only for active heat styling. */
  finish?: string
  detox: boolean
  detoxIds: string[]
  /** Frequency advice for the green detox shampoo. */
  detoxAdvice: string
  schedule: string[]
  regimen: string[]
  reasons: string[]
  /** Core set ids (shampoo, conditioner, главная mask, thermo), de-duped. */
  productIds: string[]
}

/**
 * Build the full care plan. Core products are TEST-driven for stability: the
 * same quiz answers always give the same set, regardless of photo lighting.
 * The AI diagnosis (d) is used only for the "что показал AI" display block and
 * small advice add-ons (peptide / cutting destroyed ends), never to flip the
 * core line, masks, conditioner or thermal protection.
 */
export function buildCarePlan(answers: QuizAnswers, d: SavedDiagnosis): CarePlan {
  const inferred = inferCategory(answers)
  const primary = inferred.primary
  const secondary =
    inferred.secondary && inferred.secondary !== primary ? inferred.secondary : undefined

  const shampoo = `limba-${primary}-shampoo`
  const conditioner = pickConditioner(primary, answers)

  // Masks: [главная, дополнительная]; peptide is a separate conditional treatment.
  const masks = pickMasks(primary, answers)
  const primaryMask = masks[0]
  const additionalMask = masks[1]

  const deficits = resolveDeficits(answers)
  const peptideMask =
    testDamageHigh(answers) || d.irreversibleEnds || deficits.protein
      ? 'limba-peptide-mask'
      : undefined

  // One thermal protection in the core set; Golden Hour finish only for heat styling.
  const thermalProtection = pickThermalProtection(answers)
  const finish = usesHeatStyling(answers) ? 'limba-golden-hour' : undefined

  // Green detox shampoo for everyone; peel for frequent (daily) washing or an
  // explicit oiliness concern (q3_f).
  const oilyScalp = washesDaily(answers) || getConcerns(answers).includes('q3_f')
  const detoxIds = ['limba-detox-shampoo', ...(oilyScalp ? ['limba-scalp-peel'] : [])]
  const detox = true
  const detoxAdvice = detoxFrequencyAdvice(answers)

  const schedule = buildSchedule([primaryMask], conditioner, answers)
  const regimen = buildRegimen(answers, d)

  const reasons: string[] = []
  const overMoist = quizPorosity(answers) === 'medium' || answers['q11'] === 'q11_d'
  if (deficits.protein || deficits.lipids) {
    reasons.push('Волосам не хватает протеинов и липидов, добавили восстанавливающую маску, чтобы вернуть прочность и гладкость.')
  }
  if (deficits.hydration && !overMoist) {
    reasons.push('Есть сухость и пористость, нужна регулярная подпитка влагой.')
  }
  if (overMoist) {
    reasons.push('Средняя пористость легко переувлажнить, поэтому упор на липиды и умеренное питание, а не на глубокое увлажнение.')
  }
  if (quizSaysThin(answers)) {
    reasons.push('Тонкая структура: кондиционер и средства подобраны так, чтобы не утяжелять волос и сохранить объём.')
  }

  const productIds = [
    ...new Set([shampoo, conditioner, primaryMask, thermalProtection]),
  ]

  return {
    primary,
    secondary,
    shampoo,
    conditioner,
    primaryMask,
    thermalProtection,
    additionalMask,
    peptideMask,
    finish,
    detox,
    detoxIds,
    detoxAdvice,
    schedule,
    regimen,
    reasons,
    productIds,
  }
}
