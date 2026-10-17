"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MotionConfig } from "motion/react";
import { ChevronRight } from "lucide-react";
import { RitualAndQuestions, ScrollProgress } from "@/components/home/experience";
import { Navbar } from "@/components/layout/navbar";
import { Hero } from "@/components/home/hero";
import { PromoBanner } from "@/components/home/promo-banner";
import { ProductShowcase } from "@/components/home/product-showcase";
import { SolutionsAndTrust } from "@/components/home/solutions-and-trust";
import { ShoppableVideoReels } from "@/components/shop/shoppable-video-reels";
import { ComboPackBanner } from "@/components/home/combo-pack-banner";
import { TrustStats } from "@/components/home/trust-stats";
import { ReviewsSection } from "@/components/home/reviews-section";
import { Footer } from "@/components/layout/footer";
import { CartDrawer, CartItem } from "@/components/cart/cart-drawer";
import { ProductCustomizerModal } from "@/components/product/product-customizer-modal";
import { useCart } from "@/lib/cart-context";

export default function Home() {
  const router = useRouter();
  const {
    cartCount,
    setIsCartOpen,
    addToCart,
  } = useCart();

  const scrollToCatalog = () => {
    const el = document.getElementById("catalog");
    if (el) {
      el.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
    }
  };

  const scrollToSolutions = () => {
    const el = document.getElementById("solutions");
    if (el) {
      el.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
    }
  };

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden flex flex-col bg-[#072515] sm:bg-[url('/images/textures/green-texture.png')] sm:bg-repeat text-white selection:bg-[#eed08e] selection:text-[#072515]">
      <ScrollProgress />
      {/* E-Commerce Header with Cart Drawer Trigger */}
      <Navbar
        cartCount={cartCount}
        onOpenCart={() => setIsCartOpen(true)}
        onExploreProducts={scrollToCatalog}
      />

      {/* Main Content */}
      <main id="main-content" className="flex-1 w-full max-w-full overflow-x-hidden">
        <MotionConfig reducedMotion="user">
        {/* Hero Section */}
        <Hero
          onExploreGifts={scrollToCatalog}
          onExploreBestsellers={scrollToSolutions}
        />

        {/* Promo Banner Slider Section */}
        <PromoBanner
          onExploreGifts={scrollToCatalog}
        />

        {/* Master Catalog & 5 Elements Spotlight */}
        <div id="catalog">
          <ProductShowcase
            onAddToCart={addToCart}
            onCustomizeProduct={(product) => router.push(`/elements?box=${product.id}`)}
          />
        </div>

        {/* Sacred Shoppable Video Reels (Watch & Shop - 4 Products at a Time) */}
        <section className="w-full bg-[#FAF8F5] py-14 sm:py-24 text-stone-900 border-t border-b border-[#072515]/10 mobile-defer-render">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-2">
              <div>
                <span className="text-xs font-semibold tracking-[0.25em] text-[#8C6215] uppercase">
                  WATCH &amp; SHOP
                </span>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif text-stone-900 tracking-tight font-normal mt-1">
                  Sacred Rituals &amp; Heirloom Creations
                </h2>
                <div className="h-0.5 w-24 bg-[#c0881b] mt-2.5" />
              </div>
              <button
                onClick={() => router.push("/shop")}
                className="text-xs font-bold text-[#8b5f10] hover:text-[#6f4b0d] flex items-center gap-1 cursor-pointer self-start sm:self-end"
              >
                <span>Explore Full Shop</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <ShoppableVideoReels />
          </div>
        </section>

        <RitualAndQuestions />

        {/* High-Quality Full Width Combo Pack Banner */}
        <ComboPackBanner />

        {/* Sticky Card Stack Reveal Section */}
        <SolutionsAndTrust
          onAddToCart={addToCart}
          onCustomizeProduct={(product) => router.push(`/elements?box=${product.id}`)}
        />

        {/* 3D Autoplay Carousel Review Section (Positioned directly above Footer) */}
        <ReviewsSection onExploreProducts={scrollToCatalog} />
        </MotionConfig>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
