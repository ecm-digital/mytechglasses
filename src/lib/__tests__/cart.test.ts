/**
 * Unit tests for cart utilities
 * Run with: npm test src/lib/__tests__/cart.test.ts
 */

import {
  CartItem,
  validateCartItem,
  validateCart,
  calculateSubtotal,
  calculateShipping,
  calculateTax,
  calculateCartSummary,
  addToCart,
  updateCartItemQuantity,
  removeFromCart,
  clearCart,
  formatPrice,
  getCartItemCount,
  getUniqueProductCount,
  isCartEmpty,
  findCartItem,
  isFreeShippingEligible,
  getFreeShippingRemaining,
  convertToStripeLineItems,
  validateCartForCheckout,
  CART_CONSTANTS
} from '../cart'

// Test data
const mockCartItem: CartItem = {
  id: 1,
  productId: 'vision-pro',
  name: 'Vision Pro',
  price: 2499,
  quantity: 1,
  color: 'Black',
  emoji: '🥽'
}

const mockCartItems: CartItem[] = [
  mockCartItem,
  {
    id: 2,
    productId: 'tech-view',
    name: 'Tech View',
    price: 1899,
    quantity: 2,
    color: 'Blue',
    emoji: '👓'
  }
]

describe('Cart Item Validation', () => {
  test('should validate correct cart item', () => {
    const result = validateCartItem(mockCartItem)
    expect(result.isValid).toBe(true)
    expect(result.errors).toHaveLength(0)
  })

  test('should reject item without required fields', () => {
    const invalidItem = { name: 'Test' } as Partial<CartItem>
    const result = validateCartItem(invalidItem)
    
    expect(result.isValid).toBe(false)
    expect(result.errors).toContain('Item ID is required and must be a number')
    expect(result.errors).toContain('Product ID is required and must be a string')
    expect(result.errors).toContain('Item price is required and must be a positive number')
    expect(result.errors).toContain('Item quantity is required and must be a positive number')
  })

  test('should reject item with invalid price', () => {
    const invalidItem = { ...mockCartItem, price: -100 }
    const result = validateCartItem(invalidItem)
    
    expect(result.isValid).toBe(false)
    expect(result.errors).toContain('Item price is required and must be a positive number')
  })

  test('should reject item with excessive quantity', () => {
    const invalidItem = { ...mockCartItem, quantity: 20 }
    const result = validateCartItem(invalidItem)
    
    expect(result.isValid).toBe(false)
    expect(result.errors).toContain(`Quantity cannot exceed ${CART_CONSTANTS.MAX_QUANTITY_PER_ITEM} per item`)
  })

  test('should reject item with unreasonable price', () => {
    const invalidItem = { ...mockCartItem, price: 200000 }
    const result = validateCartItem(invalidItem)
    
    expect(result.isValid).toBe(false)
    expect(result.errors).toContain('Item price seems unreasonably high')
  })
})

describe('Cart Validation', () => {
  test('should validate correct cart', () => {
    const result = validateCart(mockCartItems)
    expect(result.isValid).toBe(true)
    expect(result.errors).toHaveLength(0)
  })

  test('should reject cart with too many items', () => {
    const tooManyItems = Array(60).fill(mockCartItem).map((item, index) => ({
      ...item,
      id: index + 1,
      productId: `product-${index}`
    }))
    
    const result = validateCart(tooManyItems)
    expect(result.isValid).toBe(false)
    expect(result.errors).toContain(`Cart cannot contain more than ${CART_CONSTANTS.MAX_ITEMS_IN_CART} items`)
  })

  test('should reject cart with duplicate items', () => {
    const duplicateItems = [mockCartItem, mockCartItem]
    const result = validateCart(duplicateItems)
    
    expect(result.isValid).toBe(false)
    expect(result.errors).toContain('Cart contains duplicate items (same product and color)')
  })
})

describe('Price Calculations', () => {
  test('should calculate correct subtotal', () => {
    const subtotal = calculateSubtotal(mockCartItems)
    // 2499 * 1 + 1899 * 2 = 6297
    expect(subtotal).toBe(6297)
  })

  test('should calculate shipping cost correctly', () => {
    // Below free shipping threshold
    expect(calculateShipping(1000)).toBe(15)
    
    // Above free shipping threshold
    expect(calculateShipping(3000)).toBe(0)
    
    // Express shipping
    expect(calculateShipping(1000, 'express')).toBe(25)
  })

  test('should calculate tax correctly', () => {
    const taxNotIncluded = calculateTax(1000, 0.23, false)
    expect(taxNotIncluded.amount).toBe(230)
    expect(taxNotIncluded.rate).toBe(0.23)
    expect(taxNotIncluded.included).toBe(false)

    const taxIncluded = calculateTax(1230, 0.23, true)
    expect(Math.round(taxIncluded.amount)).toBe(230)
    expect(taxIncluded.included).toBe(true)
  })

  test('should calculate complete cart summary', () => {
    const summary = calculateCartSummary(mockCartItems)
    
    expect(summary.subtotal).toBe(6297)
    expect(summary.shipping).toBe(0) // Free shipping over 2000
    expect(summary.tax).toBe(1448.31) // 23% of subtotal
    expect(summary.total).toBe(7745.31)
    expect(summary.currency).toBe('PLN')
    expect(summary.itemCount).toBe(3) // 1 + 2
  })
})

describe('Cart Manipulation', () => {
  test('should add new item to cart', () => {
    const newItem = {
      productId: 'lite',
      name: 'Lite',
      price: 1299,
      quantity: 1,
      color: 'White'
    }
    
    const result = addToCart(mockCartItems, newItem, () => 3)
    expect(result).toHaveLength(3)
    expect(result[2].id).toBe(3)
    expect(result[2].name).toBe('Lite')
  })

  test('should update quantity when adding existing item', () => {
    const existingItem = {
      productId: 'vision-pro',
      name: 'Vision Pro',
      price: 2499,
      quantity: 2,
      color: 'Black'
    }
    
    const result = addToCart(mockCartItems, existingItem)
    expect(result).toHaveLength(2) // Same length, quantity updated
    expect(result[0].quantity).toBe(3) // 1 + 2
  })

  test('should throw error when adding too many of same item', () => {
    const tooManyItems = {
      productId: 'vision-pro',
      name: 'Vision Pro',
      price: 2499,
      quantity: 15, // Exceeds limit
      color: 'Black'
    }
    
    expect(() => addToCart(mockCartItems, tooManyItems)).toThrow('Cannot add more items')
  })

  test('should update item quantity', () => {
    const result = updateCartItemQuantity(mockCartItems, 1, 5)
    expect(result[0].quantity).toBe(5)
    expect(result[1].quantity).toBe(2) // Unchanged
  })

  test('should throw error for invalid quantity update', () => {
    expect(() => updateCartItemQuantity(mockCartItems, 1, 0)).toThrow('Quantity must be at least 1')
    expect(() => updateCartItemQuantity(mockCartItems, 1, 15)).toThrow('Quantity cannot exceed')
  })

  test('should remove item from cart', () => {
    const result = removeFromCart(mockCartItems, 1)
    expect(result).toHaveLength(1)
    expect(result[0].id).toBe(2)
  })

  test('should clear cart', () => {
    const result = clearCart()
    expect(result).toHaveLength(0)
  })
})

describe('Utility Functions', () => {
  test('should format price correctly', () => {
    expect(formatPrice(2499)).toBe('2499 zł')
    expect(formatPrice(1899, 'USD')).toBe('1899 USD')
  })

  test('should count cart items correctly', () => {
    expect(getCartItemCount(mockCartItems)).toBe(3) // 1 + 2
    expect(getUniqueProductCount(mockCartItems)).toBe(2)
  })

  test('should check if cart is empty', () => {
    expect(isCartEmpty([])).toBe(true)
    expect(isCartEmpty(mockCartItems)).toBe(false)
  })

  test('should find cart item by ID', () => {
    const found = findCartItem(mockCartItems, 1)
    expect(found?.name).toBe('Vision Pro')
    
    const notFound = findCartItem(mockCartItems, 999)
    expect(notFound).toBeUndefined()
  })

  test('should check free shipping eligibility', () => {
    expect(isFreeShippingEligible(1000)).toBe(false)
    expect(isFreeShippingEligible(3000)).toBe(true)
  })

  test('should calculate free shipping remaining', () => {
    expect(getFreeShippingRemaining(1500)).toBe(500)
    expect(getFreeShippingRemaining(3000)).toBe(0)
  })
})

describe('Stripe Integration', () => {
  test('should convert to Stripe line items format', () => {
    const stripeItems = convertToStripeLineItems(mockCartItems)
    
    expect(stripeItems).toHaveLength(2)
    expect(stripeItems[0].price_data.currency).toBe('pln')
    expect(stripeItems[0].price_data.unit_amount).toBe(249900) // 2499 * 100
    expect(stripeItems[0].quantity).toBe(1)
    expect(stripeItems[0].price_data.product_data.name).toBe('Vision Pro')
  })

  test('should validate cart for checkout', () => {
    const validResult = validateCartForCheckout(mockCartItems)
    expect(validResult.isValid).toBe(true)
    
    const emptyCartResult = validateCartForCheckout([])
    expect(emptyCartResult.isValid).toBe(false)
    expect(emptyCartResult.errors).toContain('Cart cannot be empty for checkout')
  })

  test('should reject checkout for very high total', () => {
    const expensiveItems: CartItem[] = [{
      id: 1,
      productId: 'expensive',
      name: 'Expensive Item',
      price: 1000000,
      quantity: 1
    }]
    
    const result = validateCartForCheckout(expensiveItems)
    expect(result.isValid).toBe(false)
    expect(result.errors).toContain('Order total cannot exceed 999,999 PLN')
  })
})

describe('Constants', () => {
  test('should have correct constants', () => {
    expect(CART_CONSTANTS.FREE_SHIPPING_THRESHOLD).toBe(2000)
    expect(CART_CONSTANTS.DEFAULT_SHIPPING_COST).toBe(15)
    expect(CART_CONSTANTS.DEFAULT_TAX_RATE).toBe(0.23)
    expect(CART_CONSTANTS.CURRENCY).toBe('PLN')
    expect(CART_CONSTANTS.MAX_QUANTITY_PER_ITEM).toBe(10)
  })
})