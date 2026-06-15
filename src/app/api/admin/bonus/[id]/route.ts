import { NextRequest, NextResponse } from 'next/server'
import { getSupabase } from '@/lib/supabase'
import { isDevBypass } from '@/lib/dev-bypass'
import { requireAdmin } from '@/lib/admin-guard'

// POST — approve or reject a single claim. Approve flips the unlock flag on the
// student's profile (has_bonus_lesson); reject clears it and stores the reason.
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await requireAdmin()
  if (!admin.ok) return NextResponse.json({ error: 'Forbidden' }, { status: admin.status })

  const { id } = await params
  const body = await req.json().catch(() => ({}))
  const action = body.action

  if (action !== 'approve' && action !== 'reject') {
    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  }

  if (isDevBypass()) {
    return NextResponse.json({ ok: true, status: action === 'approve' ? 'approved' : 'rejected' })
  }

  const db = getSupabase()

  const { data: claim } = await db
    .from('bonus_claims')
    .select('user_id')
    .eq('id', id)
    .maybeSingle()

  if (!claim) return NextResponse.json({ error: 'Заявка не найдена' }, { status: 404 })

  const approved = action === 'approve'
  const status = approved ? 'approved' : 'rejected'

  const { error: claimErr } = await db
    .from('bonus_claims')
    .update({
      status,
      reject_reason: approved ? null : (typeof body.reason === 'string' ? body.reason.trim() || null : null),
      reviewed_at: new Date().toISOString(),
      reviewed_by: admin.email,
    })
    .eq('id', id)

  if (claimErr) {
    console.error('bonus claim update failed:', claimErr.message)
    return NextResponse.json({ error: 'Не удалось обновить заявку' }, { status: 500 })
  }

  const { error: profileErr } = await db
    .from('profiles')
    .update({ has_bonus_lesson: approved })
    .eq('id', claim.user_id)

  if (profileErr) {
    console.error('bonus unlock flag update failed:', profileErr.message)
    return NextResponse.json({ error: 'Заявка обновлена, но доступ не переключился' }, { status: 500 })
  }

  return NextResponse.json({ ok: true, status })
}
