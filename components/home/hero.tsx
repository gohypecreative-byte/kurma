"use client";

import { useRef } from "react";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { motion, useScroll, useTransform, useReducedMotion } from "motion/react";
import { RealisticSmoke } from "@/components/home/realistic-smoke";

interface HeroProps {
  onExploreGifts: () => void;
  onExploreBestsellers?: () => void;
}

const LUXURY_EASE = [0.22, 1, 0.36, 1] as const;

export function Hero({ onExploreGifts, onExploreBestsellers }: HeroProps) {
  const shouldReduceMotion = useReducedMotion();
  const heroRef = useRef<HTMLElement>(null);

  // Subtle depth dimming as the overlapping content stack glides over the hero
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const dimOpacity = useTransform(scrollYProgress, [0, 0.8, 1], [0, 0.08, 0.22]);

  return (
    <section
      ref={heroRef}
      id="home"
      className="sticky top-16 sm:top-20 z-0 w-full h-[calc(100vh-64px)] sm:h-[calc(100vh-80px)] min-h-[580px] sm:min-h-[620px] bg-[#EDE1D1] border-b border-[#CBB8A1] overflow-hidden flex items-center text-[#1C1B18] transform-gpu [transform:translate3d(0,0,0)]"
    >
      <div className="w-full h-full flex items-center relative">
        {/* Full-Bleed Editorial Background Banner */}
        <div className="absolute inset-0 w-full h-full z-0 pointer-events-none">
          <Image
            src="/images/hero/kurma-hero-banner-new.jpg"
            alt="Kurma 5 Elements Sacred Incense Suite & Brass Turtle Burner"
            fill
            priority
            className="object-cover object-right md:object-[center_35%]"
            sizes="100vw"
          />
          {/* Soft Left Ambient Gradient for Supreme Text Contrast */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#EDE1D1]/90 via-[#EDE1D1]/55 to-transparent sm:via-[#EDE1D1]/40 lg:from-[#EDE1D1]/70 lg:via-transparent" />

          {/* Realistic Flowing Sandalwood Smoke Animation */}
          <RealisticSmoke />
        </div>

        {/* Content Container (Headline, Subtitle, and Action CTAs) */}
        <div className="relative w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20 z-10 py-12 sm:py-16 lg:py-20">
          <div className="max-w-xl lg:max-w-[560px] xl:max-w-[640px] space-y-4 sm:space-y-6">
            {/* Framer Motion Animated Headline */}
            {shouldReduceMotion ? (
              <h1 className="text-3xl sm:text-4xl md:text-[44px] lg:text-[46px] xl:text-[54px] 2xl:text-[58px] font-serif font-normal text-[#1C1B18] leading-[1.14] tracking-tight">
                <span className="block">Elements in Harmony.</span>
                <span className="block italic font-normal text-[#7A5A28] sm:whitespace-nowrap">
                  Higher Consciousness.
                </span>
              </h1>
            ) : (
              <motion.h1
                initial="hidden"
                animate="visible"
                variants={{
                  hidden: { opacity: 0 },
                  visible: {
                    opacity: 1,
                    transition: { staggerChildren: 0.14, delayChildren: 0.1 },
                  },
                }}
                className="text-3xl sm:text-4xl md:text-[44px] lg:text-[46px] xl:text-[54px] 2xl:text-[58px] font-serif font-normal text-[#1C1B18] leading-[1.14] tracking-tight"
              >
                <motion.span
                  variants={{
                    hidden: { opacity: 0, y: 28 },
                    visible: {
                      opacity: 1,
                      y: 0,
                      transition: { duration: 0.85, ease: LUXURY_EASE },
                    },
                  }}
                  className="block"
                >
                  Elements in Harmony.
                </motion.span>
                <motion.span
                  variants={{
                    hidden: { opacity: 0, y: 28 },
                    visible: {
                      opacity: 1,
                      y: 0,
                      transition: { duration: 0.9, ease: LUXURY_EASE },
                    },
                  }}
                  className="block italic font-normal text-[#7A5A28] sm:whitespace-nowrap"
                >
                  Higher Consciousness.
                </motion.span>
              </motion.h1>
            )}

            {/* Framer Motion Animated Subtext */}
            {shouldReduceMotion ? (
              <p className="text-xs sm:text-sm md:text-base text-[#3E362D] leading-relaxed max-w-md font-light">
                Handcrafted 100% charcoal-free sacred incense suites, pure botanical resins, and solid cast brassware made for quiet living.
              </p>
            ) : (
              <motion.p
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.35, ease: LUXURY_EASE }}
                className="text-xs sm:text-sm md:text-base text-[#3E362D] leading-relaxed max-w-md font-light"
              >
                Handcrafted 100% charcoal-free sacred incense suites, pure botanical resins, and solid cast brassware made for quiet living.
              </motion.p>
            )}

            {/* Action Buttons - Matching Luxury Pill Style */}
            {shouldReduceMotion ? (
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 pt-1 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={onExploreGifts}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 sm:px-8 sm:py-4 bg-[#1E1E1C] hover:bg-[#33312D] text-white text-xs sm:text-sm font-semibold tracking-wider uppercase rounded-full sm:rounded-xl shadow-md hover:shadow-xl transition-all duration-200 active:scale-[0.98] group cursor-pointer"
                >
                  <span>Explore Collection</span>
                  <ArrowRight className="w-4 h-4 sm:w-4.5 sm:h-4.5 transition-transform duration-200 group-hover:translate-x-1" />
                </button>

                <button
                  type="button"
                  onClick={onExploreBestsellers || onExploreGifts}
                  className="w-full sm:w-auto inline-flex items-center justify-center px-7 py-3.5 sm:px-8 sm:py-4 bg-[#FAF7F2]/90 hover:bg-white text-[#1E1B18] text-xs sm:text-sm font-semibold tracking-wider uppercase rounded-full sm:rounded-xl border border-[#CBB8A1] hover:border-[#1E1E1C] transition-all duration-200 shadow-2xs active:scale-[0.98] cursor-pointer backdrop-blur-xs"
                >
                  View Marble Trunk
                </button>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.48, ease: LUXURY_EASE }}
                className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 pt-1 w-full sm:w-auto"
              >
                <button
                  type="button"
                  onClick={onExploreGifts}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 sm:px-8 sm:py-4 bg-[#1E1E1C] hover:bg-[#33312D] text-white text-xs sm:text-sm font-semibold tracking-wider uppercase rounded-full sm:rounded-xl shadow-md hover:shadow-xl transition-all duration-200 active:scale-[0.98] group cursor-pointer"
                >
                  <span>Explore Collection</span>
                  <ArrowRight className="w-4 h-4 sm:w-4.5 sm:h-4.5 transition-transform duration-200 group-hover:translate-x-1" />
                </button>

                <button
                  type="button"
                  onClick={onExploreBestsellers || onExploreGifts}
                  className="w-full sm:w-auto inline-flex items-center justify-center px-7 py-3.5 sm:px-8 sm:py-4 bg-[#FAF7F2]/90 hover:bg-white text-[#1E1B18] text-xs sm:text-sm font-semibold tracking-wider uppercase rounded-full sm:rounded-xl border border-[#CBB8A1] hover:border-[#1E1E1C] transition-all duration-200 shadow-2xs active:scale-[0.98] cursor-pointer backdrop-blur-xs"
                >
                  View Marble Trunk
                </button>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Subtle depth dimming overlay as next section slides over it */}
      {!shouldReduceMotion && (
        <motion.div
          style={{ opacity: dimOpacity }}
          className="absolute inset-0 bg-black pointer-events-none z-20 will-change-[opacity]"
        />
      )}
    </section>
  );
}
