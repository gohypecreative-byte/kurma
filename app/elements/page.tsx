"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { useCart } from "@/lib/cart-context";
import {
  Mountain,
  Droplets,
  Flame,
  Wind,
  Compass,
} from "lucide-react";
import {
  getProductById,
  ProductSKU,
  PRODUCTS,
} from "@/lib/products";
import {
  ProductCardItem,
  getCleanTitle,
  getProductBadge,
  getDiscountPercent,
} from "@/components/home/product-showcase";

// The 5 Elements products + related complete suites
const ELEMENT_PRODUCT_IDS = [
  "5-elements-suite",
  "fragrance-earth",
  "fragrance-water",
  "fragrance-fire",
  "fragrance-air",
  "fragrance-space",
  "marble-gift-box",
];

const ELEMENT_PHILOSOPHY = [
  {
    key: "Earth" as const,
    name: "Prithvi (Earth)",
    icon: Mountain,
    tagline: "Ground • Nourish • Belong",
    time: "Brahma Muhurta & Dawn",
    notes: "Sacred Vetiver (Khus), Warm Indian Sandalwood, Forest Moss",
    intention: "Grounding erratic energy, root chakra awakening, deep calm & stability.",
  },
  {
    key: "Water" as const,
    name: "Jal (Water)",
    icon: Droplets,
    tagline: "Flow • Purify • Renew",
    time: "Morning Ablution & Midday",
    notes: "Sacred Blue Lotus, Crisp Rain Accord, Himalayan Golden Amber",
    intention: "Emotional cleansing, releasing mental blockages, fluidity & creative receptivity.",
  },
  {
    key: "Fire" as const,
    name: "Agni (Fire)",
    icon: Flame,
    tagline: "Transform • Clarify • Ascend",
    time: "Twilight Sandhya & Dusk",
    notes: "Golden Ceylon Clove, Cassia Bark, Sacred Smoked Dammar Resin",
    intention: "Purification of stagnant prana, mental focus, ignition of divine courage.",
  },
  {
    key: "Air" as const,
    name: "Vayu (Air)",
    icon: Wind,
    tagline: "Elevate • Expand • Breathe",
    time: "Pranayama & Afternoon",
    notes: "Desi Gulab Petals, Temple Camphor, Crisp Himalayan Morning Dew",
    intention: "Heart chakra opening, expansiveness, freedom from anxiety & mental fatigue.",
  },
  {
    key: "Space" as const,
    name: "Akasha (Space / Ether)",
    icon: Compass,
    tagline: "Transcend • Stillness • Awaken",
    time: "Deep Night Meditation & Solitude",
    notes: "Rare Wild Oudh (Agarwood), Frankincense (Loban), Somalian Myrrh",
    intention: "Connection to the cosmic void, crown chakra stillness, deep transcendent awareness.",
  },
];

export default function ElementsPage() {
  const router = useRouter();
  const { cartCount, setIsCartOpen, quickAddToCart } = useCart();
  const [addedId, setAddedId] = useState<string | null>(null);

  // Retrieve products in exact order
  const elementProducts = ELEMENT_PRODUCT_IDS.map((id) => getProductById(id)).filter(
    Boolean
  ) as ProductSKU[];

  const handleQuickAdd = (product: ProductSKU) => {
    quickAddToCart(product);
    setAddedId(product.id);
    setTimeout(() => setAddedId(null), 1400);
  };

  const handleCustomize = (product: ProductSKU) => {
    router.push(`/products/${product.id}`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-stone-900 selection:bg-[#eed08e] selection:text-[#072515]">
      {/* Top Navbar */}
      <Navbar cartCount={cartCount} onOpenCart={() => setIsCartOpen(true)} />

      <main className="flex-1 w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 py-8 sm:py-12 space-y-12 sm:space-y-16">
        {/* Minimalist Editorial Header */}
        <div className="space-y-3 pt-1 pb-2 max-w-4xl mx-auto text-center">
          <span className="text-[11px] font-cinzel uppercase tracking-[0.25em] text-[#8b5f10] font-bold">
            Pancha Mahabhuta Collection
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-stone-900 font-normal tracking-tight">
            The 5 Sacred Elements
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 font-sans max-w-xl mx-auto leading-relaxed">
            In Vedic wisdom, the Pancha Mahabhuta govern all existence. Pure charcoal-free botanicals formulated to harmonize prana across your sacred space.
          </p>
        </div>

        {/* PRODUCTS GRID (End-to-End Home Page Card Style) */}
        <div className="w-full">
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6 w-full">
            {elementProducts.map((product) => (
              <ProductCardItem
                key={product.id}
                product={product}
                activeMode="custom"
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

        {/* Pancha Mahabhuta Ritual & Botanical Chart */}
        <section className="pt-8 border-t border-stone-200/80 space-y-8 w-full">
          <div className="text-center space-y-2">
            <h2 className="text-xl sm:text-2xl font-serif text-stone-900 font-normal">
              Elemental Wisdom &amp; Burning Hours
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 font-sans max-w-lg mx-auto">
              Align your daily ritual with the natural rhythmic cycles of day, night, and consciousness.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-5">
            {ELEMENT_PHILOSOPHY.map((el) => {
              const Icon = el.icon;
              return (
                <div
                  key={el.key}
                  className="rounded-xl border border-stone-200/80 bg-white p-5 flex flex-col justify-between space-y-4 shadow-2xs hover:shadow-md transition-shadow"
                >
                  <div className="space-y-2.5">
                    <div className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center text-stone-700">
                      <Icon className="w-4 h-4 stroke-[1.75]" />
                    </div>
                    <div>
                      <h3 className="font-serif text-sm font-semibold text-stone-900">
                        {el.name}
                      </h3>
                      <p className="text-[11px] font-cinzel text-stone-400 tracking-wider uppercase mt-0.5">
                        {el.tagline}
                      </p>
                    </div>
                    <p className="text-xs text-stone-600 font-sans leading-relaxed">
                      {el.notes}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-stone-100 space-y-1.5 text-[11px]">
                    <div className="text-stone-400 uppercase tracking-wider font-cinzel text-[9.5px]">
                      Optimal Hour
                    </div>
                    <div className="text-stone-800 font-medium font-sans">
                      {el.time}
                    </div>
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
