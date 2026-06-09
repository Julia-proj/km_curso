"use client"

import { motion } from "framer-motion"

interface ResultHeroProps {
  summary: string
  damageLevel: number
  visibleSigns: string[]
  mainIssues: string[]
}

const issueLabels: Record<string, string> = {
  dryness: "сухость",
  breakage: "ломкость",
  split_ends: "секущиеся кончики",
  dullness: "тусклость",
  color_fade: "потеря цвета",
  frizz: "пушистость",
  oily_scalp: "жирность корней",
  volume_loss: "потеря объёма",
  thinning: "истончение"
}

const damageLabels = [
  "",
  "здоровые волосы",
  "лёгкие признаки",
  "умеренные повреждения",
  "заметные проблемы",
  "критическое состояние"
]

export function ResultHero({ summary, damageLevel, visibleSigns, mainIssues }: ResultHeroProps) {
  return (
    <section className="relative overflow-hidden bg-[#FAF7F4] py-16 md:py-24">
      <div className="km-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl"
        >
          <h1 className="font-hero-face text-3xl font-semibold leading-tight text-[#1A1A1A] md:text-4xl lg:text-5xl">
            Вот что мы видим
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12, duration: 0.5 }}
            className="mt-6 font-body text-lg leading-relaxed text-[#666] md:text-xl"
          >
            {summary}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="mt-8 grid gap-6 md:grid-cols-2"
          >
            <div className="rounded-lg border border-[#E5DDD5] bg-white p-6">
              <p className="font-sans text-xs font-semibold uppercase tracking-[0.16em] text-[#999]">
                Уровень повреждения
              </p>
              <p className="mt-2 font-hero-face text-2xl font-semibold text-[#1A1A1A]">
                {damageLabels[damageLevel] || damageLabels[1]}
              </p>
              <div className="mt-3 flex gap-1">
                {[1, 2, 3, 4, 5].map((level) => (
                  <div
                    key={level}
                    className={`h-2 flex-1 rounded-sm ${
                      level <= damageLevel ? "bg-[#D9A19D]" : "bg-[#E5DDD5]"
                    }`}
                  />
                ))}
              </div>
            </div>

            <div className="rounded-lg border border-[#E5DDD5] bg-white p-6">
              <p className="font-sans text-xs font-semibold uppercase tracking-[0.16em] text-[#999]">
                Главные признаки
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {mainIssues.slice(0, 4).map((issue) => (
                  <span
                    key={issue}
                    className="inline-flex rounded-sm bg-[#F5F0ED] px-3 py-1.5 font-body text-sm text-[#1A1A1A]"
                  >
                    {issueLabels[issue] || issue}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
