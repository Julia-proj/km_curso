/**
 * Pure, deterministic recommendation helpers shared by the Supabase-backed
 * engine (engine.ts) and the static care page (/dashboard/care).
 *
 * No side effects, no I/O — easy to test and reuse.
 */

import type { LimbaCategory } from '@/config/limba-products'

export type QuizAnswers = Record<string, string>

/** Universal heat-protection advice line — single source of truth. */
export const HEAT_PROTECTION_ADVICE =
  'Используй термозащиту перед каждой горячей укладкой (фен, утюжок, стайлер) — это базовый шаг для всех типов волос.'

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
 * Scalp detox (green shampoo + peel) is an ADD-ON to the main set, suggested
 * when the user washes daily (oily-prone scalp) or signs mention oiliness.
 */
export function needsScalpDetox(answers: QuizAnswers, signs: string[] = []): boolean {
  const oilyMentioned = signs.some((s) => /жир|сальн|себум|корн/i.test(s))
  return washesDaily(answers) || oilyMentioned
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
