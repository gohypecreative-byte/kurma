"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence, useReducedMotion, useScroll, useSpring } from "motion/react";
import { ArrowRight, Plus, Heart, Check, SlidersHorizontal, ChevronDown, ChevronLeft, ChevronRight, HelpCircle, Bookmark } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { GiftingGallery } from "@/components/home/gifting-gallery";

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  return (
    <motion.div
      aria-hidden="true"
      className="hidden sm:block fixed left-0 top-0 z-[60] h-[3px] w-full origin-left bg-[#c0881b] pointer-events-none"
      style={{ scaleX: scrollYProgress }}
    />
  );
}

const BESTSELLER_ITEMS = [
  {
    id: "bestseller-1",
    skuId: "5-elements-suite",
    name: "Sacred Buddha & Turtle Suite",
    categoryTag: "ALL PRODUCTS",
    shortDesc: "Polished hardwood stand, hand-finished Buddha & brass turtle burner",
    price: 4299,
    priceDisplay: "₹4,299",
    originalPrice: "₹4,999",
    image: "/images/product/suite-portrait.jpg",
    images: [
      "/images/product/suite-portrait.jpg",
      "/images/product/suite-clean.png",
      "/images/product/image7.png",
      "/images/product/five-boxes-3d.png",
    ],
  },
  {
    id: "bestseller-2",
    skuId: "mdf-gift-box",
    name: "Heirloom Brass Turtle Trunk",
    categoryTag: "ALL PRODUCTS",
    shortDesc: "Slatted wooden chest, natural jute sack & brass turtle incense stand",
    price: 4599,
    priceDisplay: "₹4,599",
    image: "/images/product/trunk-portrait.jpg",
    images: [
      "/images/product/trunk-portrait.jpg",
      "/images/product/mdf-box-clean.png",
      "/images/product/image8.png",
      "/images/product/turtle-holder-clean.png",
    ],
  },
  {
    id: "bestseller-3",
    skuId: "fragrance-earth",
    name: "The Luxe Beauty Ritual",
    categoryTag: "ALL PRODUCTS",
    shortDesc: "This blush-toned beauty box is basically luxury wrapped in gold",
    price: 2899,
    priceDisplay: "₹2,899",
    originalPrice: "₹5,699",
    image: "/images/product/earth-portrait.jpg",
    images: [
      "/images/product/earth-portrait.jpg",
      "/images/product/earth-front.png",
      "/images/product/earth-3d.png",
      "/images/product/suite-clean.png",
    ],
  },
  {
    id: "bestseller-4",
    skuId: "fragrance-fire",
    name: "Vedic Heritage Brass Chest",
    categoryTag: "ALL PRODUCTS",
    shortDesc: "Carved teakwood tray, spherical brass incense urn & oil lamp",
    price: 4899,
    priceDisplay: "₹4,899",
    image: "/images/product/fire-portrait.jpg",
    images: [
      "/images/product/fire-portrait.jpg",
      "/images/product/fire-front.png",
      "/images/product/fire-3d.png",
      "/images/product/trunk-portrait.jpg",
    ],
  },
  {
    id: "bestseller-5",
    skuId: "marble-gift-box",
    name: "Elements in Harmony Marble Trunk",
    categoryTag: "FLAGSHIP SUITE",
    shortDesc: "Emerald-veined marble trunk with all 5 Element fragrances & brass insignia",
    price: 4999,
    priceDisplay: "₹4,999",
    originalPrice: "₹5,999",
    image: "/images/product/marble-portrait.jpg",
    images: [
      "/images/product/marble-portrait.jpg",
      "/images/product/marble-box-clean.png",
      "/images/product/suite-clean.png",
      "/images/product/image9.png",
    ],
  },
  {
    id: "bestseller-6",
    skuId: "brass-turtle-holder",
    name: "Handcrafted Solid Brass Turtle Stand",
    categoryTag: "SACRED ACCESSORY",
    shortDesc: "Cast virgin brass burner symbolizing longevity, stability & grounded energy",
    price: 899,
    priceDisplay: "₹899",
    originalPrice: "₹1,199",
    image: "/images/product/turtle-holder-portrait.jpg",
    images: [
      "/images/product/turtle-holder-portrait.jpg",
      "/images/product/turtle-holder-clean.png",
      "/images/product/medallion-clean.png",
      "/images/product/image7.png",
    ],
  },
  {
    id: "bestseller-7",
    skuId: "fragrance-water",
    name: "Water (Jal) Luxury Incense Sticks",
    categoryTag: "ELEMENTAL BLEND",
    shortDesc: "Blue lotus, aquatic mist and fresh vetiver for emotional clarity & calm",
    price: 499,
    priceDisplay: "₹499",
    originalPrice: "₹599",
    image: "/images/product/water-portrait.jpg",
    images: [
      "/images/product/water-portrait.jpg",
      "/images/product/water-front.png",
      "/images/product/water-3d.png",
      "/images/product/suite-clean.png",
    ],
  },
  {
    id: "bestseller-8",
    skuId: "fragrance-space",
    name: "Space (Akash) Cosmic Incense Sticks",
    categoryTag: "ELEMENTAL BLEND",
    shortDesc: "Sacred frankincense, myrrh and Himalayan deodar cedar for deep dhyana",
    price: 499,
    priceDisplay: "₹499",
    originalPrice: "₹599",
    image: "/images/product/space-portrait.jpg",
    images: [
      "/images/product/space-portrait.jpg",
      "/images/product/space-front.png",
      "/images/product/space-3d.png",
      "/images/product/air-portrait.jpg",
    ],
  },
];

const OCCASIONS_ITEMS = [
  {
    id: "occasion-wedding",
    badge: "WEDDING",
    title: "Wedding & Festive Gifting",
    description: "Return gifts, welcome hampers & festive suites curated with sacred agarbatti & solid brassware.",
    tags: ["Return Gifts", "Bulk Orders", "Wedding Suites"],
    image: "/images/product/earth-portrait.jpg",
    images: [
      "/images/product/earth-portrait.jpg",
      "/images/product/suite-portrait.jpg",
      "/images/product/earth-front.png",
      "/images/product/suite-clean.png",
    ],
  },
  {
    id: "occasion-corporate",
    badge: "CORPORATE",
    title: "Corporate & Executive Suites",
    description: "Diwali hampers, client appreciation & employee gifting with GST billing & custom brass plaques.",
    tags: ["Diwali Hampers", "Branded Trunks", "Bulk Gifting"],
    image: "/images/product/fire-portrait.jpg",
    images: [
      "/images/product/fire-portrait.jpg",
      "/images/product/trunk-portrait.jpg",
      "/images/product/fire-front.png",
      "/images/product/mdf-box-clean.png",
    ],
  },
  {
    id: "occasion-custom",
    badge: "BESPOKE",
    title: "Custom & Bespoke Rituals",
    description: "Pick your hamper, select your 5 elemental agarbatti fragrances, and personalize with custom brass seals.",
    tags: ["Build Yours", "Brass Engraving", "Custom Blends"],
    image: "/images/product/water-portrait.jpg",
    images: [
      "/images/product/water-portrait.jpg",
      "/images/product/water-front.png",
      "/images/product/marble-portrait.jpg",
      "/images/product/medallion-clean.png",
    ],
  },
  {
    id: "occasion-celebrations",
    badge: "CELEBRATION",
    title: "Sacred Celebrations",
    description: "Griha Pravesh, Puja rituals, Anniversaries & housewarming gifts infused with pure essential aromas.",
    tags: ["Griha Pravesh", "Puja Rituals", "Anniversary"],
    image: "/images/product/space-portrait.jpg",
    images: [
      "/images/product/space-portrait.jpg",
      "/images/product/space-front.png",
      "/images/product/turtle-holder-portrait.jpg",
      "/images/product/image9.png",
    ],
  },
  {
    id: "occasion-grihapravesh",
    badge: "HOUSEWARMING",
    title: "Griha Pravesh & Sanctum Blessing",
    description: "Purify new beginnings with charcoal-free sacred resins, holy woods, and solid brass turtle auspiciousness.",
    tags: ["New Home", "Vastu Shanti", "Auspicious"],
    image: "/images/product/air-portrait.jpg",
    images: [
      "/images/product/air-portrait.jpg",
      "/images/product/air-front.png",
      "/images/product/turtle-holder-portrait.jpg",
      "/images/product/five-boxes-3d.png",
    ],
  },
  {
    id: "occasion-deepawali",
    badge: "FESTIVAL OF LIGHTS",
    title: "Deepawali & Grand Festivities",
    description: "Illuminating heirloom boxes, fragrant temple sambrani, and regal brassware to celebrate divine radiance.",
    tags: ["Diwali Suites", "Royal Packaging", "Bulk Festive"],
    image: "/images/product/marble-portrait.jpg",
    images: [
      "/images/product/marble-portrait.jpg",
      "/images/product/marble-box-clean.png",
      "/images/product/suite-clean.png",
      "/images/product/image9.png",
    ],
  },
  {
    id: "occasion-anniversary",
    badge: "MILESTONE",
    title: "Anniversary & Heirloom Keepsakes",
    description: "Honor enduring bonds with custom brass engraved plaques, gold foil crests, and everlasting scents.",
    tags: ["Heirloom Brass", "Engraved Keepsake", "Timeless"],
    image: "/images/product/trunk-portrait.jpg",
    images: [
      "/images/product/trunk-portrait.jpg",
      "/images/product/mdf-box-clean.png",
      "/images/product/medallion-clean.png",
      "/images/product/image7.png",
    ],
  },
  {
    id: "occasion-wellness",
    badge: "SANCTUARY",
    title: "Wellness & Dhyana Rituals",
    description: "Calibrate mindfulness and yoga sanctuaries with calming Himalayan cedarwood and pure botanical oils.",
    tags: ["Yoga Sanctuaries", "Meditation", "Ayurvedic"],
    image: "/images/product/turtle-holder-portrait.jpg",
    images: [
      "/images/product/turtle-holder-portrait.jpg",
      "/images/product/suite-clean.png",
      "/images/product/water-front.png",
      "/images/product/earth-front.png",
    ],
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

function BestsellerCard({
  item,
  isLiked,
  isAdded,
  onToggleWishlist,
  onAddToCart,
}: {
  item: (typeof BESTSELLER_ITEMS)[0];
  isLiked: boolean;
  isAdded: boolean;
  onToggleWishlist: (id: string) => void;
  onAddToCart: (item: (typeof BESTSELLER_ITEMS)[0]) => void;
}) {
  const router = useRouter();
  const [activeIdx, setActiveIdx] = useState(0);
  const images = item.images && item.images.length > 0 ? item.images : [item.image];
  const currentImg = images[activeIdx] || item.image;

  return (
    <div
      onClick={() => router.push(`/products/${item.skuId}`)}
      className="flex-shrink-0 w-[84%] sm:w-[calc(50%-0.625rem)] lg:w-[calc(25%-0.9375rem)] snap-start group relative flex flex-col cursor-pointer select-none transition-all duration-300"
    >
      {/* Modern Image Canvas with in-card scrolling/carousel */}
      <div className="relative w-full aspect-[3/4] overflow-hidden rounded-2xl bg-transparent flex items-center justify-center">
        <Image
          src={currentImg}
          alt={item.name}
          fill
          loading="lazy"
          className={`absolute inset-0 w-full h-full ${
            currentImg.includes("portrait") ? "object-cover" : "object-contain p-2"
          } object-center group-hover:scale-105 transition-all duration-500 ease-out`}
          sizes="(max-width: 640px) 85vw, (max-width: 1024px) 50vw, 25vw"
        />

        {/* Bookmark/Wishlist Icon Top-Right */}
        <button
          type="button"
          aria-label="Add to wishlist"
          onClick={(e) => {
            e.stopPropagation();
            onToggleWishlist(item.id);
          }}
          className="absolute top-2.5 right-2.5 z-20 p-1 text-stone-700 hover:text-stone-900 drop-shadow-xs transition-transform active:scale-90 hover:scale-110 cursor-pointer"
        >
          <Heart
            className={`w-4 h-4 transition-colors ${
              isLiked
                ? "fill-stone-800 text-stone-800 stroke-[2]"
                : "fill-transparent text-stone-700 stroke-[2]"
            }`}
          />
        </button>

        {/* Previous & Next Carousel Navigation Arrows (visible on hover) */}
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
              className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 backdrop-blur-xs z-20 cursor-pointer shadow-md"
            >
              <ChevronLeft className="w-4 h-4 stroke-[2.2]" />
            </button>
            <button
              type="button"
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
          <div className="absolute bottom-2.5 inset-x-0 flex items-center justify-center gap-1.5 z-20">
            {images.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveIdx(idx);
                }}
                aria-label={`Go to image ${idx + 1}`}
                className={`transition-all duration-300 rounded-full cursor-pointer ${
                  idx === activeIdx
                    ? "w-2.5 h-1.5 bg-stone-900 shadow-xs"
                    : "w-1.5 h-1.5 bg-stone-400/60 hover:bg-stone-600"
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Minimalist Info Row Directly Beneath Image */}
      <div className="mt-2.5 flex items-start justify-between gap-2 px-0.5">
        <div className="space-y-0.5 min-w-0 flex-1">
          <span className="text-[10px] font-bold tracking-widest uppercase text-[#991B1B] block">
            {item.categoryTag}
          </span>
          <h3 className="text-xs sm:text-[13px] font-medium tracking-tight leading-snug truncate text-stone-900 group-hover:text-stone-600 transition-colors">
            {item.name}
          </h3>
          <div className="flex items-center gap-1.5 pt-0.5">
            <span className="text-xs sm:text-[12.5px] font-medium text-stone-700">
              {item.priceDisplay}
            </span>
            {item.originalPrice && (
              <span className="text-[11px] line-through text-stone-400">
                {item.originalPrice}
              </span>
            )}
          </div>
        </div>

        {/* Action Buttons on Far Right matching ProductCardItem */}
        <div className="flex items-center gap-1 shrink-0 pt-3">
          {/* Customize & Buy Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/elements?box=${item.skuId}`);
            }}
            title={`Customise & Buy ${item.name}`}
            aria-label={`Customise & Buy ${item.name}`}
            className="p-1 rounded-md text-[#c0881b] hover:text-stone-900 hover:bg-stone-100 transition-all duration-200 hover:scale-110 cursor-pointer"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 stroke-[1.8]" />
          </button>

          {/* Quick Add to Cart Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart(item);
            }}
            title={`Quick add ${item.name} to cart`}
            aria-label={`Quick add ${item.name} to cart`}
            className="p-1 rounded-md text-stone-800 hover:text-black hover:bg-stone-100 transition-all duration-200 hover:scale-110 cursor-pointer"
          >
            {isAdded ? (
              <Check className="w-3.5 h-3.5 stroke-[2.5] text-emerald-600" />
            ) : (
              <Plus className="w-3.5 h-3.5 stroke-[1.8]" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

function OccasionCard({
  item,
  isLiked,
  onToggleWishlist,
}: {
  item: (typeof OCCASIONS_ITEMS)[0];
  isLiked: boolean;
  onToggleWishlist: (id: string) => void;
}) {
  const router = useRouter();
  const [activeIdx, setActiveIdx] = useState(0);
  const images = item.images && item.images.length > 0 ? item.images : [item.image];
  const currentImg = images[activeIdx] || item.image;

  return (
    <div
      onClick={() => router.push(`/contact?inquiry=${encodeURIComponent(item.title)}`)}
      className="flex-shrink-0 w-[84%] sm:w-[calc(50%-0.625rem)] lg:w-[calc(25%-0.9375rem)] snap-start transition-all duration-300 flex flex-col justify-between group cursor-pointer select-none"
    >
      <div>
        {/* Aspect 3/5 Vertical Portrait Image Canvas with in-card scrolling/carousel */}
        <div className="relative aspect-[3/5] w-full overflow-hidden bg-transparent rounded-2xl flex flex-col justify-between p-4 transition-colors">
          {/* Top Right Bookmark Icon */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleWishlist(item.id);
            }}
            className="absolute top-3.5 right-3.5 z-20 text-stone-700 hover:text-black transition-transform active:scale-95 cursor-pointer"
            title="Bookmark item"
          >
            <Bookmark className={`w-4 h-4 stroke-[1.5] ${isLiked ? "fill-stone-900 text-stone-900" : ""}`} />
          </button>

          {/* Centered vertical box image */}
          <div className="relative w-full h-full flex items-center justify-center my-auto py-2">
            <Image
              src={currentImg}
              alt={item.title}
              fill
              loading="lazy"
              className={`drop-shadow-md group-hover:scale-[1.03] transition-all duration-500 ${
                currentImg.includes("portrait") ? "object-cover rounded-xl" : "object-contain"
              } object-center`}
              sizes="(max-width: 640px) 85vw, (max-width: 1024px) 50vw, 25vw"
            />
          </div>

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
                className="absolute left-2.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 backdrop-blur-xs z-20 cursor-pointer shadow-md"
              >
                <ChevronLeft className="w-4 h-4 stroke-[2.2]" />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveIdx((prev) => (prev + 1) % images.length);
                }}
                title="Next image"
                aria-label="Next image"
                className="absolute right-2.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 backdrop-blur-xs z-20 cursor-pointer shadow-md"
              >
                <ChevronRight className="w-4 h-4 stroke-[2.2]" />
              </button>
            </>
          )}

          {/* Bottom Pagination Dots with interactive click & active state */}
          {images.length > 1 && (
            <div className="flex items-center justify-center gap-1.5 pt-2 z-20">
              {images.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveIdx(idx);
                  }}
                  aria-label={`Go to image ${idx + 1}`}
                  className={`transition-all duration-300 rounded-full cursor-pointer ${
                    idx === activeIdx
                      ? "w-2.5 h-1.5 bg-stone-900 shadow-xs"
                      : "w-1.5 h-1.5 bg-stone-300 hover:bg-stone-500"
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Content details */}
        <div className="pt-4 px-1 pb-0">
          <span className="bg-[#EBF3F5] text-[#2C5E69] text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-md inline-block">
            {item.badge}
          </span>

          <h3 className="font-serif text-lg sm:text-xl font-medium text-[#0B2B1B] mt-2.5 group-hover:text-[#8C6215] transition-colors">
            {item.title}
          </h3>

          <p className="text-xs sm:text-sm text-stone-600 mt-2 leading-relaxed">
            {item.description}
          </p>

        </div>
      </div>

      {/* Footer Pills & Action Button */}
      <div className="pt-4 px-1 pb-1 mt-3 border-t border-stone-200/60 flex items-center justify-between gap-2">
        <div className="flex flex-wrap gap-1.5">
          {item.tags.map((tag, i) => (
            <span
              key={i}
              className="border border-stone-200/80 text-stone-600 text-[10.5px] px-2.5 py-0.5 rounded-full bg-stone-50/50"
            >
              {tag}
            </span>
          ))}
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            const el = document.getElementById("gifting-gallery");
            if (el) {
              el.scrollIntoView({ behavior: "smooth" });
            }
          }}
          aria-label={`Explore ${item.title}`}
          className="w-8 h-8 rounded-full bg-stone-100 text-stone-700 group-hover:bg-[#0B2B1B] group-hover:text-[#EED08E] flex items-center justify-center transition-all shadow-xs shrink-0 cursor-pointer"
        >
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

export function RitualAndQuestions() {
  const router = useRouter();
  const [open, setOpen] = useState<number | null>(0);
  const [likedItems, setLikedItems] = useState<Record<string, boolean>>({});
  const [addedIds, setAddedIds] = useState<Record<string, boolean>>({});
  const { addToCart } = useCart();
  const reduced = useReducedMotion();

  // Bestsellers Carousel Scroll State (4 items per view, matching reels)
  const bestsellersScrollRef = useRef<HTMLDivElement>(null);
  const bestsellersRafId = useRef<number | null>(null);
  const [bestsellerPage, setBestsellerPage] = useState(0);
  const totalBestsellerPages = Math.ceil(BESTSELLER_ITEMS.length / 4);
  const [canScrollBestsellersLeft, setCanScrollBestsellersLeft] = useState(false);
  const [canScrollBestsellersRight, setCanScrollBestsellersRight] = useState(true);

  const updateBestsellersScrollState = useCallback(() => {
    if (bestsellersRafId.current !== null) return;
    bestsellersRafId.current = requestAnimationFrame(() => {
      bestsellersRafId.current = null;
      if (bestsellersScrollRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = bestsellersScrollRef.current;
        const newLeft = scrollLeft > 20;
        const newRight = scrollLeft < scrollWidth - clientWidth - 20;
        setCanScrollBestsellersLeft((prev) => (prev !== newLeft ? newLeft : prev));
        setCanScrollBestsellersRight((prev) => (prev !== newRight ? newRight : prev));

        const pageIndex = Math.min(
          totalBestsellerPages - 1,
          Math.max(0, Math.round(scrollLeft / (clientWidth || 1)))
        );
        setBestsellerPage((prev) => (prev !== pageIndex ? pageIndex : prev));
      }
    });
  }, [totalBestsellerPages]);

  useEffect(() => {
    updateBestsellersScrollState();
    const current = bestsellersScrollRef.current;
    if (current) {
      current.addEventListener("scroll", updateBestsellersScrollState, { passive: true });
    }
    return () => {
      if (current) current.removeEventListener("scroll", updateBestsellersScrollState);
      if (bestsellersRafId.current !== null) cancelAnimationFrame(bestsellersRafId.current);
    };
  }, [updateBestsellersScrollState]);

  const handleBestsellersScroll = (direction: "left" | "right") => {
    if (bestsellersScrollRef.current) {
      const containerWidth = bestsellersScrollRef.current.clientWidth;
      bestsellersScrollRef.current.scrollBy({
        left: direction === "left" ? -containerWidth : containerWidth,
        behavior: "smooth",
      });
    }
  };

  const goToBestsellersPage = (pageIdx: number) => {
    if (bestsellersScrollRef.current) {
      const containerWidth = bestsellersScrollRef.current.clientWidth;
      bestsellersScrollRef.current.scrollTo({
        left: pageIdx * containerWidth,
        behavior: "smooth",
      });
      setBestsellerPage(pageIdx);
    }
  };

  // Occasions Carousel Scroll State (4 items per view, matching reels)
  const occasionsScrollRef = useRef<HTMLDivElement>(null);
  const occasionsRafId = useRef<number | null>(null);
  const [occasionsPage, setOccasionsPage] = useState(0);
  const totalOccasionsPages = Math.ceil(OCCASIONS_ITEMS.length / 4);
  const [canScrollOccasionsLeft, setCanScrollOccasionsLeft] = useState(false);
  const [canScrollOccasionsRight, setCanScrollOccasionsRight] = useState(true);

  const updateOccasionsScrollState = useCallback(() => {
    if (occasionsRafId.current !== null) return;
    occasionsRafId.current = requestAnimationFrame(() => {
      occasionsRafId.current = null;
      if (occasionsScrollRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = occasionsScrollRef.current;
        const newLeft = scrollLeft > 20;
        const newRight = scrollLeft < scrollWidth - clientWidth - 20;
        setCanScrollOccasionsLeft((prev) => (prev !== newLeft ? newLeft : prev));
        setCanScrollOccasionsRight((prev) => (prev !== newRight ? newRight : prev));

        const pageIndex = Math.min(
          totalOccasionsPages - 1,
          Math.max(0, Math.round(scrollLeft / (clientWidth || 1)))
        );
        setOccasionsPage((prev) => (prev !== pageIndex ? pageIndex : prev));
      }
    });
  }, [totalOccasionsPages]);

  useEffect(() => {
    updateOccasionsScrollState();
    const current = occasionsScrollRef.current;
    if (current) {
      current.addEventListener("scroll", updateOccasionsScrollState, { passive: true });
    }
    return () => {
      if (current) current.removeEventListener("scroll", updateOccasionsScrollState);
      if (occasionsRafId.current !== null) cancelAnimationFrame(occasionsRafId.current);
    };
  }, [updateOccasionsScrollState]);

  const handleOccasionsScroll = (direction: "left" | "right") => {
    if (occasionsScrollRef.current) {
      const containerWidth = occasionsScrollRef.current.clientWidth;
      occasionsScrollRef.current.scrollBy({
        left: direction === "left" ? -containerWidth : containerWidth,
        behavior: "smooth",
      });
    }
  };

  const goToOccasionsPage = (pageIdx: number) => {
    if (occasionsScrollRef.current) {
      const containerWidth = occasionsScrollRef.current.clientWidth;
      occasionsScrollRef.current.scrollTo({
        left: pageIdx * containerWidth,
        behavior: "smooth",
      });
      setOccasionsPage(pageIdx);
    }
  };

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
          <div className="text-center mb-8">
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

          {/* CLEAN CONTROLS (Arrows & Page Counter) like third image */}
          <div className="flex items-center justify-end pb-3">
            <div className="flex items-center gap-2.5">
              <span className="text-xs font-sans text-stone-500 font-medium">
                {bestsellerPage + 1} / {totalBestsellerPages}
              </span>
              <button
                onClick={() => handleBestsellersScroll("left")}
                disabled={!canScrollBestsellersLeft}
                aria-label="Previous products"
                className={`w-8 h-8 rounded-full border border-stone-300 bg-white shadow-xs flex items-center justify-center transition-all ${
                  canScrollBestsellersLeft
                    ? "hover:bg-stone-50 hover:scale-105 text-stone-800 cursor-pointer"
                    : "opacity-35 cursor-not-allowed text-stone-400"
                }`}
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleBestsellersScroll("right")}
                disabled={!canScrollBestsellersRight}
                aria-label="Next products"
                className={`w-8 h-8 rounded-full border border-stone-300 bg-white shadow-xs flex items-center justify-center transition-all ${
                  canScrollBestsellersRight
                    ? "hover:bg-stone-50 hover:scale-105 text-stone-800 cursor-pointer"
                    : "opacity-35 cursor-not-allowed text-stone-400"
                }`}
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* 4 Card Bestsellers Horizontal Carousel with Smooth Snapping */}
          <div
            ref={bestsellersScrollRef}
            className="flex gap-4 sm:gap-5 overflow-x-auto pb-3 pt-1 snap-x snap-mandatory scroll-smooth no-scrollbar touch-pan-x"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
              WebkitOverflowScrolling: "touch",
            }}
          >
            {BESTSELLER_ITEMS.map((item) => (
              <BestsellerCard
                key={item.id}
                item={item}
                isLiked={!!likedItems[item.id]}
                isAdded={!!addedIds[item.id]}
                onToggleWishlist={toggleWishlist}
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>

          {/* Subtle Page Indicator Dots like third image */}
          <div className="flex items-center justify-center gap-1.5 pt-4">
            {Array.from({ length: totalBestsellerPages }).map((_, pageIdx) => (
              <button
                key={pageIdx}
                onClick={() => goToBestsellersPage(pageIdx)}
                aria-label={`Go to bestsellers page ${pageIdx + 1}`}
                className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                  bestsellerPage === pageIdx
                    ? "w-7 bg-[#8b5f10]"
                    : "w-2 bg-stone-300 hover:bg-stone-400"
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Curated Gifting Galerie Section */}
      <GiftingGallery />



      {/* SECTION: 'What brings you here today?' (THE KURMA'S OCCASION) */}
      <section className="bg-[#FAF7F2] py-14 sm:py-24 px-4 sm:px-6 md:px-8 lg:px-12 border-t border-[#EAE3D5] w-full mobile-defer-render">
        <div className="mx-auto max-w-[1700px] w-full">
          {/* Header */}
          <div className="text-center mb-10">
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

          {/* CLEAN CONTROLS (Arrows & Page Counter) like third image */}
          <div className="flex items-center justify-end pb-3">
            <div className="flex items-center gap-2.5">
              <span className="text-xs font-sans text-stone-500 font-medium">
                {occasionsPage + 1} / {totalOccasionsPages}
              </span>
              <button
                onClick={() => handleOccasionsScroll("left")}
                disabled={!canScrollOccasionsLeft}
                aria-label="Previous occasions"
                className={`w-8 h-8 rounded-full border border-stone-300 bg-white shadow-xs flex items-center justify-center transition-all ${
                  canScrollOccasionsLeft
                    ? "hover:bg-stone-50 hover:scale-105 text-stone-800 cursor-pointer"
                    : "opacity-35 cursor-not-allowed text-stone-400"
                }`}
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleOccasionsScroll("right")}
                disabled={!canScrollOccasionsRight}
                aria-label="Next occasions"
                className={`w-8 h-8 rounded-full border border-stone-300 bg-white shadow-xs flex items-center justify-center transition-all ${
                  canScrollOccasionsRight
                    ? "hover:bg-stone-50 hover:scale-105 text-stone-800 cursor-pointer"
                    : "opacity-35 cursor-not-allowed text-stone-400"
                }`}
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Occasion Cards Horizontal Carousel with Smooth Snapping */}
          <div
            ref={occasionsScrollRef}
            className="flex gap-4 sm:gap-5 overflow-x-auto pb-3 pt-1 snap-x snap-mandatory scroll-smooth no-scrollbar touch-pan-x"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
              WebkitOverflowScrolling: "touch",
            }}
          >
            {OCCASIONS_ITEMS.map((item) => (
              <OccasionCard
                key={item.id}
                item={item}
                isLiked={!!likedItems[item.id]}
                onToggleWishlist={toggleWishlist}
              />
            ))}
          </div>

          {/* Subtle Page Indicator Dots like third image */}
          <div className="flex items-center justify-center gap-1.5 pt-4">
            {Array.from({ length: totalOccasionsPages }).map((_, pageIdx) => (
              <button
                key={pageIdx}
                onClick={() => goToOccasionsPage(pageIdx)}
                aria-label={`Go to occasion page ${pageIdx + 1}`}
                className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                  occasionsPage === pageIdx
                    ? "w-7 bg-[#8b5f10]"
                    : "w-2 bg-stone-300 hover:bg-stone-400"
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* FAQ SECTION (Positioned Directly Below 'THE KURMA'S OCCASION' Section) */}
      <KurmaFAQSection />
    </>
  );
}

const FAQ_ITEMS = [
  {
    question: "What makes Kurma 5 Elements Incense 100% charcoal-free & non-toxic?",
    answer:
      "Kurma incense sticks are handcrafted using pure natural flower extracts, sacred resins, organic wood powders, and therapeutic essential oils without synthetic charcoal, phthalates, or chemical binders. This guarantees zero toxic black soot, clean indoor air, and a soothing 60-minute burn time.",
  },
  {
    question: "What is included in The 5 Elements Complete Luxury Suite?",
    answer:
      "The complete suite includes 5 distinct sacred fragrances (Earth, Water, Fire, Air, Space — 135 total sticks), a heavy solid brass turtle incense holder, a metallic keepsake medallion & tassel bookmark, and an artisan gold-embossed presentation gift box.",
  },
  {
    question: "Can I customize hampers with corporate logos or personal names?",
    answer:
      "Yes! We offer custom brass plaque engraving, personalized gold foil sleeves, custom greeting cards, and bespoke wax seals for corporate executive gifts, weddings, and grand celebrations. You can customize on product pages or contact our concierge team.",
  },
  {
    question: "What are your shipping timelines and delivery coverage across India?",
    answer:
      "We deliver across 18,000+ pincodes in India with free express shipping on orders above ₹1,999. Orders are dispatched within 24 hours. Metro city deliveries arrive in 2–3 business days, while tier-2/3 cities take 3–5 business days in shock-proof transit packaging.",
  },
  {
    question: "How do I clean and maintain the solid brass turtle incense burner?",
    answer:
      "Our turtle burners are cast from heavy virgin brass with a protective anti-tarnish finish. Simply wipe with a soft dry cloth after use. For long-term shine, a gentle wipe with brass polish or natural lemon-and-salt restores its heirloom golden luster instantly.",
  },
  {
    question: "Are Kurma fragrance suites suitable for daily puja and mindfulness?",
    answer:
      "Formulated according to ancient Ayurvedic and Pancha Mahabhuta (5 Elements) principles, Kurma fragrances are ideal for daily morning rituals, evening dhyana/meditation, yoga practice, housewarmings (Griha Pravesh), and luxury festive gifting.",
  },
];

function KurmaFAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="bg-[#FAF7F2] py-16 sm:py-24 px-4 sm:px-6 md:px-12 border-t border-[#EAE3D5] overflow-hidden">
      <div className="mx-auto max-w-4xl">
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.25em] text-[#0B2B1B] uppercase mb-2">
            <HelpCircle className="w-4 h-4 text-[#8C6215]" />
            <span>FREQUENTLY ASKED QUESTIONS</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-[#0B2B1B] font-medium tracking-tight">
            Everything You Need to Know <span className="italic font-serif font-normal text-[#8C6215]">About Kurma</span>
          </h2>
        </div>

        {/* Accordion Questions List */}
        <div className="space-y-4">
          {FAQ_ITEMS.map((faq, idx) => {
            const isOpen = openIndex === idx;

            return (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-stone-200/90 shadow-2xs overflow-hidden transition-all duration-300 hover:border-[#8C6215]/50"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 cursor-pointer select-none"
                >
                  <span className="font-serif text-base sm:text-lg font-medium text-[#0B2B1B] pr-2">
                    {faq.question}
                  </span>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-transform duration-300 ${isOpen ? "bg-[#0B2B1B] text-[#EED08E] rotate-180" : "bg-stone-100 text-stone-600"}`}>
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.25, ease: "easeInOut" }}
                      className="px-5 sm:px-6 pb-6 pt-0 text-xs sm:text-sm text-stone-600 leading-relaxed border-t border-stone-100 font-sans overflow-hidden"
                    >
                      <p className="pt-3">{faq.answer}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
