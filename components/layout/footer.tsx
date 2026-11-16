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

function PinterestIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 0 1 .083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z"/>
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
  const [consent, setConsent] = useState(false);
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
      <div className="w-full max-w-[1520px] mx-auto px-4 sm:px-8 md:px-12 lg:px-16 pt-6 sm:pt-8 lg:pt-9 pb-5 sm:pb-6">
        
        {/* ========================================================================= */}
        {/* 1. TOP BRAND LOGO (Centered)                                              */}
        {/* ========================================================================= */}
        <div className="w-full flex items-center justify-center text-center pt-1 sm:pt-2">
          <Link href="/" className="group inline-flex items-center justify-center cursor-pointer" aria-label="Kurma Home">
            <div className="relative w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 flex items-center justify-center shrink-0">
              <Image
                src="/images/logo-transparent.png"
                alt="Kurma Logo"
                width={112}
                height={112}
                className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105 pointer-events-none"
                priority
              />
            </div>
          </Link>
        </div>

        {/* ========================================================================= */}
        {/* 2. PROMINENT HERO STATEMENT BANNER (Matching reference "Own It #Trust...")*/}
        {/* ========================================================================= */}
        <div className="w-full text-center mt-3 sm:mt-4 mb-5 sm:mb-6 lg:mb-7 overflow-hidden">
          <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-[50px] font-medium tracking-tight leading-tight text-[#1C1B18]/90">
            Sacred Living <span className="text-[#8C6215]/85 italic font-serif">#KurmaRitual</span>
          </h2>
        </div>

        {/* ========================================================================= */}
        {/* 3. FOUR-COLUMN MAIN GRID (Customer Service, Company, Follow, Newsletter) */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 lg:gap-10">
          
          {/* COLUMN 1: Customer Service */}
          <div>
            <h3 className="font-serif text-lg sm:text-xl lg:text-[22px] font-semibold text-[#1C1B18] tracking-tight mb-2.5 sm:mb-3">
              Customer Service
            </h3>
            <ul className="space-y-2 sm:space-y-2.5 text-sm sm:text-[15px] lg:text-base text-stone-600 font-normal">
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
              <li>
                <Link href="/ritual" className="hover:text-[#8C6215] transition-colors block">
                  Sacred Ritual Guide
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-[#8C6215] transition-colors block">
                  Terms &amp; Conditions
                </Link>
              </li>
              <li>
                <Link href="/#faq" className="hover:text-[#8C6215] transition-colors block">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* COLUMN 2: Company & Secure Payment */}
          <div>
            <h3 className="font-serif text-lg sm:text-xl lg:text-[22px] font-semibold text-[#1C1B18] tracking-tight mb-2.5 sm:mb-3">
              Company
            </h3>
            <ul className="space-y-2 sm:space-y-2.5 text-sm sm:text-[15px] lg:text-base text-stone-600 font-normal">
              <li>
                <Link href="/about" className="hover:text-[#8C6215] transition-colors block">
                  Why Kurma
                </Link>
              </li>
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
                <Link href="/reviews" className="hover:text-[#8C6215] transition-colors block">
                  Patron Reviews
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
            <h3 className="font-serif text-lg sm:text-xl lg:text-[22px] font-semibold text-[#1C1B18] tracking-tight mb-2.5 sm:mb-3">
              Follow Us
            </h3>
            <div className="flex items-center gap-3 mb-3.5 sm:mb-4">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#123D2D] hover:bg-[#092B20] text-[#E8D9AE] hover:text-[#FFE7A8] flex items-center justify-center transition-all cursor-pointer shadow-2xs active:scale-95"
              >
                <InstagramIcon className="w-4.5 h-4.5" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#123D2D] hover:bg-[#092B20] text-[#E8D9AE] hover:text-[#FFE7A8] flex items-center justify-center transition-all cursor-pointer shadow-2xs active:scale-95"
              >
                <FacebookIcon className="w-4.5 h-4.5" />
              </a>
              <a
                href="https://pinterest.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Pinterest"
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#123D2D] hover:bg-[#092B20] text-[#E8D9AE] hover:text-[#FFE7A8] flex items-center justify-center transition-all cursor-pointer shadow-2xs active:scale-95"
              >
                <PinterestIcon className="w-4.5 h-4.5" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#123D2D] hover:bg-[#092B20] text-[#E8D9AE] hover:text-[#FFE7A8] flex items-center justify-center transition-all cursor-pointer shadow-2xs active:scale-95"
              >
                <YoutubeIcon className="w-4.5 h-4.5" />
              </a>
            </div>

            {/* Office Address */}
            <h4 className="font-serif text-base sm:text-lg lg:text-[19px] font-semibold text-[#1C1B18] tracking-tight mb-2">
              Office Address
            </h4>
            <p className="text-sm sm:text-[15px] text-stone-600 leading-relaxed font-normal">
              Shop No. 3, DLF Galleria,<br />
              Sector 28, Golf Course Road,<br />
              Gurugram, Haryana 122009
            </p>
          </div>

          {/* COLUMN 4: Join Our Newsletter */}
          <div>
            <h3 className="font-serif text-lg sm:text-xl lg:text-[22px] font-semibold text-[#1C1B18] tracking-tight mb-2 sm:mb-2.5">
              Join Our Newsletter
            </h3>
            <p className="text-sm sm:text-[15px] text-stone-600 leading-relaxed mb-3">
              Get drops, tips &amp; members-only offers. No spam.
            </p>

            {/* Newsletter Subscription Form */}
            <form onSubmit={handleSubscribe} className="space-y-3">
              <div className="flex items-center gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. name@example.com"
                  required
                  className="flex-1 min-w-0 px-4 py-2.5 sm:py-3 bg-white border border-stone-200/90 rounded-lg text-sm sm:text-base text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-[#C5A45B] transition-colors shadow-2xs"
                />
                <button
                  type="submit"
                  className="px-5 sm:px-6 py-2.5 sm:py-3 bg-[#123D2D] hover:bg-[#092B20] text-[#E8D9AE] hover:text-[#FFE7A8] rounded-lg text-sm sm:text-base font-medium transition-all cursor-pointer shrink-0 shadow-xs active:scale-95"
                >
                  Subscribe
                </button>
              </div>

              {subscribed && (
                <p className="text-sm text-emerald-700 font-medium animate-fadeIn">
                  &check; Thank you for joining Kurma&apos;s sacred circle.
                </p>
              )}

              {/* Marketing Consent Checkbox */}
              <div className="flex items-start gap-2 pt-0.5 text-xs sm:text-[13px] text-stone-500 leading-snug">
                <input
                  type="checkbox"
                  id="newsletter-consent"
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                  className="mt-0.5 rounded border-stone-300 text-[#123D2D] focus:ring-[#C5A45B] cursor-pointer"
                />
                <label htmlFor="newsletter-consent" className="cursor-pointer">
                  I agree to receive marketing emails from Kurma. Read our{" "}
                  <Link href="/privacy" className="underline hover:text-black">
                    Privacy Policy
                  </Link>.
                </label>
              </div>
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
