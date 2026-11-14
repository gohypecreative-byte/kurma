"use client";

import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { ShoppingBag, Check, X, Bookmark, SlidersHorizontal, Plus, ChevronLeft, ChevronRight } from "lucide-react";
import { useCart } from "@/lib/cart-context";

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
    image: "/images/product/image7.png",
    description: "An elegant gift presentation featuring a handwoven wicker basket, silk gift pouch with gold tie, handcrafted Ganesha medallion, and 3 luxury agarbatti stick boxes.",
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
    image: "/images/product/earth-front.png",
    description: "Elevate your meditation sanctuary with this serene wooden pedestal set featuring a gold-draped Buddha idol and five elemental agarbatti boxes.",
    inclusions: ["Meditative Buddha Idol", "Polished Hardwood Burner Base", "5 Elemental Agarbatti Suites (135 sticks)", "Kurma Ritual Guide"]
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
    image: "/images/product/fire-front.png",
    description: "A thoughtful gift tray for tea lovers and mindfulness seekers, combining a premium ceramic cup, artisanal tin of Hibiscus Tea, and 3 luxury agarbatti stick boxes.",
    inclusions: ["Handcrafted Leatherette Tray", "Artisan Ceramic Cup", "Tin of Organic Hibiscus Tea", "3 Luxury Agarbatti Suites", "Brass Diya Holder"]
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
    image: "/images/product/water-front.png",
    description: "Unbox timeless tradition with this vintage wooden slatted chest housing premium agarbatti boxes and a rustic burlap pouch with a handcrafted seal.",
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
    image: "/images/product/air-front.png",
    description: "Crafted for festive rituals and daily prayers, this tray includes an engraved brass thali, twin brass oil lamps, a golden Ganesha idol, and fragrant agarbatti packs.",
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
    image: "/images/product/space-front.png",
    description: "Bring peace and positive energy to any home with this pine crate featuring healing quartz crystals, aromatic agarbatti packs, and sacred cleansing accessories.",
    inclusions: ["Natural Pine Crate", "Healing Crystals & Rose Quartz", "4 Fragrance Agarbatti Packs", "Brass Incense Holder"]
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
    image: "/images/product/image8.png",
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
    image: "/images/product/image9.png",
    description: "Make milestone celebrations unforgettable with this decorative wicker hamper complete with a solid brass turtle burner, silk gift pouch, and soothing agarbatti suites.",
    inclusions: ["Handwoven Wicker Tray", "Solid Brass Turtle Holder", "Handcrafted Silk Gift Pouch", "3 Fragrance Agarbatti Suites"]
  },
  {
    id: "hamper-9",
    skuId: "ancient-mantra-wooden-scroll-box",
    name: "Ancient Mantra Wooden Scroll & Mala Box",
    subtitle: "Engraved wooden scroll box with Ganesha emblem, Rudraksha mala & agarbatti",
    price: 5499,
    priceDisplay: "₹5,499",
    originalPrice: "₹6,200",
    category: "crates",
    tag: "Heirloom Edition",
    rating: 5.0,
    reviewsCount: 65,
    image: "/images/product/image1.png",
    description: "An heirloom treasure box featuring Sanskrit mantra engravings, Ganesha artwork, 108 Rudraksha prayer beads, brass lamp, and 3 agarbatti suites.",
    inclusions: ["Engraved Hardwood Chest", "Sanskrit Mantra Scroll Artwork", "108 Rudraksha Meditation Mala", "3 Agarbatti Suites & Brass Diya"]
  },
  {
    id: "hamper-10",
    skuId: "zen-boat-botanical-gift-set",
    name: "Zen Boat Burner & Botanical Gift Set",
    subtitle: "Sculpted wooden boat holder, dried magnolia bloom & natural agarbatti",
    price: 2799,
    priceDisplay: "₹2,799",
    originalPrice: "₹3,299",
    category: "brass",
    tag: "Minimalist Elegance",
    rating: 4.9,
    reviewsCount: 37,
    image: "/images/product/image2.png",
    description: "A tranquil arrangement featuring a hand-carved wooden boat burner, preserved lotus/magnolia flower, and organic botanical agarbatti sticks.",
    inclusions: ["Sculpted Wooden Boat Burner", "Preserved Botanical Bloom", "2 Botanical Agarbatti Suites", "Linen Gift Ribbon"]
  },
  {
    id: "hamper-11",
    skuId: "golden-lotus-saffron-leatherette-suite",
    name: "Golden Lotus & Saffron Fragrance Suite",
    subtitle: "Golden stitched leatherette tray, brass elephant burner & saffron agarbatti",
    price: 4199,
    priceDisplay: "₹4,199",
    originalPrice: "₹4,899",
    category: "leatherette",
    tag: "Artisan Gold",
    rating: 5.0,
    reviewsCount: 51,
    image: "/images/product/image3.png",
    description: "An opulent gift tray featuring brass lotus candle diyas, a brass elephant burner, and three luxury saffron agarbatti stick boxes.",
    inclusions: ["Stitched Leatherette Gift Tray", "Brass Elephant Incense Burner", "3 Brass Lotus Candle Diyas", "Saffron Fragrance Suite"]
  },
  {
    id: "hamper-12",
    skuId: "vedic-heritage-brass-incense-chest",
    name: "Vedic Heritage Brass & Incense Chest",
    subtitle: "Carved teakwood tray, spherical brass incense urn & oil lamp",
    price: 4899,
    priceDisplay: "₹4,899",
    originalPrice: "₹5,600",
    category: "brass",
    tag: "Heritage Special",
    rating: 4.9,
    reviewsCount: 44,
    image: "/images/product/image4.png",
    description: "A sacred devotional gift set housed in a carved dark teakwood tray, complete with engraved brass incense urn, traditional brass oil lamp, and sandalwood agarbatti boxes.",
    inclusions: ["Carved Teakwood Serving Tray", "Engraved Brass Incense Urn", "Traditional Brass Oil Lamp", "Mysore Sandalwood Agarbatti Boxes"]
  }
];

export function GiftingGallery() {
  const router = useRouter();
  const { addToCart } = useCart();
  const [selectedHamper, setSelectedHamper] = useState<HamperItem | null>(null);
  const [addedIds, setAddedIds] = useState<Record<string, boolean>>({});
  const [likedIds, setLikedIds] = useState<Record<string, boolean>>({});
  const [cardImgIdx, setCardImgIdx] = useState<Record<string, number>>({});
  const [mounted, setMounted] = useState(false);

  // 3D Coverflow active index & drag state
  const [activeIndex, setActiveIndex] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [viewportWidth, setViewportWidth] = useState(1200);

  const stageRef = useRef<HTMLDivElement>(null);
  const dragStartX = useRef(0);
  const touchStartY = useRef(0);
  const dragStartTime = useRef(0);
  const hasMovedRef = useRef(false);
  const isSwipingHorizontal = useRef<boolean | null>(null);
  const lastWheelTime = useRef<number>(0);
  const wheelDeltaAccumulator = useRef<number>(0);

  // Responsive dimensions
  useEffect(() => {
    setMounted(true);
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

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedHamper || e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === "ArrowLeft") {
        goToPrev();
      } else if (e.key === "ArrowRight") {
        goToNext();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedHamper, goToNext, goToPrev]);

  // Mouse wheel horizontal scrolling
  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;

    const onWheel = (e: WheelEvent) => {
      const isHorizontal = Math.abs(e.deltaX) > Math.abs(e.deltaY);
      const delta = isHorizontal ? e.deltaX : e.deltaY;
      if (Math.abs(delta) < 3) return;

      // Prevent page vertical scroll so horizontal carousel scrolls smoothly
      e.preventDefault();

      const now = Date.now();
      wheelDeltaAccumulator.current += delta;

      // Cooldown between card switches so one wheel notch advances 1 card
      if (now - lastWheelTime.current < 200) return;

      if (Math.abs(wheelDeltaAccumulator.current) > 20) {
        if (wheelDeltaAccumulator.current > 0) {
          goToNext();
        } else {
          goToPrev();
        }
        lastWheelTime.current = now;
        wheelDeltaAccumulator.current = 0;
      }
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [goToNext, goToPrev]);

  // Mouse click-and-drag with window listeners
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    dragStartX.current = e.clientX;
    dragStartTime.current = Date.now();
    hasMovedRef.current = false;
    setIsDragging(true);
  };

  useEffect(() => {
    if (!isDragging) return;

    const onMouseMove = (e: MouseEvent) => {
      const deltaX = e.clientX - dragStartX.current;
      if (Math.abs(deltaX) > 5) {
        hasMovedRef.current = true;
      }
      setDragOffset(deltaX);
    };

    const onMouseUp = (e: MouseEvent) => {
      const deltaX = e.clientX - dragStartX.current;
      const elapsed = Math.max(1, Date.now() - dragStartTime.current);
      const velocity = Math.abs(deltaX) / elapsed;

      setIsDragging(false);
      setDragOffset(0);

      const threshold = spacing * 0.18;
      if (deltaX < -threshold || (deltaX < -20 && velocity > 0.35)) {
        goToNext();
      } else if (deltaX > threshold || (deltaX > 20 && velocity > 0.35)) {
        goToPrev();
      }
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, [isDragging, spacing, goToNext, goToPrev]);

  // Touch swiping on mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length !== 1) return;
    const touch = e.touches[0];
    dragStartX.current = touch.clientX;
    touchStartY.current = touch.clientY;
    dragStartTime.current = Date.now();
    hasMovedRef.current = false;
    isSwipingHorizontal.current = null;
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || e.touches.length !== 1) return;
    const touch = e.touches[0];
    const deltaX = touch.clientX - dragStartX.current;
    const deltaY = touch.clientY - touchStartY.current;

    if (isSwipingHorizontal.current === null) {
      if (Math.abs(deltaX) > 6 || Math.abs(deltaY) > 6) {
        isSwipingHorizontal.current = Math.abs(deltaX) > Math.abs(deltaY);
      }
    }

    if (isSwipingHorizontal.current) {
      if (e.cancelable) e.preventDefault();
      hasMovedRef.current = true;
      setDragOffset(deltaX);
    }
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;
    const deltaX = dragOffset;
    const elapsed = Math.max(1, Date.now() - dragStartTime.current);
    const velocity = Math.abs(deltaX) / elapsed;

    setIsDragging(false);
    setDragOffset(0);

    const threshold = spacing * 0.18;
    if (isSwipingHorizontal.current && (deltaX < -threshold || (deltaX < -20 && velocity > 0.35))) {
      goToNext();
    } else if (isSwipingHorizontal.current && (deltaX > threshold || (deltaX > 20 && velocity > 0.35))) {
      goToPrev();
    }
    isSwipingHorizontal.current = null;
  };

  const handleCardClick = (idx: number, diff: number) => {
    if (hasMovedRef.current) return;
    if (diff === 0) {
      setSelectedHamper(HAMPER_ITEMS[idx]);
    } else {
      setActiveIndex(idx);
    }
  };

  // Lock body scroll and close on Escape key when modal is open
  useEffect(() => {
    if (!selectedHamper) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelectedHamper(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedHamper]);

  const toggleWishlist = (id: string) => {
    setLikedIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleAddToCart = (hamper: HamperItem) => {
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
    }, 2000);
  };

  const modalContent = (
    <AnimatePresence>
      {selectedHamper && (
        <div
          onClick={() => setSelectedHamper(null)}
          className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-5 md:p-6 lg:p-8 bg-stone-950/65 backdrop-blur-sm overflow-y-auto"
          role="dialog"
          aria-modal="true"
          aria-label={selectedHamper.name}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 16 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
            className="bg-[#092B20] rounded-2xl sm:rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl border border-[#28513B] relative flex flex-col md:flex-row max-h-[calc(100dvh-2.5rem)] sm:max-h-[calc(100dvh-3.5rem)] md:max-h-[min(84vh,680px)] min-h-0 my-auto -translate-y-2 sm:-translate-y-4 md:-translate-y-6 lg:-translate-y-8 text-[#E8D9AE]"
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setSelectedHamper(null)}
              className="absolute top-3 right-3 sm:top-4 sm:right-4 z-20 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#123D2D] hover:bg-[#28513B] text-[#E8D9AE] hover:text-[#C5A45B] flex items-center justify-center shadow-md transition-all cursor-pointer border border-[#28513B]"
              aria-label="Close details popup"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            {/* Modal Image */}
            <div className="relative w-full md:w-[45%] lg:w-1/2 h-44 sm:h-56 md:h-auto min-h-0 shrink-0 bg-[#092B20] flex items-center justify-center overflow-hidden border-b md:border-b-0 md:border-r border-[#28513B]/60">
              <Image
                src={selectedHamper.image}
                alt={selectedHamper.name}
                fill
                unoptimized
                className="w-full h-full object-contain p-4 sm:p-6 md:p-8"
                sizes="(max-width: 768px) 100vw, 400px"
              />
            </div>

            {/* Modal Details */}
            <div className="p-5 sm:p-6 md:p-7 lg:p-8 w-full md:w-[55%] lg:w-1/2 flex flex-col justify-between overflow-y-auto min-h-0 scrollbar-thin">
              <div className="space-y-3 sm:space-y-4">
                <h3 className="font-serif text-xl sm:text-2xl text-white font-medium leading-tight">
                  {selectedHamper.name}
                </h3>

                <p className="text-xs sm:text-sm text-[#E8D9AE]/85 leading-relaxed">
                  {selectedHamper.description}
                </p>
              </div>

              {/* Pricing & Cart Action */}
              <div className="mt-5 sm:mt-6 pt-3 sm:pt-4 border-t border-[#28513B]/40 flex items-center justify-between gap-3 shrink-0">
                <div>
                  <span className="text-[10px] sm:text-xs text-[#E8D9AE]/60 block font-medium">Total Suite Price</span>
                  <div className="flex items-baseline gap-1.5 sm:gap-2">
                    <span className="font-serif text-xl sm:text-2xl font-bold text-[#C5A45B]">
                      {selectedHamper.priceDisplay}
                    </span>
                    {selectedHamper.originalPrice && (
                      <span className="text-xs text-[#E8D9AE]/50 line-through">
                        {selectedHamper.originalPrice}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      const targetId = selectedHamper.skuId || selectedHamper.id;
                      setSelectedHamper(null);
                      router.push(`/elements?box=${targetId}`);
                    }}
                    className="bg-[#123D2D] hover:bg-[#28513B] text-[#E8D9AE] py-2.5 sm:py-3 px-3 sm:px-4 rounded-xl sm:rounded-2xl text-xs font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer border border-[#28513B]"
                    title="Customise this hamper"
                  >
                    <SlidersHorizontal className="w-3.5 h-3.5 text-[#C5A45B]" />
                    <span>Customise</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      handleAddToCart(selectedHamper);
                      setSelectedHamper(null);
                    }}
                    className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl bg-[#C5A45B] text-[#092B20] hover:bg-[#E8D9AE] active:scale-95 shadow-md transition-all flex items-center justify-center cursor-pointer shrink-0 font-bold"
                    title="Add to Bag"
                    aria-label="Add to Bag"
                  >
                    <ShoppingBag className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  return (
    <section id="gifting-gallery" className="bg-[#123D2D] py-14 sm:py-20 px-2 sm:px-6 md:px-8 lg:py-24 border-t border-b border-[#28513B]/40 text-[#E8D9AE] w-full overflow-hidden mobile-defer-render">
      <div className="mx-auto max-w-[1700px] w-full">
        {/* Section Header */}
        <div className="text-center max-w-5xl mx-auto mb-6 sm:mb-10 px-4">
          <h2 className="font-serif text-2xl xs:text-3xl sm:text-4xl md:text-[44px] lg:text-5xl font-light tracking-tight text-[#E8D9AE] leading-tight">
            Artisanal Luxury Hampers &amp; Gift Suites
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-[#E8D9AE]/70 font-sans tracking-wide">
            Swipe or drag to explore our handcrafted ceremonial gift suites
          </p>
        </div>

        {/* 3D Coverflow Carousel Stage */}
        <div className="relative group/gallery w-full">
          {/* Floating Left Navigation Arrow */}
          <button
            type="button"
            onClick={goToPrev}
            aria-label="Previous hamper"
            className="absolute left-2 sm:left-4 lg:left-8 top-1/2 -translate-y-1/2 z-40 w-10 h-10 sm:w-11 sm:h-11 lg:w-12 lg:h-12 rounded-full bg-[#092B20]/90 hover:bg-[#28513B] text-[#E8D9AE] hover:text-[#C5A45B] border border-[#28513B] hover:border-[#C5A45B] shadow-[0_8px_24px_rgba(0,0,0,0.6)] flex items-center justify-center transition-all duration-200 cursor-pointer backdrop-blur-xs hover:scale-105 active:scale-95"
          >
            <ChevronLeft className="w-5 h-5 stroke-[2.2]" />
          </button>

          {/* Floating Right Navigation Arrow */}
          <button
            type="button"
            onClick={goToNext}
            aria-label="Next hamper"
            className="absolute right-2 sm:right-4 lg:right-8 top-1/2 -translate-y-1/2 z-40 w-10 h-10 sm:w-11 sm:h-11 lg:w-12 lg:h-12 rounded-full bg-[#092B20]/90 hover:bg-[#28513B] text-[#E8D9AE] hover:text-[#C5A45B] border border-[#28513B] hover:border-[#C5A45B] shadow-[0_8px_24px_rgba(0,0,0,0.6)] flex items-center justify-center transition-all duration-200 cursor-pointer backdrop-blur-xs hover:scale-105 active:scale-95"
          >
            <ChevronRight className="w-5 h-5 stroke-[2.2]" />
          </button>

          {/* 3D Perspective Stage Container */}
          <div
            ref={stageRef}
            className="relative w-full overflow-hidden select-none cursor-grab active:cursor-grabbing py-4 sm:py-6 touch-pan-y"
            onMouseDown={handleMouseDown}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            style={{
              perspective: isMobile ? "900px" : "1250px",
              perspectiveOrigin: "center 48%",
              userSelect: "none",
              WebkitUserSelect: "none",
            }}
          >
            {/* Stage Track Holding All 3D Cards */}
            <div
              className="relative w-full h-[470px] xs:h-[495px] sm:h-[530px] md:h-[560px] lg:h-[580px] flex items-center justify-center"
              style={{ transformStyle: "preserve-3d" }}
            >
              {/* Floor Ambient Glow for Active Card */}
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[480px] sm:w-[650px] max-w-full h-24 bg-gradient-to-t from-black/50 via-[#C5A45B]/10 to-transparent blur-2xl pointer-events-none -z-10" />

              {HAMPER_ITEMS.map((hamper, idx) => {
                const N = HAMPER_ITEMS.length;
                let rawDiff = idx - activeIndex;
                let diff = ((rawDiff % N) + N) % N;
                if (diff > N / 2) diff -= N;

                const currentOffset = diff + (spacing > 0 ? dragOffset / spacing : 0);
                const absOffset = Math.abs(currentOffset);
                const sign = Math.sign(currentOffset);

                // Hide cards far out of view for peak rendering performance
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

                // Card images
                const galleryList = Array.from(
                  new Set([
                    hamper.image,
                    "/images/product/image7.png",
                    "/images/product/image8.png",
                    "/images/product/image9.png",
                  ])
                );
                const activeImgIdx = cardImgIdx[hamper.id] || 0;
                const currentDisplayImg = galleryList[activeImgIdx] || hamper.image;

                return (
                  <div
                    key={hamper.id}
                    onClick={() => handleCardClick(idx, diff)}
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
                    className={`absolute left-1/2 top-1/2 flex flex-col justify-between group select-none will-change-transform ${
                      isCenter ? "cursor-default" : "cursor-pointer"
                    }`}
                  >
                    {/* Card Container */}
                    <div
                      className={`relative rounded-2xl transition-all duration-300 flex flex-col w-full ${
                        isCenter
                          ? "drop-shadow-[0_20px_45px_rgba(0,0,0,0.7)]"
                          : "drop-shadow-[0_8px_20px_rgba(0,0,0,0.45)]"
                      }`}
                    >
                      {/* Portrait Product Image Canvas (Aspect 3:4) */}
                      <div
                        className={`relative aspect-[3/4] w-full overflow-hidden rounded-2xl bg-[#092B20] border transition-all duration-300 flex items-center justify-center group/img ${
                          isCenter
                            ? "border-[#C5A45B]/80 shadow-[0_0_28px_rgba(197,164,91,0.22)]"
                            : "border-[#28513B]/60"
                        }`}
                      >
                        <Image
                          src={currentDisplayImg}
                          alt={hamper.name}
                          fill
                          draggable={false}
                          loading={absOffset <= 1 ? "eager" : "lazy"}
                          className="w-full h-full object-contain object-center group-hover:scale-104 transition-transform duration-500 p-2.5 sm:p-3.5 select-none pointer-events-none"
                          sizes="(max-width: 640px) 270px, (max-width: 1024px) 305px, 335px"
                        />

                        {/* Bookmark Wishlist Icon Top-Right inside image */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleWishlist(hamper.id);
                          }}
                          aria-label="Save to Wishlist"
                          className="absolute top-3 right-3 z-10 p-1.5 rounded-full bg-black/45 hover:bg-black/70 text-[#E8D9AE] backdrop-blur-xs drop-shadow-sm transition-transform active:scale-90 hover:scale-110 cursor-pointer"
                        >
                          <Bookmark
                            className={`w-4 h-4 transition-colors ${
                              likedIds[hamper.id]
                                ? "fill-[#C5A45B] text-[#C5A45B] stroke-[2]"
                                : "fill-transparent text-[#E8D9AE] stroke-[2]"
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
                                className={`transition-all duration-300 rounded-full cursor-pointer shadow-xs ${
                                  i === activeImgIdx
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
                      </div>

                      {/* Card Details & Pricing */}
                      <div className="mt-2.5 px-0.5 flex items-start justify-between gap-1.5 sm:gap-2">
                        <div className="space-y-0.5 sm:space-y-1 min-w-0 flex-1">
                          <h3 className="font-serif text-xs sm:text-[13.5px] font-medium text-white group-hover:text-[#C5A45B] transition-colors truncate">
                            {hamper.name}
                          </h3>
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs sm:text-[12.5px] font-medium text-[#C5A45B]">
                              RS. {hamper.price.toLocaleString("en-IN")}
                            </span>
                            {hamper.originalPrice && (
                              <span className="text-[10px] sm:text-[11px] text-[#E8D9AE]/50 line-through">
                                {hamper.originalPrice}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Quick Action Icons */}
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              router.push(`/elements?box=${hamper.skuId || hamper.id}`);
                            }}
                            className="p-1 text-[#C5A45B] hover:text-[#E8D9AE] transition-colors cursor-pointer"
                            title="Customise this hamper"
                          >
                            <SlidersHorizontal className="w-3.5 h-3.5 stroke-[1.8]" />
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAddToCart(hamper);
                            }}
                            className="p-1 text-[#E8D9AE] hover:text-[#C5A45B] transition-colors cursor-pointer"
                            title="Add to Cart"
                          >
                            {addedIds[hamper.id] ? (
                              <Check className="w-3.5 h-3.5 text-[#C5A45B] stroke-[2.5]" />
                            ) : (
                              <Plus className="w-3.5 h-3.5 stroke-[1.8]" />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Floor Reflection / Ambient Shadow beneath card */}
                    <div
                      className="absolute -bottom-6 inset-x-4 h-6 bg-black/60 blur-md rounded-full pointer-events-none transition-opacity duration-300"
                      style={{
                        transform: "rotateX(75deg)",
                        opacity: isCenter ? 0.75 : 0.35,
                      }}
                    />
                    {isCenter && (
                      <div
                        className="absolute -bottom-9 inset-x-2 h-8 bg-[#C5A45B]/15 blur-xl rounded-full pointer-events-none"
                        style={{ transform: "rotateX(80deg)" }}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Interactive Horizontal Scrollbar Track & Page Dots */}
          <div className="flex flex-col items-center justify-center gap-2.5 pt-5 sm:pt-6 select-none">
            {/* Horizontal Scrubber Scrollbar */}
            <div
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
                const newIndex = Math.min(HAMPER_ITEMS.length - 1, Math.floor(ratio * HAMPER_ITEMS.length));
                setActiveIndex(newIndex);
              }}
              className="relative w-44 sm:w-60 h-1.5 bg-[#092B20] border border-[#28513B] rounded-full overflow-hidden cursor-pointer group/track shadow-inner"
              title="Click to scroll through hampers"
            >
              <div
                className="absolute top-0 bottom-0 rounded-full bg-gradient-to-r from-[#C5A45B] via-[#E8D9AE] to-[#C5A45B] shadow-[0_0_8px_rgba(197,164,91,0.5)] transition-all duration-300"
                style={{
                  left: `${(activeIndex / HAMPER_ITEMS.length) * 100}%`,
                  width: `${(1 / HAMPER_ITEMS.length) * 100}%`,
                }}
              />
            </div>

            {/* Indicator Dots */}
            <div className="flex items-center justify-center gap-1.5">
              {HAMPER_ITEMS.map((_, dotIdx) => (
                <button
                  key={dotIdx}
                  type="button"
                  onClick={() => setActiveIndex(dotIdx)}
                  aria-label={`Go to hamper ${dotIdx + 1}`}
                  className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                    activeIndex === dotIdx
                      ? "w-8 bg-[#C5A45B] shadow-[0_0_8px_rgba(197,164,91,0.6)]"
                      : "w-2 bg-[#28513B] hover:bg-[#C5A45B]/60"
                  }`}
                />
              ))}
            </div>
            <span className="font-serif text-[11px] text-[#E8D9AE]/60 tracking-widest uppercase">
              {String(activeIndex + 1).padStart(2, "0")} / {String(HAMPER_ITEMS.length).padStart(2, "0")}
            </span>
          </div>
        </div>
      </div>

      {/* Quick View Modal rendered via Portal */}
      {mounted && typeof document !== "undefined"
        ? createPortal(modalContent, document.body)
        : modalContent}
    </section>
  );
}
