import './globals.css'
import type { Metadata } from 'next'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { CartProvider } from '@/components/cart/CartProvider'
import { initializeApp } from '@/lib/startup'

// Initialize app on server startup
if (typeof window === 'undefined') {
  initializeApp().catch(console.error)
}

export const metadata: Metadata = {
  title: 'My Tech Glasses - Inteligentne okulary przyszłości',
  description: 'Odkryj przyszłość z inteligentnymi okularami My Tech Glasses. Trzy innowacyjne modele, które zmienią sposób, w jaki widzisz świat.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pl">
      <body>
        <CartProvider>
          <Header />
          <main>
            {children}
          </main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  )
}