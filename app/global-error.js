'use client';

export default function RootGlobalError({ error, reset }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#FAF9F6] text-[#1A1A1A] flex items-center justify-center p-4 font-sans">
        <div className="max-w-md w-full text-center space-y-6 bg-white p-8 rounded-3xl border border-neutral-200 shadow-xl">
          <h1 className="font-serif text-2xl font-bold text-[#0B3B60]">
            Vitasta Atelier System Notice
          </h1>
          <p className="text-xs text-neutral-600">
            A critical application error occurred. Please refresh the page to restart the session.
          </p>
          <button
            type="button"
            onClick={() => reset()}
            className="px-6 py-2.5 rounded-full bg-[#0B3B60] text-white text-xs font-semibold uppercase tracking-wider hover:bg-[#071E3D] cursor-pointer"
          >
            Reload Atelier
          </button>
        </div>
      </body>
    </html>
  );
}
