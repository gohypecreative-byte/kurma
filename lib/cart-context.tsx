"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { CartItem, CartDrawer } from "@/components/cart/cart-drawer";
import { ProductCustomizerModal } from "@/components/product/product-customizer-modal";
import { ProductSKU, formatPrice, createCartItemId, getProductById, PRODUCTS } from "@/lib/products";

export function getProductAvailableStock(productId?: string): number {
  if (!productId) return 25;
  if (typeof window === "undefined") return 25;

  // 1. Check kurma_inventory_stock in localStorage (updated by admin)
  try {
    const rawStock = localStorage.getItem("kurma_inventory_stock");
    if (rawStock) {
      const stockMap = JSON.parse(rawStock);
      if (typeof stockMap[productId] === "number") {
        return Math.max(0, stockMap[productId]);
      }
    }
  } catch { }

  // 2. Check kurma_admin_products in localStorage
  try {
    const rawProducts = localStorage.getItem("kurma_admin_products");
    if (rawProducts) {
      const adminProds = JSON.parse(rawProducts);
      if (Array.isArray(adminProds)) {
        const found = adminProds.find((p: any) => p.id === productId);
        if (found && typeof found.stock === "number") {
          return Math.max(0, found.stock);
        }
      }
    }
  } catch { }

  // 3. Check static PRODUCTS
  const staticFound = PRODUCTS.find((p) => p.id === productId);
  if (staticFound && typeof staticFound.stock === "number") {
    return Math.max(0, staticFound.stock);
  }

  // Default inventory stock units if unspecified
  return 25;
}

interface CartContextType {
  cartItems: CartItem[];
  cartCount: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  addToCart: (item: CartItem) => boolean;
  quickAddToCart: (product: ProductSKU) => boolean;
  updateQuantity: (id: string, delta: number) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  customizingProduct: ProductSKU | null;
  setCustomizingProduct: (product: ProductSKU | null) => void;
  stockWarning: string | null;
  setStockWarning: (msg: string | null) => void;
  triggerStockWarning: (msg: string) => void;
  getProductStock: (productId?: string) => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [customizingProduct, setCustomizingProduct] = useState<ProductSKU | null>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);
  const [stockWarning, setStockWarning] = useState<string | null>(null);

  const triggerStockWarning = (msg: string) => {
    setStockWarning(msg);
    setTimeout(() => {
      setStockWarning((prev) => (prev === msg ? null : prev));
    }, 4500);
  };

  const getProductStock = (productId?: string): number => {
    return getProductAvailableStock(productId);
  };

  // Load cart from localStorage on mount safely and validate with backend database
  useEffect(() => {
    try {
      const saved = localStorage.getItem("kurma_cart");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          // Strictly filter out any legacy dummy placeholder items or invalid entries
          const validItems = parsed.filter(
            (item: any) =>
              item &&
              item.id !== "init-marble-box" &&
              item.skuId !== "init-marble-box" &&
              item.name &&
              typeof item.price === "number" &&
              item.price > 0 &&
              typeof item.quantity === "number" &&
              item.quantity > 0
          );
          setCartItems(validItems);

          // Refresh live details (pricing, images, stock) with backend Neon DB
          if (validItems.length > 0) {
            fetch("/api/cart/validate", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ items: validItems }),
            })
              .then((res) => res.json())
              .then((data) => {
                if (data?.success && Array.isArray(data.validatedItems)) {
                  setCartItems(data.validatedItems);
                }
              })
              .catch((err) => {
                console.warn("Cart backend validation skipped:", err);
              });
          }
        }
      }
    } catch {
      // ignore parsing error
    } finally {
      setIsHydrated(true);
    }
  }, []);

  // Save cart to localStorage on changes (only after initial hydration has completed)
  useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem("kurma_cart", JSON.stringify(cartItems));
    } catch {
      // ignore storage error
    }
  }, [cartItems, isHydrated]);

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const addToCart = (item: CartItem): boolean => {
    if (!item || !item.name || typeof item.price !== "number") return false;

    const productId = item.skuId || item.id;
    const maxStock = getProductAvailableStock(productId);

    // Sum up existing units of this product already in cart
    const currentInCart = cartItems
      .filter((i) => Boolean(productId) && (i.id === productId || i.skuId === productId))
      .reduce((sum, i) => sum + i.quantity, 0);

    const requestedQty = Math.max(1, item.quantity || 1);
    const availableRemaining = Math.max(0, maxStock - currentInCart);

    // If stock limit is already reached
    if (availableRemaining <= 0) {
      triggerStockWarning(
        `Cannot add more "${item.name}". Only ${maxStock} item${maxStock !== 1 ? "s" : ""} available in stock and all ${maxStock} are already in your cart.`
      );
      setIsCartOpen(true);
      return false;
    }

    // If user requests more than the available remaining stock
    if (requestedQty > availableRemaining) {
      const allowedAdd = availableRemaining;
      triggerStockWarning(
        `Only ${availableRemaining} remaining available in stock for "${item.name}" (Available Stock: ${maxStock}). Added ${allowedAdd} to your cart.`
      );

      setCartItems((prev) => {
        const existing = prev.find(
          (i) =>
            (i.id === item.id || (Boolean(i.skuId) && Boolean(item.skuId) && i.skuId === item.skuId)) &&
            JSON.stringify(i.customizations || {}) === JSON.stringify(item.customizations || {})
        );

        if (existing) {
          return prev.map((i) =>
            i === existing
              ? {
                  ...i,
                  quantity: i.quantity + allowedAdd,
                  stock: maxStock,
                }
              : i
          );
        }

        return [
          ...prev,
          {
            id: item.id || createCartItemId(item.skuId || `item-${Date.now()}`),
            skuId: item.skuId || item.id,
            name: item.name,
            price: item.price,
            priceDisplay: item.priceDisplay || formatPrice(item.price),
            image: item.image || "/images/product/image.png",
            quantity: allowedAdd,
            stock: maxStock,
            customizations: item.customizations,
          },
        ];
      });

      setIsCartOpen(true);
      return false;
    }

    // Normal add within stock limits
    setCartItems((prev) => {
      const existing = prev.find(
        (i) =>
          (i.id === item.id || (Boolean(i.skuId) && Boolean(item.skuId) && i.skuId === item.skuId)) &&
          JSON.stringify(i.customizations || {}) === JSON.stringify(item.customizations || {})
      );

      if (existing) {
        return prev.map((i) =>
          i === existing
            ? {
                ...i,
                quantity: i.quantity + requestedQty,
                stock: maxStock,
                price: item.price || i.price,
                priceDisplay: item.priceDisplay || i.priceDisplay,
                image: item.image || i.image,
              }
            : i
        );
      }

      return [
        ...prev,
        {
          id: item.id || createCartItemId(item.skuId || `item-${Date.now()}`),
          skuId: item.skuId || item.id,
          name: item.name,
          price: item.price,
          priceDisplay: item.priceDisplay || formatPrice(item.price),
          image: item.image || "/images/product/image.png",
          quantity: requestedQty,
          stock: maxStock,
          customizations: item.customizations,
        },
      ];
    });

    setIsCartOpen(true);
    return true;
  };

  const quickAddToCart = (product: ProductSKU): boolean => {
    if (!product) return false;
    return addToCart({
      id: createCartItemId(product.id),
      skuId: product.id,
      name: product.name,
      price: product.price,
      priceDisplay: formatPrice(product.price),
      image: product.image,
      quantity: 1,
      stock: product.stock ?? getProductAvailableStock(product.id),
    });
  };

  const updateQuantity = (id: string, delta: number) => {
    setCartItems((prev) => {
      const target = prev.find((item) => item.id === id);
      if (!target) return prev;

      if (delta > 0) {
        const productId = target.skuId || target.id;
        const maxStock = getProductAvailableStock(productId);
        const currentTotal = prev
          .filter((i) => Boolean(productId) && (i.id === productId || i.skuId === productId))
          .reduce((sum, i) => sum + i.quantity, 0);

        if (currentTotal >= maxStock) {
          triggerStockWarning(
            `Cannot add more "${target.name}". Only ${maxStock} available in stock.`
          );
          return prev;
        }
      }

      return prev
        .map((item) => {
          if (item.id === id) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[];
    });
  };

  const removeItem = (id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const clearCart = () => {
    setCartItems([]);
    try {
      localStorage.removeItem("kurma_cart");
    } catch {}
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
        clearCart,
        customizingProduct,
        setCustomizingProduct,
        stockWarning,
        setStockWarning,
        triggerStockWarning,
        getProductStock,
      }}
    >
      {children}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={updateQuantity}
        onRemoveItem={removeItem}
        onClearCart={clearCart}
        stockWarning={stockWarning}
        onClearStockWarning={() => setStockWarning(null)}
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
