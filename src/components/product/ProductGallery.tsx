'use client'

import { useState } from 'react'
import Image from 'next/image'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline'

interface ProductGalleryProps {
    images: string[]
    name: string
}

// Fallback images if none provided
const DEFAULT_IMAGES = [
    '/images/products/glasses-front.jpg',
    '/images/products/glasses-side.jpg',
    '/images/products/glasses-angle.jpg',
    '/images/products/glasses-case.jpg',
]

const ProductGallery = ({ images = [], name }: ProductGalleryProps) => {
    // Use provided images or defaults if empty
    const displayImages = images.length > 0 ? images : DEFAULT_IMAGES
    const [selectedIndex, setSelectedIndex] = useState(0)

    const handlePrevious = () => {
        setSelectedIndex((prev) => (prev === 0 ? displayImages.length - 1 : prev - 1))
    }

    const handleNext = () => {
        setSelectedIndex((prev) => (prev === displayImages.length - 1 ? 0 : prev + 1))
    }

    return (
        <div className="space-y-4">
            {/* Main Image Area */}
            <div className="relative aspect-square bg-gray-100 dark:bg-gray-800 rounded-2xl overflow-hidden group">
                <div className="absolute inset-0 flex items-center justify-center bg-white dark:bg-neutral-900">
                    {/* Render actual image if available, otherwise fallback to emoji for testing if paths are invalid */}
                    {displayImages[selectedIndex] ? (
                        <div className="relative w-full h-full">
                            <Image
                                src={displayImages[selectedIndex]}
                                alt={`${name} - view ${selectedIndex + 1}`}
                                fill
                                className="object-contain p-4 transition-transform duration-500 group-hover:scale-105"
                                sizes="(max-width: 768px) 100vw, 50vw"
                                priority={selectedIndex === 0}
                            />
                        </div>
                    ) : (
                        <span className="text-9xl select-none transition-transform duration-500 group-hover:scale-110">
                            {selectedIndex === 0 ? '🥽' : selectedIndex === 1 ? '👓' : selectedIndex === 2 ? '🕶️' : '📦'}
                        </span>
                    )}
                </div>

                {/* Navigation Arrows */}
                {displayImages.length > 1 && (
                    <>
                        <button
                            onClick={(e) => { e.stopPropagation(); handlePrevious(); }}
                            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 dark:bg-black/50 backdrop-blur flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white dark:hover:bg-black shadow-lg"
                            aria-label="Previous image"
                        >
                            <ChevronLeftIcon className="w-6 h-6 text-gray-900 dark:text-white" />
                        </button>

                        <button
                            onClick={(e) => { e.stopPropagation(); handleNext(); }}
                            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 dark:bg-black/50 backdrop-blur flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white dark:hover:bg-black shadow-lg"
                            aria-label="Next image"
                        >
                            <ChevronRightIcon className="w-6 h-6 text-gray-900 dark:text-white" />
                        </button>
                    </>
                )}

                {/* Badges/Overlays could go here */}
                <div className="absolute top-4 left-4">
                    <span className="bg-primary-500 text-white text-xs font-bold px-2 py-1 rounded-md shadow-sm">
                        NOWOŚĆ
                    </span>
                </div>
            </div>

            {/* Thumbnail Strip */}
            <div className="grid grid-cols-4 gap-4">
                {displayImages.map((image, index) => (
                    <button
                        key={index}
                        onClick={() => setSelectedIndex(index)}
                        className={`
              relative aspect-square rounded-xl overflow-hidden border-2 transition-all
              ${selectedIndex === index
                                ? 'border-primary-500 ring-2 ring-primary-500/20'
                                : 'border-transparent hover:border-gray-300 dark:hover:border-gray-600'
                            }
            `}
                    >
                        <div className="absolute inset-0 bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                            {image ? (
                                <div className="relative w-full h-full">
                                    <Image
                                        src={image}
                                        alt={`${name} - thumbnail ${index + 1}`}
                                        fill
                                        className="object-cover"
                                        sizes="100px"
                                    />
                                </div>
                            ) : (
                                <span className="text-2xl">
                                    {index === 0 ? '🥽' : index === 1 ? '👓' : index === 2 ? '🕶️' : '📦'}
                                </span>
                            )}
                        </div>
                    </button>
                ))}
            </div>
        </div>
    )
}

export default ProductGallery
