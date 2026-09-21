'use client';

import { useState } from 'react';
import {
  Plus,
  Edit3,
  Trash2,
  X,
  Tag,
  Copy,
  CheckCircle2,
  XCircle,
  Calendar,
  Sparkles,
  Percent,
} from 'lucide-react';
import {
  createCoupon,
  updateCoupon,
  deleteCoupon,
  toggleCoupon,
} from '@/app/actions/coupon-actions';
import { useRouter } from 'next/navigation';

export default function AdminCouponsClient({ initialCoupons = [] }) {
  const router = useRouter();
  const [coupons, setCoupons] = useState(initialCoupons);
  const [showModal, setShowModal] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [copiedCode, setCopiedCode] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const emptyForm = {
    code: '',
    discountType: 'PERCENTAGE',
    value: '',
    minimumOrder: '',
    maximumDiscount: '',
    usageLimit: '',
    expiresAt: '',
    isActive: true,
  };
  const [formData, setFormData] = useState(emptyForm);

  const handleAdd = () => {
    setEditingCoupon(null);
    setFormData(emptyForm);
    setError(null);
    setShowModal(true);
  };

  const handleEdit = (coupon) => {
    setEditingCoupon(coupon);
    setFormData({
      code: coupon.code,
      discountType: coupon.discountType,
      value: coupon.value,
      minimumOrder: coupon.minimumOrder || '',
      maximumDiscount: coupon.maximumDiscount || '',
      usageLimit: coupon.usageLimit || '',
      expiresAt: coupon.expiresAt ? new Date(coupon.expiresAt).toISOString().split('T')[0] : '',
      isActive: coupon.isActive,
    });
    setError(null);
    setShowModal(true);
  };

  const handleSave = async (e) => {
    if (e) e.preventDefault();
    if (!formData.code || !formData.value) {
      setError('Please provide coupon code and discount value');
      return;
    }
    setSaving(true);
    setError(null);

    const payload = {
      code: formData.code,
      discountType: formData.discountType,
      value: Number(formData.value),
      minimumOrder: formData.minimumOrder ? Number(formData.minimumOrder) : null,
      maximumDiscount: formData.maximumDiscount ? Number(formData.maximumDiscount) : null,
      usageLimit: formData.usageLimit ? Number(formData.usageLimit) : null,
      expiresAt: formData.expiresAt || null,
      isActive: formData.isActive,
    };

    let result;
    if (editingCoupon) {
      result = await updateCoupon(editingCoupon.id, payload);
    } else {
      result = await createCoupon(payload);
    }

    if (result.success) {
      if (result.data) {
        if (editingCoupon) {
          setCoupons((prev) => prev.map((c) => (c.id === result.data.id ? result.data : c)));
        } else {
          setCoupons((prev) => [result.data, ...prev]);
        }
      }
      setShowModal(false);
      setEditingCoupon(null);
      setFormData(emptyForm);
      router.refresh();
    } else {
      setError(result.error || 'Failed to save coupon');
    }
    setSaving(false);
  };

  const handleToggle = async (id) => {
    const res = await toggleCoupon(id);
    if (res.success) {
      setCoupons((prev) =>
        prev.map((c) => (c.id === id ? { ...c, isActive: !c.isActive } : c))
      );
      router.refresh();
    }
  };

  const handleDelete = async (id) => {
    const res = await deleteCoupon(id);
    if (res.success) {
      setCoupons((prev) => prev.filter((c) => c.id !== id));
      setShowDeleteConfirm(null);
      router.refresh();
    }
  };

  const handleCopy = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase tracking-widest text-[#0B3B60] font-bold flex items-center gap-1.5 mb-1">
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" /> Patron Privileges & Promotions
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#0B3B60]">
            Royal Vouchers & Promo Codes
          </h1>
          <p className="text-xs text-neutral-500 mt-0.5">
            Create festive discounts, bridal consultation codes, and patron privilege vouchers
          </p>
        </div>

        <button
          onClick={handleAdd}
          className="px-4 py-2.5 rounded-xl bg-[#0B3B60] hover:bg-[#062238] text-white text-xs font-bold uppercase tracking-wider transition flex items-center gap-2 shadow-sm self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 text-[#D4AF37]" /> Create Voucher
        </button>
      </div>

      {/* Coupons Table */}
      <div className="bg-white border border-neutral-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8F9FA] border-b border-neutral-200 uppercase tracking-wider text-neutral-600 font-semibold">
              <tr>
                <th className="p-4">Voucher Code</th>
                <th className="p-4">Discount</th>
                <th className="p-4">Min. Order</th>
                <th className="p-4">Expiry Date</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 text-neutral-700">
              {coupons.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-neutral-400 font-medium">
                    No promo vouchers configured. Click &ldquo;Create Voucher&rdquo; to add one.
                  </td>
                </tr>
              ) : (
                coupons.map((coupon) => (
                  <tr key={coupon.id} className="hover:bg-neutral-50 transition">
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-[#0B3B60] bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200 text-xs">
                          {coupon.code}
                        </span>
                        <button
                          onClick={() => handleCopy(coupon.code)}
                          className="p-1 text-neutral-400 hover:text-[#0B3B60]"
                          title="Copy Code"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                        {copiedCode === coupon.code && (
                          <span className="text-[10px] text-emerald-600 font-semibold">Copied!</span>
                        )}
                      </div>
                    </td>
                    <td className="p-4 font-serif font-bold text-neutral-900">
                      {coupon.discountType === 'PERCENTAGE' ? `${coupon.value}% OFF` : `₹${coupon.value} OFF`}
                    </td>
                    <td className="p-4">
                      {coupon.minimumOrder ? `₹${coupon.minimumOrder.toLocaleString('en-IN')}` : 'No minimum'}
                    </td>
                    <td className="p-4">
                      {coupon.expiresAt
                        ? new Date(coupon.expiresAt).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })
                        : 'No expiry'}
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() => handleToggle(coupon.id)}
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold border transition ${
                          coupon.isActive
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            : 'bg-neutral-100 text-neutral-500 border-neutral-200'
                        }`}
                      >
                        {coupon.isActive ? 'Active' : 'Inactive'}
                      </button>
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <button
                        onClick={() => handleEdit(coupon)}
                        className="p-1.5 rounded-lg bg-neutral-100 hover:bg-[#0B3B60] text-neutral-600 hover:text-white transition inline-flex items-center"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setShowDeleteConfirm(coupon.id)}
                        className="p-1.5 rounded-lg bg-neutral-100 hover:bg-rose-600 text-neutral-600 hover:text-white transition inline-flex items-center"
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

      {/* Modal for Add/Edit */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-neutral-200 rounded-2xl max-w-lg w-full p-6 sm:p-8 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
              <h3 className="font-serif text-lg font-bold text-[#0B3B60]">
                {editingCoupon ? 'Edit Royal Voucher' : 'Create Royal Promo Voucher'}
              </h3>
              <button onClick={() => setShowModal(false)} className="p-1 text-neutral-400 hover:text-neutral-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
                {error}
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="text-neutral-700 font-semibold">Voucher Code</label>
                <input
                  type="text"
                  required
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  placeholder="e.g. ROYAL10, BRIDAL15"
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2 text-neutral-900 font-mono uppercase focus:outline-none focus:border-[#0B3B60]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-neutral-700 font-semibold">Discount Type</label>
                  <select
                    value={formData.discountType}
                    onChange={(e) => setFormData({ ...formData, discountType: e.target.value })}
                    className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2 text-neutral-900 focus:outline-none focus:border-[#0B3B60]"
                  >
                    <option value="PERCENTAGE">Percentage (%)</option>
                    <option value="FIXED">Flat Amount (INR ₹)</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-neutral-700 font-semibold">Discount Value</label>
                  <input
                    type="number"
                    required
                    value={formData.value}
                    onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                    placeholder="10 (for 10% or ₹10)"
                    className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2 text-neutral-900 focus:outline-none focus:border-[#0B3B60]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-neutral-700 font-semibold">Min. Order Amount (₹)</label>
                  <input
                    type="number"
                    value={formData.minimumOrder}
                    onChange={(e) => setFormData({ ...formData, minimumOrder: e.target.value })}
                    placeholder="Optional, e.g. 15000"
                    className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2 text-neutral-900"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-neutral-700 font-semibold">Expiry Date</label>
                  <input
                    type="date"
                    value={formData.expiresAt}
                    onChange={(e) => setFormData({ ...formData, expiresAt: e.target.value })}
                    className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2 text-neutral-900"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-neutral-200">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl bg-neutral-100 text-neutral-700 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 rounded-xl bg-[#0B3B60] hover:bg-[#062238] text-white font-bold uppercase tracking-wider disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save Voucher'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
