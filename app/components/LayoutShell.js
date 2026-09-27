'use client';

import { CartProvider, useCart } from '@/app/context/CartContext';
import Header from './Header';
import CartDrawer from './CartDrawer';
import Footer from './Footer';
import AuthForm from './AuthForm';
import { usePathname } from 'next/navigation';
import { X } from 'lucide-react';

function CartAuthModal() {
  const { isAuthModalOpen, setIsAuthModalOpen, authModalSubtitle } = useCart();

  if (!isAuthModalOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={() => setIsAuthModalOpen(false)}
    >
      <div
        className="relative w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={() => setIsAuthModalOpen(false)}
          className="absolute -top-3 -right-3 z-20 p-1.5 rounded-full bg-white text-neutral-600 shadow-lg hover:text-[#C1272D] transition cursor-pointer"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>
        <AuthForm
          onSuccess={() => setIsAuthModalOpen(false)}
          onClose={() => setIsAuthModalOpen(false)}
          isModal={true}
          customTitle="Sign In to Add to Bag"
          customSubtitle={
            authModalSubtitle ||
            'Please sign in or create an account to add handcrafted sarees to your Atelier Bag.'
          }
        />
      </div>
    </div>
  );
}

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
        <CartAuthModal />
      </div>
    </CartProvider>
  );
}
