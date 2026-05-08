"use client"

import { motion } from "framer-motion"

import { principleCards } from "@/config/landing-content"
import { fadeUp } from "@/lib/animations"

export function PrinciplesSection() {
  return (
    <section
      id="program"
      className="km-principles-bg km-section rounded-t-[2rem] text-primary-foreground md:rounded-t-[2.5rem]"
    >
      <div className="km-container km-container-wide">
        <motion.div {...fadeUp()} className="mb-12 max-w-2xl md:mb-20">
          <div className="km-eyebrow mb-3 text-accent md:mb-4">Что важно понимать</div>
          <h2 className="km-section-title">
            Три принципа, на которых
            <br />
            построена <span className="italic">вся система</span>.
          </h2>
        </motion.div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {principleCards.map((card, index) => (
            <motion.div
              key={card.number}
              {...fadeUp(index * 0.15)}
              className="km-principle-card rounded-2xl border border-primary-foreground/10 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-accent/60 md:p-8"
            >
              <div className="text-4xl font-bold tabular-nums text-accent md:text-5xl">{card.number}</div>
              <h3 className="mt-4 text-xl font-semibold leading-snug tracking-tight md:mt-6 md:text-2xl">{card.title}</h3>
              <p className="km-copy mt-4 text-primary-foreground/70 md:mt-5">{card.body}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
