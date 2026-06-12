import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

function getSupabase() {
  // Dev bypass - return mock client
  const isDevBypass = process.env.NEXT_PUBLIC_DEV_BYPASS_PAYWALL === 'true' || 
                     process.env.VERCEL_ENV === 'preview';
  
  if (isDevBypass) {
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
        })
      })
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

export async function GET(req: NextRequest) {
  const email = req.nextUrl.searchParams.get('email')
  if (!email) {
    return NextResponse.json({ error: 'Email required' }, { status: 400 })
  }

  // Dev bypass - allow access without payment
  const isDevBypass = process.env.NEXT_PUBLIC_DEV_BYPASS_PAYWALL === 'true' || 
                     process.env.VERCEL_ENV === 'preview'
  
  if (isDevBypass) {
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
