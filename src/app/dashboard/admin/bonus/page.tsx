"use client"

import { useCallback, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { PostPaymentNav } from "@/components/Navigation"

interface ClaimProfile {
  email: string | null
  full_name: string | null
}

interface AdminClaim {
  id: string
  user_id: string
  status: "pending" | "approved" | "rejected"
  proof_url: string | null
  instagram_handle: string | null
  reject_reason: string | null
  created_at: string
  reviewed_at: string | null
  reviewed_by: string | null
  profiles: ClaimProfile | ClaimProfile[] | null
}

const STATUS_LABEL: Record<AdminClaim["status"], string> = {
  pending: "На проверке",
  approved: "Одобрено",
  rejected: "Отклонено",
}

function profileOf(c: AdminClaim): ClaimProfile {
  const p = c.profiles
  if (Array.isArray(p)) return p[0] ?? { email: null, full_name: null }
  return p ?? { email: null, full_name: null }
}

export default function AdminBonusPage() {
  const router = useRouter()
  const [state, setState] = useState<"loading" | "denied" | "ready">("loading")
  const [claims, setClaims] = useState<AdminClaim[]>([])
  const [busyId, setBusyId] = useState<string | null>(null)

  const load = useCallback(async () => {
    const res = await fetch("/api/admin/bonus")
    if (res.status === 403 || res.status === 401) {
      setState("denied")
      return
    }
    const data = await res.json()
    setClaims(Array.isArray(data.claims) ? data.claims : [])
    setState("ready")
  }, [])

  useEffect(() => { load() }, [load])

  const review = async (id: string, action: "approve" | "reject") => {
    let reason: string | undefined
    if (action === "reject") {
      reason = window.prompt("Причина отклонения (необязательно):") ?? undefined
    }
    setBusyId(id)
    try {
      const res = await fetch(`/api/admin/bonus/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, reason }),
      })
      if (res.ok) await load()
    } finally {
      setBusyId(null)
    }
  }

  if (state === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAF7F4]">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#D9A19D] border-t-transparent" />
      </div>
    )
  }

  if (state === "denied") {
    return (
      <main className="min-h-screen bg-[#FAF7F4] py-16">
        <div className="km-container mx-auto max-w-md text-center">
          <p className="font-body text-[#666]">Доступ только для администратора.</p>
          <button
            onClick={() => router.replace("/dashboard")}
            className="mt-4 rounded-lg bg-[#1A1A1A] px-5 py-2.5 text-sm font-medium text-white"
          >
            В кабинет
          </button>
        </div>
      </main>
    )
  }

  const pending = claims.filter((c) => c.status === "pending")
  const reviewed = claims.filter((c) => c.status !== "pending")

  return (
    <main className="min-h-screen bg-[#FAF7F4] py-12">
      <div className="km-container">
        <div className="mx-auto max-w-3xl">
          <PostPaymentNav showBack={true} />

          <h1 className="mt-6 font-hero-face text-2xl md:text-3xl font-semibold text-[#1A1A1A]">
            Заявки на бонус
          </h1>
          <p className="mt-2 font-body text-sm text-[#666]">
            Проверь отметку в Instagram и одобри заявку, чтобы открыть ученице бонусный урок.
          </p>

          <section className="mt-8">
            <h2 className="mb-3 font-sans text-xs font-semibold uppercase tracking-[0.14em] text-[#C4956A]">
              Новые ({pending.length})
            </h2>
            {pending.length === 0 ? (
              <p className="font-body text-sm text-[#999]">Новых заявок нет.</p>
            ) : (
              <div className="space-y-3">
                {pending.map((c) => (
                  <ClaimRow key={c.id} c={c} busy={busyId === c.id} onReview={review} />
                ))}
              </div>
            )}
          </section>

          {reviewed.length > 0 && (
            <section className="mt-10">
              <h2 className="mb-3 font-sans text-xs font-semibold uppercase tracking-[0.14em] text-[#999]">
                Обработанные
              </h2>
              <div className="space-y-3">
                {reviewed.map((c) => (
                  <ClaimRow key={c.id} c={c} busy={busyId === c.id} onReview={review} />
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </main>
  )
}

function ClaimRow({
  c,
  busy,
  onReview,
}: {
  c: AdminClaim
  busy: boolean
  onReview: (id: string, action: "approve" | "reject") => void
}) {
  const p = profileOf(c)
  const date = new Date(c.created_at).toLocaleString("ru-RU")
  const badge =
    c.status === "approved"
      ? "bg-[#8FBF9F]/20 text-[#5A8F6E]"
      : c.status === "rejected"
        ? "bg-[#E8B4A0]/20 text-[#B0734F]"
        : "bg-[#C4956A]/15 text-[#C4956A]"

  return (
    <div className="rounded-2xl border border-[#E5DDD5] bg-white p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="font-semibold text-[#1A1A1A]">{p.full_name || "Без имени"}</p>
          <p className="text-sm text-[#888]">{p.email || c.user_id}</p>
        </div>
        <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${badge}`}>
          {STATUS_LABEL[c.status]}
        </span>
      </div>

      <div className="mt-3 space-y-1 text-sm text-[#444]">
        {c.proof_url && (
          <p className="truncate">
            Ссылка:{" "}
            <a href={c.proof_url} target="_blank" rel="noopener noreferrer" className="text-[#C4956A] underline">
              {c.proof_url}
            </a>
          </p>
        )}
        {c.instagram_handle && <p>Аккаунт: {c.instagram_handle}</p>}
        <p className="text-xs text-[#999]">Отправлено: {date}</p>
        {c.status === "rejected" && c.reject_reason && (
          <p className="text-xs text-[#B0734F]">Причина: {c.reject_reason}</p>
        )}
      </div>

      <div className="mt-4 flex gap-2">
        <button
          onClick={() => onReview(c.id, "approve")}
          disabled={busy || c.status === "approved"}
          className="rounded-lg bg-[#5A8F6E] px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Approve
        </button>
        <button
          onClick={() => onReview(c.id, "reject")}
          disabled={busy || c.status === "rejected"}
          className="rounded-lg border border-[#E8B4A0] bg-white px-4 py-2 text-sm font-semibold text-[#B0734F] transition-colors hover:bg-[#E8B4A0]/10 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Reject
        </button>
      </div>
    </div>
  )
}
