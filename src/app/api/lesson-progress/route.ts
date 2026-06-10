import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

function getSupabase() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error('Supabase credentials are not configured')
  }
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  )
}

// GET - retrieve lesson progress for a user
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const email = searchParams.get('email')

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    const supabase = getSupabase()

    // Get user profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', email)
      .single()

    if (!profile) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Get lesson progress
    const { data: progress } = await supabase
      .from('lesson_progress')
      .select('*')
      .eq('user_id', profile.id)
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

// POST - update lesson progress
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { email, lessonId, completed } = body

    if (!email || !lessonId) {
      return NextResponse.json(
        { error: 'Email and lessonId are required' },
        { status: 400 }
      )
    }

    const supabase = getSupabase()

    // Get user profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', email)
      .single()

    if (!profile) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Check if progress record exists
    const { data: existingProgress } = await supabase
      .from('lesson_progress')
      .select('*')
      .eq('user_id', profile.id)
      .single()

    let updatedCompleted: number[] = existingProgress?.completed || []

    if (completed) {
      // Add lesson to completed if not already there
      if (!updatedCompleted.includes(lessonId)) {
        updatedCompleted.push(lessonId)
      }
    }

    // Upsert progress
    const { data: progress, error } = await supabase
      .from('lesson_progress')
      .upsert({
        user_id: profile.id,
        completed: updatedCompleted,
        last_viewed: lessonId,
        updated_at: new Date().toISOString(),
      })
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
