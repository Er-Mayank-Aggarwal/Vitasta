'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Mail, Phone, MapPin, Sparkles, Send, ShieldCheck, Video, Heart, CheckCircle2, Code2 } from 'lucide-react';
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
      {/* Pre-Footer Trust Bar - Sleek & Compact */}
      <div className="border-b border-white/10 py-5 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-6 text-left">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10">
            <div className="w-8 h-8 rounded-full bg-[#C1272D]/20 flex items-center justify-center text-[#90c4ff] shrink-0">
              <Sparkles className="w-4 h-4 text-[#90c4ff]" />
            </div>
            <div>
              <h4 className="font-serif font-bold text-white text-xs">Jodhpur Handloom Adda</h4>
              <p className="text-[11px] text-neutral-300">Handcrafted by generational karigars</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10">
            <div className="w-8 h-8 rounded-full bg-[#C1272D]/20 flex items-center justify-center text-[#90c4ff] shrink-0">
              <Video className="w-4 h-4 text-[#90c4ff]" />
            </div>
            <div>
              <h4 className="font-serif font-bold text-white text-xs">Pre-Dispatch Loom Video</h4>
              <p className="text-[11px] text-neutral-300">HD video proof prior to courier</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10">
            <div className="w-8 h-8 rounded-full bg-[#C1272D]/20 flex items-center justify-center text-[#90c4ff] shrink-0">
              <ShieldCheck className="w-4 h-4 text-[#90c4ff]" />
            </div>
            <div>
              <h4 className="font-serif font-bold text-white text-xs">Sovereign Insured Courier</h4>
              <p className="text-[11px] text-neutral-300">Free delivery across India</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content - Streamlined for Mobile & Desktop */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand & Newsletter */}
          <div className="space-y-3 sm:col-span-2 lg:col-span-1">
            <Link href="/" className="inline-block">
              <span className="font-serif text-2xl font-bold tracking-[0.2em] text-white">
                VIT<span className="text-[#C1272D]">A</span>STA
              </span>
              <p className="text-[9px] uppercase tracking-[0.25em] text-[#90c4ff] font-sans font-semibold -mt-0.5">
                by Smita Saraswat • Jodhpur
              </p>
            </Link>
            <p className="text-xs text-neutral-300 leading-relaxed font-light">
              Premium royal sarees handcrafted on traditional addas in Jodhpur, Rajasthan.
            </p>

            {/* Compact Newsletter */}
            <div className="pt-2">
              <span className="text-[11px] uppercase tracking-wider text-[#90c4ff] font-semibold block mb-1.5">
                Royal Gazette
              </span>
              {subscribed ? (
                <div className="flex items-center gap-1.5 text-xs text-emerald-400">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Subscribed successfully.
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex gap-1.5 max-w-xs">
                  <input
                    type="email"
                    required
                    placeholder="Enter email..."
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-1 px-3 py-1.5 text-xs rounded-lg bg-white/10 border border-white/20 text-white placeholder-neutral-400 focus:outline-none focus:ring-1 focus:ring-[#C1272D]"
                  />
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-3.5 py-1.5 bg-[#C1272D] hover:bg-[#A01F25] text-white rounded-lg text-xs font-bold transition shrink-0 cursor-pointer"
                  >
                    {loading ? '...' : <Send className="w-3.5 h-3.5" />}
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Collections */}
          <div>
            <h4 className="font-serif text-xs font-bold text-white uppercase tracking-wider mb-3">
              Collections
            </h4>
            <ul className="space-y-1.5 text-xs">
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
                <Link href="/shop" className="text-[#90c4ff] font-semibold hover:underline inline-block mt-1">
                  View All 21 Sarees →
                </Link>
              </li>
            </ul>
          </div>

          {/* Policies & API */}
          <div>
            <h4 className="font-serif text-xs font-bold text-white uppercase tracking-wider mb-3">
              Heritage & Atelier
            </h4>
            <ul className="space-y-1.5 text-xs">
              <li>
                <Link href="/about" className="hover:text-[#90c4ff] transition">
                  Heritage of Adda
                </Link>
              </li>
              <li>
                <Link href="/about#video-policy" className="hover:text-[#90c4ff] transition">
                  Pre-Dispatch Loom Video
                </Link>
              </li>
              <li>
                <Link href="/about#care-guide" className="hover:text-[#90c4ff] transition">
                  Saree Care Guide
                </Link>
              </li>
              <li>
                <Link href="/api-docs" className="hover:text-[#90c4ff] transition flex items-center gap-1 text-[#90c4ff]">
                  <Code2 className="w-3.5 h-3.5" /> Swagger API Docs
                </Link>
              </li>
            </ul>
          </div>

          {/* Concierge Info */}
          <div>
            <h4 className="font-serif text-xs font-bold text-white uppercase tracking-wider mb-3">
              Concierge
            </h4>
            <ul className="space-y-2 text-xs text-neutral-300">
              <li className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#C1272D] shrink-0 mt-0.5" />
                <span className="text-[11px] leading-snug">
                  House No. 10A, Kanti, Paota B Road, Jodhpur – 342001
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
                <a href="mailto:vitastabysmita@gmail.com" className="hover:text-[#90c4ff] transition">
                  vitastabysmita@gmail.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="mt-8 pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-[11px] text-neutral-400 gap-2 text-center sm:text-left">
          <p>© {new Date().getFullYear()} VITASTA Lifestyle. Handcrafted in Jodhpur, India.</p>
          <div className="flex items-center gap-4 text-xs">
            <Link href="/about" className="hover:text-white transition">Heritage</Link>
            <Link href="/contact" className="hover:text-white transition">Concierge</Link>
            <Link href="/account" className="hover:text-white transition">Patron Portal</Link>
            <Link href="/api-docs" className="hover:text-[#90c4ff] transition">API Docs</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
