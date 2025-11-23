import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

// Lazy initialization of Stripe to avoid build-time errors
let stripe: Stripe | null = null

function getStripe() {
  if (!stripe) {
    const secretKey = process.env.STRIPE_SECRET_KEY
    if (!secretKey) {
      throw new Error('STRIPE_SECRET_KEY is not configured')
    }
    stripe = new Stripe(secretKey, {
      apiVersion: '2025-06-30.basil',
    })
  }
  return stripe
}

export async function POST(request: NextRequest) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
  
  if (!webhookSecret) {
    console.error('STRIPE_WEBHOOK_SECRET is not configured')
    return NextResponse.json({ error: 'Webhook not configured' }, { status: 500 })
  }

  const body = await request.text()
  const signature = request.headers.get('stripe-signature')

  if (!signature) {
    return NextResponse.json({ error: 'No signature' }, { status: 400 })
  }

  let stripeClient: Stripe
  try {
    stripeClient = getStripe()
  } catch (error) {
    console.error('Stripe initialization failed:', error)
    return NextResponse.json({ error: 'Stripe not configured' }, { status: 500 })
  }

  let event: Stripe.Event

  try {
    event = stripeClient.webhooks.constructEvent(body, signature, webhookSecret)
  } catch (error) {
    console.error('Webhook signature verification failed:', error)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object as Stripe.Checkout.Session
      console.log('Payment successful:', session.id)
      
      // Tu można dodać logikę:
      // - Zapisanie zamówienia w bazie danych
      // - Wysłanie emaila potwierdzającego
      // - Aktualizacja stanu magazynu
      // - Integracja z systemem CRM
      
      break
      
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object as Stripe.PaymentIntent
      console.log('PaymentIntent succeeded:', paymentIntent.id)
      break
      
    case 'payment_intent.payment_failed':
      const failedPayment = event.data.object as Stripe.PaymentIntent
      console.log('Payment failed:', failedPayment.id)
      break
      
    default:
      console.log(`Unhandled event type: ${event.type}`)
  }

  return NextResponse.json({ received: true })
}