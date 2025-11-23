'use client'

import { Fragment } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { XMarkIcon, TrashIcon, PlusIcon, MinusIcon, ShoppingBagIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'
import { useCart } from '@/hooks/useCart'
import { getFreeShippingRemaining, isFreeShippingEligible } from '@/lib/cart'

interface CartDrawerProps {
    isOpen: boolean
    onClose: () => void
}

const CartDrawer = ({ isOpen, onClose }: CartDrawerProps) => {
    const { items, summary, updateQuantity, removeItem, isEmpty } = useCart()

    return (
        <Transition.Root show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={onClose}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-in-out duration-500"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in-out duration-500"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity backdrop-blur-sm" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-hidden">
                    <div className="absolute inset-0 overflow-hidden">
                        <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
                            <Transition.Child
                                as={Fragment}
                                enter="transform transition ease-in-out duration-500 sm:duration-700"
                                enterFrom="translate-x-full"
                                enterTo="translate-x-0"
                                leave="transform transition ease-in-out duration-500 sm:duration-700"
                                leaveFrom="translate-x-0"
                                leaveTo="translate-x-full"
                            >
                                <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                                    <div className="flex h-full flex-col overflow-y-scroll bg-white dark:bg-neutral-900 shadow-xl">
                                        <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
                                            <div className="flex items-start justify-between">
                                                <Dialog.Title className="text-lg font-bold font-heading text-gray-900 dark:text-white">
                                                    Twój koszyk ({items.length})
                                                </Dialog.Title>
                                                <div className="ml-3 flex h-7 items-center">
                                                    <button
                                                        type="button"
                                                        className="relative -m-2 p-2 text-gray-400 hover:text-gray-500"
                                                        onClick={onClose}
                                                    >
                                                        <span className="absolute -inset-0.5" />
                                                        <span className="sr-only">Zamknij panel</span>
                                                        <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                                                    </button>
                                                </div>
                                            </div>

                                            {isEmpty() ? (
                                                <div className="flex flex-col items-center justify-center h-full text-center space-y-4 mt-20">
                                                    <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                                                        <ShoppingBagIcon className="w-10 h-10 text-gray-400" />
                                                    </div>
                                                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                                                        Twój koszyk jest pusty
                                                    </h3>
                                                    <p className="text-gray-500 dark:text-gray-400 max-w-xs">
                                                        Wygląda na to, że nie dodałeś jeszcze żadnych produktów.
                                                    </p>
                                                    <button
                                                        onClick={onClose}
                                                        className="btn btn-primary mt-4"
                                                    >
                                                        Wróć do zakupów
                                                    </button>
                                                </div>
                                            ) : (
                                                <div className="mt-8">
                                                    <div className="flow-root">
                                                        <ul role="list" className="-my-6 divide-y divide-gray-200 dark:divide-gray-700">
                                                            {items.map((item) => (
                                                                <li key={item.id} className="flex py-6">
                                                                    <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                                                                        <span className="text-4xl">{item.emoji}</span>
                                                                    </div>

                                                                    <div className="ml-4 flex flex-1 flex-col">
                                                                        <div>
                                                                            <div className="flex justify-between text-base font-medium text-gray-900 dark:text-white">
                                                                                <h3>
                                                                                    <Link href={`/products/${item.productId}`} onClick={onClose}>
                                                                                        {item.name}
                                                                                    </Link>
                                                                                </h3>
                                                                                <p className="ml-4">{item.price * item.quantity} zł</p>
                                                                            </div>
                                                                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{item.color}</p>
                                                                        </div>
                                                                        <div className="flex flex-1 items-end justify-between text-sm">
                                                                            <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-lg">
                                                                                <button
                                                                                    onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                                                                                    className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-l-lg"
                                                                                    disabled={item.quantity <= 1}
                                                                                >
                                                                                    <MinusIcon className="w-4 h-4" />
                                                                                </button>
                                                                                <span className="px-2 font-medium">{item.quantity}</span>
                                                                                <button
                                                                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                                                    className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-r-lg"
                                                                                >
                                                                                    <PlusIcon className="w-4 h-4" />
                                                                                </button>
                                                                            </div>

                                                                            <button
                                                                                type="button"
                                                                                onClick={() => removeItem(item.id)}
                                                                                className="font-medium text-red-600 hover:text-red-500 flex items-center"
                                                                            >
                                                                                <TrashIcon className="w-4 h-4 mr-1" />
                                                                                Usuń
                                                                            </button>
                                                                        </div>
                                                                    </div>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        {!isEmpty() && (
                                            <div className="border-t border-gray-200 dark:border-gray-700 px-4 py-6 sm:px-6 bg-gray-50 dark:bg-neutral-900">
                                                {/* Free Shipping Progress */}
                                                <div className="mb-6">
                                                    {isFreeShippingEligible(summary.subtotal) ? (
                                                        <div className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 px-4 py-2 rounded-lg text-sm font-medium text-center">
                                                            🎉 Masz darmową dostawę!
                                                        </div>
                                                    ) : (
                                                        <div className="space-y-2">
                                                            <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                                                                <span>Brakuje {getFreeShippingRemaining(summary.subtotal)} zł do darmowej dostawy</span>
                                                                <span>{Math.min(100, Math.round((summary.subtotal / 500) * 100))}%</span>
                                                            </div>
                                                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                                                <div
                                                                    className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                                                                    style={{ width: `${Math.min(100, (summary.subtotal / 500) * 100)}%` }}
                                                                />
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="flex justify-between text-base font-medium text-gray-900 dark:text-white mb-4">
                                                    <p>Suma częściowa</p>
                                                    <p>{summary.subtotal} zł</p>
                                                </div>
                                                <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400 mb-6">
                                                    Dostawa i podatki obliczane przy kasie.
                                                </p>
                                                <div className="space-y-3">
                                                    <Link
                                                        href="/checkout"
                                                        className="btn btn-primary w-full flex items-center justify-center py-4 text-lg"
                                                        onClick={onClose}
                                                    >
                                                        Przejdź do kasy
                                                    </Link>
                                                    <Link
                                                        href="/cart"
                                                        className="btn btn-outline w-full flex items-center justify-center py-3"
                                                        onClick={onClose}
                                                    >
                                                        Zobacz pełny koszyk
                                                    </Link>
                                                </div>
                                                <div className="mt-6 flex justify-center text-center text-sm text-gray-500 dark:text-gray-400">
                                                    <p>
                                                        lub{' '}
                                                        <button
                                                            type="button"
                                                            className="font-medium text-blue-600 hover:text-blue-500"
                                                            onClick={onClose}
                                                        >
                                                            Kontynuuj zakupy
                                                            <span aria-hidden="true"> &rarr;</span>
                                                        </button>
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </div>
            </Dialog>
        </Transition.Root>
    )
}

export default CartDrawer
