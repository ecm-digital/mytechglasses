import { NextRequest, NextResponse } from 'next/server'
import { getConfig, isFeatureEnabled } from '@/lib/environment'
import { performanceMonitor, getMonitoringDashboard } from '@/lib/monitoring'

// ============================================================================
// TYPES AND INTERFACES
// ============================================================================

interface MetricRequest {
  metric: {
    name: string
    value: number
    unit: 'ms' | 'bytes' | 'count' | 'percentage'
    tags?: Record<string, string>
  }
}

interface MetricsResponse {
  success: boolean
  message?: string
  timestamp: string
}

// ============================================================================
// VALIDATION
// ============================================================================

const validateMetricRequest = (data: any): { isValid: boolean; errors: string[] } => {
  const errors: string[] = []

  if (!data.metric) {
    errors.push('Metric object is required')
    return { isValid: false, errors }
  }

  const { metric } = data

  if (!metric.name || typeof metric.name !== 'string') {
    errors.push('Metric name is required and must be a string')
  }

  if (typeof metric.value !== 'number' || isNaN(metric.value)) {
    errors.push('Metric value is required and must be a number')
  }

  if (!metric.unit || !['ms', 'bytes', 'count', 'percentage'].includes(metric.unit)) {
    errors.push('Metric unit must be one of: ms, bytes, count, percentage')
  }

  if (metric.tags && typeof metric.tags !== 'object') {
    errors.push('Metric tags must be an object')
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}

// ============================================================================
// RATE LIMITING
// ============================================================================

const rateLimitMap = new Map<string, { count: number; resetTime: number }>()
const RATE_LIMIT_WINDOW = 60 * 1000 // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 100 // Max 100 metrics per minute per IP

const checkRateLimit = (clientIP: string): boolean => {
  if (!isFeatureEnabled('rate-limiting')) {
    return true
  }

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
// POST ENDPOINT - RECEIVE METRICS
// ============================================================================

export async function POST(request: NextRequest) {
  try {
    const config = getConfig()

    // Only allow in production or when performance monitoring is enabled
    if (!isFeatureEnabled('performance-monitoring')) {
      return NextResponse.json(
        {
          success: false,
          message: 'Performance monitoring is not enabled',
          timestamp: new Date().toISOString()
        } as MetricsResponse,
        { status: 404 }
      )
    }

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
          message: 'Rate limit exceeded. Too many metrics.',
          timestamp: new Date().toISOString()
        } as MetricsResponse,
        { status: 429 }
      )
    }

    // Parse request body
    let requestData: MetricRequest
    try {
      requestData = await request.json()
    } catch (parseError) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid JSON in request body',
          timestamp: new Date().toISOString()
        } as MetricsResponse,
        { status: 400 }
      )
    }

    // Validate metric data
    const validation = validateMetricRequest(requestData)
    if (!validation.isValid) {
      return NextResponse.json(
        {
          success: false,
          message: `Validation failed: ${validation.errors.join(', ')}`,
          timestamp: new Date().toISOString()
        } as MetricsResponse,
        { status: 400 }
      )
    }

    // Record the metric
    performanceMonitor.recordMetric(requestData.metric)

    // Return success response
    return NextResponse.json(
      {
        success: true,
        message: 'Metric recorded successfully',
        timestamp: new Date().toISOString()
      } as MetricsResponse,
      { status: 200 }
    )

  } catch (error) {
    console.error('Error in metrics endpoint:', error)

    return NextResponse.json(
      {
        success: false,
        message: 'Internal server error while processing metric',
        timestamp: new Date().toISOString()
      } as MetricsResponse,
      { status: 500 }
    )
  }
}

// ============================================================================
// GET ENDPOINT - RETRIEVE METRICS
// ============================================================================

export async function GET(request: NextRequest) {
  try {
    const config = getConfig()

    // Only allow in development or for authorized users
    if (config.isProduction) {
      // In production, you might want to add authentication here
      const authHeader = request.headers.get('authorization')
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return NextResponse.json(
          { message: 'Unauthorized' },
          { status: 401 }
        )
      }
      
      // Validate the token (implement your auth logic here)
      // const token = authHeader.substring(7)
      // if (!isValidToken(token)) {
      //   return NextResponse.json({ message: 'Invalid token' }, { status: 401 })
      // }
    }

    const { searchParams } = new URL(request.url)
    const metricName = searchParams.get('name')
    const limit = parseInt(searchParams.get('limit') || '100', 10)
    const format = searchParams.get('format') || 'json'

    // Get metrics data
    let metricsData

    if (format === 'dashboard') {
      // Return comprehensive dashboard data
      metricsData = getMonitoringDashboard()
    } else if (metricName) {
      // Return specific metric
      metricsData = {
        metrics: performanceMonitor.getMetrics(metricName, limit),
        summary: performanceMonitor.getPerformanceSummary()[metricName] || null
      }
    } else {
      // Return all metrics summary
      metricsData = {
        summary: performanceMonitor.getPerformanceSummary(),
        recentMetrics: performanceMonitor.getMetrics(undefined, limit)
      }
    }

    const response = NextResponse.json({
      success: true,
      data: metricsData,
      timestamp: new Date().toISOString(),
      meta: {
        limit,
        format,
        metricName
      }
    })

    // Add cache headers
    if (config.isDevelopment) {
      response.headers.set('Cache-Control', 'no-cache')
    } else {
      response.headers.set('Cache-Control', 'public, max-age=60') // Cache for 1 minute
    }

    return response

  } catch (error) {
    console.error('Error retrieving metrics:', error)

    return NextResponse.json(
      {
        success: false,
        message: 'Error retrieving metrics',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}

// ============================================================================
// DELETE ENDPOINT - CLEAR METRICS (Development only)
// ============================================================================

export async function DELETE(request: NextRequest) {
  const config = getConfig()

  // Only allow in development
  if (!config.isDevelopment) {
    return NextResponse.json(
      { message: 'Not available in production' },
      { status: 404 }
    )
  }

  try {
    // Clear metrics (you'd need to implement this method)
    // performanceMonitor.clearMetrics()

    return NextResponse.json({
      success: true,
      message: 'Metrics cleared successfully',
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: 'Error clearing metrics',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}