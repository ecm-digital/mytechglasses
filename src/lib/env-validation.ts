/**
 * Environment variables validation for Stripe integration
 */

interface EnvironmentConfig {
  stripe: {
    publishableKey: string
    secretKey: string
    isTestMode: boolean
  }
  app: {
    nodeEnv: string
    nextAuthUrl?: string
    nextAuthSecret?: string
  }
}

class EnvironmentValidationError extends Error {
  constructor(message: string, public field: string) {
    super(message)
    this.name = 'EnvironmentValidationError'
  }
}

/**
 * Validates all required environment variables
 */
export const validateEnvironment = (): EnvironmentConfig => {
  const errors: string[] = []

  // Stripe configuration validation
  const stripePublishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY

  if (!stripePublishableKey) {
    errors.push('NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is required')
  } else if (!stripePublishableKey.startsWith('pk_')) {
    errors.push('NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY must start with "pk_"')
  }

  if (!stripeSecretKey) {
    errors.push('STRIPE_SECRET_KEY is required')
  } else if (!stripeSecretKey.startsWith('sk_')) {
    errors.push('STRIPE_SECRET_KEY must start with "sk_"')
  }

  // Environment consistency check
  if (stripePublishableKey && stripeSecretKey) {
    const publishableIsTest = stripePublishableKey.includes('test')
    const secretIsTest = stripeSecretKey.includes('test')

    if (publishableIsTest !== secretIsTest) {
      errors.push('Stripe keys environment mismatch: both keys must be either test or live')
    }
  }

  // App configuration
  const nodeEnv = process.env.NODE_ENV || 'development'
  const nextAuthUrl = process.env.NEXTAUTH_URL
  const nextAuthSecret = process.env.NEXTAUTH_SECRET

  // Production-specific validations
  if (nodeEnv === 'production') {
    if (stripePublishableKey?.includes('test') || stripeSecretKey?.includes('test')) {
      console.warn('⚠️  Warning: Using Stripe test keys in production environment')
    }

    if (!nextAuthUrl) {
      console.warn('⚠️  Warning: NEXTAUTH_URL not set in production')
    }

    if (!nextAuthSecret) {
      console.warn('⚠️  Warning: NEXTAUTH_SECRET not set in production')
    }
  }

  if (errors.length > 0) {
    throw new EnvironmentValidationError(
      `Environment validation failed:\n${errors.map(e => `  - ${e}`).join('\n')}`,
      'environment'
    )
  }

  return {
    stripe: {
      publishableKey: stripePublishableKey!,
      secretKey: stripeSecretKey!,
      isTestMode: stripePublishableKey!.includes('test')
    },
    app: {
      nodeEnv,
      nextAuthUrl,
      nextAuthSecret
    }
  }
}

/**
 * Logs environment configuration (with sensitive data masked)
 */
export const logEnvironmentConfig = () => {
  try {
    const config = validateEnvironment()
    
    console.log('🔧 Environment Configuration:')
    console.log(`   Node Environment: ${config.app.nodeEnv}`)
    console.log(`   Stripe Mode: ${config.stripe.isTestMode ? 'TEST' : 'LIVE'}`)
    console.log(`   Stripe Publishable Key: ${config.stripe.publishableKey.slice(0, 12)}...`)
    console.log(`   Stripe Secret Key: ${config.stripe.secretKey.slice(0, 7)}...${config.stripe.secretKey.slice(-4)}`)
    
    if (config.stripe.isTestMode) {
      console.log('🧪 Running in Stripe TEST mode')
    } else {
      console.log('🚀 Running in Stripe LIVE mode')
    }
  } catch (error) {
    console.error('❌ Environment validation failed:', error)
    throw error
  }
}

/**
 * Validates environment on application startup
 */
export const initializeEnvironment = () => {
  try {
    validateEnvironment()
    
    if (process.env.NODE_ENV === 'development') {
      logEnvironmentConfig()
    }
    
    return true
  } catch (error) {
    console.error('Failed to initialize environment:', error)
    
    if (process.env.NODE_ENV === 'production') {
      // In production, we might want to exit the process
      process.exit(1)
    }
    
    return false
  }
}

export { EnvironmentValidationError }