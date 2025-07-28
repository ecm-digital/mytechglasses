# Dokumentacja wdrożenia

## Przegląd

My Tech Glasses to aplikacja Next.js 14 zoptymalizowana do wdrożenia na platformie Vercel. Aplikacja wykorzystuje App Router, TypeScript, Tailwind CSS oraz integrację z Stripe do obsługi płatności.

## Wymagania systemowe

### Środowisko deweloperskie
- **Node.js**: 18.17.0 lub nowszy
- **npm**: 9.0.0 lub nowszy (lub yarn/pnpm)
- **Git**: Do zarządzania kodem źródłowym

### Środowisko produkcyjne
- **Platform**: Vercel (zalecane) lub dowolny hosting obsługujący Next.js
- **Node.js**: 18.x (automatycznie zarządzane przez Vercel)
- **Database**: Brak (aplikacja używa statycznych danych)

## Konfiguracja zmiennych środowiskowych

### Plik `.env.local`

Skopiuj `.env.local.example` do `.env.local` i skonfiguruj następujące zmienne:

```bash
# Stripe Configuration - WYMAGANE
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
STRIPE_SECRET_KEY=sk_test_your_secret_key_here

# Next.js Configuration - OPCJONALNE
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret_here
```

### Opis zmiennych

#### Stripe (Wymagane)
- **`NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`**: Publiczny klucz Stripe (widoczny w przeglądarce)
  - Testowy: `pk_test_...`
  - Produkcyjny: `pk_live_...`
  
- **`STRIPE_SECRET_KEY`**: Tajny klucz Stripe (tylko server-side)
  - Testowy: `sk_test_...`
  - Produkcyjny: `sk_live_...`

#### NextAuth (Opcjonalne)
- **`NEXTAUTH_URL`**: URL aplikacji dla NextAuth
  - Development: `http://localhost:3000`
  - Production: `https://yourdomain.com`
  
- **`NEXTAUTH_SECRET`**: Tajny klucz do szyfrowania sesji
  - Generuj: `openssl rand -base64 32`

### Konfiguracja dla różnych środowisk

#### Development
```bash
# .env.local
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
NEXTAUTH_URL=http://localhost:3000
```

#### Staging
```bash
# Vercel Environment Variables
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
NEXTAUTH_URL=https://staging.yourdomain.com
```

#### Production
```bash
# Vercel Environment Variables
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
NEXTAUTH_URL=https://yourdomain.com
```

## Instrukcje build

### Lokalne budowanie

```bash
# Instalacja zależności
npm install

# Build aplikacji
npm run build

# Uruchomienie wersji produkcyjnej lokalnie
npm start

# Lub uruchomienie w trybie deweloperskim
npm run dev
```

### Weryfikacja build

```bash
# Sprawdzenie błędów TypeScript
npm run lint

# Analiza bundle size (opcjonalne)
npx @next/bundle-analyzer
```

### Optymalizacja build

#### Konfiguracja Next.js (`next.config.js`)
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  // Optymalizacja obrazów
  images: {
    domains: ['images.unsplash.com'],
    formats: ['image/webp', 'image/avif'],
  },
  
  // Kompresja
  compress: true,
  
  // Optymalizacja CSS
  experimental: {
    optimizeCss: true,
  },
  
  // Bundle analyzer (development only)
  ...(process.env.ANALYZE === 'true' && {
    webpack: (config) => {
      config.plugins.push(
        new (require('@next/bundle-analyzer'))({
          enabled: true,
        })
      )
      return config
    },
  }),
}

module.exports = nextConfig
```

## Deployment na Vercel

### Automatyczne wdrożenie (Zalecane)

1. **Połącz repozytorium z Vercel**:
   ```bash
   # Zaloguj się do Vercel CLI
   npx vercel login
   
   # Zainicjalizuj projekt
   npx vercel
   ```

2. **Konfiguracja w Vercel Dashboard**:
   - Przejdź do [vercel.com](https://vercel.com)
   - Kliknij "New Project"
   - Wybierz repozytorium GitHub
   - Vercel automatycznie wykryje Next.js

3. **Skonfiguruj zmienne środowiskowe**:
   - W Vercel Dashboard → Settings → Environment Variables
   - Dodaj wszystkie wymagane zmienne
   - Ustaw odpowiednie środowiska (Development, Preview, Production)

### Ręczne wdrożenie

```bash
# Build i deploy jedną komendą
npx vercel --prod

# Lub krok po kroku
npm run build
npx vercel deploy --prebuilt --prod
```

### Konfiguracja Vercel (`vercel.json`)

```json
{
  "version": 2,
  "framework": "nextjs",
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "installCommand": "npm install",
  "functions": {
    "src/app/api/**/*.ts": {
      "maxDuration": 30
    }
  },
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        }
      ]
    }
  ],
  "redirects": [
    {
      "source": "/home",
      "destination": "/",
      "permanent": true
    }
  ]
}
```

## Deployment na inne platformy

### Netlify

```bash
# Build command
npm run build

# Publish directory
.next

# Environment variables
# Dodaj w Netlify Dashboard → Site settings → Environment variables
```

### Railway

```bash
# Dockerfile (opcjonalnie)
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

### Docker

```dockerfile
# Dockerfile
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["node", "server.js"]
```

```bash
# Build i uruchomienie
docker build -t my-tech-glasses .
docker run -p 3000:3000 my-tech-glasses
```

## Monitoring i maintenance

### Health Checks

```typescript
// src/app/api/health/route.ts
export async function GET() {
  return Response.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || '1.0.0',
  })
}
```

### Error Monitoring

#### Sentry Integration (Opcjonalne)

```bash
npm install @sentry/nextjs
```

```javascript
// sentry.client.config.js
import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
})
```

### Performance Monitoring

#### Vercel Analytics

```bash
npm install @vercel/analytics
```

```typescript
// src/app/layout.tsx
import { Analytics } from '@vercel/analytics/react'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
```

### Backup i Recovery

#### Konfiguracja Git
```bash
# Automatyczne backup przez Git
git remote add backup https://github.com/backup-repo.git
git push backup main
```

#### Database Backup (jeśli używasz)
```bash
# Przykład dla PostgreSQL
pg_dump $DATABASE_URL > backup.sql
```

## Troubleshooting

### Częste problemy

#### 1. Build Errors

```bash
# Błąd: "Module not found"
npm install
rm -rf .next
npm run build

# Błąd TypeScript
npm run lint
npx tsc --noEmit
```

#### 2. Environment Variables

```bash
# Sprawdź czy zmienne są dostępne
console.log(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)

# Pamiętaj o prefiksie NEXT_PUBLIC_ dla client-side
```

#### 3. Stripe Integration

```bash
# Testuj webhooks lokalnie
npm install -g stripe-cli
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

#### 4. Performance Issues

```bash
# Analiza bundle
npm run build
npx @next/bundle-analyzer

# Sprawdź Core Web Vitals
# Użyj Lighthouse w Chrome DevTools
```

### Logi i debugging

#### Vercel Logs
```bash
# Pobierz logi z Vercel
npx vercel logs [deployment-url]

# Real-time logs
npx vercel logs --follow
```

#### Local Debugging
```bash
# Debug mode
DEBUG=* npm run dev

# Specific debug
DEBUG=next:* npm run dev
```

## Security

### HTTPS
- Vercel automatycznie zapewnia SSL/TLS
- Własne domeny wymagają konfiguracji DNS

### Environment Variables
- Nigdy nie commituj `.env.local`
- Używaj różnych kluczy dla test/production
- Regularnie rotuj tajne klucze

### Headers Security
```javascript
// next.config.js
const nextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
    ]
  },
}
```

## Checklist wdrożenia

### Pre-deployment
- [ ] Wszystkie testy przechodzą
- [ ] Build działa lokalnie
- [ ] Environment variables skonfigurowane
- [ ] Stripe keys są poprawne
- [ ] TypeScript errors rozwiązane
- [ ] Performance zoptymalizowane

### Deployment
- [ ] Vercel project skonfigurowany
- [ ] Domain skonfigurowany (jeśli custom)
- [ ] Environment variables ustawione
- [ ] Build i deploy successful
- [ ] Health check działa

### Post-deployment
- [ ] Aplikacja działa na production URL
- [ ] Stripe payments działają
- [ ] Mobile responsiveness OK
- [ ] Performance metrics OK
- [ ] Error monitoring skonfigurowane
- [ ] Analytics skonfigurowane

### Rollback Plan
```bash
# W przypadku problemów
npx vercel rollback [deployment-url]

# Lub deploy poprzedniej wersji
git checkout [previous-commit]
npx vercel --prod
```