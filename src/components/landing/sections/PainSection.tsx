"use client"

import { motion } from "framer-motion"

import { fadeUp } from "@/lib/animations"

export function PainSection() {
  return (
    <section className="bg-[#FAF7F4] px-6 py-12 md:py-16">
      <div className="mx-auto max-w-4xl text-center">
        <motion.p
          {...fadeUp()}
          className="mb-6 font-sans text-base font-medium uppercase tracking-[0.18em] text-[#D29B9B] sm:text-base"
        >
          Почему уход не работает
        </motion.p>

        <motion.h2
          {...fadeUp(0.08)}
          className="font-hero-face text-3xl leading-[1.2] tracking-tight text-[#1A1A1A] md:text-5xl"
        >
          Перестань сливать деньги на дорогие процедуры и уход, который тебе не подходит.
        </motion.h2>

        <motion.div
          {...fadeUp(0.16)}
          className="mx-auto mt-10 h-px w-16 bg-[#D29B9B]"
        />

        <motion.p
          {...fadeUp(0.24)}
          className="mx-auto mt-8 max-w-2xl font-sans text-base leading-relaxed text-[#666] md:text-lg"
        >
          Сотни евро уходят в никуда: салоны, которые дают{" "}
          <span className="font-semibold text-[#4A3728]">временный результат</span>
          , средства по советам блогеров, рекомендации из ChatGPT, основанные на{" "}
          <span className="font-semibold text-[#4A3728]">популярных продуктах</span>
          , массовых отзывах и общих данных из интернета, а не на потребностях именно твоих волос.{" "}
          <span className="font-semibold text-[#4A3728]">Есть другой путь.</span>
        </motion.p>
      </div>
    </section>
  )
}
