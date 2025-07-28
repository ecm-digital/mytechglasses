/**
 * Payment error handling utilities
 * Maps Stripe errors to user-friendly messages and failure reasons
 */

// ============================================================================
// TYPES AND INTERFACES
// ============================================================================

export type PaymentFailureReason = 
  | 'card_declined' 
  | 'insufficient_funds' 
  | 'expired_card' 
  | 'incorrect_cvc' 
  | 'processing_error' 
  | 'authentication_required'
  | 'cancelled'
  | 'unknown'

export interface PaymentError {
  reason: PaymentFailureReason
  message: string
  userMessage: string
  canRetry: boolean
  suggestions: string[]
}

// ============================================================================
// ERROR MAPPING
// ============================================================================

const STRIPE_ERROR_MAPPING: Record<string, PaymentFailureReason> = {
  // Card errors
  'card_declined': 'card_declined',
  'generic_decline': 'card_declined',
  'insufficient_funds': 'insufficient_funds',
  'lost_card': 'card_declined',
  'stolen_card': 'card_declined',
  'expired_card': 'expired_card',
  'incorrect_cvc': 'incorrect_cvc',
  'incorrect_number': 'card_declined',
  'invalid_cvc': 'incorrect_cvc',
  'invalid_expiry_month': 'expired_card',
  'invalid_expiry_year': 'expired_card',
  'invalid_number': 'card_declined',
  
  // Processing errors
  'processing_error': 'processing_error',
  'issuer_not_available': 'processing_error',
  'reenter_transaction': 'processing_error',
  'try_again_later': 'processing_error',
  
  // Authentication
  'authentication_required': 'authentication_required',
  'approve_with_id': 'authentication_required',
  'call_issuer': 'authentication_required',
  
  // Other
  'pickup_card': 'card_declined',
  'restricted_card': 'card_declined',
  'security_violation': 'card_declined',
  'service_not_allowed': 'card_declined',
  'stop_payment_order': 'card_declined',
  'testmode_decline': 'card_declined',
  'transaction_not_allowed': 'card_declined',
  'currency_not_supported': 'processing_error',
  'duplicate_transaction': 'processing_error',
  'fraudulent': 'card_declined',
  'merchant_blacklist': 'card_declined',
  'new_account_information_available': 'card_declined',
  'no_action_taken': 'processing_error',
  'not_permitted': 'card_declined',
  'offline_pin_required': 'authentication_required',
  'online_or_offline_pin_required': 'authentication_required',
  'pin_try_exceeded': 'card_declined',
  'revocation_of_all_authorizations': 'card_declined',
  'revocation_of_authorization': 'card_declined',
  'withdrawal_count_limit_exceeded': 'card_declined'
}

const USER_FRIENDLY_MESSAGES: Record<PaymentFailureReason, string> = {
  card_declined: 'Twoja karta została odrzucona przez bank',
  insufficient_funds: 'Niewystarczające środki na koncie',
  expired_card: 'Karta wygasła lub data ważności jest nieprawidłowa',
  incorrect_cvc: 'Nieprawidłowy kod CVC/CVV',
  processing_error: 'Wystąpił problem techniczny podczas przetwarzania płatności',
  authentication_required: 'Bank wymaga dodatkowej autoryzacji tej transakcji',
  cancelled: 'Płatność została anulowana',
  unknown: 'Wystąpił nieoczekiwany problem z płatnością'
}

const ERROR_SUGGESTIONS: Record<PaymentFailureReason, string[]> = {
  card_declined: [
    'Sprawdź czy masz wystarczające środki na koncie',
    'Upewnij się, że karta nie jest zablokowana',
    'Skontaktuj się z bankiem w sprawie transakcji',
    'Spróbuj użyć innej karty płatniczej'
  ],
  insufficient_funds: [
    'Sprawdź saldo na koncie',
    'Doładuj konto lub użyj innej karty',
    'Sprawdź czy nie masz ustawionych limitów dziennych',
    'Skontaktuj się z bankiem'
  ],
  expired_card: [
    'Sprawdź datę ważności karty',
    'Użyj aktualnej karty płatniczej',
    'Skontaktuj się z bankiem w sprawie nowej karty'
  ],
  incorrect_cvc: [
    'Sprawdź 3-cyfrowy kod na odwrocie karty',
    'Upewnij się, że wprowadzasz właściwy kod',
    'Sprawdź czy karta nie jest uszkodzona'
  ],
  processing_error: [
    'Spróbuj ponownie za kilka minut',
    'Sprawdź połączenie internetowe',
    'Użyj innej przeglądarki lub urządzenia',
    'Skontaktuj się z naszym wsparciem'
  ],
  authentication_required: [
    'Sprawdź SMS lub aplikację bankową',
    'Potwierdź transakcję w banku',
    'Upewnij się, że masz włączone powiadomienia',
    'Skontaktuj się z bankiem'
  ],
  cancelled: [
    'Możesz spróbować ponownie',
    'Twoje dane w koszyku zostały zachowane',
    'Wybierz inną metodę płatności'
  ],
  unknown: [
    'Spróbuj ponownie za kilka minut',
    'Sprawdź połączenie internetowe',
    'Skontaktuj się z naszym wsparciem',
    'Użyj innej metody płatności'
  ]
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Maps Stripe error code to payment failure reason
 */
export const mapStripeErrorToReason = (stripeErrorCode: string): PaymentFailureReason => {
  return STRIPE_ERROR_MAPPING[stripeErrorCode] || 'unknown'
}

/**
 * Creates a PaymentError object from Stripe error
 */
export const createPaymentError = (
  stripeError: any,
  fallbackMessage: string = 'Wystąpił problem z płatnością'
): PaymentError => {
  const errorCode = stripeError?.decline_code || stripeError?.code || 'unknown'
  const reason = mapStripeErrorToReason(errorCode)
  
  return {
    reason,
    message: stripeError?.message || fallbackMessage,
    userMessage: USER_FRIENDLY_MESSAGES[reason],
    canRetry: true, // Most payment errors can be retried
    suggestions: ERROR_SUGGESTIONS[reason]
  }
}

/**
 * Generates failure URL with error information
 */
export const generateFailureUrl = (
  baseUrl: string,
  reason: PaymentFailureReason,
  sessionId?: string,
  amount?: number,
  additionalParams?: Record<string, string>
): string => {
  const url = new URL('/checkout/failed', baseUrl)
  
  url.searchParams.set('reason', reason)
  
  if (sessionId) {
    url.searchParams.set('session_id', sessionId)
  }
  
  if (amount) {
    url.searchParams.set('amount', amount.toString())
  }
  
  if (additionalParams) {
    Object.entries(additionalParams).forEach(([key, value]) => {
      url.searchParams.set(key, value)
    })
  }
  
  return url.toString()
}

/**
 * Checks if error is retryable
 */
export const isRetryableError = (reason: PaymentFailureReason): boolean => {
  const nonRetryableReasons: PaymentFailureReason[] = [
    'expired_card',
    'incorrect_cvc'
  ]
  
  return !nonRetryableReasons.includes(reason)
}

/**
 * Gets retry delay in milliseconds based on attempt count
 */
export const getRetryDelay = (attemptCount: number): number => {
  // Exponential backoff: 1s, 2s, 4s, 8s, max 30s
  const baseDelay = 1000
  const maxDelay = 30000
  
  const delay = baseDelay * Math.pow(2, attemptCount - 1)
  return Math.min(delay, maxDelay)
}

/**
 * Formats error for logging
 */
export const formatErrorForLogging = (error: PaymentError, context?: Record<string, any>): Record<string, any> => {
  return {
    reason: error.reason,
    message: error.message,
    userMessage: error.userMessage,
    canRetry: error.canRetry,
    timestamp: new Date().toISOString(),
    ...context
  }
}

/**
 * Creates user-friendly error message for display
 */
export const createUserErrorMessage = (
  reason: PaymentFailureReason,
  customMessage?: string
): string => {
  const baseMessage = USER_FRIENDLY_MESSAGES[reason]
  
  if (customMessage) {
    return `${baseMessage}: ${customMessage}`
  }
  
  return baseMessage
}

// ============================================================================
// ERROR ANALYTICS
// ============================================================================

/**
 * Categorizes errors for analytics
 */
export const categorizeError = (reason: PaymentFailureReason): string => {
  const categories: Record<PaymentFailureReason, string> = {
    card_declined: 'card_issue',
    insufficient_funds: 'card_issue',
    expired_card: 'card_issue',
    incorrect_cvc: 'user_error',
    processing_error: 'system_error',
    authentication_required: 'bank_requirement',
    cancelled: 'user_action',
    unknown: 'system_error'
  }
  
  return categories[reason] || 'unknown'
}

/**
 * Determines if error should be reported to monitoring
 */
export const shouldReportError = (reason: PaymentFailureReason): boolean => {
  const reportableReasons: PaymentFailureReason[] = [
    'processing_error',
    'unknown'
  ]
  
  return reportableReasons.includes(reason)
}

// ============================================================================
// CONSTANTS
// ============================================================================

export const PAYMENT_ERROR_CONSTANTS = {
  MAX_RETRY_ATTEMPTS: 3,
  RETRY_DELAY_BASE: 1000,
  RETRY_DELAY_MAX: 30000,
  SESSION_TIMEOUT: 30 * 60 * 1000, // 30 minutes
} as const