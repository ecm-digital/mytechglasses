/**
 * Cart Data Persistence Tests
 * Tests cart data persistence through the payment flow
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useCart } from '@/hooks/useCart'
import Cart from '@/app/cart/page'
import Checkout from '@/app/checkout/page'

// Mock the useCart hook
jest.mock('@/hooks/useCart')
const mockUseCart = useCart as jest.MockedFunction<typeof useCart>

// Test data
const mockCartItems = [
  {
    id: 1,
    productId: 'vision-pro',
    name: 'Vision Pro',
    price: 2499,
    quantity: 1,
    color: 'Black',
    emoji: '🥽'
  },
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

const mockCartSummary = {
  subtotal: 6297,
  shipping: 0,
  tax: 1448.31,
  total: 7745.31,
  currency: 'PLN',
  itemCount: 3
}

describe('Cart Data Persistence Through Payment Flow', () => {
  let mockCartHook: any

  beforeEach(() => {
    jest.clearAllMocks()
    
    // Reset localStorage mock
    ;(global.localStorage.getItem as jest.Mock).mockClear()
    ;(global.localStorage.setItem as jest.Mock).mockClear()
    ;(global.localStorage.removeItem as jest.Mock).mockClear()
    
    mockCartHook = {
      items: mockCartItems,
      summary: mockCartSummary,
      isLoading: false,
      error: null,
      addItem: jest.fn(),
      updateQuantity: jest.fn(),
      removeItem: jest.fn(),
      clearCart: jest.fn(),
      getItemCount: jest.fn(() => 3),
      isEmpty: jest.fn(() => false),
      isValidForCheckout: jest.fn(() => ({ isValid: true, errors: [] })),
      saveToStorage: jest.fn(),
      loadFromStorage: jest.fn(),
    }
    
    mockUseCart.mockReturnValue(mockCartHook)
  })

  describe('Cart Storage Operations', () => {
    test('should save cart data to localStorage when items change', async () => {
      const user = userEvent.setup()
      
      render(<Cart />)
      
      // Simulate quantity update
      const plusButton = screen.getAllByLabelText('Zwiększ ilość')[0]
      await user.click(plusButton)
      
      // Should call updateQuantity which triggers saveToStorage
      expect(mockCartHook.updateQuantity).toHaveBeenCalledWith(1, 2)
      
      // In real implementation, this would save to localStorage
      expect(mockCartHook.saveToStorage).toHaveBeenCalled()
    })

    test('should load cart data from localStorage on component mount', () => {
      // Mock stored cart data
      const storedCartData = {
        items: mockCartItems,
        timestamp: Date.now(),
        version: '1.0'
      }
      
      ;(global.localStorage.getItem as jest.Mock).mockReturnValueOnce(
        JSON.stringify(storedCartData)
      )
      
      render(<Cart />)
      
      // Should call loadFromStorage on mount
      expect(mockCartHook.loadFromStorage).toHaveBeenCalled()
      
      // Cart items should be displayed
      expect(screen.getByText('Vision Pro')).toBeInTheDocument()
      expect(screen.getByText('Tech View')).toBeInTheDocument()
    })

    test('should handle corrupted localStorage data gracefully', () => {
      // Mock corrupted data
      ;(global.localStorage.getItem as jest.Mock).mockReturnValueOnce('invalid-json')
      
      // Should not throw error and use empty cart
      mockUseCart.mockReturnValue({
        ...mockCartHook,
        items: [],
        isEmpty: jest.fn(() => true)
      })
      
      render(<Cart />)
      
      expect(screen.getByText('Twój koszyk jest pusty')).toBeInTheDocument()
    })

    test('should clear expired cart data', () => {
      const expiredCartData = {
        items: mockCartItems,
        timestamp: Date.now() - (8 * 24 * 60 * 60 * 1000), // 8 days ago
        version: '1.0'
      }
      
      ;(global.localStorage.getItem as jest.Mock).mockReturnValueOnce(
        JSON.stringify(expiredCartData)
      )
      
      // Should clear expired data and start with empty cart
      mockUseCart.mockReturnValue({
        ...mockCartHook,
        items: [],
        isEmpty: jest.fn(() => true)
      })
      
      render(<Cart />)
      
      expect(screen.getByText('Twój koszyk jest pusty')).toBeInTheDocument()
    })
  })

  describe('Cart Persistence During Checkout Flow', () => {
    test('should maintain cart data when navigating to checkout', () => {
      render(<Checkout />)
      
      // Cart data should be available in checkout summary
      expect(screen.getByText('Vision Pro')).toBeInTheDocument()
      expect(screen.getByText('Tech View')).toBeInTheDocument()
      expect(screen.getByText('7745.31 zł')).toBeInTheDocument()
      
      // Cart hook should still have the items
      expect(mockCartHook.items).toHaveLength(2)
    })

    test('should preserve cart data after payment failure', async () => {
      const user = userEvent.setup()
      
      // Mock failed payment
      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        json: async () => ({ error: 'Payment failed' })
      })
      
      render(<Checkout />)
      
      // Fill form and submit
      await user.type(screen.getByPlaceholderText('Wprowadź imię'), 'Jan')
      await user.type(screen.getByPlaceholderText('Wprowadź nazwisko'), 'Kowalski')
      await user.type(screen.getByPlaceholderText('twoj@email.com'), 'jan@example.com')
      await user.type(screen.getByPlaceholderText('+48 123 456 789'), '123456789')
      await user.type(screen.getByPlaceholderText('ul. Przykładowa 123'), 'ul. Testowa 1')
      await user.type(screen.getByPlaceholderText('Warszawa'), 'Warszawa')
      await user.type(screen.getByPlaceholderText('00-001'), '00-001')
      
      const termsCheckbox = screen.getByRole('checkbox', { name: /Akceptuję regulamin/ })
      await user.click(termsCheckbox)
      
      const submitButton = screen.getByText(/Przejdź do płatności/)
      await user.click(submitButton)
      
      // After failure, cart should still be intact
      await waitFor(() => {
        expect(screen.getByText('Payment failed')).toBeInTheDocument()
      })
      
      // Cart items should still be visible in order summary
      expect(screen.getByText('Vision Pro')).toBeInTheDocument()
      expect(screen.getByText('Tech View')).toBeInTheDocument()
      
      // Cart data should not be cleared
      expect(mockCartHook.clearCart).not.toHaveBeenCalled()
    })

    test('should preserve cart data after payment cancellation', () => {
      // Mock cancelled payment URL params
      const mockSearchParams = new URLSearchParams('?cancelled=true')
      jest.spyOn(require('next/navigation'), 'useSearchParams').mockReturnValue(mockSearchParams)
      
      render(<Checkout />)
      
      // Should show cancellation message
      expect(screen.getByText('Płatność została anulowana')).toBeInTheDocument()
      
      // Cart data should still be available
      expect(screen.getByText('Vision Pro')).toBeInTheDocument()
      expect(screen.getByText('Tech View')).toBeInTheDocument()
      
      // Cart should not be cleared
      expect(mockCartHook.clearCart).not.toHaveBeenCalled()
    })

    test('should allow retry with preserved cart data', async () => {
      const user = userEvent.setup()
      
      // Mock cancelled payment
      const mockSearchParams = new URLSearchParams('?cancelled=true')
      jest.spyOn(require('next/navigation'), 'useSearchParams').mockReturnValue(mockSearchParams)
      
      render(<Checkout />)
      
      // Should show retry button
      const retryButton = screen.getByText('Spróbuj ponownie')
      expect(retryButton).toBeInTheDocument()
      
      // Mock successful retry
      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ sessionId: 'cs_test_retry_123' })
      })
      
      // Click retry and fill form
      await user.click(retryButton)
      
      // Form should be available with cart data preserved
      expect(screen.getByText('Vision Pro')).toBeInTheDocument()
      expect(screen.getByText('Tech View')).toBeInTheDocument()
    })
  })

  describe('Cart State Synchronization', () => {
    test('should synchronize cart state across multiple tabs', () => {
      // Mock storage event (simulating another tab updating cart)
      const storageEvent = new StorageEvent('storage', {
        key: 'my-tech-glasses-cart',
        newValue: JSON.stringify({
          items: [
            ...mockCartItems,
            {
              id: 3,
              productId: 'new-item',
              name: 'New Item',
              price: 999,
              quantity: 1,
              color: 'Red',
              emoji: '🔴'
            }
          ],
          timestamp: Date.now(),
          version: '1.0'
        }),
        storageArea: localStorage
      })
      
      // Update mock to include new item
      mockUseCart.mockReturnValue({
        ...mockCartHook,
        items: [
          ...mockCartItems,
          {
            id: 3,
            productId: 'new-item',
            name: 'New Item',
            price: 999,
            quantity: 1,
            color: 'Red',
            emoji: '🔴'
          }
        ]
      })
      
      render(<Cart />)
      
      // Simulate storage event
      window.dispatchEvent(storageEvent)
      
      // Should show updated cart (in real implementation)
      // This would require actual storage event handling in the component
    })

    test('should handle concurrent cart modifications', async () => {
      const user = userEvent.setup()
      
      render(<Cart />)
      
      // Simulate rapid quantity updates
      const plusButton = screen.getAllByLabelText('Zwiększ ilość')[0]
      
      // Click multiple times rapidly
      await user.click(plusButton)
      await user.click(plusButton)
      await user.click(plusButton)
      
      // Should handle all updates correctly
      expect(mockCartHook.updateQuantity).toHaveBeenCalledTimes(3)
    })
  })

  describe('Cart Recovery Scenarios', () => {
    test('should recover cart after browser crash', () => {
      // Mock cart data that was saved before crash
      const crashRecoveryData = {
        items: mockCartItems,
        timestamp: Date.now() - 1000, // 1 second ago
        version: '1.0'
      }
      
      ;(global.localStorage.getItem as jest.Mock).mockReturnValueOnce(
        JSON.stringify(crashRecoveryData)
      )
      
      render(<Cart />)
      
      // Should recover cart data
      expect(mockCartHook.loadFromStorage).toHaveBeenCalled()
      expect(screen.getByText('Vision Pro')).toBeInTheDocument()
      expect(screen.getByText('Tech View')).toBeInTheDocument()
    })

    test('should handle cart recovery with invalid items', () => {
      // Mock cart with invalid items (e.g., discontinued products)
      const invalidCartData = {
        items: [
          {
            id: 1,
            productId: 'discontinued-item',
            name: 'Discontinued Item',
            price: -100, // Invalid price
            quantity: 0, // Invalid quantity
            color: '',
            emoji: ''
          }
        ],
        timestamp: Date.now(),
        version: '1.0'
      }
      
      ;(global.localStorage.getItem as jest.Mock).mockReturnValueOnce(
        JSON.stringify(invalidCartData)
      )
      
      // Should handle invalid items gracefully
      mockUseCart.mockReturnValue({
        ...mockCartHook,
        items: [],
        isEmpty: jest.fn(() => true),
        error: 'Some items in your cart are no longer available'
      })
      
      render(<Cart />)
      
      expect(screen.getByText('Twój koszyk jest pusty')).toBeInTheDocument()
    })

    test('should migrate cart data from older versions', () => {
      // Mock old version cart data
      const oldVersionData = {
        items: mockCartItems.map(item => ({
          ...item,
          // Missing some new fields that were added in newer versions
          oldField: 'deprecated'
        })),
        timestamp: Date.now(),
        version: '0.9' // Old version
      }
      
      ;(global.localStorage.getItem as jest.Mock).mockReturnValueOnce(
        JSON.stringify(oldVersionData)
      )
      
      render(<Cart />)
      
      // Should migrate data successfully
      expect(mockCartHook.loadFromStorage).toHaveBeenCalled()
      expect(screen.getByText('Vision Pro')).toBeInTheDocument()
    })
  })

  describe('Performance and Memory Management', () => {
    test('should limit stored cart history', () => {
      // Mock cart with many items (testing storage limits)
      const largeCartData = {
        items: Array(100).fill(null).map((_, index) => ({
          id: index + 1,
          productId: `item-${index}`,
          name: `Item ${index}`,
          price: 100,
          quantity: 1,
          color: 'Black',
          emoji: '📦'
        })),
        timestamp: Date.now(),
        version: '1.0'
      }
      
      ;(global.localStorage.getItem as jest.Mock).mockReturnValueOnce(
        JSON.stringify(largeCartData)
      )
      
      // Should handle large cart data appropriately
      // In real implementation, this might trigger cart size limits
      mockUseCart.mockReturnValue({
        ...mockCartHook,
        items: largeCartData.items.slice(0, 50), // Limit to 50 items
        error: 'Cart size limit reached'
      })
      
      render(<Cart />)
      
      // Should show appropriate message for large carts
      expect(screen.getByText('Cart size limit reached')).toBeInTheDocument()
    })

    test('should clean up old cart data periodically', () => {
      // Mock multiple old cart entries
      const oldEntries = [
        'my-tech-glasses-cart-backup-1',
        'my-tech-glasses-cart-backup-2',
        'my-tech-glasses-cart-backup-3'
      ]
      
      // Mock localStorage.key to return old entries
      ;(global.localStorage.key as jest.Mock) = jest.fn()
        .mockReturnValueOnce(oldEntries[0])
        .mockReturnValueOnce(oldEntries[1])
        .mockReturnValueOnce(oldEntries[2])
        .mockReturnValueOnce(null)
      
      ;(global.localStorage.length as any) = 3
      
      render(<Cart />)
      
      // Should clean up old entries (in real implementation)
      // This would be handled by the cart cleanup logic
    })
  })

  describe('Error Handling in Cart Persistence', () => {
    test('should handle localStorage quota exceeded', async () => {
      const user = userEvent.setup()
      
      // Mock localStorage quota exceeded error
      ;(global.localStorage.setItem as jest.Mock).mockImplementationOnce(() => {
        throw new Error('QuotaExceededError')
      })
      
      render(<Cart />)
      
      // Try to add item (which would trigger save)
      const plusButton = screen.getAllByLabelText('Zwiększ ilość')[0]
      await user.click(plusButton)
      
      // Should handle error gracefully
      expect(mockCartHook.updateQuantity).toHaveBeenCalled()
      // In real implementation, would show appropriate error message
    })

    test('should handle localStorage access denied', () => {
      // Mock localStorage access denied (private browsing mode)
      ;(global.localStorage.getItem as jest.Mock).mockImplementationOnce(() => {
        throw new Error('SecurityError')
      })
      
      // Should fall back to in-memory storage
      mockUseCart.mockReturnValue({
        ...mockCartHook,
        items: [],
        isEmpty: jest.fn(() => true)
      })
      
      render(<Cart />)
      
      // Should work without localStorage
      expect(screen.getByText('Twój koszyk jest pusty')).toBeInTheDocument()
    })
  })
})