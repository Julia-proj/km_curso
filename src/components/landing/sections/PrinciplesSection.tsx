"use client"

import { motion } from "framer-motion"

import { principleCards } from "@/config/landing-content"
import { fadeUp } from "@/lib/animations"

export function PrinciplesSection() {
  return (
    <section id="program" className="bg-[#1A1A1A] px-5 py-12 text-white sm:px-6 md:py-24">
      <div className="mx-auto max-w-6xl">
        <motion.div {...fadeUp()} className="mb-10 max-w-2xl sm:mb-12 md:mb-14">
          <p className="mb-3 font-sans text-sm font-medium text-[#D29B9B] sm:text-sm">Что важно понимать</p>
          <h2 className="font-display text-2xl leading-tight sm:text-3xl md:text-5xl">
            Три принципа, на которых построена вся система.
          </h2>
        </motion.div>

        <div className="grid items-stretch gap-3 sm:gap-4 md:grid-cols-3">
          {principleCards.map((card, index) => (
            <motion.article
              key={card.number}
              {...fadeUp(index * 0.1)}
              className="flex min-h-full flex-col rounded-xl border border-white/5 bg-white/[0.02] p-5 transition-colors hover:border-[#D29B9B]/55 sm:p-6 md:p-8"
            >
              <div className="font-display text-3xl text-[#D29B9B] sm:text-4xl md:text-5xl">{card.number}</div>
              <h3 className="mt-4 font-display text-lg leading-tight sm:text-xl md:text-2xl">{card.title}</h3>
              <p className="mt-3 font-sans text-sm leading-relaxed text-white/65 sm:text-base md:text-base">{card.body}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}
