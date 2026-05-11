"use client"

import { motion, AnimatePresence } from "framer-motion"

interface PaymentModalProps {
  isOpen: boolean
  onClose: () => void
  product: "course" | "guide"
  stripeLink: string
}

export function PaymentModal({ isOpen, onClose, product, stripeLink }: PaymentModalProps) {
  const whatsappMessage = encodeURIComponent("Здравствуйте! Я хочу оплатить курс.")
  const whatsappLink = `https://wa.me/34641261559?text=${whatsappMessage}`

  const handleStripePayment = () => {
    window.open(stripeLink, "_blank")
    onClose()
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

                <div className="space-y-3">
                  <button
                    onClick={handleStripePayment}
                    className="flex w-full items-center justify-between rounded-xl border-2 border-[#1A1A1A] bg-[#1A1A1A] px-5 py-3.5 text-left transition-colors hover:bg-[#333] sm:px-6 sm:py-4"
                  >
                    <div>
                      <p className="font-sans text-sm font-semibold text-white sm:text-base">
                        Карта любой страны
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
