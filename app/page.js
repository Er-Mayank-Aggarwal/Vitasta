import Link from 'next/link';
import HeroSection from './components/HeroSection';
import CategoryShowcase from './components/CategoryShowcase';
import ValuesSection from './components/ValuesSection';
import ProductCard from './components/ProductCard';
import { getProducts } from './actions/product-actions';
import { Sparkles, ArrowRight, Video, CheckCircle2 } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const { products = [] } = await getProducts({ limit: 8 });

  return (
    <div className="space-y-0 bg-[#FFFFFF]">
      {/* 1. Hero Banner */}
      <HeroSection />

      {/* 2. Five Curated Heritage Collections */}
      <CategoryShowcase />

      {/* 3. Featured Sarees from Database */}
      <section className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 sm:mb-16">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-widest text-[#0B3B60] bg-blue-50 mb-2 border border-blue-200">
              <Sparkles className="w-3.5 h-3.5 text-[#0B3B60]" /> Royal Highlights
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#0B3B60]">
              Featured Masterpieces
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600 mt-1">
              Handpicked heirloom sarees currently on our Jodhpur artisan addas.
            </p>
          </div>

          <Link
            href="/shop"
            className="mt-4 md:mt-0 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#C1272D] hover:underline"
          >
            Explore All 21 Sarees <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#C1272D] hover:bg-[#9B1B1E] text-white font-semibold text-xs sm:text-sm uppercase tracking-wider shadow-lg shadow-red-900/20 transition-all transform hover:-translate-y-0.5"
          >
            View Complete Atelier Catalog <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* 4. Craftsmanship Pillars */}
      <ValuesSection />

      {/* 5. Pre-Dispatch Loom Video Assurance Spotlight */}
      <section id="loom-video" className="py-16 sm:py-20 bg-gradient-to-br from-[#071E3D] via-[#0B3B60] to-[#071E3D] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white/5 border border-white/15 rounded-3xl p-8 sm:p-12 lg:p-16 flex flex-col lg:flex-row items-center justify-between gap-10 backdrop-blur-xs">
            <div className="max-w-xl space-y-4">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs uppercase tracking-widest font-semibold bg-[rgba(193,39,45,0.2)] text-[#ff8a8e] border border-[rgba(193,39,45,0.35)]">
                <Video className="w-3.5 h-3.5 text-[#C1272D]" />
                Uncompromising Quality Assurance
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white leading-tight">
                Every Single Saree Verified on Video Before It Leaves Our Hub
              </h2>
              <p className="text-xs sm:text-sm text-neutral-200 leading-relaxed font-light">
                Before your handcrafted order is sealed in royal muslin packaging, our quality specialists record a comprehensive high-definition video of the entire 5.5-metre drape, zari borders, fall-pico, and blouse piece.
              </p>
              <ul className="space-y-2 text-xs text-neutral-200 pt-2">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#90c4ff]" /> Direct WhatsApp video dispatch preview
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#90c4ff]" /> Zero surprises — 100% transparency in craftsmanship
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#90c4ff]" /> Insured sovereign door-to-door courier tracking
                </li>
              </ul>
            </div>

            <div className="shrink-0 flex flex-col sm:flex-row gap-4">
              <Link
                href="/shop"
                className="px-6 py-3.5 rounded-full bg-[#C1272D] hover:bg-[#9B1B1E] text-white font-bold text-xs uppercase tracking-wider transition text-center shadow-lg shadow-red-950/40"
              >
                Choose Your Saree
              </Link>
              <Link
                href="/contact"
                className="px-6 py-3.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/30 text-white font-medium text-xs uppercase tracking-wider transition text-center"
              >
                Consult on WhatsApp
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
