'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { ChevronLeftIcon, ShoppingCartIcon } from '@heroicons/react/24/outline'

export default function ProductDetail() {
  const params = useParams()
  const productId = params.id as string
  
  const [selectedColor, setSelectedColor] = useState('black')
  const [quantity, setQuantity] = useState(1)
  
  // Dane produktów (w rzeczywistej aplikacji byłyby pobierane z API)
  const products = {
    'vision-pro': {
      name: 'Vision Pro',
      description: 'Flagowy model z zaawansowanymi funkcjami rozszerzonej rzeczywistości i najwyższą jakością obrazu.',
      longDescription: 'Vision Pro to najbardziej zaawansowany model w naszej ofercie, zaprojektowany dla profesjonalistów i entuzjastów technologii. Wyposażony w wyświetlacz 4K z HDR, zapewnia niezrównaną jakość obrazu i immersyjne doświadczenia AR/VR. Zaawansowane śledzenie ruchu i rozpoznawanie gestów pozwala na intuicyjną interakcję z wirtualnymi obiektami, a wbudowany asystent AI dostosowuje się do Twoich potrzeb, ucząc się Twoich preferencji.',
      price: 2499,
      colors: ['black', 'silver', 'gold'],
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
      name: 'Tech View',
      description: 'Idealny balans między funkcjonalnością a ceną. Doskonały dla codziennego użytku.',
      longDescription: 'Tech View to model zaprojektowany z myślą o codziennym użytku, oferujący doskonały balans między zaawansowanymi funkcjami a przystępną ceną. Wyświetlacz Full HD zapewnia wyraźny obraz, a pole widzenia 100° pozwala na komfortowe korzystanie z rozszerzonej rzeczywistości. Dzięki baterii działającej do 10 godzin, możesz korzystać z okularów przez cały dzień bez konieczności ładowania.',
      price: 1899,
      colors: ['black', 'blue', 'red'],
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
      name: 'Lite',
      description: 'Lekki i przystępny cenowo model dla osób rozpoczynających przygodę z inteligentnymi okularami.',
      longDescription: 'Lite to najlżejszy model w naszej ofercie, idealny dla osób rozpoczynających przygodę z inteligentnymi okularami. Mimo przystępnej ceny, oferuje wszystkie podstawowe funkcje AR, które można kontrolować za pomocą intuicyjnej aplikacji mobilnej. Dzięki baterii działającej do 12 godzin i lekkiej konstrukcji (tylko 45g), możesz nosić je przez cały dzień bez uczucia dyskomfortu.',
      price: 1299,
      colors: ['black', 'white'],
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
  
  const handleAddToCart = () => {
    alert(`Dodano do koszyka: ${product.name} (${selectedColor}) x ${quantity}`)
  }
  
  return (
    <div className="container mx-auto px-4 py-12">
      <Link href="/products" className="flex items-center text-accent mb-8">
        <ChevronLeftIcon className="h-5 w-5 mr-1" />
        Wróć do listy produktów
      </Link>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Product Image */}
        <div className="bg-gray-100 rounded-lg flex items-center justify-center h-96">
          <div className="text-2xl font-bold text-primary">{product.name} - {selectedColor}</div>
        </div>
        
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
            <span className="text-gray-600">(24 opinie)</span>
          </div>
          
          <p className="text-2xl font-bold text-primary mb-6">{product.price} zł</p>
          
          <p className="text-gray-600 mb-6">{product.longDescription}</p>
          
          {/* Color Selection */}
          <div className="mb-6">
            <h3 className="font-bold mb-2">Kolor:</h3>
            <div className="flex space-x-3">
              {product.colors.map((color) => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={`w-8 h-8 rounded-full border-2 ${
                    selectedColor === color ? 'border-accent' : 'border-transparent'
                  }`}
                  style={{ backgroundColor: color === 'silver' ? '#C0C0C0' : color }}
                  aria-label={color}
                />
              ))}
            </div>
          </div>
          
          {/* Quantity */}
          <div className="mb-6">
            <h3 className="font-bold mb-2">Ilość:</h3>
            <div className="flex items-center">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-8 h-8 border border-gray-300 flex items-center justify-center"
              >
                -
              </button>
              <span className="w-12 h-8 border-t border-b border-gray-300 flex items-center justify-center">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-8 h-8 border border-gray-300 flex items-center justify-center"
              >
                +
              </button>
            </div>
          </div>
          
          {/* Add to Cart */}
          <button
            onClick={handleAddToCart}
            className="btn btn-primary w-full flex items-center justify-center"
          >
            <ShoppingCartIcon className="h-5 w-5 mr-2" />
            Dodaj do koszyka
          </button>
        </div>
      </div>
      
      {/* Product Details Tabs */}
      <div className="mt-16">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            <a href="#features" className="border-b-2 border-accent text-accent px-4 py-2 font-medium">
              Funkcje
            </a>
            <a href="#specifications" className="border-b-2 border-transparent text-gray-500 hover:text-gray-700 px-4 py-2 font-medium">
              Specyfikacja
            </a>
            <a href="#reviews" className="border-b-2 border-transparent text-gray-500 hover:text-gray-700 px-4 py-2 font-medium">
              Opinie
            </a>
          </nav>
        </div>
        
        {/* Features */}
        <div id="features" className="py-8">
          <h2 className="text-2xl font-bold mb-6">Główne funkcje</h2>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {product.features.map((feature, index) => (
              <li key={index} className="flex items-center">
                <svg className="h-5 w-5 mr-3 text-accent" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                {feature}
              </li>
            ))}
          </ul>
        </div>
        
        {/* Specifications */}
        <div id="specifications" className="py-8 border-t border-gray-200">
          <h2 className="text-2xl font-bold mb-6">Specyfikacja techniczna</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.entries(product.specifications).map(([key, value]) => (
              <div key={key} className="border-b border-gray-200 pb-3">
                <div className="flex justify-between">
                  <span className="font-medium text-gray-600 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                  <span>{value}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Reviews */}
        <div id="reviews" className="py-8 border-t border-gray-200">
          <h2 className="text-2xl font-bold mb-6">Opinie klientów</h2>
          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <div className="flex items-center mb-4">
              <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center mr-4">
                <span className="text-primary font-bold">JK</span>
              </div>
              <div>
                <h4 className="font-bold">Jan Kowalski</h4>
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
            </div>
            <p className="text-gray-600">
              "Korzystam z tych okularów od miesiąca i jestem zachwycony. Jakość obrazu jest niesamowita, a funkcje rozszerzonej rzeczywistości zmieniły sposób, w jaki pracuję."
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center mb-4">
              <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center mr-4">
                <span className="text-primary font-bold">AN</span>
              </div>
              <div>
                <h4 className="font-bold">Anna Nowak</h4>
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill={i < 4 ? 'currentColor' : 'none'} stroke="currentColor">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
            </div>
            <p className="text-gray-600">
              "Świetny stosunek jakości do ceny, długi czas pracy na baterii i wygodne noszenie przez cały dzień. Jedynym minusem jest dla mnie ograniczona liczba kompatybilnych aplikacji."
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}