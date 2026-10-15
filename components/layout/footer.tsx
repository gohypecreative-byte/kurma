"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, Phone, Check } from "lucide-react";

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

function LinkedinIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

export function Footer() {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setIsSubscribed(true);
      setTimeout(() => {
        setEmail("");
        setIsSubscribed(false);
      }, 4000);
    }
  };


  return (
    <footer className="w-full bg-[#061e13] text-[#EED08E] border-t border-[#EED08E]/20 relative font-sans">
      {/* Main Footer Grid */}
      <div className="mx-auto max-w-7xl px-3 sm:px-6 md:px-8 lg:px-12 py-5 sm:py-14 lg:py-20">
        <div className="grid grid-cols-3 lg:grid-cols-12 gap-x-2.5 sm:gap-x-6 lg:gap-x-12 gap-y-4 sm:gap-y-8 lg:gap-y-12">
          {/* Column 1: GET IN TOUCH */}
          <div className="col-span-1 lg:col-span-3 min-w-0 space-y-1.5 sm:space-y-4">
            <h3 className="text-[10px] xs:text-[11px] sm:text-xs lg:text-sm font-serif font-semibold uppercase tracking-[0.14em] sm:tracking-[0.2em] text-[#EED08E]">
              GET IN TOUCH
            </h3>

            <div className="space-y-1 sm:space-y-3 pt-0.5 sm:pt-2 text-[10px] xs:text-[11px] sm:text-xs lg:text-sm text-[#EED08E]/90 font-light">
              <a
                href="mailto:XXXXXX@XXXXXX.com"
                className="flex items-center gap-1.5 hover:text-white transition-colors min-w-0"
              >
                <Mail className="w-3 h-3 sm:w-4 sm:h-4 text-[#EED08E] shrink-0" />
                <span className="truncate">XXXXXX@XXXXXX.com</span>
              </a>

              <a
                href="tel:+91XXXXXXXXXX"
                className="flex items-center gap-1.5 hover:text-white transition-colors min-w-0"
              >
                <Phone className="w-3 h-3 sm:w-4 sm:h-4 text-[#EED08E] shrink-0" />
                <span className="truncate">+91 XXXXX XXXXX</span>
              </a>
            </div>

            {/* Social Icons */}
            <div className="flex items-center gap-1.5 sm:gap-4 pt-1 sm:pt-3">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="w-6 h-6 sm:w-8 sm:h-8 rounded-full border border-[#EED08E]/40 text-[#EED08E] hover:text-white hover:border-white flex items-center justify-center transition-colors shrink-0"
              >
                <InstagramIcon className="w-3 h-3 sm:w-4 sm:h-4" />
              </a>

              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn"
                className="w-6 h-6 sm:w-8 sm:h-8 rounded-full border border-[#EED08E]/40 text-[#EED08E] hover:text-white hover:border-white flex items-center justify-center transition-colors shrink-0"
              >
                <LinkedinIcon className="w-3 h-3 sm:w-4 sm:h-4" />
              </a>

              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
                className="w-6 h-6 sm:w-8 sm:h-8 rounded-full border border-[#EED08E]/40 text-[#EED08E] hover:text-white hover:border-white flex items-center justify-center transition-colors shrink-0"
              >
                <FacebookIcon className="w-3 h-3 sm:w-4 sm:h-4" />
              </a>
            </div>
          </div>

          {/* Column 2: NAVIGATION */}
          <div className="col-span-1 lg:col-span-3 min-w-0 space-y-1.5 sm:space-y-4">
            <h3 className="text-[10px] xs:text-[11px] sm:text-xs lg:text-sm font-serif font-semibold uppercase tracking-[0.14em] sm:tracking-[0.2em] text-[#EED08E]">
              NAVIGATION
            </h3>

            <ul className="space-y-1 sm:space-y-2.5 pt-0.5 sm:pt-0 text-[10.5px] xs:text-[11px] sm:text-xs lg:text-sm text-[#EED08E]/80 font-light">
              <li>
                <Link href="/" className="hover:text-white transition-colors block truncate">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/shop" className="hover:text-white transition-colors block truncate">
                  Shop
                </Link>
              </li>
              <li>
                <Link href="/elements" className="hover:text-white transition-colors block truncate">
                  5 Elements
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white transition-colors block truncate">
                  About
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors block truncate">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: INFORMATION */}
          <div className="col-span-1 lg:col-span-3 min-w-0 space-y-1.5 sm:space-y-4">
            <h3 className="text-[10px] xs:text-[11px] sm:text-xs lg:text-sm font-serif font-semibold uppercase tracking-[0.14em] sm:tracking-[0.2em] text-[#EED08E]">
              INFORMATION
            </h3>

            <ul className="space-y-1 sm:space-y-2.5 pt-0.5 sm:pt-0 text-[9.5px] xs:text-[10.5px] sm:text-xs lg:text-sm text-[#EED08E]/80 font-light leading-snug">
              <li>
                <Link href="/gift-trunks" className="hover:text-white transition-colors block">
                  Artisan Hampers &amp; Trunks
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors block">
                  Corporate &amp; Wedding Orders
                </Link>
              </li>
              <li>
                <Link href="/reviews" className="hover:text-white transition-colors block">
                  Client Testimonials
                </Link>
              </li>
              <li>
                <Link href="/shipping-policy" className="hover:text-white transition-colors block">
                  Shipping &amp; Delivery Policy
                </Link>
              </li>
              <li>
                <Link href="/refund-policy" className="hover:text-white transition-colors block">
                  Cancellation &amp; Refund Policy
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-white transition-colors block">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-white transition-colors block">
                  Terms &amp; Conditions
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: NEWSLETTER */}
          <div className="col-span-3 lg:col-span-3 min-w-0 space-y-1.5 sm:space-y-4 pt-3 lg:pt-0 border-t border-[#EED08E]/15 lg:border-t-0">
            <h3 className="text-[10px] xs:text-[11px] sm:text-xs lg:text-sm font-serif font-semibold uppercase tracking-[0.14em] sm:tracking-[0.2em] text-[#EED08E]">
              NEWSLETTER
            </h3>

            <p className="text-[9.5px] xs:text-[10.5px] sm:text-xs text-[#EED08E]/80 uppercase tracking-wider font-light leading-relaxed">
              SIGN UP TO RECEIVE THE LATEST NEWS &amp; EXCLUSIVE GIFT RELEASES.
            </p>

            <form onSubmit={handleSubscribe} className="pt-1 sm:pt-2">
              <div className="flex flex-row items-stretch gap-1.5 sm:gap-2 max-w-md">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ENTER EMAIL ADDRESS"
                  required
                  className="bg-black/20 border border-[#EED08E]/40 text-[#EED08E] placeholder:text-[#EED08E]/50 px-3 sm:px-4 py-2 sm:py-2.5 text-[10px] xs:text-[11px] sm:text-xs tracking-wider uppercase focus:outline-none focus:border-[#EED08E] flex-1 min-w-0"
                />

                <button
                  type="submit"
                  className="bg-[#8C6215] text-white hover:bg-[#A37318] px-3.5 sm:px-5 py-2 sm:py-2.5 text-[10px] xs:text-[11px] sm:text-xs font-bold tracking-widest uppercase transition-colors shrink-0 cursor-pointer flex items-center justify-center gap-1.5"
                >
                  {isSubscribed ? (
                    <Check className="w-3.5 h-3.5 text-emerald-300" />
                  ) : (
                    <span>SUBMIT</span>
                  )}
                </button>
              </div>

              {isSubscribed && (
                <span className="text-[10px] sm:text-[11px] text-emerald-400 block mt-1.5 font-sans">
                  Thank you! You are now subscribed to Kurma dispatches.
                </span>
              )}
            </form>
          </div>
        </div>
      </div>

      {/* Bottom Copyright Bar & Scroll to Top Button */}
      <div className="border-t border-[#EED08E]/20 py-6 px-4 sm:px-6 lg:px-12 text-center text-xs text-[#EED08E]/70 font-sans relative">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="tracking-widest">
            &copy; {new Date().getFullYear()} Kurma Corporate &amp; Luxury Gifting. All rights reserved.
          </p>

          {/* Footer Legal Quick Links */}
          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[11px] text-[#EED08E]/85">
            <Link href="/terms" className="hover:text-white transition-colors">
              Terms &amp; Conditions
            </Link>
            <span className="text-[#EED08E]/30 hidden sm:inline">•</span>
            <Link href="/privacy" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <span className="text-[#EED08E]/30 hidden sm:inline">•</span>
            <Link href="/shipping-policy" className="hover:text-white transition-colors">
              Shipping &amp; Delivery
            </Link>
            <span className="text-[#EED08E]/30 hidden sm:inline">•</span>
            <Link href="/refund-policy" className="hover:text-white transition-colors">
              Cancellation &amp; Refunds
            </Link>
          </div>

        </div>
      </div>
    </footer>
  );
}
