'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Mail, Phone, MapPin, Sparkles, Send, ShieldCheck, Video, CheckCircle2, Code2 } from 'lucide-react';
import { subscribeNewsletter } from '@/app/actions/contact-actions';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    const res = await subscribeNewsletter(email);
    if (res.success) {
      setSubscribed(true);
      setEmail('');
    }
    setLoading(false);
  };

  return (
    <footer className="bg-[#071E3D] text-neutral-300 border-t border-[#0B3B60]">
      {/* Compact Trust Highlights Strip */}
      <div className="border-b border-white/10 py-3 sm:py-4 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-3 gap-2 sm:gap-6 text-center sm:text-left">
          <div className="flex flex-col sm:flex-row items-center sm:items-center gap-1.5 sm:gap-3 p-2 sm:p-2.5 rounded-xl bg-white/5 border border-white/10">
            <Sparkles className="w-4 h-4 text-[#90c4ff] shrink-0" />
            <div>
              <h4 className="font-serif font-bold text-white text-[10px] sm:text-xs leading-tight">Jodhpur Handloom</h4>
              <p className="text-[9px] sm:text-[11px] text-neutral-400 hidden sm:block">Pure Adda craftsmanship</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center sm:items-center gap-1.5 sm:gap-3 p-2 sm:p-2.5 rounded-xl bg-white/5 border border-white/10">
            <Video className="w-4 h-4 text-[#90c4ff] shrink-0" />
            <div>
              <h4 className="font-serif font-bold text-white text-[10px] sm:text-xs leading-tight">Pre-Dispatch Video</h4>
              <p className="text-[9px] sm:text-[11px] text-neutral-400 hidden sm:block">HD loom verification</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center sm:items-center gap-1.5 sm:gap-3 p-2 sm:p-2.5 rounded-xl bg-white/5 border border-white/10">
            <ShieldCheck className="w-4 h-4 text-[#90c4ff] shrink-0" />
            <div>
              <h4 className="font-serif font-bold text-white text-[10px] sm:text-xs leading-tight">Insured Courier</h4>
              <p className="text-[9px] sm:text-[11px] text-neutral-400 hidden sm:block">Free Pan-India transit</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer - Compact 2-column on mobile, 4-column on desktop */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
          {/* Brand & Newsletter (Full width on mobile top) */}
          <div className="col-span-2 md:col-span-1 space-y-2.5">
            <Link href="/" className="inline-block">
              <span className="font-serif text-xl sm:text-2xl font-bold tracking-[0.2em] text-white">
                VIT<span className="text-[#C1272D]">A</span>STA
              </span>
              <p className="text-[9px] uppercase tracking-[0.2em] text-[#90c4ff] font-sans font-semibold">
                by Smita Saraswat • Jodhpur
              </p>
            </Link>
            <p className="text-[11px] sm:text-xs text-neutral-300 leading-relaxed font-light">
              Heirloom royal sarees handcrafted on traditional addas in Jodhpur, Rajasthan.
            </p>

            {/* Newsletter Input */}
            <div className="pt-1">
              {subscribed ? (
                <div className="flex items-center gap-1.5 text-[11px] text-emerald-400">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Subscribed to Gazette
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex gap-1.5 max-w-xs">
                  <input
                    type="email"
                    required
                    placeholder="Email for royal updates..."
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-1 px-3 py-1.5 text-xs rounded-lg bg-white/10 border border-white/20 text-white placeholder-neutral-400 focus:outline-none focus:border-[#90c4ff]"
                  />
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-3 py-1.5 bg-[#C1272D] hover:bg-[#A01F25] text-white rounded-lg text-xs font-bold transition shrink-0 cursor-pointer"
                    aria-label="Subscribe"
                  >
                    {loading ? '...' : <Send className="w-3.5 h-3.5" />}
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Collections Column */}
          <div>
            <h4 className="font-serif text-xs font-bold text-white uppercase tracking-wider mb-2.5">
              Collections
            </h4>
            <ul className="space-y-1.5 text-[11px] sm:text-xs">
              <li>
                <Link href="/shop?category=riwaayat-e-chiffon" className="hover:text-[#90c4ff] transition">
                  Riwaayat-e-Chiffon
                </Link>
              </li>
              <li>
                <Link href="/shop?category=georgette-reet" className="hover:text-[#90c4ff] transition">
                  Georgette Reet
                </Link>
              </li>
              <li>
                <Link href="/shop?category=silk-noorani" className="hover:text-[#90c4ff] transition">
                  Silk Noorani
                </Link>
              </li>
              <li>
                <Link href="/shop?category=banarasi-virasat" className="hover:text-[#90c4ff] transition">
                  Banarasi Virasat
                </Link>
              </li>
              <li>
                <Link href="/shop" className="text-[#90c4ff] font-semibold hover:underline inline-block pt-0.5">
                  All 21 Sarees →
                </Link>
              </li>
            </ul>
          </div>

          {/* Atelier & Heritage Column */}
          <div>
            <h4 className="font-serif text-xs font-bold text-white uppercase tracking-wider mb-2.5">
              Atelier & Care
            </h4>
            <ul className="space-y-1.5 text-[11px] sm:text-xs">
              <li>
                <Link href="/about" className="hover:text-[#90c4ff] transition">
                  Heritage of Adda
                </Link>
              </li>
              <li>
                <Link href="/about#video-policy" className="hover:text-[#90c4ff] transition">
                  Video Verification
                </Link>
              </li>
              <li>
                <Link href="/about#care-guide" className="hover:text-[#90c4ff] transition">
                  Saree Care Guide
                </Link>
              </li>
              <li>
                <Link href="/account" className="hover:text-[#90c4ff] transition">
                  Patron Portal
                </Link>
              </li>
              <li>
                <Link href="/api-docs" className="hover:text-[#90c4ff] transition flex items-center gap-1 text-[#90c4ff]">
                  <Code2 className="w-3.5 h-3.5" /> API Specs
                </Link>
              </li>
            </ul>
          </div>

          {/* Concierge Info Column */}
          <div className="col-span-2 md:col-span-1">
            <h4 className="font-serif text-xs font-bold text-white uppercase tracking-wider mb-2.5">
              Jodhpur Concierge
            </h4>
            <ul className="space-y-1.5 text-[11px] sm:text-xs text-neutral-300">
              <li className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#C1272D] shrink-0 mt-0.5" />
                <span className="leading-snug">
                  Paota B Road, Jodhpur, Rajasthan – 342001
                </span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#C1272D] shrink-0" />
                <a href="tel:+918824017443" className="hover:text-[#90c4ff] transition">
                  +91 88240 17443
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#C1272D] shrink-0" />
                <a href="mailto:vitastabysmita@gmail.com" className="hover:text-[#90c4ff] transition truncate">
                  vitastabysmita@gmail.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Copyright Strip */}
        <div className="mt-6 sm:mt-8 pt-3 sm:pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-[10px] sm:text-[11px] text-neutral-400 gap-1.5 text-center sm:text-left">
          <p>© {new Date().getFullYear()} VITASTA Lifestyle. Handcrafted in Jodhpur, India.</p>
          <div className="flex items-center gap-3">
            <Link href="/about" className="hover:text-white transition">Heritage</Link>
            <span>•</span>
            <Link href="/contact" className="hover:text-white transition">Concierge</Link>
            <span>•</span>
            <Link href="/account" className="hover:text-white transition">Account</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
