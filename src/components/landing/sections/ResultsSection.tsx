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
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
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
    <section id="results" className="bg-accent/20 py-14 md:py-20">
      <div className="km-container km-container-wide">
        <div className="grid gap-8 md:grid-cols-[minmax(0,1fr)_280px] md:items-end md:gap-10">
          <motion.div {...fadeUp()}>
            <div className="km-eyebrow mb-3 text-muted-foreground md:mb-4">Доказательства</div>
            <h2 className="km-section-title">
              <span className="font-semibold text-accent-foreground/90">5000+</span>{" "}
              клиентов студии
              <br />
              восстановили и отрастили
              <br /> свои волосы.
            </h2>
            <p className="km-lead mt-5 max-w-xl md:mt-6">
              Реальные кейсы, фото «до/после», результаты учениц и отзывы из Instagram.
            </p>
          </motion.div>

          <motion.div {...fadeUp(0.1)} className="hidden md:block">
            <div className="overflow-hidden rounded-2xl border border-border/70 bg-card shadow-lg">
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

        <div className="mt-9 flex items-center justify-between gap-4 md:mt-12">
          <div className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            <IgIcon className="text-accent-foreground/80" />
            Instagram
          </div>

          <div className="hidden items-center gap-2 sm:flex lg:hidden">
            <button
              type="button"
              aria-label="Предыдущий отзыв"
              onClick={() => moveCarousel("prev")}
              disabled={!canScrollPrev}
              className="grid h-10 w-10 place-items-center rounded-full border border-border/70 bg-card text-foreground transition hover:border-primary/40 hover:bg-cream disabled:cursor-not-allowed disabled:opacity-35"
            >
              <ArrowIcon direction="prev" />
            </button>
            <button
              type="button"
              aria-label="Следующий отзыв"
              onClick={() => moveCarousel("next")}
              disabled={!canScrollNext}
              className="grid h-10 w-10 place-items-center rounded-full border border-border/70 bg-card text-foreground transition hover:border-primary/40 hover:bg-cream disabled:cursor-not-allowed disabled:opacity-35"
            >
              <ArrowIcon />
            </button>
          </div>
        </div>

        <div
          ref={scrollerRef}
          onScroll={updateCarouselState}
          className="no-scrollbar mt-4 flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-smooth px-5 pb-3 md:mt-5 md:gap-5 lg:grid lg:grid-cols-5 lg:px-0 lg:overflow-visible lg:snap-none lg:gap-3"
        >
          {instagramReels.map((reel, index) => (
            <motion.a
              key={reel.id}
              href={reel.href}
              target="_blank"
              rel="noopener noreferrer"
              data-carousel-card
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.06, duration: 0.5 }}
              className="group block h-full w-[min(62vw,15rem)] shrink-0 snap-center rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-ring md:w-[20.5rem] lg:w-auto"
            >
              <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-border/70 bg-card shadow-sm transition duration-300 group-hover:-translate-y-1 group-hover:border-primary/25 group-hover:shadow-lg">
                <div className="relative aspect-[4/5] overflow-hidden bg-primary/5 lg:aspect-[9/16]">
                  <Image
                    alt={reel.alt}
                    src={reel.image}
                    fill
                    sizes="(max-width: 768px) 76vw, 336px"
                    quality={90}
                    className="object-cover transition duration-500 group-hover:scale-[1.03]"
                    style={{ objectPosition: reel.objectPosition }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/20" />
                  <div className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-white/88 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-primary shadow-sm backdrop-blur">
                    <IgIcon className="h-3 w-3 text-accent-foreground" />
                    {reel.tag}
                  </div>
                  <div className="absolute inset-0 grid place-items-center">
                    <div className="grid h-12 w-12 place-items-center rounded-full bg-white/88 pl-0.5 text-primary shadow-lg backdrop-blur transition group-hover:scale-105">
                      <PlayIcon />
                    </div>
                  </div>
                </div>

                <div className="flex grow flex-col p-3 sm:p-4">
                  <p className="hidden text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground/70 sm:block">
                    keratin_madrid
                  </p>
                  <h3 className="mt-1 text-base font-semibold leading-tight tracking-tight text-foreground sm:text-lg">{reel.title}</h3>
                  <p className="mt-2 hidden text-sm leading-relaxed text-muted-foreground sm:block">
                    {reel.description}
                  </p>
                  <span className="mt-auto inline-flex items-center gap-2 pt-3 text-[10px] font-bold uppercase tracking-[0.14em] text-primary sm:pt-4 sm:text-[11px]">
                    Смотреть в Instagram
                    <ArrowIcon />
                  </span>
                </div>
              </article>
            </motion.a>
          ))}
        </div>

        <div className="flex items-center justify-between gap-4 lg:hidden">
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
                  activeIndex === index ? "w-8 bg-primary" : "w-2 bg-primary/25 hover:bg-primary/45",
                ].join(" ")}
              />
            ))}
          </div>

          <div className="flex items-center gap-2 sm:hidden">
            <button
              type="button"
              aria-label="Предыдущий отзыв"
              onClick={() => moveCarousel("prev")}
              disabled={!canScrollPrev}
              className="grid h-10 w-10 place-items-center rounded-full border border-border/70 bg-card text-foreground disabled:opacity-35"
            >
              <ArrowIcon direction="prev" />
            </button>
            <button
              type="button"
              aria-label="Следующий отзыв"
              onClick={() => moveCarousel("next")}
              disabled={!canScrollNext}
              className="grid h-10 w-10 place-items-center rounded-full border border-border/70 bg-card text-foreground disabled:opacity-35"
            >
              <ArrowIcon />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
