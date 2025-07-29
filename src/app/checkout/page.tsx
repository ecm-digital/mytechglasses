'use client'

import { useState, useEffect, useCallback, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeftIcon, CreditCardIcon, TruckIcon, ShieldCheckIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline'
import { useCart } from '@/hooks/useCart'
import { getStripe } from '@/lib/stripe'
import { formatPrice, SHIPPING_OPTIONS } from '@/lib/cart'
import { 
  validateCheckoutForm, 
  validateSingleField, 
  formatValidationErrors, 
  getFieldError, 
  hasFieldError,
  sanitizeInput,
  formatPhoneNumber,
  formatPostalCode,
  getCountryCode,
  type CheckoutFormData 
} from '@/lib/validation'
import { 
  logCheckoutError, 
  logValidationError, 
  logStripeError, 
  measurePerformance 
} from '@/lib/error-logging'

function CheckoutContent() {
  // URL parameters for handling cancelled payments
  const searchParams = useSearchParams()
  const cancelled = searchParams.get('cancelled')
  const errorParam = searchParams.get('error')
  
  // Cart state from our utilities
  const { items: cartItems, summary, isEmpty, isValidForCheckout } = useCart()
  
  // Form state with proper typing
  const [formData, setFormData] = useState<CheckoutFormData>({
    customerInfo: {
      firstName: '',
      lastName: '',
      email: '',
      phone: ''
    },
    shippingAddress: {
      address: '',
      city: '',
      postalCode: '',
      country: 'Polska'
    },
    deliveryMethod: 'standard',
    newsletter: false,
    terms: false
  })

  // Validation states
  const [validationErrors, setValidationErrors] = useState<Record<string, string[]>>({})
  const [isFormValid, setIsFormValid] = useState(false)
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false)

  // Helper function to get first error message
  const getFirstError = (fieldName: string): string => {
    const errors = validationErrors[fieldName]
    return errors && errors.length > 0 ? errors[0] : ''
  }

  // Helper function to check if field has errors
  const hasErrors = (fieldName: string): boolean => {
    const errors = validationErrors[fieldName]
    return errors && errors.length > 0
  }

  // Loading and error states
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [paymentCancelled, setPaymentCancelled] = useState(false)

  // Form validation - defined first to avoid hoisting issues
  const validateForm = useCallback(() => {
    const validation = validateCheckoutForm(formData)
    
    setValidationErrors(validation.fieldErrors)
    setIsFormValid(validation.isValid)

    if (!validation.isValid && hasAttemptedSubmit) {
      logValidationError('Checkout form validation failed', {
        errors: validation.errors,
        formData: {
          hasCustomerInfo: !!formData.customerInfo.firstName,
          hasShippingAddress: !!formData.shippingAddress.address,
          termsAccepted: formData.terms
        }
      })
    }

    return validation.isValid
  }, [formData, hasAttemptedSubmit])

  // Real-time validation
  const validateField = useCallback((fieldName: string, value: any, formType: 'customer' | 'shipping' | 'checkout') => {
    const errors = validateSingleField(fieldName, value, formType, formData.shippingAddress)
    
    setValidationErrors(prev => ({
      ...prev,
      [fieldName]: errors
    }))

    return errors.length === 0
  }, [formData.shippingAddress])

  // Handle cancelled payment from URL parameters
  useEffect(() => {
    if (cancelled === 'true') {
      setPaymentCancelled(true)
      setError('Płatność została anulowana. Twoje dane w koszyku zostały zachowane.')
      logCheckoutError('Payment cancelled by user', undefined, {
        source: 'url_parameter',
        returnedFromStripe: true
      })
    } else if (errorParam) {
      const decodedError = decodeURIComponent(errorParam)
      setError(decodedError)
      logCheckoutError('Checkout error from URL parameter', undefined, {
        error: decodedError,
        source: 'url_parameter'
      })
    }
  }, [cancelled, errorParam])

  // Validate form whenever formData changes
  useEffect(() => {
    if (hasAttemptedSubmit) {
      validateForm()
    }
  }, [formData, hasAttemptedSubmit, validateForm])

  // Handle input changes with validation
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    const isCheckbox = type === 'checkbox'
    const newValue = isCheckbox ? (e.target as HTMLInputElement).checked : sanitizeInput(value)

    // Update form data
    setFormData(prev => {
      const updated = { ...prev }

      // Handle nested objects
      if (name in prev.customerInfo) {
        updated.customerInfo = {
          ...prev.customerInfo,
          [name]: newValue
        }
      } else if (name in prev.shippingAddress) {
        updated.shippingAddress = {
          ...prev.shippingAddress,
          [name]: newValue
        }
      } else {
        (updated as any)[name] = newValue
      }

      return updated
    })

    // Real-time validation for specific fields
    if (hasAttemptedSubmit || validationErrors[name]) {
      setTimeout(() => {
        if (name in formData.customerInfo) {
          validateField(name, newValue, 'customer')
        } else if (name in formData.shippingAddress) {
          validateField(name, newValue, 'shipping')
        } else {
          validateField(name, newValue, 'checkout')
        }
      }, 300) // Debounce validation
    }
  }

  // Handle phone number formatting
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value)
    setFormData(prev => ({
      ...prev,
      customerInfo: {
        ...prev.customerInfo,
        phone: formatted
      }
    }))

    if (hasAttemptedSubmit || hasErrors('phone')) {
      setTimeout(() => validateField('phone', formatted, 'customer'), 300)
    }
  }

  // Handle postal code formatting
  const handlePostalCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPostalCode(e.target.value, formData.shippingAddress.country)
    setFormData(prev => ({
      ...prev,
      shippingAddress: {
        ...prev.shippingAddress,
        postalCode: formatted
      }
    }))

    if (hasAttemptedSubmit || hasErrors('postalCode')) {
      setTimeout(() => validateField('postalCode', formatted, 'shipping'), 300)
    }
  }

  const handleProceedToPayment = async (e: React.FormEvent) => {
    e.preventDefault()
    setHasAttemptedSubmit(true)
    setError(null)

    // Validate form
    if (!validateForm()) {
      setError('Proszę poprawić błędy w formularzu przed kontynuowaniem')
      return
    }

    // Validate cart
    const cartValidation = isValidForCheckout()
    if (!cartValidation.isValid) {
      const errorMessage = `Błąd koszyka: ${cartValidation.errors.join(', ')}`
      setError(errorMessage)
      logCheckoutError('Cart validation failed during checkout', undefined, {
        cartErrors: cartValidation.errors,
        cartItems: cartItems.length
      })
      return
    }

    setIsLoading(true)

    try {
      const checkoutData = await measurePerformance('checkout-session-creation', async () => {
        // Create checkout session
        const response = await fetch('/api/create-checkout-session', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            items: cartItems.map(item => ({
              id: item.id,
              name: item.name,
              price: item.price,
              quantity: item.quantity,
              productId: item.productId,
              color: item.color,
              emoji: item.emoji
            })),
            customerInfo: {
              firstName: formData.customerInfo.firstName,
              lastName: formData.customerInfo.lastName,
              email: formData.customerInfo.email,
              phone: formData.customerInfo.phone
            },
            shippingAddress: {
              line1: formData.shippingAddress.address,
              city: formData.shippingAddress.city,
              postal_code: formData.shippingAddress.postalCode,
              country: getCountryCode(formData.shippingAddress.country)
            },
            shippingOption: formData.deliveryMethod,
            newsletter: formData.newsletter
          }),
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || 'Błąd podczas tworzenia sesji płatności')
        }

        return response.json()
      })

      const { sessionId } = checkoutData
      
      // Redirect to Stripe Checkout
      const stripe = await getStripe()
      if (!stripe) {
        throw new Error('Nie udało się załadować systemu płatności')
      }

      const { error: stripeError } = await stripe.redirectToCheckout({ sessionId })
      
      if (stripeError) {
        logStripeError('Stripe redirect failed', new Error(stripeError.message || 'Stripe redirect failed'), {
          sessionId,
          customerEmail: formData.customerInfo.email,
          stripeErrorCode: stripeError.code,
          stripeErrorType: stripeError.type
        })
        throw new Error(stripeError.message || 'Błąd podczas przekierowania do płatności')
      }

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Wystąpił nieoczekiwany błąd'
      
      logCheckoutError('Checkout process failed', err instanceof Error ? err : undefined, {
        customerEmail: formData.customerInfo.email,
        cartItemCount: cartItems.length,
        deliveryMethod: formData.deliveryMethod
      })
      
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  // Redirect to cart if empty
  if (isEmpty()) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🛒</div>
          <h2 className="text-2xl font-bold mb-4">Twój koszyk jest pusty</h2>
          <p className="text-gray-600 mb-8">
            Dodaj produkty do koszyka, aby przejść do checkout.
          </p>
          <Link href="/products" className="btn btn-primary">
            Przejdź do sklepu
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <Link 
            href="/cart" 
            className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4"
          >
            <ArrowLeftIcon className="w-5 h-5 mr-2" />
            Powrót do koszyka
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Finalizacja zamówienia</h1>
          <p className="text-gray-600 mt-2">Wypełnij dane, aby dokończyć zakup</p>
        </div>

        {/* Payment Cancelled Alert */}
        {paymentCancelled && (
          <div className="mb-8 card p-6 bg-yellow-50 border-yellow-200">
            <div className="flex items-start">
              <ExclamationTriangleIcon className="w-6 h-6 text-yellow-600 mr-3 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <h3 className="font-bold text-yellow-800 mb-2">Płatność została anulowana</h3>
                <p className="text-yellow-700 mb-4">
                  Nie martw się - Twoje dane w koszyku zostały zachowane. Możesz spróbować ponownie lub wybrać inną metodę płatności.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => {
                      setPaymentCancelled(false)
                      setError(null)
                    }}
                    className="btn btn-primary"
                  >
                    Spróbuj ponownie
                  </button>
                  <Link href="/cart" className="btn btn-secondary">
                    Powrót do koszyka
                  </Link>
                  <Link href="/products" className="btn btn-outline">
                    Kontynuuj zakupy
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Formularz checkout */}
          <div className="lg:col-span-2">
            <form onSubmit={handleProceedToPayment} className="space-y-8">
              {/* Dane osobowe */}
              <div className="card p-6">
                <h2 className="text-xl font-bold mb-6 flex items-center">
                  <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center mr-3 text-sm font-bold">1</div>
                  Dane osobowe
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Imię *
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      required
                      value={formData.customerInfo.firstName}
                      onChange={handleInputChange}
                      className={`input ${hasFieldError({ fieldErrors: validationErrors, errors: [], isValid: true }, 'firstName') ? 'border-red-500 focus:border-red-500' : ''}`}
                      placeholder="Wprowadź imię"
                      aria-invalid={hasFieldError({ fieldErrors: validationErrors, errors: [], isValid: true }, 'firstName')}
                      aria-describedby={hasErrors('firstName') ? 'firstName-error' : undefined}
                    />
                    {hasErrors('firstName') && (
                      <p id="firstName-error" className="mt-1 text-sm text-red-600">
                        {getFirstError('firstName')}
                      </p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nazwisko *
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      required
                      value={formData.customerInfo.lastName}
                      onChange={handleInputChange}
                      className={`input ${hasFieldError({ fieldErrors: validationErrors, errors: [], isValid: true }, 'lastName') ? 'border-red-500 focus:border-red-500' : ''}`}
                      placeholder="Wprowadź nazwisko"
                      aria-invalid={hasFieldError({ fieldErrors: validationErrors, errors: [], isValid: true }, 'lastName')}
                      aria-describedby={hasErrors('lastName') ? 'lastName-error' : undefined}
                    />
                    {hasErrors('lastName') && (
                      <p id="lastName-error" className="mt-1 text-sm text-red-600">
                        {getFirstError('lastName')}
                      </p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.customerInfo.email}
                      onChange={handleInputChange}
                      className={`input ${hasFieldError({ fieldErrors: validationErrors, errors: [], isValid: true }, 'email') ? 'border-red-500 focus:border-red-500' : ''}`}
                      placeholder="twoj@email.com"
                      aria-invalid={hasFieldError({ fieldErrors: validationErrors, errors: [], isValid: true }, 'email')}
                      aria-describedby={hasErrors('email') ? 'email-error' : undefined}
                    />
                    {hasErrors('email') && (
                      <p id="email-error" className="mt-1 text-sm text-red-600">
                        {getFirstError('email')}
                      </p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Telefon *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      value={formData.customerInfo.phone}
                      onChange={handlePhoneChange}
                      className={`input ${hasFieldError({ fieldErrors: validationErrors, errors: [], isValid: true }, 'phone') ? 'border-red-500 focus:border-red-500' : ''}`}
                      placeholder="+48 123 456 789"
                      aria-invalid={hasFieldError({ fieldErrors: validationErrors, errors: [], isValid: true }, 'phone')}
                      aria-describedby={hasErrors('phone') ? 'phone-error' : undefined}
                    />
                    {hasErrors('phone') && (
                      <p id="phone-error" className="mt-1 text-sm text-red-600">
                        {getFirstError('phone')}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Adres dostawy */}
              <div className="card p-6">
                <h2 className="text-xl font-bold mb-6 flex items-center">
                  <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center mr-3 text-sm font-bold">2</div>
                  Adres dostawy
                </h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Adres *
                    </label>
                    <input
                      type="text"
                      name="address"
                      required
                      value={formData.shippingAddress.address}
                      onChange={handleInputChange}
                      className={`input ${hasFieldError({ fieldErrors: validationErrors, errors: [], isValid: true }, 'address') ? 'border-red-500 focus:border-red-500' : ''}`}
                      placeholder="ul. Przykładowa 123"
                      aria-invalid={hasFieldError({ fieldErrors: validationErrors, errors: [], isValid: true }, 'address')}
                      aria-describedby={hasErrors('address') ? 'address-error' : undefined}
                    />
                    {hasErrors('address') && (
                      <p id="address-error" className="mt-1 text-sm text-red-600">
                        {getFirstError('address')}
                      </p>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Miasto *
                      </label>
                      <input
                        type="text"
                        name="city"
                        required
                        value={formData.shippingAddress.city}
                        onChange={handleInputChange}
                        className={`input ${hasFieldError({ fieldErrors: validationErrors, errors: [], isValid: true }, 'city') ? 'border-red-500 focus:border-red-500' : ''}`}
                        placeholder="Warszawa"
                        aria-invalid={hasFieldError({ fieldErrors: validationErrors, errors: [], isValid: true }, 'city')}
                        aria-describedby={hasErrors('city') ? 'city-error' : undefined}
                      />
                      {hasErrors('city') && (
                        <p id="city-error" className="mt-1 text-sm text-red-600">
                          {getFirstError('city')}
                        </p>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Kod pocztowy *
                      </label>
                      <input
                        type="text"
                        name="postalCode"
                        required
                        value={formData.shippingAddress.postalCode}
                        onChange={handlePostalCodeChange}
                        className={`input ${hasFieldError({ fieldErrors: validationErrors, errors: [], isValid: true }, 'postalCode') ? 'border-red-500 focus:border-red-500' : ''}`}
                        placeholder="00-001"
                        aria-invalid={hasFieldError({ fieldErrors: validationErrors, errors: [], isValid: true }, 'postalCode')}
                        aria-describedby={hasErrors('postalCode') ? 'postalCode-error' : undefined}
                      />
                      {hasErrors('postalCode') && (
                        <p id="postalCode-error" className="mt-1 text-sm text-red-600">
                          {getFirstError('postalCode')}
                        </p>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Kraj *
                      </label>
                      <select
                        name="country"
                        value={formData.shippingAddress.country}
                        onChange={handleInputChange}
                        className={`input ${hasFieldError({ fieldErrors: validationErrors, errors: [], isValid: true }, 'country') ? 'border-red-500 focus:border-red-500' : ''}`}
                        aria-invalid={hasFieldError({ fieldErrors: validationErrors, errors: [], isValid: true }, 'country')}
                        aria-describedby={hasErrors('country') ? 'country-error' : undefined}
                      >
                        <option value="Polska">Polska</option>
                        <option value="Niemcy">Niemcy</option>
                        <option value="Czechy">Czechy</option>
                        <option value="Słowacja">Słowacja</option>
                      </select>
                      {hasErrors('country') && (
                        <p id="country-error" className="mt-1 text-sm text-red-600">
                          {getFirstError('country')}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Metoda dostawy */}
              <div className="card p-6">
                <h2 className="text-xl font-bold mb-6 flex items-center">
                  <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center mr-3 text-sm font-bold">3</div>
                  Metoda dostawy
                </h2>
                
                <div className="space-y-3">
                  {SHIPPING_OPTIONS.map((option) => {
                    const isSelected = formData.deliveryMethod === option.id
                    const shippingCost = summary.subtotal >= 2000 && option.id === 'standard' ? 0 : option.price
                    
                    return (
                      <label 
                        key={option.id}
                        className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-colors ${
                          isSelected 
                            ? 'border-blue-500 bg-blue-50' 
                            : 'border-gray-200 hover:border-blue-300'
                        }`}
                      >
                        <input
                          type="radio"
                          name="deliveryMethod"
                          value={option.id}
                          checked={isSelected}
                          onChange={handleInputChange}
                          className="mr-4"
                        />
                        <TruckIcon className={`w-6 h-6 mr-3 ${
                          option.id === 'express' ? 'text-orange-500' : 'text-blue-500'
                        }`} />
                        <div className="flex-1">
                          <div className="font-medium">{option.name}</div>
                          <div className="text-sm text-gray-600">{option.description}</div>
                        </div>
                        <div className={`font-bold ${
                          option.id === 'express' ? 'text-orange-600' : 'text-blue-600'
                        }`}>
                          {shippingCost === 0 ? 'Darmowa' : formatPrice(shippingCost)}
                        </div>
                      </label>
                    )
                  })}
                </div>
                
                {/* Free shipping info */}
                {summary.subtotal < 2000 && (
                  <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-800">
                      💡 Dodaj produkty za {formatPrice(2000 - summary.subtotal)}, aby otrzymać darmową dostawę standardową!
                    </p>
                  </div>
                )}
              </div>

              {/* Płatność - Stripe Info */}
              <div className="card p-6">
                <h2 className="text-xl font-bold mb-6 flex items-center">
                  <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center mr-3 text-sm font-bold">4</div>
                  Płatność
                </h2>
                
                <div className="space-y-4">
                  <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                    <CreditCardIcon className="w-8 h-8 text-blue-500 mr-4" />
                    <div>
                      <h3 className="font-medium text-gray-900">Bezpieczne płatności przez Stripe</h3>
                      <p className="text-sm text-gray-600 mt-1">
                        Dane karty będą wprowadzone na bezpiecznej stronie Stripe
                      </p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="flex items-center justify-center p-3 bg-white border rounded-lg">
                      <span className="text-sm font-medium text-gray-700">Visa</span>
                    </div>
                    <div className="flex items-center justify-center p-3 bg-white border rounded-lg">
                      <span className="text-sm font-medium text-gray-700">Mastercard</span>
                    </div>
                    <div className="flex items-center justify-center p-3 bg-white border rounded-lg">
                      <span className="text-sm font-medium text-gray-700">BLIK</span>
                    </div>
                    <div className="flex items-center justify-center p-3 bg-white border rounded-lg">
                      <span className="text-sm font-medium text-gray-700">P24</span>
                    </div>
                  </div>
                  
                  <div className="text-xs text-gray-500 text-center">
                    Płatność będzie przetworzona przez Stripe. Twoje dane karty są w pełni zabezpieczone.
                  </div>
                </div>
              </div>

              {/* Zgody */}
              <div className="card p-6">
                <div className="space-y-4">
                  <label className="flex items-start">
                    <input
                      type="checkbox"
                      name="terms"
                      checked={formData.terms}
                      onChange={handleInputChange}
                      required
                      className="mt-1 mr-3"
                    />
                    <span className="text-sm text-gray-700">
                      Akceptuję <Link href="/terms" className="text-blue-600 hover:underline">regulamin sklepu</Link> i <Link href="/privacy" className="text-blue-600 hover:underline">politykę prywatności</Link> *
                    </span>
                  </label>
                  
                  <label className="flex items-start">
                    <input
                      type="checkbox"
                      name="newsletter"
                      checked={formData.newsletter}
                      onChange={handleInputChange}
                      className="mt-1 mr-3"
                    />
                    <span className="text-sm text-gray-700">
                      Chcę otrzymywać newsletter z informacjami o nowych produktach i promocjach
                    </span>
                  </label>
                </div>
              </div>

              {/* Error Display */}
              {error && (
                <div className="card p-6 bg-red-50 border-red-200">
                  <div className="flex items-center text-red-800">
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    <span className="font-medium">Błąd</span>
                  </div>
                  <p className="text-red-700 mt-2">{error}</p>
                </div>
              )}

              {/* Przycisk płatności */}
              <div className="card p-6">
                <button
                  onClick={handleProceedToPayment}
                  disabled={!formData.terms || isLoading || (hasAttemptedSubmit && !isFormValid)}
                  className="btn btn-primary w-full text-lg py-4 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-2"></div>
                      Przekierowywanie do płatności...
                    </>
                  ) : (
                    <>
                      <CreditCardIcon className="w-6 h-6 mr-2" />
                      Przejdź do płatności ({formatPrice(summary.total)})
                    </>
                  )}
                </button>
                
                {hasAttemptedSubmit && !isFormValid && (
                  <p className="text-sm text-red-600 text-center mt-2">
                    Proszę poprawić błędy w formularzu przed kontynuowaniem
                  </p>
                )}
                
                <p className="text-xs text-gray-500 text-center mt-3">
                  Zostaniesz przekierowany na bezpieczną stronę płatności Stripe
                </p>
              </div>
            </form>
          </div>

          {/* Podsumowanie zamówienia */}
          <div className="lg:col-span-1">
            <div className="card p-6 sticky top-8">
              <h2 className="text-xl font-bold mb-6">Podsumowanie zamówienia</h2>
              
              {/* Produkty */}
              <div className="space-y-4 mb-6">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex items-center">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mr-4">
                      <span className="text-xl">{item.emoji || '📦'}</span>
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">{item.name}</div>
                      <div className="text-sm text-gray-600">
                        Ilość: {item.quantity}
                        {item.color && ` • Kolor: ${item.color}`}
                      </div>
                    </div>
                    <div className="font-bold">{formatPrice(item.price * item.quantity)}</div>
                  </div>
                ))}
              </div>
              
              {/* Koszty */}
              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between">
                  <span>Wartość produktów</span>
                  <span>{formatPrice(summary.subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Dostawa</span>
                  <span>{summary.shipping === 0 ? 'Darmowa' : formatPrice(summary.shipping)}</span>
                </div>
                <div className="flex justify-between">
                  <span>VAT (23%)</span>
                  <span>{formatPrice(summary.tax)}</span>
                </div>
                <div className="border-t pt-2 flex justify-between text-lg font-bold">
                  <span>Razem</span>
                  <span>{formatPrice(summary.total)}</span>
                </div>
              </div>
              
              {/* Liczba produktów */}
              <div className="mt-4 text-sm text-gray-600 text-center">
                {summary.itemCount} {summary.itemCount === 1 ? 'produkt' : 'produkty'} w koszyku
              </div>
              
              {/* Bezpieczeństwo */}
              <div className="mt-6 p-4 bg-green-50 rounded-lg">
                <div className="flex items-center text-green-800">
                  <ShieldCheckIcon className="w-5 h-5 mr-2" />
                  <span className="text-sm font-medium">Bezpieczne płatności przez Stripe</span>
                </div>
                <p className="text-xs text-green-700 mt-1">
                  Twoje dane są chronione szyfrowaniem SSL i standardami PCI DSS
                </p>
              </div>
              
              {/* Powrót do koszyka */}
              <div className="mt-4">
                <Link 
                  href="/cart" 
                  className="block text-center text-blue-600 hover:text-blue-800 text-sm"
                >
                  ← Powrót do koszyka
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Checkout() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Ładowanie formularza...</p>
        </div>
      </div>
    }>
      <CheckoutContent />
    </Suspense>
  )
}