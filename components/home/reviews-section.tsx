"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import { Star, Check, Quote, ChevronLeft, ChevronRight } from "lucide-react";

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
    productName: "Kurma 5 Elements Complete Suite",
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
    productName: "Green Marble Keepsake Gift Box",
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
    productName: "Embroidered Pashmina Gift Box",
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
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  // Calculate card width and gap dynamically for smooth snapping
  const getCardMetrics = useCallback(() => {
    const el = scrollContainerRef.current;
    if (!el) return { cardWidth: 320, gap: 16 };
    const firstCard = el.firstElementChild as HTMLElement;
    const cardWidth = firstCard ? firstCard.getBoundingClientRect().width : 320;
    const gap = 16;
    return { cardWidth, gap };
  }, []);

  const scrollRafId = useRef<number | null>(null);

  // Update active dot in real-time as user side-scrolls (throttled with rAF)
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

  const scrollToReview = (index: number) => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const { cardWidth, gap } = getCardMetrics();
    el.scrollTo({
      left: index * (cardWidth + gap),
      behavior: "smooth",
    });
    setActiveIdx(index);
  };

  const nextSlide = () => {
    const next = (activeIdx + 1) % REVIEWS.length;
    scrollToReview(next);
  };

  const prevSlide = () => {
    const prev = (activeIdx - 1 + REVIEWS.length) % REVIEWS.length;
    scrollToReview(prev);
  };

  // Autoplay advances smoothly every 5 seconds only when section is in viewport
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
      const { cardWidth, gap } = getCardMetrics();
      const nextIdx = (activeIdx + 1) % REVIEWS.length;
      el.scrollTo({
        left: nextIdx * (cardWidth + gap),
        behavior: "smooth",
      });
      setActiveIdx(nextIdx);
    }, 5000);

    return () => {
      clearInterval(timer);
      observer.disconnect();
    };
  }, [isInteracting, activeIdx, getCardMetrics]);

  const toggleExpand = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <section
      id="reviews"
      className="w-full bg-gradient-to-b from-[#FAF7F2] via-[#F4EFE6] to-[#FAF7F2] py-14 sm:py-20 lg:py-24 border-t border-[#EAE3D5] text-[#1C1917] relative select-none mobile-defer-render"
    >
      <div className="max-w-[1500px] mx-auto">
        {/* Header Title Matching User Image */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12 px-4 sm:px-6">
          <div className="inline-flex items-center justify-center gap-2 mb-3.5 sm:mb-4">
            <div className="relative w-5 h-5 flex items-center justify-center shrink-0">
              <Image
                src="/images/brand/kurma-turtle-transparent.png"
                alt="Kurma Emblem"
                width={20}
                height={20}
                unoptimized
                className="w-full h-full object-contain filter brightness-90 contrast-125"
              />
            </div>
            <span className="text-xs sm:text-sm font-semibold tracking-[0.28em] text-[#0B2B1B] uppercase">
              OUR STELLAR REVIEWS
            </span>
          </div>

          <h2 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-normal text-[#121829] leading-tight">
            What our customers <span className="italic font-serif text-[#8C281F]">say</span>
          </h2>
        </div>

        {/* NATIVE SMOOTH SIDE-SCROLLING HORIZONTAL TRACK */}
        <div
          ref={scrollContainerRef}
          onScroll={handleScroll}
          onTouchStart={() => setIsInteracting(true)}
          onTouchEnd={() => setTimeout(() => setIsInteracting(false), 2500)}
          onMouseEnter={() => setIsInteracting(true)}
          onMouseLeave={() => setIsInteracting(false)}
          className="flex gap-4 sm:gap-6 overflow-x-auto pb-4 pt-2 px-5 sm:px-8 md:px-12 snap-x snap-mandatory scroll-smooth no-scrollbar touch-pan-x"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            WebkitOverflowScrolling: "touch",
          }}
        >
          {REVIEWS.map((review) => (
            <div
              key={review.id}
              className="flex-shrink-0 w-[86vw] max-w-[420px] sm:w-[480px] sm:max-w-none lg:w-[540px] snap-center flex flex-col justify-between bg-white rounded-3xl border border-stone-200/90 p-6 sm:p-8 lg:p-10 shadow-lg shadow-stone-900/5 transition-all duration-300"
            >
              <div>
                {/* Top Row: Stars + Quote Icon */}
                <div className="flex items-center justify-between mb-4 sm:mb-5">
                  <div className="flex items-center gap-1 sm:gap-1.5">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="w-4 sm:w-5 h-4 sm:h-5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <div className="w-9 sm:w-10 h-9 sm:h-10 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-100/90 shadow-2xs">
                    <Quote className="w-4 sm:w-5 h-4 sm:h-5 opacity-80" />
                  </div>
                </div>

                {/* Main Quote Text */}
                <div className="mb-5 sm:mb-7">
                  <p className="text-stone-800 text-sm sm:text-base lg:text-lg italic font-normal leading-relaxed">
                    &ldquo;
                    {expanded[review.id] ? review.fullReview : review.quote}
                    &rdquo;
                  </p>
                  {review.fullReview !== review.quote && (
                    <button
                      type="button"
                      onClick={(e) => toggleExpand(review.id, e)}
                      className="mt-2 text-xs font-semibold text-emerald-700 hover:text-emerald-800 underline underline-offset-4 cursor-pointer"
                    >
                      {expanded[review.id] ? "Show Less" : "Read More"}
                    </button>
                  )}
                </div>
              </div>

              {/* Bottom Profile & Purchased Product Bar */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 pt-4 sm:pt-5 border-t border-stone-100 mt-2">
                {/* Left: User Profile */}
                <div className="flex items-center gap-2.5 sm:gap-3">
                  <div className="relative w-11 h-11 sm:w-12 sm:h-12 rounded-full overflow-hidden shrink-0 border border-stone-200 shadow-xs bg-stone-100">
                    <Image
                      src={review.avatar}
                      alt={review.name}
                      fill
                      loading="lazy"
                      sizes="48px"
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5 sm:gap-2">
                      <span className="font-serif text-sm sm:text-base font-bold text-stone-900 leading-tight">
                        {review.name}
                      </span>
                      <span className="inline-flex items-center gap-1 text-[9.5px] sm:text-[10px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/80">
                        <Check className="w-2.5 h-2.5 text-emerald-600 stroke-[3]" />
                        Verified
                      </span>
                    </div>
                    <span className="text-[11px] sm:text-xs text-stone-500 block mt-0.5">
                      {review.reviewsCount} • {review.location}
                    </span>
                  </div>
                </div>

                {/* Right: Purchased Product Name */}
                <div className="text-left sm:text-right shrink-0">
                  <span className="text-[9px] sm:text-[10px] font-semibold text-stone-400 tracking-wider uppercase block">
                    {review.categoryTag}
                  </span>
                  <span className="text-xs sm:text-sm font-semibold text-emerald-800 hover:text-[#0B2B1B] transition-colors block mt-0.5">
                    {review.productName}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation Controls: Touch/Click Arrows and Pagination Dots */}
        <div className="flex items-center justify-center gap-3.5 mt-6 sm:mt-8 px-4">
          <button
            type="button"
            onClick={prevSlide}
            aria-label="Previous review"
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-stone-300 bg-white shadow-xs hover:bg-stone-50 flex items-center justify-center text-stone-700 hover:text-black transition-all cursor-pointer active:scale-95"
          >
            <ChevronLeft className="w-4 h-4 stroke-[2.2]" />
          </button>

          {/* Indicator Dots */}
          <div className="flex items-center gap-1.5 px-1 sm:px-2">
            {REVIEWS.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => scrollToReview(idx)}
                aria-label={`Go to review ${idx + 1}`}
                className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                  idx === activeIdx
                    ? "w-6 bg-[#0B2B1B]"
                    : "w-2 bg-stone-300 hover:bg-stone-400"
                }`}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={nextSlide}
            aria-label="Next review"
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-stone-300 bg-white shadow-xs hover:bg-stone-50 flex items-center justify-center text-stone-700 hover:text-black transition-all cursor-pointer active:scale-95"
          >
            <ChevronRight className="w-4 h-4 stroke-[2.2]" />
          </button>
        </div>
      </div>
    </section>
  );
}
