/**
 * Application startup utilities
 * This file handles initialization tasks that should run when the app starts
 */

import { validateEnvironmentConfig, logEnvironmentConfig, getConfig } from '@/lib/environment'
import { getStripeServer } from '@/lib/stripe'
import { initializeMonitoring } from '@/lib/monitoring'
import { setupGlobalErrorHandlers } from '@/lib/error-logging'

export interface HealthCheckResult {
  status: 'healthy' | 'unhealthy' | 'degraded'
  timestamp: string
  environment: string
  checks: {
    environment: 'ok' | 'error'
    stripe: 'ok' | 'error' | 'degraded'
  }
  details: {
    environment: string[] | null
    stripe: string | null
  }
}

export async function healthCheck(): Promise<HealthCheckResult> {
  const config = getConfig()
  
  // Check environment configuration
  const envValidation = validateEnvironmentConfig()
  
  // Test Stripe connection
  let stripeStatus: 'ok' | 'error' | 'degraded' = 'ok'
  let stripeError: string | null = null
  
  try {
    const stripe = getStripeServer()
    const startTime = performance.now()
    
    // Simple test - retrieve account info with timeout
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Stripe connection timeout')), 5000)
    )
    
    await Promise.race([
      stripe.accounts.retrieve(),
      timeoutPromise
    ])
    
    const responseTime = performance.now() - startTime
    
    // Mark as degraded if response time is high
    if (responseTime > 3000) {
      stripeStatus = 'degraded'
    }
    
  } catch (error) {
    stripeStatus = 'error'
    stripeError = error instanceof Error ? error.message : 'Unknown Stripe error'
  }
  
  // Determine overall status
  let overallStatus: 'healthy' | 'unhealthy' | 'degraded' = 'healthy'
  
  if (!envValidation.isValid || stripeStatus === 'error') {
    overallStatus = 'unhealthy'
  } else if (stripeStatus === 'degraded') {
    overallStatus = 'degraded'
  }
  
  return {
    status: overallStatus,
    timestamp: new Date().toISOString(),
    environment: config.environment,
    checks: {
      environment: envValidation.isValid ? 'ok' : 'error',
      stripe: stripeStatus
    },
    details: {
      environment: envValidation.isValid ? null : envValidation.errors,
      stripe: stripeError
    }
  }
}

export function logStartup(): void {
  console.log('🚀 My Tech Glasses - Starting up...')
  
  // Log basic system info
  console.log(`📦 Node.js version: ${process.version}`)
  console.log(`🖥️  Platform: ${process.platform}`)
  console.log(`⚡ Process ID: ${process.pid}`)
  
  // Log environment configuration
  logEnvironmentConfig()
  
  // Initialize monitoring in production
  const config = getConfig()
  if (config.isProduction) {
    initializeMonitoring()
  }
  
  // Set up global error handlers
  if (typeof window !== 'undefined') {
    setupGlobalErrorHandlers()
  }
  
  // Log feature flags
  console.log('🎛️  Feature Flags:')
  console.log(`   Rate Limiting: ${config.rateLimitEnabled ? 'enabled' : 'disabled'}`)
  console.log(`   CORS: ${config.corsEnabled ? 'enabled' : 'disabled'}`)
  console.log(`   Security Headers: ${config.securityHeadersEnabled ? 'enabled' : 'disabled'}`)
  console.log(`   Error Reporting: ${config.enableErrorReporting ? 'enabled' : 'disabled'}`)
  console.log(`   Analytics: ${config.enableAnalytics ? 'enabled' : 'disabled'}`)
  console.log(`   Performance Monitoring: ${config.enablePerformanceMonitoring ? 'enabled' : 'disabled'}`)
  
  // Log URLs
  console.log('🌐 URLs:')
  console.log(`   API Base: ${config.apiBaseUrl}`)
  console.log(`   Frontend: ${config.frontendUrl}`)
  
  console.log('✅ Startup complete')
}

/**
 * Performs startup health check and logs results
 */
export async function startupHealthCheck(): Promise<void> {
  try {
    console.log('🔍 Performing startup health check...')
    
    const health = await healthCheck()
    
    if (health.status === 'healthy') {
      console.log('✅ All systems healthy')
    } else if (health.status === 'degraded') {
      console.warn('⚠️  System is degraded but operational')
      if (health.details.stripe) {
        console.warn(`   Stripe: ${health.details.stripe}`)
      }
    } else {
      console.error('❌ System health check failed')
      if (health.details.environment) {
        console.error('   Environment errors:')
        health.details.environment.forEach(error => console.error(`     - ${error}`))
      }
      if (health.details.stripe) {
        console.error(`   Stripe error: ${health.details.stripe}`)
      }
    }
    
  } catch (error) {
    console.error('❌ Health check failed:', error)
  }
}

/**
 * Graceful shutdown handler
 */
export function setupGracefulShutdown(): void {
  const config = getConfig()
  
  if (config.isProduction) {
    const gracefulShutdown = (signal: string) => {
      console.log(`🛑 Received ${signal}, starting graceful shutdown...`)
      
      // Close server connections, cleanup resources, etc.
      // This would be implemented based on your specific needs
      
      console.log('✅ Graceful shutdown complete')
      process.exit(0)
    }
    
    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'))
    process.on('SIGINT', () => gracefulShutdown('SIGINT'))
  }
}

/**
 * Initialize application
 */
export async function initializeApp(): Promise<void> {
  // Log startup information
  logStartup()
  
  // Perform health check
  await startupHealthCheck()
  
  // Setup graceful shutdown
  setupGracefulShutdown()
  
  console.log('🎉 Application initialized successfully')
}