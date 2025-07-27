'use client'

export default function About() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl md:text-4xl font-bold font-heading mb-8 text-center">O My Tech Glasses</h1>
      
      {/* Company Story */}
      <div className="max-w-3xl mx-auto mb-16">
        <h2 className="text-2xl font-bold mb-6 text-primary">Nasza historia</h2>
        <p className="text-gray-600 mb-4">
          My Tech Glasses powstało w 2020 roku z pasji do innowacji i technologii. Założyciele firmy, grupa inżynierów i projektantów z wieloletnim doświadczeniem w branży technologicznej, postawili sobie za cel stworzenie inteligentnych okularów, które będą nie tylko funkcjonalne, ale również stylowe i dostępne dla szerokiego grona odbiorców.
        </p>
        <p className="text-gray-600 mb-4">
          Po dwóch latach intensywnych badań i rozwoju, wprowadziliśmy na rynek naszą pierwszą linię produktów, która szybko zyskała uznanie zarówno wśród entuzjastów technologii, jak i zwykłych użytkowników. Dziś My Tech Glasses jest jednym z liderów w dziedzinie inteligentnych okularów, nieustannie dążącym do doskonałości i wprowadzającym innowacyjne rozwiązania.
        </p>
        <p className="text-gray-600">
          Nasza siedziba główna znajduje się w Warszawie, ale nasze produkty są dostępne dla klientów w całej Europie. Zespół My Tech Glasses składa się z ponad 50 specjalistów z różnych dziedzin, od inżynierii po obsługę klienta, którzy każdego dnia pracują nad tym, aby dostarczać najwyższej jakości produkty i usługi.
        </p>
      </div>
      
      {/* Mission and Vision */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-6 text-primary">Nasza misja</h2>
          <p className="text-gray-600">
            Naszą misją jest demokratyzacja dostępu do technologii rozszerzonej rzeczywistości poprzez tworzenie inteligentnych okularów, które są funkcjonalne, stylowe i dostępne cenowo. Wierzymy, że technologia powinna wzbogacać życie każdego człowieka, dlatego projektujemy nasze produkty z myślą o różnorodnych potrzebach i preferencjach użytkowników.
          </p>
        </div>
        <div className="bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-6 text-primary">Nasza wizja</h2>
          <p className="text-gray-600">
            Dążymy do stworzenia świata, w którym technologia rozszerzonej rzeczywistości jest integralną częścią codziennego życia, pomagając ludziom pracować efektywniej, uczyć się szybciej i cieszyć się rozrywką w nowy, immersyjny sposób. Chcemy być liderem w tej transformacji, nieustannie przesuwając granice możliwości i wyznaczając nowe standardy w branży.
          </p>
        </div>
      </div>
      
      {/* Values */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold mb-8 text-center text-primary">Nasze wartości</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="bg-accent/10 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-2">Innowacja</h3>
            <p className="text-gray-600">
              Nieustannie poszukujemy nowych rozwiązań i technologii, które mogą uczynić nasze produkty jeszcze lepszymi.
            </p>
          </div>
          <div className="text-center">
            <div className="bg-accent/10 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-2">Dostępność</h3>
            <p className="text-gray-600">
              Wierzymy, że zaawansowana technologia powinna być dostępna dla wszystkich, niezależnie od budżetu czy umiejętności technicznych.
            </p>
          </div>
          <div className="text-center">
            <div className="bg-accent/10 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-2">Jakość</h3>
            <p className="text-gray-600">
              Nie idziemy na kompromisy w kwestii jakości. Każdy produkt przechodzi rygorystyczne testy, aby zapewnić niezawodność i trwałość.
            </p>
          </div>
        </div>
      </div>
      
      {/* Team */}
      <div>
        <h2 className="text-2xl font-bold mb-8 text-center text-primary">Nasz zespół</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="h-40 w-40 rounded-full bg-gray-200 mx-auto mb-4 flex items-center justify-center">
              <span className="text-2xl font-bold text-primary">AK</span>
            </div>
            <h3 className="text-xl font-bold mb-1">Adam Kowalski</h3>
            <p className="text-gray-600 mb-2">CEO & Współzałożyciel</p>
            <p className="text-sm text-gray-500">
              Z ponad 15-letnim doświadczeniem w branży technologicznej, Adam kieruje strategicznym rozwojem firmy.
            </p>
          </div>
          <div className="text-center">
            <div className="h-40 w-40 rounded-full bg-gray-200 mx-auto mb-4 flex items-center justify-center">
              <span className="text-2xl font-bold text-primary">MN</span>
            </div>
            <h3 className="text-xl font-bold mb-1">Marta Nowak</h3>
            <p className="text-gray-600 mb-2">CTO & Współzałożycielka</p>
            <p className="text-sm text-gray-500">
              Marta odpowiada za rozwój technologiczny naszych produktów, łącząc innowację z praktycznością.
            </p>
          </div>
          <div className="text-center">
            <div className="h-40 w-40 rounded-full bg-gray-200 mx-auto mb-4 flex items-center justify-center">
              <span className="text-2xl font-bold text-primary">PW</span>
            </div>
            <h3 className="text-xl font-bold mb-1">Piotr Wiśniewski</h3>
            <p className="text-gray-600 mb-2">Dyrektor ds. Designu</p>
            <p className="text-sm text-gray-500">
              Piotr dba o to, aby nasze produkty były nie tylko funkcjonalne, ale również estetyczne i wygodne w użyciu.
            </p>
          </div>
          <div className="text-center">
            <div className="h-40 w-40 rounded-full bg-gray-200 mx-auto mb-4 flex items-center justify-center">
              <span className="text-2xl font-bold text-primary">KL</span>
            </div>
            <h3 className="text-xl font-bold mb-1">Katarzyna Lewandowska</h3>
            <p className="text-gray-600 mb-2">Dyrektor ds. Marketingu</p>
            <p className="text-sm text-gray-500">
              Katarzyna odpowiada za strategię marketingową i budowanie świadomości marki My Tech Glasses.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}