"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { CartItem, CartDrawer } from "@/components/cart/cart-drawer";
import { ProductCustomizerModal } from "@/components/product/product-customizer-modal";
import { ProductSKU, formatPrice, createCartItemId, getProductById } from "@/lib/products";

interface CartContextType {
  cartItems: CartItem[];
  cartCount: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  addToCart: (item: CartItem) => void;
  quickAddToCart: (product: ProductSKU) => void;
  updateQuantity: (id: string, delta: number) => void;
  removeItem: (id: string) => void;
  customizingProduct: ProductSKU | null;
  setCustomizingProduct: (product: ProductSKU | null) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [customizingProduct, setCustomizingProduct] = useState<ProductSKU | null>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: "init-marble-box",
      skuId: "marble-gift-box",
      name: "Elements in Harmony Luxury Marble Gift Box",
      price: 4999,
      priceDisplay: "₹4,999",
      image: "/images/product/image9.png",
      quantity: 1,
    },
  ]);

  // Load cart from localStorage on mount safely
  useEffect(() => {
    try {
      const saved = localStorage.getItem("kurma_cart");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setCartItems(parsed);
        }
      }
    } catch {
      // ignore parsing error
    }
  }, []);

  // Save cart to localStorage on changes
  useEffect(() => {
    try {
      localStorage.setItem("kurma_cart", JSON.stringify(cartItems));
    } catch {
      // ignore storage error
    }
  }, [cartItems]);

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const addToCart = (item: CartItem) => {
    setCartItems((prev) => {
      const existing = prev.find(
        (i) =>
          i.id === item.id ||
          (i.skuId === item.skuId &&
            JSON.stringify(i.customizations || {}) === JSON.stringify(item.customizations || {}))
      );

      if (existing) {
        return prev.map((i) =>
          i === existing ? { ...i, quantity: i.quantity + (item.quantity || 1) } : i
        );
      }

      return [
        ...prev,
        {
          id: item.id || `item-${Date.now()}`,
          skuId: item.skuId,
          name: item.name,
          price: item.price,
          priceDisplay: item.priceDisplay || formatPrice(item.price),
          image: item.image || "/images/product/image.png",
          quantity: item.quantity || 1,
          customizations: item.customizations,
        },
      ];
    });
    setIsCartOpen(true);
  };

  const quickAddToCart = (product: ProductSKU) => {
    addToCart({
      id: createCartItemId(product.id),
      skuId: product.id,
      name: product.name,
      price: product.price,
      priceDisplay: formatPrice(product.price),
      image: product.image,
      quantity: 1,
    });
  };

  const updateQuantity = (id: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const removeItem = (id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleCustomizeFromCart = (cartItem: CartItem) => {
    setIsCartOpen(false);
    if (cartItem.skuId) {
      const prod = getProductById(cartItem.skuId);
      if (prod) {
        setCustomizingProduct(prod);
      }
    }
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartCount,
        isCartOpen,
        setIsCartOpen,
        addToCart,
        quickAddToCart,
        updateQuantity,
        removeItem,
        customizingProduct,
        setCustomizingProduct,
      }}
    >
      {children}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={updateQuantity}
        onRemoveItem={removeItem}
        onExploreProducts={() => {
          setIsCartOpen(false);
          if (typeof window !== "undefined") {
            window.location.href = "/shop";
          }
        }}
      />
      <ProductCustomizerModal
        product={customizingProduct}
        isOpen={!!customizingProduct}
        onClose={() => setCustomizingProduct(null)}
        onAddToCart={(cartItem) => {
          addToCart(cartItem);
          setCustomizingProduct(null);
        }}
      />
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
