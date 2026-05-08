"use client"

import { AnimatePresence, motion } from "framer-motion"
import { useEffect, useState } from "react"

import { ease } from "@/lib/animations"

export function NavSection() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => {
      const heroHeight =
        document.getElementById("hero-section")?.offsetHeight ?? window.innerHeight
      setVisible(window.scrollY > heroHeight * 0.85)
    }
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <AnimatePresence>
      {visible && (
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4, ease }}
          className="fixed inset-x-0 top-0 z-50 border-b border-border/40 bg-cream/80 backdrop-blur-xl"
        >
          <div className="mx-auto flex max-w-[1200px] items-center justify-between px-5 py-2.5 md:px-10">
            <a href="#" className="font-display text-lg text-foreground">
              HAIRLAB
            </a>
            <nav className="hidden gap-8 text-sm text-muted-foreground md:flex">
              <a href="#about" className="transition-colors hover:text-foreground">Об авторе</a>
              <a href="#program" className="transition-colors hover:text-foreground">Программа</a>
              <a href="#format" className="transition-colors hover:text-foreground">Формат</a>
              <a href="#faq" className="transition-colors hover:text-foreground">FAQ</a>
            </nav>
            <div className="flex items-center gap-2">
              <a
                href="/quiz"
                className="rounded-full border border-border/60 bg-sand px-4 py-2 text-xs font-medium uppercase tracking-[0.15em] text-foreground transition-colors hover:border-accent hover:bg-accent"
              >
                Тест
              </a>
              <a
                href="#format"
                className="rounded-full bg-primary px-4 py-2 text-xs font-medium uppercase tracking-[0.15em] text-primary-foreground transition-opacity hover:opacity-80"
              >
                <span className="hidden sm:inline">Хочу на обучение</span>
                <span className="sm:hidden">Обучение</span>
              </a>
            </div>
          </div>
        </motion.header>
      )}
    </AnimatePresence>
  )
}
