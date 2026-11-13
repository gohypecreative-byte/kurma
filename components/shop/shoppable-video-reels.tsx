"use client";

import React, { useState, useRef, useEffect, useCallback, useMemo } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from "motion/react";
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
  SlidersHorizontal,
  Plus,
} from "lucide-react";
import { PRODUCTS, ProductSKU, getProductById, formatPrice } from "@/lib/products";
import { useProducts } from "@/lib/products-context";
import { useCart } from "@/lib/cart-context";

export interface ShoppableReelItem {
  id: string;
  productId: string;
  title: string;
  shortSubtitle: string;
  category: "Gift Boxes" | "Fragrances" | "Sacred Accessories";
  categoryTag: string;
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

const CATEGORY_TAG_MAP: Record<string, string> = {
  "marble-gift-box": "FLAGSHIP SUITE",
  "5-elements-suite": "FLAGSHIP SUITE",
  "turtle-incense-holder": "SACRED ACCESSORY",
  "brass-turtle-holder": "SACRED ACCESSORY",
  "medallion": "SACRED ACCESSORY",
  "pashmina-pocket-square": "SACRED ACCESSORY",
  "bookmark": "SACRED ACCESSORY",
  "fragrance-earth": "ELEMENTAL BLEND",
  "fragrance-water": "ELEMENTAL BLEND",
  "fragrance-fire": "ELEMENTAL BLEND",
  "fragrance-air": "ELEMENTAL BLEND",
  "fragrance-space": "ELEMENTAL BLEND",
  "fragrance-sandalwood": "SACRED BLEND",
  "fragrance-temple-flora": "SACRED BLEND",
  "fragrance-royal-oudh": "SACRED BLEND",
  "mdf-gift-box": "HEIRLOOM SUITE",
  "empty-marble-box": "HEIRLOOM KEEPSAKE",
};

function buildReelItems(getLiveProduct?: (id: string) => ProductSKU | undefined): ShoppableReelItem[] {
  return ORDERED_PRODUCT_IDS.map((productId) => {
    const product =
      (getLiveProduct ? getLiveProduct(productId) : undefined) ||
      getProductById(productId) ||
      PRODUCTS.find((p) => p.id === productId);
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

    const categoryTag =
      CATEGORY_TAG_MAP[productId] ||
      (meta?.badge ? meta.badge.toUpperCase() : product.category.toUpperCase());

    return {
      id: `reel-${product.id}`,
      productId: product.id,
      title: product.name,
      shortSubtitle: product.subtitle,
      category: product.category,
      categoryTag,
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

export function ShoppableVideoReels() {
  const router = useRouter();
  const { quickAddToCart } = useCart();
  const { getProduct } = useProducts();
  const REEL_ITEMS = useMemo(() => buildReelItems(getProduct), [getProduct]);
  const targetRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Dynamic Horizontal Translation Calculation
  const [scrollRange, setScrollRange] = useState(0);

  useEffect(() => {
    const updateRange = () => {
      if (trackRef.current) {
        const scrollWidth = trackRef.current.scrollWidth;
        const clientWidth = window.innerWidth;
        setScrollRange(Math.max(0, scrollWidth - clientWidth + 120));
      }
    };

    updateRange();
    window.addEventListener("resize", updateRange);
    return () => window.removeEventListener("resize", updateRange);
  }, []);

  // Vertical Scroll Progress mapped to Horizontal Ribbon
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end end"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 85,
    damping: 24,
    restDelta: 0.001,
  });

  const x = useTransform(smoothProgress, [0, 1], [0, -scrollRange]);

  // Autoplay Video when section enters viewport
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  // Modal State
  const [activeModalReel, setActiveModalReel] = useState<ShoppableReelItem | null>(null);
  const [modalSlideIndex, setModalSlideIndex] = useState(0);
  const [modalPlaying, setModalPlaying] = useState(true);
  const [modalProgress, setModalProgress] = useState(0);

  // Cart feedback state
  const [addedItemIds, setAddedItemIds] = useState<Record<string, boolean>>({});

  // Hovered card for secondary gallery preview
  const [hoveredCardId, setHoveredCardId] = useState<string | null>(null);

  const handleAddToCart = (reel: ShoppableReelItem, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const product = getProduct(reel.productId) || getProductById(reel.productId);
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
    const currentIndex = REEL_ITEMS.findIndex((r: ShoppableReelItem) => r.id === activeModalReel.id);
    const nextIndex = (currentIndex + 1) % REEL_ITEMS.length;
    setActiveModalReel(REEL_ITEMS[nextIndex]);
    setModalSlideIndex(0);
    setModalProgress(0);
  };

  const handlePrevModalReel = () => {
    if (!activeModalReel) return;
    const currentIndex = REEL_ITEMS.findIndex((r: ShoppableReelItem) => r.id === activeModalReel.id);
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
    <section
      ref={targetRef}
      className="relative w-full bg-[#FAF7F2] select-none"
      style={{ height: "300vh" }}
    >
      {/* STICKY FULL-SCREEN CINEMATIC VIEWPORT */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col justify-between py-6 sm:py-8">
        {/* Full-Bleed Atmospheric Background Product Video */}
        <div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden z-0">
          <video
            ref={videoRef}
            src="/videos/incense-burn.mp4"
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            className="absolute inset-0 w-full h-full object-cover filter brightness-[0.65] contrast-125"
          />
          {/* Layered Cinematic Kurma Emerald & Vignette Gradients */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#1C1B18] via-[#1C1B18]/55 to-[#1C1B18]/75" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-[#1C1B18]/30 to-[#1C1B18]/85" />
        </div>

        {/* TOP: FLOATING SECTION HEADER */}
        <div className="relative w-full px-6 sm:px-12 md:px-16 flex items-center justify-between z-20">
          <div>
            <span className="text-[10px] sm:text-[11px] font-bold tracking-[0.28em] uppercase text-[#eed08e] block">
              SACRED RITUALS &amp; HEIRLOOM EDITIONS
            </span>
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-serif text-white tracking-tight font-normal sm:whitespace-nowrap mt-1">
              Sacred Rituals &amp; Heirloom Creations
            </h2>
          </div>

          {/* Subtitle / Interaction Cue */}
          <div className="hidden sm:flex items-center gap-2.5 text-xs text-stone-300 bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 shadow-lg">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-light">Scroll vertically to explore creations</span>
          </div>
        </div>

        {/* CENTER: SMOOTH HORIZONTAL SCROLLING TRACK */}
        <div className="relative w-full flex-1 flex items-center overflow-hidden z-10 my-auto">
          <motion.div
            ref={trackRef}
            style={{ x }}
            className="flex items-center gap-6 sm:gap-8 px-6 sm:px-12 md:px-16"
          >
            {REEL_ITEMS.map((reel: ShoppableReelItem) => {
              const isAdded = addedItemIds[reel.productId];
              const isHovered = hoveredCardId === reel.id;
              const displayImage =
                isHovered && reel.gallery.length > 1 ? reel.gallery[1] : reel.posterImage;

              return (
                <div
                  key={reel.id}
                  className="w-[270px] sm:w-[310px] md:w-[340px] lg:w-[360px] shrink-0 flex flex-col group cursor-pointer"
                  onMouseEnter={() => setHoveredCardId(reel.id)}
                  onMouseLeave={() => setHoveredCardId(null)}
                  onClick={() => openModal(reel)}
                >
                  {/* PORTRAIT CARD CONTAINER */}
                  <div className="relative aspect-[9/13] w-full rounded-2xl sm:rounded-3xl overflow-hidden bg-gradient-to-b from-stone-900/85 via-[#262626]/90 to-black/95 backdrop-blur-md border border-white/15 group-hover:border-[#eed08e]/60 shadow-xl group-hover:shadow-2xl transition-all duration-500">
                    {/* Glowing Element Ambient Light */}
                    <div
                      className="absolute inset-0 opacity-30 mix-blend-screen pointer-events-none group-hover:opacity-65 transition-opacity duration-500"
                      style={{
                        background: `radial-gradient(ellipse at 50% 40%, ${reel.elementColor} 0%, transparent 72%)`,
                      }}
                    />

                    {/* High-Resolution Product Showcase */}
                    <div className="absolute inset-0 p-5 sm:p-6 flex items-center justify-center">
                      <div className="relative w-full h-[85%] transition-transform duration-700 ease-out group-hover:scale-108 group-hover:-translate-y-1">
                        <Image
                          src={displayImage}
                          alt={reel.title}
                          fill
                          loading="lazy"
                          className="object-contain filter drop-shadow-xl"
                          sizes="(max-width: 640px) 270px, (max-width: 1024px) 340px, 380px"
                        />
                      </div>
                    </div>

                    {/* Hover Play Button */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 pointer-events-none">
                      <div className="w-12 h-12 rounded-full bg-[#1C1B18]/90 border border-[#eed08e]/80 text-[#eed08e] flex items-center justify-center shadow-2xl transform group-hover:scale-110 transition-transform">
                        <Play className="w-5 h-5 ml-0.5 fill-current" />
                      </div>
                    </div>
                  </div>

                  {/* Minimalist Info Row Directly Beneath Card */}
                  <div className="mt-3 flex items-start justify-between gap-2 px-1">
                    <div className="space-y-0.5 min-w-0 flex-1">
                      <span className="text-[10px] font-bold tracking-widest uppercase text-[#eed08e] block">
                        {reel.categoryTag}
                      </span>
                      <h3 className="text-xs sm:text-[13.5px] font-medium tracking-tight leading-snug truncate text-white group-hover:text-[#eed08e] transition-colors">
                        {reel.title}
                      </h3>
                      <div className="flex items-center gap-1.5 pt-0.5">
                        <span className="text-xs sm:text-[13px] font-medium text-stone-200">
                          {formatPrice(reel.price)}
                        </span>
                        {reel.originalPrice > reel.price && (
                          <span className="text-[11px] line-through text-stone-400">
                            {formatPrice(reel.originalPrice)}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Action Buttons on Far Right */}
                    <div className="flex items-center gap-1 shrink-0 pt-3">
                      {/* Customize & Buy Button */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(`/elements?box=${reel.productId}`);
                        }}
                        title={`Customise & Buy ${reel.title}`}
                        aria-label={`Customise & Buy ${reel.title}`}
                        className="p-1.5 rounded-md text-[#eed08e] hover:text-white hover:bg-white/10 transition-all duration-200 hover:scale-110 cursor-pointer"
                      >
                        <SlidersHorizontal className="w-3.5 h-3.5 stroke-[1.8]" />
                      </button>

                      {/* Quick Add to Cart Button */}
                      <button
                        type="button"
                        onClick={(e) => handleAddToCart(reel, e)}
                        title={`Quick add ${reel.title} to cart`}
                        aria-label={`Quick add ${reel.title} to cart`}
                        className="p-1.5 rounded-md text-stone-300 hover:text-white hover:bg-white/10 transition-all duration-200 hover:scale-110 cursor-pointer"
                      >
                        {isAdded ? (
                          <Check className="w-3.5 h-3.5 stroke-[2.5] text-emerald-400" />
                        ) : (
                          <Plus className="w-3.5 h-3.5 stroke-[2]" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </motion.div>
        </div>

        {/* BOTTOM: PROGRESS BAR & CINEMATIC INDICATOR */}
        <div className="relative w-full px-6 sm:px-12 md:px-16 flex items-center justify-between text-xs text-stone-300 font-sans z-20 pt-2">
          <div className="flex items-center gap-2 text-[11px] uppercase tracking-wider text-stone-400">
            <span className="text-[#eed08e] font-semibold">{REEL_ITEMS.length} Heirloom Editions</span>
            <span>•</span>
            <span className="hidden sm:inline">Click any creation to inspect in motion</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[10px] uppercase tracking-widest text-stone-400 font-mono hidden sm:inline">Progress</span>
            <div className="w-28 sm:w-48 h-1 bg-white/20 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-[#eed08e] to-[#c0881b] rounded-full"
                style={{ scaleX: smoothProgress, transformOrigin: "0%" }}
              />
            </div>
          </div>
        </div>
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
                    <div className="w-7 h-7 rounded-full bg-[#1C1B18] border border-[#eed08e]/60 flex items-center justify-center text-[#eed08e] font-serif text-xs font-bold shadow-xs">
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
                {/* Autoplaying Atmospheric Sacred Video */}
                <video
                  src="/videos/incense-burn.mp4"
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="absolute inset-0 w-full h-full object-cover opacity-45 mix-blend-screen pointer-events-none"
                />

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
                        <span className="font-extrabold text-[#1C1B18]">
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
                        : "bg-[#1C1B18] hover:bg-[#33312D] text-white hover:text-[#eed08e]"
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
    </section>
  );
}
