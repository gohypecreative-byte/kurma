"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, useReducedMotion, useScroll, useSpring } from "motion/react";
import { ArrowRight, Plus, Heart, Check } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { GiftingGallery } from "@/components/home/gifting-gallery";

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 160, damping: 35 });
  const reduced = useReducedMotion();
  return (
    <motion.div
      aria-hidden="true"
      className="fixed left-0 top-0 z-[60] h-[3px] w-full origin-left bg-[#c0881b] pointer-events-none"
      style={{ scaleX: reduced ? scrollYProgress : progress }}
    />
  );
}

const BESTSELLER_ITEMS = [
  {
    id: "bestseller-1",
    skuId: "sacred-buddha-wooden-suite",
    name: "Sacred Buddha & Turtle Suite",
    categoryTag: "ALL PRODUCTS",
    shortDesc: "Polished hardwood stand, hand-finished Buddha & brass turtle burner",
    price: 4299,
    priceDisplay: "₹4,299",
    originalPrice: "₹4,999",
    image: "/images/hampers/hamper-2.jpg",
  },
  {
    id: "bestseller-2",
    skuId: "heirloom-slatted-wooden-trunk",
    name: "Heirloom Brass Turtle Trunk",
    categoryTag: "ALL PRODUCTS",
    shortDesc: "Slatted wooden chest, natural jute sack & brass turtle incense stand",
    price: 4599,
    priceDisplay: "₹4,599",
    image: "/images/hampers/hamper-4.jpg",
  },
  {
    id: "bestseller-3",
    skuId: "luxe-beauty-ritual",
    name: "The Luxe Beauty Ritual",
    categoryTag: "ALL PRODUCTS",
    shortDesc: "This blush-toned beauty box is basically luxury wrapped in gold",
    price: 2899,
    priceDisplay: "₹2,899",
    originalPrice: "₹5,699",
    isSale: true,
    image: "/images/hampers/hamper-7.jpg",
  },
  {
    id: "bestseller-4",
    skuId: "vedic-heritage-brass-incense-chest",
    name: "Vedic Heritage Brass Chest",
    categoryTag: "ALL PRODUCTS",
    shortDesc: "Carved teakwood tray, spherical brass incense urn & oil lamp",
    price: 4899,
    priceDisplay: "₹4,899",
    image: "/images/hampers/hamper-12.jpg",
  },
];

const OCCASIONS_ITEMS = [
  {
    id: "occasion-wedding",
    badge: "WEDDING",
    title: "Wedding gifting",
    description: "Return gifts, welcome hampers & bridal squad gifts curated for your big day.",
    tags: ["Return gifts", "Bulk", "Bridal"],
    image: "/images/hampers/hamper-9.jpg",
  },
  {
    id: "occasion-corporate",
    badge: "CORPORATE",
    title: "Corporate gifting",
    description: "Diwali hampers, client gifts & employee appreciation with GST billing.",
    tags: ["Diwali", "Branded", "Bulk"],
    image: "/images/hampers/hamper-3.jpg",
  },
  {
    id: "occasion-custom",
    badge: "CUSTOM",
    title: "Custom & bespoke",
    description: "Pick your basket, fill it your way, or let us design something entirely yours.",
    tags: ["Build yours", "Branded", "Bespoke"],
    image: "/images/hampers/hamper-4.jpg",
  },
  {
    id: "occasion-celebrations",
    badge: "CELEBRATION",
    title: "Celebrations",
    description: "Birthdays, anniversaries, new baby & housewarming gifts that feel the moment.",
    tags: ["Birthday", "Anniversary", "Baby"],
    image: "/images/hampers/hamper-8.jpg",
  },
];

const questions = [
  [
    "What is inside the marble gift trunk?",
    "The Elements in Harmony trunk brings together all five fragrance boxes (135 sticks in total), a solid brass turtle incense stand, a keepsake medallion, a tassel bookmark, and the Kurma ritual guide. You can review the full contents and available extras in the product customizer.",
  ],
  [
    "Can I personalise my gift?",
    "Yes. Select a product and choose its personalisation options before adding it to your bag. Options vary by piece, from a brass plaque or monogram to a gift message, ribbon, or lining. Your selections appear in the cart for review.",
  ],
  [
    "Can I try just one element?",
    "Each element is available individually in a box of 27 incense sticks. Explore Earth, Water, Fire, Air, and Space above, or choose the complete five-element suite to discover the full collection.",
  ],
  [
    "How do I care for the keepsake pieces?",
    "Keep the trunk dry and wipe it gently with a soft cloth. Let the brass holder cool completely before removing ash. Avoid abrasive cleaners, and store unused incense in a cool, dry place away from moisture.",
  ],
];

export function RitualAndQuestions() {
  const [open, setOpen] = useState<number | null>(0);
  const [likedItems, setLikedItems] = useState<Record<string, boolean>>({});
  const [addedIds, setAddedIds] = useState<Record<string, boolean>>({});
  const { addToCart } = useCart();
  const reduced = useReducedMotion();

  const toggleWishlist = (id: string) => {
    setLikedItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleAddToCart = (item: (typeof BESTSELLER_ITEMS)[0]) => {
    addToCart({
      id: item.id,
      skuId: item.skuId,
      name: item.name,
      price: item.price,
      priceDisplay: item.priceDisplay,
      image: item.image,
      quantity: 1,
    });

    setAddedIds((prev) => ({ ...prev, [item.id]: true }));
    setTimeout(() => {
      setAddedIds((prev) => ({ ...prev, [item.id]: false }));
    }, 2000);
  };

  return (
    <>
      {/* 'Our Bestsellers' Section */}
      <section className="bg-[#FAF8F5] py-16 sm:py-20 md:py-24 px-4 sm:px-6 md:px-12 border-t border-[#EAE3D5]">
        <div className="mx-auto max-w-7xl">
          {/* Section Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.2em] text-[#0B2B1B] uppercase mb-2">
              <div className="w-6 h-6 rounded-full bg-[#0B2B1B]/10 p-1 flex items-center justify-center border border-[#8C6215]/30 shadow-xs">
                <Image
                  src="/icon.png"
                  alt="Kurma Emblem"
                  width={16}
                  height={16}
                  className="w-4 h-4 object-contain"
                />
              </div>
              <span>KURMA&apos;S FAVORITES</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-[#0B2B1B] font-medium tracking-tight">
              Our <span className="italic font-serif font-normal text-[#991B1B]">Bestsellers</span>
            </h2>
          </div>

          {/* 4 Card Bestsellers Showcase */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
            {BESTSELLER_ITEMS.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-3xl overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 border border-stone-100/80 flex flex-col justify-between group"
              >
                <div>
                  {/* Full-width Edge-to-Edge Image Box */}
                  <div className="relative aspect-square w-full overflow-hidden bg-stone-100">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    />

                    {/* Wishlist Heart Button */}
                    <button
                      aria-label="Add to wishlist"
                      onClick={() => toggleWishlist(item.id)}
                      className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/95 text-stone-700 hover:text-red-500 hover:bg-white flex items-center justify-center shadow-xs transition-all z-10 cursor-pointer"
                    >
                      <Heart
                        className={`w-4 h-4 ${
                          likedItems[item.id]
                            ? "fill-red-500 text-red-500"
                            : "text-stone-600"
                        }`}
                      />
                    </button>

                    {/* SALE ribbon badge */}
                    {item.isSale && (
                      <div className="absolute top-3 left-3 bg-[#0B2B1B] text-[#EED08E] text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-md shadow-xs z-10">
                        SALE
                      </div>
                    )}
                  </div>

                  {/* Information Below Image */}
                  <div className="p-4 sm:p-5 pb-0">
                    <span className="text-[10px] font-bold tracking-widest uppercase text-[#991B1B] block">
                      {item.categoryTag}
                    </span>
                    <h3 className="font-serif text-base sm:text-lg font-medium text-[#0B2B1B] mt-0.5 line-clamp-1 group-hover:text-[#8C6215] transition-colors">
                      {item.name}
                    </h3>
                    <p className="text-xs text-stone-400 mt-0.5 line-clamp-1 font-light">
                      {item.shortDesc}
                    </p>
                  </div>
                </div>

                {/* Bottom Row: Price + Plus Action */}
                <div className="p-4 sm:p-5 pt-3 mt-2 border-t border-stone-100 flex items-center justify-between">
                  <div className="flex items-baseline gap-1.5">
                    {item.originalPrice && (
                      <span className="text-xs text-stone-400 line-through">
                        {item.originalPrice}
                      </span>
                    )}
                    <span className="font-serif text-base sm:text-lg font-bold text-[#0B2B1B]">
                      {item.priceDisplay}
                    </span>
                  </div>

                  <button
                    aria-label="Add to bag"
                    onClick={() => handleAddToCart(item)}
                    className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#0B2B1B] text-white hover:bg-[#16442D] flex items-center justify-center transition-transform hover:scale-105 active:scale-95 shadow-xs cursor-pointer"
                  >
                    {addedIds[item.id] ? (
                      <Check className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <Plus className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Curated Gifting Galerie Section */}
      <GiftingGallery />

      {/* 'Your gift, your way' Section (Dark Green Background) */}
      <section className="bg-[#061e13] py-20 sm:py-24 px-4 sm:px-6 md:px-12 border-t border-[#eed08e]/20 text-white">
        <div className="mx-auto max-w-5xl">
          {/* Header */}
          <div className="text-center mb-14">
            <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl font-medium tracking-tight text-[#EED08E]">
              Your gift, <span className="italic font-serif font-normal text-white">your way</span>
            </h2>
            <p className="mt-4 text-sm sm:text-base text-stone-300 max-w-xl mx-auto leading-relaxed font-light">
              Whether you want it done for you, built by you, or kept simple — we have a path for every kind of gifter.
            </p>
          </div>

          {/* 3 Horizontal Feature Cards */}
          <div className="space-y-8">
            {/* Card 1: CURATED FOR YOU */}
            <div className="bg-[#FBF8F3] rounded-3xl overflow-hidden shadow-xl border border-white/20 grid grid-cols-1 md:grid-cols-2 text-[#0B2B1B] group">
              <div className="p-8 sm:p-10 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-7 h-7 rounded-full border border-[#0B2B1B]/40 flex items-center justify-center text-xs font-bold text-[#0B2B1B]">
                      1
                    </span>
                    <span className="text-xs font-bold tracking-[0.2em] uppercase text-[#0B2B1B]">
                      CURATED FOR YOU
                    </span>
                  </div>

                  <h3 className="font-serif text-2xl sm:text-3xl font-medium text-[#0B2B1B] mt-2">
                    Shop pre-curated hampers
                  </h3>

                  <p className="text-xs sm:text-sm text-stone-600 mt-3 leading-relaxed">
                    Browse our designer-assembled collections — each hamper is thoughtfully curated for a specific occasion, person, and feeling. Just pick and personalise.
                  </p>
                </div>

                <div className="mt-8">
                  <button
                    onClick={() => {
                      const el = document.getElementById("gifting-gallery");
                      if (el) el.scrollIntoView({ behavior: "smooth" });
                    }}
                    className="bg-[#0B2B1B] text-[#EED08E] hover:bg-[#16442D] px-7 py-3 rounded-xl text-xs font-bold tracking-widest uppercase transition-all shadow-md cursor-pointer inline-flex items-center gap-2"
                  >
                    <span>SHOP NOW</span>
                  </button>
                </div>
              </div>

              {/* Right Image */}
              <div className="relative aspect-[4/3] md:aspect-auto w-full overflow-hidden bg-stone-200">
                <Image
                  src="/images/hampers/hamper-3.jpg"
                  alt="Shop pre-curated hampers"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            </div>

            {/* OR Divider 1 */}
            <div className="relative flex items-center justify-center">
              <div className="w-full border-t border-[#eed08e]/20" />
              <span className="absolute bg-[#061e13] px-4 text-[10px] font-bold tracking-widest text-[#EED08E]/70 uppercase">
                OR
              </span>
            </div>

            {/* Card 2: BUILT BY YOU */}
            <div className="bg-[#EDF3FA] rounded-3xl overflow-hidden shadow-xl border border-white/20 grid grid-cols-1 md:grid-cols-2 text-[#0B2B1B] group">
              <div className="p-8 sm:p-10 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-7 h-7 rounded-full border border-[#0B2B1B]/40 flex items-center justify-center text-xs font-bold text-[#0B2B1B]">
                      2
                    </span>
                    <span className="text-xs font-bold tracking-[0.2em] uppercase text-[#0B2B1B]">
                      BUILT BY YOU
                    </span>
                  </div>

                  <h3 className="font-serif text-2xl sm:text-3xl font-medium text-[#0B2B1B] mt-2">
                    Make your own hamper
                  </h3>

                  <p className="text-xs sm:text-sm text-stone-600 mt-3 leading-relaxed">
                    Browse our designer-assembled collections — each hamper is thoughtfully curated for a specific occasion, person, and feeling. Just pick and personalise.
                  </p>

                  {/* Step Pills */}
                  <div className="mt-5 flex flex-wrap items-center gap-1.5 text-[11px] text-stone-700">
                    <span className="px-3 py-1 bg-white/90 rounded-full border border-stone-200 shadow-2xs font-medium">
                      Pick your tokri
                    </span>
                    <span className="text-stone-400">›</span>
                    <span className="px-3 py-1 bg-white/90 rounded-full border border-stone-200 shadow-2xs font-medium">
                      See capacity
                    </span>
                    <span className="text-stone-400">›</span>
                    <span className="px-3 py-1 bg-white/90 rounded-full border border-stone-200 shadow-2xs font-medium">
                      Add goodies
                    </span>
                    <span className="text-stone-400">›</span>
                    <span className="px-3 py-1 bg-white/90 rounded-full border border-stone-200 shadow-2xs font-medium">
                      Checkout
                    </span>
                  </div>
                </div>

                <div className="mt-8">
                  <button
                    onClick={() => {
                      const el = document.getElementById("gifting-gallery");
                      if (el) el.scrollIntoView({ behavior: "smooth" });
                    }}
                    className="bg-[#0B2B1B] text-[#EED08E] hover:bg-[#16442D] px-7 py-3 rounded-xl text-xs font-bold tracking-widest uppercase transition-all shadow-md cursor-pointer inline-flex items-center gap-2"
                  >
                    <span>START BUILDING</span>
                  </button>
                </div>
              </div>

              {/* Right Image */}
              <div className="relative aspect-[4/3] md:aspect-auto w-full overflow-hidden bg-stone-200">
                <Image
                  src="/images/hampers/hamper-4.jpg"
                  alt="Make your own hamper"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            </div>

            {/* OR Divider 2 */}
            <div className="relative flex items-center justify-center">
              <div className="w-full border-t border-[#eed08e]/20" />
              <span className="absolute bg-[#061e13] px-4 text-[10px] font-bold tracking-widest text-[#EED08E]/70 uppercase">
                OR
              </span>
            </div>

            {/* Card 3: KEEP IT SIMPLE */}
            <div className="bg-[#F8E9EE] rounded-3xl overflow-hidden shadow-xl border border-white/20 grid grid-cols-1 md:grid-cols-2 text-[#0B2B1B] group">
              <div className="p-8 sm:p-10 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-7 h-7 rounded-full border border-[#0B2B1B]/40 flex items-center justify-center text-xs font-bold text-[#0B2B1B]">
                      3
                    </span>
                    <span className="text-xs font-bold tracking-[0.2em] uppercase text-[#0B2B1B]">
                      KEEP IT SIMPLE
                    </span>
                  </div>

                  <h3 className="font-serif text-2xl sm:text-3xl font-medium text-[#0B2B1B] mt-2">
                    Shop individual goodies & decor
                  </h3>

                  <p className="text-xs sm:text-sm text-stone-600 mt-3 leading-relaxed">
                    Not looking for a full hamper? Browse standalone treats, artisan products, and gifting decor — perfect as add-ons or gifts on their own.
                  </p>
                </div>

                <div className="mt-8">
                  <button
                    onClick={() => {
                      const el = document.getElementById("gifting-gallery");
                      if (el) el.scrollIntoView({ behavior: "smooth" });
                    }}
                    className="bg-[#0B2B1B] text-[#EED08E] hover:bg-[#16442D] px-7 py-3 rounded-xl text-xs font-bold tracking-widest uppercase transition-all shadow-md cursor-pointer inline-flex items-center gap-2"
                  >
                    <span>EXPLORE GOODIES</span>
                  </button>
                </div>
              </div>

              {/* Right Image */}
              <div className="relative aspect-[4/3] md:aspect-auto w-full overflow-hidden bg-stone-200">
                <Image
                  src="/images/hampers/hamper-10.jpg"
                  alt="Shop individual goodies & decor"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* NEW SECTION BELOW FAQ: 'What brings you here today?' (THE KURMA'S OCCASION) */}
      <section className="bg-[#FAF7F2] py-20 sm:py-24 px-4 sm:px-6 md:px-12 border-t border-[#EAE3D5]">
        <div className="mx-auto max-w-6xl">
          {/* Header */}
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.25em] text-[#0B2B1B] uppercase mb-2">
              <div className="w-6 h-6 rounded-full bg-[#0B2B1B]/10 p-1 flex items-center justify-center border border-[#8C6215]/30 shadow-xs">
                <Image
                  src="/icon.png"
                  alt="Kurma Emblem"
                  width={16}
                  height={16}
                  className="w-4 h-4 object-contain"
                />
              </div>
              <span>THE KURMA&apos;S OCCASION</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-[#0B2B1B] font-medium tracking-tight">
              What brings you here <span className="italic font-serif font-normal text-[#991B1B]">today</span>?
            </h2>
            <p className="mt-3 text-sm sm:text-base text-stone-600 max-w-xl mx-auto">
              Tell us the occasion — we&apos;ll find you the perfect gift.
            </p>
          </div>

          {/* 2x2 Grid of Occasion Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {OCCASIONS_ITEMS.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-3xl overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 border border-stone-100 flex flex-col justify-between group"
              >
                <div>
                  {/* Aspect 16:9 Landscape Image */}
                  <div className="relative aspect-[16/9] w-full overflow-hidden bg-stone-100">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  </div>

                  {/* Content details */}
                  <div className="p-6 pb-0">
                    <span className="bg-[#EBF3F5] text-[#2C5E69] text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-md inline-block">
                      {item.badge}
                    </span>

                    <h3 className="font-serif text-xl sm:text-2xl font-medium text-[#0B2B1B] mt-3 group-hover:text-[#8C6215] transition-colors">
                      {item.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-stone-600 mt-2 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>

                {/* Footer Pills & Action Button */}
                <div className="p-6 pt-4 mt-4 border-t border-stone-100 flex items-center justify-between gap-3">
                  <div className="flex flex-wrap gap-2">
                    {item.tags.map((tag, i) => (
                      <span
                        key={i}
                        className="border border-stone-200/80 text-stone-600 text-[11px] px-3 py-1 rounded-full bg-stone-50/50"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <button
                    onClick={() => {
                      const el = document.getElementById("gifting-gallery");
                      if (el) {
                        el.scrollIntoView({ behavior: "smooth" });
                      }
                    }}
                    aria-label={`Explore ${item.title}`}
                    className="w-9 h-9 rounded-full bg-stone-100 text-stone-700 group-hover:bg-[#0B2B1B] group-hover:text-[#EED08E] flex items-center justify-center transition-all shadow-xs shrink-0 cursor-pointer"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
