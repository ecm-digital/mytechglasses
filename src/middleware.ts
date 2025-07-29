import { NextRequest, NextResponse } from 'next/server'
import { getConfig, isFeatureEnabled } from '@/lib/environment'

// ============================================================================
// CORS CONFIGURATION
// ============================================================================

const CORS_ORIGINS = [
  'http://localhost:3000',
  'https://mytechglasses.com',
  'https://www.mytechglasses.com',
  // Add your production domains here
]

const CORS_METHODS = ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
const CORS_HEADERS = [
  'Content-Type',
  'Authorization',
  'X-Requested-With',
  'Accept',
  'Origin',
  'Cache-Control',
  'X-File-Name'
]

// ============================================================================
// SECURITY HEADERS
// ============================================================================

const SECURITY_HEADERS = {
  // Prevent XSS attacks
  'X-XSS-Protection': '1; mode=block',
  
  // Prevent MIME type sniffing
  'X-Content-Type-Options': 'nosniff',
  
  // Prevent clickjacking
  'X-Frame-Options': 'DENY',
  
  // Referrer policy
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  
  // Content Security Policy
  'Content-Security-Policy': [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com https://www.googletagmanager.com",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: https: blob:",
    "connect-src 'self' https://api.stripe.com https://www.google-analytics.com",
    "frame-src https://js.stripe.com https://hooks.stripe.com",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'"
  ].join('; '),
  
  // Permissions Policy (formerly Feature Policy)
  'Permissions-Policy': [
    'camera=()',
    'microphone=()',
    'geolocation=()',
    'payment=(self "https://js.stripe.com")'
  ].join(', ')
}

// ============================================================================
// RATE LIMITING
// ============================================================================

interface RateLimitEntry {
  count: number
  resetTime: number
}

// In-memory rate limiting (use Redis in production for multiple instances)
const rateLimitMap = new Map<string, RateLimitEntry>()

const RATE_LIMITS = {
  '/api/create-checkout-session': { requests: 10, window: 60 * 1000 }, // 10 requests per minute
  '/api/checkout-session': { requests: 20, window: 60 * 1000 }, // 20 requests per minute
  '/api/monitoring/errors': { requests: 50, window: 60 * 1000 }, // 50 requests per minute
  '/api/health': { requests: 100, window: 60 * 1000 }, // 100 requests per minute
  default: { requests: 100, window: 60 * 1000 } // Default rate limit
}

/**
 * Checks if request is rate limited
 */
function checkRateLimit(request: NextRequest): { allowed: boolean; remaining: number; resetTime: number } {
  if (!isFeatureEnabled('rate-limiting')) {
    return { allowed: true, remaining: 999, resetTime: Date.now() + 60000 }
  }

  const clientIP = getClientIP(request)
  const pathname = request.nextUrl.pathname
  
  // Find matching rate limit rule
  const rateLimit = RATE_LIMITS[pathname as keyof typeof RATE_LIMITS] || RATE_LIMITS.default
  
  const key = `${clientIP}:${pathname}`
  const now = Date.now()
  const entry = rateLimitMap.get(key)

  if (!entry || now > entry.resetTime) {
    // First request or window expired
    const newEntry: RateLimitEntry = {
      count: 1,
      resetTime: now + rateLimit.window
    }
    rateLimitMap.set(key, newEntry)
    
    return {
      allowed: true,
      remaining: rateLimit.requests - 1,
      resetTime: newEntry.resetTime
    }
  }

  if (entry.count >= rateLimit.requests) {
    // Rate limit exceeded
    return {
      allowed: false,
      remaining: 0,
      resetTime: entry.resetTime
    }
  }

  // Increment counter
  entry.count++
  rateLimitMap.set(key, entry)

  return {
    allowed: true,
    remaining: rateLimit.requests - entry.count,
    resetTime: entry.resetTime
  }
}

/**
 * Gets client IP address
 */
function getClientIP(request: NextRequest): string {
  // Check various headers for the real IP
  const forwarded = request.headers.get('x-forwarded-for')
  const realIP = request.headers.get('x-real-ip')
  const cfConnectingIP = request.headers.get('cf-connecting-ip')
  
  if (forwarded) {
    return forwarded.split(',')[0].trim()
  }
  
  if (realIP) {
    return realIP
  }
  
  if (cfConnectingIP) {
    return cfConnectingIP
  }
  
  return request.ip || 'unknown'
}

// ============================================================================
// CORS HANDLING
// ============================================================================

/**
 * Handles CORS preflight requests
 */
function handleCORS(request: NextRequest): NextResponse | null {
  if (!isFeatureEnabled('cors')) {
    return null
  }

  const origin = request.headers.get('origin')
  const method = request.method

  // Handle preflight requests
  if (method === 'OPTIONS') {
    const response = new NextResponse(null, { status: 200 })
    
    // Check if origin is allowed
    if (origin && (CORS_ORIGINS.includes(origin) || origin.includes('localhost'))) {
      response.headers.set('Access-Control-Allow-Origin', origin)
    }
    
    response.headers.set('Access-Control-Allow-Methods', CORS_METHODS.join(', '))
    response.headers.set('Access-Control-Allow-Headers', CORS_HEADERS.join(', '))
    response.headers.set('Access-Control-Max-Age', '86400') // 24 hours
    response.headers.set('Access-Control-Allow-Credentials', 'true')
    
    return response
  }

  return null
}

/**
 * Adds CORS headers to response
 */
function addCORSHeaders(response: NextResponse, request: NextRequest): void {
  if (!isFeatureEnabled('cors')) {
    return
  }

  const origin = request.headers.get('origin')
  
  if (origin && (CORS_ORIGINS.includes(origin) || origin.includes('localhost'))) {
    response.headers.set('Access-Control-Allow-Origin', origin)
    response.headers.set('Access-Control-Allow-Credentials', 'true')
  }
}

// ============================================================================
// SECURITY HEADERS
// ============================================================================

/**
 * Adds security headers to response
 */
function addSecurityHeaders(response: NextResponse): void {
  if (!isFeatureEnabled('security-headers')) {
    return
  }

  Object.entries(SECURITY_HEADERS).forEach(([key, value]) => {
    response.headers.set(key, value)
  })
  
  // Add HSTS header for HTTPS
  if (response.url.startsWith('https://')) {
    response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload')
  }
}

// ============================================================================
// MAIN MIDDLEWARE
// ============================================================================

export function middleware(request: NextRequest) {
  const config = getConfig()
  const pathname = request.nextUrl.pathname

  // Handle CORS preflight requests
  const corsResponse = handleCORS(request)
  if (corsResponse) {
    return corsResponse
  }

  // Check rate limiting for API routes
  if (pathname.startsWith('/api/')) {
    const rateLimit = checkRateLimit(request)
    
    if (!rateLimit.allowed) {
      const response = NextResponse.json(
        {
          error: 'Rate limit exceeded',
          message: 'Too many requests. Please try again later.',
          retryAfter: Math.ceil((rateLimit.resetTime - Date.now()) / 1000)
        },
        { status: 429 }
      )
      
      response.headers.set('X-RateLimit-Limit', RATE_LIMITS[pathname as keyof typeof RATE_LIMITS]?.requests.toString() || '100')
      response.headers.set('X-RateLimit-Remaining', '0')
      response.headers.set('X-RateLimit-Reset', rateLimit.resetTime.toString())
      response.headers.set('Retry-After', Math.ceil((rateLimit.resetTime - Date.now()) / 1000).toString())
      
      addCORSHeaders(response, request)
      addSecurityHeaders(response)
      
      return response
    }
  }

  // Continue with the request
  const response = NextResponse.next()

  // Add rate limit headers for API routes
  if (pathname.startsWith('/api/')) {
    const rateLimit = checkRateLimit(request)
    const limit = RATE_LIMITS[pathname as keyof typeof RATE_LIMITS]?.requests || 100
    
    response.headers.set('X-RateLimit-Limit', limit.toString())
    response.headers.set('X-RateLimit-Remaining', rateLimit.remaining.toString())
    response.headers.set('X-RateLimit-Reset', rateLimit.resetTime.toString())
  }

  // Add CORS headers
  addCORSHeaders(response, request)

  // Add security headers
  addSecurityHeaders(response)

  // Add environment info header (development only)
  if (config.isDevelopment) {
    response.headers.set('X-Environment', config.environment)
    response.headers.set('X-Stripe-Mode', config.stripeMode)
  }

  return response
}

// ============================================================================
// MIDDLEWARE CONFIGURATION
// ============================================================================

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
}

// ============================================================================
// CLEANUP FUNCTION
// ============================================================================

/**
 * Cleanup expired rate limit entries (call periodically)
 */
export function cleanupRateLimitMap(): void {
  const now = Date.now()
  
  rateLimitMap.forEach((entry, key) => {
    if (now > entry.resetTime) {
      rateLimitMap.delete(key)
    }
  })
}

// Cleanup every 5 minutes
if (typeof setInterval !== 'undefined') {
  setInterval(cleanupRateLimitMap, 5 * 60 * 1000)
}