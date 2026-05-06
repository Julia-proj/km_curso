'use client'

interface QuizOptionProps {
  label: string
  selected: boolean
  onClick: () => void
}

export function QuizOption({ label, selected, onClick }: QuizOptionProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full text-left px-5 py-4 rounded-[var(--radius-md)] border transition-all duration-200 text-[15px] leading-snug cursor-pointer ${
        selected
          ? 'border-[var(--color-accent)] bg-[var(--color-accent-soft)] text-[var(--color-text)]'
          : 'border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text)] hover:border-[var(--color-accent)] hover:bg-[var(--color-accent-soft)]'
      }`}
    >
      {label}
    </button>
  )
}
