"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MotionConfig } from "motion/react";
import { RitualAndQuestions, ScrollProgress } from "@/components/home/experience";
import { Navbar } from "@/components/layout/navbar";
import { Hero } from "@/components/home/hero";
import { PromoBanner } from "@/components/home/promo-banner";
import { ProductShowcase } from "@/components/home/product-showcase";
import { SolutionsAndTrust } from "@/components/home/solutions-and-trust";
import { VideoStories } from "@/components/home/video-stories";
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
    <MotionConfig reducedMotion="user">
    <ScrollProgress />
    <div className="min-h-screen flex flex-col bg-[#072515] bg-[url('/images/textures/green-texture.png')] bg-repeat text-white selection:bg-[#eed08e] selection:text-[#072515]">
      {/* E-Commerce Header with Cart Drawer Trigger */}
      <Navbar
        cartCount={cartCount}
        onOpenCart={() => setIsCartOpen(true)}
        onExploreProducts={scrollToCatalog}
      />

      {/* Main Content */}
      <main id="main-content" className="flex-1">
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
            onCustomizeProduct={(product) => router.push(`/products/${product.id}`)}
          />
        </div>

        {/* Sacred Gifting Stories Video Section with Direct Add to Cart */}
        <VideoStories
          onAddToCart={addToCart}
          onExploreProducts={scrollToCatalog}
        />

        {/* Curated Gifting Suites & Heirloom Trunks */}
        <SolutionsAndTrust
          onAddToCart={addToCart}
          onCustomizeProduct={(product) => router.push(`/products/${product.id}`)}
        />

        <RitualAndQuestions />

        {/* Trust Metrics Bar */}
        <TrustStats />

        {/* Customer Reviews & Promotional Welcome Offer */}
        <ReviewsSection
          onExploreProducts={scrollToCatalog}
        />
      </main>

      {/* Footer */}
      <Footer />
    </div>
    </MotionConfig>
  );
}
