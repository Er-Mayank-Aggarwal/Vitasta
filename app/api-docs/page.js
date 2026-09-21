'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Sparkles, Code2, ExternalLink } from 'lucide-react';

export default function SwaggerDocsPage() {
  useEffect(() => {
    // Inject Swagger UI CSS
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://unpkg.com/swagger-ui-dist@5.11.0/swagger-ui.css';
    document.head.appendChild(link);

    // Inject Swagger UI Bundle Script
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/swagger-ui-dist@5.11.0/swagger-ui-bundle.js';
    script.async = true;
    script.onload = () => {
      if (window.SwaggerUIBundle) {
        window.SwaggerUIBundle({
          url: '/api/docs/spec',
          dom_id: '#swagger-ui',
          deepLinking: true,
          presets: [
            window.SwaggerUIBundle.presets.apis,
            window.SwaggerUIBundle.SwaggerUIStandalonePreset,
          ],
          layout: 'BaseLayout',
        });
      }
    };
    document.body.appendChild(script);

    return () => {
      if (document.head.contains(link)) document.head.removeChild(link);
      if (document.body.contains(script)) document.body.removeChild(script);
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#1A1A1A] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-neutral-200 pb-6">
          <div>
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs text-[#0B3B60] hover:text-[#C1272D] font-semibold hover:underline mb-2"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Return to Storefront
            </Link>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#0B3B60] flex items-center gap-2">
              <Code2 className="w-6 h-6 text-[#C1272D]" /> Vitasta Atelier API Documentation
            </h1>
            <p className="text-xs text-neutral-500 mt-1">
              Interactive OpenAPI 3.0 / Swagger UI documentation for Better Auth, Catalog, and Atelier Order Pipelines.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="/api/docs/spec"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-1.5 rounded-xl bg-white hover:bg-neutral-50 text-xs font-semibold text-[#0B3B60] flex items-center gap-1.5 border border-neutral-200 transition shadow-xs"
            >
              Raw OpenAPI JSON <ExternalLink className="w-3 h-3 text-[#C1272D]" />
            </a>
          </div>
        </div>

        {/* Swagger Container */}
        <div className="bg-white rounded-3xl p-4 sm:p-8 shadow-xl overflow-hidden border border-neutral-200 text-neutral-900">
          <div id="swagger-ui" />
        </div>
      </div>
    </div>
  );
}
