'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { AnimatePresence } from 'framer-motion'
import { useQuizStore } from '@/stores/quiz-store'
import { quizQuestions } from '@/config/quiz-data'
import { asIds } from '@/lib/quiz-answers'
import { QuizQuestion } from './QuizQuestion'
import { QuizProgress } from './QuizProgress'

export function QuizContainer() {
  const router = useRouter()
  const { currentStep, answers, setAnswer, nextStep, prevStep } = useQuizStore()
  const total = quizQuestions.length

  useEffect(() => {
    if (currentStep >= total) {
      // The quiz is shared by the marketing funnel (→ /result) and the
      // dashboard funnel, which passes ?next=/dashboard/... to return there
      // after the test. Only internal paths are honoured (no open redirects).
      const next = new URLSearchParams(window.location.search).get('next')
      const dest = next && next.startsWith('/') ? next : '/result'
      router.push(dest)
    }
  }, [currentStep, total, router])

  if (currentStep >= total) return null

  const question = quizQuestions[currentStep]
  const maxSelect = question.maxSelect ?? 1
  const isMulti = maxSelect > 1
  const selectedIds = asIds(answers[question.id])

  const handleSelect = (optionId: string) => {
    if (isMulti) {
      // Toggle within the array, capped at maxSelect. No auto-advance — the
      // user confirms with the "Продолжить" button below.
      const next = selectedIds.includes(optionId)
        ? selectedIds.filter((id) => id !== optionId)
        : selectedIds.length < maxSelect
          ? [...selectedIds, optionId]
          : selectedIds
      setAnswer(question.id, next)
      return
    }
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
            selectedIds={selectedIds}
            maxSelect={maxSelect}
            onSelect={handleSelect}
          />
        </AnimatePresence>
      </div>

      <div className="flex justify-between items-center mt-8">
        {currentStep > 0 ? (
          <button
            type="button"
            onClick={prevStep}
            className="text-sm font-semibold transition-colors flex items-center gap-2 px-4 py-2 rounded-sm"
            style={{
              color: "var(--color-ink-soft)",
              border: "1px solid var(--color-line)",
              background: "var(--color-paper)"
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 18l-6-6 6-6" />
            </svg>
            Назад
          </button>
        ) : (
          <span />
        )}
        {isMulti ? (
          <button
            type="button"
            onClick={() => nextStep()}
            disabled={selectedIds.length === 0}
            className="text-sm font-semibold transition-colors flex items-center gap-2 px-5 py-2 rounded-sm disabled:opacity-40 disabled:cursor-not-allowed"
            style={{
              color: "var(--color-paper)",
              background: "var(--color-ink)",
            }}
          >
            Продолжить
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        ) : (
          <span />
        )}
      </div>
    </div>
  )
}
