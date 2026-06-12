import type { Metadata } from 'next'
import Link from 'next/link'
import { QuizContainer } from '@/components/quiz/QuizContainer'

export const metadata: Metadata = {
  title: 'Диагностика волос - HAIRLAB',
  description: '4 вопроса. Меньше минуты. Получи первую картину состояния своих волос.',
}

export default function QuizPage() {
  return (
    <main className="min-h-screen bg-[#FAF7F4] flex flex-col items-center justify-center px-4 py-16">
      <Link
        href="/dashboard"
        className="absolute top-6 left-6 text-sm font-medium text-[#666] hover:text-[#1A1A1A] transition-colors"
      >
        ← В кабинет
      </Link>
      <div className="w-full max-w-lg text-center mb-10">
        <span className="text-base font-semibold text-[#D29B9B] tracking-wide">
          HAIRLAB
        </span>
        <h1 className="text-2xl md:text-3xl font-semibold text-[#1A1A1A] mt-3 mb-2 tracking-tight">
          Подбор ухода и восстановления
        </h1>
        <p className="text-sm text-[#666]">
          10 вопросов. Займёт около 2 минут.
        </p>
      </div>
      <QuizContainer />
    </main>
  )
}
