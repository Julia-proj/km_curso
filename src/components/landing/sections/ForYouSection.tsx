"use client"

import { motion } from "framer-motion"

import { CheckIcon } from "@/components/landing/icons"
import { forYouItems } from "@/config/landing-content"
import { fadeUp } from "@/lib/animations"

export function ForYouSection() {
  return (
    <section className="km-section">
      <div className="km-container km-container-wide">
        <motion.div {...fadeUp()} className="mb-10 max-w-2xl md:mb-16">
          <div className="km-eyebrow mb-3 text-muted-foreground md:mb-4">Для кого</div>
          <h2 className="km-section-title">
            Этот курс <span className="italic">для тебя</span>, если:
          </h2>
        </motion.div>
        <div className="grid gap-4 sm:grid-cols-2">
          {forYouItems.map((item, index) => {
            const isLoneLastItem =
              index === forYouItems.length - 1 && forYouItems.length % 2 !== 0
            return (
            <motion.div
              key={item}
              {...fadeUp((index % 2) * 0.1)}
              className={`km-card group transition-colors hover:border-accent/60 hover:bg-accent/15 ${
                isLoneLastItem ? "sm:col-span-2 sm:max-w-lg sm:mx-auto sm:w-full" : ""
              }`}
            >
              <div className="flex items-start gap-4">
                <span className="grid size-9 shrink-0 place-items-center rounded-full bg-accent">
                  <CheckIcon className="text-primary" size={16} />
                </span>
                <p className="km-copy">{item}</p>
              </div>
            </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
