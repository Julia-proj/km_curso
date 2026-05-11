"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { useCallback, useEffect, useRef, useState } from "react"

import { instagramReels } from "@/config/landing-content"
import { fadeUp } from "@/lib/animations"

function IgIcon({ className = "" }: { className?: string }) {
  return (
    <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  )
}

function ArrowIcon({ direction = "next" }: { direction?: "prev" | "next" }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={direction === "prev" ? "rotate-180" : ""}
    >
      <path d="M5 12h14" />
      <path d="m12 7 5 5-5 5" />
    </svg>
  )
}

function PlayIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M8 5v14l11-7z" />
    </svg>
  )
}

export function ResultsSection() {
  const scrollerRef = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const [canScrollPrev, setCanScrollPrev] = useState(false)
  const [canScrollNext, setCanScrollNext] = useState(instagramReels.length > 1)

  const updateCarouselState = useCallback(() => {
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
    setCanScrollPrev(scroller.scrollLeft > 8)
    setCanScrollNext(scroller.scrollLeft + scroller.clientWidth < scroller.scrollWidth - 8)
  }, [])

  const scrollToCard = useCallback((index: number) => {
    const scroller = scrollerRef.current
    const card = scroller?.querySelectorAll<HTMLElement>("[data-carousel-card]")[index]
    if (!card) return

    card.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" })
    setActiveIndex(index)
  }, [])

  const moveCarousel = (direction: "prev" | "next") => {
    const nextIndex = direction === "next"
      ? Math.min(activeIndex + 1, instagramReels.length - 1)
      : Math.max(activeIndex - 1, 0)

    scrollToCard(nextIndex)
  }

  useEffect(() => {
    updateCarouselState()
    window.addEventListener("resize", updateCarouselState)

    return () => window.removeEventListener("resize", updateCarouselState)
  }, [updateCarouselState])

  return (
    <section id="results" className="bg-white px-4 py-12 sm:px-6 sm:py-16 md:py-20 lg:py-24">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-6 sm:gap-8 md:gap-10">
          <motion.div {...fadeUp()}>
            <p className="mb-3 font-sans text-sm font-medium text-[#D29B9B] sm:mb-4 sm:text-sm">Доказательства</p>
            <h2 className="font-display text-2xl leading-tight text-[#1A1A1A] sm:text-3xl md:text-5xl">
              <span className="italic">5000+</span> клиентов студии восстановили и отрастили свои волосы.
            </h2>
            <p className="mt-3 max-w-xl font-sans text-sm leading-relaxed text-[#666] sm:mt-5 sm:text-base md:mt-6 md:text-lg">
              Реальные кейсы, фото «до/после», результаты учениц и отзывы из Instagram.
            </p>
          </motion.div>
        </div>

        <div className="mt-6 flex items-center justify-between gap-3 sm:mt-8 sm:gap-4 md:mt-10 md:mt-12">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-[#E6DED7] bg-white/65 px-2.5 py-1.5 font-sans text-[10px] font-medium uppercase tracking-[0.16em] text-[#666] sm:gap-2 sm:px-3 sm:py-2 sm:text-[11px]">
            <IgIcon className="h-3 w-3 text-[#D29B9B] sm:h-3.5 sm:w-3.5" />
            Instagram
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 lg:hidden">
            <button
              type="button"
              aria-label="Предыдущий отзыв"
              onClick={() => moveCarousel("prev")}
              disabled={!canScrollPrev}
              className="grid h-9 w-9 place-items-center rounded-full border border-[#E6DED7] bg-white text-[#1A1A1A] transition-colors hover:border-[#1A1A1A] disabled:cursor-not-allowed disabled:opacity-35 sm:h-10 sm:w-10"
            >
              <ArrowIcon direction="prev" />
            </button>
            <button
              type="button"
              aria-label="Следующий отзыв"
              onClick={() => moveCarousel("next")}
              disabled={!canScrollNext}
              className="grid h-9 w-9 place-items-center rounded-full border border-[#E6DED7] bg-white text-[#1A1A1A] transition-colors hover:border-[#1A1A1A] disabled:cursor-not-allowed disabled:opacity-35 sm:h-10 sm:w-10"
            >
              <ArrowIcon />
            </button>
          </div>
        </div>

        <div
          ref={scrollerRef}
          onScroll={updateCarouselState}
          className="no-scrollbar -mx-4 mt-4 flex snap-x snap-mandatory gap-2 overflow-x-auto overflow-y-hidden px-4 pb-4 touch-pan-x overscroll-x-contain overscroll-y-none sm:-mx-6 sm:gap-3 sm:px-6 sm:pb-4 md:mt-5 md:gap-4 lg:mx-0 lg:grid lg:grid-cols-3 xl:grid-cols-5 lg:overflow-visible lg:px-0 lg:pb-0"
        >
          {instagramReels.map((reel, index) => (
            <motion.a
              key={reel.id}
              href={reel.href}
              target="_blank"
              rel="noopener noreferrer"
              data-carousel-card
              {...fadeUp(index * 0.05)}
              className="group block h-full w-[min(60vw,12rem)] shrink-0 snap-center focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D29B9B] sm:w-[min(55vw,13rem)] md:w-[14rem] lg:w-auto"
            >
              <article className="flex h-full min-h-full flex-col overflow-hidden rounded-lg border border-[#E6DED7] bg-white shadow-sm transition duration-300 group-hover:-translate-y-1 group-hover:shadow-md">
                <div className="relative aspect-[9/16] overflow-hidden bg-[#E8E1DA]">
                  <Image
                    alt={reel.alt}
                    src={reel.image}
                    fill
                    sizes="(min-width: 1024px) 210px, 70vw"
                    quality={90}
                    className="object-contain transition duration-700 group-hover:scale-[1.03]"
                    style={{ objectPosition: reel.objectPosition }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-black/15 via-transparent to-black/20" />
                  <div className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-white/90 px-2.5 py-1 font-sans text-xs font-semibold uppercase tracking-[0.12em] text-[#1A1A1A] shadow-sm backdrop-blur">
                    {reel.tag}
                  </div>
                  <div className="absolute inset-0 grid place-items-center">
                    <div className="grid h-14 w-14 place-items-center rounded-full bg-white/95 text-[#1A1A1A] shadow-lg backdrop-blur transition-transform group-hover:scale-105">
                      <PlayIcon />
                    </div>
                  </div>
                </div>

                <div className="flex flex-col px-3 py-3 font-sans sm:px-4 sm:py-4">
                  <div className="flex items-center gap-1 mb-2 sm:gap-1.5 sm:mb-3">
                    <IgIcon className="h-3.5 w-3.5 shrink-0 text-[#D29B9B] sm:h-4 sm:w-4" />
                    <span className="text-xs text-[#777] sm:text-xs">@keratin_madrid</span>
                  </div>
                  <h3 className="text-[12px] font-semibold text-[#1A1A1A] leading-tight mb-1.5 line-clamp-2 sm:text-xs sm:mb-2">
                    {reel.title}
                  </h3>
                  <p className="text-xs text-[#777] leading-relaxed mb-2 line-clamp-2 sm:text-sm sm:mb-3">
                    {reel.description}
                  </p>
                  <div className="mt-auto">
                    <span className="inline-flex items-center gap-0.5 text-xs font-semibold text-[#D29B9B] sm:gap-1 sm:text-xs">
                      Смотреть
                      <ArrowIcon />
                    </span>
                  </div>
                </div>
              </article>
            </motion.a>
          ))}
        </div>

        <div className="mt-2 flex items-center justify-between gap-3 sm:gap-4 lg:hidden">
          <div className="flex items-center gap-2">
            {instagramReels.map((reel, index) => (
              <button
                key={reel.id}
                type="button"
                aria-label={`Показать отзыв ${index + 1}`}
                aria-current={activeIndex === index ? "true" : undefined}
                onClick={() => scrollToCard(index)}
                className={[
                  "h-2 rounded-full transition-all",
                  activeIndex === index ? "w-8 bg-[#1A1A1A]" : "w-2 bg-[#1A1A1A]/25 hover:bg-[#1A1A1A]/45",
                ].join(" ")}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
