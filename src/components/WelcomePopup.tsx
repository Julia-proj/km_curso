"use client"

import { AnimatePresence, motion } from "framer-motion"
import { useEffect, useState } from "react"

import { ease } from "@/lib/animations"
import { getPaymentLink } from "@/config/payments"

export function WelcomePopup() {
  const [open, setOpen] = useState(false)
  const courseLink = getPaymentLink("course")
  const guideLink = getPaymentLink("guide")

  useEffect(() => {
    if (sessionStorage.getItem("popup_shown")) return
    const timer = setTimeout(() => {
      setOpen(true)
      sessionStorage.setItem("popup_shown", "1")
    }, 1500)
    return () => clearTimeout(timer)
  }, [])

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-end justify-center p-4 sm:items-center"
          style={{ background: "rgba(20,10,5,0.55)", backdropFilter: "blur(4px)" }}
          onClick={() => setOpen(false)}
        >
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.96 }}
            transition={{ duration: 0.4, ease }}
            className="relative w-full max-w-[min(22rem,calc(100vw-2rem))] rounded-2xl border border-border bg-cream p-6 shadow-[0_40px_100px_-20px_rgba(50,25,15,0.5)]"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setOpen(false)}
              className="absolute right-4 top-4 h-7 w-7 flex items-center justify-center text-muted-foreground/50 transition-colors hover:text-foreground"
              aria-label="Закрыть"
            >
              ✕
            </button>

            <p
              className="mb-2 font-sans font-medium uppercase"
              style={{ fontSize: "0.6875rem", letterSpacing: "0.18em", color: "#C4956A" }}
            >
              Уже готова?
            </p>
            <h3 className="font-hero-face text-[1.625rem] font-semibold leading-[1.15] tracking-[-0.025em] text-foreground">
              Выбери свой<br />формат
            </h3>

            <div className="mt-5 flex flex-row gap-2">
              <a
                href={courseLink}
                onClick={() => setOpen(false)}
                className="group flex flex-1 items-center justify-center rounded-xl bg-[#D9A19D] px-4 py-3 transition-all hover:bg-[#C9918C]"
              >
                <div className="text-center">
                  <p className="mb-1 font-sans font-semibold uppercase text-white/70" style={{ fontSize: "0.625rem", letterSpacing: "0.16em" }}>
                    Полный курс
                  </p>
                  <p className="font-hero-face text-[1.125rem] font-semibold leading-none text-white">38€</p>
                </div>
              </a>

              <a
                href={guideLink}
                onClick={() => setOpen(false)}
                className="group flex flex-1 items-center justify-center rounded-xl border-2 border-[#D9A19D] bg-white px-4 py-3 transition-all hover:bg-[#FAF7F4]"
              >
                <div className="text-center">
                  <p className="mb-1 font-sans font-semibold uppercase text-[#A0845C]" style={{ fontSize: "0.625rem", letterSpacing: "0.16em" }}>
                    Методичка
                  </p>
                  <p className="font-hero-face text-[1.125rem] font-semibold leading-none text-[#1A1A1A]">12€</p>
                </div>
              </a>
            </div>

            <button
              onClick={() => setOpen(false)}
              className="mt-4 w-full text-center font-sans text-xs text-muted-foreground underline-offset-2 hover:underline"
            >
              Сначала посмотрю
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
