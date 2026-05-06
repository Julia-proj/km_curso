'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useQuizStore } from '@/stores/quiz-store'
import type { DamageLevel } from '@/types/quiz'

const DAMAGE_SCALE: Record<DamageLevel, number> = {
  low: 2,
  medium: 3,
  high: 5,
}

const DAMAGE_CONTENT: Record<
  DamageLevel,
  { headline: string; text: string; recommendation: string }
> = {
  low: {
    headline: 'Похоже, волосы в неплохом состоянии',
    text: 'По твоим ответам серьёзных повреждений пока нет. Хорошая новость: сейчас самый удобный момент выстроить систему и не дать ситуации ухудшиться. Особенно если красишь волосы, регулярно сушишь феном или живёшь в городе с жёсткой водой.',
    recommendation: 'Тебе подойдёт базовый протокол: увлажнение, защита, правильная последовательность.',
  },
  medium: {
    headline: 'Волосам нужна помощь',
    text: 'По ответам видно признаки повреждения. Скорее всего, кутикула уже приоткрыта: влага и питательные вещества уходят быстрее, чем ты их восполняешь. Обычная связка «шампунь + маска» здесь уже не вытягивает.',
    recommendation: 'Тебе нужен протокол с чередованием увлажнения, питания и восстановления. И стоит проверить, нет ли ошибок в ежедневном уходе.',
  },
  high: {
    headline: 'Волосам нужно больше внимания',
    text: 'По ответам похоже на серьёзное повреждение структуры. Так часто бывает после осветления, частых окрашиваний или регулярного утюжка без защиты. Хорошая новость: даже при сильном повреждении можно уменьшить ломкость и вернуть волосам плотность, если действовать аккуратно.',
    recommendation: 'Тебе нужен восстановительный протокол с акцентом на реконструкцию и защиту.',
  },
}

function DamageScale({ filled }: { filled: number }) {
  return (
    <div className="flex items-center gap-2 justify-center" aria-label={`Степень повреждения: ${filled} из 5`}>
      {Array.from({ length: 5 }, (_, i) => (
        <span
          key={i}
          className={`block w-10 h-2 rounded-full transition-colors ${
            i < filled ? 'bg-[var(--color-accent)]' : 'bg-[var(--color-border)]'
          }`}
        />
      ))}
    </div>
  )
}

export default function ResultPage() {
  const router = useRouter()
  const { answers, getDamageLevel } = useQuizStore()
  const hasAnswers = Object.keys(answers).length > 0

  useEffect(() => {
    if (!hasAnswers) {
      router.replace('/quiz')
    }
  }, [hasAnswers, router])

  if (!hasAnswers) return null

  const level = getDamageLevel()
  const content = DAMAGE_CONTENT[level]
  const filled = DAMAGE_SCALE[level]

  return (
    <main className="min-h-screen bg-[var(--color-bg)] flex flex-col items-center justify-center px-4 py-16">
      <div className="w-full max-w-lg text-center">
        <p className="text-[11px] font-medium tracking-[3px] uppercase text-[var(--color-text-muted)] mb-6">
          Результат диагностики
        </p>

        <div className="mb-6">
          <DamageScale filled={filled} />
        </div>

        <h1 className="font-display text-2xl md:text-3xl font-medium text-[var(--color-text)] mb-5 text-balance">
          {content.headline}
        </h1>

        <p className="text-[var(--color-text-soft)] text-sm md:text-base leading-relaxed mb-5 max-w-md mx-auto">
          {content.text}
        </p>

        <div className="bg-[var(--color-accent-soft)] border border-[var(--color-border)] rounded-[var(--radius-lg)] px-6 py-4 mb-8 text-left max-w-md mx-auto">
          <p className="text-[11px] font-medium tracking-[2px] uppercase text-[var(--color-text-muted)] mb-1">
            Рекомендация
          </p>
          <p className="text-sm text-[var(--color-text)] leading-relaxed">
            {content.recommendation}
          </p>
        </div>

        <Link
          href="/lesson"
          className="inline-block bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white font-medium px-8 py-4 rounded-[var(--radius-full)] transition-colors text-sm"
        >
          Посмотреть бесплатный урок
        </Link>
      </div>
    </main>
  )
}
