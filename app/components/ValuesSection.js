'use client';

import { Sparkles, Video, Award, Clock, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export default function ValuesSection() {
  return (
    <section id="values" className="py-16 sm:py-24 bg-[#FAF9F6] border-y border-neutral-200 scroll-mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Craftsmanship Story */}
          <div className="space-y-6">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-widest text-[#C1272D] bg-rose-50 border border-rose-200">
              <Sparkles className="w-3.5 h-3.5" /> Traditional Adda Embroidery
            </span>

            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#0B3B60] leading-tight">
              Weeks of Patient Handwork by Master Artisans in Jodhpur
            </h2>

            <p className="text-sm text-neutral-600 leading-relaxed">
              Every Vitasta saree is crafted using carefully selected pure fabrics and detailed handwork including Aari, Gota Patti, Zardozi, Cutdana, Pitta, and shimmering sequins.
            </p>

            <p className="text-sm text-neutral-600 leading-relaxed">
              Much of this intricate work is done on a traditional wooden <em>adda</em> frame, where skilled artisans spend weeks and sometimes months patiently working by hand to bring a single royal saree to life.
            </p>

            <div className="pt-2">
              <Link
                href="/about"
                className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#C1272D] hover:underline"
              >
                Read the Complete Heritage Story →
              </Link>
            </div>
          </div>

          {/* Right 4 Pillar Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl bg-white border border-neutral-200 space-y-3 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-[#0B3B60]">
                <Video className="w-5 h-5" />
              </div>
              <h3 className="font-serif font-bold text-[#0B3B60] text-base">
                Pre-Dispatch Video Proof
              </h3>
              <p className="text-xs text-neutral-600">
                A thorough video inspection of your saree is recorded and shared via WhatsApp prior to final packing.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-neutral-200 space-y-3 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-[#0B3B60]">
                <Award className="w-5 h-5" />
              </div>
              <h3 className="font-serif font-bold text-[#0B3B60] text-base">
                Certified Pure Silks
              </h3>
              <p className="text-xs text-neutral-600">
                Only genuine Habutai, Khaddi Georgette, Organza Silk, and authentic Banarasi handloom weaves are selected.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-neutral-200 space-y-3 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-[#0B3B60]">
                <Clock className="w-5 h-5" />
              </div>
              <h3 className="font-serif font-bold text-[#0B3B60] text-base">
                15–30 Day Handcrafted Care
              </h3>
              <p className="text-xs text-neutral-600">
                Each piece is custom-made on order with dedicated artisan finishing, fall-pico, and unstitched blouse piece.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-neutral-200 space-y-3 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-[#0B3B60]">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-serif font-bold text-[#0B3B60] text-base">
                Sovereign Insured Courier
              </h3>
              <p className="text-xs text-neutral-600">
                Direct insured express dispatch in bespoke luxury packaging from our Jodhpur artisan atelier.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
