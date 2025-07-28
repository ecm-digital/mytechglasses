/**
 * Production monitoring and logging system
 * Handles performance monitoring, error tracking, and analytics
 */

import { getConfig, isFeatureEnabled } from '@/lib/environment'
import { errorLogger } from '@/lib/error-logging'

// ============================================================================
// TYPES AND INTERFACES
// ============================================================================

export interface PaymentEvent {
  type: 'payment_initiated' | 'payment_succeeded' | 'payment_failed' | 'payment_cancelled'
  sessionId?: string
  orderId?: string
  amount?: number
  currency?: string
  paymentMethod?: string
  errorCode?: string
  errorMessage?: string
  customerEmail?: string
  timestamp: string
  metadata?: Record<string, any>
}

export interface PerformanceMetric {
  name: string
  value: number
  unit: 'ms' | 'bytes' | 'count' | 'percentage'
  timestamp: string
  tags?: Record<string, string>
}

export interface BusinessMetric {
  name: string
  value: number
  timestamp: string
  dimensions?: Record<string, string>
}

export interface HealthCheck {
  service: string
  status: 'healthy' | 'unhealthy' | 'degraded'
  responseTime?: number
  error?: string
  timestamp: string
}

// ============================================================================
// PAYMENT EVENT TRACKING
// ============================================================================

class PaymentMonitor {
  private events: PaymentEvent[] = []
  private maxEvents = 1000

  /**
   * Tracks a payment event
   */
  trackPaymentEvent(event: Omit<PaymentEvent, 'timestamp'>): void {
    if (!isFeatureEnabled('analytics')) {
      return
    }

    const paymentEvent: PaymentEvent = {
      ...event,
      timestamp: new Date().toISOString()
    }

    // Store locally
    this.events.push(paymentEvent)
    if (this.events.length > this.maxEvents) {
      this.events.shift()
    }

    // Send to external analytics
    this.sendToAnalytics(paymentEvent)

    // Log critical events
    if (event.type === 'payment_failed') {
      errorLogger.error('payment', `Payment failed: ${event.errorMessage}`, undefined, {
        sessionId: event.sessionId,
        orderId: event.orderId,
        amount: event.amount,
        errorCode: event.errorCode
      })
    }
  }

  /**
   * Gets payment events for analysis
   */
  getPaymentEvents(limit: number = 100): PaymentEvent[] {
    return this.events.slice(-limit)
  }

  /**
   * Gets payment metrics
   */
  getPaymentMetrics(): {
    totalPayments: number
    successfulPayments: number
    failedPayments: number
    cancelledPayments: number
    successRate: number
    averageAmount: number
  } {
    const total = this.events.length
    const successful = this.events.filter(e => e.type === 'payment_succeeded').length
    const failed = this.events.filter(e => e.type === 'payment_failed').length
    const cancelled = this.events.filter(e => e.type === 'payment_cancelled').length
    
    const successRate = total > 0 ? (successful / total) * 100 : 0
    
    const amounts = this.events
      .filter(e => e.amount && e.type === 'payment_succeeded')
      .map(e => e.amount!)
    const averageAmount = amounts.length > 0 
      ? amounts.reduce((sum, amount) => sum + amount, 0) / amounts.length 
      : 0

    return {
      totalPayments: total,
      successfulPayments: successful,
      failedPayments: failed,
      cancelledPayments: cancelled,
      successRate,
      averageAmount
    }
  }

  /**
   * Sends event to external analytics services
   */
  private sendToAnalytics(event: PaymentEvent): void {
    if (!isFeatureEnabled('analytics')) {
      return
    }

    // Google Analytics 4
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', event.type, {
        event_category: 'payment',
        event_label: event.sessionId,
        value: event.amount,
        custom_map: {
          order_id: event.orderId,
          payment_method: event.paymentMethod,
          currency: event.currency
        }
      })
    }

    // Send to custom analytics endpoint
    if (typeof fetch !== 'undefined') {
      fetch('/api/analytics/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ event })
      }).catch(error => {
        console.warn('Failed to send analytics event:', error)
      })
    }
  }
}

// ============================================================================
// PERFORMANCE MONITORING
// ============================================================================

class PerformanceMonitor {
  private metrics: PerformanceMetric[] = []
  private maxMetrics = 1000

  /**
   * Records a performance metric
   */
  recordMetric(metric: Omit<PerformanceMetric, 'timestamp'>): void {
    if (!isFeatureEnabled('performance-monitoring')) {
      return
    }

    const performanceMetric: PerformanceMetric = {
      ...metric,
      timestamp: new Date().toISOString()
    }

    this.metrics.push(performanceMetric)
    if (this.metrics.length > this.maxMetrics) {
      this.metrics.shift()
    }

    // Send to monitoring service
    this.sendToMonitoring(performanceMetric)

    // Alert on performance issues
    this.checkPerformanceThresholds(performanceMetric)
  }

  /**
   * Measures execution time of a function
   */
  measureExecutionTime<T>(
    name: string,
    fn: () => T | Promise<T>,
    tags?: Record<string, string>
  ): T | Promise<T> {
    const start = performance.now()

    const finish = (result: T) => {
      const duration = performance.now() - start
      this.recordMetric({
        name,
        value: duration,
        unit: 'ms',
        tags
      })
      return result
    }

    try {
      const result = fn()
      
      if (result instanceof Promise) {
        return result.then(finish).catch(error => {
          finish(error)
          throw error
        })
      }
      
      return finish(result)
    } catch (error) {
      finish(error as T)
      throw error
    }
  }

  /**
   * Gets performance metrics
   */
  getMetrics(name?: string, limit: number = 100): PerformanceMetric[] {
    let filtered = this.metrics
    
    if (name) {
      filtered = filtered.filter(m => m.name === name)
    }
    
    return filtered.slice(-limit)
  }

  /**
   * Gets performance summary
   */
  getPerformanceSummary(): Record<string, {
    count: number
    average: number
    min: number
    max: number
    p95: number
  }> {
    const summary: Record<string, any> = {}

    // Group metrics by name
    const grouped = this.metrics.reduce((acc, metric) => {
      if (!acc[metric.name]) {
        acc[metric.name] = []
      }
      acc[metric.name].push(metric.value)
      return acc
    }, {} as Record<string, number[]>)

    // Calculate statistics for each metric
    Object.entries(grouped).forEach(([name, values]) => {
      const sorted = values.sort((a, b) => a - b)
      const count = values.length
      const sum = values.reduce((a, b) => a + b, 0)
      
      summary[name] = {
        count,
        average: sum / count,
        min: sorted[0],
        max: sorted[sorted.length - 1],
        p95: sorted[Math.floor(sorted.length * 0.95)]
      }
    })

    return summary
  }

  /**
   * Sends metric to monitoring service
   */
  private sendToMonitoring(metric: PerformanceMetric): void {
    // Send to monitoring service (e.g., DataDog, New Relic)
    if (typeof fetch !== 'undefined') {
      fetch('/api/monitoring/metrics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ metric })
      }).catch(error => {
        console.warn('Failed to send performance metric:', error)
      })
    }
  }

  /**
   * Checks performance thresholds and alerts
   */
  private checkPerformanceThresholds(metric: PerformanceMetric): void {
    const thresholds = {
      'api_response_time': 5000, // 5 seconds
      'checkout_session_creation': 10000, // 10 seconds
      'stripe_redirect': 3000, // 3 seconds
      'cart_operation': 1000, // 1 second
      'page_load': 3000 // 3 seconds
    }

    const threshold = thresholds[metric.name as keyof typeof thresholds]
    
    if (threshold && metric.value > threshold) {
      errorLogger.warning('ui', `Performance threshold exceeded: ${metric.name} took ${metric.value}ms (threshold: ${threshold}ms)`, undefined, {
        metric: metric.name,
        value: metric.value,
        threshold,
        tags: metric.tags
      })
    }
  }
}

// ============================================================================
// HEALTH MONITORING
// ============================================================================

class HealthMonitor {
  private checks: HealthCheck[] = []
  private maxChecks = 100

  /**
   * Records a health check result
   */
  recordHealthCheck(check: Omit<HealthCheck, 'timestamp'>): void {
    const healthCheck: HealthCheck = {
      ...check,
      timestamp: new Date().toISOString()
    }

    this.checks.push(healthCheck)
    if (this.checks.length > this.maxChecks) {
      this.checks.shift()
    }

    // Alert on unhealthy services
    if (check.status === 'unhealthy') {
      errorLogger.error('api', `Service unhealthy: ${check.service}`, undefined, {
        service: check.service,
        error: check.error,
        responseTime: check.responseTime
      })
    }
  }

  /**
   * Gets health check results
   */
  getHealthChecks(service?: string, limit: number = 50): HealthCheck[] {
    let filtered = this.checks
    
    if (service) {
      filtered = filtered.filter(c => c.service === service)
    }
    
    return filtered.slice(-limit)
  }

  /**
   * Gets overall system health
   */
  getSystemHealth(): {
    status: 'healthy' | 'degraded' | 'unhealthy'
    services: Record<string, {
      status: 'healthy' | 'degraded' | 'unhealthy'
      lastCheck: string
      uptime: number
    }>
  } {
    const services: Record<string, any> = {}
    
    // Get latest check for each service
    const latestChecks = this.checks.reduce((acc, check) => {
      if (!acc[check.service] || check.timestamp > acc[check.service].timestamp) {
        acc[check.service] = check
      }
      return acc
    }, {} as Record<string, HealthCheck>)

    // Calculate service health
    Object.entries(latestChecks).forEach(([service, check]) => {
      const serviceChecks = this.checks.filter(c => c.service === service)
      const healthyChecks = serviceChecks.filter(c => c.status === 'healthy').length
      const uptime = serviceChecks.length > 0 ? (healthyChecks / serviceChecks.length) * 100 : 0

      services[service] = {
        status: check.status,
        lastCheck: check.timestamp,
        uptime
      }
    })

    // Determine overall system status
    const serviceStatuses = Object.values(services).map(s => s.status)
    const overallStatus = serviceStatuses.includes('unhealthy') ? 'unhealthy' :
                         serviceStatuses.includes('degraded') ? 'degraded' : 'healthy'

    return {
      status: overallStatus,
      services
    }
  }
}

// ============================================================================
// BUSINESS METRICS
// ============================================================================

class BusinessMetricsMonitor {
  private metrics: BusinessMetric[] = []
  private maxMetrics = 1000

  /**
   * Records a business metric
   */
  recordMetric(metric: Omit<BusinessMetric, 'timestamp'>): void {
    if (!isFeatureEnabled('analytics')) {
      return
    }

    const businessMetric: BusinessMetric = {
      ...metric,
      timestamp: new Date().toISOString()
    }

    this.metrics.push(businessMetric)
    if (this.metrics.length > this.maxMetrics) {
      this.metrics.shift()
    }

    // Send to analytics
    this.sendToAnalytics(businessMetric)
  }

  /**
   * Gets business metrics
   */
  getMetrics(name?: string, timeRange?: { start: string; end: string }): BusinessMetric[] {
    let filtered = this.metrics

    if (name) {
      filtered = filtered.filter(m => m.name === name)
    }

    if (timeRange) {
      filtered = filtered.filter(m => 
        m.timestamp >= timeRange.start && m.timestamp <= timeRange.end
      )
    }

    return filtered
  }

  /**
   * Gets revenue metrics
   */
  getRevenueMetrics(): {
    totalRevenue: number
    averageOrderValue: number
    conversionRate: number
    topProducts: Array<{ name: string; revenue: number; orders: number }>
  } {
    const revenueMetrics = this.metrics.filter(m => m.name === 'revenue')
    const orderMetrics = this.metrics.filter(m => m.name === 'order_completed')
    const sessionMetrics = this.metrics.filter(m => m.name === 'session_started')

    const totalRevenue = revenueMetrics.reduce((sum, m) => sum + m.value, 0)
    const totalOrders = orderMetrics.length
    const totalSessions = sessionMetrics.length

    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0
    const conversionRate = totalSessions > 0 ? (totalOrders / totalSessions) * 100 : 0

    // Calculate top products
    const productRevenue: Record<string, { revenue: number; orders: number }> = {}
    
    orderMetrics.forEach(metric => {
      const productName = metric.dimensions?.product_name || 'Unknown'
      const revenue = metric.value || 0
      
      if (!productRevenue[productName]) {
        productRevenue[productName] = { revenue: 0, orders: 0 }
      }
      
      productRevenue[productName].revenue += revenue
      productRevenue[productName].orders += 1
    })

    const topProducts = Object.entries(productRevenue)
      .map(([name, data]) => ({ name, ...data }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10)

    return {
      totalRevenue,
      averageOrderValue,
      conversionRate,
      topProducts
    }
  }

  /**
   * Sends metric to analytics
   */
  private sendToAnalytics(metric: BusinessMetric): void {
    // Send to analytics service
    if (typeof fetch !== 'undefined') {
      fetch('/api/analytics/business-metrics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ metric })
      }).catch(error => {
        console.warn('Failed to send business metric:', error)
      })
    }
  }
}

// ============================================================================
// SINGLETON INSTANCES
// ============================================================================

export const paymentMonitor = new PaymentMonitor()
export const performanceMonitor = new PerformanceMonitor()
export const healthMonitor = new HealthMonitor()
export const businessMetrics = new BusinessMetricsMonitor()

// ============================================================================
// CONVENIENCE FUNCTIONS
// ============================================================================

/**
 * Tracks a payment event
 */
export const trackPayment = (event: Omit<PaymentEvent, 'timestamp'>): void => {
  paymentMonitor.trackPaymentEvent(event)
}

/**
 * Records a performance metric
 */
export const recordPerformance = (metric: Omit<PerformanceMetric, 'timestamp'>): void => {
  performanceMonitor.recordMetric(metric)
}

/**
 * Measures function execution time
 */
export const measureTime = <T>(
  name: string,
  fn: () => T | Promise<T>,
  tags?: Record<string, string>
): T | Promise<T> => {
  return performanceMonitor.measureExecutionTime(name, fn, tags)
}

/**
 * Records a health check
 */
export const recordHealth = (check: Omit<HealthCheck, 'timestamp'>): void => {
  healthMonitor.recordHealthCheck(check)
}

/**
 * Records a business metric
 */
export const recordBusiness = (metric: Omit<BusinessMetric, 'timestamp'>): void => {
  businessMetrics.recordMetric(metric)
}

// ============================================================================
// MONITORING DASHBOARD DATA
// ============================================================================

/**
 * Gets comprehensive monitoring data for dashboard
 */
export const getMonitoringDashboard = () => {
  return {
    timestamp: new Date().toISOString(),
    environment: getConfig(),
    payment: paymentMonitor.getPaymentMetrics(),
    performance: performanceMonitor.getPerformanceSummary(),
    health: healthMonitor.getSystemHealth(),
    business: businessMetrics.getRevenueMetrics(),
    errors: errorLogger.getMetrics()
  }
}

// ============================================================================
// INITIALIZATION
// ============================================================================

/**
 * Initializes monitoring system
 */
export const initializeMonitoring = (): void => {
  const config = getConfig()
  
  if (config.isProduction) {
    console.log('🔍 Initializing production monitoring...')
    
    // Set up periodic health checks
    setInterval(() => {
      // Check Stripe connectivity
      fetch('/api/health')
        .then(response => {
          recordHealth({
            service: 'api',
            status: response.ok ? 'healthy' : 'unhealthy',
            responseTime: performance.now()
          })
        })
        .catch(error => {
          recordHealth({
            service: 'api',
            status: 'unhealthy',
            error: error.message
          })
        })
    }, 60000) // Every minute

    console.log('✅ Production monitoring initialized')
  }
}

// ============================================================================
// TYPE DECLARATIONS
// ============================================================================

declare global {
  interface Window {
    gtag?: (...args: any[]) => void
  }
}