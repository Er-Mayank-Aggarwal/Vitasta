import { getProducts } from '@/app/actions/product-actions';
import ProductCard from '@/app/components/ProductCard';
import Link from 'next/link';
import { Sparkles } from 'lucide-react';

export const revalidate = 60;

const sareeCategories = [
  { id: 'all-sarees', name: 'All Sarees', department: 'sarees' },
  { id: 'riwaayat-e-chiffon', name: 'Riwaayat-e-Chiffon', department: 'sarees' },
  { id: 'georgette-reet', name: 'Georgette Reet', department: 'sarees' },
  { id: 'silk-noorani', name: 'Silk Noorani', department: 'sarees' },
  { id: 'organza-adaa', name: 'Organza Adaa', department: 'sarees' },
  { id: 'banarasi-virasat', name: 'Banarasi Virasat', department: 'sarees' },
];

const suitCategories = [
  { id: 'all-suits', name: 'All Suits', department: 'suits' },
  { id: 'modal-bandhej-suits', name: 'Modal Bandhej Zari Suits', department: 'suits' },
  { id: 'cotton-bandhej-cutwork-suits', name: 'Cotton Bandhej Cutwork Suits', department: 'suits' },
];

const allCategories = [
  { id: 'all', name: 'All Atelier Pieces', department: 'all' },
  ...sareeCategories.slice(1),
  ...suitCategories.slice(1),
];

export default async function ShopPage({ searchParams }) {
  const params = await searchParams;
  let currentDepartment = params?.department || 'all';
  let currentCategory = params?.category || 'all';
  const currentSort = params?.sort || 'featured';
  const currentSearch = params?.q || '';

  // Normalize category/department if user clicked a specific category
  if (currentCategory === 'all-sarees') {
    currentDepartment = 'sarees';
    currentCategory = 'all';
  } else if (currentCategory === 'all-suits') {
    currentDepartment = 'suits';
    currentCategory = 'all';
  } else if (suitCategories.some((c) => c.id === currentCategory)) {
    currentDepartment = 'suits';
  } else if (sareeCategories.some((c) => c.id === currentCategory)) {
    currentDepartment = 'sarees';
  }

  const { products = [], totalCount = 0 } = await getProducts({
    categoryId: currentCategory !== 'all' ? currentCategory : undefined,
    department: currentDepartment !== 'all' ? currentDepartment : undefined,
    sort: currentSort,
    search: currentSearch,
    limit: 50,
  });

  const activeCategoryList =
    currentDepartment === 'suits'
      ? [
          { id: 'all', name: 'All Suits' },
          ...suitCategories.slice(1),
        ]
      : currentDepartment === 'sarees'
      ? [
          { id: 'all', name: 'All Sarees' },
          ...sareeCategories.slice(1),
        ]
      : [
          { id: 'all', name: 'All Creations' },
          ...sareeCategories.slice(1),
          ...suitCategories.slice(1),
        ];

  return (
    <div className="min-h-screen py-10 sm:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-10">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-widest text-[#0B3B60] bg-blue-50 mb-3 border border-blue-200">
          <Sparkles className="w-3.5 h-3.5 text-[#0B3B60]" />
          {currentDepartment === 'suits'
            ? 'Bespoke Unstitched Suits'
            : currentDepartment === 'sarees'
            ? 'Royal Handcrafted Sarees'
            : 'The Complete Atelier Catalog'}
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#0B3B60]">
          {currentDepartment === 'suits'
            ? 'Bespoke Royal Suits'
            : currentDepartment === 'sarees'
            ? 'Royal Handcrafted Sarees'
            : 'Sarees & Bespoke Suits'}
        </h1>
        <p className="text-xs sm:text-sm text-neutral-600 mt-2">
          {currentDepartment === 'suits'
            ? 'Handcrafted unstitched 3-piece suit sets in pure Modal & Cotton with authentic Bandhani and intricate zari embroidery.'
            : currentDepartment === 'sarees'
            ? 'Discover 100% handcrafted authentic sarees made in Jodhpur with only pure fabrics, fine chiffons, and intricate Adda embroidery.'
            : 'Discover heirloom sarees and bespoke unstitched suit sets handcrafted by master artisans in Jodhpur, Rajasthan.'}
        </p>
      </div>

      {/* Main Department Filter Tabs: All | Sarees | Suits */}
      <div className="flex items-center justify-center gap-2 sm:gap-3 mb-6">
        <Link
          href={`/shop?department=all${currentSearch ? `&q=${currentSearch}` : ''}`}
          className={`px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition ${
            currentDepartment === 'all'
              ? 'bg-[#0B3B60] text-white shadow-md'
              : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
          }`}
        >
          All Collections
        </Link>
        <Link
          href={`/shop?department=sarees${currentSearch ? `&q=${currentSearch}` : ''}`}
          className={`px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition ${
            currentDepartment === 'sarees'
              ? 'bg-[#0B3B60] text-white shadow-md'
              : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
          }`}
        >
          Royal Sarees
        </Link>
        <Link
          href={`/shop?department=suits${currentSearch ? `&q=${currentSearch}` : ''}`}
          className={`px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition ${
            currentDepartment === 'suits'
              ? 'bg-[#C1272D] text-white shadow-md shadow-red-900/20'
              : 'bg-rose-50 text-[#C1272D] border border-rose-200 hover:bg-rose-100'
          }`}
        >
          ✦ Royal Suit Sets
        </Link>
      </div>

      {/* Sub-Category Filter Pills */}
      <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar">
        {activeCategoryList.map((cat) => {
          const isActive = currentCategory === cat.id;
          return (
            <Link
              key={cat.id}
              href={`/shop?department=${currentDepartment}&category=${cat.id}&sort=${currentSort}${
                currentSearch ? `&q=${currentSearch}` : ''
              }`}
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
          <strong className="text-neutral-900">{totalCount}</strong>{' '}
          {currentDepartment === 'suits' ? 'Suit Sets' : currentDepartment === 'sarees' ? 'Royal Sarees' : 'Royal Creations'}
          {currentCategory !== 'all' && (
            <span className="ml-2 text-[#0B3B60] font-semibold">
              in {activeCategoryList.find((c) => c.id === currentCategory)?.name}
            </span>
          )}
        </div>

        {/* Sort Options */}
        <div className="flex items-center gap-2 text-xs">
          <span className="text-neutral-500 font-medium">Sort By:</span>
          <div className="flex gap-1">
            <Link
              href={`/shop?department=${currentDepartment}&category=${currentCategory}&sort=featured${
                currentSearch ? `&q=${currentSearch}` : ''
              }`}
              className={`px-3 py-1.5 rounded-lg font-medium transition ${
                currentSort === 'featured'
                  ? 'bg-blue-50 text-[#0B3B60] font-bold border border-blue-200'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              Featured
            </Link>
            <Link
              href={`/shop?department=${currentDepartment}&category=${currentCategory}&sort=price-low${
                currentSearch ? `&q=${currentSearch}` : ''
              }`}
              className={`px-3 py-1.5 rounded-lg font-medium transition ${
                currentSort === 'price-low'
                  ? 'bg-blue-50 text-[#0B3B60] font-bold border border-blue-200'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              Price: Low to High
            </Link>
            <Link
              href={`/shop?department=${currentDepartment}&category=${currentCategory}&sort=price-high${
                currentSearch ? `&q=${currentSearch}` : ''
              }`}
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

      {/* Products Grid */}
      {products.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-neutral-300 p-8 space-y-4">
          <p className="font-serif text-lg text-neutral-700">
            No creations found matching your criteria.
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
