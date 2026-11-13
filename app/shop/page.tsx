"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { PRODUCTS, ProductSKU } from "@/lib/products";
import { useProducts } from "@/lib/products-context";
import {
  ProductCardItem,
  getCleanTitle,
  getProductBadge,
  getDiscountPercent,
} from "@/components/home/product-showcase";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { useCart } from "@/lib/cart-context";
import { AnimatedText } from "@/components/ui/animated-text";
import { RealisticSmoke } from "@/components/home/realistic-smoke";
import { BrassBurnerFeature } from "@/components/shop/brass-burner-feature";

export default function ShopPage() {
  const router = useRouter();
  const { cartCount, setIsCartOpen, quickAddToCart } = useCart();
  const [addedId, setAddedId] = useState<string | null>(null);

  const handleQuickAdd = (product: ProductSKU) => {
    quickAddToCart(product);
    setAddedId(product.id);
    setTimeout(() => setAddedId(null), 1400);
  };

  const handleCustomize = (product: ProductSKU) => {
    router.push(`/products/${product.id}`);
  };

  const { products } = useProducts();

  // Grouped products synchronized with Neon database
  const giftBoxes = useMemo(
    () => products.filter((p) => p.category === "Gift Boxes"),
    [products]
  );
  const fragrances = useMemo(
    () => products.filter((p) => p.category === "Fragrances"),
    [products]
  );
  const accessories = useMemo(
    () => products.filter((p) => p.category === "Sacred Accessories"),
    [products]
  );

  const getGiftBoxCardBg = (id: string) => {
    switch (id) {
      case "mdf-gift-box":
        return "bg-[#332A1E] border border-[#DDD3C2]/40 shadow-sm";
      case "marble-gift-box":
      case "empty-marble-box":
        return "bg-[#1C241B] border border-[#DDD3C2]/40 shadow-sm";
      case "5-elements-suite":
        return "bg-[#231C16] border border-[#DDD3C2]/40 shadow-sm";
      default:
        return "bg-[#1E1915] border border-[#DDD3C2]/40 shadow-sm";
    }
  };

  const getFragranceCardBg = () => {
    return "bg-white border border-[#DDD3C2] shadow-sm hover:shadow-md transition-all";
  };

  const getAccessoryCardBg = () => {
    return "bg-white border border-[#DDD3C2] shadow-sm hover:shadow-md transition-all";
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-stone-900 selection:bg-[#eed08e] selection:text-[#1C1B18]">
      {/* Navigation Bar */}
      <Navbar cartCount={cartCount} onOpenCart={() => setIsCartOpen(true)} />

      {/* 1. DISTINCT LUXURY EDITORIAL SHOP BANNER - Warm Beige Palette with Unobstructed Sandalwood Products */}
      <section className="relative w-full h-[52vh] sm:h-[58vh] lg:h-[64vh] min-h-[440px] max-h-[600px] bg-[#EDE1D1] border-b border-[#DDD3C2] overflow-hidden flex items-center text-[#1C1B18]">
        {/* Full-Bleed End-to-End Background Image */}
        <div className="absolute inset-0 w-full h-full z-0 pointer-events-none">
          <Image
            src="/images/shop/shop-hero-banner-beige.jpg"
            alt="Kurma Heirloom Slatted Keepsake Trunk, 5 Elements Incense Suites, Solid Cast Brass Turtle Burner and Mysore Sandalwood"
            fill
            priority
            className="object-cover object-right md:object-[center_35%]"
            sizes="100vw"
          />
          {/* Realistic Flowing Sandalwood Smoke Animation */}
          <RealisticSmoke preset="shop" />
        </div>

        {/* Content Container - Positioned to the side (left) so it doesn't overlap products */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 py-10 sm:py-14">
          <div className="max-w-md sm:max-w-lg lg:max-w-[540px] xl:max-w-[580px] text-left space-y-3.5 sm:space-y-4">
            <div className="space-y-1.5 sm:space-y-2">
              <AnimatedText delay={0.1} yOffset={22}>
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[54px] font-serif font-normal text-[#1C1B18] tracking-tight leading-[1.14]">
                  Handcrafted Incense Suites
                </h1>
              </AnimatedText>
              <AnimatedText delay={0.25} yOffset={18}>
                <p className="text-2xl sm:text-3xl md:text-4xl lg:text-[42px] font-serif italic font-normal text-[#7A5A28]">
                  &amp; Solid Brass Heirloom Trunks
                </p>
              </AnimatedText>
            </div>

            <AnimatedText delay={0.38} yOffset={14}>
              <p className="text-xs sm:text-sm md:text-base text-[#3E362D] font-light max-w-lg leading-relaxed">
                100% charcoal-free sacred elemental aromas and heirloom presentation suites crafted for quiet living.
              </p>
            </AnimatedText>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="flex-1 w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 py-8 sm:py-12 space-y-12 sm:space-y-16">
        <div className="space-y-16 sm:space-y-20">
          {/* SECTION 1: GIFT TRUNKS & SUITES */}
          <section className="space-y-6">
            <div className="relative text-left border-b border-stone-200/80 pb-4">
              <div className="flex justify-start">
                <h3 className="text-2xl sm:text-3xl md:text-[34px] lg:text-4xl font-serif text-stone-900 font-normal tracking-tight text-left">
                  Gift Trunks &amp; Keepsake Suites
                </h3>
              </div>
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
                  objectFit="object-contain object-center"
                  imagePadding="p-2.5 sm:p-3.5"
                  cardBg={getGiftBoxCardBg(product.id)}
                />
              ))}
            </div>
          </section>

          {/* BANNER 1: COMBO PACK LUXURY SUITE PROMOTIONAL BANNER */}
          <div className="relative w-full rounded-2xl sm:rounded-3xl overflow-hidden shadow-sm border border-[#DDD3C2] min-h-[380px] sm:min-h-[480px] lg:min-h-[520px] flex items-center bg-[#EDE1D1]">
            {/* Full-Banner Background Image */}
            <div className="absolute inset-0 w-full h-full z-0">
              <Image
                src="/images/product/suite-5-elements-banner.jpg"
                alt="Kurma 5 Elements Complete Suite"
                fill
                loading="lazy"
                className="object-cover object-right md:object-[center_right] lg:object-[82%_center] transition-transform duration-700 hover:scale-103"
                sizes="100vw"
              />
              {/* Luxury Ambient Contrast Gradient: Keeps text 100% readable while letting products shine */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#EDE1D1]/95 via-[#EDE1D1]/75 to-transparent sm:bg-gradient-to-r sm:from-[#EDE1D1]/95 sm:via-[#EDE1D1]/80 sm:to-transparent lg:via-[#EDE1D1]/65 pointer-events-none" />
            </div>

            {/* Content Container - Positioned on Top of the Image */}
            <div className="relative z-10 w-full p-4 sm:p-10 md:p-12 lg:p-16">
              <div className="max-w-md sm:max-w-lg lg:max-w-xl text-left space-y-4 sm:space-y-6 text-[#1C1B18]">
                <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif font-normal text-[#1C1B18] leading-[1.18] tracking-tight">
                  The Complete 5 Elements Luxury Fragrance Suite
                </h3>
                <p className="text-[#3E362D] text-xs sm:text-sm md:text-base font-sans max-w-lg leading-relaxed">
                  Experience Earth, Water, Fire, Air, and Space in a single curated suite. Comes with our solid cast brass turtle burner and personalized keepsake card.
                </p>
                <div className="pt-2 sm:pt-3 flex items-center gap-4">
                  <button
                    onClick={() => router.push("/products/5-elements-suite")}
                    className="w-full sm:w-auto text-center px-6 sm:px-8 py-3.5 sm:py-4 bg-[#eed08e] hover:bg-[#f7e8c4] text-[#1C1B18] text-xs font-bold tracking-widest uppercase rounded-xl transition-all shadow-md hover:shadow-lg border border-[#d6ba75] cursor-pointer active:scale-98"
                  >
                    Customise &amp; Shop Suite
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 2: THE 5 ELEMENTS FRAGRANCES */}
          <section className="-mx-4 sm:-mx-6 md:-mx-8 lg:-mx-12 xl:-mx-16 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 py-10 sm:py-14 bg-[#ECE4D8] border-t border-b border-[#DDD3C2] space-y-6">
            <div className="relative text-left border-b border-[#DDD3C2] pb-4">
              <div className="flex justify-start">
                <h3 className="text-2xl sm:text-3xl md:text-[34px] lg:text-4xl font-serif text-stone-900 font-normal tracking-tight text-left">
                  The 5 Sacred Elements Incense
                </h3>
              </div>
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
                  objectFit="object-contain object-center"
                  imagePadding="p-2 sm:p-2.5"
                  cardBg={getFragranceCardBg()}
                />
              ))}
            </div>
          </section>

          {/* BANNER 2: SOLID BRASS HEIRLOOM CRAFTSMANSHIP PROMOTIONAL BANNER */}
          <BrassBurnerFeature />

          {/* SECTION 3: ARTISANAL ACCESSORIES & HEIRLOOMS */}
          <section className="space-y-6">
            <div className="relative text-left border-b border-stone-200/80 pb-4">
              <div className="flex justify-start">
                <h3 className="text-2xl sm:text-3xl md:text-[34px] lg:text-4xl font-serif text-stone-900 font-normal tracking-tight text-left">
                  Artisanal Accessories &amp; Heirloom Burners
                </h3>
              </div>
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
                  objectFit="object-contain object-center"
                  imagePadding="p-3 sm:p-4"
                  cardBg={getAccessoryCardBg()}
                />
              ))}
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
