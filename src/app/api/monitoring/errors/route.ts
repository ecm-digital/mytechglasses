import { NextRequest, NextResponse } from 'next/server'

// ============================================================================
// TYPES AND INTERFACES
// ============================================================================

interface ErrorReport {
  id: string
  level: 'error' | 'warning' | 'info' | 'debug'
  category: string
  message: string
  stack?: string
  context: {
    userId?: string
    sessionId?: string
    cartId?: string
    orderId?: string
    url?: string
    userAgent?: string
    timestamp?: string
    additionalData?: Record<string, any>
  }
  timestamp: string
}

interface ErrorResponse {
  success: boolean
  errorId?: string
  message?: string
  timestamp: string
}

// ============================================================================
// VALIDATION
// ============================================================================

const validateErrorReport = (data: any): { isValid: boolean; errors: string[] } => {
  const errors: string[] = []

  if (!data.error) {
    errors.push('Error object is required')
    return { isValid: false, errors }
  }

  const { error } = data

  if (!error.id || typeof error.id !== 'string') {
    errors.push('Error ID is required and must be a string')
  }

  if (!error.level || !['error', 'warning', 'info', 'debug'].includes(error.level)) {
    errors.push('Error level must be one of: error, warning, info, debug')
  }

  if (!error.category || typeof error.category !== 'string') {
    errors.push('Error category is required and must be a string')
  }

  if (!error.message || typeof error.message !== 'string') {
    errors.push('Error message is required and must be a string')
  }

  if (!error.timestamp || typeof error.timestamp !== 'string') {
    errors.push('Error timestamp is required and must be a string')
  }

  if (!error.context || typeof error.context !== 'object') {
    errors.push('Error context is required and must be an object')
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}

// ============================================================================
// ERROR PROCESSING
// ============================================================================

const processError = (errorReport: ErrorReport): void => {
  // In a real application, this would:
  // 1. Send to external monitoring services (Sentry, DataDog, etc.)
  // 2. Store in database for analysis
  // 3. Trigger alerts for critical errors
  // 4. Update error metrics

  const isProduction = process.env.NODE_ENV === 'production'
  const isCritical = errorReport.level === 'error' && 
                    ['payment', 'stripe', 'api'].includes(errorReport.category)

  // Log to console in development
  if (!isProduction) {
    console.log(`[MONITORING] ${errorReport.level.toUpperCase()}: ${errorReport.message}`, {
      id: errorReport.id,
      category: errorReport.category,
      context: errorReport.context,
      stack: errorReport.stack
    })
  }

  // In production, you would send to monitoring services
  if (isProduction) {
    // Example: Send to Sentry
    // Sentry.captureException(new Error(errorReport.message), {
    //   level: errorReport.level,
    //   tags: {
    //     category: errorReport.category,
    //     errorId: errorReport.id
    //   },
    //   contexts: {
    //     error_context: errorReport.context
    //   }
    // })

    // Example: Send to custom analytics
    // analytics.track('Error Occurred', {
    //   errorId: errorReport.id,
    //   level: errorReport.level,
    //   category: errorReport.category,
    //   message: errorReport.message,
    //   url: errorReport.context.url,
    //   userId: errorReport.context.userId
    // })
  }

  // Trigger alerts for critical errors
  if (isCritical) {
    // Example: Send to Slack, email, or PagerDuty
    console.error(`[CRITICAL ERROR] ${errorReport.message}`, {
      id: errorReport.id,
      context: errorReport.context
    })
  }
}

// ============================================================================
// RATE LIMITING
// ============================================================================

const rateLimitMap = new Map<string, { count: number; resetTime: number }>()
const RATE_LIMIT_WINDOW = 60 * 1000 // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 10 // Max 10 error reports per minute per IP

const checkRateLimit = (clientIP: string): boolean => {
  const now = Date.now()
  const clientData = rateLimitMap.get(clientIP)

  if (!clientData || now > clientData.resetTime) {
    rateLimitMap.set(clientIP, {
      count: 1,
      resetTime: now + RATE_LIMIT_WINDOW
    })
    return true
  }

  if (clientData.count >= RATE_LIMIT_MAX_REQUESTS) {
    return false
  }

  clientData.count++
  return true
}

// ============================================================================
// API HANDLER
// ============================================================================

export async function POST(request: NextRequest) {
  try {
    // Get client IP for rate limiting
    const clientIP = request.ip || 
                    request.headers.get('x-forwarded-for')?.split(',')[0] || 
                    request.headers.get('x-real-ip') || 
                    'unknown'

    // Check rate limit
    if (!checkRateLimit(clientIP)) {
      return NextResponse.json(
        {
          success: false,
          message: 'Rate limit exceeded. Too many error reports.',
          timestamp: new Date().toISOString()
        } as ErrorResponse,
        { status: 429 }
      )
    }

    // Parse request body
    let requestData: any
    try {
      requestData = await request.json()
    } catch (parseError) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid JSON in request body',
          timestamp: new Date().toISOString()
        } as ErrorResponse,
        { status: 400 }
      )
    }

    // Validate error report
    const validation = validateErrorReport(requestData)
    if (!validation.isValid) {
      return NextResponse.json(
        {
          success: false,
          message: `Validation failed: ${validation.errors.join(', ')}`,
          timestamp: new Date().toISOString()
        } as ErrorResponse,
        { status: 400 }
      )
    }

    const errorReport: ErrorReport = requestData.error

    // Add server-side context
    errorReport.context = {
      ...errorReport.context,
      serverTimestamp: new Date().toISOString(),
      clientIP,
      userAgent: request.headers.get('user-agent') || undefined
    }

    // Process the error
    processError(errorReport)

    // Return success response
    return NextResponse.json(
      {
        success: true,
        errorId: errorReport.id,
        message: 'Error report received and processed',
        timestamp: new Date().toISOString()
      } as ErrorResponse,
      { status: 200 }
    )

  } catch (error) {
    console.error('Error in monitoring endpoint:', error)

    return NextResponse.json(
      {
        success: false,
        message: 'Internal server error while processing error report',
        timestamp: new Date().toISOString()
      } as ErrorResponse,
      { status: 500 }
    )
  }
}

// ============================================================================
// GET ENDPOINT FOR ERROR METRICS (Development only)
// ============================================================================

export async function GET(request: NextRequest) {
  // Only allow in development
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json(
      { message: 'Not available in production' },
      { status: 404 }
    )
  }

  // Simple error metrics endpoint for development
  return NextResponse.json({
    message: 'Error monitoring endpoint is active',
    timestamp: new Date().toISOString(),
    rateLimit: {
      window: RATE_LIMIT_WINDOW,
      maxRequests: RATE_LIMIT_MAX_REQUESTS
    }
  })
}