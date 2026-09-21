import { getProductBySlug } from '@/app/actions/product-actions';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import ProductGallery from './ProductGallery';
import ProductActions from './ProductActions';
import { Sparkles, ChevronRight } from 'lucide-react';

export const revalidate = 60;

export default async function ProductDetailPage({ params }) {
  const { slug } = await params;
  const res = await getProductBySlug(slug);

  if (!res.success || !res.product) {
    notFound();
  }

  const { product } = res;

  const formattedPrice = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: product.currency || 'INR',
    maximumFractionDigits: 0,
  }).format(product.price);

  return (
    <div className="min-h-screen py-10 sm:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs text-neutral-500 mb-8 font-medium">
        <Link href="/" className="hover:text-[#0B3B60]">
          Atelier Home
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link href="/shop" className="hover:text-[#0B3B60]">
          Royal Sarees
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link
          href={`/shop?category=${product.categoryId}`}
          className="hover:text-[#0B3B60]"
        >
          {product.category?.name || 'Collection'}
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-neutral-900 truncate max-w-xs font-semibold">{product.title}</span>
      </nav>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
        {/* Left Column: Image Gallery */}
        <div className="lg:col-span-6">
          <ProductGallery images={product.images} title={product.title} />
        </div>

        {/* Right Column: Saree Details & Order Options */}
        <div className="lg:col-span-6 space-y-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider text-[#C1272D] bg-rose-50 border border-rose-200 mb-3">
              <Sparkles className="w-3.5 h-3.5 text-[#C1272D]" /> {product.category?.name || 'Royal Saree'}
            </div>

            <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-[#0B3B60] leading-snug">
              {product.title}
            </h1>

            <div className="mt-4 flex items-baseline gap-4">
              <span className="font-serif text-2xl sm:text-3xl font-bold text-[#0B3B60]">
                {formattedPrice}
              </span>
              <span className="text-xs text-neutral-500 font-sans uppercase tracking-wider">
                (Inclusive of all taxes & handloom finishing)
              </span>
            </div>
          </div>

          {/* Description */}
          <div className="border-t border-b border-neutral-200 py-4">
            <p className="text-xs sm:text-sm text-neutral-700 leading-relaxed whitespace-pre-line">
              {product.description}
            </p>
          </div>

          {/* Specifications Table */}
          <div className="space-y-3">
            <h3 className="font-serif text-sm font-bold uppercase tracking-wider text-[#0B3B60]">
              Atelier Specifications
            </h3>
            <div className="rounded-2xl border border-neutral-200 overflow-hidden text-xs bg-white shadow-xs">
              <div className="grid grid-cols-2 p-3 border-b border-neutral-100">
                <span className="text-neutral-500 font-medium">Saree Fabric</span>
                <span className="font-semibold text-neutral-900">{product.fabric}</span>
              </div>
              {product.blouseFabric && (
                <div className="grid grid-cols-2 p-3 border-b border-neutral-100">
                  <span className="text-neutral-500 font-medium">Blouse Fabric</span>
                  <span className="font-semibold text-neutral-900">{product.blouseFabric}</span>
                </div>
              )}
              <div className="grid grid-cols-2 p-3 border-b border-neutral-100">
                <span className="text-neutral-500 font-medium">Handwork & Technique</span>
                <span className="font-semibold text-neutral-900">{product.work}</span>
              </div>
              {product.design && (
                <div className="grid grid-cols-2 p-3 border-b border-neutral-100">
                  <span className="text-neutral-500 font-medium">Design & Motifs</span>
                  <span className="font-semibold text-neutral-900">{product.design}</span>
                </div>
              )}
              <div className="grid grid-cols-2 p-3 border-b border-neutral-100">
                <span className="text-neutral-500 font-medium">Color Palette</span>
                <span className="font-semibold text-neutral-900">{product.color}</span>
              </div>
              <div className="grid grid-cols-2 p-3 border-b border-neutral-100">
                <span className="text-neutral-500 font-medium">Dimensions</span>
                <span className="font-semibold text-neutral-900">
                  Saree: {product.sareeLength} • Blouse: {product.blouseLength}
                </span>
              </div>
              <div className="grid grid-cols-2 p-3 border-b border-neutral-100">
                <span className="text-neutral-500 font-medium">Material Care</span>
                <span className="font-semibold text-neutral-900">{product.materialCare}</span>
              </div>
              <div className="grid grid-cols-2 p-3">
                <span className="text-neutral-500 font-medium">Country of Origin</span>
                <span className="font-semibold text-neutral-900">{product.origin}</span>
              </div>
            </div>
          </div>

          {/* Add to Bag and WhatsApp Consultation Actions */}
          <ProductActions product={product} />
        </div>
      </div>
    </div>
  );
}
