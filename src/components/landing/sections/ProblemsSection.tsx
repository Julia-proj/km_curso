"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { useRef } from "react"

import { fadeUp } from "@/lib/animations"

const problemCards = [
  {
    title: "Сухость",
    description: "Волосы сухие даже после масок и кондиционеров",
    image: "/images/1.PNG",
  },
  {
    title: "Спутанность",
    description: "Повреждение при расчёсывании, волосы рвутся",
    image: "/images/2.PNG",
  },
  {
    title: "Ломкость",
    description: "Прозрачные концы, волосы ломаются по длине",
    image: "/images/3.PNG",
  },
  {
    title: "Секущиеся концы",
    description: "Концы расщепляются и не поддаются уходу",
    image: "/images/4.PNG",
  },
  {
    title: "Пористость",
    description: "Непослушные волосы, сложно укладывать",
    image: "/images/5.PNG",
  },
  {
    title: "Отсутствие блеска",
    description: "Тусклые волосы без жизни и сияния",
    image: "/images/6.PNG",
  },
  {
    title: "Сложная укладка",
    description: "Длительная укладка и постоянный дискомфорт",
    image: "/images/7.PNG",
  },
] as const

export function ProblemsSection() {
  const scrollerRef = useRef<HTMLDivElement>(null)

  const scrollCards = (direction: "prev" | "next") => {
    const scroller = scrollerRef.current
    if (!scroller) return
    const step = 288
    scroller.scrollBy({
      left: direction === "next" ? step : -step,
      behavior: "smooth",
    })
  }

  return (
    <section className="bg-[#F5F0EB] py-20 md:py-24">
      <div className="mx-auto max-w-6xl">
        <motion.div {...fadeUp()} className="mx-auto mb-8 max-w-3xl px-6 text-center md:mb-10">
          <p className="mb-4 font-sans text-sm font-medium text-[#D29B9B]">Узнаёшь себя?</p>
          <h2 className="font-display text-3xl leading-tight text-[#1A1A1A] md:text-4xl">
            7 проблем, которые решает курс
          </h2>
        </motion.div>

        <div className="mb-4 hidden items-center justify-end gap-2 px-6 md:flex">
          <button
            type="button"
            onClick={() => scrollCards("prev")}
            className="grid h-10 w-10 place-items-center border border-[#D9D1C8] bg-white text-[#5A524A] transition-colors hover:border-[#BEB2A5]"
            aria-label="Прокрутить карточки влево"
          >
            ←
          </button>
          <button
            type="button"
            onClick={() => scrollCards("next")}
            className="grid h-10 w-10 place-items-center border border-[#D9D1C8] bg-white text-[#5A524A] transition-colors hover:border-[#BEB2A5]"
            aria-label="Прокрутить карточки вправо"
          >
            →
          </button>
        </div>

        <div
          ref={scrollerRef}
          className="no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto px-6 pb-3 scroll-smooth [scroll-padding-inline:1.5rem]"
        >
          {problemCards.map((card, index) => (
            <motion.article
              key={card.title}
              {...fadeUp((index % 4) * 0.05)}
              className="group w-56 shrink-0 snap-start overflow-hidden rounded-md border border-[#E0DCD6] bg-white shadow-sm"
            >
              <div className="relative h-[200px] overflow-hidden bg-[#E8E1DA]">
                <Image
                  alt={card.title}
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  fill
                  quality={88}
                  sizes="224px"
                  src={card.image}
                />
                <span className="absolute left-3 top-5 bg-white/90 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.22em] text-[#1A1A1A]">
                  {String(index + 1).padStart(2, "0")}
                </span>
              </div>
              <div className="p-4">
                <h3 className="font-display text-base leading-tight text-[#1A1A1A]">{card.title}</h3>
                <p className="mt-1.5 font-sans text-xs leading-relaxed text-[#666]">{card.description}</p>
              </div>
            </motion.article>
          ))}
        </div>

        <div className="mt-3 flex justify-center px-6 md:mt-2">
          <span className="inline-flex items-center gap-2 rounded-md border border-[#E0DCD6] bg-white/75 px-3 py-1.5 font-sans text-xs font-medium uppercase tracking-[0.14em] text-[#8A8177]">
            <span className="md:hidden">Листай</span>
            <span className="hidden md:inline">Кликни</span>
            <span aria-hidden="true">→</span>
          </span>
        </div>
      </div>
    </section>
  )
}
