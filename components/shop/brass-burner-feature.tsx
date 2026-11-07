"use client";

import { useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useReducedMotion,
} from "motion/react";

export function BrassBurnerFeature() {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  // Scroll parallax tracking
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    damping: 26,
    stiffness: 110,
    mass: 0.2,
  });

  // Parallax transform: image glides subtly along vertical axis
  const imageYMotion = useTransform(smoothProgress, [0, 1], [-25, 25]);
  const imageY = shouldReduceMotion ? 0 : imageYMotion;

  return (
    <div
      ref={containerRef}
      className="relative w-full rounded-2xl sm:rounded-3xl overflow-hidden shadow-sm border border-[#DDD3C2] min-h-[380px] sm:min-h-[480px] lg:min-h-[520px] flex items-center bg-[#EDE1D1] select-none"
    >
      {/* ================= FULL-BANNER BACKGROUND IMAGE WITH PARALLAX ================= */}
      <div className="absolute inset-0 w-full h-full z-0 overflow-hidden">
        <motion.div
          style={{ y: imageY }}
          className="absolute -inset-y-8 inset-x-0 w-full h-[calc(100%+64px)]"
        >
          <Image
            src="/images/product/brass-turtle-banner-v3.jpg"
            alt="Handcrafted Solid Cast Brass Turtle Incense Burner and Sacred Accessories"
            fill
            priority
            className="object-cover object-[16%_center] sm:object-left md:object-[14%_center] transition-transform duration-700 hover:scale-102"
            sizes="100vw"
          />
        </motion.div>

        {/* Soft Ambient Contrast Scrim: Preserves the flowing champagne silk photo across the entire banner while ensuring text is 100% legible */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#EDE1D1]/90 via-[#EDE1D1]/45 to-transparent sm:bg-gradient-to-l sm:from-[#EDE1D1]/75 sm:via-[#EDE1D1]/30 sm:to-transparent pointer-events-none z-1" />
      </div>

      {/* ================= OVERLAY CONTENT CONTAINER (POSITIONED ON TOP ON THE RIGHT) ================= */}
      <div className="relative z-10 w-full p-4 sm:p-10 md:p-12 lg:p-16 flex justify-end">
        <div className="max-w-md sm:max-w-lg lg:max-w-xl text-left space-y-4 sm:space-y-6 text-[#1C1B18]">
          {/* Main Headline */}
          <motion.h3
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif font-normal text-[#1C1B18] leading-[1.18] tracking-tight"
          >
            Handcrafted Solid Brass Turtle Incense Holder
          </motion.h3>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, delay: 0.1 }}
            className="text-[#3E362D] text-xs sm:text-sm md:text-base font-sans max-w-lg leading-relaxed"
          >
            Sculpted in pure solid brass, inspired by Kurma—the sacred turtle avatar
            symbolizing foundation, stability, and timeless sanctuary.
          </motion.p>

          {/* Call to Action Button */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, delay: 0.2 }}
            className="pt-2 sm:pt-3 flex items-center gap-4"
          >
            <button
              onClick={() => router.push("/products/turtle-incense-holder")}
              className="w-full sm:w-auto text-center px-6 sm:px-8 py-3.5 sm:py-4 bg-[#eed08e] hover:bg-[#f7e8c4] text-[#1C1B18] text-xs font-bold tracking-widest uppercase rounded-xl transition-all shadow-md hover:shadow-lg border border-[#d6ba75] cursor-pointer active:scale-98"
            >
              Customise &amp; Order Burner
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
