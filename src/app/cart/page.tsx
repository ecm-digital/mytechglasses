'use client'

import { useState } from 'react'
import Link from 'next/link'
import { TrashIcon, ArrowRightIcon, MinusIcon, PlusIcon, CreditCardIcon, ExclamationTriangleIcon, ShoppingBagIcon } from '@heroicons/react/24/outline'
import { useCart } from '@/hooks/useCart'
import { getStripe } from '@/lib/stripe'
import { formatPrice, getFreeShippingRemaining, isFreeShippingEligible } from '@/lib/cart'

export default function Cart() {
  // Use cart utilities for state management
  const { 
    items: cartItems, 
    summary, 
    isLoading: cartLoading,
    error: cartError,
    updateQuantity, 
    removeItem, 
    isEmpty,
    isValidForCheckout 
  } = useCart()
  
  // Loading state for checkout operations
  const [isCheckoutLoading, setIsCheckoutLoading] = useState(false)
  const [checkoutError, setCheckoutError] = useState<string | null>(null)

  const handleQuantityUpdate = async (itemId: number, newQuantity: number) => {
    const success = await updateQuantity(itemId, newQuantity)
    if (!success) {
      // Error handling is managed by the useCart hook
      console.error('Failed to update quantity')
    }
  }

  const handleItemRemove = async (itemId: number) => {
    const success = await removeItem(itemId)
    if (!success) {
      // Error handling is managed by the useCart hook
      console.error('Failed to remove item')
    }
  }

  const handleProceedToCheckout = () => {
    // Validate cart before proceeding
    const validation = isValidForCheckout()
    if (!validation.isValid) {
      setCheckoutError(validation.errors.join(', '))
      return
    }

    // Clear any previous errors
    setCheckoutError(null)
    
    // Navigate to checkout page with cart data preserved
    window.location.href = '/checkout'
  }

  const handleStripeCheckout = async () => {
    setIsCheckoutLoading(true)
    setCheckoutError(null)
    
    try {
      // Validate cart before proceeding
      const validation = isValidForCheckout()
      if (!validation.isValid) {
        throw new Error(validation.errors.join(', '))
      }

      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: cartItems.map(item => ({
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            productId: item.productId,
            color: item.color,
            emoji: item.emoji
          })),
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Błąd podczas tworzenia sesji płatności')
      }

      const { sessionId } = await response.json()
      
      const stripe = await getStripe()
      if (!stripe) {
        throw new Error('Nie udało się załadować systemu płatności')
      }

      const { error } = await stripe.redirectToCheckout({ sessionId })
      if (error) {
        throw new Error(error.message || 'Błąd podczas przekierowania do płatności')
      }

    } catch (error) {
      console.error('Stripe checkout error:', error)
      setCheckoutError(error instanceof Error ? error.message : 'Wystąpił nieoczekiwany błąd')
    } finally {
      setIsCheckoutLoading(false)
    }
  }
  
  return (
    <div className="mobile-container md:container py-6 md:py-12">
      {/* Mobile-optimized header */}
      <div className="mb-6 md:mb-8">
        <h1 className="text-mobile-xl md:text-3xl lg:text-4xl font-bold font-heading mb-2">
          Twój koszyk
        </h1>
        {cartItems.length > 0 && (
          <p className="text-mobile-sm md:text-base text-gray-600">
            {cartItems.length} {cartItems.length === 1 ? 'produkt' : 'produkty'} w koszyku
          </p>
        )}
      </div>

      {/* Global cart error */}
      {cartError && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-start">
            <ExclamationTriangleIcon className="h-5 w-5 text-red-600 mt-0.5 mr-3 flex-shrink-0" />
            <div>
              <h3 className="text-mobile-base md:text-lg font-medium text-red-800 mb-1">
                Wystąpił problem z koszykiem
              </h3>
              <p className="text-mobile-sm md:text-sm text-red-700">
                {cartError}
              </p>
            </div>
          </div>
        </div>
      )}
      
      {isEmpty() ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🛒</div>
          <h2 className="text-mobile-lg md:text-2xl font-bold mb-4">Twój koszyk jest pusty</h2>
          <p className="text-gray-600 text-mobile-sm md:text-base mb-8">
            Dodaj produkty do koszyka, aby kontynuować zakupy.
          </p>
          <Link href="/products" className="btn btn-primary inline-flex items-center">
            <ShoppingBagIcon className="h-5 w-5 mr-2" />
            Przejdź do sklepu
          </Link>
        </div>
      ) : (
        <div className="space-y-6 md:grid md:grid-cols-3 md:gap-8 md:space-y-0">
          {/* Cart Items - Mobile First */}
          <div className="md:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <div key={item.id} className="mobile-card md:card">
                <div className="p-4 md:p-6">
                  <div className="flex items-start gap-4">
                    {/* Mobile-optimized product image */}
                    <div className="w-16 h-16 md:w-20 md:h-20 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-2xl md:text-3xl">{item.emoji}</span>
                    </div>
                    
                    {/* Product details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="text-mobile-base md:text-lg font-bold text-gray-900 truncate">
                            {item.name}
                          </h3>
                          <p className="text-mobile-sm md:text-sm text-gray-500">
                            Kolor: {item.color}
                          </p>
                        </div>
                        
                        {/* Remove button - mobile optimized */}
                        <button
                          onClick={() => handleItemRemove(item.id)}
                          className="min-h-touch min-w-touch flex items-center justify-center text-red-600 hover:text-red-900 touch-feedback ml-2"
                          aria-label="Usuń produkt"
                          disabled={cartLoading}
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      </div>
                      
                      {/* Price and quantity controls */}
                      <div className="flex items-center justify-between">
                        <div className="text-mobile-base md:text-lg font-bold text-primary">
                          {item.price} zł
                        </div>
                        
                        {/* Mobile-friendly quantity controls */}
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleQuantityUpdate(item.id, item.quantity - 1)}
                            className="min-h-touch min-w-touch flex items-center justify-center border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 touch-feedback"
                            disabled={item.quantity <= 1 || cartLoading}
                            aria-label="Zmniejsz ilość"
                          >
                            <MinusIcon className="h-4 w-4" />
                          </button>
                          
                          <span className="min-w-[3rem] h-touch flex items-center justify-center text-mobile-base md:text-lg font-medium">
                            {item.quantity}
                          </span>
                          
                          <button
                            onClick={() => handleQuantityUpdate(item.id, item.quantity + 1)}
                            className="min-h-touch min-w-touch flex items-center justify-center border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 touch-feedback"
                            disabled={cartLoading}
                            aria-label="Zwiększ ilość"
                          >
                            <PlusIcon className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                      
                      {/* Item total */}
                      <div className="mt-2 text-right">
                        <span className="text-mobile-sm md:text-base text-gray-600">
                          Suma: <span className="font-bold text-primary">{item.price * item.quantity} zł</span>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Order Summary - Mobile Optimized */}
          <div className="md:col-span-1">
            <div className="mobile-card md:card sticky top-20">
              <div className="p-4 md:p-6">
                <h2 className="text-mobile-lg md:text-lg font-bold mb-4 md:mb-6">
                  Podsumowanie zamówienia
                </h2>
                
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-mobile-sm md:text-base">
                    <span className="text-gray-600">Wartość produktów</span>
                    <span className="font-medium">{summary.subtotal} zł</span>
                  </div>
                  
                  <div className="flex justify-between text-mobile-sm md:text-base">
                    <span className="text-gray-600">Dostawa</span>
                    <span className="font-medium">
                      {summary.shipping === 0 ? 'Darmowa' : `${summary.shipping} zł`}
                    </span>
                  </div>
                  
                  {summary.subtotal > 0 && !isFreeShippingEligible(summary.subtotal) && (
                    <div className="text-mobile-xs md:text-sm text-accent bg-blue-50 p-2 rounded">
                      Dodaj produkty za {getFreeShippingRemaining(summary.subtotal)} zł, aby otrzymać darmową dostawę!
                    </div>
                  )}
                </div>
                
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between mb-4">
                    <span className="text-mobile-base md:text-lg font-bold">Razem</span>
                    <span className="text-mobile-lg md:text-xl font-bold text-primary">{summary.total} zł</span>
                  </div>
                </div>
                
                {/* Error display */}
                {checkoutError && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-start">
                      <ExclamationTriangleIcon className="h-5 w-5 text-red-600 mt-0.5 mr-2 flex-shrink-0" />
                      <div className="text-mobile-sm md:text-sm text-red-800">
                        {checkoutError}
                      </div>
                    </div>
                  </div>
                )}

                {/* Cart validation errors */}
                {!isValidForCheckout().isValid && (
                  <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-start">
                      <ExclamationTriangleIcon className="h-5 w-5 text-yellow-600 mt-0.5 mr-2 flex-shrink-0" />
                      <div className="text-mobile-sm md:text-sm text-yellow-800">
                        <div className="font-medium mb-1">Koszyk wymaga poprawek:</div>
                        <ul className="list-disc list-inside space-y-1">
                          {isValidForCheckout().errors.map((error, index) => (
                            <li key={index}>{error}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}

                {/* Primary Checkout Button */}
                <button
                  onClick={handleProceedToCheckout}
                  disabled={cartLoading || isEmpty() || !isValidForCheckout().isValid}
                  className="btn btn-primary w-full mb-3 flex items-center justify-center text-mobile-base md:text-base disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ArrowRightIcon className="h-5 w-5 mr-2" />
                  Przejdź do checkout
                </button>
                
                {/* Quick Stripe Checkout Button */}
                <button
                  onClick={handleStripeCheckout}
                  disabled={isCheckoutLoading || cartLoading || isEmpty() || !isValidForCheckout().isValid}
                  className="btn btn-secondary w-full mb-4 flex items-center justify-center text-mobile-base md:text-base disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isCheckoutLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-600 mr-2"></div>
                      Przekierowywanie...
                    </>
                  ) : (
                    <>
                      <CreditCardIcon className="h-5 w-5 mr-2" />
                      Szybka płatność (Stripe)
                    </>
                  )}
                </button>
                
                <Link
                  href="/products"
                  className="block text-center text-accent text-mobile-sm md:text-base hover:underline"
                >
                  Kontynuuj zakupy
                </Link>
                
                {/* Mobile-friendly trust signals */}
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="grid grid-cols-2 gap-2 text-center">
                    <div className="text-mobile-xs md:text-sm text-gray-600">
                      <div className="text-lg mb-1">🔒</div>
                      Bezpieczne płatności
                    </div>
                    <div className="text-mobile-xs md:text-sm text-gray-600">
                      <div className="text-lg mb-1">↩️</div>
                      30 dni na zwrot
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}