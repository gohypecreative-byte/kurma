"use client";

import { useState } from "react";
import Image from "next/image";
import { Check } from "lucide-react";
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
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    company: "",
    budget: "",
    quantity: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({
        name: "",
        phone: "",
        email: "",
        company: "",
        budget: "",
        quantity: "",
        message: "",
      });
    }, 4000);
  };

  return (
    <div id="solutions" className="w-full bg-[#FAF7F2] py-10 sm:py-20 lg:py-24 border-t border-[#EAE3D5] mobile-defer-render">
      {/* Stacked Cards Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 space-y-6 sm:space-y-10 lg:space-y-12">
        {/* Card 1: THE WEDDING EDIT (Sticky on desktop, natural flow on mobile) */}
        <div className="relative lg:sticky lg:top-20 z-10 bg-white rounded-3xl overflow-hidden shadow-lg lg:shadow-2xl border border-stone-200/80 min-h-[380px] sm:min-h-[500px] lg:min-h-[540px] grid grid-cols-1 lg:grid-cols-12 group">
          {/* Left Content Box */}
          <div className="lg:col-span-6 p-5 sm:p-8 md:p-12 lg:p-16 flex flex-col justify-between bg-white z-10">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-[0.25em] text-[#0B2B1B] uppercase mb-4">
                <span className="text-amber-700 text-sm">✦</span>
                <span>THE WEDDING EDIT</span>
              </div>

              <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-[#0B2B1B] font-medium leading-tight">
                Sacred fragrance suites for timeless{" "}
                <span className="italic font-serif font-normal text-[#991B1B]">
                  festive celebrations
                </span>
              </h2>

              <p className="mt-4 text-xs sm:text-sm md:text-base text-stone-600 leading-relaxed font-light">
                Handcrafted 100% charcoal-free elemental incense suites and solid cast brass turtle holders, custom-curated for wedding return gifts, sacred rituals, and royal celebrations.
              </p>
            </div>

            <div className="mt-6 sm:mt-8">
              <a
                href="#gifting-gallery"
                onClick={(e) => {
                  e.preventDefault();
                  const el = document.getElementById("gifting-gallery");
                  if (el) el.scrollIntoView({ behavior: "smooth" });
                }}
                className="w-full sm:w-auto text-center inline-block bg-[#0B2B1B] text-[#EED08E] hover:bg-[#16442D] px-6 sm:px-7 py-3 sm:py-3.5 rounded-xl text-xs font-bold tracking-widest uppercase shadow-md transition-all cursor-pointer"
              >
                START A FREE CONSULTATION
              </a>
            </div>
          </div>

          {/* Right High Quality Wedding Gift Image */}
          <div className="lg:col-span-6 min-h-[220px] sm:min-h-[300px] lg:min-h-full bg-stone-50 flex items-center justify-center p-4 sm:p-6 overflow-hidden">
            <Image
              src="/images/product/image7.png"
              alt="Wedding Gifting Experience"
              width={500}
              height={500}
              loading="lazy"
              className="max-w-full max-h-[360px] sm:max-h-[460px] w-auto h-auto object-contain rounded-2xl group-hover:scale-105 transition-transform duration-700 shadow-xs"
            />
          </div>
        </div>

        {/* Card 2: FOR BUSINESS (Sticky on desktop, natural flow on mobile) */}
        <div className="relative lg:sticky lg:top-28 z-20 bg-white rounded-3xl overflow-hidden shadow-lg lg:shadow-2xl border border-stone-200/80 min-h-[380px] sm:min-h-[500px] lg:min-h-[540px] grid grid-cols-1 lg:grid-cols-12 group">
          {/* Left Content Box */}
          <div className="lg:col-span-5 p-5 sm:p-8 md:p-12 lg:p-14 flex flex-col justify-between bg-white z-10">
            <div>
              <div className="inline-flex items-center gap-1.5 bg-[#0B2B1B] text-[#EED08E] text-[10px] font-bold tracking-widest uppercase px-3 py-1.5 rounded-md mb-4 sm:mb-6 shadow-xs">
                <Check className="w-3.5 h-3.5 text-[#EED08E]" />
                <span>FOR BUSINESS</span>
              </div>

              <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-[#0B2B1B] font-medium leading-tight">
                Corporate{" "}
                <span className="italic font-serif font-normal">gifting</span>
              </h2>

              <p className="mt-4 text-xs sm:text-sm md:text-base text-stone-600 leading-relaxed font-light">
                Not another dry fruit box. Curated, branded, and delivered so your
                clients and team actually remember who sent it.
              </p>
            </div>

            <div className="mt-6 sm:mt-8">
              <a
                href="#gifting-gallery"
                onClick={(e) => {
                  e.preventDefault();
                  const el = document.getElementById("gifting-gallery");
                  if (el) el.scrollIntoView({ behavior: "smooth" });
                }}
                className="w-full sm:w-auto block bg-[#0B2B1B] text-[#EED08E] hover:bg-[#16442D] px-6 sm:px-7 py-3 sm:py-3.5 rounded-xl text-xs font-bold tracking-widest uppercase shadow-md transition-all text-center cursor-pointer"
              >
                ENQUIRE FOR BULK ORDERS
              </a>
            </div>
          </div>

          {/* Right High Quality Corporate Gift Image */}
          <div className="lg:col-span-7 min-h-[220px] sm:min-h-[300px] lg:min-h-full bg-stone-50 flex items-center justify-center p-4 sm:p-6 overflow-hidden">
            <Image
              src="/images/product/image9.png"
              alt="Corporate Gifting Suite"
              width={500}
              height={500}
              loading="lazy"
              className="max-w-full max-h-[360px] sm:max-h-[460px] w-auto h-auto object-contain rounded-2xl group-hover:scale-105 transition-transform duration-700 shadow-xs"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
