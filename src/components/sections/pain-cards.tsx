"use client"

import { motion } from "framer-motion"
import { useInView } from "framer-motion"
import { useRef } from "react"
import Image from "next/image"

const painPoints = [
  "Покупаешь маску за 40€. Наносишь по инструкции. Через два дня волосы снова как солома.",
  "Концы сухие, и никакое масло не спасает. Ни аргановое, ни кокосовое, ни за 60€.",
  "Длина не растёт. Не потому что медленно растут, а потому что обламываются быстрее.",
  "После салона неделю кайф. Потом всё возвращается, как будто ничего и не делала.",
  "Шкаф полон банок. Половину использовала два раза. Что с чем сочетать - непонятно.",
]

function PainCard({ text, index }: { text: string; index: number }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-50px" })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="bg-surface p-6 rounded-lg shadow-sm border border-border/50"
    >
      <p className="text-text-soft text-sm md:text-base leading-relaxed">
        {text}
      </p>
    </motion.div>
  )
}

export function PainCardsSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section ref={ref} className="py-16 md:py-24 px-5">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
          transition={{ duration: 0.6 }}
          className="flex justify-center mb-8"
        >
          <div className="relative w-16 h-16 rounded-full overflow-hidden bg-bg-warm">
            <Image
              src="/images/hair-texture.webp"
              alt=""
              width={64}
              height={64}
              className="object-cover w-full h-full"
              aria-hidden="true"
            />
          </div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="text-text-muted text-[11px] font-medium tracking-[3px] uppercase text-center mb-4"
        >
          п р о в е р ь &nbsp; с е б я
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="font-display text-2xl md:text-4xl font-medium text-text text-center mb-10 md:mb-12"
        >
          Знакомо?
        </motion.h2>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {painPoints.slice(0, 3).map((point, i) => (
            <PainCard key={i} text={point} index={i} />
          ))}
        </div>
        <div className="grid gap-4 md:grid-cols-2 mt-4 max-w-2xl mx-auto lg:max-w-none">
          {painPoints.slice(3).map((point, i) => (
            <PainCard key={i + 3} text={point} index={i + 3} />
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-10 md:mt-12 text-text-soft text-center text-sm md:text-base max-w-xl mx-auto"
        >
          Если хотя бы два пункта про тебя, скорее всего дело не в самих
          средствах. Им просто не хватает системы.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="mt-8 text-center"
        >
          <a
            href="#why"
            className="inline-flex items-center justify-center px-8 py-4 bg-accent text-white font-medium text-sm rounded-full hover:bg-accent-hover transition-colors duration-200"
          >
            Разобраться, почему так
          </a>
        </motion.div>
      </div>
    </section>
  )
}
