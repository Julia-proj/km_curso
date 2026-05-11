"use client"

import { motion } from "framer-motion"

import { CheckIcon } from "@/components/landing/icons"
import { forYouItems } from "@/config/landing-content"
import { fadeUp } from "@/lib/animations"

export function ForYouSection() {
  return (
    <section className="bg-[#FAF7F4] px-5 py-12 sm:px-6 md:py-20">
      <div className="mx-auto max-w-5xl">
        <motion.div {...fadeUp()} className="mb-10 text-center sm:mb-12 md:mb-14">
          <p className="mb-3 font-sans text-sm font-medium text-[#D29B9B] sm:text-sm">Для тебя, если</p>
          <h2 className="font-hero-face text-2xl leading-tight text-[#1A1A1A] sm:text-3xl md:text-4xl">
            Этот курс для тебя, если...
          </h2>
        </motion.div>

        <div className="grid gap-3 sm:gap-4 md:grid-cols-2 xl:grid-cols-3">
          {forYouItems.map((item, index) => (
            <motion.div
              key={item}
              {...fadeUp((index % 3) * 0.06)}
              className="flex min-h-full items-start gap-3 rounded-xl border border-[#E6DED7] bg-white p-4 shadow-sm transition-colors hover:border-[#D29B9B]/70 sm:gap-4 sm:p-5 md:p-6"
            >
              <CheckIcon className="mt-0.5 shrink-0 text-[#D29B9B]" size={16} />
              <p className="font-sans text-sm leading-relaxed text-[#444] sm:text-base">{item}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
