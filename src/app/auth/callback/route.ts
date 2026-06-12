import { createClient } from '@/lib/supabase/server'
import { getSupabase } from '@/lib/supabase'
import { getSiteUrl } from '@/lib/site-url'
import { isAdminEmail } from '@/lib/admin'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')

  if (code) {
    const supabase = await createClient()
    if (supabase) {
      await supabase.auth.exchangeCodeForSession(code)

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
          await db.from('profiles').upsert(row, { onConflict: 'email' })
        }
      } catch (e) {
        console.error('[auth/callback] profile upsert failed:', e)
        // Non-fatal — sign-in still succeeds.
      }
    }
  }

  // URL to redirect to after sign in process completes
  return NextResponse.redirect(`${getSiteUrl()}/dashboard`)
}
