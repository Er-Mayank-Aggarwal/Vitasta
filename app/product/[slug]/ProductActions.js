'use client';

import { useState } from 'react';
import {
  ShoppingBag,
  Heart,
  Phone,
  CheckCircle2,
  Video,
  ShieldCheck,
  Clock,
  Sparkles,
  AlertTriangle,
  Lock,
} from 'lucide-react';
import { useCart } from '@/app/context/CartContext';
import { useSession } from '@/lib/auth-client';
import { toggleWishlist } from '@/app/actions/wishlist-actions';

export default function ProductActions({ product }) {
  const { data: session } = useSession();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [shortlisted, setShortlisted] = useState(false);
  const [added, setAdded] = useState(false);

  const inv = product.inventory;
  const availableQty = inv?.quantity !== undefined ? inv.quantity : 10;
  const lowThreshold = inv?.lowStockThreshold || 2;
  const isOutOfStock = availableQty === 0 || product.stockStatus === 'OUT_OF_STOCK';
  const isLowStock = !isOutOfStock && availableQty <= lowThreshold;

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    const success = addToCart(product, quantity);
    if (success) {
      setAdded(true);
      setTimeout(() => setAdded(false), 1500);
    }
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
      {/* Live Inventory Status Bar */}
      <div className="flex items-center gap-2 text-xs">
        {isOutOfStock ? (
          <div className="px-3.5 py-1.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 font-semibold flex items-center gap-1.5 shadow-2xs">
            <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
            <span>Currently Out of Stock • Custom Loom Booking Only</span>
          </div>
        ) : isLowStock ? (
          <div className="px-3.5 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 font-semibold flex items-center gap-1.5 shadow-2xs animate-pulse">
            <Sparkles className="w-3.5 h-3.5 text-[#C1272D]" />
            <span>⚡ Rare Loom Piece — Only {availableQty} left ready for dispatch</span>
          </div>
        ) : (
          <div className="px-3.5 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 font-semibold flex items-center gap-1.5 shadow-2xs">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Handcrafted in Jodhpur Atelier • {availableQty} Units Ready to Ship</span>
          </div>
        )}
      </div>

      {/* Desktop / Standard Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          type="button"
          disabled={isOutOfStock}
          onClick={handleAddToCart}
          className={`flex-1 py-3.5 px-6 rounded-xl font-bold text-xs uppercase tracking-widest transition active:scale-[0.99] flex items-center justify-center gap-2 ${
            isOutOfStock
              ? 'bg-neutral-200 text-neutral-500 cursor-not-allowed border border-neutral-300'
              : 'bg-[#0B3B60] hover:bg-[#062238] text-white hover:shadow-lg cursor-pointer'
          }`}
        >
          {added ? (
            <>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Added to Atelier Bag
            </>
          ) : isOutOfStock ? (
            <>
              <Lock className="w-4 h-4" /> Out of Stock
            </>
          ) : !session?.user ? (
            <>
              <Lock className="w-4 h-4 text-amber-300" /> Sign In to Add to Bag
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
          className="py-3.5 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs uppercase tracking-wider transition flex items-center justify-center gap-2 shadow-xs cursor-pointer"
        >
          <Phone className="w-4 h-4" /> WhatsApp Consultation
        </a>

        <button
          type="button"
          onClick={handleShortlist}
          className={`p-3.5 rounded-xl border transition flex items-center justify-center cursor-pointer ${
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
          <Video className="w-4 h-4 text-[#C1272D]" /> Pre-Dispatch Video Guarantee
        </div>
        <p className="leading-relaxed">
          Before your handcrafted {product.productType === 'SUIT' || product.categoryId?.includes('suit') ? 'suit set' : 'saree'} is packed and dispatched from Jodhpur, our master artisan team records a detailed HD video of the complete product and shares it directly to your WhatsApp for transparent verification.
        </p>
        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-blue-200/60 text-[11px]">
          <span className="flex items-center gap-1.5 font-medium text-[#0B3B60]">
            <Clock className="w-3.5 h-3.5" /> 15–30 Days Handcrafted
          </span>
          <span className="flex items-center gap-1.5 font-medium text-emerald-700">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Insured Sovereign Courier
          </span>
        </div>
      </div>

      {/* Mobile Sticky Bottom Floating Action Bar */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-neutral-200 px-4 py-3 flex items-center gap-2 shadow-2xl">
        <button
          type="button"
          disabled={isOutOfStock}
          onClick={handleAddToCart}
          className={`flex-1 py-3 px-4 rounded-xl font-bold text-xs uppercase tracking-wider shadow-sm flex items-center justify-center gap-1.5 ${
            isOutOfStock
              ? 'bg-neutral-300 text-neutral-500 cursor-not-allowed'
              : 'bg-[#0B3B60] text-white'
          }`}
        >
          {added ? (
            <>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Added
            </>
          ) : isOutOfStock ? (
            <>
              <Lock className="w-4 h-4" /> Out of Stock
            </>
          ) : !session?.user ? (
            <>
              <Lock className="w-4 h-4 text-amber-300" /> Sign In to Bag
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
