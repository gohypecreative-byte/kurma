"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { PRODUCTS, ProductSKU } from "@/lib/products";
import {
  ProductCardItem,
  getCleanTitle,
  getProductBadge,
  getDiscountPercent,
} from "@/components/home/product-showcase";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { useCart } from "@/lib/cart-context";

type CategoryFilter = "all" | "Gift Boxes" | "Fragrances" | "Sacred Accessories";

export default function ShopPage() {
  const router = useRouter();
  const {
    cartCount,
    setIsCartOpen,
    quickAddToCart,
  } = useCart();

  const [activeCategory, setActiveCategory] = useState<CategoryFilter>("all");
  const [addedId, setAddedId] = useState<string | null>(null);

  const handleQuickAdd = (product: ProductSKU) => {
    quickAddToCart(product);
    setAddedId(product.id);
    setTimeout(() => setAddedId(null), 1400);
  };

  const handleCustomize = (product: ProductSKU) => {
    router.push(`/products/${product.id}`);
  };

  // Filter products by category
  const filteredProducts = useMemo(() => {
    if (activeCategory === "all") return PRODUCTS;
    return PRODUCTS.filter((p) => p.category === activeCategory);
  }, [activeCategory]);

  const categories = [
    { id: "all" as const, label: "All Creations", count: PRODUCTS.length },
    {
      id: "Gift Boxes" as const,
      label: "Gift Trunks & Suites",
      count: PRODUCTS.filter((p) => p.category === "Gift Boxes").length,
    },
    {
      id: "Fragrances" as const,
      label: "The 5 Elements",
      count: PRODUCTS.filter((p) => p.category === "Fragrances").length,
    },
    {
      id: "Sacred Accessories" as const,
      label: "Artisanal Accessories",
      count: PRODUCTS.filter((p) => p.category === "Sacred Accessories").length,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-stone-900 selection:bg-[#eed08e] selection:text-[#072515]">
      {/* Navigation Bar */}
      <Navbar
        cartCount={cartCount}
        onOpenCart={() => setIsCartOpen(true)}
      />

      {/* Main Shop Container (End-to-End Full Width) */}
      <main className="flex-1 w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 py-8 sm:py-10 space-y-7 sm:space-y-8">
        {/* Minimal Editorial Shop Header */}
        <div className="space-y-4 pt-1 pb-2">
          <h1 className="text-2xl sm:text-3xl font-serif text-stone-900 font-normal tracking-tight text-center">
            The Sacred Collection
          </h1>

          {/* Clean Underline Category Tabs */}
          <div className="flex items-center justify-center gap-6 sm:gap-8 overflow-x-auto no-scrollbar py-2 text-xs font-cinzel tracking-wider border-b border-stone-200/60">
            {categories.map((cat) => {
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`pb-1.5 transition-all whitespace-nowrap cursor-pointer uppercase ${
                    isActive
                      ? "text-stone-900 border-b-2 border-stone-900 font-semibold"
                      : "text-stone-400 hover:text-stone-800 font-normal"
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Product Grid - 4-Column Editorial Gallery Matching Reference */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6 pt-1">
            {filteredProducts.map((product) => (
              <ProductCardItem
                key={product.id}
                product={product}
                activeMode="direct"
                addedId={addedId}
                onQuickAdd={handleQuickAdd}
                onCustomize={handleCustomize}
                badge={getProductBadge(product.id)}
                discount={getDiscountPercent(product.price, product.originalPrice)}
                cleanTitle={getCleanTitle(product)}
                variant="minimal"
              />
            ))}
          </div>
        ) : (
          <div className="py-24 text-center space-y-4 bg-white rounded-2xl border border-stone-200/80 p-8">
            <p className="text-stone-500 text-sm font-sans">
              No creations found in this collection.
            </p>
            <button
              onClick={() => setActiveCategory("all")}
              className="px-5 py-2 rounded-lg bg-[#072515] text-[#eed08e] text-xs font-cinzel font-semibold uppercase tracking-wider hover:bg-[#0c3823] transition-colors cursor-pointer"
            >
              Show All Creations
            </button>
          </div>
        )}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
