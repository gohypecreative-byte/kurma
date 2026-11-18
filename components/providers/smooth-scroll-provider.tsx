"use client";

import { ReactLenis } from "lenis/react";
import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import type { LenisRef } from "lenis/react";

export function SmoothScrollProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const lenisRef = useRef<LenisRef>(null);
  const pathname = usePathname();

  // Expose global window.lenis for accessibility and external script triggers
  useEffect(() => {
    if (lenisRef.current?.lenis && typeof window !== "undefined") {
      (window as unknown as { lenis?: unknown }).lenis = lenisRef.current.lenis;
    }
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
        lerp: 0.09,
        duration: 1.2,
        smoothWheel: true,
        wheelMultiplier: 1.0,
        touchMultiplier: 1.5,
        infinite: false,
        autoRaf: true,
      }}
    >
      {children}
    </ReactLenis>
  );
}
