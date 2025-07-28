import { NextRequest, NextResponse } from 'next/server'
import { getStripeServer } from '@/lib/stripe'
import { formatPrice } from '@/lib/cart'

// ============================================================================
// TYPES AND INTERFACES
// ============================================================================

interface OrderDetails {
  orderId: string
  sessionId: string
  paymentIntentId: string
  paymentStatus: 'paid' | 'pending' | 'failed'
  customerInfo: {
    email: string
    name?: string
    phone?: string
  }
  items: Array<{
    name: string
    description?: string
    quantity: number
    price: number
    total: number
  }>
  pricing: {
    subtotal: number
    shipping: number
    tax: number
    total: number
    currency: string
  }
  shippingDetails: {
    method: string
    estimatedDelivery: string
    address?: {
      line1: string
      city: string
      postal_code: string
      country: string
    }
  }
  metadata: Record<string, string>
  createdAt: string
}

interface ErrorResponse {
  error: string
  details?: string
  code?: string
  timestamp: string
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

const createErrorResponse = (
  message: string,
  status: number = 500,
  details?: string,
  code?: string
): NextResponse => {
  const errorResponse: ErrorResponse = {
    error: message,
    timestamp: new Date().toISOString(),
    ...(details && { details }),
    ...(code && { code })
  }

  console.error('Checkout Session API Error:', {
    message,
    details,
    code,
    status,
    timestamp: errorResponse.timestamp
  })

  return NextResponse.json(errorResponse, { status })
}

const parseStripeLineItems = (lineItems: any[]): OrderDetails['items'] => {
  return lineItems.map(item => ({
    name: item.description || item.price?.product?.name || 'Unknown Product',
    description: item.price?.product?.description,
    quantity: item.quantity,
    price: item.price?.unit_amount ? item.price.unit_amount / 100 : 0,
    total: item.amount_total ? item.amount_total / 100 : 0
  }))
}

const getShippingMethodName = (shippingRate: any): string => {
  if (!shippingRate) return 'Dostawa standardowa'
  
  const displayName = shippingRate.display_name
  if (displayName) return displayName
  
  // Fallback based on amount
  const amount = shippingRate.fixed_amount?.amount || 0
  if (amount === 0) return 'Dostawa standardowa (darmowa)'
  if (amount === 1500) return 'Dostawa standardowa'
  if (amount === 2500) return 'Dostawa ekspresowa'
  
  return 'Dostawa standardowa'
}

const getEstimatedDelivery = (shippingRate: any): string => {
  if (!shippingRate?.delivery_estimate) return '3-5 dni roboczych'
  
  const estimate = shippingRate.delivery_estimate
  const min = estimate.minimum?.value || 3
  const max = estimate.maximum?.value || 5
  
  if (min === max) {
    return `${min} ${min === 1 ? 'dzień roboczy' : 'dni robocze'}`
  }
  
  return `${min}-${max} dni roboczych`
}

// ============================================================================
// MAIN API HANDLER
// ============================================================================

export async function GET(
  request: NextRequest,
  { params }: { params: { sessionId: string } }
) {
  const startTime = Date.now()
  
  try {
    const { sessionId } = params

    // Validate session ID format
    if (!sessionId || !sessionId.startsWith('cs_')) {
      return createErrorResponse(
        'Invalid session ID format',
        400,
        'Session ID must start with "cs_"',
        'INVALID_SESSION_ID'
      )
    }

    // Get Stripe instance
    const stripe = getStripeServer()

    // Retrieve session from Stripe with expanded data
    let session
    try {
      session = await stripe.checkout.sessions.retrieve(sessionId, {
        expand: [
          'line_items',
          'line_items.data.price.product',
          'payment_intent',
          'customer',
          'shipping_cost.shipping_rate'
        ]
      })
    } catch (stripeError: any) {
      if (stripeError.code === 'resource_missing') {
        return createErrorResponse(
          'Checkout session not found',
          404,
          'The specified session ID does not exist',
          'SESSION_NOT_FOUND'
        )
      }
      
      throw stripeError // Re-throw other Stripe errors
    }

    // Check if session is completed
    if (session.payment_status !== 'paid') {
      return createErrorResponse(
        'Payment not completed',
        400,
        `Payment status is ${session.payment_status}`,
        'PAYMENT_NOT_COMPLETED'
      )
    }

    // Extract order details from session
    const orderDetails: OrderDetails = {
      orderId: session.metadata?.orderId || `ORD-${sessionId.slice(-8).toUpperCase()}`,
      sessionId: session.id,
      paymentIntentId: typeof session.payment_intent === 'string' 
        ? session.payment_intent 
        : session.payment_intent?.id || '',
      paymentStatus: session.payment_status as 'paid' | 'pending' | 'failed',
      
      customerInfo: {
        email: session.customer_details?.email || session.customer_email || '',
        name: session.customer_details?.name || 
              (session.metadata?.customerName) || 
              undefined,
        phone: session.customer_details?.phone || 
               session.metadata?.customerPhone || 
               undefined
      },
      
      items: session.line_items?.data 
        ? parseStripeLineItems(session.line_items.data)
        : [],
      
      pricing: {
        subtotal: session.amount_subtotal ? session.amount_subtotal / 100 : 0,
        shipping: session.shipping_cost?.amount_total ? session.shipping_cost.amount_total / 100 : 0,
        tax: session.amount_total && session.amount_subtotal 
          ? (session.amount_total - session.amount_subtotal - (session.shipping_cost?.amount_total || 0)) / 100
          : 0,
        total: session.amount_total ? session.amount_total / 100 : 0,
        currency: session.currency?.toUpperCase() || 'PLN'
      },
      
      shippingDetails: {
        method: getShippingMethodName(session.shipping_cost?.shipping_rate),
        estimatedDelivery: getEstimatedDelivery(session.shipping_cost?.shipping_rate),
        address: session.shipping_details?.address ? {
          line1: session.shipping_details.address.line1 || '',
          city: session.shipping_details.address.city || '',
          postal_code: session.shipping_details.address.postal_code || '',
          country: session.shipping_details.address.country || ''
        } : undefined
      },
      
      metadata: session.metadata || {},
      createdAt: new Date(session.created * 1000).toISOString()
    }

    // Log successful retrieval
    console.log('Checkout session retrieved successfully:', {
      sessionId,
      orderId: orderDetails.orderId,
      customerEmail: orderDetails.customerInfo.email,
      total: orderDetails.pricing.total,
      paymentStatus: orderDetails.paymentStatus,
      processingTime: Date.now() - startTime
    })

    return NextResponse.json(orderDetails, {
      status: 200,
      headers: {
        'Cache-Control': 'private, max-age=300', // Cache for 5 minutes
        'Content-Type': 'application/json'
      }
    })

  } catch (error) {
    // Handle Stripe-specific errors
    if (error && typeof error === 'object' && 'type' in error) {
      const stripeError = error as any
      
      switch (stripeError.type) {
        case 'StripeAuthenticationError':
          return createErrorResponse(
            'Authentication failed',
            401,
            stripeError.message,
            'AUTHENTICATION_ERROR'
          )
        
        case 'StripePermissionError':
          return createErrorResponse(
            'Permission denied',
            403,
            stripeError.message,
            'PERMISSION_ERROR'
          )
        
        case 'StripeRateLimitError':
          return createErrorResponse(
            'Rate limit exceeded',
            429,
            stripeError.message,
            'RATE_LIMIT'
          )
        
        case 'StripeConnectionError':
          return createErrorResponse(
            'Connection error',
            503,
            stripeError.message,
            'CONNECTION_ERROR'
          )
        
        default:
          return createErrorResponse(
            'Stripe API error',
            500,
            stripeError.message,
            'STRIPE_ERROR'
          )
      }
    }

    // Handle general errors
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
    
    return createErrorResponse(
      'Failed to retrieve checkout session',
      500,
      errorMessage,
      'INTERNAL_ERROR'
    )
  }
}

// ============================================================================
// EXPORT TYPES FOR CLIENT USE
// ============================================================================

export type { OrderDetails, ErrorResponse }