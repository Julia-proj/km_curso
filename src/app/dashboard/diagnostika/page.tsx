"use client"

import { useEffect, useState, useRef } from "react"
import { useRouter } from "next/navigation"
import imageCompression from "browser-image-compression"
import { PostPaymentNav } from "@/components/Navigation"
import { useQuizStore } from "@/stores/quiz-store"
import { saveDiagnosis } from "@/lib/progress"
import { ensureHeatProtectionAdvice } from "@/lib/recommendations/pick-products"
import { createClient } from "@/lib/supabase/client"
import { isDevBypass } from "@/lib/dev-bypass"

type LimbaCategory = 'color' | 'volume' | 'detox' | 'hydration'

interface DiagnosisResult {
  damageLevel: number
  signs: string[]
  recommendations: string[]
  summary: string
  recommendedCategory?: LimbaCategory | null
  secondaryCategory?: LimbaCategory | null
}

export default function DiagnostikaPage() {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const quizAnswers = useQuizStore((s) => s.answers)

  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
  const [hasPaidCourse, setHasPaidCourse] = useState<boolean | null>(null)
  // True when the free quiz was never taken (checked after mount — the quiz
  // lives in localStorage). Analysis still works by photo alone.
  const [quizMissing, setQuizMissing] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [result, setResult] = useState<DiagnosisResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setQuizMissing(Object.keys(useQuizStore.getState().answers).length === 0)
  }, [])

  // Auth and course check - requires paid course access
  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createClient()
      if (!supabase) {
        // Auth not configured, allow access for now
        setIsAuthenticated(true)
        setHasPaidCourse(true)
        return
      }

      // Dev bypass - allow access without payment
      if (isDevBypass()) {
        setIsAuthenticated(true)
        setHasPaidCourse(true)
        return
      }

      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        router.push("/auth/login")
        return
      }

      // Check if user has paid access using user id
      const { data: profile } = await supabase
        .from('profiles')
        .select('has_full_course')
        .eq('id', user.id)
        .single()

      if (profile && profile.has_full_course) {
        setIsAuthenticated(true)
        setHasPaidCourse(true)
      } else {
        router.push("/offer")
        return
      }
    }

    checkAuth()
  }, [router])

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith("image/")) {
      setError("Пожалуйста, выберите изображение")
      return
    }

    try {
      // Compress image to max 1024px
      const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 1024,
        useWebWorker: true,
      }
      
      const compressedFile = await imageCompression(file, options)
      setSelectedFile(compressedFile)
      
      // Create preview
      const url = URL.createObjectURL(compressedFile)
      setPreviewUrl(url)
      setError(null)
    } catch (err) {
      setError("Ошибка при обработке изображения")
    }
  }

  const handleUploadClick = () => {
    fileInputRef.current?.click()
  }

  const handleAnalyze = async () => {
    if (!selectedFile) return

    setIsAnalyzing(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append("photo", selectedFile)
      // Send the quiz so the AI combines the test with the photo.
      if (quizAnswers && Object.keys(quizAnswers).length > 0) {
        formData.append("quiz", JSON.stringify(quizAnswers))
      }

      const response = await fetch("/api/diagnose", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Ошибка анализа")
      }

      const data: DiagnosisResult = await response.json()
      const recommendations = ensureHeatProtectionAdvice(data.recommendations, quizAnswers)
      const enriched = { ...data, recommendations }
      setResult(enriched)
      saveDiagnosis(enriched)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Произошла ошибка")
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleReset = () => {
    setSelectedFile(null)
    setPreviewUrl(null)
    setResult(null)
    setError(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleSelectCare = () => {
    // Send the user to the personalised Limba care page (funnel-gated)
    router.push("/dashboard/care")
  }

  // Loading state while checking auth
  if (isAuthenticated === null || hasPaidCourse === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--primary)]"></div>
          <p className="mt-4 text-[var(--muted-foreground)]">Загрузка...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Header */}
      <header className="border-b border-[var(--border)] bg-[var(--card)]">
        <div className="km-container py-4">
          <PostPaymentNav showBack={true} />
        </div>
      </header>

      <main className="km-container py-12">
        {/* Initial State */}
        {!result && !isAnalyzing && (
          <div className="max-w-2xl mx-auto">
            <div className="mb-8">
              <h2 className="text-3xl md:text-4xl font-semibold text-[var(--foreground)] mb-4">
                AI-анализ волос
              </h2>
              <p className="text-lg text-[var(--muted-foreground)]">
                {quizMissing
                  ? "Загрузи фото. AI оценит состояние волос и предложит индивидуальный уход Limba."
                  : "Загрузи фото. AI объединит его с ответами твоего теста и предложит индивидуальный уход Limba."}
              </p>
              <p className="mt-2 text-sm text-[var(--muted-foreground)]">
                Уход Limba предлагается на выбор. Если хочешь, подбирай уход сама по
                методичкам и составам из курса.
              </p>

              <div className="mt-4 rounded-xl border border-[var(--border)] bg-[var(--sand)] p-4">
                <p className="text-sm text-[var(--foreground)]">
                  Снимай при дневном свете, волосы сухие и распущенные.
                </p>
              </div>

              {quizMissing && (
                <div className="mt-3 rounded-xl border border-[var(--border)] bg-[var(--card)] p-4">
                  <p className="text-sm text-[var(--foreground)]">
                    Рекомендуем сначала пройти бесплатный тест, чтобы результат был
                    максимально точным.{" "}
                    <a href="/quiz" className="font-semibold underline underline-offset-2">
                      Пройти тест →
                    </a>
                  </p>
                </div>
              )}
            </div>

            {!previewUrl ? (
              <div className="border-2 border-dashed border-[var(--border)] rounded-2xl p-12 text-center hover:border-[var(--accent)] transition-colors cursor-pointer bg-[var(--card)]">
                <div className="mb-4">
                  <svg
                    className="mx-auto h-12 w-12 text-[var(--muted-foreground)]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <p className="text-[var(--foreground)] mb-2">Нажмите чтобы загрузить фото</p>
                <p className="text-sm text-[var(--muted-foreground)]">
                  JPG, PNG до 5MB
                </p>
                <button
                  onClick={handleUploadClick}
                  className="mt-6 km-cta km-cta--dark"
                >
                  <span>Загрузить фото</span>
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Preview */}
                <div className="relative rounded-2xl overflow-hidden bg-[var(--card)] border border-[var(--border)]">
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="w-full h-auto"
                  />
                </div>

                {/* Action Button */}
                <button
                  onClick={handleAnalyze}
                  className="km-cta km-cta--dark"
                >
                  <span>Получить диагностику</span>
                </button>

                {/* Reset Button */}
                <button
                  onClick={handleReset}
                  className="w-full text-center text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] underline-offset-2 hover:underline"
                >
                  Выбрать другое фото
                </button>
              </div>
            )}

            {error && (
              <div className="mt-6 p-4 bg-[var(--rose)]/10 border border-[var(--rose)]/20 rounded-xl text-[var(--foreground)]">
                {error}
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>
        )}

        {/* Loading State */}
        {isAnalyzing && (
          <div className="max-w-2xl mx-auto text-center">
            <div className="mb-8">
              <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-2 border-[var(--primary)]"></div>
            </div>
            <h2 className="text-2xl font-semibold text-[var(--foreground)] mb-4">
              Анализирую твои волосы...
            </h2>
            <p className="text-lg text-[var(--muted-foreground)]">
              Это займёт около 15 секунд
            </p>
          </div>
        )}

        {/* Results State */}
        {result && !isAnalyzing && (
          <div className="max-w-3xl mx-auto">
            <div className="mb-8">
              <h2 className="text-3xl md:text-4xl font-semibold text-[var(--foreground)] mb-4">
                Результат анализа
              </h2>
            </div>

            {/* Damage Level */}
            <div className="bg-[var(--card)] rounded-2xl p-8 border border-[var(--border)] mb-6">
              <div className="text-center">
                <p className="text-sm uppercase tracking-wider text-[var(--muted-foreground)] mb-4">
                  Предварительный уровень повреждения
                </p>
                <div className="text-7xl md:text-8xl font-semibold text-[var(--accent)] mb-2">
                  {result.damageLevel}
                </div>
                <p className="text-[var(--muted-foreground)]">
                  из 5 · предварительная оценка по фото и ответам
                </p>
              </div>
            </div>

            {/* What I See */}
            <div className="bg-[var(--card)] rounded-2xl p-8 border border-[var(--border)] mb-6">
              <h3 className="text-xl font-semibold text-[var(--foreground)] mb-4">
                Что я вижу
              </h3>
              <ul className="space-y-3">
                {result.signs.map((sign, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <svg
                      className="h-5 w-5 text-[var(--success)] mt-0.5 flex-shrink-0"
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
                    <span className="text-[var(--foreground)]">{sign}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Recommendations */}
            <div className="bg-[var(--card)] rounded-2xl p-8 border border-[var(--border)] mb-6">
              <h3 className="text-xl font-semibold text-[var(--foreground)] mb-4">
                Рекомендации
              </h3>
              <ul className="space-y-3">
                {result.recommendations.map((rec, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="h-5 w-5 rounded-full bg-[var(--accent)]/10 flex items-center justify-center mt-0.5 flex-shrink-0">
                      <span className="text-xs font-semibold text-[var(--accent)]">
                        {index + 1}
                      </span>
                    </div>
                    <span className="text-[var(--foreground)]">{rec}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Summary */}
            <div className="bg-[var(--sand)] rounded-2xl p-8 mb-6">
              <h3 className="text-xl font-semibold text-[var(--foreground)] mb-4">
                Итог
              </h3>
              <p className="text-[var(--foreground)] leading-relaxed">
                {result.summary}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4">
              <button
                onClick={handleSelectCare}
                className="km-cta km-cta--dark w-full"
              >
                <span>Подобрать индивидуальный уход от Елены</span>
              </button>

              <button
                onClick={handleReset}
                className="w-full text-center text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] underline-offset-2 hover:underline py-2"
              >
                Пройти анализ заново
              </button>

              <button
                onClick={() => router.push("/dashboard")}
                className="w-full text-center text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] underline-offset-2 hover:underline py-2"
              >
                В кабинет
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
