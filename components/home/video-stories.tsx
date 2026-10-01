"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import {
  ChevronLeft,
  ChevronRight,
  ShoppingBag,
  Sparkles,
  X,
  Plus,
} from "lucide-react";
import { CartItem } from "@/components/cart/cart-drawer";

interface StoryItem {
  id: number;
  skuId: string;
  title: string;
  subtitle: string;
  image: string;
  fallbackImage: string;
  caption: string;
  price: number;
  tag: string;
  duration: string;
  elementColor: string;
  notes: string;
}

interface VideoStoriesProps {
  onAddToCart?: (item: CartItem) => void;
  onExploreProducts?: () => void;
}

const storiesData: StoryItem[] = [
  {
    id: 1,
    skuId: "fragrance-earth",
    title: "Prithvi • Earth Sacred Agarbatti",
    subtitle: "Grounding & Anchoring Ritual",
    image: "/images/product/earth-front.png",
    fallbackImage: "/images/product/earth-3d.png",
    caption:
      "Rooted in Vetiver, Sacred Cedarwood & Raw Clay aroma for deep spiritual grounding and inner stability.",
    price: 399,
    tag: "Prithvi (Earth)",
    duration: "100% Charcoal-Free",
    elementColor: "#a37841",
    notes: "Vetiver • Cedarwood • Earth",
  },
  {
    id: 2,
    skuId: "fragrance-water",
    title: "Jal • Water Sacred Agarbatti",
    subtitle: "Purification & Fluidity Ritual",
    image: "/images/product/water-front.png",
    fallbackImage: "/images/product/water-3d.png",
    caption:
      "Infused with Sacred Lotus, Water Lily & Rain-soaked Moss for emotional purification and peaceful calm.",
    price: 399,
    tag: "Jal (Water)",
    duration: "100% Charcoal-Free",
    elementColor: "#2b7a9e",
    notes: "Lotus • Rain Moss • Lily",
  },
  {
    id: 3,
    skuId: "fragrance-fire",
    title: "Agni • Fire Sacred Agarbatti",
    subtitle: "Transformation & Passion Ritual",
    image: "/images/product/fire-front.png",
    fallbackImage: "/images/product/fire-3d.png",
    caption:
      "Warmed with Kashmiri Saffron, Clove & Spiced Sandalwood to awaken willpower, focus and inner vitality.",
    price: 399,
    tag: "Agni (Fire)",
    duration: "100% Charcoal-Free",
    elementColor: "#c24a25",
    notes: "Saffron • Clove • Sandalwood",
  },
  {
    id: 4,
    skuId: "fragrance-air",
    title: "Vayu • Air Sacred Agarbatti",
    subtitle: "Clarity & Expansion Ritual",
    image: "/images/product/air-front.png",
    fallbackImage: "/images/product/air-3d.png",
    caption:
      "Distilled from Frankincense, Wild Lavender & Alpine Eucalyptus for mental clarity and elevated freedom.",
    price: 399,
    tag: "Vayu (Air)",
    duration: "100% Charcoal-Free",
    elementColor: "#678d80",
    notes: "Frankincense • Lavender • Mint",
  },
  {
    id: 5,
    skuId: "fragrance-space",
    title: "Akasha • Space Sacred Agarbatti",
    subtitle: "Transcendence & Cosmic Ritual",
    image: "/images/product/space-front.png",
    fallbackImage: "/images/product/space-3d.png",
    caption:
      "Enriched with Rare Aged Oud, Myrrh & Star Anise for deep meditation and higher cosmic consciousness.",
    price: 399,
    tag: "Akasha (Space)",
    duration: "100% Charcoal-Free",
    elementColor: "#6c5391",
    notes: "Aged Oud • Myrrh • Star Anise",
  },
];

export function VideoStories({
  onAddToCart,
  onExploreProducts,
}: VideoStoriesProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<StoryItem | null>(
    null
  );
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);

  const total = storiesData.length;

  const handleNext = () => {
    setCurrentIndex((prev) => prev + 1);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => prev - 1);
  };

  useEffect(() => {
    if (!isHovered && selectedProduct === null) {
      autoPlayRef.current = setInterval(() => {
        setCurrentIndex((prev) => prev + 1);
      }, 3000);
    }
    return () => {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    };
  }, [isHovered, selectedProduct]);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      handleNext();
    } else if (isRightSwipe) {
      handlePrev();
    }

    setTouchStart(null);
    setTouchEnd(null);
  };

  const activeNormalizedIndex = ((currentIndex % total) + total) % total;

  return (
    <section className="w-full bg-[#f3f6ef] py-16 sm:py-24 text-stone-900 border-t border-b border-[#072515]/15 overflow-hidden select-none">
      <div className="w-full px-4 sm:px-6 lg:px-12 xl:px-16 space-y-8">
        {/* Section Heading */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif text-stone-900 tracking-tight font-normal">
              Kurma Sacred Agarbatti Collection
            </h2>
            <div className="h-0.5 w-28 bg-[#c0881b] mt-2.5" />
          </div>
        </div>

        {/* 3D CARD IMAGE CAROUSEL STAGE */}
        <div
          className="relative w-full h-[520px] sm:h-[580px] flex items-center justify-center py-4 my-2"
          style={{ perspective: "1200px" }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Soft Stage Light Shadow */}
          <div className="absolute w-[350px] sm:w-[500px] h-[350px] sm:h-[500px] rounded-full bg-[#eed08e]/15 blur-3xl pointer-events-none -z-10" />

          <div className="relative w-full max-w-5xl h-full flex items-center justify-center">
            {storiesData.map((story, index) => {
              let offset = (index - activeNormalizedIndex + total) % total;
              if (offset > total / 2) offset -= total;
              if (offset < -total / 2) offset += total;

              const isCenter = offset === 0;

              let xPos = 0;
              let scale = 1.0;
              let rotateY = 0;
              let opacity = 1.0;
              let zIndex = 30;
              let filterBrightness = "brightness(1)";

              if (offset === 0) {
                xPos = 0;
                scale = 1.0;
                rotateY = 0;
                opacity = 1.0;
                zIndex = 30;
                filterBrightness = "brightness(1)";
              } else if (offset === 1) {
                xPos = 310;
                scale = 0.8;
                rotateY = -10;
                opacity = 0.82;
                zIndex = 20;
                filterBrightness = "brightness(0.92)";
              } else if (offset === -1) {
                xPos = -310;
                scale = 0.8;
                rotateY = 10;
                opacity = 0.82;
                zIndex = 20;
                filterBrightness = "brightness(0.92)";
              } else if (offset === 2 || offset < -2) {
                xPos = 580;
                scale = 0.62;
                rotateY = -18;
                opacity = 0.55;
                zIndex = 10;
                filterBrightness = "brightness(0.82)";
              } else if (offset === -2 || offset > 2) {
                xPos = -580;
                scale = 0.62;
                rotateY = 18;
                opacity = 0.55;
                zIndex = 10;
                filterBrightness = "brightness(0.82)";
              }

              return (
                <motion.div
                  key={story.id}
                  onClick={() => {
                    if (offset !== 0) {
                      setCurrentIndex((prev) => prev + offset);
                    } else {
                      setSelectedProduct(story);
                    }
                  }}
                  animate={{
                    x: xPos,
                    scale,
                    rotateY,
                    opacity,
                  }}
                  transition={{
                    duration: 0.9,
                    ease: [0.25, 1, 0.5, 1],
                  }}
                  style={{
                    zIndex,
                    filter: filterBrightness,
                    transformStyle: "preserve-3d",
                  }}
                  className={`absolute w-[240px] sm:w-[280px] rounded-2xl overflow-hidden cursor-pointer shadow-xl transition-all duration-500 bg-white flex flex-col justify-between ${
                    isCenter
                      ? "shadow-[0_20px_50px_rgba(0,0,0,0.18)]"
                      : "shadow-md opacity-90"
                  }`}
                >
                  {/* BRIGHT PRODUCT IMAGE */}
                  <div className="relative w-full aspect-[3/4] bg-stone-100 overflow-hidden">
                    <Image
                      src={story.image}
                      alt={story.title}
                      fill
                      unoptimized
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      sizes="(max-width: 640px) 75vw, 280px"
                      priority={isCenter}
                    />
                  </div>

                  {/* ELEGANT CARD FOOTER INFO */}
                  <div className="p-3.5 bg-white border-t border-stone-200 flex flex-col justify-between gap-2">
                    <div className="flex items-center justify-between gap-1">
                      <span
                        className="px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider text-white shadow-xs"
                        style={{ backgroundColor: story.elementColor }}
                      >
                        {story.tag}
                      </span>
                      <span className="text-xs font-bold text-[#072515]">
                        ₹{story.price.toLocaleString("en-IN")}
                      </span>
                    </div>

                    <div>
                      <h4 className="text-xs font-bold text-[#072515] leading-snug line-clamp-1 group-hover:text-[#8C6215] transition-colors">
                        {story.title}
                      </h4>
                      <p className="text-[10px] text-stone-600 mt-0.5 line-clamp-1">
                        {story.notes}
                      </p>
                    </div>

                    {onAddToCart && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onAddToCart({
                            id: `${story.skuId}-${Date.now()}`,
                            skuId: story.skuId,
                            name: story.title,
                            price: story.price,
                            priceDisplay: `₹${story.price.toLocaleString("en-IN")}`,
                            image: story.image,
                            quantity: 1,
                          });
                        }}
                        className="w-full py-1.5 px-2 bg-[#072515] hover:bg-[#124229] text-[#EED08E] text-[11px] font-bold rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-sm active:scale-95 mt-1"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add to Sacred Cart</span>
                      </button>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
