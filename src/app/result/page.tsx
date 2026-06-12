'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { PrePaymentNav } from '@/components/Navigation'
import { useQuizStore } from '@/stores/quiz-store'
import { quizQuestions } from '@/config/quiz-data'
import { hasDiagnosis } from '@/lib/progress'

function getFeedback(questionId: string, optionId: string): string {
  const question = quizQuestions.find((q) => q.id === questionId)
  if (!question) return ''
  const option = question.options.find((o) => o.id === optionId)
  return option?.feedback ?? ''
}

function getOptionLabel(questionId: string, optionId: string): string {
  const question = quizQuestions.find((q) => q.id === questionId)
  if (!question) return ''
  const option = question.options.find((o) => o.id === optionId)
  return option?.label ?? ''
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

  // Detect an existing AI diagnosis after mount (localStorage is client-only).
  const [aiDone, setAiDone] = useState(false)
  useEffect(() => {
    setAiDone(hasDiagnosis())
  }, [])

  useEffect(() => {
    if (!hasAnswers) {
      router.replace('/quiz')
    }
  }, [hasAnswers, router])

  if (!hasAnswers) return null

  const nextHref = '/offer'
  const nextLabel = 'Выбрать тариф'

  return (
    <main
      className="min-h-screen flex flex-col items-center justify-center px-4 py-16"
      style={{ background: "var(--color-cream)" }}
    >
      <div className="w-full max-w-lg">
        <PrePaymentNav showBack={true} />
        <div className="pt-4">
        <p
          className="text-center mb-3"
          style={{
            fontSize: "0.6875rem",
            fontWeight: 500,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "var(--color-bronze)",
          }}
        >
          KM · Результат опроса
        </p>

        <h1
          className="text-center text-balance mb-10"
          style={{
            fontFamily: "var(--font-fraunces), Georgia, serif",
            fontSize: "clamp(1.75rem, 5vw, 2.5rem)",
            fontWeight: 300,
            lineHeight: 1.1,
            letterSpacing: "-0.02em",
            color: "var(--color-ink)",
          }}
        >
          Твой персональный анализ
        </h1>

        <div className="flex flex-col gap-4 mb-10">
          {INSIGHT_QUESTIONS.map(({ id, label }) => {
            const optionId = answers[id]
            if (!optionId) return null
            const feedback = getFeedback(id, optionId)
            if (!feedback) return null
            const answerLabel = getOptionLabel(id, optionId)
            return (
              <div
                key={id}
                style={{
                  border: "1px solid var(--color-line)",
                  borderRadius: "2px",
                  padding: "1.25rem 1.5rem",
                  background: "var(--color-paper)",
                }}
              >
                <p
                  style={{
                    fontSize: "0.6875rem",
                    fontWeight: 500,
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                    color: "var(--color-bronze)",
                    marginBottom: "0.4rem",
                  }}
                >
                  {label}
                </p>
                {answerLabel && (
                  <p
                    style={{
                      fontFamily: "var(--font-body-face), Inter, sans-serif",
                      fontSize: "1rem",
                      fontWeight: 600,
                      lineHeight: 1.3,
                      color: "var(--color-ink)",
                      marginBottom: "0.6rem",
                    }}
                  >
                    {answerLabel}
                  </p>
                )}
                <p
                  style={{
                    fontFamily: "var(--font-body-face), Inter, sans-serif",
                    fontSize: "0.875rem",
                    lineHeight: 1.6,
                    color: "var(--color-ink-soft)",
                  }}
                >
                  {feedback}
                </p>
              </div>
            )
          })}
        </div>

        <div
          className="mb-8 text-center"
          style={{
            border: "1px solid var(--color-line)",
            borderRadius: "2px",
            padding: "1.5rem",
            background: "var(--color-paper)",
          }}
        >
          <p
            style={{
              fontFamily: "var(--font-body-face), Inter, sans-serif",
              fontSize: "0.875rem",
              lineHeight: 1.6,
              color: "var(--color-ink)",
            }}
          >
            Следующий шаг — посмотри бесплатный урок в подарок. А после выбора тарифа
            в личном кабинете тебя ждёт AI-анализ по фото волос и персональный подбор ухода.
          </p>
        </div>

        <div className="flex flex-col items-center gap-4">
          <Link
            href="/lesson"
            className="inline-block text-center"
            style={{
              background: "var(--color-accent)",
              padding: "1rem 2rem",
              fontSize: "0.875rem",
              fontWeight: 600,
              letterSpacing: "0.11em",
              textTransform: "uppercase",
              color: "white",
              borderRadius: "2px",
              transition: "background-color 0.2s",
            }}
          >
            Смотреть бесплатный урок
          </Link>

          <Link
            href={nextHref}
            className="inline-block text-center text-sm transition-colors px-6 py-3"
            style={{
              color: "var(--color-ink)",
              border: "1px solid var(--color-ink)",
              borderRadius: "2px",
              fontWeight: 600,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            {nextLabel}
          </Link>

          <button
            onClick={() => {
              useQuizStore.getState().reset()
              router.push('/quiz')
            }}
            className="inline-block text-sm transition-colors px-4 py-2"
            style={{
              color: "var(--color-ink-soft)",
              border: "1px solid var(--color-line)",
              borderRadius: "2px"
            }}
          >
            ← Пройти тест заново
          </button>
        </div>
        </div>
      </div>
    </main>
  )
}
