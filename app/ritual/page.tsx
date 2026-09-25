"use client";

import { useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { useCart } from "@/lib/cart-context";
import { Flame, ShieldCheck, Heart, Leaf, ChevronDown, ArrowRight, Droplets } from "lucide-react";

export default function RitualPage() {
  const { cartCount, setIsCartOpen } = useCart();
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const stages = [
    {
      step: "01",
      title: "Prepare Your Sacred Space",
      desc: "Place your solid brass Kurma turtle holder on a stable surface. Ensure the room has gentle air circulation. Take a deep breath to mark the transition from the outer world to your inner sanctuary.",
    },
    {
      step: "02",
      title: "Awaken the Botanical Tip",
      desc: "Light the tip of the incense stick with a matches or candle. Allow the flame to catch for 5 to 10 seconds, then gently waft it out with a wave of your hand. Never blow forcefully on sacred fire.",
    },
    {
      step: "03",
      title: "Place in the Lord Kurma Burner",
      desc: "Insert the stick into the brass turtle’s back at a gentle 45-degree angle. Watch the pristine white botanical smoke curl upward in delicate sacred geometry, carrying natural resins into the room.",
    },
    {
      step: "04",
      title: "Enter Stillness & Contemplation",
      desc: "As the pure botanical aroma fills your sanctuary, sit for meditation, prayer, reading, or quiet breathwork. Let the subtle woods and florals steady your heart and anchor your prana.",
    },
  ];

  const standards = [
    {
      icon: Leaf,
      title: "100% Charcoal-Free",
      desc: "Made without industrial charcoal, synthetic binders, or petroleum fixatives. Burns clean with zero black wall soot.",
    },
    {
      icon: Droplets,
      title: "Pure Temple Resins",
      desc: "Pure Indian Sandalwood, Agarwood, Loban, Guggul, and flower powders ground fresh in heritage artisanal ateliers.",
    },
    {
      icon: ShieldCheck,
      title: "Solid Cast Brass",
      desc: "Heavy, heirloom-grade brass burner hand-finished in Moradabad to endure for generations without fading.",
    },
    {
      icon: Heart,
      title: "Sustained Longevity",
      desc: "Each stick burns evenly for 55 to 65 minutes, leaving a lasting delicate scent that lingers harmoniously for hours.",
    },
  ];

  const faqs = [
    {
      q: "How long does each Kurma incense stick burn?",
      a: "Each handcrafted stick burns steadily for 55 to 65 minutes. Because we use concentrated natural resins rather than powdered charcoal, the aroma diffuses gradually and lingers in the room for several hours after burning.",
    },
    {
      q: "Why is 100% charcoal-free incense healthier for my home?",
      a: "Traditional mass-market incense relies on black charcoal dust and synthetic chemical burning agents, which release soot, benzene, and harsh carbon into your living space. Kurma sticks use natural wood powder and flower extracts, ensuring the smoke is white, pure, and soothing to the respiratory tract.",
    },
    {
      q: "How should I clean and care for the solid brass turtle holder?",
      a: "Simply wipe the brass turtle with a dry, soft cotton cloth after the ash has cooled. Brass naturally develops an authentic antique patina over decades. If you prefer high polish, use natural brass polish or lemon juice and salt.",
    },
    {
      q: "Can I burn different elements at different times of the day?",
      a: "Yes, this is our recommended practice. Earth (Prithvi) is ideal for dawn grounding, Water (Jal) for morning renewal, Air (Vayu) for midday clarity, Fire (Agni) for twilight contemplation, and Space (Akasha) for deep night stillness.",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-stone-900 selection:bg-[#eed08e] selection:text-[#072515]">
      <Navbar cartCount={cartCount} onOpenCart={() => setIsCartOpen(true)} />

      <main className="flex-1 w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 py-10 sm:py-14 space-y-16 sm:space-y-20">
        {/* Editorial Hero */}
        <section className="text-center space-y-4 max-w-3xl mx-auto pt-2">
          <span className="text-xs font-cinzel font-semibold tracking-[0.24em] text-stone-400 uppercase">
            The Sacred Living Philosophy
          </span>
          <h1 className="text-3xl sm:text-5xl font-serif text-stone-900 font-normal tracking-tight">
            The Art of the Sacred Ritual
          </h1>
          <p className="text-sm sm:text-base text-stone-600 font-sans leading-relaxed">
            In our fast-moving world, the ritual of lighting incense is a conscious act of returning to center. A sensory anchor that marks time, purifies prana, and honors the sacred within everyday living.
          </p>
        </section>

        {/* The 4 Stages of the Ritual */}
        <section className="space-y-10">
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-serif text-stone-900 font-normal">
              The Four Stages of Lighting
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 font-sans max-w-md mx-auto">
              Follow this mindful sequence to cultivate serenity and clarity in your home.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {stages.map((stage, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl border border-stone-200/80 p-6 sm:p-7 flex flex-col justify-between space-y-5 shadow-2xs hover:shadow-md transition-shadow"
              >
                <div className="text-3xl sm:text-4xl font-serif font-light text-stone-300">
                  {stage.step}
                </div>
                <div className="space-y-2">
                  <h3 className="font-serif text-base font-semibold text-stone-900">
                    {stage.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-600 font-sans leading-relaxed">
                    {stage.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Botanical Purity Standards */}
        <section className="bg-white rounded-3xl border border-stone-200/80 p-8 sm:p-12 lg:p-16 space-y-10">
          <div className="text-center space-y-2.5 max-w-2xl mx-auto">
            <span className="text-xs font-cinzel font-semibold tracking-widest text-[#9B783E] uppercase">
              Uncompromising Quality
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif text-stone-900 font-normal">
              Our Botanical Purity Oath
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 font-sans leading-relaxed">
              Every stick is hand-rolled by master generational artisans using ethical wild-harvested herbs, rare botanical resins, and zero chemical accelerators.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {standards.map((std, i) => {
              const Icon = std.icon;
              return (
                <div key={i} className="space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-[#072515] text-[#eed08e] flex items-center justify-center">
                    <Icon className="w-5 h-5 stroke-[1.75]" />
                  </div>
                  <h3 className="font-serif text-base font-semibold text-stone-900">
                    {std.title}
                  </h3>
                  <p className="text-xs text-stone-600 font-sans leading-relaxed">
                    {std.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Frequently Asked Questions Accordion */}
        <section className="max-w-3xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-serif text-stone-900 font-normal">
              Ritual Wisdom &amp; Guidance
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 font-sans">
              Frequently asked questions regarding mindful burning, materials, and care.
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="rounded-xl border border-stone-200/80 bg-white overflow-hidden transition-colors"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full text-left p-5 flex items-center justify-between gap-4 font-serif text-sm sm:text-base text-stone-900 hover:text-stone-600 cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={`w-4 h-4 shrink-0 transition-transform duration-200 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 text-xs sm:text-sm text-stone-600 font-sans leading-relaxed border-t border-stone-100 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* Call to Action Bar */}
        <section className="text-center space-y-4 py-8 border-t border-stone-200/80">
          <h3 className="text-xl sm:text-2xl font-serif text-stone-900 font-normal">
            Ready to Begin Your Sacred Ritual?
          </h3>
          <p className="text-xs sm:text-sm text-stone-500 max-w-md mx-auto">
            Explore the 5 Sacred Elements and artisanal solid brass turtle holders.
          </p>
          <div className="pt-2">
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#072515] hover:bg-[#0c3823] text-[#eed08e] text-xs font-cinzel font-semibold uppercase tracking-wider transition-all duration-200 shadow-md cursor-pointer"
            >
              <span>Explore The Collection</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
