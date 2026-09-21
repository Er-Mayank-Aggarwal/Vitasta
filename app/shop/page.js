import { getProducts } from '@/app/actions/product-actions';
import ProductCard from '@/app/components/ProductCard';
import Link from 'next/link';
import { Sparkles } from 'lucide-react';

export const dynamic = 'force-dynamic';

const categories = [
  { id: 'all', name: 'All Sarees' },
  { id: 'riwaayat-e-chiffon', name: 'Riwaayat-e-Chiffon' },
  { id: 'georgette-reet', name: 'Georgette Reet' },
  { id: 'silk-noorani', name: 'Silk Noorani' },
  { id: 'organza-adaa', name: 'Organza Adaa' },
  { id: 'banarasi-virasat', name: 'Banarasi Virasat' },
];

export default async function ShopPage({ searchParams }) {
  const params = await searchParams;
  const currentCategory = params?.category || 'all';
  const currentSort = params?.sort || 'featured';
  const currentSearch = params?.q || '';

  const { products = [], totalCount = 0 } = await getProducts({
    categoryId: currentCategory !== 'all' ? currentCategory : undefined,
    sort: currentSort,
    search: currentSearch,
    limit: 50,
  });

  return (
    <div className="min-h-screen py-10 sm:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-widest text-[#0B3B60] bg-blue-50 mb-3 border border-blue-200">
          <Sparkles className="w-3.5 h-3.5 text-[#0B3B60]" /> The Complete Atelier Catalog
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#0B3B60]">
          Royal Handcrafted Sarees
        </h1>
        <p className="text-xs sm:text-sm text-neutral-600 mt-2">
          Discover 21 authentic handloom creations crafted in Jodhpur with pure silks, fine chiffons, and intricate Adda embroidery.
        </p>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar">
        {categories.map((cat) => {
          const isActive = currentCategory === cat.id;
          return (
            <Link
              key={cat.id}
              href={`/shop?category=${cat.id}&sort=${currentSort}${currentSearch ? `&q=${currentSearch}` : ''}`}
              className={`px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider whitespace-nowrap transition border ${
                isActive
                  ? 'bg-[#0B3B60] text-white border-[#0B3B60] shadow-sm'
                  : 'bg-white text-neutral-700 border-neutral-200 hover:border-[#0B3B60] hover:text-[#0B3B60]'
              }`}
            >
              {cat.name}
            </Link>
          );
        })}
      </div>

      {/* Results Bar & Sort */}
      <div className="bg-white rounded-2xl p-4 border border-neutral-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
        <div className="text-xs text-neutral-600">
          Showing <strong className="text-neutral-900">{products.length}</strong> of{' '}
          <strong className="text-neutral-900">{totalCount}</strong> Royal Creations
          {currentCategory !== 'all' && (
            <span className="ml-2 text-[#0B3B60] font-semibold">
              in {categories.find((c) => c.id === currentCategory)?.name}
            </span>
          )}
        </div>

        {/* Sort Options */}
        <div className="flex items-center gap-2 text-xs">
          <span className="text-neutral-500 font-medium">Sort By:</span>
          <div className="flex gap-1">
            <Link
              href={`/shop?category=${currentCategory}&sort=featured${currentSearch ? `&q=${currentSearch}` : ''}`}
              className={`px-3 py-1.5 rounded-lg font-medium transition ${
                currentSort === 'featured'
                  ? 'bg-blue-50 text-[#0B3B60] font-bold border border-blue-200'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              Featured
            </Link>
            <Link
              href={`/shop?category=${currentCategory}&sort=price-low${currentSearch ? `&q=${currentSearch}` : ''}`}
              className={`px-3 py-1.5 rounded-lg font-medium transition ${
                currentSort === 'price-low'
                  ? 'bg-blue-50 text-[#0B3B60] font-bold border border-blue-200'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              Price: Low to High
            </Link>
            <Link
              href={`/shop?category=${currentCategory}&sort=price-high${currentSearch ? `&q=${currentSearch}` : ''}`}
              className={`px-3 py-1.5 rounded-lg font-medium transition ${
                currentSort === 'price-high'
                  ? 'bg-blue-50 text-[#0B3B60] font-bold border border-blue-200'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              Price: High to Low
            </Link>
          </div>
        </div>
      </div>

      {/* Saree Grid */}
      {products.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-neutral-300 p-8 space-y-4">
          <p className="font-serif text-lg text-neutral-700">
            No sarees found matching your criteria.
          </p>
          <Link
            href="/shop"
            className="inline-block px-6 py-2.5 rounded-full bg-[#0B3B60] text-white text-xs font-semibold uppercase tracking-wider hover:bg-[#062238]"
          >
            Clear Filters
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
