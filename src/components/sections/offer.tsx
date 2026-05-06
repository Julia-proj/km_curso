"use client"

import { motion } from "framer-motion"
import { useInView } from "framer-motion"
import { useRef } from "react"

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M15 4.5L6.75 12.75L3 9"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

const fullCourseFeatures = [
  {
    title: "5 видеоуроков от Елены",
    description:
      "Пошаговое обучение на реальных примерах. Елена показывает технику нанесения, объясняет логику чередования, разбирает типичные ошибки.",
  },
  {
    title: "AI-диагностика по фото",
    description:
      "Загрузи фото своих волос. AI-система покажет степень повреждения и на что обратить внимание.",
  },
  {
    title: "Личный кабинет",
    description: "Видишь, где остановилась. Возвращаешься в любой момент.",
  },
  {
    title: "Персональный протокол",
    description:
      "Рекомендации на основе твоих ответов и результатов AI-анализа.",
  },
  {
    title: "KM Guide включён",
    description:
      "Полная PDF-карта ухода (32 страницы) - уже входит в курс.",
  },
  {
    title: "Чек-листы и дополнительные материалы",
    description: "",
  },
]

const guideFeatures = [
  "32 страницы от мастера с 6-летним опытом",
  "Диагностика и шкала повреждения 1-5",
  "Готовые протоколы для натуральных, окрашенных и осветлённых волос",
  "Карточки проверенных средств",
  "Чеклисты и календарь ухода на 14 дней",
  "Бланк персонального протокола",
]

export function OfferSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section id="offer" ref={ref} className="py-16 md:py-24 px-5">
      <div className="max-w-5xl mx-auto">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="text-text-muted text-[11px] font-medium tracking-[3px] uppercase text-center mb-4"
        >
          HAIRLAB
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="font-display text-2xl md:text-4xl font-medium text-text text-center mb-4 text-balance"
        >
          Два формата. Одна система.
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="text-text-soft text-center text-sm md:text-base max-w-xl mx-auto mb-14"
        >
          Ты уже прошла диагностику и посмотрела урок. Теперь выбери, как хочешь
          двигаться дальше.
        </motion.p>

        {/* Emotional Block 1 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-10 md:mb-14 max-w-3xl mx-auto"
        >
          <p className="text-text-muted text-[11px] font-medium tracking-[3px] uppercase mb-3">
            р е з у л ь т а т
          </p>
          <h3 className="font-display text-xl md:text-2xl font-medium text-text mb-4">
            Гладкие, плотные волосы - это не генетика. Это система.
          </h3>
          <p className="text-text-soft text-sm md:text-base leading-relaxed">
            Они всегда выглядят дорого. Без сложной укладки, без идеального
            цвета, даже в обычном хвосте. Плотность, блеск и гладкость создают
            тот самый ухоженный вид, который не получается собрать из случайных
            масок и советов из интернета. Но такой результат начинается не с
            дорогого средства. Он начинается с понимания: что нужно, в каком
            порядке и почему.
          </p>
        </motion.div>

        {/* Emotional Block 2 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="mb-14 md:mb-20 max-w-3xl mx-auto"
        >
          <p className="text-text-muted text-[11px] font-medium tracking-[3px] uppercase mb-3">
            д о с т у п н о с т ь
          </p>
          <h3 className="font-display text-xl md:text-2xl font-medium text-text mb-4 text-balance">
            Салонное восстановление работает. Но не у всех есть на него 200€ в
            месяц.
          </h3>
          <p className="text-text-soft text-sm md:text-base leading-relaxed">
            Профессиональные процедуры дают результат, если делать их регулярно.
            Но ходить каждые 3-4 недели - это и деньги, и время. Не у всех рядом
            мастер, которому доверяешь. HAIRLAB создан для тех, кто хочет
            ухаживать за волосами дома осознанно. Понимать, что происходит. Не
            покупать лишнее. Собрать протокол и поддерживать качество волос между
            визитами в салон или вместо них.
          </p>
        </motion.div>

        {/* Product Cards */}
        <div className="grid md:grid-cols-5 gap-6 md:gap-8">
          {/* Full Course Card - Larger */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="md:col-span-3 bg-surface border border-border rounded-2xl p-6 md:p-8 shadow-md relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="relative">
              <span className="inline-block px-3 py-1 bg-accent-soft text-accent text-xs font-medium rounded-full mb-4">
                Полный формат
              </span>
              <h3 className="font-display text-xl md:text-2xl font-medium text-text mb-2">
                Система восстановления с Еленой
              </h3>
              <p className="font-display text-3xl md:text-4xl font-medium text-text mb-4">
                39€
              </p>
              <p className="text-text-soft text-sm mb-6">
                Для тех, кому нужен не просто гайд, а пошаговый маршрут. С видео,
                AI-анализом и персональным протоколом.
              </p>

              <ul className="space-y-4 mb-6">
                {fullCourseFeatures.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckIcon className="text-accent flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="text-text text-sm font-medium">
                        {feature.title}
                      </span>
                      {feature.description && (
                        <p className="text-text-muted text-xs mt-0.5">
                          {feature.description}
                        </p>
                      )}
                    </div>
                  </li>
                ))}
              </ul>

              <p className="text-text-muted text-xs mb-6">
                Одна покупка - полный доступ. Без подписок, без доплат.
              </p>

              <a
                href="#buy"
                className="w-full inline-flex items-center justify-center px-8 py-4 bg-accent text-white font-medium text-sm rounded-full hover:bg-accent-hover transition-colors duration-200"
              >
                Получить полный доступ - 39€
              </a>
            </div>
          </motion.div>

          {/* KM Guide Card - Smaller */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.35 }}
            className="md:col-span-2 bg-surface border border-border rounded-2xl p-6 md:p-8"
          >
            <span className="inline-block px-3 py-1 bg-bg-warm text-text-soft text-xs font-medium rounded-full mb-4">
              Лёгкий старт
            </span>
            <h3 className="font-display text-lg md:text-xl font-medium text-text mb-2">
              KM Guide: Карта восстановления
            </h3>
            <p className="font-display text-2xl md:text-3xl font-medium text-text mb-4">
              13€
            </p>
            <p className="text-text-soft text-sm mb-6">
              Для тех, кто хочет сначала разобраться самостоятельно: понять свои
              волосы, найти ошибки и собрать базовый протокол.
            </p>

            <ul className="space-y-3 mb-6">
              {guideFeatures.map((feature, i) => (
                <li key={i} className="flex items-start gap-3">
                  <CheckIcon className="text-success flex-shrink-0 mt-0.5" />
                  <span className="text-text-soft text-sm">{feature}</span>
                </li>
              ))}
            </ul>

            <a
              href="#buy-guide"
              className="w-full inline-flex items-center justify-center px-6 py-3 bg-transparent border border-border text-text font-medium text-sm rounded-full hover:bg-bg-warm transition-colors duration-200"
            >
              Начать с KM Guide - 13€
            </a>
          </motion.div>
        </div>

        {/* Hint text */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-8 text-text-muted text-center text-sm max-w-2xl mx-auto"
        >
          Не уверена, какой формат выбрать? Начни с KM Guide. Он даст базу и
          покажет, подходит ли тебе подход Елены. Если потом решишь перейти на
          полный курс, стоимость гайда учтётся.
        </motion.p>
      </div>
    </section>
  )
}
