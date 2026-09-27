'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  AlertTriangle,
  Package,
  Search,
  ArrowUpDown,
  Sparkles,
  Plus,
  Minus,
  Edit2,
  X,
  CheckCircle2,
  Lock,
  Layers,
  ExternalLink,
  ShieldCheck,
  RotateCcw,
} from 'lucide-react';
import { updateStock, adjustStock } from '@/app/actions/inventory-actions';
import { useRouter } from 'next/navigation';

export default function AdminInventoryClient({ initialStock = [] }) {
  const router = useRouter();
  const [stock, setStock] = useState(initialStock);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterView, setFilterView] = useState('all'); // all, low, oos, ready
  const [adjustModal, setAdjustModal] = useState(null);
  const [modalForm, setModalForm] = useState({
    quantity: '',
    lowStockThreshold: '2',
    stockStatus: 'MADE_TO_ORDER',
  });
  const [isUpdating, setIsUpdating] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState(null);

  let filtered = stock.filter((item) =>
    (item.productName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (item.categoryName || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (filterView === 'low') {
    filtered = filtered.filter((i) => i.quantity > 0 && i.quantity <= i.lowStockThreshold);
  } else if (filterView === 'oos') {
    filtered = filtered.filter((i) => i.quantity === 0 || i.stockStatus === 'OUT_OF_STOCK');
  } else if (filterView === 'ready') {
    filtered = filtered.filter((i) => i.quantity > i.lowStockThreshold);
  }

  const lowStockCount = stock.filter((i) => i.quantity > 0 && i.quantity <= i.lowStockThreshold).length;
  const oosCount = stock.filter((i) => i.quantity === 0 || i.stockStatus === 'OUT_OF_STOCK').length;
  const totalReserved = stock.reduce((acc, i) => acc + (i.reservedQuantity || 0), 0);

  const openAdjustModal = (item) => {
    setAdjustModal(item);
    setModalForm({
      quantity: String(item.quantity),
      lowStockThreshold: String(item.lowStockThreshold || 2),
      stockStatus: item.stockStatus || 'MADE_TO_ORDER',
    });
  };

  const handleQuickDelta = async (productId, delta) => {
    setActionLoadingId(productId);
    const res = await adjustStock(productId, delta);
    if (res.success) {
      setStock((prev) =>
        prev.map((item) =>
          item.productId === productId
            ? { ...item, quantity: res.quantity, stockStatus: res.stockStatus || item.stockStatus }
            : item
        )
      );
      router.refresh();
    } else {
      alert(res.error || 'Failed to adjust stock');
    }
    setActionLoadingId(null);
  };

  const handleSaveModal = async (e) => {
    if (e) e.preventDefault();
    if (!adjustModal) return;
    setIsUpdating(true);

    const qty = Math.max(0, Number(modalForm.quantity));
    const threshold = Math.max(1, Number(modalForm.lowStockThreshold));

    const result = await updateStock(adjustModal.productId, {
      quantity: qty,
      lowStockThreshold: threshold,
      stockStatus: modalForm.stockStatus,
    });

    if (result.success) {
      setStock((prev) =>
        prev.map((item) =>
          item.productId === adjustModal.productId
            ? {
                ...item,
                quantity: result.quantity,
                lowStockThreshold: result.lowStockThreshold,
                stockStatus: result.stockStatus,
              }
            : item
        )
      );
      setAdjustModal(null);
      router.refresh();
    } else {
      alert(result.error || 'Failed to update stock');
    }
    setIsUpdating(false);
  };

  const getStockLevel = (item) => {
    if (item.quantity === 0 || item.stockStatus === 'OUT_OF_STOCK')
      return { label: 'Out of Stock', color: 'bg-rose-50 text-rose-800 border-rose-200' };
    if (item.quantity <= item.lowStockThreshold)
      return { label: `Low Stock (${item.quantity} left)`, color: 'bg-amber-50 text-amber-800 border-amber-200' };
    return { label: `In Stock (${item.quantity} units)`, color: 'bg-emerald-50 text-emerald-800 border-emerald-200' };
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase tracking-widest text-[#0B3B60] font-bold flex items-center gap-1.5 mb-1">
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" /> Loom & Finished Inventory
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#0B3B60]">
            Atelier Stock & Concurrency Locks
          </h1>
          <p className="text-xs text-neutral-500 mt-0.5">
            Monitor ready-to-ship saree quantities, live customer reservations, and automated loom restocking
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <span className="px-3.5 py-1.5 rounded-xl bg-purple-50 border border-purple-200 text-purple-900 text-xs font-bold flex items-center gap-1.5 shadow-sm">
            <Lock className="w-3.5 h-3.5 text-purple-600" /> Reserved/Sold: {totalReserved}
          </span>
          <span className="px-3.5 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold flex items-center gap-1.5 shadow-sm">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" /> Low Stock: {lowStockCount}
          </span>
          <span className="px-3.5 py-1.5 rounded-xl bg-blue-50 border border-blue-200 text-[#0B3B60] font-serif font-bold text-xs shadow-sm">
            Total Sarees: {stock.length}
          </span>
        </div>
      </div>

      {/* Low Stock Warning Banner */}
      {lowStockCount > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3 shadow-sm">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-serif font-bold text-amber-900 text-xs">
              {lowStockCount} Saree {lowStockCount === 1 ? 'Design Requires' : 'Designs Require'} Loom Production
            </h4>
            <p className="text-[11px] text-amber-800 mt-0.5">
              Available pieces are at or below safety threshold. Placing new orders locks remaining inventory automatically.
            </p>
          </div>
        </div>
      )}

      {/* Search & Filter Controls */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by saree title or collection..."
            className="w-full bg-white border border-neutral-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-[#0B3B60] shadow-sm"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilterView('all')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
              filterView === 'all'
                ? 'bg-[#0B3B60] text-white font-bold shadow-sm'
                : 'bg-white border border-neutral-200 text-neutral-700 hover:bg-neutral-50 shadow-sm'
            }`}
          >
            All Stock ({stock.length})
          </button>
          <button
            onClick={() => setFilterView('ready')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
              filterView === 'ready'
                ? 'bg-[#0B3B60] text-white font-bold shadow-sm'
                : 'bg-white border border-neutral-200 text-neutral-700 hover:bg-neutral-50 shadow-sm'
            }`}
          >
            In Stock
          </button>
          <button
            onClick={() => setFilterView('low')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
              filterView === 'low'
                ? 'bg-[#0B3B60] text-white font-bold shadow-sm'
                : 'bg-white border border-neutral-200 text-neutral-700 hover:bg-neutral-50 shadow-sm'
            }`}
          >
            Low Stock ({lowStockCount})
          </button>
          <button
            onClick={() => setFilterView('oos')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
              filterView === 'oos'
                ? 'bg-[#0B3B60] text-white font-bold shadow-sm'
                : 'bg-white border border-neutral-200 text-neutral-700 hover:bg-neutral-50 shadow-sm'
            }`}
          >
            Out of Stock ({oosCount})
          </button>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white border border-neutral-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF9F6] border-b border-neutral-200 font-serif uppercase tracking-wider text-neutral-600 font-semibold">
              <tr>
                <th className="p-4">Handcrafted Saree</th>
                <th className="p-4">Collection</th>
                <th className="p-4 text-center">Available Stock</th>
                <th className="p-4 text-center">Reserved / Sold</th>
                <th className="p-4 text-center">Threshold</th>
                <th className="p-4 text-center">Loom Status</th>
                <th className="p-4 text-center">Quick Adjust</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 text-neutral-700">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="8" className="p-8 text-center text-neutral-500">
                    No sarees match your filter criteria.
                  </td>
                </tr>
              ) : (
                filtered.map((item) => {
                  const status = getStockLevel(item);
                  const isActionLoading = actionLoadingId === item.productId;

                  return (
                    <tr key={item.productId} className="hover:bg-neutral-50/80 transition-colors">
                      {/* Product Thumbnail & Title */}
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="relative w-12 h-14 bg-neutral-100 rounded-lg overflow-hidden shrink-0 border border-neutral-200">
                            {item.primaryImage && (
                              <Image
                                src={item.primaryImage}
                                alt={item.productName}
                                fill
                                className="object-cover object-top"
                              />
                            )}
                          </div>
                          <div className="min-w-0">
                            <h4 className="font-serif font-bold text-neutral-900 truncate max-w-xs">
                              {item.productName}
                            </h4>
                            <span className="text-[10px] text-neutral-500 font-sans">
                              ₹{item.price?.toLocaleString('en-IN')}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="p-4">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-neutral-100 text-neutral-700">
                          {item.categoryName}
                        </span>
                      </td>

                      {/* Available Stock */}
                      <td className="p-4 text-center">
                        <span className="font-mono text-sm font-bold text-[#0B3B60]">
                          {item.quantity}
                        </span>
                      </td>

                      {/* Reserved Quantity */}
                      <td className="p-4 text-center">
                        <span className="inline-flex items-center gap-1 font-mono text-xs font-semibold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-200">
                          <Lock size={10} /> {item.reservedQuantity}
                        </span>
                      </td>

                      {/* Low Stock Threshold */}
                      <td className="p-4 text-center">
                        <span className="font-mono text-xs text-neutral-500">
                          ≤ {item.lowStockThreshold}
                        </span>
                      </td>

                      {/* Stock Level Badge */}
                      <td className="p-4 text-center">
                        <span
                          className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold border ${status.color}`}
                        >
                          {status.label}
                        </span>
                      </td>

                      {/* Quick Adjust Buttons (+1 / -1) */}
                      <td className="p-4 text-center">
                        <div className="inline-flex items-center gap-1 bg-neutral-100 p-1 rounded-xl border border-neutral-200">
                          <button
                            type="button"
                            disabled={isActionLoading || item.quantity <= 0}
                            onClick={() => handleQuickDelta(item.productId, -1)}
                            className="p-1.5 rounded-lg bg-white hover:bg-rose-50 hover:text-rose-600 disabled:opacity-30 transition shadow-2xs cursor-pointer"
                            title="Decrement Stock by 1"
                          >
                            <Minus size={12} />
                          </button>
                          <button
                            type="button"
                            disabled={isActionLoading}
                            onClick={() => handleQuickDelta(item.productId, 1)}
                            className="p-1.5 rounded-lg bg-white hover:bg-emerald-50 hover:text-emerald-600 disabled:opacity-30 transition shadow-2xs cursor-pointer"
                            title="Increment Stock by 1"
                          >
                            <Plus size={12} />
                          </button>
                          <button
                            type="button"
                            disabled={isActionLoading}
                            onClick={() => handleQuickDelta(item.productId, 5)}
                            className="px-1.5 py-0.5 rounded-lg bg-white hover:bg-blue-50 text-[10px] font-bold text-[#0B3B60] disabled:opacity-30 transition shadow-2xs cursor-pointer"
                            title="Restock 5 Pieces"
                          >
                            +5
                          </button>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => openAdjustModal(item)}
                            className="px-3 py-1.5 rounded-xl border border-neutral-200 bg-white hover:bg-[#0B3B60] hover:text-white text-xs font-semibold text-[#0B3B60] transition shadow-xs flex items-center gap-1 cursor-pointer"
                          >
                            <Edit2 size={12} /> Manage
                          </button>
                          <Link
                            href={`/product/${item.productSlug}`}
                            target="_blank"
                            className="p-1.5 rounded-xl border border-neutral-200 bg-white hover:bg-neutral-100 text-neutral-500 transition shadow-xs"
                            title="View Store Page"
                          >
                            <ExternalLink size={12} />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Adjust Inventory Modal */}
      {adjustModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-neutral-200 space-y-5 animate-in fade-in zoom-in duration-150">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <div>
                <span className="text-[10px] uppercase font-bold text-[#C1272D] tracking-wider">
                  Loom Inventory Configuration
                </span>
                <h3 className="font-serif font-bold text-base text-[#0B3B60] truncate max-w-xs">
                  {adjustModal.productName}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setAdjustModal(null)}
                className="p-1.5 rounded-full hover:bg-neutral-100 text-neutral-400 hover:text-neutral-700 transition cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSaveModal} className="space-y-4 text-xs">
              <div>
                <label className="block text-neutral-700 font-semibold mb-1">
                  Available Saree Quantity in Atelier *
                </label>
                <input
                  type="number"
                  min="0"
                  required
                  value={modalForm.quantity}
                  onChange={(e) => setModalForm({ ...modalForm, quantity: e.target.value })}
                  placeholder="e.g. 15"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-[#0B3B60]"
                />
                <p className="text-[11px] text-neutral-500 mt-1">
                  Currently {adjustModal.reservedQuantity} units are locked in active patron orders.
                </p>
              </div>

              <div>
                <label className="block text-neutral-700 font-semibold mb-1">
                  Low Stock Alert Threshold
                </label>
                <input
                  type="number"
                  min="1"
                  required
                  value={modalForm.lowStockThreshold}
                  onChange={(e) => setModalForm({ ...modalForm, lowStockThreshold: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-[#0B3B60]"
                />
              </div>

              <div>
                <label className="block text-neutral-700 font-semibold mb-1">
                  Saree Stock Status
                </label>
                <select
                  value={modalForm.stockStatus}
                  onChange={(e) => setModalForm({ ...modalForm, stockStatus: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-[#0B3B60]"
                >
                  <option value="READY_TO_SHIP">READY_TO_SHIP (In Stock & Handcrafted)</option>
                  <option value="MADE_TO_ORDER">MADE_TO_ORDER (15–30 Days Loom Production)</option>
                  <option value="OUT_OF_STOCK">OUT_OF_STOCK (Archive / Loom Full)</option>
                </select>
              </div>

              <div className="pt-3 border-t border-neutral-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setAdjustModal(null)}
                  className="px-4 py-2.5 rounded-xl border border-neutral-300 text-neutral-600 hover:bg-neutral-100 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="px-6 py-2.5 rounded-xl bg-[#0B3B60] hover:bg-[#071E3D] text-white font-bold uppercase tracking-wider transition shadow cursor-pointer disabled:opacity-50"
                >
                  {isUpdating ? 'Saving...' : 'Save Stock Settings'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
