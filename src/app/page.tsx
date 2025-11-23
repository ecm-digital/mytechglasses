'use client'

import Image from 'next/image'
import Link from 'next/link'
import TrustBar from '@/components/sections/TrustBar'
import WhyChooseUs from '@/components/sections/WhyChooseUs'

export default function Home() {
  return (
    <div>
      {/* Modern Hero Section with Gradient & Animations */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        {/* Animated Gradient Background */}
        <div className="absolute inset-0 bg-gradient-hero">
          <div className="absolute inset-0 bg-black/20" />
        </div>

        {/* Floating Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-white/5 rounded-full blur-3xl animate-float" />
          <div className="absolute top-40 right-20 w-96 h-96 bg-accent-purple/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
          <div className="absolute bottom-20 left-1/4 w-80 h-80 bg-accent-blue/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '4s' }} />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 container text-center text-white pb-12">
          <div className="max-w-5xl mx-auto">
            {/* Animated Badge */}
            <div className="inline-flex items-center px-4 py-2 rounded-full glass mb-8 animate-fade-in hover:scale-105 transition-transform cursor-default">
              <span className="w-2 h-2 bg-accent-blue rounded-full mr-2 animate-pulse" />
              <span className="text-sm font-medium">Nowa generacja inteligentnych okularów</span>
            </div>

            {/* Main Heading with Gradient Text */}
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-heading font-bold mb-8 animate-slide-up tracking-tight">
              <span className="block mb-2">Przyszłość na</span>
              <span className="block gradient-text bg-gradient-to-r from-white via-accent-blue to-accent-purple bg-clip-text text-transparent drop-shadow-lg">
                wyciągnięcie ręki
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-lg md:text-2xl mb-10 text-white/90 max-w-3xl mx-auto leading-relaxed animate-slide-up font-light" style={{ animationDelay: '200ms' }}>
              Odkryj świat inteligentnych okularów My Tech Glasses.
              <span className="font-semibold text-white"> Asystent AI</span>,
              <span className="font-semibold text-white"> kamera 1200P</span> i
              <span className="font-semibold text-white"> dźwięk przestrzenny</span> w jednej, stylowej oprawie.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-16 animate-slide-up" style={{ animationDelay: '400ms' }}>
              <Link
                href="/products"
                className="btn btn-gradient px-10 py-5 text-xl font-bold hover-lift hover-glow group min-w-[200px] relative overflow-hidden"
              >
                <span className="relative z-10">Zobacz produkty</span>
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                <svg className="w-6 h-6 ml-2 inline-block group-hover:translate-x-1 transition-transform relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
              <Link
                href="/about"
                className="btn glass px-10 py-5 text-xl font-semibold hover:bg-white/10 transition-all min-w-[200px]"
              >
                Dowiedz się więcej
              </Link>
            </div>

            {/* Social Proof Badge */}
            <div className="animate-slide-up flex justify-center items-center gap-2 text-sm text-white/80" style={{ animationDelay: '500ms' }}>
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-8 h-8 rounded-full bg-gray-300 border-2 border-primary-900" />
                ))}
              </div>
              <p>Dołącz do <span className="font-bold text-white">1000+</span> innowatorów</p>
            </div>

            {/* Product Showcase - AI Smart Glasses */}
            <div className="mt-16 max-w-4xl mx-auto animate-slide-up relative" style={{ animationDelay: '600ms' }}>
              {/* Floating Elements around product */}
              <div className="absolute -top-10 -left-10 w-20 h-20 bg-accent-blue/30 rounded-full blur-xl animate-pulse" />
              <div className="absolute top-1/2 -right-10 w-32 h-32 bg-accent-purple/30 rounded-full blur-xl animate-pulse" style={{ animationDelay: '1s' }} />

              <div className="card-glass p-8 md:p-12 hover-lift group cursor-pointer relative overflow-hidden border-white/30">
                <div className="absolute top-0 right-0 bg-accent-blue text-white px-6 py-2 rounded-bl-2xl font-bold text-sm z-10">
                  BESTSELLER
                </div>

                <div className="grid md:grid-cols-2 gap-8 items-center">
                  <div className="text-center md:text-left">
                    <h3 className="font-heading font-bold text-3xl md:text-4xl mb-2">AI Smart Glasses Pro</h3>
                    <div className="flex items-center justify-center md:justify-start gap-2 mb-4">
                      <div className="flex text-yellow-400">
                        {[...Array(5)].map((_, i) => (
                          <svg key={i} className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                      <span className="text-white/80 text-sm">(128 opinii)</span>
                    </div>
                    <p className="text-white/80 text-lg mb-6 leading-relaxed">
                      Twój osobisty asystent w zasięgu wzroku. Kamera 1200P, ChatGPT i otwarte audio.
                    </p>

                    <div className="flex flex-wrap gap-3 mb-8">
                      {['Kamera 1200P', 'ChatGPT', 'Audio ENC', '7h Baterii'].map((feat) => (
                        <span key={feat} className="px-3 py-1 rounded-lg bg-white/10 text-sm font-medium border border-white/10">
                          {feat}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center justify-center md:justify-start gap-6">
                      <div>
                        <span className="text-3xl font-bold text-white">599 zł</span>
                        <span className="text-white/50 line-through text-lg ml-2">799 zł</span>
                      </div>
                      <Link
                        href="/products/vision-pro"
                        className="btn btn-gradient px-8 py-3 font-bold shadow-lg hover-lift hover-glow"
                      >
                        Kup teraz
                      </Link>
                    </div>
                  </div>

                  <div className="relative group-hover:scale-105 transition-transform duration-500">
                    <div className="aspect-square rounded-2xl bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center backdrop-blur-sm border border-white/10">
                      <div className="text-9xl filter drop-shadow-[0_0_30px_rgba(59,130,246,0.5)]">
                        🥽
                      </div>
                    </div>
                    {/* Floating badges on image */}
                    <div className="absolute -bottom-4 -right-4 bg-black/80 backdrop-blur-md text-white px-4 py-2 rounded-xl border border-white/20 text-xs font-mono flex items-center gap-2">
                      <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                      AI ACTIVE
                    </div>
                  </div>
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

      {/* Trust Bar Section */}
      <TrustBar />

      {/* Product Showcase Section */}
      <section className="section bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50 dark:from-neutral-900 dark:via-blue-950 dark:to-neutral-900">
        <div className="container">
          <div className="text-center mb-16">
            <span className="text-blue-600 dark:text-blue-400 font-bold tracking-wider uppercase text-sm mb-2 block">
              Nasze Produkty
            </span>
            <h2 className="text-4xl md:text-5xl font-bold font-heading mb-4">
              Wybierz swój styl
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Zaawansowana technologia ukryta w designerskich oprawkach.
            </p>
          </div>

          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8">
            {/* Product Card 1 - Pro */}
            <div className="card group overflow-hidden hover:shadow-2xl transition-all duration-500 border-2 border-transparent hover:border-blue-500/20">
              <div className="relative aspect-[4/3] overflow-hidden bg-gray-100 dark:bg-gray-800">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-100/50 to-purple-100/50 dark:from-blue-900/20 dark:to-purple-900/20" />
                <div className="absolute inset-0 flex items-center justify-center group-hover:scale-110 transition-transform duration-700">
                  <div className="text-9xl">🥽</div>
                </div>
                <div className="absolute top-4 left-4">
                  <span className="bg-blue-600 text-white px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider shadow-lg">
                    Flagowy
                  </span>
                </div>
                {/* Quick Add Overlay */}
                <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <button className="w-full btn bg-white/90 dark:bg-black/90 backdrop-blur text-primary-600 font-bold py-3 rounded-xl shadow-lg hover:bg-primary-600 hover:text-white transition-all">
                    Szybki podgląd
                  </button>
                </div>
              </div>

              <div className="p-8">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-2xl font-bold font-heading mb-1">AI Vision Pro</h3>
                    <p className="text-gray-500 text-sm">Dla profesjonalistów</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-blue-600">599 zł</div>
                    <div className="text-xs text-gray-400 line-through">799 zł</div>
                  </div>
                </div>

                <p className="text-gray-600 dark:text-gray-400 mb-6 line-clamp-2">
                  Pełna integracja z AI, kamera 1200P i dźwięk przestrzenny. Najlepszy wybór dla twórców.
                </p>

                <div className="space-y-3 mb-8">
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                    <svg className="w-5 h-5 mr-3 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Kamera 1200P HDR
                  </div>
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                    <svg className="w-5 h-5 mr-3 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Asystent AI (ChatGPT)
                  </div>
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                    <svg className="w-5 h-5 mr-3 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Bateria 7h + Etui ładujące
                  </div>
                </div>

                <Link
                  href="/products/vision-pro"
                  className="btn btn-primary w-full group"
                >
                  <span>Wybierz Vision Pro</span>
                  <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>
            </div>

            {/* Product Card 2 - Lite */}
            <div className="card group overflow-hidden hover:shadow-2xl transition-all duration-500 border-2 border-transparent hover:border-purple-500/20">
              <div className="relative aspect-[4/3] overflow-hidden bg-gray-100 dark:bg-gray-800">
                <div className="absolute inset-0 bg-gradient-to-br from-green-100/50 to-blue-100/50 dark:from-green-900/20 dark:to-blue-900/20" />
                <div className="absolute inset-0 flex items-center justify-center group-hover:scale-110 transition-transform duration-700">
                  <div className="text-9xl">👓</div>
                </div>
                <div className="absolute top-4 left-4">
                  <span className="bg-purple-600 text-white px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider shadow-lg">
                    Nowość
                  </span>
                </div>
                {/* Quick Add Overlay */}
                <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <button className="w-full btn bg-white/90 dark:bg-black/90 backdrop-blur text-purple-600 font-bold py-3 rounded-xl shadow-lg hover:bg-purple-600 hover:text-white transition-all">
                    Szybki podgląd
                  </button>
                </div>
              </div>

              <div className="p-8">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-2xl font-bold font-heading mb-1">AI Vision Lite</h3>
                    <p className="text-gray-500 text-sm">Na co dzień</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-purple-600">399 zł</div>
                    <div className="text-xs text-gray-400 line-through">499 zł</div>
                  </div>
                </div>

                <p className="text-gray-600 dark:text-gray-400 mb-6 line-clamp-2">
                  Lekkie i stylowe. Idealne do słuchania muzyki i rozmów telefonicznych bez odcinania się od otoczenia.
                </p>

                <div className="space-y-3 mb-8">
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                    <svg className="w-5 h-5 mr-3 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Audio HD (Otwarte)
                  </div>
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                    <svg className="w-5 h-5 mr-3 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Sterowanie dotykowe
                  </div>
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                    <svg className="w-5 h-5 mr-3 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Bateria 12h
                  </div>
                </div>

                <Link
                  href="/products/vision-lite"
                  className="btn bg-purple-600 text-white hover:bg-purple-700 w-full group shadow-lg hover:shadow-purple-500/30"
                >
                  <span>Wybierz Vision Lite</span>
                  <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <WhyChooseUs />

      {/* Testimonials Section */}
      <section className="section relative overflow-hidden bg-neutral-50 dark:bg-neutral-900">
        {/* Decorative Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
        </div>

        <div className="container relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold font-heading mb-4">
              Co mówią nasi klienci
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Dołącz do społeczności zadowolonych użytkowników My Tech Glasses
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <div className="card-glass p-8 rounded-2xl hover-lift relative group">
              <div className="absolute -top-6 left-8">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-white font-bold shadow-lg transform -rotate-6 group-hover:rotate-0 transition-transform duration-300">
                  JK
                </div>
              </div>
              <div className="mt-6">
                <div className="flex text-yellow-400 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-700 dark:text-gray-300 mb-6 italic leading-relaxed">
                  "Korzystam z Vision Pro od miesiąca i jestem zachwycony. Jakość obrazu jest niesamowita, a funkcje rozszerzonej rzeczywistości zmieniły sposób, w jaki pracuję."
                </p>
                <div>
                  <h4 className="font-bold text-lg">Jan Kowalski</h4>
                  <p className="text-sm text-blue-500 font-medium">Architekt</p>
                </div>
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="card-glass p-8 rounded-2xl hover-lift relative group mt-8 md:mt-0">
              <div className="absolute -top-6 left-8">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center text-white font-bold shadow-lg transform rotate-3 group-hover:rotate-0 transition-transform duration-300">
                  AN
                </div>
              </div>
              <div className="mt-6">
                <div className="flex text-yellow-400 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-700 dark:text-gray-300 mb-6 italic leading-relaxed">
                  "Tech View to idealny wybór dla mnie. Świetny stosunek jakości do ceny, długi czas pracy na baterii i wygodne noszenie przez cały dzień."
                </p>
                <div>
                  <h4 className="font-bold text-lg">Anna Nowak</h4>
                  <p className="text-sm text-purple-500 font-medium">Grafik Komputerowy</p>
                </div>
              </div>
            </div>

            {/* Testimonial 3 */}
            <div className="card-glass p-8 rounded-2xl hover-lift relative group">
              <div className="absolute -top-6 left-8">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center text-white font-bold shadow-lg transform -rotate-3 group-hover:rotate-0 transition-transform duration-300">
                  PW
                </div>
              </div>
              <div className="mt-6">
                <div className="flex text-yellow-400 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-700 dark:text-gray-300 mb-6 italic leading-relaxed">
                  "Model Lite to strzał w dziesiątkę dla początkujących. Łatwa obsługa, podstawowe funkcje działają bez zarzutu, a cena jest bardzo przystępna."
                </p>
                <div>
                  <h4 className="font-bold text-lg">Piotr Wiśniewski</h4>
                  <p className="text-sm text-orange-500 font-medium">Student</p>
                </div>
              </div>
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