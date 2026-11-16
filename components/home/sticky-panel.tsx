"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

interface StickyPanelProps {
  children: ReactNode;
  id?: string;
  className?: string;
}

/**
 * Pins its content to the viewport while the NEXT sibling (a taller/opaque, higher z-index block)
 * slides up over it. If the panel is taller than the screen, it scrolls until its bottom edge is
 * visible and pins there, so nothing is ever cut off.
 *
 * Must be a direct child of a `relative isolate` wrapper that also contains the covering block;
 * the pin ends when that wrapper ends.
 */
export function StickyPanel({ children, id, className = "" }: StickyPanelProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [top, setTop] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const update = () => setTop(Math.min(0, Math.round(window.innerHeight - el.offsetHeight)));
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    window.addEventListener("resize", update);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <div ref={ref} id={id} className={`sticky z-0 ${className}`} style={{ top }}>
      {children}
    </div>
  );
}