"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Image from "next/image"

import { getPaymentLink } from "@/config/payments"
import { fadeUp } from "@/lib/animations"
import { PaymentModal } from "@/components/PaymentModal"

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

export function WhatYouGetSection({
  sectionId = "what-you-get",
  showResultBlock = false,
  title = "Два продукта. Одна система",
}: {
  sectionId?: string
  showResultBlock?: boolean
  title?: string
}) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<"course" | "guide">("course")

  const coursePaymentLink = getPaymentLink("course")
  const guidePaymentLink = getPaymentLink("guide")

  const handlePaymentClick = (product: "course" | "guide") => {
    setSelectedProduct(product)
    setIsModalOpen(true)
  }

  return (
    <section
      id={sectionId}
      className="bg-[#FAF7F4] px-5 py-12 sm:px-6 md:py-20"
      data-testid="section-what-you-get"
    >
      <div className="mx-auto max-w-5xl">
        <motion.div {...fadeUp()} className="mb-10 text-center sm:mb-14">
          <p className="mb-3 font-sans text-sm font-medium text-[#D29B9B] sm:text-sm">Что внутри</p>
          <h2 className="font-display text-2xl leading-tight text-[#1A1A1A] sm:text-3xl md:text-4xl">
            {title}
          </h2>
        </motion.div>

        <div className="grid gap-4 sm:gap-6 md:grid-cols-2" data-testid="products-grid">
          <motion.article
            {...fadeUp()}
            className="flex flex-col border-2 border-[#1A1A1A] bg-white p-5 sm:p-6 md:p-8 rounded-xl sm:rounded-2xl"
            data-testid="product-course"
          >
            <div className="mb-6 flex items-end justify-between gap-4 sm:mb-8">
              <div>
                <p className="mb-1 font-sans text-xs uppercase tracking-[0.2em] text-[#999] sm:text-xs">
                  Полный курс
                </p>
                <div className="flex items-baseline gap-2">
                  <span className="font-sans text-sm text-[#999] line-through decoration-[#D29B9B]">138€</span>
                  <div className="font-display text-4xl text-[#1A1A1A] sm:text-5xl">38€</div>
                </div>
              </div>
              <span className="border border-[#D29B9B] px-2 py-1 font-sans text-xs font-semibold text-[#D29B9B]">
                Доступ навсегда
              </span>
            </div>

            <p className="mb-2 font-sans text-xs font-semibold text-[#999] sm:mb-3">Видео-уроки</p>
            <ul className="mb-4 space-y-2 sm:mb-6">
              {videoLessons.map((lesson) => (
                <li key={lesson} className="flex items-start gap-2.5 font-sans text-sm text-[#444] sm:text-base">
                  <CheckIcon className="mt-0.5 shrink-0 text-[#1A1A1A]" />
                  {lesson}
                </li>
              ))}
            </ul>

            <p className="mb-2 font-sans text-xs font-semibold text-[#999] sm:mb-3">Дополнительно</p>
            <ul className="mb-6 flex-1 space-y-2 sm:mb-8">
              {extras.map((item) => (
                <li key={item} className="flex items-start gap-2.5 font-sans text-sm text-[#666] sm:text-base">
                  <CheckIcon className="mt-0.5 shrink-0 text-[#D29B9B]" />
                  {item}
                </li>
              ))}
            </ul>

            <button
              onClick={() => handlePaymentClick("course")}
              className="block w-full rounded-md bg-[#1A1A1A] py-3.5 text-center font-sans text-xs font-semibold text-white transition-colors hover:bg-[#333] sm:py-4 sm:text-sm"
              data-testid="button-course"
            >
              Получить полный доступ
            </button>
          </motion.article>

          <motion.article
            {...fadeUp(0.08)}
            className="flex flex-col border border-[#E0DCD6] bg-white p-5 sm:p-6 md:p-8 rounded-xl sm:rounded-2xl"
            data-testid="product-guide"
          >
            <div className="mb-6 flex items-end justify-between gap-4 sm:mb-8">
              <div>
                <p className="mb-1 font-sans text-xs uppercase tracking-[0.2em] text-[#999] sm:text-xs">
                  Hairlab Guide
                </p>
                <div className="flex items-baseline gap-2">
                  <span className="font-sans text-sm text-[#999] line-through decoration-[#D29B9B]">39€</span>
                  <div className="font-display text-4xl text-[#1A1A1A] sm:text-5xl">12€</div>
                </div>
              </div>
              <span className="border border-[#E0DCD6] px-2 py-1 font-sans text-xs font-semibold text-[#999]">
                Методичка
              </span>
            </div>

            <ol className="mb-6 flex-1 space-y-3 sm:mb-8 sm:space-y-4">
              {guideItems.map((item, index) => (
                <li
                  key={item}
                  className="flex items-start gap-3 border-b border-[#F0EBE5] pb-3 font-sans text-sm text-[#444] last:border-0 sm:pb-4 sm:text-base"
                >
                  <span className="mt-0.5 shrink-0 font-mono text-xs text-[#D29B9B]">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  {item}
                </li>
              ))}
            </ol>

            <button
              onClick={() => handlePaymentClick("guide")}
              className="block w-full rounded-md border border-[#1A1A1A] py-3.5 text-center font-sans text-xs font-semibold text-[#1A1A1A] transition-colors hover:bg-[#1A1A1A] hover:text-white sm:py-4 sm:text-sm"
              data-testid="button-guide"
            >
              Получить методичку
            </button>
          </motion.article>
        </div>

        {showResultBlock && (
          <motion.div 
            {...fadeUp(0.15)} 
            className="relative mt-8 overflow-hidden rounded-2xl border border-[#E5DDD5] bg-[#F8F5F1] sm:mt-10"
          >
            <div className="px-5 py-6 sm:px-8 sm:py-8 md:px-10 md:py-10">
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:gap-6">
                <div className="relative aspect-[3/4] h-24 w-20 shrink-0 md:h-32 md:w-24">
                  <Image
                    alt="Результат восстановления волос"
                    src="/images/foto2.png"
                    fill
                    loading="lazy"
                    quality={92}
                    className="object-cover object-top rounded-lg"
                    sizes="96px"
                  />
                </div>
                
                <div className="flex-1">
                  <p className="mb-2 font-sans text-xs font-semibold uppercase tracking-[0.48em] text-[#D29B9B] sm:mb-3 sm:text-xs">
                    р е з у л ь т а т
                  </p>
                  <h2 className="mb-3 font-display text-lg font-medium leading-tight tracking-normal text-[#1A1A1A] text-balance sm:text-xl md:text-2xl">
                    Гладкие, плотные волосы - это не генетика, а система.
                  </h2>
                  <div className="space-y-2 font-sans text-sm leading-relaxed text-[#5E554C] sm:text-sm md:text-base">
                    <p>
                      Они всегда выглядят дорого: без сложной укладки, без идеального цвета, даже в обычном хвосте.
                    </p>
                    <p>
                      Плотность, блеск и гладкость создают тот самый ухоженный вид.
                    </p>
                    <p className="text-[#3E2723]">
                      Такой результат начинается с понимания: что нужно, в каком порядке и почему.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      <PaymentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        product={selectedProduct}
        stripeLink={selectedProduct === "course" ? coursePaymentLink : guidePaymentLink}
      />
    </section>
  )
}
