"use client";

import Image from "next/image";
import { Check, ShieldCheck, Flame, Globe2 } from "lucide-react";
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
  const stats = [
    {
      value: "30+",
      label: "Years of Sacred Trust",
      description: "Handcrafting pure Mysore incense & heirloom brassware since 1996.",
      icon: ShieldCheck,
    },
    {
      value: "50M+",
      label: "Incense Sticks Lit & Delivered",
      description: "Spreading botanical aromas and ritual mindfulness worldwide.",
      icon: Flame,
    },
    {
      value: "100+",
      label: "Serving Countries",
      description: "Delivering curated corporate hampers & trunks globally.",
      icon: Globe2,
    },
  ];

  return (
    <div className="w-full bg-[#FAF7F2] py-16 sm:py-24 border-t border-[#EAE3D5]">
      {/* 3 Metrics Trust Header Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 mb-16">
        <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-stone-200/80 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          {stats.map((stat, idx) => (
            <div key={idx} className="flex flex-col items-center justify-center p-2">
              <div className="w-10 h-10 rounded-full bg-[#0B2B1B]/5 border border-[#8C6215]/30 text-[#8C6215] flex items-center justify-center mb-3">
                <stat.icon className="w-5 h-5" />
              </div>
              <span className="font-serif text-4xl sm:text-5xl font-bold text-[#0B2B1B] tracking-tight">
                {stat.value}
              </span>
              <h3 className="font-serif text-sm sm:text-base font-semibold text-[#8C6215] mt-2">
                {stat.label}
              </h3>
              <p className="text-xs text-stone-500 mt-1 font-light max-w-xs leading-relaxed">
                {stat.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Sticky Overlapping Card Stack Reveal Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 space-y-12">
        {/* Card 1: THE WEDDING EDIT (Sticky Card 1) */}
        <div className="sticky top-20 z-10 bg-white rounded-3xl overflow-hidden shadow-2xl border border-stone-200/80 min-h-[480px] sm:min-h-[540px] grid grid-cols-1 lg:grid-cols-12 relative group">
          {/* Left Content Box */}
          <div className="lg:col-span-6 p-8 sm:p-12 lg:p-16 flex flex-col justify-between bg-white z-10">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-[0.25em] text-[#0B2B1B] uppercase mb-4">
                <span className="text-amber-700 text-sm">✦</span>
                <span>THE WEDDING EDIT</span>
              </div>

              <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-[#0B2B1B] font-medium leading-tight">
                Sacred fragrance suites for timeless{" "}
                <span className="italic font-serif font-normal text-[#991B1B]">
                  festive celebrations
                </span>
              </h2>

              <p className="mt-4 text-sm sm:text-base text-stone-600 leading-relaxed font-light">
                Handcrafted 100% charcoal-free elemental incense suites and solid cast brass turtle holders, custom-curated for wedding return gifts, sacred rituals, and royal celebrations.
              </p>
            </div>

            <div className="mt-8">
              <a
                href="#gifting-gallery"
                onClick={(e) => {
                  e.preventDefault();
                  const el = document.getElementById("gifting-gallery");
                  if (el) el.scrollIntoView({ behavior: "smooth" });
                }}
                className="inline-block bg-[#0B2B1B] text-[#EED08E] hover:bg-[#16442D] px-7 py-3.5 rounded-xl text-xs font-bold tracking-widest uppercase shadow-md transition-all cursor-pointer"
              >
                START A FREE CONSULTATION
              </a>
            </div>
          </div>

          {/* Right High Quality Wedding Gift Image */}
          <div className="lg:col-span-6 min-h-[320px] lg:min-h-full bg-stone-50 flex items-center justify-center p-4 sm:p-6 overflow-hidden">
            <img
              src="/images/product/image7.png"
              alt="Wedding Gifting Experience"
              className="max-w-full max-h-[460px] w-auto h-auto object-contain rounded-2xl group-hover:scale-105 transition-transform duration-700 shadow-xs"
            />
          </div>
        </div>

        {/* Card 2: FOR BUSINESS (Sticky Card 2 that slides over Card 1) */}
        <div className="sticky top-28 z-20 bg-white rounded-3xl overflow-hidden shadow-2xl border border-stone-200/80 min-h-[480px] sm:min-h-[540px] grid grid-cols-1 lg:grid-cols-12 relative group">
          {/* Left Content Box */}
          <div className="lg:col-span-5 p-8 sm:p-12 lg:p-14 flex flex-col justify-between bg-white z-10">
            <div>
              <div className="inline-flex items-center gap-1.5 bg-[#0B2B1B] text-[#EED08E] text-[10px] font-bold tracking-widest uppercase px-3 py-1.5 rounded-md mb-6 shadow-xs">
                <Check className="w-3.5 h-3.5 text-[#EED08E]" />
                <span>FOR BUSINESS</span>
              </div>

              <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-[#0B2B1B] font-medium leading-tight">
                Corporate{" "}
                <span className="italic font-serif font-normal">gifting</span>
              </h2>

              <p className="mt-4 text-sm sm:text-base text-stone-600 leading-relaxed font-light">
                Not another dry fruit box. Curated, branded, and delivered so your
                clients and team actually remember who sent it.
              </p>
            </div>

            <div className="mt-8">
              <a
                href="#gifting-gallery"
                onClick={(e) => {
                  e.preventDefault();
                  const el = document.getElementById("gifting-gallery");
                  if (el) el.scrollIntoView({ behavior: "smooth" });
                }}
                className="block bg-[#0B2B1B] text-[#EED08E] hover:bg-[#16442D] px-7 py-3.5 rounded-xl text-xs font-bold tracking-widest uppercase shadow-md transition-all text-center cursor-pointer"
              >
                ENQUIRE FOR BULK ORDERS
              </a>
            </div>
          </div>

          {/* Right High Quality Corporate Gift Image */}
          <div className="lg:col-span-7 min-h-[320px] lg:min-h-full bg-stone-50 flex items-center justify-center p-4 sm:p-6 overflow-hidden">
            <img
              src="/images/product/image9.png"
              alt="Corporate Gifting Suite"
              className="max-w-full max-h-[460px] w-auto h-auto object-contain rounded-2xl group-hover:scale-105 transition-transform duration-700 shadow-xs"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
