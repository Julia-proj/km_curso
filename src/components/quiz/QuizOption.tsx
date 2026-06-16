'use client'

import Image from 'next/image'

interface QuizOptionProps {
  label: string
  selected: boolean
  onClick: () => void
  /** When set, render an image card (photo + caption) instead of a text row. */
  image?: string
}

export function QuizOption({ label, selected, onClick, image }: QuizOptionProps) {
  if (image) {
    return (
      <button
        type="button"
        onClick={onClick}
        className={`flex flex-col overflow-hidden rounded-xl border transition-all duration-200 cursor-pointer ${
          selected
            ? 'border-[#D29B9B] ring-2 ring-[#D29B9B]/40'
            : 'border-[#E0DCD6] hover:border-[#D29B9B]'
        }`}
      >
        <span className="relative block aspect-[3/4] w-full bg-[#E8E1DA]">
          <Image
            src={image}
            alt={label}
            fill
            sizes="(max-width: 640px) 33vw, 160px"
            className="object-cover"
          />
        </span>
        <span
          className={`px-2 py-2 text-center text-xs sm:text-sm leading-tight ${
            selected ? 'bg-[#D29B9B]/10 text-[#1A1A1A]' : 'bg-white text-[#1A1A1A]'
          }`}
        >
          {label}
        </span>
      </button>
    )
  }

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
