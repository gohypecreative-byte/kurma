"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";

interface ReviewsSectionProps {
  onExploreProducts?: () => void;
}

interface Review {
  id: string;
  name: string;
  location: string;
  reviewsCount: string;
  avatar: string;
  rating: number;
  productName: string;
  categoryTag: string;
  quote: string;
  fullReview: string;
}

const REVIEWS: Review[] = [
  {
    id: "rev-1",
    name: "Simran Kapoor",
    location: "Mumbai, MH",
    reviewsCount: "24 Reviews • Corporate Patron",
    avatar: "/images/community/simran.jpg",
    rating: 5,
    productName: "5 Elements Luxury Suite",
    categoryTag: "SACRED FRAGRANCE SUITE",
    quote: "The 5 Elements Suite transformed our evening rituals completely. 100% charcoal-free with pure natural aromas that linger gently without any harsh smoke or eye irritation.",
    fullReview: "The 5 Elements Suite transformed our evening rituals completely. 100% charcoal-free with pure natural aromas that linger gently without any harsh smoke or eye irritation. The antiqued brass turtle burner is a true heirloom masterpiece.",
  },
  {
    id: "rev-2",
    name: "Rohan Varma",
    location: "Bengaluru, KA",
    reviewsCount: "18 Reviews • Verified Connoisseur",
    avatar: "/images/community/rohan.jpg",
    rating: 5,
    productName: "Solid Brass Turtle Incense Holder",
    categoryTag: "HEIRLOOM BRASSWARE",
    quote: "Substantial, heavy, and exquisitely handcrafted. The brass turtle stand holds incense sticks steadily and adds an aura of ancient elegance to our living space.",
    fullReview: "Substantial, heavy, and exquisitely handcrafted. The brass turtle stand holds incense sticks steadily and adds an aura of ancient elegance to our living space. Truly represents the sacred Kurma avatar with unmatched craftsmanship.",
  },
  {
    id: "rev-3",
    name: "Ananya Deshmukh",
    location: "Pune, MH",
    reviewsCount: "31 Reviews • Verified Patron",
    avatar: "/images/community/ananya.jpg",
    rating: 5,
    productName: "Green Marble Gift Chest",
    categoryTag: "MARBLE CRAFT SUITE",
    quote: "We ordered custom green marble hampers for our executive board. The debossed gold foil insignia and pure essential oil sticks impressed everyone instantly!",
    fullReview: "We ordered custom green marble hampers for our executive board. The debossed gold foil insignia and pure essential oil sticks impressed everyone instantly! World-class packaging and prompt pan-India delivery.",
  },
  {
    id: "rev-4",
    name: "Siddharth Malhotra",
    location: "New Delhi, DL",
    reviewsCount: "42 Reviews • Corporate Buyer",
    avatar: "/images/community/siddharth.jpg",
    rating: 5,
    productName: "Earth & Water Incense Suite",
    categoryTag: "NATURAL INCENSE",
    quote: "The Earth blend is deeply grounding while Water brings immense serenity during meditation. Completely charcoal-free and burns for a full soothing hour.",
    fullReview: "The Earth blend is deeply grounding while Water brings immense serenity during meditation. Completely charcoal-free and burns for a full soothing hour with zero black soot.",
  },
  {
    id: "rev-5",
    name: "Tanvi Sharma",
    location: "Hyderabad, TS",
    reviewsCount: "15 Reviews • Verified Patron",
    avatar: "/images/community/tanvi.jpg",
    rating: 5,
    productName: "Embroidered Keepsake Box",
    categoryTag: "FESTIVE GIFT SUITE",
    quote: "The warm wood box craft, gold debossed Kurma turtle emblem, and rich zari Pashmina pocket square made this the most cherished festive gift our clients received.",
    fullReview: "The warm wood box craft, gold debossed Kurma turtle emblem, and rich zari Pashmina pocket square made this the most cherished festive gift our clients received. Delivered nationwide in pristine condition.",
  },
  {
    id: "rev-6",
    name: "Nikhil Joshi",
    location: "Bengaluru, KA",
    reviewsCount: "29 Reviews • Verified Buyer",
    avatar: "/images/community/nikhil.jpg",
    rating: 5,
    productName: "Sacred Sandalwood Luxury Incense",
    categoryTag: "ROYAL CHANDAN",
    quote: "Authentic royal sandalwood aroma with zero synthetic fragrances. The burn time is genuinely 60 minutes and leaves the temple room smelling divine all day.",
    fullReview: "Authentic royal sandalwood aroma with zero synthetic fragrances. The burn time is genuinely 60 minutes and leaves the temple room smelling divine all day. Outstanding luxury quality.",
  },
];

export function ReviewsSection({ onExploreProducts }: ReviewsSectionProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [activeIdx, setActiveIdx] = useState(0);
  const [isInteracting, setIsInteracting] = useState(false);

  // Dynamic card metrics for clean scrolling
  const getCardMetrics = useCallback(() => {
    const el = scrollContainerRef.current;
    if (!el) return { cardWidth: 300, gap: 24 };
    const firstCard = el.firstElementChild as HTMLElement;
    const cardWidth = firstCard ? firstCard.getBoundingClientRect().width : 300;
    const secondCard = el.children[1] as HTMLElement | undefined;
    const gap = secondCard
      ? Math.round(secondCard.getBoundingClientRect().left - firstCard.getBoundingClientRect().right)
      : 24;
    return { cardWidth, gap: gap > 0 ? gap : 24 };
  }, []);

  const scrollRafId = useRef<number | null>(null);

  const handleScroll = useCallback(() => {
    if (scrollRafId.current !== null) return;
    scrollRafId.current = requestAnimationFrame(() => {
      scrollRafId.current = null;
      const el = scrollContainerRef.current;
      if (!el) return;
      const { cardWidth, gap } = getCardMetrics();
      const index = Math.round(el.scrollLeft / (cardWidth + gap));
      const clamped = Math.max(0, Math.min(REVIEWS.length - 1, index));
      setActiveIdx((prev) => (prev !== clamped ? clamped : prev));
    });
  }, [getCardMetrics]);

  const handlePrev = () => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const { cardWidth, gap } = getCardMetrics();
    if (el.scrollLeft <= 15) {
      el.scrollTo({ left: el.scrollWidth, behavior: "smooth" });
    } else {
      el.scrollBy({ left: -(cardWidth + gap), behavior: "smooth" });
    }
  };

  const handleNext = () => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const { cardWidth, gap } = getCardMetrics();
    if (el.scrollLeft + el.clientWidth >= el.scrollWidth - 15) {
      el.scrollTo({ left: 0, behavior: "smooth" });
    } else {
      el.scrollBy({ left: cardWidth + gap, behavior: "smooth" });
    }
  };

  // Autoplay advances smoothly every 5 seconds when in view
  useEffect(() => {
    if (isInteracting) return;
    const el = scrollContainerRef.current;
    if (!el) return;

    let isVisible = false;
    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
      },
      { threshold: 0.15 }
    );
    observer.observe(el);

    const timer = setInterval(() => {
      if (!isVisible || document.hidden) return;
      handleNext();
    }, 5000);

    return () => {
      clearInterval(timer);
      observer.disconnect();
    };
  }, [isInteracting, getCardMetrics]);

  return (
    <section
      id="reviews"
      className="w-full max-w-full overflow-hidden bg-[#28513B] py-14 sm:py-20 lg:py-24 border-t border-[#3C6E52]/40 text-[#E8D9AE] relative select-none"
    >
      <div className="w-full max-w-[1520px] mx-auto px-3 sm:px-6 md:px-10 lg:px-14">
        {/* Header Title Matching Website Theme */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12 px-4">
          <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-[40px] font-medium tracking-[0.16em] uppercase text-[#E8D9AE] leading-tight">
            WHAT OUR CUSTOMERS SAY
          </h2>
        </div>

        {/* Carousel Container with Centered Left & Right Arrow Buttons */}
        <div className="relative w-full">
          {/* Floating Left Arrow Button */}
          <button
            type="button"
            onClick={handlePrev}
            aria-label="Previous review"
            className="absolute -left-2 sm:-left-3 lg:-left-6 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#092B20] hover:bg-[#123D2D] text-[#E8D9AE] hover:text-[#C5A45B] border border-[#3C6E52]/60 active:scale-95 shadow-lg flex items-center justify-center cursor-pointer transition-all duration-200"
          >
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.2]" />
          </button>

          {/* Floating Right Arrow Button */}
          <button
            type="button"
            onClick={handleNext}
            aria-label="Next review"
            className="absolute -right-2 sm:-right-3 lg:-right-6 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#092B20] hover:bg-[#123D2D] text-[#E8D9AE] hover:text-[#C5A45B] border border-[#3C6E52]/60 active:scale-95 shadow-lg flex items-center justify-center cursor-pointer transition-all duration-200"
          >
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.2]" />
          </button>

          {/* NATIVE SMOOTH SIDE-SCROLLING HORIZONTAL TRACK */}
          <div
            ref={scrollContainerRef}
            data-lenis-prevent
            onScroll={handleScroll}
            onTouchStart={() => setIsInteracting(true)}
            onTouchEnd={() => setTimeout(() => setIsInteracting(false), 2500)}
            onMouseEnter={() => setIsInteracting(true)}
            onMouseLeave={() => setIsInteracting(false)}
            className="flex gap-4 sm:gap-5 lg:gap-6 overflow-x-auto pb-6 pt-2 px-3 sm:px-4 lg:px-0 snap-x snap-mandatory scroll-smooth no-scrollbar touch-pan-x"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
              WebkitOverflowScrolling: "touch",
            }}
          >
            {REVIEWS.map((review) => (
              <div
                key={review.id}
                className="flex-shrink-0 w-[84vw] xs:w-[300px] sm:w-[calc(50%-10px)] md:w-[calc(33.333%-14px)] lg:w-[calc((100%-72px)/4)] snap-start flex flex-col items-center bg-white rounded-2xl border border-white/95 p-6 sm:p-7 shadow-[0_8px_30px_rgba(0,0,0,0.18)] text-stone-900 transition-all duration-300 min-h-[280px] sm:min-h-[300px]"
              >
                {/* Circular Profile Avatar Centered at Top */}
                <div className="relative w-16 h-16 sm:w-18 sm:h-18 rounded-full overflow-hidden shrink-0 border-2 border-stone-100 shadow-xs mb-3.5 bg-stone-100">
                  <Image
                    src={review.avatar}
                    alt={review.name}
                    fill
                    loading="lazy"
                    sizes="72px"
                    className="object-cover"
                  />
                </div>

                {/* Customer Name */}
                <h3 className="font-sans text-sm sm:text-base font-semibold text-[#1C1B18] leading-tight text-center">
                  {review.name}
                </h3>

                {/* Subtitle / Product Purchased */}
                <span className="text-[11.5px] sm:text-xs text-stone-500 font-sans mt-0.5 text-center block">
                  for {review.productName}
                </span>

                {/* 5-Star Row Centered in Kurma Warm Gold */}
                <div className="flex items-center justify-center gap-1 mt-2 mb-2.5">
                  {[1, 2, 3, 4, 5].map((starNum) => (
                    <Star
                      key={starNum}
                      className={`w-3.5 sm:w-4 h-3.5 sm:h-4 ${
                        starNum <= review.rating
                          ? "fill-[#C5A45B] text-[#C5A45B]"
                          : "text-[#C5A45B] fill-transparent stroke-[1.5]"
                      }`}
                    />
                  ))}
                </div>

                {/* Review Text - Positioned Directly Below Star Icons */}
                <div className="w-full text-center mt-1">
                  <p className="text-stone-700 text-xs sm:text-[13px] lg:text-[13.5px] font-normal leading-relaxed font-sans">
                    &ldquo; {review.quote} &rdquo;
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
