"use client"

import { motion } from "framer-motion"
import { useInView } from "framer-motion"
import { useRef } from "react"

const chaosPoints = [
  "Покупаешь по рекламе или совету подруги",
  "Одна маска на все случаи",
  "«Попробую, может поможет»",
  "Советы из видео без привязки к твоим волосам",
  "Деньги уходят, через месяц всё по-прежнему",
]

const systemPoints = [
  "Сначала определяешь состояние и степень повреждения",
  "Подбираешь средства под свою ситуацию",
  "Чередуешь увлажнение, питание и восстановление",
  "Следуешь протоколу для каждого мытья",
  "Видишь изменения и понимаешь, почему они происходят",
]

function XIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M15 5L5 15M5 5L15 15"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M16.6667 5L7.50001 14.1667L3.33334 10"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function SystemComparisonSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section id="compare" ref={ref} className="py-16 md:py-24 px-5 bg-bg-dark">
      <div className="max-w-5xl mx-auto">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="text-text-on-dark/60 text-[11px] font-medium tracking-[3px] uppercase text-center mb-4"
        >
          с р а в н и
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="font-hero-face text-2xl md:text-4xl font-medium text-text-on-dark text-center mb-10 md:mb-14 text-balance"
        >
          Что меняется, когда появляется система
        </motion.h2>

        <div className="grid md:grid-cols-2 gap-6 md:gap-8">
          {/* Chaos Column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-text-on-dark/5 backdrop-blur-sm rounded-xl p-6 md:p-8"
          >
            <h3 className="text-text-on-dark/50 text-lg font-medium mb-6">
              Как обычно
            </h3>
            <ul className="space-y-4">
              {chaosPoints.map((point, i) => (
                <li key={i} className="flex items-start gap-3">
                  <XIcon className="text-text-on-dark/30 flex-shrink-0 mt-0.5" />
                  <span className="text-text-on-dark/60 text-sm md:text-base">
                    {point}
                  </span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* System Column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-accent/10 backdrop-blur-sm rounded-xl p-6 md:p-8 ring-1 ring-accent/20"
          >
            <h3 className="text-accent text-lg font-medium mb-6">
              С системой HAIRLAB
            </h3>
            <ul className="space-y-4">
              {systemPoints.map((point, i) => (
                <li key={i} className="flex items-start gap-3">
                  <CheckIcon className="text-accent flex-shrink-0 mt-0.5" />
                  <span className="text-text-on-dark text-sm md:text-base">
                    {point}
                  </span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-10 md:mt-12 text-text-on-dark/80 text-center text-sm md:text-base max-w-2xl mx-auto leading-relaxed"
        >
          KM - это опыт мастера, которая 6 лет работала с волосами в салоне.
          5000+ клиенток. Все их ошибки, вопросы и результаты собраны в одну
          понятную систему для домашнего ухода.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-10 text-center"
        >
          <a
            href="#diagnostics"
            className="inline-flex items-center justify-center px-8 py-4 bg-accent text-white font-medium text-sm rounded-full hover:bg-accent-hover transition-colors duration-200"
          >
            Проверить свои волосы
          </a>
        </motion.div>
      </div>
    </section>
  )
}
