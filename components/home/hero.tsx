"use client";

import { motion, useReducedMotion } from "motion/react";
import Image from "next/image";
import { ArrowRight, Leaf, Flame, ShieldCheck, PenTool, Sparkles, ChevronDown } from "lucide-react";

interface HeroProps {
  onExploreGifts: () => void;
  onExploreBestsellers?: () => void;
}

export function Hero({ onExploreGifts, onExploreBestsellers }: HeroProps) {
  const reduced = useReducedMotion();
  const trustFeatures = [
    {
      icon: Leaf,
      title: "100% Organic",
      subtitle: "Charcoal-Free",
    },
    {
      icon: Flame,
      title: "5 Sacred Elements",
      subtitle: "Pure Resins",
    },
    {
      icon: ShieldCheck,
      title: "Solid Cast Brass",
      subtitle: "Turtle Stand",
    },
    {
      icon: PenTool,
      title: "Bespoke Engraving",
      subtitle: "Every SKU",
    },
  ];

  return (
    <section
      id="home"
      className="relative w-full h-[calc(100vh-80px)] min-h-[580px] bg-[#072515] overflow-hidden flex flex-col justify-between text-white"
    >
      {/* Unified Hero Banner Canvas (NO Line Divider, Seamless Gradient Blend) */}
      <div className="relative flex-1 flex items-center py-10 sm:py-14 lg:py-18">
        {/* Right-Side Hero Image - Seamlessly Blended */}
        <div className="absolute inset-y-0 right-0 w-full lg:w-[58%] xl:w-[62%] h-full pointer-events-none z-0">
          <Image
            src="/images/product/image7.png"
            alt="Kurma 5 Elements Sacred Agarbatti Luxury Incense Suite"
            fill
            priority
            className="object-contain object-right p-4 sm:p-6 filter brightness-[1.02] contrast-[1.03]"
            sizes="(max-width: 1024px) 100vw, 62vw"
          />
          {/* Seamless Edge Gradient Blend into Deep Green (NO Line Separator) */}
          <div className="absolute inset-y-0 left-0 w-48 sm:w-80 lg:w-96 bg-gradient-to-r from-[#072515] via-[#072515]/90 to-transparent pointer-events-none" />
          <div className="absolute inset-0 bg-[#072515]/75 lg:hidden pointer-events-none" />
        </div>

        <div className="relative w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20 z-10">
          {/* Left Text & Action Buttons Column */}
          <motion.div
            initial={{ opacity: 0, x: reduced ? 0 : -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: reduced ? 0 : 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-xl lg:max-w-[520px] xl:max-w-[580px] space-y-7"
          >
            {/* Clean Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-[50px] xl:text-[58px] font-serif font-normal text-white leading-[1.12] tracking-tight">
              Elements in Harmony. <br />
              <span className="italic font-normal text-[#eed08e]">
                Higher Consciousness.
              </span>
            </h1>

            {/* Gold Diamond Accent Line */}
            <div className="flex items-center gap-3">
              <div className="h-px w-20 bg-[#eed08e]/60" />
              <div className="w-2 h-2 rotate-45 border border-[#eed08e] bg-[#072515]" />
              <div className="h-px w-20 bg-[#eed08e]/60" />
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-1">
              <button
                onClick={onExploreGifts}
                className="inline-flex items-center justify-center gap-2.5 px-8 py-4 bg-[#eed08e] hover:bg-[#f7e8c4] text-[#072515] text-base font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 active:scale-[0.98] group cursor-pointer"
              >
                <span>Explore Collection</span>
                <ArrowRight className="w-5 h-5 transition-transform duration-200 group-hover:translate-x-1" />
              </button>

              <button
                onClick={onExploreBestsellers || onExploreGifts}
                className="inline-flex items-center justify-center px-8 py-4 bg-[#0a311d]/90 hover:bg-[#0e3d25] text-[#eed08e] text-base font-medium rounded-xl border border-[#eed08e]/50 hover:border-[#eed08e] backdrop-blur-sm transition-all duration-200 shadow-md active:scale-[0.98] cursor-pointer"
              >
                View Marble Trunk
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Trust Features Footer Bar */}
      <div className="relative z-20 w-full border-t border-[#eed08e]/25 bg-[#04190e]/92 backdrop-blur-md py-3.5 sm:py-4">
        <div className="w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
          <div className="flex items-center justify-start lg:justify-between overflow-x-auto no-scrollbar gap-4 lg:gap-0 lg:grid lg:grid-cols-4 lg:divide-x divide-[#eed08e]/20">
            {trustFeatures.map((feat, idx) => (
              <div
                key={idx}
                className="flex items-center justify-center gap-2.5 sm:gap-3 shrink-0 whitespace-nowrap px-4 sm:px-6 lg:px-3 xl:px-6 py-1"
              >
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg border border-[#eed08e]/50 bg-[#0b331f] flex items-center justify-center shrink-0 text-[#eed08e] shadow-xs">
                  <feat.icon className="w-4 h-4 sm:w-4.5 sm:h-4.5 stroke-[1.6]" />
                </div>
                <div className="flex items-center gap-1.5 whitespace-nowrap">
                  <span className="text-xs sm:text-[13px] font-semibold text-white tracking-wide">
                    {feat.title}
                  </span>
                  <span className="text-[#eed08e]/60 text-xs">•</span>
                  <span className="text-[11px] sm:text-xs text-[#eed08e] font-medium">
                    {feat.subtitle}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
