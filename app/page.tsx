"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MotionConfig } from "motion/react";
import { RitualAndQuestions, ScrollProgress } from "@/components/home/experience";
import { Navbar } from "@/components/layout/navbar";
import { Hero } from "@/components/home/hero";
import { ProductShowcase } from "@/components/home/product-showcase";
import { SolutionsAndTrust } from "@/components/home/solutions-and-trust";
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
    <div className="min-h-screen w-full max-w-full flex flex-col bg-[#092B20] text-[#E8D9AE] selection:bg-[#C5A45B] selection:text-[#092B20]">
      <ScrollProgress />
      {/* E-Commerce Header with Cart Drawer Trigger */}
      <Navbar
        cartCount={cartCount}
        onOpenCart={() => setIsCartOpen(true)}
        onExploreProducts={scrollToCatalog}
      />

      {/* Main Content */}
      <main id="main-content" className="flex-1 w-full max-w-full relative">
        <MotionConfig reducedMotion="user">
          {/* Sticky Hero Section (Pinned under top navbar while content below slides up over it) */}
          <Hero
            onExploreGifts={scrollToCatalog}
            onExploreBestsellers={scrollToSolutions}
          />

          {/* Overlapping Content Stack - Smoothly slides up and completely covers hero, then normal scroll continues */}
          <div
            id="home-content-stack"
            className="relative z-10 bg-[#092B20] border-t border-[#28513B]/40"
          >
            {/* Master Catalog & 5 Elements Spotlight */}
            <div id="catalog">
              <ProductShowcase
                onAddToCart={addToCart}
                onCustomizeProduct={(product) => router.push(`/elements?box=${product.id}`)}
              />
            </div>

            <RitualAndQuestions onExploreGifts={scrollToCatalog} />

            {/* High-Quality Full Width Combo Pack Banner */}
            <ComboPackBanner />

            {/* Sticky Card Stack Reveal Section */}
            <SolutionsAndTrust
              onAddToCart={addToCart}
              onCustomizeProduct={(product) => router.push(`/elements?box=${product.id}`)}
            />

            {/* 3D Autoplay Carousel Review Section (Positioned directly above Footer) */}
            <ReviewsSection onExploreProducts={scrollToCatalog} />
          </div>
        </MotionConfig>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
