import { getSupabase } from '@/lib/supabase'
import { isAdminEmail } from '@/lib/admin'

type AuthUser = {
  id: string
  email?: string | null
  user_metadata?: { full_name?: string | null; name?: string | null } | null
}

/**
 * Ensure a profiles row exists for this auth user. Saves auth.uid() as the
 * profile id (required for the lesson_progress FK) and the display name from
 * OAuth metadata — null for email-only sign-ins, which the UI already tolerates.
 * Admin-allowlisted emails get full access.
 *
 * Shared by both sign-in paths so they stay identical: the Google OAuth callback
 * and the email-OTP sync route. Never throws — failures are logged so sign-in
 * still succeeds (the handle_new_user DB trigger also backstops row creation).
 */
export async function ensureProfile(user: AuthUser): Promise<void> {
  if (!user.email) return

  try {
    const db = getSupabase()
    const fullName = user.user_metadata?.full_name || user.user_metadata?.name || null

    const row = isAdminEmail(user.email)
      ? { id: user.id, email: user.email, full_name: fullName, has_full_course: true, has_methodichka: true }
      : { id: user.id, email: user.email, full_name: fullName }

    const { error } = await db.from('profiles').upsert(row, { onConflict: 'email' })
    if (error) {
      console.error('[ensureProfile] upsert failed:', error.message)
    }
  } catch (e) {
    console.error('[ensureProfile] failed:', e)
  }
}
