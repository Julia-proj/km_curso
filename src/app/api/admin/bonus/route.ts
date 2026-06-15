import { NextResponse } from 'next/server'
import { getSupabase } from '@/lib/supabase'
import { isDevBypass } from '@/lib/dev-bypass'
import { requireAdmin } from '@/lib/admin-guard'

// GET — list every bonus claim (newest first) for Elena's review panel.
export async function GET() {
  const admin = await requireAdmin()
  if (!admin.ok) return NextResponse.json({ error: 'Forbidden' }, { status: admin.status })

  if (isDevBypass()) return NextResponse.json({ claims: [] })

  const db = getSupabase()
  const { data, error } = await db
    .from('bonus_claims')
    .select(
      'id, user_id, status, proof_url, instagram_handle, reject_reason, created_at, reviewed_at, reviewed_by, profiles(email, full_name)'
    )
    .order('created_at', { ascending: false })

  if (error) {
    console.error('admin bonus list failed:', error.message)
    return NextResponse.json({ error: 'Не удалось загрузить заявки' }, { status: 500 })
  }

  return NextResponse.json({ claims: data ?? [] })
}
