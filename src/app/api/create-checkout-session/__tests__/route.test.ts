/**
 * Tests for create-checkout-session API route
 * Run with: npm test src/app/api/create-checkout-session/__tests__/route.test.ts
 */

import { NextRequest } from 'next/server'
import { POST } from '../route'
import { CartItem } from '@/lib/cart'

// Mock Stripe
const mockStripeSession = {
  id: 'cs_test_123456789',
  url: 'https://checkout.stripe.com/pay/cs_test_123456789'
}

const mockStripe = {
  checkout: {
    sessions: {
      create: jest.fn().mockResolvedValue(mockStripeSession)
    }
  }
}

// Mock our Stripe utility
jest.mock('@/lib/stripe', () => ({
  getStripeServer: jest.fn(() => mockStripe)
}))

// Test data
const validCartItems: CartItem[] = [
  {
    id: 1,
    productId: 'vision-pro',
    name: 'Vision Pro',
    price: 2499,
    quantity: 1,
    color: 'Black',
    emoji: '🥽'
  },
  {
    id: 2,
    productId: 'tech-view',
    name: 'Tech View',
    price: 1899,
    quantity: 1,
    color: 'Blue',
    emoji: '👓'
  }
]

const validCustomerInfo = {
  firstName: 'Jan',
  lastName: 'Kowalski',
  email: 'jan.kowalski@example.com',
  phone: '+48123456789'
}

const validShippingAddress = {
  line1: 'ul. Testowa 123',
  city: 'Warszawa',
  postal_code: '00-001',
  country: 'PL'
}

const createMockRequest = (body: any): NextRequest => {
  return new NextRequest('http://localhost:3000/api/create-checkout-session', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })
}

describe('/api/create-checkout-session', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Successful requests', () => {
    test('should create session with minimal valid data', async () => {
      const request = createMockRequest({
        items: validCartItems
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.sessionId).toBe('cs_test_123456789')
      expect(mockStripe.checkout.sessions.create).toHaveBeenCalledTimes(1)
    })

    test('should create session with complete customer data', async () => {
      const request = createMockRequest({
        items: validCartItems,
        customerInfo: validCustomerInfo,
        shippingAddress: validShippingAddress,
        shippingOption: 'express',
        newsletter: true
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.sessionId).toBe('cs_test_123456789')
      
      const stripeCall = mockStripe.checkout.sessions.create.mock.calls[0][0]
      expect(stripeCall.customer_email).toBe(validCustomerInfo.email)
      expect(stripeCall.metadata.customerName).toBe('Jan Kowalski')
      expect(stripeCall.metadata.newsletter).toBe('true')
    })

    test('should handle free shipping for orders over 2000 PLN', async () => {
      const highValueItems: CartItem[] = [
        {
          id: 1,
          productId: 'vision-pro',
          name: 'Vision Pro',
          price: 2499,
          quantity: 1
        }
      ]

      const request = createMockRequest({
        items: highValueItems,
        shippingOption: 'standard'
      })

      const response = await POST(request)
      
      expect(response.status).toBe(200)
      
      const stripeCall = mockStripe.checkout.sessions.create.mock.calls[0][0]
      const standardShipping = stripeCall.shipping_options.find(
        (option: any) => option.shipping_rate_data.display_name === 'Dostawa standardowa'
      )
      
      expect(standardShipping.shipping_rate_data.fixed_amount.amount).toBe(0)
    })
  })

  describe('Request validation errors', () => {
    test('should reject request with invalid JSON', async () => {
      const request = new NextRequest('http://localhost:3000/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: 'invalid json',
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe('Invalid JSON in request body')
      expect(data.code).toBe('INVALID_JSON')
    })

    test('should reject request without items', async () => {
      const request = createMockRequest({})

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe('Request validation failed')
      expect(data.details).toContain('Items array is required')
    })

    test('should reject request with empty cart', async () => {
      const request = createMockRequest({
        items: []
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe('Request validation failed')
      expect(data.details).toContain('Cart cannot be empty')
    })

    test('should reject request with invalid customer info', async () => {
      const request = createMockRequest({
        items: validCartItems,
        customerInfo: {
          firstName: '',
          lastName: 'Kowalski',
          email: 'invalid-email',
          phone: ''
        }
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe('Request validation failed')
      expect(data.details).toContain('Customer first name is required')
      expect(data.details).toContain('Valid customer email is required')
      expect(data.details).toContain('Customer phone is required')
    })

    test('should reject request with invalid shipping address', async () => {
      const request = createMockRequest({
        items: validCartItems,
        shippingAddress: {
          line1: '',
          city: '',
          postal_code: '',
          country: ''
        }
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe('Request validation failed')
      expect(data.details).toContain('Shipping address line 1 is required')
      expect(data.details).toContain('Shipping city is required')
    })

    test('should reject request with invalid shipping option', async () => {
      const request = createMockRequest({
        items: validCartItems,
        shippingOption: 'invalid-option'
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe('Request validation failed')
      expect(data.details).toContain('Invalid shipping option')
    })
  })

  describe('Cart validation errors', () => {
    test('should reject cart with invalid items', async () => {
      const invalidItems = [
        {
          id: 1,
          productId: 'test',
          name: 'Test Product',
          price: -100, // Invalid negative price
          quantity: 1
        }
      ]

      const request = createMockRequest({
        items: invalidItems
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe('Cart validation failed')
      expect(data.code).toBe('CART_VALIDATION_ERROR')
    })
  })

  describe('Stripe errors', () => {
    test('should handle Stripe card error', async () => {
      const stripeError = {
        type: 'StripeCardError',
        message: 'Your card was declined.'
      }

      mockStripe.checkout.sessions.create.mockRejectedValueOnce(stripeError)

      const request = createMockRequest({
        items: validCartItems
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe('Card was declined')
      expect(data.code).toBe('CARD_DECLINED')
    })

    test('should handle Stripe rate limit error', async () => {
      const stripeError = {
        type: 'StripeRateLimitError',
        message: 'Too many requests'
      }

      mockStripe.checkout.sessions.create.mockRejectedValueOnce(stripeError)

      const request = createMockRequest({
        items: validCartItems
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(429)
      expect(data.error).toBe('Too many requests made to the API too quickly')
      expect(data.code).toBe('RATE_LIMIT')
    })

    test('should handle Stripe authentication error', async () => {
      const stripeError = {
        type: 'StripeAuthenticationError',
        message: 'Invalid API key'
      }

      mockStripe.checkout.sessions.create.mockRejectedValueOnce(stripeError)

      const request = createMockRequest({
        items: validCartItems
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.error).toBe('You probably used an incorrect API key')
      expect(data.code).toBe('AUTHENTICATION_ERROR')
    })

    test('should handle general Stripe errors', async () => {
      const stripeError = {
        type: 'StripeAPIError',
        message: 'Internal Stripe error'
      }

      mockStripe.checkout.sessions.create.mockRejectedValueOnce(stripeError)

      const request = createMockRequest({
        items: validCartItems
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.error).toBe('An error occurred internally with Stripe API')
      expect(data.code).toBe('STRIPE_API_ERROR')
    })
  })

  describe('Response format', () => {
    test('should return proper response headers', async () => {
      const request = createMockRequest({
        items: validCartItems
      })

      const response = await POST(request)

      expect(response.headers.get('Cache-Control')).toBe('no-cache, no-store, must-revalidate')
      expect(response.headers.get('Pragma')).toBe('no-cache')
      expect(response.headers.get('Expires')).toBe('0')
    })

    test('should include timestamp in error responses', async () => {
      const request = createMockRequest({
        items: []
      })

      const response = await POST(request)
      const data = await response.json()

      expect(data.timestamp).toBeDefined()
      expect(new Date(data.timestamp)).toBeInstanceOf(Date)
    })
  })

  describe('Metadata generation', () => {
    test('should generate comprehensive metadata', async () => {
      const request = createMockRequest({
        items: validCartItems,
        customerInfo: validCustomerInfo,
        shippingOption: 'express',
        newsletter: true
      })

      const response = await POST(request)
      
      expect(response.status).toBe(200)
      
      const stripeCall = mockStripe.checkout.sessions.create.mock.calls[0][0]
      const metadata = stripeCall.metadata

      expect(metadata.orderId).toMatch(/^MTG-[A-Z0-9]+-[A-Z0-9]+$/)
      expect(metadata.orderType).toBe('tech_glasses')
      expect(metadata.itemCount).toBe('2')
      expect(metadata.customerName).toBe('Jan Kowalski')
      expect(metadata.shippingOption).toBe('express')
      expect(metadata.newsletter).toBe('true')
      expect(metadata.createdAt).toBeDefined()
    })
  })
})