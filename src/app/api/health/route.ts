import { NextResponse } from 'next/server'
import { getStripeServer } from '@/lib/stripe'
import { validateEnvironmentConfig, getConfig } from '@/lib/environment'
import { recordHealth, healthMonitor } from '@/lib/monitoring'

export async function GET() {
  const startTime = performance.now()
  
  try {
    const config = getConfig()
    
    // Check environment configuration
    const envValidation = validateEnvironmentConfig()
    
    // Test Stripe connection
    let stripeStatus: 'healthy' | 'unhealthy' | 'degraded' = 'healthy'
    let stripeError: string | null = null
    let stripeResponseTime = 0
    
    try {
      const stripeStart = performance.now()
      const stripe = getStripeServer()
      
      // Simple test - retrieve account info with timeout
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Stripe connection timeout')), 5000)
      )
      
      await Promise.race([
        stripe.accounts.retrieve(),
        timeoutPromise
      ])
      
      stripeResponseTime = performance.now() - stripeStart
      
      // Mark as degraded if response time is high
      if (stripeResponseTime > 3000) {
        stripeStatus = 'degraded'
      }
      
    } catch (error) {
      stripeStatus = 'unhealthy'
      stripeError = error instanceof Error ? error.message : 'Unknown Stripe error'
      stripeResponseTime = performance.now() - startTime
    }
    
    // Test database/storage connectivity (if applicable)
    let storageStatus: 'healthy' | 'unhealthy' = 'healthy'
    let storageError: string | null = null
    
    try {
      // Test localStorage availability
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('health-check', 'test')
        localStorage.removeItem('health-check')
      }
    } catch (error) {
      storageStatus = 'unhealthy'
      storageError = 'localStorage not available'
    }
    
    // Calculate overall response time
    const totalResponseTime = performance.now() - startTime
    
    // Record health checks
    recordHealth({
      service: 'stripe',
      status: stripeStatus,
      responseTime: stripeResponseTime,
      error: stripeError
    })
    
    recordHealth({
      service: 'storage',
      status: storageStatus,
      error: storageError
    })
    
    recordHealth({
      service: 'api',
      status: 'healthy',
      responseTime: totalResponseTime
    })
    
    // Get system health summary
    const systemHealth = healthMonitor.getSystemHealth()
    
    const healthData = {
      status: systemHealth.status,
      timestamp: new Date().toISOString(),
      environment: {
        mode: config.environment,
        stripeMode: config.stripeMode,
        version: process.env.npm_package_version || '1.0.0'
      },
      checks: {
        environment: envValidation.isValid ? 'healthy' : 'unhealthy',
        stripe: stripeStatus,
        storage: storageStatus,
        api: 'healthy'
      },
      performance: {
        responseTime: Math.round(totalResponseTime),
        stripeResponseTime: Math.round(stripeResponseTime)
      },
      details: {
        environment: envValidation.isValid ? null : envValidation.errors,
        stripe: stripeError,
        storage: storageError,
        uptime: process.uptime ? Math.round(process.uptime()) : null
      },
      ...(config.isDevelopment && {
        debug: {
          nodeVersion: process.version,
          platform: process.platform,
          memory: process.memoryUsage ? process.memoryUsage() : null,
          systemHealth: systemHealth
        }
      })
    }
    
    // Return appropriate status code
    const isHealthy = systemHealth.status === 'healthy' && envValidation.isValid
    const isDegraded = systemHealth.status === 'degraded'
    
    let status = 200
    if (!isHealthy) {
      status = isDegraded ? 200 : 503 // 200 for degraded, 503 for unhealthy
    }
    
    const response = NextResponse.json(healthData, { status })
    
    // Add cache headers
    response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate')
    response.headers.set('Pragma', 'no-cache')
    response.headers.set('Expires', '0')
    
    // Add health check headers
    response.headers.set('X-Health-Status', systemHealth.status)
    response.headers.set('X-Response-Time', Math.round(totalResponseTime).toString())
    
    return response
    
  } catch (error) {
    const errorResponseTime = performance.now() - startTime
    
    // Record unhealthy API status
    recordHealth({
      service: 'api',
      status: 'unhealthy',
      responseTime: errorResponseTime,
      error: error instanceof Error ? error.message : 'Unknown error'
    })
    
    const errorResponse = {
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Unknown error',
      performance: {
        responseTime: Math.round(errorResponseTime)
      }
    }
    
    const response = NextResponse.json(errorResponse, { status: 503 })
    
    response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate')
    response.headers.set('X-Health-Status', 'unhealthy')
    response.headers.set('X-Response-Time', Math.round(errorResponseTime).toString())
    
    return response
  }
}