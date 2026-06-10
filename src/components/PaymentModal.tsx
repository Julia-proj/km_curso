"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

interface PaymentModalProps {
  isOpen: boolean
  onClose: () => void
  product: "course" | "guide"
  stripeLink?: string
}

export function PaymentModal({ isOpen, onClose, product, stripeLink }: PaymentModalProps) {
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState("")
  const [showEmailInput, setShowEmailInput] = useState(false)

  useEffect(() => {
    if (!isOpen) {
      setEmail("")
      setShowEmailInput(false)
      setError(null)
      setIsLoading(false)
    }
  }, [isOpen])

  const whatsappMessage = encodeURIComponent("Здравствуйте! Я хочу оплатить курс.")
  const whatsappLink = `https://wa.me/34641261559?text=${whatsappMessage}`

  const isValidStripeLink = stripeLink && stripeLink.trim().length > 0 && stripeLink.startsWith("http")

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  const handleStripeClick = () => {
    setError(null)

    if (isValidStripeLink) {
      window.open(stripeLink, "_blank")
      onClose()
      return
    }

    setShowEmailInput(true)
  }

  const handleStripePayment = async () => {
    setError(null)

    if (!email.trim()) {
      setError("Введите email")
      return
    }

    if (!validateEmail(email)) {
      setError("Введите корректный email")
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch(`/api/checkout/${product}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), name: "" })
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Ошибка создания сессии оплаты")
      }

      const { url } = await response.json()
      if (url) {
        window.location.href = url
      } else {
        throw new Error("Не удалось получить ссылку на оплату")
      }
    } catch (err: any) {
      console.error("Payment error:", err)
      setError("Не удалось открыть оплату, попробуй ещё раз")
    } finally {
      setIsLoading(false)
    }
  }

  const handleWhatsAppPayment = () => {
    window.open(whatsappLink, "_blank")
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="relative w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl sm:max-w-lg">
              <div className="p-6 sm:p-8">
                <h3 className="mb-2 font-hero-face text-xl text-[#1A1A1A] sm:text-2xl">
                  Способ оплаты
                </h3>
                <p className="mb-6 font-sans text-sm text-[#666]">
                  Выберите удобный вариант
                </p>

                {error && (
                  <div className="mb-4 rounded-lg bg-red-50 p-3">
                    <p className="font-sans text-sm text-red-600">{error}</p>
                  </div>
                )}

                {showEmailInput && !isValidStripeLink && (
                  <div className="mb-4">
                    <label className="mb-1.5 block font-sans text-xs font-medium text-[#1A1A1A] sm:text-sm">
                      Email для чека
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your@email.com"
                      className="w-full rounded-xl border border-[#E0DCD6] px-4 py-3 font-sans text-sm text-[#1A1A1A] placeholder:text-[#999] focus:border-[#1A1A1A] focus:outline-none sm:px-5 sm:py-3.5"
                      onKeyDown={(e) => e.key === "Enter" && handleStripePayment()}
                    />
                  </div>
                )}

                <div className="space-y-3">
                  <button
                    onClick={showEmailInput && !isValidStripeLink ? handleStripePayment : handleStripeClick}
                    disabled={isLoading}
                    className="flex w-full items-center justify-between rounded-xl border-2 border-[#1A1A1A] bg-[#1A1A1A] px-5 py-3.5 text-left transition-colors hover:bg-[#333] disabled:opacity-50 disabled:cursor-not-allowed sm:px-6 sm:py-4"
                  >
                    <div>
                      <p className="font-sans text-sm font-semibold text-white sm:text-base">
                        {isLoading ? "Загрузка..." : showEmailInput && !isValidStripeLink ? "Перейти к оплате" : "Карта любой страны"}
                      </p>
                      <p className="mt-1 font-sans text-[11px] text-white/70 sm:text-xs">
                        Stripe
                      </p>
                    </div>
                    <svg
                      className="h-4 w-4 text-white sm:h-5 sm:w-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>

                  <button
                    onClick={handleWhatsAppPayment}
                    className="flex w-full items-center justify-between rounded-xl border-2 border-[#E0DCD6] bg-white px-5 py-3.5 text-left transition-colors hover:border-[#25D366] hover:bg-[#25D366]/5 sm:px-6 sm:py-4"
                  >
                    <div>
                      <p className="font-sans text-sm font-semibold text-[#1A1A1A] sm:text-base">
                        Связаться с нами
                      </p>
                      <p className="mt-1 font-sans text-[11px] text-[#666] sm:text-xs">
                        WhatsApp
                      </p>
                    </div>
                    <svg
                      className="h-4 w-4 text-[#25D366] sm:h-5 sm:w-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>
                </div>

                <button
                  onClick={onClose}
                  className="mt-6 w-full rounded-lg border border-[#E0DCD6] py-2.5 font-sans text-sm font-medium text-[#666] transition-colors hover:bg-[#F5F5F5] sm:py-3"
                >
                  Закрыть
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
