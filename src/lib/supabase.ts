import { createClient } from '@supabase/supabase-js'
import { isDevBypass } from './dev-bypass'

export function getSupabase() {
  // Dev bypass - return mock client
  if (isDevBypass()) {
    // Return a mock Supabase client for dev mode
    return {
      from: () => ({
        select: () => ({
          eq: () => ({
            single: async () => ({ 
              data: { has_methodichka: true, has_full_course: true }, 
              error: null 
            })
          })
        }),
        insert: async () => ({ error: null }),
        upsert: async () => ({ data: {}, error: null })
      }),
      storage: {
        from: () => ({
          upload: async () => ({ data: { path: 'dev/mock.jpg' }, error: null }),
          createSignedUrl: async () => ({ 
            data: { signedUrl: 'https://placeholder.com/mock.jpg' }, 
            error: null 
          })
        })
      }
    } as any;
  }
  
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error('Supabase credentials are not configured')
  }
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  )
}
