"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { PostPaymentNav } from "@/components/Navigation"
import { SuccessActionCard } from "@/components/checkout/SuccessActionCard"
import { TELEGRAM_PRIVATE_INVITE } from "@/lib/constants"
import { createClient } from "@/lib/supabase/client"
import { isDevBypass } from "@/lib/dev-bypass"
import { fetchProfileAccess } from "@/lib/profile-access"
import { featureFlags, isBonusVisible } from "@/config/feature-flags"

export default function DashboardPage() {
  const router = useRouter()
  const [ready, setReady] = useState(false)
  const [hasFullCourse, setHasFullCourse] = useState(false)
  const [hasMethodichka, setHasMethodichka] = useState(false)
  const [userName, setUserName] = useState<string | null>(null)
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)

  useEffect(() => {
    const checkAccess = async () => {
      const supabase = createClient()
      if (!supabase) {
        // Auth not configured, allow access for now
        setReady(true)
        return
      }

      // Get the authenticated user
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        router.push("/auth/login")
        return
      }

      // Get user name from metadata
      const fullName = user.user_metadata?.full_name || user.user_metadata?.name || user.email || 'Вы'
      setUserName(fullName)
      setUserEmail(user.email)

      // Dev bypass - grant access without payment (name above is still real)
      if (isDevBypass()) {
        setHasFullCourse(true)
        setHasMethodichka(true)
        setReady(true)
        return
      }

      // Check paid access (by user id, with email fallback for webhook-created rows)
      const access = await fetchProfileAccess(supabase, user)
      setHasFullCourse(access?.hasFullCourse ?? false)
      setHasMethodichka(access?.hasMethodichka ?? false)

      setReady(true)
    }
    checkAccess()
  }, [router, refreshKey])

  // Is the signed-in user an admin? (Server decides — see /api/admin/whoami.)
  useEffect(() => {
    let active = true
    fetch("/api/admin/whoami")
      .then((r) => (r.ok ? r.json() : { isAdmin: false }))
      .then((d) => { if (active) setIsAdmin(!!d.isAdmin) })
      .catch(() => {})
    return () => { active = false }
  }, [refreshKey])

  const handleLogout = async () => {
    const supabase = createClient()
    if (supabase) {
      await supabase.auth.signOut()
    }
    router.push("/")
  }

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#FAF7F4]">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#D9A19D] border-t-transparent" />
      </div>
    )
  }

  const hasAnyAccess = hasFullCourse || hasMethodichka

  return (
    <main className="min-h-screen bg-[#FAF7F4] py-16">
      <div className="km-container">
        <div className="mx-auto max-w-2xl">
          <PostPaymentNav showBack={false} />

          {/* Logged-in confirmation */}
          {userName && (
            <div className="mb-8 rounded-2xl border border-[#E5DDD5] bg-white p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#A0845C]">
                    Вы вошли
                  </p>
                  <p className="mt-1 text-lg font-semibold text-[#1A1A1A]">{userName}</p>
                  {userEmail && <p className="text-sm text-[#888]">{userEmail}</p>}
                </div>
                <button
                  onClick={handleLogout}
                  className="shrink-0 text-sm font-medium text-[#A0845C] underline underline-offset-4 transition-colors hover:text-[#1A1A1A]"
                >
                  Выйти
                </button>
              </div>
              {hasAnyAccess ? (
                <span className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-[#8FBF9F]/20 px-3 py-1 text-xs font-semibold text-[#5A8F6E]">
                  ✓ Доступ открыт
                </span>
              ) : (
                <span className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-[#E8B4A0]/20 px-3 py-1 text-xs font-semibold text-[#B0734F]">
                  Оплата не найдена
                </span>
              )}
            </div>
          )}

          {/* No purchase yet — explain instead of silently bouncing to the landing */}
          {!hasAnyAccess && (
            <div className="mb-8 rounded-2xl border border-[#E5DDD5] bg-white p-6">
              <h2 className="font-hero-face text-xl font-semibold text-[#1A1A1A] mb-2">
                Доступ к курсу пока не открыт
              </h2>
              <p className="font-sans text-sm text-[#666] mb-1">
                Мы не нашли оплату для аккаунта {userEmail || "этого аккаунта"}.
              </p>
              <p className="font-sans text-sm text-[#666] mb-5">
                Если ты только что оплатила, подожди минуту и нажми «Проверить ещё раз».
                Если платила с другого email, напиши нам, и мы перенесём доступ.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/#offer"
                  className="rounded-lg bg-black px-5 py-2.5 text-sm font-medium text-white transition-opacity hover:bg-gray-800"
                >
                  Купить курс
                </Link>
                <button
                  onClick={() => { setReady(false); setRefreshKey((k) => k + 1) }}
                  className="rounded-lg border border-[#D0C8BE] bg-white px-5 py-2.5 text-sm font-medium text-[#1A1A1A] transition-colors hover:bg-[#FAF7F4]"
                >
                  Проверить ещё раз
                </button>
              </div>
            </div>
          )}

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
                label="Видео-уроки"
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
            {(hasMethodichka || hasFullCourse) && (
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
                label="Telegram-канал"
                description="Присоединяйся к закрытому каналу с дополнительными материалами"
                href={TELEGRAM_PRIVATE_INVITE}
                external
              />
            )}

            {/* Bonus - share the course on Instagram to unlock an extra lesson.
                Kept last in the menu so the main course actions come first. */}
            {hasFullCourse && isBonusVisible() && (
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
                    <polyline points="20 12 20 22 4 22 4 12" />
                    <rect x="2" y="7" width="20" height="5" />
                    <line x1="12" y1="22" x2="12" y2="7" />
                    <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" />
                    <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" />
                  </svg>
                }
                label={featureFlags.bonusStatus === "soon" ? "Бонусы (скоро)" : "Бонусы"}
                description={
                  featureFlags.bonusStatus === "soon"
                    ? "Скоро: поделись курсом и получи урок про пилинги в подарок"
                    : "Поделись курсом в сторис, отметь нас и получи бонусный урок"
                }
                href="/dashboard/bonus"
              />
            )}

            {/* Admin only - bonus claim review */}
            {isAdmin && (
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
                    <path d="M9 11l3 3L22 4" />
                    <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
                  </svg>
                }
                label="Заявки на бонус (админ)"
                description="Проверить отметки в Instagram и открыть бонусный урок"
                href="/dashboard/admin/bonus"
              />
            )}
          </div>

          <div style={{ marginTop: "2.5rem" }}>
            <Link
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
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
