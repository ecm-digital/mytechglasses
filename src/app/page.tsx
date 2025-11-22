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
            
            {/* CTA Button */}
            <div className="flex justify-center items-center mb-12 animate-slide-up" style={{ animationDelay: '400ms' }}>
              <Link 
                href="/products" 
                className="btn btn-gradient px-8 py-4 text-lg font-semibold hover-lift hover-glow group"
              >
                <span>Zobacz produkty</span>
                <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
            
            {/* Product Showcase - AI Smart Glasses */}
            <div className="max-w-2xl mx-auto animate-slide-up" style={{ animationDelay: '600ms' }}>
              <div className="card-glass p-8 hover-lift group cursor-pointer">
                <div className="text-center">
                  <div className="text-7xl mb-4 group-hover:scale-110 transition-transform">
                    🥽
                  </div>
                  <h3 className="font-heading font-bold text-3xl mb-3">AI Smart Glasses Pro</h3>
                  <p className="text-white/80 text-lg mb-4">
                    Inteligentne okulary z kamerą 1200P i asystentem AI
                  </p>
                  <div className="flex items-center justify-center gap-4 mb-4">
                    <span className="text-accent-blue font-bold text-2xl">599 zł</span>
                    <span className="inline-block px-4 py-2 bg-accent-blue/20 rounded-full text-sm font-medium">
                      Bestseller
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-sm text-white/70 mb-6">
                    <div className="flex items-center justify-center">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Kamera 1200P HD
                    </div>
                    <div className="flex items-center justify-center">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      ChatGPT & Deep Seek
                    </div>
                    <div className="flex items-center justify-center">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Bateria 7h
                    </div>
                    <div className="flex items-center justify-center">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Bluetooth 5.4
                    </div>
                  </div>
                  <Link 
                    href="/products/vision-pro" 
                    className="inline-flex items-center px-6 py-3 bg-white text-primary-800 rounded-xl font-semibold hover:bg-white/90 transition-all hover:scale-105"
                  >
                    Zobacz szczegóły
                    <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </Link>
                </div>
              </div>
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

      {/* Product Showcase Section */}
      <section className="section bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50 dark:from-neutral-900 dark:via-blue-950 dark:to-neutral-900">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-heading mb-4">
              AI Smart Glasses Pro
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Inteligentne okulary z kamerą 1200P, asystentem AI i otwartymi słuchawkami. Idealne do vlogowania i codziennego użytku.
            </p>
          </div>
          
          <div className="max-w-5xl mx-auto">
            <div className="card group overflow-hidden">
              <div className="grid md:grid-cols-2 gap-8 p-8 md:p-12">
                {/* Product Image */}
                <div className="relative">
                  <div className="aspect-square bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 dark:from-blue-900 dark:via-purple-900 dark:to-pink-900 rounded-2xl flex items-center justify-center group-hover:scale-105 transition-transform duration-500">
                    <div className="text-9xl">🥽</div>
                  </div>
                  <div className="absolute -top-4 -right-4 bg-blue-500 text-white px-6 py-3 rounded-full text-sm font-bold shadow-lg">
                    Bestseller
                  </div>
                </div>
                
                {/* Product Details */}
                <div className="flex flex-col justify-center">
                  <h3 className="text-3xl md:text-4xl font-bold mb-4">AI Smart Glasses Pro</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-lg mb-6">
                    Inteligentne okulary z kamerą HD 1200P, asystentem AI ChatGPT i Deep Seek, oraz otwartymi słuchawkami. Idealne do vlogowania, podróży i codziennego użytku bez użycia rąk.
                  </p>
                  
                  {/* Features */}
                  <div className="space-y-3 mb-8">
                    <div className="flex items-center text-gray-700 dark:text-gray-300">
                      <svg className="w-6 h-6 mr-3 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Kamera HD 1200P z AI</span>
                    </div>
                    <div className="flex items-center text-gray-700 dark:text-gray-300">
                      <svg className="w-6 h-6 mr-3 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>ChatGPT i Deep Seek</span>
                    </div>
                    <div className="flex items-center text-gray-700 dark:text-gray-300">
                      <svg className="w-6 h-6 mr-3 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Otwarte słuchawki z ENC</span>
                    </div>
                    <div className="flex items-center text-gray-700 dark:text-gray-300">
                      <svg className="w-6 h-6 mr-3 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Bateria 7h + Bluetooth 5.4</span>
                    </div>
                  </div>
                  
                  {/* Price and CTA */}
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <div className="text-4xl font-bold text-blue-600">599 zł</div>
                      <div className="text-sm text-gray-500">Darmowa dostawa</div>
                    </div>
                  </div>
                  
                  <Link 
                    href="/products/vision-pro" 
                    className="btn btn-primary text-lg py-4 group"
                  >
                    <span>Zobacz szczegóły</span>
                    <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section bg-white dark:bg-neutral-900">
        <div className="container">
          <h2 className="text-3xl md:text-4xl font-bold font-heading text-center mb-4">
            Kluczowe funkcje
          </h2>
          <p className="text-center text-gray-600 dark:text-gray-400 mb-12 max-w-2xl mx-auto">
            Odkryj zaawansowane możliwości AI Smart Glasses Pro
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 - Camera */}
            <div className="card p-8 text-center hover-lift group">
              <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl w-20 h-20 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">Kamera HD 1200P</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Nagrywaj płynne wideo w rozdzielczości 1200P z technologią przeciwwstrząsową i HDR dla idealnych ujęć.
              </p>
            </div>

            {/* Feature 2 - AI Assistant */}
            <div className="card p-8 text-center hover-lift group">
              <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl w-20 h-20 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">ChatGPT & Deep Seek</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Zintegrowany asystent AI do odpowiedzi na pytania, tłumaczeń i identyfikacji obiektów w czasie rzeczywistym.
              </p>
            </div>

            {/* Feature 3 - Audio */}
            <div className="card p-8 text-center hover-lift group">
              <div className="bg-gradient-to-br from-pink-500 to-orange-600 rounded-2xl w-20 h-20 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">Otwarte słuchawki</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Wysokiej jakości dźwięk przestrzenny z podwójnymi mikrofonami ENC dla krystalicznie czystych rozmów.
              </p>
            </div>

            {/* Feature 4 - Voice Control */}
            <div className="card p-8 text-center hover-lift group">
              <div className="bg-gradient-to-br from-green-500 to-teal-600 rounded-2xl w-20 h-20 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">Sterowanie głosowe</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Kontroluj wszystkie funkcje za pomocą komend głosowych - bez użycia rąk, idealne podczas jazdy czy wędrówki.
              </p>
            </div>

            {/* Feature 5 - Battery */}
            <div className="card p-8 text-center hover-lift group">
              <div className="bg-gradient-to-br from-yellow-500 to-red-600 rounded-2xl w-20 h-20 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">Bateria 7 godzin</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Bateria 270 mAh zapewnia do 7 godzin odtwarzania muzyki lub 2 godziny nagrywania wideo.
              </p>
            </div>

            {/* Feature 6 - Connectivity */}
            <div className="card p-8 text-center hover-lift group">
              <div className="bg-gradient-to-br from-indigo-500 to-blue-600 rounded-2xl w-20 h-20 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">Bluetooth 5.4 & Wi-Fi</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Automatyczna synchronizacja zdjęć i wideo przez Wi-Fi lub Bluetooth 5.4 z najnowszą technologią łączności.
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