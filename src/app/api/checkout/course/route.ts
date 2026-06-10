import Stripe from 'stripe';
import { NextRequest, NextResponse } from 'next/server';

function getStripe() {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('STRIPE_SECRET_KEY is not configured');
  }
  return new Stripe(process.env.STRIPE_SECRET_KEY);
}

export async function POST(req: NextRequest) {
  try {
    const { email, name } = await req.json();
    
    if (!email) {
      return NextResponse.json({ error: 'Email обязателен' }, { status: 400 });
    }
    
    const priceId = process.env.STRIPE_PRICE_COURSE;
    if (!priceId) {
      throw new Error('STRIPE_PRICE_COURSE is not configured');
    }
    
    const stripe = getStripe();
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1
        }
      ],
      customer_email: email,
      metadata: {
        type: 'course',
        product_name: 'HAIRLAB Full Course',
        customer_name: name || ''
      },
      success_url: `${process.env.NEXT_PUBLIC_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}&product=course`,
      cancel_url: `${process.env.NEXT_PUBLIC_URL}/#offer`
    });
    
    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error('Course checkout error:', error);
    return NextResponse.json({ error: error.message || 'Ошибка оформления заказа' }, { status: 500 });
  }
}
