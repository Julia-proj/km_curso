"use client"

import { motion } from "framer-motion"
import { useState } from "react"
import { ProductCard } from "./ProductCard"

interface Product {
  id: string
  name: string
  description: string
  price_eur: number
  image_path?: string
}

interface MadridPackPathProps {
  category: string
  products: Product[]
  gifts: Product[]
  packTotal: number
  savings: number
}

const categoryNames: Record<string, string> = {
  color: "Color",
  volume: "Volume",
  detox: "Detox",
  hydration: "Hydration"
}

export function MadridPackPath({ category, products, gifts, packTotal, savings }: MadridPackPathProps) {
  const [showShippingInfo, setShowShippingInfo] = useState(false)

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 0.5 }}
      className="mb-8 rounded-lg border border-[#E5DDD5] bg-white p-6 md:p-8"
    >
      <div className="mb-4 inline-flex rounded-sm bg-[#D9A19D]/20 px-3 py-1.5">
        <span className="font-sans text-xs font-semibold uppercase tracking-[0.12em] text-[#D9A19D]">
          только для Мадрида
        </span>
      </div>

      <h2 className="font-hero-face text-xl font-semibold text-[#1A1A1A] md:text-2xl">
        Готовый pack Limba {categoryNames[category] || category}
      </h2>

      <p className="mt-4 font-body text-base leading-relaxed text-[#666] md:text-lg">
        Если хочешь просто забрать готовое решение и не думать о составах —
        у нас в студии HAIRLAB Мадрид есть линейка Limba {categoryNames[category] || category}. Мы тестируем
        её на похожих волосах последние три года.
      </p>

      <p className="mt-2 font-body text-base font-semibold text-[#1A1A1A]">
        В наборе:
      </p>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            id={product.id}
            name={product.name}
            description={product.description}
            priceEur={product.price_eur}
            imagePath={product.image_path}
          />
        ))}
      </div>

      {gifts.length > 0 && (
        <>
          <p className="mt-6 font-body text-base font-semibold text-[#1A1A1A]">
            В подарок к набору:
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {gifts.map((gift) => (
              <ProductCard
                key={gift.id}
                id={gift.id}
                name={gift.name}
                description={gift.description}
                priceEur={gift.price_eur}
                imagePath={gift.image_path}
              />
            ))}
          </div>
        </>
      )}

      <div className="mt-6 flex flex-col gap-3 border-t border-[#E5DDD5] pt-6">
        <p className="font-body text-lg font-semibold text-[#1A1A1A]">
          Полный pack: {packTotal}€ · экономия {savings}€ от поштучных цен
        </p>

        <button className="inline-flex items-center justify-center rounded-sm bg-[#1A1A1A] px-6 py-3 font-sans text-sm font-semibold uppercase tracking-[0.08em] text-white transition-all hover:bg-[#333]">
          Забрать в студии Мадрид
        </button>

        <button
          onClick={() => setShowShippingInfo(!showShippingInfo)}
          className="font-body text-sm text-[#999] underline underline-offset-2 hover:text-[#666]"
        >
          Можно ли отправить в другой город?
        </button>

        {showShippingInfo && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="rounded-sm bg-[#F5F0ED] p-4"
          >
            <p className="font-body text-sm text-[#666]">
              Пока только pickup в студии Мадрид. Доставка по Испании появится в начале 2027 года.
            </p>
          </motion.div>
        )}
      </div>
    </motion.section>
  )
}
