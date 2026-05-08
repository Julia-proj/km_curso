"use client"

import { motion } from "framer-motion"

import { fadeUp } from "@/lib/animations"

const formatCards = [
  {
    title: "Доступ навсегда",
    subtitle: "Один раз и на всю жизнь",
  },
  {
    title: "Видео-уроки",
    subtitle: "Смотри в своём темпе",
  },
  {
    title: "Гайды и чек-листы",
    subtitle: "Готовые инструменты",
  },
  {
    title: "Методичка",
    subtitle: "Рабочие составы под твой тип",
  },
] as const

export function FormatSection() {
  return (
    <section id="format" className="bg-white px-6 py-24" data-testid="section-format">
      <div className="mx-auto max-w-5xl">
        <motion.div {...fadeUp()} className="mb-14 text-center">
          <p className="mb-4 font-sans text-sm font-medium text-[#D29B9B]">Формат</p>
          <h2 className="mx-auto max-w-2xl font-display text-3xl leading-tight text-[#1A1A1A] md:text-4xl">
            Доступ к курсу, видео-урокам, гайдам и методичкам навсегда.
          </h2>
        </motion.div>

        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4" data-testid="format-grid">
          {formatCards.map((card, index) => (
            <motion.article
              key={card.title}
              {...fadeUp(index * 0.05)}
              className="border border-[#E0DCD6] p-8 text-center"
              data-testid={`format-item-${index}`}
            >
              <h3 className="mb-2 font-display text-xl leading-tight text-[#1A1A1A]">{card.title}</h3>
              <p className="font-sans text-xs text-[#999]">
                {card.subtitle}
              </p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}
