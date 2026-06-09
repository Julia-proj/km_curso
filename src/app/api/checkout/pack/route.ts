import Stripe from 'stripe';
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

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
  try {
    const { recommendation_id, customer_name, customer_phone, preferred_time } = await req.json();
    
    if (!recommendation_id || !customer_name || !customer_phone) {
      return NextResponse.json({ error: 'Не все обязательные поля заполнены' }, { status: 400 });
    }
    
    const supabase = getSupabase();
    const { data: rec } = await supabase
      .from('recommendations')
      .select('*')
      .eq('id', recommendation_id)
      .single();
    
    if (!rec) {
      return NextResponse.json({ error: 'Рекомендация не найдена' }, { status: 404 });
    }
    
    const { data: products } = await supabase
      .from('products')
      .select('*')
      .in('id', rec.recommended_product_ids);
    
    if (!products || products.length === 0) {
      return NextResponse.json({ error: 'Нет продуктов' }, { status: 400 });
    }
    
    const lineItems = products.map((p: any) => ({
      price_data: {
        currency: 'eur',
        product_data: {
          name: p.name,
          description: p.description || undefined
        },
        unit_amount: Math.round(Number(p.price_eur) * 100)
      },
      quantity: 1
    }));
    
    const stripe = getStripe();
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: lineItems,
      customer_email: rec.user_email,
      metadata: {
        recommendation_id: rec.id,
        customer_name,
        customer_phone,
        preferred_time: preferred_time || '',
        type: 'limba_pack',
        pickup_location: 'studio_madrid'
      },
      success_url: `${process.env.NEXT_PUBLIC_URL}/scan/pickup/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_URL}/scan/result?recommendation_id=${rec.id}`
    });
    
    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error('Checkout error:', error);
    return NextResponse.json({ error: error.message || 'Ошибка оформления' }, { status: 500 });
  }
}
