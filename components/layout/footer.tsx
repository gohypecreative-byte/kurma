"use client";

import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useScroll, useTransform, useSpring, useReducedMotion } from "motion/react";

export function Footer() {
  const footerRef = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  // Scroll Progress linked to Footer entering and completing in viewport
  const { scrollYProgress } = useScroll({
    target: footerRef,
    offset: ["start end", "end end"],
  });

  // Natural emergence physics: Grand Kurma gracefully rises from below the bottom edge
  const kurmaY = useTransform(scrollYProgress, [0, 0.35, 0.75], [70, 20, 0]);
  const kurmaOpacity = useTransform(scrollYProgress, [0, 0.25, 0.65], [0, 0.5, 1]);

  // Silky smooth spring for luxury tactile feedback
  const springKurmaY = useSpring(kurmaY, { stiffness: 90, damping: 20, mass: 0.8 });
  const springKurmaOpacity = useSpring(kurmaOpacity, { stiffness: 100, damping: 22 });

  return (
    <footer
      ref={footerRef}
      className="relative w-full max-w-full overflow-hidden bg-[#FAF7F2] text-[#1C1B18] border-t border-[#EAE3D8] font-sans"
    >
      {/* Background Product Suite Layer (Matching Website's Products & Color Palette) */}
      <div className="absolute inset-x-0 bottom-0 h-[68%] sm:h-[62%] lg:h-[58%] pointer-events-none select-none overflow-hidden z-0">
        <Image
          src="/images/footer/kurma-footer-products.jpg"
          alt="Kurma 5 Sacred Elements Suite, Brass Turtle Burner and Mysore Sandalwood on Warm Linen"
          fill
          priority={false}
          className="object-cover object-[center_65%] sm:object-center opacity-80"
          sizes="100vw"
        />
        {/* Top Smooth Gradient Fade from website cream into products */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#FAF7F2] via-[#FAF7F2]/70 via-40% to-transparent" />
        {/* Soft bottom mist haze */}
        <div className="absolute inset-x-0 bottom-0 h-28 sm:h-36 lg:h-44 bg-gradient-to-t from-[#FAF7F2] via-[#FAF7F2]/75 to-transparent" />
      </div>

      {/* Main Footer Content Container - Structured to keep columns and bottom Kurma together in view */}
      <div className="relative z-10 w-full max-w-[1800px] mx-auto px-5 sm:px-10 md:px-12 lg:px-16 xl:px-20 min-h-fit sm:min-h-[70vh] lg:min-h-[78vh] flex flex-col justify-between pt-8 sm:pt-14 lg:pt-16 pb-4 sm:pb-6">
        {/* Main Footer Grid - Responsive 2-column on mobile, 4-column on desktop */}
        <div className="grid grid-cols-2 lg:grid-cols-12 gap-x-6 sm:gap-x-10 lg:gap-x-12 xl:gap-x-16 gap-y-7 sm:gap-y-10 lg:gap-y-12 w-full">
          {/* Column 1: Brand Info (full width col-span-2 on mobile, 4 cols on desktop) */}
          <div className="col-span-2 lg:col-span-4 xl:col-span-4">
            <div className="w-full max-w-[440px] flex flex-col items-center space-y-4 sm:space-y-5 lg:space-y-6">
              {/* Brand Logo - Centered horizontally directly above this specific content */}
              <Link
                href="/"
                className="group cursor-pointer inline-flex items-center justify-center -translate-x-5 sm:-translate-x-7 lg:-translate-x-8"
                aria-label="Kurma Home"
              >
                <div className="relative w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 flex items-center justify-center shrink-0">
                  <Image
                    src="/images/logo-transparent.png"
                    alt="Kurma Logo"
                    width={112}
                    height={112}
                    className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105 pointer-events-none"
                    priority
                  />
                </div>
              </Link>

              {/* Text Content */}
              <div className="w-full space-y-3 sm:space-y-4">
                {/* Headline */}
                <h3 className="w-full text-left font-serif text-xl sm:text-3xl lg:text-[34px] font-medium text-[#1C1B18] tracking-tight leading-snug">
                  Your sacred daily ritual
                </h3>

                {/* Description */}
                <p className="w-full text-left text-xs sm:text-base lg:text-[17px] text-stone-600 leading-relaxed font-sans font-normal">
                  Kurma brings 100% charcoal-free temple botanicals, pure Mysore sandalwood, and Moradabad brass heirlooms into quiet rituals for your home.
                </p>
              </div>
            </div>
          </div>

          {/* Column 2: "Menu" (1 col on mobile, 2 cols on desktop) */}
          <div className="col-span-1 lg:col-span-2 xl:col-span-2 space-y-3 sm:space-y-5">
            <h4 className="text-base sm:text-lg lg:text-xl font-serif sm:font-sans font-semibold text-[#1C1B18] tracking-tight">
              Menu
            </h4>
            <ul className="space-y-2.5 sm:space-y-3.5 text-xs sm:text-[15px] lg:text-base text-stone-600 font-normal">
              <li>
                <Link href="/" className="hover:text-black transition-colors block">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/shop" className="hover:text-black transition-colors block">
                  Master Shop
                </Link>
              </li>
              <li>
                <Link href="/elements" className="hover:text-black transition-colors block">
                  5 Elements Suite
                </Link>
              </li>
              <li>
                <Link href="/gift-trunks" className="hover:text-black transition-colors block">
                  Bespoke Trunks
                </Link>
              </li>
              <li>
                <Link href="/ritual" className="hover:text-black transition-colors block">
                  Sacred Ritual
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-black transition-colors block">
                  Our Story
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: "Navigation" (1 col on mobile, 3 cols on desktop) */}
          <div className="col-span-1 lg:col-span-3 xl:col-span-3 space-y-3 sm:space-y-5">
            <h4 className="text-base sm:text-lg lg:text-xl font-serif sm:font-sans font-semibold text-[#1C1B18] tracking-tight">
              Navigation
            </h4>
            <ul className="space-y-2.5 sm:space-y-3.5 text-xs sm:text-[15px] lg:text-base text-stone-600 font-normal">
              <li>
                <Link href="/track-order" className="hover:text-black font-semibold text-[#1C1B18] transition-colors block">
                  Track Your Order
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-black transition-colors block">
                  Contact Concierge
                </Link>
              </li>
              <li>
                <Link href="/reviews" className="hover:text-black transition-colors block">
                  Client Reviews
                </Link>
              </li>
              <li>
                <Link href="/shipping-policy" className="hover:text-black transition-colors block">
                  Shipping Policy
                </Link>
              </li>
              <li>
                <Link href="/refund-policy" className="hover:text-black transition-colors block">
                  Refund &amp; Returns
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-black transition-colors block">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-black transition-colors block">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: "More products" (2 cols on mobile with 2 sub-columns, 3 cols on desktop) */}
          <div className="col-span-2 sm:col-span-2 lg:col-span-3 xl:col-span-3 space-y-3 sm:space-y-5 pt-2 sm:pt-0 border-t border-stone-200/50 sm:border-t-0">
            <h4 className="text-base sm:text-lg lg:text-xl font-serif sm:font-sans font-semibold text-[#1C1B18] tracking-tight">
              More products
            </h4>
            <ul className="grid grid-cols-2 gap-x-6 gap-y-2.5 sm:block sm:space-y-3.5 text-xs sm:text-[15px] lg:text-base text-stone-600 font-normal">
              <li>
                <Link href="/elements?box=fragrance-earth" className="hover:text-black transition-colors block">
                  Prithvi &bull; Sacred Earth
                </Link>
              </li>
              <li>
                <Link href="/elements?box=fragrance-water" className="hover:text-black transition-colors block">
                  Jal &bull; Mystic Water
                </Link>
              </li>
              <li>
                <Link href="/elements?box=fragrance-fire" className="hover:text-black transition-colors block">
                  Agni &bull; Golden Fire
                </Link>
              </li>
              <li>
                <Link href="/elements?box=fragrance-air" className="hover:text-black transition-colors block">
                  Vayu &bull; Mountain Air
                </Link>
              </li>
              <li>
                <Link href="/elements?box=fragrance-space" className="hover:text-black transition-colors block">
                  Akash &bull; Cosmic Space
                </Link>
              </li>
              <li>
                <Link href="/products/turtle-incense-holder" className="hover:text-black transition-colors block">
                  Brass Turtle Burner
                </Link>
              </li>
              <li className="col-span-2 sm:col-span-1">
                <Link href="/gift-trunks" className="hover:text-black transition-colors block">
                  Flagship Marble Suite
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* MAIN HIGHLIGHT: GRAND DISPLAY WATERMARK - Perfectly fitted within view */}
        <div className="relative w-full pt-4 sm:pt-6 lg:pt-8 pb-1 sm:pb-3 flex items-center justify-center overflow-hidden pointer-events-none select-none">
          {/* Grand "Kurma" Serif Wordmark - Increased Font Size */}
          <motion.span
            style={
              reduced
                ? {}
                : {
                  y: springKurmaY,
                  opacity: springKurmaOpacity,
                }
            }
            className="relative z-20 font-serif font-medium text-[19vw] sm:text-[17vw] md:text-[16vw] lg:text-[15vw] xl:text-[14.5vw] leading-[0.82] tracking-tight text-white/95 drop-shadow-[0_4px_30px_rgba(0,0,0,0.18)] block whitespace-nowrap text-center"
          >
            Kurma
          </motion.span>
        </div>
      </div>
    </footer>
  );
}
