'use client';

import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/app/context/CartContext';

export default function CartDrawer() {
  const {
    items,
    removeFromCart,
    updateQuantity,
    isDrawerOpen,
    setIsDrawerOpen,
    cartTotal,
    cartCount,
  } = useCart();

  if (!isDrawerOpen) return null;

  const formattedTotal = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(cartTotal);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={() => setIsDrawerOpen(false)}
        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-300 animate-in fade-in"
      />

      {/* Slide-out Panel */}
      <div className="fixed inset-y-0 right-0 max-w-full flex sm:pl-10">
        <div className="w-screen max-w-md bg-white border-l border-neutral-200 shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
          {/* Header */}
          <div className="p-4 sm:p-6 border-b border-neutral-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#0B3B60]" />
              <h2 className="font-serif text-lg font-bold text-[#0B3B60]">
                Atelier Bag ({cartCount})
              </h2>
            </div>
            <button
              type="button"
              onClick={() => setIsDrawerOpen(false)}
              className="p-2 text-neutral-400 hover:text-neutral-700 rounded-full hover:bg-neutral-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
            {items.length === 0 ? (
              <div className="text-center py-16 space-y-4">
                <div className="w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center mx-auto text-neutral-400">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="font-serif text-base font-bold text-neutral-800">
                  Your Atelier Bag is Empty
                </h3>
                <p className="text-xs text-neutral-500 max-w-xs mx-auto">
                  Explore our handcrafted royal saree collections from Jodhpur and add your favorite creations.
                </p>
                <Link
                  href="/shop"
                  onClick={() => setIsDrawerOpen(false)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#C1272D] hover:bg-[#9B1B1E] text-white text-xs font-semibold uppercase tracking-wider transition shadow-sm"
                >
                  <Sparkles className="w-3.5 h-3.5" /> Explore Sarees
                </Link>
              </div>
            ) : (
              items.map((item) => {
                const itemPrice = new Intl.NumberFormat('en-IN', {
                  style: 'currency',
                  currency: 'INR',
                  maximumFractionDigits: 0,
                }).format(item.price);

                return (
                  <div
                    key={item.id}
                    className="flex gap-4 p-3 rounded-xl border border-neutral-100 bg-neutral-50/50"
                  >
                    <div className="relative w-20 h-24 rounded-lg overflow-hidden shrink-0 bg-neutral-200">
                      {item.image ? (
                        <Image
                          src={item.image}
                          alt={item.title}
                          fill
                          className="object-cover object-top"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-neutral-400 text-xs">
                          No image
                        </div>
                      )}
                    </div>

                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <span className="text-[10px] uppercase font-semibold text-[#C1272D] tracking-wider">
                          {item.category || item.fabric || 'Royal Saree'}
                        </span>
                        <h4 className="font-serif text-xs sm:text-sm font-bold text-neutral-900 line-clamp-1">
                          {item.title}
                        </h4>
                        <span className="font-serif text-xs font-bold text-[#0B3B60]">
                          {itemPrice}
                        </span>
                      </div>

                      <div className="flex items-center justify-between mt-2">
                        {/* Quantity Stepper */}
                        <div className="flex items-center border border-neutral-200 rounded-lg bg-white">
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="p-1 text-neutral-500 hover:text-neutral-900"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-2 text-xs font-semibold text-neutral-800">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="p-1 text-neutral-500 hover:text-neutral-900"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        {/* Remove */}
                        <button
                          type="button"
                          onClick={() => removeFromCart(item.id)}
                          className="text-neutral-400 hover:text-rose-600 p-1 transition"
                          title="Remove Saree"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer / Summary */}
          {items.length > 0 && (
            <div className="p-4 sm:p-6 border-t border-neutral-200 bg-neutral-50 space-y-3">
              <div className="flex items-center justify-between text-xs text-neutral-600">
                <span>Finishing & Handloom Inspection</span>
                <span className="text-emerald-700 font-semibold">Complimentary</span>
              </div>
              <div className="flex items-center justify-between text-xs text-neutral-600">
                <span>Insured Sovereign Delivery</span>
                <span className="text-emerald-700 font-semibold">Free Across India</span>
              </div>

              <div className="pt-2 border-t border-neutral-200 flex items-center justify-between">
                <span className="font-serif text-sm font-bold text-neutral-900">
                  Estimated Total
                </span>
                <span className="font-serif text-lg font-bold text-[#0B3B60]">
                  {formattedTotal}
                </span>
              </div>

              <div className="flex items-center gap-1.5 text-[11px] text-neutral-500">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Pre-dispatch loom video shared prior to courier dispatch.</span>
              </div>

              <Link
                href="/checkout"
                onClick={() => setIsDrawerOpen(false)}
                className="w-full py-3.5 px-4 rounded-xl bg-[#C1272D] hover:bg-[#9B1B1E] text-white font-semibold text-xs tracking-wider uppercase flex items-center justify-center gap-2 shadow-md transition active:scale-[0.99]"
              >
                Proceed to Checkout <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
