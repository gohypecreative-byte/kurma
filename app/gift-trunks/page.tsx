"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
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
import { ShieldCheck, Crown, Feather, PenTool, Check } from "lucide-react";

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

  const { products } = useProducts();

  // Gift Trunks & Suites synchronized with Neon database and curated portrait images
  const trunkProducts = useMemo(() => {
    const list = products.filter((p) => p.category === "Gift Boxes");
    const imageOverrides: Record<string, string> = {
      "mdf-gift-box": "/images/product/initial-box-mdf.jpg",
      "marble-gift-box": "/images/product/initial-box-marble.jpg",
      "5-elements-suite": "/images/product/initial-box-suite.jpg",
      "empty-marble-box": "/images/product/initial-box-empty-marble.jpg",
    };
    return list.map((p) => {
      if (imageOverrides[p.id]) {
        return {
          ...p,
          image: imageOverrides[p.id],
          gallery: [
            imageOverrides[p.id],
            ...(p.gallery?.filter((g) => g !== imageOverrides[p.id]) || []),
          ],
        };
      }
      return p;
    });
  }, [products]);

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
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-stone-900 selection:bg-[#eed08e] selection:text-[#1C1B18]">
      <Navbar cartCount={cartCount} onOpenCart={() => setIsCartOpen(true)} />

      <main className="flex-1 w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 py-8 sm:py-10 space-y-12 sm:space-y-16">
        {/* Minimalist Editorial Header */}
        <div className="pt-1 pb-2 max-w-4xl mx-auto text-center">
          <h1 className="text-2xl sm:text-4xl font-serif text-stone-900 font-normal tracking-tight">
            Curated Heirloom Trunks &amp; Gift Suites
          </h1>
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
                containerAspect="aspect-[3/4]"
                objectFit="object-cover object-center"
                imagePadding="p-0"
                cardBg="bg-white border border-[#DDD3C2] shadow-sm hover:shadow-md transition-shadow"
              />
            ))}
          </div>
        </div>

        {/* Bespoke Customisation Pillars */}
        <section className="pt-8 border-t border-stone-200/80 space-y-8">
          <div className="text-center">
            <h2 className="text-xl sm:text-2xl font-serif text-stone-900 font-normal">
              The Bespoke Personalisation Atelier
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {bespokeFeatures.map((feat, i) => {
              const Icon = feat.icon;
              return (
                <div
                  key={i}
                  className="rounded-xl border border-stone-200/80 bg-white p-5 space-y-3 shadow-2xs hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-stone-100 flex items-center justify-center text-stone-800 shrink-0">
                      <Icon className="w-4 h-4 stroke-[1.75]" />
                    </div>
                    <h3 className="font-serif text-sm font-semibold text-stone-900 leading-snug">
                      {feat.title}
                    </h3>
                  </div>
                  <p className="text-xs text-stone-600 font-sans leading-relaxed">
                    {feat.desc}
                  </p>
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
