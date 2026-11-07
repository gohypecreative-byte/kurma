"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform, useSpring, useReducedMotion } from "motion/react";
import { CartItem } from "@/components/cart/cart-drawer";
import { ProductSKU } from "@/lib/products";

interface SolutionsAndTrustProps {
  onAddToCart?: (item: CartItem) => void;
  onCustomizeProduct?: (product: ProductSKU) => void;
}

export function SolutionsAndTrust({
  onAddToCart,
  onCustomizeProduct,
}: SolutionsAndTrustProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  // Scroll tracking across the sticky section
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Silky smooth spring physics for effortless scroll response
  const smoothProgress = useSpring(scrollYProgress, {
    damping: 24,
    stiffness: 120,
    mass: 0.2,
  });

  // Slide 1 (The Wedding Edit): Seamless slide-in
  const slide1YMotion = useTransform(smoothProgress, [0.08, 0.46], ["100%", "0%"]);
  const slide1OpacityMotion = useTransform(smoothProgress, [0.08, 0.22], [0, 1]);

  // Slide 2 (For Business): Seamless slide-in
  const slide2YMotion = useTransform(smoothProgress, [0.52, 0.90], ["100%", "0%"]);
  const slide2OpacityMotion = useTransform(smoothProgress, [0.52, 0.66], [0, 1]);

  // Reduced motion fallbacks
  const slide1Y = shouldReduceMotion ? "0%" : slide1YMotion;
  const slide1Opacity = shouldReduceMotion
    ? useTransform(smoothProgress, [0.15, 0.45], [0, 1])
    : slide1OpacityMotion;

  const slide2Y = shouldReduceMotion ? "0%" : slide2YMotion;
  const slide2Opacity = shouldReduceMotion
    ? useTransform(smoothProgress, [0.55, 0.85], [0, 1])
    : slide2OpacityMotion;

  return (
    <section
      id="solutions"
      ref={containerRef}
      className="relative w-full bg-[#FAF7F2] select-none"
      style={{ height: "230vh" }}
    >
      {/* Sticky Stage: Spanning full width and height without any empty space */}
      <div className="sticky top-0 w-full h-screen overflow-hidden">
        {/* Fullscreen Banner: Fills the entire section without empty space underneath */}
        <div className="relative w-full h-full overflow-hidden bg-[#0B0907]">
          {/* ================= SLIDE 1: THE COMPLETE SUITE ================= */}
          <div className="absolute inset-0 w-full h-full overflow-hidden z-10">
            {/* Bespoke High-Res Cinematic Image */}
            <Image
              src="/images/product/suite-5-elements-fullscreen.jpg"
              alt="Sacred 5 elements luxury suite"
              fill
              priority
              className="object-cover object-center filter brightness-[0.88] contrast-[1.02]"
              sizes="100vw"
            />

            {/* Luxury Ambient Gradient Overlay for Supreme Text Contrast */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-black/20 sm:bg-gradient-to-r sm:from-[#0B0907]/90 sm:via-[#0B0907]/50 sm:to-transparent pointer-events-none" />

            {/* Text Overlay Content */}
            <div className="relative z-10 w-full max-w-7xl mx-auto h-full flex flex-col justify-center px-6 sm:px-10 md:px-14 lg:px-20">
              <div className="max-w-md sm:max-w-lg space-y-3.5 sm:space-y-4 text-white">
                <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-[38px] xl:text-[42px] text-white font-medium leading-[1.16] tracking-tight">
                  Sacred 5 elements{" "}
                  <span className="italic font-serif font-normal text-[#EED08E]">
                    luxury suite
                  </span>
                </h2>

                <p className="text-xs sm:text-sm md:text-[15px] text-stone-200/90 leading-relaxed font-light max-w-md">
                  All five elemental aromas handcrafted with 100% charcoal-free pure botanical extracts, solid cast brass turtle burner and keepsake medallion.
                </p>

                <div className="pt-1 sm:pt-2">
                  <a
                    href="#gifting-gallery"
                    onClick={(e) => {
                      e.preventDefault();
                      const el = document.getElementById("gifting-gallery");
                      if (el) el.scrollIntoView({ behavior: "smooth" });
                    }}
                    className="inline-block text-center bg-[#FAF7F2] hover:bg-white text-[#1C1B18] px-6 py-2.5 sm:px-7 sm:py-3 rounded-lg sm:rounded-xl text-xs font-bold tracking-wider uppercase transition-all shadow-md active:scale-95 cursor-pointer"
                  >
                    EXPLORE THE SUITE
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* ================= SLIDE 2: THE WEDDING EDIT ================= */}
          <motion.div
            style={{
              y: slide1Y,
              opacity: slide1Opacity,
            }}
            className="absolute inset-0 w-full h-full overflow-hidden z-20 pointer-events-auto"
          >
            {/* Bespoke High-Res Cinematic Image */}
            <Image
              src="/images/product/suite-wedding-fullscreen.jpg"
              alt="Sacred fragrance suites for timeless festive celebrations"
              fill
              loading="lazy"
              className="object-cover object-center filter brightness-[0.88] contrast-[1.02]"
              sizes="100vw"
            />

            {/* Luxury Ambient Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-black/20 sm:bg-gradient-to-r sm:from-[#0B0907]/90 sm:via-[#0B0907]/50 sm:to-transparent pointer-events-none" />

            {/* Text Overlay Content */}
            <div className="relative z-10 w-full max-w-7xl mx-auto h-full flex flex-col justify-center px-6 sm:px-10 md:px-14 lg:px-20">
              <div className="max-w-md sm:max-w-lg space-y-3.5 sm:space-y-4 text-white">
                <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-[38px] xl:text-[42px] text-white font-medium leading-[1.16] tracking-tight">
                  Sacred fragrance suites for timeless{" "}
                  <span className="italic font-serif font-normal text-[#EED08E]">
                    festive celebrations
                  </span>
                </h2>

                <p className="text-xs sm:text-sm md:text-[15px] text-stone-200/90 leading-relaxed font-light max-w-md">
                  Handcrafted 100% charcoal-free elemental incense suites and solid cast brass turtle holders, custom-curated for wedding return gifts, sacred rituals, and royal celebrations.
                </p>

                <div className="pt-1 sm:pt-2">
                  <a
                    href="#gifting-gallery"
                    onClick={(e) => {
                      e.preventDefault();
                      const el = document.getElementById("gifting-gallery");
                      if (el) el.scrollIntoView({ behavior: "smooth" });
                    }}
                    className="inline-block text-center bg-[#FAF7F2] hover:bg-white text-[#1C1B18] px-6 py-2.5 sm:px-7 sm:py-3 rounded-lg sm:rounded-xl text-xs font-bold tracking-wider uppercase transition-all shadow-md active:scale-95 cursor-pointer"
                  >
                    START A FREE CONSULTATION
                  </a>
                </div>
              </div>
            </div>
          </motion.div>

          {/* ================= SLIDE 3: FOR BUSINESS ================= */}
          <motion.div
            style={{
              y: slide2Y,
              opacity: slide2Opacity,
            }}
            className="absolute inset-0 w-full h-full overflow-hidden z-30 pointer-events-auto"
          >
            {/* Bespoke High-Res Cinematic Image */}
            <Image
              src="/images/product/suite-corporate-fullscreen.jpg"
              alt="Corporate gifting"
              fill
              loading="lazy"
              className="object-cover object-center filter brightness-[0.88] contrast-[1.02]"
              sizes="100vw"
            />

            {/* Luxury Ambient Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-black/20 sm:bg-gradient-to-r sm:from-[#0B0907]/90 sm:via-[#0B0907]/50 sm:to-transparent pointer-events-none" />

            {/* Text Overlay Content */}
            <div className="relative z-10 w-full max-w-7xl mx-auto h-full flex flex-col justify-center px-6 sm:px-10 md:px-14 lg:px-20">
              <div className="max-w-md sm:max-w-lg space-y-3.5 sm:space-y-4 text-white">
                <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-[38px] xl:text-[42px] text-white font-medium leading-[1.16] tracking-tight">
                  Corporate{" "}
                  <span className="italic font-serif font-normal text-[#EED08E]">
                    gifting
                  </span>
                </h2>

                <p className="text-xs sm:text-sm md:text-[15px] text-stone-200/90 leading-relaxed font-light max-w-md">
                  Not another dry fruit box. Curated, branded, and delivered so your clients and team actually remember who sent it.
                </p>

                <div className="pt-1 sm:pt-2">
                  <a
                    href="#gifting-gallery"
                    onClick={(e) => {
                      e.preventDefault();
                      const el = document.getElementById("gifting-gallery");
                      if (el) el.scrollIntoView({ behavior: "smooth" });
                    }}
                    className="inline-block text-center bg-[#FAF7F2] hover:bg-white text-[#1C1B18] px-6 py-2.5 sm:px-7 sm:py-3 rounded-lg sm:rounded-xl text-xs font-bold tracking-wider uppercase transition-all shadow-md active:scale-95 cursor-pointer"
                  >
                    ENQUIRE FOR BULK ORDERS
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
