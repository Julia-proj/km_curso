/**
 * Local-development bypass that skips the paywall, Stripe and real Supabase.
 *
 * Enabled ONLY by an explicit flag you set in `.env.local`:
 *   NEXT_PUBLIC_DEV_BYPASS_PAYWALL=true
 *
 * Deliberately does NOT auto-enable on Vercel (preview or production). To keep
 * the bypass off on Vercel, simply do not set this variable there. Real access
 * on Vercel is granted by payment (Stripe webhook) or the admin allowlist
 * (ADMIN_EMAILS) — see src/lib/admin.ts.
 */
export function isDevBypass(): boolean {
  // Hard guard: never enable in a production build, even if the env var leaks in.
  if (process.env.NODE_ENV === 'production') return false
  return process.env.NEXT_PUBLIC_DEV_BYPASS_PAYWALL === 'true'
}
