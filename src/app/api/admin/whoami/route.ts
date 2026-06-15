import { NextResponse } from 'next/server'
import { createClient as createServerSupabase } from '@/lib/supabase/server'
import { isDevBypass } from '@/lib/dev-bypass'
import { isAdminEmail } from '@/lib/admin'

// Lightweight check so the client (dashboard) can show/hide the admin link
// without ever learning who the admins are. The real gate stays server-side
// in every /api/admin/* route.
export async function GET() {
  if (isDevBypass()) return NextResponse.json({ isAdmin: true })

  const auth = await createServerSupabase()
  if (!auth) return NextResponse.json({ isAdmin: false })

  const { data: { user } } = await auth.auth.getUser()
  return NextResponse.json({ isAdmin: isAdminEmail(user?.email) })
}
