'use client';

import { useEffect } from 'react';
import { AlertCircle, RotateCcw, Home } from 'lucide-react';
import Link from 'next/link';

export default function GlobalAppError({ error, reset }) {
  useEffect(() => {
    console.error('Vitasta Atelier Uncaught Error:', error);
  }, [error]);

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-16 bg-[#FAF9F6] text-[#1A1A1A]">
      <div className="max-w-md w-full text-center space-y-6 bg-white p-8 sm:p-10 rounded-3xl border border-neutral-200 shadow-xl">
        <div className="w-14 h-14 rounded-full bg-rose-50 border border-rose-200 flex items-center justify-center mx-auto text-rose-600">
          <AlertCircle className="w-7 h-7" />
        </div>

        <div className="space-y-2">
          <span className="text-[10px] uppercase tracking-[0.25em] font-semibold text-[#C1272D]">
            Atelier System Notice
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#0B3B60]">
            An Unexpected Disruption
          </h1>
          <p className="text-xs text-neutral-600 leading-relaxed">
            Our atelier system encountered an unexpected issue while loading this page. You can attempt to reload the view or return to the main storefront.
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => reset()}
            className="w-full sm:w-auto px-5 py-2.5 rounded-full bg-[#0B3B60] hover:bg-[#071E3D] text-white text-xs font-semibold tracking-wider uppercase transition shadow-md inline-flex items-center justify-center gap-2 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Try Again
          </button>
          <Link
            href="/"
            className="w-full sm:w-auto px-5 py-2.5 rounded-full border border-neutral-300 hover:bg-neutral-50 text-xs font-semibold tracking-wider uppercase text-neutral-700 transition inline-flex items-center justify-center gap-1.5"
          >
            <Home className="w-3.5 h-3.5" /> Storefront
          </Link>
        </div>
      </div>
    </div>
  );
}
