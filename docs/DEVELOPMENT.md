# Przewodnik developera

## Architektura aplikacji

### Przegląd technologii

My Tech Glasses to nowoczesna aplikacja e-commerce zbudowana z wykorzystaniem następujących technologii:

- **Frontend Framework**: Next.js 14 z App Router
- **Język programowania**: TypeScript
- **Styling**: Tailwind CSS z custom design system
- **Ikony**: Heroicons, React Icons
- **Płatności**: Stripe
- **Deployment**: Vercel (konfiguracja w `vercel.json`)

### Struktura projektu

```
src/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Layout główny aplikacji
│   ├── page.tsx           # Strona główna
│   ├── globals.css        # Style globalne
│   ├── about/             # Strona "O nas"
│   ├── cart/              # Koszyk
│   ├── checkout/          # Proces płatności
│   ├── products/          # Katalog produktów
│   │   └── [id]/          # Dynamiczne strony produktów
│   ├── success/           # Strona potwierdzenia
│   └── api/               # API Routes
│       ├── create-checkout-session/
│       └── webhooks/
│           └── stripe/
├── components/            # Komponenty React
│   ├── layout/           # Komponenty layoutu
│   │   ├── Header.tsx    # Nawigacja główna
│   │   └── Footer.tsx    # Stopka
│   └── ui/               # Komponenty UI
└── lib/                  # Utilities i konfiguracja
    └── stripe.ts         # Konfiguracja Stripe
```

### Architektura komponentów

#### Layout System
- **RootLayout** (`src/app/layout.tsx`): Główny layout z Header i Footer
- **Header** (`src/components/layout/Header.tsx`): Responsywna nawigacja z glassmorphism
- **Footer** (`src/components/layout/Footer.tsx`): Stopka z linkami i informacjami kontaktowymi

#### Routing
Aplikacja wykorzystuje Next.js App Router z następującymi ścieżkami:
- `/` - Strona główna z hero section i produktami
- `/products` - Lista wszystkich produktów
- `/products/[id]` - Szczegóły produktu (vision-pro, tech-view, lite)
- `/cart` - Koszyk zakupowy
- `/checkout` - Proces płatności
- `/success` - Potwierdzenie zamówienia
- `/about` - Informacje o firmie

## Konwencje kodowania

### TypeScript

```typescript
// Używaj explicit types dla props komponentów
interface ProductCardProps {
  id: string
  name: string
  price: number
  description: string
}

// Używaj React.FC dla komponentów funkcyjnych
const ProductCard: React.FC<ProductCardProps> = ({ id, name, price, description }) => {
  return (
    <div className="card">
      {/* content */}
    </div>
  )
}
```

### Nazewnictwo

- **Komponenty**: PascalCase (`ProductCard`, `Header`)
- **Pliki komponentów**: PascalCase z rozszerzeniem `.tsx`
- **Hooks**: camelCase z prefiksem `use` (`useCart`, `useProducts`)
- **Utilities**: camelCase (`formatPrice`, `validateEmail`)
- **Stałe**: UPPER_SNAKE_CASE (`API_BASE_URL`, `PRODUCT_TYPES`)

### Struktura komponentów

```typescript
'use client' // Jeśli potrzebny client-side

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { SomeIcon } from '@heroicons/react/24/outline'

// Interfaces na górze
interface ComponentProps {
  // props definition
}

// Główny komponent
const ComponentName: React.FC<ComponentProps> = ({ prop1, prop2 }) => {
  // State hooks
  const [state, setState] = useState<Type>(initialValue)
  
  // Effect hooks
  useEffect(() => {
    // effect logic
  }, [dependencies])
  
  // Event handlers
  const handleClick = () => {
    // handler logic
  }
  
  // Render
  return (
    <div className="component-wrapper">
      {/* JSX content */}
    </div>
  )
}

export default ComponentName
```

## Wzorce projektowe

### Design System

Aplikacja wykorzystuje spójny design system oparty na Tailwind CSS:

#### Kolory
```css
/* Główne kolory */
primary: #3b82f6 (blue-500)
accent: #06b6d4 (cyan-500)
success: #10b981 (emerald-500)
warning: #f59e0b (amber-500)
error: #ef4444 (red-500)

/* Neutralne */
neutral-50 do neutral-950
```

#### Komponenty UI

**Buttons**:
```typescript
// Primary button
<button className="btn btn-primary">Primary Action</button>

// Secondary button
<button className="btn btn-secondary">Secondary Action</button>

// Outline button
<button className="btn btn-outline">Outline Action</button>

// Gradient button
<button className="btn btn-gradient">Gradient Action</button>
```

**Cards**:
```typescript
// Standard card
<div className="card">
  <div className="p-6">
    {/* content */}
  </div>
</div>

// Glass card
<div className="card-glass">
  {/* content */}
</div>
```

### Responsive Design

Aplikacja wykorzystuje mobile-first approach:

```typescript
// Mobile-first classes
<div className="text-mobile-base md:text-base lg:text-lg">
  Responsive text
</div>

// Container system
<div className="mobile-container md:container">
  {/* content */}
</div>

// Grid system
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {/* responsive grid */}
</div>
```

### State Management

Aplikacja używa React hooks do zarządzania stanem:

```typescript
// Local state
const [isOpen, setIsOpen] = useState(false)

// Complex state
const [cart, setCart] = useState<CartItem[]>([])

// Effect for side effects
useEffect(() => {
  // fetch data, subscriptions, etc.
}, [dependencies])
```

## Debugowanie i najlepsze praktyki

### Debugging

#### Console Logging
```typescript
// Development only logging
if (process.env.NODE_ENV === 'development') {
  console.log('Debug info:', data)
}
```

#### Error Boundaries
```typescript
// Wrap components that might throw errors
<ErrorBoundary fallback={<ErrorFallback />}>
  <ComponentThatMightFail />
</ErrorBoundary>
```

### Performance

#### Image Optimization
```typescript
import Image from 'next/image'

// Always use Next.js Image component
<Image
  src="/images/product.jpg"
  alt="Product description"
  width={400}
  height={300}
  className="rounded-lg"
/>
```

#### Code Splitting
```typescript
// Dynamic imports for heavy components
const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <div>Loading...</div>
})
```

### Accessibility

#### Semantic HTML
```typescript
// Use proper semantic elements
<nav aria-label="Main navigation">
  <ul>
    <li><Link href="/">Home</Link></li>
  </ul>
</nav>

<main>
  <h1>Page Title</h1>
  <section aria-labelledby="products-heading">
    <h2 id="products-heading">Products</h2>
  </section>
</main>
```

#### ARIA Labels
```typescript
// Provide accessible labels
<button 
  aria-label="Add to cart"
  onClick={handleAddToCart}
>
  <ShoppingCartIcon className="w-5 h-5" />
</button>
```

### Security

#### Environment Variables
```typescript
// Server-side only
const stripeSecretKey = process.env.STRIPE_SECRET_KEY

// Client-side (public)
const stripePublishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
```

#### Input Validation
```typescript
// Always validate user input
const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}
```

### Testing

#### Component Testing
```typescript
// Test component rendering
import { render, screen } from '@testing-library/react'
import ProductCard from './ProductCard'

test('renders product information', () => {
  render(
    <ProductCard 
      name="Vision Pro" 
      price={2499} 
      description="Premium glasses" 
    />
  )
  
  expect(screen.getByText('Vision Pro')).toBeInTheDocument()
  expect(screen.getByText('2499 zł')).toBeInTheDocument()
})
```

### Git Workflow

#### Commit Messages
```
feat: add product filtering functionality
fix: resolve mobile navigation issue
docs: update API documentation
style: improve button hover states
refactor: extract cart logic to custom hook
test: add unit tests for product validation
```

#### Branch Naming
```
feature/product-search
bugfix/mobile-menu-close
hotfix/payment-validation
docs/api-documentation
```

### Code Review Checklist

- [ ] Kod jest czytelny i dobrze skomentowany
- [ ] Komponenty są responsywne na wszystkich urządzeniach
- [ ] Accessibility guidelines są przestrzegane
- [ ] Performance jest zoptymalizowane
- [ ] Error handling jest implementowane
- [ ] TypeScript types są poprawne
- [ ] Tests pokrywają nową funkcjonalność
- [ ] Security best practices są zastosowane