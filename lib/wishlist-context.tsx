"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { WishlistDrawer } from "@/components/wishlist/wishlist-drawer";
import { useCart } from "@/lib/cart-context";

export interface WishlistItem {
  id: string;
  name: string;
  price: number;
  priceDisplay?: string;
  image: string;
  skuId?: string;
}

interface WishlistContextType {
  wishlist: WishlistItem[];
  wishlistCount: number;
  isWishlistOpen: boolean;
  setIsWishlistOpen: (open: boolean) => void;
  isInWishlist: (id: string) => boolean;
  toggleWishlist: (item: WishlistItem) => boolean;
  addToWishlist: (item: WishlistItem) => void;
  removeFromWishlist: (id: string) => void;
  clearWishlist: () => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

const STORAGE_KEY = "kurma_wishlist";

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const { addToCart, setIsCartOpen } = useCart();

  // Load from localStorage on client mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setWishlist(parsed);
        }
      }
    } catch (e) {
      console.error("Failed to load wishlist from storage", e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save to localStorage whenever wishlist changes
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(wishlist));
    } catch (e) {
      console.error("Failed to save wishlist to storage", e);
    }
  }, [wishlist, isLoaded]);

  const isInWishlist = useCallback(
    (id: string) => {
      return wishlist.some((item) => item.id === id || (item.skuId && item.skuId === id));
    },
    [wishlist]
  );

  const addToWishlist = useCallback((item: WishlistItem) => {
    setWishlist((prev) => {
      if (prev.some((i) => i.id === item.id || (item.skuId && i.skuId === item.skuId))) {
        return prev;
      }
      return [...prev, item];
    });
  }, []);

  const removeFromWishlist = useCallback((id: string) => {
    setWishlist((prev) => prev.filter((item) => item.id !== id && (!item.skuId || item.skuId !== id)));
  }, []);

  const toggleWishlist = useCallback(
    (item: WishlistItem) => {
      const exists = wishlist.some(
        (i) =>
          i.id === item.id ||
          (Boolean(item.skuId) && (i.skuId === item.skuId || i.id === item.skuId)) ||
          (Boolean(i.skuId) && i.skuId === item.id)
      );
      if (exists) {
        setWishlist((prev) =>
          prev.filter(
            (i) =>
              i.id !== item.id &&
              (!item.skuId || i.id !== item.skuId) &&
              (!i.skuId || i.skuId !== item.id) &&
              (!i.skuId || !item.skuId || i.skuId !== item.skuId)
          )
        );
        return false;
      } else {
        addToWishlist(item);
        return true;
      }
    },
    [wishlist, addToWishlist]
  );

  const clearWishlist = useCallback(() => {
    setWishlist([]);
  }, []);

  const handleMoveToCart = useCallback(
    (item: WishlistItem) => {
      addToCart({
        id: item.id,
        skuId: item.skuId || item.id,
        name: item.name,
        price: item.price,
        priceDisplay: item.priceDisplay || `₹${item.price.toLocaleString("en-IN")}`,
        image: item.image,
        quantity: 1,
      });
      removeFromWishlist(item.id);
      setIsWishlistOpen(false);
      setIsCartOpen(true);
    },
    [addToCart, removeFromWishlist, setIsCartOpen]
  );

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        wishlistCount: wishlist.length,
        isWishlistOpen,
        setIsWishlistOpen,
        isInWishlist,
        toggleWishlist,
        addToWishlist,
        removeFromWishlist,
        clearWishlist,
      }}
    >
      {children}
      <WishlistDrawer
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        items={wishlist}
        onMoveToCart={handleMoveToCart}
        onRemoveItem={removeFromWishlist}
        onClearAll={clearWishlist}
      />
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    return {
      wishlist: [],
      wishlistCount: 0,
      isWishlistOpen: false,
      setIsWishlistOpen: () => {},
      isInWishlist: () => false,
      toggleWishlist: () => false,
      addToWishlist: () => {},
      removeFromWishlist: () => {},
      clearWishlist: () => {},
    };
  }
  return context;
}
