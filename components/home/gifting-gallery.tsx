"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { Eye, ShoppingBag, Star, Check, X, ArrowRight, Gift, ShieldCheck, Bookmark, SlidersHorizontal, Plus, ChevronLeft, ChevronRight } from "lucide-react";
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
    subtitle: "Handwoven wicker basket with silk pouch, Ganesha medallion & trio agarbatti sticks",
    price: 3499,
    priceDisplay: "₹3,499",
    originalPrice: "₹4,299",
    category: "wicker",
    tag: "Handwoven Classic",
    rating: 5.0,
    reviewsCount: 48,
    image: "/images/product/image7.png",
    description: "An elegant gift presentation featuring a handwoven wicker basket, silk gift pouch with gold tie, handcrafted Ganesha medallion, and 3 luxury agarbatti stick boxes.",
    inclusions: ["3 Packs Artisanal Agarbatti Sticks", "Handcrafted Silk Gift Pouch", "Brass-plated Ganesha Keepsake", "Handwoven Wicker Basket"]
  },
  {
    id: "hamper-2",
    skuId: "sacred-buddha-wooden-suite",
    name: "Sacred Buddha & Fragrance Wooden Suite",
    subtitle: "Polished hardwood stand, hand-finished Buddha statue & 5-element agarbatti boxes",
    price: 4299,
    priceDisplay: "₹4,299",
    originalPrice: "₹4,999",
    category: "crates",
    tag: "Spiritual Luxury",
    rating: 4.9,
    reviewsCount: 62,
    image: "/images/product/earth-front.png",
    description: "Elevate your meditation sanctuary with this serene wooden pedestal set featuring a gold-draped Buddha idol and five elemental agarbatti boxes.",
    inclusions: ["Meditative Buddha Idol", "Polished Hardwood Burner Base", "5 Elemental Agarbatti Suites (135 sticks)", "Kurma Ritual Guide"]
  },
  {
    id: "hamper-3",
    skuId: "royal-tea-incense-leatherette-hamper",
    name: "The Royal Tea & Fragrance Leatherette Hamper",
    subtitle: "Round stitched leatherette tray, designer ceramic cup, organic tea & agarbatti sticks",
    price: 3899,
    priceDisplay: "₹3,899",
    originalPrice: "₹4,500",
    category: "leatherette",
    tag: "Signature Suite",
    rating: 5.0,
    reviewsCount: 39,
    image: "/images/product/fire-front.png",
    description: "A thoughtful gift tray for tea lovers and mindfulness seekers, combining a premium ceramic cup, artisanal tin of Hibiscus Tea, and 3 luxury agarbatti stick boxes.",
    inclusions: ["Handcrafted Leatherette Tray", "Artisan Ceramic Cup", "Tin of Organic Hibiscus Tea", "3 Luxury Agarbatti Suites", "Brass Diya Holder"]
  },
  {
    id: "hamper-4",
    skuId: "heirloom-slatted-wooden-trunk",
    name: "Heirloom Slatted Wooden Chest & Burlap Trunk",
    subtitle: "Lidded wooden chest, natural jute sack & multi-scent agarbatti packs",
    price: 4599,
    priceDisplay: "₹4,599",
    originalPrice: "₹5,200",
    category: "wicker",
    tag: "Heirloom Edition",
    rating: 4.9,
    reviewsCount: 54,
    image: "/images/product/water-front.png",
    description: "Unbox timeless tradition with this vintage wooden slatted chest housing premium agarbatti boxes and a rustic burlap pouch with a handcrafted seal.",
    inclusions: ["Slatted Wooden Chest with Clasp", "Natural Jute Sack with Seal", "3 Agarbatti Suites (81 sticks)", "Brass Turtle Incense Holder"]
  },
  {
    id: "hamper-5",
    skuId: "devotional-brass-puja-tray",
    name: "Devotional Brass Puja & Fragrance Tray",
    subtitle: "Engraved brass thali, twin brass diyas, Ganesha idol & dual agarbatti suites",
    price: 3299,
    priceDisplay: "₹3,299",
    originalPrice: "₹3,999",
    category: "brass",
    tag: "Ceremonial Suite",
    rating: 5.0,
    reviewsCount: 71,
    image: "/images/product/air-front.png",
    description: "Crafted for festive rituals and daily prayers, this tray includes an engraved brass thali, twin brass oil lamps, a golden Ganesha idol, and fragrant agarbatti packs.",
    inclusions: ["Engraved Brass Puja Thali", "Twin Artisan Brass Diyas", "Solid Brass Ganesha Idol", "2 Premium Agarbatti Stick Boxes"]
  },
  {
    id: "hamper-6",
    skuId: "mindfulness-crystal-sanctuary-crate",
    name: "Mindfulness & Crystal Sanctuary Crate",
    subtitle: "Natural pine wood crate, raw crystals, aromatic agarbatti & brass turtle burner",
    price: 3999,
    priceDisplay: "₹3,999",
    originalPrice: "₹4,699",
    category: "crates",
    tag: "Wellness Gift",
    rating: 4.9,
    reviewsCount: 31,
    image: "/images/product/space-front.png",
    description: "Bring peace and positive energy to any home with this pine crate featuring healing quartz crystals, aromatic agarbatti packs, and sacred cleansing accessories.",
    inclusions: ["Natural Pine Crate", "Healing Crystals & Rose Quartz", "4 Fragrance Agarbatti Packs", "Brass Incense Holder"]
  },
  {
    id: "hamper-7",
    skuId: "festive-lotus-brass-leatherette-tray",
    name: "Festive Lotus Brass & Fragrance Tray",
    subtitle: "Dark leatherette tray, lotus brass candle stands & golden agarbatti canister",
    price: 4799,
    priceDisplay: "₹4,799",
    originalPrice: "₹5,500",
    category: "leatherette",
    tag: "Festive Bestseller",
    rating: 5.0,
    reviewsCount: 89,
    image: "/images/product/image8.png",
    description: "An opulent arrangement featuring brass lotus candle holders, a golden brass tea tin, engraved thali, and four elemental agarbatti stick boxes.",
    inclusions: ["Stitched Leatherette Tray", "Dual Brass Lotus Diya Holders", "Brass Agarbatti Canister", "4 Elemental Agarbatti Suites"]
  },
  {
    id: "hamper-8",
    skuId: "celebration-keepsake-basket",
    name: "Milestone Celebration Sacred Fragrance Basket",
    subtitle: "Wicker tray with solid brass turtle burner, silk pouch & fragrance trio",
    price: 2999,
    priceDisplay: "₹2,999",
    originalPrice: "₹3,600",
    category: "wicker",
    tag: "Special Occasion",
    rating: 4.8,
    reviewsCount: 42,
    image: "/images/product/image9.png",
    description: "Make milestone celebrations unforgettable with this decorative wicker hamper complete with a solid brass turtle burner, silk gift pouch, and soothing agarbatti suites.",
    inclusions: ["Handwoven Wicker Tray", "Solid Brass Turtle Holder", "Handcrafted Silk Gift Pouch", "3 Fragrance Agarbatti Suites"]
  },
  {
    id: "hamper-9",
    skuId: "ancient-mantra-wooden-scroll-box",
    name: "Ancient Mantra Wooden Scroll & Mala Box",
    subtitle: "Engraved wooden scroll box with Ganesha emblem, Rudraksha mala & agarbatti",
    price: 5499,
    priceDisplay: "₹5,499",
    originalPrice: "₹6,200",
    category: "crates",
    tag: "Heirloom Edition",
    rating: 5.0,
    reviewsCount: 65,
    image: "/images/product/image1.png",
    description: "An heirloom treasure box featuring Sanskrit mantra engravings, Ganesha artwork, 108 Rudraksha prayer beads, brass lamp, and 3 agarbatti suites.",
    inclusions: ["Engraved Hardwood Chest", "Sanskrit Mantra Scroll Artwork", "108 Rudraksha Meditation Mala", "3 Agarbatti Suites & Brass Diya"]
  },
  {
    id: "hamper-10",
    skuId: "zen-boat-botanical-gift-set",
    name: "Zen Boat Burner & Botanical Gift Set",
    subtitle: "Sculpted wooden boat holder, dried magnolia bloom & natural agarbatti",
    price: 2799,
    priceDisplay: "₹2,799",
    originalPrice: "₹3,299",
    category: "brass",
    tag: "Minimalist Elegance",
    rating: 4.9,
    reviewsCount: 37,
    image: "/images/product/image2.png",
    description: "A tranquil arrangement featuring a hand-carved wooden boat burner, preserved lotus/magnolia flower, and organic botanical agarbatti sticks.",
    inclusions: ["Sculpted Wooden Boat Burner", "Preserved Botanical Bloom", "2 Botanical Agarbatti Suites", "Linen Gift Ribbon"]
  },
  {
    id: "hamper-11",
    skuId: "golden-lotus-saffron-leatherette-suite",
    name: "Golden Lotus & Saffron Fragrance Suite",
    subtitle: "Golden stitched leatherette tray, brass elephant burner & saffron agarbatti",
    price: 4199,
    priceDisplay: "₹4,199",
    originalPrice: "₹4,899",
    category: "leatherette",
    tag: "Artisan Gold",
    rating: 5.0,
    reviewsCount: 51,
    image: "/images/product/image3.png",
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
    image: "/images/product/image4.png",
    description: "A sacred devotional gift set housed in a carved dark teakwood tray, complete with engraved brass incense urn, traditional brass oil lamp, and sandalwood agarbatti boxes.",
    inclusions: ["Carved Teakwood Serving Tray", "Engraved Brass Incense Urn", "Traditional Brass Oil Lamp", "Mysore Sandalwood Agarbatti Boxes"]
  }
];

interface HamperCardItemProps {
  hamper: HamperItem;
  likedIds: Record<string, boolean>;
  addedIds: Record<string, boolean>;
  toggleWishlist: (id: string) => void;
  setSelectedHamper: (hamper: HamperItem) => void;
  handleAddToCart: (hamper: HamperItem) => void;
}

function HamperCardItem({
  hamper,
  likedIds,
  addedIds,
  toggleWishlist,
  setSelectedHamper,
  handleAddToCart,
}: HamperCardItemProps) {
  const router = useRouter();
  const [activeIdx, setActiveIdx] = useState(0);

  // Combine primary image with secondary Kurma images for carousel
  const images = useMemo(() => {
    const galleryList = [
      hamper.image,
      "/images/product/image7.png",
      "/images/product/image8.png",
      "/images/product/image9.png",
    ];
    return Array.from(new Set(galleryList));
  }, [hamper.image]);

  const currentDisplayImg = images[activeIdx] || hamper.image;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.35 }}
      onClick={() => setSelectedHamper(hamper)}
      className="group bg-white rounded-2xl overflow-hidden border border-[#EAE3D5] shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between cursor-pointer select-none relative"
    >
      <div>
        {/* Vertical Portrait Image Canvas (Aspect 3:4) with object-contain */}
        <div className="relative aspect-[3/4] w-full overflow-hidden rounded-t-2xl bg-[#f5f3ec] flex items-center justify-center p-2 sm:p-3">
          <Image
            src={currentDisplayImg}
            alt={hamper.name}
            fill
            unoptimized
            className="absolute inset-0 w-full h-full object-contain object-center p-2 sm:p-3 group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />

          {/* Bookmark Wishlist Icon Top-Right */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleWishlist(hamper.id);
            }}
            aria-label="Save to Wishlist"
            className="absolute top-3 right-3 z-10 p-1 text-stone-700 hover:text-stone-900 drop-shadow-sm transition-transform active:scale-90 hover:scale-110 cursor-pointer"
          >
            <Bookmark
              className={`w-4 h-4 transition-colors ${
                likedIds[hamper.id]
                  ? "fill-stone-800 text-stone-800 stroke-[2]"
                  : "fill-transparent text-stone-700 stroke-[2]"
              }`}
            />
          </button>

          {/* Left & Right Hover Navigation Buttons */}
          {images.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveIdx((prev) => (prev - 1 + images.length) % images.length);
                }}
                title="Previous image"
                aria-label="Previous image"
                className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 backdrop-blur-xs z-20 cursor-pointer shadow-md"
              >
                <ChevronLeft className="w-4 h-4 stroke-[2.2]" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveIdx((prev) => (prev + 1) % images.length);
                }}
                title="Next image"
                aria-label="Next image"
                className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 backdrop-blur-xs z-20 cursor-pointer shadow-md"
              >
                <ChevronRight className="w-4 h-4 stroke-[2.2]" />
              </button>
            </>
          )}

          {/* Slide Indicator Dots at Bottom Center */}
          {images.length > 1 && (
            <div className="absolute bottom-2.5 inset-x-0 flex items-center justify-center gap-1.5 z-10 pointer-events-none">
              {images.map((_, idx) => (
                <span
                  key={idx}
                  className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                    idx === activeIdx
                      ? "bg-stone-800 scale-125 shadow-xs"
                      : "bg-stone-400/50"
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Card Info Below Image */}
        <div className="p-3.5 sm:p-4 flex items-start justify-between gap-2">
          <div className="space-y-1 min-w-0 flex-1">
            <h3 className="font-serif text-xs sm:text-[13.5px] font-medium text-[#0B2B1B] group-hover:text-[#8C6215] transition-colors truncate">
              {hamper.name}
            </h3>
            <div className="flex items-center gap-1.5">
              <span className="text-xs sm:text-[12.5px] font-medium text-[#0B2B1B]">
                RS. {hamper.price.toLocaleString("en-IN")}
              </span>
              {hamper.originalPrice && (
                <span className="text-[11px] text-stone-400 line-through">
                  {hamper.originalPrice}
                </span>
              )}
            </div>
          </div>

          {/* Quick Action Icons */}
          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={(e) => {
                e.stopPropagation();
                router.push(`/elements?box=${hamper.skuId || hamper.id}`);
              }}
              className="p-1 text-[#c0881b] hover:text-stone-900 transition-colors cursor-pointer"
              title="Customise this hamper"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 stroke-[1.8]" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleAddToCart(hamper);
              }}
              className="p-1 text-stone-700 hover:text-black transition-colors cursor-pointer"
              title="Add to Cart"
            >
              {addedIds[hamper.id] ? (
                <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[2.5]" />
              ) : (
                <Plus className="w-3.5 h-3.5 stroke-[1.8]" />
              )}
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function GiftingGallery() {
  const router = useRouter();
  const { addToCart } = useCart();
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [selectedHamper, setSelectedHamper] = useState<HamperItem | null>(null);
  const [addedIds, setAddedIds] = useState<Record<string, boolean>>({});
  const [likedIds, setLikedIds] = useState<Record<string, boolean>>({});

  const toggleWishlist = (id: string) => {
    setLikedIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

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

          {/* Filter Tabs - Single Line Fixed (No Scroll, No Wrap, No Background Box) */}
          <div className="mt-8 flex flex-nowrap items-center justify-center gap-2 sm:gap-4 md:gap-6 lg:gap-8 max-w-full overflow-hidden whitespace-nowrap px-1 sm:px-2 mx-auto border-b border-stone-200/60 pb-1">
            {categories.map((cat) => {
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-1 sm:px-2 py-2 text-[12px] sm:text-xs md:text-sm transition-all duration-200 cursor-pointer whitespace-nowrap shrink-0 ${
                    isActive
                      ? "text-[#0B2B1B] font-bold border-b-2 border-[#0B2B1B]"
                      : "text-stone-500 hover:text-[#0B2B1B] font-medium"
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Hampers Image Grid - 12 Items with Hover Left/Right Navigation Arrows */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
          {filteredItems.map((hamper) => (
            <HamperCardItem
              key={hamper.id}
              hamper={hamper}
              likedIds={likedIds}
              addedIds={addedIds}
              toggleWishlist={toggleWishlist}
              setSelectedHamper={setSelectedHamper}
              handleAddToCart={handleAddToCart}
            />
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

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        const targetId = selectedHamper.skuId || selectedHamper.id;
                        setSelectedHamper(null);
                        router.push(`/elements?box=${targetId}`);
                      }}
                      className="bg-stone-100 hover:bg-stone-200 text-stone-800 py-3 px-4 rounded-2xl text-xs font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                      title="Customise this hamper"
                    >
                      <SlidersHorizontal className="w-3.5 h-3.5 text-[#c0881b]" />
                      <span>Customise</span>
                    </button>

                    <button
                      onClick={() => {
                        handleAddToCart(selectedHamper);
                        setSelectedHamper(null);
                      }}
                      className="bg-[#0B2B1B] text-[#EED08E] hover:bg-[#16442D] py-3 px-5 rounded-2xl text-xs font-semibold shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <ShoppingBag className="w-4 h-4" />
                      <span>Add to Bag</span>
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
