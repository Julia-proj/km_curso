"use client"

import { motion } from "framer-motion"

import { fadeUp } from "@/lib/animations"

export function FormatSection() {
  return (
    <section id="format" className="km-section bg-primary text-primary-foreground">
      <div className="km-container km-container-mid text-center">
        <motion.div
          {...fadeUp()}
          className="km-eyebrow mb-5 inline-flex items-center gap-2 text-accent md:mb-6"
        >
          ✦ Формат обучения
        </motion.div>
        <motion.h2 {...fadeUp()} className="km-format-title">
          Доступ к курсу, видео-урокам, гайдам
          <br />
          и методичкам{" "}
          <span className="italic text-accent">навсегда.</span>
        </motion.h2>
      </div>
    </section>
  )
}
