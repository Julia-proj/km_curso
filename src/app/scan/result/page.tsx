"use client"

import { useEffect, useState, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { ResultHero } from "@/components/scan/ResultHero"
import { SelfCarePath } from "@/components/scan/SelfCarePath"
import { MadridPackPath } from "@/components/scan/MadridPackPath"
import { TalkToElenaPath } from "@/components/scan/TalkToElenaPath"

interface DiagnosticData {
  damage_level: number
  visible_signs: string[]
  main_issues: string[]
  summary: string
  self_care_priorities: string[]
}

interface RecommendationData {
  primary_category: string
  secondary_category?: string
  product_ids: string[]
  gift_ids: string[]
  reasoning_summary: string
  reasoning_details: {
    why_primary: string
    why_products: { product_id: string; reason: string }[]
  }
  pack_total_eur: number
  estimated_savings_eur: number
  products?: any[]
  gifts?: any[]
}

interface ScanResult {
  diagnostic: DiagnosticData
  recommendation: RecommendationData
  had_quiz: boolean
}

function ScanResultContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [data, setData] = useState<ScanResult | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadResult() {
      const resultParam = searchParams.get("result")
      const recommendationId = searchParams.get("recommendation_id")

      if (resultParam) {
        try {
          const parsed = JSON.parse(atob(resultParam))
          setData(parsed)
          setLoading(false)
        } catch (e) {
          setError("Не удалось загрузить результат")
          setLoading(false)
        }
      } else if (recommendationId) {
        try {
          const response = await fetch(`/api/recommendations/${recommendationId}`)
          if (!response.ok) throw new Error("Failed to fetch")
          const parsed = await response.json()
          setData(parsed)
          setLoading(false)
        } catch (e) {
          setError("Не удалось загрузить результат")
          setLoading(false)
        }
      } else {
        setError("Результат не найден")
        setLoading(false)
      }
    }

    loadResult()
  }, [searchParams])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center" style={{ background: "var(--color-cream)" }}>
        <div className="text-center">
          <div className="mb-4 h-8 w-8 animate-spin rounded-full border-2 border-[#D9A19D] border-t-transparent" />
          <p className="font-body text-[#666]">Загрузка...</p>
        </div>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="flex min-h-screen items-center justify-center" style={{ background: "var(--color-cream)" }}>
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

  return (
    <main className="min-h-screen" style={{ background: "var(--color-cream)" }}>
      <div className="km-container" style={{ paddingTop: "2rem" }}>
        <a
          href="/dashboard"
          className="inline-flex items-center gap-2 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors mb-6"
        >
          ← В кабинет
        </a>
      </div>

      <ResultHero
        summary={data.diagnostic.summary}
        damageLevel={data.diagnostic.damage_level}
        visibleSigns={data.diagnostic.visible_signs}
        mainIssues={data.diagnostic.main_issues}
        selfCarePriorities={data.diagnostic.self_care_priorities}
        primaryCategory={data.recommendation.primary_category}
      />

      <div className="km-container" style={{ paddingBottom: "3rem" }}>
        <div
          style={{
            maxWidth: "760px",
            margin: "0 auto",
            padding: "1.5rem",
            background: "var(--color-paper)",
            border: "1px solid var(--color-line)",
            borderRadius: "8px",
          }}
        >
          <p
            style={{
              fontFamily: "var(--font-body-face), Inter, sans-serif",
              fontSize: "0.9375rem",
              lineHeight: 1.6,
              color: "var(--color-ink)",
            }}
          >
            Это краткая выжимка. Все детальные рекомендации и техники — в видео-модулях и методичках вашего курса.
          </p>
          <a
            href="/dashboard"
            style={{
              display: "inline-block",
              marginTop: "0.75rem",
              fontFamily: "var(--font-body-face), Inter, sans-serif",
              fontSize: "0.875rem",
              color: "var(--color-bronze)",
              textDecoration: "underline",
            }}
          >
            Перейти в личный кабинет →
          </a>
        </div>
      </div>

      <div className="km-container">
        <div className="mb-8 pt-14">
          <h2 className="font-hero-face text-2xl font-semibold text-[#1A1A1A] md:text-3xl">
            У тебя есть выбор.
          </h2>
        </div>

        <div className="mx-auto max-w-3xl space-y-8 pb-16">
          <SelfCarePath />

          {data.recommendation.products && data.recommendation.products.length > 0 && (
            <MadridPackPath
              category={data.recommendation.primary_category}
              products={data.recommendation.products}
              gifts={data.recommendation.gifts || []}
              packTotal={data.recommendation.pack_total_eur}
              savings={data.recommendation.estimated_savings_eur}
            />
          )}

          <TalkToElenaPath />

          <div
            style={{
              marginTop: "4rem",
              padding: "2rem",
              background: "var(--color-paper)",
              border: "1px solid var(--color-line)",
              borderRadius: "8px",
            }}
          >
            <p
              style={{
                fontFamily: "var(--font-body-face), Inter, sans-serif",
                fontSize: "0.875rem",
                lineHeight: 1.6,
                color: "var(--color-ink-soft)",
                marginBottom: "1rem",
              }}
            >
              Все рекомендации являются предварительными и основаны на ваших ответах и AI-анализе фотографии. Для точного подбора рекомендуется изучение методичек, видео-уроков или консультация специалиста.
            </p>
            <p
              style={{
                fontFamily: "var(--font-body-face), Inter, sans-serif",
                fontSize: "0.875rem",
                lineHeight: 1.6,
                color: "var(--color-ink-soft)",
              }}
            >
              Набор можно забрать в салоне по адресу:{" "}
              <a
                href="https://wa.me/34641261559"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "var(--color-bronze)", textDecoration: "underline" }}
              >
                Altamirano 33, Мадрид (написать в WhatsApp)
              </a>
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}

export default function ScanResultPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center" style={{ background: "var(--color-cream)" }}>
        <div className="text-center">
          <div className="mb-4 h-8 w-8 animate-spin rounded-full border-2 border-[#D9A19D] border-t-transparent" />
          <p className="font-body text-[#666]">Загрузка...</p>
        </div>
      </div>
    }>
      <ScanResultContent />
    </Suspense>
  )
}
