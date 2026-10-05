"use client";

import { useState, useEffect, useRef } from "react";
import { useReducedMotion } from "motion/react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";

interface PromoBannerProps {
  onExploreGifts: () => void;
}

interface BannerSlide {
  id: number;
  bgGradient: string;
  accentColor: string;
  tagline: string;
  title: string;
  subtitle: string;
  ctaText: string;
  productImage: string;
}

const bannerSlides: BannerSlide[] = [
  {
    id: 0,
    bgGradient: "bg-gradient-to-r from-[#0b3320] via-[#0f432a] to-[#155938]",
    accentColor: "text-[#eed08e]",
    tagline: "Flagship Luxury Keepsake",
    title: "Elements in Harmony Marble Gift Box",
    subtitle: "Complete 5 Elements suite, solid brass turtle burner, medallion & tassel bookmark",
    ctaText: "Explore Marble Box",
    productImage: "/images/product/image9.png",
  },
  {
    id: 1,
    bgGradient: "bg-gradient-to-r from-[#072818] via-[#0d3f27] to-[#125032]",
    accentColor: "text-[#eed08e]",
    tagline: "Pure Fragrance • Higher Consciousness",
    title: "The 5 Sacred Elements Collection",
    subtitle: "Earth, Water, Fire, Air, Space — 100% charcoal-free handcrafted luxury incense sticks",
    ctaText: "Discover 5 Elements",
    productImage: "/images/product/image7.png",
  },
  {
    id: 2,
    bgGradient: "bg-gradient-to-r from-[#051f13] via-[#0a351f] to-[#10472c]",
    accentColor: "text-[#eed08e]",
    tagline: "Artisanal Wood & Pashmina Craft",
    title: "Kurma MDF Gift Box & Pashmina Square",
    subtitle: "Rigid gold-foil stamped keepsake trunk with tailored compartments and custom engraving",
    ctaText: "View Heritage Box",
    productImage: "/images/product/image.png",
  },
];

export function PromoBanner({ onExploreGifts }: PromoBannerProps) {
  const reduced = useReducedMotion();
  const [currentIndex, setCurrentIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);

  // Auto-advance banner every 4s
  useEffect(() => {
    if (reduced) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % bannerSlides.length);
    }, 4200);
    return () => clearInterval(timer);
  }, [reduced]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? bannerSlides.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % bannerSlides.length);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;
    if (diff > 40) handleNext();
    if (diff < -40) handlePrev();
    touchStartX.current = null;
  };

  return (
    <section
      className="w-full bg-[#FAF7F2] py-8 sm:py-12 border-t border-b border-[#EAE3D5] overflow-hidden relative select-none"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className="relative w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
        {/* Floating Left Navigation Button */}
        <button
          onClick={handlePrev}
          aria-label="Previous banner"
          className="absolute left-2 sm:left-4 md:left-7 top-1/2 -translate-y-1/2 z-30 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-white shadow-[0_4px_16px_rgba(0,0,0,0.18)] border border-stone-200/80 flex items-center justify-center text-stone-700 hover:text-black hover:scale-105 active:scale-95 transition-all cursor-pointer"
        >
          <ChevronLeft className="w-5 h-5 stroke-[2.2]" />
        </button>

        {/* Floating Right Navigation Button */}
        <button
          onClick={handleNext}
          aria-label="Next banner"
          className="absolute right-2 sm:right-4 md:right-7 top-1/2 -translate-y-1/2 z-30 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-white shadow-[0_4px_16px_rgba(0,0,0,0.18)] border border-stone-200/80 flex items-center justify-center text-stone-700 hover:text-black hover:scale-105 active:scale-95 transition-all cursor-pointer"
        >
          <ChevronRight className="w-5 h-5 stroke-[2.2]" />
        </button>

        {/* Carousel Track */}
        <div className="relative flex items-center justify-center h-[210px] sm:h-[260px] md:h-[300px] lg:h-[320px]">
          {bannerSlides.map((slide, idx) => {
            let position = idx - currentIndex;
            if (position < -1) position += bannerSlides.length;
            if (position > 1) position -= bannerSlides.length;

            const isActive = position === 0;
            const isLeft = position === -1;
            const isRight = position === 1;

            if (!isActive && !isLeft && !isRight) return null;

            return (
              <div
                key={slide.id}
                onClick={() => {
                  if (isLeft) handlePrev();
                  else if (isRight) handleNext();
                  else onExploreGifts();
                }}
                style={{
                  transform: isActive
                    ? "translateX(0)"
                    : isLeft
                    ? "translateX(calc(-100% - 22px))"
                    : "translateX(calc(100% + 22px))",
                }}
                className={`absolute top-0 w-[84vw] sm:w-[80vw] md:w-[76vw] max-w-[1020px] h-full rounded-2xl sm:rounded-3xl overflow-hidden transition-all duration-700 ease-in-out cursor-pointer ${
                  isActive
                    ? "z-20 shadow-[0_8px_30px_rgba(0,0,0,0.22)] opacity-100 ring-1 ring-amber-400/30"
                    : "z-10 shadow-xs opacity-80 hover:opacity-100"
                }`}
              >
                <div
                  className={`relative w-full h-full ${slide.bgGradient} flex items-center justify-between px-6 sm:px-12 md:px-16 overflow-hidden`}
                >
                  {/* Subtle geometric star lattice */}
                  <div
                    className="absolute inset-0 opacity-15 pointer-events-none"
                    style={{
                      backgroundImage: `radial-gradient(circle at center, rgba(255,255,255,0.4) 1px, transparent 1px)`,
                      backgroundSize: "28px 28px",
                    }}
                  />

                  {/* Left Content */}
                  <div className="relative z-10 max-w-md text-white py-4 space-y-2 sm:space-y-3">
                    <span
                      className={`text-[10px] sm:text-xs font-bold tracking-wider uppercase block ${slide.accentColor}`}
                    >
                      {slide.tagline}
                    </span>
                    <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-[32px] font-bold font-serif tracking-tight leading-tight">
                      {slide.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-white/90 font-normal leading-relaxed line-clamp-2">
                      {slide.subtitle}
                    </p>
                    <div className="pt-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onExploreGifts();
                        }}
                        className="px-4 sm:px-5 py-2 sm:py-2.5 bg-white text-stone-900 text-xs sm:text-sm font-semibold rounded-full inline-flex items-center gap-1.5 shadow-sm hover:bg-stone-50 hover:scale-105 active:scale-95 transition-all cursor-pointer"
                      >
                        <span>{slide.ctaText}</span>
                        <ArrowRight className="w-3.5 h-3.5 text-[#c0881b]" />
                      </button>
                    </div>
                  </div>

                  {/* Right Product Image */}
                  <div className="relative w-[36%] h-[84%] shrink-0 rounded-2xl overflow-hidden shadow-2xl hidden sm:block border border-amber-300/30 bg-stone-950">
                    <Image
                      src={slide.productImage}
                      alt={slide.title}
                      fill
                      className="object-cover"
                      sizes="400px"
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
