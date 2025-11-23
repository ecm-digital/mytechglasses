'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { ChevronLeftIcon, ShoppingCartIcon } from '@heroicons/react/24/outline'
import { useCart } from '@/hooks/useCart'
import ProductGallery from '@/components/product/ProductGallery'

export default function ProductDetail() {
  const params = useParams()
  const productId = params.id as string
  const { addItem } = useCart()

  const [selectedColor, setSelectedColor] = useState('black')
  const [quantity, setQuantity] = useState(1)
  const [isAdding, setIsAdding] = useState(false)

  // Dane produktów (w rzeczywistej aplikacji byłyby pobierane z API)
  const products = {
    'vision-pro': {
      id: 'vision-pro',
      name: 'Vision Pro',
      description: 'Flagowy model z zaawansowanymi funkcjami rozszerzonej rzeczywistości i najwyższą jakością obrazu.',
      longDescription: 'Vision Pro to najbardziej zaawansowany model w naszej ofercie, zaprojektowany dla profesjonalistów i entuzjastów technologii. Wyposażony w wyświetlacz 4K z HDR, zapewnia niezrównaną jakość obrazu i immersyjne doświadczenia AR/VR. Zaawansowane śledzenie ruchu i rozpoznawanie gestów pozwala na intuicyjną interakcję z wirtualnymi obiektami, a wbudowany asystent AI dostosowuje się do Twoich potrzeb, ucząc się Twoich preferencji.',
      price: 2499,
      colors: ['black', 'silver', 'gold'],
      images: [
        '/images/products/vision-pro-1.jpg',
        '/images/products/vision-pro-2.jpg',
        '/images/products/vision-pro-3.jpg',
        '/images/products/vision-pro-4.jpg',
      ],
      features: [
        'Wyświetlacz 4K z HDR',
        'Pole widzenia 120°',
        'Zaawansowane śledzenie ruchu',
        'Rozpoznawanie gestów',
        'Bateria do 8 godzin',
        'Wbudowane głośniki przestrzenne',
        'Asystent głosowy AI'
      ],
      specifications: {
        dimensions: '152 x 50 x 15 mm',
        weight: '75g',
        display: '4K Micro OLED z HDR',
        processor: 'MTG X1 Pro',
        memory: '8GB RAM',
        storage: '128GB',
        battery: 'Li-Po 3500mAh',
        connectivity: 'Wi-Fi 6, Bluetooth 5.2, 5G',
        sensors: 'Akcelerometr, żyroskop, magnetometr, czujnik zbliżeniowy, czujnik światła, kamera głębi'
      }
    },
    'tech-view': {
      id: 'tech-view',
      name: 'Tech View',
      description: 'Idealny balans między funkcjonalnością a ceną. Doskonały dla codziennego użytku.',
      longDescription: 'Tech View to model zaprojektowany z myślą o codziennym użytku, oferujący doskonały balans między zaawansowanymi funkcjami a przystępną ceną. Wyświetlacz Full HD zapewnia wyraźny obraz, a pole widzenia 100° pozwala na komfortowe korzystanie z rozszerzonej rzeczywistości. Dzięki baterii działającej do 10 godzin, możesz korzystać z okularów przez cały dzień bez konieczności ładowania.',
      price: 1899,
      colors: ['black', 'blue', 'red'],
      images: [
        '/images/products/tech-view-1.jpg',
        '/images/products/tech-view-2.jpg',
        '/images/products/tech-view-3.jpg',
        '/images/products/tech-view-4.jpg',
      ],
      features: [
        'Wyświetlacz Full HD',
        'Pole widzenia 100°',
        'Podstawowe śledzenie ruchu',
        'Sterowanie dotykiem i głosem',
        'Bateria do 10 godzin',
        'Wbudowane głośniki stereo',
        'Kompatybilność z popularnymi aplikacjami'
      ],
      specifications: {
        dimensions: '148 x 48 x 14 mm',
        weight: '65g',
        display: 'Full HD Micro OLED',
        processor: 'MTG X1',
        memory: '6GB RAM',
        storage: '64GB',
        battery: 'Li-Po 3200mAh',
        connectivity: 'Wi-Fi 6, Bluetooth 5.1',
        sensors: 'Akcelerometr, żyroskop, magnetometr, czujnik zbliżeniowy, czujnik światła'
      }
    },
    'lite': {
      id: 'lite',
      name: 'Lite',
      description: 'Lekki i przystępny cenowo model dla osób rozpoczynających przygodę z inteligentnymi okularami.',
      longDescription: 'Lite to najlżejszy model w naszej ofercie, idealny dla osób rozpoczynających przygodę z inteligentnymi okularami. Mimo przystępnej ceny, oferuje wszystkie podstawowe funkcje AR, które można kontrolować za pomocą intuicyjnej aplikacji mobilnej. Dzięki baterii działającej do 12 godzin i lekkiej konstrukcji (tylko 45g), możesz nosić je przez cały dzień bez uczucia dyskomfortu.',
      price: 1299,
      colors: ['black', 'white'],
      images: [
        '/images/products/lite-1.jpg',
        '/images/products/lite-2.jpg',
        '/images/products/lite-3.jpg',
        '/images/products/lite-4.jpg',
      ],
      features: [
        'Wyświetlacz HD',
        'Pole widzenia 90°',
        'Podstawowe funkcje AR',
        'Sterowanie przez aplikację mobilną',
        'Bateria do 12 godzin',
        'Lekka konstrukcja (tylko 45g)',
        'Idealne do codziennego użytku'
      ],
      specifications: {
        dimensions: '145 x 45 x 12 mm',
        weight: '45g',
        display: 'HD Micro OLED',
        processor: 'MTG A1',
        memory: '4GB RAM',
        storage: '32GB',
        battery: 'Li-Po 2800mAh',
        connectivity: 'Wi-Fi 5, Bluetooth 5.0',
        sensors: 'Akcelerometr, żyroskop, czujnik zbliżeniowy'
      }
    }
  }

  const product = products[productId as keyof typeof products]

  // Get related products (exclude current product)
  const relatedProducts = Object.values(products)
    .filter(p => p.id !== productId)
    .slice(0, 2)

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-3xl font-bold mb-4">Produkt nie znaleziony</h1>
        <p className="mb-8">Przepraszamy, ale produkt o podanym identyfikatorze nie istnieje.</p>
        <Link href="/products" className="btn btn-primary">
          Wróć do listy produktów
        </Link>
      </div>
    )
  }

  const handleAddToCart = async () => {
    setIsAdding(true)
    await addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity: quantity,
      color: selectedColor,
      emoji: product.id === 'vision-pro' ? '🥽' : product.id === 'tech-view' ? '👓' : '🕶️'
    })
    setIsAdding(false)
  }

  return (
    <div className="container mx-auto px-4 py-12 pb-32 md:pb-12">
      <Link href="/products" className="flex items-center text-accent mb-8 hover:underline">
        <ChevronLeftIcon className="h-5 w-5 mr-1" />
        Wróć do listy produktów
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Product Gallery */}
        <ProductGallery images={product.images} name={product.name} />

        {/* Product Info */}
        <div>
          <h1 className="text-3xl md:text-4xl font-bold font-heading mb-4">{product.name}</h1>
          <div className="flex items-center mb-4">
            <div className="flex text-yellow-400 mr-2">
              {[...Array(5)].map((_, i) => (
                <svg key={i} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="text-gray-600 dark:text-gray-400">(24 opinie)</span>
          </div>

          <p className="text-3xl font-bold text-primary-600 dark:text-primary-400 mb-6">{product.price} zł</p>

          <p className="text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">{product.longDescription}</p>

          {/* Color Selection */}
          <div className="mb-6">
            <h3 className="font-bold mb-3 text-gray-900 dark:text-white">Wybierz kolor: <span className="font-normal text-gray-500 capitalize">{selectedColor}</span></h3>
            <div className="flex space-x-3">
              {product.colors.map((color) => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={`
                    w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all
                    ${selectedColor === color
                      ? 'border-primary-500 scale-110 ring-2 ring-primary-500/30'
                      : 'border-transparent hover:scale-105'
                    }
                  `}
                  aria-label={`Select ${color} color`}
                >
                  <span
                    className="w-8 h-8 rounded-full border border-gray-200 dark:border-gray-700 shadow-sm"
                    style={{ backgroundColor: color === 'silver' ? '#C0C0C0' : color }}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Quantity */}
          <div className="mb-8">
            <h3 className="font-bold mb-3 text-gray-900 dark:text-white">Ilość:</h3>
            <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-xl w-max">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-12 h-12 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-l-xl transition-colors"
              >
                -
              </button>
              <span className="w-12 h-12 flex items-center justify-center font-medium text-lg">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-12 h-12 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-r-xl transition-colors"
              >
                +
              </button>
            </div>
          </div>

          {/* Add to Cart - Desktop */}
          <button
            onClick={handleAddToCart}
            disabled={isAdding}
            className="hidden md:flex btn btn-primary w-full items-center justify-center py-4 text-lg shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40 transform hover:-translate-y-0.5 transition-all"
          >
            {isAdding ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Dodawanie...
              </span>
            ) : (
              <>
                <ShoppingCartIcon className="h-6 w-6 mr-2" />
                Dodaj do koszyka
              </>
            )}
          </button>
        </div>
      </div>

      {/* Product Details Tabs */}
      <div className="mt-20">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex -mb-px space-x-8 overflow-x-auto">
            <a href="#features" className="border-b-2 border-primary-500 text-primary-600 dark:text-primary-400 px-1 py-4 font-medium text-lg whitespace-nowrap">
              Funkcje
            </a>
            <a href="#specifications" className="border-b-2 border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 px-1 py-4 font-medium text-lg whitespace-nowrap">
              Specyfikacja
            </a>
            <a href="#reviews" className="border-b-2 border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 px-1 py-4 font-medium text-lg whitespace-nowrap">
              Opinie (24)
            </a>
          </nav>
        </div>

        {/* Features */}
        <div id="features" className="py-12">
          <h2 className="text-2xl font-bold mb-8 text-gray-900 dark:text-white">Główne funkcje</h2>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {product.features.map((feature, index) => (
              <li key={index} className="flex items-center bg-gray-50 dark:bg-white/5 p-4 rounded-xl">
                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center mr-4 text-primary-600 dark:text-primary-400">
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-gray-700 dark:text-gray-300 font-medium">{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Specifications */}
        <div id="specifications" className="py-12 border-t border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold mb-8 text-gray-900 dark:text-white">Specyfikacja techniczna</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
            {Object.entries(product.specifications).map(([key, value]) => (
              <div key={key} className="flex justify-between py-3 border-b border-gray-100 dark:border-gray-800">
                <span className="font-medium text-gray-500 dark:text-gray-400 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                <span className="text-gray-900 dark:text-white font-medium text-right">{value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Reviews */}
        <div id="reviews" className="py-12 border-t border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold mb-8 text-gray-900 dark:text-white">Opinie klientów</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-neutral-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center mr-4 text-white font-bold shadow-md">
                  JK
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-white">Jan Kowalski</h4>
                  <div className="flex text-yellow-400 text-sm">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </div>
                <span className="ml-auto text-sm text-gray-400">2 dni temu</span>
              </div>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                "Korzystam z tych okularów od miesiąca i jestem zachwycony. Jakość obrazu jest niesamowita, a funkcje rozszerzonej rzeczywistości zmieniły sposób, w jaki pracuję."
              </p>
            </div>

            <div className="bg-white dark:bg-neutral-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center mr-4 text-white font-bold shadow-md">
                  AN
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-white">Anna Nowak</h4>
                  <div className="flex text-yellow-400 text-sm">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill={i < 4 ? 'currentColor' : 'none'} stroke="currentColor">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </div>
                <span className="ml-auto text-sm text-gray-400">Tydzień temu</span>
              </div>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                "Świetny stosunek jakości do ceny, długi czas pracy na baterii i wygodne noszenie przez cały dzień. Jedynym minusem jest dla mnie ograniczona liczba kompatybilnych aplikacji."
              </p>
            </div>
          </div>
        </div>

        {/* Related Products */}
        <div className="py-12 border-t border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold mb-8 text-gray-900 dark:text-white">Podobne produkty</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {relatedProducts.map((relatedProduct) => (
              <Link
                key={relatedProduct.id}
                href={`/products/${relatedProduct.id}`}
                className="group block bg-white dark:bg-neutral-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700"
              >
                <div className="flex h-full">
                  <div className="w-1/3 bg-gray-100 dark:bg-gray-700 flex items-center justify-center p-4">
                    <span className="text-4xl group-hover:scale-110 transition-transform duration-300">
                      {relatedProduct.id === 'vision-pro' ? '🥽' : relatedProduct.id === 'tech-view' ? '👓' : '🕶️'}
                    </span>
                  </div>
                  <div className="w-2/3 p-6 flex flex-col justify-center">
                    <h3 className="font-bold text-xl mb-2 text-gray-900 dark:text-white group-hover:text-primary-500 transition-colors">
                      {relatedProduct.name}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 line-clamp-2">
                      {relatedProduct.description}
                    </p>
                    <span className="font-bold text-primary-600 dark:text-primary-400">
                      {relatedProduct.price} zł
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile Sticky Add to Cart Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-neutral-900 border-t border-gray-200 dark:border-gray-800 p-4 md:hidden z-40 safe-bottom shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <p className="text-sm text-gray-500 dark:text-gray-400">{product.name}</p>
            <p className="font-bold text-lg text-gray-900 dark:text-white">{product.price} zł</p>
          </div>
          <button
            onClick={handleAddToCart}
            disabled={isAdding}
            className="btn btn-primary px-6 py-3 rounded-xl shadow-lg shadow-primary-500/25 flex items-center"
          >
            {isAdding ? (
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <>
                <ShoppingCartIcon className="h-5 w-5 mr-2" />
                Do koszyka
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}