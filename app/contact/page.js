'use client';

import { useState } from 'react';
import { Mail, Phone, MapPin, Send, Sparkles, CheckCircle2, AlertCircle, Clock, Video } from 'lucide-react';
import { submitContactMessage } from '@/app/actions/contact-actions';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'Bespoke Saree Consultation',
    message: '',
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const res = await submitContactMessage(formData);
    if (res.success) {
      setSuccess(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: 'Bespoke Saree Consultation',
        message: '',
      });
    } else {
      setError(res.error || 'Failed to send message.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen py-12 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-widest text-[#0B3B60] bg-blue-50 border border-blue-200">
          <Sparkles className="w-3.5 h-3.5 text-[#0B3B60]" /> Royal Atelier Concierge
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#0B3B60]">
          Connect with Our Jodhpur Atelier
        </h1>
        <p className="text-xs sm:text-sm text-neutral-600">
          Have an inquiry about bespoke bridal drapes, adda customization, or pre-dispatch loom videos? We are here to assist you.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Col: Contact Info */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-8 rounded-3xl bg-white border border-neutral-200 shadow-sm space-y-6">
            <h2 className="font-serif text-xl font-bold text-[#0B3B60]">
              Vitasta Lifestyle
            </h2>
            <p className="text-xs text-neutral-500 font-sans uppercase tracking-wider -mt-4">
              by Smita Saraswat • Jodhpur
            </p>

            <div className="space-y-4 text-xs text-neutral-700">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#0B3B60] shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-neutral-900">Artisan Atelier Address</strong>
                  <span>House No. 10A, Kanti, Paota B Road, Near Jalam Niwas, Jodhpur, Rajasthan – 342001, India</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-[#0B3B60] shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-neutral-900">Concierge & WhatsApp</strong>
                  <a href="tel:+918824017443" className="hover:text-[#0B3B60] block">
                    +91 88240 17443
                  </a>
                  <a
                    href="https://wa.me/918824017443"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#C1272D] font-semibold hover:underline inline-block mt-0.5"
                  >
                    Chat on WhatsApp →
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-[#0B3B60] shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-neutral-900">Official Email</strong>
                  <a href="mailto:vitastabysmita@gmail.com" className="hover:text-[#0B3B60]">
                    vitastabysmita@gmail.com
                  </a>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-neutral-100 space-y-2 text-xs text-neutral-500">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#0B3B60]" />
                <span>Atelier Hours: Mon – Sat, 10:00 AM – 7:00 PM IST</span>
              </div>
              <div className="flex items-center gap-2">
                <Video className="w-4 h-4 text-[#0B3B60]" />
                <span>Video calls available upon appointment</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Col: Consultation Form */}
        <div className="lg:col-span-7">
          <form
            onSubmit={handleSubmit}
            className="p-8 rounded-3xl bg-white border border-neutral-200 shadow-sm space-y-4"
          >
            <h2 className="font-serif text-xl font-bold text-[#0B3B60]">
              Send an Atelier Inquiry
            </h2>

            {success && (
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5" />
                <span>Thank you! Your message has been received by our concierge team.</span>
              </div>
            )}

            {error && (
              <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
                <AlertCircle className="w-5 h-5" />
                <span>{error}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-1">
                  Your Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Smt. Gayatri Devi"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-2.5 text-xs rounded-xl border border-neutral-300 bg-neutral-50 text-neutral-900 focus:outline-none focus:border-[#0B3B60]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-1">
                  WhatsApp Phone Number *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="+91 98765 43210"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full p-2.5 text-xs rounded-xl border border-neutral-300 bg-neutral-50 text-neutral-900 focus:outline-none focus:border-[#0B3B60]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1">
                Email Address *
              </label>
              <input
                type="email"
                required
                placeholder="patron@vitasta.luxury"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full p-2.5 text-xs rounded-xl border border-neutral-300 bg-neutral-50 text-neutral-900 focus:outline-none focus:border-[#0B3B60]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1">
                Subject
              </label>
              <select
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                className="w-full p-2.5 text-xs rounded-xl border border-neutral-300 bg-neutral-50 text-neutral-900 focus:outline-none focus:border-[#0B3B60]"
              >
                <option value="Bespoke Saree Consultation">Bespoke Saree Consultation</option>
                <option value="Bridal Drape Inquiry">Bridal Drape Inquiry</option>
                <option value="Custom Blouse Tailoring">Custom Blouse Tailoring</option>
                <option value="Pre-Dispatch Loom Video Status">Pre-Dispatch Loom Video Status</option>
                <option value="Other Concierge Request">Other Concierge Request</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1">
                Message / Consultation Details *
              </label>
              <textarea
                rows={4}
                required
                placeholder="Tell us about your event, preferred fabric, or customization preferences..."
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full p-2.5 text-xs rounded-xl border border-neutral-300 bg-neutral-50 text-neutral-900 focus:outline-none focus:border-[#0B3B60]"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-6 rounded-xl bg-[#0B3B60] hover:bg-[#062238] text-white font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-sm transition"
            >
              {loading ? 'Submitting...' : (
                <>
                  Send Message to Concierge <Send className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
