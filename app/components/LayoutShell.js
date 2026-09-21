'use client';

import { CartProvider } from '@/app/context/CartContext';
import Header from './Header';
import CartDrawer from './CartDrawer';
import Footer from './Footer';
import { usePathname } from 'next/navigation';

export default function LayoutShell({ children }) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith('/admin-controls');

  return (
    <CartProvider>
      <div className="min-h-screen flex flex-col bg-[#FAF9F6] text-[#1A1A1A] font-sans selection:bg-[#0B3B60] selection:text-white">
        {!isAdminRoute && <Header />}
        <main className="flex-1">{children}</main>
        {!isAdminRoute && <CartDrawer />}
        {!isAdminRoute && <Footer />}
      </div>
    </CartProvider>
  );
}
