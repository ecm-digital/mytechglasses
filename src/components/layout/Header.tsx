'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ShoppingCartIcon, Bars3Icon, XMarkIcon, SparklesIcon } from '@heroicons/react/24/outline'
import { useCart } from '@/hooks/useCart'

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const { getItemCount } = useCart()
  const cartItemsCount = getItemCount()

  // Handle scroll effect for glassmorphism
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const closeMenu = () => {
    setIsMenuOpen(false)
  }

  return (
    <>
      {/* Modern Glassmorphism Header */}
      <header className={`
        fixed top-0 left-0 right-0 z-50 transition-all duration-500 safe-top
        ${isScrolled 
          ? 'glass backdrop-blur-xl bg-white/80 dark:bg-neutral-900/80 shadow-floating' 
          : 'bg-transparent'
        }
      `}>
        <div className="container">
          <div className="flex items-center justify-between h-16 md:h-18">
            {/* Modern Mobile Menu Button */}
            <button
              onClick={toggleMenu}
              className={`
                md:hidden relative group
                w-12 h-12 rounded-xl flex items-center justify-center
                menu-button-enhanced ripple-effect
                ${isScrolled 
                  ? 'bg-white/20 hover:bg-white/30 text-neutral-700 dark:text-neutral-300' 
                  : 'bg-white/10 hover:bg-white/20 text-white'
                }
              `}
              aria-label="Toggle menu"
            >
              <div className="relative w-6 h-6">
                <span className={`
                  absolute block w-6 h-0.5 bg-current transform transition-all duration-300
                  ${isMenuOpen ? 'rotate-45 top-3' : 'top-1'}
                `} />
                <span className={`
                  absolute block w-6 h-0.5 bg-current transform transition-all duration-300 top-3
                  ${isMenuOpen ? 'opacity-0' : 'opacity-100'}
                `} />
                <span className={`
                  absolute block w-6 h-0.5 bg-current transform transition-all duration-300
                  ${isMenuOpen ? '-rotate-45 top-3' : 'top-5'}
                `} />
              </div>
            </button>

            {/* Modern Logo with Gradient */}
            <div className="flex-1 flex justify-center md:justify-start">
              <Link href="/" className="group flex items-center space-x-2 touch-feedback">
                <div className="relative">
                  <SparklesIcon className={`
                    w-8 h-8 transition-all duration-300
                    ${isScrolled 
                      ? 'text-primary-500' 
                      : 'text-white'
                    }
                  `} />
                  <div className="absolute inset-0 w-8 h-8 bg-primary-500 rounded-full blur-lg opacity-30 group-hover:opacity-50 transition-opacity" />
                </div>
                <span className={`
                  font-heading font-bold text-xl md:text-2xl transition-all duration-300
                  ${isScrolled 
                    ? 'gradient-text' 
                    : 'text-white'
                  }
                `}>
                  My Tech Glasses
                </span>
              </Link>
            </div>

            {/* Desktop Navigation with Modern Styling */}
            <nav className="hidden md:flex items-center space-x-1">
              {[
                { href: '/', label: 'Strona główna' },
                { href: '/products', label: 'Produkty' },
                { href: '/about', label: 'O nas' },
                { href: '/contact', label: 'Kontakt' },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`
                    px-4 py-2 rounded-xl font-medium transition-all duration-300
                    ${isScrolled
                      ? 'text-neutral-700 dark:text-neutral-300 hover:bg-primary-50 hover:text-primary-600 dark:hover:bg-primary-900/20'
                      : 'text-white/90 hover:text-white hover:bg-white/10'
                    }
                  `}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* Modern Action Buttons */}
            <div className="flex items-center space-x-2">
              {/* Cart Button with Modern Badge */}
              <Link 
                href="/cart" 
                className={`
                  relative group w-12 h-12 rounded-xl flex items-center justify-center
                  menu-button-enhanced ripple-effect
                  ${isScrolled 
                    ? 'bg-white/20 hover:bg-white/30 text-neutral-700 dark:text-neutral-300' 
                    : 'bg-white/10 hover:bg-white/20 text-white'
                  }
                `}
                aria-label={`Cart with ${cartItemsCount} items`}
              >
                <ShoppingCartIcon className="w-6 h-6" />
                {cartItemsCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-gradient-to-r from-accent-purple to-accent-pink text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold animate-pulse-glow">
                    {cartItemsCount > 99 ? '99+' : cartItemsCount}
                  </span>
                )}
                <div className="absolute inset-0 rounded-xl bg-primary-500 opacity-0 group-hover:opacity-20 transition-opacity" />
              </Link>

              {/* Desktop User Button */}
              <Link 
                href="/account" 
                className={`
                  hidden md:flex relative group w-12 h-12 rounded-xl items-center justify-center
                  menu-button-enhanced ripple-effect
                  ${isScrolled 
                    ? 'bg-white/20 hover:bg-white/30 text-neutral-700 dark:text-neutral-300' 
                    : 'bg-white/10 hover:bg-white/20 text-white'
                  }
                `}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <div className="absolute inset-0 rounded-xl bg-primary-500 opacity-0 group-hover:opacity-20 transition-opacity" />
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Modern Mobile Menu with Glassmorphism */}
      <div 
        className={`
          fixed inset-0 z-40 md:hidden transition-all duration-500 ease-out
          ${isMenuOpen ? 'visible opacity-100' : 'invisible opacity-0'}
        `}
        role="dialog"
        aria-modal="true"
        aria-labelledby="mobile-menu-title"
        aria-hidden={!isMenuOpen}
      >
        {/* Menu Panel */}
        <div className={`
          absolute left-0 top-0 h-full w-80 max-w-[85vw]
          glass-dark-enhanced
          transform transition-transform duration-500 ease-out
          ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        `}>
          {/* Menu Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/10">
            <div className="flex items-center space-x-3">
              <SparklesIcon className="w-8 h-8 text-blue-400" aria-hidden="true" />
              <span id="mobile-menu-title" className="menu-header-text font-heading">Menu</span>
            </div>
            <button
              onClick={closeMenu}
              className="w-12 h-12 rounded-xl bg-white/20 hover:bg-white/30 flex items-center justify-center menu-text-enhanced menu-button-enhanced ripple-effect"
              aria-label="Close menu"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>

          {/* Menu Items */}
          <nav className="flex-1 py-8 px-2" role="navigation" aria-label="Main navigation">
            {[
              { href: '/', label: 'Strona główna', icon: '🏠' },
              { href: '/products', label: 'Produkty', icon: '🥽' },
              { href: '/about', label: 'O nas', icon: 'ℹ️' },
              { href: '/contact', label: 'Kontakt', icon: '📞' },
            ].map((item, index) => (
              <Link
                key={item.href}
                href={item.href}
                className="mobile-nav-item animate-slide-right"
                style={{ animationDelay: `${index * 100}ms` }}
                onClick={closeMenu}
                role="menuitem"
                aria-label={`Navigate to ${item.label}`}
              >
                <span className="text-2xl mr-4 flex-shrink-0" aria-hidden="true">{item.icon}</span>
                <span className="menu-item-text">{item.label}</span>
              </Link>
            ))}
            
            <div className="border-t border-white/20 mt-8 pt-6">
              <Link
                href="/account"
                className="mobile-nav-item"
                onClick={closeMenu}
              >
                <span className="text-2xl mr-4 flex-shrink-0">👤</span>
                <span className="menu-item-text">Moje konto</span>
              </Link>
              <Link
                href="/cart"
                className="mobile-nav-item"
                onClick={closeMenu}
              >
                <span className="text-2xl mr-4 flex-shrink-0">🛒</span>
                <span className="menu-item-text flex-1">Koszyk</span>
                {cartItemsCount > 0 && (
                  <span className="ml-3 bg-primary-500 text-white text-sm px-3 py-1 rounded-full font-bold min-w-[24px] text-center">
                    {cartItemsCount}
                  </span>
                )}
              </Link>
            </div>
          </nav>

          {/* Menu Footer */}
          <div className="p-6 border-t border-white/20">
            <div className="text-center">
              <p className="menu-footer-text">My Tech Glasses</p>
              <p className="menu-footer-subtitle mt-1">Przyszłość na wyciągnięcie ręki</p>
            </div>
          </div>
        </div>

        {/* Backdrop */}
        <div 
          className={`
            absolute inset-0 menu-backdrop-enhanced
            transition-opacity duration-500
            ${isMenuOpen ? 'opacity-100' : 'opacity-0'}
          `}
          onClick={closeMenu}
          aria-label="Close menu"
        />
      </div>
    </>
  )
}

export default Header