/**
 * Single source of truth for funnel progress stored in localStorage.
 * Keeps string keys in one place so screens don't hardcode them.
 */

export type LimbaCategory = 'color' | 'volume' | 'detox' | 'hydration'

export type HairForm = 'straight' | 'wavy' | 'curly' | 'unknown'
export type Porosity = 'low' | 'medium' | 'high' | 'unknown'
export type Density = 'thin' | 'medium' | 'thick' | 'unknown'
export type ThicknessCause = 'genetic' | 'damage' | 'mixed' | 'unknown'

export interface HairDeficits {
  hydration: boolean
  lipids: boolean
  protein: boolean
}

export interface SavedDiagnosis {
  damageLevel: number
  signs: string[]
  recommendations: string[]
  summary: string
  /** Limba line the AI recommends from the photo + quiz (care page uses it). */
  recommendedCategory?: LimbaCategory | null
  secondaryCategory?: LimbaCategory | null
  /** Visual assessment from the photo — drives the care plan together with the quiz. */
  hairForm?: HairForm
  porosity?: Porosity
  density?: Density
  thicknessCause?: ThicknessCause
  deficits?: HairDeficits
  overMoistureRisk?: boolean
  irreversibleEnds?: boolean
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
