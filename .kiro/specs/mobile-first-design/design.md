# Design Document

## Overview

Pierwszy design strony My Tech Glasses będzie nowoczesny, minimalistyczny i w pełni zoptymalizowany pod urządzenia mobilne. Design wykorzystuje najnowsze trendy w UI/UX, including glassmorphism, neumorphism, smooth animations i nowoczesną paletę kolorów.

## Architecture

### Design System
- **Primary Colors:** Deep Blue (#1e3a8a), Electric Blue (#3b82f6), Cyan (#06b6d4)
- **Accent Colors:** Purple (#8b5cf6), Pink (#ec4899), Orange (#f97316)
- **Neutrals:** White (#ffffff), Light Gray (#f8fafc), Dark Gray (#1e293b)
- **Gradients:** Linear gradients combining primary and accent colors

### Typography Scale
```css
/* Mobile-first typography */
--text-xs: 12px / 16px
--text-sm: 14px / 20px  
--text-base: 16px / 24px
--text-lg: 18px / 28px
--text-xl: 20px / 32px
--text-2xl: 24px / 36px
--text-3xl: 30px / 40px

/* Font weights */
--font-light: 300
--font-normal: 400
--font-medium: 500
--font-semibold: 600
--font-bold: 700
```

### Spacing System
```css
/* 8px base unit system */
--space-1: 4px
--space-2: 8px
--space-3: 12px
--space-4: 16px
--space-6: 24px
--space-8: 32px
--space-12: 48px
--space-16: 64px
```

## Components and Interfaces

### Modern Header Design
```typescript
interface ModernHeaderProps {
  isScrolled: boolean
  isDarkMode: boolean
  cartCount: number
}

// Features:
- Glassmorphism effect when scrolled
- Smooth color transitions
- Floating action buttons
- Micro-animations on interactions
```

### Hero Section Design
```css
.hero-modern {
  background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 50%, #06b6d4 100%);
  position: relative;
  overflow: hidden;
}

.hero-content {
  backdrop-filter: blur(10px);
  background: rgba(255, 255, 255, 0.1);
  border-radius: 24px;
  padding: 32px;
  margin: 16px;
}

.floating-elements {
  position: absolute;
  animation: float 6s ease-in-out infinite;
}
```

### Product Card Design
```typescript
interface ModernProductCardProps {
  product: Product
  variant: 'default' | 'featured' | 'compact'
  showAnimation: boolean
}

// Design features:
- Neumorphism shadows
- Gradient overlays
- Smooth hover transitions
- Loading skeleton animations
- Badge system with colors
```

### Navigation Menu Design
```css
.mobile-menu-modern {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 0 24px 24px 0;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
}

.menu-item {
  padding: 16px 24px;
  border-radius: 12px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.menu-item:hover {
  background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
  transform: translateX(8px);
}
```

## Data Models

### Design Token System
```typescript
interface DesignTokens {
  colors: {
    primary: {
      50: string   // Lightest
      500: string  // Base
      900: string  // Darkest
    }
    accent: {
      purple: string
      pink: string
      orange: string
    }
    gradients: {
      primary: string
      accent: string
      hero: string
    }
  }
  spacing: Record<string, string>
  typography: {
    fontFamily: {
      sans: string[]
      heading: string[]
    }
    fontSize: Record<string, [string, string]>
  }
  animation: {
    duration: Record<string, string>
    easing: Record<string, string>
  }
}
```

### Component Variants
```typescript
interface ComponentVariants {
  button: {
    primary: string
    secondary: string
    ghost: string
    gradient: string
  }
  card: {
    default: string
    elevated: string
    glass: string
    neumorphic: string
  }
  input: {
    default: string
    floating: string
    minimal: string
  }
}
```

## Error Handling

### Loading States Design
- **Skeleton screens:** Animated placeholders matching content structure
- **Progressive loading:** Content appears in waves with stagger animations
- **Error states:** Friendly illustrations with retry actions
- **Empty states:** Engaging graphics with clear CTAs

### Responsive Breakpoints
```css
/* Mobile-first breakpoints */
@media (min-width: 640px) { /* sm */ }
@media (min-width: 768px) { /* md */ }
@media (min-width: 1024px) { /* lg */ }
@media (min-width: 1280px) { /* xl */ }
```

## Testing Strategy

### Visual Testing
- **Cross-device testing:** iPhone SE to iPhone 14 Pro Max
- **Browser compatibility:** Safari, Chrome, Firefox mobile
- **Performance testing:** 60fps animations, smooth scrolling
- **Accessibility testing:** Color contrast, touch targets, screen readers

### Animation Performance
- **GPU acceleration:** transform and opacity properties
- **Reduced motion:** Respect user preferences
- **Battery optimization:** Pause animations when not visible

## Implementation Details

### Modern CSS Features
```css
/* CSS Custom Properties for theming */
:root {
  --primary-hue: 220;
  --primary-sat: 70%;
  --primary-light: 50%;
  
  --primary: hsl(var(--primary-hue), var(--primary-sat), var(--primary-light));
  --primary-light: hsl(var(--primary-hue), var(--primary-sat), 80%);
  --primary-dark: hsl(var(--primary-hue), var(--primary-sat), 30%);
}

/* Glassmorphism utility */
.glass {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

/* Neumorphism utility */
.neumorphic {
  background: #f0f0f0;
  box-shadow: 
    20px 20px 60px #d1d1d1,
    -20px -20px 60px #ffffff;
}

/* Smooth animations */
.animate-fade-in {
  animation: fadeIn 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.animate-slide-up {
  animation: slideUp 0.8s cubic-bezier(0.4, 0, 0.2, 1);
}

.animate-float {
  animation: float 6s ease-in-out infinite;
}
```

### JavaScript Animations
```typescript
// Intersection Observer for scroll animations
const observeElements = () => {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-fade-in')
        }
      })
    },
    { threshold: 0.1 }
  )
  
  document.querySelectorAll('.animate-on-scroll').forEach((el) => {
    observer.observe(el)
  })
}

// Touch feedback animations
const addTouchFeedback = (element: HTMLElement) => {
  element.addEventListener('touchstart', () => {
    element.style.transform = 'scale(0.95)'
  })
  
  element.addEventListener('touchend', () => {
    element.style.transform = 'scale(1)'
  })
}
```

### Dark Mode Implementation
```css
/* Dark mode color scheme */
[data-theme="dark"] {
  --bg-primary: #0f172a;
  --bg-secondary: #1e293b;
  --text-primary: #f8fafc;
  --text-secondary: #cbd5e1;
  
  --primary: #3b82f6;
  --accent: #8b5cf6;
}

/* Smooth theme transitions */
* {
  transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease;
}
```

### Performance Optimizations
- **CSS-in-JS:** Styled-components for dynamic theming
- **Critical CSS:** Inline critical styles for above-the-fold content
- **Image optimization:** WebP with fallbacks, lazy loading
- **Bundle splitting:** Separate CSS for different routes
- **Preload fonts:** Google Fonts with font-display: swap

### Key Design Features
1. **Glassmorphism effects** for modern transparency
2. **Gradient backgrounds** with smooth transitions
3. **Neumorphic elements** for tactile feel
4. **Micro-animations** for engagement
5. **Dark mode support** with smooth transitions
6. **Responsive typography** that scales beautifully
7. **Touch-optimized interactions** with haptic feedback
8. **Progressive loading** with skeleton screens