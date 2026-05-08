'use client'

import { motion } from 'framer-motion'
import type { QuizQuestion as QuizQuestionType } from '@/types/quiz'
import { QuizOption } from './QuizOption'

interface QuizQuestionProps {
  question: QuizQuestionType
  selectedOptionId: string | null
  onSelect: (optionId: string) => void
}

export function QuizQuestion({ question, selectedOptionId, onSelect }: QuizQuestionProps) {
  return (
    <motion.div
      key={question.id}
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -24 }}
      transition={{ duration: 0.22, ease: 'easeInOut' }}
      className="flex flex-col gap-4 sm:gap-5"
    >
      <h2 className="text-xl sm:text-2xl font-semibold text-[#1A1A1A] leading-snug">
        {question.question}
      </h2>
      <div className="flex flex-col gap-3 mt-1 sm:gap-4">
        {question.options.map((option) => (
          <QuizOption
            key={option.id}
            label={option.label}
            selected={selectedOptionId === option.id}
            onClick={() => onSelect(option.id)}
          />
        ))}
      </div>
    </motion.div>
  )
}
