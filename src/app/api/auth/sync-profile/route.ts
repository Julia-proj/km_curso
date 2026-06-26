import { NextResponse } from 'next/server'
import { createClient as createServerSupabase } from '@/lib/supabase/server'
import { ensureProfile } from '@/lib/ensure-profile'

// Email-OTP sign-ins have no server callback — verifyOtp runs client-side — so
// the profile row and admin flags that the OAuth callback applies must be set
// here. The browser persists the session to cookies before this fetch, so the
// server client sees the freshly signed-in user.
export async function POST() {
  const auth = await createServerSupabase()
  if (!auth) {
    return NextResponse.json({ error: 'Auth is not configured' }, { status: 503 })
  }

  const { data: { user } } = await auth.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  await ensureProfile(user)
  return NextResponse.json({ ok: true })
}
