import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { quizQuestions } from '@/config/quiz-data'
import type { DamageLevel } from '@/types/quiz'
import { asIds, type AnswerValue } from '@/lib/quiz-answers'

interface QuizStore {
  currentStep: number
  /** questionId -> selected optionId(s). Multi-select questions store an array. */
  answers: Record<string, AnswerValue>
  setAnswer: (questionId: string, value: AnswerValue) => void
  nextStep: () => void
  prevStep: () => void
  getScore: () => number
  getDamageLevel: () => DamageLevel
  /** Quiz counts as completed once every question has an answer. */
  isCompleted: () => boolean
  reset: () => void
}

export const useQuizStore = create<QuizStore>()(
  persist(
    (set, get) => ({
      currentStep: 0,
      answers: {},

      setAnswer: (questionId, value) =>
        set((state) => ({
          answers: { ...state.answers, [questionId]: value },
        })),

      nextStep: () => set((state) => ({ currentStep: state.currentStep + 1 })),

      prevStep: () =>
        set((state) => ({ currentStep: Math.max(0, state.currentStep - 1) })),

      getScore: () => {
        const { answers } = get()
        return quizQuestions.reduce((total, question) => {
          const ids = asIds(answers[question.id])
          if (ids.length === 0) return total
          // Multi-select questions contribute the MAX of the selected options
          // (the most severe concern) so two picks never inflate the scale.
          const scores = ids.map(
            (id) => question.options.find((o) => o.id === id)?.score ?? 0
          )
          return total + Math.max(...scores)
        }, 0)
      },

      getDamageLevel: (): DamageLevel => {
        const score = get().getScore()
        if (score <= 4) return 'low'
        if (score <= 9) return 'medium'
        return 'high'
      },

      isCompleted: () => {
        const { answers } = get()
        return quizQuestions.every((q) => asIds(answers[q.id]).length > 0)
      },

      reset: () => set({ currentStep: 0, answers: {} }),
    }),
    {
      name: 'km-quiz',
      partialize: (state) => ({ currentStep: state.currentStep, answers: state.answers }),
    }
  )
)
