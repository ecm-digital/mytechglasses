'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useCart } from '@/hooks/useCart'
import { ShoppingCartIcon, CheckIcon } from '@heroicons/react/24/outline'

export default function Products() {
  const { addItem } = useCart()
  const [addedItems, setAddedItems] = useState<Set<string>>(new Set())
  const [loadingItems, setLoadingItems] = useState<Set<string>>(new Set())

  const handleAddToCart = async (product: any) => {
    setLoadingItems(prev => new Set(prev).add(product.id))
    
    try {
      const success = await addItem({
        productId: product.id,
        name: product.name,
        price: product.price,
        quantity: 1,
        color: 'Default', // Możesz dodać wybór koloru później
        emoji: product.emoji
      })
      
      if (success) {
        setAddedItems(prev => new Set(prev).add(product.id))
        // Usuń z listy dodanych po 2 sekundach
        setTimeout(() => {
          setAddedItems(prev => {
            const newSet = new Set(prev)
            newSet.delete(product.id)
            return newSet
          })
        }, 2000)
      }
    } catch (error) {
      console.error('Failed to add item to cart:', error)
    } finally {
      setLoadingItems(prev => {
        const newSet = new Set(prev)
        newSet.delete(product.id)
        return newSet
      })
    }
  }

  const products = [
    {
      id: 'vision-pro',
      name: 'AI Smart Glasses Pro',
      description: 'Inteligentne okulary z kamerą HD 1200P, asystentem AI ChatGPT i Deep Seek, oraz otwartymi słuchawkami. Idealne do vlogowania, podróży i codziennego użytku bez użycia rąk.',
      shortDescription: 'Inteligentne okulary z AI i kamerą 1200P',
      price: 599,
      badge: 'Bestseller',
      badgeColor: 'bg-blue-500',
      emoji: '🥽',
      gradient: 'from-blue-100 via-purple-100 to-pink-100',
      features: [
        'Kamera HD 1200P z technologią AI (800W)',
        'Stabilizacja obrazu przeciwwstrząsowa',
        'Redukcja szumów i HDR dla lepszych zdjęć',
        'Asystent AI ChatGPT i Deep Seek',
        'Szybka identyfikacja obiektów AI',
        'Tłumaczenie tekstów w czasie rzeczywistym',
        'Otwarte słuchawki z dźwiękiem przestrzennym',
        'Podwójne mikrofony z redukcją szumów ENC',
        'Sterowanie głosowe i dotykowe',
        'Bateria 270 mAh - 7h odtwarzania',
        'Wi-Fi i Bluetooth 5.4',
        'Automatyczna synchronizacja zdjęć i wideo',
        'Ładowanie w 150 minut'
      ]
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50 dark:from-neutral-900 dark:via-blue-950 dark:to-neutral-900">
      <div className="container py-12 md:py-20">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-heading mb-4">
            AI Smart Glasses Pro
          </h1>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Inteligentne okulary z kamerą 1200P, asystentem AI i otwartymi słuchawkami. Twój osobisty asystent zawsze pod ręką.
          </p>
        </div>
        
        {/* Main Product Card */}
        {products.map((product) => (
          <div key={product.id} className="max-w-6xl mx-auto mb-12">
            <div className="card overflow-hidden">
              <div className="grid md:grid-cols-2 gap-0">
                {/* Product Image */}
                <div className={`relative bg-gradient-to-br ${product.gradient} p-12 md:p-16 flex items-center justify-center`}>
                  <div className="text-center">
                    <div className="text-9xl md:text-[12rem] mb-4 animate-float">{product.emoji}</div>
                    <div className={`inline-block ${product.badgeColor} text-white px-6 py-3 rounded-full text-sm font-bold shadow-lg`}>
                      {product.badge}
                    </div>
                  </div>
                </div>
                
                {/* Product Details */}
                <div className="p-8 md:p-12 flex flex-col justify-center">
                  <h2 className="text-3xl md:text-4xl font-bold mb-4">{product.name}</h2>
                  <p className="text-gray-600 dark:text-gray-400 text-lg mb-8">
                    {product.description}
                  </p>
                  
                  {/* Features Grid */}
                  <div className="grid grid-cols-1 gap-3 mb-8">
                    {product.features.map((feature, index) => (
                      <div key={index} className="flex items-center text-gray-700 dark:text-gray-300">
                        <svg className="w-6 h-6 mr-3 text-blue-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                  
                  {/* Price */}
                  <div className="mb-8 pb-8 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-baseline gap-2 mb-2">
                      <span className="text-5xl font-bold text-blue-600">{product.price} zł</span>
                    </div>
                    <p className="text-sm text-gray-500">Darmowa dostawa • 30 dni na zwrot</p>
                  </div>
                  
                  {/* CTA Buttons */}
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Link 
                      href={`/products/${product.id}`} 
                      className="btn btn-primary text-lg py-4 flex-1 group"
                    >
                      <span>Zobacz szczegóły</span>
                      <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </Link>
                    <button 
                      onClick={() => handleAddToCart(product)}
                      disabled={loadingItems.has(product.id)}
                      className="btn btn-outline text-lg py-4 flex-1 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                      {loadingItems.has(product.id) ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-current mr-2"></div>
                          Dodawanie...
                        </>
                      ) : addedItems.has(product.id) ? (
                        <>
                          <CheckIcon className="h-5 w-5 mr-2" />
                          Dodano do koszyka!
                        </>
                      ) : (
                        <>
                          <ShoppingCartIcon className="h-5 w-5 mr-2" />
                          Dodaj do koszyka
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Detailed Features Section */}
        <div className="max-w-6xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Szczegółowe funkcje</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Feature Card 1 */}
            <div className="card p-8 hover-lift">
              <div className="flex items-start gap-4">
                <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl w-16 h-16 flex items-center justify-center flex-shrink-0">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Kamera HD 1200P z AI</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-3">
                    Profesjonalna kamera o mocy 800W z rozdzielczością 1200P, technologią przeciwwstrząsową i HDR.
                  </p>
                  <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                    <li className="flex items-center">
                      <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></span>
                      Redukcja szumów wielu ramek
                    </li>
                    <li className="flex items-center">
                      <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></span>
                      Piękne efekty tła
                    </li>
                    <li className="flex items-center">
                      <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></span>
                      Idealne do vlogowania i podróży
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Feature Card 2 */}
            <div className="card p-8 hover-lift">
              <div className="flex items-start gap-4">
                <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl w-16 h-16 flex items-center justify-center flex-shrink-0">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Asystent AI</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-3">
                    Zintegrowany ChatGPT i Deep Seek dla inteligentnych odpowiedzi bez wyciągania telefonu.
                  </p>
                  <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                    <li className="flex items-center">
                      <span className="w-1.5 h-1.5 bg-purple-500 rounded-full mr-2"></span>
                      Identyfikacja obiektów jednym kliknięciem
                    </li>
                    <li className="flex items-center">
                      <span className="w-1.5 h-1.5 bg-purple-500 rounded-full mr-2"></span>
                      Tłumaczenie tekstów w czasie rzeczywistym
                    </li>
                    <li className="flex items-center">
                      <span className="w-1.5 h-1.5 bg-purple-500 rounded-full mr-2"></span>
                      Natychmiastowe odpowiedzi głosowe
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Feature Card 3 */}
            <div className="card p-8 hover-lift">
              <div className="flex items-start gap-4">
                <div className="bg-gradient-to-br from-pink-500 to-orange-600 rounded-xl w-16 h-16 flex items-center justify-center flex-shrink-0">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Otwarte słuchawki</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-3">
                    Wysokiej jakości dźwięk z otwartym designem - słuchaj muzyki zachowując świadomość otoczenia.
                  </p>
                  <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                    <li className="flex items-center">
                      <span className="w-1.5 h-1.5 bg-pink-500 rounded-full mr-2"></span>
                      Podwójne mikrofony z ENC
                    </li>
                    <li className="flex items-center">
                      <span className="w-1.5 h-1.5 bg-pink-500 rounded-full mr-2"></span>
                      Doskonała klarowność rozmów
                    </li>
                    <li className="flex items-center">
                      <span className="w-1.5 h-1.5 bg-pink-500 rounded-full mr-2"></span>
                      Bezpieczne podczas jazdy i wędrówek
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Feature Card 4 */}
            <div className="card p-8 hover-lift">
              <div className="flex items-start gap-4">
                <div className="bg-gradient-to-br from-green-500 to-teal-600 rounded-xl w-16 h-16 flex items-center justify-center flex-shrink-0">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Długi czas pracy</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-3">
                    Bateria 270 mAh zapewnia pełny dzień użytkowania z automatyczną synchronizacją.
                  </p>
                  <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                    <li className="flex items-center">
                      <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></span>
                      7h odtwarzania muzyki
                    </li>
                    <li className="flex items-center">
                      <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></span>
                      2h nagrywania wideo
                    </li>
                    <li className="flex items-center">
                      <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></span>
                      Ładowanie w 150 minut
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Benefits Section */}
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="card p-6 text-center hover-lift">
              <div className="text-4xl mb-3">🚚</div>
              <h3 className="font-bold mb-2">Darmowa dostawa</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Na terenie całej Polski</p>
            </div>
            <div className="card p-6 text-center hover-lift">
              <div className="text-4xl mb-3">🔒</div>
              <h3 className="font-bold mb-2">Bezpieczne płatności</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Szyfrowane transakcje</p>
            </div>
            <div className="card p-6 text-center hover-lift">
              <div className="text-4xl mb-3">↩️</div>
              <h3 className="font-bold mb-2">30 dni na zwrot</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Bez podania przyczyny</p>
            </div>
            <div className="card p-6 text-center hover-lift">
              <div className="text-4xl mb-3">🛠️</div>
              <h3 className="font-bold mb-2">Wsparcie 24/7</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Zawsze do dyspozycji</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}