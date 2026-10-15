"use client";

import Image from "next/image";
import Link from "next/link";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { useCart } from "@/lib/cart-context";
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

  const corePillars = [
    {
      title: "100% Charcoal-Free Purity",
      subtitle: "Clean Smoke • Zero Toxic Binders",
      description:
        "Conventional incense burns black charcoal and synthetic binders that release harmful benzene. Kurma relies exclusively on pure flower powders, natural plant resins, and therapeutic botanical oils that burn cleanly.",
      icon: Leaf,
      highlight: "Lab Certified Non-Toxic",
    },
    {
      title: "Moradabad Solid Brass Guild",
      subtitle: "Century-Old Heritage Metalcraft",
      description:
        "Every Kurma turtle burner and sacred medallion is individually hand-cast in heavy solid brass by master metalsmiths in Moradabad, honoring generational repoussé techniques and antique patina finishes.",
      icon: ShieldCheck,
      highlight: "Hand-Cast Brass Heirloom",
    },
    {
      title: "Empowering Women Artisans",
      subtitle: "Mysore Botanical Collectives",
      description:
        "Our sacred agarbatti sticks are hand-rolled with devotion by rural women artisan collectives in Mysore, offering fair living wages, healthcare, and dignified spiritual livelihoods that honor tradition.",
      icon: HeartHandshake,
      highlight: "Dignified Fair Livelihoods",
    },
    {
      title: "Pancha Mahabhuta Harmony",
      subtitle: "Vedic Elemental Alchemy",
      description:
        "Carefully formulated by Ayurvedic Vaidyas to restore balance among the five cosmic building blocks—Earth, Water, Fire, Air, and Space—cultivating tranquility and grounded consciousness in your sanctuary.",
      icon: Sun,
      highlight: "Ayurvedic Formulation",
    },
  ];

  const elementHighlights = [
    {
      id: "earth",
      name: "Prithvi (Earth)",
      desc: "Sacred Khus (Vetiver), Sandalwood & Forest Moss. Calms erratic thoughts, grounds restless energy, and restores deep inner stability.",
      icon: Mountain,
      accent: "border-amber-700/25 bg-amber-50/70 text-amber-950",
      tag: "Root Chakra • Muladhara",
      elementColor: "#936329",
      href: "/products/fragrance-earth",
      image: "/images/product/earth-front.png",
    },
    {
      id: "water",
      name: "Jal (Water)",
      desc: "Sacred Blue Lotus, Crisp Rain Accord & Himalayan Amber. Cleanses emotional stagnation, washes away fatigue, and restores fluidity.",
      icon: Droplets,
      accent: "border-sky-700/25 bg-sky-50/70 text-sky-950",
      tag: "Sacral Chakra • Svadhisthana",
      elementColor: "#226a8d",
      href: "/products/fragrance-water",
      image: "/images/product/water-front.png",
    },
    {
      id: "fire",
      name: "Agni (Fire)",
      desc: "Kashmiri Saffron, Golden Clove Bark & Smoked Dammar Resin. Ignites willpower, sharpens mental focus, and dispels lethargy.",
      icon: Flame,
      accent: "border-orange-700/25 bg-orange-50/70 text-orange-950",
      tag: "Solar Plexus • Manipura",
      elementColor: "#b33f1b",
      href: "/products/fragrance-fire",
      image: "/images/product/fire-front.png",
    },
    {
      id: "air",
      name: "Vayu (Air)",
      desc: "Desi Gulab Petals, Mountain Camphor & Alpine Breeze. Opens the heart, uplifts heavy atmospheres, and liberates the breath.",
      icon: Wind,
      accent: "border-teal-700/25 bg-teal-50/70 text-teal-950",
      tag: "Heart Chakra • Anahata",
      elementColor: "#3e7968",
      href: "/products/fragrance-air",
      image: "/images/product/air-front.png",
    },
    {
      id: "space",
      name: "Akasha (Space)",
      desc: "Wild Assam Oudh (Agarwood), Sacred Frankincense & Rare Myrrh. Opens transcendent awareness and invites deep cosmic stillness.",
      icon: Compass,
      accent: "border-purple-700/25 bg-purple-50/70 text-purple-950",
      tag: "Crown Chakra • Sahasrara",
      elementColor: "#57407a",
      href: "/products/fragrance-space",
      image: "/images/product/space-front.png",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-stone-900 selection:bg-[#eed08e] selection:text-[#072515]">
      {/* Navigation */}
      <Navbar cartCount={cartCount} onOpenCart={() => setIsCartOpen(true)} />

      {/* 1. EDITORIAL LUXURY HERITAGE HERO */}
      <section className="w-full bg-[#072515] bg-[radial-gradient(ellipse_at_center,#0b3822_0%,#04160d_100%)] border-b border-[#eed08e]/30 text-white relative overflow-hidden py-10 sm:py-20 lg:py-24">
        {/* Subtle Background Pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(#eed08e_0.75px,transparent_0.75px)] [background-size:24px_24px] opacity-10 pointer-events-none" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-7 text-center relative z-10">
          {/* Brand Seal */}
          <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto relative">
            <Image
              src="/images/brand/kurma-turtle-transparent.png"
              alt="Kurma Turtle Insignia"
              fill
              unoptimized
              priority
              className="object-contain filter drop-shadow-[0_8px_16px_rgba(0,0,0,0.5)]"
            />
          </div>

          {/* Badge */}
          <div className="inline-flex items-center px-4 py-1.5 rounded-full border border-[#eed08e]/50 bg-[#0c3823]/80 text-[#eed08e] text-xs font-serif tracking-widest uppercase">
            <span>The Sacred Legend of Kurma</span>
          </div>

          {/* Main Title */}
          <div className="space-y-2 max-w-4xl mx-auto">
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-light text-white tracking-wide leading-tight">
              Scents That Connect Worlds
            </h1>
            <p className="text-2xl sm:text-3xl lg:text-4xl font-serif italic text-[#eed08e]">
              Pure Fragrance &amp; Higher Consciousness
            </p>
          </div>

          {/* Gold Diamond Accent Line */}
          <div className="flex items-center justify-center gap-3 py-1">
            <div className="h-px w-24 sm:w-36 bg-gradient-to-r from-transparent via-[#eed08e]/70 to-transparent" />
            <div className="w-2.5 h-2.5 rotate-45 border border-[#eed08e] bg-[#072515]" />
            <div className="h-px w-24 sm:w-36 bg-gradient-to-r from-transparent via-[#eed08e]/70 to-transparent" />
          </div>

          <p className="text-xs sm:text-base text-stone-300 leading-relaxed font-sans max-w-2xl mx-auto font-light">
            Kurma was born from an unyielding devotion to restore ancient Vedic purity to modern sanctuaries. In an era of synthetic chemical perfumes and toxic charcoal binders, we chose the uncompromising path of 100% charcoal-free botanical craftsmanship.
          </p>

          {/* Action CTAs */}
          <div className="pt-3 flex flex-wrap items-center justify-center gap-3.5 sm:gap-4">
            <Link
              href="/shop"
              className="px-8 py-3.5 rounded-xl bg-[#eed08e] hover:bg-[#f7e8c4] text-[#072515] text-xs font-sans font-bold uppercase tracking-widest shadow-lg hover:shadow-xl transition-all cursor-pointer active:scale-98"
            >
              Explore Master Shop
            </Link>
            <Link
              href="/elements"
              className="px-8 py-3.5 rounded-xl border border-[#eed08e]/70 hover:border-[#eed08e] bg-white/10 hover:bg-white/15 text-white text-xs font-sans font-bold uppercase tracking-widest transition-all backdrop-blur-sm cursor-pointer"
            >
              5 Elements Suite
            </Link>
          </div>
        </div>
      </section>

      {/* MAIN STORY CONTENT */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20 space-y-16 sm:space-y-24">
        {/* 2. THE COSMIC HERITAGE (Samudra Manthana Narrative) */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
          {/* Left Visual: Curated Master Suite Showcase */}
          <div className="lg:col-span-5 relative">
            <div className="relative aspect-[4/3] sm:aspect-square rounded-3xl overflow-hidden bg-gradient-to-b from-white to-[#FAF8F5] border border-stone-200/90 shadow-xl p-8 flex items-center justify-center group">
              <div className="relative w-full h-full transition-transform duration-700 group-hover:scale-105">
                <Image
                  src="/images/product/suite-clean.png"
                  alt="Kurma 5 Elements Complete Suite"
                  fill
                  unoptimized
                  className="object-contain drop-shadow-2xl"
                  sizes="(max-width: 1024px) 100vw, 40vw"
                />
              </div>

              {/* Float Tag */}
              <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-stone-200 shadow-sm flex items-center justify-between text-xs">
                <span className="font-serif font-bold text-stone-900">
                  The Definitive Suite
                </span>
                <span className="text-[#8b5f10] font-sans font-bold text-[11px] uppercase tracking-wider">
                  135 Sacred Sticks
                </span>
              </div>
            </div>
          </div>

          {/* Right Narrative */}
          <div className="lg:col-span-7 space-y-5 sm:space-y-6">
            <div className="space-y-2">
              <span className="text-[11px] font-sans uppercase tracking-widest text-[#8b5f10] font-bold">
                Cosmic Heritage &amp; Foundation
              </span>
              <h2 className="text-2xl sm:text-4xl font-serif text-stone-900 font-normal leading-tight">
                Why Kurma? The Sacred Tortoise Avatar
              </h2>
            </div>

            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-sans">
              In Vedic cosmology, when the gods and celestial beings churned the cosmic Ocean of Milk (<em className="italic text-stone-800">Samudra Manthana</em>) to retrieve the divine nectar of higher consciousness (<em className="italic text-stone-800">Amrita</em>), the colossal churning mountain Mandara began to sink into the cosmic abyss.
            </p>

            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-sans">
              Lord Vishnu manifested as <strong className="font-semibold text-stone-900">Kurma</strong>—the divine tortoise—plunging into the primal depths to bear the entire cosmos upon His golden shell. From this unshakeable foundation arose the celestial Parijata bloom, sacred resins, and primordial incense that brought stillness to creation.
            </p>

            {/* Sacred Gita Quote Box */}
            <div className="border-l-3 border-[#8b5f10] pl-4 py-3 bg-[#fbf6ea] rounded-r-2xl space-y-1.5 border border-l-0 border-[#eed08e]/50">
              <p className="text-xs sm:text-sm italic text-stone-900 font-serif leading-relaxed">
                &ldquo;Just as the tortoise withdraws its limbs inward into supreme stillness, true sacred incense withdraws the restless senses into peaceful meditation.&rdquo;
              </p>
              <span className="text-[10px] font-sans uppercase tracking-widest text-[#8b5f10] font-bold block">
                — Srimad Bhagavad Gita • Chapter 2, Verse 58
              </span>
            </div>
          </div>
        </section>

        {/* 3. THE 4 UNCOMPROMISED CORE PILLARS */}
        <section className="space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-[11px] font-sans uppercase tracking-widest text-[#8b5f10] font-bold">
              Our Sacred Principles
            </span>
            <h2 className="text-2xl sm:text-4xl font-serif text-stone-900 font-normal">
              Sacred Purity in Every Thread
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 font-sans">
              We reject commercial shortcuts in favor of generational heritage, clean air, and uncompromised spiritual sanctity.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
            {corePillars.map((pillar, idx) => {
              const Icon = pillar.icon;
              return (
                <div
                  key={idx}
                  className="bg-white rounded-3xl border border-stone-200/90 p-6 sm:p-7 space-y-4 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1"
                >
                  <div className="space-y-3.5">
                    {/* Compact Icon & Title Row */}
                    <div className="flex items-center gap-2.5 sm:gap-3">
                      <div className="w-8 h-8 rounded-xl bg-[#072515] text-[#eed08e] border border-[#eed08e]/40 flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
                        <Icon className="w-4 h-4 stroke-[1.8]" />
                      </div>
                      <h3 className="font-serif text-base sm:text-lg font-bold text-stone-900 leading-snug">
                        {pillar.title}
                      </h3>
                    </div>

                    <p className="text-[10.5px] font-sans text-[#8b5f10] font-bold uppercase tracking-wider">
                      {pillar.subtitle}
                    </p>

                    <p className="text-xs text-stone-600 leading-relaxed font-sans">
                      {pillar.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-stone-100 flex items-center gap-1.5 text-[11px] font-semibold text-emerald-800">
                    <Check className="w-3.5 h-3.5 text-emerald-700" />
                    <span>{pillar.highlight}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* 4. THE 5 ELEMENTS (Pancha Mahabhuta) SANCTUARY SHOWCASE */}
        <section className="bg-white rounded-3xl border border-stone-200/90 p-6 sm:p-10 lg:p-12 shadow-sm space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-[11px] font-sans uppercase tracking-widest text-[#8b5f10] font-bold">
              Pancha Mahabhuta Alchemy
            </span>
            <h2 className="text-2xl sm:text-4xl font-serif text-stone-900 font-normal">
              Harmonizing the Five Cosmic Elements
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 font-sans">
              Every Kurma formulation corresponds to one of the five primordial building blocks of human life and sanctuary space.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {elementHighlights.map((el) => {
              const Icon = el.icon;
              return (
                <Link
                  key={el.id}
                  href={el.href}
                  className={`rounded-2xl border p-5 flex flex-col justify-between space-y-4 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 group ${el.accent}`}
                >
                  <div className="space-y-3">
                    {/* Element Icon & Chakra Tag */}
                    <div className="flex items-center justify-between">
                      <div className="w-9 h-9 rounded-xl bg-white shadow-xs flex items-center justify-center text-stone-800">
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="text-[10px] font-sans font-bold uppercase tracking-wider opacity-75">
                        {el.name.split(" ")[0]}
                      </span>
                    </div>

                    {/* Product Image preview */}
                    <div className="relative w-full h-24 my-2">
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
                      <p className="text-[10px] font-sans font-bold uppercase tracking-wider text-stone-500">
                        {el.tag}
                      </p>
                    </div>

                    <p className="text-xs leading-relaxed font-sans text-stone-700">
                      {el.desc}
                    </p>
                  </div>

                  <div className="pt-2 flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider group-hover:underline">
                    <span>Explore Fragrance</span>
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* 5. HEIRLOOM CRAFTSMANSHIP & SOLID BRASS GUILD */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center bg-[#072515] text-white rounded-3xl p-5 sm:p-8 md:p-12 lg:p-16 border border-[#eed08e]/35 relative overflow-hidden">
          {/* Subtle Ambient Radial Lighting */}
          <div className="absolute w-[400px] h-[400px] rounded-full bg-[#eed08e]/10 blur-3xl -top-20 -right-20 pointer-events-none" />

          {/* Left Narrative */}
          <div className="lg:col-span-7 space-y-6 z-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#eed08e]/15 border border-[#eed08e]/40 text-[#eed08e] text-xs font-serif uppercase tracking-widest">
              <Award className="w-3.5 h-3.5" />
              <span>Artisanal Heirloom Burners</span>
            </div>

            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-serif font-light text-white leading-tight">
              Hand-Cast Solid Brass Turtle Burners
            </h2>

            <p className="text-xs sm:text-base text-stone-300 leading-relaxed font-sans max-w-xl">
              Sculpted in pure solid brass by hereditary artisans in Moradabad, each turtle burner features detailed paisley repoussé carvings, an authentic antique hand-buffed patina, and a weighted base that provides sacred stability to your daily rituals.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs text-stone-300 font-sans">
              <div className="flex items-center gap-2 bg-white/10 px-3.5 py-2 rounded-xl backdrop-blur-sm border border-white/10">
                <Check className="w-4 h-4 text-[#eed08e]" />
                <span>Solid Cast Brass</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 px-3.5 py-2 rounded-xl backdrop-blur-sm border border-white/10">
                <Check className="w-4 h-4 text-[#eed08e]" />
                <span>Single-Hole Burner</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 px-3.5 py-2 rounded-xl backdrop-blur-sm border border-white/10">
                <Check className="w-4 h-4 text-[#eed08e]" />
                <span>Antique Patina</span>
              </div>
            </div>

            <div className="pt-2 flex items-center gap-4">
              <Link
                href="/products/turtle-incense-holder"
                className="px-8 py-3.5 bg-[#eed08e] hover:bg-[#f7e8c4] text-[#072515] text-xs font-sans font-bold uppercase tracking-widest rounded-xl transition-all shadow-lg active:scale-98"
              >
                Customise Turtle Burner
              </Link>
            </div>
          </div>

          {/* Right Product Image */}
          <div className="lg:col-span-5 relative w-full h-[300px] sm:h-[400px] flex items-center justify-center z-10">
            <Image
              src="/images/product/turtle-holder-clean.png"
              alt="Handcrafted Solid Brass Turtle Incense Holder"
              fill
              unoptimized
              className="object-contain filter drop-shadow-[0_20px_40px_rgba(0,0,0,0.85)] hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 1024px) 100vw, 40vw"
            />
          </div>
        </section>

        {/* 6. BESPOKE SANCTUARY & EXECUTIVE GIFT TRUNKS */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-[#FAF8F5] rounded-3xl border border-stone-200/90 p-8 sm:p-12 shadow-sm">
          {/* Trunk Image */}
          <div className="lg:col-span-5 relative w-full h-[280px] sm:h-[360px] rounded-2xl overflow-hidden bg-white border border-stone-200 p-6 flex items-center justify-center">
            <Image
              src="/images/product/marble-box-clean.png"
              alt="Kurma Flagship Marble Keepsake Trunk"
              fill
              unoptimized
              className="object-contain hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 1024px) 100vw, 40vw"
            />
          </div>

          <div className="lg:col-span-7 space-y-4 sm:space-y-5">
            <span className="text-[11px] font-sans uppercase tracking-widest text-[#8b5f10] font-bold block">
              Bespoke Sanctuary Privileges
            </span>

            <h2 className="text-2xl sm:text-4xl font-serif text-stone-900 font-normal leading-tight">
              Heirloom Trunks for Milestone Celebrations
            </h2>

            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-sans">
              From landmark corporate gifting and wedding celebrations to intimate temple consecrations, Kurma creates bespoke keepsake trunks with personalized engraved brass plaques, hand-lettered blessing scrolls, and pure silk tassels.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <Link
                href="/contact"
                className="px-7 py-3 rounded-xl bg-[#072515] hover:bg-[#0c3823] text-[#eed08e] text-xs font-sans font-bold uppercase tracking-wider transition-all shadow-md active:scale-98"
              >
                Request Bespoke Consultation
              </Link>
              <Link
                href="/shop"
                className="px-7 py-3 rounded-xl border border-stone-300 hover:border-stone-400 bg-white text-stone-800 text-xs font-sans font-bold uppercase tracking-wider transition-all shadow-xs"
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
