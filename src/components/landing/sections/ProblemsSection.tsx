"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { type PointerEvent, useCallback, useEffect, useRef, useState } from "react"

import { fadeUp } from "@/lib/animations"

const problemCards = [
  {
    title: "Сухость",
    description: "Волосы сухие даже после масок и кондиционеров",
    image: "/images/1.webp",
  },
  {
    title: "Спутанность",
    description: "Повреждение при расчёсывании, волосы рвутся",
    image: "/images/2.webp",
  },
  {
    title: "Ломкость",
    description: "Прозрачные концы, волосы ломаются по длине",
    image: "/images/3.webp",
  },
  {
    title: "Секущиеся концы",
    description: "Концы расщепляются и не поддаются уходу",
    image: "/images/4.webp",
  },
  {
    title: "Пористость",
    description: "Непослушные волосы, сложно укладывать",
    image: "/images/5.webp",
  },
  {
    title: "Отсутствие блеска",
    description: "Тусклые волосы без жизни и сияния",
    image: "/images/6.webp",
  },
  {
    title: "Сложная укладка",
    description: "Длительная укладка и постоянный дискомфорт",
    image: "/images/7.webp",
  },
] as const

export function ProblemsSection() {
  const scrollerRef = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)

  const updateCarouselState = useCallback(() => {
    requestAnimationFrame(() => {
      const scroller = scrollerRef.current
      if (!scroller) return

      const cards = Array.from(scroller.querySelectorAll<HTMLElement>("[data-carousel-card]"))
      if (!cards.length) return

      const center = scroller.scrollLeft + scroller.clientWidth / 2
      const closest = cards.reduce(
        (best, card, index) => {
          const cardCenter = card.offsetLeft + card.offsetWidth / 2
          const distance = Math.abs(center - cardCenter)
          return distance < best.distance ? { distance, index } : best
        },
        { distance: Number.POSITIVE_INFINITY, index: 0 }
      )

      setActiveIndex(closest.index)
    })
  }, [])

  useEffect(() => {
    updateCarouselState()
    window.addEventListener("resize", updateCarouselState)

    return () => window.removeEventListener("resize", updateCarouselState)
  }, [updateCarouselState])

  const scrollCards = (direction: "prev" | "next") => {
    const scroller = scrollerRef.current
    if (!scroller) return

    const cards = Array.from(scroller.querySelectorAll<HTMLElement>("[data-carousel-card]"))
    if (!cards.length) return

    const currentIndex = cards.findIndex(card => {
      const cardCenter = card.offsetLeft + card.offsetWidth / 2
      const scrollerCenter = scroller.scrollLeft + scroller.clientWidth / 2
      return Math.abs(cardCenter - scrollerCenter) < card.offsetWidth / 2
    })

    const targetIndex = direction === "next"
      ? Math.min(currentIndex + 1, cards.length - 1)
      : Math.max(currentIndex - 1, 0)

    cards[targetIndex].scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" })
  }

  // Desktop drag-to-scroll: grab the row with the mouse and drag to browse the
  // images directly, instead of clicking the arrow one card at a time. Touch
  // is left to the browser's native swipe (already smooth on mobile).
  const drag = useRef({ active: false, startX: 0, startScroll: 0 })

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    const scroller = scrollerRef.current
    if (!scroller || e.pointerType === "touch" || e.button !== 0) return
    drag.current = { active: true, startX: e.clientX, startScroll: scroller.scrollLeft }
    // Free movement while dragging; snap is re-applied on release so the row
    // settles to the nearest card.
    scroller.style.scrollSnapType = "none"
    scroller.setPointerCapture(e.pointerId)
  }

  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    const scroller = scrollerRef.current
    if (!scroller || !drag.current.active) return
    scroller.scrollLeft = drag.current.startScroll - (e.clientX - drag.current.startX)
  }

  const endDrag = (e: PointerEvent<HTMLDivElement>) => {
    const scroller = scrollerRef.current
    if (!scroller || !drag.current.active) return
    drag.current.active = false
    scroller.style.scrollSnapType = ""
    try { scroller.releasePointerCapture(e.pointerId) } catch {}
    updateCarouselState()
  }

  return (
    <section className="bg-[#F5F0EB] py-12 md:py-20">
      <div className="mx-auto max-w-6xl">
        <motion.div {...fadeUp()} className="mx-auto mb-12 max-w-3xl px-6 text-center md:mb-14">
          <p className="mb-4 font-sans text-sm font-medium text-[#D29B9B] sm:text-sm">Узнаёшь себя?</p>
          <h2 className="font-hero-face text-3xl leading-tight text-[#1A1A1A] md:text-4xl">
            7 проблем, которые решает курс
          </h2>
        </motion.div>

        <div
          ref={scrollerRef}
          onScroll={updateCarouselState}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          className="no-scrollbar flex snap-x snap-mandatory select-none gap-3 overflow-x-auto overflow-y-hidden px-5 pb-4 [scroll-padding-inline:1.25rem] sm:gap-4 sm:px-6 sm:pb-3 md:cursor-grab md:active:cursor-grabbing"
        >
          {problemCards.map((card, index) => (
            <motion.article
              key={card.title}
              {...fadeUp((index % 4) * 0.05)}
              data-carousel-card
              className="group w-[85vw] max-w-[320px] shrink-0 snap-start overflow-hidden rounded-lg border border-[#E0DCD6] bg-white shadow-sm sm:w-72"
            >
              <div className="relative h-[240px] overflow-hidden bg-[#E8E1DA] sm:h-[280px]">
                <Image
                  alt={card.title}
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  draggable={false}
                  fill
                  loading="lazy"
                  quality={75}
                  sizes="(max-width: 640px) 85vw, 320px"
                  src={card.image}
                />
                <span className="absolute left-3 top-4 bg-white/90 px-2 py-1 font-mono text-xs uppercase tracking-[0.22em] text-[#1A1A1A]">
                  {String(index + 1).padStart(2, "0")}
                </span>
              </div>
              <div className="p-4">
                <h3 className="font-hero-face text-base leading-tight text-[#1A1A1A]">{card.title}</h3>
                <p className="mt-1.5 font-sans text-sm leading-relaxed text-[#666] sm:text-base">{card.description}</p>
              </div>
            </motion.article>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="mt-4 flex items-center justify-center gap-1.5 md:hidden"
          style={{ opacity: activeIndex === problemCards.length - 1 ? 0 : 1 }}
        >
          <span className="font-sans text-xs font-medium text-[#A0524C]">Листай</span>
          <motion.div
            animate={{ x: [0, 12, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="text-[#D29B9B]"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </motion.div>
        </motion.div>

        <div className="mt-4 hidden justify-center px-6 md:flex md:mt-2">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => scrollCards("prev")}
              className="grid h-12 w-12 place-items-center rounded-full border-2 border-[#E0DCD6] bg-white text-[#1A1A1A] transition-all hover:border-[#D29B9B] hover:bg-[#D29B9B] hover:text-white hover:shadow-lg active:scale-95"
              aria-label="Прокрутить карточки влево"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => scrollCards("next")}
              className="grid h-12 w-12 place-items-center rounded-full border-2 border-[#E0DCD6] bg-white text-[#1A1A1A] transition-all hover:border-[#D29B9B] hover:bg-[#D29B9B] hover:text-white hover:shadow-lg active:scale-95"
              aria-label="Прокрутить карточки вправо"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
