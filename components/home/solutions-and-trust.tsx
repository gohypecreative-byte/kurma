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
    <div className="w-full bg-[#FAF7F2] py-16 sm:py-24 border-t border-[#EAE3D5]">
      {/* GIFTING INQUIRY Section (Directly on section background, no outer card box) */}
      <div id="gifting-inquiry" className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 sm:mb-20 space-y-8">
        {/* Section Header */}
        <div className="text-center space-y-2">
          <h2 className="font-serif tracking-[0.2em] text-2xl sm:text-3xl font-bold text-[#8b5f10] uppercase">
            GIFTING INQUIRY
          </h2>
          <p className="text-stone-700 text-xs sm:text-sm font-medium max-w-xl mx-auto">
            Share your vision with us, and we&apos;ll create something extraordinary
          </p>
        </div>

        {/* Inquiry Form */}
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
          {/* Row 1: NAME & PHONE */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
            <div>
              <label className="block text-[11px] font-bold tracking-widest text-stone-900 uppercase mb-1.5 font-sans">
                NAME
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Your name"
                className="w-full bg-white border border-stone-300 rounded-xl px-4 py-3 text-xs text-stone-900 font-medium placeholder:text-stone-500 focus:outline-none focus:ring-0 focus:border-stone-300 transition-colors shadow-xs"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold tracking-widest text-stone-900 uppercase mb-1.5 font-sans">
                PHONE
              </label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+91"
                className="w-full bg-white border border-stone-300 rounded-xl px-4 py-3 text-xs text-stone-900 font-medium placeholder:text-stone-500 focus:outline-none focus:ring-0 focus:border-stone-300 transition-colors shadow-xs"
              />
            </div>
          </div>

          {/* Row 2: EMAIL */}
          <div>
            <label className="block text-[11px] font-bold tracking-widest text-stone-900 uppercase mb-1.5 font-sans">
              EMAIL
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="your@email.com"
              className="w-full bg-white border border-stone-300 rounded-xl px-4 py-3 text-xs text-stone-900 font-medium placeholder:text-stone-500 focus:outline-none focus:ring-0 focus:border-stone-300 transition-colors shadow-xs"
            />
          </div>

          {/* Row 3: COMPANY & BUDGET */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
            <div>
              <label className="block text-[11px] font-bold tracking-widest text-stone-900 uppercase mb-1.5 font-sans">
                COMPANY
              </label>
              <input
                type="text"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                placeholder="Brand or company name"
                className="w-full bg-white border border-stone-300 rounded-xl px-4 py-3 text-xs text-stone-900 font-medium placeholder:text-stone-500 focus:outline-none focus:ring-0 focus:border-stone-300 transition-colors shadow-xs"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold tracking-widest text-stone-900 uppercase mb-1.5 font-sans">
                BUDGET
              </label>
              <input
                type="text"
                value={formData.budget}
                onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                placeholder="Approximate budget"
                className="w-full bg-white border border-stone-300 rounded-xl px-4 py-3 text-xs text-stone-900 font-medium placeholder:text-stone-500 focus:outline-none focus:ring-0 focus:border-stone-300 transition-colors shadow-xs"
              />
            </div>
          </div>

          {/* Row 4: QUANTITY */}
          <div>
            <label className="block text-[11px] font-bold tracking-widest text-stone-900 uppercase mb-1.5 font-sans">
              QUANTITY
            </label>
            <input
              type="text"
              value={formData.quantity}
              onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
              placeholder="Number of gifts"
              className="w-full bg-white border border-stone-300 rounded-xl px-4 py-3 text-xs text-stone-900 font-medium placeholder:text-stone-500 focus:outline-none focus:ring-0 focus:border-stone-300 transition-colors shadow-xs"
            />
          </div>

          {/* Row 5: MESSAGE */}
          <div>
            <label className="block text-[11px] font-bold tracking-widest text-stone-900 uppercase mb-1.5 font-sans">
              MESSAGE
            </label>
            <textarea
              rows={4}
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              placeholder="Looking for festive hampers for clients..."
              className="w-full bg-white border border-stone-300 rounded-xl px-4 py-3 text-xs text-stone-900 font-medium placeholder:text-stone-500 focus:outline-none focus:ring-0 focus:border-stone-300 transition-colors shadow-xs resize-none"
            />
          </div>

          {/* Submit Action */}
          <div className="pt-3 text-center">
            <button
              type="submit"
              className="bg-[#8b5f10] hover:bg-[#6f4b0d] text-white px-10 py-3.5 rounded-full text-xs font-bold tracking-widest uppercase shadow-md hover:shadow-lg transition-all cursor-pointer inline-flex items-center gap-2 active:scale-98"
            >
              <span>SUBMIT INQUIRY</span>
            </button>

            {submitted && (
              <p className="text-xs font-bold text-emerald-800 mt-3 animate-in fade-in">
                Thank you! Your gifting inquiry has been received. Our concierge will contact you shortly.
              </p>
            )}
          </div>
        </form>
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
