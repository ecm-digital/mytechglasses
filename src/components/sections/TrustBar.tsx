'use client'

import { ShieldCheckIcon, TruckIcon, ArrowPathIcon } from '@heroicons/react/24/outline'

const TrustBar = () => {
    return (
        <section className="py-10 border-y border-neutral-200 dark:border-neutral-800 bg-white/50 dark:bg-neutral-900/50 backdrop-blur-sm">
            <div className="container">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                    {/* Benefit 1 */}
                    <div className="flex items-center justify-center space-x-4 group">
                        <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                            <TruckIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                            <h4 className="font-bold text-neutral-900 dark:text-white">Darmowa dostawa</h4>
                            <p className="text-sm text-neutral-500 dark:text-neutral-400">Dla wszystkich zamówień</p>
                        </div>
                    </div>

                    {/* Benefit 2 */}
                    <div className="flex items-center justify-center space-x-4 group">
                        <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                            <ArrowPathIcon className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                        </div>
                        <div>
                            <h4 className="font-bold text-neutral-900 dark:text-white">30 dni na zwrot</h4>
                            <p className="text-sm text-neutral-500 dark:text-neutral-400">Gwarancja satysfakcji</p>
                        </div>
                    </div>

                    {/* Benefit 3 */}
                    <div className="flex items-center justify-center space-x-4 group">
                        <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                            <ShieldCheckIcon className="w-6 h-6 text-green-600 dark:text-green-400" />
                        </div>
                        <div>
                            <h4 className="font-bold text-neutral-900 dark:text-white">2 lata gwarancji</h4>
                            <p className="text-sm text-neutral-500 dark:text-neutral-400">Pełne wsparcie techniczne</p>
                        </div>
                    </div>
                </div>

                {/* Partner Logos */}
                <div className="text-center">
                    <p className="text-sm font-medium text-neutral-400 uppercase tracking-wider mb-6">
                        Zaufali nam innowatorzy z
                    </p>
                    <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
                        {/* Placeholder Logos using text for now, but styled to look like logos */}
                        <span className="text-xl font-bold font-heading text-neutral-600 dark:text-neutral-300">TechCrunch</span>
                        <span className="text-xl font-bold font-heading text-neutral-600 dark:text-neutral-300">WIRED</span>
                        <span className="text-xl font-bold font-heading text-neutral-600 dark:text-neutral-300">The Verge</span>
                        <span className="text-xl font-bold font-heading text-neutral-600 dark:text-neutral-300">Forbes</span>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default TrustBar
