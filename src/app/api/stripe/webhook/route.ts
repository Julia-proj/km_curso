import Stripe from 'stripe';
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { headers } from 'next/headers';

function getStripe() {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('STRIPE_SECRET_KEY is not configured');
  }
  return new Stripe(process.env.STRIPE_SECRET_KEY);
}

function getSupabase() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error('Supabase credentials are not configured');
  }
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );
}

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = (await headers()).get('stripe-signature');
  
  let event: Stripe.Event;
  
  try {
    const stripe = getStripe();
    event = stripe.webhooks.constructEvent(
      body, 
      sig!, 
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }
  
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const metadata = session.metadata || {};
    
    if (metadata.type === 'limba_pack') {
      const supabase = getSupabase();
      await supabase.from('orders').insert({
        stripe_session_id: session.id,
        stripe_payment_intent: session.payment_intent as string,
        user_email: session.customer_email,
        total_amount: session.amount_total,
        currency: session.currency,
        status: 'paid',
        pickup_location: metadata.pickup_location,
        pickup_status: 'pending',
        recommendation_id: metadata.recommendation_id,
        items: { 
          recommendation_id: metadata.recommendation_id, 
          customer_name: metadata.customer_name,
          customer_phone: metadata.customer_phone 
        }
      });
      
    } else if (metadata.type === 'course' || session.amount_total === 3900) {
      const email = session.customer_email;
      if (email) {
        const supabase = getSupabase();
        await supabase.from('profiles').upsert({
          email,
          has_full_course: true,
          stripe_customer_id: session.customer as string
        }, { onConflict: 'email' });
      }
      
    } else if (metadata.type === 'guide' || session.amount_total === 1500) {
      const email = session.customer_email;
      if (email) {
        const supabase = getSupabase();
        await supabase.from('profiles').upsert({
          email,
          has_methodichka: true,
          stripe_customer_id: session.customer as string
        }, { onConflict: 'email' });
      }
    }
  }
  
  return NextResponse.json({ received: true });
}
