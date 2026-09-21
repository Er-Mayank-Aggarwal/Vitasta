'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/app/context/CartContext';
import { useSession } from '@/lib/auth-client';
import { createOrder } from '@/app/actions/checkout-actions';
import {
  ShoppingBag,
  ShieldCheck,
  Video,
  ArrowRight,
  Sparkles,
  Lock,
  AlertCircle,
  Clock,
  Phone,
} from 'lucide-react';

export default function CheckoutPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const { items, cartTotal, clearCart } = useCart();

  const [formData, setFormData] = useState({
    fullName: session?.user?.name || '',
    email: session?.user?.email || '',
    phone: session?.user?.phone || '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: 'Rajasthan',
    pincode: '',
    notes: '',
    saveAddress: true,
  });

  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formattedTotal = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(cartTotal);

  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center py-16 px-4">
        <div className="text-center max-w-md bg-white p-8 rounded-2xl border border-neutral-200 shadow-xl space-y-4">
          <ShoppingBag className="w-12 h-12 text-neutral-400 mx-auto" />
          <h2 className="font-serif text-2xl font-bold text-[#0B3B60]">
            Your Bag is Empty
          </h2>
          <p className="text-xs text-neutral-500">
            Please add a royal saree to your bag before proceeding to atelier checkout.
          </p>
          <Link
            href="/shop"
            className="inline-block px-6 py-3 rounded-full bg-[#0B3B60] hover:bg-[#071E3D] text-white text-xs font-semibold uppercase tracking-wider shadow"
          >
            Explore Royal Sarees
          </Link>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const orderPayload = {
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        addressLine1: formData.addressLine1,
        addressLine2: formData.addressLine2 || null,
        city: formData.city,
        state: formData.state,
        pincode: formData.pincode,
        notes: formData.notes || null,
        saveAddress: formData.saveAddress,
        items: items.map((item) => ({
          id: item.id,
          title: item.title,
          category: item.category,
          fabric: item.fabric,
          color: item.color,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
        })),
      };

      const result = await createOrder(orderPayload);

      if (!result.success) {
        setError(result.error || 'Failed to place order. Please try again.');
        setIsSubmitting(false);
        return;
      }

      // Clear Cart and route to Invoice / Confirmation page
      clearCart();
      router.push(`/invoice/${result.orderId}`);
    } catch (err) {
      setError(err.message || 'An unexpected error occurred during checkout.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen py-10 sm:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center max-w-2xl mx-auto mb-10">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-widest text-[#0B3B60] bg-[#0B3B60]/10 mb-2 border border-[#0B3B60]/20">
          <Lock className="w-3.5 h-3.5 text-[#C1272D]" /> Sovereign Atelier Checkout
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#0B3B60]">
          Confirm Your Bespoke Saree Order
        </h1>
        <p className="text-xs text-neutral-500 mt-1">
          Complimentary fall-pico finishing & pre-dispatch loom video inspection included.
        </p>
      </div>

      {error && (
        <div className="max-w-4xl mx-auto mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-3">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* Left Form: Delivery Address */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-neutral-200 shadow-sm space-y-4">
            <h2 className="font-serif text-lg font-bold text-[#0B3B60] flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#C1272D]" /> 1. Delivery & Royal Patron Contact
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Smt. Radhika Sharma"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-neutral-300 bg-neutral-50/50 text-[#1A1A1A] focus:outline-none focus:ring-2 focus:ring-[#0B3B60] focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Phone (WhatsApp for Loom Video) *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="+91 98765 43210"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-neutral-300 bg-neutral-50/50 text-[#1A1A1A] focus:outline-none focus:ring-2 focus:ring-[#0B3B60] focus:bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Email Address *
              </label>
              <input
                type="email"
                required
                placeholder="patron@vitasta.luxury"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-neutral-300 bg-neutral-50/50 text-[#1A1A1A] focus:outline-none focus:ring-2 focus:ring-[#0B3B60] focus:bg-white"
              />
            </div>

            <div className="pt-2 border-t border-neutral-100">
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Street Address / House No. *
              </label>
              <input
                type="text"
                required
                placeholder="Flat / House No., Apartment, Street name"
                value={formData.addressLine1}
                onChange={(e) => setFormData({ ...formData, addressLine1: e.target.value })}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-neutral-300 bg-neutral-50/50 text-[#1A1A1A] focus:outline-none focus:ring-2 focus:ring-[#0B3B60] focus:bg-white mb-3"
              />

              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Landmark / Area (Optional)
              </label>
              <input
                type="text"
                placeholder="Near landmark or colony name"
                value={formData.addressLine2}
                onChange={(e) => setFormData({ ...formData, addressLine2: e.target.value })}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-neutral-300 bg-neutral-50/50 text-[#1A1A1A] focus:outline-none focus:ring-2 focus:ring-[#0B3B60] focus:bg-white"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  City *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Jaipur"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-neutral-300 bg-neutral-50/50 text-[#1A1A1A] focus:outline-none focus:ring-2 focus:ring-[#0B3B60] focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  State *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rajasthan"
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-neutral-300 bg-neutral-50/50 text-[#1A1A1A] focus:outline-none focus:ring-2 focus:ring-[#0B3B60] focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  PIN Code *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 342001"
                  value={formData.pincode}
                  onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-neutral-300 bg-neutral-50/50 text-[#1A1A1A] focus:outline-none focus:ring-2 focus:ring-[#0B3B60] focus:bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Special Tailoring / Adda Customization Notes (Optional)
              </label>
              <textarea
                rows={2}
                placeholder="Mention any specific blouse unstitched requirements or event date..."
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-neutral-300 bg-neutral-50/50 text-[#1A1A1A] focus:outline-none focus:ring-2 focus:ring-[#0B3B60] focus:bg-white"
              />
            </div>
          </div>
        </div>

        {/* Right Form: Order Summary & Placement */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-neutral-200 shadow-xl space-y-6 sticky top-24">
            <h2 className="font-serif text-lg font-bold text-[#0B3B60] flex items-center justify-between">
              <span>Order Summary</span>
              <span className="text-xs font-sans text-neutral-400 font-normal">
                {items.length} {items.length === 1 ? 'Saree' : 'Sarees'}
              </span>
            </h2>

            {/* Items List */}
            <div className="divide-y divide-neutral-100 max-h-60 overflow-y-auto pr-1">
              {items.map((item) => (
                <div key={item.id} className="py-3 flex items-center gap-3">
                  <div className="relative w-14 h-16 rounded-lg overflow-hidden shrink-0 bg-neutral-100">
                    {item.image && (
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        className="object-cover object-top"
                      />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-serif text-xs font-bold text-neutral-900 truncate">
                      {item.title}
                    </h4>
                    <p className="text-[10px] text-neutral-500 uppercase">{item.fabric || 'Royal Silk'}</p>
                    <span className="text-xs text-[#0B3B60] font-bold">
                      ₹{item.price.toLocaleString('en-IN')} × {item.quantity}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Calculations */}
            <div className="space-y-2.5 pt-3 border-t border-neutral-100 text-xs">
              <div className="flex justify-between text-neutral-600">
                <span>Subtotal</span>
                <span className="font-semibold text-neutral-900">
                  {formattedTotal}
                </span>
              </div>
              <div className="flex justify-between text-neutral-600">
                <span>Handloom Finishing & Fall-Pico</span>
                <span className="text-emerald-700 font-semibold">Complimentary</span>
              </div>
              <div className="flex justify-between text-neutral-600">
                <span>Insured Sovereign Dispatch</span>
                <span className="text-emerald-700 font-semibold">Free Across India</span>
              </div>
              <div className="pt-3 border-t border-neutral-200 flex justify-between font-serif text-base font-bold text-[#0B3B60]">
                <span>Total Amount</span>
                <span>{formattedTotal}</span>
              </div>
            </div>

            {/* Assurance Note */}
            <div className="p-3.5 rounded-xl bg-amber-50/80 border border-amber-200 text-[11px] text-neutral-700 space-y-1.5">
              <div className="flex items-center gap-1.5 font-bold text-[#0B3B60]">
                <Video className="w-3.5 h-3.5 text-[#C1272D]" /> Pre-Dispatch Loom Video Included
              </div>
              <p>
                A high-definition video of your saree will be recorded and sent to your WhatsApp ({formData.phone || 'provided number'}) before dispatch.
              </p>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 px-6 rounded-xl bg-[#C1272D] hover:bg-[#A01F25] text-white font-bold text-xs uppercase tracking-widest shadow-xl hover:shadow-2xl transition active:scale-[0.99] disabled:opacity-60 flex items-center justify-center gap-2 cursor-pointer"
            >
              {isSubmitting ? (
                'Registering Atelier Order...'
              ) : (
                <>
                  Confirm Order & Generate Invoice <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
