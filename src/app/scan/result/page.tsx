"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
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

export default function ScanResultPage() {
  const searchParams = useSearchParams()
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

  return (
    <main className="min-h-screen bg-[#FAF7F4]">
      <ResultHero
        summary={data.diagnostic.summary}
        damageLevel={data.diagnostic.damage_level}
        visibleSigns={data.diagnostic.visible_signs}
        mainIssues={data.diagnostic.main_issues}
      />

      <div className="km-container">
        <div className="mb-8">
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
        </div>
      </div>
    </main>
  )
}
