'use client';

import { useState } from 'react';
import {
  Search,
  ChevronDown,
  Eye,
  X,
  Clock,
  CheckCircle2,
  Truck,
  AlertCircle,
  Package,
  MapPin,
  Phone,
  Mail,
  Video,
  ExternalLink,
  Sparkles,
  Download,
  Filter,
} from 'lucide-react';
import { updateOrderStatus } from '@/app/actions/admin-actions';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const statusConfig = {
  pending: {
    label: 'Pending Consultation',
    color: 'bg-amber-50 text-amber-800 border-amber-300',
    icon: AlertCircle,
  },
  confirmed: {
    label: 'Order Confirmed',
    color: 'bg-blue-50 text-blue-800 border-blue-300',
    icon: CheckCircle2,
  },
  in_production: {
    label: 'Artisan Adda Work',
    color: 'bg-purple-50 text-purple-800 border-purple-300',
    icon: Package,
  },
  video_verified: {
    label: 'Video Verified',
    color: 'bg-teal-50 text-teal-800 border-teal-300',
    icon: Video,
  },
  shipped: {
    label: 'In Transit / Shipped',
    color: 'bg-indigo-50 text-indigo-800 border-indigo-300',
    icon: Truck,
  },
  delivered: {
    label: 'Delivered to Patron',
    color: 'bg-emerald-50 text-emerald-800 border-emerald-300',
    icon: CheckCircle2,
  },
  cancelled: {
    label: 'Cancelled',
    color: 'bg-rose-50 text-rose-800 border-rose-300',
    icon: AlertCircle,
  },
};

const defaultStatus = {
  label: 'Processing',
  color: 'bg-neutral-100 text-neutral-800 border-neutral-300',
  icon: Clock,
};

export default function AdminOrdersClient({ initialOrders = [] }) {
  const router = useRouter();
  const [orders, setOrders] = useState(initialOrders);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);

  // Video & Tracking Form State for selected order
  const [editFields, setEditFields] = useState({
    status: '',
    videoUrl: '',
    trackingNumber: '',
    courierName: '',
  });

  const filteredOrders = orders.filter((o) => {
    const search = searchQuery.toLowerCase();
    const matchesSearch =
      (o.displayId || o.id || '').toLowerCase().includes(search) ||
      (o.customer?.name || o.userName || '').toLowerCase().includes(search) ||
      (o.customer?.phone || o.userPhone || '').toLowerCase().includes(search);

    const currentStatus = (o.status || o.orderStatus || '').toLowerCase();
    const matchesStatus = filterStatus === 'all' || currentStatus === filterStatus.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  const handleOpenDetail = (order) => {
    setSelectedOrder(order);
    setEditFields({
      status: (order.status || order.orderStatus || 'PENDING').toUpperCase(),
      videoUrl: order.preDispatchVideoUrl || '',
      trackingNumber: order.trackingNumber || order.shipment?.trackingNumber || '',
      courierName: order.courierName || order.shipment?.courierName || 'BlueDart Sovereign Luxury Courier',
    });
  };

  const handleQuickStatusChange = async (orderId, newStatus) => {
    setIsUpdating(true);
    const res = await updateOrderStatus(orderId, {
      orderStatus: newStatus.toUpperCase(),
      statusLabel: statusConfig[newStatus.toLowerCase()]?.label || newStatus,
    });

    if (res.success) {
      setOrders((prev) =>
        prev.map((o) =>
          o.id === orderId
            ? {
                ...o,
                status: newStatus,
                orderStatus: newStatus.toUpperCase(),
                statusLabel: statusConfig[newStatus.toLowerCase()]?.label || newStatus,
              }
            : o
        )
      );
      router.refresh();
    }
    setIsUpdating(false);
  };

  const handleSaveModalUpdates = async (e) => {
    e.preventDefault();
    if (!selectedOrder) return;
    setIsUpdating(true);

    const res = await updateOrderStatus(selectedOrder.id, {
      orderStatus: editFields.status,
      statusLabel: statusConfig[editFields.status.toLowerCase()]?.label || editFields.status,
      preDispatchVideoUrl: editFields.videoUrl || null,
      trackingNumber: editFields.trackingNumber || null,
      courierName: editFields.courierName || null,
    });

    if (res.success) {
      setOrders((prev) =>
        prev.map((o) =>
          o.id === selectedOrder.id
            ? {
                ...o,
                status: editFields.status.toLowerCase(),
                orderStatus: editFields.status,
                preDispatchVideoUrl: editFields.videoUrl,
                trackingNumber: editFields.trackingNumber,
                courierName: editFields.courierName,
              }
            : o
        )
      );
      setSelectedOrder(null);
      router.refresh();
    }
    setIsUpdating(false);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Title & Stats */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <span className="text-xs uppercase tracking-widest text-[#0B3B60] font-bold flex items-center gap-1.5 mb-1">
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" /> Saree Orders & Video Verifications
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#0B3B60]">
            Atelier Order Pipeline
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3.5 py-1.5 rounded-xl bg-white border border-neutral-200 text-[#0B3B60] font-serif font-bold text-xs shadow-xs">
            Total Orders: {orders.length}
          </span>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col lg:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Order ID, customer name, or phone number..."
            className="w-full bg-white border border-neutral-300 rounded-xl pl-10 pr-4 py-2.5 text-xs text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#0B3B60]"
          />
        </div>

        {/* Status Filter Tabs */}
        <div className="flex flex-wrap gap-1.5 overflow-x-auto pb-1">
          {['all', 'pending', 'confirmed', 'in_production', 'video_verified', 'shipped', 'delivered'].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize whitespace-nowrap transition ${
                filterStatus === st
                  ? 'bg-[#0B3B60] text-white font-bold shadow-sm'
                  : 'bg-white border border-neutral-200 text-neutral-600 hover:text-neutral-900'
              }`}
            >
              {st === 'all' ? 'All Orders' : st.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white border border-neutral-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-50 border-b border-neutral-200 uppercase tracking-wider text-neutral-500 font-serif">
              <tr>
                <th className="p-4">Order ID & Date</th>
                <th className="p-4">Royal Patron</th>
                <th className="p-4">Items</th>
                <th className="p-4">Total Amount</th>
                <th className="p-4">Crafting Status</th>
                <th className="p-4">Video / Tracking</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 text-neutral-700">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-neutral-400">
                    No orders found matching the filter criteria.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => {
                  const currentSt = (order.status || order.orderStatus || 'pending').toLowerCase();
                  const cfg = statusConfig[currentSt] || defaultStatus;
                  const displayId = order.displayId || order.orderNumber || order.id?.slice(0, 8).toUpperCase();
                  const customerName = order.customer?.name || order.userName || 'Royal Patron';
                  const itemCount = order.items?.length || 1;

                  return (
                    <tr key={order.id} className="hover:bg-neutral-50/70 transition">
                      <td className="p-4">
                        <span className="font-mono font-bold text-[#0B3B60] text-[13px]">
                          #{displayId}
                        </span>
                        <p className="text-[11px] text-neutral-500 mt-0.5">
                          {new Date(order.createdAt || order.date).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </p>
                      </td>
                      <td className="p-4">
                        <p className="font-semibold text-neutral-900">{customerName}</p>
                        <p className="text-[11px] text-neutral-500">{order.customer?.phone || order.userPhone}</p>
                      </td>
                      <td className="p-4">
                        <span className="px-2.5 py-1 rounded-full bg-neutral-100 text-neutral-800 text-[10px] font-semibold">
                          👗 {itemCount} {itemCount === 1 ? 'Saree' : 'Sarees'}
                        </span>
                      </td>
                      <td className="p-4 font-serif font-bold text-[#0B3B60] text-sm">
                        ₹{Number(order.total).toLocaleString('en-IN')}
                      </td>
                      <td className="p-4">
                        <select
                          value={currentSt}
                          disabled={isUpdating}
                          onChange={(e) => handleQuickStatusChange(order.id, e.target.value)}
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold border focus:outline-none cursor-pointer ${cfg.color}`}
                        >
                          <option value="pending">Pending Consultation</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="in_production">Artisan Adda Work</option>
                          <option value="video_verified">Video Verified</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>
                      <td className="p-4">
                        <div className="flex flex-col gap-1 text-[11px]">
                          {order.preDispatchVideoUrl ? (
                            <a
                              href={order.preDispatchVideoUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-teal-700 hover:underline font-medium"
                            >
                              <Video className="w-3.5 h-3.5" /> Video Verified
                            </a>
                          ) : (
                            <span className="text-neutral-400">No video attached</span>
                          )}

                          {order.trackingNumber || order.shipment?.trackingNumber ? (
                            <span className="font-mono text-neutral-700 text-[10px]">
                              📦 {order.trackingNumber || order.shipment?.trackingNumber}
                            </span>
                          ) : null}
                        </div>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => handleOpenDetail(order)}
                            className="p-1.5 rounded-lg bg-neutral-100 hover:bg-[#0B3B60] hover:text-white text-neutral-700 transition shadow-xs"
                            title="Manage Video & Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <Link
                            href={`/invoice/${order.id}`}
                            target="_blank"
                            className="p-1.5 rounded-lg bg-neutral-100 hover:bg-[#D4AF37] hover:text-[#062238] text-neutral-700 transition shadow-xs"
                            title="View Invoice"
                          >
                            <Download className="w-4 h-4" />
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

      {/* Order Detail & Video Management Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-2xl bg-white border border-neutral-200 rounded-2xl shadow-2xl p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
              <div>
                <span className="text-[10px] uppercase font-bold text-[#0B3B60] tracking-widest">
                  Order Management
                </span>
                <h3 className="text-xl font-serif font-bold text-[#0B3B60]">
                  #{selectedOrder.displayId || selectedOrder.orderNumber || selectedOrder.id}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="p-1 text-neutral-400 hover:text-neutral-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveModalUpdates} className="space-y-4 text-xs">
              <div>
                <label className="block text-neutral-700 font-semibold mb-1">
                  Crafting / Handloom Status
                </label>
                <select
                  value={editFields.status}
                  onChange={(e) => setEditFields({ ...editFields, status: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-neutral-300 bg-neutral-50 text-neutral-900 font-medium"
                >
                  <option value="PENDING">PENDING (Pending Consultation)</option>
                  <option value="CONFIRMED">CONFIRMED (Order Confirmed)</option>
                  <option value="IN_PRODUCTION">IN_PRODUCTION (Artisan Adda Handwork)</option>
                  <option value="VIDEO_VERIFIED">VIDEO_VERIFIED (Pre-Dispatch Video Verified)</option>
                  <option value="SHIPPED">SHIPPED (In Transit via Luxury Courier)</option>
                  <option value="DELIVERED">DELIVERED (Delivered to Patron)</option>
                  <option value="CANCELLED">CANCELLED</option>
                </select>
              </div>

              <div>
                <label className="block text-neutral-700 font-semibold mb-1">
                  Pre-Dispatch Loom Video Inspection URL (Cloudinary / Vimeo / YouTube)
                </label>
                <input
                  type="url"
                  placeholder="https://res.cloudinary.com/.../saree-inspection.mp4"
                  value={editFields.videoUrl}
                  onChange={(e) => setEditFields({ ...editFields, videoUrl: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-neutral-300 bg-neutral-50 text-neutral-900"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-700 font-semibold mb-1">
                    Courier Partner Name
                  </label>
                  <input
                    type="text"
                    value={editFields.courierName}
                    onChange={(e) => setEditFields({ ...editFields, courierName: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-neutral-300 bg-neutral-50 text-neutral-900"
                  />
                </div>
                <div>
                  <label className="block text-neutral-700 font-semibold mb-1">
                    Courier Tracking AWB Number
                  </label>
                  <input
                    type="text"
                    placeholder="BD-VT-78901234IN"
                    value={editFields.trackingNumber}
                    onChange={(e) => setEditFields({ ...editFields, trackingNumber: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-neutral-300 bg-neutral-50 text-neutral-900 font-mono"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-neutral-100">
                <button
                  type="button"
                  onClick={() => setSelectedOrder(null)}
                  className="px-4 py-2 rounded-xl border border-neutral-300 text-neutral-700 hover:bg-neutral-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="px-6 py-2 rounded-xl bg-[#0B3B60] text-white font-bold hover:bg-[#1B5585] shadow"
                >
                  {isUpdating ? 'Saving...' : 'Save Order Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
