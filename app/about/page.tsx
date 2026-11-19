"use client";

import Image from "next/image";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { useCart } from "@/lib/cart-context";

export default function AboutPage() {
  const { cartCount, setIsCartOpen } = useCart();

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-stone-900 selection:bg-[#eed08e] selection:text-[#1C1B18]">
      {/* Navigation */}
      <Navbar cartCount={cartCount} onOpenCart={() => setIsCartOpen(true)} />

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 py-12 sm:py-16 lg:py-20 space-y-20 sm:space-y-28 lg:space-y-36">
        
        {/* ========================================================================= */}
        {/* 1. TOP HEADER: WELCOME TO KURMA (No Banner Image)                         */}
        {/* ========================================================================= */}
        <section className="text-center max-w-3xl mx-auto space-y-4 pt-2 sm:pt-4">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[56px] font-serif font-normal text-stone-900 tracking-tight leading-[1.12]">
            Welcome to Kurma
          </h1>
          <p className="text-stone-600 text-xs sm:text-sm md:text-base font-sans leading-relaxed max-w-2xl mx-auto font-normal">
            At Kurma, we don&apos;t just craft incense suites — we curate sacred aromatic
            experiences that transform houses into sanctuaries of quiet living and higher consciousness.
          </p>
        </section>

        {/* ========================================================================= */}
        {/* 2. SECTION 1: TIMELESS AESTHETICS & MOSAIC PHOTO COLLAGE                  */}
        {/* ========================================================================= */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 xl:gap-16 items-center">
          {/* Left Column: Narrative */}
          <div className="lg:col-span-5 space-y-4 sm:space-y-5">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-[40px] font-serif font-normal text-stone-900 tracking-tight leading-[1.18]">
              Timeless Aesthetics, Sacred Craftsmanship
            </h2>
            <p className="text-stone-600 text-xs sm:text-sm lg:text-[15px] font-sans leading-relaxed">
              Founded with a deep appreciation for timeless aesthetics and a love for
              authentic Vedic traditions, our mission is simple: to bring you elemental
              aromas that combine purity, architectural grace, and sacred calm in every detail.
            </p>
            <p className="text-stone-600 text-xs sm:text-sm lg:text-[15px] font-sans leading-relaxed">
              Whether you&apos;re creating a quiet morning meditation altar or elevating an entire
              living sanctuary, we&apos;re here to help you express mindful luxury through thoughtfully
              curated incense suites, heirloom brass burners, and bespoke gift trunks.
            </p>
          </div>

          {/* Right Column: Architectural Photo Collage */}
          <div className="lg:col-span-7">
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5 sm:gap-3.5 items-center">
              {/* Column 1 */}
              <div className="relative aspect-[3/5] rounded-2xl overflow-hidden shadow-sm bg-[#EDE1D1]">
                <Image
                  src="/images/product/hamper-wicker-silk.jpg"
                  alt="Kurma Imperial Wicker & Silk Suite"
                  fill
                  className="object-cover object-center hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 640px) 33vw, 20vw"
                />
              </div>

              {/* Column 2 */}
              <div className="relative aspect-[3/4.5] rounded-2xl overflow-hidden shadow-sm bg-[#EDE1D1]">
                <Image
                  src="/images/product/hamper-buddha-wooden.jpg"
                  alt="Kurma Sacred Wooden Suite"
                  fill
                  className="object-cover object-center hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 640px) 33vw, 20vw"
                />
              </div>

              {/* Column 3: Stacked 2 Images */}
              <div className="flex flex-col gap-2.5 sm:gap-3.5">
                <div className="relative aspect-square rounded-2xl overflow-hidden shadow-sm bg-[#EDE1D1]">
                  <Image
                    src="/images/product/turtle-holder-portrait.jpg"
                    alt="Solid Cast Brass Turtle Burner"
                    fill
                    className="object-cover object-center hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 640px) 33vw, 20vw"
                  />
                </div>
                <div className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-sm bg-[#EDE1D1]">
                  <Image
                    src="/images/product/initial-box-suite.jpg"
                    alt="Kurma Heirloom Keepsake Suite"
                    fill
                    className="object-cover object-center hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 640px) 33vw, 20vw"
                  />
                </div>
              </div>

              {/* Column 4 (Visible on sm+) */}
              <div className="hidden sm:block relative aspect-[3/5] rounded-2xl overflow-hidden shadow-sm bg-[#EDE1D1]">
                <Image
                  src="/images/product/hamper-royal-tea.jpg"
                  alt="Kurma Royal Suite"
                  fill
                  className="object-cover object-center hover:scale-105 transition-transform duration-500"
                  sizes="20vw"
                />
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 3. SECTION 2: GREAT DESIGN / SACRED AROMA ACCESSIBLE                      */}
        {/* ========================================================================= */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 xl:gap-16 items-center">
          {/* Left Column: Single Large Aesthetic Showcase Image */}
          <div className="lg:col-span-6">
            <div className="relative w-full aspect-[4/5] max-h-[580px] rounded-3xl overflow-hidden shadow-md bg-[#EDE1D1]">
              <Image
                src="/images/product/initial-box-marble.jpg"
                alt="Kurma Elements in Harmony Luxury Marble Box"
                fill
                priority
                className="object-cover object-center hover:scale-105 transition-transform duration-700"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </div>

          {/* Right Column: Narrative with Highlighted Accent Word */}
          <div className="lg:col-span-6 space-y-4 sm:space-y-6">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-[42px] font-normal text-stone-900 leading-[1.2] tracking-tight">
              We believe that sacred aroma should be{" "}
              <span className="text-[#C5A45B]">accessible</span> to
              every sanctuary.
            </h2>
            <p className="text-stone-600 text-xs sm:text-sm md:text-base font-sans leading-relaxed">
              Our curated selection reflects a harmonious balance of ancient Vedic wisdom and
              timeless contemporary elegance. Whether you&apos;re drawn to minimalist meditation
              aesthetics or prefer rich heirloom keepsakes, our creations fit naturally into
              every room, adding depth, calm, and purpose to your space.
            </p>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 4. SECTION 3: OUR CORE VALUES (3 Stacked Value Cards)                      */}
        {/* ========================================================================= */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 xl:gap-16 items-start">
          {/* Left Column: Heading & Description */}
          <div className="lg:col-span-5 space-y-4 sm:space-y-5 lg:sticky lg:top-28">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-stone-900 font-normal tracking-tight">
              Our Core Values
            </h2>
            <p className="text-stone-600 text-xs sm:text-sm md:text-base font-sans leading-relaxed max-w-md">
              Founded with a deep appreciation for timeless aesthetics and a love for
              mindful living, our mission is simple: to bring you elemental incense suites
              that combine purity, craftsmanship, and serenity in every detail.
            </p>
          </div>

          {/* Right Column: 3 Stacked Soft Value Cards */}
          <div className="lg:col-span-7 space-y-4 sm:space-y-6">
            {/* Card 1: Quality Craftsmanship */}
            <div className="bg-[#F8F5EE] border border-[#EBE3D5] rounded-2xl sm:rounded-3xl p-6 sm:p-8 space-y-3.5 shadow-2xs hover:shadow-xs transition-shadow duration-300">
              <h3 className="font-serif text-lg sm:text-xl font-medium text-stone-900 tracking-tight">
                Quality Craftsmanship
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 font-sans leading-relaxed">
                Each product is made with precision, ensuring it&apos;s both beautiful and durable.
                From Moradabad hand-cast solid brass to Mysore sandalwood forests, every creation
                is made with sacred devotion.
              </p>
            </div>

            {/* Card 2: Sustainability */}
            <div className="bg-[#F8F5EE] border border-[#EBE3D5] rounded-2xl sm:rounded-3xl p-6 sm:p-8 space-y-3.5 shadow-2xs hover:shadow-xs transition-shadow duration-300">
              <h3 className="font-serif text-lg sm:text-xl font-medium text-stone-900 tracking-tight">
                Sustainability
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 font-sans leading-relaxed">
                We are committed to using eco-friendly materials, from responsibly sourced
                wood to recyclable packaging. Our dedication to sustainability means we create
                100% charcoal-free incense with the planet in mind.
              </p>
            </div>

            {/* Card 3: Customer-Centric Approach */}
            <div className="bg-[#F8F5EE] border border-[#EBE3D5] rounded-2xl sm:rounded-3xl p-6 sm:p-8 space-y-3.5 shadow-2xs hover:shadow-xs transition-shadow duration-300">
              <h3 className="font-serif text-lg sm:text-xl font-medium text-stone-900 tracking-tight">
                Customer-Centric Approach
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 font-sans leading-relaxed">
                Your home is a reflection of you, and we strive to make sure that every piece
                from Kurma enhances your lifestyle. From sacred ritual suites to personalized customer
                concierge service, your satisfaction is our priority.
              </p>
            </div>
          </div>
        </section>

      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
