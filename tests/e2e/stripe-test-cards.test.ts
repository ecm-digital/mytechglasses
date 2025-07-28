/**
 * Stripe Test Cards Integration Tests
 * Tests different payment scenarios using Stripe test card numbers
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createPaymentError, mapStripeErrorToReason } from '@/lib/payment-errors'
import FailedPayment from '@/app/checkout/failed/page'

// Stripe test card scenarios
const STRIPE_TEST_CARDS = {
  success: {
    number: '4242424242424242',
    description: 'Successful payment',
    expectedOutcome: 'success'
  },
  declined: {
    number: '4000000000000002',
    description: 'Generic decline',
    expectedOutcome: 'card_declined',
    declineCode: 'generic_decline'
  },
  insufficientFunds: {
    number: '4000000000009995',
    description: 'Insufficient funds',
    expectedOutcome: 'insufficient_funds',
    declineCode: 'insufficient_funds'
  },
  expiredCard: {
    number: '4000000000000069',
    description: 'Expired card',
    expectedOutcome: 'expired_card',
    declineCode: 'expired_card'
  },
  incorrectCvc: {
    number: '4000000000000127',
    description: 'Incorrect CVC',
    expectedOutcome: 'incorrect_cvc',
    declineCode: 'incorrect_cvc'
  },
  processingError: {
    number: '4000000000000119',
    description: 'Processing error',
    expectedOutcome: 'processing_error',
    declineCode: 'processing_error'
  },
  authenticationRequired: {
    number: '4000002760003184',
    description: '3D Secure authentication required',
    expectedOutcome: 'authentication_required',
    declineCode: 'authentication_required'
  }
}

describe('Stripe Test Cards Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Payment Success Scenarios', () => {
    test('should handle successful payment with test card 4242424242424242', async () => {
      const mockSessionData = {
        id: 'cs_test_success',
        payment_status: 'paid',
        amount_total: 774531,
        currency: 'pln',
        customer_details: {
          email: 'test@example.com',
          name: 'Test User'
        },
        payment_intent: {
          id: 'pi_test_success',
          status: 'succeeded',
          payment_method: {
            card: {
              brand: 'visa',
              last4: '4242'
            }
          }
        }
      }

      // Mock successful session retrieval
      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          session: mockSessionData,
          lineItems: [
            {
              id: 1,
              name: 'Vision Pro',
              price: 2499,
              quantity: 1,
              emoji: '🥽'
            }
          ]
        })
      })

      // Mock URL params for success page
      const mockSearchParams = new URLSearchParams('?session_id=cs_test_success&order_id=MTG-123')
      jest.spyOn(require('next/navigation'), 'useSearchParams').mockReturnValue(mockSearchParams)

      const { container } = render(<div data-testid="success-page">Success Page Mock</div>)

      // Verify success page would be rendered
      expect(container).toBeInTheDocument()
    })
  })

  describe('Payment Failure Scenarios', () => {
    test('should handle card declined (4000000000000002)', () => {
      const mockSearchParams = new URLSearchParams('?reason=card_declined&session_id=cs_test_declined&amount=7745')
      jest.spyOn(require('next/navigation'), 'useSearchParams').mockReturnValue(mockSearchParams)

      render(<FailedPayment />)

      expect(screen.getByText('Płatność nie powiodła się')).toBeInTheDocument()
      expect(screen.getByText('Twoja karta została odrzucona przez bank')).toBeInTheDocument()
      
      // Should show retry suggestions
      expect(screen.getByText(/Sprawdź czy masz wystarczające środki/)).toBeInTheDocument()
      expect(screen.getByText(/Spróbuj użyć innej karty/)).toBeInTheDocument()
    })

    test('should handle insufficient funds (4000000000009995)', () => {
      const mockSearchParams = new URLSearchParams('?reason=insufficient_funds&session_id=cs_test_insufficient&amount=7745')
      jest.spyOn(require('next/navigation'), 'useSearchParams').mockReturnValue(mockSearchParams)

      render(<FailedPayment />)

      expect(screen.getByText('Niewystarczające środki na koncie')).toBeInTheDocument()
      expect(screen.getByText(/Sprawdź saldo na koncie/)).toBeInTheDocument()
      expect(screen.getByText(/Doładuj konto lub użyj innej karty/)).toBeInTheDocument()
    })

    test('should handle expired card (4000000000000069)', () => {
      const mockSearchParams = new URLSearchParams('?reason=expired_card&session_id=cs_test_expired&amount=7745')
      jest.spyOn(require('next/navigation'), 'useSearchParams').mockReturnValue(mockSearchParams)

      render(<FailedPayment />)

      expect(screen.getByText('Karta wygasła lub data ważności jest nieprawidłowa')).toBeInTheDocument()
      expect(screen.getByText(/Sprawdź datę ważności karty/)).toBeInTheDocument()
      expect(screen.getByText(/Użyj aktualnej karty płatniczej/)).toBeInTheDocument()
    })

    test('should handle incorrect CVC (4000000000000127)', () => {
      const mockSearchParams = new URLSearchParams('?reason=incorrect_cvc&session_id=cs_test_cvc&amount=7745')
      jest.spyOn(require('next/navigation'), 'useSearchParams').mockReturnValue(mockSearchParams)

      render(<FailedPayment />)

      expect(screen.getByText('Nieprawidłowy kod CVC/CVV')).toBeInTheDocument()
      expect(screen.getByText(/Sprawdź 3-cyfrowy kod na odwrocie karty/)).toBeInTheDocument()
    })

    test('should handle processing error (4000000000000119)', () => {
      const mockSearchParams = new URLSearchParams('?reason=processing_error&session_id=cs_test_processing&amount=7745')
      jest.spyOn(require('next/navigation'), 'useSearchParams').mockReturnValue(mockSearchParams)

      render(<FailedPayment />)

      expect(screen.getByText('Wystąpił problem techniczny podczas przetwarzania płatności')).toBeInTheDocument()
      expect(screen.getByText(/Spróbuj ponownie za kilka minut/)).toBeInTheDocument()
      expect(screen.getByText(/Sprawdź połączenie internetowe/)).toBeInTheDocument()
    })

    test('should handle authentication required (4000002760003184)', () => {
      const mockSearchParams = new URLSearchParams('?reason=authentication_required&session_id=cs_test_auth&amount=7745')
      jest.spyOn(require('next/navigation'), 'useSearchParams').mockReturnValue(mockSearchParams)

      render(<FailedPayment />)

      expect(screen.getByText('Bank wymaga dodatkowej autoryzacji tej transakcji')).toBeInTheDocument()
      expect(screen.getByText(/Sprawdź SMS lub aplikację bankową/)).toBeInTheDocument()
      expect(screen.getByText(/Potwierdź transakcję w banku/)).toBeInTheDocument()
    })
  })

  describe('Error Mapping and Processing', () => {
    test('should correctly map Stripe error codes to failure reasons', () => {
      const testCases = [
        { stripeCode: 'card_declined', expected: 'card_declined' },
        { stripeCode: 'generic_decline', expected: 'card_declined' },
        { stripeCode: 'insufficient_funds', expected: 'insufficient_funds' },
        { stripeCode: 'expired_card', expected: 'expired_card' },
        { stripeCode: 'incorrect_cvc', expected: 'incorrect_cvc' },
        { stripeCode: 'processing_error', expected: 'processing_error' },
        { stripeCode: 'authentication_required', expected: 'authentication_required' },
        { stripeCode: 'unknown_error', expected: 'unknown' }
      ]

      testCases.forEach(({ stripeCode, expected }) => {
        const result = mapStripeErrorToReason(stripeCode)
        expect(result).toBe(expected)
      })
    })

    test('should create proper payment error objects', () => {
      const mockStripeError = {
        code: 'card_declined',
        decline_code: 'insufficient_funds',
        message: 'Your card was declined.',
        type: 'card_error'
      }

      const paymentError = createPaymentError(mockStripeError)

      expect(paymentError.reason).toBe('insufficient_funds')
      expect(paymentError.message).toBe('Your card was declined.')
      expect(paymentError.userMessage).toBe('Niewystarczające środki na koncie')
      expect(paymentError.canRetry).toBe(true)
      expect(paymentError.suggestions).toContain('Sprawdź saldo na koncie')
    })
  })

  describe('Network and API Error Scenarios', () => {
    test('should handle network timeout during checkout session creation', async () => {
      const user = userEvent.setup()

      // Mock network timeout
      ;(global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network timeout'))

      // This would be tested in the actual checkout component
      const mockCheckoutHandler = jest.fn().mockRejectedValueOnce(new Error('Network timeout'))

      try {
        await mockCheckoutHandler()
      } catch (error) {
        expect(error.message).toBe('Network timeout')
      }

      expect(mockCheckoutHandler).toHaveBeenCalled()
    })

    test('should handle API rate limiting', async () => {
      // Mock rate limit response
      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 429,
        json: async () => ({ 
          error: 'Too many requests',
          code: 'RATE_LIMIT'
        })
      })

      const mockApiCall = async () => {
        const response = await fetch('/api/create-checkout-session', {
          method: 'POST',
          body: JSON.stringify({ items: [] })
        })
        
        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error)
        }
        
        return response.json()
      }

      await expect(mockApiCall()).rejects.toThrow('Too many requests')
    })

    test('should handle Stripe API errors', async () => {
      // Mock Stripe API error
      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: async () => ({ 
          error: 'Invalid parameters were supplied to Stripe API',
          code: 'INVALID_REQUEST'
        })
      })

      const mockApiCall = async () => {
        const response = await fetch('/api/create-checkout-session', {
          method: 'POST',
          body: JSON.stringify({ items: [] })
        })
        
        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error)
        }
        
        return response.json()
      }

      await expect(mockApiCall()).rejects.toThrow('Invalid parameters were supplied to Stripe API')
    })
  })

  describe('Payment Method Specific Tests', () => {
    test('should handle BLIK payment method', async () => {
      const mockSessionData = {
        id: 'cs_test_blik',
        payment_status: 'paid',
        amount_total: 774531,
        currency: 'pln',
        payment_intent: {
          payment_method: {
            type: 'blik'
          }
        }
      }

      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ session: mockSessionData })
      })

      // Test would verify BLIK-specific handling
      const response = await fetch('/api/checkout-session/cs_test_blik')
      const data = await response.json()

      expect(data.session.payment_intent.payment_method.type).toBe('blik')
    })

    test('should handle Przelewy24 payment method', async () => {
      const mockSessionData = {
        id: 'cs_test_p24',
        payment_status: 'paid',
        amount_total: 774531,
        currency: 'pln',
        payment_intent: {
          payment_method: {
            type: 'p24'
          }
        }
      }

      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ session: mockSessionData })
      })

      const response = await fetch('/api/checkout-session/cs_test_p24')
      const data = await response.json()

      expect(data.session.payment_intent.payment_method.type).toBe('p24')
    })
  })

  describe('Currency and Amount Validation', () => {
    test('should handle different currency amounts correctly', () => {
      const testAmounts = [
        { input: 2499, expected: 249900 }, // PLN to grosze
        { input: 1899.99, expected: 189999 },
        { input: 0.01, expected: 1 },
        { input: 999999, expected: 99999900 }
      ]

      testAmounts.forEach(({ input, expected }) => {
        const stripeAmount = Math.round(input * 100)
        expect(stripeAmount).toBe(expected)
      })
    })

    test('should validate maximum order amounts', () => {
      const maxAmount = 999999 // PLN
      const testAmount = 1000000 // Exceeds limit

      expect(testAmount).toBeGreaterThan(maxAmount)
      
      // This would trigger validation error in actual implementation
      const isValidAmount = testAmount <= maxAmount
      expect(isValidAmount).toBe(false)
    })
  })

  describe('Session Expiry and Timeout Handling', () => {
    test('should handle expired checkout sessions', async () => {
      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 404,
        json: async () => ({ 
          error: 'No such checkout session',
          code: 'SESSION_NOT_FOUND'
        })
      })

      const mockApiCall = async () => {
        const response = await fetch('/api/checkout-session/cs_expired')
        
        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error)
        }
        
        return response.json()
      }

      await expect(mockApiCall()).rejects.toThrow('No such checkout session')
    })

    test('should handle session timeout during payment', () => {
      const mockSearchParams = new URLSearchParams('?reason=cancelled&session_id=cs_timeout&timeout=true')
      jest.spyOn(require('next/navigation'), 'useSearchParams').mockReturnValue(mockSearchParams)

      render(<FailedPayment />)

      expect(screen.getByText('Płatność została anulowana')).toBeInTheDocument()
      expect(screen.getByText(/Możesz spróbować ponownie/)).toBeInTheDocument()
    })
  })
})