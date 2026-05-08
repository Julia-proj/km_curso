"use client"

import { motion } from "framer-motion"

import { principleCards } from "@/config/landing-content"
import { fadeUp } from "@/lib/animations"

export function PrinciplesSection() {
  return (
    <section id="program" className="bg-[#1A1A1A] px-6 py-20 text-white md:py-24">
      <div className="mx-auto max-w-6xl">
        <motion.div {...fadeUp()} className="mb-12 max-w-2xl md:mb-14">
          <p className="mb-4 font-sans text-sm font-medium text-[#D29B9B]">Что важно понимать</p>
          <h2 className="font-display text-3xl leading-tight md:text-5xl">
            Три принципа, на которых построена вся система.
          </h2>
        </motion.div>

        <div className="grid items-stretch gap-4 md:grid-cols-3">
          {principleCards.map((card, index) => (
            <motion.article
              key={card.number}
              {...fadeUp(index * 0.1)}
              className="flex min-h-full flex-col rounded-lg border border-white/10 bg-white/[0.04] p-6 transition-colors hover:border-[#D29B9B]/70 md:p-8"
            >
              <div className="font-display text-4xl text-[#D29B9B] md:text-5xl">{card.number}</div>
              <h3 className="mt-5 font-display text-xl leading-tight md:text-2xl">{card.title}</h3>
              <p className="mt-4 font-sans text-sm leading-relaxed text-white/65 md:text-base">{card.body}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}
