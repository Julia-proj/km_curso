import { createClient as createServerSupabase } from '@/lib/supabase/server'
import { isDevBypass } from '@/lib/dev-bypass'
import { isAdminEmail } from '@/lib/admin'

export type AdminCheck =
  | { ok: true; email: string }
  | { ok: false; status: number }

/**
 * Server-side admin gate for API routes. Resolves the requester from the
 * session cookie (never from the client) and checks the ADMIN_EMAILS allowlist.
 * Dev bypass counts as admin so the panel is testable locally.
 */
export async function requireAdmin(): Promise<AdminCheck> {
  if (isDevBypass()) return { ok: true, email: 'dev@local' }

  const auth = await createServerSupabase()
  if (!auth) return { ok: false, status: 503 }

  const { data: { user } } = await auth.auth.getUser()
  if (!isAdminEmail(user?.email)) return { ok: false, status: 403 }

  return { ok: true, email: user!.email! }
}
