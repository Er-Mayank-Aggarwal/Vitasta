'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useSession } from '@/lib/auth-client';

const CartContext = createContext();

export function CartProvider({ children }) {
  const { data: session } = useSession();
  const [items, setItems] = useState([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalSubtitle, setAuthModalSubtitle] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('vitasta_cart');
      if (saved) {
        setItems(JSON.parse(saved));
      }
    } catch (e) {
      console.error('Failed to load cart from storage', e);
    }
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      try {
        localStorage.setItem('vitasta_cart', JSON.stringify(items));
      } catch (e) {
        console.error('Failed to save cart to storage', e);
      }
    }
  }, [items, mounted]);

  const openAuthModal = (subtitle = '') => {
    if (subtitle) setAuthModalSubtitle(subtitle);
    setIsAuthModalOpen(true);
  };

  const addToCart = (product, quantity = 1, openDrawer = false) => {
    // Gate: User must be signed in to add items to bag
    if (!session?.user) {
      setAuthModalSubtitle(
        `Please sign in or register your Royal Patron account to add "${product.title}" to your Atelier Bag.`
      );
      setIsAuthModalOpen(true);
      return false;
    }

    setItems((prev) => {
      const existingIndex = prev.findIndex((item) => item.id === product.id);
      if (existingIndex > -1) {
        const copy = [...prev];
        copy[existingIndex].quantity += quantity;
        return copy;
      } else {
        return [
          ...prev,
          {
            id: product.id,
            slug: product.slug,
            title: product.title,
            category: product.category?.name || 'Royal Saree',
            fabric: product.fabric,
            color: product.color,
            price: Number(product.price),
            image: product.primaryImage || (product.images && product.images[0] ? product.images[0].cdnUrl : ''),
            quantity,
          },
        ];
      }
    });
    if (openDrawer) {
      setIsDrawerOpen(true);
    }
    return true;
  };

  const removeFromCart = (id) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const updateQuantity = (id, quantity) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const cartTotal = items.reduce(
    (sum, item) => sum + Number(item.price) * Number(item.quantity),
    0
  );

  const cartCount = items.reduce((sum, item) => sum + Number(item.quantity), 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartTotal,
        cartCount,
        isDrawerOpen,
        setIsDrawerOpen,
        isAuthModalOpen,
        setIsAuthModalOpen,
        authModalSubtitle,
        setAuthModalSubtitle,
        openAuthModal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
