"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Sparkles,
  ShieldCheck,
  Leaf,
  Flame,
  PenTool,
  ChevronRight,
} from "lucide-react";
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
  const { cartCount, setIsCartOpen, quickAddToCart } = useCart();

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

  // Grouped products
  const giftBoxes = useMemo(
    () => PRODUCTS.filter((p) => p.category === "Gift Boxes"),
    []
  );
  const fragrances = useMemo(
    () => PRODUCTS.filter((p) => p.category === "Fragrances"),
    []
  );
  const accessories = useMemo(
    () => PRODUCTS.filter((p) => p.category === "Sacred Accessories"),
    []
  );

  const filteredProducts = useMemo(() => {
    if (activeCategory === "all") return PRODUCTS;
    return PRODUCTS.filter((p) => p.category === activeCategory);
  }, [activeCategory]);

  const categories = [
    { id: "all" as const, label: "All Creations", count: PRODUCTS.length },
    {
      id: "Gift Boxes" as const,
      label: "Gift Trunks & Suites",
      count: giftBoxes.length,
    },
    {
      id: "Fragrances" as const,
      label: "The 5 Elements",
      count: fragrances.length,
    },
    {
      id: "Sacred Accessories" as const,
      label: "Artisanal Accessories",
      count: accessories.length,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-stone-900 selection:bg-[#eed08e] selection:text-[#072515]">
      {/* Navigation Bar */}
      <Navbar cartCount={cartCount} onOpenCart={() => setIsCartOpen(true)} />

      {/* 1. DISTINCT LUXURY EDITORIAL SHOP BANNER (Image 100% Visible & Uncropped) */}
      <section className="w-full bg-[#072515] bg-[radial-gradient(ellipse_at_center,#0b3822_0%,#04160d_100%)] border-b border-[#eed08e]/30 text-white relative overflow-hidden py-10 sm:py-14 lg:py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-7 text-center">
          {/* Main Title - Refined Luxury Typography */}
          <div className="space-y-2">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-light text-white tracking-wide leading-tight">
              Handcrafted Incense Suites
            </h1>
            <p className="text-2xl sm:text-3xl lg:text-4xl font-serif italic font-normal text-[#eed08e]">
              &amp; Solid Brass Heirloom Trunks
            </p>
          </div>

          {/* Gold Diamond Accent Divider Line */}
          <div className="flex items-center justify-center gap-3 py-1">
            <div className="h-px w-24 sm:w-32 bg-gradient-to-r from-transparent via-[#eed08e]/70 to-transparent" />
            <div className="w-2 h-2 rotate-45 border border-[#eed08e] bg-[#072515]" />
            <div className="h-px w-24 sm:w-32 bg-gradient-to-r from-transparent via-[#eed08e]/70 to-transparent" />
          </div>

          {/* Center Image Showcase (100% Visible, Completely Uncropped) */}
          <div className="relative max-w-4xl mx-auto w-full h-[300px] sm:h-[400px] lg:h-[480px] flex items-center justify-center">
            <Image
              src="/images/product/image7.png"
              alt="Kurma Luxury Sacred Incense Suite"
              fill
              priority
              unoptimized
              className="object-contain object-center filter drop-shadow-2xl transition-transform duration-700 hover:scale-102"
              sizes="(max-width: 1024px) 100vw, 80vw"
            />
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="flex-1 w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 py-8 sm:py-12 space-y-12 sm:space-y-16">
        {/* CATEGORY TABS HEADER */}
        <div className="space-y-4 text-center max-w-3xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-serif text-stone-900 font-normal tracking-tight">
            Browse Sacred Collections
          </h2>

          {/* Clean Underline Category Navigation Tabs */}
          <div className="flex flex-nowrap overflow-hidden items-center justify-center gap-2 sm:gap-4 md:gap-8 py-2 text-xs font-sans tracking-wider border-b border-stone-200">
            {categories.map((cat) => {
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`pb-2.5 transition-all whitespace-nowrap cursor-pointer uppercase tracking-widest text-[11px] sm:text-xs ${
                    isActive
                      ? "text-[#8b5f10] border-b-2 border-[#8b5f10] font-bold"
                      : "text-stone-500 hover:text-stone-900 font-medium"
                  }`}
                >
                  {cat.label} ({cat.count})
                </button>
              );
            })}
          </div>
        </div>

        {/* CONDITION 1: ALL CREATIONS (Categorized Layout with In-Between Banners) */}
        {activeCategory === "all" ? (
          <div className="space-y-16 sm:space-y-20">
            {/* SECTION 1: GIFT TRUNKS & SUITES */}
            <section className="space-y-6">
              <div className="flex items-end justify-between border-b border-stone-200/80 pb-3">
                <div>
                  <h3 className="text-xl sm:text-2xl font-serif text-stone-900 font-normal">
                    Gift Trunks &amp; Keepsake Suites
                  </h3>
                </div>
                <button
                  onClick={() => setActiveCategory("Gift Boxes")}
                  className="text-xs font-bold text-[#8b5f10] hover:text-[#6f4b0d] flex items-center gap-1 cursor-pointer"
                >
                  <span>View All Trunks</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
                {giftBoxes.map((product) => (
                  <ProductCardItem
                    key={product.id}
                    product={product}
                    activeMode="direct"
                    addedId={addedId}
                    onQuickAdd={handleQuickAdd}
                    onCustomize={handleCustomize}
                    badge={getProductBadge(product.id)}
                    discount={getDiscountPercent(
                      product.price,
                      product.originalPrice
                    )}
                    cleanTitle={getCleanTitle(product)}
                    variant="minimal"
                  />
                ))}
              </div>
            </section>

            {/* BANNER 1: COMBO PACK LUXURY SUITE PROMOTIONAL BANNER (Grand Luxury Size) */}
            <div className="w-full bg-[#072515] rounded-3xl overflow-hidden shadow-2xl border border-[#eed08e]/35 grid grid-cols-1 lg:grid-cols-12 items-center p-8 sm:p-12 lg:p-16 gap-8 sm:gap-12 text-white relative min-h-[440px] sm:min-h-[520px] lg:min-h-[580px]">
              <div className="lg:col-span-6 space-y-5 sm:space-y-6 z-10">
                <span className="inline-block px-4 py-1.5 bg-[#eed08e]/20 text-[#eed08e] rounded-full text-xs font-bold tracking-widest uppercase border border-[#eed08e]/40">
                  FLAGSHIP COMBINATION
                </span>
                <h3 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-normal text-white leading-[1.18]">
                  The Complete 5 Elements Luxury Fragrance Suite
                </h3>
                <p className="text-stone-300 text-sm sm:text-base font-sans max-w-xl leading-relaxed">
                  Experience Earth, Water, Fire, Air, and Space in a single curated suite. Comes with our solid cast brass turtle burner and personalized keepsake card.
                </p>
                <div className="pt-3 flex items-center gap-4">
                  <button
                    onClick={() => router.push("/products/5-elements-suite")}
                    className="px-8 py-4 bg-[#eed08e] hover:bg-[#f7e8c4] text-[#072515] text-xs font-bold tracking-widest uppercase rounded-xl transition-all shadow-lg hover:shadow-xl cursor-pointer active:scale-98"
                  >
                    Customise &amp; Shop Suite
                  </button>
                </div>
              </div>

              {/* Banner Image (Grand Size, 100% Visible, No Crop) */}
              <div className="lg:col-span-6 relative w-full h-[320px] sm:h-[440px] lg:h-[500px] flex items-center justify-center">
                <Image
                  src="/images/product/suite-clean.png"
                  alt="Kurma 5 Elements Complete Suite"
                  fill
                  unoptimized
                  className="object-contain object-center drop-shadow-2xl hover:scale-103 transition-transform duration-500"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
            </div>

            {/* SECTION 2: THE 5 ELEMENTS FRAGRANCES */}
            <section className="space-y-6">
              <div className="flex items-end justify-between border-b border-stone-200/80 pb-3">
                <div>
                  <h3 className="text-xl sm:text-2xl font-serif text-stone-900 font-normal">
                    The 5 Sacred Elements Incense
                  </h3>
                </div>
                <button
                  onClick={() => setActiveCategory("Fragrances")}
                  className="text-xs font-bold text-[#8b5f10] hover:text-[#6f4b0d] flex items-center gap-1 cursor-pointer"
                >
                  <span>View All Fragrances</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
                {fragrances.map((product) => (
                  <ProductCardItem
                    key={product.id}
                    product={product}
                    activeMode="direct"
                    addedId={addedId}
                    onQuickAdd={handleQuickAdd}
                    onCustomize={handleCustomize}
                    badge={getProductBadge(product.id)}
                    discount={getDiscountPercent(
                      product.price,
                      product.originalPrice
                    )}
                    cleanTitle={getCleanTitle(product)}
                    variant="minimal"
                  />
                ))}
              </div>
            </section>

            {/* BANNER 2: SOLID BRASS HEIRLOOM CRAFTSMANSHIP PROMOTIONAL BANNER (No Outer Box, Distinct Dark Green Button) */}
            <div className="w-full py-6 sm:py-10 grid grid-cols-1 lg:grid-cols-12 items-center gap-8 sm:gap-12 relative">
              {/* Banner Image (Grand Size, 100% Visible) */}
              <div className="lg:col-span-6 relative w-full h-[320px] sm:h-[420px] lg:h-[480px] flex items-center justify-center order-2 lg:order-1">
                <Image
                  src="/images/product/image8.png"
                  alt="Solid Cast Brass Turtle Incense Burner"
                  fill
                  unoptimized
                  className="object-contain object-center drop-shadow-2xl hover:scale-103 transition-transform duration-500"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>

              <div className="lg:col-span-6 space-y-5 sm:space-y-6 z-10 order-1 lg:order-2">
                <h3 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-normal text-stone-900 leading-[1.18]">
                  Handcrafted Solid Brass Turtle Incense Holder
                </h3>
                <p className="text-stone-700 text-sm sm:text-base font-sans max-w-xl leading-relaxed">
                  Sculpted in pure solid brass, inspired by Kurma—the sacred turtle avatar symbolizing foundation, stability, and timeless sanctuary.
                </p>
                <div className="pt-2 flex items-center gap-4">
                  <button
                    onClick={() => router.push("/products/turtle-incense-holder")}
                    className="px-8 py-4 bg-[#072515] hover:bg-[#0c3823] text-[#eed08e] text-xs font-bold tracking-widest uppercase rounded-xl transition-all shadow-md hover:shadow-lg cursor-pointer active:scale-98"
                  >
                    Customise &amp; Order Burner
                  </button>
                </div>
              </div>
            </div>

            {/* SECTION 3: ARTISANAL ACCESSORIES & HEIRLOOMS */}
            <section className="space-y-6">
              <div className="flex items-end justify-between border-b border-stone-200/80 pb-3">
                <div>
                  <h3 className="text-xl sm:text-2xl font-serif text-stone-900 font-normal">
                    Artisanal Accessories &amp; Heirloom Burners
                  </h3>
                </div>
                <button
                  onClick={() => setActiveCategory("Sacred Accessories")}
                  className="text-xs font-bold text-[#8b5f10] hover:text-[#6f4b0d] flex items-center gap-1 cursor-pointer"
                >
                  <span>View All Accessories</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
                {accessories.map((product) => (
                  <ProductCardItem
                    key={product.id}
                    product={product}
                    activeMode="direct"
                    addedId={addedId}
                    onQuickAdd={handleQuickAdd}
                    onCustomize={handleCustomize}
                    badge={getProductBadge(product.id)}
                    discount={getDiscountPercent(
                      product.price,
                      product.originalPrice
                    )}
                    cleanTitle={getCleanTitle(product)}
                    variant="minimal"
                  />
                ))}
              </div>
            </section>
          </div>
        ) : (
          /* CONDITION 2: SPECIFIC CATEGORY FILTER VIEW */
          <div className="space-y-8">
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <h3 className="text-xl sm:text-2xl font-serif text-stone-900 font-normal capitalize">
                {activeCategory} ({filteredProducts.length})
              </h3>
              <button
                onClick={() => setActiveCategory("all")}
                className="text-xs font-bold text-[#8b5f10] hover:underline cursor-pointer"
              >
                Back to All Creations
              </button>
            </div>

            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
                {filteredProducts.map((product) => (
                  <ProductCardItem
                    key={product.id}
                    product={product}
                    activeMode="direct"
                    addedId={addedId}
                    onQuickAdd={handleQuickAdd}
                    onCustomize={handleCustomize}
                    badge={getProductBadge(product.id)}
                    discount={getDiscountPercent(
                      product.price,
                      product.originalPrice
                    )}
                    cleanTitle={getCleanTitle(product)}
                    variant="minimal"
                  />
                ))}
              </div>
            ) : (
              <div className="py-20 text-center space-y-4 bg-white rounded-2xl border border-stone-200 p-8">
                <p className="text-stone-500 text-sm font-sans">
                  No products found in this category.
                </p>
                <button
                  onClick={() => setActiveCategory("all")}
                  className="px-5 py-2.5 rounded-xl bg-[#8b5f10] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#6f4b0d] transition-colors cursor-pointer"
                >
                  Show All Creations
                </button>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
