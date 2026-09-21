'use client';

import { useState } from 'react';
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
} from 'lucide-react';
import { updateStock } from '@/app/actions/inventory-actions';
import { useRouter } from 'next/navigation';

export default function AdminInventoryClient({ initialStock = [] }) {
  const router = useRouter();
  const [stock, setStock] = useState(initialStock);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterView, setFilterView] = useState('all'); // all, low, ready
  const [adjustModal, setAdjustModal] = useState(null);
  const [adjustAmount, setAdjustAmount] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  let filtered = stock.filter((item) =>
    (item.productName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (item.categoryName || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (filterView === 'low') {
    filtered = filtered.filter((i) => i.quantity <= i.lowStockThreshold);
  } else if (filterView === 'ready') {
    filtered = filtered.filter((i) => i.quantity > i.lowStockThreshold);
  }

  const lowStockCount = stock.filter((i) => i.quantity <= i.lowStockThreshold).length;

  const handleAdjust = async (e) => {
    if (e) e.preventDefault();
    if (!adjustModal || adjustAmount === '') return;
    setIsUpdating(true);
    const newStock = Math.max(0, Number(adjustAmount));

    const result = await updateStock(adjustModal.productId, newStock);

    if (result.success) {
      setStock((prev) =>
        prev.map((item) =>
          item.productId === adjustModal.productId ? { ...item, quantity: newStock } : item
        )
      );
      setAdjustModal(null);
      setAdjustAmount('');
      router.refresh();
    } else {
      alert(result.error || 'Failed to update stock');
    }
    setIsUpdating(false);
  };

  const getStockLevel = (item) => {
    if (item.quantity === 0)
      return { label: 'Out of Stock', color: 'bg-rose-50 text-rose-800 border-rose-200' };
    if (item.quantity <= item.lowStockThreshold)
      return { label: 'Low Stock Alert', color: 'bg-amber-50 text-amber-800 border-amber-200' };
    return { label: 'In Stock / Active', color: 'bg-emerald-50 text-emerald-800 border-emerald-200' };
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
            Atelier Stock & Loom Capacity
          </h1>
          <p className="text-xs text-neutral-500 mt-0.5">
            Monitor ready-to-ship saree quantities and manage artisan loom production capacity
          </p>
        </div>

        <div className="flex items-center gap-3">
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
              Several exquisite pieces are running low or made strictly to order. Assign master artisans to replenish stocks.
            </p>
          </div>
        </div>
      )}

      {/* Search & Filter */}
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

        <div className="flex gap-2">
          <button
            onClick={() => setFilterView('all')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition ${
              filterView === 'all'
                ? 'bg-[#0B3B60] text-white font-bold shadow-sm'
                : 'bg-white border border-neutral-200 text-neutral-700 hover:bg-neutral-50 shadow-sm'
            }`}
          >
            All Stock
          </button>
          <button
            onClick={() => setFilterView('low')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition ${
              filterView === 'low'
                ? 'bg-[#0B3B60] text-white font-bold shadow-sm'
                : 'bg-white border border-neutral-200 text-neutral-700 hover:bg-neutral-50 shadow-sm'
            }`}
          >
            Low Stock ({lowStockCount})
          </button>
          <button
            onClick={() => setFilterView('ready')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition ${
              filterView === 'ready'
                ? 'bg-[#0B3B60] text-white font-bold shadow-sm'
                : 'bg-white border border-neutral-200 text-neutral-700 hover:bg-neutral-50 shadow-sm'
            }`}
          >
            In Stock
          </button>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white border border-neutral-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8F9FA] border-b border-neutral-200 uppercase tracking-wider text-neutral-600 font-semibold">
              <tr>
                <th className="p-4">Saree & Collection</th>
                <th className="p-4">Price</th>
                <th className="p-4">Stock Level</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Adjust Stock</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 text-neutral-700">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-neutral-400 font-medium">
                    No sarees match your inventory search.
                  </td>
                </tr>
              ) : (
                filtered.map((item) => {
                  const level = getStockLevel(item);
                  return (
                    <tr key={item.productId} className="hover:bg-neutral-50 transition">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-12 rounded bg-neutral-100 overflow-hidden relative shrink-0 border border-neutral-200">
                            {item.primaryImage && (
                              <img
                                src={item.primaryImage}
                                alt={item.productName}
                                className="w-full h-full object-cover"
                              />
                            )}
                          </div>
                          <div>
                            <p className="font-serif font-bold text-neutral-900 line-clamp-1">
                              {item.productName}
                            </p>
                            <p className="text-[11px] text-neutral-500">{item.categoryName}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 font-serif font-bold text-neutral-900 text-sm">
                        ₹{Number(item.price).toLocaleString('en-IN')}
                      </td>
                      <td className="p-4 font-bold text-neutral-900 text-sm">
                        <span className="text-[#0B3B60]">{item.quantity}</span>{' '}
                        <span className="text-[11px] text-neutral-400 font-normal">units</span>
                      </td>
                      <td className="p-4">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${level.color}`}>
                          {level.label}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => {
                            setAdjustModal(item);
                            setAdjustAmount(String(item.quantity));
                          }}
                          className="px-3 py-1.5 rounded-xl bg-neutral-100 hover:bg-[#0B3B60] text-neutral-700 hover:text-white font-semibold text-[11px] transition inline-flex items-center gap-1"
                        >
                          <Edit2 className="w-3 h-3" /> Update Stock
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Adjust Stock Modal */}
      {adjustModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-neutral-200 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
              <h3 className="font-serif text-lg font-bold text-[#0B3B60]">Adjust Saree Quantity</h3>
              <button onClick={() => setAdjustModal(null)} className="p-1 text-neutral-400 hover:text-neutral-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-neutral-800 font-semibold">{adjustModal.productName}</p>

            <form onSubmit={handleAdjust} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="text-neutral-700 font-semibold">Available Ready Stock</label>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setAdjustAmount((prev) => String(Math.max(0, Number(prev) - 1)))}
                    className="w-9 h-9 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-800 flex items-center justify-center text-base font-bold"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    min="0"
                    value={adjustAmount}
                    onChange={(e) => setAdjustAmount(e.target.value)}
                    className="flex-1 bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2 text-center text-neutral-900 font-bold text-base focus:outline-none focus:border-[#0B3B60]"
                  />
                  <button
                    type="button"
                    onClick={() => setAdjustAmount((prev) => String(Number(prev) + 1))}
                    className="w-9 h-9 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-800 flex items-center justify-center text-base font-bold"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setAdjustModal(null)}
                  className="px-4 py-2 rounded-xl bg-neutral-100 text-neutral-700 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="px-5 py-2 rounded-xl bg-[#0B3B60] hover:bg-[#062238] text-white font-bold uppercase tracking-wider disabled:opacity-50"
                >
                  {isUpdating ? 'Saving...' : 'Save Stock'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
