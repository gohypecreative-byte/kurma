"use client";

import { useRef } from "react";
import Image from "next/image";
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
      className="sticky top-16 sm:top-20 z-0 w-full h-[calc(100vh-64px)] sm:h-[calc(100vh-80px)] min-h-[500px] sm:min-h-[620px] bg-[#EDE1D1] border-b border-[#28513B]/40 overflow-hidden flex items-center text-[#092B20] transform-gpu [transform:translate3d(0,0,0)]"
    >
      <div className="w-full h-full flex items-end sm:items-center relative">
        {/* Full-Bleed Editorial Background Banner */}
        <div className="absolute inset-0 w-full h-full z-0 pointer-events-none">
          {/* Desktop/Tablet Editorial Background Banner */}
          <Image
            src="/images/hero/kurma-hero-banner-new.jpg"
            alt="Kurma 5 Elements Sacred Incense Suite & Brass Turtle Burner"
            fill
            priority
            className="hidden sm:block object-cover object-right md:object-[center_35%]"
            sizes="100vw"
          />

          {/* Mobile-Only Portrait Editorial Background Banner (Clean Zero-Static-Smoke Image) */}
          <Image
            src="/images/hero/kurma-hero-banner-mobile-v4.jpg"
            alt="Kurma 5 Elements Sacred Incense Suite & Brass Turtle Burner"
            fill
            priority
            className="block sm:hidden object-cover object-center"
            sizes="100vw"
          />

          {/* Realistic Flowing Sandalwood Smoke Animation (Calibrated for Desktop Canvas) */}
          <div className="hidden sm:block absolute inset-0 pointer-events-none">
            <RealisticSmoke preset="hero" />
          </div>

          {/* Realistic Flowing Sandalwood Smoke Animation (Dynamic Real-Time Smoke for Mobile Canvas) */}
          <div className="block sm:hidden absolute inset-0 pointer-events-none z-[5]">
            <RealisticSmoke preset="hero-mobile" />
          </div>
        </div>

        {/* Content Container (Headline, Subtitle, and Action CTAs) */}
        <div className="relative w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20 z-10 pb-28 min-[400px]:pb-32 sm:pb-16 lg:pb-20 pt-0 sm:pt-16 lg:pt-20">
          <div className="max-w-xl lg:max-w-[560px] xl:max-w-[640px] space-y-3.5 min-[380px]:space-y-4 sm:space-y-6">
            {/* Framer Motion Animated Headline */}
            {shouldReduceMotion ? (
              <h1 className="text-xl min-[360px]:text-2xl min-[410px]:text-[26px] sm:text-4xl md:text-[44px] lg:text-[46px] xl:text-[54px] 2xl:text-[58px] font-serif font-normal sm:font-light text-[#FFFDF8] sm:text-[#092B20] drop-shadow-[0_1px_3px_rgba(0,0,0,0.4)] sm:drop-shadow-none leading-[1.2] tracking-normal">
                <span className="block text-[#FFFDF8] sm:text-[#092B20]">Elements in Harmony</span>
                <span className="block font-normal sm:font-light text-[#FFFDF8] sm:text-[#092B20] sm:whitespace-nowrap mt-0.5 sm:mt-0">
                  Higher Consciousness
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
                className="text-xl min-[360px]:text-2xl min-[410px]:text-[26px] sm:text-4xl md:text-[44px] lg:text-[46px] xl:text-[54px] 2xl:text-[58px] font-serif font-normal sm:font-light text-[#FFFDF8] sm:text-[#092B20] drop-shadow-[0_1px_3px_rgba(0,0,0,0.4)] sm:drop-shadow-none leading-[1.2] tracking-normal"
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
                  className="block text-[#FFFDF8] sm:text-[#092B20]"
                >
                  Elements in Harmony
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
                  className="block font-normal sm:font-light text-[#FFFDF8] sm:text-[#092B20] sm:whitespace-nowrap mt-0.5 sm:mt-0"
                >
                  Higher Consciousness
                </motion.span>
              </motion.h1>
            )}

            {/* Framer Motion Animated Subtext */}
            {shouldReduceMotion ? (
              <p className="text-[11px] min-[360px]:text-xs sm:text-sm md:text-base text-[#F5EDE0] sm:text-[#3E362D] drop-shadow-[0_1px_2px_rgba(0,0,0,0.35)] sm:drop-shadow-none leading-relaxed max-w-md font-normal sm:font-light">
                Handcrafted 100% charcoal-free sacred incense suites, pure botanical resins, and solid cast brassware made for quiet living.
              </p>
            ) : (
              <motion.p
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.35, ease: LUXURY_EASE }}
                className="text-[11px] min-[360px]:text-xs sm:text-sm md:text-base text-[#F5EDE0] sm:text-[#3E362D] drop-shadow-[0_1px_2px_rgba(0,0,0,0.35)] sm:drop-shadow-none leading-relaxed max-w-md font-normal sm:font-light"
              >
                Handcrafted 100% charcoal-free sacred incense suites, pure botanical resins, and solid cast brassware made for quiet living.
              </motion.p>
            )}

            {/* Action Buttons - Compact on Mobile */}
            {shouldReduceMotion ? (
              <div className="flex flex-row items-center gap-2 sm:gap-4 pt-1 sm:pt-1 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={onExploreGifts}
                  className="flex-1 sm:flex-initial inline-flex items-center justify-center px-3 py-2 min-[360px]:px-4 min-[360px]:py-2.5 sm:px-8 sm:py-4 bg-[#C5A45B] hover:bg-[#B5934A] text-white text-[9.5px] min-[360px]:text-[10.5px] sm:text-sm font-bold tracking-wide uppercase rounded-full shadow-md hover:shadow-xl transition-all duration-200 active:scale-[0.98] cursor-pointer whitespace-nowrap"
                >
                  Explore Collection
                </button>

                <button
                  type="button"
                  onClick={onExploreBestsellers || onExploreGifts}
                  className="flex-1 sm:flex-initial inline-flex items-center justify-center px-3 py-2 min-[360px]:px-4 min-[360px]:py-2.5 sm:px-8 sm:py-4 bg-[#123D2D]/85 hover:bg-[#123D2D] text-white text-[9.5px] min-[360px]:text-[10.5px] sm:text-sm font-semibold tracking-wide uppercase rounded-full border border-[#C5A45B]/60 hover:border-[#C5A45B] transition-all duration-200 shadow-2xs active:scale-[0.98] cursor-pointer backdrop-blur-xs whitespace-nowrap"
                >
                  View Marble Trunk
                </button>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.48, ease: LUXURY_EASE }}
                className="flex flex-row items-center gap-2 sm:gap-4 pt-1 sm:pt-1 w-full sm:w-auto"
              >
                <button
                  type="button"
                  onClick={onExploreGifts}
                  className="flex-1 sm:flex-initial inline-flex items-center justify-center px-3 py-2 min-[360px]:px-4 min-[360px]:py-2.5 sm:px-8 sm:py-4 bg-[#C5A45B] hover:bg-[#B5934A] text-white text-[9.5px] min-[360px]:text-[10.5px] sm:text-sm font-bold tracking-wide uppercase rounded-full shadow-md hover:shadow-xl transition-all duration-200 active:scale-[0.98] cursor-pointer whitespace-nowrap"
                >
                  Explore Collection
                </button>

                <button
                  type="button"
                  onClick={onExploreBestsellers || onExploreGifts}
                  className="flex-1 sm:flex-initial inline-flex items-center justify-center px-3 py-2 min-[360px]:px-4 min-[360px]:py-2.5 sm:px-8 sm:py-4 bg-[#123D2D]/85 hover:bg-[#123D2D] text-white text-[9.5px] min-[360px]:text-[10.5px] sm:text-sm font-semibold tracking-wide uppercase rounded-full border border-[#C5A45B]/60 hover:border-[#C5A45B] transition-all duration-200 shadow-2xs active:scale-[0.98] cursor-pointer backdrop-blur-xs whitespace-nowrap"
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
