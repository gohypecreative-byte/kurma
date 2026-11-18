"use client";

import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { useCart } from "@/lib/cart-context";
import { ShieldCheck, Heart, Leaf, Droplets } from "lucide-react";

export default function RitualPage() {
  const { cartCount, setIsCartOpen } = useCart();

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

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-stone-900 selection:bg-[#eed08e] selection:text-[#1C1B18]">
      <Navbar cartCount={cartCount} onOpenCart={() => setIsCartOpen(true)} />

      <main className="flex-1 w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 py-10 sm:py-14 space-y-16 sm:space-y-20">
        {/* Editorial Hero */}
        <section className="text-center space-y-4 max-w-3xl mx-auto pt-2">
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
            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-medium tracking-tight leading-tight text-stone-900">
              The Four Stages of Lighting
            </h2>
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
        <section className="bg-white rounded-3xl border border-stone-200/80 p-5 sm:p-8 md:p-12 lg:p-16 space-y-10">
          <div className="text-center space-y-2.5 max-w-2xl mx-auto">
            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-medium tracking-tight leading-tight text-stone-900">
              Our Botanical Purity Oath
            </h2>
            <p className="text-xs sm:text-sm lg:text-base text-stone-500 font-sans font-normal tracking-wide leading-relaxed">
              Every stick is hand-rolled by master generational artisans using ethical wild-harvested herbs, rare botanical resins, and zero chemical accelerators.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {standards.map((std, i) => {
              const Icon = std.icon;
              return (
                <div key={i} className="space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-[#1E1E1C] text-white flex items-center justify-center">
                    <Icon className="w-5 h-5 stroke-[1.75]" />
                  </div>
                  <h3 className="font-serif text-base sm:text-lg font-medium text-stone-900 tracking-tight leading-snug">
                    {std.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-600 font-sans font-normal leading-relaxed">
                    {std.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
