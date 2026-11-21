"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ShoppingCart, Check, Heart, ChevronLeft, ChevronRight } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { useWishlist } from "@/lib/wishlist-context";
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

const TURTLE_PRODUCT = {
  id: "turtle-incense-holder",
  skuId: "turtle-incense-holder",
  element: "Kurma",
  name: "Solid Brass Turtle Burner",
  subtitle: "Handcrafted Pure Sand-Cast Brass Ritual Stand",
  badge: "Kurma • Sacred Keepsake",
  image: "/images/unboxing/turtle-isolated.png",
  accentGlow: "rgba(197, 164, 91, 0.45)",
};

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
  const turtleItemRef = useRef<HTMLDivElement>(null);

  const router = useRouter();
  const auraGlowRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);

  const { isInWishlist, toggleWishlist } = useWishlist();
  const [addedIds, setAddedIds] = useState<Record<string, boolean>>({});

  // Mobile horizontal scroll carousel state & auto-scroll
  const mobileScrollRef = useRef<HTMLDivElement>(null);
  const [mobileActiveIndex, setMobileActiveIndex] = useState(0);
  const [isMobileInteracting, setIsMobileInteracting] = useState(false);
  const interactionTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Mouse cursor drag-to-scroll refs
  const isMouseDownRef = useRef(false);
  const startXRef = useRef(0);
  const scrollLeftStartRef = useRef(0);
  const hasDraggedRef = useRef(false);

  // Global mouseup listener so cursor drag cleanly ends even when released outside container
  useEffect(() => {
    const handleGlobalMouseUp = () => {
      if (isMouseDownRef.current) {
        handleMouseUpOrLeave();
      }
    };
    window.addEventListener("mouseup", handleGlobalMouseUp);
    return () => {
      window.removeEventListener("mouseup", handleGlobalMouseUp);
    };
  }, []);

  // Auto-advance horizontally every 3.2 seconds on mobile (pauses on user interaction)
  useEffect(() => {
    if (isMobileInteracting) return;

    const interval = setInterval(() => {
      const container = mobileScrollRef.current;
      if (!container) return;

      const cardCount = FIVE_ELEMENTS_PRODUCTS.length;
      const firstCard = container.firstElementChild as HTMLElement;
      const step = firstCard ? firstCard.offsetWidth + 12 : container.clientWidth / 2;
      const maxScroll = container.scrollWidth - container.clientWidth;

      setMobileActiveIndex((prev) => {
        const next = (prev + 1) % cardCount;

        container.scrollTo({
          left: next === 0 ? 0 : Math.min(next * step, maxScroll),
          behavior: "smooth",
        });

        return next;
      });
    }, 3200);

    return () => clearInterval(interval);
  }, [isMobileInteracting]);

  const handleMobileScroll = () => {
    const container = mobileScrollRef.current;
    if (!container) return;

    const cardCount = FIVE_ELEMENTS_PRODUCTS.length;
    const firstCard = container.firstElementChild as HTMLElement;
    const step = firstCard ? firstCard.offsetWidth + 12 : container.clientWidth / 2;
    const currentIdx = Math.round(container.scrollLeft / (step || 1));
    setMobileActiveIndex(Math.min(cardCount - 1, Math.max(0, currentIdx)));

    setIsMobileInteracting(true);
    if (interactionTimerRef.current) clearTimeout(interactionTimerRef.current);
    interactionTimerRef.current = setTimeout(() => {
      setIsMobileInteracting(false);
    }, 3500);
  };

  // Mouse drag handlers for desktop / cursor side-scrolling
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    const container = mobileScrollRef.current;
    if (!container) return;
    isMouseDownRef.current = true;
    hasDraggedRef.current = false;
    startXRef.current = e.pageX;
    scrollLeftStartRef.current = container.scrollLeft;
    setIsMobileInteracting(true);
    // Temporarily turn off CSS snap so manual cursor drag is buttery smooth
    container.style.scrollSnapType = "none";
    container.style.scrollBehavior = "auto";
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isMouseDownRef.current) return;
    const container = mobileScrollRef.current;
    if (!container) return;
    e.preventDefault();
    const currentX = e.pageX;
    const deltaX = currentX - startXRef.current;
    if (Math.abs(deltaX) > 4) {
      hasDraggedRef.current = true;
    }
    container.scrollLeft = scrollLeftStartRef.current - deltaX;
  };

  const handleMouseUpOrLeave = () => {
    if (!isMouseDownRef.current) return;
    isMouseDownRef.current = false;
    const container = mobileScrollRef.current;
    if (container) {
      // Re-enable smooth CSS snapping
      container.style.scrollSnapType = "x mandatory";
      container.style.scrollBehavior = "smooth";
      // Snap to closest card
      const firstCard = container.firstElementChild as HTMLElement;
      const step = firstCard ? firstCard.offsetWidth + 12 : container.clientWidth / 2;
      const nearestIdx = Math.round(container.scrollLeft / (step || 1));
      container.scrollTo({
        left: nearestIdx * step,
        behavior: "smooth",
      });
      setMobileActiveIndex(nearestIdx);
    }

    if (interactionTimerRef.current) clearTimeout(interactionTimerRef.current);
    interactionTimerRef.current = setTimeout(() => {
      setIsMobileInteracting(false);
      hasDraggedRef.current = false;
    }, 3200);
  };

  // Step scroll by left / right button
  const scrollByDirection = (dir: "left" | "right") => {
    const container = mobileScrollRef.current;
    if (!container) return;
    const firstCard = container.firstElementChild as HTMLElement;
    const step = firstCard ? firstCard.offsetWidth + 12 : container.clientWidth / 2;
    container.scrollBy({
      left: dir === "left" ? -step : step,
      behavior: "smooth",
    });
    setIsMobileInteracting(true);
    if (interactionTimerRef.current) clearTimeout(interactionTimerRef.current);
    interactionTimerRef.current = setTimeout(() => {
      setIsMobileInteracting(false);
    }, 3500);
  };

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
    // Disable 3D GSAP Scroll animation on mobile (< 768px) so simple cards render naturally
    if (typeof window !== "undefined" && window.innerWidth < 768) {
      return;
    }

    const sectionEl = sectionRef.current;
    const stageEl = boxStageRef.current;
    const lidEl = boxLidRef.current;
    const lidFrontLipEl = lidFrontLipRef.current;
    const lidLeftWingEl = lidLeftWingRef.current;
    const lidRightWingEl = lidRightWingRef.current;
    const claspEl = boxClaspRef.current;
    const emergingGroupEl = emergingProductsGroupRef.current;
    const turtleEl = turtleItemRef.current;
    const auraEl = auraGlowRef.current;
    const titleEl = titleRef.current;

    if (!sectionEl || !stageEl || !lidEl) return;

    const ctx = gsap.context(() => {
      // Calculate responsive spacing to prevent cut-off, overlap, and overflow
      const width = typeof window !== "undefined" ? window.innerWidth : 1200;
      const isMobile = width < 640;
      const isTablet = width < 1024;

      const boxInitY = isMobile ? 30 : isTablet ? 42 : 50;

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

      // 3. Products group starts hidden inside the closed box
      if (emergingGroupEl) {
        gsap.set(emergingGroupEl, {
          opacity: 0,
          autoAlpha: 0,
          visibility: "hidden",
          pointerEvents: "none",
        });
      }

      // 3D Tray slot positions inside the open box (5 incense boxes + turtle resting naturally in velvet slots)
      const slotX = isTablet ? -54 : -65;
      const slotOffsets = [
        { x: slotX, y: isTablet ? -18 : -22, z: isTablet ? -35 : -44, rotateX: 28, rotateY: 0, rotateZ: -90, scaleX: isTablet ? 0.38 : 0.40, scaleY: isTablet ? 0.90 : 0.94 },
        { x: slotX, y: isTablet ? 15 : 19, z: isTablet ? -18 : -22, rotateX: 28, rotateY: 0, rotateZ: -90, scaleX: isTablet ? 0.38 : 0.40, scaleY: isTablet ? 0.90 : 0.94 },
        { x: slotX, y: isTablet ? 50 : 60, z: 0, rotateX: 28, rotateY: 0, rotateZ: -90, scaleX: isTablet ? 0.38 : 0.40, scaleY: isTablet ? 0.90 : 0.94 },
        { x: slotX, y: isTablet ? 85 : 101, z: isTablet ? 18 : 22, rotateX: 28, rotateY: 0, rotateZ: -90, scaleX: isTablet ? 0.38 : 0.40, scaleY: isTablet ? 0.90 : 0.94 },
        { x: slotX, y: isTablet ? 120 : 142, z: isTablet ? 35 : 44, rotateX: 28, rotateY: 0, rotateZ: -90, scaleX: isTablet ? 0.38 : 0.40, scaleY: isTablet ? 0.90 : 0.94 },
      ];
      const turtleSlotOffset = {
        x: isTablet ? 124 : 149,
        y: isTablet ? 50 : 60,
        z: 0,
        rotateX: 28,
        rotateY: 0,
        rotateZ: 0,
        scale: isTablet ? 0.72 : 0.78,
      };

      emergingItemRefs.current.forEach((el, index) => {
        if (el) {
          gsap.set(el, {
            x: slotOffsets[index].x,
            y: slotOffsets[index].y,
            z: slotOffsets[index].z,
            rotateX: slotOffsets[index].rotateX,
            rotateY: slotOffsets[index].rotateY,
            rotateZ: slotOffsets[index].rotateZ,
            scaleX: slotOffsets[index].scaleX,
            scaleY: slotOffsets[index].scaleY,
            opacity: 0,
            autoAlpha: 0,
          });
        }
      });

      if (turtleEl) {
        gsap.set(turtleEl, {
          x: turtleSlotOffset.x,
          y: turtleSlotOffset.y,
          z: turtleSlotOffset.z,
          rotateX: turtleSlotOffset.rotateX,
          rotateY: turtleSlotOffset.rotateY,
          rotateZ: turtleSlotOffset.rotateZ,
          scale: turtleSlotOffset.scale,
          opacity: 0,
          autoAlpha: 0,
        });
      }

      const luxuryLabels = sectionEl.querySelectorAll(".product-luxury-label");
      if (luxuryLabels.length > 0) {
        gsap.set(luxuryLabels, { opacity: 0 });
      }

      if (auraEl) {
        gsap.set(auraEl, { opacity: 0, scale: 0.8 });
      }

      // Title stays fixed at top — no Y animation needed
      if (titleEl) {
        gsap.set(titleEl, { y: 0 });
      }

      // State A: Compact 3D fan-out floating above box
      const fanBaseY = isMobile ? boxInitY - 10 : isTablet ? boxInitY - 20 : boxInitY - 25;
      const fanStep = isTablet ? Math.min(width * 0.14, 100) : Math.min(width * 0.14, 145);
      const fanOffsets = [
        { x: -2.5 * fanStep, y: fanBaseY + 16, z: 20, rotateX: 10, rotateY: 10, rotateZ: -4, scale: isTablet ? 0.76 : 0.82 },
        { x: -1.5 * fanStep, y: fanBaseY + 6, z: 35, rotateX: 10, rotateY: 5, rotateZ: -2, scale: isTablet ? 0.80 : 0.86 },
        { x: -0.5 * fanStep, y: fanBaseY - 4, z: 50, rotateX: 10, rotateY: 2, rotateZ: 0, scale: isTablet ? 0.82 : 0.88 },
        { x: 0.5 * fanStep, y: fanBaseY - 4, z: 50, rotateX: 10, rotateY: -2, rotateZ: 0, scale: isTablet ? 0.82 : 0.88 },
        { x: 1.5 * fanStep, y: fanBaseY + 6, z: 35, rotateX: 10, rotateY: -5, rotateZ: 2, scale: isTablet ? 0.80 : 0.86 },
      ];
      const turtleFanOffset = {
        x: 2.5 * fanStep,
        y: fanBaseY + 16,
        z: 22,
        rotateX: 10,
        rotateY: -10,
        rotateZ: 4,
        scale: isTablet ? 0.74 : 0.80,
      };

      // State B: Majestic final 3D showcase layout (No product cards - 100% individual 3D products side by side)
      const sectionStep = isTablet ? Math.min(width * 0.155, 138) : Math.min(width * 0.158, 200);
      const sectionOffsets = [
        { x: -2.5 * sectionStep, y: 14, z: 10, rotateX: 4, rotateY: 6, rotateZ: -2, scale: isTablet ? 0.98 : 1.05 },
        { x: -1.5 * sectionStep, y: 8, z: 25, rotateX: 4, rotateY: 3, rotateZ: -1, scale: isTablet ? 0.98 : 1.05 },
        { x: -0.5 * sectionStep, y: 0, z: 35, rotateX: 4, rotateY: 1, rotateZ: 0, scale: isTablet ? 1.00 : 1.08 },
        { x: 0.5 * sectionStep, y: 0, z: 35, rotateX: 4, rotateY: -1, rotateZ: 0, scale: isTablet ? 1.00 : 1.08 },
        { x: 1.5 * sectionStep, y: 8, z: 25, rotateX: 4, rotateY: -3, rotateZ: 1, scale: isTablet ? 0.98 : 1.05 },
      ];
      const turtleSectionOffset = {
        x: 2.5 * sectionStep,
        y: 18,
        z: 12,
        rotateX: 5,
        rotateY: -6,
        rotateZ: 2,
        scale: isTablet ? 0.94 : 1.00,
      };

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

            // Enable interactivity once items are in floating or final positions
            if (emergingGroupEl) {
              emergingGroupEl.style.pointerEvents = prog >= 0.70 ? "auto" : "none";
              if (prog < 0.28) {
                emergingGroupEl.style.visibility = "hidden";
                emergingGroupEl.style.opacity = "0";
              } else {
                emergingGroupEl.style.visibility = "visible";
                emergingGroupEl.style.opacity = "1";
              }
            }

            // Ensure the box stage remains strictly hidden once it has moved downward
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

      // Reveal the internal products ONLY after the lid has tilted open backwards past 95deg (0.26 -> 0.29)
      // When closed (or closing), products remain strictly hidden inside the box!
      if (emergingGroupEl) {
        masterTl.fromTo(
          emergingGroupEl,
          { opacity: 0, autoAlpha: 0 },
          {
            opacity: 1,
            autoAlpha: 1,
            duration: 0.03,
            ease: "none",
          },
          0.26
        );

        masterTl.to(
          emergingItemRefs.current.filter(Boolean),
          {
            opacity: 1,
            autoAlpha: 1,
            duration: 0.03,
            ease: "none",
          },
          0.26
        );

        if (turtleEl) {
          masterTl.to(
            turtleEl,
            {
              opacity: 1,
              autoAlpha: 1,
              duration: 0.03,
              ease: "none",
            },
            0.26
          );
        }
      }

      // ──────────────────────────────────────────────────────────
      // STAGE 3: PRODUCTS & TURTLE EMERGE FROM THE BOX IN REALISTIC 3D
      // (Starts as lid clears: each product physically rises out of tray)
      // They remain realistic 3D products - NO conversion to cards!
      // ──────────────────────────────────────────────────────────

      // Animate each of the 5 incense products physically rising out of the box one by one in 3D
      emergingItemRefs.current.forEach((el, index) => {
        if (el) {
          const startT = 0.30 + index * 0.022;
          const dur = 0.18;

          // Physically rise up, move forward in Z, rotate from horizontal slot angle to upright 3D
          masterTl.to(
            el,
            {
              x: fanOffsets[index].x,
              y: fanOffsets[index].y,
              z: fanOffsets[index].z,
              rotateX: fanOffsets[index].rotateX,
              rotateY: fanOffsets[index].rotateY,
              rotateZ: fanOffsets[index].rotateZ,
              scaleX: fanOffsets[index].scale,
              scaleY: fanOffsets[index].scale,
              duration: dur,
              ease: "power2.out",
            },
            startT
          );
        }
      });

      // Animate the solid brass turtle burner rising out of its compartment and taking position on the side
      if (turtleEl) {
        masterTl.to(
          turtleEl,
          {
            x: turtleFanOffset.x,
            y: turtleFanOffset.y,
            z: turtleFanOffset.z,
            rotateX: turtleFanOffset.rotateX,
            rotateY: turtleFanOffset.rotateY,
            rotateZ: turtleFanOffset.rotateZ,
            scale: turtleFanOffset.scale,
            duration: 0.18,
            ease: "power2.out",
          },
          0.38
        );
      }

      if (auraEl) {
        masterTl.to(
          auraEl,
          {
            opacity: 0.9,
            scale: 1.35,
            duration: 0.22,
            ease: "sine.inOut",
          },
          0.30
        );
      }

      // ──────────────────────────────────────────────────────────
      // STAGE 4: BOX GENTLY GLIDES DOWN AS PRODUCTS EXPAND IN 3D
      // (Progress 0.50 -> 0.74)
      // ──────────────────────────────────────────────────────────
      masterTl.to(
        stageEl,
        {
          y: "35vh",
          autoAlpha: 0,
          scale: 0.80,
          duration: 0.22,
          ease: "power2.inOut",
        },
        0.50
      );

      // Title stays fixed at top — no animation needed

      // ──────────────────────────────────────────────────────────
      // STAGE 5: EXPAND PRODUCTS & TURTLE INTO MAJESTIC 3D SHOWCASE
      // (Progress 0.52 -> 0.76)
      // Products stay as realistic individual 3D objects throughout!
      // ──────────────────────────────────────────────────────────
      emergingItemRefs.current.forEach((el, index) => {
        if (el) {
          const transT = 0.52 + index * 0.015;

          masterTl.to(
            el,
            {
              x: sectionOffsets[index].x,
              y: sectionOffsets[index].y,
              z: sectionOffsets[index].z,
              rotateX: sectionOffsets[index].rotateX,
              rotateY: sectionOffsets[index].rotateY,
              rotateZ: sectionOffsets[index].rotateZ,
              scaleX: sectionOffsets[index].scale,
              scaleY: sectionOffsets[index].scale,
              duration: 0.22,
              ease: "power2.inOut",
            },
            transT
          );
        }
      });

      if (turtleEl) {
        masterTl.to(
          turtleEl,
          {
            x: turtleSectionOffset.x,
            y: turtleSectionOffset.y,
            z: turtleSectionOffset.z,
            rotateX: turtleSectionOffset.rotateX,
            rotateY: turtleSectionOffset.rotateY,
            rotateZ: turtleSectionOffset.rotateZ,
            scale: turtleSectionOffset.scale,
            duration: 0.22,
            ease: "power2.inOut",
          },
          0.54
        );
      }

      // Smoothly reveal elegant gold labels underneath each product
      if (luxuryLabels.length > 0) {
        masterTl.to(
          luxuryLabels,
          {
            opacity: 1,
            duration: 0.18,
            ease: "power1.out",
          },
          0.60
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
    <>
      {/* ================= MOBILE RESPONSIVE VIEW (HORIZONTAL AUTO & SIDE SCROLL) ================= */}
      <section
        id="elements-collection-mobile"
        className="block md:hidden bg-[#E4DCD0] text-[#1C1B18] select-none py-8 border-t border-[#DDD4C6] overflow-hidden"
      >
        <div className="w-full">
          {/* Section Header */}
          <div className="text-center px-4 mb-4">
            <h2 className="text-2xl font-medium tracking-tight leading-tight text-[#1C1B18]">
              The 5 Elements Collection
            </h2>
            <p className="text-xs text-stone-600 mt-1">
              Handcrafted 100% Charcoal-Free Elemental Incense Suites
            </p>
          </div>

          {/* Carousel Viewport Wrapper with side padding & clipping */}
          <div className="relative w-full px-3.5 sm:px-4">
            {/* Left Chevron Button */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                scrollByDirection("left");
              }}
              className="absolute left-1 top-[40%] -translate-y-1/2 z-20 w-7 h-7 rounded-full bg-white/90 backdrop-blur-xs border border-stone-300 shadow-md flex items-center justify-center text-stone-800 hover:bg-white active:scale-90 transition-all opacity-80 hover:opacity-100 cursor-pointer"
              aria-label="Previous card"
            >
              <ChevronLeft className="w-4 h-4 stroke-[2.2]" />
            </button>

            {/* Right Chevron Button */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                scrollByDirection("right");
              }}
              className="absolute right-1 top-[40%] -translate-y-1/2 z-20 w-7 h-7 rounded-full bg-white/90 backdrop-blur-xs border border-stone-300 shadow-md flex items-center justify-center text-stone-800 hover:bg-white active:scale-90 transition-all opacity-80 hover:opacity-100 cursor-pointer"
              aria-label="Next card"
            >
              <ChevronRight className="w-4 h-4 stroke-[2.2]" />
            </button>

            {/* Horizontal Scrolling Track (Strictly 2 cards visible at a time, cursor drag & touch swipe) */}
            <div
              ref={mobileScrollRef}
              onScroll={handleMobileScroll}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUpOrLeave}
              onMouseLeave={handleMouseUpOrLeave}
              onTouchStart={() => setIsMobileInteracting(true)}
              onTouchEnd={() => {
                if (interactionTimerRef.current) clearTimeout(interactionTimerRef.current);
                interactionTimerRef.current = setTimeout(() => setIsMobileInteracting(false), 3000);
              }}
              className="w-full flex gap-3 overflow-x-auto snap-x snap-mandatory scroll-smooth no-scrollbar p-0 pb-3 pt-1 touch-pan-y cursor-grab active:cursor-grabbing select-none"
              style={{
                scrollbarWidth: "none",
                msOverflowStyle: "none",
                WebkitOverflowScrolling: "touch",
              }}
            >
              {FIVE_ELEMENTS_PRODUCTS.map((prod) => {
                const isAdded = !!addedIds[prod.id];
                const isWishlisted = isInWishlist(prod.id) || isInWishlist(prod.skuId);

                return (
                  <div
                    key={`mobile-${prod.id}`}
                    draggable={false}
                    onDragStart={(e) => e.preventDefault()}
                    onClick={(e) => {
                      if (hasDraggedRef.current) {
                        e.preventDefault();
                        e.stopPropagation();
                        return;
                      }
                      router.push(`/products/${prod.skuId}`);
                    }}
                    className="w-[calc(50%-6px)] min-w-[calc(50%-6px)] max-w-[calc(50%-6px)] shrink-0 snap-start group relative flex flex-col cursor-pointer select-none"
                  >
                    {/* Card Image Canvas - End to End without cutting */}
                    <div className="relative w-full aspect-[445/1024] overflow-hidden rounded-lg bg-transparent flex items-center justify-center p-0 shadow-sm border border-[#DDD4C6]/80">
                      <Image
                        src={prod.image}
                        alt={prod.name}
                        fill
                        loading="lazy"
                        draggable={false}
                        sizes="(max-width: 640px) 210px, 240px"
                        className="object-contain w-full h-full p-0 select-none pointer-events-none group-hover:scale-102 transition-transform duration-300"
                      />

                      {/* Wishlist Heart Button on Upper Right */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleWishlist({
                            id: prod.id,
                            name: prod.name,
                            price: prod.price,
                            priceDisplay: prod.priceDisplay,
                            image: prod.image,
                            skuId: prod.skuId,
                          });
                        }}
                        title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
                        aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
                        className="group/btn absolute top-2 right-2 z-10 p-1 flex items-center justify-center transition-all duration-300 active:scale-90 cursor-pointer bg-transparent border-none text-white hover:scale-110"
                      >
                        <Heart
                          className={`w-4 h-4 transition-all duration-300 stroke-white stroke-[2.2] drop-shadow-[0_1px_3px_rgba(0,0,0,0.85)] ${isWishlisted
                            ? "fill-white text-white scale-110 drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)]"
                            : "fill-transparent text-white group-hover/btn:scale-110"
                            }`}
                        />
                      </button>
                    </div>

                    {/* Card Details Directly Below Image */}
                    <div className="mt-2.5 flex items-start justify-between gap-1.5 px-0.5">
                      <div className="space-y-0.5 min-w-0 flex-1">
                        <h3 className="text-xs font-semibold text-[#1C1B18] truncate">
                          {prod.name}
                        </h3>
                        <p className="text-[10px] text-stone-500 truncate font-sans">
                          {prod.subtitle}
                        </p>
                        <div className="flex items-center gap-1.5 font-sans pt-0.5">
                          <span className="text-xs font-bold text-[#8C6215]">
                            {prod.priceDisplay}
                          </span>
                          <span className="text-[10px] text-stone-400 line-through">
                            {prod.originalPriceDisplay}
                          </span>
                        </div>
                      </div>

                      {/* Quick Add To Cart Button */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleQuickAdd(prod);
                        }}
                        title={isAdded ? "Added to cart" : `Add ${prod.name} to cart`}
                        aria-label={isAdded ? "Added to cart" : `Add ${prod.name} to cart`}
                        className={`p-1.5 min-w-[28px] min-h-[28px] flex items-center justify-center rounded-md transition-all duration-200 active:scale-95 cursor-pointer shrink-0 mt-0.5 ${isAdded ? "bg-emerald-600 text-white" : "bg-[#092B20] hover:bg-[#123D2D] text-[#C5A45B]"
                          }`}
                      >
                        {isAdded ? (
                          <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                        ) : (
                          <ShoppingCart className="w-3.5 h-3.5 stroke-[2]" />
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Carousel Slide Indicators */}
          <div className="flex items-center justify-center gap-1.5 pt-2">
            {FIVE_ELEMENTS_PRODUCTS.map((_, dotIdx) => (
              <button
                key={dotIdx}
                type="button"
                onClick={() => {
                  const container = mobileScrollRef.current;
                  if (!container) return;
                  const firstCard = container.firstElementChild as HTMLElement;
                  const step = firstCard ? firstCard.offsetWidth + 12 : container.clientWidth / 2;
                  container.scrollTo({ left: dotIdx * step, behavior: "smooth" });
                  setMobileActiveIndex(dotIdx);
                }}
                aria-label={`Go to element ${dotIdx + 1}`}
                className={`transition-all duration-300 rounded-full cursor-pointer ${mobileActiveIndex === dotIdx
                  ? "w-5 h-1.5 bg-[#8C6215] shadow-xs"
                  : "w-1.5 h-1.5 bg-stone-400/60 hover:bg-stone-600"
                  }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ================= DESKTOP VIEW (3D UNBOXING WITH ANIMATION) ================= */}
      <section
        ref={sectionRef}
        id="unboxing-ritual"
        className="hidden md:flex relative z-30 w-full h-[100dvh] min-h-[560px] bg-[#E4DCD0] text-[#1C1B18] select-none flex-col justify-between border-t border-[#DDD4C6] overflow-hidden"
      >
        {/* Ambient Luxury Lighting Backdrop (Clean Warm Studio Vignette) */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at 50% 48%, #EAE2D6 0%, #E4DCD0 65%, #DDD4C6 100%)",
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
          className="absolute top-0 inset-x-0 z-40 pt-16 min-[380px]:pt-18 sm:pt-20 lg:pt-24 px-3 sm:px-6 max-w-4xl mx-auto text-center pointer-events-none"
        >
          <h2 className="font-serif text-xl min-[380px]:text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-medium tracking-tight leading-tight text-[#1C1B18]">
            The 5 Elements Collection
          </h2>
        </div>

        {/* 3D BOX STAGE & PRODUCT CARDS CONTAINER */}
        <div
          ref={containerRef}
          className="relative z-20 flex-1 w-full max-w-full flex items-center justify-center px-1 sm:px-4 lg:px-6 pt-16 sm:pt-24 pb-4 sm:pb-8 overflow-hidden"
          style={{
            perspective: "1200px",
          }}
        >
          {/* THE 3D GREEN MARBLE BOX (Opens, products emerge, then moves upward & vanishes) */}
          <div
            ref={boxStageRef}
            className="relative w-[270px] min-[380px]:w-[300px] sm:w-[360px] md:w-[410px] lg:w-[440px] rounded-2xl shadow-2xl transition-shadow"
            style={{
              aspectRatio: "880 / 480",
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
              {/* Velvet Interior Tray (Authentic sculpted compartments ready to hold the 3D items) */}
              <div className="absolute inset-0">
                <Image
                  src="/images/unboxing/kurma-bespoke-fitted-tray-v5.png"
                  alt="Kurma Luxury Suite Tray"
                  fill
                  priority
                  sizes="(max-width: 768px) 90vw, 450px"
                  className="object-cover object-center"
                />
                <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/50 via-transparent to-black/20" />
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
            THE REALISTIC 3D PRODUCTS (5 ELEMENTS + SOLID BRASS TURTLE):
            Physically start inside the box tray, emerge during scroll
            in realistic 3D, and expand into the majestic showcase!
            Never transformed into product cards!
           ────────────────────────────────────────────────────────── */}
          <div
            ref={emergingProductsGroupRef}
            className="absolute inset-0 flex items-center justify-center z-25 pointer-events-none opacity-0 invisible"
            style={{ opacity: 0, visibility: "hidden", perspective: "1200px" }}
          >
            {/* 1. The 5 Incense Elemental Products */}
            {FIVE_ELEMENTS_PRODUCTS.map((prod, index) => (
              <div
                key={`product-3d-${prod.id}`}
                ref={(el) => {
                  emergingItemRefs.current[index] = el;
                }}
                onClick={() => router.push(`/products/${prod.skuId}`)}
                className="product-3d-item absolute w-[78px] sm:w-[94px] md:w-[106px] lg:w-[124px] xl:w-[136px] flex flex-col items-center justify-center cursor-pointer select-none transition-transform duration-300 hover:scale-105"
                style={{
                  transformStyle: "preserve-3d",
                  willChange: "transform, opacity",
                  backfaceVisibility: "hidden",
                }}
              >
                {/* 3D Product Box Visual with realistic physical lighting & shadow */}
                <div className="relative w-full aspect-[445/1024] rounded-lg overflow-hidden flex items-center justify-center filter drop-shadow-[0_16px_22px_rgba(0,0,0,0.55)] transition-all duration-300 hover:drop-shadow-[0_20px_28px_rgba(197,164,91,0.5)]">
                  <Image
                    src={prod.image}
                    alt={prod.name}
                    fill
                    priority
                    sizes="(max-width: 640px) 150px, (max-width: 1024px) 200px, 250px"
                    className="object-contain object-center select-none pointer-events-none"
                  />
                </div>

                {/* Subtle Luxury Gold Name Label (reveals in final state) */}
                <div className="product-luxury-label mt-2 text-center opacity-0 transition-opacity duration-300 pointer-events-none">
                  <p className="font-serif text-[10px] sm:text-xs md:text-sm font-medium tracking-wider uppercase text-[#8C6215]">
                    {prod.badge}
                  </p>
                  <p className="font-sans text-[9px] sm:text-[11px] md:text-xs text-[#1C1B18]/70 truncate max-w-[150px]">
                    {prod.name}
                  </p>
                </div>
              </div>
            ))}

            {/* 2. The Solid Brass Kurma Turtle Burner */}
            <div
              ref={turtleItemRef}
              onClick={() => router.push(`/products/${TURTLE_PRODUCT.skuId}`)}
              className="product-3d-item turtle-3d-item absolute w-[90px] sm:w-[106px] md:w-[120px] lg:w-[142px] xl:w-[156px] flex flex-col items-center justify-center cursor-pointer select-none z-30 transition-transform duration-300 hover:scale-105"
              style={{
                transformStyle: "preserve-3d",
                willChange: "transform, opacity",
                backfaceVisibility: "hidden",
              }}
            >
              {/* 3D Turtle Burner with rich metallic cast brass depth */}
              <div className="relative w-full aspect-[300/195] flex items-center justify-center filter drop-shadow-[0_18px_24px_rgba(0,0,0,0.65)] transition-all duration-300 hover:drop-shadow-[0_22px_32px_rgba(197,164,91,0.6)]">
                <Image
                  src={TURTLE_PRODUCT.image}
                  alt={TURTLE_PRODUCT.name}
                  fill
                  priority
                  sizes="(max-width: 640px) 160px, (max-width: 1024px) 220px, 260px"
                  className="object-contain object-center select-none pointer-events-none"
                />
              </div>

              {/* Subtle Luxury Gold Turtle Label */}
              <div className="product-luxury-label mt-1 text-center opacity-0 transition-opacity duration-300 pointer-events-none">
                <p className="font-serif text-[10px] sm:text-xs md:text-sm font-medium tracking-wider uppercase text-[#8C6215]">
                  {TURTLE_PRODUCT.badge}
                </p>
                <p className="font-sans text-[9px] sm:text-[11px] md:text-xs text-[#1C1B18]/70 truncate max-w-[170px]">
                  {TURTLE_PRODUCT.name}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
