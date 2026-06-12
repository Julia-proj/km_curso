"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { PostPaymentNav } from "@/components/Navigation"
import { SuccessActionCard } from "@/components/checkout/SuccessActionCard"
import { TELEGRAM_PRIVATE_INVITE } from "@/lib/constants"
import { createClient } from "@/lib/supabase/client"

export default function DashboardPage() {
  const router = useRouter()
  const [ready, setReady] = useState(false)
  const [hasFullCourse, setHasFullCourse] = useState(false)
  const [hasMethodichka, setHasMethodichka] = useState(false)

  useEffect(() => {
    const checkAccess = async () => {
      const supabase = createClient()
      if (!supabase) {
        // Auth not configured, allow access for now
        setReady(true)
        return
      }

      // Dev bypass - allow access without payment
      const isDevBypass = process.env.NEXT_PUBLIC_DEV_BYPASS_PAYWALL === 'true' || 
                         process.env.NEXT_PUBLIC_VERCEL_ENV === 'preview'
      
      if (isDevBypass) {
        setHasFullCourse(true)
        setHasMethodichka(true)
        setReady(true)
        return
      }

      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        router.push("/auth/login")
        return
      }

      // Check if user has paid access
      const { data: profile } = await supabase
        .from('profiles')
        .select('has_full_course, has_methodichka')
        .eq('email', user.email)
        .single()

      if (profile && (profile.has_full_course || profile.has_methodichka)) {
        setHasFullCourse(profile.has_full_course || false)
        setHasMethodichka(profile.has_methodichka || false)
      } else {
        router.push("/")
        return
      }

      setReady(true)
    }
    checkAccess()
  }, [router])

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#FAF7F4]">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#D9A19D] border-t-transparent" />
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-[#FAF7F4] py-16">
      <div className="km-container">
        <div className="mx-auto max-w-2xl">
          <PostPaymentNav showBack={false} />
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
            {hasFullCourse && (
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
            {hasFullCourse && (
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
            {hasMethodichka && (
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
                description={hasFullCourse ? "Скачать PDF-файлы с материалами курса" : "Скачать методичку"}
                href="/dashboard/downloads"
              />
            )}

            {/* Telegram - only for course */}
            {hasFullCourse && (
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
