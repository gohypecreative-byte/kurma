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
  const giftBoxes = useMemo(() => {
    const list = products.filter((p) => p.category === "Gift Boxes");
    const imageOverrides: Record<string, string> = {
      "marble-gift-box": "/images/product/initial-box-marble.jpg",
      "mdf-gift-box": "/images/product/initial-box-mdf.jpg",
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
  const fragrances = useMemo(() => {
    const list = products.filter((p) => p.category === "Fragrances");
    const fragranceImageOverrides: Record<string, string> = {
      "fragrance-earth": "/images/product/fragrance-earth.jpg",
      "fragrance-water": "/images/product/fragrance-water.jpg",
      "fragrance-fire": "/images/product/fragrance-fire.jpg",
      "fragrance-air": "/images/product/fragrance-air.jpg",
      "fragrance-space": "/images/product/fragrance-space.jpg",
      "fragrance-sandalwood": "/images/product/fragrance-sandalwood.jpg",
      "fragrance-temple-flora": "/images/product/fragrance-temple-flora.jpg",
      "fragrance-royal-oudh": "/images/product/fragrance-royal-oudh.jpg",
    };
    return list.map((p) => {
      if (fragranceImageOverrides[p.id]) {
        return {
          ...p,
          image: fragranceImageOverrides[p.id],
          gallery: [
            fragranceImageOverrides[p.id],
            ...(p.gallery?.filter((g) => g !== fragranceImageOverrides[p.id]) || []),
          ],
        };
      }
      return p;
    });
  }, [products]);
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

      {/* 1. DISTINCT LUXURY EDITORIAL SHOP BANNER - Custom Product Suite Collection */}
      <section className="relative w-full h-[34vh] sm:h-[56vh] lg:h-[64vh] min-h-[240px] sm:min-h-[440px] max-h-[640px] bg-[#EDE1D1] border-b border-[#DDD3C2] overflow-hidden flex items-center select-none">
        {/* Full-Bleed End-to-End Background Image */}
        <div className="absolute inset-0 w-full h-full pointer-events-none">
          <Image
            src="/images/shop/shop-hero-banner-redesign.jpg"
            alt="Kurma Sacred Collection: Heirloom Walnut Keepsake Trunk, 5 Elements Incense Suites, Green-Veined Marble Box, Solid Brass Turtle Burner, Medallion and Mysore Sandalwood"
            fill
            priority
            className="object-cover object-center"
            sizes="100vw"
          />
        </div>
      </section>

      {/* Main Content Area - Luxury Dark Green Section */}
      <main className="flex-1 w-full bg-[#123D2D] border-t border-b border-[#28513B]/40 text-[#E8D9AE] py-8 sm:py-14 lg:py-16 px-3 min-[400px]:px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
        <div className="w-full max-w-[1520px] mx-auto space-y-10 sm:space-y-12">
          {/* UNIFIED SECTION: SHOP ALL PRODUCTS */}
          <section className="space-y-8 sm:space-y-10">
            <div className="relative text-center border-b border-[#28513B]/40 pb-5 max-w-2xl mx-auto">
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-[40px] font-serif text-[#E8D9AE] font-normal tracking-tight text-center">
                Shop All Products
              </h2>
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
                  theme="dark"
                  containerAspect="aspect-[3/4]"
                  objectFit="object-cover object-center"
                  imagePadding="p-0"
                  imageScale="group-hover:scale-100"
                  cardBg="bg-[#092B20] border border-[#28513B]/60 shadow-md"
                />
              ))}

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
                  theme="dark"
                  containerAspect="aspect-[3/4]"
                  objectFit="object-cover object-center"
                  imagePadding="p-0"
                  imageScale="group-hover:scale-100"
                  cardBg="bg-[#092B20] border border-[#28513B]/60 shadow-md"
                />
              ))}
            </div>
          </section>
        </div>
      </main>

      {/* Spacer gap before Footer */}
      <div className="w-full h-8 sm:h-12 lg:h-14 bg-[#FAF8F5]" />

      {/* Footer */}
      <Footer />
    </div>
  );
}
