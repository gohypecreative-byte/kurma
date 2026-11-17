"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ShoppingCart, Check } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { createCartItemId } from "@/lib/products";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface UnboxingExperienceProps {
  onAddToCart?: (item: any) => void;
  onCustomizeProduct?: (productId: string) => void;
}

const FIVE_ELEMENTS_PRODUCTS = [
  {
    id: "fragrance-earth",
    skuId: "fragrance-earth",
    element: "Earth",
    name: "Earth Luxury Incense",
    subtitle: "Vetiver, Wild Herbs & Sacred Forest Bark",
    category: "Pancha Mahabhuta",
    price: 399,
    originalPrice: 499,
    priceDisplay: "₹399",
    originalPriceDisplay: "₹499",
    badge: "Prithvi • Earth",
    image: "/images/unboxing/products/earth-v2.jpg",
    accentGlow: "rgba(18, 61, 45, 0.4)",
    rating: 5,
  },
  {
    id: "fragrance-water",
    skuId: "fragrance-water",
    element: "Water",
    name: "Water Luxury Incense",
    subtitle: "Sacred Lotus, Jasmine & Ocean Mist",
    category: "Pancha Mahabhuta",
    price: 399,
    originalPrice: 499,
    priceDisplay: "₹399",
    originalPriceDisplay: "₹499",
    badge: "Jala • Water",
    image: "/images/unboxing/products/water-v2.jpg",
    accentGlow: "rgba(27, 59, 111, 0.4)",
    rating: 5,
  },
  {
    id: "fragrance-fire",
    skuId: "fragrance-fire",
    element: "Fire",
    name: "Fire Luxury Incense",
    subtitle: "Sacred Camphor, Saffron & Warm Spices",
    category: "Pancha Mahabhuta",
    price: 399,
    originalPrice: 499,
    priceDisplay: "₹399",
    originalPriceDisplay: "₹499",
    badge: "Agni • Fire",
    image: "/images/unboxing/products/fire-v2.jpg",
    accentGlow: "rgba(123, 30, 30, 0.4)",
    rating: 5,
  },
  {
    id: "fragrance-air",
    skuId: "fragrance-air",
    element: "Air",
    name: "Air Luxury Incense",
    subtitle: "Fresh Herbs, Cardamom & Forest Breeze",
    category: "Pancha Mahabhuta",
    price: 399,
    originalPrice: 499,
    priceDisplay: "₹399",
    originalPriceDisplay: "₹499",
    badge: "Vayu • Air",
    image: "/images/unboxing/products/air-v2.jpg",
    accentGlow: "rgba(197, 164, 91, 0.4)",
    rating: 5,
  },
  {
    id: "fragrance-space",
    skuId: "fragrance-space",
    element: "Space",
    name: "Space Luxury Incense",
    subtitle: "Cosmic Frankincense, Amber & Sacred Resins",
    category: "Pancha Mahabhuta",
    price: 399,
    originalPrice: 499,
    priceDisplay: "₹399",
    originalPriceDisplay: "₹499",
    badge: "Akasha • Space",
    image: "/images/unboxing/products/space-v2.jpg",
    accentGlow: "rgba(30, 30, 45, 0.5)",
    rating: 5,
  },
];

export function UnboxingExperience({ onAddToCart }: UnboxingExperienceProps) {
  const { addToCart: contextAddToCart } = useCart();
  const effectiveAddToCart = onAddToCart || contextAddToCart;

  const sectionRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const boxStageRef = useRef<HTMLDivElement>(null);
  const boxLidRef = useRef<HTMLDivElement>(null);
  const lidFrontLipRef = useRef<HTMLDivElement>(null);
  const lidLeftWingRef = useRef<HTMLDivElement>(null);
  const lidRightWingRef = useRef<HTMLDivElement>(null);
  const boxClaspRef = useRef<HTMLDivElement>(null);
  const trayWithProductsRef = useRef<HTMLDivElement>(null);

  // Emerging products refs (individual items that emerge from the box)
  const emergingProductsGroupRef = useRef<HTMLDivElement>(null);
  const emergingItemRefs = useRef<(HTMLDivElement | null)[]>([]);

  const auraGlowRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);

  const [addedIds, setAddedIds] = useState<Record<string, boolean>>({});

  const handleQuickAdd = (product: (typeof FIVE_ELEMENTS_PRODUCTS)[0]) => {
    effectiveAddToCart({
      id: createCartItemId(product.id),
      skuId: product.skuId,
      name: product.name,
      price: product.price,
      priceDisplay: product.priceDisplay,
      image: product.image,
      quantity: 1,
    });

    setAddedIds((prev) => ({ ...prev, [product.id]: true }));
    setTimeout(() => {
      setAddedIds((prev) => ({ ...prev, [product.id]: false }));
    }, 1500);
  };

  useEffect(() => {
    const sectionEl = sectionRef.current;
    const stageEl = boxStageRef.current;
    const lidEl = boxLidRef.current;
    const lidFrontLipEl = lidFrontLipRef.current;
    const lidLeftWingEl = lidLeftWingRef.current;
    const lidRightWingEl = lidRightWingRef.current;
    const claspEl = boxClaspRef.current;
    const trayWithProductsEl = trayWithProductsRef.current;
    const emergingGroupEl = emergingProductsGroupRef.current;
    const auraEl = auraGlowRef.current;
    const titleEl = titleRef.current;

    if (!sectionEl || !stageEl || !lidEl) return;

    const ctx = gsap.context(() => {
      // Calculate responsive spacing to prevent cut-off, overlap, and overflow
      const width = typeof window !== "undefined" ? window.innerWidth : 1200;
      const isMobile = width < 640;
      const isTablet = width < 1024;

      const boxInitY = isMobile ? 32 : isTablet ? 46 : 58;

      // 1. Initial 3D state of the box - Centered & visible immediately (No white blank space before!)
      gsap.set(stageEl, {
        y: boxInitY,
        rotateX: 20,
        rotateY: 0,
        rotateZ: 0,
        scale: 1,
        opacity: 1,
        visibility: "visible",
        transformPerspective: 1200,
        transformStyle: "preserve-3d",
      });

      // 2. Lid starts closed flat on top of the box
      gsap.set(lidEl, {
        transformOrigin: "center top",
        rotateX: 0,
        transformStyle: "preserve-3d",
      });

      if (lidFrontLipEl) {
        gsap.set(lidFrontLipEl, {
          transformOrigin: "center top",
          rotateX: 90,
        });
      }

      if (lidLeftWingEl) {
        gsap.set(lidLeftWingEl, {
          transformOrigin: "left center",
          rotateY: 80,
        });
      }

      if (lidRightWingEl) {
        gsap.set(lidRightWingEl, {
          transformOrigin: "right center",
          rotateY: -80,
        });
      }

      // 3. Emerging products start nested inside the box tray
      if (emergingGroupEl) {
        gsap.set(emergingGroupEl, {
          opacity: 0,
          pointerEvents: "none",
        });
      }

      emergingItemRefs.current.forEach((el, index) => {
        if (el) {
          gsap.set(el, {
            y: 35,
            z: -10,
            x: (index - 2) * 10,
            rotateX: 20,
            rotateZ: 0,
            scale: 0.52,
            opacity: 0,
          });
        }
      });

      // Hide extra card details (stars, subtitle, price, add button) while in 3D floating mode
      const extraDetails = sectionEl.querySelectorAll(".card-extra-detail");
      if (extraDetails.length > 0) {
        gsap.set(extraDetails, { opacity: 0 });
      }

      if (trayWithProductsEl) {
        gsap.set(trayWithProductsEl, { opacity: 1 });
      }

      if (auraEl) {
        gsap.set(auraEl, { opacity: 0, scale: 0.8 });
      }

      // Title stays fixed at top — no Y animation needed
      if (titleEl) {
        gsap.set(titleEl, { y: 0 });
      }

      // State A: Compact 3D fan-out floating above box
      const fanBaseY = isMobile ? 36 : isTablet ? 65 : 82;
      const fanStep = isMobile ? Math.min(width * 0.165, 62) : isTablet ? 116 : 158;
      const fanOffsets = [
        { x: -2 * fanStep, y: fanBaseY + (isMobile ? 14 : 22), z: 20, rotateZ: -5, scale: isMobile ? 0.88 : 0.84 },
        { x: -1 * fanStep, y: fanBaseY + (isMobile ? 5 : 8), z: 45, rotateZ: -2.5, scale: isMobile ? 0.92 : 0.88 },
        { x: 0,             y: fanBaseY + (isMobile ? -4 : -8), z: 70, rotateZ: 0, scale: isMobile ? 0.98 : 0.92 },
        { x: 1 * fanStep,   y: fanBaseY + (isMobile ? 5 : 8), z: 45, rotateZ: 2.5, scale: isMobile ? 0.92 : 0.88 },
        { x: 2 * fanStep,   y: fanBaseY + (isMobile ? 14 : 22), z: 20, rotateZ: 5, scale: isMobile ? 0.88 : 0.84 },
      ];

      // State B: Dedicated Product Section Row
      const sectionStep = isMobile ? Math.min(width * 0.182, 74) : isTablet ? Math.min(width * 0.195, 172) : Math.min(width * 0.195, 252);
      const cardYOffset = isMobile ? 32 : isTablet ? 58 : 72;
      const sectionOffsets = [
        { x: -2 * sectionStep, y: cardYOffset, z: 0, rotateZ: 0, scale: 1 },
        { x: -1 * sectionStep, y: cardYOffset, z: 0, rotateZ: 0, scale: 1 },
        { x: 0,                y: cardYOffset, z: 0, rotateZ: 0, scale: 1 },
        { x: 1 * sectionStep,  y: cardYOffset, z: 0, rotateZ: 0, scale: 1 },
        { x: 2 * sectionStep,  y: cardYOffset, z: 0, rotateZ: 0, scale: 1 },
      ];

      // MASTER COORDINATED GSAP TIMELINE CONTROLLED BY SCROLL WITH SCRUB
      const masterTl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionEl,
          start: "top top",
          end: "+=180%",
          scrub: 0.8,
          pin: true,
          anticipatePin: 0,
          onUpdate: (self) => {
            const prog = self.progress;

            // Enable interactivity once cards transform into product section
            if (emergingGroupEl) {
              emergingGroupEl.style.pointerEvents = prog >= 0.72 ? "auto" : "none";
            }

            // Ensure the box stage remains strictly hidden once it has moved upward
            if (stageEl) {
              if (prog >= 0.74) {
                stageEl.style.visibility = "hidden";
                stageEl.style.pointerEvents = "none";
              } else {
                stageEl.style.visibility = "visible";
              }
            }
          },
        },
      });

      // ──────────────────────────────────────────────────────────
      // STAGE 1: CLASP UNLOCKS (0.0 -> 0.12)
      // ──────────────────────────────────────────────────────────
      if (claspEl) {
        masterTl.to(
          claspEl,
          {
            y: -14,
            opacity: 0.3,
            duration: 0.08,
            ease: "power1.inOut",
          },
          0.04
        );
      }

      // ──────────────────────────────────────────────────────────
      // STAGE 2: LID FLIPS BACKWARD IN 3D PERSPECTIVE (0.06 -> 0.38)
      // Box tilts slightly forward so interior is visible
      // ──────────────────────────────────────────────────────────
      masterTl.to(
        lidEl,
        {
          rotateX: -125,
          duration: 0.28,
          ease: "power1.inOut",
        },
        0.06
      );

      if (lidFrontLipEl) {
        masterTl.to(
          lidFrontLipEl,
          {
            rotateX: 0,
            duration: 0.24,
            ease: "power1.inOut",
          },
          0.06
        );
      }

      if (lidLeftWingEl) {
        masterTl.to(
          lidLeftWingEl,
          {
            rotateY: 20,
            duration: 0.20,
            ease: "power1.inOut",
          },
          0.08
        );
      }

      if (lidRightWingEl) {
        masterTl.to(
          lidRightWingEl,
          {
            rotateY: -20,
            duration: 0.20,
            ease: "power1.inOut",
          },
          0.08
        );
      }

      masterTl.to(
        stageEl,
        {
          y: boxInitY + 10,
          rotateX: 28,
          scale: 1.04,
          duration: 0.24,
          ease: "power1.inOut",
        },
        0.08
      );

      // ──────────────────────────────────────────────────────────
      // STAGE 3: PRODUCTS EMERGE FROM THE BOX IN SYNCHRONIZATION
      // (Starts as lid clears from 0.16 -> 0.48)
      // Tray cross-fades to empty velvet tray so NO products remain inside!
      // ──────────────────────────────────────────────────────────
      if (emergingGroupEl) {
        masterTl.to(
          emergingGroupEl,
          {
            opacity: 1,
            duration: 0.10,
            ease: "power1.out",
          },
          0.16
        );
      }

      if (trayWithProductsEl) {
        masterTl.to(
          trayWithProductsEl,
          {
            opacity: 0,
            duration: 0.20,
            ease: "power1.inOut",
          },
          0.18
        );
      }

      // Animate each of the 5 products smoothly lifting up and fanning out into 3D State A
      emergingItemRefs.current.forEach((el, index) => {
        if (el) {
          masterTl.to(
            el,
            {
              y: fanOffsets[index].y,
              x: fanOffsets[index].x,
              z: fanOffsets[index].z,
              rotateX: 10,
              rotateZ: fanOffsets[index].rotateZ,
              scale: fanOffsets[index].scale,
              opacity: 1,
              duration: 0.32,
              ease: "power2.out",
            },
            0.18 + index * 0.02
          );
        }
      });

      if (auraEl) {
        masterTl.to(
          auraEl,
          {
            opacity: 0.85,
            scale: 1.3,
            duration: 0.24,
            ease: "sine.inOut",
          },
          0.24
        );
      }

      // ──────────────────────────────────────────────────────────
      // STAGE 4: BOX ANIMATES UPWARD UNTIL IT DISAPPEARS FROM SCREEN
      // (Progress 0.50 -> 0.74)
      // ──────────────────────────────────────────────────────────
      masterTl.to(
        stageEl,
        {
          y: "-40vh",
          autoAlpha: 0,
          scale: 0.65,
          duration: 0.20,
          ease: "power2.in",
        },
        0.50
      );

      // Title stays fixed at top — no animation needed

      // ──────────────────────────────────────────────────────────
      // STAGE 5: TRANSFORM THOSE EXACT SAME 5 PRODUCT CARDS INTO
      // THE DEDICATED PRODUCT SECTION
      // (Progress 0.52 -> 0.76)
      // Flatten 3D rotations, expand to full product layout & reveal details
      // ──────────────────────────────────────────────────────────
      emergingItemRefs.current.forEach((el, index) => {
        if (el) {
          masterTl.to(
            el,
            {
              x: sectionOffsets[index].x,
              y: sectionOffsets[index].y,
              z: 0,
              rotateX: 0,
              rotateY: 0,
              rotateZ: 0,
              scale: 1,
              duration: 0.24,
              ease: "power2.inOut",
            },
            0.52 + index * 0.015
          );
        }
      });

      // Smoothly reveal rating stars, subtitle, price, and "+ Add" button
      if (extraDetails.length > 0) {
        masterTl.to(
          extraDetails,
          {
            opacity: 1,
            duration: 0.20,
            ease: "power1.out",
          },
          0.58
        );
      }

      // ──────────────────────────────────────────────────────────
      // FINAL STATE: FIVE PRODUCTS REMAIN VISIBLE IN PRODUCT SECTION
      // (Holds in place through 0.76 -> 1.00, fully interactive & reversible!)
      // ──────────────────────────────────────────────────────────
      masterTl.to(
        {},
        {
          duration: 0.24,
        },
        0.76
      );

      // Auto-refresh ScrollTrigger when layouts settle so trigger points are 100% accurate
      const refreshST = () => {
        ScrollTrigger.refresh();
      };
      window.addEventListener("load", refreshST);
      const timer1 = setTimeout(refreshST, 250);
      const timer2 = setTimeout(refreshST, 800);
      const timer3 = setTimeout(refreshST, 1800);

      return () => {
        window.removeEventListener("load", refreshST);
        clearTimeout(timer1);
        clearTimeout(timer2);
        clearTimeout(timer3);
      };
    }, sectionEl);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="unboxing-ritual"
      className="relative z-30 w-full h-[100dvh] min-h-[560px] bg-[#FAF7F2] text-[#1C1B18] select-none flex flex-col justify-between border-t border-[#EAE3D8] overflow-hidden"
    >
      {/* Ambient Luxury Lighting Backdrop (Clean Warm Studio Vignette) */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 50% 48%, #FFFFFF 0%, #FAF7F2 70%, #F2ECE1 100%)",
        }}
      />

      {/* Golden Aura Glow (Illuminates the opened chest and emerging products) */}
      <div
        ref={auraGlowRef}
        className="absolute inset-0 pointer-events-none flex items-center justify-center"
      >
        <div className="w-[650px] h-[450px] rounded-full bg-[#C5A45B]/15 blur-3xl" />
      </div>

      {/* SECTION HEADER */}
      <div
        ref={titleRef}
        className="absolute top-0 inset-x-0 z-40 pt-16 min-[380px]:pt-18 sm:pt-24 lg:pt-28 px-3 sm:px-6 max-w-4xl mx-auto text-center pointer-events-none"
      >
        <h2 className="font-serif text-xl min-[380px]:text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-medium tracking-tight leading-tight text-[#1C1B18]">
          The 5 Elements Collection
        </h2>
      </div>

      {/* 3D BOX STAGE & PRODUCT CARDS CONTAINER */}
      <div
        ref={containerRef}
        className="relative z-20 flex-1 w-full max-w-full flex items-center justify-center px-1 sm:px-4 lg:px-6 pt-14 sm:pt-20 pb-3 sm:pb-6 overflow-hidden"
        style={{
          perspective: "1200px",
        }}
      >
        {/* THE 3D GREEN MARBLE BOX (Opens, products emerge, then moves upward & vanishes) */}
        <div
          ref={boxStageRef}
          className="relative w-[250px] min-[380px]:w-[280px] sm:w-[340px] md:w-[390px] lg:w-[420px] aspect-[417/370] rounded-2xl shadow-2xl transition-shadow"
          style={{
            transformStyle: "preserve-3d",
            willChange: "transform, opacity",
          }}
        >
          {/* BOX BASE TRAY */}
          <div
            className="absolute inset-0 rounded-2xl overflow-hidden border border-[#28513B]/80 shadow-2xl"
            style={{
              backgroundColor: "#0A241A",
              transformStyle: "preserve-3d",
            }}
          >
            {/* 1. Empty Velvet Interior Tray (Revealed as products emerge) */}
            <div className="absolute inset-0">
              <Image
                src="/images/unboxing/empty-tray.png"
                alt="Empty Kurma Luxury Suite Tray"
                fill
                priority
                sizes="(max-width: 768px) 90vw, 450px"
                className="object-cover object-center"
              />
              <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/50 via-transparent to-black/20" />
            </div>

            {/* 2. Tray with 5 products (Smoothly fades out as 3D products lift out) */}
            <div ref={trayWithProductsRef} className="absolute inset-0">
              <Image
                src="/images/unboxing/suite-5-elements-tray.png"
                alt="Kurma 5 Elements Incense Luxury Suite"
                fill
                priority
                sizes="(max-width: 768px) 90vw, 450px"
                className="object-cover object-center"
              />
              <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/40 via-transparent to-black/20" />
            </div>

            {/* Front Marble Wall & Brass Clasp Base */}
            <div className="absolute inset-x-0 bottom-0 h-9 sm:h-11 bg-transparent flex items-center justify-center z-10 pointer-events-none">
              <div
                ref={boxClaspRef}
                className="w-13 sm:w-15 h-5 sm:h-6 rounded-sm bg-gradient-to-b from-[#E5C985] via-[#C5A45B] to-[#8C6215] border border-[#FFE7A8] shadow-md flex items-center justify-center"
              >
                <div className="w-2.5 h-2.5 rounded-full border border-[#523B0F] bg-[#3B2909]" />
              </div>
            </div>
          </div>

          {/* HINGED TOP LID (Flips backward in 3D during Stage 2) */}
          <div
            ref={boxLidRef}
            className="absolute inset-x-0 top-0 h-full rounded-2xl border border-[#28513B] shadow-2xl"
            style={{
              transformOrigin: "center top",
              transformStyle: "preserve-3d",
              willChange: "transform",
            }}
          >
            {/* Top Outer Marble Face (Visible when closed) */}
            <div
              className="absolute inset-0 rounded-2xl overflow-hidden border border-[#3C6E52]/40 bg-[#123D2D]"
              style={{
                backfaceVisibility: "hidden",
                transform: "rotateY(0deg)",
              }}
            >
              <Image
                src="/images/unboxing/suite-5-elements-lid-top.png"
                alt="Kurma Green Marble Box Top"
                fill
                priority
                sizes="450px"
                className="object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-white/10" />
            </div>

            {/* Inner Velvet Inscription Face (Revealed when opened backwards) */}
            <div
              className="absolute inset-0 rounded-2xl overflow-hidden border border-[#3C6E52] bg-[#0A241A]"
              style={{
                backfaceVisibility: "hidden",
                transform: "rotateX(180deg)",
              }}
            >
              <Image
                src="/images/unboxing/suite-5-elements-lid-inner.png"
                alt="Elements in Harmony Inner Lid"
                fill
                sizes="450px"
                className="object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-[#C5A45B]/15 via-transparent to-black/50" />
            </div>

            {/* Front Lip / Flap of the Lid */}
            <div
              ref={lidFrontLipRef}
              className="absolute inset-x-0 bottom-0 h-9 sm:h-11 rounded-b-xl overflow-hidden bg-[#123D2D] border-t border-[#3C6E52] flex items-center justify-center"
              style={{
                transformOrigin: "center top",
                backfaceVisibility: "hidden",
              }}
            >
              <Image
                src="/images/unboxing/suite-5-elements-clasp-lip.png"
                alt="Box Clasp Lip"
                fill
                sizes="450px"
                className="object-cover object-center"
              />
            </div>

            {/* Left Tuck Flap */}
            <div
              ref={lidLeftWingRef}
              className="absolute top-0 left-0 w-8 sm:w-10 h-full rounded-l-xl bg-[#0F3527] border-r border-[#28513B]/60"
              style={{
                transformOrigin: "left center",
                backfaceVisibility: "hidden",
              }}
            />

            {/* Right Tuck Flap */}
            <div
              ref={lidRightWingRef}
              className="absolute top-0 right-0 w-8 sm:w-10 h-full rounded-r-xl bg-[#0F3527] border-l border-[#28513B]/60"
              style={{
                transformOrigin: "right center",
                backfaceVisibility: "hidden",
              }}
            />
          </div>
        </div>

        {/* ──────────────────────────────────────────────────────────
            THE EXACT SAME 5 PRODUCTS:
            Emerges in 3D from the box -> transforms into the dedicated
            product section as the box moves upward and vanishes!
            NO duplicate cards or extra sections!
           ────────────────────────────────────────────────────────── */}
        <div
          ref={emergingProductsGroupRef}
          className="absolute inset-0 flex items-center justify-center z-25 pointer-events-none"
          style={{ perspective: "1200px" }}
        >
          {FIVE_ELEMENTS_PRODUCTS.map((prod, index) => {
            const isAdded = !!addedIds[prod.id];
            return (
              <div
                key={`product-card-${prod.id}`}
                ref={(el) => {
                  emergingItemRefs.current[index] = el;
                }}
                className="absolute w-[66px] min-[380px]:w-[74px] min-[420px]:w-[80px] sm:w-[122px] md:w-[164px] lg:w-[214px] xl:w-[242px] rounded-xl sm:rounded-2xl border border-stone-200/90 bg-white flex flex-col justify-between p-1 min-[380px]:p-1.5 sm:p-2.5 md:p-3 lg:p-3.5 transition-shadow shadow-xl shadow-stone-900/10 hover:border-[#C5A45B]"
                style={{
                  transformStyle: "preserve-3d",
                  willChange: "transform, opacity",
                  backfaceVisibility: "hidden",
                }}
              >
                {/* Product Image Visual Container */}
                <div className="relative w-full aspect-[445/640] my-0.5 sm:my-1 rounded-lg sm:rounded-xl overflow-hidden bg-white border border-stone-200/60 flex items-center justify-center shadow-xs">
                  <Image
                    src={prod.image}
                    alt={prod.name}
                    fill
                    priority
                    sizes="(max-width: 640px) 25vw, (max-width: 1024px) 20vw, 250px"
                    className="object-contain object-center transition-transform duration-300"
                  />
                </div>

                {/* Product Name */}
                <div className="pt-0.5">
                  <h4 className="font-sans text-[8.5px] min-[380px]:text-[9.5px] sm:text-xs md:text-sm lg:text-[15px] font-semibold text-[#1C1B18] truncate">
                    {prod.name}
                  </h4>
                </div>

                {/* Price and Action Button (Reveals during transformation to product section) */}
                <div className="card-extra-detail pt-1 sm:pt-1.5 mt-0.5 sm:mt-1 border-t border-stone-200/80 flex items-center justify-between gap-0.5 sm:gap-1 opacity-0">
                  <div className="flex flex-col min-w-0">
                    <span className="font-sans text-[9px] min-[380px]:text-[10.5px] sm:text-xs md:text-sm lg:text-base font-bold text-[#8C6215] leading-tight">
                      {prod.priceDisplay}
                    </span>
                    <span className="font-sans text-[7px] min-[380px]:text-[8px] sm:text-[9.5px] md:text-[11px] text-stone-400 line-through leading-tight">
                      {prod.originalPriceDisplay}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleQuickAdd(prod)}
                    title={isAdded ? "Added to cart" : `Add ${prod.name} to cart`}
                    aria-label={isAdded ? "Added to cart" : `Add ${prod.name} to cart`}
                    className={`w-5.5 h-5.5 min-[380px]:w-6.5 min-[380px]:h-6.5 sm:w-8 sm:h-8 lg:w-8.5 lg:h-8.5 rounded-md sm:rounded-lg flex items-center justify-center transition-all cursor-pointer shadow-xs active:scale-95 shrink-0 ${
                      isAdded
                        ? "bg-emerald-600 text-white"
                        : "bg-[#1C1B18] hover:bg-[#8C6215] text-[#FAF7F2]"
                    }`}
                  >
                    {isAdded ? (
                      <Check className="w-3 h-3 sm:w-4 sm:h-4 stroke-[2.5]" />
                    ) : (
                      <ShoppingCart className="w-2.5 h-2.5 min-[380px]:w-3.5 min-[380px]:h-3.5 sm:w-4 sm:h-4 stroke-[1.8]" />
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
