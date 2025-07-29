'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { CheckCircleIcon, TruckIcon, EnvelopeIcon, ExclamationTriangleIcon, ArrowPathIcon } from '@heroicons/react/24/solid'
import { formatPrice } from '@/lib/cart'
import { useCart } from '@/hooks/useCart'

// Types
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

function SuccessContent() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get('session_id')
  const orderId = searchParams.get('order_id')
  const { clearCart } = useCart()
  
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [retryCount, setRetryCount] = useState(0)

  const fetchOrderDetails = async (sessionId: string) => {
    try {
      setError(null)
      const response = await fetch(`/api/checkout-session/${sessionId}`)
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `HTTP ${response.status}`)
      }
      
      const data: OrderDetails = await response.json()
      setOrderDetails(data)
      
      // Clear cart after successful order
      await clearCart()
      
    } catch (err) {
      console.error('Error fetching order details:', err)
      setError(err instanceof Error ? err.message : 'Nie udało się pobrać szczegółów zamówienia')
    } finally {
      setLoading(false)
    }
  }

  const handleRetry = () => {
    if (sessionId && retryCount < 3) {
      setLoading(true)
      setRetryCount(prev => prev + 1)
      fetchOrderDetails(sessionId)
    }
  }

  useEffect(() => {
    if (sessionId) {
      fetchOrderDetails(sessionId)
    } else {
      setError('Brak identyfikatora sesji płatności')
      setLoading(false)
    }
  }, [sessionId])

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Pobieramy szczegóły Twojego zamówienia...</p>
          {retryCount > 0 && (
            <p className="text-sm text-gray-500 mt-2">Próba {retryCount + 1}/4</p>
          )}
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <ExclamationTriangleIcon className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Wystąpił problem
          </h1>
          <p className="text-gray-600 mb-6">
            {error}
          </p>
          
          {sessionId && retryCount < 3 && (
            <button
              onClick={handleRetry}
              className="btn btn-primary mb-4 flex items-center justify-center mx-auto"
            >
              <ArrowPathIcon className="w-5 h-5 mr-2" />
              Spróbuj ponownie
            </button>
          )}
          
          <div className="space-y-2">
            <Link href="/cart" className="btn btn-secondary block">
              Powrót do koszyka
            </Link>
            <Link href="/products" className="btn btn-outline block">
              Kontynuuj zakupy
            </Link>
          </div>
          
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Potrzebujesz pomocy?</strong><br />
              Skontaktuj się z nami: <a href="mailto:support@mytechglasses.pl" className="underline">support@mytechglasses.pl</a>
              {sessionId && (
                <>
                  <br />ID sesji: <code className="text-xs">{sessionId}</code>
                </>
              )}
            </p>
          </div>
        </div>
      </div>
    )
  }

  // No order details (shouldn't happen if no error)
  if (!orderDetails) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Brak danych zamówienia</p>
          <Link href="/products" className="btn btn-primary mt-4">
            Kontynuuj zakupy
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container max-w-2xl">
        {/* Success Header */}
        <div className="text-center mb-8">
          <CheckCircleIcon className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Dziękujemy za zamówienie!
          </h1>
          <p className="text-gray-600">
            Twoja płatność została pomyślnie przetworzona
          </p>
        </div>

        {/* Order Details */}
        <div className="card p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">Szczegóły zamówienia</h2>
          
          <div className="space-y-3 mb-6">
            <div className="flex justify-between">
              <span className="text-gray-600">Numer zamówienia:</span>
              <span className="font-mono font-bold">{orderDetails.orderId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Email:</span>
              <span>{orderDetails.customerInfo.email}</span>
            </div>
            {orderDetails.customerInfo.name && (
              <div className="flex justify-between">
                <span className="text-gray-600">Imię i nazwisko:</span>
                <span>{orderDetails.customerInfo.name}</span>
              </div>
            )}
            {orderDetails.customerInfo.phone && (
              <div className="flex justify-between">
                <span className="text-gray-600">Telefon:</span>
                <span>{orderDetails.customerInfo.phone}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-gray-600">Status płatności:</span>
              <span className={`font-bold ${
                orderDetails.paymentStatus === 'paid' ? 'text-green-600' : 
                orderDetails.paymentStatus === 'pending' ? 'text-yellow-600' : 
                'text-red-600'
              }`}>
                {orderDetails.paymentStatus === 'paid' ? 'Opłacone' :
                 orderDetails.paymentStatus === 'pending' ? 'Oczekuje' : 'Niepowodzenie'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Data zamówienia:</span>
              <span>{new Date(orderDetails.createdAt).toLocaleString('pl-PL')}</span>
            </div>
          </div>

          {/* Ordered Items */}
          <div className="border-t pt-4 mb-4">
            <h3 className="font-bold mb-3">Zamówione produkty:</h3>
            <div className="space-y-3">
              {orderDetails.items.map((item, index) => (
                <div key={index} className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="font-medium">{item.name}</div>
                    {item.description && (
                      <div className="text-sm text-gray-600">{item.description}</div>
                    )}
                    <div className="text-sm text-gray-600">
                      Ilość: {item.quantity} × {formatPrice(item.price)}
                    </div>
                  </div>
                  <div className="font-bold text-right">
                    {formatPrice(item.total)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pricing Breakdown */}
          <div className="border-t pt-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Wartość produktów:</span>
                <span>{formatPrice(orderDetails.pricing.subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Dostawa:</span>
                <span>
                  {orderDetails.pricing.shipping === 0 
                    ? 'Darmowa' 
                    : formatPrice(orderDetails.pricing.shipping)
                  }
                </span>
              </div>
              {orderDetails.pricing.tax > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-600">VAT:</span>
                  <span>{formatPrice(orderDetails.pricing.tax)}</span>
                </div>
              )}
              <div className="border-t pt-2 flex justify-between text-lg font-bold">
                <span>Razem:</span>
                <span>{formatPrice(orderDetails.pricing.total)}</span>
              </div>
            </div>
          </div>

          {/* Payment Intent ID for reference */}
          {orderDetails.paymentIntentId && (
            <div className="mt-4 pt-4 border-t">
              <div className="text-xs text-gray-500">
                ID płatności: <code>{orderDetails.paymentIntentId}</code>
              </div>
            </div>
          )}
        </div>

        {/* Next Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="card p-6 text-center">
            <EnvelopeIcon className="w-8 h-8 text-blue-500 mx-auto mb-3" />
            <h3 className="font-bold mb-2">Potwierdzenie email</h3>
            <p className="text-sm text-gray-600">
              Wysłaliśmy potwierdzenie zamówienia na Twój adres email
            </p>
          </div>
          
          <div className="card p-6 text-center">
            <TruckIcon className="w-8 h-8 text-green-500 mx-auto mb-3" />
            <h3 className="font-bold mb-2">Dostawa</h3>
            <p className="text-sm text-gray-600">
              {orderDetails.shippingDetails.method}<br />
              {orderDetails.shippingDetails.estimatedDelivery}
            </p>
            {orderDetails.shippingDetails.address && (
              <div className="mt-3 text-xs text-gray-500">
                <div>{orderDetails.shippingDetails.address.line1}</div>
                <div>
                  {orderDetails.shippingDetails.address.postal_code} {orderDetails.shippingDetails.address.city}
                </div>
                <div>{orderDetails.shippingDetails.address.country}</div>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            href="/products" 
            className="btn btn-primary px-6 py-3"
          >
            Kontynuuj zakupy
          </Link>
          <Link 
            href="/" 
            className="btn btn-secondary px-6 py-3"
          >
            Powrót do strony głównej
          </Link>
        </div>

        {/* Additional Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="card p-4">
            <h4 className="font-bold mb-2 text-green-600">✅ Co dalej?</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Otrzymasz email z potwierdzeniem zamówienia</li>
              <li>• Przygotujemy Twoje produkty do wysyłki</li>
              <li>• Wyślemy informacje o śledzeniu przesyłki</li>
              <li>• Dostaniesz powiadomienie o dostawie</li>
            </ul>
          </div>
          
          <div className="card p-4">
            <h4 className="font-bold mb-2 text-blue-600">📋 Ważne informacje</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Zachowaj numer zamówienia: <strong>{orderDetails.orderId}</strong></li>
              <li>• Sprawdź folder spam w emailu</li>
              <li>• Możesz zwrócić produkty w ciągu 30 dni</li>
              <li>• Gwarancja obejmuje 24 miesiące</li>
            </ul>
          </div>
        </div>

        {/* Newsletter signup if not subscribed */}
        {orderDetails.metadata.newsletter !== 'true' && (
          <div className="card p-6 mb-8 bg-gradient-to-r from-blue-50 to-purple-50">
            <div className="text-center">
              <h3 className="font-bold mb-2">📧 Bądź na bieżąco!</h3>
              <p className="text-sm text-gray-600 mb-4">
                Zapisz się do newslettera, aby otrzymywać informacje o nowych produktach i promocjach.
              </p>
              <button className="btn btn-primary">
                Zapisz się do newslettera
              </button>
            </div>
          </div>
        )}

        {/* Support Info */}
        <div className="text-center mt-8 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Potrzebujesz pomocy?</strong><br />
            Skontaktuj się z nami: <a href="mailto:support@mytechglasses.pl" className="underline">support@mytechglasses.pl</a> lub <a href="tel:+48123456789" className="underline">+48 123 456 789</a>
            <br />
            <span className="text-xs">
              Podaj numer zamówienia: <code>{orderDetails.orderId}</code>
            </span>
          </p>
        </div>
      </div>
    </div>
  )
}
export
 default function Success() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <ArrowPathIcon className="w-8 h-8 text-blue-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Ładowanie szczegółów zamówienia...</p>
        </div>
      </div>
    }>
      <SuccessContent />
    </Suspense>
  )
}