'use client';

import { useState } from 'react';
import {
  Star,
  CheckCircle2,
  XCircle,
  MessageSquare,
  Sparkles,
  Trash2,
  Calendar,
  User,
} from 'lucide-react';
import { approveReview, deleteReview } from '@/app/actions/admin-actions';
import { useRouter } from 'next/navigation';

export default function AdminReviewsClient({ initialReviews = [] }) {
  const router = useRouter();
  const [reviews, setReviews] = useState(initialReviews);
  const [filterApproval, setFilterApproval] = useState('all'); // all, approved, pending
  const [isProcessing, setIsProcessing] = useState(false);

  const handleApprove = async (id) => {
    if (isProcessing) return;
    setIsProcessing(true);
    const res = await approveReview(id);
    if (res.success) {
      setReviews((prev) =>
        prev.map((r) => (r.id === id ? { ...r, isApproved: true } : r))
      );
      router.refresh();
    }
    setIsProcessing(false);
  };

  const handleReject = async (id) => {
    if (isProcessing) return;
    setIsProcessing(true);
    const res = await deleteReview(id);
    if (res.success) {
      setReviews((prev) => prev.filter((r) => r.id !== id));
      router.refresh();
    }
    setIsProcessing(false);
  };

  const filtered = reviews.filter((r) => {
    if (filterApproval === 'approved') return r.isApproved;
    if (filterApproval === 'pending') return !r.isApproved;
    return true;
  });

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={i < rating ? 'text-[#D4AF37]' : 'text-neutral-600'}>
        ★
      </span>
    ));
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase tracking-widest text-[#0B3B60] font-bold flex items-center gap-1.5 mb-1">
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" /> Royal Patron Testimonials
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#0B3B60]">
            Customer Reviews & Feedback
          </h1>
          <p className="text-xs text-neutral-500 mt-0.5">
            Moderate voices of royal patrons, verify orders, and feature authentic handcrafted impressions
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setFilterApproval('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
              filterApproval === 'all'
                ? 'bg-[#0B3B60] text-white font-bold shadow-sm'
                : 'bg-white border border-neutral-200 text-neutral-700 hover:bg-neutral-50 shadow-sm'
            }`}
          >
            All ({reviews.length})
          </button>
          <button
            onClick={() => setFilterApproval('pending')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
              filterApproval === 'pending'
                ? 'bg-[#0B3B60] text-white font-bold shadow-sm'
                : 'bg-white border border-neutral-200 text-neutral-700 hover:bg-neutral-50 shadow-sm'
            }`}
          >
            Pending Review
          </button>
          <button
            onClick={() => setFilterApproval('approved')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
              filterApproval === 'approved'
                ? 'bg-[#0B3B60] text-white font-bold shadow-sm'
                : 'bg-white border border-neutral-200 text-neutral-700 hover:bg-neutral-50 shadow-sm'
            }`}
          >
            Published
          </button>
        </div>
      </div>

      {/* Reviews Cards List */}
      {filtered.length === 0 ? (
        <div className="bg-white border border-neutral-200 rounded-2xl p-12 text-center text-neutral-500 text-xs shadow-sm">
          <MessageSquare className="w-8 h-8 mx-auto text-[#0B3B60]/40 mb-3" />
          <p className="text-sm font-serif font-bold text-neutral-900">No Reviews in this Queue</p>
          <p className="text-neutral-500 mt-1">Patron reviews will appear here for verification.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((rev) => (
            <div
              key={rev.id}
              className="bg-white border border-neutral-200 rounded-2xl p-5 sm:p-6 space-y-4 shadow-sm"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-50 text-[#0B3B60] font-bold flex items-center justify-center text-xs shrink-0 border border-blue-200">
                    {rev.author?.charAt(0).toUpperCase() || 'P'}
                  </div>
                  <div>
                    <h4 className="font-serif font-bold text-neutral-900 text-xs">{rev.author}</h4>
                    <p className="text-[11px] text-neutral-500">{rev.productTitle}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm">{renderStars(rev.rating)}</div>
                  <span className="text-[10px] text-neutral-400">
                    {new Date(rev.date).toLocaleDateString('en-IN')}
                  </span>
                </div>
              </div>

              <div className="bg-neutral-50 p-3.5 rounded-xl border border-neutral-200">
                <p className="text-xs text-neutral-700 leading-relaxed italic">
                  &ldquo;{rev.comment}&rdquo;
                </p>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-neutral-100 text-xs">
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                    rev.isApproved
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                      : 'bg-amber-50 text-amber-800 border-amber-200'
                  }`}
                >
                  {rev.isApproved ? '✓ Published on Website' : '⏳ Pending Approval'}
                </span>

                <div className="flex gap-2">
                  {!rev.isApproved && (
                    <button
                      onClick={() => handleApprove(rev.id)}
                      disabled={isProcessing}
                      className="px-3 py-1 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] transition shadow-xs"
                    >
                      Approve
                    </button>
                  )}
                  <button
                    onClick={() => handleReject(rev.id)}
                    disabled={isProcessing}
                    className="p-1.5 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-200 transition"
                    title="Delete Review"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
