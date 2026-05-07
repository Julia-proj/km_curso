"use client"

import { AnimatePresence, motion } from "framer-motion"
import Image from "next/image"
import { useState } from "react"

import { problemItems } from "@/config/landing-content"

const ITEMS_PER_PAGE = 3
const TOTAL_PAGES = Math.ceil(problemItems.length / ITEMS_PER_PAGE)

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

export function ProblemsSection() {
  const [page, setPage] = useState(0)

  const visibleItems = problemItems.slice(
    page * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE + ITEMS_PER_PAGE
  )

  return (
    <section className="km-section relative">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <Image alt="" className="object-cover opacity-40" fill sizes="100vw" src="/images/alchemy-hair-texture.jpg" />
        <div className="absolute inset-0 bg-gradient-to-b from-cream via-cream/70 to-cream" />
      </div>

      <div className="relative">
        <div className="km-container km-container-mid mb-8 md:mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8 }}
            className="km-section-title"
          >
            Какие проблемы
            <br /> ты <span className="italic">закроешь</span> на курсе:
          </motion.h2>
        </div>

        {/* Mobile: horizontal scroll carousel (unchanged) */}
        <div className="md:hidden flex gap-3 overflow-x-auto snap-x snap-mandatory no-scrollbar pl-5 pb-4">
          {problemItems.map((item, index) => (
            <div
              key={item}
              className="snap-start shrink-0 w-[78vw] rounded-2xl overflow-hidden bg-cream/90 border border-border/60 shadow-sm"
            >
              <div className="relative aspect-[4/3]">
                <Image src={`/images/${index + 1}.PNG`} alt="" fill sizes="78vw" className="object-cover" />
              </div>
              <p className="px-4 py-4 text-sm leading-snug text-foreground/80">{item}</p>
            </div>
          ))}
          <div className="shrink-0 w-4" aria-hidden="true" />
        </div>
        <p className="md:hidden text-center text-[11px] tracking-widest text-muted-foreground/50 mt-3 uppercase">
          листай →
        </p>

        {/* Desktop: page-based carousel */}
        <div className="hidden md:block km-container km-container-mid">
          <div className="flex items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-2">
              {Array.from({ length: TOTAL_PAGES }).map((_, i) => (
                <button
                  key={i}
                  type="button"
                  aria-label={`Страница ${i + 1}`}
                  aria-current={page === i ? "true" : undefined}
                  onClick={() => setPage(i)}
                  className={[
                    "h-2 rounded-full transition-all",
                    page === i ? "w-8 bg-primary" : "w-2 bg-primary/25 hover:bg-primary/45",
                  ].join(" ")}
                />
              ))}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                aria-label="Предыдущая страница"
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                disabled={page === 0}
                className="grid h-10 w-10 place-items-center rounded-full border border-border/70 bg-card text-foreground transition hover:border-primary/40 hover:bg-cream disabled:cursor-not-allowed disabled:opacity-35"
              >
                <ArrowIcon direction="prev" />
              </button>
              <button
                type="button"
                aria-label="Следующая страница"
                onClick={() => setPage((p) => Math.min(TOTAL_PAGES - 1, p + 1))}
                disabled={page === TOTAL_PAGES - 1}
                className="grid h-10 w-10 place-items-center rounded-full border border-border/70 bg-card text-foreground transition hover:border-primary/40 hover:bg-cream disabled:cursor-not-allowed disabled:opacity-35"
              >
                <ArrowIcon />
              </button>
            </div>
          </div>

          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={page}
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ duration: 0.28, ease: "easeInOut" }}
              className="grid grid-cols-3 gap-4 lg:gap-5"
            >
              {visibleItems.map((item, index) => {
                const itemIndex = page * ITEMS_PER_PAGE + index
                const isAlone = visibleItems.length === 1
                return (
                  <div
                    key={item}
                    className={[
                      "rounded-2xl overflow-hidden bg-cream/80 border border-border/60 shadow-sm",
                      isAlone ? "col-span-3 max-w-sm mx-auto w-full" : "",
                    ].filter(Boolean).join(" ")}
                  >
                    <div className="relative aspect-[4/3]">
                      <Image
                        src={`/images/${itemIndex + 1}.PNG`}
                        alt=""
                        fill
                        sizes="(min-width: 1024px) 33vw, 50vw"
                        className="object-cover"
                      />
                    </div>
                    <p className="px-5 py-4 text-sm leading-snug text-foreground/80">{item}</p>
                  </div>
                )
              })}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}
