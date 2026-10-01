"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Plus, Check, SlidersHorizontal, Bookmark, ChevronLeft, ChevronRight, Play, Pause, Volume2, VolumeX, Sparkles, Flame, RotateCcw, Sun, CheckCircle2 } from "lucide-react";
import { PRODUCTS, ProductSKU, formatPrice, createCartItemId } from "@/lib/products";
import { CartItem } from "@/components/cart/cart-drawer";

interface ProductShowcaseProps {
  onAddToCart: (item: CartItem) => void;
  onCustomizeProduct: (product: ProductSKU) => void;
}

export type PurchasingMode = "direct" | "custom";

// Helper to format clean, elegant titles
export const getCleanTitle = (product: ProductSKU) => {
  switch (product.id) {
    case "marble-gift-box":
      return "Elements in Harmony Marble Gift Box";
    case "mdf-gift-box":
      return "Kurma MDF Keepsake Gift Box";
    case "5-elements-suite":
      return "5 Elements Complete Fragrance Suite";
    case "empty-marble-box":
      return "Artisanal Empty Green Marble Box";
    case "turtle-incense-holder":
      return "Solid Brass Turtle Holder";
    case "medallion":
      return "Keepsake Brass Medallion";
    case "pashmina-pocket-square":
      return "Pashmina Pocket Square";
    case "bookmark":
      return "Textured Silk Tassel Bookmark";
    default:
      return product.name.replace(/\s*\([^)]*\)/g, "").trim();
  }
};

// E-commerce pill badge matching the reference design
export const getProductBadge = (id: string): { label: string; color: string } | null => {
  switch (id) {
    // 4 Flagship Initial Products
    case "marble-gift-box":
      return { label: "Flagship Suite", color: "bg-[#7a1532]" };
    case "mdf-gift-box":
      return { label: "Artisanal Wood", color: "bg-[#7a1532]" };
    case "5-elements-suite":
      return { label: "Complete Suite", color: "bg-[#5b2273]" };
    case "empty-marble-box":
      return { label: "Heirloom Keepsake", color: "bg-[#7a1532]" };

    // Fragrances
    case "fragrance-earth":
      return { label: "Bestseller", color: "bg-[#7a1532]" };
    case "fragrance-water":
      return { label: "100% Charcoal-Free", color: "bg-[#7a1532]" };
    case "fragrance-fire":
      return { label: "Pure Resins", color: "bg-[#7a1532]" };
    case "fragrance-air":
      return { label: "Handcrafted Devotion", color: "bg-[#7a1532]" };
    case "fragrance-space":
      return { label: "Rare Oudh", color: "bg-[#5b2273]" };

    // Accessories
    case "turtle-incense-holder":
      return { label: "Pure Solid Brass", color: "bg-[#7a1532]" };
    case "medallion":
      return { label: "Keepsake Talisman", color: "bg-[#5b2273]" };
    case "pashmina-pocket-square":
      return { label: "Pure Pashmina", color: "bg-[#7a1532]" };
    case "bookmark":
      return { label: "Silk Tassel", color: "bg-[#7a1532]" };
    default:
      return null;
  }
};

export const getDiscountPercent = (price: number, originalPrice?: number) => {
  if (!originalPrice || originalPrice <= price) return null;
  return Math.round(((originalPrice - price) / originalPrice) * 100);
};

export interface ProductCardItemProps {
  product: ProductSKU;
  activeMode?: PurchasingMode;
  addedId: string | null;
  onQuickAdd: (product: ProductSKU) => void;
  onCustomize: (product: ProductSKU) => void;
  badge?: { label: string; color: string } | null;
  discount?: number | null;
  cleanTitle: string;
  variant?: "dark" | "light" | "minimal";
  theme?: "light" | "dark";
  aspectRatio?: "square" | "landscape" | "portrait";
  imagePadding?: string;
  imageScale?: string;
  containerAspect?: string;
  objectFit?: string;
}

export function ProductCardItem({
  product,
  activeMode = "direct",
  addedId,
  onQuickAdd,
  onCustomize,
  badge,
  discount,
  cleanTitle,
  variant = "minimal",
  theme,
  aspectRatio,
  imagePadding,
  imageScale,
  containerAspect,
  objectFit,
}: ProductCardItemProps) {
  const router = useRouter();
  const isDark = theme ? theme === "dark" : variant === "dark";
  const primarySrc = product.image ? `${product.image}?v=4` : "/images/product/image9.png";
  const [activeImgIdx, setActiveImgIdx] = useState(0);
  const [isSaved, setIsSaved] = useState(false);

  const images = useMemo(() => {
    const list: string[] = [];
    if (product.image) list.push(product.image);
    if (product.gallery && product.gallery.length > 0) {
      product.gallery.forEach((img) => {
        if (!list.includes(img)) list.push(img);
      });
    }
    return list.length > 0 ? list : ["/images/product/image9.png"];
  }, [product]);

  const handleCardClick = () => {
    router.push(`/products/${product.id}`);
  };

  const currentDisplayImg = images[activeImgIdx] || primarySrc;

  return (
    <div
      onClick={handleCardClick}
      className="group relative flex flex-col cursor-pointer select-none transition-transform duration-300"
    >
      {/* Modern Image Canvas */}
      <div
        className={`relative w-full ${containerAspect || "aspect-[3/4]"} overflow-hidden rounded-xl shadow-2xs flex items-center justify-center ${
          isDark ? "bg-[#061e11]" : "bg-[#f5f3ec]"
        }`}
      >
        <Image
          src={currentDisplayImg}
          alt={product.name}
          fill
          unoptimized
          className={`w-full h-full ${objectFit || "object-cover object-center"} transition-transform duration-500 ease-out drop-shadow-sm ${
            imagePadding !== undefined ? imagePadding : "p-0"
          } ${
            imageScale || "group-hover:scale-108"
          }`}
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />

        {/* Bookmark Ribbon Icon in Top-Right Corner */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsSaved(!isSaved);
          }}
          title={isSaved ? "Saved to Wishlist" : "Save to Wishlist"}
          aria-label={isSaved ? "Saved to Wishlist" : "Save to Wishlist"}
          className="absolute top-3.5 right-3.5 z-10 p-1 text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)] transition-transform active:scale-90 hover:scale-110 cursor-pointer"
        >
          <Bookmark
            className={`w-4 h-4 transition-colors ${
              isSaved
                ? "fill-white text-white stroke-[2]"
                : "fill-transparent text-white stroke-[2]"
            }`}
          />
        </button>

        {/* Previous & Next Carousel Navigation Arrows (visible on hover) */}
        {images.length > 1 && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setActiveImgIdx((prev) => (prev - 1 + images.length) % images.length);
              }}
              title="Previous image"
              aria-label="Previous image"
              className="absolute left-2.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 backdrop-blur-xs z-10 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4 stroke-[2.2]" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setActiveImgIdx((prev) => (prev + 1) % images.length);
              }}
              title="Next image"
              aria-label="Next image"
              className="absolute right-2.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 backdrop-blur-xs z-10 cursor-pointer"
            >
              <ChevronRight className="w-4 h-4 stroke-[2.2]" />
            </button>
          </>
        )}

        {/* Slide Indicator Dots at Bottom Center */}
        {images.length > 1 && (
          <div className="absolute bottom-3 inset-x-0 flex items-center justify-center gap-1.5 z-10 pointer-events-none">
            {images.map((_, idx) => (
              <span
                key={idx}
                className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                  idx === activeImgIdx
                    ? isDark ? "bg-white scale-125 shadow-xs" : "bg-stone-800 scale-125 shadow-xs"
                    : isDark ? "bg-white/40" : "bg-stone-400/50"
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Minimalist Info Row Directly Beneath Image */}
      <div className="mt-2.5 flex items-start justify-between gap-2 px-0.5">
        <div className="space-y-0.5 min-w-0 flex-1">
          <h3
            className={`text-xs sm:text-[13px] font-medium tracking-tight leading-snug truncate transition-colors ${
              isDark
                ? "text-[#fdfcf9] group-hover:text-[#eed08e]"
                : "text-stone-900 group-hover:text-stone-600"
            }`}
          >
            {cleanTitle}
          </h3>
          <div className="flex items-center gap-1.5">
            <span
              className={`text-xs sm:text-[12.5px] font-medium ${
                isDark ? "text-[#eed08e]" : "text-stone-700"
              }`}
            >
              RS. {product.price.toLocaleString("en-IN")}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span
                className={`text-[11px] line-through ${
                  isDark ? "text-stone-400/80" : "text-stone-400"
                }`}
              >
                RS. {product.originalPrice.toLocaleString("en-IN")}
              </span>
            )}
          </div>
        </div>

        {/* Action Buttons on Far Right */}
        <div className="flex items-center gap-1 shrink-0">
          {product.customizationFields && product.customizationFields.length > 0 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                router.push(`/products/${product.id}`);
              }}
              title={`Customise & Buy ${product.name}`}
              aria-label={`Customise & Buy ${product.name}`}
              className={`p-1 rounded-md transition-all duration-200 hover:scale-110 cursor-pointer ${
                isDark
                  ? "text-[#eed08e] hover:text-white hover:bg-white/10"
                  : "text-[#c0881b] hover:text-stone-900 hover:bg-stone-100"
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5 stroke-[1.8]" />
            </button>
          )}

          <button
            onClick={(e) => {
              e.stopPropagation();
              onQuickAdd(product);
            }}
            title={`Quick add ${product.name} to cart`}
            aria-label={`Quick add ${product.name} to cart`}
            className={`p-1 rounded-md transition-all duration-200 hover:scale-110 cursor-pointer ${
              isDark
                ? "text-stone-300 hover:text-white hover:bg-white/10"
                : "text-stone-800 hover:text-black hover:bg-stone-100"
            }`}
          >
            {addedId === product.id ? (
              <Check
                className={`w-3.5 h-3.5 stroke-[2.5] ${
                  isDark ? "text-emerald-400" : "text-emerald-600"
                }`}
              />
            ) : (
              <Plus className="w-3.5 h-3.5 stroke-[1.8]" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export function ProductShowcase({
  onAddToCart,
  onCustomizeProduct,
}: ProductShowcaseProps) {
  const [activeMode, setActiveMode] = useState<PurchasingMode>("direct");
  const [addedId, setAddedId] = useState<string | null>(null);

  // 1. The Four Initial Flagship Products (Gift Boxes & Complete Suites)
  const initialGiftBoxes = [
    PRODUCTS.find((p) => p.id === "marble-gift-box"),
    PRODUCTS.find((p) => p.id === "mdf-gift-box"),
    PRODUCTS.find((p) => p.id === "5-elements-suite"),
    PRODUCTS.find((p) => p.id === "empty-marble-box"),
  ].filter(Boolean) as ProductSKU[];

  // 2. 5 Individual Fragrance Boxes (Single Products)
  const singleFragrances = PRODUCTS.filter((p) => p.category === "Fragrances");

  // 3. 4 Sacred Accessories (Single Products)
  const singleAccessories = PRODUCTS.filter((p) => p.category === "Sacred Accessories");

  const handleQuickAdd = (product: ProductSKU) => {
    onAddToCart({
      id: createCartItemId(product.id),
      skuId: product.id,
      name: product.name,
      price: product.price,
      priceDisplay: formatPrice(product.price),
      image: product.image,
      quantity: 1,
    });
    setAddedId(product.id);
    setTimeout(() => setAddedId(null), 1400);
  };

  return (
    <div className="w-full bg-[#072515] bg-[url('/images/textures/green-texture.png')] bg-repeat py-12 sm:py-16 text-white">
      <div className="w-full px-4 sm:px-6 lg:px-12 xl:px-16 space-y-12 lg:space-y-16">
        {/* SECTION 1: Our Four Initial Products */}
        <section className="space-y-7">
          {/* Section Header */}
          <div className="text-center space-y-2.5 max-w-3xl mx-auto">
            <h2 className="text-2xl sm:text-3xl lg:text-[32px] font-serif text-white font-normal">
              Our Four Initial Products
            </h2>

            {/* Delicate Gold Diamond Divider */}
            <div className="flex items-center justify-center gap-3 pt-0.5">
              <div className="h-px w-16 bg-[#eed08e]" />
              <div className="w-2.5 h-2.5 rotate-45 border border-[#eed08e] bg-[#072515] flex items-center justify-center">
                <div className="w-1 h-1 bg-[#eed08e]" />
              </div>
              <div className="h-px w-16 bg-[#eed08e]" />
            </div>

            <p className="text-stone-300 text-xs sm:text-sm max-w-xl mx-auto">
              Ready-to-ship luxury gift boxes and fragrance suites. Click (+) to add directly to your sacred cart.
            </p>
          </div>

          {/* 4 Flagship Initial Products Grid (Full width, 4 columns on desktop) */}
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-5 lg:gap-6 w-full">
            {initialGiftBoxes.map((product) => (
              <ProductCardItem
                key={product.id}
                product={product}
                activeMode={activeMode}
                addedId={addedId}
                onQuickAdd={handleQuickAdd}
                onCustomize={onCustomizeProduct}
                badge={getProductBadge(product.id)}
                discount={getDiscountPercent(product.price, product.originalPrice)}
                cleanTitle={getCleanTitle(product)}
                variant="minimal"
                theme="dark"
                imagePadding="p-0"
                imageScale="scale-[1.02] group-hover:scale-110"
                containerAspect="aspect-[3/4] sm:aspect-[3/4]"
                objectFit="object-cover object-center"
              />
            ))}
          </div>
        </section>

        {/* SECTION 2: Sacred Agarbatti & Incense Collection */}
        <section className="space-y-6 pt-4 border-t border-[#eed08e]/15">
          <div className="flex items-center justify-between border-b border-[#eed08e]/20 pb-3">
            <div>
              <h3 className="text-lg sm:text-xl font-serif text-white font-normal">
                Sacred Agarbatti &amp; Incense Rituals
              </h3>
              <p className="text-xs text-stone-300 mt-0.5">
                100% Charcoal-free elemental incense boxes &amp; solid brass turtle burners
              </p>
            </div>
            <span className="text-xs text-[#eed08e] font-semibold hidden sm:inline">
              Pure Essential Aromas
            </span>
          </div>

          {/* 4 Distinct Agarbatti Products Grid (Full width, 4 columns) */}
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-5 lg:gap-6 w-full">
            {[
              {
                ...PRODUCTS.find((p) => p.id === "5-elements-suite")!,
                image: "/images/product/image7.png",
              },
              {
                ...PRODUCTS.find((p) => p.id === "turtle-incense-holder")!,
                image: "/images/product/image8.png",
              },
              {
                ...PRODUCTS.find((p) => p.id === "fragrance-earth")!,
                image: "/images/product/earth-front.png",
              },
              {
                ...PRODUCTS.find((p) => p.id === "fragrance-fire")!,
                image: "/images/product/fire-front.png",
              },
            ].map((product) => (
              <ProductCardItem
                key={product.id}
                product={product}
                activeMode={activeMode}
                addedId={addedId}
                onQuickAdd={handleQuickAdd}
                onCustomize={onCustomizeProduct}
                badge={getProductBadge(product.id)}
                discount={getDiscountPercent(product.price, product.originalPrice)}
                cleanTitle={getCleanTitle(product)}
                variant="minimal"
                theme="dark"
                imagePadding="p-0"
                imageScale="scale-[1.02] group-hover:scale-110"
                containerAspect="aspect-[3/4] sm:aspect-[3/4]"
                objectFit="object-cover object-center"
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

