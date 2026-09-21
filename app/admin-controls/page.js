import { getAdminStats } from '@/app/actions/admin-actions';
import Link from 'next/link';
import {
  TrendingUp,
  ShoppingCart,
  Package,
  Users,
  Video,
  MessageSquare,
  ArrowRight,
  Sparkles,
  ExternalLink,
} from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
  const res = await getAdminStats();
  const stats = res.success ? res.stats : {};

  const formattedRevenue = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(stats.totalRevenue || 0);

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Title */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <span className="text-xs uppercase tracking-widest text-[#0B3B60] font-semibold flex items-center gap-1.5 mb-1">
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" /> Jodhpur Atelier Overview
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#0B3B60]">
            Atelier Management Dashboard
          </h1>
        </div>

        <div className="flex gap-3">
          <Link
            href="/admin-controls/orders"
            className="px-4 py-2 rounded-xl bg-[#0B3B60] hover:bg-[#1B5585] text-white text-xs font-bold uppercase tracking-wider transition flex items-center gap-1.5 shadow"
          >
            <Video className="w-4 h-4 text-[#D4AF37]" /> Manage Loom Pipeline
          </Link>
        </div>
      </div>

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="p-6 rounded-2xl bg-white border border-neutral-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-neutral-500 text-xs font-medium">
            <span>Total Atelier Sales</span>
            <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="font-serif text-2xl sm:text-3xl font-bold text-[#0B3B60]">
            {formattedRevenue}
          </div>
          <p className="text-[11px] text-neutral-500">From verified client orders</p>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-neutral-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-neutral-500 text-xs font-medium">
            <span>Atelier Orders</span>
            <div className="w-8 h-8 rounded-full bg-blue-50 text-[#0B3B60] flex items-center justify-center">
              <ShoppingCart className="w-4 h-4" />
            </div>
          </div>
          <div className="font-serif text-2xl sm:text-3xl font-bold text-neutral-900">
            {stats.totalOrders || 0}
          </div>
          <p className="text-[11px] text-neutral-500">Total orders registered</p>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-neutral-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-neutral-500 text-xs font-medium">
            <span>Loom Video Queue</span>
            <div className="w-8 h-8 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center">
              <Video className="w-4 h-4" />
            </div>
          </div>
          <div className="font-serif text-2xl sm:text-3xl font-bold text-amber-600">
            {stats.pendingVideoInspections || 0}
          </div>
          <p className="text-[11px] text-neutral-500">Awaiting pre-dispatch video</p>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-neutral-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-neutral-500 text-xs font-medium">
            <span>Sarees in Catalog</span>
            <div className="w-8 h-8 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="font-serif text-2xl sm:text-3xl font-bold text-neutral-900">
            {stats.totalProducts || 21}
          </div>
          <p className="text-[11px] text-neutral-500">Across 5 royal collections</p>
        </div>
      </div>

      {/* Recent Orders Section */}
      <div className="p-6 sm:p-8 rounded-2xl bg-white border border-neutral-200 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
          <div>
            <h2 className="font-serif text-lg font-bold text-[#0B3B60]">Recent Atelier Orders</h2>
            <p className="text-xs text-neutral-500">Latest consultations and saree bookings</p>
          </div>
          <Link
            href="/admin-controls/orders"
            className="text-xs text-[#0B3B60] hover:underline flex items-center gap-1 font-bold"
          >
            View All Orders →
          </Link>
        </div>

        {(!stats.recentOrders || stats.recentOrders.length === 0) ? (
          <div className="text-center py-12 text-neutral-400 text-xs">
            No orders placed yet. As customers book consultations, they will appear here.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-50 border-b border-neutral-200 uppercase tracking-wider text-neutral-500 font-serif">
                <tr>
                  <th className="py-3 px-3">Order ID</th>
                  <th className="py-3 px-3">Client</th>
                  <th className="py-3 px-3">Sarees</th>
                  <th className="py-3 px-3">Amount</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {stats.recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-neutral-50/80 transition">
                    <td className="py-3.5 px-3 font-mono font-semibold text-[#0B3B60]">
                      {order.orderNumber}
                    </td>
                    <td className="py-3.5 px-3">
                      <p className="font-semibold text-neutral-900">{order.userName}</p>
                      <p className="text-[11px] text-neutral-500">{order.userEmail}</p>
                    </td>
                    <td className="py-3.5 px-3 text-neutral-600">
                      {order.items?.length || 0} Saree(s)
                    </td>
                    <td className="py-3.5 px-3 font-serif font-bold text-[#0B3B60]">
                      ₹{order.total.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3.5 px-3">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                        {order.statusLabel || order.orderStatus}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-right">
                      <Link
                        href={`/invoice/${order.id}`}
                        target="_blank"
                        className="text-[11px] text-[#0B3B60] hover:underline font-medium inline-flex items-center gap-1"
                      >
                        Invoice <ExternalLink className="w-3 h-3" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
