"use client"

import { motion } from "framer-motion"
import { useInView } from "framer-motion"
import { useRef } from "react"

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

function DashIcon({ className }: { className?: string }) {
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
        d="M5 10H15"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  )
}

const features = [
  { name: "PDF-карта ухода (32 стр.)", guide: true, course: true },
  { name: "Протоколы и чеклисты", guide: true, course: true },
  { name: "Карточки средств", guide: true, course: true },
  { name: "5 видеоуроков от Елены", guide: false, course: true },
  { name: "AI-диагностика по фото", guide: false, course: true },
  { name: "Личный кабинет с прогрессом", guide: false, course: true },
  { name: "Персональный протокол", guide: false, course: true },
]

export function ComparisonTableSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section ref={ref} className="py-16 md:py-24 px-5 bg-bg-warm">
      <div className="max-w-3xl mx-auto">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="text-text-muted text-[11px] font-medium tracking-[3px] uppercase text-center mb-4"
        >
          с р а в н е н и е
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="font-hero-face text-2xl md:text-4xl font-medium text-text text-center mb-10 md:mb-12"
        >
          Что входит в каждый формат
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-surface rounded-xl overflow-hidden border border-border"
        >
          {/* Header */}
          <div className="grid grid-cols-5 border-b border-border">
            <div className="col-span-3 p-4 md:p-6"></div>
            <div className="p-4 md:p-6 text-center border-l border-border">
              <p className="text-text-soft text-xs md:text-sm font-medium">
                KM Guide
              </p>
              <p className="text-text font-hero-face font-medium">12€</p>
            </div>
            <div className="p-4 md:p-6 text-center border-l border-border bg-accent/5">
              <p className="text-text-soft text-xs md:text-sm font-medium">
                Full Course
              </p>
              <p className="text-text font-hero-face font-medium">38€</p>
            </div>
          </div>

          {/* Rows */}
          {features.map((feature, i) => (
            <div
              key={i}
              className={`grid grid-cols-5 ${
                i !== features.length - 1 ? "border-b border-border" : ""
              }`}
            >
              <div className="col-span-3 p-4 md:p-6 flex items-center">
                <span className="text-text text-sm md:text-base">
                  {feature.name}
                </span>
              </div>
              <div className="p-4 md:p-6 flex items-center justify-center border-l border-border">
                {feature.guide ? (
                  <CheckIcon className="text-success" />
                ) : (
                  <DashIcon className="text-text-muted" />
                )}
              </div>
              <div className="p-4 md:p-6 flex items-center justify-center border-l border-border bg-accent/5">
                {feature.course ? (
                  <CheckIcon className="text-accent" />
                ) : (
                  <DashIcon className="text-text-muted" />
                )}
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
