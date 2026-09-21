'use client';

import { useState } from 'react';
import { Mail, Calendar, Search, Sparkles, Copy, CheckCircle2, Trash2 } from 'lucide-react';
import { deleteSubscriber } from '@/app/actions/admin-actions';
import { useRouter } from 'next/navigation';

export default function AdminSubscribersClient({ initialSubscribers = [] }) {
  const router = useRouter();
  const [subscribers, setSubscribers] = useState(initialSubscribers);
  const [searchQuery, setSearchQuery] = useState('');
  const [copied, setCopied] = useState(false);

  const filtered = subscribers.filter((s) =>
    (s.email || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCopyAll = () => {
    const emails = subscribers.map((s) => s.email).join(', ');
    navigator.clipboard.writeText(emails);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDelete = async (id) => {
    await deleteSubscriber(id);
    setSubscribers((prev) => prev.filter((s) => s.id !== id));
    router.refresh();
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase tracking-widest text-[#0B3B60] font-bold flex items-center gap-1.5 mb-1">
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" /> Newsletter & Royal Circle
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#0B3B60]">
            Email Subscribers
          </h1>
          <p className="text-xs text-neutral-500 mt-0.5">
            Manage patrons subscribed to festive handloom releases, trunk shows, and royal updates
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleCopyAll}
            className="px-4 py-2 rounded-xl bg-[#0B3B60] hover:bg-[#062238] text-white font-bold text-xs flex items-center gap-1.5 transition shadow-sm"
          >
            {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-[#D4AF37]" />}
            {copied ? 'Emails Copied!' : 'Copy All Emails'}
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by email..."
          className="w-full bg-white border border-neutral-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-[#0B3B60] shadow-sm"
        />
      </div>

      {/* Table */}
      <div className="bg-white border border-neutral-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8F9FA] border-b border-neutral-200 uppercase tracking-wider text-neutral-600 font-semibold">
              <tr>
                <th className="p-4">Subscriber Email</th>
                <th className="p-4">Subscribed Date</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 text-neutral-700">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={3} className="text-center py-12 text-neutral-400 font-medium">
                    No subscribers found.
                  </td>
                </tr>
              ) : (
                filtered.map((sub) => (
                  <tr key={sub.id} className="hover:bg-neutral-50 transition">
                    <td className="p-4 flex items-center gap-2 text-neutral-900 font-medium">
                      <Mail className="w-3.5 h-3.5 text-[#0B3B60]" />
                      <span>{sub.email}</span>
                    </td>
                    <td className="p-4 text-neutral-500">
                      {new Date(sub.date).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => handleDelete(sub.id)}
                        className="p-1.5 rounded-lg bg-neutral-100 hover:bg-rose-600 text-neutral-600 hover:text-white transition"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
