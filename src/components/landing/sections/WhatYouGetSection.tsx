"use client"

import { motion } from "framer-motion"

import { fadeUp } from "@/lib/animations"

const videoLessons = [
  "Как правильно диагностировать состояние волос",
  "Какие типы повреждений бывают",
  "Какие составы действительно работают",
  "Как подобрать правильный домашний уход",
  "Какие ошибки нельзя допускать",
  "Как восстановить даже сильно повреждённый блонд",
] as const

const extras = [
  "AI-диагностика по фото (SOON)",
  "Личный кабинет",
  "Персональный протокол",
  "Hairlab Guide включён",
  "Чек-листы и доп. материалы",
] as const

const guideItems = [
  "Готовые рабочие средства: шампуни, маски, кондиционеры, термозащита",
  "Гайд по аксессуарам: полотенце, материал для сна, расчёски, резинки, зажимы",
  "Протоколы восстановления под разные типы волос",
  "Протоколы под разную степень повреждения",
] as const

function CheckIcon({ className }: { className: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      height="14"
      viewBox="0 0 24 24"
      width="14"
    >
      <path
        d="M20 6 9 17l-5-5"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  )
}

export function WhatYouGetSection() {
  return (
    <section
      id="what-you-get"
      className="bg-[#FAF7F4] px-6 py-24"
      data-testid="section-what-you-get"
    >
      <div className="mx-auto max-w-5xl">
        <motion.div {...fadeUp()} className="mb-14 text-center">
          <p className="mb-4 font-sans text-sm font-medium text-[#D29B9B]">Что внутри</p>
          <h2 className="font-display text-3xl leading-tight text-[#1A1A1A] md:text-4xl">
            Два продукта — одна система
          </h2>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2" data-testid="products-grid">
          <motion.article
            {...fadeUp()}
            className="flex flex-col border-2 border-[#1A1A1A] bg-white p-8"
            data-testid="product-course"
          >
            <div className="mb-8 flex items-end justify-between gap-4">
              <div>
                <p className="mb-1 font-sans text-xs uppercase tracking-[0.2em] text-[#999]">
                  Полный курс
                </p>
                <div className="font-display text-5xl text-[#1A1A1A]">39€</div>
              </div>
              <span className="border border-[#D29B9B] px-2 py-1 font-sans text-[10px] font-semibold text-[#D29B9B]">
                Доступ навсегда
              </span>
            </div>

            <p className="mb-3 font-sans text-[10px] font-semibold text-[#999]">Видео-уроки</p>
            <ul className="mb-6 space-y-2">
              {videoLessons.map((lesson) => (
                <li key={lesson} className="flex items-start gap-2.5 font-sans text-sm text-[#444]">
                  <CheckIcon className="mt-0.5 shrink-0 text-[#1A1A1A]" />
                  {lesson}
                </li>
              ))}
            </ul>

            <p className="mb-3 font-sans text-[10px] font-semibold text-[#999]">Дополнительно</p>
            <ul className="mb-8 flex-1 space-y-2">
              {extras.map((item) => (
                <li key={item} className="flex items-start gap-2.5 font-sans text-sm text-[#666]">
                  <CheckIcon className="mt-0.5 shrink-0 text-[#D29B9B]" />
                  {item}
                </li>
              ))}
            </ul>

            <a
              href="/offer"
              className="block w-full bg-[#1A1A1A] py-4 text-center font-sans text-sm font-semibold text-white transition-colors hover:bg-[#333]"
              data-testid="button-course"
            >
              Получить полный доступ
            </a>
          </motion.article>

          <motion.article
            {...fadeUp(0.08)}
            className="flex flex-col border border-[#E0DCD6] bg-white p-8"
            data-testid="product-guide"
          >
            <div className="mb-8 flex items-end justify-between gap-4">
              <div>
                <p className="mb-1 font-sans text-xs uppercase tracking-[0.2em] text-[#999]">
                  Hairlab Guide
                </p>
                <div className="font-display text-5xl text-[#1A1A1A]">13€</div>
              </div>
              <span className="border border-[#E0DCD6] px-2 py-1 font-sans text-[10px] font-semibold text-[#999]">
                Методичка
              </span>
            </div>

            <ol className="mb-8 flex-1 space-y-4">
              {guideItems.map((item, index) => (
                <li
                  key={item}
                  className="flex items-start gap-3 border-b border-[#F0EBE5] pb-4 font-sans text-sm text-[#444] last:border-0"
                >
                  <span className="mt-0.5 shrink-0 font-mono text-[10px] text-[#D29B9B]">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  {item}
                </li>
              ))}
            </ol>

            <a
              href="/offer"
              className="block w-full border border-[#1A1A1A] py-4 text-center font-sans text-sm font-semibold text-[#1A1A1A] transition-colors hover:bg-[#1A1A1A] hover:text-white"
              data-testid="button-guide"
            >
              Получить методичку
            </a>
          </motion.article>
        </div>
      </div>
    </section>
  )
}
