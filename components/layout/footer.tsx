"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

function InstagramIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
    </svg>
  );
}

function FacebookIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
    </svg>
  );
}

function YoutubeIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
    </svg>
  );
}



export function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubscribed(true);
    setTimeout(() => {
      setEmail("");
    }, 2500);
  };

  return (
    <footer className="relative w-full max-w-full overflow-hidden bg-[#FAF7F2] text-[#1C1B18] border-t border-[#EAE3D8] font-sans select-none">
      <div className="w-full max-w-[1520px] mx-auto px-4 sm:px-8 md:px-12 lg:px-16 pt-3 sm:pt-4 lg:pt-5 pb-5 sm:pb-6">
        
        {/* ========================================================================= */}
        {/* 1. TOP BRAND LOGO (Centered)                                              */}
        {/* ========================================================================= */}
        <div className="w-full flex items-center justify-center text-center pt-0">
          <Link href="/" className="group inline-flex items-center justify-center cursor-pointer" aria-label="Kurma Home">
            <div className="relative w-24 h-24 sm:w-28 sm:h-28 lg:w-32 lg:h-32 flex items-center justify-center shrink-0">
              <Image
                src="/images/logo-transparent.png"
                alt="Kurma Logo"
                width={130}
                height={130}
                className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105 pointer-events-none"
                priority
              />
            </div>
          </Link>
        </div>

        {/* ========================================================================= */}
        {/* 2. PROMINENT HERO STATEMENT BANNER (Matching reference "Own It #Trust...")*/}
        {/* ========================================================================= */}
        <div className="w-full text-center mt-1 sm:mt-1.5 mb-5 sm:mb-6 lg:mb-7 overflow-hidden">
          <h2 className="relative inline-block font-serif text-[clamp(16px,5.1vw,58px)] font-semibold tracking-wide leading-tight select-none whitespace-nowrap">
            {/* Base text: Both words in the same elegant light gold color and consistent upright serif style */}
            <span className="text-[#B89246]">
              Sacred Living
            </span>{" "}
            <span className="text-[#B89246]">
              #KurmaRitual
            </span>

            {/* Seamless, continuous glowing shimmer wave (no stops or pauses) */}
            <span
              aria-hidden="true"
              className="absolute inset-0 pointer-events-none select-none kurma-footer-shimmer whitespace-nowrap"
            >
              <span className="text-white drop-shadow-[0_0_12px_rgba(255,255,255,0.95)] drop-shadow-[0_0_24px_rgba(255,255,255,0.7)]">
                Sacred Living
              </span>{" "}
              <span className="text-white drop-shadow-[0_0_12px_rgba(255,255,255,0.95)] drop-shadow-[0_0_24px_rgba(255,255,255,0.7)]">
                #KurmaRitual
              </span>
            </span>
          </h2>
        </div>

        {/* ========================================================================= */}
        {/* 3. FOUR-COLUMN MAIN GRID (Customer Service, Company, Follow, Newsletter) */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-2 lg:grid-cols-[1fr_1fr_1.05fr_1.35fr] gap-x-5 sm:gap-x-8 gap-y-7 sm:gap-y-8 lg:gap-8 xl:gap-10">
          
          {/* COLUMN 1: Customer Service */}
          <div>
            <h3 className="font-serif text-base sm:text-xl lg:text-[22px] font-semibold text-[#1C1B18] tracking-tight mb-2 sm:mb-3">
              Customer Service
            </h3>
            <ul className="space-y-1.5 sm:space-y-2.5 text-xs sm:text-[15px] lg:text-base text-stone-600 font-normal">
              <li>
                <Link href="/contact" className="hover:text-[#8C6215] transition-colors block">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/refund-policy" className="hover:text-[#8C6215] transition-colors block">
                  Return / Exchange
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-[#8C6215] transition-colors block">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/shipping-policy" className="hover:text-[#8C6215] transition-colors block">
                  Shipping Policy
                </Link>
              </li>
              {/* <li>
                <Link href="/ritual" className="hover:text-[#8C6215] transition-colors block">
                  Sacred Ritual Guide
                </Link>
              </li> */}
              <li>
                <Link href="/terms" className="hover:text-[#8C6215] transition-colors block">
                  Terms &amp; Conditions
                </Link>
              </li>
            </ul>
          </div>

          {/* COLUMN 2: Company & Secure Payment */}
          <div>
            <h3 className="font-serif text-base sm:text-xl lg:text-[22px] font-semibold text-[#1C1B18] tracking-tight mb-2 sm:mb-3">
              Company
            </h3>
            <ul className="space-y-1.5 sm:space-y-2.5 text-xs sm:text-[15px] lg:text-base text-stone-600 font-normal">
              <li>
                <Link href="/about" className="hover:text-[#8C6215] transition-colors block">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/elements" className="hover:text-[#8C6215] transition-colors block">
                  5 Elements Suite
                </Link>
              </li>
              <li>
                <Link href="/gift-trunks" className="hover:text-[#8C6215] transition-colors block">
                  Bespoke Trunks
                </Link>
              </li>
              <li>
                <Link href="/track-order" className="hover:text-[#8C6215] transition-colors block">
                  Track Your Order
                </Link>
              </li>
            </ul>
          </div>

          {/* COLUMN 3: Follow Us & Office Address */}
          <div>
            {/* Follow Us */}
            <h3 className="font-serif text-base sm:text-xl lg:text-[22px] font-semibold text-[#1C1B18] tracking-tight mb-2 sm:mb-3">
              Follow Us
            </h3>
            <div className="flex items-center gap-2.5 sm:gap-3 mb-3 sm:mb-4">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#123D2D] hover:bg-[#092B20] text-[#E8D9AE] hover:text-[#FFE7A8] flex items-center justify-center transition-all cursor-pointer shadow-2xs active:scale-95"
              >
                <InstagramIcon className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#123D2D] hover:bg-[#092B20] text-[#E8D9AE] hover:text-[#FFE7A8] flex items-center justify-center transition-all cursor-pointer shadow-2xs active:scale-95"
              >
                <FacebookIcon className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#123D2D] hover:bg-[#092B20] text-[#E8D9AE] hover:text-[#FFE7A8] flex items-center justify-center transition-all cursor-pointer shadow-2xs active:scale-95"
              >
                <YoutubeIcon className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
              </a>
            </div>

            {/* Office Address */}
            <h4 className="font-serif text-sm sm:text-lg lg:text-[19px] font-semibold text-[#1C1B18] tracking-tight mb-1.5 sm:mb-2">
              Office Address
            </h4>
            <p className="text-xs sm:text-[15px] text-stone-600 leading-relaxed font-normal">
              Shop No. 3, DLF Galleria,<br />
              Sector 28, Golf Course Road,<br />
              Gurugram, Haryana 122009
            </p>
          </div>

          {/* COLUMN 4: Join Our Newsletter */}
          <div>
            <h3 className="font-serif text-base sm:text-xl lg:text-[22px] font-semibold text-[#1C1B18] tracking-tight mb-1.5 sm:mb-2.5">
              Join Our Newsletter
            </h3>
            <p className="text-xs sm:text-[15px] text-stone-600 leading-relaxed mb-2.5 sm:mb-3">
              Get drops, tips &amp; members-only offers. No spam.
            </p>

            {/* Newsletter Subscription Form */}
            <form onSubmit={handleSubscribe} className="space-y-2.5 sm:space-y-3">
              <div className="flex flex-col min-[480px]:flex-row items-stretch min-[480px]:items-center gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. name@example.com"
                  required
                  className="w-full min-[480px]:flex-1 min-w-0 px-3 py-2 sm:py-2.5 bg-white border border-stone-200/90 rounded-lg text-xs sm:text-[13px] text-stone-900 placeholder:text-stone-400 placeholder:text-xs sm:placeholder:text-[13px] focus:outline-none focus:border-[#C5A45B] transition-colors shadow-2xs"
                />
                <button
                  type="submit"
                  className="w-full min-[480px]:w-auto px-4 py-2 sm:py-2.5 bg-[#123D2D] hover:bg-[#092B20] text-[#E8D9AE] hover:text-[#FFE7A8] rounded-lg text-xs sm:text-[13px] font-medium transition-all cursor-pointer shrink-0 shadow-xs active:scale-95 text-center"
                >
                  Subscribe
                </button>
              </div>

              {subscribed && (
                <p className="text-sm text-emerald-700 font-medium animate-fadeIn">
                  &check; Thank you for joining Kurma&apos;s sacred circle.
                </p>
              )}
            </form>
          </div>

        </div>

        {/* ========================================================================= */}
        {/* 4. SUB-FOOTER BOTTOM BAR (Copyright & Brand Credits)                      */}
        {/* ========================================================================= */}
        <div className="border-t border-[#EAE3D8] mt-6 sm:mt-7 pt-4 sm:pt-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs sm:text-sm text-stone-500">
          <p>
            &copy; {new Date().getFullYear()} Kurma. All Rights Reserved.
          </p>
          <p className="tracking-wide">
            Kurma by Artisanal Living &bull; Scents Connect Worlds
          </p>
        </div>

      </div>
    </footer>
  );
}
