import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { createClient as createServerSupabase } from '@/lib/supabase/server'
import { isDevBypass } from '@/lib/dev-bypass'
import { isAdminEmail } from '@/lib/admin'

function getSupabase() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error('Supabase credentials are not configured')
  }
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  )
}

// Returns paid-access flags for the signed-in user. The email comes from the
// session, never from the query string — otherwise anyone could probe the
// purchase status of arbitrary emails.
export async function GET() {
  // Dev bypass - allow access without payment
  if (isDevBypass()) {
    return NextResponse.json({
      has_methodichka: true,
      has_full_course: true,
    })
  }

  const auth = await createServerSupabase()
  if (!auth) {
    return NextResponse.json({ error: 'Auth is not configured' }, { status: 503 })
  }

  const { data: { user } } = await auth.auth.getUser()
  if (!user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const email = user.email

  // Admin allowlist - full access without payment
  if (isAdminEmail(email)) {
    return NextResponse.json({
      has_methodichka: true,
      has_full_course: true,
    })
  }

  const supabase = getSupabase()
  const { data, error } = await supabase
    .from('profiles')
    .select('has_methodichka, has_full_course')
    .eq('email', email)
    .single()

  if (error || !data) {
    return NextResponse.json({ has_methodichka: false, has_full_course: false })
  }

  return NextResponse.json({
    has_methodichka: !!data.has_methodichka,
    has_full_course: !!data.has_full_course,
  })
}
