"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import {
  Eye,
  Play,
  Pause,
  ChevronLeft,
  ChevronRight,
  ShoppingBag,
  Check,
  X,
  ArrowRight,
} from "lucide-react";
import { PRODUCTS, ProductSKU, getProductById, formatPrice } from "@/lib/products";
import { useCart } from "@/lib/cart-context";

export interface ShoppableReelItem {
  id: string;
  productId: string;
  title: string;
  shortSubtitle: string;
  category: "Gift Boxes" | "Fragrances" | "Sacred Accessories";
  price: number;
  originalPrice: number;
  discountBadge: string;
  posterImage: string;
  thumbnail: string;
  gallery: string[];
  views: string;
  hookText: string;
  badge: string;
  elementColor: string;
  ritualNotes: string;
}

// Curated 16 products grouped 4-per-page (Page 1: Bestsellers, Page 2: Elements 1-4, Page 3: Space & Royal, Page 4: Keepsakes)
const ORDERED_PRODUCT_IDS: string[] = [
  // Page 1: Top Bestsellers & Heirlooms (4 products)
  "turtle-incense-holder",
  "medallion",
  "5-elements-suite",
  "marble-gift-box",

  // Page 2: Sacred Elements (4 products)
  "fragrance-earth",
  "fragrance-water",
  "fragrance-fire",
  "fragrance-air",

  // Page 3: Space & Royal Fragrances (4 products)
  "fragrance-space",
  "fragrance-sandalwood",
  "fragrance-temple-flora",
  "fragrance-royal-oudh",

  // Page 4: Trunks & Accessories (4 products)
  "mdf-gift-box",
  "pashmina-pocket-square",
  "bookmark",
  "empty-marble-box",
];

const PRODUCT_METADATA: Record<
  string,
  {
    views: string;
    hookText: string;
    badge: string;
    elementColor: string;
    ritualNotes: string;
  }
> = {
  "turtle-incense-holder": {
    views: "4.4k",
    hookText: "Everyone's talking about this solid brass turtle burner... 🐢",
    badge: "Pure Solid Brass",
    elementColor: "#9e7420",
    ritualNotes: "Moradabad cast brass • Single-hole burner aperture • Weighted base",
  },
  "medallion": {
    views: "2.8k",
    hookText: "Engraved with Earth, Water, Fire, Air & Space talisman 🪙",
    badge: "Keepsake Talisman",
    elementColor: "#8a661c",
    ritualNotes: "Solid antique brass coin • 48mm diameter with milled perimeter",
  },
  "5-elements-suite": {
    views: "5.8k",
    hookText: "Unboxing the definitive Kurma ritual collection with 135 sticks ✨",
    badge: "Complete Suite",
    elementColor: "#b88628",
    ritualNotes: "100% Charcoal-free with certified pure natural resins across all 5 boxes",
  },
  "marble-gift-box": {
    views: "7.2k",
    hookText: "The definitive Kurma heirloom set in emerald-veined green marble trunk 🏛️",
    badge: "Flagship Suite",
    elementColor: "#0d5635",
    ritualNotes: "Complete 5 boxes, solid cast brass turtle burner, medallion & scroll",
  },
  "fragrance-earth": {
    views: "4.3k",
    hookText: "Warm woody blend of vetiver and cedarwood for grounded calm 🪵",
    badge: "Element: Earth",
    elementColor: "#946328",
    ritualNotes: "27 Handcrafted incense sticks • 55-65 mins burn time • Zero toxic smoke",
  },
  "fragrance-water": {
    views: "3.5k",
    hookText: "Sacred flowing waters, lotus and cooling vetiver for emotional clarity 💧",
    badge: "Element: Water",
    elementColor: "#216d8e",
    ritualNotes: "Aquatic botanicals, cooling vetiver, and white floral essential oils",
  },
  "fragrance-fire": {
    views: "3.9k",
    hookText: "Spiced amber and warm Kashmiri saffron awakening inner vitality 🔥",
    badge: "Element: Fire",
    elementColor: "#b8421c",
    ritualNotes: "Spiced amber, warm saffron, natural wood powder, and pure resins",
  },
  "fragrance-air": {
    views: "3.1k",
    hookText: "Himalayan cedar and crisp alpine breezes clearing mental fatigue 🌬️",
    badge: "Element: Air",
    elementColor: "#3d7e6c",
    ritualNotes: "Himalayan cedar, delicate floral hints, and smooth aromatic diffusion",
  },
  "fragrance-space": {
    views: "4.9k",
    hookText: "Sacred agarwood oudh, frankincense and myrrh for transcendent stillness 🌌",
    badge: "Element: Space",
    elementColor: "#59427e",
    ritualNotes: "Rare Assam agarwood (oudh), frankincense, and myrrh resins",
  },
  "fragrance-sandalwood": {
    views: "5.6k",
    hookText: "100% Charcoal-Free sacred Mysore sandalwood smoke for daily pooja 🪔",
    badge: "Royal Chandan",
    elementColor: "#a87424",
    ritualNotes: "Pure Mysore sandalwood powder & essential oil blend for daily pooja",
  },
  "fragrance-temple-flora": {
    views: "3.8k",
    hookText: "Upcycled sacred temple flowers and fresh marigold for auspicious pooja 🌸",
    badge: "Temple Flora",
    elementColor: "#ba5f34",
    ritualNotes: "Upcycled temple marigold flowers and natural aromatic resins",
  },
  "fragrance-royal-oudh": {
    views: "5.1k",
    hookText: "Genuine Assam agarwood (oudh) resin for royal gatherings and stillness 👑",
    badge: "Imperial Oudh",
    elementColor: "#493064",
    ritualNotes: "Opulent Assam agarwood resin & frankincense in gold slide box",
  },
  "mdf-gift-box": {
    views: "4.1k",
    hookText: "Artisanal natural wood grain trunk with gold-foil Kurma turtle insignia ✨",
    badge: "Handcrafted Wood",
    elementColor: "#8f6218",
    ritualNotes: "Rigid wooden MDF craftsmanship • Magnetic closure and protective sleeve",
  },
  "pashmina-pocket-square": {
    views: "2.3k",
    hookText: "Softest cashmere wool with delicate gold zari craft 🕊️",
    badge: "Pure Pashmina Blend",
    elementColor: "#0f4228",
    ritualNotes: "70% Fine Cashmere Wool, 30% Mulberry Silk with gold zari turtle",
  },
  "bookmark": {
    views: "1.9k",
    hookText: "Scents connect worlds • Sacred deckle bookmark with silk tassel 📜",
    badge: "Eco-Textured Paper",
    elementColor: "#1d523b",
    ritualNotes: "Heavy 450 GSM FSC-certified textured kraft board with forest green tassel",
  },
  "empty-marble-box": {
    views: "2.5k",
    hookText: "Open emerald marble trunk with antique brass latch for sacred keepsakes 🌿",
    badge: "Heirloom Keepsake",
    elementColor: "#114f33",
    ritualNotes: "Rich plush velvet lining with open interior for jewelry and malas",
  },
};

function buildReelItems(): ShoppableReelItem[] {
  return ORDERED_PRODUCT_IDS.map((productId) => {
    const product = getProductById(productId) || PRODUCTS.find((p) => p.id === productId);
    if (!product) {
      throw new Error(`Product ${productId} not found`);
    }

    const meta = PRODUCT_METADATA[productId];
    const discount =
      product.originalPrice && product.originalPrice > product.price
        ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
        : null;

    const gallery =
      product.gallery && product.gallery.length > 0
        ? product.gallery
        : [product.image];

    return {
      id: `reel-${product.id}`,
      productId: product.id,
      title: product.name,
      shortSubtitle: product.subtitle,
      category: product.category,
      price: product.price,
      originalPrice: product.originalPrice || product.price,
      discountBadge: discount ? `${discount}% OFF` : "SPECIAL",
      posterImage: product.image,
      thumbnail: product.image,
      gallery,
      views: meta?.views || "3.2k",
      hookText: meta?.hookText || product.subtitle,
      badge: meta?.badge || product.badge || "Kurma Ritual",
      elementColor: meta?.elementColor || "#8b5f10",
      ritualNotes: meta?.ritualNotes || product.description,
    };
  });
}

const REEL_ITEMS = buildReelItems();

export function ShoppableVideoReels() {
  const router = useRouter();
  const { quickAddToCart } = useCart();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Pagination state (4 products per page, 4 pages total)
  const [currentPage, setCurrentPage] = useState(0);
  const totalPages = Math.ceil(REEL_ITEMS.length / 4);

  // Modal State
  const [activeModalReel, setActiveModalReel] = useState<ShoppableReelItem | null>(null);
  const [modalSlideIndex, setModalSlideIndex] = useState(0);
  const [modalPlaying, setModalPlaying] = useState(true);
  const [modalProgress, setModalProgress] = useState(0);

  // Cart feedback state
  const [addedItemIds, setAddedItemIds] = useState<Record<string, boolean>>({});

  // Scroll controls
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Hovered card for secondary gallery preview
  const [hoveredCardId, setHoveredCardId] = useState<string | null>(null);
  const scrollRafId = useRef<number | null>(null);

  const updateScrollState = useCallback(() => {
    if (scrollRafId.current !== null) return;
    scrollRafId.current = requestAnimationFrame(() => {
      scrollRafId.current = null;
      if (scrollContainerRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
        const newCanLeft = scrollLeft > 20;
        const newCanRight = scrollLeft < scrollWidth - clientWidth - 20;
        setCanScrollLeft((prev) => (prev !== newCanLeft ? newCanLeft : prev));
        setCanScrollRight((prev) => (prev !== newCanRight ? newCanRight : prev));

        // Track active page index
        const pageIndex = Math.min(
          totalPages - 1,
          Math.max(0, Math.round(scrollLeft / (clientWidth || 1)))
        );
        setCurrentPage((prev) => (prev !== pageIndex ? pageIndex : prev));
      }
    });
  }, [totalPages]);

  useEffect(() => {
    updateScrollState();
    const current = scrollContainerRef.current;
    if (current) {
      current.addEventListener("scroll", updateScrollState, { passive: true });
    }
    return () => {
      if (current) current.removeEventListener("scroll", updateScrollState);
      if (scrollRafId.current !== null) cancelAnimationFrame(scrollRafId.current);
    };
  }, [updateScrollState]);

  // Scroll 4 products at a time (1 full container width)
  const handleScroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const containerWidth = scrollContainerRef.current.clientWidth;
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -containerWidth : containerWidth,
        behavior: "smooth",
      });
    }
  };

  // Jump directly to a page of 4 products
  const goToPage = (pageIdx: number) => {
    if (scrollContainerRef.current) {
      const containerWidth = scrollContainerRef.current.clientWidth;
      scrollContainerRef.current.scrollTo({
        left: pageIdx * containerWidth,
        behavior: "smooth",
      });
      setCurrentPage(pageIdx);
    }
  };

  const handleAddToCart = (reel: ShoppableReelItem, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const product = getProductById(reel.productId);
    if (product) {
      quickAddToCart(product);
      setAddedItemIds((prev) => ({ ...prev, [reel.productId]: true }));
      setTimeout(() => {
        setAddedItemIds((prev) => ({ ...prev, [reel.productId]: false }));
      }, 1500);
    }
  };

  // Open modal for a reel
  const openModal = (reel: ShoppableReelItem) => {
    setActiveModalReel(reel);
    setModalSlideIndex(0);
    setModalProgress(0);
    setModalPlaying(true);
  };

  // Modal Story Slides Auto-Progression
  useEffect(() => {
    if (!activeModalReel || !modalPlaying) return;

    const slideDuration = 4000;
    const intervalStep = 50;
    const progressIncrement = (intervalStep / slideDuration) * 100;

    const timer = setInterval(() => {
      setModalProgress((prev) => {
        if (prev + progressIncrement >= 100) {
          setModalSlideIndex((currIdx) => {
            const maxIdx = activeModalReel.gallery.length - 1;
            return currIdx < maxIdx ? currIdx + 1 : 0;
          });
          return 0;
        }
        return prev + progressIncrement;
      });
    }, intervalStep);

    return () => clearInterval(timer);
  }, [activeModalReel, modalPlaying, modalSlideIndex]);

  // Modal navigation between reels
  const handleNextModalReel = () => {
    if (!activeModalReel) return;
    const currentIndex = REEL_ITEMS.findIndex((r) => r.id === activeModalReel.id);
    const nextIndex = (currentIndex + 1) % REEL_ITEMS.length;
    setActiveModalReel(REEL_ITEMS[nextIndex]);
    setModalSlideIndex(0);
    setModalProgress(0);
  };

  const handlePrevModalReel = () => {
    if (!activeModalReel) return;
    const currentIndex = REEL_ITEMS.findIndex((r) => r.id === activeModalReel.id);
    const prevIndex = (currentIndex - 1 + REEL_ITEMS.length) % REEL_ITEMS.length;
    setActiveModalReel(REEL_ITEMS[prevIndex]);
    setModalSlideIndex(0);
    setModalProgress(0);
  };

  // Keyboard navigation for modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!activeModalReel) return;
      if (e.key === "Escape") setActiveModalReel(null);
      if (e.key === "ArrowRight") handleNextModalReel();
      if (e.key === "ArrowLeft") handlePrevModalReel();
      if (e.key === " ") {
        e.preventDefault();
        setModalPlaying((p) => !p);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeModalReel]);

  return (
    <div className="w-full relative my-2">
      {/* CLEAN CONTROLS (Arrows & Page Counter) */}
      <div className="flex items-center justify-end pb-3">
        <div className="flex items-center gap-2.5">
          <span className="text-xs font-sans text-stone-500 font-medium">
            {currentPage + 1} / {totalPages}
          </span>
          <button
            onClick={() => handleScroll("left")}
            disabled={!canScrollLeft}
            aria-label="Previous 4 products"
            className={`w-8 h-8 rounded-full border border-stone-300 bg-white shadow-xs flex items-center justify-center transition-all ${
              canScrollLeft
                ? "hover:bg-stone-50 hover:scale-105 text-stone-800 cursor-pointer"
                : "opacity-35 cursor-not-allowed text-stone-400"
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleScroll("right")}
            disabled={!canScrollRight}
            aria-label="Next 4 products"
            className={`w-8 h-8 rounded-full border border-stone-300 bg-white shadow-xs flex items-center justify-center transition-all ${
              canScrollRight
                ? "hover:bg-stone-50 hover:scale-105 text-stone-800 cursor-pointer"
                : "opacity-35 cursor-not-allowed text-stone-400"
            }`}
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* HORIZONTAL TRACK - EXACTLY 4 PRODUCTS AT A TIME ON DESKTOP */}
      <div
        ref={scrollContainerRef}
        className="flex gap-4 sm:gap-5 overflow-x-auto pb-3 pt-1 snap-x snap-mandatory scroll-smooth no-scrollbar touch-pan-x"
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          WebkitOverflowScrolling: "touch",
        }}
      >
        {REEL_ITEMS.map((reel) => {
          const isAdded = addedItemIds[reel.productId];
          const isHovered = hoveredCardId === reel.id;

          // Alternate gallery angle image when hovered
          const displayImage =
            isHovered && reel.gallery.length > 1 ? reel.gallery[1] : reel.posterImage;

          return (
            <div
              key={reel.id}
              className="flex-shrink-0 w-[84%] sm:w-[calc(50%-0.625rem)] lg:w-[calc(25%-0.9375rem)] snap-start flex flex-col group cursor-pointer"
              onMouseEnter={() => setHoveredCardId(reel.id)}
              onMouseLeave={() => setHoveredCardId(null)}
              onClick={() => openModal(reel)}
            >
              {/* TOP: PORTRAIT CINEMATIC PRODUCT REEL CARD (9:15 aspect ratio) */}
              <div className="relative aspect-[9/15] w-full rounded-2xl overflow-hidden bg-gradient-to-b from-[#0c2a1a] via-[#05160d] to-[#020b06] shadow-md group-hover:shadow-2xl transition-all duration-300 border border-stone-200/70">
                {/* Atmospheric Background Ambient Stage */}
                <div
                  className="absolute inset-0 opacity-40 mix-blend-screen pointer-events-none transition-opacity duration-500 group-hover:opacity-70"
                  style={{
                    background: `radial-gradient(ellipse at 50% 40%, ${reel.elementColor} 0%, transparent 72%)`,
                  }}
                />

                {/* PRODUCT VISUAL SHOWCASE */}
                <div className="absolute inset-0 p-5 flex items-center justify-center">
                  <div className="relative w-full h-[84%] transition-transform duration-700 ease-out group-hover:scale-108 group-hover:-translate-y-1">
                    <Image
                      src={displayImage}
                      alt={reel.title}
                      fill
                      loading="lazy"
                      className="object-contain filter drop-shadow-md transition-all duration-500"
                      sizes="(max-width: 640px) 85vw, (max-width: 1024px) 50vw, 25vw"
                    />
                  </div>
                </div>

                {/* Center Hover Story Play Icon */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 pointer-events-none">
                  <div className="w-12 h-12 rounded-full bg-[#072515]/90 border border-[#eed08e]/70 backdrop-blur-md text-[#eed08e] flex items-center justify-center shadow-xl transform group-hover:scale-110 transition-transform">
                    <Play className="w-5 h-5 ml-0.5 fill-current" />
                  </div>
                </div>
              </div>

              {/* BOTTOM: ATTACHED PRODUCT CARD & ADD TO CART */}
              <div className="mt-2.5 p-2.5 bg-transparent rounded-2xl border border-stone-200/90 space-y-2">
                {/* Product Info Row */}
                <div className="flex items-center gap-2.5">
                  <div className="relative w-11 h-11 flex-shrink-0 rounded-xl overflow-hidden bg-transparent border border-stone-200/80 p-0.5">
                    <Image
                      src={reel.thumbnail}
                      alt={reel.title}
                      fill
                      loading="lazy"
                      sizes="44px"
                      className="object-contain"
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <h4 className="text-xs font-semibold text-stone-900 truncate font-sans">
                      {reel.title}
                    </h4>
                    <div className="flex items-center gap-1.5 mt-0.5 text-xs">
                      <span className="font-bold text-stone-900">
                        {formatPrice(reel.price)}
                      </span>
                      {reel.originalPrice > reel.price && (
                        <span className="text-stone-400 line-through text-[11px]">
                          {formatPrice(reel.originalPrice)}
                        </span>
                      )}
                      <span className="text-emerald-700 font-bold text-[10px] tracking-wide">
                        {reel.discountBadge}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Full-Width Add To Cart Button */}
                <button
                  onClick={(e) => handleAddToCart(reel, e)}
                  className={`w-full py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer active:scale-98 ${
                    isAdded
                      ? "bg-emerald-700 text-white"
                      : "bg-[#072515] hover:bg-[#0c3823] text-white hover:text-[#eed08e]"
                  }`}
                >
                  {isAdded ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Added to Bag</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>Add to Cart</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* SUBTLE PAGE INDICATOR DOTS (4 Pages) */}
      <div className="flex items-center justify-center gap-1.5 pt-2">
        {Array.from({ length: totalPages }).map((_, pageIdx) => (
          <button
            key={pageIdx}
            onClick={() => goToPage(pageIdx)}
            aria-label={`Go to page ${pageIdx + 1}`}
            className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
              currentPage === pageIdx
                ? "w-7 bg-[#8b5f10]"
                : "w-2 bg-stone-300 hover:bg-stone-400"
            }`}
          />
        ))}
      </div>

      {/* FULLSCREEN SHOPPABLE PRODUCT REEL MODAL */}
      <AnimatePresence>
        {activeModalReel && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md">
            {/* Backdrop click to close */}
            <div
              className="absolute inset-0 cursor-pointer"
              onClick={() => setActiveModalReel(null)}
            />

            {/* Previous Reel Button (Left) */}
            <button
              onClick={handlePrevModalReel}
              aria-label="Previous reel"
              className="hidden sm:flex absolute left-6 sm:left-12 top-1/2 -translate-y-1/2 z-50 w-12 h-12 rounded-full bg-white/15 hover:bg-white/30 backdrop-blur-md text-white items-center justify-center transition-all cursor-pointer shadow-lg hover:scale-105"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            {/* Next Reel Button (Right) */}
            <button
              onClick={handleNextModalReel}
              aria-label="Next reel"
              className="hidden sm:flex absolute right-6 sm:right-12 top-1/2 -translate-y-1/2 z-50 w-12 h-12 rounded-full bg-white/15 hover:bg-white/30 backdrop-blur-md text-white items-center justify-center transition-all cursor-pointer shadow-lg hover:scale-105"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* Reel Container Card */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="relative z-10 w-full max-w-[390px] h-[84vh] max-h-[740px] rounded-3xl overflow-hidden bg-black shadow-2xl flex flex-col justify-between border border-white/20 select-none"
            >
              {/* TOP: STORY PROGRESS SEGMENTS */}
              <div className="absolute top-0 left-0 right-0 z-30 p-3 bg-gradient-to-b from-black/85 via-black/40 to-transparent">
                <div className="flex items-center gap-1.5 w-full">
                  {activeModalReel.gallery.map((_, idx) => {
                    const isActive = idx === modalSlideIndex;
                    const isPassed = idx < modalSlideIndex;

                    return (
                      <div
                        key={idx}
                        className="h-1 flex-1 bg-white/30 rounded-full overflow-hidden cursor-pointer"
                        onClick={() => {
                          setModalSlideIndex(idx);
                          setModalProgress(0);
                        }}
                      >
                        <div
                          className="h-full bg-[#eed08e] transition-all duration-75 ease-linear"
                          style={{
                            width: isPassed
                              ? "100%"
                              : isActive
                              ? `${modalProgress}%`
                              : "0%",
                          }}
                        />
                      </div>
                    );
                  })}
                </div>

                {/* Header Controls: Brand, Angle indicator, Close */}
                <div className="flex items-center justify-between mt-2.5 text-white">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-[#072515] border border-[#eed08e]/60 flex items-center justify-center text-[#eed08e] font-serif text-xs font-bold shadow-xs">
                      K
                    </div>
                    <div>
                      <p className="text-xs font-bold leading-tight flex items-center gap-1.5">
                        <span>Kurma Luxury</span>
                        <span className="text-[10px] px-1.5 py-0.2 bg-[#eed08e]/20 text-[#eed08e] rounded-xs font-mono">
                          {activeModalReel.badge}
                        </span>
                      </p>
                      <p className="text-[10px] text-stone-300">
                        Angle {modalSlideIndex + 1} of {activeModalReel.gallery.length}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Play/Pause Story Progress */}
                    <button
                      onClick={() => setModalPlaying(!modalPlaying)}
                      className="p-1.5 rounded-full bg-black/40 backdrop-blur-md text-white hover:bg-black/60 transition-colors cursor-pointer"
                      title={modalPlaying ? "Pause Story" : "Play Story"}
                    >
                      {modalPlaying ? (
                        <Pause className="w-4 h-4" />
                      ) : (
                        <Play className="w-4 h-4" />
                      )}
                    </button>

                    <button
                      onClick={() => setActiveModalReel(null)}
                      className="p-1.5 rounded-full bg-black/40 backdrop-blur-md text-white hover:bg-black/60 transition-colors cursor-pointer"
                      title="Close"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* CENTER: PRODUCT PHOTOGRAPHY STORY STAGE */}
              <div className="relative flex-1 w-full h-full bg-gradient-to-b from-[#0b2416] via-[#04120a] to-black flex items-center justify-center overflow-hidden">
                {/* Radial Glow matching product element */}
                <div
                  className="absolute inset-0 opacity-50 mix-blend-screen pointer-events-none"
                  style={{
                    background: `radial-gradient(ellipse at 50% 45%, ${activeModalReel.elementColor} 0%, transparent 70%)`,
                  }}
                />

                {/* Left Tap Zone (Previous Angle) */}
                <div
                  className="absolute left-0 top-16 bottom-32 w-1/3 z-20 cursor-pointer"
                  onClick={() => {
                    setModalSlideIndex((curr) =>
                      curr > 0 ? curr - 1 : activeModalReel.gallery.length - 1
                    );
                    setModalProgress(0);
                  }}
                  title="Previous Angle"
                />

                {/* Right Tap Zone (Next Angle) */}
                <div
                  className="absolute right-0 top-16 bottom-32 w-1/3 z-20 cursor-pointer"
                  onClick={() => {
                    setModalSlideIndex((curr) =>
                      curr < activeModalReel.gallery.length - 1 ? curr + 1 : 0
                    );
                    setModalProgress(0);
                  }}
                  title="Next Angle"
                />

                {/* Active High-Res Product Image */}
                <div className="relative w-full h-[72%] p-8 z-10 flex items-center justify-center">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={modalSlideIndex}
                      initial={{ opacity: 0, scale: 0.94 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 1.04 }}
                      transition={{ duration: 0.3, ease: "easeOut" }}
                      className="relative w-full h-full flex items-center justify-center"
                    >
                      <Image
                        src={activeModalReel.gallery[modalSlideIndex]}
                        alt={`${activeModalReel.title} - angle ${modalSlideIndex + 1}`}
                        fill
                        priority
                        className="object-contain filter drop-shadow-xl"
                      />
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* Pause Indicator overlay */}
                {!modalPlaying && (
                  <div className="absolute top-20 right-4 z-20 px-2 py-1 rounded-md bg-black/60 backdrop-blur-md text-[#eed08e] text-[10px] font-sans font-medium flex items-center gap-1 pointer-events-none">
                    <Pause className="w-3 h-3" />
                    <span>Story Paused</span>
                  </div>
                )}
              </div>

              {/* BOTTOM: FLOATING SHOPPABLE PRODUCT DRAWER */}
              <div className="absolute bottom-0 left-0 right-0 z-30 p-4 bg-gradient-to-t from-black/98 via-black/85 to-transparent space-y-3">
                {/* Clean Ritual Notes */}
                {activeModalReel.ritualNotes && (
                  <p className="text-[#eed08e] text-xs font-sans font-medium line-clamp-1 drop-shadow-sm">
                    {activeModalReel.ritualNotes}
                  </p>
                )}

                {/* Shoppable Product Box */}
                <div className="p-3 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-white/40 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-[#FAF8F5] border border-stone-200 p-0.5 flex-shrink-0">
                      <Image
                        src={activeModalReel.thumbnail}
                        alt={activeModalReel.title}
                        fill
                        sizes="48px"
                        className="object-contain"
                      />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-stone-900 truncate">
                        {activeModalReel.title}
                      </h4>
                      <div className="flex items-center gap-1.5 text-xs mt-0.5">
                        <span className="font-extrabold text-[#072515]">
                          {formatPrice(activeModalReel.price)}
                        </span>
                        {activeModalReel.originalPrice > activeModalReel.price && (
                          <span className="text-stone-400 line-through text-[11px]">
                            {formatPrice(activeModalReel.originalPrice)}
                          </span>
                        )}
                        <span className="text-emerald-700 font-bold text-[10px]">
                          {activeModalReel.discountBadge}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Add to Cart in Modal */}
                  <button
                    onClick={(e) => handleAddToCart(activeModalReel, e)}
                    className={`px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-md cursor-pointer flex-shrink-0 ${
                      addedItemIds[activeModalReel.productId]
                        ? "bg-emerald-700 text-white"
                        : "bg-[#072515] hover:bg-[#0c3823] text-white hover:text-[#eed08e]"
                    }`}
                  >
                    {addedItemIds[activeModalReel.productId] ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Added</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>Add</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Link to view product page */}
                <div className="text-center pt-0.5">
                  <button
                    onClick={() => {
                      router.push(`/products/${activeModalReel.productId}`);
                    }}
                    className="text-[11px] text-[#eed08e] hover:underline font-medium inline-flex items-center gap-1 cursor-pointer"
                  >
                    <span>Customise &amp; View Details</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
