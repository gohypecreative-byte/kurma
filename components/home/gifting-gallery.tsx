"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, Plus, Check, Heart } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { useWishlist } from "@/lib/wishlist-context";

export interface HamperItem {
  id: string;
  skuId: string;
  name: string;
  subtitle: string;
  price: number;
  priceDisplay: string;
  originalPrice?: string;
  category: "all" | "wicker" | "leatherette" | "brass" | "crates";
  tag: string;
  rating: number;
  reviewsCount: number;
  image: string;
  description: string;
  inclusions: string[];
}

export const HAMPER_ITEMS: HamperItem[] = [
  {
    id: "hamper-1",
    skuId: "wicker-silk-incense-basket",
    name: "Imperial Wicker & Silk Fragrance Basket",
    subtitle: "Handwoven wicker basket with silk pouch, Ganesha medallion & trio agarbatti sticks",
    price: 3499,
    priceDisplay: "₹3,499",
    originalPrice: "₹4,299",
    category: "wicker",
    tag: "Handwoven Classic",
    rating: 5.0,
    reviewsCount: 48,
    image: "/images/product/hamper-wicker-silk.jpg",
    description: "An elegant gift presentation featuring a handwoven wicker basket lined with dark emerald raw silk, emerald silk gift pouch with gold tie, handcrafted Ganesha medallion, and 3 luxury agarbatti stick boxes.",
    inclusions: ["3 Packs Artisanal Agarbatti Sticks", "Handcrafted Silk Gift Pouch", "Brass-plated Ganesha Keepsake", "Handwoven Wicker Basket"]
  },
  {
    id: "hamper-2",
    skuId: "sacred-buddha-wooden-suite",
    name: "Sacred Buddha & Fragrance Wooden Suite",
    subtitle: "Polished hardwood stand, hand-finished Buddha statue & 5-element agarbatti boxes",
    price: 4299,
    priceDisplay: "₹4,299",
    originalPrice: "₹4,999",
    category: "crates",
    tag: "Spiritual Luxury",
    rating: 4.9,
    reviewsCount: 62,
    image: "/images/product/hamper-buddha-wooden.jpg",
    description: "Elevate your meditation sanctuary with this serene rosewood pedestal set featuring an antique solid brass Buddha idol, traditional brass diya lamp, and five elemental agarbatti boxes.",
    inclusions: ["Meditative Brass Buddha Idol", "Polished Hardwood Burner Base", "5 Elemental Agarbatti Suites (135 sticks)", "Kurma Ritual Guide"]
  },
  {
    id: "hamper-3",
    skuId: "royal-tea-incense-leatherette-hamper",
    name: "The Royal Tea & Fragrance Leatherette Hamper",
    subtitle: "Round stitched leatherette tray, designer ceramic cup, organic tea & agarbatti sticks",
    price: 3899,
    priceDisplay: "₹3,899",
    originalPrice: "₹4,500",
    category: "leatherette",
    tag: "Signature Suite",
    rating: 5.0,
    reviewsCount: 39,
    image: "/images/product/hamper-royal-tea.jpg",
    description: "A thoughtful gift tray for tea lovers and mindfulness seekers, combining a premium artisan ceramic cup, embossed brass canister of Organic Tea, and 3 luxury agarbatti stick boxes.",
    inclusions: ["Handcrafted Leatherette Tray", "Artisan Ceramic Cup", "Embossed Brass Canister of Organic Tea", "3 Luxury Agarbatti Suites", "Brass Diya Holder"]
  },
  {
    id: "hamper-4",
    skuId: "heirloom-slatted-wooden-trunk",
    name: "Heirloom Slatted Wooden Chest & Burlap Trunk",
    subtitle: "Lidded wooden chest, natural jute sack & multi-scent agarbatti packs",
    price: 4599,
    priceDisplay: "₹4,599",
    originalPrice: "₹5,200",
    category: "wicker",
    tag: "Heirloom Edition",
    rating: 4.9,
    reviewsCount: 54,
    image: "/images/product/hamper-slatted-trunk.jpg",
    description: "Unbox timeless tradition with this vintage slatted wooden chest housing premium agarbatti boxes, a rustic natural burlap pouch with a gold wax seal, and a solid brass turtle burner.",
    inclusions: ["Slatted Wooden Chest with Clasp", "Natural Jute Sack with Seal", "3 Agarbatti Suites (81 sticks)", "Brass Turtle Incense Holder"]
  },
  {
    id: "hamper-5",
    skuId: "devotional-brass-puja-tray",
    name: "Devotional Brass Puja & Fragrance Tray",
    subtitle: "Engraved brass thali, twin brass diyas, Ganesha idol & dual agarbatti suites",
    price: 3299,
    priceDisplay: "₹3,299",
    originalPrice: "₹3,999",
    category: "brass",
    tag: "Ceremonial Suite",
    rating: 5.0,
    reviewsCount: 71,
    image: "/images/product/hamper-devotional-puja.jpg",
    description: "Crafted for festive rituals and daily prayers, this tray includes an engraved brass thali, twin glowing brass oil lamps, a golden Ganesha idol, and fragrant agarbatti packs.",
    inclusions: ["Engraved Brass Puja Thali", "Twin Artisan Brass Diyas", "Solid Brass Ganesha Idol", "2 Premium Agarbatti Stick Boxes"]
  },
  {
    id: "hamper-6",
    skuId: "mindfulness-crystal-sanctuary-crate",
    name: "Mindfulness & Crystal Sanctuary Crate",
    subtitle: "Natural pine wood crate, raw crystals, aromatic agarbatti & brass turtle burner",
    price: 3999,
    priceDisplay: "₹3,999",
    originalPrice: "₹4,699",
    category: "crates",
    tag: "Wellness Gift",
    rating: 4.9,
    reviewsCount: 31,
    image: "/images/product/hamper-crystal-sanctuary.jpg",
    description: "Bring peace and positive energy to any home with this pine crate featuring healing raw quartz and amethyst crystals, aromatic agarbatti packs, and sacred brass incense accessories.",
    inclusions: ["Natural Pine Crate", "Healing Raw Quartz & Amethyst", "4 Fragrance Agarbatti Packs", "Brass Incense Holder"]
  },
  {
    id: "hamper-7",
    skuId: "festive-lotus-brass-leatherette-tray",
    name: "Festive Lotus Brass & Fragrance Tray",
    subtitle: "Dark leatherette tray, lotus brass candle stands & golden agarbatti canister",
    price: 4799,
    priceDisplay: "₹4,799",
    originalPrice: "₹5,500",
    category: "leatherette",
    tag: "Festive Bestseller",
    rating: 5.0,
    reviewsCount: 89,
    image: "/images/product/suite-portrait.jpg",
    description: "An opulent arrangement featuring brass lotus candle holders, a golden brass tea tin, engraved thali, and four elemental agarbatti stick boxes.",
    inclusions: ["Stitched Leatherette Tray", "Dual Brass Lotus Diya Holders", "Brass Agarbatti Canister", "4 Elemental Agarbatti Suites"]
  },
  {
    id: "hamper-8",
    skuId: "celebration-keepsake-basket",
    name: "Milestone Celebration Sacred Fragrance Basket",
    subtitle: "Wicker tray with solid brass turtle burner, silk pouch & fragrance trio",
    price: 2999,
    priceDisplay: "₹2,999",
    originalPrice: "₹3,600",
    category: "wicker",
    tag: "Special Occasion",
    rating: 4.8,
    reviewsCount: 42,
    image: "/images/product/trunk-portrait.jpg",
    description: "Make milestone celebrations unforgettable with this decorative keepsake hamper complete with a solid brass turtle burner, silk gift pouch, and soothing agarbatti suites.",
    inclusions: ["Heirloom Keepsake Chest", "Solid Brass Turtle Holder", "Handcrafted Silk Gift Pouch", "3 Fragrance Agarbatti Suites"]
  }
];

export function GiftingGallery() {
  const router = useRouter();
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const [addedIds, setAddedIds] = useState<Record<string, boolean>>({});
  const [cardImgIdx, setCardImgIdx] = useState<Record<string, number>>({});

  // 3D Coverflow active index & drag state
  const [activeIndex, setActiveIndex] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [viewportWidth, setViewportWidth] = useState(1200);

  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const dragStartX = useRef(0);
  const touchStartY = useRef(0);
  const dragStartTime = useRef(0);
  const hasMovedRef = useRef(false);
  const isSwipingHorizontal = useRef<boolean | null>(null);
  const lastWheelStepTimeRef = useRef<number>(0);
  const wheelDeltaAccumulator = useRef<number>(0);
  const lastWheelDirectionRef = useRef<number>(0);

  // Responsive dimensions
  useEffect(() => {
    const updateWidth = () => setViewportWidth(window.innerWidth);
    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  const isMobile = viewportWidth < 640;
  const isTablet = viewportWidth >= 640 && viewportWidth < 1024;
  const spacing = isMobile ? 180 : isTablet ? 230 : 275;
  const cardWidth = isMobile ? 270 : isTablet ? 305 : 335;

  // Navigation handlers
  const goToNext = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % HAMPER_ITEMS.length);
  }, []);

  const goToPrev = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + HAMPER_ITEMS.length) % HAMPER_ITEMS.length);
  }, []);

  // Auto-advance horizontally through hamper creations smoothly every 3 seconds (pauses on hover or drag)
  useEffect(() => {
    if (isDragging || isHovered) return;

    const interval = setInterval(() => {
      goToNext();
    }, 3000);

    return () => clearInterval(interval);
  }, [isDragging, isHovered, goToNext]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === "ArrowLeft") {
        goToPrev();
      } else if (e.key === "ArrowRight") {
        goToNext();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [goToNext, goToPrev]);

  // Mouse wheel horizontal scrolling
  useEffect(() => {
    const el = sectionRef.current || stageRef.current;
    if (!el) return;

    const onWheel = (e: WheelEvent) => {
      const isShift = e.shiftKey;
      const isHorizontal = Math.abs(e.deltaX) > Math.abs(e.deltaY) || isShift;

      if (!isHorizontal) return;

      e.preventDefault();

      const delta = isShift && Math.abs(e.deltaX) <= Math.abs(e.deltaY) ? e.deltaY : e.deltaX;
      if (Math.abs(delta) < 3) return;

      const now = Date.now();
      const currentDirection = Math.sign(delta);

      if (lastWheelDirectionRef.current !== 0 && currentDirection !== lastWheelDirectionRef.current) {
        wheelDeltaAccumulator.current = 0;
      }
      lastWheelDirectionRef.current = currentDirection;

      const timeSinceLastStep = now - lastWheelStepTimeRef.current;
      if (timeSinceLastStep < 420) return;

      wheelDeltaAccumulator.current += delta;
      const THRESHOLD = 18;

      if (Math.abs(wheelDeltaAccumulator.current) >= THRESHOLD) {
        if (wheelDeltaAccumulator.current > 0) {
          goToNext();
        } else {
          goToPrev();
        }
        lastWheelStepTimeRef.current = now;
        wheelDeltaAccumulator.current = 0;
      }
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      el.removeEventListener("wheel", onWheel);
    };
  }, [goToNext, goToPrev]);

  // Mouse click-and-drag
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    dragStartX.current = e.clientX;
    dragStartTime.current = Date.now();
    hasMovedRef.current = false;
    setIsDragging(true);
  };

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      const diffX = e.clientX - dragStartX.current;
      if (Math.abs(diffX) > 6) {
        hasMovedRef.current = true;
      }
      setDragOffset(diffX);
    };

    const handleMouseUp = (e: MouseEvent) => {
      const diffX = e.clientX - dragStartX.current;
      const duration = Date.now() - dragStartTime.current;
      const velocity = Math.abs(diffX) / Math.max(duration, 1);

      setIsDragging(false);
      setDragOffset(0);

      const SWIPE_THRESHOLD = 50;
      if (diffX < -SWIPE_THRESHOLD || (diffX < -20 && velocity > 0.4)) {
        goToNext();
      } else if (diffX > SWIPE_THRESHOLD || (diffX > 20 && velocity > 0.4)) {
        goToPrev();
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, goToNext, goToPrev]);

  // Touch swipe support
  const handleTouchStart = (e: React.TouchEvent) => {
    dragStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    dragStartTime.current = Date.now();
    hasMovedRef.current = false;
    isSwipingHorizontal.current = null;
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const diffX = e.touches[0].clientX - dragStartX.current;
    const diffY = e.touches[0].clientY - touchStartY.current;

    if (isSwipingHorizontal.current === null) {
      if (Math.abs(diffX) > 8 || Math.abs(diffY) > 8) {
        isSwipingHorizontal.current = Math.abs(diffX) > Math.abs(diffY);
      }
    }

    if (isSwipingHorizontal.current === false) {
      return;
    }

    if (Math.abs(diffX) > 6) {
      hasMovedRef.current = true;
    }
    setDragOffset(diffX);
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;
    const diffX = dragOffset;
    const duration = Date.now() - dragStartTime.current;
    const velocity = Math.abs(diffX) / Math.max(duration, 1);

    setIsDragging(false);
    setDragOffset(0);

    if (isSwipingHorizontal.current === false) {
      isSwipingHorizontal.current = null;
      return;
    }

    const SWIPE_THRESHOLD = 40;
    if (diffX < -SWIPE_THRESHOLD || (diffX < -15 && velocity > 0.35)) {
      goToNext();
    } else if (diffX > SWIPE_THRESHOLD || (diffX > 15 && velocity > 0.35)) {
      goToPrev();
    }

    isSwipingHorizontal.current = null;
  };

  const handleCardClick = (idx: number) => {
    if (hasMovedRef.current) return;
    if (idx === activeIndex) {
      router.push(`/products/${HAMPER_ITEMS[idx].skuId}`);
    } else {
      setActiveIndex(idx);
    }
  };

  const handleAddToCart = (e: React.MouseEvent, hamper: HamperItem) => {
    e.stopPropagation();
    addToCart({
      id: hamper.id,
      skuId: hamper.skuId,
      name: hamper.name,
      price: hamper.price,
      priceDisplay: hamper.priceDisplay,
      image: hamper.image,
      quantity: 1,
    });

    setAddedIds((prev) => ({ ...prev, [hamper.id]: true }));
    setTimeout(() => {
      setAddedIds((prev) => ({ ...prev, [hamper.id]: false }));
    }, 1500);
  };

  const handleToggleWishlist = (e: React.MouseEvent | React.TouchEvent, hamper: HamperItem) => {
    e.stopPropagation();

    toggleWishlist({
      id: hamper.id,
      name: hamper.name,
      price: hamper.price,
      priceDisplay: hamper.priceDisplay,
      image: hamper.image,
      skuId: hamper.skuId,
    });
  };

  return (
    <section
      ref={sectionRef}
      id="gifting-gallery"
      className="bg-[#123D2D] py-8 sm:py-10 px-2 sm:px-6 md:px-8 border-t border-b border-[#28513B]/40 text-[#E8D9AE] w-full overflow-hidden"
    >
      <div className="mx-auto max-w-[1700px] w-full">
        {/* Section Header */}
        <div className="text-center max-w-5xl mx-auto mb-4 sm:mb-6 px-4">
          <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-medium tracking-tight leading-tight text-[#E8D9AE]">
            Artisanal Luxury Hampers &amp; Gift Suites
          </h2>
        </div>

        {/* 3D Coverflow Carousel Stage */}
        <div className="relative group/gallery w-full">
          {/* Floating Left Navigation Arrow */}
          <button
            type="button"
            onClick={goToPrev}
            aria-label="Previous hamper"
            className="absolute left-2 sm:left-4 lg:left-8 top-1/2 -translate-y-1/2 z-40 w-10 h-10 sm:w-11 sm:h-11 lg:w-12 lg:h-12 rounded-full bg-[#092B20]/90 hover:bg-[#28513B] text-[#E8D9AE] hover:text-[#C5A45B] border border-[#28513B] hover:border-[#C5A45B] flex items-center justify-center transition-all duration-200 cursor-pointer backdrop-blur-xs hover:scale-105 active:scale-95 shadow-md"
          >
            <ChevronLeft className="w-5 h-5 stroke-[2.2]" />
          </button>

          {/* Floating Right Navigation Arrow */}
          <button
            type="button"
            onClick={goToNext}
            aria-label="Next hamper"
            className="absolute right-2 sm:right-4 lg:right-8 top-1/2 -translate-y-1/2 z-40 w-10 h-10 sm:w-11 sm:h-11 lg:w-12 lg:h-12 rounded-full bg-[#092B20]/90 hover:bg-[#28513B] text-[#E8D9AE] hover:text-[#C5A45B] border border-[#28513B] hover:border-[#C5A45B] flex items-center justify-center transition-all duration-200 cursor-pointer backdrop-blur-xs hover:scale-105 active:scale-95 shadow-md"
          >
            <ChevronRight className="w-5 h-5 stroke-[2.2]" />
          </button>

          {/* 3D Perspective Stage Container */}
          <div
            ref={stageRef}
            data-lenis-prevent
            className="relative w-full overflow-hidden select-none cursor-grab active:cursor-grabbing py-1 sm:py-2 touch-pan-y"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onMouseDown={handleMouseDown}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onTouchCancel={handleTouchEnd}
            style={{
              perspective: isMobile ? "900px" : "1250px",
              perspectiveOrigin: "center 48%",
              userSelect: "none",
              WebkitUserSelect: "none",
            }}
          >
            {/* Stage Track Holding All 3D Cards */}
            <div
              className="relative w-full h-[385px] xs:h-[400px] sm:h-[430px] md:h-[465px] lg:h-[480px] flex items-center justify-center"
              style={{ transformStyle: "preserve-3d" }}
            >
              {HAMPER_ITEMS.map((hamper, idx) => {
                const N = HAMPER_ITEMS.length;
                let rawDiff = idx - activeIndex;
                let diff = ((rawDiff % N) + N) % N;
                if (diff > N / 2) diff -= N;

                const currentOffset = diff + (spacing > 0 ? dragOffset / spacing : 0);
                const absOffset = Math.abs(currentOffset);
                const sign = Math.sign(currentOffset);

                const isVisible = absOffset <= 3.2;
                if (!isVisible) return null;

                const translateX = currentOffset * (spacing * 0.92);
                const translateZ = 60 - Math.min(absOffset, 3) * 110;

                let rotateY = 0;
                if (absOffset > 0.001) {
                  rotateY = -sign * Math.min(38 + (absOffset - 1) * 7, 46);
                }

                const scale = Math.max(0.68, 1.02 - absOffset * 0.13);

                let opacity = 1;
                if (absOffset <= 1) {
                  opacity = 1 - absOffset * 0.22;
                } else if (absOffset <= 2) {
                  opacity = 0.78 - (absOffset - 1) * 0.36;
                } else if (absOffset <= 3) {
                  opacity = Math.max(0, 0.42 - (absOffset - 2) * 0.42);
                } else {
                  opacity = 0;
                }

                const zIndex = Math.round(40 - Math.min(absOffset, 4) * 10);
                const isCenter = Math.abs(currentOffset) < 0.48;

                const galleryList = [hamper.image];
                const activeImgIdx = cardImgIdx[hamper.id] || 0;
                const currentDisplayImg = galleryList[activeImgIdx] || hamper.image;

                const isWishlisted = isInWishlist(hamper.id) || (hamper.skuId ? isInWishlist(hamper.skuId) : false);

                return (
                  <div
                    key={hamper.id}
                    onClick={() => handleCardClick(idx)}
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                    style={{
                      width: `${cardWidth}px`,
                      transform: `translate3d(calc(-50% + ${translateX}px), -50%, ${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`,
                      opacity,
                      zIndex,
                      transformOrigin: "center center",
                      transformStyle: "preserve-3d",
                      transition: isDragging
                        ? "transform 0.04s ease-out, opacity 0.04s ease-out"
                        : "transform 0.6s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.6s cubic-bezier(0.22, 1, 0.36, 1)",
                      pointerEvents: isVisible ? "auto" : "none",
                    }}
                    className="absolute left-1/2 top-1/2 flex flex-col justify-between group select-none will-change-transform cursor-pointer"
                  >
                    {/* Card Container */}
                    <div className="relative rounded-lg sm:rounded-2xl transition-all duration-300 flex flex-col w-full">
                      {/* Portrait Product Image Canvas (Aspect 3:4) */}
                      <div
                        className={`relative aspect-[3/4] w-full overflow-hidden rounded-lg sm:rounded-2xl bg-[#092B20] border transition-all duration-300 flex items-center justify-center group/img ${isCenter
                          ? "border-[#C5A45B]/90 shadow-xl"
                          : "border-white/20"
                          }`}
                      >
                        <Image
                          src={currentDisplayImg}
                          alt={hamper.name}
                          fill
                          draggable={false}
                          loading={absOffset <= 1 ? "eager" : "lazy"}
                          className={`w-full h-full object-cover object-center ${isCenter ? "group-hover:scale-105" : ""} transition-transform duration-500 select-none pointer-events-none`}
                          sizes="(max-width: 640px) 270px, (max-width: 1024px) 305px, 335px"
                        />

                        {/* Wishlist Heart Button on Upper Right */}
                        <button
                          type="button"
                          onMouseDown={(e) => {
                            e.stopPropagation();
                          }}
                          onTouchStart={(e) => {
                            e.stopPropagation();
                          }}
                          onClick={(e) => handleToggleWishlist(e, hamper)}
                          title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
                          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
                          className="group/btn absolute top-3 right-3 z-40 p-1 sm:p-1.5 flex items-center justify-center transition-all duration-300 active:scale-90 cursor-pointer pointer-events-auto bg-transparent border-none text-white hover:scale-110"
                        >
                          <Heart
                            className={`w-4.5 h-4.5 sm:w-5 sm:h-5 transition-all duration-300 stroke-white stroke-[2.2] drop-shadow-[0_1px_4px_rgba(0,0,0,0.85)] ${isWishlisted
                              ? "fill-white text-white scale-110 drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]"
                              : "fill-transparent text-white group-hover/btn:scale-110"
                              }`}
                          />
                        </button>

                        {/* Side Vignette Fade Overlay for non-center cards */}
                        {!isCenter && (
                          <div
                            className="absolute inset-0 bg-black/30 pointer-events-none transition-opacity duration-300"
                            style={{ opacity: Math.min(0.6, absOffset * 0.3) }}
                          />
                        )}

                        {/* In-Card Slide Indicator Dots */}
                        {galleryList.length > 1 && (
                          <div className="absolute bottom-2.5 inset-x-0 flex items-center justify-center gap-1.5 z-10 pointer-events-auto">
                            {galleryList.map((_, i) => (
                              <button
                                key={i}
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setCardImgIdx((prev) => ({ ...prev, [hamper.id]: i }));
                                }}
                                aria-label={`Show image ${i + 1}`}
                                className={`transition-all duration-300 rounded-full cursor-pointer shadow-xs ${i === activeImgIdx
                                  ? "w-2.5 h-1.5 bg-[#C5A45B] shadow-md"
                                  : "w-1.5 h-1.5 bg-[#28513B] hover:bg-[#28513B]/80"
                                  }`}
                              />
                            ))}
                          </div>
                        )}

                        {/* In-Card Left/Right Chevrons for Center Card on Hover */}
                        {isCenter && galleryList.length > 1 && (
                          <>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setCardImgIdx((prev) => ({
                                  ...prev,
                                  [hamper.id]: (activeImgIdx - 1 + galleryList.length) % galleryList.length,
                                }));
                              }}
                              title="Previous image"
                              aria-label="Previous image"
                              className="absolute left-1.5 top-1/2 -translate-y-1/2 w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-opacity duration-200 backdrop-blur-xs z-20 cursor-pointer shadow-md"
                            >
                              <ChevronLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.2]" />
                            </button>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setCardImgIdx((prev) => ({
                                  ...prev,
                                  [hamper.id]: (activeImgIdx + 1) % galleryList.length,
                                }));
                              }}
                              title="Next image"
                              aria-label="Next image"
                              className="absolute right-1.5 top-1/2 -translate-y-1/2 w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-opacity duration-200 backdrop-blur-xs z-20 cursor-pointer shadow-md"
                            >
                              <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.2]" />
                            </button>
                          </>
                        )}

                        {/* Hover Details Overlay pinned at the bottom end of the image - only shown on front center card */}
                        <div
                          className={`absolute bottom-0 inset-x-0 z-30 pt-4 pb-2.5 px-3 sm:px-3.5 transition-all duration-300 ${
                            isCenter
                              ? "opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 max-sm:opacity-100 max-sm:translate-y-0 pointer-events-auto"
                              : "opacity-0 pointer-events-none translate-y-2"
                          }`}
                        >
                          <div className="flex items-start justify-between gap-1.5 sm:gap-2">
                            <div className="space-y-0.5 sm:space-y-1 min-w-0 flex-1">
                              <h3 className="font-serif text-xs sm:text-[13.5px] font-medium text-white transition-colors truncate drop-shadow-[0_1px_3px_rgba(0,0,0,0.85)]">
                                {hamper.name}
                              </h3>
                              <div className="flex items-center gap-1.5">
                                <span className="text-xs sm:text-[12.5px] font-medium text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.85)]">
                                  RS. {hamper.price.toLocaleString("en-IN")}
                                </span>
                                {hamper.originalPrice && (
                                  <span className="text-[10px] sm:text-[11px] text-white/70 line-through drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                                    {hamper.originalPrice}
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Add to Cart Quick Icon (+ icon) */}
                            <button
                              type="button"
                              onClick={(e) => handleAddToCart(e, hamper)}
                              aria-label={`Add ${hamper.name} to cart`}
                              className="p-1 text-white hover:text-white/80 transition-transform hover:scale-110 cursor-pointer shrink-0 mt-0.5 active:scale-95 drop-shadow-[0_1px_3px_rgba(0,0,0,0.85)]"
                              title="Add to Cart"
                            >
                              {addedIds[hamper.id] ? (
                                <Check className="w-4 h-4 text-white stroke-[2.5]" />
                              ) : (
                                <Plus className="w-4 h-4 text-white stroke-[2.2]" />
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
