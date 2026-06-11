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
    <div className="w-full max-w-lg mx-auto px-4 sm:px-6">
      <div className="mb-8">
        <QuizProgress total={total} current={currentStep} />
        <p className="text-center text-sm text-[#666] mt-3">
          {currentStep + 1} из {total}
        </p>
      </div>

      {/* Fixed-height container prevents CLS during question transitions */}
      <div style={{ minHeight: '480px' }} className="min-h-[400px] sm:min-h-[480px]">
        <AnimatePresence mode="wait">
          <QuizQuestion
            key={question.id}
            question={question}
            selectedOptionId={selectedOptionId}
            onSelect={handleSelect}
          />
        </AnimatePresence>
      </div>

      <div className="flex justify-between items-center mt-8">
        {currentStep > 0 && (
          <button
            type="button"
            onClick={prevStep}
            className="text-sm font-medium text-[#666] hover:text-[#1A1A1A] transition-colors flex items-center gap-2"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 18l-6-6 6-6" />
            </svg>
            Назад
          </button>
        )}
        {currentStep > 0 && <div />} {/* Spacer for centering when back button is shown */}
      </div>
    </div>
  )
}
