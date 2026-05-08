"use client"

import { motion } from "framer-motion"

import { CheckIcon } from "@/components/landing/icons"
import { forYouItems } from "@/config/landing-content"
import { fadeUp } from "@/lib/animations"

export function ForYouSection() {
  return (
    <section className="bg-[#FAF7F4] px-6 py-20 md:py-24">
      <div className="mx-auto max-w-5xl">
        <motion.div {...fadeUp()} className="mb-12 text-center md:mb-14">
          <p className="mb-4 font-sans text-sm font-medium text-[#D29B9B]">Для тебя, если</p>
          <h2 className="font-display text-3xl leading-tight text-[#1A1A1A] md:text-4xl">
            Этот курс для тебя, если...
          </h2>
        </motion.div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {forYouItems.map((item, index) => (
            <motion.div
              key={item}
              {...fadeUp((index % 3) * 0.06)}
              className="flex min-h-full items-start gap-4 rounded-lg border border-[#E6DED7] bg-white p-5 shadow-sm transition-colors hover:border-[#D29B9B]/70 md:p-6"
            >
              <CheckIcon className="mt-0.5 shrink-0 text-[#D29B9B]" size={16} />
              <p className="font-sans text-sm leading-relaxed text-[#444]">{item}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
