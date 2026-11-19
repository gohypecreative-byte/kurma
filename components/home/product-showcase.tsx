"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ShoppingCart, Plus, Check, ChevronLeft, ChevronRight, Play, Pause, Volume2, VolumeX, Flame, RotateCcw, Sun, CheckCircle2, Heart } from "lucide-react";
import { PRODUCTS, ProductSKU, formatPrice, createCartItemId } from "@/lib/products";
import { useProducts } from "@/lib/products-context";
import { useWishlist } from "@/lib/wishlist-context";
import { AnimatedWords } from "@/components/ui/animated-text";
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
      return { label: "Flagship Suite", color: "bg-[#28513B] text-[#E8D9AE] border border-[#C5A45B]/40" };
    case "mdf-gift-box":
      return { label: "Artisanal Wood", color: "bg-[#28513B] text-[#E8D9AE] border border-[#C5A45B]/40" };
    case "5-elements-suite":
      return { label: "Complete Suite", color: "bg-[#C5A45B] text-[#092B20] font-bold" };
    case "empty-marble-box":
      return { label: "Heirloom Keepsake", color: "bg-[#28513B] text-[#E8D9AE] border border-[#C5A45B]/40" };

    // Fragrances
    case "fragrance-earth":
      return { label: "Bestseller", color: "bg-[#C5A45B] text-[#092B20] font-bold" };
    case "fragrance-water":
      return { label: "100% Charcoal-Free", color: "bg-[#28513B] text-[#E8D9AE] border border-[#C5A45B]/40" };
    case "fragrance-fire":
      return { label: "Pure Resins", color: "bg-[#28513B] text-[#E8D9AE] border border-[#C5A45B]/40" };
    case "fragrance-air":
      return { label: "Handcrafted Devotion", color: "bg-[#28513B] text-[#E8D9AE] border border-[#C5A45B]/40" };
    case "fragrance-space":
      return { label: "Rare Oudh", color: "bg-[#C5A45B] text-[#092B20] font-bold" };
    case "fragrance-sandalwood":
      return { label: "Royal Chandan", color: "bg-[#28513B] text-[#E8D9AE] border border-[#C5A45B]/40" };
    case "fragrance-temple-flora":
      return { label: "Temple Flora", color: "bg-[#28513B] text-[#E8D9AE] border border-[#C5A45B]/40" };
    case "fragrance-royal-oudh":
      return { label: "Imperial Oudh", color: "bg-[#C5A45B] text-[#092B20] font-bold" };

    // Accessories
    case "turtle-incense-holder":
      return { label: "Pure Solid Brass", color: "bg-[#C5A45B] text-[#092B20] font-bold" };
    case "medallion":
      return { label: "Keepsake Talisman", color: "bg-[#28513B] text-[#E8D9AE] border border-[#C5A45B]/40" };
    case "pashmina-pocket-square":
      return { label: "Pure Pashmina", color: "bg-[#28513B] text-[#E8D9AE] border border-[#C5A45B]/40" };
    case "bookmark":
      return { label: "Silk Tassel", color: "bg-[#28513B] text-[#E8D9AE] border border-[#C5A45B]/40" };
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
  cardBg?: string;
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
  cardBg,
}: ProductCardItemProps) {
  const router = useRouter();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const isWishlisted = isInWishlist(product.id);
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
  const isLightCard =
    Boolean(cardBg?.includes("bg-white")) ||
    (!cardBg && !isDark) ||
    product.id === "fragrance-air" ||
    product.id === "fragrance-temple-flora";

  return (
    <div
      onClick={handleCardClick}
      className="group relative flex flex-col cursor-pointer select-none transition-transform duration-300"
    >
      {/* Modern Image Canvas */}
      <div
        className={`relative w-full ${containerAspect || "aspect-[3/4]"} overflow-hidden rounded-lg sm:rounded-2xl flex items-center justify-center ${
          cardBg || (isDark ? "bg-[#092B20] border border-[#28513B]/50 shadow-md" : "bg-[#FAF7F2] border border-[#DDD3C2] shadow-sm hover:shadow-md transition-shadow")
        }`}
      >
        <Image
          src={currentDisplayImg}
          alt={product.name}
          fill
          loading="lazy"
          className={`absolute inset-0 w-full h-full ${objectFit || "object-contain object-center"
            } transition-transform duration-500 ease-out ${imagePadding !== undefined ? imagePadding : "p-2 sm:p-2.5"
            } ${imageScale || "group-hover:scale-100"
            }`}
          style={{
            objectFit: (objectFit?.includes("cover") ? "cover" : "contain") as any,
            objectPosition: "center",
          }}
          sizes="(max-width: 640px) 48vw, (max-width: 1024px) 33vw, 25vw"
        />

        {/* Wishlist Heart Button on Upper Right */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist({
              id: product.id,
              name: product.name,
              price: product.price,
              priceDisplay: `RS. ${product.price.toLocaleString("en-IN")}`,
              image: currentDisplayImg,
              skuId: product.id,
            });
          }}
          title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
          className="group/btn absolute top-2.5 right-2.5 z-20 p-1 sm:p-1.5 flex items-center justify-center transition-all duration-300 active:scale-90 cursor-pointer bg-transparent border-none text-white hover:scale-110"
        >
          <Heart
            className={`w-4.5 h-4.5 sm:w-5 sm:h-5 transition-all duration-300 stroke-white stroke-[2.2] drop-shadow-[0_1px_4px_rgba(0,0,0,0.85)] ${isWishlisted
              ? "fill-white text-white scale-110 drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]"
              : "fill-transparent text-white group-hover/btn:scale-110"
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
                className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${idx === activeImgIdx
                  ? isLightCard
                    ? "bg-stone-800 scale-125 shadow-xs"
                    : "bg-[#C5A45B] scale-125 shadow-xs"
                  : isLightCard
                    ? "bg-stone-400/50"
                    : "bg-[#28513B]"
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
            className={`font-serif text-xs sm:text-[13px] font-medium tracking-tight leading-snug truncate transition-colors ${isDark
              ? "text-[#fdfcf9] group-hover:text-[#C5A45B]"
              : "text-stone-900 group-hover:text-stone-600"
              }`}
          >
            {cleanTitle}
          </h3>
          <div className="flex items-center gap-1.5 font-sans">
            <span
              className={`text-xs sm:text-[12.5px] font-medium ${isDark ? "text-[#C5A45B]" : "text-stone-700"
                }`}
            >
              RS. {product.price.toLocaleString("en-IN")}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span
                className={`text-[11px] line-through ${isDark ? "text-[#E8D9AE]/60" : "text-stone-400"
                  }`}
              >
                RS. {product.originalPrice.toLocaleString("en-IN")}
              </span>
            )}
          </div>
        </div>

        {/* Action Buttons on Far Right */}
        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onQuickAdd(product);
            }}
            title={`Quick add ${product.name} to cart`}
            aria-label={`Quick add ${product.name} to cart`}
            className={`p-1.5 sm:p-1 min-w-[28px] min-h-[28px] flex items-center justify-center rounded-md transition-all duration-200 hover:scale-110 active:scale-95 cursor-pointer touch-manipulation ${isDark
              ? "text-[#E8D9AE] hover:text-[#C5A45B] hover:bg-[#28513B]/30"
              : "text-stone-800 hover:text-black hover:bg-stone-100"
              }`}
          >
            {addedId === product.id ? (
              <Check
                className={`w-3.5 h-3.5 stroke-[2.5] ${isDark ? "text-[#C5A45B]" : "text-[#7A5A28]"
                  }`}
              />
            ) : (
              <ShoppingCart className="w-3.5 h-3.5 stroke-[1.8]" />
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
  const { products, getProduct } = useProducts();

  // 1. The Four Initial Flagship Products (Gift Boxes & Complete Suites) with Live DB Sync
  const initialGiftBoxes = useMemo(() => {
    const defaultIds = [
      {
        id: "marble-gift-box",
        img: "/images/product/initial-box-marble.jpg",
        gal: ["/images/product/initial-box-marble.jpg", "/images/product/image8.png"],
      },
      {
        id: "mdf-gift-box",
        img: "/images/product/initial-box-mdf.jpg",
        gal: ["/images/product/initial-box-mdf.jpg", "/images/product/image.png"],
      },
      {
        id: "5-elements-suite",
        img: "/images/product/initial-box-suite.jpg",
        gal: ["/images/product/initial-box-suite.jpg", "/images/product/image7.png"],
      },
      {
        id: "empty-marble-box",
        img: "/images/product/initial-box-empty-marble.jpg",
        gal: ["/images/product/initial-box-empty-marble.jpg", "/images/product/image9.png"],
      },
    ];

    const list: ProductSKU[] = [];
    for (const item of defaultIds) {
      const live = getProduct(item.id) || PRODUCTS.find((p) => p.id === item.id);
      if (live) {
        list.push({
          ...live,
          image: item.img,
          gallery: item.gal,
        });
      }
    }
    // Any additional newly created Gift Boxes
    const extraBoxes = products.filter(
      (p) => p.category === "Gift Boxes" && !defaultIds.some((d) => d.id === p.id)
    );
    return [...list, ...extraBoxes];
  }, [products, getProduct]);

  // 2. Individual Fragrance Boxes (Single Products from live DB)
  const singleFragrances = useMemo(() => {
    return products.filter((p) => p.category === "Fragrances");
  }, [products]);

  // 3. Sacred Accessories (Single Products from live DB)
  const singleAccessories = useMemo(() => {
    return products.filter((p) => p.category === "Sacred Accessories");
  }, [products]);

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
    <div className="w-full">
      {/* SECTION 1: Our Four Initial Products */}
      <section
        id="our-initial-products"
        className="w-full bg-[#123D2D] py-8 sm:py-12 lg:py-16 text-[#E8D9AE] border-t border-b border-[#28513B]/40 flex flex-col justify-center overflow-hidden"
      >
        <div className="w-full max-w-[1520px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 space-y-4 sm:space-y-6">
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto">
            <AnimatedWords
              text="Our Four Initial Products"
              as="h2"
              className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-medium tracking-tight leading-tight text-[#E8D9AE] justify-center"
            />
          </div>

          {/* 4 Flagship Initial Products Grid (Independent 4-column layout) */}
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 lg:gap-5 w-full">
            {initialGiftBoxes.map((product) => (
              <ProductCardItem
                key={`initial-box-${product.id}`}
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
                imageScale="group-hover:scale-100"
                containerAspect="aspect-[3/4]"
                objectFit="object-cover object-center"
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

