'use client';

import { useState } from 'react';
import {
  Mail,
  MessageSquare,
  Calendar,
  Phone,
  Search,
  Sparkles,
  ExternalLink,
  CheckCircle2,
  Trash2,
} from 'lucide-react';
import { markMessageRead, deleteMessage } from '@/app/actions/admin-actions';
import { useRouter } from 'next/navigation';

export default function AdminMessagesClient({ initialMessages = [] }) {
  const router = useRouter();
  const [messages, setMessages] = useState(initialMessages);
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = messages.filter(
    (m) =>
      (m.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (m.email || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (m.subject || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (m.message || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleMarkRead = async (id) => {
    await markMessageRead(id);
    setMessages((prev) =>
      prev.map((m) => (m.id === id ? { ...m, isRead: true } : m))
    );
    router.refresh();
  };

  const handleDelete = async (id) => {
    await deleteMessage(id);
    setMessages((prev) => prev.filter((m) => m.id !== id));
    router.refresh();
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase tracking-widest text-[#0B3B60] font-bold flex items-center gap-1.5 mb-1">
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" /> Atelier Concierge & Inquiries
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#0B3B60]">
            Client Inquiries & Custom Requests
          </h1>
          <p className="text-xs text-neutral-500 mt-0.5">
            View bespoke saree consultations and direct messages submitted by patrons
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3.5 py-1.5 rounded-xl bg-blue-50 border border-blue-200 text-[#0B3B60] font-serif font-bold text-xs shadow-sm">
            Inbox: {messages.length}
          </span>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by name, email, or custom inquiry topic..."
          className="w-full bg-white border border-neutral-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-[#0B3B60] shadow-sm"
        />
      </div>

      {/* Messages Grid */}
      {filtered.length === 0 ? (
        <div className="bg-white border border-neutral-200 rounded-2xl p-12 text-center text-neutral-500 text-xs shadow-sm">
          <MessageSquare className="w-8 h-8 mx-auto text-[#0B3B60]/40 mb-3" />
          <p className="text-sm font-serif font-bold text-neutral-900">No Inquiries Found</p>
          <p className="text-neutral-500 mt-1">Patron bespoke inquiries will appear here.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filtered.map((msg) => {
            const waNumber = (msg.phone || '').replace(/[^0-9]/g, '');
            const waUrl = waNumber ? `https://wa.me/${waNumber}?text=${encodeURIComponent(`Hello ${msg.name}, thank you for your inquiry with Vitasta Atelier regarding: "${msg.subject}". How may we assist you?`)}` : null;

            return (
              <div
                key={msg.id}
                className="bg-white border border-neutral-200 rounded-2xl p-5 sm:p-6 space-y-4 shadow-sm hover:border-[#0B3B60]/40 transition"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-50 border border-blue-200 text-[#0B3B60] font-bold flex items-center justify-center text-xs shrink-0">
                      {msg.name?.charAt(0).toUpperCase() || 'P'}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-serif font-bold text-neutral-900 text-sm">{msg.name}</h4>
                        {!msg.isRead && (
                          <span className="px-2 py-0.5 rounded-full bg-[#0B3B60] text-white text-[9px] font-bold">
                            NEW
                          </span>
                        )}
                      </div>
                      <div className="flex flex-wrap items-center gap-3 text-neutral-500 text-[11px] mt-0.5">
                        <span className="flex items-center gap-1">
                          <Mail className="w-3 h-3" /> {msg.email}
                        </span>
                        {msg.phone && (
                          <span className="flex items-center gap-1">
                            <Phone className="w-3 h-3" /> {msg.phone}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="text-[11px] text-neutral-500 flex items-center gap-1 bg-neutral-100 px-3 py-1 rounded-xl self-start">
                    <Calendar className="w-3 h-3" />
                    {new Date(msg.date).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </div>
                </div>

                <div className="bg-neutral-50 p-4 rounded-xl border border-neutral-200 space-y-1.5">
                  <p className="font-serif font-bold text-[#0B3B60] text-xs">
                    Topic: {msg.subject}
                  </p>
                  <p className="text-xs text-neutral-700 leading-relaxed whitespace-pre-wrap">
                    {msg.message}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-neutral-100 text-xs">
                  <div className="flex items-center gap-2">
                    {waUrl && (
                      <a
                        href={waUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] flex items-center gap-1 transition shadow-xs"
                      >
                        Reply on WhatsApp
                      </a>
                    )}
                    {!msg.isRead && (
                      <button
                        onClick={() => handleMarkRead(msg.id)}
                        className="px-3 py-1.5 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-[11px] font-medium transition"
                      >
                        Mark Read
                      </button>
                    )}
                  </div>

                  <button
                    onClick={() => handleDelete(msg.id)}
                    className="p-1.5 text-neutral-400 hover:text-rose-600 transition"
                    title="Delete Message"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
