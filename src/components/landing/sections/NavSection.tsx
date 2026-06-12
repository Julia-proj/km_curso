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
          className="fixed inset-x-0 top-0 z-50 border-b border-gray-200/60 bg-white/90 backdrop-blur-xl"
        >
          <div className="mx-auto flex max-w-[1200px] items-center justify-between px-5 py-3 md:px-10">
            <a href="#" className="font-hero-face text-lg tracking-tight text-foreground">
              HAIRLAB
            </a>
            <nav className="hidden gap-8 text-sm font-medium text-muted-foreground md:flex">
              <a href="#about" className="transition-colors hover:text-foreground">Об авторе</a>
              <a href="#program" className="transition-colors hover:text-foreground">Программа</a>
              <a href="#format" className="transition-colors hover:text-foreground">Формат</a>
              <a href="#faq" className="transition-colors hover:text-foreground">FAQ</a>
            </nav>
            <div className="flex items-center gap-2.5">
              <a
                href="/auth/login"
                className="px-1.5 py-2 text-xs font-medium uppercase tracking-[0.1em] text-[var(--color-cocoa)] transition-colors hover:text-foreground sm:px-2"
              >
                Войти
              </a>
              <a
                href="/quiz"
                className="rounded-sm border border-zinc-300/50 bg-zinc-50/80 px-4 py-2 text-xs font-medium uppercase tracking-[0.12em] text-[var(--color-cocoa)] transition-colors hover:border-zinc-400/60 hover:bg-zinc-100/80"
              >
                Тест
              </a>
              <a
                href="#what-you-get"
                className="rounded-sm bg-black px-4 py-2 text-xs font-medium uppercase tracking-[0.15em] text-white transition-opacity hover:bg-gray-800"
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
