"use client"

import { Suspense, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { useRouter } from "next/navigation"
import { SuccessActionCard } from "@/components/checkout/SuccessActionCard"
import { TELEGRAM_PRIVATE_INVITE } from "@/lib/constants"
import { createClient } from "@/lib/supabase/client"
import { isDevBypass } from "@/lib/dev-bypass"

function CheckoutSuccessContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const product = searchParams.get("product")
  const isCourse = product === "course"
  const isGuide = product === "guide"

  // Auth check - user should be logged in after payment
  useEffect(() => {
    const checkAuth = async () => {
      // Dev bypass - skip auth check
      if (isDevBypass()) {
        return
      }
      
      const supabase = createClient()
      if (!supabase) {
        // Auth not configured, skip check
        return
      }

      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session) {
        router.push("/auth/login")
      }
    }
    checkAuth()
  }, [router])

  return (
    <main className="min-h-screen bg-[#FAF7F4] py-16">
      <div className="km-container">
        <div className="mx-auto max-w-2xl">
          {/* Back button */}
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors mb-8"
          >
            ← Назад
          </button>

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
            {isCourse ? "Доступ к курсу открыт" : "Доступ к методичкам открыт"}
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
              ? "Доступ к курсу откроется в течение нескольких минут. Выбери, с чего начать:"
              : "Обе методички уже доступны для скачивания в личном кабинете:"}
          </p>

          {/* Action cards */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
              marginBottom: "2.5rem",
            }}
          >
            {/* Video lessons - only for course */}
            {isCourse && (
              <SuccessActionCard
                icon={
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
                    <polygon points="5 3 19 12 5 21 5 3" />
                  </svg>
                }
                label="Видеоуроки"
                description="Продолжить смотреть уроки курса"
                href="/dashboard/lessons"
              />
            )}

            {/* AI diagnostics - only for course */}
            {isCourse && (
              <SuccessActionCard
                icon={
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
                    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                    <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                    <line x1="12" y1="22.08" x2="12" y2="12" />
                  </svg>
                }
                label="AI-анализ волос"
                description="Загрузи фото и получи персональный анализ"
                href="/dashboard/diagnostika"
              />
            )}

            {/* Downloads - for both course and guide */}
            <SuccessActionCard
              icon={
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
                  <path d="M12 15V3m0 12l-4-4m4 4l4-4M2 17l.621 2.485A2 2 0 004.561 21h14.878a2 2 0 001.94-1.515L22 17" />
                </svg>
              }
              label="Методички"
              description={isCourse ? "Скачать PDF-файлы с материалами курса" : "Скачать методичку"}
              href="/dashboard/downloads"
            />

            {/* Telegram - only for course */}
            {isCourse && (
              <SuccessActionCard
                icon={
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
                    <path d="M22 2L11 13" />
                    <path d="M22 2L15 22L11 13L2 9L22 2Z" />
                  </svg>
                }
                label="Telegram канал"
                description="Присоединяйся к закрытому каналу с дополнительными материалами"
                href={TELEGRAM_PRIVATE_INVITE}
                external
              />
            )}
          </div>

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
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#D9A19D] border-t-transparent" />
        </div>
      }
    >
      <CheckoutSuccessContent />
    </Suspense>
  )
}
