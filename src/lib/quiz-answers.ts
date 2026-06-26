/**
 * Quiz answers can be single-select (string) or multi-select (string[]).
 * These helpers normalise access so the recommendation engine, store and AI
 * context all read answers the same way, regardless of how they were stored.
 */

export type AnswerValue = string | string[]
export type AnswerMap = Record<string, AnswerValue>

/** Normalise an answer value to a flat list of option ids. */
export function asIds(value: AnswerValue | undefined | null): string[] {
  if (value == null) return []
  return Array.isArray(value) ? value : [value]
}

/** Selected concern option ids for q3 (0, 1 or 2 of them). */
export function getConcerns(answers: AnswerMap): string[] {
  return asIds(answers['q3'])
}
