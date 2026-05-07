"use client"

import { motion } from "framer-motion"

import { fadeUp } from "@/lib/animations"

export function PainSection() {
  return (
    <section className="km-section">
      <div className="km-container km-container-mid">
        <motion.h2 {...fadeUp()} className="km-section-title">
          Перестань сливать деньги
          <br />
          на дорогие процедуры и уход,
          <br />
          который тебе{" "}
          <span className="italic text-accent-foreground/80">не подходит.</span>
        </motion.h2>
      </div>
    </section>
  )
}
