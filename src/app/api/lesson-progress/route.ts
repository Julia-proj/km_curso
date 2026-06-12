import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { createClient as createServerSupabase } from '@/lib/supabase/server'
import { isDevBypass } from '@/lib/dev-bypass'

function getSupabase() {
  // Dev bypass - return mock client
  if (isDevBypass()) {
    // Mock client for dev mode. Shape supports both chains the route uses:
    //  - lesson_progress reads: .select(..).eq(..).single()
    //  - progress writes:                .upsert(..).select().single()
    // Stateless: returns a valid empty-progress row so the UI works locally.
    const row = { id: 'dev-profile', completed: [], last_viewed: 1 };
    return {
      from: () => ({
        select: () => ({
          eq: () => ({
            single: async () => ({ data: row, error: null }),
          }),
        }),
        upsert: () => ({
          select: () => ({
            single: async () => ({ data: row, error: null }),
          }),
        }),
      }),
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

// GET - retrieve lesson progress for authenticated user
export async function GET() {
  try {
    // Dev bypass has no real session — return empty progress so the UI works.
    if (isDevBypass()) {
      return NextResponse.json({ completed: [], lastViewed: 1 })
    }

    // Server client reads the session from request cookies. (A browser client
    // here would always see no user and reply 401.)
    const supabase = await createServerSupabase()
    if (!supabase) {
      return NextResponse.json({ error: 'Auth is not configured' }, { status: 503 })
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Use service role client for database operations
    const db = getSupabase()

    // Get lesson progress using user's auth id
    const { data: progress } = await db
      .from('lesson_progress')
      .select('*')
      .eq('user_id', user.id)
      .single()

    return NextResponse.json({
      completed: progress?.completed || [],
      lastViewed: progress?.last_viewed || 1,
    })
  } catch (error: any) {
    console.error('Error fetching lesson progress:', error)
    return NextResponse.json(
      { error: 'Failed to fetch lesson progress' },
      { status: 500 }
    )
  }
}

// POST - update lesson progress for authenticated user
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { lessonId, completed } = body

    if (!lessonId) {
      return NextResponse.json(
        { error: 'lessonId is required' },
        { status: 400 }
      )
    }

    // Dev bypass has no real session — pretend the write succeeded.
    if (isDevBypass()) {
      return NextResponse.json({ completed: completed ? [lessonId] : [], lastViewed: lessonId })
    }

    const supabase = await createServerSupabase()
    if (!supabase) {
      return NextResponse.json({ error: 'Auth is not configured' }, { status: 503 })
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Use service role client for database operations
    const db = getSupabase()

    // Check if progress record exists
    const { data: existingProgress } = await db
      .from('lesson_progress')
      .select('*')
      .eq('user_id', user.id)
      .single()

    const updatedCompleted: number[] = existingProgress?.completed || []

    if (completed) {
      // Add lesson to completed if not already there
      if (!updatedCompleted.includes(lessonId)) {
        updatedCompleted.push(lessonId)
      }
    }

    // Upsert progress using user's auth id
    const { data: progress, error } = await db
      .from('lesson_progress')
      .upsert({
        user_id: user.id,
        completed: updatedCompleted,
        last_viewed: lessonId,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'user_id' })
      .select()
      .single()

    if (error) {
      throw error
    }

    return NextResponse.json({
      completed: progress.completed,
      lastViewed: progress.last_viewed,
    })
  } catch (error: any) {
    console.error('Error updating lesson progress:', error)
    return NextResponse.json(
      { error: 'Failed to update lesson progress' },
      { status: 500 }
    )
  }
}
