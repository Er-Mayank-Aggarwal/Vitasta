'use client';

import { useState } from 'react';
import { ShoppingBag, Heart, Phone, CheckCircle2, Video, ShieldCheck, Clock } from 'lucide-react';
import { useCart } from '@/app/context/CartContext';
import { toggleWishlist } from '@/app/actions/wishlist-actions';

export default function ProductActions({ product }) {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [shortlisted, setShortlisted] = useState(false);
  const [added, setAdded] = useState(false);

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const handleShortlist = async () => {
    const res = await toggleWishlist(product.id);
    if (res.success) {
      setShortlisted(res.shortlisted);
    }
  };

  const whatsappMessage = encodeURIComponent(
    `Hello Vitasta Atelier! I am interested in consulting regarding the *${product.title}* (₹${product.price}). Could you please share more details or custom blouse options?`
  );

  return (
    <div className="space-y-6 pt-4">
      {/* Desktop / Standard Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          type="button"
          onClick={handleAddToCart}
          className="flex-1 py-3.5 px-6 rounded-xl bg-[#0B3B60] hover:bg-[#062238] text-white font-bold text-xs uppercase tracking-widest hover:shadow-lg transition active:scale-[0.99] flex items-center justify-center gap-2"
        >
          {added ? (
            <>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Added to Atelier Bag
            </>
          ) : (
            <>
              <ShoppingBag className="w-4 h-4" /> Add to Atelier Bag
            </>
          )}
        </button>

        <a
          href={`https://wa.me/918824017443?text=${whatsappMessage}`}
          target="_blank"
          rel="noopener noreferrer"
          className="py-3.5 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs uppercase tracking-wider transition flex items-center justify-center gap-2 shadow-xs"
        >
          <Phone className="w-4 h-4" /> WhatsApp Consultation
        </a>

        <button
          type="button"
          onClick={handleShortlist}
          className={`p-3.5 rounded-xl border transition flex items-center justify-center ${
            shortlisted
              ? 'border-[#C1272D] bg-rose-50 text-[#C1272D]'
              : 'border-neutral-200 hover:border-[#C1272D] text-neutral-600'
          }`}
          title={shortlisted ? 'In Shortlist' : 'Add to Shortlist'}
        >
          <Heart className={`w-5 h-5 ${shortlisted ? 'fill-current' : ''}`} />
        </button>
      </div>

      {/* Assurance Callout */}
      <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-200 space-y-2.5 text-xs text-neutral-700">
        <div className="flex items-center gap-2 text-[#0B3B60] font-bold uppercase tracking-wider text-[11px]">
          <Video className="w-4 h-4" /> Pre-Dispatch Loom Video Guarantee
        </div>
        <p className="leading-relaxed">
          Before your handcrafted saree is packed and dispatched from Jodhpur, our master artisan team records a detailed HD video of the complete product and shares it directly to your WhatsApp for transparent verification.
        </p>
        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-blue-200/60 text-[11px]">
          <span className="flex items-center gap-1.5 font-medium text-[#0B3B60]">
            <Clock className="w-3.5 h-3.5" /> 15–30 Days Handcrafted
          </span>
          <span className="flex items-center gap-1.5 font-medium text-emerald-700">
            <ShieldCheck className="w-3.5 h-3.5" /> Insured Sovereign Courier
          </span>
        </div>
      </div>

      {/* Mobile Sticky Bottom Floating Action Bar */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-neutral-200 px-4 py-3 flex items-center gap-2 shadow-2xl">
        <button
          type="button"
          onClick={handleAddToCart}
          className="flex-1 py-3 px-4 rounded-xl bg-[#0B3B60] text-white font-bold text-xs uppercase tracking-wider shadow-sm flex items-center justify-center gap-1.5"
        >
          {added ? (
            <>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Added
            </>
          ) : (
            <>
              <ShoppingBag className="w-4 h-4" /> Add to Bag
            </>
          )}
        </button>

        <a
          href={`https://wa.me/918824017443?text=${whatsappMessage}`}
          target="_blank"
          rel="noopener noreferrer"
          className="p-3 rounded-xl bg-emerald-600 text-white shadow-xs flex items-center justify-center shrink-0"
          title="WhatsApp Consult"
        >
          <Phone className="w-4 h-4" />
        </a>

        <button
          type="button"
          onClick={handleShortlist}
          className={`p-3 rounded-xl border shrink-0 ${
            shortlisted
              ? 'border-[#C1272D] bg-rose-50 text-[#C1272D]'
              : 'border-neutral-200 text-neutral-600'
          }`}
          title="Shortlist"
        >
          <Heart className={`w-4 h-4 ${shortlisted ? 'fill-current' : ''}`} />
        </button>
      </div>
    </div>
  );
}
