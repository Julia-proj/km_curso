/**
 * Single source of truth for funnel progress stored in localStorage.
 * Keeps string keys in one place so screens don't hardcode them.
 */

export interface SavedDiagnosis {
  damageLevel: number
  signs: string[]
  recommendations: string[]
  summary: string
  savedAt: string
}

const AI_DIAGNOSIS_KEY = 'km-ai-diagnosis'
export const SESSION_KEY = 'session'

function isBrowser(): boolean {
  return typeof window !== 'undefined'
}

export function saveDiagnosis(diagnosis: Omit<SavedDiagnosis, 'savedAt'>): void {
  if (!isBrowser()) return
  const payload: SavedDiagnosis = { ...diagnosis, savedAt: new Date().toISOString() }
  try {
    window.localStorage.setItem(AI_DIAGNOSIS_KEY, JSON.stringify(payload))
  } catch {
    // storage full / disabled — non-fatal, funnel still works in-session
  }
}

export function getDiagnosis(): SavedDiagnosis | null {
  if (!isBrowser()) return null
  try {
    const raw = window.localStorage.getItem(AI_DIAGNOSIS_KEY)
    return raw ? (JSON.parse(raw) as SavedDiagnosis) : null
  } catch {
    return null
  }
}

export function hasDiagnosis(): boolean {
  return getDiagnosis() !== null
}

export function clearDiagnosis(): void {
  if (!isBrowser()) return
  try {
    window.localStorage.removeItem(AI_DIAGNOSIS_KEY)
  } catch {
    // non-fatal
  }
}
