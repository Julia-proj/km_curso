"use client"

import { motion } from "framer-motion"

import { fadeUp } from "@/lib/animations"

const formatCards = [
  {
    title: "Доступ навсегда",
    subtitle: "Один раз и на всю жизнь",
    icon: (
      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    title: "Видео-уроки",
    subtitle: "Смотри в своём темпе",
    icon: (
      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    title: "Гайды и чек-листы",
    subtitle: "Готовые инструменты",
    icon: (
      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
      </svg>
    ),
  },
  {
    title: "Методичка",
    subtitle: "Рабочие составы под твой тип",
    icon: (
      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
      </svg>
    ),
  },
] as const

export function FormatSection() {
  return (
    <section id="format" className="bg-white px-5 py-12 sm:px-6 md:py-24" data-testid="section-format">
      <div className="mx-auto max-w-5xl">
        <motion.div {...fadeUp()} className="mb-14 text-center">
          <p className="mb-4 font-sans text-sm font-medium text-[#D29B9B] sm:text-sm">Формат</p>
          <h2 className="mx-auto max-w-2xl font-hero-face text-3xl leading-tight text-[#1A1A1A] md:text-4xl">
            Доступ к курсу, видео-урокам, гайдам и методичкам навсегда.
          </h2>
        </motion.div>

        <div className="grid gap-3 grid-cols-2 sm:grid-cols-2 md:grid-cols-4" data-testid="format-grid">
          {formatCards.map((card, index) => (
            <motion.article
              key={card.title}
              {...fadeUp(index * 0.05)}
              className="border border-[#E0DCD6] p-5 text-center rounded-2xl group hover:border-[#B8878F] transition-colors sm:p-6 md:p-8"
              data-testid={`format-item-${index}`}
            >
              <div className="mb-3 inline-flex h-10 w-10 items-center justify-center text-[#B8878F] opacity-60 group-hover:opacity-80 transition-colors sm:h-12 sm:w-12 sm:mb-4">
                {card.icon}
              </div>
              <h3 className="mb-1.5 font-hero-face text-base leading-tight text-[#1A1A1A] sm:text-lg sm:mb-2 md:text-xl">{card.title}</h3>
              <p className="font-sans text-xs text-[#999] sm:text-xs sm:text-sm">
                {card.subtitle}
              </p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}
