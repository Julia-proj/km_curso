export interface QuizOption {
  id: string
  label: string
  score: number
}

export interface QuizQuestion {
  id: string
  question: string
  options: QuizOption[]
}

export type DamageLevel = 'low' | 'medium' | 'high'
