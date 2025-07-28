/**
 * Cart data management utilities for My Tech Glasses
 * Handles cart items, validation, and price calculations
 */

// ============================================================================
// TYPES AND INTERFACES
// ============================================================================

export interface CartItem {
  id: number
  productId: string
  name: string
  price: number // Price in PLN (Polish Złoty)
  quantity: number
  color?: string
  emoji?: string
  description?: string
  image?: string
  metadata?: Record<string, any>
}

export interface CartSummary {
  items: CartItem[]
  subtotal: number
  shipping: number
  tax: number
  total: number
  currency: 'PLN'
  itemCount: number
}

export interface ShippingOption {
  id: string
  name: string
  price: number
  estimatedDays: {
    min: number
    max: number
  }
  description: string
}

export interface TaxCalculation {
  rate: number // Tax rate (e.g., 0.23 for 23% VAT)
  amount: number // Tax amount in PLN
  included: boolean // Whether tax is included in item prices
}

// ============================================================================
// CONSTANTS
// ============================================================================

export const CART_CONSTANTS = {
  // Shipping
  FREE_SHIPPING_THRESHOLD: 2000, // Free shipping over 2000 PLN
  DEFAULT_SHIPPING_COST: 15, // Standard shipping cost in PLN
  EXPRESS_SHIPPING_COST: 25, // Express shipping cost in PLN
  
  // Tax
  DEFAULT_TAX_RATE: 0.23, // 23% VAT in Poland
  
  // Limits
  MAX_QUANTITY_PER_ITEM: 10,
  MAX_ITEMS_IN_CART: 50,
  
  // Currency
  CURRENCY: 'PLN' as const,
  CURRENCY_SYMBOL: 'zł',
} as const

export const SHIPPING_OPTIONS: ShippingOption[] = [
  {
    id: 'standard',
    name: 'Dostawa standardowa',
    price: CART_CONSTANTS.DEFAULT_SHIPPING_COST,
    estimatedDays: { min: 3, max: 5 },
    description: '3-5 dni roboczych'
  },
  {
    id: 'express',
    name: 'Dostawa ekspresowa',
    price: CART_CONSTANTS.EXPRESS_SHIPPING_COST,
    estimatedDays: { min: 1, max: 2 },
    description: '1-2 dni robocze'
  }
]

// ============================================================================
// VALIDATION FUNCTIONS
// ============================================================================

/**
 * Validates a single cart item
 */
export const validateCartItem = (item: Partial<CartItem>): { isValid: boolean; errors: string[] } => {
  const errors: string[] = []

  // Required fields
  if (!item.id || typeof item.id !== 'number') {
    errors.push('Item ID is required and must be a number')
  }

  if (!item.productId || typeof item.productId !== 'string') {
    errors.push('Product ID is required and must be a string')
  }

  if (!item.name || typeof item.name !== 'string' || item.name.trim().length === 0) {
    errors.push('Item name is required and cannot be empty')
  }

  if (!item.price || typeof item.price !== 'number' || item.price <= 0) {
    errors.push('Item price is required and must be a positive number')
  }

  if (!item.quantity || typeof item.quantity !== 'number' || item.quantity <= 0) {
    errors.push('Item quantity is required and must be a positive number')
  }

  // Business rules
  if (item.quantity && item.quantity > CART_CONSTANTS.MAX_QUANTITY_PER_ITEM) {
    errors.push(`Quantity cannot exceed ${CART_CONSTANTS.MAX_QUANTITY_PER_ITEM} per item`)
  }

  if (item.price && item.price > 100000) {
    errors.push('Item price seems unreasonably high')
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}

/**
 * Validates an entire cart
 */
export const validateCart = (items: CartItem[]): { isValid: boolean; errors: string[] } => {
  const errors: string[] = []

  // Check cart size
  if (items.length > CART_CONSTANTS.MAX_ITEMS_IN_CART) {
    errors.push(`Cart cannot contain more than ${CART_CONSTANTS.MAX_ITEMS_IN_CART} items`)
  }

  // Validate each item
  items.forEach((item, index) => {
    const itemValidation = validateCartItem(item)
    if (!itemValidation.isValid) {
      errors.push(`Item ${index + 1}: ${itemValidation.errors.join(', ')}`)
    }
  })

  // Check for duplicate items (same productId and color)
  const duplicates = items.filter((item, index) => 
    items.findIndex(other => 
      other.productId === item.productId && 
      other.color === item.color
    ) !== index
  )

  if (duplicates.length > 0) {
    errors.push('Cart contains duplicate items (same product and color)')
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}

// ============================================================================
// PRICE CALCULATION FUNCTIONS
// ============================================================================

/**
 * Calculates subtotal for cart items
 */
export const calculateSubtotal = (items: CartItem[]): number => {
  return items.reduce((sum, item) => {
    const itemTotal = item.price * item.quantity
    return sum + itemTotal
  }, 0)
}

/**
 * Calculates shipping cost based on subtotal and shipping option
 */
export const calculateShipping = (
  subtotal: number, 
  shippingOptionId: string = 'standard'
): number => {
  // Free shipping threshold
  if (subtotal >= CART_CONSTANTS.FREE_SHIPPING_THRESHOLD) {
    return 0
  }

  // Find shipping option
  const shippingOption = SHIPPING_OPTIONS.find(option => option.id === shippingOptionId)
  
  if (!shippingOption) {
    console.warn(`Unknown shipping option: ${shippingOptionId}, using standard`)
    return CART_CONSTANTS.DEFAULT_SHIPPING_COST
  }

  return shippingOption.price
}

/**
 * Calculates tax amount
 */
export const calculateTax = (
  subtotal: number, 
  taxRate: number = CART_CONSTANTS.DEFAULT_TAX_RATE,
  taxIncluded: boolean = false
): TaxCalculation => {
  let taxAmount: number

  if (taxIncluded) {
    // Tax is already included in prices, calculate the tax portion
    taxAmount = subtotal - (subtotal / (1 + taxRate))
  } else {
    // Tax is added on top of prices
    taxAmount = subtotal * taxRate
  }

  return {
    rate: taxRate,
    amount: Math.round(taxAmount * 100) / 100, // Round to 2 decimal places
    included: taxIncluded
  }
}

/**
 * Calculates complete cart summary
 */
export const calculateCartSummary = (
  items: CartItem[],
  shippingOptionId: string = 'standard',
  taxRate: number = CART_CONSTANTS.DEFAULT_TAX_RATE,
  taxIncluded: boolean = false
): CartSummary => {
  const subtotal = calculateSubtotal(items)
  const shipping = calculateShipping(subtotal, shippingOptionId)
  const taxCalculation = calculateTax(subtotal, taxRate, taxIncluded)
  
  const total = taxIncluded 
    ? subtotal + shipping 
    : subtotal + shipping + taxCalculation.amount

  const itemCount = items.reduce((count, item) => count + item.quantity, 0)

  return {
    items,
    subtotal,
    shipping,
    tax: taxCalculation.amount,
    total: Math.round(total * 100) / 100, // Round to 2 decimal places
    currency: CART_CONSTANTS.CURRENCY,
    itemCount
  }
}

// ============================================================================
// CART MANIPULATION FUNCTIONS
// ============================================================================

/**
 * Adds an item to the cart or updates quantity if it already exists
 */
export const addToCart = (
  currentItems: CartItem[], 
  newItem: Omit<CartItem, 'id'>,
  generateId: () => number = () => Date.now()
): CartItem[] => {
  // Check if item already exists (same productId and color)
  const existingItemIndex = currentItems.findIndex(
    item => item.productId === newItem.productId && item.color === newItem.color
  )

  if (existingItemIndex >= 0) {
    // Update existing item quantity
    const updatedItems = [...currentItems]
    const existingItem = updatedItems[existingItemIndex]
    const newQuantity = existingItem.quantity + newItem.quantity

    // Check quantity limit
    if (newQuantity > CART_CONSTANTS.MAX_QUANTITY_PER_ITEM) {
      throw new Error(`Cannot add more items. Maximum ${CART_CONSTANTS.MAX_QUANTITY_PER_ITEM} per product.`)
    }

    updatedItems[existingItemIndex] = {
      ...existingItem,
      quantity: newQuantity
    }

    return updatedItems
  } else {
    // Add new item
    const itemWithId: CartItem = {
      ...newItem,
      id: generateId()
    }

    // Validate the new item
    const validation = validateCartItem(itemWithId)
    if (!validation.isValid) {
      throw new Error(`Invalid item: ${validation.errors.join(', ')}`)
    }

    return [...currentItems, itemWithId]
  }
}

/**
 * Updates the quantity of an item in the cart
 */
export const updateCartItemQuantity = (
  items: CartItem[], 
  itemId: number, 
  newQuantity: number
): CartItem[] => {
  if (newQuantity < 1) {
    throw new Error('Quantity must be at least 1')
  }

  if (newQuantity > CART_CONSTANTS.MAX_QUANTITY_PER_ITEM) {
    throw new Error(`Quantity cannot exceed ${CART_CONSTANTS.MAX_QUANTITY_PER_ITEM}`)
  }

  return items.map(item => 
    item.id === itemId 
      ? { ...item, quantity: newQuantity }
      : item
  )
}

/**
 * Removes an item from the cart
 */
export const removeFromCart = (items: CartItem[], itemId: number): CartItem[] => {
  return items.filter(item => item.id !== itemId)
}

/**
 * Clears all items from the cart
 */
export const clearCart = (): CartItem[] => {
  return []
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Formats price with currency symbol
 */
export const formatPrice = (price: number, currency: string = CART_CONSTANTS.CURRENCY): string => {
  const symbol = currency === 'PLN' ? CART_CONSTANTS.CURRENCY_SYMBOL : currency
  return `${price} ${symbol}`
}

/**
 * Gets cart item count (total quantity of all items)
 */
export const getCartItemCount = (items: CartItem[]): number => {
  return items.reduce((count, item) => count + item.quantity, 0)
}

/**
 * Gets unique product count (number of different products)
 */
export const getUniqueProductCount = (items: CartItem[]): number => {
  return items.length
}

/**
 * Checks if cart is empty
 */
export const isCartEmpty = (items: CartItem[]): boolean => {
  return items.length === 0
}

/**
 * Finds an item in the cart by ID
 */
export const findCartItem = (items: CartItem[], itemId: number): CartItem | undefined => {
  return items.find(item => item.id === itemId)
}

/**
 * Checks if free shipping threshold is met
 */
export const isFreeShippingEligible = (subtotal: number): boolean => {
  return subtotal >= CART_CONSTANTS.FREE_SHIPPING_THRESHOLD
}

/**
 * Calculates how much more is needed for free shipping
 */
export const getFreeShippingRemaining = (subtotal: number): number => {
  if (isFreeShippingEligible(subtotal)) {
    return 0
  }
  return CART_CONSTANTS.FREE_SHIPPING_THRESHOLD - subtotal
}

// ============================================================================
// STRIPE INTEGRATION HELPERS
// ============================================================================

/**
 * Converts cart items to Stripe line items format
 */
export const convertToStripeLineItems = (items: CartItem[]) => {
  return items.map(item => ({
    price_data: {
      currency: 'pln',
      product_data: {
        name: item.name,
        description: item.description || `Inteligentne okulary ${item.name}`,
        images: item.image ? [item.image] : [],
        metadata: {
          productId: item.productId,
          color: item.color || '',
          ...item.metadata
        }
      },
      unit_amount: Math.round(item.price * 100), // Convert to grosze (cents)
    },
    quantity: item.quantity,
  }))
}

/**
 * Validates cart for Stripe checkout
 */
export const validateCartForCheckout = (items: CartItem[]): { isValid: boolean; errors: string[] } => {
  const errors: string[] = []

  // Basic cart validation
  const cartValidation = validateCart(items)
  if (!cartValidation.isValid) {
    errors.push(...cartValidation.errors)
  }

  // Stripe-specific validations
  if (items.length === 0) {
    errors.push('Cart cannot be empty for checkout')
  }

  // Check for minimum order value (if any)
  const subtotal = calculateSubtotal(items)
  if (subtotal < 1) {
    errors.push('Order total must be at least 1 PLN')
  }

  // Check for maximum order value (Stripe limit)
  if (subtotal > 999999) {
    errors.push('Order total cannot exceed 999,999 PLN')
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}