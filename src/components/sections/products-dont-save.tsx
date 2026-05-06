"use client"

import { motion } from "framer-motion"
import { useInView } from "framer-motion"
import { useRef } from "react"

export function ProductsDontSaveSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section id="products" ref={ref} className="py-16 md:py-24 px-5">
      <div className="max-w-3xl mx-auto">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="text-text-muted text-[11px] font-medium tracking-[3px] uppercase text-center mb-4"
        >
          р а з б и р а е м с я
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="font-display text-2xl md:text-4xl font-medium text-text text-center mb-10 md:mb-12 text-balance"
        >
          Хорошее средство на неправильных волосах - деньги в раковину
        </motion.h2>

        <div className="space-y-6">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-text-soft text-base md:text-lg leading-relaxed"
          >
            Kerastase, Olaplex, Moroccanoil - отличные марки. Серьёзно, без
            иронии. Но даже лучшее средство не даст результата, если оно не
            попадает в то, что нужно твоим волосам прямо сейчас.
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-text-soft text-base md:text-lg leading-relaxed"
          >
            Вот как это обычно выглядит. Волосы сухие - берёшь
            &quot;увлажняющую&quot; маску. Логично. Но сухость бывает разной: от
            нехватки воды внутри волоса, от повреждённой кутикулы, от избытка
            белка. И одна маска не закроет все три причины.
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-text-soft text-base md:text-lg leading-relaxed"
          >
            Слово &quot;восстановление&quot; на банке не означает, что средство
            восстанавливает именно то, что сломано у тебя. А гладкость после
            нанесения - это часто косметический эффект силиконов, а не работа со
            структурой.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-10 md:mt-12 py-6 px-6 md:px-8 bg-surface border-l-4 border-accent rounded-lg"
        >
          <p className="text-text text-base md:text-lg leading-relaxed">
            Средства работают. Но только когда ты точно знаешь, что нужно твоим
            волосам. Иначе это подбор вслепую.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-10 text-center"
        >
          <a
            href="#compare"
            className="inline-flex items-center justify-center px-8 py-4 bg-accent text-white font-medium text-sm rounded-full hover:bg-accent-hover transition-colors duration-200"
          >
            Как выглядит системный подход
          </a>
        </motion.div>
      </div>
    </section>
  )
}
