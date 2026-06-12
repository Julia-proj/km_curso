"use client"

import { useEffect, useState, useCallback } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { PostPaymentNav } from "@/components/Navigation"
import { PAID_LESSONS } from "@/config/lessons"
import { createClient } from "@/lib/supabase/client"
import { isDevBypass } from "@/lib/dev-bypass"
import { fetchProfileAccess } from "@/lib/profile-access"

export const dynamic = 'force-dynamic'

/** Load saved progress for authenticated user. Best-effort: returns empty on any failure. */
async function loadProgress(): Promise<{ completed: number[]; lastViewed: number }> {
  try {
    const res = await fetch("/api/lesson-progress")
    if (!res.ok) return { completed: [], lastViewed: 1 }
    const data = await res.json()
    return {
      completed: Array.isArray(data.completed) ? data.completed : [],
      lastViewed: typeof data.lastViewed === "number" ? data.lastViewed : 1,
    }
  } catch {
    return { completed: [], lastViewed: 1 }
  }
}

/** Persist progress for a lesson. Best-effort: silently ignores errors. */
async function saveProgress(lessonId: number, completed: boolean): Promise<void> {
  try {
    await fetch("/api/lesson-progress", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lessonId, completed }),
    })
  } catch {
    // Saving is non-critical — the video still plays.
  }
}

export default function LessonsPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const lessonParam = searchParams.get("lesson")

  const [completed, setCompleted] = useState<number[]>([])
  // Guard so we only auto-resume to last-viewed once, on first load.
  const [resumed, setResumed] = useState(false)
  // Paywall: only render lessons once the course purchase is confirmed.
  const [accessGranted, setAccessGranted] = useState(false)

  useEffect(() => {
    const checkAccess = async () => {
      if (isDevBypass()) {
        setAccessGranted(true)
        return
      }

      const supabase = createClient()
      if (!supabase) {
        // Auth not configured (local build without env) — don't block.
        setAccessGranted(true)
        return
      }

      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.replace("/auth/login")
        return
      }

      const access = await fetchProfileAccess(supabase, user)
      if (!access?.hasFullCourse) {
        // Dashboard explains the missing purchase and offers to buy.
        router.replace("/dashboard")
        return
      }

      setAccessGranted(true)
    }
    checkAccess()
  }, [router])

  // Simple parsing from the URL.
  let lessonIndex = 0
  if (lessonParam) {
    const parsed = parseInt(lessonParam, 10)
    if (!isNaN(parsed) && parsed >= 1 && parsed <= PAID_LESSONS.length) {
      lessonIndex = parsed - 1
    }
  }

  const currentLesson = PAID_LESSONS[lessonIndex] || PAID_LESSONS[0]
  const currentLessonIndexInArray = PAID_LESSONS.findIndex(l => l.id === currentLesson.id)
  const isLastLesson = currentLessonIndexInArray === PAID_LESSONS.length - 1
  const isFirstLesson = currentLessonIndexInArray === 0

  // Load progress; auto-resume to last viewed lesson.
  useEffect(() => {
    if (!accessGranted) return
    let active = true
    loadProgress().then(({ completed: done, lastViewed }) => {
      if (!active) return
      setCompleted(done)
      if (!resumed && !lessonParam && lastViewed > 1) {
        setResumed(true)
        router.replace(`/dashboard/lessons?lesson=${lastViewed}`)
      } else {
        setResumed(true)
      }
    })
    return () => { active = false }
  }, [accessGranted, lessonParam, resumed, router])

  // Record the current lesson as "last viewed" each time it changes.
  useEffect(() => {
    if (!accessGranted) return
    saveProgress(currentLesson.id, false)
  }, [accessGranted, currentLesson.id])

  const markCompleted = useCallback((lessonId: number) => {
    setCompleted((prev) => (prev.includes(lessonId) ? prev : [...prev, lessonId]))
    saveProgress(lessonId, true)
  }, [])

  const handleNext = () => {
    if (!isLastLesson) {
      markCompleted(currentLesson.id)
      const nextLesson = PAID_LESSONS[currentLessonIndexInArray + 1]
      router.push(`/dashboard/lessons?lesson=${nextLesson.id}`)
    }
  }

  const handlePrevious = () => {
    if (!isFirstLesson) {
      const prevLesson = PAID_LESSONS[currentLessonIndexInArray - 1]
      router.push(`/dashboard/lessons?lesson=${prevLesson.id}`)
    }
  }

  const handleLessonClick = (lessonId: number) => {
    router.push(`/dashboard/lessons?lesson=${lessonId}`)
  }

  const handleComplete = () => {
    markCompleted(currentLesson.id)
  }

  const isDone = (lessonId: number) => completed.includes(lessonId)

  const renderLessonButton = (lesson: typeof PAID_LESSONS[number]) => {
    const isCurrent = lesson.id === currentLesson.id
    const done = isDone(lesson.id)
    return (
      <button
        key={lesson.id}
        onClick={() => handleLessonClick(lesson.id)}
        className={`w-full text-left p-3 rounded-lg transition-all ${
          isCurrent
            ? "bg-[var(--color-accent)] text-white"
            : "bg-white text-[var(--color-text)] hover:bg-[var(--color-bg-warm)]"
        }`}
      >
        <div className="flex items-center gap-2">
          <span
            className={`flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full text-[11px] ${
              done
                ? isCurrent ? "bg-white/25 text-white" : "bg-[var(--color-success)] text-white"
                : isCurrent ? "bg-white/25 text-white" : "bg-[var(--color-bg-warm)] text-[var(--color-text-muted)]"
            }`}
            aria-hidden="true"
          >
            {done ? "✓" : lesson.id}
          </span>
          <span className="text-sm font-medium">Урок {lesson.id}</span>
        </div>
        <p className="text-xs mt-1 opacity-90 line-clamp-2">{lesson.title}</p>
      </button>
    )
  }

  const completedCount = completed.filter((id) => PAID_LESSONS.some((l) => l.id === id)).length

  if (!accessGranted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F8F5F1]">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#D9A19D] border-t-transparent" />
      </div>
    )
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-[#F8F5F1] pt-20 pb-16 px-5 md:pt-24">
        <div className="max-w-6xl mx-auto">
          <PostPaymentNav showBack={true} />

          <div className="grid lg:grid-cols-[300px_1fr] gap-8 mt-6">
            {/* Sidebar - Lesson list */}
            <div className="hidden lg:block">
              <div className="mb-4 flex items-baseline justify-between">
                <h2 className="font-hero-face text-xl font-semibold text-[var(--color-text)]">
                  Уроки курса
                </h2>
                <span className="text-xs text-[var(--color-text-muted)]">
                  {completedCount}/{PAID_LESSONS.length}
                </span>
              </div>
              <div className="space-y-2">
                {PAID_LESSONS.map(renderLessonButton)}
              </div>
            </div>

            {/* Main content - Video player */}
            <div>
              <h1 className="font-hero-face text-2xl md:text-3xl font-semibold text-[var(--color-text)] mb-2">
                {currentLesson.title}
              </h1>
              <p className="text-[var(--color-text-soft)] mb-6">
                {currentLesson.description}
              </p>

              {/* Video player */}
              <div
                className="w-full rounded-[var(--radius-xl)] overflow-hidden bg-[var(--color-bg-warm)]"
                style={{ position: 'relative', paddingBottom: '56.25%', height: 0 }}
              >
                <iframe
                  src={`https://www.youtube.com/embed/${currentLesson.youtubeId}?rel=0&vq=hd1080`}
                  style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  title={currentLesson.title}
                />
              </div>

              {/* Mark as watched */}
              <div className="mt-4">
                {isDone(currentLesson.id) ? (
                  <span className="inline-flex items-center gap-2 text-sm font-medium text-[var(--color-success)]">
                    ✓ Урок отмечен как просмотренный
                  </span>
                ) : (
                  <button
                    onClick={handleComplete}
                    className="inline-flex items-center gap-2 text-sm font-medium text-[var(--color-accent)] hover:text-[var(--color-accent-hover)] underline-offset-2 hover:underline"
                  >
                    Отметить как просмотренный
                  </button>
                )}
              </div>

              {/* Navigation */}
              <div className="flex items-center justify-between mt-6">
                <button
                  onClick={handlePrevious}
                  disabled={isFirstLesson}
                  className={`px-6 py-3 rounded-lg font-medium transition-all ${
                    isFirstLesson
                      ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                      : "bg-[var(--color-text)] text-white hover:bg-[var(--color-text-muted)]"
                  }`}
                >
                  ← Назад
                </button>

                <div className="text-sm text-[var(--color-text-muted)]">
                  Урок {currentLessonIndexInArray + 1} из {PAID_LESSONS.length}
                </div>

                <button
                  onClick={handleNext}
                  disabled={isLastLesson}
                  className={`px-6 py-3 rounded-lg font-medium transition-all ${
                    isLastLesson
                      ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                      : "bg-[var(--color-accent)] text-white hover:bg-[var(--color-accent-hover)]"
                  }`}
                >
                  {isLastLesson ? "Курс завершён" : "Далее →"}
                </button>
              </div>

              {/* Mobile lesson selector */}
              <div className="lg:hidden mt-8">
                <div className="mb-3 flex items-baseline justify-between">
                  <h3 className="font-hero-face text-lg font-semibold text-[var(--color-text)]">
                    Все видеоуроки
                  </h3>
                  <span className="text-xs text-[var(--color-text-muted)]">
                    {completedCount}/{PAID_LESSONS.length}
                  </span>
                </div>
                <div className="space-y-2">
                  {PAID_LESSONS.map(renderLessonButton)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
