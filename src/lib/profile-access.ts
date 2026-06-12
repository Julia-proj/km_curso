import type { SupabaseClient, User } from '@supabase/supabase-js'

export interface ProfileAccess {
  hasFullCourse: boolean
  hasMethodichka: boolean
}

/**
 * Look up paid access for the signed-in user from the `profiles` table.
 *
 * Tries by `id` first (rows linked to auth.users), then falls back to `email`
 * (rows created by the Stripe webhook before the user ever signed in). Returns
 * null when no profile row is visible — i.e. nothing was purchased yet.
 */
export async function fetchProfileAccess(
  supabase: SupabaseClient,
  user: User
): Promise<ProfileAccess | null> {
  const { data: byId } = await supabase
    .from('profiles')
    .select('has_full_course, has_methodichka')
    .eq('id', user.id)
    .maybeSingle()

  let profile = byId
  if (!profile && user.email) {
    const { data: byEmail } = await supabase
      .from('profiles')
      .select('has_full_course, has_methodichka')
      .eq('email', user.email)
      .maybeSingle()
    profile = byEmail
  }

  if (!profile) return null
  return {
    hasFullCourse: !!profile.has_full_course,
    hasMethodichka: !!profile.has_methodichka,
  }
}
