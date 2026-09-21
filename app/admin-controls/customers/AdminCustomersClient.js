'use client';

import { useState } from 'react';
import {
  Search,
  Users as UsersIcon,
  Mail,
  Phone,
  MapPin,
  Sparkles,
  ShoppingBag,
  Shield,
  Eye,
  X,
} from 'lucide-react';
import { updateCustomerRole } from '@/app/actions/admin-actions';
import { useRouter } from 'next/navigation';

export default function AdminCustomersClient({ initialCustomers = [] }) {
  const router = useRouter();
  const [customers, setCustomers] = useState(initialCustomers);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const filtered = customers.filter(
    (c) =>
      (c.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.email || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.phone || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleRoleChange = async (userId, newRole) => {
    setIsUpdating(true);
    const res = await updateCustomerRole(userId, newRole);
    if (res.success) {
      setCustomers((prev) =>
        prev.map((c) => (c.id === userId ? { ...c, role: newRole } : c))
      );
      router.refresh();
    } else {
      alert(res.error || 'Failed to update role');
    }
    setIsUpdating(false);
  };

  const totalRevenue = customers.reduce((sum, c) => sum + (c.totalSpent || 0), 0);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase tracking-widest text-[#0B3B60] font-bold flex items-center gap-1.5 mb-1">
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" /> Royal Connoisseurs & Patrons
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#0B3B60]">
            Clientele & Patron Directory
          </h1>
          <p className="text-xs text-neutral-500 mt-0.5">
            Manage registered royal patrons, order histories, privilege tiers, and permissions
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="px-3.5 py-1.5 rounded-xl bg-blue-50 border border-blue-200 text-[#0B3B60] font-serif font-bold text-xs shadow-sm">
            Total Patrons: {customers.length}
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
          placeholder="Search by patron name, email, or phone..."
          className="w-full bg-white border border-neutral-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-[#0B3B60] shadow-sm"
        />
      </div>

      {/* Customers Table */}
      <div className="bg-white border border-neutral-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8F9FA] border-b border-neutral-200 uppercase tracking-wider text-neutral-600 font-semibold">
              <tr>
                <th className="p-4">Patron Name & Tier</th>
                <th className="p-4">Contact Info</th>
                <th className="p-4">City / Region</th>
                <th className="p-4">Orders Placed</th>
                <th className="p-4">Total Spend</th>
                <th className="p-4">Privilege Role</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 text-neutral-700">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-neutral-400 font-medium">
                    No patron accounts found matching your query.
                  </td>
                </tr>
              ) : (
                filtered.map((customer) => (
                  <tr key={customer.id} className="hover:bg-neutral-50 transition">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-blue-50 border border-blue-200 text-[#0B3B60] font-bold flex items-center justify-center text-xs shrink-0">
                          {customer.name?.charAt(0).toUpperCase() || 'P'}
                        </div>
                        <div>
                          <p className="font-serif font-bold text-neutral-900 text-xs">{customer.name}</p>
                          <span className="text-[10px] text-amber-700 font-semibold">
                            👑 {customer.membershipTier || 'Royal Patron'}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <p className="text-neutral-900 font-medium">{customer.email}</p>
                      <p className="text-[11px] text-neutral-500">{customer.phone}</p>
                    </td>
                    <td className="p-4">
                      <span className="text-neutral-600">{customer.city}, {customer.state}</span>
                    </td>
                    <td className="p-4 font-bold text-neutral-900">
                      {customer.totalOrders} {customer.totalOrders === 1 ? 'order' : 'orders'}
                    </td>
                    <td className="p-4 font-serif font-bold text-[#0B3B60] text-sm">
                      ₹{Number(customer.totalSpent).toLocaleString('en-IN')}
                    </td>
                    <td className="p-4">
                      <select
                        value={customer.role}
                        disabled={isUpdating}
                        onChange={(e) => handleRoleChange(customer.id, e.target.value)}
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold border focus:outline-none cursor-pointer ${
                          customer.role === 'ADMIN'
                            ? 'bg-[#0B3B60] text-white border-[#0B3B60]'
                            : 'bg-neutral-100 text-neutral-700 border-neutral-200'
                        }`}
                      >
                        <option value="CLIENT">Royal Client</option>
                        <option value="ARTISAN">Atelier Artisan</option>
                        <option value="ADMIN">Atelier Admin</option>
                      </select>
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => setSelectedCustomer(customer)}
                        className="px-3 py-1.5 rounded-xl bg-neutral-100 hover:bg-[#0B3B60] text-neutral-700 hover:text-white font-semibold text-[11px] transition inline-flex items-center gap-1"
                      >
                        <Eye className="w-3 h-3" /> History
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Customer Orders History Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-neutral-200 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
              <div>
                <h3 className="font-serif text-lg font-bold text-[#0B3B60]">{selectedCustomer.name}</h3>
                <p className="text-xs text-neutral-500">{selectedCustomer.email}</p>
              </div>
              <button onClick={() => setSelectedCustomer(null)} className="p-1 text-neutral-400 hover:text-neutral-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-[#0B3B60]">
                Order Purchase History ({selectedCustomer.orders?.length || 0})
              </h4>
              {(!selectedCustomer.orders || selectedCustomer.orders.length === 0) ? (
                <p className="text-xs text-neutral-400 py-4 text-center">No orders recorded yet.</p>
              ) : (
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {selectedCustomer.orders.map((ord) => (
                    <div
                      key={ord.id}
                      className="flex items-center justify-between p-3 rounded-xl bg-neutral-50 border border-neutral-200 text-xs"
                    >
                      <div>
                        <p className="font-mono font-bold text-neutral-900">#{ord.id.slice(0, 8).toUpperCase()}</p>
                        <p className="text-[10px] text-neutral-500">
                          {new Date(ord.createdAt).toLocaleDateString('en-IN')}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-serif font-bold text-neutral-900">₹{ord.total?.toLocaleString('en-IN')}</p>
                        <span className="text-[10px] text-amber-700 font-semibold">{ord.orderStatus}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-end pt-3 border-t border-neutral-200">
              <button
                type="button"
                onClick={() => setSelectedCustomer(null)}
                className="px-4 py-1.5 rounded-xl bg-[#0B3B60] text-white font-bold text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
