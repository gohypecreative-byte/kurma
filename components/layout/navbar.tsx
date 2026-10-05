"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingBag, Menu, X } from "lucide-react";

interface NavbarProps {
  cartCount: number;
  onOpenCart: () => void;
  onExploreProducts?: () => void;
}

export function Navbar({ cartCount, onOpenCart, onExploreProducts }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { name: "HOME", href: "/" },
    { name: "SHOP", href: "/shop" },
    { name: "CUSTOMISE", href: "/elements" },
    { name: "ABOUT", href: "/about" },
    { name: "CONTACT", href: "/contact" },
  ];

  return (
    <header className="sticky top-0 z-40 w-full relative bg-white/95 backdrop-blur-md border-b border-stone-200/80 text-stone-900 transition-all shadow-xs">
      <div className="w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 sm:gap-3 group">
          <div className="relative w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center shrink-0">
            <Image
              src="/images/brand/kurma-turtle-transparent.png"
              alt="Kurma Logo"
              width={56}
              height={56}
              className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
              priority
            />
          </div>
          <span className="font-serif tracking-[0.2em] text-[20px] sm:text-[22px] font-bold text-stone-900 leading-none">
            KURMA
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center space-x-7 xl:space-x-8 text-[13px] xl:text-[13.5px] font-semibold uppercase tracking-wider">
          {navLinks.map((link) => {
            const isActive =
              link.href === "/"
                ? pathname === "/"
                : pathname?.startsWith(link.href);

            return (
              <Link
                key={link.name}
                href={link.href}
                className={`relative py-2 transition-colors cursor-pointer ${
                  isActive
                    ? "text-[#8b5f10] font-semibold"
                    : "text-stone-700 hover:text-[#8b5f10]"
                }`}
              >
                <span>{link.name}</span>
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#8b5f10] rounded-full animate-in fade-in zoom-in-95 duration-200" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right Action CTAs */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Refined Luxury Cart Icon Button (Icon Only) */}
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenCart();
            }}
            aria-label={`View shopping cart with ${cartCount} items`}
            className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-full border border-stone-200 hover:border-[#c0881b] bg-[#faf9f6] hover:bg-[#fbf6ea] text-stone-800 hover:text-[#8b5f10] flex items-center justify-center transition-all duration-200 shadow-2xs hover:shadow-xs group cursor-pointer"
          >
            <ShoppingBag className="w-5 h-5 stroke-[1.75] text-stone-700 group-hover:text-[#8b5f10] transition-colors" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[19px] h-[19px] px-1 bg-[#072515] text-[#eed08e] border border-[#eed08e]/60 rounded-full text-[10.5px] font-bold flex items-center justify-center shadow-xs">
                {cartCount}
              </span>
            )}
          </button>

          {/* Mobile Hamburger Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-stone-600 hover:text-stone-900 lg:hidden rounded-lg hover:bg-stone-100 cursor-pointer"
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-navigation"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown & Backdrop (Overlays page so the section stays behind without shifting down) */}
      {mobileMenuOpen && (
        <>
          {/* Backdrop overlay */}
          <div
            className="fixed inset-0 top-20 bg-stone-900/40 backdrop-blur-xs z-30 lg:hidden animate-in fade-in duration-200"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />

          {/* Floating Dropdown Menu */}
          <div
            id="mobile-navigation"
            className="absolute top-full left-0 right-0 z-40 lg:hidden bg-white/98 backdrop-blur-xl border-b border-stone-200/90 px-6 py-4 space-y-2.5 shadow-2xl text-stone-900 animate-in fade-in-50 slide-in-from-top-2 duration-200"
          >
            {navLinks.map((link) => {
              const isActive =
                link.href === "/"
                  ? pathname === "/"
                  : pathname?.startsWith(link.href);

              return (
                <div key={link.name} className="border-b border-stone-100 last:border-b-0 pb-2.5 last:pb-0">
                  <Link
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`block text-xs font-semibold uppercase tracking-wider transition-colors py-1 flex items-center justify-between ${
                      isActive
                        ? "text-[#8b5f10] font-semibold"
                        : "text-stone-800 hover:text-[#c0881b]"
                    }`}
                  >
                    <span>{link.name}</span>
                    {isActive && (
                      <span className="w-2 h-2 rounded-full bg-[#8b5f10]" />
                    )}
                  </Link>
                </div>
              );
            })}
          </div>
        </>
      )}
    </header>
  );
}
