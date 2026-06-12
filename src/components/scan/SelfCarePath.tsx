"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { PaymentModal } from "@/components/PaymentModal"

export function SelfCarePath() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<"course" | "guide">("guide")

  const handlePaymentClick = (product: "course" | "guide") => {
    setSelectedProduct(product)
    setIsModalOpen(true)
  }

  return (
    <>
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="mb-8 rounded-lg border border-[#E5DDD5] bg-white p-6 md:p-8"
      >
        <h2 className="font-hero-face text-xl font-semibold text-[#1A1A1A] md:text-2xl">
          Соберите уход самостоятельно
        </h2>

        <p className="mt-4 font-body text-base leading-relaxed text-[#666] md:text-lg">
          По методичке и этим рекомендациям подберите средства, которые подходят именно вам. В курсе мы учим читать этикетки и понимать составы.
        </p>

        <div className="mt-6 space-y-3">
          <p className="font-body text-sm font-semibold text-[#1A1A1A]">
            Что искать в составах:
          </p>
          <ul className="font-body text-sm text-[#666] space-y-2 list-disc list-inside">
            <li>Шампунь по типу кожи головы (увлажняющий, для жирной, для чувствительной)</li>
            <li>Кондиционер для детangling и мягкости</li>
            <li>Маска 1-2 раза в неделю (протеины, аминокислоты, натуральные масла)</li>
            <li>Термозащита перед укладкой (силиконы, полимеры)</li>
          </ul>
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:gap-4">
          <button
            onClick={() => handlePaymentClick("guide")}
            className="inline-flex items-center justify-center rounded-sm bg-[#1A1A1A] px-6 py-3 font-sans text-sm font-semibold uppercase tracking-[0.08em] text-white transition-all hover:bg-[#333]"
          >
            Методичка за 12€
          </button>
          <button
            onClick={() => handlePaymentClick("course")}
            className="inline-flex items-center justify-center rounded-sm border-2 border-[#E0DCD6] px-6 py-3 font-sans text-sm font-semibold uppercase tracking-[0.08em] text-[#1A1A1A] transition-all hover:border-[#1A1A1A] hover:bg-[#1A1A1A]/5"
          >
            Полный курс за 38€
          </button>
        </div>
      </motion.section>

      <PaymentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        product={selectedProduct}
      />
    </>
  )
}
