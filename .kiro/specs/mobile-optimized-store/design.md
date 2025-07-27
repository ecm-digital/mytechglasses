# Design Document

## Overview

Mobilna wersja sklepu My Tech Glasses będzie zoptymalizowana pod urządzenia o szerokości ekranu 320px-768px. Projekt skupia się na prostocie, szybkości i intuicyjnej obsłudze dotykowej, zachowując wszystkie kluczowe funkcjonalności e-commerce.

## Architecture

### Mobile-First Approach
- **Breakpoints:** 320px (mobile), 768px (tablet), 1024px+ (desktop)
- **Touch-friendly:** Minimum 44px dla elementów interaktywnych
- **Performance:** Lazy loading, optimized images, minimal JavaScript

### Layout Structure
```
Mobile Layout:
├── Sticky Header (60px height)
│   ├── Hamburger Menu (44x44px)
│   ├── Logo (centered)
│   └── Cart Icon (44x44px)
├── Main Content
│   ├── Hero Section (mobile optimized)
│   ├── Product Grid (1 column)
│   └── Features (stacked)
└── Footer (simplified)
```

## Components and Interfaces

### Header Component (Mobile)
```typescript
interface MobileHeaderProps {
  isMenuOpen: boolean
  cartItemsCount: number
  onMenuToggle: () => void
}

// Features:
- Sticky positioning
- Hamburger menu animation
- Cart badge with count
- Touch-optimized buttons (44px min)
```

### Navigation Menu (Mobile)
```typescript
interface MobileMenuProps {
  isOpen: boolean
  onClose: () => void
  menuItems: MenuItem[]
}

// Features:
- Slide-in animation from left
- Overlay background
- Touch-friendly menu items
- Auto-close on route change
```

### Product Card (Mobile)
```typescript
interface MobileProductCardProps {
  product: Product
  onAddToCart: (productId: string) => void
}

// Layout:
- Full width cards
- Large product image (16:9 ratio)
- Clear typography hierarchy
- Prominent CTA button
```

### Cart Component (Mobile)
```typescript
interface MobileCartProps {
  items: CartItem[]
  onUpdateQuantity: (id: string, quantity: number) => void
  onRemoveItem: (id: string) => void
}

// Features:
- Swipe to delete functionality
- Large +/- buttons for quantity
- Clear pricing display
- Sticky checkout button
```

## Data Models

### Mobile-Optimized Product Structure
```typescript
interface MobileProduct {
  id: string
  name: string
  shortDescription: string  // Max 100 chars for mobile
  price: number
  image: {
    mobile: string         // Optimized for mobile (400x300)
    webp: string          // WebP format for better compression
    placeholder: string    // Base64 placeholder
  }
  features: string[]       // Max 3 key features for mobile
  inStock: boolean
}
```

### Touch Interaction Model
```typescript
interface TouchInteraction {
  element: HTMLElement
  minSize: number         // 44px minimum
  feedback: 'haptic' | 'visual' | 'both'
  debounce: number       // Prevent double-tap
}
```

## Error Handling

### Mobile-Specific Error States
- **Network errors:** Offline mode with cached content
- **Touch errors:** Visual feedback for failed interactions
- **Form errors:** Inline validation with clear messaging
- **Loading states:** Skeleton screens and progress indicators

### Performance Monitoring
- **Core Web Vitals:** LCP < 2.5s, FID < 100ms, CLS < 0.1
- **Bundle size:** < 200KB initial load
- **Image optimization:** WebP with fallbacks

## Testing Strategy

### Mobile Testing Approach
- **Device testing:** iPhone SE, iPhone 12, Samsung Galaxy S21
- **Browser testing:** Safari iOS, Chrome Android, Samsung Internet
- **Touch testing:** Tap targets, swipe gestures, scroll behavior
- **Performance testing:** 3G network simulation

### Responsive Testing
- **Viewport testing:** 320px to 768px width
- **Orientation testing:** Portrait and landscape modes
- **Accessibility testing:** Screen readers, keyboard navigation

## Implementation Details

### CSS Framework Optimization
```css
/* Mobile-first Tailwind classes */
.mobile-container {
  @apply px-4 mx-auto max-w-sm;
}

.mobile-button {
  @apply min-h-[44px] min-w-[44px] text-lg font-medium;
}

.mobile-card {
  @apply w-full bg-white rounded-lg shadow-sm mb-4;
}

.mobile-input {
  @apply h-12 px-4 text-base border-2 rounded-lg;
}
```

### Performance Optimizations
- **Image optimization:** Next.js Image component with responsive sizes
- **Code splitting:** Route-based splitting for smaller bundles
- **Lazy loading:** Intersection Observer for images and components
- **Caching:** Service Worker for offline functionality

### Touch Interactions
```typescript
// Touch-friendly button component
const TouchButton = ({ children, onClick, ...props }) => (
  <button
    className="min-h-[44px] min-w-[44px] active:scale-95 transition-transform"
    onClick={onClick}
    {...props}
  >
    {children}
  </button>
)
```

### Mobile Navigation Pattern
```typescript
// Hamburger menu with slide animation
const MobileMenu = ({ isOpen, onClose }) => (
  <div className={`
    fixed inset-0 z-50 transform transition-transform duration-300
    ${isOpen ? 'translate-x-0' : '-translate-x-full'}
  `}>
    <div className="bg-white w-80 h-full shadow-xl">
      {/* Menu content */}
    </div>
    <div 
      className="bg-black bg-opacity-50 flex-1"
      onClick={onClose}
    />
  </div>
)
```

### Mobile Cart Experience
- **Add to cart:** Toast notification with animation
- **Quantity controls:** Large +/- buttons with haptic feedback
- **Checkout flow:** Single-page with progressive disclosure
- **Payment:** Integration with mobile payment methods

### Key Mobile Features
1. **Sticky header** with essential navigation
2. **Hamburger menu** with smooth animations
3. **Touch-optimized buttons** (44px minimum)
4. **Swipe gestures** for cart management
5. **Progressive loading** with skeleton screens
6. **Offline support** with service worker
7. **Mobile payments** integration ready