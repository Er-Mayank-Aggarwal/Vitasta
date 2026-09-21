'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Warehouse,
  Users,
  Tag,
  Star,
  MessageSquare,
  Mail,
  Menu,
  X,
  ArrowLeft,
  Sparkles,
  LogOut,
  ShieldCheck,
} from 'lucide-react';
import { signOut } from '@/lib/auth-client';

const navItems = [
  {
    label: 'Dashboard',
    href: '/admin-controls',
    icon: LayoutDashboard,
  },
  {
    label: 'Sarees Catalog',
    href: '/admin-controls/products',
    icon: Package,
  },
  {
    label: 'Order Pipeline',
    href: '/admin-controls/orders',
    icon: ShoppingCart,
  },
  {
    label: 'Inventory',
    href: '/admin-controls/inventory',
    icon: Warehouse,
  },
  {
    label: 'Royal Patrons',
    href: '/admin-controls/customers',
    icon: Users,
  },
  {
    label: 'Royal Coupons',
    href: '/admin-controls/coupons',
    icon: Tag,
  },
  {
    label: 'Patron Reviews',
    href: '/admin-controls/reviews',
    icon: Star,
  },
  {
    label: 'Inquiries Inbox',
    href: '/admin-controls/messages',
    icon: MessageSquare,
  },
  {
    label: 'Subscribers',
    href: '/admin-controls/subscribers',
    icon: Mail,
  },
];

export default function AdminLayoutClient({ children, user }) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (e) {
      console.error(e);
    }
    router.push('/');
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-[#F4F6F8] text-[#1A1A1A] flex">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-xs lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar Navigation */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-[#0B3B60] border-r border-[#062238]/40 flex flex-col justify-between transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex flex-col h-full overflow-y-auto">
          {/* Logo Header */}
          <div className="p-6 border-b border-white/10 flex items-center justify-between">
            <Link href="/admin-controls" className="flex flex-col">
              <span className="font-serif text-xl font-bold tracking-[0.2em] text-[#F3E5AB]">
                VITASTA
              </span>
              <span className="text-[9px] uppercase tracking-[0.25em] text-[#D4AF37] font-semibold flex items-center gap-1 mt-0.5">
                👑 Atelier Admin Panel
              </span>
            </Link>
            <button
              type="button"
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-1 text-white/70 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 px-4 py-5 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                pathname === item.href ||
                (item.href !== '/admin-controls' && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  prefetch={true}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition duration-150 ${
                    isActive
                      ? 'bg-[#D4AF37] text-[#062238] font-bold shadow-sm'
                      : 'text-white/80 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" strokeWidth={isActive ? 2.3 : 1.8} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Bottom User Info & Actions */}
          <div className="p-4 border-t border-white/10 space-y-2 bg-[#062238]">
            <div className="px-2 py-1">
              <p className="text-xs font-bold text-white truncate">{user?.name || 'Smita Saraswat'}</p>
              <p className="text-[10px] text-[#D4AF37] uppercase tracking-wider font-semibold">
                👑 {user?.role || 'Atelier Admin'}
              </p>
            </div>

            <Link
              href="/"
              className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-white/70 hover:text-white hover:bg-white/10 transition"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Storefront</span>
            </Link>

            <button
              type="button"
              onClick={handleLogout}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-rose-300 hover:bg-rose-900/40 transition text-left"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Admin Workspace Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="bg-white border-b border-neutral-200 px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between sticky top-0 z-30 shadow-xs">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 -ml-2 text-neutral-600 hover:text-neutral-900 rounded-lg hover:bg-neutral-100"
            >
              <Menu className="w-5 h-5" />
            </button>
            <span className="font-serif text-sm font-bold text-[#0B3B60] hidden sm:block">
              Vitasta Saree Atelier — Management Console
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              target="_blank"
              className="text-xs font-medium text-neutral-500 hover:text-[#0B3B60] flex items-center gap-1.5"
            >
              Live Store ↗
            </Link>
            <div className="w-7 h-7 rounded-full bg-[#0B3B60] text-white flex items-center justify-center text-xs font-serif font-bold">
              {user?.name?.charAt(0) || 'A'}
            </div>
          </div>
        </header>

        {/* Content Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
