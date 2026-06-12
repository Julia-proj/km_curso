import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'
import { getStripe } from '@/lib/stripe'
import { getSupabase } from '@/lib/supabase'
import type { OrderSessionResponse } from '@/types/api'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  try {
    const { sessionId } = await params

    // Validate sessionId format
    if (!sessionId || !sessionId.startsWith('cs_')) {
      return NextResponse.json(
        { error: 'Invalid session ID format' },
        { status: 400 }
      )
    }

    const stripe = getStripe()

    // Get session directly from Stripe to avoid race condition with webhook
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['line_items']
    })

    // Check payment status
    if (session.payment_status !== 'paid') {
      return NextResponse.json({
        status: 'processing'
      })
    }

    // Build safe response with minimal data
    const response: OrderSessionResponse = {
      status: 'paid',
      customer_name: session.metadata?.customer_name || null,
      amount_total: session.amount_total,
      currency: session.currency,
      pickup_location: session.metadata?.pickup_location || null,
      items: []
    }

    // Extract line items (name + quantity only)
    if (session.line_items && session.line_items.data.length > 0) {
      response.items = session.line_items.data.map(item => ({
        name: item.description || 'Product',
        quantity: item.quantity || 1
      }))
    }

    // Try to find order in database (optional, for order ID display)
    try {
      const supabase = getSupabase()
      const { data: order } = await supabase
        .from('orders')
        .select('id')
        .eq('stripe_session_id', sessionId)
        .single()

      if (order) {
        response.order_id = order.id
      }
    } catch (error) {
      // Don't fail if order not found in database yet
      // Webhook might not have processed it
    }

    return NextResponse.json(response)
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'type' in error && error.type === 'StripeInvalidRequestError') {
      return NextResponse.json(
        { error: 'Session not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to fetch order data' },
      { status: 500 }
    )
  }
}
