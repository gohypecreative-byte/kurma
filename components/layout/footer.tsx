"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Mail, ArrowRight, Check, ShieldCheck, Heart } from "lucide-react";

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
    <footer className="w-full bg-[#f3f6ef] text-stone-800 border-t border-[#e2e8dc] font-sans">
      {/* Main Footer Content */}
      <div className="w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 py-10 sm:py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10">
          {/* Column 1: Brand & Sacred Mission (Col Span 5) */}
          <div className="lg:col-span-5 space-y-3.5">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="relative w-10 h-10 sm:w-11 sm:h-11 shrink-0">
                <Image
                  src="/images/brand/kurma-turtle-transparent.png"
                  alt="Kurma Logo"
                  width={44}
                  height={44}
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="font-serif tracking-[0.2em] text-lg sm:text-xl font-bold text-stone-900 leading-none">
                KURMA
              </span>
            </Link>

            <p className="text-xs sm:text-sm text-stone-600 max-w-sm leading-relaxed">
              100% charcoal-free Vedic incense, handcrafted with pure Mysore botanicals, temple flower resins, and heirloom brass burners.
            </p>

            {/* Newsletter Subscription */}
            <div className="pt-1 max-w-sm">
              <span className="text-[11px] font-bold text-stone-900 uppercase tracking-wider block mb-1.5 font-cinzel">
                Sacred Aroma Dispatch
              </span>
              <form onSubmit={handleSubscribe} className="relative">
                <div className="flex items-center bg-white border border-stone-300 rounded-lg px-3 py-2 shadow-2xs focus-within:border-[#c0881b] transition-colors">
                  <Mail className="w-3.5 h-3.5 text-stone-400 mr-2 shrink-0" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter email for 10% off"
                    required
                    className="w-full text-xs text-stone-800 placeholder-stone-400 bg-transparent focus:outline-none min-w-0"
                  />
                  <button
                    type="submit"
                    aria-label="Subscribe"
                    className="ml-2 text-stone-600 hover:text-[#c0881b] transition-colors cursor-pointer shrink-0"
                  >
                    {isSubscribed ? (
                      <Check className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <ArrowRight className="w-4 h-4" />
                    )}
                  </button>
                </div>
                {isSubscribed && (
                  <span className="text-[11px] text-emerald-700 font-medium block mt-1">
                    Thank you! Code SACRED10 has been unlocked.
                  </span>
                )}
              </form>
            </div>
          </div>

          {/* Quick Links in 2 Columns on Mobile, 3 Columns on Desktop */}
          <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-6 sm:gap-8 pt-2 lg:pt-0">
            {/* Column 2: Sacred Collections */}
            <div>
              <h3 className="text-xs sm:text-sm font-bold text-stone-900 uppercase tracking-wider font-cinzel mb-3">
                Collections
              </h3>
              <ul className="space-y-2 text-xs text-stone-600">
                <li>
                  <Link href="/shop" className="hover:text-[#c0881b] transition-colors">
                    All Incense &amp; Trunks
                  </Link>
                </li>
                <li>
                  <Link href="/elements" className="hover:text-[#c0881b] transition-colors">
                    5 Elements Suite
                  </Link>
                </li>
                <li>
                  <Link href="/gift-trunks" className="hover:text-[#c0881b] transition-colors">
                    Marble &amp; Wooden Trunks
                  </Link>
                </li>
                <li>
                  <Link href="/ritual" className="hover:text-[#c0881b] transition-colors">
                    Sacred Daily Rituals
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 3: The Sanctuary */}
            <div>
              <h3 className="text-xs sm:text-sm font-bold text-stone-900 uppercase tracking-wider font-cinzel mb-3">
                Sanctuary
              </h3>
              <ul className="space-y-2 text-xs text-stone-600">
                <li>
                  <Link href="/about" className="hover:text-[#c0881b] transition-colors">
                    Our Heritage &amp; Artisans
                  </Link>
                </li>
                <li>
                  <Link href="/reviews" className="hover:text-[#c0881b] transition-colors">
                    Devotee Testimonials
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-[#c0881b] transition-colors">
                    Contact &amp; Support
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-[#c0881b] transition-colors">
                    Corporate Bespoke Gifting
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 4: Guarantees & Policies */}
            <div className="col-span-2 sm:col-span-1">
              <h3 className="text-xs sm:text-sm font-bold text-stone-900 uppercase tracking-wider font-cinzel mb-3">
                Assurance
              </h3>
              <ul className="space-y-2 text-xs text-stone-600">
                <li className="flex items-center gap-1.5 text-stone-700 font-medium">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>100% Charcoal-Free</span>
                </li>
                <li className="flex items-center gap-1.5 text-stone-700 font-medium">
                  <Heart className="w-3.5 h-3.5 text-[#c0881b] shrink-0" />
                  <span>Mysore Hand-Rolled</span>
                </li>
                <li className="pt-1">
                  <Link href="/contact" className="hover:text-[#c0881b] transition-colors">
                    Shipping &amp; Delivery
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-[#c0881b] transition-colors">
                    Returns &amp; Fragile Guarantee
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Copyright & Sacred Craft Bar */}
      <div className="border-t border-[#e2e8dc] py-5 px-4 sm:px-6 lg:px-12 text-center text-xs text-stone-500">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2.5">
          <p className="flex items-center justify-center gap-1 text-[11px] sm:text-xs">
            <span>Handcrafted with</span>
            <Heart className="w-3 h-3 text-[#c0881b] fill-current" />
            <span>in Mysore &amp; Moradabad, India</span>
          </p>

          <p className="text-[11px] sm:text-xs text-stone-500">
            &copy; {new Date().getFullYear()} Kurma Impressions. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
