"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { Star, Check, Quote } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

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
  const [activeIdx, setActiveIdx] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const nextSlide = useCallback(() => {
    setActiveIdx((prev) => (prev + 1) % REVIEWS.length);
  }, []);

  const prevSlide = useCallback(() => {
    setActiveIdx((prev) => (prev - 1 + REVIEWS.length) % REVIEWS.length);
  }, []);

  // Autoplay every 2.5 seconds (2500ms)
  useEffect(() => {
    if (isHovered) return;
    const timer = setInterval(() => {
      nextSlide();
    }, 2500);

    return () => clearInterval(timer);
  }, [isHovered, nextSlide]);

  const getReviewAtOffset = (offset: number) => {
    const index = (activeIdx + offset + REVIEWS.length) % REVIEWS.length;
    return REVIEWS[index];
  };

  const prevReview = getReviewAtOffset(-1);
  const currentReview = getReviewAtOffset(0);
  const nextReview = getReviewAtOffset(1);

  const toggleExpand = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <section
      id="reviews"
      className="w-full bg-gradient-to-b from-[#FAF7F2] via-[#F4EFE6] to-[#FAF7F2] py-16 sm:py-20 lg:py-24 border-t border-[#EAE3D5] text-[#1C1917] relative overflow-hidden select-none"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="max-w-[1500px] mx-auto px-4 sm:px-6 md:px-8">
        {/* Header Title Matching User Image */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center justify-center gap-2 mb-3.5 sm:mb-4">
            <div className="relative w-5 h-5 flex items-center justify-center shrink-0">
              <Image
                src="/images/brand/kurma-turtle-transparent.png"
                alt="Kurma Emblem"
                width={20}
                height={20}
                className="w-full h-full object-contain filter brightness-90 contrast-125"
              />
            </div>
            <span className="text-xs sm:text-sm font-semibold tracking-[0.28em] text-[#0B2B1B] uppercase">
              OUR STELLAR REVIEWS
            </span>
          </div>

          <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-normal text-[#121829] leading-tight">
            What our customers <span className="italic font-serif text-[#8C281F]">say</span>
          </h2>
        </div>

        {/* 3D Overlapping Carousel Container */}
        <div className="relative flex items-center justify-center min-h-[380px] sm:min-h-[420px] max-w-6xl mx-auto">
          {/* Cards Stack */}
          <div className="relative w-full flex items-center justify-center">
            {/* LEFT BACK CARD (Previous) */}
            <div
              onClick={prevSlide}
              className="hidden md:block absolute left-2 lg:left-8 w-[380px] lg:w-[440px] bg-white/70 backdrop-blur-xs rounded-3xl border border-stone-200/70 p-6 shadow-md opacity-45 hover:opacity-75 transition-all duration-500 scale-90 cursor-pointer z-10 pointer-events-auto"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-1">
                  {[...Array(prevReview.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-100">
                  <Quote className="w-4 h-4 opacity-70" />
                </div>
              </div>
              <p className="text-stone-600 text-xs sm:text-sm italic leading-relaxed line-clamp-3 mb-6">
                &ldquo;{prevReview.quote}&rdquo;
              </p>
              <div className="flex items-center gap-3 pt-3 border-t border-stone-100">
                <div className="relative w-9 h-9 rounded-full overflow-hidden shrink-0 border border-stone-200 bg-stone-100">
                  <Image src={prevReview.avatar} alt={prevReview.name} fill className="object-cover" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-bold text-stone-900 truncate">{prevReview.name}</div>
                  <div className="text-[10px] text-stone-400 truncate">{prevReview.location}</div>
                </div>
              </div>
            </div>

            {/* CENTER ACTIVE MAIN CARD */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentReview.id}
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="relative z-30 w-full max-w-[90vw] sm:max-w-[540px] lg:max-w-[620px] bg-white rounded-3xl border border-stone-200/90 p-6 sm:p-8 lg:p-10 shadow-2xl shadow-stone-900/10 transition-all duration-300"
              >
                {/* Top Row: Stars + Quote Icon */}
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-1.5">
                    {[...Array(currentReview.rating)].map((_, i) => (
                      <Star key={i} className="w-4 sm:w-5 h-4 sm:h-5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <div className="w-9 sm:w-10 h-9 sm:h-10 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-100/90 shadow-2xs">
                    <Quote className="w-4 sm:w-5 h-4 sm:h-5 opacity-80" />
                  </div>
                </div>

                {/* Main Quote Text */}
                <div className="mb-6 sm:mb-8">
                  <p className="text-stone-800 text-sm sm:text-base lg:text-lg italic font-normal leading-relaxed">
                    &ldquo;
                    {expanded[currentReview.id] ? currentReview.fullReview : currentReview.quote}
                    &rdquo;
                  </p>
                  {currentReview.fullReview !== currentReview.quote && (
                    <button
                      onClick={(e) => toggleExpand(currentReview.id, e)}
                      className="mt-2 text-xs font-semibold text-emerald-700 hover:text-emerald-800 underline underline-offset-4 cursor-pointer"
                    >
                      {expanded[currentReview.id] ? "Show Less" : "Read More"}
                    </button>
                  )}
                </div>

                {/* Bottom Profile & Purchased Product Bar */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-5 border-t border-stone-100">
                  {/* Left: User Profile */}
                  <div className="flex items-center gap-3">
                    <div className="relative w-11 h-11 sm:w-12 sm:h-12 rounded-full overflow-hidden shrink-0 border border-stone-200 shadow-xs bg-stone-100">
                      <Image
                        src={currentReview.avatar}
                        alt={currentReview.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-serif text-sm sm:text-base font-bold text-stone-900 leading-tight">
                          {currentReview.name}
                        </span>
                        <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/80">
                          <Check className="w-2.5 h-2.5 text-emerald-600 stroke-[3]" />
                          Verified
                        </span>
                      </div>
                      <span className="text-[11px] sm:text-xs text-stone-500 block mt-0.5">
                        {currentReview.reviewsCount} • {currentReview.location}
                      </span>
                    </div>
                  </div>

                  {/* Right: Purchased Product Name */}
                  <div className="text-left sm:text-right shrink-0">
                    <span className="text-[9.5px] sm:text-[10px] font-semibold text-stone-400 tracking-wider uppercase block">
                      {currentReview.categoryTag}
                    </span>
                    <span className="text-xs sm:text-sm font-semibold text-emerald-800 hover:text-[#0B2B1B] transition-colors block mt-0.5">
                      {currentReview.productName}
                    </span>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* RIGHT BACK CARD (Next) */}
            <div
              onClick={nextSlide}
              className="hidden md:block absolute right-2 lg:right-8 w-[380px] lg:w-[440px] bg-white/70 backdrop-blur-xs rounded-3xl border border-stone-200/70 p-6 shadow-md opacity-45 hover:opacity-75 transition-all duration-500 scale-90 cursor-pointer z-10 pointer-events-auto"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-1">
                  {[...Array(nextReview.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-100">
                  <Quote className="w-4 h-4 opacity-70" />
                </div>
              </div>
              <p className="text-stone-600 text-xs sm:text-sm italic leading-relaxed line-clamp-3 mb-6">
                &ldquo;{nextReview.quote}&rdquo;
              </p>
              <div className="flex items-center gap-3 pt-3 border-t border-stone-100">
                <div className="relative w-9 h-9 rounded-full overflow-hidden shrink-0 border border-stone-200 bg-stone-100">
                  <Image src={nextReview.avatar} alt={nextReview.name} fill className="object-cover" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-bold text-stone-900 truncate">{nextReview.name}</div>
                  <div className="text-[10px] text-stone-400 truncate">{nextReview.location}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
