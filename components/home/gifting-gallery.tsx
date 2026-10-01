"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import { Eye, ShoppingBag, Star, Check, X, ArrowRight, Gift, ShieldCheck } from "lucide-react";
import { useCart } from "@/lib/cart-context";

export interface HamperItem {
  id: string;
  skuId: string;
  name: string;
  subtitle: string;
  price: number;
  priceDisplay: string;
  originalPrice?: string;
  category: "all" | "wicker" | "leatherette" | "brass" | "crates";
  tag: string;
  rating: number;
  reviewsCount: number;
  image: string;
  description: string;
  inclusions: string[];
}

export const HAMPER_ITEMS: HamperItem[] = [
  {
    id: "hamper-1",
    skuId: "wicker-silk-incense-basket",
    name: "Imperial Wicker & Silk Fragrance Basket",
    subtitle: "Handwoven wicker basket with silk pouch, Ganesha figurine & trio incense sticks",
    price: 3499,
    priceDisplay: "₹3,499",
    originalPrice: "₹4,299",
    category: "wicker",
    tag: "Handwoven Classic",
    rating: 5.0,
    reviewsCount: 48,
    image: "/images/hampers/hamper-1.jpg",
    description: "An elegant gift presentation featuring a handwoven wicker basket, silk gift pouch with gold tie, handcrafted Ganesha keepsake, and 3 luxury incense stick boxes.",
    inclusions: ["3 Packs Artisanal Incense Sticks", "Handcrafted Silk Gift Pouch", "Brass-plated Ganesha Keepsake", "Handwoven Wicker Basket"]
  },
  {
    id: "hamper-2",
    skuId: "sacred-buddha-wooden-suite",
    name: "Sacred Buddha & Fragrance Wooden Suite",
    subtitle: "Polished hardwood stand, hand-finished Buddha statue & 5-element incense boxes",
    price: 4299,
    priceDisplay: "₹4,299",
    originalPrice: "₹4,999",
    category: "crates",
    tag: "Spiritual Luxury",
    rating: 4.9,
    reviewsCount: 62,
    image: "/images/hampers/hamper-2.jpg",
    description: "Elevate your meditation sanctuary with this serene wooden pedestal set featuring a gold-draped Buddha idol and five elemental incense boxes.",
    inclusions: ["Meditative Buddha Idol", "Polished Hardwood Burner Base", "5 Elemental Incense Suites (135 sticks)", "Kurma Ritual Guide"]
  },
  {
    id: "hamper-3",
    skuId: "royal-tea-incense-leatherette-hamper",
    name: "The Royal Tea & Fragrance Leatherette Hamper",
    subtitle: "Round stitched leatherette tray, designer ceramic mug, organic tea & incense sticks",
    price: 3899,
    priceDisplay: "₹3,899",
    originalPrice: "₹4,500",
    category: "leatherette",
    tag: "Signature Suite",
    rating: 5.0,
    reviewsCount: 39,
    image: "/images/hampers/hamper-3.jpg",
    description: "A thoughtful gift tray for tea lovers and mindfulness seekers, combining a premium ceramic mug, artisanal tin of Hibiscus Tea, and 3 luxury incense stick boxes.",
    inclusions: ["Handcrafted Leatherette Tray", "Artisan Ceramic Mug", "Tin of Organic Hibiscus Tea", "3 Luxury Incense Sticks", "Brass Diya Holder"]
  },
  {
    id: "hamper-4",
    skuId: "heirloom-slatted-wooden-trunk",
    name: "Heirloom Slatted Wooden Chest & Burlap Trunk",
    subtitle: "Lidded wooden chest, natural jute sack & multi-scent incense packs",
    price: 4599,
    priceDisplay: "₹4,599",
    originalPrice: "₹5,200",
    category: "wicker",
    tag: "Heirloom Edition",
    rating: 4.9,
    reviewsCount: 54,
    image: "/images/hampers/hamper-4.jpg",
    description: "Unbox timeless tradition with this vintage wooden slatted chest housing premium incense boxes and a rustic burlap pouch with a handcrafted seal.",
    inclusions: ["Slatted Wooden Chest with Clasp", "Natural Jute Sack with Seal", "3 Incense Suites (81 sticks)", "Brass Turtle Incense Holder"]
  },
  {
    id: "hamper-5",
    skuId: "devotional-brass-puja-tray",
    name: "Devotional Brass Puja & Fragrance Tray",
    subtitle: "Engraved brass thali, twin brass diyas, Ganesha idol & dual incense sticks",
    price: 3299,
    priceDisplay: "₹3,299",
    originalPrice: "₹3,999",
    category: "brass",
    tag: "Ceremonial Suite",
    rating: 5.0,
    reviewsCount: 71,
    image: "/images/hampers/hamper-5.jpg",
    description: "Crafted for festive rituals and daily prayers, this tray includes an engraved brass thali, twin brass oil lamps, a golden Ganesha idol, and fragrant incense packs.",
    inclusions: ["Engraved Brass Puja Thali", "Twin Artisan Brass Diyas", "Solid Brass Ganesha Idol", "2 Premium Incense Stick Boxes"]
  },
  {
    id: "hamper-6",
    skuId: "mindfulness-crystal-sanctuary-crate",
    name: "Mindfulness & Crystal Sanctuary Crate",
    subtitle: "Natural pine wood crate, raw crystals, aromatic incense & brass burner",
    price: 3999,
    priceDisplay: "₹3,999",
    originalPrice: "₹4,699",
    category: "crates",
    tag: "Wellness Gift",
    rating: 4.9,
    reviewsCount: 31,
    image: "/images/hampers/hamper-6.jpg",
    description: "Bring peace and positive energy to any home with this pine crate featuring healing quartz crystals, aromatic incense packs, and sacred cleansing accessories.",
    inclusions: ["Natural Pine Crate", "Healing Crystals & Rose Quartz", "4 Fragrance Incense Packs", "Brass Incense Holder"]
  },
  {
    id: "hamper-7",
    skuId: "festive-lotus-brass-leatherette-tray",
    name: "Festive Lotus Brass & Fragrance Tray",
    subtitle: "Dark leatherette tray, lotus brass candle stands & golden tea canister",
    price: 4799,
    priceDisplay: "₹4,799",
    originalPrice: "₹5,500",
    category: "leatherette",
    tag: "Festive Bestseller",
    rating: 5.0,
    reviewsCount: 89,
    image: "/images/hampers/hamper-7.jpg",
    description: "An opulent arrangement featuring brass lotus candle holders, a golden brass tea tin, engraved thali, and four pastel incense stick boxes.",
    inclusions: ["Stitched Leatherette Tray", "Dual Brass Lotus Diya Holders", "Brass Tea & Spices Canister", "4 Pastel Incense Suites"]
  },
  {
    id: "hamper-8",
    skuId: "celebration-birthday-keepsake-basket",
    name: "Celebration & Birthday Keepsake Basket",
    subtitle: "Wicker basket with 'Happy Birthday' topper, photo frame & fragrance trio",
    price: 2999,
    priceDisplay: "₹2,999",
    originalPrice: "₹3,600",
    category: "wicker",
    tag: "Special Occasion",
    rating: 4.8,
    reviewsCount: 42,
    image: "/images/hampers/hamper-8.jpg",
    description: "Make milestone celebrations unforgettable with this decorative wicker hamper complete with gold cake topper, heart photo frame, and soothing incense sticks.",
    inclusions: ["Handwoven Wicker Basket", "Gold 'Happy Birthday' Topper", "Heart-Shaped Tabletop Frame", "3 Fragrance Suites"]
  },
  {
    id: "hamper-9",
    skuId: "ancient-mantra-wooden-scroll-box",
    name: "Ancient Mantra Wooden Scroll & Mala Box",
    subtitle: "Engraved wooden scroll box with Ganesha emblem, Rudraksha mala & incense",
    price: 5499,
    priceDisplay: "₹5,499",
    originalPrice: "₹6,200",
    category: "crates",
    tag: "Heirloom Edition",
    rating: 5.0,
    reviewsCount: 65,
    image: "/images/hampers/hamper-9.jpg",
    description: "An heirloom treasure box featuring Sanskrit mantra engravings, Ganesha artwork, 108 Rudraksha prayer beads, brass lamp, and 3 fragrance boxes.",
    inclusions: ["Engraved Hardwood Chest", "Sanskrit Mantra Scroll Artwork", "108 Rudraksha Meditation Mala", "3 Incense Suites & Brass Diya"]
  },
  {
    id: "hamper-10",
    skuId: "zen-boat-botanical-gift-set",
    name: "Zen Boat Burner & Botanical Gift Set",
    subtitle: "Sculpted wooden boat holder, dried magnolia bloom & natural incense",
    price: 2799,
    priceDisplay: "₹2,799",
    originalPrice: "₹3,299",
    category: "brass",
    tag: "Minimalist Elegance",
    rating: 4.9,
    reviewsCount: 37,
    image: "/images/hampers/hamper-10.jpg",
    description: "A tranquil arrangement featuring a hand-carved wooden boat burner, preserved lotus/magnolia flower, and organic botanical incense sticks.",
    inclusions: ["Sculpted Wooden Boat Burner", "Preserved Botanical Bloom", "2 Botanical Incense Sticks", "Linen Gift Ribbon"]
  },
  {
    id: "hamper-11",
    skuId: "golden-lotus-saffron-leatherette-suite",
    name: "Golden Lotus & Saffron Fragrance Suite",
    subtitle: "Golden stitched leatherette tray, brass elephant burner & saffron incense",
    price: 4199,
    priceDisplay: "₹4,199",
    originalPrice: "₹4,899",
    category: "leatherette",
    tag: "Artisan Gold",
    rating: 5.0,
    reviewsCount: 51,
    image: "/images/hampers/hamper-11.jpg",
    description: "An opulent gift tray featuring brass lotus candle diyas, a brass elephant burner, and three luxury saffron agarbatti stick boxes.",
    inclusions: ["Stitched Leatherette Gift Tray", "Brass Elephant Incense Burner", "3 Brass Lotus Candle Diyas", "Saffron Fragrance Suite"]
  },
  {
    id: "hamper-12",
    skuId: "vedic-heritage-brass-incense-chest",
    name: "Vedic Heritage Brass & Incense Chest",
    subtitle: "Carved teakwood tray, spherical brass incense urn & oil lamp",
    price: 4899,
    priceDisplay: "₹4,899",
    originalPrice: "₹5,600",
    category: "brass",
    tag: "Heritage Special",
    rating: 4.9,
    reviewsCount: 44,
    image: "/images/hampers/hamper-12.jpg",
    description: "A sacred devotional gift set housed in a carved dark teakwood tray, complete with engraved brass incense urn, traditional brass oil lamp, and sandalwood incense sticks.",
    inclusions: ["Carved Teakwood Serving Tray", "Engraved Brass Incense Urn", "Traditional Brass Oil Lamp", "Mysore Sandalwood Incense Boxes"]
  }
];

export function GiftingGallery() {
  const { addToCart } = useCart();
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [selectedHamper, setSelectedHamper] = useState<HamperItem | null>(null);
  const [addedIds, setAddedIds] = useState<Record<string, boolean>>({});

  const categories = [
    { id: "all", label: "All Hampers", count: HAMPER_ITEMS.length },
    { id: "leatherette", label: "Leatherette Trays", count: HAMPER_ITEMS.filter(i => i.category === "leatherette").length },
    { id: "wicker", label: "Wicker & Burlap", count: HAMPER_ITEMS.filter(i => i.category === "wicker").length },
    { id: "brass", label: "Puja & Brassware", count: HAMPER_ITEMS.filter(i => i.category === "brass").length },
    { id: "crates", label: "Artisan Crates & Chests", count: HAMPER_ITEMS.filter(i => i.category === "crates").length },
  ];

  const filteredItems = activeCategory === "all" 
    ? HAMPER_ITEMS 
    : HAMPER_ITEMS.filter(item => item.category === activeCategory);

  const handleAddToCart = (hamper: HamperItem) => {
    addToCart({
      id: hamper.id,
      skuId: hamper.skuId,
      name: hamper.name,
      price: hamper.price,
      priceDisplay: hamper.priceDisplay,
      image: hamper.image,
      quantity: 1,
    });

    setAddedIds((prev) => ({ ...prev, [hamper.id]: true }));
    setTimeout(() => {
      setAddedIds((prev) => ({ ...prev, [hamper.id]: false }));
    }, 2000);
  };

  return (
    <section id="gifting-gallery" className="bg-[#FAF7F2] py-16 sm:py-20 px-4 sm:px-6 md:px-8 lg:py-24 border-t border-[#EAE3D5] text-[#1C1917] w-full">
      <div className="mx-auto max-w-[1700px] w-full">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-medium tracking-tight text-[#0B2B1B] leading-tight">
            Artisanal Luxury Hampers & Gift Suites
          </h2>

          {/* Filter Tabs - Single Line Layout */}
          <div className="mt-8 flex flex-nowrap items-center justify-center gap-1 sm:gap-2 md:gap-3 lg:gap-4 max-w-full overflow-x-auto scrollbar-none whitespace-nowrap px-2">
            {categories.map((cat) => {
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium transition-all duration-200 cursor-pointer whitespace-nowrap shrink-0 ${
                    isActive
                      ? "bg-[#0B2B1B] text-[#EED08E]"
                      : "text-stone-600 hover:text-[#0B2B1B] hover:bg-stone-200/40"
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Hampers Image Grid - 12 Items with Tighter Gap and Sleek Landscape Rectangular Images */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-3.5 md:gap-4">
          {filteredItems.map((hamper) => (
            <motion.div
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.35 }}
              key={hamper.id}
              onClick={() => setSelectedHamper(hamper)}
              className="group bg-white rounded-2xl overflow-hidden border border-[#EAE3D5] shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between cursor-pointer"
            >
              <div>
                {/* Sleek Wide Landscape Rectangular Image Container (16:10 aspect ratio) */}
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-stone-100">
                  <Image
                    src={hamper.image}
                    alt={hamper.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    priority={false}
                  />
                </div>

                {/* Card Content - ONLY Heading & Price */}
                <div className="p-4 sm:p-5">
                  <h3 className="font-serif text-lg font-medium text-[#0B2B1B] group-hover:text-[#8C6215] transition-colors line-clamp-1">
                    {hamper.name}
                  </h3>

                  <div className="mt-2 flex items-baseline justify-between">
                    <span className="font-serif text-lg font-bold text-[#0B2B1B]">
                      {hamper.priceDisplay}
                    </span>
                    {hamper.originalPrice && (
                      <span className="text-xs text-stone-400 line-through">
                        {hamper.originalPrice}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom Banner */}
        <div className="mt-16 rounded-2xl bg-gradient-to-r from-[#F4EFE6] via-[#FAF7F2] to-[#F4EFE6] p-8 border border-[#E2D6C3] flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-[#0B2B1B] text-[#EED08E] flex items-center justify-center shrink-0 shadow">
              <Gift className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-serif text-xl text-[#0B2B1B] font-medium">Need Custom Corporate or Wedding Hampers?</h4>
              <p className="text-sm text-stone-600 mt-1">We create bespoke bulk gift suites with custom brass plaques, wax seals, and custom fragrance blends.</p>
            </div>
          </div>
          <a
            href="#catalog"
            className="shrink-0 bg-[#0B2B1B] text-[#EED08E] hover:bg-[#16442D] px-6 py-3 rounded-full text-xs font-semibold tracking-wider uppercase flex items-center gap-2 shadow transition-all"
          >
            <span>Inquire Custom Hampers</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>

      {/* Quick View Modal */}
      <AnimatePresence>
        {selectedHamper && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-stone-900/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-white rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl border border-[#E2D6C3] relative flex flex-col md:flex-row max-h-[90vh]"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedHamper(null)}
                className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-white/80 hover:bg-white text-stone-700 flex items-center justify-center shadow transition-all"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Modal Image */}
              <div className="relative w-full md:w-1/2 aspect-square md:aspect-auto bg-stone-100">
                <Image
                  src={selectedHamper.image}
                  alt={selectedHamper.name}
                  fill
                  className="object-cover"
                />
                <div className="absolute top-4 left-4 bg-[#0B2B1B] text-[#EED08E] text-xs font-medium px-3 py-1 rounded-full border border-[#EED08E]/30">
                  {selectedHamper.tag}
                </div>
              </div>

              {/* Modal Details */}
              <div className="p-6 md:p-8 w-full md:w-1/2 flex flex-col justify-between overflow-y-auto">
                <div>
                  <div className="flex items-center gap-2 text-amber-500 text-xs font-medium mb-2">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    <span className="font-semibold text-stone-800">{selectedHamper.rating.toFixed(1)}</span>
                    <span className="text-stone-400">({selectedHamper.reviewsCount} verified reviews)</span>
                  </div>

                  <h3 className="font-serif text-2xl text-[#0B2B1B] font-medium leading-tight">
                    {selectedHamper.name}
                  </h3>

                  <p className="mt-2 text-sm text-stone-600 leading-relaxed">
                    {selectedHamper.description}
                  </p>

                  {/* Included Items Checklist */}
                  <div className="mt-6">
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-[#8C6215] mb-3 flex items-center gap-1.5">
                      <Gift className="w-3.5 h-3.5" />
                      <span>Handcrafted Box Inclusions</span>
                    </h4>
                    <ul className="space-y-2">
                      {selectedHamper.inclusions.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-xs text-stone-700">
                          <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-6 flex items-center gap-3 text-xs text-stone-500 border-t border-stone-100 pt-4">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Free Pan-India Express Shipping & Gift Card Included</span>
                  </div>
                </div>

                {/* Pricing & Cart Action */}
                <div className="mt-8 pt-4 border-t border-stone-100 flex items-center justify-between gap-4">
                  <div>
                    <span className="text-xs text-stone-400 block">Total Suite Price</span>
                    <div className="flex items-baseline gap-2">
                      <span className="font-serif text-2xl font-bold text-[#0B2B1B]">
                        {selectedHamper.priceDisplay}
                      </span>
                      {selectedHamper.originalPrice && (
                        <span className="text-xs text-stone-400 line-through">
                          {selectedHamper.originalPrice}
                        </span>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      handleAddToCart(selectedHamper);
                      setSelectedHamper(null);
                    }}
                    className="flex-1 max-w-[200px] bg-[#0B2B1B] text-[#EED08E] hover:bg-[#16442D] py-3 px-5 rounded-2xl text-xs font-semibold shadow-md transition-all flex items-center justify-center gap-2"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add to Bag</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
