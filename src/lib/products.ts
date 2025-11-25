// src/lib/products.ts

export const products = {
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
    },
    emoji: '🥽',
    imageUrl: 'https://placehold.co/600x400/png'
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
    },
    emoji: '👓',
    imageUrl: 'https://placehold.co/600x400/png'
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
    },
    emoji: '🕶️',
    imageUrl: 'https://placehold.co/600x400/png'
  }
};

export const productList = Object.values(products);
