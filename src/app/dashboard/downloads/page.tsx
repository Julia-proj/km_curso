"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

interface AccessState {
  loading: boolean
  hasAccess: boolean
  email: string
}

const GUIDES = [
  {
    id: "guide-01",
    title: "Методичка: Основной уход",
    subtitle: "Шампуни, маски, кондиционеры, термозащита",
    pages: 81,
    cover: "/images/guia_pdf.PNG",
  },
  {
    id: "guide-02",
    title: "Методичка: Аксессуары",
    subtitle: "Полотенца, расчёски, резинки, материалы для сна",
    pages: 19,
    cover: "/images/acces_pdf.PNG",
  },
]

export default function DownloadsPage() {
  const router = useRouter()
  const [state, setState] = useState<AccessState>({
    loading: true,
    hasAccess: false,
    email: "",
  })
  const [downloading, setDownloading] = useState<string | null>(null)

  useEffect(() => {
    // Dev bypass - skip auth for now
    setState({
      loading: false,
      hasAccess: true,
      email: "dev@example.com",
    })
  }, [router])

  const handleDownload = async (guideId: string) => {
    setDownloading(guideId)
    try {
      const url = `/api/download/${guideId}?email=${encodeURIComponent(state.email)}`
      const res = await fetch(url)
      if (!res.ok) throw new Error("Download failed")
      const blob = await res.blob()
      const a = document.createElement("a")
      a.href = URL.createObjectURL(blob)
      a.download =
        res.headers.get("content-disposition")?.match(/filename="(.+)"/)?.[1] ??
        `hairlab-${guideId}.pdf`
      a.click()
      URL.revokeObjectURL(a.href)
    } catch {
      // silent — user sees no change, can retry
    } finally {
      setDownloading(null)
    }
  }

  if (state.loading) {
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
        <div className="km-container" style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <button
            onClick={() => router.push("/dashboard")}
            aria-label="Назад"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.375rem",
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "#A0845C",
              fontSize: "0.875rem",
              fontFamily: "var(--font-body-face), Inter, sans-serif",
              padding: 0,
            }}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M15 18L9 12L15 6" />
            </svg>
            Кабинет
          </button>
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

      <div
        className="km-container"
        style={{ maxWidth: "calc(640px + var(--page-x) * 2)", padding: "3rem var(--page-x)" }}
      >
        <h1
          style={{
            fontFamily: "var(--font-hero-face), Manrope, sans-serif",
            fontSize: "clamp(1.5rem, 4vw, 2rem)",
            fontWeight: 600,
            color: "#1A1A1A",
            marginBottom: "0.5rem",
          }}
        >
          Методички
        </h1>
        <p
          style={{
            fontFamily: "var(--font-body-face), Inter, sans-serif",
            fontSize: "0.9375rem",
            color: "#888",
            marginBottom: "2.5rem",
          }}
        >
          Персональные PDF-файлы для скачивания
        </p>

        {!state.hasAccess ? (
          <NoAccessBlock />
        ) : (
          <>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
                gap: "1.25rem",
                marginBottom: "2rem",
              }}
            >
              {GUIDES.map((guide) => (
                <GuideCard
                  key={guide.id}
                  guide={guide}
                  onDownload={() => handleDownload(guide.id)}
                  isDownloading={downloading === guide.id}
                />
              ))}
            </div>

            <p
              style={{
                fontFamily: "var(--font-body-face), Inter, sans-serif",
                fontSize: "0.8125rem",
                color: "#A0845C",
                lineHeight: 1.6,
              }}
            >
              На каждой странице твой email. Файлы персональные, не передавай их.
            </p>
          </>
        )}
      </div>
    </main>
  )
}

function GuideCard({
  guide,
  onDownload,
  isDownloading,
}: {
  guide: (typeof GUIDES)[number]
  onDownload: () => void
  isDownloading: boolean
}) {
  return (
    <article
      style={{
        background: "#fff",
        border: "1px solid rgba(160, 132, 92, 0.18)",
        borderRadius: "16px",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Cover image */}
      <div
        style={{
          background: "#fff",
          aspectRatio: "3/4",
          overflow: "hidden",
          borderRadius: "16px 16px 0 0",
        }}
      >
        <img
          src={guide.cover}
          alt={guide.title}
          style={{ width: "100%", height: "100%", objectFit: "contain", display: "block" }}
          onError={(e) => {
            ;(e.currentTarget as HTMLImageElement).style.display = "none"
          }}
        />
      </div>

      {/* Info + button */}
      <div style={{ padding: "1.25rem", display: "flex", flexDirection: "column", gap: "0.75rem", flex: 1 }}>
        <div>
          <p
            style={{
              fontFamily: "var(--font-hero-face), Manrope, sans-serif",
              fontSize: "1rem",
              fontWeight: 600,
              color: "#1A1A1A",
              marginBottom: "0.25rem",
            }}
          >
            {guide.title}
          </p>
          <p
            style={{
              fontFamily: "var(--font-body-face), Inter, sans-serif",
              fontSize: "0.8125rem",
              color: "#888",
            }}
          >
            {guide.subtitle}
          </p>
        </div>

        <p
          style={{
            fontFamily: "var(--font-body-face), Inter, sans-serif",
            fontSize: "0.75rem",
            color: "#A0845C",
            letterSpacing: "0.04em",
          }}
        >
          PDF · {guide.pages} стр.
        </p>

        <button
          onClick={onDownload}
          disabled={isDownloading}
          style={{
            marginTop: "auto",
            width: "100%",
            padding: "0.75rem 1rem",
            background: isDownloading ? "rgba(160, 132, 92, 0.12)" : "#1A1A1A",
            color: isDownloading ? "#A0845C" : "#FAF7F4",
            border: "none",
            borderRadius: "8px",
            fontFamily: "var(--font-body-face), Inter, sans-serif",
            fontSize: "0.875rem",
            fontWeight: 500,
            cursor: isDownloading ? "default" : "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.5rem",
            transition: "background 0.15s",
          }}
        >
          {isDownloading ? (
            <>
              <span
                style={{
                  width: "14px",
                  height: "14px",
                  border: "1.5px solid #A0845C",
                  borderTopColor: "transparent",
                  borderRadius: "50%",
                  display: "inline-block",
                  animation: "spin 0.7s linear infinite",
                }}
              />
              Подготовка…
            </>
          ) : (
            <>
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M12 15V3m0 12l-4-4m4 4l4-4M2 17l.621 2.485A2 2 0 004.561 21h14.878a2 2 0 001.94-1.515L22 17" />
              </svg>
              Скачать
            </>
          )}
        </button>
      </div>
    </article>
  )
}

function NoAccessBlock() {
  return (
    <div
      style={{
        padding: "2.5rem 2rem",
        background: "#fff",
        border: "1px solid rgba(160, 132, 92, 0.18)",
        borderRadius: "16px",
        textAlign: "center",
        maxWidth: "480px",
      }}
    >
      <p
        style={{
          fontFamily: "var(--font-hero-face), Manrope, sans-serif",
          fontSize: "1.25rem",
          fontWeight: 600,
          color: "#1A1A1A",
          marginBottom: "0.75rem",
        }}
      >
        Методички не приобретены
      </p>
      <p
        style={{
          fontFamily: "var(--font-body-face), Inter, sans-serif",
          fontSize: "0.9375rem",
          color: "#888",
          lineHeight: 1.65,
          marginBottom: "2rem",
        }}
      >
        Получи обе методички вместе с курсом или купи их отдельно.
      </p>
      <a
        href="/#offer"
        style={{
          display: "inline-block",
          padding: "0.8125rem 2rem",
          background: "#1A1A1A",
          color: "#FAF7F4",
          borderRadius: "8px",
          fontFamily: "var(--font-body-face), Inter, sans-serif",
          fontSize: "0.9375rem",
          fontWeight: 500,
          textDecoration: "none",
        }}
      >
        Посмотреть курс
      </a>
    </div>
  )
}
