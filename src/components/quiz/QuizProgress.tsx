'use client'

interface QuizProgressProps {
  total: number
  current: number
}

export function QuizProgress({ total, current }: QuizProgressProps) {
  return (
    <div className="flex items-center gap-2 justify-center" aria-label={`Шаг ${current + 1} из ${total}`}>
      {Array.from({ length: total }, (_, i) => (
        <span
          key={i}
          className={`block rounded-full transition-all duration-300 ${
            i === current
              ? 'w-6 h-2 bg-[var(--color-accent)]'
              : i < current
              ? 'w-2 h-2 bg-[var(--color-accent)] opacity-50'
              : 'w-2 h-2 bg-[var(--color-border)]'
          }`}
        />
      ))}
    </div>
  )
}
