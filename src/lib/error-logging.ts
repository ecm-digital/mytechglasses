/**
 * Error logging and monitoring utilities
 * Provides comprehensive error tracking and reporting
 */

// ============================================================================
// TYPES AND INTERFACES
// ============================================================================

export type ErrorLevel = 'error' | 'warning' | 'info' | 'debug'

export type ErrorCategory = 
  | 'payment' 
  | 'validation' 
  | 'network' 
  | 'cart' 
  | 'checkout' 
  | 'stripe' 
  | 'api' 
  | 'ui' 
  | 'unknown'

export interface ErrorContext {
  userId?: string
  sessionId?: string
  cartId?: string
  orderId?: string
  url?: string
  userAgent?: string
  timestamp?: string
  additionalData?: Record<string, any>
}

export interface LoggedError {
  id: string
  level: ErrorLevel
  category: ErrorCategory
  message: string
  stack?: string
  context: ErrorContext
  timestamp: string
  resolved: boolean
  reportedToMonitoring: boolean
}

export interface ErrorMetrics {
  totalErrors: number
  errorsByCategory: Record<ErrorCategory, number>
  errorsByLevel: Record<ErrorLevel, number>
  recentErrors: LoggedError[]
  topErrors: Array<{ message: string; count: number }>
}

// ============================================================================
// ERROR STORAGE
// ============================================================================

class ErrorStorage {
  private storageKey = 'my-tech-glasses-errors'
  private maxErrors = 100
  private maxAge = 7 * 24 * 60 * 60 * 1000 // 7 days

  private getStoredErrors(): LoggedError[] {
    if (typeof window === 'undefined') return []

    try {
      const stored = localStorage.getItem(this.storageKey)
      if (!stored) return []

      const errors = JSON.parse(stored) as LoggedError[]
      
      // Filter out old errors
      const cutoff = Date.now() - this.maxAge
      return errors.filter(error => new Date(error.timestamp).getTime() > cutoff)
    } catch (error) {
      console.warn('Failed to load stored errors:', error)
      return []
    }
  }

  private saveErrors(errors: LoggedError[]): void {
    if (typeof window === 'undefined') return

    try {
      // Keep only the most recent errors
      const recentErrors = errors
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
        .slice(0, this.maxErrors)

      localStorage.setItem(this.storageKey, JSON.stringify(recentErrors))
    } catch (error) {
      console.warn('Failed to save errors to storage:', error)
    }
  }

  addError(error: LoggedError): void {
    const errors = this.getStoredErrors()
    errors.push(error)
    this.saveErrors(errors)
  }

  getErrors(): LoggedError[] {
    return this.getStoredErrors()
  }

  clearErrors(): void {
    if (typeof window === 'undefined') return
    localStorage.removeItem(this.storageKey)
  }

  markErrorResolved(errorId: string): void {
    const errors = this.getStoredErrors()
    const error = errors.find(e => e.id === errorId)
    if (error) {
      error.resolved = true
      this.saveErrors(errors)
    }
  }
}

// ============================================================================
// ERROR LOGGER CLASS
// ============================================================================

class ErrorLogger {
  private storage = new ErrorStorage()
  private isProduction = process.env.NODE_ENV === 'production'
  private enableConsoleLogging = !this.isProduction

  private generateErrorId(): string {
    return `err_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  private getErrorContext(): ErrorContext {
    const context: ErrorContext = {
      timestamp: new Date().toISOString(),
      url: typeof window !== 'undefined' ? window.location.href : undefined,
      userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : undefined
    }

    // Try to get session ID from various sources
    if (typeof window !== 'undefined') {
      try {
        const sessionId = sessionStorage.getItem('session_id') || 
                         localStorage.getItem('session_id') ||
                         document.cookie.match(/session_id=([^;]+)/)?.[1]
        if (sessionId) {
          context.sessionId = sessionId
        }
      } catch (error) {
        // Ignore cookie/storage errors
      }
    }

    return context
  }

  private shouldReportToMonitoring(level: ErrorLevel, category: ErrorCategory): boolean {
    // Always report errors and warnings in production
    if (this.isProduction && (level === 'error' || level === 'warning')) {
      return true
    }

    // Report critical categories regardless of environment
    const criticalCategories: ErrorCategory[] = ['payment', 'stripe', 'api']
    return criticalCategories.includes(category)
  }

  private reportToMonitoring(error: LoggedError): void {
    // In a real application, this would send to services like:
    // - Sentry
    // - LogRocket
    // - DataDog
    // - Custom monitoring endpoint

    if (typeof window !== 'undefined' && window.gtag) {
      // Report to Google Analytics if available
      window.gtag('event', 'exception', {
        description: error.message,
        fatal: error.level === 'error',
        custom_map: {
          error_category: error.category,
          error_id: error.id
        }
      })
    }

    // Example: Send to custom monitoring endpoint
    if (this.isProduction) {
      fetch('/api/monitoring/errors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          error: {
            id: error.id,
            level: error.level,
            category: error.category,
            message: error.message,
            stack: error.stack,
            context: error.context,
            timestamp: error.timestamp
          }
        })
      }).catch(err => {
        console.warn('Failed to report error to monitoring:', err)
      })
    }
  }

  log(
    level: ErrorLevel,
    category: ErrorCategory,
    message: string,
    error?: Error,
    additionalContext?: Record<string, any>
  ): string {
    const errorId = this.generateErrorId()
    const context = {
      ...this.getErrorContext(),
      ...additionalContext
    }

    const loggedError: LoggedError = {
      id: errorId,
      level,
      category,
      message,
      stack: error?.stack,
      context,
      timestamp: new Date().toISOString(),
      resolved: false,
      reportedToMonitoring: false
    }

    // Store error locally
    this.storage.addError(loggedError)

    // Console logging for development
    if (this.enableConsoleLogging) {
      const consoleMethod = level === 'error' ? 'error' : 
                           level === 'warning' ? 'warn' : 
                           level === 'info' ? 'info' : 'log'
      
      console[consoleMethod](`[${category.toUpperCase()}] ${message}`, {
        errorId,
        context,
        originalError: error
      })
    }

    // Report to monitoring if needed
    if (this.shouldReportToMonitoring(level, category)) {
      loggedError.reportedToMonitoring = true
      this.reportToMonitoring(loggedError)
    }

    return errorId
  }

  error(category: ErrorCategory, message: string, error?: Error, context?: Record<string, any>): string {
    return this.log('error', category, message, error, context)
  }

  warning(category: ErrorCategory, message: string, error?: Error, context?: Record<string, any>): string {
    return this.log('warning', category, message, error, context)
  }

  info(category: ErrorCategory, message: string, context?: Record<string, any>): string {
    return this.log('info', category, message, undefined, context)
  }

  debug(category: ErrorCategory, message: string, context?: Record<string, any>): string {
    return this.log('debug', category, message, undefined, context)
  }

  getMetrics(): ErrorMetrics {
    const errors = this.storage.getErrors()
    
    const errorsByCategory: Record<ErrorCategory, number> = {
      payment: 0,
      validation: 0,
      network: 0,
      cart: 0,
      checkout: 0,
      stripe: 0,
      api: 0,
      ui: 0,
      unknown: 0
    }

    const errorsByLevel: Record<ErrorLevel, number> = {
      error: 0,
      warning: 0,
      info: 0,
      debug: 0
    }

    const messageCounts: Record<string, number> = {}

    errors.forEach(error => {
      errorsByCategory[error.category]++
      errorsByLevel[error.level]++
      messageCounts[error.message] = (messageCounts[error.message] || 0) + 1
    })

    const topErrors = Object.entries(messageCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([message, count]) => ({ message, count }))

    const recentErrors = errors
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 20)

    return {
      totalErrors: errors.length,
      errorsByCategory,
      errorsByLevel,
      recentErrors,
      topErrors
    }
  }

  clearErrors(): void {
    this.storage.clearErrors()
  }

  markResolved(errorId: string): void {
    this.storage.markErrorResolved(errorId)
  }
}

// ============================================================================
// SINGLETON INSTANCE
// ============================================================================

export const errorLogger = new ErrorLogger()

// ============================================================================
// CONVENIENCE FUNCTIONS
// ============================================================================

/**
 * Logs payment-related errors
 */
export const logPaymentError = (message: string, error?: Error, context?: Record<string, any>): string => {
  return errorLogger.error('payment', message, error, context)
}

/**
 * Logs Stripe-related errors
 */
export const logStripeError = (message: string, error?: Error, context?: Record<string, any>): string => {
  return errorLogger.error('stripe', message, error, context)
}

/**
 * Logs validation errors
 */
export const logValidationError = (message: string, context?: Record<string, any>): string => {
  return errorLogger.warning('validation', message, undefined, context)
}

/**
 * Logs cart-related errors
 */
export const logCartError = (message: string, error?: Error, context?: Record<string, any>): string => {
  return errorLogger.error('cart', message, error, context)
}

/**
 * Logs checkout-related errors
 */
export const logCheckoutError = (message: string, error?: Error, context?: Record<string, any>): string => {
  return errorLogger.error('checkout', message, error, context)
}

/**
 * Logs API-related errors
 */
export const logApiError = (message: string, error?: Error, context?: Record<string, any>): string => {
  return errorLogger.error('api', message, error, context)
}

/**
 * Logs network-related errors
 */
export const logNetworkError = (message: string, error?: Error, context?: Record<string, any>): string => {
  return errorLogger.error('network', message, error, context)
}

/**
 * Logs UI-related errors
 */
export const logUIError = (message: string, error?: Error, context?: Record<string, any>): string => {
  return errorLogger.warning('ui', message, error, context)
}

// ============================================================================
// ERROR BOUNDARY INTEGRATION
// ============================================================================

/**
 * Function to be called from React Error Boundaries
 */
export const logReactError = (error: Error, errorInfo: { componentStack: string }): string => {
  return errorLogger.error('ui', `React Error: ${error.message}`, error, {
    componentStack: errorInfo.componentStack,
    errorBoundary: true
  })
}

// ============================================================================
// GLOBAL ERROR HANDLERS
// ============================================================================

/**
 * Sets up global error handlers for unhandled errors
 */
export const setupGlobalErrorHandlers = (): void => {
  if (typeof window === 'undefined') return

  // Handle unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    errorLogger.error('unknown', `Unhandled Promise Rejection: ${event.reason}`, 
      event.reason instanceof Error ? event.reason : undefined, {
        type: 'unhandledrejection',
        promise: event.promise
      })
  })

  // Handle uncaught errors
  window.addEventListener('error', (event) => {
    errorLogger.error('unknown', `Uncaught Error: ${event.message}`, 
      event.error, {
        type: 'uncaughtError',
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno
      })
  })
}

// ============================================================================
// PERFORMANCE MONITORING
// ============================================================================

/**
 * Logs performance issues
 */
export const logPerformanceIssue = (metric: string, value: number, threshold: number): void => {
  if (value > threshold) {
    errorLogger.warning('ui', `Performance issue: ${metric} took ${value}ms (threshold: ${threshold}ms)`, undefined, {
      metric,
      value,
      threshold,
      performance: true
    })
  }
}

/**
 * Measures and logs function execution time
 */
export const measurePerformance = <T>(
  name: string, 
  fn: () => T, 
  threshold: number = 1000
): T => {
  const start = performance.now()
  const result = fn()
  const duration = performance.now() - start
  
  logPerformanceIssue(name, duration, threshold)
  
  return result
}

// ============================================================================
// CONSTANTS
// ============================================================================

export const ERROR_LOGGING_CONSTANTS = {
  MAX_STORED_ERRORS: 100,
  MAX_ERROR_AGE_DAYS: 7,
  PERFORMANCE_THRESHOLDS: {
    API_CALL: 5000,
    COMPONENT_RENDER: 100,
    CART_OPERATION: 500,
    PAYMENT_OPERATION: 10000
  }
} as const

// ============================================================================
// TYPE DECLARATIONS
// ============================================================================

declare global {
  interface Window {
    gtag?: (...args: any[]) => void
  }
}