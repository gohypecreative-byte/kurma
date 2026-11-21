"use client";

import { useEffect } from "react";

interface HeroSnapProps {
  /** id of the content stack that slides over the pinned hero */
  targetId?: string;
}

type LenisLike = {
  scrollTo: (target: number, opts?: Record<string, unknown>) => void;
};

/**
 * Scrolling UP out of the content stack snaps the page straight back to the top, so the hero
 * always returns as the full banner instead of a partial strip.
 * Fires the moment the stack's top edge enters the screen from above while scrolling up.
 * Renders nothing.
 */
export function HeroSnap({ targetId = "home-content-stack" }: HeroSnapProps) {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // Strictly disable on mobile/touch screens so mobile users scroll 100% naturally without scroll hijack
    if (typeof window !== "undefined" && (window.innerWidth < 1024 || "ontouchstart" in window)) return;

    let prevTop = Number.POSITIVE_INFINITY;
    let snapping = false;

    const onScroll = () => {
      const el = document.getElementById(targetId);
      if (!el || snapping) return;

      const top = el.getBoundingClientRect().top;
      const enteredFromAbove = prevTop <= 0 && top > 0; // stack top edge just appeared => moving up
      prevTop = top;
      if (!enteredFromAbove) return;

      snapping = true;
      const done = () => {
        snapping = false;
        const node = document.getElementById(targetId);
        prevTop = node ? node.getBoundingClientRect().top : Number.POSITIVE_INFINITY;
      };

      const lenis = (window as unknown as { lenis?: LenisLike }).lenis;
      if (lenis) {
        lenis.scrollTo(0, { duration: 0.8, lock: false, onComplete: done });
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
        window.setTimeout(done, 900);
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [targetId]);

  return null;
}