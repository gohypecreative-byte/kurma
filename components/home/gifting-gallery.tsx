"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { Eye, ShoppingBag, Check, X, ArrowRight, Gift, Bookmark, SlidersHorizontal, Plus, ChevronLeft, ChevronRight } from "lucide-react";
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
  index?: number;
}

function HamperCardItem({
  hamper,
  likedIds,
  addedIds,
  toggleWishlist,
  setSelectedHamper,
  handleAddToCart,
  index = 0,
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
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px 0px" }}
      transition={{
        duration: 0.85,
        delay: (index % 4) * 0.09,
        ease: [0.21, 0.47, 0.32, 0.98],
      }}
      className="w-full h-full will-change-[transform,opacity]"
    >
      <div
        onClick={() => setSelectedHamper(hamper)}
        className="group transition-all duration-300 flex flex-col justify-between cursor-pointer select-none relative hover:-translate-y-1 w-full h-full"
      >
      <div>
        {/* Vertical Portrait Image Canvas (Aspect 3:4) - Full Bleed Edge-to-Edge */}
        <div className="relative aspect-[3/4] w-full overflow-hidden rounded-2xl bg-[#F7F4EE] border border-[#DDD3C2] shadow-xs">
          <Image
            src={currentDisplayImg}
            alt={hamper.name}
            fill
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 640px) 48vw, (max-width: 1024px) 33vw, 25vw"
          />

          {/* Bookmark Wishlist Icon Top-Right */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              toggleWishlist(hamper.id);
            }}
            aria-label="Save to Wishlist"
            className="absolute top-3 right-3 z-10 p-1.5 rounded-full bg-black/35 hover:bg-black/60 text-white backdrop-blur-xs drop-shadow-sm transition-transform active:scale-90 hover:scale-110 cursor-pointer"
          >
            <Bookmark
              className={`w-4 h-4 transition-colors ${
                likedIds[hamper.id]
                  ? "fill-[#eed08e] text-[#eed08e] stroke-[2]"
                  : "fill-transparent text-white stroke-[2]"
              }`}
            />
          </button>

          {/* Left & Right Hover Navigation Buttons */}
          {images.length > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveIdx((prev) => (prev - 1 + images.length) % images.length);
                }}
                title="Previous image"
                aria-label="Previous image"
                className="absolute left-1.5 sm:left-2 top-1/2 -translate-y-1/2 w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 backdrop-blur-xs z-20 cursor-pointer shadow-md"
              >
                <ChevronLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.2]" />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveIdx((prev) => (prev + 1) % images.length);
                }}
                title="Next image"
                aria-label="Next image"
                className="absolute right-1.5 sm:right-2 top-1/2 -translate-y-1/2 w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 backdrop-blur-xs z-20 cursor-pointer shadow-md"
              >
                <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.2]" />
              </button>
            </>
          )}

          {/* Slide Indicator Dots at Bottom Center */}
          {images.length > 1 && (
            <div className="absolute bottom-2.5 inset-x-0 flex items-center justify-center gap-1.5 z-10 pointer-events-auto">
              {images.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveIdx(idx);
                  }}
                  aria-label={`Show image ${idx + 1}`}
                  className={`transition-all duration-300 rounded-full cursor-pointer shadow-xs ${
                    idx === activeIdx
                      ? "w-2.5 h-1.5 bg-white shadow-md"
                      : "w-1.5 h-1.5 bg-white/60 hover:bg-white"
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Card Info Below Image */}
        <div className="mt-2.5 px-0.5 flex items-start justify-between gap-1.5 sm:gap-2">
          <div className="space-y-0.5 sm:space-y-1 min-w-0 flex-1">
            <h3 className="font-serif text-xs sm:text-[13.5px] font-medium text-[#1C1B18] group-hover:text-[#8C6215] transition-colors truncate">
              {hamper.name}
            </h3>
            <div className="flex items-center gap-1.5">
              <span className="text-xs sm:text-[12.5px] font-medium text-[#1C1B18]">
                RS. {hamper.price.toLocaleString("en-IN")}
              </span>
              {hamper.originalPrice && (
                <span className="text-[10px] sm:text-[11px] text-stone-400 line-through">
                  {hamper.originalPrice}
                </span>
              )}
            </div>
          </div>

          {/* Quick Action Icons */}
          <div className="flex items-center gap-1 shrink-0">
            <button
              type="button"
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
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleAddToCart(hamper);
              }}
              className="p-1 text-stone-700 hover:text-black transition-colors cursor-pointer"
              title="Add to Cart"
            >
              {addedIds[hamper.id] ? (
                <Check className="w-3.5 h-3.5 text-[#7A5A28] stroke-[2.5]" />
              ) : (
                <Plus className="w-3.5 h-3.5 stroke-[1.8]" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  </motion.div>
  );
}

export function GiftingGallery() {
  const router = useRouter();
  const { addToCart } = useCart();
  const [selectedHamper, setSelectedHamper] = useState<HamperItem | null>(null);
  const [addedIds, setAddedIds] = useState<Record<string, boolean>>({});
  const [likedIds, setLikedIds] = useState<Record<string, boolean>>({});

  const toggleWishlist = (id: string) => {
    setLikedIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

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
    <section id="gifting-gallery" className="bg-[#ECE4D8] py-16 sm:py-20 px-4 sm:px-6 md:px-8 lg:py-24 border-t border-b border-[#DDD3C2] text-[#1C1B18] w-full mobile-defer-render">
      <div className="mx-auto max-w-[1700px] w-full">
        {/* Section Header */}
        <div className="text-center max-w-5xl mx-auto mb-8 sm:mb-12 px-2">
          <h2 className="font-serif text-lg xs:text-xl sm:text-3xl md:text-4xl lg:text-[44px] xl:text-5xl font-medium tracking-tight text-[#1C1B18] leading-tight sm:whitespace-nowrap">
            Artisanal Luxury Hampers &amp; Gift Suites
          </h2>
        </div>

        {/* Hampers Image Grid - 12 Items with Hover Left/Right Navigation Arrows */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
          {HAMPER_ITEMS.map((hamper, idx) => (
            <HamperCardItem
              key={hamper.id}
              hamper={hamper}
              index={idx}
              likedIds={likedIds}
              addedIds={addedIds}
              toggleWishlist={toggleWishlist}
              setSelectedHamper={setSelectedHamper}
              handleAddToCart={handleAddToCart}
            />
          ))}
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
                  unoptimized
                  className="object-cover"
                />
              </div>

              {/* Modal Details */}
              <div className="p-6 md:p-8 w-full md:w-1/2 flex flex-col justify-between overflow-y-auto">
                <div>
                  <h3 className="font-serif text-2xl text-[#1C1B18] font-medium leading-tight">
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
                          <Check className="w-4 h-4 text-[#7A5A28] shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Pricing & Cart Action */}
                <div className="mt-8 pt-4 border-t border-stone-100 flex items-center justify-between gap-4">
                  <div>
                    <span className="text-xs text-stone-400 block">Total Suite Price</span>
                    <div className="flex items-baseline gap-2">
                      <span className="font-serif text-2xl font-bold text-[#1C1B18]">
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
                      className="bg-[#1E1E1C] text-white hover:bg-[#33312D] py-3 px-5 rounded-2xl text-xs font-semibold shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
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
