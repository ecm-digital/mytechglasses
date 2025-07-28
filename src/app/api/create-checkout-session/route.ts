import { NextRequest, NextResponse } from 'next/server'
import { getStripeServer } from '@/lib/stripe'
import { 
  validateCartForCheckout, 
  convertToStripeLineItems, 
  SHIPPING_OPTIONS,
  calculateCartSummary,
  CartItem 
} from '@/lib/cart'

// ============================================================================
// TYPES AND INTERFACES
// ============================================================================

interface CheckoutSessionRequest {
  items: CartItem[]
  customerInfo?: {
    firstName: string
    lastName: string
    email: string
    phone: string
  }
  shippingAddress?: {
    line1: string
    city: string
    postal_code: string
    country: string
  }
  shippingOption?: string
  newsletter?: boolean
}

interface CheckoutSessionResponse {
  sessionId: string
}

interface ErrorResponse {
  error: string
  details?: string
  code?: string
  timestamp: string
}

// ============================================================================
// VALIDATION FUNCTIONS
// ============================================================================

const validateRequest = (data: any): { isValid: boolean; errors: string[] } => {
  const errors: string[] = []

  // Validate items
  if (!data.items || !Array.isArray(data.items)) {
    errors.push('Items array is required')
  } else if (data.items.length === 0) {
    errors.push('Cart cannot be empty')
  }

  // Validate customer info if provided
  if (data.customerInfo) {
    const { firstName, lastName, email, phone } = data.customerInfo
    
    if (!firstName || typeof firstName !== 'string' || firstName.trim().length === 0) {
      errors.push('Customer first name is required')
    }
    
    if (!lastName || typeof lastName !== 'string' || lastName.trim().length === 0) {
      errors.push('Customer last name is required')
    }
    
    if (!email || typeof email !== 'string' || !email.includes('@')) {
      errors.push('Valid customer email is required')
    }
    
    if (!phone || typeof phone !== 'string' || phone.trim().length === 0) {
      errors.push('Customer phone is required')
    }
  }

  // Validate shipping address if provided
  if (data.shippingAddress) {
    const { line1, city, postal_code, country } = data.shippingAddress
    
    if (!line1 || typeof line1 !== 'string' || line1.trim().length === 0) {
      errors.push('Shipping address line 1 is required')
    }
    
    if (!city || typeof city !== 'string' || city.trim().length === 0) {
      errors.push('Shipping city is required')
    }
    
    if (!postal_code || typeof postal_code !== 'string' || postal_code.trim().length === 0) {
      errors.push('Shipping postal code is required')
    }
    
    if (!country || typeof country !== 'string' || country.trim().length === 0) {
      errors.push('Shipping country is required')
    }
  }

  // Validate shipping option if provided
  if (data.shippingOption && typeof data.shippingOption === 'string') {
    const validOptions = SHIPPING_OPTIONS.map(option => option.id)
    if (!validOptions.includes(data.shippingOption)) {
      errors.push(`Invalid shipping option. Must be one of: ${validOptions.join(', ')}`)
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  }
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

  console.error('API Error:', {
    message,
    details,
    code,
    status,
    timestamp: errorResponse.timestamp
  })

  return NextResponse.json(errorResponse, { status })
}

const generateOrderId = (): string => {
  const timestamp = Date.now().toString(36)
  const random = Math.random().toString(36).substr(2, 5)
  return `MTG-${timestamp}-${random}`.toUpperCase()
}

const buildShippingOptions = (subtotal: number, selectedOption?: string) => {
  return SHIPPING_OPTIONS.map(option => {
    // Free shipping for standard option if over threshold
    const amount = (option.id === 'standard' && subtotal >= 2000) 
      ? 0 
      : option.price * 100 // Convert to grosze

    return {
      shipping_rate_data: {
        type: 'fixed_amount' as const,
        fixed_amount: {
          amount,
          currency: 'pln',
        },
        display_name: option.name,
        delivery_estimate: {
          minimum: {
            unit: 'business_day' as const,
            value: option.estimatedDays.min,
          },
          maximum: {
            unit: 'business_day' as const,
            value: option.estimatedDays.max,
          },
        },
      },
    }
  })
}

// ============================================================================
// MAIN API HANDLER
// ============================================================================

export async function POST(request: NextRequest) {
  const startTime = Date.now()
  
  try {
    // Parse and validate request body
    let requestData: CheckoutSessionRequest
    
    try {
      requestData = await request.json()
    } catch (parseError) {
      return createErrorResponse(
        'Invalid JSON in request body',
        400,
        parseError instanceof Error ? parseError.message : 'JSON parse failed',
        'INVALID_JSON'
      )
    }

    // Validate request structure
    const requestValidation = validateRequest(requestData)
    if (!requestValidation.isValid) {
      return createErrorResponse(
        'Request validation failed',
        400,
        requestValidation.errors.join(', '),
        'VALIDATION_ERROR'
      )
    }

    // Validate cart items using our cart utilities
    const cartValidation = validateCartForCheckout(requestData.items)
    if (!cartValidation.isValid) {
      return createErrorResponse(
        'Cart validation failed',
        400,
        cartValidation.errors.join(', '),
        'CART_VALIDATION_ERROR'
      )
    }

    // Calculate cart summary for metadata
    const cartSummary = calculateCartSummary(
      requestData.items,
      requestData.shippingOption || 'standard'
    )

    // Convert items to Stripe format using our utility
    const lineItems = convertToStripeLineItems(requestData.items)

    // Generate unique order ID
    const orderId = generateOrderId()

    // Get Stripe instance
    const stripe = getStripeServer()

    // Build comprehensive metadata
    const metadata = {
      orderId,
      orderType: 'tech_glasses',
      itemCount: cartSummary.itemCount.toString(),
      subtotal: cartSummary.subtotal.toString(),
      shipping: cartSummary.shipping.toString(),
      tax: cartSummary.tax.toString(),
      total: cartSummary.total.toString(),
      currency: cartSummary.currency,
      shippingOption: requestData.shippingOption || 'standard',
      newsletter: requestData.newsletter ? 'true' : 'false',
      createdAt: new Date().toISOString(),
      ...(requestData.customerInfo && {
        customerName: `${requestData.customerInfo.firstName} ${requestData.customerInfo.lastName}`,
        customerPhone: requestData.customerInfo.phone
      })
    }

    // Build shipping options with dynamic pricing
    const shippingOptions = buildShippingOptions(cartSummary.subtotal, requestData.shippingOption)

    // Create Stripe checkout session with Polish payment methods
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card', 'blik', 'p24'],
      mode: 'payment',
      line_items: lineItems,
      success_url: `${request.nextUrl.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${request.nextUrl.origin}/checkout?cancelled=true`,
      
      // Customer information for Polish payment methods
      ...(requestData.customerInfo && {
        customer_email: requestData.customerInfo.email,
      }),
      
      // Billing address collection for P24
      billing_address_collection: 'required',
      
      // Locale for Polish users
      locale: 'pl',
      
      // Currency
      currency: 'pln',
      
      // Metadata
      metadata: {
        orderId: generateOrderId(),
        customerEmail: requestData.customerInfo?.email || 'unknown'
      }
    })

    // Log successful session creation
    console.log('Checkout session created successfully:', {
      sessionId: session.id,
      orderId,
      customerEmail: requestData.customerInfo?.email,
      itemCount: cartSummary.itemCount,
      total: cartSummary.total,
      processingTime: Date.now() - startTime
    })

    // Return session ID
    const response: CheckoutSessionResponse = {
      sessionId: session.id
    }

    return NextResponse.json(response, { 
      status: 200,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    })

  } catch (error) {
    // Handle Stripe-specific errors
    if (error && typeof error === 'object' && 'type' in error) {
      const stripeError = error as any
      
      switch (stripeError.type) {
        case 'StripeCardError':
          return createErrorResponse(
            'Card was declined',
            400,
            stripeError.message,
            'CARD_DECLINED'
          )
        
        case 'StripeRateLimitError':
          return createErrorResponse(
            'Too many requests made to the API too quickly',
            429,
            stripeError.message,
            'RATE_LIMIT'
          )
        
        case 'StripeInvalidRequestError':
          return createErrorResponse(
            'Invalid parameters were supplied to Stripe API',
            400,
            stripeError.message,
            'INVALID_REQUEST'
          )
        
        case 'StripeAPIError':
          return createErrorResponse(
            'An error occurred internally with Stripe API',
            500,
            stripeError.message,
            'STRIPE_API_ERROR'
          )
        
        case 'StripeConnectionError':
          return createErrorResponse(
            'Some kind of error occurred during the HTTPS communication',
            503,
            stripeError.message,
            'CONNECTION_ERROR'
          )
        
        case 'StripeAuthenticationError':
          return createErrorResponse(
            'You probably used an incorrect API key',
            401,
            stripeError.message,
            'AUTHENTICATION_ERROR'
          )
        
        default:
          return createErrorResponse(
            'An error occurred with our payment processor',
            500,
            stripeError.message,
            'STRIPE_ERROR'
          )
      }
    }

    // Handle general errors
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
    
    return createErrorResponse(
      'Failed to create checkout session',
      500,
      errorMessage,
      'INTERNAL_ERROR'
    )
  }
}