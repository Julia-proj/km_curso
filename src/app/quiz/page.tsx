import type { Metadata } from 'next'
import Link from 'next/link'
import { QuizContainer } from '@/components/quiz/QuizContainer'

export const metadata: Metadata = {
  title: 'Диагностика волос - HAIRLAB',
  description: '4 вопроса. Меньше минуты. Получи первую картину состояния своих волос.',
}

export default function QuizPage() {
  return (
    <main className="min-h-screen bg-[var(--color-bg)] flex flex-col items-center justify-center px-4 py-16">
      <Link
        href="/"
        className="absolute top-6 left-6 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors"
      >
        ← На главную
      </Link>
      <div className="w-full max-w-lg text-center mb-10">
        <span className="font-display text-base font-medium text-[var(--color-accent)] tracking-wide">
          HAIRLAB
        </span>
        <h1 className="font-display text-2xl md:text-3xl font-medium text-[var(--color-text)] mt-3 mb-2">
          Подбор ухода и восстановления
        </h1>
        <p className="text-sm text-[var(--color-text-soft)]">
          10 вопросов. Займёт около 2 минут.
        </p>
      </div>
      <QuizContainer />
    </main>
  )
}
