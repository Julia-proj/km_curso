"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

export default function DashboardPage() {
  const router = useRouter()
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const session = localStorage.getItem("session")
    if (!session) {
      router.push("/")
      return
    }
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
        <h1
          style={{
            fontFamily: "var(--font-hero-face), Manrope, sans-serif",
            fontSize: "clamp(1.5rem, 4vw, 2rem)",
            fontWeight: 600,
            color: "#1A1A1A",
            marginBottom: "2rem",
          }}
        >
          Добро пожаловать
        </h1>

        {/* Menu */}
        <nav
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "0",
            borderTop: "1px solid rgba(160, 132, 92, 0.2)",
          }}
        >
          {[
            { label: "Видео уроки", href: "/dashboard/lessons" },
            { label: "AI-диагностика", href: "/scan" },
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
