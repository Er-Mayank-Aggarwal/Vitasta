'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, ShoppingBag, Sparkles, Check } from 'lucide-react';
import { useCart } from '@/app/context/CartContext';
import { toggleWishlist } from '@/app/actions/wishlist-actions';

export default function ProductCard({ product, isShortlisted = false }) {
  const { addToCart } = useCart();
  const [shortlisted, setShortlisted] = useState(isShortlisted);
  const [isAdding, setIsAdding] = useState(false);
  const [addedSuccess, setAddedSuccess] = useState(false);

  const primaryImg =
    product.primaryImage ||
    (product.images && product.images[0]
      ? product.images[0].cdnUrl || product.images[0].assetPath
      : 'https://res.cloudinary.com/sjl1rfvu/image/upload/v1789675005/vitasta/brand/vitasta_logo_banner.jpg');

  const formattedPrice = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: product.currency || 'INR',
    maximumFractionDigits: 0,
  }).format(product.price);

  const handleShortlist = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    const res = await toggleWishlist(product.id);
    if (res.success) {
      setShortlisted(res.shortlisted);
    }
  };

  const handleAddBag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsAdding(true);
    addToCart(product, 1);
    setAddedSuccess(true);
    setTimeout(() => {
      setIsAdding(false);
      setAddedSuccess(false);
    }, 1200);
  };

  return (
    <div className="group relative bg-white rounded-2xl overflow-hidden border border-neutral-200 hover:border-[#0B3B60]/40 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col">
      {/* Image Container */}
      <Link href={`/product/${product.slug}`} className="relative block aspect-[3/4] overflow-hidden bg-neutral-100">
        <Image
          src={primaryImg}
          alt={product.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover object-top group-hover:scale-105 transition-transform duration-700 ease-out"
          loading="lazy"
        />

        {/* Gradient Overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Category / Fabric Badge */}
        <div className="absolute top-3 left-3">
          <span className="inline-flex items-center gap-1 text-[10px] uppercase font-semibold tracking-wider px-2.5 py-1 rounded-full bg-white/95 text-[#0B3B60] backdrop-blur-xs shadow-xs border border-neutral-200">
            <Sparkles className="w-2.5 h-2.5 text-[#0B3B60]" />
            {product.category?.name || product.fabric?.split(' ')[0] || 'Handcrafted'}
          </span>
        </div>

        {/* Shortlist Button */}
        <button
          type="button"
          onClick={handleShortlist}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-xs transition shadow-xs ${
            shortlisted
              ? 'bg-[#C1272D] text-white'
              : 'bg-white/90 text-neutral-700 hover:text-[#C1272D] border border-neutral-200'
          }`}
          title={shortlisted ? 'In Shortlist' : 'Add to Shortlist'}
        >
          <Heart className={`w-4 h-4 ${shortlisted ? 'fill-current' : ''}`} />
        </button>

        {/* Quick View Button on Hover */}
        <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
          <button
            type="button"
            onClick={handleAddBag}
            disabled={isAdding}
            className="w-full py-2.5 px-4 rounded-xl bg-[#0B3B60] hover:bg-[#062238] text-white font-medium text-xs tracking-wider uppercase shadow-lg transition flex items-center justify-center gap-2"
          >
            {addedSuccess ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" /> Added to Bag
              </>
            ) : (
              <>
                <ShoppingBag className="w-4 h-4" /> Add to Bag
              </>
            )}
          </button>
        </div>
      </Link>

      {/* Saree Details */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="text-[11px] uppercase tracking-wider text-[#C1272D] font-semibold mb-1">
            {product.fabric || 'Pure Royal Silk'}
          </div>
          <Link href={`/product/${product.slug}`}>
            <h3 className="font-serif text-sm sm:text-base font-bold text-neutral-900 line-clamp-2 group-hover:text-[#0B3B60] transition">
              {product.title}
            </h3>
          </Link>
          <p className="text-xs text-neutral-500 mt-1 line-clamp-1">
            {product.work || 'Handcrafted Adda Embroidery'}
          </p>
        </div>

        <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-neutral-400 uppercase tracking-wider block">Price</span>
            <span className="font-serif text-base sm:text-lg font-bold text-[#0B3B60]">
              {formattedPrice}
            </span>
          </div>

          <span className="text-[10px] px-2 py-0.5 rounded font-semibold bg-blue-50 text-[#0B3B60] border border-blue-200">
            Loom Inspected
          </span>
        </div>
      </div>
    </div>
  );
}
