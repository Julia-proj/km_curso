import { createClient } from '@/lib/supabase/server'
import { getSupabase } from '@/lib/supabase'
import { isAdminEmail } from '@/lib/admin'
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

  // Ensure a profiles row exists for this user. Save the user id from auth.uid()
  // and full_name from Google OAuth metadata. This row is required for
  // lesson_progress (FK on profiles.id). Admin-allowlisted emails get full access.
  try {
    const { data: { user } } = await supabase.auth.getUser()

    if (user?.email) {
      const db = getSupabase()
      const fullName = user.user_metadata?.full_name || user.user_metadata?.name || null

      const row = isAdminEmail(user.email)
        ? { id: user.id, email: user.email, full_name: fullName, has_full_course: true, has_methodichka: true }
        : { id: user.id, email: user.email, full_name: fullName }

      const { error: upsertError } = await db
        .from('profiles')
        .upsert(row, { onConflict: 'email' })
      if (upsertError) {
        console.error('[auth/callback] profile upsert failed:', upsertError.message)
      }
    }
  } catch (e) {
    console.error('[auth/callback] profile upsert failed:', e)
    // Non-fatal — sign-in still succeeds.
  }

  return NextResponse.redirect(`${origin}/dashboard`)
}
