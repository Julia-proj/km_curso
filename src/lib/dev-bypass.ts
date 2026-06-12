/**
 * Single source of truth for the dev / Vercel-preview bypass that skips the
 * paywall, Stripe and real Supabase. Defined once so client and server agree.
 *
 * Returns true ONLY when explicitly enabled:
 *  - NEXT_PUBLIC_DEV_BYPASS_PAYWALL === 'true'  (set in .env.local, or in Vercel
 *    for the Preview/Development environments — NEVER for Production)
 *  - a Vercel Preview deployment (VERCEL_ENV / NEXT_PUBLIC_VERCEL_ENV === 'preview')
 *
 * It is never true in production: Vercel sets VERCEL_ENV='production' there, and
 * the public flag must not be set for Production.
 *
 * Works in both runtimes: on the server VERCEL_ENV is readable; on the client
 * only the NEXT_PUBLIC_* vars are inlined (VERCEL_ENV is simply undefined).
 * Checking all three keeps client and server from disagreeing.
 */
export function isDevBypass(): boolean {
  return (
    process.env.NEXT_PUBLIC_DEV_BYPASS_PAYWALL === 'true' ||
    process.env.VERCEL_ENV === 'preview' ||
    process.env.NEXT_PUBLIC_VERCEL_ENV === 'preview'
  )
}
