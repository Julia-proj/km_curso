import { createClient } from '@/lib/supabase/server'
import { ensureProfile } from '@/lib/ensure-profile'
import { NextResponse } from 'next/server'

// The PKCE code verifier lives in a cookie on the host the user started the
// sign-in from, so all redirects here must stay on that same host. Using an
// env-configured site URL instead would break login on localhost and Vercel
// preview deployments (cookies don't cross hosts).
export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const origin = requestUrl.origin
  const code = requestUrl.searchParams.get('code')

  if (!code) {
    console.error('[auth/callback] No code in request')
    return NextResponse.redirect(`${origin}/auth/login?error=no_code`)
  }

  const supabase = await createClient()
  if (!supabase) {
    console.error('[auth/callback] Supabase is not configured')
    return NextResponse.redirect(`${origin}/auth/login?error=not_configured`)
  }

  const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)
  if (exchangeError) {
    console.error('[auth/callback] exchangeCodeForSession failed:', exchangeError.message)
    return NextResponse.redirect(`${origin}/auth/login?error=exchange_failed`)
  }

  // Ensure a profiles row exists for this user (id from auth.uid(), full_name
  // from Google OAuth metadata, admin flags for allowlisted emails). Shared with
  // the email-OTP sync route. Non-fatal — sign-in still succeeds on failure.
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      await ensureProfile(user)
    }
  } catch (e) {
    console.error('[auth/callback] ensureProfile failed:', e)
  }

  return NextResponse.redirect(`${origin}/dashboard`)
}
