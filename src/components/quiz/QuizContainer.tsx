'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { AnimatePresence } from 'framer-motion'
import { useQuizStore } from '@/stores/quiz-store'
import { quizQuestions } from '@/config/quiz-data'
import { QuizQuestion } from './QuizQuestion'
import { QuizProgress } from './QuizProgress'

export function QuizContainer() {
  const router = useRouter()
  const { currentStep, answers, setAnswer, nextStep, prevStep } = useQuizStore()
  const total = quizQuestions.length

  useEffect(() => {
    if (currentStep >= total) {
      router.push('/result')
    }
  }, [currentStep, total, router])

  if (currentStep >= total) return null

  const question = quizQuestions[currentStep]
  const selectedOptionId = answers[question.id] ?? null

  const handleSelect = (optionId: string) => {
    setAnswer(question.id, optionId)
    setTimeout(() => nextStep(), 350)
  }

  return (
    <div className="w-full max-w-lg mx-auto px-4">
      <div className="mb-8">
        <QuizProgress total={total} current={currentStep} />
        <p className="text-center text-sm text-[var(--color-text-muted)] mt-3">
          {currentStep + 1} из {total}
        </p>
      </div>

      {/* Fixed-height container prevents CLS during question transitions */}
      <div style={{ minHeight: '360px' }}>
        <AnimatePresence mode="wait">
          <QuizQuestion
            key={question.id}
            question={question}
            selectedOptionId={selectedOptionId}
            onSelect={handleSelect}
          />
        </AnimatePresence>
      </div>

      {currentStep > 0 && (
        <button
          type="button"
          onClick={prevStep}
          className="mt-6 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors"
        >
          ← Назад
        </button>
      )}
    </div>
  )
}
