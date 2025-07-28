/**
 * End-to-End Payment Flow Tests
 * Tests the complete payment process from cart to success/failure
 */

import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { loadStripe } from '@stripe/stripe-js'
import Cart from '@/app/cart/page'
import Checkout from '@/app/checkout/page'
import Success from '@/app/success/page'
import FailedPayment from '@/app/checkout/failed/page'
import { useCart } from '@/hooks/useCart'

// Mock the useCart hook
jest.mock('@/hooks/useCart')
const mockUseCart = useCart as jest.MockedFunction<typeof useCart>

// Mock Stripe
const mockStripe = {
  redirectToCheckout: jest.fn(),
  elements: jest.fn(),
  createToken: jest.fn(),
  createPaymentMethod: jest.fn(),
}

;(loadStripe as jest.Mock).mockResolvedValue(mockStripe)

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

const mockCartHook = {
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

describe('End-to-End Payment Flow', () => {
  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks()
    mockUseCart.mockReturnValue(mockCartHook)
    
    // Reset fetch mock
    ;(global.fetch as jest.Mock).mockClear()
    
    // Reset Stripe mock
    mockStripe.redirectToCheckout.mockClear()
  })

  describe('Cart to Checkout Flow', () => {
    test('should display cart items and allow proceeding to checkout', async () => {
      const user = userEvent.setup()
      
      render(<Cart />)
      
      // Verify cart items are displayed
      expect(screen.getByText('Vision Pro')).toBeInTheDocument()
      expect(screen.getByText('Tech View')).toBeInTheDocument()
      expect(screen.getByText('7745.31 zł')).toBeInTheDocument()
      
      // Find and click proceed to checkout button
      const checkoutButton = screen.getByText('Przejdź do checkout')
      expect(checkoutButton).toBeInTheDocument()
      expect(checkoutButton).not.toBeDisabled()
      
      await user.click(checkoutButton)
      
      // Should navigate to checkout (mocked)
      expect(window.location.href).toBe('http://localhost:3000')
    })

    test('should handle empty cart state', () => {
      mockUseCart.mockReturnValue({
        ...mockCartHook,
        items: [],
        isEmpty: jest.fn(() => true),
        isValidForCheckout: jest.fn(() => ({ isValid: false, errors: ['Cart is empty'] }))
      })
      
      render(<Cart />)
      
      expect(screen.getByText('Twój koszyk jest pusty')).toBeInTheDocument()
      expect(screen.getByText('Przejdź do sklepu')).toBeInTheDocument()
    })

    test('should handle cart validation errors', () => {
      mockUseCart.mockReturnValue({
        ...mockCartHook,
        isValidForCheckout: jest.fn(() => ({ 
          isValid: false, 
          errors: ['Some items are out of stock'] 
        }))
      })
      
      render(<Cart />)
      
      const checkoutButton = screen.getByText('Przejdź do checkout')
      expect(checkoutButton).toBeDisabled()
      
      expect(screen.getByText('Some items are out of stock')).toBeInTheDocument()
    })

    test('should handle quick Stripe checkout from cart', async () => {
      const user = userEvent.setup()
      
      // Mock successful API response
      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ sessionId: 'cs_test_123' })
      })
      
      render(<Cart />)
      
      const stripeButton = screen.getByText('Szybka płatność (Stripe)')
      await user.click(stripeButton)
      
      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith('/api/create-checkout-session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: expect.stringContaining('vision-pro')
        })
      })
      
      expect(mockStripe.redirectToCheckout).toHaveBeenCalledWith({
        sessionId: 'cs_test_123'
      })
    })
  })

  describe('Checkout Form Validation', () => {
    test('should validate required fields', async () => {
      const user = userEvent.setup()
      
      render(<Checkout />)
      
      // Try to submit without filling required fields
      const submitButton = screen.getByText(/Przejdź do płatności/)
      await user.click(submitButton)
      
      // Should show validation errors
      await waitFor(() => {
        expect(screen.getByText('Imię jest wymagane')).toBeInTheDocument()
        expect(screen.getByText('Nazwisko jest wymagane')).toBeInTheDocument()
        expect(screen.getByText('Adres email jest wymagany')).toBeInTheDocument()
      })
    })

    test('should validate email format', async () => {
      const user = userEvent.setup()
      
      render(<Checkout />)
      
      const emailInput = screen.getByPlaceholderText('twoj@email.com')
      await user.type(emailInput, 'invalid-email')
      await user.tab() // Trigger blur event
      
      await waitFor(() => {
        expect(screen.getByText('Wprowadź prawidłowy adres email')).toBeInTheDocument()
      })
    })

    test('should validate phone number format', async () => {
      const user = userEvent.setup()
      
      render(<Checkout />)
      
      const phoneInput = screen.getByPlaceholderText('+48 123 456 789')
      await user.type(phoneInput, '123')
      await user.tab()
      
      await waitFor(() => {
        expect(screen.getByText('Wprowadź prawidłowy numer telefonu (np. +48 123 456 789)')).toBeInTheDocument()
      })
    })

    test('should format phone number automatically', async () => {
      const user = userEvent.setup()
      
      render(<Checkout />)
      
      const phoneInput = screen.getByPlaceholderText('+48 123 456 789')
      await user.type(phoneInput, '123456789')
      
      await waitFor(() => {
        expect(phoneInput).toHaveValue('+48 123 456 789')
      })
    })

    test('should validate postal code based on country', async () => {
      const user = userEvent.setup()
      
      render(<Checkout />)
      
      // Select Poland and enter invalid postal code
      const countrySelect = screen.getByDisplayValue('Polska')
      const postalCodeInput = screen.getByPlaceholderText('00-001')
      
      await user.type(postalCodeInput, '123')
      await user.tab()
      
      await waitFor(() => {
        expect(screen.getByText('Wprowadź prawidłowy kod pocztowy dla wybranego kraju')).toBeInTheDocument()
      })
    })

    test('should require terms acceptance', async () => {
      const user = userEvent.setup()
      
      render(<Checkout />)
      
      // Fill all required fields except terms
      await user.type(screen.getByPlaceholderText('Wprowadź imię'), 'Jan')
      await user.type(screen.getByPlaceholderText('Wprowadź nazwisko'), 'Kowalski')
      await user.type(screen.getByPlaceholderText('twoj@email.com'), 'jan@example.com')
      await user.type(screen.getByPlaceholderText('+48 123 456 789'), '123456789')
      await user.type(screen.getByPlaceholderText('ul. Przykładowa 123'), 'ul. Testowa 1')
      await user.type(screen.getByPlaceholderText('Warszawa'), 'Warszawa')
      await user.type(screen.getByPlaceholderText('00-001'), '00-001')
      
      const submitButton = screen.getByText(/Przejdź do płatności/)
      await user.click(submitButton)
      
      await waitFor(() => {
        expect(screen.getByText('Musisz zaakceptować regulamin')).toBeInTheDocument()
      })
    })
  })

  describe('Successful Payment Flow', () => {
    test('should create checkout session and redirect to Stripe', async () => {
      const user = userEvent.setup()
      
      // Mock successful API response
      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ sessionId: 'cs_test_success_123' })
      })
      
      render(<Checkout />)
      
      // Fill out the form
      await user.type(screen.getByPlaceholderText('Wprowadź imię'), 'Jan')
      await user.type(screen.getByPlaceholderText('Wprowadź nazwisko'), 'Kowalski')
      await user.type(screen.getByPlaceholderText('twoj@email.com'), 'jan@example.com')
      await user.type(screen.getByPlaceholderText('+48 123 456 789'), '123456789')
      await user.type(screen.getByPlaceholderText('ul. Przykładowa 123'), 'ul. Testowa 1')
      await user.type(screen.getByPlaceholderText('Warszawa'), 'Warszawa')
      await user.type(screen.getByPlaceholderText('00-001'), '00-001')
      
      // Accept terms
      const termsCheckbox = screen.getByRole('checkbox', { name: /Akceptuję regulamin/ })
      await user.click(termsCheckbox)
      
      // Submit form
      const submitButton = screen.getByText(/Przejdź do płatności/)
      await user.click(submitButton)
      
      // Verify API call
      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith('/api/create-checkout-session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: expect.stringContaining('"firstName":"Jan"')
        })
      })
      
      // Verify Stripe redirect
      expect(mockStripe.redirectToCheckout).toHaveBeenCalledWith({
        sessionId: 'cs_test_success_123'
      })
    })

    test('should display success page with order details', () => {
      // Mock URL search params for success page
      const mockSearchParams = new URLSearchParams('?session_id=cs_test_123&order_id=MTG-123')
      jest.spyOn(require('next/navigation'), 'useSearchParams').mockReturnValue(mockSearchParams)
      
      // Mock successful session retrieval
      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          session: {
            id: 'cs_test_123',
            payment_status: 'paid',
            amount_total: 774531,
            currency: 'pln',
            customer_details: {
              email: 'jan@example.com',
              name: 'Jan Kowalski'
            }
          },
          lineItems: mockCartItems
        })
      })
      
      render(<Success />)
      
      expect(screen.getByText('Dziękujemy za zakup!')).toBeInTheDocument()
      expect(screen.getByText('MTG-123')).toBeInTheDocument()
    })
  })

  describe('Failed Payment Flow', () => {
    test('should handle API errors during checkout session creation', async () => {
      const user = userEvent.setup()
      
      // Mock API error
      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        json: async () => ({ error: 'Invalid cart data' })
      })
      
      render(<Checkout />)
      
      // Fill and submit form
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
      
      // Should display error message
      await waitFor(() => {
        expect(screen.getByText('Invalid cart data')).toBeInTheDocument()
      })
    })

    test('should handle Stripe redirect errors', async () => {
      const user = userEvent.setup()
      
      // Mock successful API but failed Stripe redirect
      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ sessionId: 'cs_test_123' })
      })
      
      mockStripe.redirectToCheckout.mockResolvedValueOnce({
        error: { message: 'Network error' }
      })
      
      render(<Checkout />)
      
      // Fill and submit form
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
      
      await waitFor(() => {
        expect(screen.getByText('Network error')).toBeInTheDocument()
      })
    })

    test('should display failed payment page with retry options', () => {
      // Mock URL search params for failed payment
      const mockSearchParams = new URLSearchParams('?reason=card_declined&session_id=cs_test_123&amount=7745')
      jest.spyOn(require('next/navigation'), 'useSearchParams').mockReturnValue(mockSearchParams)
      
      render(<FailedPayment />)
      
      expect(screen.getByText('Płatność nie powiodła się')).toBeInTheDocument()
      expect(screen.getByText('Twoja karta została odrzucona przez bank')).toBeInTheDocument()
      expect(screen.getByText('Spróbuj ponownie')).toBeInTheDocument()
    })

    test('should handle cancelled payment from URL', () => {
      // Mock URL search params for cancelled payment
      const mockSearchParams = new URLSearchParams('?cancelled=true')
      jest.spyOn(require('next/navigation'), 'useSearchParams').mockReturnValue(mockSearchParams)
      
      render(<Checkout />)
      
      expect(screen.getByText('Płatność została anulowana')).toBeInTheDocument()
      expect(screen.getByText('Spróbuj ponownie')).toBeInTheDocument()
    })
  })

  describe('Cart Data Persistence', () => {
    test('should preserve cart data during checkout flow', async () => {
      const user = userEvent.setup()
      
      // Mock failed payment that returns to checkout
      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        json: async () => ({ error: 'Payment failed' })
      })
      
      render(<Checkout />)
      
      // Verify cart items are still displayed in order summary
      expect(screen.getByText('Vision Pro')).toBeInTheDocument()
      expect(screen.getByText('Tech View')).toBeInTheDocument()
      expect(screen.getByText('7745.31 zł')).toBeInTheDocument()
      
      // Cart should still be accessible
      expect(mockCartHook.items).toHaveLength(2)
    })

    test('should maintain cart state after payment cancellation', () => {
      const mockSearchParams = new URLSearchParams('?cancelled=true')
      jest.spyOn(require('next/navigation'), 'useSearchParams').mockReturnValue(mockSearchParams)
      
      render(<Checkout />)
      
      // Cart data should still be available
      expect(screen.getByText('Vision Pro')).toBeInTheDocument()
      expect(screen.getByText('Tech View')).toBeInTheDocument()
      
      // User should be able to retry
      expect(screen.getByText('Spróbuj ponownie')).toBeInTheDocument()
    })
  })

  describe('Loading States and User Feedback', () => {
    test('should show loading state during checkout session creation', async () => {
      const user = userEvent.setup()
      
      // Mock delayed API response
      ;(global.fetch as jest.Mock).mockImplementationOnce(
        () => new Promise(resolve => setTimeout(() => resolve({
          ok: true,
          json: async () => ({ sessionId: 'cs_test_123' })
        }), 100))
      )
      
      render(<Checkout />)
      
      // Fill and submit form
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
      
      // Should show loading state
      expect(screen.getByText('Przekierowywanie do płatności...')).toBeInTheDocument()
      expect(submitButton).toBeDisabled()
    })

    test('should show loading state in cart during Stripe checkout', async () => {
      const user = userEvent.setup()
      
      // Mock delayed API response
      ;(global.fetch as jest.Mock).mockImplementationOnce(
        () => new Promise(resolve => setTimeout(() => resolve({
          ok: true,
          json: async () => ({ sessionId: 'cs_test_123' })
        }), 100))
      )
      
      render(<Cart />)
      
      const stripeButton = screen.getByText('Szybka płatność (Stripe)')
      await user.click(stripeButton)
      
      // Should show loading state
      expect(screen.getByText('Przekierowywanie...')).toBeInTheDocument()
      expect(stripeButton).toBeDisabled()
    })
  })

  describe('Error Recovery', () => {
    test('should allow retry after failed checkout session creation', async () => {
      const user = userEvent.setup()
      
      // First attempt fails
      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        json: async () => ({ error: 'Server error' })
      })
      
      render(<Checkout />)
      
      // Fill and submit form
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
      
      // Should show error
      await waitFor(() => {
        expect(screen.getByText('Server error')).toBeInTheDocument()
      })
      
      // Second attempt succeeds
      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ sessionId: 'cs_test_retry_123' })
      })
      
      // Retry
      await user.click(submitButton)
      
      await waitFor(() => {
        expect(mockStripe.redirectToCheckout).toHaveBeenCalledWith({
          sessionId: 'cs_test_retry_123'
        })
      })
    })
  })
})