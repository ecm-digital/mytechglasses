'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useCart } from '@/hooks/useCart'
import { ShoppingCartIcon, CheckIcon } from '@heroicons/react/24/outline'
import { productList } from '@/lib/products'

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
        color: 'Default',
        emoji: product.emoji
      })
      
      if (success) {
        setAddedItems(prev => new Set(prev).add(product.id))
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50 dark:from-neutral-900 dark:via-blue-950 dark:to-neutral-900">
      <div className="container py-28 md:py-32">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-heading mb-4">
            Nasze Produkty
          </h1>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Odkryj przyszłość z naszymi inteligentnymi okularami.
          </p>
        </div>
        
        <div className="space-y-12">
          {productList.map((product) => (
            <div key={product.id} className="max-w-6xl mx-auto">
              <div className="card overflow-hidden">
                <div className="grid md:grid-cols-2 gap-0">
                  <div className="relative bg-gradient-to-br from-gray-100 to-gray-200 dark:from-neutral-800 dark:to-neutral-700 p-8 flex items-center justify-center">
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="max-w-full h-auto rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  
                  <div className="p-8 md:p-12 flex flex-col justify-center">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">{product.name}</h2>
                    <p className="text-gray-600 dark:text-gray-400 text-lg mb-8">
                      {product.description}
                    </p>

                    <ul className="space-y-2 mb-8">
                      {product.features.slice(0, 3).map((feature, index) => (
                        <li key={index} className="flex items-center text-gray-700 dark:text-gray-300">
                          <svg className="w-5 h-5 mr-3 text-blue-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="mb-8 pb-8 border-b border-gray-200 dark:border-gray-700">
                      <div className="flex items-baseline gap-2 mb-2">
                        <span className="text-5xl font-bold text-blue-600">{product.price} zł</span>
                      </div>
                      <p className="text-sm text-gray-500">Darmowa dostawa • 30 dni na zwrot</p>
                    </div>

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
                            Dodano!
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
        </div>
      </div>
    </div>
  )
}
