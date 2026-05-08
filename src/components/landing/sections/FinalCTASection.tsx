"use client"

import { motion } from "framer-motion"

import { CTA } from "@/components/shared/CTA"
import { fadeUp } from "@/lib/animations"

export function FinalCTASection() {
  return (
    <section id="cta" className="grain km-section-large relative overflow-hidden">
      <div className="absolute inset-0 -z-10" style={{ background: "var(--gradient-nude)" }} />
      <div className="km-container km-container-mid text-center">
        <motion.h2 {...fadeUp()} className="km-final-title">
          Начни с <span className="italic">бесплатного</span>
          <br /> теста: узнай, что именно
          <br /> нужно твоим волосам.
        </motion.h2>
        <motion.div
          {...fadeUp()}
          className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:flex-wrap sm:justify-center md:mt-12"
        >
          <CTA href="/quiz">Пройти тест бесплатно</CTA>
        </motion.div>
        <p className="mt-6 text-sm font-medium text-muted-foreground md:mt-8">
          2 минуты · без регистрации · персональные рекомендации
        </p>
      </div>
    </section>
  )
}
