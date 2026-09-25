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
} from "lucide-react";

export default function AboutPage() {
  const { cartCount, setIsCartOpen } = useCart();

  const corePillars = [
    {
      title: "100% Charcoal-Free",
      description:
        "Conventional incense releases toxic benzene and black soot. Kurma burns exclusively pure flower powders, natural plant resins, and therapeutic botanical oils.",
      icon: Leaf,
    },
    {
      title: "Moradabad Brass Legacy",
      description:
        "Every Kurma turtle burner and sacred medallion is individually hand-cast in solid brass by master metalsmiths in Moradabad, honoring century-old foundry craftsmanship.",
      icon: ShieldCheck,
    },
    {
      title: "Women Artisan Guilds",
      description:
        "Our sacred sticks are rolled by women artisan collectives in Mysore, offering fair living wages, healthcare, and dignified sacred livelihoods.",
      icon: HeartHandshake,
    },
    {
      title: "Pancha Mahabhuta Harmony",
      description:
        "Formulated by Ayurvedic Vaidyas to restore balance among the five cosmic elements—Earth, Water, Fire, Air, and Space—within your dwelling.",
      icon: Sun,
    },
  ];

  const elementHighlights = [
    {
      name: "Prithvi (Earth)",
      desc: "Sacred Khus (Vetiver), Sandalwood & Forest Moss. Grounds erratic thoughts and restores deep inner stability.",
      icon: Mountain,
      accent: "border-amber-700/25 bg-amber-50/50 text-amber-900",
      tag: "Root Chakra",
    },
    {
      name: "Jal (Water)",
      desc: "Sacred Blue Lotus, Crisp Rain Accord & Himalayan Amber. Cleanses emotional stagnation and restores creative fluidity.",
      icon: Droplets,
      accent: "border-sky-700/25 bg-sky-50/50 text-sky-900",
      tag: "Sacral Chakra",
    },
    {
      name: "Agni (Fire)",
      desc: "Golden Ceylon Clove, Cassia Bark & Smoked Dammar Resin. Ignites divine courage, clarity, and removes lethargy.",
      icon: Flame,
      accent: "border-orange-700/25 bg-orange-50/50 text-orange-900",
      tag: "Solar Plexus",
    },
    {
      name: "Vayu (Air)",
      desc: "Desi Gulab Petals, Temple Camphor & Morning Dew. Opens the heart, uplifts heavy energy, and liberates the breath.",
      icon: Wind,
      accent: "border-teal-700/25 bg-teal-50/50 text-teal-900",
      tag: "Heart Chakra",
    },
    {
      name: "Akasha (Space)",
      desc: "Wild Assam Oudh (Agarwood), Sacred Loban (Frankincense) & Myrrh. Opens transcendent awareness and cosmic stillness.",
      icon: Compass,
      accent: "border-purple-700/25 bg-purple-50/50 text-purple-900",
      tag: "Crown Chakra",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-stone-900 selection:bg-[#eed08e] selection:text-[#072515]">
      {/* Navbar */}
      <Navbar cartCount={cartCount} onOpenCart={() => setIsCartOpen(true)} />

      <main className="flex-1 w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8 space-y-10 sm:space-y-14">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs font-sans text-stone-400">
          <Link href="/" className="hover:text-stone-800 transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3 h-3 text-stone-300" />
          <span className="text-stone-800 font-medium">About Kurma</span>
        </nav>

        {/* HERO SECTION: The Legend & Ethos (Clean, Simple, Borderless Luxury) */}
        <section className="text-center max-w-3xl mx-auto pt-2 pb-4 sm:pt-6 sm:pb-8 space-y-4 sm:space-y-5">
          <div className="inline-flex items-center px-3.5 py-1 rounded-full bg-[#fbf6ea] border border-[#eed08e]/70 text-[#8b5f10] text-[10.5px] sm:text-xs font-cinzel tracking-widest uppercase font-bold">
            <span>The Legend of Kurma</span>
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-[44px] font-serif font-bold text-stone-900 leading-tight tracking-tight">
            Scents That Connect Worlds.
            <span className="block text-[#8b5f10] font-normal italic text-xl sm:text-3xl lg:text-[34px] mt-1 sm:mt-1.5">
              Pure Fragrance &amp; Higher Consciousness.
            </span>
          </h1>

          {/* Delicate Gold Diamond Divider */}
          <div className="flex items-center justify-center gap-2 py-0.5">
            <div className="h-px w-14 sm:w-20 bg-[#c0881b]/35" />
            <div className="w-2 h-2 rotate-45 border border-[#c0881b] bg-[#fbf6ea]" />
            <div className="h-px w-14 sm:w-20 bg-[#c0881b]/35" />
          </div>

          <p className="text-xs sm:text-base text-stone-600 leading-relaxed font-sans max-w-xl mx-auto px-2">
            Kurma was born from an unyielding devotion to restore ancient Vedic purity to modern sanctuaries. In an era of synthetic fragrances and black charcoal binders, we chose the sacred path of 100% pure botanical craftsmanship.
          </p>

          <div className="pt-1 flex items-center justify-center gap-2.5 sm:gap-3">
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 rounded-lg bg-[#c0881b] hover:bg-[#a97514] text-white text-xs sm:text-sm font-semibold uppercase tracking-wider shadow-sm transition-all active:scale-98 cursor-pointer"
            >
              <span>Explore Creations</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <Link
              href="/elements"
              className="inline-flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 rounded-lg border border-stone-300 bg-white hover:bg-stone-50 text-stone-800 text-xs sm:text-sm font-semibold uppercase tracking-wider transition-colors shadow-2xs cursor-pointer"
            >
              <span>5 Elements Suite</span>
            </Link>
          </div>
        </section>

        {/* SECTION 2: The Cosmic Origin (Samudra Manthana) */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          <div className="lg:col-span-5 relative aspect-square sm:aspect-[4/3] lg:aspect-square rounded-2xl overflow-hidden bg-white border border-stone-200/80 shadow-xs p-6 sm:p-8 flex items-center justify-center">
            <div className="relative w-full h-full">
              <Image
                src="/images/product/suite-clean.png"
                alt="Kurma Sacred Suite"
                fill
                className="object-contain drop-shadow-md"
              />
            </div>
          </div>

          <div className="lg:col-span-7 space-y-4 sm:space-y-5">
            <div className="space-y-1.5">
              <span className="text-[11px] font-cinzel uppercase tracking-widest text-[#8b5f10] font-bold">
                Cosmic Heritage
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif text-stone-900 font-normal">
                Why Kurma? The Great Cosmic Anchor
              </h2>
            </div>

            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-sans">
              In Vedic cosmology, when the gods and demons churned the great Ocean of Milk (*Samudra Manthana*) to extract the nectar of eternal life (*Amrita*), the great mountain Mandara began to sink into the cosmic abyss.
            </p>

            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-sans">
              Lord Vishnu assumed the sacred form of **Kurma**—the divine tortoise—diving to the ocean floor to sustain the universe upon His golden shell. From this serene foundation arose the sacred Parijata tree, celestial botanicals, and divine fragrances that brought harmony back to cosmos.
            </p>

            <div className="border-l-2 border-[#c0881b] pl-3.5 py-2 space-y-1 bg-[#fbf6ea]/70 rounded-r-lg">
              <p className="text-xs italic text-stone-800 font-serif leading-relaxed">
                &quot;Just as the tortoise withdraws its limbs inward into supreme stillness, true sacred incense withdraws the restless senses into deep, peaceful meditation.&quot;
              </p>
              <span className="text-[10px] uppercase font-cinzel text-stone-500 block">
                — Bhagavad Gita, Chapter 2, Verse 58
              </span>
            </div>
          </div>
        </section>

        {/* SECTION 3: The 4 Core Pillars */}
        <section className="space-y-6 sm:space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-1.5">
            <span className="text-[11px] font-cinzel uppercase tracking-widest text-[#8b5f10] font-bold">
              Our Uncompromised Principles
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif text-stone-900 font-normal">
              Sacred Purity In Every Thread
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 font-sans">
              We reject harmful commercial shortcuts in favor of generational heritage, clean air, and spiritual sanctity.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {corePillars.map((pillar, idx) => {
              const Icon = pillar.icon;
              return (
                <div
                  key={idx}
                  className="bg-white rounded-xl border border-stone-200/80 p-5 sm:p-6 space-y-3 shadow-2xs hover:shadow-sm transition-shadow"
                >
                  <div className="w-9 h-9 rounded-lg bg-[#fbf6ea] border border-[#eed08e]/70 text-[#c0881b] flex items-center justify-center shadow-2xs">
                    <Icon className="w-4 h-4" />
                  </div>
                  <h3 className="font-serif text-sm sm:text-base font-semibold text-stone-900">
                    {pillar.title}
                  </h3>
                  <p className="text-xs text-stone-600 leading-relaxed font-sans">
                    {pillar.description}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* SECTION 4: The 5 Elements Essence Chart */}
        <section className="space-y-6 sm:space-y-8 bg-white rounded-2xl border border-stone-200/80 p-6 sm:p-10 shadow-2xs">
          <div className="text-center max-w-2xl mx-auto space-y-1.5">
            <span className="text-[11px] font-cinzel uppercase tracking-widest text-[#8b5f10] font-bold">
              Pancha Mahabhuta
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif text-stone-900 font-normal">
              Harmonizing the Five Cosmic Elements
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 font-sans">
              Every Kurma fragrance formulation corresponds to one of the five primordial building blocks of human life and space.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 sm:gap-4">
            {elementHighlights.map((el) => {
              const Icon = el.icon;
              return (
                <div
                  key={el.name}
                  className={`rounded-xl border p-4 sm:p-5 flex flex-col justify-between space-y-3 ${el.accent}`}
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <div className="w-7 h-7 rounded-full bg-white/90 flex items-center justify-center shadow-2xs">
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-[9px] uppercase font-cinzel tracking-wider font-bold opacity-75">
                        {el.tag}
                      </span>
                    </div>

                    <h3 className="font-serif text-sm font-bold">
                      {el.name}
                    </h3>

                    <p className="text-xs leading-relaxed opacity-90 font-sans">
                      {el.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* SECTION 5: Sustainable Luxury & Corporate Privilege */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 items-center bg-[#f3f6ef] rounded-2xl border border-[#e2e8dc] p-6 sm:p-10 shadow-2xs">
          <div className="space-y-4">
            <div className="space-y-1.5">
              <span className="text-[10.5px] sm:text-xs font-cinzel uppercase tracking-[0.2em] text-[#8b5f10] font-bold block">
                Bespoke Sanctuary &amp; Gifting
              </span>
              <h2 className="text-xl sm:text-3xl font-serif font-bold text-stone-900 leading-tight">
                Heirloom Trunks for Modern Celebrations
              </h2>
            </div>

            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-sans">
              From landmark corporate milestones and grand festive gifting to intimate temple sanctifications, Kurma curates deeply personalized heirloom trunks with debossed family monograms, engraved brass plaques, and pure silk tassels.
            </p>

            {/* Luxury Micro-Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 text-[11px] text-stone-700">
              <div className="flex items-center gap-1.5 bg-white/80 border border-stone-200/80 px-2.5 py-1.5 rounded-lg shadow-2xs">
                <ShieldCheck className="w-3.5 h-3.5 text-[#c0881b] shrink-0" />
                <span className="font-medium">Brass Plaque Engraving</span>
              </div>
              <div className="flex items-center gap-1.5 bg-white/80 border border-stone-200/80 px-2.5 py-1.5 rounded-lg shadow-2xs">
                <ShieldCheck className="w-3.5 h-3.5 text-[#c0881b] shrink-0" />
                <span className="font-medium">Gold Debossed Sleeves</span>
              </div>
              <div className="flex items-center gap-1.5 bg-white/80 border border-stone-200/80 px-2.5 py-1.5 rounded-lg shadow-2xs">
                <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span className="font-medium">Pan-India Dispatch</span>
              </div>
            </div>

            <div className="pt-2">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#c0881b] hover:bg-[#a97514] text-white text-xs sm:text-sm font-semibold uppercase tracking-wider shadow-sm transition-all active:scale-98 cursor-pointer"
              >
                <span>Inquire for Bespoke Trunks</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Luxury Full-Bleed Image Showcase */}
          <div className="relative aspect-[16/11] sm:aspect-[4/3] rounded-xl overflow-hidden shadow-xs border border-stone-200/80 group">
            <Image
              src="/images/product/image9.png"
              alt="Kurma Flagship Green Marble Gift Trunk"
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-[11px] font-medium backdrop-blur-xs bg-black/40 px-3 py-1.5 rounded-lg border border-white/20">
              <span className="font-serif">Flagship Green Marble Trunk</span>
              <span className="text-[#eed08e] font-cinzel font-bold text-[10px] tracking-wider uppercase">
                Vedic Heirloom
              </span>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
