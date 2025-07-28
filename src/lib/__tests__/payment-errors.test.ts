/**
 * Tests for payment error handling utilities
 * Run with: npm test src/lib/__tests__/payment-errors.test.ts
 */

import {
  mapStripeErrorToReason,
  createPaymentError,
  generateFailureUrl,
  isRetryableError,
  getRetryDelay,
  categorizeError,
  shouldReportError,
  createUserErrorMessage,
  PaymentFailureReason
} from '../payment-errors'

describe('Payment Error Utilities', () => {
  describe('mapStripeErrorToReason', () => {
    test('should map common Stripe error codes correctly', () => {
      expect(mapStripeErrorToReason('card_declined')).toBe('card_declined')
      expect(mapStripeErrorToReason('insufficient_funds')).toBe('insufficient_funds')
      expect(mapStripeErrorToReason('expired_card')).toBe('expired_card')
      expect(mapStripeErrorToReason('incorrect_cvc')).toBe('incorrect_cvc')
      expect(mapStripeErrorToReason('processing_error')).toBe('processing_error')
      expect(mapStripeErrorToReason('authentication_required')).toBe('authentication_required')
    })

    test('should map unknown error codes to unknown', () => {
      expect(mapStripeErrorToReason('some_unknown_error')).toBe('unknown')
      expect(mapStripeErrorToReason('')).toBe('unknown')
    })

    test('should handle various decline codes', () => {
      expect(mapStripeErrorToReason('generic_decline')).toBe('card_declined')
      expect(mapStripeErrorToReason('lost_card')).toBe('card_declined')
      expect(mapStripeErrorToReason('stolen_card')).toBe('card_declined')
      expect(mapStripeErrorToReason('fraudulent')).toBe('card_declined')
    })
  })

  describe('createPaymentError', () => {
    test('should create payment error from Stripe error', () => {
      const stripeError = {
        code: 'card_declined',
        decline_code: 'generic_decline',
        message: 'Your card was declined.'
      }

      const paymentError = createPaymentError(stripeError)

      expect(paymentError.reason).toBe('card_declined')
      expect(paymentError.message).toBe('Your card was declined.')
      expect(paymentError.userMessage).toBe('Twoja karta została odrzucona przez bank')
      expect(paymentError.canRetry).toBe(true)
      expect(paymentError.suggestions).toContain('Sprawdź czy masz wystarczające środki na koncie')
    })

    test('should handle error without decline_code', () => {
      const stripeError = {
        code: 'insufficient_funds',
        message: 'Insufficient funds'
      }

      const paymentError = createPaymentError(stripeError)

      expect(paymentError.reason).toBe('insufficient_funds')
      expect(paymentError.userMessage).toBe('Niewystarczające środki na koncie')
    })

    test('should use fallback message when no Stripe message', () => {
      const stripeError = {
        code: 'unknown_error'
      }

      const paymentError = createPaymentError(stripeError, 'Custom fallback')

      expect(paymentError.message).toBe('Custom fallback')
      expect(paymentError.reason).toBe('unknown')
    })
  })

  describe('generateFailureUrl', () => {
    test('should generate basic failure URL', () => {
      const url = generateFailureUrl('https://example.com', 'card_declined')

      expect(url).toBe('https://example.com/checkout/failed?reason=card_declined')
    })

    test('should include session ID and amount', () => {
      const url = generateFailureUrl(
        'https://example.com',
        'insufficient_funds',
        'cs_test_123',
        2499
      )

      expect(url).toBe('https://example.com/checkout/failed?reason=insufficient_funds&session_id=cs_test_123&amount=2499')
    })

    test('should include additional parameters', () => {
      const url = generateFailureUrl(
        'https://example.com',
        'processing_error',
        undefined,
        undefined,
        { retry_count: '2', error_code: 'timeout' }
      )

      expect(url).toBe('https://example.com/checkout/failed?reason=processing_error&retry_count=2&error_code=timeout')
    })
  })

  describe('isRetryableError', () => {
    test('should identify retryable errors', () => {
      expect(isRetryableError('card_declined')).toBe(true)
      expect(isRetryableError('insufficient_funds')).toBe(true)
      expect(isRetryableError('processing_error')).toBe(true)
      expect(isRetryableError('authentication_required')).toBe(true)
      expect(isRetryableError('cancelled')).toBe(true)
      expect(isRetryableError('unknown')).toBe(true)
    })

    test('should identify non-retryable errors', () => {
      expect(isRetryableError('expired_card')).toBe(false)
      expect(isRetryableError('incorrect_cvc')).toBe(false)
    })
  })

  describe('getRetryDelay', () => {
    test('should calculate exponential backoff delays', () => {
      expect(getRetryDelay(1)).toBe(1000)  // 1 second
      expect(getRetryDelay(2)).toBe(2000)  // 2 seconds
      expect(getRetryDelay(3)).toBe(4000)  // 4 seconds
      expect(getRetryDelay(4)).toBe(8000)  // 8 seconds
    })

    test('should cap delay at maximum', () => {
      expect(getRetryDelay(10)).toBe(30000) // Max 30 seconds
      expect(getRetryDelay(20)).toBe(30000) // Max 30 seconds
    })
  })

  describe('categorizeError', () => {
    test('should categorize errors correctly', () => {
      expect(categorizeError('card_declined')).toBe('card_issue')
      expect(categorizeError('insufficient_funds')).toBe('card_issue')
      expect(categorizeError('expired_card')).toBe('card_issue')
      expect(categorizeError('incorrect_cvc')).toBe('user_error')
      expect(categorizeError('processing_error')).toBe('system_error')
      expect(categorizeError('authentication_required')).toBe('bank_requirement')
      expect(categorizeError('cancelled')).toBe('user_action')
      expect(categorizeError('unknown')).toBe('system_error')
    })
  })

  describe('shouldReportError', () => {
    test('should identify errors that should be reported', () => {
      expect(shouldReportError('processing_error')).toBe(true)
      expect(shouldReportError('unknown')).toBe(true)
    })

    test('should identify errors that should not be reported', () => {
      expect(shouldReportError('card_declined')).toBe(false)
      expect(shouldReportError('insufficient_funds')).toBe(false)
      expect(shouldReportError('expired_card')).toBe(false)
      expect(shouldReportError('incorrect_cvc')).toBe(false)
      expect(shouldReportError('authentication_required')).toBe(false)
      expect(shouldReportError('cancelled')).toBe(false)
    })
  })

  describe('createUserErrorMessage', () => {
    test('should create basic user error message', () => {
      const message = createUserErrorMessage('card_declined')
      expect(message).toBe('Twoja karta została odrzucona przez bank')
    })

    test('should append custom message', () => {
      const message = createUserErrorMessage('processing_error', 'Connection timeout')
      expect(message).toBe('Wystąpił problem techniczny podczas przetwarzania płatności: Connection timeout')
    })

    test('should handle unknown error types', () => {
      const message = createUserErrorMessage('unknown' as PaymentFailureReason)
      expect(message).toBe('Wystąpił nieoczekiwany problem z płatnością')
    })
  })
})