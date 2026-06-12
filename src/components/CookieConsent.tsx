"use client"

import { AnimatePresence, motion } from "framer-motion"
import Link from "next/link"
import { useEffect, useState } from "react"

import { GoogleAnalytics } from "@/components/GoogleAnalytics"

const CONSENT_KEY = "cookie_consent"

type Consent = "granted" | "denied" | "unset" | null

/**
 * GDPR cookie banner. Analytics (GA) loads only after the user accepts;
 * "denied" hides the banner and never loads the scripts. The choice is
 * stored in localStorage, so the banner shows once per browser.
 */
export function CookieConsent() {
  // null = not read yet (avoids a flash of the banner during hydration)
  const [consent, setConsent] = useState<Consent>(null)

  useEffect(() => {
    const stored = localStorage.getItem(CONSENT_KEY)
    setConsent(stored === "granted" || stored === "denied" ? stored : "unset")
  }, [])

  const choose = (value: "granted" | "denied") => {
    localStorage.setItem(CONSENT_KEY, value)
    setConsent(value)
  }

  return (
    <>
      {consent === "granted" && <GoogleAnalytics />}

      <AnimatePresence>
        {consent === "unset" && (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 24 }}
            transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
            role="dialog"
            aria-label="Согласие на использование cookies"
            className="fixed inset-x-0 bottom-0 z-[90] p-3 sm:p-4"
          >
            <div
              className="mx-auto flex max-w-2xl flex-col gap-3 rounded-2xl border p-4 shadow-[0_12px_40px_rgba(26,26,26,0.18)] sm:flex-row sm:items-center sm:gap-5 sm:p-5"
              style={{ background: "#FBF8F2", borderColor: "#E0DCD6" }}
            >
              <p className="font-sans text-xs leading-relaxed text-[#57524B] sm:text-sm">
                Мы используем cookies для аналитики: они помогают понять, как
                используется сайт. Подробнее в{" "}
                <Link href="/privacy" className="underline underline-offset-2 text-[#1A1A1A] hover:text-[#AD5F59]">
                  политике конфиденциальности
                </Link>
                .
              </p>
              <div className="flex shrink-0 items-center gap-2">
                <button
                  type="button"
                  onClick={() => choose("denied")}
                  className="rounded-full border px-4 py-2 font-sans text-xs font-semibold text-[#57524B] transition-colors hover:bg-black/5 sm:text-sm"
                  style={{ borderColor: "#E0DCD6" }}
                >
                  Отклонить
                </button>
                <button
                  type="button"
                  onClick={() => choose("granted")}
                  className="rounded-full bg-[#AD5F59] px-5 py-2 font-sans text-xs font-semibold text-white transition-colors hover:bg-[#9C544E] sm:text-sm"
                >
                  Принять
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
