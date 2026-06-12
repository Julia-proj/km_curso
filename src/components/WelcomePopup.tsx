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
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          style={{ background: "rgba(26,26,26,0.6)", backdropFilter: "blur(8px)" }}
          onClick={() => setOpen(false)}
        >
          <motion.div
            initial={{ opacity: 0, y: 32, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.95 }}
            transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
            className="relative w-full max-w-[20rem] overflow-hidden rounded-3xl"
            style={{ background: "#F5F0EB", boxShadow: "0_25px_80px_-12px_rgba(26,26,26,0.35)" }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setOpen(false)}
              className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full transition-colors hover:bg-black/5"
              aria-label="Закрыть"
              style={{ color: "#A0845C" }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>

            <div className="p-6 pb-5">
              <p
                className="font-sans font-medium uppercase tracking-widest"
                style={{ fontSize: "0.65rem", color: "#C4956A", letterSpacing: "0.2em" }}
              >
                Уже готова?
              </p>
              <h3
                className="mt-2 font-hero-face font-semibold tracking-tight"
                style={{ fontSize: "1.35rem", color: "#1A1A1A", lineHeight: 1.2 }}
              >
                Что хочешь изучить?
              </h3>
            </div>

            <div className="flex flex-col">
              <a
                href={courseLink}
                onClick={() => setOpen(false)}
                className="group relative flex items-center justify-between px-6 py-4 transition-colors hover:bg-black/[0.02]"
                style={{ borderBottom: "1px solid rgba(160,132,92,0.12)" }}
              >
                <div>
                  <p
                    className="font-sans font-semibold uppercase"
                    style={{ fontSize: "0.7rem", color: "#D9A19D", letterSpacing: "0.15em" }}
                  >
                    Полный курс
                  </p>
                  <p
                    className="mt-0.5 font-hero-face font-semibold"
                    style={{ fontSize: "1.5rem", color: "#1A1A1A", lineHeight: 1 }}
                  >
                    38€
                  </p>
                  <p
                    className="mt-1 font-sans text-xs"
                    style={{ color: "#888" }}
                  >
                    Все уроки + методички
                  </p>
                </div>
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-full transition-transform group-hover:scale-110"
                  style={{ background: "#D9A19D" }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </div>
              </a>

              <a
                href={guideLink}
                onClick={() => setOpen(false)}
                className="group relative flex items-center justify-between px-6 py-4 transition-colors hover:bg-black/[0.02]"
              >
                <div>
                  <p
                    className="font-sans font-semibold uppercase"
                    style={{ fontSize: "0.7rem", color: "#A0845C", letterSpacing: "0.15em" }}
                  >
                    Методичка
                  </p>
                  <p
                    className="mt-0.5 font-hero-face font-semibold"
                    style={{ fontSize: "1.5rem", color: "#1A1A1A", lineHeight: 1 }}
                  >
                    12€
                  </p>
                  <p
                    className="mt-1 font-sans text-xs"
                    style={{ color: "#888" }}
                  >
                    Только PDF-гайды
                  </p>
                </div>
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-full border-2 transition-transform group-hover:scale-110 group-hover:border-[#D9A19D]"
                  style={{ borderColor: "#D9A19D", color: "#D9A19D" }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </div>
              </a>
            </div>

            <button
              onClick={() => setOpen(false)}
              className="w-full py-4 text-center font-sans text-xs transition-colors hover:bg-black/[0.02]"
              style={{ color: "#A0845C", letterSpacing: "0.02em" }}
            >
              Сначала изучу программу
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
