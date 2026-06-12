"use client"

import { useSearchParams, useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { PAID_LESSONS } from "@/config/lessons"

export const dynamic = 'force-dynamic'

type Lesson = typeof PAID_LESSONS[0]

export default function LessonsPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const lessonParam = searchParams.get("lesson")
  
  // Simple parsing - no localStorage
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

  const handleNext = () => {
    if (!isLastLesson) {
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

  return (
    <>
      <Header />
      <main className="min-h-screen bg-[#F8F5F1] pt-20 pb-16 px-5 md:pt-24">
        <div className="max-w-6xl mx-auto">
          <a
            href="/dashboard"
            className="inline-flex items-center gap-2 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors mb-8"
          >
            ← В кабинет
          </a>
          
          <div className="grid lg:grid-cols-[300px_1fr] gap-8 mt-6">
            {/* Sidebar - Lesson list */}
            <div className="hidden lg:block">
              <h2 className="font-hero-face text-xl font-semibold text-[var(--color-text)] mb-4">
                Уроки курса
              </h2>
              <div className="space-y-2">
                {PAID_LESSONS.map((lesson) => {
                  const isCurrent = lesson.id === currentLesson.id
                  
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
                        <span className="text-sm font-medium">
                          Урок {lesson.id}
                        </span>
                      </div>
                      <p className="text-xs mt-1 opacity-90 line-clamp-2">
                        {lesson.title}
                      </p>
                    </button>
                  )
                })}
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
                <h3 className="font-hero-face text-lg font-semibold text-[var(--color-text)] mb-3">
                  Все уроки
                </h3>
                <div className="space-y-2">
                  {PAID_LESSONS.map((lesson) => {
                    const isCurrent = lesson.id === currentLesson.id
                    
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
                          <span className="text-sm font-medium">
                            Урок {lesson.id}
                          </span>
                        </div>
                        <p className="text-xs mt-1 opacity-90 line-clamp-2">
                          {lesson.title}
                        </p>
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
