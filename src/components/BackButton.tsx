'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'

export function BackButton() {
  const router = useRouter()
  return (
    <button
      type="button"
      onClick={() => router.push('/')}
      className="inline-flex items-center gap-2 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors mb-8"
    >
      ← Назад
    </button>
  )
}
