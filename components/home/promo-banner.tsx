"use client";

import { useState, useEffect, useRef } from "react";
import { useReducedMotion } from "motion/react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

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
    title: "Elements in Harmony Marble Box",
    subtitle: "Complete 5 elements suite with solid brass burner.",
    ctaText: "Explore Marble Box",
    productImage: "/images/product/banner-marble-box.jpg",
  },
  {
    id: 1,
    bgGradient: "bg-gradient-to-r from-[#072818] via-[#0d3f27] to-[#125032]",
    accentColor: "text-[#eed08e]",
    tagline: "Pure Fragrance",
    title: "The 5 Sacred Elements Collection",
    subtitle: "100% charcoal-free handcrafted luxury incense.",
    ctaText: "Discover 5 Elements",
    productImage: "/images/product/banner-5-elements.jpg",
  },
  {
    id: 2,
    bgGradient: "bg-gradient-to-r from-[#051f13] via-[#0a351f] to-[#10472c]",
    accentColor: "text-[#eed08e]",
    tagline: "Artisanal Craft",
    title: "Kurma MDF Keepsake Trunk",
    subtitle: "Rigid keepsake trunk with custom engraving.",
    ctaText: "View Heritage Box",
    productImage: "/images/product/banner-heritage-trunk.jpg",
  },
];

export function PromoBanner({ onExploreGifts }: PromoBannerProps) {
  const reduced = useReducedMotion();
  const [currentIndex, setCurrentIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);

  // Auto-advance banner every 5s when visible
  useEffect(() => {
    if (reduced) return;
    const timer = setInterval(() => {
      if (document.hidden) return;
      setCurrentIndex((prev) => (prev + 1) % bannerSlides.length);
    }, 5000);
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
      className="w-full bg-[#FAF7F2] py-8 sm:py-12 border-b border-[#EAE3D8] overflow-hidden relative select-none"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className="relative w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
        {/* Floating Left Navigation Button */}
        <button
          onClick={handlePrev}
          aria-label="Previous banner"
          className="hidden sm:flex absolute left-2 sm:left-4 md:left-7 top-1/2 -translate-y-1/2 z-30 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-white shadow-[0_4px_16px_rgba(0,0,0,0.18)] border border-[#E8E2D8] items-center justify-center text-stone-700 hover:text-black hover:scale-105 active:scale-95 transition-all cursor-pointer"
        >
          <ChevronLeft className="w-5 h-5 stroke-[2.2]" />
        </button>

        {/* Floating Right Navigation Button */}
        <button
          onClick={handleNext}
          aria-label="Next banner"
          className="hidden sm:flex absolute right-2 sm:right-4 md:right-7 top-1/2 -translate-y-1/2 z-30 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-white shadow-[0_4px_16px_rgba(0,0,0,0.18)] border border-[#E8E2D8] items-center justify-center text-stone-700 hover:text-black hover:scale-105 active:scale-95 transition-all cursor-pointer"
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
                className={`absolute top-0 w-[90vw] sm:w-[80vw] md:w-[76vw] max-w-[1020px] h-full rounded-2xl sm:rounded-3xl overflow-hidden transition-all duration-700 ease-in-out cursor-pointer ${
                  isActive
                    ? "z-20 shadow-[0_8px_30px_rgba(0,0,0,0.22)] opacity-100 ring-1 ring-[#1E1E1C]/15"
                    : "z-10 shadow-xs opacity-80 hover:opacity-100"
                }`}
              >
                <div className="relative w-full h-full overflow-hidden group">
                  {/* Full Card Image Background - Clearly visible, bright and covering 100% with zero gaps */}
                  <Image
                    src={slide.productImage}
                    alt={slide.title}
                    fill
                    priority={idx === 0}
                    className="object-cover object-center sm:object-right filter brightness-[1.04] contrast-[1.02] transition-transform duration-700 ease-out group-hover:scale-105"
                    sizes="(max-width: 1024px) 90vw, 1020px"
                  />

                  {/* Subtle, gentle gradient scrim so the image is clearly visible while text stays sharp */}
                  <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/35 sm:via-black/20 to-transparent pointer-events-none" />

                  {/* Left Content - Responsive width and clean typography */}
                  <div className="relative z-10 h-full flex flex-col justify-center px-4 sm:px-8 lg:px-10 max-w-[65%] sm:max-w-[50%] lg:max-w-[38%] text-white space-y-1 sm:space-y-1.5 pointer-events-none">
                    <h3 className="text-sm xs:text-base sm:text-lg md:text-xl lg:text-[21px] xl:text-[22px] font-serif font-normal text-white tracking-tight leading-snug sm:leading-normal sm:whitespace-nowrap drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
                      {slide.title}
                    </h3>
                    <p className="text-[11px] sm:text-xs md:text-sm text-stone-200/95 font-light leading-relaxed truncate max-w-full drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)]">
                      {slide.subtitle}
                    </p>
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
