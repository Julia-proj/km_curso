"use client"

import { Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { TelegramAccessCard } from "@/components/dashboard/TelegramAccessCard"

function CheckoutSuccessContent() {
  const searchParams = useSearchParams()
  const product = searchParams.get("product")
  const isCourse = product === "course"

  return (
    <main className="min-h-screen bg-[#FAF7F4] py-16">
      <div className="km-container">
        <div className="mx-auto max-w-lg">
          {/* Check mark */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "52px",
              height: "52px",
              border: "1px solid rgba(160, 132, 92, 0.4)",
              marginBottom: "2rem",
            }}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#A0845C"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M20 6L9 17L4 12" />
            </svg>
          </div>

          <p
            style={{
              fontFamily: "var(--font-body-face), Inter, sans-serif",
              fontSize: "0.6875rem",
              fontWeight: 500,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "#A0845C",
              marginBottom: "0.75rem",
            }}
          >
            Оплата прошла
          </p>

          <h1
            className="font-hero-face"
            style={{
              fontSize: "clamp(1.75rem, 5vw, 2.5rem)",
              fontWeight: 600,
              color: "#1A1A1A",
              lineHeight: 1.15,
              marginBottom: "1rem",
            }}
          >
            {isCourse ? "Добро пожаловать в курс" : "Методичка твоя"}
          </h1>

          <p
            style={{
              fontFamily: "var(--font-body-face), Inter, sans-serif",
              fontSize: "1rem",
              color: "#666",
              lineHeight: 1.65,
              marginBottom: "2.5rem",
            }}
          >
            {isCourse
              ? "Доступ к курсу откроется в течение нескольких минут. Мы пришлём письмо с инструкцией на твой email."
              : "Методичка будет отправлена на твой email в течение нескольких минут."}
          </p>

          <div
            style={{
              width: "100%",
              height: "1px",
              background: "rgba(160, 132, 92, 0.2)",
              marginBottom: "2.5rem",
            }}
          />

          {/* Telegram card — only for course */}
          <TelegramAccessCard hasCourse={isCourse} />

          <div style={{ marginTop: "2.5rem" }}>
            <a
              href="/"
              style={{
                fontFamily: "var(--font-body-face), Inter, sans-serif",
                fontSize: "0.875rem",
                color: "#A0845C",
                textDecoration: "underline",
                textUnderlineOffset: "3px",
              }}
            >
              На главную
            </a>
          </div>
        </div>
      </div>
    </main>
  )
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#FAF7F4]">
          <div className="mb-4 h-8 w-8 animate-spin rounded-full border-2 border-[#D9A19D] border-t-transparent" />
        </div>
      }
    >
      <CheckoutSuccessContent />
    </Suspense>
  )
}
