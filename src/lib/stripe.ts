import { loadStripe, Stripe } from '@stripe/stripe-js'
import StripeServer from 'stripe'

// Environment validation
const validateEnvironment = () => {
  const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
  const secretKey = process.env.STRIPE_SECRET_KEY

  if (typeof window === 'undefined') {
    // Server-side validation
    if (!secretKey) {
      throw new Error('STRIPE_SECRET_KEY is required but not set in environment variables')
    }
    if (!secretKey.startsWith('sk_')) {
      throw new Error('STRIPE_SECRET_KEY must start with "sk_"')
    }
  }

  // Client-side validation
  if (!publishableKey) {
    throw new Error('NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is required but not set in environment variables')
  }
  if (!publishableKey.startsWith('pk_')) {
    throw new Error('NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY must start with "pk_"')
  }

  // Environment consistency check
  const isTestMode = publishableKey.includes('test')
  const isSecretTestMode = secretKey?.includes('test') ?? true

  if (isTestMode !== isSecretTestMode) {
    console.warn('Warning: Stripe keys environment mismatch (test vs live)')
  }

  return {
    publishableKey,
    secretKey,
    isTestMode
  }
}

// Client-side Stripe instance
let stripePromise: Promise<Stripe | null>

export const getStripe = (): Promise<Stripe | null> => {
  if (!stripePromise) {
    const { publishableKey } = validateEnvironment()
    stripePromise = loadStripe(publishableKey)
  }
  return stripePromise
}

// Server-side Stripe instance
let stripeServer: StripeServer | null = null

export const getStripeServer = (): StripeServer => {
  if (!stripeServer) {
    const { secretKey } = validateEnvironment()
    
    if (!secretKey) {
      throw new Error('Cannot initialize server-side Stripe without STRIPE_SECRET_KEY')
    }

    stripeServer = new StripeServer(secretKey, {
      apiVersion: '2024-06-20',
      typescript: true,
    })
  }
  
  return stripeServer
}

// Configuration utilities
export const getStripeConfig = () => {
  const { publishableKey, secretKey, isTestMode } = validateEnvironment()
  
  return {
    publishableKey,
    secretKey: secretKey ? '***' + secretKey.slice(-4) : undefined, // Masked for logging
    isTestMode,
    environment: process.env.NODE_ENV,
    apiVersion: '2024-06-20' as const
  }
}

// Test connection utility
export const testStripeConnection = async (): Promise<boolean> => {
  try {
    if (typeof window !== 'undefined') {
      // Client-side test
      const stripe = await getStripe()
      return stripe !== null
    } else {
      // Server-side test
      const stripe = getStripeServer()
      await stripe.customers.list({ limit: 1 })
      return true
    }
  } catch (error) {
    console.error('Stripe connection test failed:', error)
    return false
  }
}

// Legacy export for backward compatibility
export default getStripe