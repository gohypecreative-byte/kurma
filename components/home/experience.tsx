"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence, useReducedMotion, useScroll, useSpring, useTransform } from "motion/react";
import { ShoppingCart, Check, ChevronDown, ChevronLeft, ChevronRight, Heart } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { useWishlist } from "@/lib/wishlist-context";
import { GiftingGallery } from "@/components/home/gifting-gallery";

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  return (
    <motion.div
      aria-hidden="true"
      className="hidden sm:block fixed left-0 top-0 z-[60] h-[3px] w-full origin-left bg-[#C5A45B] pointer-events-none"
      style={{ scaleX: scrollYProgress }}
    />
  );
}

const BESTSELLER_ITEMS = [
  {
    id: "bestseller-1",
    skuId: "5-elements-suite",
    name: "Sacred Buddha & Turtle Suite",
    categoryTag: "ALL PRODUCTS",
    shortDesc: "Polished hardwood stand, hand-finished Buddha & brass turtle burner",
    price: 4299,
    priceDisplay: "₹4,299",
    originalPrice: "₹4,999",
    image: "/images/product/suite-portrait.jpg",
    cleanImage: "/images/product/suite-clean.png",
    video: "/videos/incense-burn.mp4",
    images: [
      "/images/product/suite-portrait.jpg",
      "/images/product/suite-clean.png",
      "/images/product/image7.png",
      "/images/product/five-boxes-3d.png",
    ],
  },
  {
    id: "bestseller-2",
    skuId: "mdf-gift-box",
    name: "Heirloom Brass Turtle Trunk",
    categoryTag: "ALL PRODUCTS",
    shortDesc: "Slatted wooden chest, natural jute sack & brass turtle incense stand",
    price: 4599,
    priceDisplay: "₹4,599",
    image: "/images/product/trunk-portrait.jpg",
    cleanImage: "/images/product/mdf-box-clean.png",
    video: "/videos/incense-burn.mp4",
    images: [
      "/images/product/trunk-portrait.jpg",
      "/images/product/mdf-box-clean.png",
      "/images/product/image8.png",
      "/images/product/turtle-holder-clean.png",
    ],
  },
  {
    id: "bestseller-3",
    skuId: "fragrance-earth",
    name: "The Luxe Beauty Ritual",
    categoryTag: "ALL PRODUCTS",
    shortDesc: "This blush-toned beauty box is basically luxury wrapped in gold",
    price: 2899,
    priceDisplay: "₹2,899",
    originalPrice: "₹5,699",
    image: "/images/product/earth-portrait.jpg",
    cleanImage: "/images/product/earth-front.png",
    video: "/videos/incense-burn.mp4",
    images: [
      "/images/product/earth-portrait.jpg",
      "/images/product/earth-front.png",
      "/images/product/earth-3d.png",
      "/images/product/suite-clean.png",
    ],
  },
  {
    id: "bestseller-4",
    skuId: "fragrance-fire",
    name: "Vedic Heritage Brass Chest",
    categoryTag: "ALL PRODUCTS",
    shortDesc: "Carved teakwood tray, spherical brass incense urn & oil lamp",
    price: 4899,
    priceDisplay: "₹4,899",
    image: "/images/product/fire-portrait.jpg",
    cleanImage: "/images/product/fire-front.png",
    video: "/videos/incense-burn.mp4",
    images: [
      "/images/product/fire-portrait.jpg",
      "/images/product/fire-front.png",
      "/images/product/fire-3d.png",
      "/images/product/trunk-portrait.jpg",
    ],
  },
  {
    id: "bestseller-5",
    skuId: "marble-gift-box",
    name: "Elements in Harmony Marble Trunk",
    categoryTag: "FLAGSHIP SUITE",
    shortDesc: "Emerald-veined marble trunk with all 5 Element fragrances & brass insignia",
    price: 4999,
    priceDisplay: "₹4,999",
    originalPrice: "₹5,999",
    image: "/images/product/marble-portrait.jpg",
    cleanImage: "/images/product/marble-box-clean.png",
    video: "/videos/incense-burn.mp4",
    images: [
      "/images/product/marble-portrait.jpg",
      "/images/product/marble-box-clean.png",
      "/images/product/suite-clean.png",
      "/images/product/image9.png",
    ],
  },
  {
    id: "bestseller-6",
    skuId: "brass-turtle-holder",
    name: "Handcrafted Solid Brass Turtle Stand",
    categoryTag: "SACRED ACCESSORY",
    shortDesc: "Cast virgin brass burner symbolizing longevity, stability & grounded energy",
    price: 899,
    priceDisplay: "₹899",
    originalPrice: "₹1,199",
    image: "/images/product/turtle-holder-portrait.jpg",
    cleanImage: "/images/product/turtle-holder-clean.png",
    video: "/videos/incense-burn.mp4",
    images: [
      "/images/product/turtle-holder-portrait.jpg",
      "/images/product/turtle-holder-clean.png",
      "/images/product/medallion-clean.png",
      "/images/product/image7.png",
    ],
  },
  {
    id: "bestseller-7",
    skuId: "fragrance-water",
    name: "Water (Jal) Luxury Incense Sticks",
    categoryTag: "ELEMENTAL BLEND",
    shortDesc: "Blue lotus, aquatic mist and fresh vetiver for emotional clarity & calm",
    price: 499,
    priceDisplay: "₹499",
    originalPrice: "₹599",
    image: "/images/product/water-portrait.jpg",
    cleanImage: "/images/product/water-front.png",
    video: "/videos/incense-burn.mp4",
    images: [
      "/images/product/water-portrait.jpg",
      "/images/product/water-front.png",
      "/images/product/water-3d.png",
      "/images/product/suite-clean.png",
    ],
  },
  {
    id: "bestseller-8",
    skuId: "fragrance-space",
    name: "Space (Akash) Cosmic Incense Sticks",
    categoryTag: "ELEMENTAL BLEND",
    shortDesc: "Sacred frankincense, myrrh and Himalayan deodar cedar for deep dhyana",
    price: 499,
    priceDisplay: "₹499",
    originalPrice: "₹599",
    image: "/images/product/space-portrait.jpg",
    cleanImage: "/images/product/space-front.png",
    video: "/videos/incense-burn.mp4",
    images: [
      "/images/product/space-portrait.jpg",
      "/images/product/space-front.png",
      "/images/product/space-3d.png",
      "/images/product/air-portrait.jpg",
    ],
  },
];



const questions = [
  [
    "What is inside the marble gift trunk?",
    "The Elements in Harmony trunk brings together all five fragrance boxes (135 sticks in total), a solid brass turtle incense stand, a keepsake medallion, a tassel bookmark, and the Kurma ritual guide. You can review the full contents and available extras in the product customizer.",
  ],
  [
    "Can I personalise my gift?",
    "Yes. Select a product and choose its personalisation options before adding it to your bag. Options vary by piece, from a brass plaque or monogram to a gift message, ribbon, or lining. Your selections appear in the cart for review.",
  ],
  [
    "Can I try just one element?",
    "Each element is available individually in a box of 27 incense sticks. Explore Earth, Water, Fire, Air, and Space above, or choose the complete five-element suite to discover the full collection.",
  ],
  [
    "How do I care for the keepsake pieces?",
    "Keep the trunk dry and wipe it gently with a soft cloth. Let the brass holder cool completely before removing ash. Avoid abrasive cleaners, and store unused incense in a cool, dry place away from moisture.",
  ],
];

function BestsellerCard({
  item,
  isLiked,
  isAdded,
  onToggleWishlist,
  onAddToCart,
  isDuplicate = false,
}: {
  item: (typeof BESTSELLER_ITEMS)[0];
  isLiked: boolean;
  isAdded: boolean;
  onToggleWishlist: (id: string) => void;
  onAddToCart: (item: (typeof BESTSELLER_ITEMS)[0]) => void;
  isDuplicate?: boolean;
}) {
  const router = useRouter();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const isWishlisted = isInWishlist(item.id) || isInWishlist(item.skuId) || isLiked;
  const [activeIdx, setActiveIdx] = useState(0);
  const images = item.images && item.images.length > 0 ? item.images : [item.image];
  const currentImg = images[activeIdx] || item.image;

  // Track touch drag movement to prevent accidental clicks while swiping horizontally
  const touchStartXRef = useRef(0);
  const touchStartYRef = useRef(0);
  const hasDraggedRef = useRef(false);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches[0]) {
      touchStartXRef.current = e.touches[0].clientX;
      touchStartYRef.current = e.touches[0].clientY;
      hasDraggedRef.current = false;
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches[0]) {
      const dx = Math.abs(e.touches[0].clientX - touchStartXRef.current);
      const dy = Math.abs(e.touches[0].clientY - touchStartYRef.current);
      if (dx > 8 || dy > 8) {
        hasDraggedRef.current = true;
      }
    }
  };

  const handleCardClick = () => {
    if (hasDraggedRef.current) return;
    router.push(`/products/${item.skuId}`);
  };

  return (
    <div
      onClick={handleCardClick}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      draggable={false}
      onDragStart={(e) => e.preventDefault()}
      className={`flex-shrink-0 w-[88%] sm:w-[calc(50%-0.75rem)] lg:w-[calc(25%-1.125rem)] lg:snap-start group relative flex flex-col cursor-pointer select-none transition-all duration-300 ${
        isDuplicate ? "lg:hidden" : ""
      }`}
    >
      {/* Modern Image Canvas with in-card scrolling/carousel */}
      <div className="relative w-full aspect-[3/4] overflow-hidden rounded-lg sm:rounded-2xl bg-transparent flex items-center justify-center">
        <Image
          src={currentImg}
          alt={item.name}
          fill
          loading="lazy"
          draggable={false}
          className={`absolute inset-0 w-full h-full pointer-events-none select-none ${
            currentImg.includes("portrait") ? "object-cover" : "object-contain p-1 sm:p-1.5"
          } object-center group-hover:scale-105 transition-all duration-500 ease-out`}
          sizes="(max-width: 640px) 85vw, (max-width: 1024px) 50vw, 25vw"
        />

        {/* Wishlist Heart Button on Upper Right */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggleWishlist(item.id);
            toggleWishlist({
              id: item.id,
              name: item.name,
              price: item.price,
              priceDisplay: item.priceDisplay,
              image: currentImg,
              skuId: item.skuId,
            });
          }}
          title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
          className="group/btn absolute top-2.5 right-2.5 z-20 p-1 sm:p-1.5 flex items-center justify-center transition-all duration-300 active:scale-90 cursor-pointer bg-transparent border-none text-white hover:scale-110"
        >
          <Heart
            className={`w-4.5 h-4.5 sm:w-5 sm:h-5 transition-all duration-300 stroke-white stroke-[2.2] drop-shadow-[0_1px_4px_rgba(0,0,0,0.85)] ${
              isWishlisted
                ? "fill-white text-white scale-110 drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]"
                : "fill-transparent text-white group-hover/btn:scale-110"
            }`}
          />
        </button>

        {/* Previous & Next Carousel Navigation Arrows (visible on hover) */}
        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setActiveIdx((prev) => (prev - 1 + images.length) % images.length);
              }}
              title="Previous image"
              aria-label="Previous image"
              className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 backdrop-blur-xs z-20 cursor-pointer shadow-md"
            >
              <ChevronLeft className="w-4 h-4 stroke-[2.2]" />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setActiveIdx((prev) => (prev + 1) % images.length);
              }}
              title="Next image"
              aria-label="Next image"
              className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 backdrop-blur-xs z-20 cursor-pointer shadow-md"
            >
              <ChevronRight className="w-4 h-4 stroke-[2.2]" />
            </button>
          </>
        )}

        {/* Slide Indicator Dots at Bottom Center (Hidden on Mobile) */}
        {images.length > 1 && (
          <div className="hidden md:flex absolute bottom-2.5 inset-x-0 items-center justify-center gap-1.5 z-20">
            {images.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveIdx(idx);
                }}
                aria-label={`Go to image ${idx + 1}`}
                className={`transition-all duration-300 rounded-full cursor-pointer ${
                  idx === activeIdx
                    ? "w-2.5 h-1.5 bg-stone-900 shadow-xs"
                    : "w-1.5 h-1.5 bg-stone-400/60 hover:bg-stone-600"
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Minimalist Info Row Directly Beneath Image */}
      <div className="mt-2.5 flex items-center justify-between gap-2 px-0.5">
        <div className="space-y-0.5 min-w-0 flex-1">
          <h3 className="text-xs sm:text-[13px] font-medium tracking-tight leading-snug truncate text-stone-900 group-hover:text-stone-600 transition-colors">
            {item.name}
          </h3>
          <div className="flex items-center gap-1.5 pt-0.5 h-4">
            <span className="text-xs sm:text-[12.5px] font-medium text-stone-700">
              {item.priceDisplay}
            </span>
            {item.originalPrice && (
              <span className="text-[11px] line-through text-stone-400">
                {item.originalPrice}
              </span>
            )}
          </div>
        </div>

        {/* Action Buttons on Far Right matching ProductCardItem */}
        <div className="flex items-center gap-1 shrink-0">
          {/* Quick Add to Cart Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart(item);
            }}
            title={`Quick add ${item.name} to cart`}
            aria-label={`Quick add ${item.name} to cart`}
            className="p-1 rounded-md text-stone-800 hover:text-black hover:bg-stone-100 transition-all duration-200 hover:scale-110 cursor-pointer"
          >
            {isAdded ? (
              <Check className="w-4 h-4 stroke-[2.5] text-[#7A5A28]" />
            ) : (
              <ShoppingCart className="w-4 h-4 sm:w-4.5 sm:h-4.5 stroke-[1.9]" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}



export function RitualAndQuestions({ onExploreGifts }: { onExploreGifts?: () => void } = {}) {
  const router = useRouter();
  const [open, setOpen] = useState<number | null>(0);
  const [likedItems, setLikedItems] = useState<Record<string, boolean>>({});
  const [addedIds, setAddedIds] = useState<Record<string, boolean>>({});
  const { addToCart } = useCart();
  const reduced = useReducedMotion();

  const handleExploreGifts = onExploreGifts || (() => {
    const el = document.getElementById("catalog");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  });

  // Bestsellers Carousel Scroll State (4 items per view, matching reels)
  const bestsellersScrollRef = useRef<HTMLDivElement>(null);
  const bestsellersRafId = useRef<number | null>(null);
  const [bestsellerPage, setBestsellerPage] = useState(0);
  const totalBestsellerPages = Math.ceil(BESTSELLER_ITEMS.length / 4);
  const [canScrollBestsellersLeft, setCanScrollBestsellersLeft] = useState(false);
  const [canScrollBestsellersRight, setCanScrollBestsellersRight] = useState(true);

  // Auto-scroll and touch interaction tracking for mobile
  const isInteractingRef = useRef(false);
  const isHoveredRef = useRef(false);
  const isSectionVisibleRef = useRef(true);
  const resumeTimerRef = useRef<NodeJS.Timeout | null>(null);
  const autoScrollRafId = useRef<number | null>(null);
  const lastTimestampRef = useRef<number | null>(null);

  const updateBestsellersScrollState = useCallback(() => {
    if (bestsellersRafId.current !== null) return;
    bestsellersRafId.current = requestAnimationFrame(() => {
      bestsellersRafId.current = null;
      if (bestsellersScrollRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = bestsellersScrollRef.current;
        const newLeft = scrollLeft > 20;
        const newRight = scrollLeft < scrollWidth - clientWidth - 20;
        setCanScrollBestsellersLeft((prev) => (prev !== newLeft ? newLeft : prev));
        setCanScrollBestsellersRight((prev) => (prev !== newRight ? newRight : prev));

        const isMobileView = typeof window !== "undefined" && window.innerWidth < 1024;
        const halfWidth = scrollWidth / 2;
        const effectiveScroll = isMobileView && halfWidth > 0 ? scrollLeft % halfWidth : scrollLeft;

        const pageIndex = Math.min(
          totalBestsellerPages - 1,
          Math.max(0, Math.round(effectiveScroll / (clientWidth || 1)))
        );
        setBestsellerPage((prev) => (prev !== pageIndex ? pageIndex : prev));
      }
    });
  }, [totalBestsellerPages]);

  // Handle scroll events with seamless looping for infinite smooth carousel on mobile
  const handleScroll = useCallback(() => {
    const container = bestsellersScrollRef.current;
    if (container) {
      const isMobileView = typeof window !== "undefined" && window.innerWidth < 1024;
      if (isMobileView) {
        const halfWidth = container.scrollWidth / 2;
        if (halfWidth > 0) {
          if (container.scrollLeft >= halfWidth) {
            container.scrollLeft -= halfWidth;
          } else if (container.scrollLeft <= 0 && isInteractingRef.current) {
            container.scrollLeft += halfWidth;
          }
        }
      }
    }
    updateBestsellersScrollState();
  }, [updateBestsellersScrollState]);

  useEffect(() => {
    updateBestsellersScrollState();
    const current = bestsellersScrollRef.current;
    if (current) {
      current.addEventListener("scroll", handleScroll, { passive: true });
    }
    return () => {
      if (current) current.removeEventListener("scroll", handleScroll);
      if (bestsellersRafId.current !== null) cancelAnimationFrame(bestsellersRafId.current);
    };
  }, [handleScroll, updateBestsellersScrollState]);

  // IntersectionObserver to pause auto-scroll when section is out of viewport (battery & GPU friendly)
  useEffect(() => {
    const container = bestsellersScrollRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isSectionVisibleRef.current = entry.isIntersecting;
        });
      },
      { threshold: 0.05 }
    );

    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  // Continuous smooth auto-scroll loop for mobile devices
  useEffect(() => {
    let isMounted = true;

    const loop = (timestamp: number) => {
      if (!isMounted) return;

      if (lastTimestampRef.current === null) {
        lastTimestampRef.current = timestamp;
      }
      const elapsed = Math.min(timestamp - lastTimestampRef.current, 50);
      lastTimestampRef.current = timestamp;

      const container = bestsellersScrollRef.current;
      const isMobileView = typeof window !== "undefined" && window.innerWidth < 1024;

      if (
        container &&
        isMobileView &&
        isSectionVisibleRef.current &&
        !isInteractingRef.current &&
        !isHoveredRef.current
      ) {
        const halfWidth = container.scrollWidth / 2;
        if (halfWidth > 0) {
          // Smooth continuous drift (~36px/sec -> 0.036px/ms)
          const delta = 0.036 * elapsed;
          container.scrollLeft += delta;

          if (container.scrollLeft >= halfWidth) {
            container.scrollLeft -= halfWidth;
          }
        }
      }

      autoScrollRafId.current = requestAnimationFrame(loop);
    };

    autoScrollRafId.current = requestAnimationFrame(loop);

    return () => {
      isMounted = false;
      if (autoScrollRafId.current !== null) {
        cancelAnimationFrame(autoScrollRafId.current);
      }
      if (resumeTimerRef.current) {
        clearTimeout(resumeTimerRef.current);
      }
    };
  }, []);

  const handleTouchStart = () => {
    isInteractingRef.current = true;
    if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
  };

  const handleTouchEnd = () => {
    if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
    resumeTimerRef.current = setTimeout(() => {
      isInteractingRef.current = false;
    }, 2200);
  };

  const handlePointerDown = () => {
    isInteractingRef.current = true;
    if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
  };

  const handlePointerUp = () => {
    if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
    resumeTimerRef.current = setTimeout(() => {
      isInteractingRef.current = false;
    }, 2200);
  };

  const handleMouseEnter = () => {
    isHoveredRef.current = true;
  };

  const handleMouseLeave = () => {
    isHoveredRef.current = false;
  };

  const handleBestsellersScroll = (direction: "left" | "right") => {
    if (bestsellersScrollRef.current) {
      isInteractingRef.current = true;
      if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
      resumeTimerRef.current = setTimeout(() => {
        isInteractingRef.current = false;
      }, 3000);

      const container = bestsellersScrollRef.current;
      const isMobileView = typeof window !== "undefined" && window.innerWidth < 1024;

      if (isMobileView) {
        const firstCard = container.firstElementChild as HTMLElement;
        const cardWidth = firstCard ? firstCard.offsetWidth : container.clientWidth * 0.88;
        const gap = 16;
        const step = cardWidth + gap;

        container.scrollBy({
          left: direction === "left" ? -step : step,
          behavior: "smooth",
        });
      } else {
        const containerWidth = container.clientWidth;
        container.scrollBy({
          left: direction === "left" ? -containerWidth : containerWidth,
          behavior: "smooth",
        });
      }
    }
  };

  const goToBestsellersPage = (pageIdx: number) => {
    if (bestsellersScrollRef.current) {
      isInteractingRef.current = true;
      if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
      resumeTimerRef.current = setTimeout(() => {
        isInteractingRef.current = false;
      }, 3000);

      const containerWidth = bestsellersScrollRef.current.clientWidth;
      bestsellersScrollRef.current.scrollTo({
        left: pageIdx * containerWidth,
        behavior: "smooth",
      });
      setBestsellerPage(pageIdx);
    }
  };



  const toggleWishlist = (id: string) => {
    setLikedItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleAddToCart = (item: (typeof BESTSELLER_ITEMS)[0]) => {
    addToCart({
      id: item.id,
      skuId: item.skuId,
      name: item.name,
      price: item.price,
      priceDisplay: item.priceDisplay,
      image: item.image,
      quantity: 1,
    });

    setAddedIds((prev) => ({ ...prev, [item.id]: true }));
    setTimeout(() => {
      setAddedIds((prev) => ({ ...prev, [item.id]: false }));
    }, 2000);
  };

  return (
    <>
      {/* Curated Gifting Galerie Section */}
      <GiftingGallery />

      {/* 'Our Bestsellers' Section */}
      <section id="bestsellers" className="bg-[#FAF7F2] py-14 sm:py-20 md:py-24 px-4 sm:px-6 md:px-12 border-t border-[#EAE3D8]">
        <div className="mx-auto max-w-[1520px] w-full">
          {/* Section Header */}
          <div className="text-center mb-8">
            <h2 className="font-serif text-3xl sm:text-4xl md:text-[42px] lg:text-[52px] xl:text-[56px] font-medium tracking-tight leading-tight text-[#1C1B18]">
              Our Bestsellers
            </h2>
          </div>

          {/* Carousel Viewport Wrapper with Mobile Navigation Arrows */}
          <div className="relative w-full">
            {/* Left Chevron Button (Mobile/Tablet Only) */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleBestsellersScroll("left");
              }}
              className="lg:hidden absolute left-1 sm:left-2 top-[38%] -translate-y-1/2 z-20 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/90 hover:bg-white active:scale-90 transition-all border border-stone-300/80 shadow-md flex items-center justify-center text-stone-800 cursor-pointer backdrop-blur-xs"
              aria-label="Previous bestseller"
            >
              <ChevronLeft className="w-5 h-5 stroke-[2.2]" />
            </button>

            {/* Right Chevron Button (Mobile/Tablet Only) */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleBestsellersScroll("right");
              }}
              className="lg:hidden absolute right-1 sm:right-2 top-[38%] -translate-y-1/2 z-20 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/90 hover:bg-white active:scale-90 transition-all border border-stone-300/80 shadow-md flex items-center justify-center text-stone-800 cursor-pointer backdrop-blur-xs"
              aria-label="Next bestseller"
            >
              <ChevronRight className="w-5 h-5 stroke-[2.2]" />
            </button>

            {/* 4 Card Bestsellers Horizontal Carousel with Smooth Snapping on Desktop & Continuous Auto-Scroll on Mobile */}
            <div
              ref={bestsellersScrollRef}
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
              onTouchCancel={handleTouchEnd}
              onPointerDown={handlePointerDown}
              onPointerUp={handlePointerUp}
              onPointerCancel={handlePointerUp}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              className="flex gap-4 sm:gap-5 lg:gap-6 overflow-x-auto pb-3 pt-1 lg:snap-x lg:snap-mandatory lg:scroll-smooth no-scrollbar"
              style={{
                touchAction: "pan-x pan-y",
                scrollbarWidth: "none",
                msOverflowStyle: "none",
                WebkitOverflowScrolling: "touch",
              }}
            >
              {BESTSELLER_ITEMS.map((item) => (
                <BestsellerCard
                  key={item.id}
                  item={item}
                  isLiked={!!likedItems[item.id]}
                  isAdded={!!addedIds[item.id]}
                  onToggleWishlist={toggleWishlist}
                  onAddToCart={handleAddToCart}
                />
              ))}
              {/* Duplicate set for seamless continuous infinite loop on mobile/tablet (hidden on desktop) */}
              {BESTSELLER_ITEMS.map((item) => (
                <BestsellerCard
                  key={`dup-${item.id}`}
                  item={item}
                  isLiked={!!likedItems[item.id]}
                  isAdded={!!addedIds[item.id]}
                  onToggleWishlist={toggleWishlist}
                  onAddToCart={handleAddToCart}
                  isDuplicate
                />
              ))}
            </div>
          </div>

          {/* Subtle Page Indicator Dots like third image */}
          <div className="flex items-center justify-center gap-1.5 pt-4">
            {Array.from({ length: totalBestsellerPages }).map((_, pageIdx) => (
              <button
                key={pageIdx}
                type="button"
                onClick={() => goToBestsellersPage(pageIdx)}
                aria-label={`Go to bestsellers page ${pageIdx + 1}`}
                className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                  bestsellerPage === pageIdx
                    ? "w-7 bg-[#8b5f10]"
                    : "w-2 bg-stone-300 hover:bg-stone-400"
                }`}
              />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

const FAQ_ITEMS = [
  {
    question: "What makes Kurma 5 Elements Incense 100% charcoal-free & non-toxic?",
    answer:
      "Kurma incense sticks are handcrafted using pure natural flower extracts, sacred resins, organic wood powders, and therapeutic essential oils without synthetic charcoal, phthalates, or chemical binders. This guarantees zero toxic black soot, clean indoor air, and a soothing 60-minute burn time.",
  },
  {
    question: "What is included in The 5 Elements Complete Luxury Suite?",
    answer:
      "The complete suite includes 5 distinct sacred fragrances (Earth, Water, Fire, Air, Space — 135 total sticks), a heavy solid brass turtle incense holder, a metallic keepsake medallion & tassel bookmark, and an artisan gold-embossed presentation gift box.",
  },
  {
    question: "Can I customize hampers with corporate logos or personal names?",
    answer:
      "Yes! We offer custom brass plaque engraving, personalized gold foil sleeves, custom greeting cards, and bespoke wax seals for corporate executive gifts, weddings, and grand celebrations. You can customize on product pages or contact our concierge team.",
  },
  {
    question: "What are your shipping timelines and delivery coverage across India?",
    answer:
      "We deliver across 18,000+ pincodes in India with free express shipping on orders above ₹1,999. Orders are dispatched within 24 hours. Metro city deliveries arrive in 2–3 business days, while tier-2/3 cities take 3–5 business days in shock-proof transit packaging.",
  },
  {
    question: "How do I clean and maintain the solid brass turtle incense burner?",
    answer:
      "Our turtle burners are cast from heavy virgin brass with a protective anti-tarnish finish. Simply wipe with a soft dry cloth after use. For long-term shine, a gentle wipe with brass polish or natural lemon-and-salt restores its heirloom golden luster instantly.",
  },
  {
    question: "Are Kurma fragrance suites suitable for daily puja and mindfulness?",
    answer:
      "Formulated according to ancient Ayurvedic and Pancha Mahabhuta (5 Elements) principles, Kurma fragrances are ideal for daily morning rituals, evening dhyana/meditation, yoga practice, housewarmings (Griha Pravesh), and luxury festive gifting.",
  },
];

export function KurmaFAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const handleToggle = (idx: number) => {
    setOpenIndex((prev) => (prev === idx ? null : idx));
  };

  return (
    <section id="faq" className="bg-[#FAF7F2] py-10 sm:py-14 px-4 sm:px-6 md:px-12 border-t border-[#EAE3D5] overflow-hidden">
      <div className="mx-auto max-w-4xl">
        {/* Section Header */}
        <div className="text-center mb-6 sm:mb-8">
          <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-medium tracking-tight leading-tight text-[#1C1B18]">
            FAQ
          </h2>
        </div>

        {/* Accordion Questions List */}
        <div className="space-y-2.5 sm:space-y-3">
          {FAQ_ITEMS.map((faq, idx) => {
            const isOpen = openIndex === idx;

            return (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-stone-200/90 shadow-2xs overflow-hidden transition-all duration-300 hover:border-[#1E1E1C]/40"
              >
                <button
                  type="button"
                  onClick={() => handleToggle(idx)}
                  className="w-full py-3.5 sm:py-4 px-4 sm:px-5 text-left flex items-center justify-between gap-4 cursor-pointer select-none"
                >
                  <span className="font-serif text-base sm:text-lg lg:text-xl font-medium text-[#1C1B18] tracking-tight leading-snug pr-2">
                    {faq.question}
                  </span>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-transform duration-300 ${isOpen ? "bg-[#1E1E1C] text-white rotate-180" : "bg-stone-100 text-stone-700"}`}>
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.28, ease: "easeInOut" }}
                      className="px-4 sm:px-5 pb-4 pt-0 text-xs sm:text-sm text-stone-600 leading-relaxed border-t border-stone-100 font-sans overflow-hidden"
                    >
                      <motion.p
                        initial="hidden"
                        animate="visible"
                        variants={{
                          hidden: { opacity: 0 },
                          visible: {
                            opacity: 1,
                            transition: {
                              staggerChildren: 0.02,
                              delayChildren: 0.08,
                            },
                          },
                        }}
                        className="pt-2 leading-relaxed"
                      >
                        {faq.answer.split(" ").map((word, wIdx) => (
                          <motion.span
                            key={wIdx}
                            variants={{
                              hidden: { opacity: 0, y: 5 },
                              visible: {
                                opacity: 1,
                                y: 0,
                                transition: { duration: 0.2, ease: "easeOut" },
                              },
                            }}
                            className="inline-block mr-[0.25em]"
                          >
                            {word}
                          </motion.span>
                        ))}
                      </motion.p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
