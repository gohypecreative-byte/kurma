"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform, useSpring, useReducedMotion } from "motion/react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { useCart } from "@/lib/cart-context";
import { AnimatedText, AnimatedWords } from "@/components/ui/animated-text";
import { RealisticSmoke } from "@/components/home/realistic-smoke";
import {
  Sun,
  Mountain,
  Droplets,
  Flame,
  Wind,
  Compass,
  ShieldCheck,
  Leaf,
  HeartHandshake,
  ChevronRight,
  ArrowRight,
  Check,
  Award,
  Globe,
  Feather,
} from "lucide-react";

export default function AboutPage() {
  const { cartCount, setIsCartOpen } = useCart();
  const pillarsSectionRef = useRef<HTMLElement>(null);
  const shouldReduceMotion = useReducedMotion();

  const { scrollYProgress: pillarsScrollProgress } = useScroll({
    target: pillarsSectionRef,
    offset: ["start end", "end start"],
  });

  const smoothPillarsProgress = useSpring(pillarsScrollProgress, {
    stiffness: 90,
    damping: 24,
    restDelta: 0.001,
  });

  // Parallax vertical offset for alternating cards on scroll
  const parallaxYEven = useTransform(
    smoothPillarsProgress,
    [0, 1],
    shouldReduceMotion ? [0, 0] : [16, -16]
  );
  const parallaxYOdd = useTransform(
    smoothPillarsProgress,
    [0, 1],
    shouldReduceMotion ? [0, 0] : [-16, 16]
  );
  const parallaxGlowY = useTransform(
    smoothPillarsProgress,
    [0, 1],
    shouldReduceMotion ? [0, 0] : [-35, 35]
  );

  const corePillars = [
    {
      title: "100% Charcoal-Free Purity",
      subtitle: "Clean Smoke • Zero Toxic Binders",
      description:
        "Handcrafted from pure flower powders, natural resins, and therapeutic botanical oils. 100% clean burning with zero toxic charcoal.",
      icon: Leaf,
      highlight: "Lab Certified Non-Toxic",
    },
    {
      title: "Moradabad Solid Brass Guild",
      subtitle: "Century-Old Heritage Metalcraft",
      description:
        "Individually hand-cast in pure solid brass by master metalsmiths in Moradabad, finished with an authentic antique patina.",
      icon: ShieldCheck,
      highlight: "Hand-Cast Brass Heirloom",
    },
    {
      title: "Empowering Women Artisans",
      subtitle: "Mysore Botanical Collectives",
      description:
        "Hand-rolled with sacred devotion by women artisan collectives in Mysore, offering fair living wages and dignified livelihoods.",
      icon: HeartHandshake,
      highlight: "Dignified Fair Livelihoods",
    },
    {
      title: "Pancha Mahabhuta Harmony",
      subtitle: "Vedic Elemental Alchemy",
      description:
        "Ayurvedic formulations designed to restore balance across the five cosmic elements in your daily sanctuary.",
      icon: Sun,
      highlight: "Ayurvedic Formulation",
    },
  ];

  const elementHighlights = [
    {
      id: "earth",
      name: "Prithvi (Earth)",
      desc: "Sacred Khus, Sandalwood & Forest Moss. Grounds restless energy and restores stability.",
      icon: Mountain,
      accent: "border-[#c8b393] bg-[#FAF8F5] text-stone-900",
      tag: "Root Chakra • Muladhara",
      elementColor: "#936329",
      href: "/products/fragrance-earth",
      image: "/images/product/earth-front.png",
    },
    {
      id: "water",
      name: "Jal (Water)",
      desc: "Sacred Blue Lotus, Crisp Rain & Amber. Cleanses emotional fatigue and restores fluidity.",
      icon: Droplets,
      accent: "border-[#bed3e2] bg-[#F4F8FB] text-stone-900",
      tag: "Sacral Chakra • Svadhisthana",
      elementColor: "#226a8d",
      href: "/products/fragrance-water",
      image: "/images/product/water-front.png",
    },
    {
      id: "fire",
      name: "Agni (Fire)",
      desc: "Kashmiri Saffron, Golden Clove & Dammar. Ignites willpower and sharpens mental focus.",
      icon: Flame,
      accent: "border-[#e8c7be] bg-[#FAF5F3] text-stone-900",
      tag: "Solar Plexus • Manipura",
      elementColor: "#b33f1b",
      href: "/products/fragrance-fire",
      image: "/images/product/fire-front.png",
    },
    {
      id: "air",
      name: "Vayu (Air)",
      desc: "Desi Gulab Petals & Alpine Camphor. Opens the heart and uplifts the spirit.",
      icon: Wind,
      accent: "border-[#d0dfd8] bg-[#F5FAF8] text-stone-900",
      tag: "Heart Chakra • Anahata",
      elementColor: "#3e7968",
      href: "/products/fragrance-air",
      image: "/images/product/air-front.png",
    },
    {
      id: "space",
      name: "Akasha (Space)",
      desc: "Wild Assam Oudh, Frankincense & Myrrh. Invites transcendent awareness and stillness.",
      icon: Compass,
      accent: "border-[#d6cde3] bg-[#F8F5FB] text-stone-900",
      tag: "Crown Chakra • Sahasrara",
      elementColor: "#57407a",
      href: "/products/fragrance-space",
      image: "/images/product/space-front.png",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-stone-900 selection:bg-[#eed08e] selection:text-[#1C1B18]">
      {/* Navigation */}
      <Navbar cartCount={cartCount} onOpenCart={() => setIsCartOpen(true)} />

      {/* 1. EDITORIAL LUXURY HERITAGE HERO */}
      <section className="relative w-full min-h-[460px] sm:min-h-[500px] lg:min-h-[540px] lg:h-[64vh] lg:max-h-[600px] bg-[#EDE1D1] border-b border-[#DDD3C2] overflow-hidden flex items-center text-[#1C1B18]">
        {/* Full-Bleed End-to-End Background Image */}
        <div className="absolute inset-0 w-full h-full z-0 pointer-events-none">
          <Image
            src="/images/about/about-hero-banner-new.jpg"
            alt="Kurma 5 Sacred Elements Suite, Handcrafted Solid Brass Turtle Burner and Mysore Sandalwood"
            fill
            priority
            className="object-cover object-right md:object-[center_35%]"
            sizes="100vw"
          />
          {/* Realistic Flowing Sandalwood Smoke Animation */}
          <RealisticSmoke preset="about" />
        </div>

        {/* Content Container - Positioned to the side (left) so it doesn't overlap products */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 py-12 sm:py-16">
          <div className="max-w-md sm:max-w-lg lg:max-w-[480px] xl:max-w-[520px] text-left space-y-4 sm:space-y-5">
            {/* Main Title */}
            <div>
              <AnimatedText delay={0.1} yOffset={20}>
                <h1 className="text-3xl sm:text-4xl lg:text-[44px] xl:text-5xl font-serif font-normal text-[#1C1B18] tracking-tight leading-[1.14]">
                  Scents That Connect Worlds
                </h1>
              </AnimatedText>
            </div>

            {/* Reduced, Impactful Description */}
            <AnimatedText delay={0.25} yOffset={14}>
              <p className="text-xs sm:text-sm md:text-base text-[#1C1B18] leading-relaxed font-sans max-w-md font-normal">
                100% charcoal-free sacred botanical incense, crafted with devotion in Mysore for quiet living and peaceful meditation.
              </p>
            </AnimatedText>

            {/* Action CTA */}
            <div className="pt-2">
              <Link
                href="/shop"
                className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full sm:rounded-xl bg-[#1E1E1C] hover:bg-[#33312D] text-white text-xs font-semibold tracking-wider uppercase shadow-md hover:shadow-lg transition-all active:scale-[0.98] group cursor-pointer"
              >
                <span>Explore Master Shop</span>
                <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* MAIN STORY CONTENT */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20 space-y-16 sm:space-y-24">
        {/* 2. THE COSMIC HERITAGE (Samudra Manthana Narrative) */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
          {/* Left Visual: Curated Master Suite Showcase */}
          <div className="lg:col-span-5 relative">
            <div
              className="relative w-full aspect-[1280/853] rounded-3xl overflow-hidden bg-[#1E1915] border border-stone-200/90 shadow-xl group"
              style={{ aspectRatio: "1280 / 853" }}
            >
              <Image
                src="/images/product/image7.png"
                alt="Kurma 5 Elements Complete Suite"
                fill
                unoptimized
                className="object-contain object-center group-hover:scale-105 transition-transform duration-700"
                sizes="(max-width: 1024px) 100vw, 40vw"
              />
            </div>
          </div>

          {/* Right Narrative */}
          <div className="lg:col-span-7 space-y-5 sm:space-y-6">
            <div className="space-y-2">
              <AnimatedWords
                text="Why Kurma? The Sacred Tortoise Avatar"
                as="h2"
                className="text-2xl sm:text-4xl font-serif text-stone-900 font-normal leading-tight"
              />
            </div>

            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-sans">
              In Vedic cosmology, when the gods and celestial beings churned the cosmic Ocean of Milk (<em className="italic text-stone-800">Samudra Manthana</em>) to retrieve the divine nectar of higher consciousness (<em className="italic text-stone-800">Amrita</em>), the colossal churning mountain Mandara began to sink into the cosmic abyss.
            </p>

            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-sans">
              Lord Vishnu manifested as <strong className="font-semibold text-stone-900">Kurma</strong>—the divine tortoise—plunging into the primal depths to bear the entire cosmos upon His golden shell. From this unshakeable foundation arose the celestial Parijata bloom, sacred resins, and primordial incense that brought stillness to creation.
            </p>
          </div>
        </section>

        {/* 3. THE 4 UNCOMPROMISED CORE PILLARS */}
        <section ref={pillarsSectionRef} className="space-y-10 relative">
          {/* Subtle Parallax Ambient Glow */}
          <motion.div
            style={{ y: parallaxGlowY }}
            className="absolute -top-12 left-1/2 -translate-x-1/2 w-[700px] max-w-full h-[320px] bg-[radial-gradient(ellipse_at_center,rgba(238,208,142,0.2)_0%,transparent_70%)] pointer-events-none blur-3xl -z-10"
          />

          <div className="text-center max-w-2xl mx-auto space-y-2">
            <AnimatedWords
              text="Sacred Purity in Every Thread"
              as="h2"
              className="text-2xl sm:text-4xl font-serif text-stone-900 font-normal justify-center"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-3 xl:gap-5">
            {corePillars.map((pillar, idx) => {
              const Icon = pillar.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 35 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{
                    duration: 0.55,
                    delay: idx * 0.1,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  style={{ y: idx % 2 === 0 ? parallaxYEven : parallaxYOdd }}
                  whileHover={{ y: -6, transition: { duration: 0.2 } }}
                  className="bg-white rounded-3xl border border-stone-200/90 p-5 sm:p-6 lg:px-4 lg:py-5 xl:px-5 xl:py-6 space-y-4 shadow-sm hover:shadow-xl transition-shadow duration-300 flex flex-col justify-between group cursor-default"
                >
                  <div className="space-y-3.5">
                    {/* Compact Icon & Title Row - Guaranteed single-line fit */}
                    <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
                      <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl bg-[#1E1E1C] text-white border border-[#eed08e]/40 flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
                        <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[1.8]" />
                      </div>
                      <h3 className="font-serif text-[13.5px] sm:text-base lg:text-[12px] xl:text-[13.5px] 2xl:text-[15px] font-bold text-stone-900 tracking-tight min-w-0 leading-tight">
                        {pillar.title}
                      </h3>
                    </div>

                    <p className="text-xs text-stone-600 leading-relaxed font-sans">
                      {pillar.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-stone-100 flex items-center gap-1.5 text-[11px] font-semibold text-emerald-800">
                    <Check className="w-3.5 h-3.5 text-emerald-700" />
                    <span>{pillar.highlight}</span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* 4. THE 5 ELEMENTS (Pancha Mahabhuta) SANCTUARY SHOWCASE */}
        <section className="bg-[#EDE1D1] rounded-2xl sm:rounded-3xl border border-[#DDD3C2] p-4 sm:p-8 lg:p-12 shadow-sm space-y-8 sm:space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <AnimatedWords
              text="Harmonizing the Five Cosmic Elements"
              as="h2"
              className="text-2xl sm:text-4xl font-serif text-stone-900 font-normal justify-center"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {elementHighlights.map((el) => (
              <Link
                  key={el.id}
                  href={el.href}
                  className={`rounded-2xl border p-5 flex flex-col justify-between space-y-4 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 group ${el.accent}`}
                >
                  <div className="space-y-3 text-center">
                    {/* Product Image preview */}
                    <div className="relative w-full h-28 my-1">
                      <Image
                        src={el.image}
                        alt={el.name}
                        fill
                        unoptimized
                        className="object-contain filter drop-shadow-md group-hover:scale-105 transition-transform"
                      />
                    </div>

                    <div className="space-y-1">
                      <h3 className="font-serif text-sm sm:text-base font-bold text-stone-900">
                        {el.name}
                      </h3>
                    </div>

                    <p className="text-xs leading-relaxed font-sans text-stone-700">
                      {el.desc}
                    </p>
                  </div>

                  <div className="pt-2 flex items-center justify-center gap-1 text-[11px] font-bold uppercase tracking-wider group-hover:underline">
                    <span>Explore Fragrance</span>
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </Link>
              ))}
          </div>
        </section>

        {/* 6. BESPOKE SANCTUARY & EXECUTIVE GIFT TRUNKS */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center bg-[#EDE1D1] rounded-2xl sm:rounded-3xl border border-[#DDD3C2] p-4 sm:p-8 lg:p-12 shadow-sm">
          {/* Trunk Image */}
          <div
            className="lg:col-span-5 relative w-full aspect-[1280/853] rounded-2xl overflow-hidden bg-white border border-[#DDD3C2] shadow-sm group"
            style={{ aspectRatio: "1280 / 853" }}
          >
            <Image
              src="/images/product/image9.png"
              alt="Kurma Flagship Marble Keepsake Trunk"
              fill
              unoptimized
              className="object-contain object-center group-hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 1024px) 100vw, 40vw"
            />
          </div>

          <div className="lg:col-span-7 space-y-4 sm:space-y-5">

            <AnimatedWords
              text="Heirloom Trunks for Milestone Celebrations"
              as="h2"
              className="text-2xl sm:text-4xl font-serif text-stone-900 font-normal leading-tight"
            />

            <p className="text-xs sm:text-sm text-stone-700 leading-relaxed font-sans">
              From landmark corporate gifting and wedding celebrations to intimate temple consecrations, Kurma creates bespoke keepsake trunks with personalized engraved brass plaques, hand-lettered blessing scrolls, and pure silk tassels.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <Link
                href="/contact"
                className="px-7 py-3 rounded-xl bg-[#1E1E1C] hover:bg-[#33312D] text-white text-xs font-sans font-bold uppercase tracking-wider transition-all shadow-md active:scale-98"
              >
                Request Bespoke Consultation
              </Link>
              <Link
                href="/shop"
                className="px-7 py-3 rounded-xl border border-[#DDD3C2] hover:border-stone-400 bg-white text-stone-800 text-xs font-sans font-bold uppercase tracking-wider transition-all shadow-xs"
              >
                Browse Ready Trunks
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
