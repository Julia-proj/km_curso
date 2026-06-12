"use client"

import { motion } from "framer-motion"

import { ArrowRightIcon } from "@/components/landing/icons"
import { fadeUp } from "@/lib/animations"

export function FinalCTASection() {
  return (
    <section id="cta" className="bg-[#1A1A1A] px-6 py-12 text-center text-white md:py-20">
      <div className="mx-auto max-w-2xl">
        <motion.p {...fadeUp()} className="mb-6 font-sans text-sm font-medium text-[#D29B9B] sm:text-sm">
          Начни сейчас
        </motion.p>
        <motion.h2 {...fadeUp(0.08)} className="font-hero-face text-3xl leading-tight md:text-5xl">
          Начни с теста по волосам
        </motion.h2>
        <motion.p {...fadeUp(0.16)} className="mx-auto mt-4 max-w-xl font-sans leading-relaxed text-white/50">
          Узнай, что именно нужно твоим волосам.
        </motion.p>
        <motion.div {...fadeUp(0.24)} className="mt-10">
          <a
            href="/quiz"
            className="inline-flex min-h-11 items-center justify-center gap-3 bg-[#D29B9B] px-10 py-5 font-sans text-sm font-semibold text-white transition-colors hover:bg-[#C08B8B]"
          >
            Пройти тест бесбаатнт
            <ArrowRightIcon size={16} />
          </a>
          <p className="mt-6 font-sans text-xs tracking-[0.18em] text-white/30">
            10 вопросов · без регистрации · персональные рекомендации
          </p>
        </motion.div>
      </div>
    </section>
  )
}
