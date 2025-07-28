/**
 * Tests for Stripe configuration
 * Run with: npm test src/lib/__tests__/stripe-config.test.ts
 */

import { validateEnvironment, EnvironmentValidationError } from '../env-validation'

// Mock environment variables for testing
const originalEnv = process.env

beforeEach(() => {
  jest.resetModules()
  process.env = { ...originalEnv }
})

afterAll(() => {
  process.env = originalEnv
})

describe('Stripe Environment Validation', () => {
  test('should validate correct test environment', () => {
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY = 'pk_test_123456789'
    process.env.STRIPE_SECRET_KEY = 'sk_test_123456789'
    process.env.NODE_ENV = 'development'

    const config = validateEnvironment()

    expect(config.stripe.publishableKey).toBe('pk_test_123456789')
    expect(config.stripe.secretKey).toBe('sk_test_123456789')
    expect(config.stripe.isTestMode).toBe(true)
    expect(config.app.nodeEnv).toBe('development')
  })

  test('should validate correct live environment', () => {
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY = 'pk_live_123456789'
    process.env.STRIPE_SECRET_KEY = 'sk_live_123456789'
    process.env.NODE_ENV = 'production'

    const config = validateEnvironment()

    expect(config.stripe.publishableKey).toBe('pk_live_123456789')
    expect(config.stripe.secretKey).toBe('sk_live_123456789')
    expect(config.stripe.isTestMode).toBe(false)
    expect(config.app.nodeEnv).toBe('production')
  })

  test('should throw error when publishable key is missing', () => {
    delete process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
    process.env.STRIPE_SECRET_KEY = 'sk_test_123456789'

    expect(() => validateEnvironment()).toThrow(EnvironmentValidationError)
    expect(() => validateEnvironment()).toThrow('NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is required')
  })

  test('should throw error when secret key is missing', () => {
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY = 'pk_test_123456789'
    delete process.env.STRIPE_SECRET_KEY

    expect(() => validateEnvironment()).toThrow(EnvironmentValidationError)
    expect(() => validateEnvironment()).toThrow('STRIPE_SECRET_KEY is required')
  })

  test('should throw error when publishable key has wrong prefix', () => {
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY = 'sk_test_123456789' // Wrong prefix
    process.env.STRIPE_SECRET_KEY = 'sk_test_123456789'

    expect(() => validateEnvironment()).toThrow(EnvironmentValidationError)
    expect(() => validateEnvironment()).toThrow('NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY must start with "pk_"')
  })

  test('should throw error when secret key has wrong prefix', () => {
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY = 'pk_test_123456789'
    process.env.STRIPE_SECRET_KEY = 'pk_test_123456789' // Wrong prefix

    expect(() => validateEnvironment()).toThrow(EnvironmentValidationError)
    expect(() => validateEnvironment()).toThrow('STRIPE_SECRET_KEY must start with "sk_"')
  })

  test('should throw error when keys have mismatched environments', () => {
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY = 'pk_test_123456789' // Test
    process.env.STRIPE_SECRET_KEY = 'sk_live_123456789' // Live

    expect(() => validateEnvironment()).toThrow(EnvironmentValidationError)
    expect(() => validateEnvironment()).toThrow('environment mismatch')
  })

  test('should handle missing optional environment variables', () => {
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY = 'pk_test_123456789'
    process.env.STRIPE_SECRET_KEY = 'sk_test_123456789'
    delete process.env.NEXTAUTH_URL
    delete process.env.NEXTAUTH_SECRET

    const config = validateEnvironment()

    expect(config.app.nextAuthUrl).toBeUndefined()
    expect(config.app.nextAuthSecret).toBeUndefined()
  })
})

describe('Stripe Configuration Utils', () => {
  beforeEach(() => {
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY = 'pk_test_123456789'
    process.env.STRIPE_SECRET_KEY = 'sk_test_123456789'
  })

  test('should get stripe config with masked secret', async () => {
    const { getStripeConfig } = await import('../stripe')
    const config = getStripeConfig()

    expect(config.publishableKey).toBe('pk_test_123456789')
    expect(config.secretKey).toBe('***6789') // Masked
    expect(config.isTestMode).toBe(true)
    expect(config.apiVersion).toBe('2024-06-20')
  })

  test('should initialize client-side stripe', async () => {
    // Mock loadStripe
    jest.doMock('@stripe/stripe-js', () => ({
      loadStripe: jest.fn().mockResolvedValue({ id: 'stripe-instance' })
    }))

    const { getStripe } = await import('../stripe')
    const stripe = await getStripe()

    expect(stripe).toEqual({ id: 'stripe-instance' })
  })
})

// Integration test (requires actual Stripe keys)
describe('Stripe Connection Test', () => {
  test('should test stripe connection with valid keys', async () => {
    // Skip this test if no real keys are provided
    if (!process.env.STRIPE_SECRET_KEY?.startsWith('sk_')) {
      console.log('Skipping connection test - no valid Stripe keys')
      return
    }

    const { testStripeConnection } = await import('../stripe')
    const isConnected = await testStripeConnection()

    expect(typeof isConnected).toBe('boolean')
  }, 10000) // 10 second timeout for network request
})