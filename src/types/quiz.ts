export interface QuizOption {
  id: string
  label: string
  score: number
  feedback: string
  /** Optional illustration (e.g. porosity examples). When set, the option
   *  renders as an image card instead of a text row. */
  image?: string
}

export interface QuizQuestion {
  id: string
  question: string
  options: QuizOption[]
  /** Max number of options the user may pick. Defaults to 1 (single-select).
   *  When > 1 the question is multi-select and the answer is stored as an array. */
  maxSelect?: number
}

export type DamageLevel = 'low' | 'medium' | 'high'
