'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Video, Award, ShieldCheck } from 'lucide-react';

export default function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center bg-gradient-to-br from-[#071E3D] via-[#0B3B60] to-[#071E3D] text-white overflow-hidden">
      {/* Background Radial Glow Overlays */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-radial from-[#C1272D]/15 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-radial from-[#0B3B60]/40 to-transparent rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left Text Content */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Royal Heritage Tag */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[rgba(193,39,45,0.18)] border border-[rgba(193,39,45,0.35)] text-[#ff8a8e] text-xs font-semibold uppercase tracking-widest backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-[#C1272D] animate-pulse" />
              <span>Royal Heritage of Jodhpur, Rajasthan</span>
            </div>

            {/* Main Brand Title & Tagline */}
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.1]">
              Vitasta
              <span className="block font-serif italic text-2xl sm:text-3xl lg:text-4xl text-[#90c4ff] font-normal mt-1">
                by Smita Saraswat
              </span>
            </h1>

            {/* Description */}
            <p className="text-sm sm:text-base text-neutral-200 leading-relaxed max-w-xl mx-auto lg:mx-0 font-light">
              Inspired by the timeless grace and grandeur of the royal women of Rajasthan. Every piece is meticulously handcrafted on traditional <em>addas</em> by master artisans in Jodhpur, taking weeks of patient hand embroidery to bring royal heritage to life.
            </p>

            {/* Action CTAs */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
              <Link
                href="/shop"
                className="px-7 py-3.5 rounded-full bg-[#C1272D] hover:bg-[#9B1B1E] text-white font-semibold text-xs sm:text-sm uppercase tracking-wider transition-all duration-300 shadow-lg shadow-red-950/40 transform hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-2"
              >
                <span>Explore Royal Catalog</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                href="/about"
                className="px-6 py-3.5 rounded-full bg-transparent hover:bg-white/10 border border-white/30 text-white font-medium text-xs sm:text-sm uppercase tracking-wider backdrop-blur-xs transition"
              >
                The Royal Craft
              </Link>
            </div>

            {/* 3 Royal Stats */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-white/15 max-w-md mx-auto lg:mx-0">
              <div>
                <span className="font-serif text-2xl sm:text-3xl font-bold text-white block">21</span>
                <span className="text-[11px] text-neutral-300 font-light uppercase tracking-wider">Handcrafted Sarees</span>
              </div>
              <div>
                <span className="font-serif text-2xl sm:text-3xl font-bold text-white block">15–30</span>
                <span className="text-[11px] text-neutral-300 font-light uppercase tracking-wider">Days per Saree</span>
              </div>
              <div>
                <span className="font-serif text-2xl sm:text-3xl font-bold text-white block">100%</span>
                <span className="text-[11px] text-neutral-300 font-light uppercase tracking-wider">Pure Silk & Fabric</span>
              </div>
            </div>
          </div>

          {/* Right Media Card Banner */}
          <div className="lg:col-span-5 flex flex-col items-center">
            <div className="relative w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl border border-white/20 bg-[#071E3D]/80 backdrop-blur-md group">
              <div className="aspect-[1600/879] relative w-full bg-[#05152B] flex items-center justify-center p-2">
                <Image
                  src="https://res.cloudinary.com/sjl1rfvu/image/upload/v1789675005/vitasta/brand/vitasta_logo_banner.jpg"
                  alt="Vitasta unfolding serenity royal banner"
                  fill
                  priority
                  className="object-contain object-center group-hover:scale-102 transition-transform duration-500"
                />
              </div>

              {/* Artisan Seal Bottom Banner */}
              <div className="p-4 bg-[#071E3D] border-t border-white/10 flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-full bg-[#C1272D]/20 border border-[#C1272D]/40 flex items-center justify-center text-lg shrink-0 text-[#90c4ff]">
                  <Award className="w-5 h-5 text-[#90c4ff]" />
                </div>
                <div>
                  <h4 className="font-serif font-bold text-white text-xs tracking-wide">
                    Authentic Traditional Adda Work
                  </h4>
                  <p className="text-[10px] text-[#90c4ff] mt-0.5 font-light">
                    Aari • Gota Patti • Zardozi • Cutdana • Pitta Work
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
