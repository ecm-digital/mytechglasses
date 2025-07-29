'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { 
  ExclamationTriangleIcon, 
  ArrowPathIcon, 
  ShoppingCartIcon,
  CreditCardIcon,
  PhoneIcon,
  EnvelopeIcon
} from '@heroicons/react/24/outline'
import { useCart } from '@/hooks/useCart'
import { formatPrice } from '@/lib/cart'

// Types for different failure reasons
type FailureReason = 
  | 'card_declined' 
  | 'insufficient_funds' 
  | 'expired_card' 
  | 'incorrect_cvc' 
  | 'processing_error' 
  | 'authentication_required'
  | 'cancelled'
  | 'unknown'

interface FailureInfo {
  title: string
  description: string
  icon: string
  suggestions: string[]
  canRetry: boolean
}

const FAILURE_REASONS: Record<FailureReason, FailureInfo> = {
  card_declined: {
    title: 'Karta została odrzucona',
    description: 'Twoja karta została odrzucona przez bank. Może to być spowodowane różnymi przyczynami.',
    icon: '💳',
    suggestions: [
      'Sprawdź czy masz wystarczające środki na koncie',
      'Upewnij się, że karta nie jest zablokowana',
      'Skontaktuj się z bankiem w sprawie transakcji',
      'Spróbuj użyć innej karty płatniczej'
    ],
    canRetry: true
  },
  insufficient_funds: {
    title: 'Niewystarczające środki',
    description: 'Na Twoim koncie nie ma wystarczających środków do realizacji płatności.',
    icon: '💰',
    suggestions: [
      'Sprawdź saldo na koncie',
      'Doładuj konto lub użyj innej karty',
      'Sprawdź czy nie masz ustawionych limitów dziennych',
      'Skontaktuj się z bankiem'
    ],
    canRetry: true
  },
  expired_card: {
    title: 'Karta wygasła',
    description: 'Data ważności Twojej karty już minęła.',
    icon: '📅',
    suggestions: [
      'Sprawdź datę ważności karty',
      'Użyj aktualnej karty płatniczej',
      'Skontaktuj się z bankiem w sprawie nowej karty'
    ],
    canRetry: true
  },
  incorrect_cvc: {
    title: 'Nieprawidłowy kod CVC',
    description: 'Wprowadzony kod CVC (CVV) jest nieprawidłowy.',
    icon: '🔢',
    suggestions: [
      'Sprawdź 3-cyfrowy kod na odwrocie karty',
      'Upewnij się, że wprowadzasz właściwy kod',
      'Sprawdź czy karta nie jest uszkodzona'
    ],
    canRetry: true
  },
  processing_error: {
    title: 'Błąd przetwarzania',
    description: 'Wystąpił techniczny problem podczas przetwarzania płatności.',
    icon: '⚠️',
    suggestions: [
      'Spróbuj ponownie za kilka minut',
      'Sprawdź połączenie internetowe',
      'Użyj innej przeglądarki lub urządzenia',
      'Skontaktuj się z naszym wsparciem'
    ],
    canRetry: true
  },
  authentication_required: {
    title: 'Wymagana autoryzacja',
    description: 'Twój bank wymaga dodatkowej autoryzacji tej transakcji.',
    icon: '🔐',
    suggestions: [
      'Sprawdź SMS lub aplikację bankową',
      'Potwierdź transakcję w banku',
      'Upewnij się, że masz włączone powiadomienia',
      'Skontaktuj się z bankiem'
    ],
    canRetry: true
  },
  cancelled: {
    title: 'Płatność anulowana',
    description: 'Płatność została anulowana przez użytkownika.',
    icon: '❌',
    suggestions: [
      'Możesz spróbować ponownie',
      'Twoje dane w koszyku zostały zachowane',
      'Wybierz inną metodę płatności'
    ],
    canRetry: true
  },
  unknown: {
    title: 'Nieznany błąd',
    description: 'Wystąpił nieoczekiwany problem podczas płatności.',
    icon: '❓',
    suggestions: [
      'Spróbuj ponownie za kilka minut',
      'Sprawdź połączenie internetowe',
      'Skontaktuj się z naszym wsparciem',
      'Użyj innej metody płatności'
    ],
    canRetry: true
  }
}

function PaymentFailedContent() {
  const searchParams = useSearchParams()
  const reason = (searchParams.get('reason') as FailureReason) || 'unknown'
  const sessionId = searchParams.get('session_id')
  const amount = searchParams.get('amount')
  
  const { summary, isEmpty } = useCart()
  const [retryAttempts, setRetryAttempts] = useState(0)
  
  const failureInfo = FAILURE_REASONS[reason] || FAILURE_REASONS.unknown

  const handleRetryPayment = () => {
    setRetryAttempts(prev => prev + 1)
    // Redirect back to checkout
    window.location.href = '/checkout'
  }

  const getRetryButtonText = () => {
    if (retryAttempts === 0) return 'Spróbuj ponownie'
    if (retryAttempts === 1) return 'Spróbuj jeszcze raz'
    return `Spróbuj ponownie (${retryAttempts + 1})`
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container max-w-2xl">
        {/* Failure Header */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">{failureInfo.icon}</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {failureInfo.title}
          </h1>
          <p className="text-gray-600">
            {failureInfo.description}
          </p>
        </div>

        {/* Failure Details */}
        <div className="card p-6 mb-6">
          <h2 className="text-xl font-bold mb-4 flex items-center">
            <ExclamationTriangleIcon className="w-6 h-6 text-red-500 mr-2" />
            Co poszło nie tak?
          </h2>
          
          <div className="space-y-3 mb-6">
            {sessionId && (
              <div className="flex justify-between">
                <span className="text-gray-600">ID sesji:</span>
                <span className="font-mono text-sm">{sessionId}</span>
              </div>
            )}
            {amount && (
              <div className="flex justify-between">
                <span className="text-gray-600">Kwota:</span>
                <span className="font-bold">{formatPrice(parseFloat(amount))}</span>
              </div>
            )}
            {!isEmpty() && (
              <div className="flex justify-between">
                <span className="text-gray-600">Produkty w koszyku:</span>
                <span className="font-bold">{summary.itemCount}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-gray-600">Czas:</span>
              <span>{new Date().toLocaleString('pl-PL')}</span>
            </div>
          </div>

          {/* Suggestions */}
          <div className="border-t pt-4">
            <h3 className="font-bold mb-3">💡 Co możesz zrobić:</h3>
            <ul className="space-y-2">
              {failureInfo.suggestions.map((suggestion, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-blue-500 mr-2 mt-1">•</span>
                  <span className="text-gray-700">{suggestion}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4 mb-8">
          {failureInfo.canRetry && !isEmpty() && (
            <button
              onClick={handleRetryPayment}
              className="btn btn-primary w-full flex items-center justify-center text-lg py-4"
            >
              <ArrowPathIcon className="w-6 h-6 mr-2" />
              {getRetryButtonText()}
            </button>
          )}
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link 
              href="/cart" 
              className="btn btn-secondary flex items-center justify-center"
            >
              <ShoppingCartIcon className="w-5 h-5 mr-2" />
              Powrót do koszyka
            </Link>
            <Link 
              href="/products" 
              className="btn btn-outline flex items-center justify-center"
            >
              Kontynuuj zakupy
            </Link>
          </div>
        </div>

        {/* Alternative Payment Methods */}
        <div className="card p-6 mb-6 bg-blue-50">
          <h3 className="font-bold mb-4 flex items-center">
            <CreditCardIcon className="w-6 h-6 text-blue-600 mr-2" />
            Alternatywne metody płatności
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-white rounded-lg">
              <div className="text-2xl mb-1">💳</div>
              <div className="text-sm font-medium">Inna karta</div>
            </div>
            <div className="text-center p-3 bg-white rounded-lg">
              <div className="text-2xl mb-1">📱</div>
              <div className="text-sm font-medium">BLIK</div>
            </div>
            <div className="text-center p-3 bg-white rounded-lg">
              <div className="text-2xl mb-1">🏦</div>
              <div className="text-sm font-medium">Przelewy24</div>
            </div>
            <div className="text-center p-3 bg-white rounded-lg">
              <div className="text-2xl mb-1">📞</div>
              <div className="text-sm font-medium">Telefon</div>
            </div>
          </div>
          <p className="text-sm text-blue-700 mt-4 text-center">
            Wszystkie metody płatności są dostępne podczas ponownej próby
          </p>
        </div>

        {/* Cart Preservation Notice */}
        {!isEmpty() && (
          <div className="card p-4 mb-6 bg-green-50 border-green-200">
            <div className="flex items-center text-green-800">
              <ShoppingCartIcon className="w-5 h-5 mr-2" />
              <span className="font-medium">Twój koszyk został zachowany</span>
            </div>
            <p className="text-green-700 text-sm mt-1">
              Wszystkie produkty pozostają w koszyku. Możesz kontynuować zakupy lub spróbować płatności ponownie.
            </p>
          </div>
        )}

        {/* Support Information */}
        <div className="card p-6 bg-gray-50">
          <h3 className="font-bold mb-4">🆘 Potrzebujesz pomocy?</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center">
              <EnvelopeIcon className="w-5 h-5 text-gray-600 mr-3" />
              <div>
                <div className="font-medium">Email</div>
                <a href="mailto:support@mytechglasses.pl" className="text-blue-600 hover:underline text-sm">
                  support@mytechglasses.pl
                </a>
              </div>
            </div>
            <div className="flex items-center">
              <PhoneIcon className="w-5 h-5 text-gray-600 mr-3" />
              <div>
                <div className="font-medium">Telefon</div>
                <a href="tel:+48123456789" className="text-blue-600 hover:underline text-sm">
                  +48 123 456 789
                </a>
              </div>
            </div>
          </div>
          <div className="mt-4 p-3 bg-white rounded border-l-4 border-blue-500">
            <p className="text-sm text-gray-700">
              <strong>Wskazówka:</strong> Przy kontakcie podaj ID sesji: 
              <code className="ml-1 text-xs bg-gray-100 px-1 rounded">
                {sessionId || 'brak'}
              </code>
            </p>
          </div>
        </div>

        {/* Retry Attempts Warning */}
        {retryAttempts >= 2 && (
          <div className="mt-6 card p-4 bg-yellow-50 border-yellow-200">
            <div className="flex items-center text-yellow-800">
              <ExclamationTriangleIcon className="w-5 h-5 mr-2" />
              <span className="font-medium">Wiele nieudanych prób</span>
            </div>
            <p className="text-yellow-700 text-sm mt-1">
              Jeśli problem się powtarza, skontaktuj się z naszym wsparciem lub spróbuj użyć innej metody płatności.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default function PaymentFailed() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Ładowanie...</p>
        </div>
      </div>
    }>
      <PaymentFailedContent />
    </Suspense>
  )
}