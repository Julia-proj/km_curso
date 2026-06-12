import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { quizQuestions } from '@/config/quiz-data'
import type { DamageLevel } from '@/types/quiz'

interface QuizStore {
  currentStep: number
  /** questionId -> selected optionId */
  answers: Record<string, string>
  setAnswer: (questionId: string, optionId: string) => void
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

      setAnswer: (questionId, optionId) =>
        set((state) => ({
          answers: { ...state.answers, [questionId]: optionId },
        })),

      nextStep: () => set((state) => ({ currentStep: state.currentStep + 1 })),

      prevStep: () =>
        set((state) => ({ currentStep: Math.max(0, state.currentStep - 1) })),

      getScore: () => {
        const { answers } = get()
        return quizQuestions.reduce((total, question) => {
          const selectedOptionId = answers[question.id]
          if (!selectedOptionId) return total
          const option = question.options.find((o) => o.id === selectedOptionId)
          return total + (option?.score ?? 0)
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
        return quizQuestions.every((q) => Boolean(answers[q.id]))
      },

      reset: () => set({ currentStep: 0, answers: {} }),
    }),
    {
      name: 'km-quiz',
      partialize: (state) => ({ currentStep: state.currentStep, answers: state.answers }),
    }
  )
)
