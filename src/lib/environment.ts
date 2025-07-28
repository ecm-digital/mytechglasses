/**
 * Environment detection and configuration utilities
 * Handles development vs production environment differences
 */

// ============================================================================
// TYPES AND INTERFACES
// ============================================================================

export type Environment = 'development' | 'production' | 'test'

export interface EnvironmentConfig {
  environment: Environment
  isDevelopment: boolean
  isProduction: boolean
  isTest: boolean
  stripeMode: 'test' | 'live'
  apiBaseUrl: string
  frontendUrl: string
  enableDebugLogging: boolean
  enableErrorReporting: boolean
  enableAnalytics: boolean
  enablePerformanceMonitoring: boolean
  rateLimitEnabled: boolean
  corsEnabled: boolean
  securityHeadersEnabled: boolean
}

// ============================================================================
// ENVIRONMENT DETECTION
// ============================================================================

/**
 * Gets the current environment
 */
export const getCurrentEnvironment = (): Environment => {
  // Check NODE_ENV first
  if (process.env.NODE_ENV === 'test') {
    return 'test'
  }
  
  if (process.env.NODE_ENV === 'production') {
    return 'production'
  }
  
  // Check for Vercel environment
  if (process.env.VERCEL_ENV === 'production') {
    return 'production'
  }
  
  // Check for other production indicators
  if (process.env.RAILWAY_ENVIRONMENT === 'production' ||
      process.env.RENDER_SERVICE_TYPE ||
      process.env.HEROKU_APP_NAME) {
    return 'production'
  }
  
  // Default to development
  return 'development'
}

/**
 * Determines Stripe mode based on environment and keys
 */
export const getStripeMode = (): 'test' | 'live' => {
  const environment = getCurrentEnvironment()
  
  // Always use test mode in development and test environments
  if (environment === 'development' || environment === 'test') {
    return 'test'
  }
  
  // In production, check if we have live keys
  const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
  const secretKey = process.env.STRIPE_SECRET_KEY
  
  if (publishableKey?.startsWith('pk_live_') && secretKey?.startsWith('sk_live_')) {
    return 'live'
  }
  
  // Default to test mode for safety
  return 'test'
}

/**
 * Gets the API base URL based on environment
 */
export const getApiBaseUrl = (): string => {
  const environment = getCurrentEnvironment()
  
  // In production, use the actual domain
  if (environment === 'production') {
    return process.env.NEXTAUTH_URL || process.env.VERCEL_URL || 'https://mytechglasses.com'
  }
  
  // In development/test, use localhost
  return process.env.NEXTAUTH_URL || 'http://localhost:3000'
}

/**
 * Gets the frontend URL for redirects
 */
export const getFrontendUrl = (): string => {
  return getApiBaseUrl()
}

// ============================================================================
// ENVIRONMENT CONFIGURATION
// ============================================================================

/**
 * Gets complete environment configuration
 */
export const getEnvironmentConfig = (): EnvironmentConfig => {
  const environment = getCurrentEnvironment()
  const isDevelopment = environment === 'development'
  const isProduction = environment === 'production'
  const isTest = environment === 'test'
  
  return {
    environment,
    isDevelopment,
    isProduction,
    isTest,
    stripeMode: getStripeMode(),
    apiBaseUrl: getApiBaseUrl(),
    frontendUrl: getFrontendUrl(),
    enableDebugLogging: isDevelopment || isTest,
    enableErrorReporting: isProduction,
    enableAnalytics: isProduction,
    enablePerformanceMonitoring: isProduction,
    rateLimitEnabled: isProduction,
    corsEnabled: true,
    securityHeadersEnabled: isProduction
  }
}

// ============================================================================
// FEATURE FLAGS
// ============================================================================

/**
 * Checks if a feature is enabled based on environment
 */
export const isFeatureEnabled = (feature: string): boolean => {
  const config = getEnvironmentConfig()
  
  switch (feature) {
    case 'debug-logging':
      return config.enableDebugLogging
    
    case 'error-reporting':
      return config.enableErrorReporting
    
    case 'analytics':
      return config.enableAnalytics
    
    case 'performance-monitoring':
      return config.enablePerformanceMonitoring
    
    case 'rate-limiting':
      return config.rateLimitEnabled
    
    case 'cors':
      return config.corsEnabled
    
    case 'security-headers':
      return config.securityHeadersEnabled
    
    case 'stripe-webhooks':
      return config.isProduction
    
    case 'email-notifications':
      return config.isProduction
    
    case 'sms-notifications':
      return config.isProduction
    
    default:
      return false
  }
}

// ============================================================================
// VALIDATION
// ============================================================================

/**
 * Validates environment configuration
 */
export const validateEnvironmentConfig = (): { isValid: boolean; errors: string[] } => {
  const errors: string[] = []
  const config = getEnvironmentConfig()
  
  // Check required environment variables
  if (!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
    errors.push('NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is required')
  }
  
  if (!process.env.STRIPE_SECRET_KEY) {
    errors.push('STRIPE_SECRET_KEY is required')
  }
  
  if (!process.env.NEXTAUTH_SECRET) {
    errors.push('NEXTAUTH_SECRET is required')
  }
  
  // Validate Stripe key consistency
  const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
  const secretKey = process.env.STRIPE_SECRET_KEY
  
  if (publishableKey && secretKey) {
    const pkMode = publishableKey.startsWith('pk_live_') ? 'live' : 'test'
    const skMode = secretKey.startsWith('sk_live_') ? 'live' : 'test'
    
    if (pkMode !== skMode) {
      errors.push('Stripe publishable key and secret key must be from the same environment (both test or both live)')
    }
    
    if (config.isProduction && pkMode === 'test') {
      errors.push('Production environment should use live Stripe keys')
    }
  }
  
  // Validate URLs
  if (config.isProduction) {
    if (!process.env.NEXTAUTH_URL || process.env.NEXTAUTH_URL.includes('localhost')) {
      errors.push('Production environment requires a proper NEXTAUTH_URL (not localhost)')
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

// ============================================================================
// LOGGING AND MONITORING
// ============================================================================

/**
 * Logs environment configuration on startup
 */
export const logEnvironmentConfig = (): void => {
  const config = getEnvironmentConfig()
  const validation = validateEnvironmentConfig()
  
  console.log('🔧 Environment Configuration:')
  console.log(`   Node Environment: ${config.environment}`)
  console.log(`   Stripe Mode: ${config.stripeMode.toUpperCase()}`)
  console.log(`   API Base URL: ${config.apiBaseUrl}`)
  console.log(`   Frontend URL: ${config.frontendUrl}`)
  
  if (config.isDevelopment) {
    console.log('🧪 Running in development mode')
    console.log(`   Debug Logging: ${config.enableDebugLogging ? 'enabled' : 'disabled'}`)
  }
  
  if (config.isProduction) {
    console.log('🚀 Running in production mode')
    console.log(`   Error Reporting: ${config.enableErrorReporting ? 'enabled' : 'disabled'}`)
    console.log(`   Analytics: ${config.enableAnalytics ? 'enabled' : 'disabled'}`)
    console.log(`   Rate Limiting: ${config.rateLimitEnabled ? 'enabled' : 'disabled'}`)
    console.log(`   Security Headers: ${config.securityHeadersEnabled ? 'enabled' : 'disabled'}`)
  }
  
  if (config.stripeMode === 'test') {
    console.log('🧪 Running in Stripe TEST mode')
  } else {
    console.log('💳 Running in Stripe LIVE mode')
  }
  
  if (!validation.isValid) {
    console.error('❌ Environment configuration errors:')
    validation.errors.forEach(error => console.error(`   - ${error}`))
  } else {
    console.log('✅ Environment configuration is valid')
  }
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Gets environment-specific configuration value
 */
export const getEnvVar = (
  key: string, 
  defaultValue?: string, 
  required: boolean = false
): string => {
  const value = process.env[key] || defaultValue
  
  if (required && !value) {
    throw new Error(`Required environment variable ${key} is not set`)
  }
  
  return value || ''
}

/**
 * Gets boolean environment variable
 */
export const getBooleanEnvVar = (key: string, defaultValue: boolean = false): boolean => {
  const value = process.env[key]
  
  if (!value) return defaultValue
  
  return value.toLowerCase() === 'true' || value === '1'
}

/**
 * Gets numeric environment variable
 */
export const getNumericEnvVar = (key: string, defaultValue: number = 0): number => {
  const value = process.env[key]
  
  if (!value) return defaultValue
  
  const parsed = parseInt(value, 10)
  return isNaN(parsed) ? defaultValue : parsed
}

/**
 * Checks if running in specific environment
 */
export const isEnvironment = (env: Environment): boolean => {
  return getCurrentEnvironment() === env
}

/**
 * Checks if running in development
 */
export const isDevelopment = (): boolean => {
  return isEnvironment('development')
}

/**
 * Checks if running in production
 */
export const isProduction = (): boolean => {
  return isEnvironment('production')
}

/**
 * Checks if running in test
 */
export const isTest = (): boolean => {
  return isEnvironment('test')
}

// ============================================================================
// CONSTANTS
// ============================================================================

export const ENVIRONMENT_CONSTANTS = {
  DEFAULT_API_TIMEOUT: 30000, // 30 seconds
  DEFAULT_RATE_LIMIT: 100, // requests per minute
  DEFAULT_CORS_ORIGINS: ['http://localhost:3000', 'https://mytechglasses.com'],
  STRIPE_WEBHOOK_TOLERANCE: 300, // 5 minutes
  SESSION_TIMEOUT: 30 * 60 * 1000, // 30 minutes
  CACHE_TTL: 5 * 60 * 1000, // 5 minutes
} as const

// ============================================================================
// SINGLETON INSTANCE
// ============================================================================

// Cache the environment config to avoid repeated calculations
let cachedConfig: EnvironmentConfig | null = null

/**
 * Gets cached environment configuration
 */
export const getConfig = (): EnvironmentConfig => {
  if (!cachedConfig) {
    cachedConfig = getEnvironmentConfig()
  }
  return cachedConfig
}

/**
 * Resets cached configuration (useful for testing)
 */
export const resetConfig = (): void => {
  cachedConfig = null
}