'use client'

import Image from 'next/image'
import Link from 'next/link'

export default function Home() {
  return (
    <div>
      {/* Modern Hero Section with Gradient & Animations */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Animated Gradient Background */}
        <div className="absolute inset-0 bg-gradient-hero">
          <div className="absolute inset-0 bg-black/20" />
        </div>
        
        {/* Floating Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 bg-white/5 rounded-full blur-3xl animate-float" />
          <div className="absolute top-40 right-20 w-96 h-96 bg-accent-purple/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
          <div className="absolute bottom-20 left-1/4 w-80 h-80 bg-accent-blue/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '4s' }} />
          <div className="absolute bottom-40 right-10 w-64 h-64 bg-accent-pink/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }} />
        </div>
        
        {/* Hero Content */}
        <div className="relative z-10 container text-center text-white pt-20 pb-12">
          <div className="max-w-4xl mx-auto">
            {/* Animated Badge */}
            <div className="inline-flex items-center px-4 py-2 rounded-full glass mb-8 animate-fade-in">
              <span className="w-2 h-2 bg-accent-blue rounded-full mr-2 animate-pulse" />
              <span className="text-sm font-medium">Nowa generacja inteligentnych okularów</span>
            </div>
            
            {/* Main Heading with Gradient Text */}
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-heading font-bold mb-6 animate-slide-up">
              <span className="block">Przyszłość na</span>
              <span className="block gradient-text bg-gradient-to-r from-white via-accent-blue to-accent-purple bg-clip-text text-transparent">
                wyciągnięcie ręki
              </span>
            </h1>
            
            {/* Subtitle */}
            <p className="text-lg md:text-xl lg:text-2xl mb-8 text-white/90 max-w-3xl mx-auto leading-relaxed animate-slide-up" style={{ animationDelay: '200ms' }}>
              Odkryj świat inteligentnych okularów My Tech Glasses i doświadcz technologii, 
              która zmienia sposób, w jaki widzisz rzeczywistość.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12 animate-slide-up" style={{ animationDelay: '400ms' }}>
              <Link 
                href="/products" 
                className="btn btn-gradient px-8 py-4 text-lg font-semibold hover-lift hover-glow group"
              >
                <span>Zobacz produkty</span>
                <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
              <Link 
                href="/about" 
                className="btn bg-gradient-to-r from-white/20 to-white/30 text-white hover:from-white hover:to-white hover:text-gray-900 px-8 py-4 text-lg font-semibold hover-lift group border border-white/30 backdrop-blur-sm"
              >
                <span>Dowiedz się więcej</span>
                <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </Link>
            </div>
            
            {/* Product Preview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto animate-slide-up" style={{ animationDelay: '600ms' }}>
              {[
                { name: 'Vision Pro', emoji: '🥽', price: '2499 zł', badge: 'Premium' },
                { name: 'Tech View', emoji: '👓', price: '1899 zł', badge: 'Popularne' },
                { name: 'Lite', emoji: '🕶️', price: '1299 zł', badge: 'Najlepsza cena' }
              ].map((product, index) => (
                <div 
                  key={product.name}
                  className="card-glass p-6 hover-lift group cursor-pointer"
                  style={{ animationDelay: `${800 + index * 100}ms` }}
                >
                  <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">
                    {product.emoji}
                  </div>
                  <h3 className="font-heading font-bold text-lg mb-2">{product.name}</h3>
                  <p className="text-accent-blue font-semibold mb-2">{product.price}</p>
                  <span className="inline-block px-3 py-1 bg-white/20 rounded-full text-xs font-medium">
                    {product.badge}
                  </span>
                </div>
              ))}
            </div>
          </div>
          
          {/* Scroll Indicator */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce-gentle">
            <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
              <div className="w-1 h-3 bg-white/60 rounded-full mt-2 animate-pulse" />
            </div>
          </div>
        </div>
      </section>

      {/* Products Section - Mobile Optimized */}
      <section className="mobile-section md:section bg-neutral-50 dark:bg-neutral-900">
        <div className="mobile-container md:container">
          <h2 className="text-mobile-xl md:text-3xl lg:text-4xl font-bold font-heading text-center mb-6 md:mb-12">
            Nasze produkty
          </h2>
          
          {/* Mobile-first single column layout */}
          <div className="space-y-4 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-6 md:space-y-0">
            {/* Product 1 - Vision Pro */}
            <div className="mobile-card md:card group touch-feedback">
              <div className="relative h-48 md:h-64 bg-gradient-to-br from-gray-100 to-gray-200">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-3xl md:text-4xl mb-2">🥽</div>
                    <span className="text-mobile-lg md:text-xl font-medium text-primary-600">Vision Pro</span>
                  </div>
                </div>
                {/* Premium badge */}
                <div className="absolute top-3 right-3 bg-accent-blue text-white px-2 py-1 rounded-full text-xs font-medium">
                  Premium
                </div>
              </div>
              <div className="p-4 md:p-6">
                <h3 className="text-mobile-lg md:text-xl font-bold mb-2">Vision Pro</h3>
                <p className="text-gray-600 text-mobile-sm md:text-base mb-4 line-clamp-2">
                  Flagowy model z zaawansowanymi funkcjami rozszerzonej rzeczywistości i najwyższą jakością obrazu.
                </p>
                
                {/* Mobile-optimized price and CTA */}
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                  <span className="text-mobile-lg md:text-lg font-bold text-primary">2499 zł</span>
                  <Link 
                    href="/products/vision-pro" 
                    className="btn btn-primary w-full sm:w-auto text-mobile-sm md:text-base"
                  >
                    Zobacz więcej
                  </Link>
                </div>
              </div>
            </div>

            {/* Product 2 - Tech View */}
            <div className="mobile-card md:card group touch-feedback">
              <div className="relative h-48 md:h-64 bg-gradient-to-br from-blue-100 to-blue-200">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-3xl md:text-4xl mb-2">👓</div>
                    <span className="text-mobile-lg md:text-xl font-medium text-primary">Tech View</span>
                  </div>
                </div>
                {/* Popular badge */}
                <div className="absolute top-3 right-3 bg-success text-white px-2 py-1 rounded-full text-xs font-medium">
                  Popularne
                </div>
              </div>
              <div className="p-4 md:p-6">
                <h3 className="text-mobile-lg md:text-xl font-bold mb-2">Tech View</h3>
                <p className="text-gray-600 text-mobile-sm md:text-base mb-4 line-clamp-2">
                  Idealny balans między funkcjonalnością a ceną. Doskonały dla codziennego użytku.
                </p>
                
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                  <span className="text-mobile-lg md:text-lg font-bold text-primary">1899 zł</span>
                  <Link 
                    href="/products/tech-view" 
                    className="btn btn-primary w-full sm:w-auto text-mobile-sm md:text-base"
                  >
                    Zobacz więcej
                  </Link>
                </div>
              </div>
            </div>

            {/* Product 3 - Lite */}
            <div className="mobile-card md:card group touch-feedback md:col-span-2 lg:col-span-1">
              <div className="relative h-48 md:h-64 bg-gradient-to-br from-green-100 to-green-200">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-3xl md:text-4xl mb-2">🕶️</div>
                    <span className="text-mobile-lg md:text-xl font-medium text-primary">Lite</span>
                  </div>
                </div>
                {/* Budget badge */}
                <div className="absolute top-3 right-3 bg-warning text-white px-2 py-1 rounded-full text-xs font-medium">
                  Najlepsza cena
                </div>
              </div>
              <div className="p-4 md:p-6">
                <h3 className="text-mobile-lg md:text-xl font-bold mb-2">Lite</h3>
                <p className="text-gray-600 text-mobile-sm md:text-base mb-4 line-clamp-2">
                  Lekki i przystępny cenowo model dla osób rozpoczynających przygodę z inteligentnymi okularami.
                </p>
                
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                  <span className="text-mobile-lg md:text-lg font-bold text-primary">1299 zł</span>
                  <Link 
                    href="/products/lite" 
                    className="btn btn-primary w-full sm:w-auto text-mobile-sm md:text-base"
                  >
                    Zobacz więcej
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile CTA to view all products */}
          <div className="text-center mt-6 md:mt-8">
            <Link 
              href="/products" 
              className="btn btn-outline w-full sm:w-auto"
            >
              Zobacz wszystkie produkty
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section bg-white">
        <div className="container">
          <h2 className="text-3xl md:text-4xl font-bold font-heading text-center mb-12">
            Dlaczego My Tech Glasses?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Feature 1 */}
            <div className="text-center">
              <div className="bg-accent/10 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Innowacyjna technologia</h3>
              <p className="text-gray-600">
                Najnowsze rozwiązania w dziedzinie rozszerzonej rzeczywistości i sztucznej inteligencji.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="text-center">
              <div className="bg-accent/10 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Długi czas pracy</h3>
              <p className="text-gray-600">
                Do 12 godzin ciągłego działania na jednym ładowaniu, dzięki energooszczędnym komponentom.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="text-center">
              <div className="bg-accent/10 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Bezpieczeństwo danych</h3>
              <p className="text-gray-600">
                Zaawansowane szyfrowanie i pełna kontrola nad prywatnością twoich danych.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="text-center">
              <div className="bg-accent/10 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Wsparcie 24/7</h3>
              <p className="text-gray-600">
                Całodobowa pomoc techniczna i regularne aktualizacje oprogramowania.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="section bg-neutral-50 dark:bg-neutral-900">
        <div className="container">
          <h2 className="text-3xl md:text-4xl font-bold font-heading text-center mb-12">
            Co mówią nasi klienci
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center mr-4">
                  <span className="text-primary font-bold">JK</span>
                </div>
                <div>
                  <h4 className="font-bold">Jan Kowalski</h4>
                  <div className="flex text-yellow-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </div>
                </div>
              </div>
              <p className="text-gray-600">
                "Korzystam z Vision Pro od miesiąca i jestem zachwycony. Jakość obrazu jest niesamowita, a funkcje rozszerzonej rzeczywistości zmieniły sposób, w jaki pracuję."
              </p>
            </div>

            {/* Testimonial 2 */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center mr-4">
                  <span className="text-primary font-bold">AN</span>
                </div>
                <div>
                  <h4 className="font-bold">Anna Nowak</h4>
                  <div className="flex text-yellow-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </div>
                </div>
              </div>
              <p className="text-gray-600">
                "Tech View to idealny wybór dla mnie. Świetny stosunek jakości do ceny, długi czas pracy na baterii i wygodne noszenie przez cały dzień."
              </p>
            </div>

            {/* Testimonial 3 */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center mr-4">
                  <span className="text-primary font-bold">PW</span>
                </div>
                <div>
                  <h4 className="font-bold">Piotr Wiśniewski</h4>
                  <div className="flex text-yellow-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </div>
                </div>
              </div>
              <p className="text-gray-600">
                "Model Lite to strzał w dziesiątkę dla początkujących. Łatwa obsługa, podstawowe funkcje działają bez zarzutu, a cena jest bardzo przystępna."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section bg-primary text-white">
        <div className="container text-center">
          <h2 className="text-3xl md:text-4xl font-bold font-heading mb-6">
            Gotowy na przyszłość?
          </h2>
          <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto">
            Dołącz do tysięcy zadowolonych klientów i odkryj nowy wymiar technologii z My Tech Glasses.
          </p>
          <Link href="/products" className="btn bg-white text-primary hover:bg-gray-100 text-lg px-8 py-3">
            Wybierz swoje okulary
          </Link>
        </div>
      </section>
    </div>
  )
}