"use client"

import { AnimatePresence, motion } from "framer-motion"
import { useEffect, useState } from "react"

import { ArrowUpRightIcon } from "@/components/landing/icons"
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
            className="relative w-full max-w-[min(24rem,calc(100vw-2rem))] rounded-3xl border border-border bg-cream p-6 shadow-[0_40px_100px_-20px_rgba(50,25,15,0.5)]"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setOpen(false)}
              className="absolute right-5 top-5 flex h-7 w-7 items-center justify-center rounded-full border border-border/60 text-muted-foreground transition-colors hover:text-foreground"
              aria-label="Закрыть"
            >
              ✕
            </button>
            <div className="km-eyebrow mb-3 text-accent-foreground/60">Уже готова?</div>
            <h3 className="text-2xl font-semibold leading-tight tracking-tight">
              Выбери свой<br />формат обучения
            </h3>
            <p className="mt-3 text-sm text-muted-foreground">
              Для тех, кто уже знает что хочет, сразу к делу.
            </p>
            <div className="mt-6 flex flex-col gap-3">
              <a
                href={courseLink}
                onClick={() => setOpen(false)}
                className="flex items-center justify-between rounded-2xl bg-primary px-5 py-4 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-80"
              >
                <span>Полный курс</span>
                <ArrowUpRightIcon size={14} />
              </a>
              <a
                href={guideLink}
                onClick={() => setOpen(false)}
                className="flex items-center justify-between rounded-2xl border border-border px-5 py-4 text-sm font-semibold text-foreground transition-colors hover:bg-sand/60"
              >
                <span>Купить методичку</span>
                <ArrowUpRightIcon size={14} />
              </a>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="mt-4 w-full text-center text-xs text-muted-foreground underline-offset-2 hover:underline"
            >
              Сначала посмотрю
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
