import Link from 'next/link';
import { ArrowLeft, Sparkles } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-16 bg-[#FAF9F6] text-[#1A1A1A]">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-[#0B3B60]/10 border border-[#0B3B60]/20 flex items-center justify-center mx-auto text-[#0B3B60]">
          <Sparkles className="w-8 h-8 text-[#C1272D]" />
        </div>

        <div className="space-y-2">
          <span className="text-xs uppercase tracking-[0.3em] font-semibold text-[#C1272D]">
            404 • Page Not Found
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#0B3B60]">
            A Heritage Saree Unfound
          </h1>
          <p className="text-xs sm:text-sm text-neutral-600 max-w-sm mx-auto leading-relaxed">
            The royal creation, catalog page, or order invoice you are searching for does not exist or has been archived by the atelier.
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/shop"
            className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-[#0B3B60] hover:bg-[#071E3D] text-white text-xs font-semibold tracking-wider uppercase transition shadow-md inline-flex items-center justify-center gap-2"
          >
            Explore Catalog
          </Link>
          <Link
            href="/"
            className="w-full sm:w-auto px-6 py-2.5 rounded-full border border-neutral-300 hover:bg-white text-xs font-semibold tracking-wider uppercase text-neutral-700 transition inline-flex items-center justify-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Return Home
          </Link>
        </div>
      </div>
    </div>
  );
}
