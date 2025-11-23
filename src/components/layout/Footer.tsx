'use client'

import Link from 'next/link'
import { SparklesIcon } from '@heroicons/react/24/outline'

const Footer = () => {
  return (
    <footer className="relative bg-neutral-900 text-white overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-900/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent-purple/10 rounded-full blur-3xl" />
      </div>

      <div className="relative container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 mb-16">
          {/* Brand Column */}
          <div className="lg:col-span-4">
            <Link href="/" className="flex items-center space-x-2 mb-6 group">
              <SparklesIcon className="w-8 h-8 text-primary-400 group-hover:text-primary-300 transition-colors" />
              <span className="font-heading font-bold text-2xl bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                My Tech Glasses
              </span>
            </Link>
            <p className="text-gray-400 mb-8 leading-relaxed max-w-sm">
              Odkryj przyszłość z inteligentnymi okularami, które zmieniają sposób, w jaki widzisz świat. Technologia jutra, dostępna dzisiaj.
            </p>
            <div className="flex space-x-4">
              {[
                { name: 'Facebook', icon: 'M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z' },
                { name: 'Twitter', icon: 'M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z' },
                { name: 'Instagram', icon: 'M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z' },
              ].map((social) => (
                <a
                  key={social.name}
                  href="#"
                  className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-all hover:scale-110 group"
                  aria-label={social.name}
                >
                  <svg className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
                    <path d={social.icon} />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {/* Links Columns */}
          <div className="lg:col-span-2">
            <h3 className="font-heading font-semibold text-lg mb-6 text-white">Produkty</h3>
            <ul className="space-y-4">
              {['Vision Pro', 'Vision Lite', 'Akcesoria', 'Porównaj modele'].map((item) => (
                <li key={item}>
                  <Link href="/products" className="text-gray-400 hover:text-primary-400 transition-colors text-sm">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h3 className="font-heading font-semibold text-lg mb-6 text-white">Firma</h3>
            <ul className="space-y-4">
              {['O nas', 'Kariera', 'Blog', 'Kontakt'].map((item) => (
                <li key={item}>
                  <Link href="/about" className="text-gray-400 hover:text-primary-400 transition-colors text-sm">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter Column */}
          <div className="lg:col-span-4">
            <h3 className="font-heading font-semibold text-lg mb-6 text-white">Zapisz się do newslettera</h3>
            <p className="text-gray-400 text-sm mb-4">
              Otrzymuj najnowsze informacje o produktach i ekskluzywne oferty.
            </p>
            <form className="space-y-4">
              <div className="relative">
                <input
                  type="email"
                  placeholder="Twój adres email"
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all"
                />
              </div>
              <button className="w-full px-6 py-3 rounded-xl bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-primary-400 text-white font-medium shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40 transition-all transform hover:-translate-y-0.5">
                Zapisz się
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} My Tech Glasses. Wszelkie prawa zastrzeżone.
          </p>
          <div className="flex space-x-6">
            {['Polityka prywatności', 'Regulamin', 'Cookies'].map((item) => (
              <Link key={item} href="#" className="text-gray-500 hover:text-gray-300 text-sm transition-colors">
                {item}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer