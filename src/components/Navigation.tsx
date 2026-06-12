"use client"

import { useRouter } from "next/navigation"

interface PrePaymentNavProps {
  showBack?: boolean
}

export function PrePaymentNav({ showBack = true }: PrePaymentNavProps) {
  const router = useRouter()

  return (
    <div className="flex items-center justify-between w-full mb-8">
      {showBack && (
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors"
        >
          ← Назад
        </button>
      )}
      {!showBack && <div />}
      <a
        href="/"
        className="inline-flex items-center gap-2 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 12l9-9 9 9" />
          <path d="M5 10v10a1 1 0 001 1h12a1 1 0 001-1V10" />
        </svg>
        На главную
      </a>
    </div>
  )
}

interface PostPaymentNavProps {
  showBack?: boolean
}

export function PostPaymentNav({ showBack = true }: PostPaymentNavProps) {
  const router = useRouter()

  return (
    <div className="flex items-center justify-between w-full mb-8">
      {showBack && (
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors"
        >
          ← Назад
        </button>
      )}
      {!showBack && <div />}
      <button
        onClick={() => router.push("/dashboard")}
        className="inline-flex items-center gap-2 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors"
      >
        В личный кабинет →
      </button>
    </div>
  )
}
