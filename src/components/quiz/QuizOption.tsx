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
      className={`w-full text-left px-5 py-4 sm:px-6 sm:py-4.5 rounded-xl border transition-all duration-200 text-[15px] sm:text-base leading-snug cursor-pointer ${
        selected
          ? 'border-[#D29B9B] bg-[#D29B9B]/10 text-[#1A1A1A]'
          : 'border-[#E0DCD6] bg-white text-[#1A1A1A] hover:border-[#D29B9B] hover:bg-[#D29B9B]/5'
      }`}
    >
      {label}
    </button>
  )
}
