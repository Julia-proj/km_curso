'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useQuizStore } from '@/stores/quiz-store'
import { quizQuestions } from '@/config/quiz-data'
import { BackButton } from '@/components/BackButton'

function getFeedback(questionId: string, optionId: string): string {
  const question = quizQuestions.find((q) => q.id === questionId)
  if (!question) return ''
  const option = question.options.find((o) => o.id === optionId)
  return option?.feedback ?? ''
}

const INSIGHT_QUESTIONS = [
  { id: 'q1', label: 'Тип волос' },
  { id: 'q3', label: 'Основная проблема' },
  { id: 'q9', label: 'Опыт восстановления' },
]

export default function ResultPage() {
  const router = useRouter()
  const { answers } = useQuizStore()
  const hasAnswers = Object.keys(answers).length > 0

  useEffect(() => {
    if (!hasAnswers) {
      router.replace('/quiz')
    }
  }, [hasAnswers, router])

  if (!hasAnswers) return null

  return (
    <main className="min-h-screen bg-[var(--color-bg)] flex flex-col items-center justify-center px-4 py-16">
      <div className="w-full max-w-lg">
        <BackButton />
        <p className="text-[11px] font-medium tracking-[3px] uppercase text-[var(--color-text-muted)] mb-3 text-center">
          KM · Результат опроса
        </p>

        <h1 className="font-display text-2xl md:text-3xl font-medium text-[var(--color-text)] mb-10 text-center text-balance">
          Твой персональный анализ
        </h1>

        <div className="flex flex-col gap-4 mb-10">
          {INSIGHT_QUESTIONS.map(({ id, label }) => {
            const optionId = answers[id]
            if (!optionId) return null
            const feedback = getFeedback(id, optionId)
            if (!feedback) return null
            return (
              <div
                key={id}
                className="border border-[var(--color-border)] rounded-[var(--radius-lg)] px-6 py-5 bg-[var(--color-card)]"
              >
                <p className="text-[10px] font-medium tracking-[2px] uppercase text-[var(--color-text-muted)] mb-2">
                  {label}
                </p>
                <p className="text-sm text-[var(--color-text)] leading-relaxed">
                  {feedback}
                </p>
              </div>
            )
          })}
        </div>

        <div className="bg-[var(--color-accent-soft)] border border-[var(--color-border)] rounded-[var(--radius-lg)] px-6 py-6 mb-8 text-center">
          <p className="text-sm text-[var(--color-text)] leading-relaxed">
            Посмотри бесплатный урок, где я подробно разобрала, что именно поможет
            тебе восстановить волосы в домашних условиях и получить реальный результат.
          </p>
        </div>

        <div className="text-center">
          <Link
            href="/lesson"
            className="inline-block bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white font-medium px-8 py-4 rounded-[var(--radius-full)] transition-colors text-sm"
          >
            Посмотреть бесплатный урок
          </Link>
        </div>
      </div>
    </main>
  )
}
