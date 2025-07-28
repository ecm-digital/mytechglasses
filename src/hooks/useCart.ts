/**
 * React hook for cart state management
 * Provides cart functionality with local storage persistence
 */

'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  CartItem,
  CartSummary,
  addToCart as addToCartUtil,
  updateCartItemQuantity as updateQuantityUtil,
  removeFromCart as removeFromCartUtil,
  clearCart as clearCartUtil,
  calculateCartSummary,
  validateCart,
  validateCartForCheckout,
  getCartItemCount,
  isCartEmpty
} from '@/lib/cart'

// ============================================================================
// TYPES
// ============================================================================

interface UseCartReturn {
  // State
  items: CartItem[]
  summary: CartSummary
  isLoading: boolean
  error: string | null
  
  // Actions
  addItem: (item: Omit<CartItem, 'id'>) => Promise<boolean>
  updateQuantity: (itemId: number, quantity: number) => Promise<boolean>
  removeItem: (itemId: number) => Promise<boolean>
  clearCart: () => Promise<boolean>
  
  // Utilities
  getItemCount: () => number
  isEmpty: () => boolean
  isValidForCheckout: () => { isValid: boolean; errors: string[] }
  
  // Persistence
  saveToStorage: () => void
  loadFromStorage: () => void
}

interface UseCartOptions {
  persistToStorage?: boolean
  storageKey?: string
  shippingOptionId?: string
  taxRate?: number
  taxIncluded?: boolean
}

// ============================================================================
// CONSTANTS
// ============================================================================

const DEFAULT_OPTIONS: Required<UseCartOptions> = {
  persistToStorage: true,
  storageKey: 'my-tech-glasses-cart',
  shippingOptionId: 'standard',
  taxRate: 0.23,
  taxIncluded: false
}

// ============================================================================
// HOOK IMPLEMENTATION
// ============================================================================

export const useCart = (options: UseCartOptions = {}): UseCartReturn => {
  const config = { ...DEFAULT_OPTIONS, ...options }
  
  // State
  const [items, setItems] = useState<CartItem[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isInitialized, setIsInitialized] = useState(false)

  // Calculate summary whenever items change
  const summary = calculateCartSummary(
    items,
    config.shippingOptionId,
    config.taxRate,
    config.taxIncluded
  )

  // ============================================================================
  // STORAGE FUNCTIONS
  // ============================================================================

  const saveToStorage = useCallback(() => {
    if (!config.persistToStorage || typeof window === 'undefined') return

    try {
      const cartData = {
        items,
        timestamp: Date.now(),
        version: '1.0'
      }
      localStorage.setItem(config.storageKey, JSON.stringify(cartData))
    } catch (error) {
      console.warn('Failed to save cart to localStorage:', error)
    }
  }, [items, config.persistToStorage, config.storageKey])

  const loadFromStorage = useCallback(() => {
    if (!config.persistToStorage || typeof window === 'undefined') return

    try {
      const stored = localStorage.getItem(config.storageKey)
      if (!stored) return

      const cartData = JSON.parse(stored)
      
      // Validate stored data structure
      if (!cartData.items || !Array.isArray(cartData.items)) {
        console.warn('Invalid cart data in localStorage, clearing...')
        localStorage.removeItem(config.storageKey)
        return
      }

      // Validate cart items
      const validation = validateCart(cartData.items)
      if (!validation.isValid) {
        console.warn('Invalid cart items in localStorage:', validation.errors)
        localStorage.removeItem(config.storageKey)
        return
      }

      // Check if data is not too old (7 days)
      const maxAge = 7 * 24 * 60 * 60 * 1000 // 7 days in milliseconds
      if (cartData.timestamp && Date.now() - cartData.timestamp > maxAge) {
        console.info('Cart data expired, clearing...')
        localStorage.removeItem(config.storageKey)
        return
      }

      setItems(cartData.items)
    } catch (error) {
      console.warn('Failed to load cart from localStorage:', error)
      localStorage.removeItem(config.storageKey)
    }
  }, [config.persistToStorage, config.storageKey])

  // ============================================================================
  // EFFECTS
  // ============================================================================

  // Load from storage on mount
  useEffect(() => {
    if (!isInitialized) {
      loadFromStorage()
      setIsInitialized(true)
    }
  }, [loadFromStorage, isInitialized])

  // Save to storage when items change (but not on initial load)
  useEffect(() => {
    if (isInitialized) {
      saveToStorage()
    }
  }, [items, saveToStorage, isInitialized])

  // ============================================================================
  // ACTION FUNCTIONS
  // ============================================================================

  const addItem = useCallback(async (newItem: Omit<CartItem, 'id'>): Promise<boolean> => {
    setIsLoading(true)
    setError(null)

    try {
      const updatedItems = addToCartUtil(items, newItem, () => Date.now())
      setItems(updatedItems)
      return true
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add item to cart'
      setError(errorMessage)
      return false
    } finally {
      setIsLoading(false)
    }
  }, [items])

  const updateQuantity = useCallback(async (itemId: number, quantity: number): Promise<boolean> => {
    setIsLoading(true)
    setError(null)

    try {
      const updatedItems = updateQuantityUtil(items, itemId, quantity)
      setItems(updatedItems)
      return true
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update item quantity'
      setError(errorMessage)
      return false
    } finally {
      setIsLoading(false)
    }
  }, [items])

  const removeItem = useCallback(async (itemId: number): Promise<boolean> => {
    setIsLoading(true)
    setError(null)

    try {
      const updatedItems = removeFromCartUtil(items, itemId)
      setItems(updatedItems)
      return true
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to remove item from cart'
      setError(errorMessage)
      return false
    } finally {
      setIsLoading(false)
    }
  }, [items])

  const clearCart = useCallback(async (): Promise<boolean> => {
    setIsLoading(true)
    setError(null)

    try {
      const clearedItems = clearCartUtil()
      setItems(clearedItems)
      return true
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to clear cart'
      setError(errorMessage)
      return false
    } finally {
      setIsLoading(false)
    }
  }, [])

  // ============================================================================
  // UTILITY FUNCTIONS
  // ============================================================================

  const getItemCount = useCallback((): number => {
    return getCartItemCount(items)
  }, [items])

  const isEmpty = useCallback((): boolean => {
    return isCartEmpty(items)
  }, [items])

  const isValidForCheckout = useCallback((): { isValid: boolean; errors: string[] } => {
    return validateCartForCheckout(items)
  }, [items])

  // ============================================================================
  // RETURN OBJECT
  // ============================================================================

  return {
    // State
    items,
    summary,
    isLoading,
    error,
    
    // Actions
    addItem,
    updateQuantity,
    removeItem,
    clearCart,
    
    // Utilities
    getItemCount,
    isEmpty,
    isValidForCheckout,
    
    // Persistence
    saveToStorage,
    loadFromStorage
  }
}

// ============================================================================
// ADDITIONAL HOOKS
// ============================================================================

/**
 * Hook for cart item count (useful for header badge)
 */
export const useCartItemCount = (): number => {
  const { getItemCount } = useCart()
  return getItemCount()
}

/**
 * Hook for cart validation status
 */
export const useCartValidation = (): { isValid: boolean; errors: string[] } => {
  const { isValidForCheckout } = useCart()
  return isValidForCheckout()
}

/**
 * Hook for cart summary only (lighter than full useCart)
 */
export const useCartSummary = (): CartSummary => {
  const { summary } = useCart()
  return summary
}