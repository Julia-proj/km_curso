"use client"

import { useEffect, useState, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { QRCodeSVG } from "qrcode.react"

function PickupSuccessContent() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get("session_id")
  
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [orderData, setOrderData] = useState<any>(null)

  useEffect(() => {
    async function loadOrderData() {
      if (!sessionId) {
        setError("Сессия не найдена")
        setLoading(false)
        return
      }

      try {
        const response = await fetch(`/api/orders/session/${sessionId}`)
        if (!response.ok) throw new Error("Failed to fetch")
        const parsed = await response.json()
        setOrderData(parsed)
        setLoading(false)
      } catch (e) {
        setError("Не удалось загрузить данные заказа")
        setLoading(false)
      }
    }

    loadOrderData()
  }, [sessionId])

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

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#FAF7F4]">
        <div className="max-w-md text-center">
          <p className="font-body text-lg text-[#666]">{error}</p>
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

  const orderId = orderData?.id || sessionId?.substring(0, 8).toUpperCase()

  return (
    <main className="min-h-screen bg-[#FAF7F4] py-12">
      <div className="km-container">
        <div className="mx-auto max-w-lg text-center">
          <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <svg
              className="h-8 w-8 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>

          <h1 className="font-hero-face text-3xl font-semibold text-[#1A1A1A] md:text-4xl">
            Спасибо!
          </h1>

          <p className="mt-4 font-body text-lg text-[#666]">
            Заказ #{orderId} оплачен
          </p>

          <div className="mt-8 rounded-lg border border-[#E5DDD5] bg-white p-6">
            <h2 className="font-hero-face text-lg font-semibold text-[#1A1A1A]">
              Забери в студии HAIRLAB Madrid
            </h2>

            <div className="mt-4 space-y-3">
              <div>
                <p className="font-body text-sm text-[#999]">Адрес</p>
                <p className="font-body text-base font-semibold text-[#1A1A1A]">
                  Calle Velazquez 45, Madrid
                </p>
              </div>

              <div>
                <p className="font-body text-sm text-[#999]">Часы работы</p>
                <p className="font-body text-base text-[#1A1A1A]">
                  Пн-Сб 10:00-20:00
                </p>
              </div>
            </div>

            <div className="mt-6 border-t border-[#E5DDD5] pt-6">
              <p className="font-body text-sm text-[#666]">
                Покажи менеджеру QR-код или номер заказа на ресепшене
              </p>

              <div className="mt-4 flex justify-center">
                <div className="rounded-lg bg-white p-4 shadow-md">
                  <QRCodeSVG
                    value={orderId}
                    size={180}
                    level="H"
                    includeMargin={false}
                  />
                </div>
              </div>

              <p className="mt-4 font-body text-sm font-semibold text-[#1A1A1A]">
                Номер заказа: {orderId}
              </p>
            </div>
          </div>

          <div className="mt-6">
            <a
              href="/"
              className="inline-block font-body text-[#D9A19D] underline underline-offset-2 hover:text-[#1A1A1A]"
            >
              На главную
            </a>
          </div>
        </div>
      </div>
    </main>
  )
}

export default function PickupSuccessPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-[#FAF7F4]">
        <div className="text-center">
          <div className="mb-4 h-8 w-8 animate-spin rounded-full border-2 border-[#D9A19D] border-t-transparent" />
          <p className="font-body text-[#666]">Загрузка...</p>
        </div>
      </div>
    }>
      <PickupSuccessContent />
    </Suspense>
  )
}
