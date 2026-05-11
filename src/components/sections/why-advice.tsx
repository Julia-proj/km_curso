"use client"

import { motion } from "framer-motion"
import { useInView } from "framer-motion"
import { useRef } from "react"

export function WhyAdviceSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section id="why" ref={ref} className="py-16 md:py-24 px-5 bg-bg-warm">
      <div className="max-w-3xl mx-auto">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="text-text-muted text-[11px] font-medium tracking-[3px] uppercase text-center mb-4"
        >
          п о ч е м у &nbsp; т а к
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="font-hero-face text-2xl md:text-4xl font-medium text-text text-center mb-10 md:mb-12 text-balance"
        >
          Информации достаточно. Результата нет.
        </motion.h2>

        <div className="space-y-6">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-text-soft text-base md:text-lg leading-relaxed"
          >
            В TikTok одна девочка советует протеин. Другая говорит, что от
            протеина хуже. Третья рекомендует масло на ночь. Четвёртая
            объясняет, что масло забивает кутикулу.
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-text-soft text-base md:text-lg leading-relaxed"
          >
            Ты вбиваешь запрос в ChatGPT. Он отвечает грамотно, подробно и
            абсолютно ни о чём. Потому что не знает, какие у тебя волосы, что ты
            делала с ними последний год и что уже стоит в ванной.
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-text-soft text-base md:text-lg leading-relaxed"
          >
            Проблема не в нехватке информации. Её слишком много. И вся она
            разрозненная, без привязки к твоей конкретной ситуации.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-10 md:mt-12 py-6 px-6 md:px-8 bg-bg-dark rounded-lg"
        >
          <p className="text-text-on-dark text-base md:text-lg font-medium text-center leading-relaxed">
            Сто советов без контекста - это не уход. Это лотерея с дорогими
            билетами.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-10 text-center"
        >
          <a
            href="#products"
            className="inline-flex items-center justify-center px-8 py-4 bg-accent text-white font-medium text-sm rounded-full hover:bg-accent-hover transition-colors duration-200"
          >
            Что работает вместо этого
          </a>
        </motion.div>
      </div>
    </section>
  )
}
