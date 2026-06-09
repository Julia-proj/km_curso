"use client"

import { useEffect, useState, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { ProductCard } from "@/components/scan/ProductCard"

interface Product {
  id: string
  name: string
  description: string
  price_eur: number
  image_path?: string
}

interface RecommendationData {
  id: string
  user_email: string
  primary_category: string
  recommended_product_ids: string[]
  products?: Product[]
  pack_total_eur?: number
}

function PickupContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const recommendationId = searchParams.get("recommendation_id")
  
  const [data, setData] = useState<RecommendationData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [preferredTime, setPreferredTime] = useState("")

  useEffect(() => {
    async function loadData() {
      if (!recommendationId) {
        setError("Рекомендация не найдена")
        setLoading(false)
        return
      }

      try {
        const response = await fetch(`/api/recommendations/${recommendationId}`)
        if (!response.ok) throw new Error("Failed to fetch")
        const parsed = await response.json()
        setData(parsed)
        setLoading(false)
      } catch (e) {
        setError("Не удалось загрузить данные")
        setLoading(false)
      }
    }

    loadData()
  }, [recommendationId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!data) return

    setSubmitting(true)
    try {
      const response = await fetch("/api/checkout/pack", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recommendation_id: data.id,
          customer_name: name,
          customer_phone: phone,
          preferred_time: preferredTime
        })
      })

      if (!response.ok) throw new Error("Failed to create checkout")

      const { url } = await response.json()
      if (url) {
        window.location.href = url
      }
    } catch (e) {
      setError("Ошибка оформления заказа")
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#FAF7F4]">
        <div className="text-center">
          <div className="mb-4 h-8 w-8 animate-spin rounded-full border-2 border-[#D9A19D] border-t-transparent" />
          <p className="font-body text-[#666]">Загрузка...</p>
        </div>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#FAF7F4]">
        <div className="max-w-md text-center">
          <p className="font-body text-lg text-[#666]">{error || "Что-то пошло не так"}</p>
          <a
            href="/"
            className="mt-4 inline-block font-body text-[#D9A19D] underline underline-offset-2"
          >
            На главную
          </a>
        </div>
      </div>
    )
  }

  const products = data.products || []
  const total = data.pack_total_eur || products.reduce((sum, p) => sum + p.price_eur, 0)

  return (
    <main className="min-h-screen bg-[#FAF7F4] py-12">
      <div className="km-container">
        <div className="mx-auto max-w-2xl">
          <h1 className="font-hero-face text-3xl font-semibold text-[#1A1A1A] md:text-4xl">
            Оформление заказа
          </h1>

          <div className="mt-6 rounded-lg border border-[#E5DDD5] bg-white p-6">
            <h2 className="font-hero-face text-lg font-semibold text-[#1A1A1A]">
              Состав заказа
            </h2>

            <div className="mt-4 space-y-3">
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

            <div className="mt-6 border-t border-[#E5DDD5] pt-4">
              <div className="flex justify-between">
                <span className="font-body text-lg font-semibold text-[#1A1A1A]">
                  Итого
                </span>
                <span className="font-body text-lg font-semibold text-[#1A1A1A]">
                  {total}€
                </span>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="mt-6 rounded-lg border border-[#E5DDD5] bg-white p-6">
            <h2 className="font-hero-face text-lg font-semibold text-[#1A1A1A]">
              Контактные данные
            </h2>

            <div className="mt-4 space-y-4">
              <div>
                <label htmlFor="name" className="block font-body text-sm font-semibold text-[#1A1A1A]">
                  Имя *
                </label>
                <input
                  id="name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1 w-full rounded-sm border border-[#E5DDD5] bg-white px-4 py-2.5 font-body text-[#1A1A1A] focus:border-[#D9A19D] focus:outline-none"
                  placeholder="Ваше имя"
                />
              </div>

              <div>
                <label htmlFor="phone" className="block font-body text-sm font-semibold text-[#1A1A1A]">
                  Телефон *
                </label>
                <input
                  id="phone"
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="mt-1 w-full rounded-sm border border-[#E5DDD5] bg-white px-4 py-2.5 font-body text-[#1A1A1A] focus:border-[#D9A19D] focus:outline-none"
                  placeholder="+34 600 000 000"
                />
              </div>

              <div>
                <label htmlFor="time" className="block font-body text-sm font-semibold text-[#1A1A1A]">
                  Удобное время захода (опционально)
                </label>
                <input
                  id="time"
                  type="text"
                  value={preferredTime}
                  onChange={(e) => setPreferredTime(e.target.value)}
                  className="mt-1 w-full rounded-sm border border-[#E5DDD5] bg-white px-4 py-2.5 font-body text-[#1A1A1A] focus:border-[#D9A19D] focus:outline-none"
                  placeholder="Например: завтра после 15:00"
                />
              </div>
            </div>

            <div className="mt-6 rounded-sm bg-[#F5F0ED] p-4">
              <p className="font-body text-sm text-[#666]">
                Pickup в студии HAIRLAB Madrid
              </p>
              <p className="mt-1 font-body text-sm font-semibold text-[#1A1A1A]">
                Calle Velazquez 45, Madrid
              </p>
            </div>

            {error && (
              <div className="mt-4 rounded-sm bg-red-50 p-3">
                <p className="font-body text-sm text-red-600">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="mt-6 w-full rounded-sm bg-[#1A1A1A] px-6 py-3 font-sans text-sm font-semibold uppercase tracking-[0.08em] text-white transition-all hover:bg-[#333] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? "Обработка..." : "Оплатить и забрать в студии"}
            </button>
          </form>
        </div>
      </div>
    </main>
  )
}

export default function PickupPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-[#FAF7F4]">
        <div className="text-center">
          <div className="mb-4 h-8 w-8 animate-spin rounded-full border-2 border-[#D9A19D] border-t-transparent" />
          <p className="font-body text-[#666]">Загрузка...</p>
        </div>
      </div>
    }>
      <PickupContent />
    </Suspense>
  )
}
