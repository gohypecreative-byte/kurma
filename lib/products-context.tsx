"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react";
import { PRODUCTS, ProductSKU } from "@/lib/products";

export interface ProductsContextType {
  products: ProductSKU[];
  loading: boolean;
  error: string | null;
  refreshProducts: () => Promise<void>;
  getProduct: (id: string) => ProductSKU | undefined;
  getProductsByCategory: (category: string) => ProductSKU[];
}

const ProductsContext = createContext<ProductsContextType | null>(null);

export function ProductsProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<ProductSKU[]>(PRODUCTS);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/products", {
        cache: "no-store",
        headers: {
          "Cache-Control": "no-cache",
        },
      });
      if (!res.ok) {
        throw new Error(`Failed to fetch products: ${res.statusText}`);
      }
      const data = await res.json();
      if (data.success && Array.isArray(data.products) && data.products.length > 0) {
        setProducts(data.products);
        setError(null);
      }
    } catch (err: any) {
      console.warn("Could not fetch latest products from DB, using fallback", err);
      setError(err?.message || "Failed to load live products");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();

    // Listen for custom update event fired after admin creates/updates/deletes products
    const handleUpdate = () => {
      fetchProducts();
    };

    window.addEventListener("kurma-products-updated", handleUpdate);
    window.addEventListener("storage", handleUpdate);

    return () => {
      window.removeEventListener("kurma-products-updated", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, [fetchProducts]);

  const getProduct = useCallback(
    (id: string): ProductSKU | undefined => {
      if (!id) return undefined;
      const normalized = id.replace(/^fragance-/, "fragrance-");
      return (
        products.find((p) => p.id === id || p.id === normalized) ||
        PRODUCTS.find((p) => p.id === id || p.id === normalized)
      );
    },
    [products]
  );

  const getProductsByCategory = useCallback(
    (category: string): ProductSKU[] => {
      return products.filter((p) => p.category.toLowerCase() === category.toLowerCase());
    },
    [products]
  );

  const value = useMemo(
    () => ({
      products,
      loading,
      error,
      refreshProducts: fetchProducts,
      getProduct,
      getProductsByCategory,
    }),
    [products, loading, error, fetchProducts, getProduct, getProductsByCategory]
  );

  return (
    <ProductsContext.Provider value={value}>
      {children}
    </ProductsContext.Provider>
  );
}

export function useProducts() {
  const context = useContext(ProductsContext);
  if (!context) {
    // If used outside provider, return default static values gracefully
    return {
      products: PRODUCTS,
      loading: false,
      error: null,
      refreshProducts: async () => {},
      getProduct: (id: string) => PRODUCTS.find((p) => p.id === id),
      getProductsByCategory: (category: string) =>
        PRODUCTS.filter((p) => p.category.toLowerCase() === category.toLowerCase()),
    };
  }
  return context;
}

/**
 * Utility helper to trigger global product sync event from any admin component
 */
export function notifyProductUpdated() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("kurma-products-updated"));
  }
}

