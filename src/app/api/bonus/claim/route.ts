import { NextRequest, NextResponse } from 'next/server'
import { getSupabase } from '@/lib/supabase'
import { createClient as createServerSupabase } from '@/lib/supabase/server'
import { isDevBypass } from '@/lib/dev-bypass'
import { isBonusLive } from '@/config/feature-flags'

// GET — the signed-in student's own bonus claim + whether the lesson is unlocked.
export async function GET() {
  if (isDevBypass()) {
    return NextResponse.json({ claim: null, unlocked: false })
  }

  const auth = await createServerSupabase()
  if (!auth) return NextResponse.json({ error: 'Auth is not configured' }, { status: 503 })

  const { data: { user } } = await auth.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const db = getSupabase()
  const { data: claim } = await db
    .from('bonus_claims')
    .select('status, proof_url, instagram_handle, reject_reason, created_at, reviewed_at')
    .eq('user_id', user.id)
    .maybeSingle()

  return NextResponse.json({
    claim: claim ?? null,
    unlocked: claim?.status === 'approved',
  })
}

// POST — submit (or resubmit) a claim. Status resets to 'pending' for Elena to
// review. Rejected only while the bonus flow is live.
export async function POST(req: NextRequest) {
  if (!isBonusLive()) {
    return NextResponse.json({ error: 'Бонус пока не запущен' }, { status: 403 })
  }

  if (isDevBypass()) {
    return NextResponse.json({ claim: { status: 'pending' } })
  }

  const auth = await createServerSupabase()
  if (!auth) return NextResponse.json({ error: 'Auth is not configured' }, { status: 503 })

  const { data: { user } } = await auth.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json().catch(() => ({}))
  const proofUrl = typeof body.proofUrl === 'string' ? body.proofUrl.trim() : ''
  const handle = typeof body.instagramHandle === 'string' ? body.instagramHandle.trim() : ''

  if (!proofUrl && !handle) {
    return NextResponse.json(
      { error: 'Укажи ссылку на публикацию или свой @username' },
      { status: 400 }
    )
  }

  const db = getSupabase()
  const { data: claim, error } = await db
    .from('bonus_claims')
    .upsert(
      {
        user_id: user.id,
        proof_url: proofUrl || null,
        instagram_handle: handle || null,
        status: 'pending',
        reject_reason: null,
        created_at: new Date().toISOString(),
        reviewed_at: null,
        reviewed_by: null,
      },
      { onConflict: 'user_id' }
    )
    .select('status, proof_url, instagram_handle, created_at')
    .single()

  if (error) {
    console.error('bonus claim upsert failed:', error.message)
    return NextResponse.json({ error: 'Не удалось отправить заявку' }, { status: 500 })
  }

  return NextResponse.json({ claim })
}
