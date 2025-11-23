'use client'

import { useState } from 'react'
import { SparklesIcon, CameraIcon, SpeakerWaveIcon, Battery50Icon } from '@heroicons/react/24/outline'

const features = [
    {
        id: 'ai',
        title: 'Asystent AI',
        description: 'Zintegrowany ChatGPT i Deep Seek odpowiadają na Twoje pytania w czasie rzeczywistym. Tłumacz teksty, identyfikuj obiekty i otrzymuj wskazówki nawigacyjne bez wyciągania telefonu.',
        icon: SparklesIcon,
        color: 'blue',
        image: '🤖'
    },
    {
        id: 'camera',
        title: 'Kamera 1200P',
        description: 'Uchwyć każdą chwilę z perspektywy pierwszej osoby. Stabilizacja obrazu, HDR i natychmiastowa synchronizacja ze smartfonem pozwalają dzielić się przeżyciami w mgnieniu oka.',
        icon: CameraIcon,
        color: 'purple',
        image: '📸'
    },
    {
        id: 'audio',
        title: 'Dźwięk Przestrzenny',
        description: 'Otwarte słuchawki z technologią kierunkową zapewniają prywatność rozmów i doskonałą jakość muzyki, jednocześnie pozwalając Ci słyszeć otoczenie dla bezpieczeństwa.',
        icon: SpeakerWaveIcon,
        color: 'pink',
        image: '🎧'
    },
    {
        id: 'battery',
        title: 'Cały Dzień Baterii',
        description: 'Wydajna bateria zapewnia do 12 godzin pracy na jednym ładowaniu. Etui ładujące dodaje kolejne 24 godziny, więc Twoje okulary są zawsze gotowe do działania.',
        icon: Battery50Icon,
        color: 'green',
        image: '🔋'
    }
]

const WhyChooseUs = () => {
    const [activeFeature, setActiveFeature] = useState(features[0])

    return (
        <section className="section bg-white dark:bg-neutral-900 overflow-hidden">
            <div className="container">
                <div className="text-center mb-16">
                    <span className="text-blue-600 dark:text-blue-400 font-bold tracking-wider uppercase text-sm mb-2 block">
                        Technologia
                    </span>
                    <h2 className="text-3xl md:text-4xl font-bold font-heading mb-4">
                        Dlaczego My Tech Glasses?
                    </h2>
                    <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                        Poznaj funkcje, które sprawiają, że nasze okulary są bezkonkurencyjne.
                    </p>
                </div>

                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    {/* Feature List */}
                    <div className="space-y-4">
                        {features.map((feature) => (
                            <button
                                key={feature.id}
                                onClick={() => setActiveFeature(feature)}
                                className={`w-full text-left p-6 rounded-2xl transition-all duration-300 border-2 group ${activeFeature.id === feature.id
                                        ? 'bg-gray-50 dark:bg-white/5 border-blue-500 shadow-lg scale-105'
                                        : 'bg-transparent border-transparent hover:bg-gray-50 dark:hover:bg-white/5'
                                    }`}
                            >
                                <div className="flex items-start gap-4">
                                    <div className={`p-3 rounded-xl ${activeFeature.id === feature.id
                                            ? 'bg-blue-500 text-white'
                                            : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/30 group-hover:text-blue-600'
                                        }`}>
                                        <feature.icon className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className={`font-bold text-lg mb-1 ${activeFeature.id === feature.id ? 'text-blue-600 dark:text-blue-400' : 'text-gray-900 dark:text-white'
                                            }`}>
                                            {feature.title}
                                        </h3>
                                        <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                                            {feature.description}
                                        </p>
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>

                    {/* Visual Preview */}
                    <div className="relative h-[500px] bg-gray-100 dark:bg-gray-800 rounded-3xl overflow-hidden shadow-2xl border border-gray-200 dark:border-gray-700">
                        <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900" />

                        {/* Animated Background Elements */}
                        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full blur-3xl opacity-30 transition-colors duration-500 bg-${activeFeature.color}-500`} />

                        <div className="absolute inset-0 flex items-center justify-center">
                            <div key={activeFeature.id} className="text-center animate-fade-in">
                                <div className="text-9xl mb-8 transform hover:scale-110 transition-transform duration-500 cursor-default select-none">
                                    {activeFeature.image}
                                </div>
                                <div className="inline-block px-6 py-2 rounded-full bg-white/90 dark:bg-black/50 backdrop-blur shadow-lg border border-white/20">
                                    <span className={`font-bold text-${activeFeature.color}-500`}>
                                        {activeFeature.title}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Decorative UI Elements */}
                        <div className="absolute bottom-8 left-8 right-8 p-4 bg-white/80 dark:bg-black/80 backdrop-blur rounded-xl border border-white/20 shadow-lg transform translate-y-full opacity-0 transition-all duration-500 lg:translate-y-0 lg:opacity-100">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-500">Status</span>
                                <span className="flex items-center text-green-500 font-medium">
                                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse" />
                                    Aktywny
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default WhyChooseUs
