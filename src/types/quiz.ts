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
}

export type DamageLevel = 'low' | 'medium' | 'high'
