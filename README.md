# My Tech Glasses 🥽

Nowoczesna aplikacja e-commerce sprzedająca inteligentne okulary z funkcjami rozszerzonej rzeczywistości. Projekt zbudowany w Next.js 14 z TypeScript i Tailwind CSS.

## 📋 Opis projektu

My Tech Glasses to sklep internetowy oferujący trzy modele inteligentnych okularów:

- **Vision Pro** (2499 zł) - Flagowy model z wyświetlaczem 4K HDR, polem widzenia 120°, zaawansowanym śledzeniem ruchu i rozpoznawaniem gestów
- **Tech View** (1899 zł) - Idealny balans funkcjonalności i ceny z wyświetlaczem Full HD i podstawowymi funkcjami AR
- **Lite** (1299 zł) - Przystępny cenowo model dla początkujących, lekki (45g) z baterią do 12 godzin

### Główne funkcjonalności

- 🛍️ **Katalog produktów** - Przegląd wszystkich modeli okularów z szczegółowymi specyfikacjami
- 🛒 **Koszyk zakupowy** - Zarządzanie produktami, zmiana ilości, obliczanie kosztów
- 📱 **Responsive design** - Pełna kompatybilność z urządzeniami mobilnymi
- 🎨 **Nowoczesny UI** - Elegancki interfejs z animacjami i hover effects
- ⚡ **Optymalizacja wydajności** - Szybkie ładowanie dzięki Next.js

## 🚀 Technologie

- **Frontend:** Next.js 14 (App Router), React 18, TypeScript
- **Styling:** Tailwind CSS, Custom CSS
- **Ikony:** Heroicons, React Icons  
- **Fonty:** Google Fonts (Montserrat, Open Sans, Roboto)
- **Narzędzia:** ESLint, PostCSS, Autoprefixer

## 📦 Wymagania systemowe

- Node.js 18.0 lub nowszy
- npm 9.0 lub nowszy
- Git

## 🛠️ Instalacja

1. **Sklonuj repozytorium:**
```bash
git clone <repository-url>
cd my-tech-glasses
```

2. **Zainstaluj zależności:**
```bash
npm install
```

3. **Skonfiguruj zmienne środowiskowe:**
```bash
cp .env.local.example .env.local
```
Edytuj `.env.local` i dodaj swoje klucze Stripe:
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` - klucz publiczny Stripe
- `STRIPE_SECRET_KEY` - klucz prywatny Stripe

4. **Uruchom serwer deweloperski:**
```bash
npm run dev
```

5. **Otwórz aplikację:**
Przejdź do [http://localhost:3000](http://localhost:3000) w przeglądarce.

## 🏗️ Dostępne skrypty

```bash
npm run dev      # Uruchomienie serwera deweloperskiego
npm run build    # Budowanie aplikacji produkcyjnej
npm run start    # Uruchomienie aplikacji produkcyjnej
npm run lint     # Sprawdzenie kodu ESLintem
```

## 📁 Struktura projektu

```
my-tech-glasses/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── about/             # Strona "O nas"
│   │   ├── cart/              # Koszyk zakupowy
│   │   ├── products/          # Katalog produktów
│   │   │   └── [id]/          # Szczegóły produktu
│   │   ├── globals.css        # Style globalne
│   │   ├── layout.tsx         # Layout główny
│   │   └── page.tsx           # Strona główna
│   └── components/            # Komponenty React
│       ├── layout/            # Komponenty layout
│       │   ├── Header.tsx     # Nagłówek z nawigacją
│       │   └── Footer.tsx     # Stopka
│       └── ui/                # Komponenty UI
├── public/                    # Pliki statyczne
├── docs/                      # Dokumentacja techniczna
├── next.config.js            # Konfiguracja Next.js
├── tailwind.config.js        # Konfiguracja Tailwind CSS
└── tsconfig.json             # Konfiguracja TypeScript
```

## 🎨 System kolorów

```css
primary: '#2C3E50'      /* Ciemny niebieski - główny kolor */
accent: '#3498DB'       /* Jasny niebieski - akcenty */
background: '#F8F9FA'   /* Jasny szary - tło */
success: '#2ECC71'      /* Zielony - sukces */
warning: '#F39C12'      /* Pomarańczowy - ostrzeżenia */
error: '#E74C3C'        /* Czerwony - błędy */
```

## 📖 Dokumentacja

- [Przewodnik developera](docs/DEVELOPMENT.md) - Architektura i konwencje kodowania
- [Dokumentacja komponentów](docs/COMPONENTS.md) - Opis wszystkich komponentów
- [Instrukcje wdrożenia](docs/DEPLOYMENT.md) - Deployment i konfiguracja
- [API i struktury danych](docs/API.md) - Interfejsy i modele danych

## 🤝 Współpraca

Przeczytaj [CONTRIBUTING.md](CONTRIBUTING.md) aby dowiedzieć się więcej o procesie rozwoju i standardach kodowania.

## 📄 Licencja

Ten projekt jest własnością My Tech Glasses. Wszelkie prawa zastrzeżone.

## 📞 Kontakt

- **Email:** kontakt@mytechglasses.pl
- **Telefon:** +48 123 456 789
- **Adres:** ul. Technologiczna 15, 00-001 Warszawa

---

Zbudowano z ❤️ używając Next.js i Tailwind CSS