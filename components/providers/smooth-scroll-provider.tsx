"use client";

import { ReactLenis } from "lenis/react";
import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import type { LenisRef } from "lenis/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function SmoothScrollProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const lenisRef = useRef<LenisRef>(null);
  const pathname = usePathname();

  // Expose global window.lenis and sync seamlessly with GSAP ScrollTrigger
  useEffect(() => {
    if (typeof window === "undefined") return;

    const lenis = lenisRef.current?.lenis;
    if (!lenis) return;

    (window as unknown as { lenis?: unknown }).lenis = lenis;

    gsap.registerPlugin(ScrollTrigger);
    lenis.on("scroll", ScrollTrigger.update);

    // Drive Lenis from GSAP ticker for 100% frame synchronization & zero lag
    const updateTicker = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(updateTicker);
    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.off("scroll", ScrollTrigger.update);
      gsap.ticker.remove(updateTicker);
    };
  }, []);

  // Reset scroll to top immediately on route/page change
  useEffect(() => {
    if (lenisRef.current?.lenis) {
      lenisRef.current.lenis.scrollTo(0, { immediate: true });
    } else if (typeof window !== "undefined") {
      window.scrollTo(0, 0);
    }
  }, [pathname]);

  return (
    <ReactLenis
      ref={lenisRef}
      root
      options={{
        duration: 1.15,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: "vertical",
        gestureOrientation: "vertical",
        smoothWheel: true,
        wheelMultiplier: 1.0,
        syncTouch: true,
        syncTouchLerp: 0.08,
        touchInertiaExponent: 1.6,
        touchMultiplier: 1.2,
        infinite: false,
        autoRaf: false,
      }}
    >
      {children}
    </ReactLenis>
  );
}
