"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { TelegramAccessCard } from "@/components/dashboard/TelegramAccessCard"

export default function DashboardPage() {
  const router = useRouter()
  const [hasCourse, setHasCourse] = useState(false)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const session = localStorage.getItem("session")
    if (!session) {
      router.push("/")
      return
    }
    const paid = localStorage.getItem("hasPaidCourse") === "true"
    setHasCourse(paid)
    setReady(true)
  }, [router])

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#FAF7F4]">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#D9A19D] border-t-transparent" />
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-[#FAF7F4]">
      <header
        style={{
          borderBottom: "1px solid rgba(160, 132, 92, 0.2)",
          background: "#FAF7F4",
          padding: "1rem 0",
        }}
      >
        <div className="km-container">
          <span
            style={{
              fontFamily: "var(--font-hero-face), Manrope, sans-serif",
              fontSize: "0.875rem",
              fontWeight: 600,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "#1A1A1A",
            }}
          >
            HAIRLAB
          </span>
        </div>
      </header>

      <div className="km-container" style={{ maxWidth: "calc(640px + var(--page-x) * 2)", padding: "3rem var(--page-x)" }}>
        {/* ── «Продолжить» widget placeholder ── */}
        {/* TODO: вставить виджет Продолжить здесь */}

        {/* ── Telegram access card ── */}
        <div style={{ marginTop: "1.5rem" }}>
          <TelegramAccessCard hasCourse={hasCourse} />
        </div>

        {/* Quick links */}
        <nav
          style={{
            marginTop: "2.5rem",
            display: "flex",
            flexDirection: "column",
            gap: "0",
            borderTop: "1px solid rgba(160, 132, 92, 0.2)",
          }}
        >
          {[
            { label: "AI-диагностика", href: "/dashboard/diagnostika" },
            { label: "Методички", href: "/dashboard/downloads" },
          ].map(({ label, href }) => (
            <a
              key={href}
              href={href}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "1rem 0",
                borderBottom: "1px solid rgba(160, 132, 92, 0.2)",
                fontFamily: "var(--font-body-face), Inter, sans-serif",
                fontSize: "0.9375rem",
                color: "#1A1A1A",
                textDecoration: "none",
              }}
            >
              {label}
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#A0845C"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M9 18L15 12L9 6" />
              </svg>
            </a>
          ))}
        </nav>
      </div>
    </main>
  )
}
