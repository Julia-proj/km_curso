"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { useCallback, useEffect, useRef, useState } from "react"

import { instagramReels } from "@/config/landing-content"
import { fadeUp } from "@/lib/animations"

function IgIcon({ className = "" }: { className?: string }) {
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
    </svg>
  )
}

function ArrowIcon({ direction = "next" }: { direction?: "prev" | "next" }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={direction === "prev" ? "rotate-180" : ""}
    >
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
    </svg>
  )
}

function PlayIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M8 5.14v13.72a1 1 0 001.5.86l10.44-6.86a1 1 0 000-1.72L9.5 4.28A1 1 0 008 5.14z" />
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
    <section id="results" className="bg-[#FAF7F4] px-6 py-20 md:py-24">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-8 md:grid-cols-[minmax(0,1fr)_280px] md:items-end md:gap-10">
          <motion.div {...fadeUp()}>
            <p className="mb-4 font-sans text-sm font-medium text-[#D29B9B]">Доказательства</p>
            <h2 className="font-display text-3xl leading-tight text-[#1A1A1A] md:text-5xl">
              <span className="italic">5000+</span> клиентов студии восстановили и отрастили свои волосы.
            </h2>
            <p className="mt-5 max-w-xl font-sans text-base leading-relaxed text-[#666] md:mt-6 md:text-lg">
              Реальные кейсы, фото «до/после», результаты учениц и отзывы из Instagram.
            </p>
          </motion.div>

          <motion.div {...fadeUp(0.1)} className="hidden md:block">
            <div className="overflow-hidden rounded-lg border border-[#E6DED7] bg-white shadow-sm">
              <div className="relative h-56">
                <Image
                  alt="Елена Александрова"
                  src="/images/foto3.png"
                  fill
                  className="object-cover object-center"
                  sizes="280px"
                  quality={95}
                />
              </div>
            </div>
          </motion.div>
        </div>

        <div className="mt-10 flex items-center justify-between gap-4 md:mt-12">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#E6DED7] bg-white/65 px-3 py-2 font-sans text-[11px] font-medium uppercase tracking-[0.16em] text-[#666]">
            <IgIcon className="h-3.5 w-3.5 text-[#D29B9B]" />
            Instagram
          </div>

          <div className="flex items-center gap-2 lg:hidden">
            <button
              type="button"
              aria-label="Предыдущий отзыв"
              onClick={() => moveCarousel("prev")}
              disabled={!canScrollPrev}
              className="grid h-10 w-10 place-items-center rounded-full border border-[#E6DED7] bg-white text-[#1A1A1A] transition-colors hover:border-[#1A1A1A] disabled:cursor-not-allowed disabled:opacity-35"
            >
              <ArrowIcon direction="prev" />
            </button>
            <button
              type="button"
              aria-label="Следующий отзыв"
              onClick={() => moveCarousel("next")}
              disabled={!canScrollNext}
              className="grid h-10 w-10 place-items-center rounded-full border border-[#E6DED7] bg-white text-[#1A1A1A] transition-colors hover:border-[#1A1A1A] disabled:cursor-not-allowed disabled:opacity-35"
            >
              <ArrowIcon />
            </button>
          </div>
        </div>

        <div
          ref={scrollerRef}
          onScroll={updateCarouselState}
          className="no-scrollbar -mx-6 mt-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-6 pb-4 scroll-smooth md:mt-5 md:gap-4 lg:mx-0 lg:grid lg:grid-cols-5 lg:overflow-visible lg:px-0 lg:pb-0"
        >
          {instagramReels.map((reel, index) => (
            <motion.a
              key={reel.id}
              href={reel.href}
              target="_blank"
              rel="noopener noreferrer"
              data-carousel-card
              {...fadeUp(index * 0.05)}
              className="group block h-full w-[min(64vw,15rem)] shrink-0 snap-center focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D29B9B] md:w-[17rem] lg:w-auto"
            >
              <article className="flex h-full min-h-full flex-col overflow-hidden rounded-lg border border-[#E6DED7] bg-white shadow-sm transition duration-300 group-hover:-translate-y-1 group-hover:shadow-md">
                <div className="relative aspect-[9/14] overflow-hidden bg-[#E8E1DA] lg:aspect-[9/16]">
                  <Image
                    alt={reel.alt}
                    src={reel.image}
                    fill
                    sizes="(min-width: 1024px) 210px, 70vw"
                    quality={90}
                    className="object-cover transition duration-700 group-hover:scale-[1.03]"
                    style={{ objectPosition: reel.objectPosition }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-black/15 via-transparent to-black/20" />
                  <div className="absolute left-3 top-3 inline-flex items-center gap-1.5 bg-white/90 px-2.5 py-1 font-sans text-[10px] font-semibold uppercase tracking-[0.12em] text-[#1A1A1A] shadow-sm backdrop-blur">
                    {reel.tag}
                  </div>
                  <div className="absolute inset-0 grid place-items-center">
                    <div className="grid h-12 w-12 place-items-center rounded-full bg-white/90 pl-0.5 text-[#1A1A1A] shadow-md backdrop-blur transition-transform group-hover:scale-105">
                      <PlayIcon />
                    </div>
                  </div>
                </div>

                <div className="flex min-h-[3.75rem] items-center justify-between gap-2 px-3.5 py-3 font-sans">
                  <div className="flex min-w-0 items-center gap-1.5">
                    <IgIcon className="h-3.5 w-3.5 shrink-0 text-[#D29B9B]" />
                    <span className="truncate text-[11px] text-[#777]">@keratin_madrid</span>
                  </div>
                  <span className="inline-flex shrink-0 items-center gap-1 text-[11px] font-semibold text-[#D29B9B]">
                    Смотреть
                    <ArrowIcon />
                  </span>
                </div>
              </article>
            </motion.a>
          ))}
        </div>

        <div className="mt-2 flex items-center justify-between gap-4 lg:hidden">
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
