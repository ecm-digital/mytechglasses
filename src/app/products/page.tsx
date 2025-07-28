'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useCart } from '@/hooks/useCart'
import { ShoppingCartIcon, CheckIcon } from '@heroicons/react/24/outline'

export default function Products() {
  const { addItem, isLoading } = useCart()
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
      name: 'Vision Pro',
      description: 'Flagowy model z zaawansowanymi funkcjami rozszerzonej rzeczywistości i najwyższą jakością obrazu.',
      shortDescription: 'Flagowy model z zaawansowanymi funkcjami AR',
      price: 2499,
      badge: 'Premium',
      badgeColor: 'bg-accent',
      emoji: '🥽',
      gradient: 'from-gray-100 to-gray-200',
      features: [
        'Wyświetlacz 4K z HDR',
        'Pole widzenia 120°',
        'Zaawansowane śledzenie ruchu',
        'Rozpoznawanie gestów',
        'Bateria do 8 godzin',
        'Wbudowane głośniki przestrzenne',
        'Asystent głosowy AI'
      ]
    },
    {
      id: 'tech-view',
      name: 'Tech View',
      description: 'Idealny balans między funkcjonalnością a ceną. Doskonały dla codziennego użytku.',
      shortDescription: 'Idealny balans funkcjonalności i ceny',
      price: 1899,
      badge: 'Popularne',
      badgeColor: 'bg-success',
      emoji: '👓',
      gradient: 'from-blue-100 to-blue-200',
      features: [
        'Wyświetlacz Full HD',
        'Pole widzenia 100°',
        'Podstawowe śledzenie ruchu',
        'Sterowanie dotykiem i głosem',
        'Bateria do 10 godzin',
        'Wbudowane głośniki stereo',
        'Kompatybilność z popularnymi aplikacjami'
      ]
    },
    {
      id: 'lite',
      name: 'Lite',
      description: 'Lekki i przystępny cenowo model dla osób rozpoczynających przygodę z inteligentnymi okularami.',
      shortDescription: 'Lekki model dla początkujących',
      price: 1299,
      badge: 'Najlepsza cena',
      badgeColor: 'bg-warning',
      emoji: '🕶️',
      gradient: 'from-green-100 to-green-200',
      features: [
        'Wyświetlacz HD',
        'Pole widzenia 90°',
        'Podstawowe funkcje AR',
        'Sterowanie przez aplikację mobilną',
        'Bateria do 12 godzin',
        'Lekka konstrukcja (tylko 45g)',
        'Idealne do codziennego użytku'
      ]
    }
  ]

  return (
    <div className="mobile-container md:container py-6 md:py-12">
      {/* Mobile-optimized header */}
      <div className="mb-6 md:mb-8">
        <h1 className="text-mobile-xl md:text-3xl lg:text-4xl font-bold font-heading mb-2">
          Nasze produkty
        </h1>
        <p className="text-mobile-sm md:text-base text-gray-600">
          Wybierz idealne okulary dla siebie z naszej kolekcji
        </p>
      </div>
      
      {/* Mobile-first single column layout */}
      <div className="space-y-4 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-6 md:space-y-0">
        {products.map((product) => (
          <div key={product.id} className="mobile-card md:card group touch-feedback">
            {/* Mobile-optimized product image */}
            <div className={`relative h-48 md:h-64 bg-gradient-to-br ${product.gradient}`}>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-4xl md:text-5xl mb-2">{product.emoji}</div>
                  <span className="text-mobile-lg md:text-xl font-medium text-primary">
                    {product.name}
                  </span>
                </div>
              </div>
              
              {/* Product badge */}
              <div className={`absolute top-3 right-3 ${product.badgeColor} text-white px-2 py-1 rounded-full text-xs font-medium`}>
                {product.badge}
              </div>
            </div>
            
            {/* Mobile-optimized content */}
            <div className="p-4 md:p-6">
              <h3 className="text-mobile-lg md:text-xl font-bold mb-2">{product.name}</h3>
              
              {/* Mobile description - shorter for better UX */}
              <p className="text-gray-600 text-mobile-sm md:text-base mb-4 md:hidden">
                {product.shortDescription}
              </p>
              <p className="text-gray-600 text-base mb-4 hidden md:block">
                {product.description}
              </p>
              
              {/* Key features - mobile optimized */}
              <ul className="mb-4 space-y-1">
                {product.features.slice(0, 3).map((feature, index) => (
                  <li key={index} className="flex items-center text-mobile-xs md:text-sm text-gray-600">
                    <svg className="h-3 w-3 md:h-4 md:w-4 mr-2 text-accent flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    {feature}
                  </li>
                ))}
                {product.features.length > 3 && (
                  <li className="text-mobile-xs md:text-sm text-gray-500 ml-5">
                    +{product.features.length - 3} więcej funkcji
                  </li>
                )}
              </ul>
              
              {/* Mobile-optimized price and CTA */}
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                <div className="flex items-center justify-between sm:block">
                  <span className="text-mobile-lg md:text-lg font-bold text-primary">
                    {product.price} zł
                  </span>
                  <span className="text-mobile-xs md:text-sm text-gray-500 sm:hidden">
                    Darmowa dostawa
                  </span>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-2">
                  <Link 
                    href={`/products/${product.id}`} 
                    className="btn btn-primary w-full sm:w-auto text-mobile-sm md:text-base"
                  >
                    Zobacz szczegóły
                  </Link>
                  <button 
                    onClick={() => handleAddToCart(product)}
                    disabled={loadingItems.has(product.id)}
                    className="btn btn-outline w-full sm:w-auto text-mobile-sm md:text-base disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    {loadingItems.has(product.id) ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                        Dodawanie...
                      </>
                    ) : addedItems.has(product.id) ? (
                      <>
                        <CheckIcon className="h-4 w-4 mr-2" />
                        Dodano!
                      </>
                    ) : (
                      <>
                        <ShoppingCartIcon className="h-4 w-4 mr-2" />
                        Dodaj do koszyka
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Mobile-friendly additional info */}
      <div className="mt-8 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-mobile-base md:text-lg font-bold mb-2">Dlaczego My Tech Glasses?</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-2xl mb-1">🚚</div>
            <p className="text-mobile-xs md:text-sm text-gray-600">Darmowa dostawa</p>
          </div>
          <div>
            <div className="text-2xl mb-1">🔒</div>
            <p className="text-mobile-xs md:text-sm text-gray-600">Bezpieczne płatności</p>
          </div>
          <div>
            <div className="text-2xl mb-1">↩️</div>
            <p className="text-mobile-xs md:text-sm text-gray-600">30 dni na zwrot</p>
          </div>
          <div>
            <div className="text-2xl mb-1">🛠️</div>
            <p className="text-mobile-xs md:text-sm text-gray-600">Wsparcie 24/7</p>
          </div>
        </div>
      </div>
    </div>
  )
}