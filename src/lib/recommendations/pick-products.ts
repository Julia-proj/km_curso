/**
 * Pure, deterministic recommendation helpers shared by the Supabase-backed
 * engine (engine.ts) and the static care page (/dashboard/care).
 *
 * No side effects, no I/O — easy to test and reuse.
 */

import type { LimbaCategory } from '@/config/limba-products'
import { getProductsByIds } from '@/config/limba-products'
import type { SavedDiagnosis, HairDeficits, Porosity } from '@/lib/progress'

export type QuizAnswers = Record<string, string>

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
  return washesDaily(answers) || oilyMentioned
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
  if (primary === 'hydration' && answers['q3'] === 'q3_c') {
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

  // Q3 — main concern
  switch (answers['q3']) {
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
// These two test questions sharpen the mask choice. Per Elena's rule: high
// porosity → hydrating (green), medium porosity / tangling → discipline
// (beige). We COMBINE the test with the AI photo read; the cautious side wins
// for over-moisture (if either says "medium / tangling", we play it safe).

/** Porosity picked in the picture question (q12), if answered. */
export function quizPorosity(a: QuizAnswers): Porosity | undefined {
  switch (a['q12']) {
    case 'q12_a': return 'low'
    case 'q12_b': return 'medium'
    case 'q12_c': return 'high'
    default: return undefined
  }
}

/** Hair feels thin by structure (q11_b). */
function quizSaysThin(a: QuizAnswers): boolean {
  return a['q11'] === 'q11_b'
}

/** Hair is curly by structure (q11_f). */
function quizSaysCurly(a: QuizAnswers): boolean {
  return a['q11'] === 'q11_f'
}

/**
 * Colored / bleached / toned hair → pink Color Prolonger pair.
 * (q1 окрашенные/осветлённые/блонд, or the AI line is color.)
 */
function isColoredHair(primary: PrimaryCategory, a: QuizAnswers, d: SavedDiagnosis): boolean {
  return (
    primary === 'color' ||
    d.recommendedCategory === 'color' ||
    a['q1'] === 'q1_b' ||
    a['q1'] === 'q1_c' ||
    a['q1'] === 'q1_d'
  )
}

/**
 * Porous / curly / dry / fluffy / strongly tangling hair → green Hydrating pair.
 * Combines the structure question (q11), the porosity photo (q12 = high), the
 * main concern (q3) and the AI photo read.
 */
function needsHydrationPair(a: QuizAnswers, d: SavedDiagnosis): boolean {
  return (
    a['q3'] === 'q3_a' || // сухость и пушистость
    a['q3'] === 'q3_c' || // путаются, плохо расчёсываются
    ['q11_a', 'q11_c', 'q11_d', 'q11_e'].includes(a['q11']) || // пушистые / сухие / запутываются
    quizSaysCurly(a) || // q11_f кудрявые, пористые
    quizPorosity(a) === 'high' ||
    d.porosity === 'high' ||
    d.hairForm === 'curly' ||
    Boolean(d.deficits?.hydration)
  )
}

/**
 * Resolve what the hair lacks. Prefers the AI's visual deficits; falls back to
 * quiz-derived guesses when the photo analysis is missing (older saved data).
 * The structure question (q11) and porosity photo (q12) reinforce the deficits.
 */
export function resolveDeficits(answers: QuizAnswers, d: SavedDiagnosis): HairDeficits {
  const base: HairDeficits = d.deficits ?? {
    hydration: answers['q3'] === 'q3_a' || d.recommendedCategory === 'hydration',
    protein: answers['q3'] === 'q3_b' || (d.damageLevel ?? 0) >= 3,
    lipids: answers['q3'] === 'q3_c' || answers['q3'] === 'q3_d',
  }
  return {
    hydration:
      base.hydration ||
      ['q11_a', 'q11_c', 'q11_f'].includes(answers['q11']) ||
      quizPorosity(answers) === 'high',
    protein: base.protein || quizSaysThin(answers),
    lipids: base.lipids || answers['q11'] === 'q11_d' || answers['q11'] === 'q11_e',
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
 * Masks in priority order. The FIRST is the recommended (главная) mask shown as
 * "твоя маска"; the rest are optional, offered softly for alternation.
 * Bucket mask (need-specific) leads in most cases; Rejuvenating (фиолетовая)
 * covers protein + lipids and is the usual second:
 *   1. Colored / bleached / toned       → главная розовая Color, then фиолетовая
 *   2. Porous / curly / dry / fluffy /  → главная зелёная Hydrating, then фиолетовая
 *      strongly tangling
 *   3. Everyone else                    → главная бежевая Discipline, then фиолетовая
 * On heavy damage (4-5/5 or destroyed ends) Rejuvenating becomes главная and the
 * peptide mask is added as extra strength.
 */
export function pickMasks(
  primary: PrimaryCategory,
  answers: QuizAnswers,
  d: SavedDiagnosis
): string[] {
  const deficits = resolveDeficits(answers, d)

  // Bucket mask (need-specific): green / pink / beige.
  let bucketMask: string
  if (isColoredHair(primary, answers, d)) {
    bucketMask = MASK.color
  } else if (needsHydrationPair(answers, d)) {
    bucketMask = MASK.hydrating
  } else {
    bucketMask = MASK.discipline
  }

  // Главная маска первой: обычно маска по корзине, но при сильном повреждении
  // ведущей становится восстанавливающая (фиолетовая Rejuvenating).
  const repairFirst = (d.damageLevel ?? 0) >= 4 || Boolean(d.irreversibleEnds)
  const masks = repairFirst
    ? [MASK.rejuvenating, bucketMask]
    : [bucketMask, MASK.rejuvenating]

  // Peptide as extra strength for heavier damage / destroyed ends / weak protein.
  if ((d.damageLevel ?? 0) >= 4 || d.irreversibleEnds || deficits.protein) {
    if (!masks.includes(MASK.peptide)) masks.push(MASK.peptide)
  }

  return [...new Set(masks)].slice(0, 3)
}

/** Conditioner by thickness first, then colour/porosity (Elena's rule). */
export function pickConditioner(primary: PrimaryCategory, d: SavedDiagnosis): string {
  if (d.density === 'thin' || d.thicknessCause === 'genetic') return 'limba-volume-conditioner' // Bodifying, не утяжеляет
  if (primary === 'color' || d.recommendedCategory === 'color') return 'limba-color-conditioner' // Intense Color
  if (d.porosity === 'high' || d.hairForm === 'curly') return 'limba-detox-conditioner' // Detangling, мягкость
  return 'limba-hydration-conditioner' // Nourishing
}

/** Leave-ins, thermal cream and finishing spray. */
export function pickLeaveIns(answers: QuizAnswers, d: SavedDiagnosis): string[] {
  const deficits = resolveDeficits(answers, d)
  const ids: string[] = []
  // Thermal cream before drying — when heat styling or noticeable damage.
  if (needsHeatProtection(answers, d.damageLevel ?? 0)) ids.push('limba-glaze-cream')
  // Mango nourishing leave-in — for dry / porous / curly lengths.
  if (deficits.hydration || d.porosity === 'high' || d.hairForm === 'curly') ids.push('limba-mango-cream')
  // Finishing spray — shine + length protection, useful in most cases.
  if (d.porosity !== 'low' || d.recommendedCategory === 'color' || (d.damageLevel ?? 0) >= 3) {
    ids.push('limba-golden-hour')
  }
  return [...new Set(ids)]
}

/** Human-readable wash-by-wash rotation, like Elena writes. */
export function buildSchedule(masks: string[], conditioner: string, d: SavedDiagnosis): string[] {
  const cond = shortName(conditioner)
  const condGap = d.density === 'thin' || d.thicknessCause === 'genetic' ? 'следующие 2 мытья' : 'следующее мытьё'
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

/** Behaviour / routine advice merged from quiz facts and AI visual flags. */
export function buildRegimen(answers: QuizAnswers, d: SavedDiagnosis): string[] {
  const tips: string[] = []
  if (usesHeatStyling(answers)) {
    tips.push('Сократи горячую укладку и всегда наноси термозащиту перед феном, утюжком и стайлером.')
  }
  if (answers['q5'] === 'q5_c') {
    tips.push('Не ложись спать с мокрыми волосами и не держи их долго в полотенце, мокрый волос уязвим.')
  }
  if (d.porosity === 'high') {
    tips.push('Метод Prep: за 10-15 минут до мытья нанеси кондиционер на длину, чтобы снизить потерю влаги.')
  }
  if (d.hairForm === 'curly' || d.hairForm === 'wavy') {
    tips.push('Кудрявый метод: формируй завиток на влажные волосы, суши диффузором на средней температуре, после высыхания не расчёсывай.')
  }
  if (d.thicknessCause === 'genetic' || d.density === 'thin') {
    tips.push('Бережно расчёсывай, не носи тугие резинки, меньше трения: тонкому волосу важнее защита, чем тяжёлое питание.')
  }
  if (d.irreversibleEnds) {
    tips.push('Повреждённые концы лучше постепенно срезать: уход не восстановит разрушенный волос, но защитит остальную длину.')
  }
  if ((d.damageLevel ?? 0) >= 4 || (d.deficits?.protein ?? false)) {
    tips.push('Раз в 3-4 недели делай профессиональное восстановление, особое внимание липидному этапу.')
  }
  return tips
}

export interface CarePlan {
  primary: PrimaryCategory
  secondary?: PrimaryCategory
  shampoo: string
  detox: boolean
  detoxIds: string[]
  /** Frequency advice for the green detox shampoo. */
  detoxAdvice: string
  masks: string[]
  /** The recommended (главная) mask — shown as «твоя маска». */
  primaryMask: string
  /** Optional masks for alternation, shown softly (not pushed). */
  optionalMasks: string[]
  conditioner: string
  leaveIns: string[]
  schedule: string[]
  regimen: string[]
  reasons: string[]
  /** Everything for the order/pack, de-duped and ordered. */
  productIds: string[]
}

/**
 * Build the full care plan from quiz answers + the saved AI diagnosis.
 * The line comes from the AI (falls back to quiz inference); masks come from
 * the visual deficits; conditioner from thickness; plus leave-ins and regimen.
 */
export function buildCarePlan(answers: QuizAnswers, d: SavedDiagnosis): CarePlan {
  const inferred = inferCategory(answers)
  const aiPrimary = d.recommendedCategory
  const aiSecondary = d.secondaryCategory

  const primary: PrimaryCategory =
    aiPrimary && aiPrimary !== 'detox' ? aiPrimary : inferred.primary
  const secondary: PrimaryCategory | undefined =
    aiSecondary && aiSecondary !== 'detox' && aiSecondary !== primary
      ? aiSecondary
      : inferred.secondary !== primary
        ? inferred.secondary
        : undefined

  const shampoo = `limba-${primary}-shampoo`
  // Green detox shampoo is recommended for (almost) everyone now; the scalp
  // peel stays an oily-scalp add-on.
  const oilyScalp = needsScalpDetox(answers, d.signs) || aiPrimary === 'detox' || aiSecondary === 'detox'
  const detoxIds = ['limba-detox-shampoo', ...(oilyScalp ? ['limba-scalp-peel'] : [])]
  const detox = true
  const detoxAdvice = detoxFrequencyAdvice(answers)

  const masks = pickMasks(primary, answers, d)
  const primaryMask = masks[0]
  const optionalMasks = masks.slice(1)
  const conditioner = pickConditioner(primary, d)
  const leaveIns = pickLeaveIns(answers, d)
  // Schedule is written around the recommended (главная) mask; the optional
  // masks are an upgrade for alternation, shown softly on the page.
  const schedule = buildSchedule([primaryMask], conditioner, d)
  const regimen = buildRegimen(answers, d)

  const reasons: string[] = []
  const deficits = resolveDeficits(answers, d)
  if (deficits.protein || deficits.lipids) {
    reasons.push('Волосам не хватает протеинов и липидов, добавили восстанавливающую маску, чтобы вернуть прочность и гладкость.')
  }
  if (deficits.hydration && !d.overMoistureRisk) {
    reasons.push('Есть сухость и пористость, нужна регулярная подпитка влагой.')
  }
  if (d.overMoistureRisk) {
    reasons.push('Волос средней пористости легко переувлажнить, поэтому упор на липиды и умеренное питание, а не на глубокое увлажнение.')
  }
  if (d.density === 'thin' || d.thicknessCause === 'genetic') {
    reasons.push('Тонкая структура: кондиционер и средства подобраны так, чтобы не утяжелять волос и сохранить объём.')
  }

  const productIds = [
    ...new Set([
      shampoo,
      conditioner,
      primaryMask,
      ...leaveIns,
      ...detoxIds,
    ]),
  ]

  return {
    primary,
    secondary,
    shampoo,
    detox,
    detoxIds,
    detoxAdvice,
    masks,
    primaryMask,
    optionalMasks,
    conditioner,
    leaveIns,
    schedule,
    regimen,
    reasons,
    productIds,
  }
}
