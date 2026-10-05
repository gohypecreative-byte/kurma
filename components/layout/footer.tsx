"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, Phone, ChevronUp, Check } from "lucide-react";

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

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="w-full bg-[#061e13] text-[#EED08E] border-t border-[#EED08E]/20 relative font-sans">
      {/* Main Footer Grid */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8 lg:px-12 py-14 sm:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-12">
          {/* Column 1: GET IN TOUCH (Col Span 3) */}
          <div className="lg:col-span-3 space-y-4">
            <h3 className="text-xs sm:text-sm font-serif font-semibold uppercase tracking-[0.2em] text-[#EED08E]">
              GET IN TOUCH
            </h3>

            <div className="space-y-3 pt-2 text-xs sm:text-sm text-[#EED08E]/90 font-light">
              <a
                href="mailto:XXXXXX@XXXXXX.com"
                className="flex items-center gap-2.5 hover:text-white transition-colors"
              >
                <Mail className="w-4 h-4 text-[#EED08E] shrink-0" />
                <span>XXXXXX@XXXXXX.com</span>
              </a>

              <a
                href="tel:+91XXXXXXXXXX"
                className="flex items-center gap-2.5 hover:text-white transition-colors"
              >
                <Phone className="w-4 h-4 text-[#EED08E] shrink-0" />
                <span>+91 XXXXX XXXXX</span>
              </a>
            </div>

            {/* Social Icons */}
            <div className="flex items-center gap-4 pt-3">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="w-8 h-8 rounded-full border border-[#EED08E]/40 text-[#EED08E] hover:text-white hover:border-white flex items-center justify-center transition-colors"
              >
                <InstagramIcon className="w-4 h-4" />
              </a>

              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn"
                className="w-8 h-8 rounded-full border border-[#EED08E]/40 text-[#EED08E] hover:text-white hover:border-white flex items-center justify-center transition-colors"
              >
                <LinkedinIcon className="w-4 h-4" />
              </a>

              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
                className="w-8 h-8 rounded-full border border-[#EED08E]/40 text-[#EED08E] hover:text-white hover:border-white flex items-center justify-center transition-colors"
              >
                <FacebookIcon className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Column 2: NAVIGATION (Col Span 3) */}
          <div className="lg:col-span-3 space-y-4">
            <h3 className="text-xs sm:text-sm font-serif font-semibold uppercase tracking-[0.2em] text-[#EED08E]">
              NAVIGATION
            </h3>

            <ul className="space-y-2.5 text-xs sm:text-sm text-[#EED08E]/80 font-light">
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/shop" className="hover:text-white transition-colors">
                  Shop
                </Link>
              </li>
              <li>
                <Link href="/elements" className="hover:text-white transition-colors">
                  5 Elements
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: INFORMATION & POLICIES (Col Span 3) */}
          <div className="lg:col-span-3 space-y-4">
            <h3 className="text-xs sm:text-sm font-serif font-semibold uppercase tracking-[0.2em] text-[#EED08E]">
              INFORMATION
            </h3>

            <ul className="space-y-2.5 text-xs sm:text-sm text-[#EED08E]/80 font-light">
              <li>
                <Link href="/gift-trunks" className="hover:text-white transition-colors">
                  Artisan Hampers &amp; Trunks
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  Corporate &amp; Wedding Orders
                </Link>
              </li>
              <li>
                <Link href="/reviews" className="hover:text-white transition-colors">
                  Client Testimonials
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  Shipping &amp; Delivery Policy
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  Cancellation &amp; Refund Policy
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  Privacy &amp; Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: NEWSLETTER (Col Span 3) */}
          <div className="lg:col-span-3 space-y-4">
            <h3 className="text-xs sm:text-sm font-serif font-semibold uppercase tracking-[0.2em] text-[#EED08E]">
              NEWSLETTER
            </h3>

            <p className="text-xs text-[#EED08E]/80 uppercase tracking-wider font-light leading-relaxed">
              SIGN UP TO RECEIVE THE LATEST NEWS &amp; EXCLUSIVE GIFT RELEASES.
            </p>

            <form onSubmit={handleSubscribe} className="pt-2">
              <div className="flex flex-col sm:flex-row items-stretch gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ENTER EMAIL ADDRESS"
                  required
                  className="bg-black/20 border border-[#EED08E]/40 text-[#EED08E] placeholder:text-[#EED08E]/50 px-4 py-2.5 text-xs tracking-wider uppercase focus:outline-none focus:border-[#EED08E] w-full min-w-0"
                />

                <button
                  type="submit"
                  className="bg-[#8C6215] text-white hover:bg-[#A37318] px-5 py-2.5 text-xs font-bold tracking-widest uppercase transition-colors shrink-0 cursor-pointer flex items-center justify-center gap-1.5"
                >
                  {isSubscribed ? (
                    <Check className="w-4 h-4 text-emerald-300" />
                  ) : (
                    <span>SUBMIT</span>
                  )}
                </button>
              </div>

              {isSubscribed && (
                <span className="text-[11px] text-emerald-400 block mt-2 font-sans">
                  Thank you! You are now subscribed to Kurma dispatches.
                </span>
              )}
            </form>
          </div>
        </div>
      </div>

      {/* Bottom Copyright Bar & Scroll to Top Button */}
      <div className="border-t border-[#EED08E]/20 py-6 px-4 sm:px-6 lg:px-12 text-center text-xs text-[#EED08E]/70 font-sans relative">
        <div className="max-w-7xl mx-auto flex items-center justify-center">
          <p className="tracking-widest">
            &copy; {new Date().getFullYear()} Kurma Corporate &amp; Luxury Gifting. All rights reserved.
          </p>

          {/* Floating Scroll to Top Button */}
          <button
            onClick={scrollToTop}
            aria-label="Scroll to top"
            className="absolute right-6 sm:right-12 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white text-[#061e13] hover:bg-[#EED08E] flex items-center justify-center shadow-lg transition-all cursor-pointer"
          >
            <ChevronUp className="w-5 h-5" />
          </button>
        </div>
      </div>
    </footer>
  );
}
