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
import { SlidersHorizontal, ShieldCheck, Crown, Feather, PenTool, Check } from "lucide-react";

export default function GiftTrunksPage() {
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

  // Gift Trunks & Suites
  const trunkProducts = useMemo(() => {
    return PRODUCTS.filter((p) => p.category === "Gift Boxes");
  }, []);

  const bespokeFeatures = [
    {
      title: "Solid Brass Plaque Engraving",
      icon: PenTool,
      desc: "Deep laser or rotary brass engraving mounted on the inner trunk lid. Personalized with names, wedding dates, or company logos.",
    },
    {
      title: "Imperial Suede & Velvet Linings",
      icon: Crown,
      desc: "Lush jewel-toned interior linings in Sacred Forest Green, Royal Crimson, or Midnight Obsidian to nestle each incense box.",
    },
    {
      title: "Wax-Sealed Calligraphy Parchment",
      icon: Feather,
      desc: "Handcrafted deckle-edge paper inscribed with your blessing, closed with molten gold wax and the Lord Kurma talisman seal.",
    },
    {
      title: "Solid Cast Brass Turtle Burner",
      icon: ShieldCheck,
      desc: "An heirloom-grade keepsake turtle cast in pure brass from Moradabad, engineered to hold burning sticks for generations.",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-stone-900 selection:bg-[#eed08e] selection:text-[#072515]">
      <Navbar cartCount={cartCount} onOpenCart={() => setIsCartOpen(true)} />

      <main className="flex-1 w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 py-8 sm:py-10 space-y-12 sm:space-y-16">
        {/* Minimalist Editorial Header */}
        <div className="space-y-4 pt-1 pb-2 max-w-4xl mx-auto text-center">
          <h1 className="text-2xl sm:text-4xl font-serif text-stone-900 font-normal tracking-tight">
            Curated Heirloom Trunks &amp; Gift Suites
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 font-sans max-w-xl mx-auto leading-relaxed">
            Handcrafted emerald-veined Bidasar marble and rigid keepsake wood trunks. Designed to be treasured as timeless altar keepsakes.
          </p>

          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              onClick={() => handleCustomize(trunkProducts[0])}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#072515] hover:bg-[#0d3b23] text-[#eed08e] text-xs font-cinzel font-semibold uppercase tracking-wider transition-all duration-200 shadow-sm cursor-pointer active:scale-95"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Launch Bespoke Customizer</span>
            </button>
          </div>
        </div>

        {/* 4-Column Product Grid */}
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
            {trunkProducts.map((product) => (
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
        </div>

        {/* Bespoke Customisation Pillars */}
        <section className="pt-8 border-t border-stone-200/80 space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-xl sm:text-2xl font-serif text-stone-900 font-normal">
              The Bespoke Personalisation Atelier
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 font-sans max-w-lg mx-auto">
              Every Kurma gift box can be customized for VIP clients, weddings, and generational milestones.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {bespokeFeatures.map((feat, i) => {
              const Icon = feat.icon;
              return (
                <div
                  key={i}
                  className="rounded-xl border border-stone-200/80 bg-white p-5 flex flex-col justify-between space-y-3 shadow-2xs hover:shadow-md transition-shadow"
                >
                  <div className="w-9 h-9 rounded-full bg-stone-100 flex items-center justify-center text-stone-800">
                    <Icon className="w-4 h-4 stroke-[1.75]" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-serif text-sm font-semibold text-stone-900">
                      {feat.title}
                    </h3>
                    <p className="text-xs text-stone-600 font-sans leading-relaxed">
                      {feat.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
