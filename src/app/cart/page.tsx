'use client'

import { useState } from 'react'
import Link from 'next/link'
import { TrashIcon, ArrowRightIcon, MinusIcon, PlusIcon } from '@heroicons/react/24/outline'

export default function Cart() {
  // W rzeczywistej aplikacji dane koszyka byłyby pobierane z API lub stanu globalnego
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      productId: 'vision-pro',
      name: 'Vision Pro',
      color: 'Black',
      price: 2499,
      quantity: 1,
      emoji: '🥽'
    },
    {
      id: 2,
      productId: 'tech-view',
      name: 'Tech View',
      color: 'Blue',
      price: 1899,
      quantity: 1,
      emoji: '👓'
    }
  ])
  
  const updateQuantity = (id: number, newQuantity: number) => {
    if (newQuantity < 1) return
    
    setCartItems(cartItems.map(item => 
      item.id === id ? { ...item, quantity: newQuantity } : item
    ))
  }
  
  const removeItem = (id: number) => {
    setCartItems(cartItems.filter(item => item.id !== id))
  }
  
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const shipping = subtotal > 0 ? (subtotal > 2000 ? 0 : 15) : 0
  const total = subtotal + shipping
  
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
      
      {cartItems.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🛒</div>
          <h2 className="text-mobile-lg md:text-2xl font-bold mb-4">Twój koszyk jest pusty</h2>
          <p className="text-gray-600 text-mobile-sm md:text-base mb-8">
            Dodaj produkty do koszyka, aby kontynuować zakupy.
          </p>
          <Link href="/products" className="btn btn-primary">
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
                          onClick={() => removeItem(item.id)}
                          className="min-h-touch min-w-touch flex items-center justify-center text-red-600 hover:text-red-900 touch-feedback ml-2"
                          aria-label="Usuń produkt"
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
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="min-h-touch min-w-touch flex items-center justify-center border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 touch-feedback"
                            disabled={item.quantity <= 1}
                            aria-label="Zmniejsz ilość"
                          >
                            <MinusIcon className="h-4 w-4" />
                          </button>
                          
                          <span className="min-w-[3rem] h-touch flex items-center justify-center text-mobile-base md:text-lg font-medium">
                            {item.quantity}
                          </span>
                          
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="min-h-touch min-w-touch flex items-center justify-center border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 touch-feedback"
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
                    <span className="font-medium">{subtotal} zł</span>
                  </div>
                  
                  <div className="flex justify-between text-mobile-sm md:text-base">
                    <span className="text-gray-600">Dostawa</span>
                    <span className="font-medium">
                      {shipping === 0 ? 'Darmowa' : `${shipping} zł`}
                    </span>
                  </div>
                  
                  {subtotal > 0 && subtotal < 2000 && (
                    <div className="text-mobile-xs md:text-sm text-accent bg-blue-50 p-2 rounded">
                      Dodaj produkty za {2000 - subtotal} zł, aby otrzymać darmową dostawę!
                    </div>
                  )}
                </div>
                
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between mb-4">
                    <span className="text-mobile-base md:text-lg font-bold">Razem</span>
                    <span className="text-mobile-lg md:text-xl font-bold text-primary">{total} zł</span>
                  </div>
                </div>
                
                {/* Mobile-optimized checkout button */}
                <Link
                  href="/checkout"
                  className="btn btn-primary w-full mb-4 flex items-center justify-center text-mobile-base md:text-base"
                >
                  Przejdź do kasy
                  <ArrowRightIcon className="h-5 w-5 ml-2" />
                </Link>
                
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