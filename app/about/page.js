import Link from 'next/link';
import Image from 'next/image';
import {
  Sparkles,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';

export const metadata = {
  title: 'Heritage & Craftsmanship | VITASTA Saree Atelier Jodhpur',
  description:
    'Learn about Vitasta by Smita Saraswat — handcrafted sarees inspired by the royal queens of Rajasthan, created on traditional wooden addas in Jodhpur.',
};

export default function AboutPage() {
  return (
    <div className="min-h-screen py-12 sm:py-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
      {/* Hero Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-widest text-[#C1272D] bg-rose-50 border border-rose-200">
          <Sparkles className="w-3.5 h-3.5" /> Born in Jodhpur, Rajasthan
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#0B3B60]">
          Unfolding Serenity
        </h1>
        <p className="text-sm sm:text-base text-neutral-600 leading-relaxed font-light">
          Vitasta by Smita Saraswat is a premium handcrafted saree atelier from Jodhpur, Rajasthan, inspired by the timeless grace and grandeur of the royal women of Rajasthan.
        </p>
      </div>

      {/* Main Story Image */}
      <div className="relative aspect-[16/9] sm:aspect-[21/9] rounded-3xl overflow-hidden shadow-xl border border-neutral-200 bg-neutral-900">
        <Image
          src="https://res.cloudinary.com/sjl1rfvu/image/upload/v1789675055/vitasta/products/royal-blue-banarasi-khaddi-georgette-lace-cutwork-saree/j3u6zeguqc77gecozmq8.jpg"
          alt="Royal Saree Craftsmanship"
          fill
          className="object-cover object-center opacity-85"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
        <div className="absolute bottom-6 left-6 right-6 text-white text-xs sm:text-sm font-serif italic">
          &ldquo;Every saree is an heirloom in the making—crafted with patient hands on traditional addas.&rdquo;
        </div>
      </div>

      {/* Craftsmanship Narrative */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start text-xs sm:text-sm text-neutral-700 leading-relaxed">
        <div className="space-y-4">
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#0B3B60]">
            The Traditional Adda Frame
          </h2>
          <p>
            Much of our intricate embroidery is executed on a traditional wooden <em>adda</em> frame. Master karigars sit alongside the stretched pure fabric for weeks, meticulously weaving Zardozi wires, Gota Patti ribbons, Pitta beaten gold, Cutdana beads, and shimmering motis.
          </p>
          <p>
            There are no shortcuts on the adda. Every leaf motif, geometric border, and scalloped pallu is born from pure patience and decades of generational expertise.
          </p>
        </div>

        <div className="space-y-4">
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#0B3B60]">
            Regal Heritage Reimagined
          </h2>
          <p>
            Our designs are created keeping royal Rajasthani heritage in mind—reimagining the richness of historical drapes for the contemporary woman who appreciates subtlety, authenticity, and enduring luxury.
          </p>
          <p>
            From fluid sunset chiffons to heavy Habutai silks and Kadhwa Banarasi georgettes, each piece carries an unmistakable aura of dignity and grace.
          </p>
        </div>
      </div>

      {/* Saree Care Guide Section */}
      <div id="care-guide" className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-[#071E3D] via-[#0B3B60] to-[#071E3D] text-white border border-white/15 space-y-6">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-[#90c4ff]" />
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-white">
            Saree Care & Muslin Preservation Guide
          </h2>
        </div>

        <p className="text-xs sm:text-sm text-neutral-200 font-light">
          Care for it with love, and your Vitasta saree will become a timeless heirloom—made to be cherished, preserved, and passed down through generations.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-white/5 border border-white/10">
            <CheckCircle2 className="w-4 h-4 text-[#90c4ff] shrink-0 mt-0.5" />
            <span><strong>Dry Clean Only:</strong> Strictly avoid machine wash or regular hand wash.</span>
          </div>
          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-white/5 border border-white/10">
            <CheckCircle2 className="w-4 h-4 text-[#90c4ff] shrink-0 mt-0.5" />
            <span><strong>Muslin Storage:</strong> Store in a clean muslin or cotton bag; avoid plastic covers for long-term storage.</span>
          </div>
          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-white/5 border border-white/10">
            <CheckCircle2 className="w-4 h-4 text-[#90c4ff] shrink-0 mt-0.5" />
            <span><strong>Protect From Sun & Moisture:</strong> Keep away from direct sunlight to preserve delicate dyes and pure zari.</span>
          </div>
          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-white/5 border border-white/10">
            <CheckCircle2 className="w-4 h-4 text-[#90c4ff] shrink-0 mt-0.5" />
            <span><strong>Delicate Ironing:</strong> Use a low-heat iron from the reverse side or place a soft cotton cloth over embroidery.</span>
          </div>
        </div>
      </div>

      {/* Consultation CTA */}
      <div className="text-center space-y-4 pt-4">
        <h3 className="font-serif text-2xl font-bold text-[#0B3B60]">
          Experience Vitasta Craftsmanship
        </h3>
        <p className="text-xs text-neutral-500 max-w-md mx-auto">
          Schedule a private bespoke consultation or explore our 21 handcrafted sarees.
        </p>
        <div className="flex justify-center gap-4 pt-2">
          <Link
            href="/shop"
            className="px-6 py-3 rounded-full bg-[#C1272D] hover:bg-[#9B1B1E] text-white text-xs font-semibold uppercase tracking-wider shadow-sm"
          >
            Explore Sarees
          </Link>
          <Link
            href="/contact"
            className="px-6 py-3 rounded-full border border-[#0B3B60] text-[#0B3B60] text-xs font-semibold uppercase tracking-wider hover:bg-neutral-50"
          >
            Contact Atelier
          </Link>
        </div>
      </div>
    </div>
  );
}
