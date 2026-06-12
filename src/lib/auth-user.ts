import { createClient } from '@/lib/supabase/client'
import { isDevBypass } from '@/lib/dev-bypass'

export interface CurrentUser {
  email: string | null
  name: string
}

/**
 * Resolve the signed-in user for client components.
 *
 * Always prefers the REAL Supabase session, so the Google display name and
 * email show up everywhere — even with the local dev paywall bypass turned on.
 * Only when there is genuinely no session AND the bypass is enabled do we fall
 * back to a dev placeholder. Returns null when nobody is signed in.
 */
export async function getCurrentUser(): Promise<CurrentUser | null> {
  const supabase = createClient()
  if (supabase) {
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      return {
        email: user.email ?? null,
        name:
          user.user_metadata?.full_name ||
          user.user_metadata?.name ||
          user.email ||
          'Вы',
      }
    }
  }

  if (isDevBypass()) {
    return { email: 'dev@example.com', name: 'Dev-режим' }
  }

  return null
}
