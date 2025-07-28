# Dokumentacja komponentów

## Przegląd komponentów

My Tech Glasses wykorzystuje modularną architekturę komponentów opartą na React i Next.js. Wszystkie komponenty są napisane w TypeScript i wykorzystują Tailwind CSS do stylowania.

## Komponenty Layout

### Header (`src/components/layout/Header.tsx`)

Główny komponent nawigacji z responsywnym designem i efektem glassmorphism.

#### Funkcjonalności:
- **Responsywna nawigacja**: Automatyczne przełączanie między desktop i mobile menu
- **Glassmorphism effect**: Dynamiczne tło z blur effect przy scrollowaniu
- **Mobile menu**: Wysuwane menu boczne z animacjami
- **Cart indicator**: Licznik produktów w koszyku z animacją
- **Scroll detection**: Zmiana stylu header przy scrollowaniu

#### Props:
Komponent nie przyjmuje props - korzysta z wewnętrznego stanu.

#### Stan wewnętrzny:
```typescript
const [isMenuOpen, setIsMenuOpen] = useState(false)
const [isScrolled, setIsScrolled] = useState(false)
const cartItemsCount = 0 // Placeholder dla stanu koszyka
```

#### Przykład użycia:
```typescript
import Header from '@/components/layout/Header'

// W layout.tsx
<Header />
```

#### Kluczowe funkcje:
- `toggleMenu()`: Otwiera/zamyka mobile menu
- `closeMenu()`: Zamyka mobile menu
- `handleScroll()`: Obsługuje efekt glassmorphism przy scrollowaniu

### Footer (`src/components/layout/Footer.tsx`)

Stopka aplikacji z informacjami o firmie, linkami i danymi kontaktowymi.

#### Funkcjonalności:
- **Responsive grid**: 4-kolumnowy layout na desktop, 1-kolumnowy na mobile
- **Social media links**: Linki do mediów społecznościowych
- **Navigation links**: Szybkie linki do głównych sekcji
- **Contact information**: Dane kontaktowe firmy
- **Copyright**: Automatycznie aktualizowany rok

#### Sekcje:
1. **Company Info**: Logo, opis, social media
2. **Quick Links**: Produkty, O nas, Kontakt, FAQ
3. **Legal**: Regulamin, Polityka prywatności, Zwroty, Dostawa
4. **Contact**: Adres, email, telefon

#### Przykład użycia:
```typescript
import Footer from '@/components/layout/Footer'

// W layout.tsx
<Footer />
```

## Strony aplikacji

### Strona główna (`src/app/page.tsx`)

Główna strona landing page z hero section i prezentacją produktów.

#### Sekcje:
1. **Hero Section**: 
   - Gradient background z animacjami
   - Floating elements
   - CTA button
   - Product preview cards

2. **Products Section**:
   - Mobile-first design
   - 3 główne produkty (Vision Pro, Tech View, Lite)
   - Responsive grid layout

3. **Features Section**:
   - 4 główne zalety produktów
   - Ikony SVG z animacjami

4. **Testimonials Section**:
   - Opinie klientów z ocenami
   - Avatar placeholders

5. **CTA Section**:
   - Finalne wezwanie do działania

#### Kluczowe funkcjonalności:
- **Responsive design**: Mobile-first approach
- **Animations**: CSS animations i transitions
- **Glassmorphism**: Nowoczesne efekty wizualne
- **Touch-friendly**: Optymalizacja dla urządzeń dotykowych

### Strona produktów (`src/app/products/page.tsx`)

Lista wszystkich dostępnych produktów z filtrowaniem i szczegółami.

#### Funkcjonalności:
- **Product grid**: Responsywny grid produktów
- **Product cards**: Karty z informacjami o produktach
- **Mobile optimization**: Specjalne klasy dla mobile
- **Trust signals**: Sekcja z zaletami sklepu

#### Struktura produktu:
```typescript
interface Product {
  id: string
  name: string
  description: string
  shortDescription: string
  price: number
  badge: string
  badgeColor: string
  emoji: string
  gradient: string
  features: string[]
}
```

#### Przykład użycia:
```typescript
// Automatycznie renderowana przez Next.js router
// Dostępna pod ścieżką /products
```

### Szczegóły produktu (`src/app/products/[id]/page.tsx`)

Dynamiczna strona szczegółów produktu z pełną specyfikacją.

#### Funkcjonalności:
- **Dynamic routing**: Parametr `[id]` z URL
- **Product details**: Pełne informacje o produkcie
- **Color selection**: Wybór koloru produktu
- **Quantity selector**: Wybór ilości
- **Add to cart**: Dodawanie do koszyka
- **Tabs interface**: Funkcje, Specyfikacja, Opinie

#### Stan komponentu:
```typescript
const [selectedColor, setSelectedColor] = useState('black')
const [quantity, setQuantity] = useState(1)
```

#### Sekcje:
1. **Product Image**: Placeholder dla zdjęcia produktu
2. **Product Info**: Nazwa, cena, opis, opcje
3. **Features Tab**: Lista głównych funkcji
4. **Specifications Tab**: Szczegółowa specyfikacja techniczna
5. **Reviews Tab**: Opinie klientów

### Koszyk (`src/app/cart/page.tsx`)

Strona koszyka zakupowego z integracją Stripe.

#### Funkcjonalności:
- **Cart management**: Dodawanie, usuwanie, aktualizacja ilości
- **Price calculation**: Automatyczne obliczanie sum
- **Stripe integration**: Integracja z systemem płatności
- **Responsive design**: Mobile-first approach
- **Empty state**: Obsługa pustego koszyka

#### Stan komponentu:
```typescript
interface CartItem {
  id: number
  productId: string
  name: string
  color: string
  price: number
  quantity: number
  emoji: string
}

const [cartItems, setCartItems] = useState<CartItem[]>([])
const [isLoading, setIsLoading] = useState(false)
```

#### Kluczowe funkcje:
- `updateQuantity(id, newQuantity)`: Aktualizacja ilości produktu
- `removeItem(id)`: Usuwanie produktu z koszyka
- `handleStripeCheckout()`: Inicjalizacja płatności Stripe

#### Sekcje:
1. **Cart Items**: Lista produktów w koszyku
2. **Order Summary**: Podsumowanie zamówienia
3. **Checkout Buttons**: Stripe i tradycyjny checkout
4. **Trust Signals**: Informacje o bezpieczeństwie

## System stylowania

### Tailwind CSS Classes

#### Komponenty UI:
```css
/* Buttons */
.btn - bazowa klasa button
.btn-primary - główny przycisk
.btn-secondary - drugorzędny przycisk
.btn-outline - przycisk z obramowaniem
.btn-gradient - przycisk z gradientem

/* Cards */
.card - standardowa karta
.card-glass - karta z efektem glass
.mobile-card - karta zoptymalizowana na mobile

/* Containers */
.container - główny kontener
.mobile-container - kontener mobile-first
```

#### Responsive Design:
```css
/* Mobile-first typography */
.text-mobile-xs - 12px na mobile
.text-mobile-sm - 14px na mobile
.text-mobile-base - 16px na mobile
.text-mobile-lg - 18px na mobile
.text-mobile-xl - 20px na mobile

/* Touch-friendly sizes */
.min-h-touch - minimalna wysokość 44px
.min-w-touch - minimalna szerokość 44px
.touch-feedback - efekt dotknięcia
```

### Animacje i efekty:

```css
/* Animations */
.animate-fade-in - animacja pojawiania się
.animate-slide-up - animacja wsuwania z dołu
.animate-float - animacja unoszenia
.hover-lift - efekt podnoszenia przy hover
.hover-glow - efekt świecenia przy hover

/* Glass effects */
.glass - efekt glassmorphism
.glass-dark - ciemny efekt glassmorphism
```

## Wzorce komponentów

### Struktura komponentu:

```typescript
'use client' // Jeśli potrzebny client-side

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { IconName } from '@heroicons/react/24/outline'

interface ComponentProps {
  // definicja props
}

const ComponentName: React.FC<ComponentProps> = ({ props }) => {
  // State hooks
  const [state, setState] = useState(initialValue)
  
  // Effect hooks
  useEffect(() => {
    // logika efektów
  }, [dependencies])
  
  // Event handlers
  const handleEvent = () => {
    // obsługa zdarzeń
  }
  
  return (
    <div className="component-wrapper">
      {/* JSX content */}
    </div>
  )
}

export default ComponentName
```

### Responsive Design Pattern:

```typescript
// Mobile-first approach
<div className="mobile-container md:container">
  <h1 className="text-mobile-xl md:text-3xl lg:text-4xl">
    Responsive Heading
  </h1>
  
  <div className="space-y-4 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-6 md:space-y-0">
    {/* Mobile: vertical stack, Desktop: grid */}
  </div>
</div>
```

### State Management Pattern:

```typescript
// Local state dla prostych komponentów
const [isOpen, setIsOpen] = useState(false)

// Complex state dla bardziej złożonych danych
const [items, setItems] = useState<Item[]>([])

// Effect dla side effects
useEffect(() => {
  // fetch data, subscriptions, cleanup
}, [dependencies])
```

## Accessibility

### ARIA Labels:
```typescript
<button 
  aria-label="Dodaj do koszyka"
  onClick={handleAddToCart}
>
  <ShoppingCartIcon className="w-5 h-5" />
</button>
```

### Semantic HTML:
```typescript
<nav aria-label="Główna nawigacja">
  <ul>
    <li><Link href="/">Strona główna</Link></li>
  </ul>
</nav>

<main>
  <h1>Tytuł strony</h1>
  <section aria-labelledby="products-heading">
    <h2 id="products-heading">Produkty</h2>
  </section>
</main>
```

### Touch-friendly Design:
```typescript
// Minimalne rozmiary dla elementów dotykowych
<button className="min-h-touch min-w-touch touch-feedback">
  Przycisk
</button>
```

## Performance

### Image Optimization:
```typescript
import Image from 'next/image'

<Image
  src="/images/product.jpg"
  alt="Opis produktu"
  width={400}
  height={300}
  className="rounded-lg"
/>
```

### Code Splitting:
```typescript
import dynamic from 'next/dynamic'

const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <div>Ładowanie...</div>
})
```

### Lazy Loading:
```typescript
// Automatyczne lazy loading dla Next.js Image
// Ręczne lazy loading dla komponentów
const LazyComponent = lazy(() => import('./Component'))
```