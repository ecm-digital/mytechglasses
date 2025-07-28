/**
 * Tests for checkout-session API route
 * Run with: npm test src/app/api/checkout-session/[sessionId]/__tests__/route.test.ts
 */

import { NextRequest } from 'next/server'
import { GET } from '../route'

// Mock Stripe session data
const mockStripeSession = {
  id: 'cs_test_123456789',
  payment_status: 'paid',
  amount_total: 439800, // 4398 PLN in grosze
  amount_subtotal: 400000, // 4000 PLN in grosze
  currency: 'pln',
  created: 1640995200, // 2022-01-01 00:00:00 UTC
  customer_email: 'test@example.com',
  customer_details: {
    email: 'test@example.com',
    name: 'Jan Kowalski',
    phone: '+48123456789'
  },
  payment_intent: 'pi_test_123456789',
  shipping_cost: {
    amount_total: 1500, // 15 PLN in grosze
    shipping_rate: {
      display_name: 'Dostawa standardowa',
      delivery_estimate: {
        minimum: { value: 3 },
        maximum: { value: 5 }
      }
    }
  },
  shipping_details: {
    address: {
      line1: 'ul. Testowa 123',
      city: 'Warszawa',
      postal_code: '00-001',
      country: 'PL'
    }
  },
  line_items: {
    data: [
      {
        description: 'Vision Pro',
        quantity: 1,
        amount_total: 249900, // 2499 PLN in grosze
        price: {
          unit_amount: 249900,
          product: {
            name: 'Vision Pro',
            description: 'Inteligentne okulary Vision Pro'
          }
        }
      },
      {
        description: 'Tech View',
        quantity: 1,
        amount_total: 189900, // 1899 PLN in grosze
        price: {
          unit_amount: 189900,
          product: {
            name: 'Tech View',
            description: 'Inteligentne okulary Tech View'
          }
        }
      }
    ]
  },
  metadata: {
    orderId: 'MTG-TEST-12345',
    customerName: 'Jan Kowalski',
    customerPhone: '+48123456789',
    newsletter: 'true'
  }
}

const mockStripe = {
  checkout: {
    sessions: {
      retrieve: jest.fn().mockResolvedValue(mockStripeSession)
    }
  }
}

// Mock our Stripe utility
jest.mock('@/lib/stripe', () => ({
  getStripeServer: jest.fn(() => mockStripe)
}))

const createMockRequest = (sessionId: string): NextRequest => {
  return new NextRequest(`http://localhost:3000/api/checkout-session/${sessionId}`, {
    method: 'GET',
  })
}

describe('/api/checkout-session/[sessionId]', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Successful requests', () => {
    test('should retrieve session details successfully', async () => {
      const request = createMockRequest('cs_test_123456789')
      const response = await GET(request, { params: { sessionId: 'cs_test_123456789' } })
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.orderId).toBe('MTG-TEST-12345')
      expect(data.sessionId).toBe('cs_test_123456789')
      expect(data.paymentIntentId).toBe('pi_test_123456789')
      expect(data.paymentStatus).toBe('paid')
      expect(data.customerInfo.email).toBe('test@example.com')
      expect(data.customerInfo.name).toBe('Jan Kowalski')
      expect(data.pricing.total).toBe(4398)
      expect(data.pricing.subtotal).toBe(4000)
      expect(data.pricing.shipping).toBe(15)
    })

    test('should parse line items correctly', async () => {
      const request = createMockRequest('cs_test_123456789')
      const response = await GET(request, { params: { sessionId: 'cs_test_123456789' } })
      const data = await response.json()

      expect(data.items).toHaveLength(2)
      expect(data.items[0].name).toBe('Vision Pro')
      expect(data.items[0].quantity).toBe(1)
      expect(data.items[0].price).toBe(2499)
      expect(data.items[0].total).toBe(2499)
      expect(data.items[1].name).toBe('Tech View')
      expect(data.items[1].price).toBe(1899)
    })

    test('should parse shipping details correctly', async () => {
      const request = createMockRequest('cs_test_123456789')
      const response = await GET(request, { params: { sessionId: 'cs_test_123456789' } })
      const data = await response.json()

      expect(data.shippingDetails.method).toBe('Dostawa standardowa')
      expect(data.shippingDetails.estimatedDelivery).toBe('3-5 dni roboczych')
      expect(data.shippingDetails.address).toEqual({
        line1: 'ul. Testowa 123',
        city: 'Warszawa',
        postal_code: '00-001',
        country: 'PL'
      })
    })

    test('should include metadata', async () => {
      const request = createMockRequest('cs_test_123456789')
      const response = await GET(request, { params: { sessionId: 'cs_test_123456789' } })
      const data = await response.json()

      expect(data.metadata.orderId).toBe('MTG-TEST-12345')
      expect(data.metadata.newsletter).toBe('true')
    })

    test('should set proper cache headers', async () => {
      const request = createMockRequest('cs_test_123456789')
      const response = await GET(request, { params: { sessionId: 'cs_test_123456789' } })

      expect(response.headers.get('Cache-Control')).toBe('private, max-age=300')
      expect(response.headers.get('Content-Type')).toBe('application/json')
    })
  })

  describe('Validation errors', () => {
    test('should reject invalid session ID format', async () => {
      const request = createMockRequest('invalid_session_id')
      const response = await GET(request, { params: { sessionId: 'invalid_session_id' } })
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe('Invalid session ID format')
      expect(data.code).toBe('INVALID_SESSION_ID')
    })

    test('should reject empty session ID', async () => {
      const request = createMockRequest('')
      const response = await GET(request, { params: { sessionId: '' } })
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe('Invalid session ID format')
    })
  })

  describe('Stripe errors', () => {
    test('should handle session not found', async () => {
      const stripeError = {
        code: 'resource_missing',
        message: 'No such checkout session'
      }

      mockStripe.checkout.sessions.retrieve.mockRejectedValueOnce(stripeError)

      const request = createMockRequest('cs_test_nonexistent')
      const response = await GET(request, { params: { sessionId: 'cs_test_nonexistent' } })
      const data = await response.json()

      expect(response.status).toBe(404)
      expect(data.error).toBe('Checkout session not found')
      expect(data.code).toBe('SESSION_NOT_FOUND')
    })

    test('should handle unpaid session', async () => {
      const unpaidSession = {
        ...mockStripeSession,
        payment_status: 'unpaid'
      }

      mockStripe.checkout.sessions.retrieve.mockResolvedValueOnce(unpaidSession)

      const request = createMockRequest('cs_test_unpaid')
      const response = await GET(request, { params: { sessionId: 'cs_test_unpaid' } })
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe('Payment not completed')
      expect(data.code).toBe('PAYMENT_NOT_COMPLETED')
      expect(data.details).toBe('Payment status is unpaid')
    })

    test('should handle Stripe authentication error', async () => {
      const stripeError = {
        type: 'StripeAuthenticationError',
        message: 'Invalid API key'
      }

      mockStripe.checkout.sessions.retrieve.mockRejectedValueOnce(stripeError)

      const request = createMockRequest('cs_test_123456789')
      const response = await GET(request, { params: { sessionId: 'cs_test_123456789' } })
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.error).toBe('Authentication failed')
      expect(data.code).toBe('AUTHENTICATION_ERROR')
    })

    test('should handle Stripe rate limit error', async () => {
      const stripeError = {
        type: 'StripeRateLimitError',
        message: 'Too many requests'
      }

      mockStripe.checkout.sessions.retrieve.mockRejectedValueOnce(stripeError)

      const request = createMockRequest('cs_test_123456789')
      const response = await GET(request, { params: { sessionId: 'cs_test_123456789' } })
      const data = await response.json()

      expect(response.status).toBe(429)
      expect(data.error).toBe('Rate limit exceeded')
      expect(data.code).toBe('RATE_LIMIT')
    })
  })

  describe('Data parsing edge cases', () => {
    test('should handle session without line items', async () => {
      const sessionWithoutItems = {
        ...mockStripeSession,
        line_items: null
      }

      mockStripe.checkout.sessions.retrieve.mockResolvedValueOnce(sessionWithoutItems)

      const request = createMockRequest('cs_test_123456789')
      const response = await GET(request, { params: { sessionId: 'cs_test_123456789' } })
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.items).toEqual([])
    })

    test('should handle session without shipping details', async () => {
      const sessionWithoutShipping = {
        ...mockStripeSession,
        shipping_cost: null,
        shipping_details: null
      }

      mockStripe.checkout.sessions.retrieve.mockResolvedValueOnce(sessionWithoutShipping)

      const request = createMockRequest('cs_test_123456789')
      const response = await GET(request, { params: { sessionId: 'cs_test_123456789' } })
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.shippingDetails.method).toBe('Dostawa standardowa')
      expect(data.shippingDetails.estimatedDelivery).toBe('3-5 dni roboczych')
      expect(data.shippingDetails.address).toBeUndefined()
      expect(data.pricing.shipping).toBe(0)
    })

    test('should handle session without customer details', async () => {
      const sessionWithoutCustomer = {
        ...mockStripeSession,
        customer_details: null,
        customer_email: 'fallback@example.com'
      }

      mockStripe.checkout.sessions.retrieve.mockResolvedValueOnce(sessionWithoutCustomer)

      const request = createMockRequest('cs_test_123456789')
      const response = await GET(request, { params: { sessionId: 'cs_test_123456789' } })
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.customerInfo.email).toBe('fallback@example.com')
      expect(data.customerInfo.name).toBe('Jan Kowalski') // From metadata
      expect(data.customerInfo.phone).toBe('+48123456789') // From metadata
    })

    test('should generate fallback order ID when missing', async () => {
      const sessionWithoutOrderId = {
        ...mockStripeSession,
        metadata: {}
      }

      mockStripe.checkout.sessions.retrieve.mockResolvedValueOnce(sessionWithoutOrderId)

      const request = createMockRequest('cs_test_123456789')
      const response = await GET(request, { params: { sessionId: 'cs_test_123456789' } })
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.orderId).toBe('ORD-23456789') // Last 8 chars of session ID
    })
  })

  describe('Response format', () => {
    test('should include timestamp in error responses', async () => {
      const request = createMockRequest('invalid_id')
      const response = await GET(request, { params: { sessionId: 'invalid_id' } })
      const data = await response.json()

      expect(data.timestamp).toBeDefined()
      expect(new Date(data.timestamp)).toBeInstanceOf(Date)
    })

    test('should format dates correctly', async () => {
      const request = createMockRequest('cs_test_123456789')
      const response = await GET(request, { params: { sessionId: 'cs_test_123456789' } })
      const data = await response.json()

      expect(data.createdAt).toBe('2022-01-01T00:00:00.000Z')
    })
  })
})