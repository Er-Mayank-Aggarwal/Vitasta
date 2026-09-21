'use client';

import { Printer } from 'lucide-react';

export default function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-neutral-200 text-xs font-semibold text-[#0B3B60] shadow-sm hover:shadow hover:bg-neutral-50 transition"
    >
      <Printer className="w-4 h-4 text-[#C1272D]" /> Print Royal Invoice
    </button>
  );
}
