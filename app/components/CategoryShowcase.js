'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';

const collections = [
  {
    id: 'riwaayat-e-chiffon',
    name: 'Riwaayat-e-Chiffon',
    fabric: 'Pure Premium Chiffon',
    tagline: 'Feather-Light Elegance & Fluid Drapes',
    sareesCount: '7 Royal Creations',
    images: [
      'https://res.cloudinary.com/sjl1rfvu/image/upload/v1789675057/vitasta/products/sunset-ombre-chiffon-cutdana-moti-sequin-saree/xztu76kgnn59tlhoc8zo.jpg',
      'https://res.cloudinary.com/sjl1rfvu/image/upload/v1789675063/vitasta/products/wine-mauve-ombre-chiffon-pitta-aari-tari-sequin-saree/az5ne1ehzgmwvuhhokv9.jpg',
      'https://res.cloudinary.com/sjl1rfvu/image/upload/v1789675034/vitasta/products/ivory-off-white-chiffon-gota-patti-pitta-sequin-saree/rpziy0rqmrqhup9objis.jpg',
      'https://res.cloudinary.com/sjl1rfvu/image/upload/v1789675046/vitasta/products/peacock-teal-emerald-green-chiffon-pitta-cutdana-sequin-saree/xm99qwsucsvntsnjftx5.jpg',
      'https://res.cloudinary.com/sjl1rfvu/image/upload/v1789675028/vitasta/products/dusty-taupe-blush-pink-chiffon-knot-kashida-sequin-saree/xvxjsxl3way6tkuf2xru.jpg',
      'https://res.cloudinary.com/sjl1rfvu/image/upload/v1789675043/vitasta/products/onion-pink-pure-chiffon-zero-sequins-cutdana-jaal-saree/ka7qrcyupjjluxd94rli.jpg',
      'https://res.cloudinary.com/sjl1rfvu/image/upload/v1789675023/vitasta/products/coral-pink-chiffon-aari-tari-cutdana-jaal-saree/cakvdhnysdl6kevh3myk.jpg',
    ],
  },
  {
    id: 'georgette-reet',
    name: 'Georgette Reet',
    fabric: 'Khaddi & Satin Georgette',
    tagline: 'Graceful Fall & Intricate Handwork',
    sareesCount: '4 Royal Creations',
    images: [
      'https://res.cloudinary.com/sjl1rfvu/image/upload/v1789675049/vitasta/products/pink-peach-ombre-satin-georgette-saree/umchce5ouze0qts2sdgu.jpg',
      'https://res.cloudinary.com/sjl1rfvu/image/upload/v1789675053/vitasta/products/pista-green-turquoise-khaddi-georgette-meena-saree/twcrskdcvhcp8whnkp3m.jpg',
      'https://res.cloudinary.com/sjl1rfvu/image/upload/v1789675037/vitasta/products/mustard-gold-ombre-satin-georgette-saree/min08nvywmomgwdzfhez.jpg',
      'https://res.cloudinary.com/sjl1rfvu/image/upload/v1789675024/vitasta/products/blue-ombre-satin-georgette-saree/lamivuj8e2imwkennlay.jpg',
    ],
  },
  {
    id: 'silk-noorani',
    name: 'Silk Noorani',
    fabric: 'Habutai, Dupion & Satin Silk',
    tagline: 'Rich Luster & Regal Splendor',
    sareesCount: '5 Royal Creations',
    images: [
      'https://res.cloudinary.com/sjl1rfvu/image/upload/v1789675054/vitasta/products/rani-pink-habutai-silk-saree/kjietw4b5pltezf0ly3k.jpg',
      'https://res.cloudinary.com/sjl1rfvu/image/upload/v1789675038/vitasta/products/off-white-habutai-silk-aari-saree/j2tirwtekv8q7qtad0gv.jpg',
      'https://res.cloudinary.com/sjl1rfvu/image/upload/v1789675035/vitasta/products/mint-green-dupion-silk-zari-saree/xakuwzq1wlp02omwtqt6.jpg',
      'https://res.cloudinary.com/sjl1rfvu/image/upload/v1789675051/vitasta/products/pista-green-satin-silk-saree/xiv0qqrm5lepjodnjp6z.jpg',
      'https://res.cloudinary.com/sjl1rfvu/image/upload/v1789675027/vitasta/products/dusty-onion-pink-habutai-silk-saree/idfqdbwvbevy0vw33lt3.jpg',
    ],
  },
  {
    id: 'organza-adaa',
    name: 'Organza Adaa',
    fabric: 'Pure Organza Silk',
    tagline: 'Delicate Sheer & Statement Silhouette',
    sareesCount: '1 Royal Creation',
    images: [
      'https://res.cloudinary.com/sjl1rfvu/image/upload/v1789675061/vitasta/products/turquoise-teal-organza-silk-aari-sequin-saree/jqlaz35qcw0xmmqgypuh.jpg',
      'https://res.cloudinary.com/sjl1rfvu/image/upload/v1789675061/vitasta/products/turquoise-teal-organza-silk-aari-sequin-saree/swcgazx0q0blu7eooxxs.jpg',
    ],
  },
  {
    id: 'banarasi-virasat',
    name: 'Banarasi Virasat',
    fabric: 'Banarasi Khaddi Georgette & Weaves',
    tagline: 'Royal Heritage & Festive Grandeur',
    sareesCount: '4 Royal Creations',
    images: [
      'https://res.cloudinary.com/sjl1rfvu/image/upload/v1789675055/vitasta/products/royal-blue-banarasi-khaddi-georgette-lace-cutwork-saree/j3u6zeguqc77gecozmq8.jpg',
      'https://res.cloudinary.com/sjl1rfvu/image/upload/v1789675033/vitasta/products/emerald-green-bandhani-banarasi-khadi-georgette-cutdana-saree/rf6wf8oonkk5fbv0kvoq.jpg',
      'https://res.cloudinary.com/sjl1rfvu/image/upload/v1789675041/vitasta/products/parrot-green-turquoise-banarasi-bandhej-khaddi-georgette-meena-saree/q8nwe71hpfdduaca5e6j.jpg',
      'https://res.cloudinary.com/sjl1rfvu/image/upload/v1789675044/vitasta/products/peach-crush-slate-blue-double-tone-bandhani-banarasi-khaddi-georgette-saree/v1svaetykr7qnmw7jpzq.jpg',
    ],
  },
];

function CategorySlideshowCard({ collection, index }) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const imageList = collection.images || [];

  useEffect(() => {
    if (imageList.length <= 1) return;

    // Stagger initial delays so all cards don't flip in lockstep
    const initialDelay = (index * 600) % 2400;
    let intervalId;

    const timeoutId = setTimeout(() => {
      intervalId = setInterval(() => {
        if (!isHovered) {
          setCurrentIdx((prev) => (prev + 1) % imageList.length);
        }
      }, 3600);
    }, initialDelay);

    return () => {
      clearTimeout(timeoutId);
      if (intervalId) clearInterval(intervalId);
    };
  }, [imageList.length, isHovered, index]);

  const handlePrev = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentIdx((prev) => (prev - 1 + imageList.length) % imageList.length);
  };

  const handleNext = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentIdx((prev) => (prev + 1) % imageList.length);
  };

  return (
    <Link
      href={`/shop?category=${collection.id}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative rounded-2xl overflow-hidden aspect-[3/4] bg-neutral-900 shadow-md hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1.5 border border-neutral-200 flex flex-col justify-end p-5 select-none"
    >
      {/* Stacked Images for Ultra-Smooth Crossfade */}
      <div className="absolute inset-0">
        {imageList.map((imgUrl, i) => (
          <Image
            key={i}
            src={imgUrl}
            alt={`${collection.name} drape ${i + 1}`}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 20vw"
            className={`object-cover object-top transition-all duration-1000 ease-in-out ${
              i === currentIdx
                ? 'opacity-85 group-hover:opacity-100 scale-100 group-hover:scale-105'
                : 'opacity-0 scale-100 pointer-events-none'
            }`}
            priority={i === 0}
          />
        ))}
      </div>

      {/* Luxury Gradient Vignette Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none" />

      {/* Top Pagination Dots & Carousel Navigation */}
      <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between z-20 pointer-events-none">
        {/* Slideshow Pill Indicator */}
        <div className="flex items-center gap-1 bg-black/40 backdrop-blur-md px-2 py-1 rounded-full border border-white/15">
          {imageList.map((_, dotIdx) => (
            <span
              key={dotIdx}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                dotIdx === currentIdx ? 'w-4 bg-[#90c4ff]' : 'w-1.5 bg-white/40'
              }`}
            />
          ))}
        </div>

        {/* Manual Slideshow Arrows (Appear on Hover) */}
        {imageList.length > 1 && (
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-auto">
            <button
              type="button"
              onClick={handlePrev}
              className="p-1 rounded-full bg-black/50 hover:bg-[#0B3B60] text-white backdrop-blur-xs transition border border-white/20 cursor-pointer"
              title="Previous Saree"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="p-1 rounded-full bg-black/50 hover:bg-[#0B3B60] text-white backdrop-blur-xs transition border border-white/20 cursor-pointer"
              title="Next Saree"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Card Body & Details */}
      <div className="relative z-10 space-y-1">
        <span className="text-[10px] uppercase font-semibold text-[#90c4ff] tracking-wider block">
          {collection.fabric}
        </span>
        <h3 className="font-serif text-base sm:text-lg font-bold text-white group-hover:text-[#90c4ff] transition">
          {collection.name}
        </h3>
        <p className="text-[11px] text-neutral-300 line-clamp-1">{collection.tagline}</p>
        <div className="pt-2 flex items-center justify-between text-[11px] font-medium text-white/90 group-hover:text-white transition">
          <span className="flex items-center gap-1">
            <span>Explore Collection</span> <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition" />
          </span>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 backdrop-blur-xs text-neutral-200 border border-white/10 font-normal">
            {collection.sareesCount}
          </span>
        </div>
      </div>
    </Link>
  );
}

export default function CategoryShowcase() {
  return (
    <section id="collections" className="py-16 sm:py-24 bg-[#FAF9F6] scroll-mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-widest text-[#C1272D] bg-rose-50 mb-3 border border-rose-200">
            <Sparkles className="w-3.5 h-3.5 text-[#C1272D]" /> Curated Heritage
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#0B3B60]">
            The Five Royal Collections
          </h2>
          <p className="text-xs sm:text-sm text-neutral-600 mt-2">
            Each collection celebrates a distinct royal handloom fabric and traditional artisan embroidery technique.
          </p>
        </div>

        {/* 5-Column Grid with Active Slideshow Carousels */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {collections.map((c, idx) => (
            <CategorySlideshowCard key={c.id} collection={c} index={idx} />
          ))}
        </div>
      </div>
    </section>
  );
}
