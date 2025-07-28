/**
 * Cart Context Provider for global cart state management
 * Provides cart functionality across the entire application
 */

'use client'

import React, { createContext, useContext, ReactNode } from 'react'
import { useCart, UseCartReturn } from '@/hooks/useCart'

// ============================================================================
// CONTEXT SETUP
// ============================================================================

const CartContext = createContext<UseCartReturn | null>(null)

interface CartProviderProps {
  children: ReactNode
  options?: {
    persistToStorage?: boolean
    storageKey?: string
    shippingOptionId?: string
    taxRate?: number
    taxIncluded?: boolean
  }
}

// ============================================================================
// PROVIDER COMPONENT
// ============================================================================

export const CartProvider: React.FC<CartProviderProps> = ({ 
  children, 
  options = {} 
}) => {
  const cartState = useCart(options)

  return (
    <CartContext.Provider value={cartState}>
      {children}
    </CartContext.Provider>
  )
}

// ============================================================================
// CONTEXT HOOK
// ============================================================================

export const useCartContext = (): UseCartReturn => {
  const context = useContext(CartContext)
  
  if (!context) {
    throw new Error('useCartContext must be used within a CartProvider')
  }
  
  return context
}

// ============================================================================
// CONVENIENCE HOOKS
// ============================================================================

/**
 * Hook for accessing cart items only
 */
export const useCartItems = () => {
  const { items } = useCartContext()
  return items
}

/**
 * Hook for accessing cart summary only
 */
export const useCartSummaryContext = () => {
  const { summary } = useCartContext()
  return summary
}

/**
 * Hook for cart actions only
 */
export const useCartActions = () => {
  const { addItem, updateQuantity, removeItem, clearCart } = useCartContext()
  return { addItem, updateQuantity, removeItem, clearCart }
}

/**
 * Hook for cart state only
 */
export const useCartState = () => {
  const { items, summary, isLoading, error } = useCartContext()
  return { items, summary, isLoading, error }
}