"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { PostPaymentNav } from "@/components/Navigation"
import { createClient } from "@/lib/supabase/client"
import { isDevBypass } from "@/lib/dev-bypass"
import { fetchProfileAccess } from "@/lib/profile-access"
import { isBonusLive, isBonusVisible } from "@/config/feature-flags"
import {
  BONUS_INSTAGRAM_HANDLE,
  BONUS_INSTAGRAM_URL,
  BONUS_LESSON,
  type BonusClaimStatus,
} from "@/config/bonus"

interface Claim {
  status: BonusClaimStatus
  proof_url: string | null
  instagram_handle: string | null
  reject_reason: string | null
}

export default function BonusPage() {
  const router = useRouter()
  const [access, setAccess] = useState<boolean | null>(null)
  const [claim, setClaim] = useState<Claim | null>(null)
  const [unlocked, setUnlocked] = useState(false)
  const [loadingClaim, setLoadingClaim] = useState(true)

  const [proofUrl, setProofUrl] = useState("")
  const [handle, setHandle] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const live = isBonusLive()

  // Course-access gate (same shape as the diagnostika page).
  useEffect(() => {
    const check = async () => {
      if (!isBonusVisible()) {
        router.replace("/dashboard")
        return
      }
      if (isDevBypass()) {
        setAccess(true)
        return
      }
      const supabase = createClient()
      if (!supabase) {
        setAccess(true)
        return
      }
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push("/auth/login")
        return
      }
      const acc = await fetchProfileAccess(supabase, user)
      if (!acc?.hasFullCourse) {
        router.replace("/dashboard")
        return
      }
      setAccess(true)
    }
    check()
  }, [router])

  // Load existing claim (only needed once the flow is live).
  useEffect(() => {
    if (access !== true || !live) {
      setLoadingClaim(false)
      return
    }
    let active = true
    fetch("/api/bonus/claim")
      .then((r) => (r.ok ? r.json() : { claim: null, unlocked: false }))
      .then((d) => {
        if (!active) return
        setClaim(d.claim)
        setUnlocked(!!d.unlocked)
      })
      .catch(() => {})
      .finally(() => active && setLoadingClaim(false))
    return () => { active = false }
  }, [access, live])

  const copyHandle = async () => {
    try {
      await navigator.clipboard.writeText(BONUS_INSTAGRAM_HANDLE)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // clipboard blocked — the handle is shown on screen anyway
    }
  }

  const submitClaim = async () => {
    setSubmitting(true)
    setError(null)
    try {
      const res = await fetch("/api/bonus/claim", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ proofUrl, instagramHandle: handle }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Не удалось отправить заявку")
      setClaim({ status: "pending", proof_url: proofUrl || null, instagram_handle: handle || null, reject_reason: null })
    } catch (e) {
      setError(e instanceof Error ? e.message : "Произошла ошибка")
    } finally {
      setSubmitting(false)
    }
  }

  if (access === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAF7F4]">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#D9A19D] border-t-transparent" />
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-[#FAF7F4] py-12">
      <div className="km-container">
        <div className="mx-auto max-w-2xl">
          <PostPaymentNav showBack={true} />

          <p className="mt-6 font-sans text-xs font-semibold uppercase tracking-[0.18em] text-[#C4956A]">
            Бонусы
          </p>
          <h1 className="mt-2 font-hero-face text-2xl md:text-3xl font-semibold text-[#1A1A1A]">
            Поделись курсом, получи бонусный урок
          </h1>

          {/* How it works */}
          <div className="mt-5 rounded-2xl border border-[#E5DDD5] bg-white p-6">
            <p className="font-body text-base leading-relaxed text-[#444]">
              Расскажи о курсе в Instagram: сторис, рилс или пост, как тебе удобнее.
              Отметь нас, и после проверки откроется дополнительный урок про пилинги.
            </p>
            <ol className="mt-4 space-y-2 font-body text-sm leading-relaxed text-[#444]">
              <li>1. Опубликуй сторис, рилс или пост о курсе.</li>
              <li>2. Отметь аккаунт <strong>{BONUS_INSTAGRAM_HANDLE}</strong>.</li>
              <li>3. Пришли ссылку на публикацию или свой @username ниже.</li>
              <li>4. Елена проверит отметку и откроет бонусный урок.</li>
            </ol>

            <div className="mt-5 flex flex-wrap gap-3">
              <button
                onClick={copyHandle}
                className="rounded-lg border border-[#D0C8BE] bg-white px-4 py-2.5 text-sm font-medium text-[#1A1A1A] transition-colors hover:bg-[#FAF7F4]"
              >
                {copied ? "Скопировано" : `Скопировать ${BONUS_INSTAGRAM_HANDLE}`}
              </button>
              <a
                href={BONUS_INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg bg-[#1A1A1A] px-4 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
              >
                Открыть Instagram
              </a>
            </div>
          </div>

          {/* Teaser state — flow not open yet */}
          {!live && (
            <div className="mt-6 rounded-2xl border border-[#E5DDD5] bg-[#F3EEE8] p-6">
              <span className="inline-flex rounded-full bg-[#C4956A]/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-[#C4956A]">
                Скоро
              </span>
              <p className="mt-3 font-body text-base leading-relaxed text-[#444]">
                Бонусный урок про пилинги ещё готовим. Подача заявок откроется совсем
                скоро, а пока можешь заранее поделиться курсом и отметить нас.
              </p>
            </div>
          )}

          {/* Live flow */}
          {live && !loadingClaim && (
            <div className="mt-6">
              {unlocked ? (
                <BonusLesson />
              ) : claim?.status === "pending" ? (
                <StatusCard
                  tone="wait"
                  title="Заявка на проверке"
                  text="Спасибо! Елена проверит отметку в Instagram и откроет урок. Обычно это занимает немного времени."
                />
              ) : (
                <div className="rounded-2xl border border-[#E5DDD5] bg-white p-6">
                  {claim?.status === "rejected" && (
                    <div className="mb-4 rounded-lg border border-[#E8B4A0]/40 bg-[#E8B4A0]/10 p-4">
                      <p className="text-sm font-semibold text-[#B0734F]">Заявку отклонили</p>
                      {claim.reject_reason && (
                        <p className="mt-1 text-sm text-[#8a5a3e]">{claim.reject_reason}</p>
                      )}
                      <p className="mt-1 text-sm text-[#8a5a3e]">Проверь отметку и отправь заявку ещё раз.</p>
                    </div>
                  )}

                  <h2 className="font-hero-face text-lg font-semibold text-[#1A1A1A]">
                    Отправить заявку
                  </h2>
                  <label className="mt-4 block text-sm font-medium text-[#444]">
                    Ссылка на публикацию
                    <input
                      type="url"
                      value={proofUrl}
                      onChange={(e) => setProofUrl(e.target.value)}
                      placeholder="https://instagram.com/..."
                      className="mt-1 w-full rounded-lg border border-[#D0C8BE] bg-white px-3 py-2.5 text-sm text-[#1A1A1A] outline-none focus:border-[#C4956A]"
                    />
                  </label>
                  <label className="mt-3 block text-sm font-medium text-[#444]">
                    Или твой @username
                    <input
                      type="text"
                      value={handle}
                      onChange={(e) => setHandle(e.target.value)}
                      placeholder="@username"
                      className="mt-1 w-full rounded-lg border border-[#D0C8BE] bg-white px-3 py-2.5 text-sm text-[#1A1A1A] outline-none focus:border-[#C4956A]"
                    />
                  </label>

                  {error && <p className="mt-3 text-sm text-[#B0734F]">{error}</p>}

                  <button
                    onClick={submitClaim}
                    disabled={submitting || (!proofUrl.trim() && !handle.trim())}
                    className="mt-5 w-full rounded-lg bg-[#C4956A] px-5 py-3 text-sm font-semibold uppercase tracking-[0.08em] text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {submitting ? "Отправляем..." : "Отправить заявку"}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  )
}

function StatusCard({ tone, title, text }: { tone: "wait" | "ok"; title: string; text: string }) {
  const bg = tone === "ok" ? "bg-[#8FBF9F]/15 border-[#8FBF9F]/40" : "bg-[#F3EEE8] border-[#E5DDD5]"
  return (
    <div className={`rounded-2xl border ${bg} p-6`}>
      <h2 className="font-hero-face text-lg font-semibold text-[#1A1A1A]">{title}</h2>
      <p className="mt-2 font-body text-base leading-relaxed text-[#444]">{text}</p>
    </div>
  )
}

function BonusLesson() {
  return (
    <div className="rounded-2xl border border-[#8FBF9F]/40 bg-white p-6">
      <span className="inline-flex rounded-full bg-[#8FBF9F]/20 px-3 py-1 text-xs font-semibold text-[#5A8F6E]">
        ✓ Бонус открыт
      </span>
      <h2 className="mt-3 font-hero-face text-xl font-semibold text-[#1A1A1A]">
        {BONUS_LESSON.title}
      </h2>
      <p className="mt-2 font-body text-sm leading-relaxed text-[#666]">
        {BONUS_LESSON.description}
      </p>

      {BONUS_LESSON.youtubeId ? (
        <div
          className="mt-5 w-full overflow-hidden rounded-xl bg-[#EEE8E1]"
          style={{ position: "relative", paddingBottom: "56.25%", height: 0 }}
        >
          <iframe
            src={`https://www.youtube.com/embed/${BONUS_LESSON.youtubeId}?rel=0&vq=hd1080`}
            style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", border: "none" }}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            title={BONUS_LESSON.title}
          />
        </div>
      ) : (
        <div className="mt-5 rounded-xl border border-dashed border-[#D0C8BE] bg-[#FAF7F4] p-8 text-center">
          <p className="font-body text-sm text-[#666]">
            Доступ открыт. Видео скоро появится здесь, мы сообщим, когда урок будет готов.
          </p>
        </div>
      )}
    </div>
  )
}
