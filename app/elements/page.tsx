"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { useCart } from "@/lib/cart-context";
import {
  Sparkles,
  ArrowRight,
  Check,
  Plus,
  Minus,
  Trash2,
  Gift,
  Heart,
  ShieldCheck,
  ChevronRight,
  SlidersHorizontal,
} from "lucide-react";

interface BoxOption {
  id: string;
  title: string;
  size: string;
  capacity: number;
  price: number;
  image: string;
  description?: string;
}

interface GoodyOption {
  id: string;
  name: string;
  category: "Incense" | "Brassware" | "Keepsake" | "Wellness";
  price: number;
  image: string;
  description: string;
}

const BOX_OPTIONS: BoxOption[] = [
  {
    id: "celebration",
    title: "The Celebration Box",
    size: "8 x 8 x 4 cm",
    capacity: 4,
    price: 650,
    image: "/images/product/mdf-box-clean.png",
    description: "Royal debossed Kurma emblem rigid wooden box with plush velvet lining.",
  },
  {
    id: "heritage",
    title: "The Heritage Box",
    size: "8 x 8 x 4 cm",
    capacity: 4,
    price: 650,
    image: "/images/product/image.png",
    description: "Classic textured heirloom wood finish with antiqued brass clasp.",
  },
  {
    id: "pink-small",
    title: "Pink Stripped Mailer box (Small)",
    size: "8 x 6 x 2 cm",
    capacity: 4,
    price: 350,
    image: "/images/product/image7.png",
    description: "Chic festive striped gift mailer with gold foil branding.",
  },
  {
    id: "pink-large",
    title: "Pink stripped Mailer box (Large)",
    size: "12 x 9 x 3 cm",
    capacity: 6,
    price: 450,
    image: "/images/product/image8.png",
    description: "Spacious festive mailer crafted for curated multi-item gifting.",
  },
  {
    id: "wood-small",
    title: "Premium Wooden Storage Box (Small)",
    size: "9 x 7 x 2.5 cm",
    capacity: 3,
    price: 550,
    image: "/images/product/marble-box-clean.png",
    description: "Solid natural pine wood keepsake box with brass hinged lid.",
  },
  {
    id: "rustic-basket",
    title: "Premium Rustic Weave Basket",
    size: "10.5 x 8.5 x 5.5 cm",
    capacity: 9,
    price: 1500,
    image: "/images/product/image9.png",
    description: "Handcrafted natural wicker weave tokri with dual bamboo handles.",
  },
  {
    id: "wood-large",
    title: "Premium Wooden Storage Box (Large)",
    size: "12 x 10 x 4 cm",
    capacity: 7,
    price: 750,
    image: "/images/product/suite-clean.png",
    description: "Expansive luxury teakwood storage trunk for grand gift ensembles.",
  },
  {
    id: "jute-natural",
    title: "Natural Colour Jute Basket",
    size: "12 x 12 x 3 cm",
    capacity: 4,
    price: 650,
    image: "/images/product/five-boxes-3d.png",
    description: "Eco-elegant hand-braided jute round basket with cotton liner.",
  },
  {
    id: "jute-cross",
    title: "Natural Beige Cross Pattern Basket",
    size: "13 x 7 x 3 cm",
    capacity: 5,
    price: 950,
    image: "/images/product/turtle-holder-clean.png",
    description: "Artisan cross-weave jute & burlap tokri with satin ribbon trim.",
  },
  {
    id: "cardboard-printed",
    title: "Premium Cardboard Printed Box",
    size: "10.25 x 8.25 x 3.25 cm",
    capacity: 6,
    price: 450,
    image: "/images/product/image.png",
    description: "Heavyweight rigid board wrapped in gold mandala motif paper.",
  },
  {
    id: "jute-yellow",
    title: "Butter yellow jute tray",
    size: "15 x 11.5 x 3.25 cm",
    capacity: 7,
    price: 850,
    image: "/images/product/image7.png",
    description: "Vibrant yellow dye handwoven jute platter tray.",
  },
  {
    id: "jute-premium",
    title: "Premium Jute Tray",
    size: "15 x 11.5 x 3.25 cm",
    capacity: 7,
    price: 850,
    image: "/images/product/image8.png",
    description: "Sturdy braided jute vanity gift tray with golden handles.",
  },
];

const GOODIES_OPTIONS: GoodyOption[] = [
  {
    id: "earth-incense",
    name: "Earth (Prithvi) Incense Box",
    category: "Incense",
    price: 449,
    image: "/images/product/earth-front.png",
    description: "Vetiver, Sandalwood & Forest Moss (100% Charcoal-Free, 27 sticks).",
  },
  {
    id: "water-incense",
    name: "Water (Jal) Incense Box",
    category: "Incense",
    price: 449,
    image: "/images/product/water-front.png",
    description: "Blue Lotus, Rain Accord & Golden Amber (27 sticks).",
  },
  {
    id: "fire-incense",
    name: "Fire (Agni) Incense Box",
    category: "Incense",
    price: 449,
    image: "/images/product/fire-front.png",
    description: "Ceylon Clove, Cassia Bark & Smoked Dammar Resin (27 sticks).",
  },
  {
    id: "air-incense",
    name: "Air (Vayu) Incense Box",
    category: "Incense",
    price: 449,
    image: "/images/product/air-front.png",
    description: "Desi Gulab Petals, Camphor & Morning Dew (27 sticks).",
  },
  {
    id: "space-incense",
    name: "Space (Akasha) Incense Box",
    category: "Incense",
    price: 449,
    image: "/images/product/space-front.png",
    description: "Wild Oudh Agarwood, Frankincense & Somalian Myrrh (27 sticks).",
  },
  {
    id: "turtle-burner",
    name: "Solid Brass Turtle Incense Stand",
    category: "Brassware",
    price: 899,
    image: "/images/product/turtle-holder-clean.png",
    description: "Cast virgin brass Kurma turtle burner with anti-tarnish finish.",
  },
  {
    id: "pashmina-square",
    name: "Zari Embroidered Pashmina Square",
    category: "Keepsake",
    price: 599,
    image: "/images/product/image8.png",
    description: "Forest green Pashmina square with gold zari turtle embroidery.",
  },
  {
    id: "medallion-coin",
    name: "Sacred 5 Elements Medallion Coin",
    category: "Keepsake",
    price: 349,
    image: "/images/product/image7.png",
    description: "Engraved brass souvenir coin & tassel bookmark.",
  },
];

export default function CustomisePage() {
  const router = useRouter();
  const { cartCount, setIsCartOpen, addToCart } = useCart();

  // Customizer Step State: 1 | 2 | 3 | 4
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);

  // Step 1: Selected Box
  const [selectedBox, setSelectedBox] = useState<BoxOption>(BOX_OPTIONS[0]);
  const [showAllBoxes, setShowAllBoxes] = useState(false);

  // Step 2: Selected Goodies (goodyId -> quantity)
  const [selectedGoodies, setSelectedGoodies] = useState<Record<string, number>>({});

  // Step 3: Personalization
  const [personalization, setPersonalization] = useState({
    recipientName: "",
    senderName: "",
    giftNote: "",
    brassPlaqueText: "",
  });

  const [addedToCartSuccess, setAddedToCartSuccess] = useState(false);

  // Calculate filled items in box
  const totalItemsSelected = useMemo(() => {
    return Object.values(selectedGoodies).reduce((sum, qty) => sum + qty, 0);
  }, [selectedGoodies]);

  // Calculate total price: Box Price + Goodies Total
  const goodiesPriceTotal = useMemo(() => {
    return Object.entries(selectedGoodies).reduce((sum, [goodyId, qty]) => {
      const item = GOODIES_OPTIONS.find((g) => g.id === goodyId);
      return sum + (item ? item.price * qty : 0);
    }, 0);
  }, [selectedGoodies]);

  const grandTotal = selectedBox.price + goodiesPriceTotal;

  // Visible box options (first 6 or all 12)
  const visibleBoxes = showAllBoxes ? BOX_OPTIONS : BOX_OPTIONS.slice(0, 6);

  const handleUpdateGoodyQty = (goodyId: string, delta: number) => {
    setSelectedGoodies((prev) => {
      const currentQty = prev[goodyId] || 0;
      const newQty = Math.max(0, currentQty + delta);

      // Check capacity limit
      if (delta > 0 && totalItemsSelected >= selectedBox.capacity) {
        alert(`Your selected box (${selectedBox.title}) holds up to ${selectedBox.capacity} items. Upgrade your box in Step 1 to add more!`);
        return prev;
      }

      if (newQty === 0) {
        const next = { ...prev };
        delete next[goodyId];
        return next;
      }

      return { ...prev, [goodyId]: newQty };
    });
  };

  const handleAddCustomHamperToCart = () => {
    const goodiesSummaryList = Object.entries(selectedGoodies)
      .map(([goodyId, qty]) => {
        const item = GOODIES_OPTIONS.find((g) => g.id === goodyId);
        return item ? `${qty}x ${item.name}` : "";
      })
      .filter(Boolean)
      .join(", ");

    addToCart({
      id: `custom-hamper-${Date.now()}`,
      skuId: selectedBox.id,
      name: `Custom Hamper: ${selectedBox.title}`,
      price: grandTotal,
      priceDisplay: `₹${grandTotal.toLocaleString("en-IN")}`,
      image: selectedBox.image,
      quantity: 1,
      customizations: {
        Box: selectedBox.title,
        Goodies: goodiesSummaryList || "Box only",
        Recipient: personalization.recipientName || "Valued Recipient",
        Note: personalization.giftNote || "Best Wishes",
      },
    });

    setAddedToCartSuccess(true);
    setTimeout(() => setAddedToCartSuccess(false), 2500);
    setIsCartOpen(true);
  };

  const scrollToStepper = () => {
    const el = document.getElementById("stepper-header");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-stone-900 selection:bg-[#eed08e] selection:text-[#072515] pb-24">
      {/* Top Navigation */}
      <Navbar cartCount={cartCount} onOpenCart={() => setIsCartOpen(true)} />

      <main className="flex-1 w-full">
        {/* HERO BANNER SECTION (Matching Screenshot 1) */}
        <section className="relative w-full bg-gradient-to-r from-[#F5F1EA] via-[#FAF7F2] to-[#EFECE5] border-b border-[#E3DCCF] overflow-hidden py-12 sm:py-16 lg:py-20 px-4 sm:px-8 md:px-12">
          {/* Subtle Botanical Leaf Shadow Overlay */}
          <div className="absolute inset-0 bg-[radial-gradient(#8C6215_0.5px,transparent_0.5px)] [background-size:24px_24px] opacity-15 pointer-events-none" />

          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            {/* Left Content */}
            <div className="lg:col-span-6 space-y-5 text-left">
              <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.25em] text-[#0B2B1B] uppercase">
                <Sparkles className="w-4 h-4 text-[#8C6215] fill-[#8C6215]" />
                <span>CUSTOMISE YOUR GIFT</span>
              </div>

              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-normal text-[#0B2B1B] leading-[1.15] tracking-tight">
                Born from a love of,<br />
                <span className="italic font-serif font-normal text-[#0B2B1B]">beautiful gifting</span>
              </h1>

              <div className="pt-2">
                <button
                  onClick={scrollToStepper}
                  className="bg-[#121829] hover:bg-[#0B2B1B] text-white px-7 py-3.5 rounded-full text-xs font-bold tracking-widest uppercase transition-all shadow-lg hover:shadow-xl inline-flex items-center gap-2 cursor-pointer group"
                >
                  <span>START BUILDING</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>

            {/* Right Hero Image (Matching Luxury Gift Box in Screenshot 1) */}
            <div className="lg:col-span-6 relative aspect-[4/3] sm:aspect-[16/10] lg:aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl border border-white/60 bg-white">
              <Image
                src="/images/product/suite-clean.png"
                alt="Customise Luxury Gift Box"
                fill
                priority
                unoptimized
                className="object-cover object-center hover:scale-102 transition-transform duration-700"
              />
            </div>
          </div>
        </section>

        {/* STEPPER PROGRESS HEADER & STEP CONTAINER (Matching Screenshot 2) */}
        <section id="stepper-header" className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 -mt-8 sm:-mt-14 relative z-20">
          <div className="bg-white rounded-3xl border border-stone-200/90 p-6 sm:p-10 md:p-12 shadow-xl backdrop-blur-md">
            {/* 4-Step Stepper Progress Bar */}
            <div className="relative mb-10 pb-8 border-b border-stone-100">
              {/* Connecting Horizontal Line */}
              <div className="absolute top-5 left-[12%] right-[12%] h-[2px] bg-stone-200 -z-0 hidden sm:block" />

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-4 relative z-10 text-center">
                {/* STEP 1 */}
                <button
                  onClick={() => setCurrentStep(1)}
                  className="flex flex-col items-center cursor-pointer group"
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-serif text-sm font-bold transition-all duration-300 ${
                      currentStep === 1
                        ? "bg-[#121829] text-white shadow-md scale-110"
                        : currentStep > 1
                        ? "bg-[#0B2B1B] text-[#EED08E]"
                        : "bg-white text-stone-400 border-2 border-stone-300 group-hover:border-stone-400"
                    }`}
                  >
                    {currentStep > 1 ? <Check className="w-5 h-5 stroke-[2.5]" /> : "1"}
                  </div>
                  <span
                    className={`font-serif text-sm font-semibold mt-3 transition-colors ${
                      currentStep === 1 ? "text-[#0B2B1B]" : "text-stone-700"
                    }`}
                  >
                    Choose your box
                  </span>
                  <span className="text-[11px] text-stone-500 mt-1 max-w-[140px] leading-tight hidden sm:block">
                    Pick a tray or basket that feels right for your gift
                  </span>
                </button>

                {/* STEP 2 */}
                <button
                  onClick={() => setCurrentStep(2)}
                  className="flex flex-col items-center cursor-pointer group"
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-serif text-sm font-bold transition-all duration-300 ${
                      currentStep === 2
                        ? "bg-[#121829] text-white shadow-md scale-110"
                        : currentStep > 2
                        ? "bg-[#0B2B1B] text-[#EED08E]"
                        : "bg-white text-stone-400 border-2 border-stone-300 group-hover:border-stone-400"
                    }`}
                  >
                    {currentStep > 2 ? <Check className="w-5 h-5 stroke-[2.5]" /> : "2"}
                  </div>
                  <span
                    className={`font-serif text-sm font-semibold mt-3 transition-colors ${
                      currentStep === 2 ? "text-[#0B2B1B]" : "text-stone-700"
                    }`}
                  >
                    Select Goodies
                  </span>
                  <span className="text-[11px] text-stone-500 mt-1 max-w-[140px] leading-tight hidden sm:block">
                    Add items you love and build it your way
                  </span>
                </button>

                {/* STEP 3 */}
                <button
                  onClick={() => setCurrentStep(3)}
                  className="flex flex-col items-center cursor-pointer group"
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-serif text-sm font-bold transition-all duration-300 ${
                      currentStep === 3
                        ? "bg-[#121829] text-white shadow-md scale-110"
                        : currentStep > 3
                        ? "bg-[#0B2B1B] text-[#EED08E]"
                        : "bg-white text-stone-400 border-2 border-stone-300 group-hover:border-stone-400"
                    }`}
                  >
                    {currentStep > 3 ? <Check className="w-5 h-5 stroke-[2.5]" /> : "3"}
                  </div>
                  <span
                    className={`font-serif text-sm font-semibold mt-3 transition-colors ${
                      currentStep === 3 ? "text-[#0B2B1B]" : "text-stone-700"
                    }`}
                  >
                    Personalise It
                  </span>
                  <span className="text-[11px] text-stone-500 mt-1 max-w-[140px] leading-tight hidden sm:block">
                    Add a note or special detail for your recipient
                  </span>
                </button>

                {/* STEP 4 */}
                <button
                  onClick={() => setCurrentStep(4)}
                  className="flex flex-col items-center cursor-pointer group"
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-serif text-sm font-bold transition-all duration-300 ${
                      currentStep === 4
                        ? "bg-[#121829] text-white shadow-md scale-110"
                        : "bg-white text-stone-400 border-2 border-stone-300 group-hover:border-stone-400"
                    }`}
                  >
                    4
                  </div>
                  <span
                    className={`font-serif text-sm font-semibold mt-3 transition-colors ${
                      currentStep === 4 ? "text-[#0B2B1B]" : "text-stone-700"
                    }`}
                  >
                    Review &amp; Place Order
                  </span>
                  <span className="text-[11px] text-stone-500 mt-1 max-w-[140px] leading-tight hidden sm:block">
                    Take a quick look at your hamper and checkout
                  </span>
                </button>
              </div>
            </div>

            {/* STEP 1: CHOOSE YOUR BOX CONTENT (Matching Screenshots 2, 3 & 4) */}
            {currentStep === 1 && (
              <div className="space-y-8 animate-in fade-in duration-300">
                {/* Header Title */}
                <div className="text-center max-w-2xl mx-auto space-y-2">
                  <div className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-widest text-stone-500 uppercase">
                    <Sparkles className="w-3.5 h-3.5 text-stone-400" />
                    <span>STEP 1</span>
                  </div>
                  <h2 className="font-serif text-3xl sm:text-4xl text-[#0B2B1B] font-medium">
                    Choose your box
                  </h2>
                  <p className="text-xs sm:text-sm text-stone-600 font-sans leading-relaxed">
                    Pick the size that fits your gifting moment. Includes: Gift Packaging, Notecard and Hand Wrapping
                  </p>
                </div>

                {/* 2-Column Responsive Box Selection Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
                  {visibleBoxes.map((box) => {
                    const isSelected = selectedBox.id === box.id;
                    return (
                      <div
                        key={box.id}
                        onClick={() => setSelectedBox(box)}
                        className={`rounded-2xl p-4 sm:p-5 flex items-center gap-4 cursor-pointer transition-all duration-200 select-none ${
                          isSelected
                            ? "border-2 border-[#8C281F] bg-[#FAF5F5]/40 shadow-md"
                            : "border border-stone-200/90 bg-white hover:border-[#8C281F]/40 hover:shadow-xs"
                        }`}
                      >
                        {/* Square Thumbnail Image */}
                        <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden bg-[#f5f3ec] shrink-0 border border-stone-200/80 p-2 flex items-center justify-center">
                          <Image
                            src={box.image}
                            alt={box.title}
                            fill
                            unoptimized
                            className="object-contain p-1 hover:scale-105 transition-transform"
                          />
                        </div>

                        {/* Box Specifications */}
                        <div className="min-w-0 flex-1 space-y-1">
                          <h3 className="font-serif text-base sm:text-lg font-semibold text-[#0B2B1B] truncate">
                            {box.title}
                          </h3>
                          <div className="text-xs text-stone-500 space-y-0.5 font-sans">
                            <p>Size : {box.size}</p>
                            <p className="font-medium text-stone-700">Capacity: {box.capacity} items</p>
                          </div>
                          <div className="font-serif text-base sm:text-lg font-bold text-[#8C281F] pt-1">
                            ₹{box.price.toLocaleString("en-IN")}
                          </div>
                        </div>

                        {/* Radio Selection Indicator */}
                        <div className="shrink-0">
                          <div
                            className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                              isSelected
                                ? "border-[#8C281F] bg-[#8C281F] text-white"
                                : "border-stone-300 bg-white"
                            }`}
                          >
                            {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Load More Boxes Toggle Button */}
                <div className="text-center pt-4">
                  <button
                    onClick={() => setShowAllBoxes(!showAllBoxes)}
                    className="border border-stone-300 hover:border-stone-400 text-stone-700 bg-white px-6 py-2 rounded-full text-xs font-medium transition-all shadow-2xs hover:shadow-xs cursor-pointer"
                  >
                    {showAllBoxes ? "Show fewer boxes" : "Load more boxes"}
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: SELECT GOODIES */}
            {currentStep === 2 && (
              <div className="space-y-8 animate-in fade-in duration-300">
                {/* Header Title & Capacity Bar */}
                <div className="text-center max-w-2xl mx-auto space-y-2">
                  <div className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-widest text-stone-500 uppercase">
                    <Sparkles className="w-3.5 h-3.5 text-stone-400" />
                    <span>STEP 2</span>
                  </div>
                  <h2 className="font-serif text-3xl sm:text-4xl text-[#0B2B1B] font-medium">
                    Select Goodies
                  </h2>
                  <p className="text-xs sm:text-sm text-stone-600 font-sans">
                    Fill your <strong className="text-[#0B2B1B]">{selectedBox.title}</strong> (Capacity: {selectedBox.capacity} items).
                  </p>

                  {/* Capacity Progress Meter */}
                  <div className="max-w-md mx-auto mt-4 p-3 bg-stone-50 rounded-2xl border border-stone-200/80">
                    <div className="flex items-center justify-between text-xs font-medium text-stone-700 mb-1.5">
                      <span>Box Capacity</span>
                      <span className={totalItemsSelected > selectedBox.capacity ? "text-red-600 font-bold" : "text-[#0B2B1B]"}>
                        {totalItemsSelected} / {selectedBox.capacity} items filled
                      </span>
                    </div>
                    <div className="w-full h-2.5 bg-stone-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-300 ${
                          totalItemsSelected >= selectedBox.capacity ? "bg-amber-600" : "bg-[#0B2B1B]"
                        }`}
                        style={{
                          width: `${Math.min(100, (totalItemsSelected / selectedBox.capacity) * 100)}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Goodies Selection Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                  {GOODIES_OPTIONS.map((item) => {
                    const qty = selectedGoodies[item.id] || 0;
                    return (
                      <div
                        key={item.id}
                        className={`bg-white rounded-2xl p-4 border transition-all duration-200 flex flex-col justify-between ${
                          qty > 0 ? "border-[#0B2B1B] ring-1 ring-[#0B2B1B]/20 shadow-sm" : "border-stone-200/90 hover:border-stone-300"
                        }`}
                      >
                        <div>
                          <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-[#f5f3ec] p-2 mb-3">
                            <Image
                              src={item.image}
                              alt={item.name}
                              fill
                              unoptimized
                              className="object-contain p-2"
                            />
                            <span className="absolute top-2 left-2 bg-white/90 text-stone-700 text-[10px] font-semibold px-2 py-0.5 rounded-full border border-stone-200">
                              {item.category}
                            </span>
                          </div>

                          <h4 className="font-serif text-sm font-semibold text-[#0B2B1B] line-clamp-1">
                            {item.name}
                          </h4>
                          <p className="text-[11px] text-stone-500 line-clamp-2 mt-1 font-sans">
                            {item.description}
                          </p>
                        </div>

                        <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between">
                          <span className="font-serif text-sm font-bold text-[#8C281F]">
                            ₹{item.price.toLocaleString("en-IN")}
                          </span>

                          {qty === 0 ? (
                            <button
                              onClick={() => handleUpdateGoodyQty(item.id, 1)}
                              className="px-3 py-1.5 bg-[#0B2B1B] text-[#EED08E] hover:bg-[#16442D] text-xs font-semibold rounded-lg transition-all cursor-pointer flex items-center gap-1"
                            >
                              <Plus className="w-3.5 h-3.5" />
                              <span>Add</span>
                            </button>
                          ) : (
                            <div className="flex items-center gap-2 bg-stone-100 rounded-lg p-1">
                              <button
                                onClick={() => handleUpdateGoodyQty(item.id, -1)}
                                className="w-6 h-6 rounded bg-white text-stone-700 flex items-center justify-center hover:bg-stone-200 cursor-pointer"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="text-xs font-bold text-stone-900 w-4 text-center">
                                {qty}
                              </span>
                              <button
                                onClick={() => handleUpdateGoodyQty(item.id, 1)}
                                className="w-6 h-6 rounded bg-[#0B2B1B] text-white flex items-center justify-center hover:bg-[#16442D] cursor-pointer"
                              >
                                <Plus className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* STEP 3: PERSONALISE IT */}
            {currentStep === 3 && (
              <div className="space-y-8 animate-in fade-in duration-300 max-w-2xl mx-auto">
                <div className="text-center space-y-2">
                  <div className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-widest text-stone-500 uppercase">
                    <Sparkles className="w-3.5 h-3.5 text-stone-400" />
                    <span>STEP 3</span>
                  </div>
                  <h2 className="font-serif text-3xl sm:text-4xl text-[#0B2B1B] font-medium">
                    Personalise It
                  </h2>
                  <p className="text-xs sm:text-sm text-stone-600 font-sans">
                    Add a note or special detail for your recipient. Make your gift feel truly personal.
                  </p>
                </div>

                <div className="space-y-4 bg-stone-50 p-6 rounded-2xl border border-stone-200/80">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                      Recipient Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Priyanshu Sharma"
                      value={personalization.recipientName}
                      onChange={(e) => setPersonalization({ ...personalization, recipientName: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-stone-300 focus:border-[#0B2B1B] focus:ring-1 focus:ring-[#0B2B1B] text-sm bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                      Sender Name / From
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. With Love, Kapoor Family"
                      value={personalization.senderName}
                      onChange={(e) => setPersonalization({ ...personalization, senderName: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-stone-300 focus:border-[#0B2B1B] focus:ring-1 focus:ring-[#0B2B1B] text-sm bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                      Gift Card Message (Included Free)
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Write your heartfelt note here..."
                      value={personalization.giftNote}
                      onChange={(e) => setPersonalization({ ...personalization, giftNote: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-stone-300 focus:border-[#0B2B1B] focus:ring-1 focus:ring-[#0B2B1B] text-sm bg-white resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                      Custom Brass Plaque Inscription (Optional)
                    </label>
                    <input
                      type="text"
                      maxLength={30}
                      placeholder="Up to 30 characters (e.g. Happy Diwali 2026)"
                      value={personalization.brassPlaqueText}
                      onChange={(e) => setPersonalization({ ...personalization, brassPlaqueText: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-stone-300 focus:border-[#0B2B1B] focus:ring-1 focus:ring-[#0B2B1B] text-sm bg-white"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 4: REVIEW & PLACE ORDER */}
            {currentStep === 4 && (
              <div className="space-y-8 animate-in fade-in duration-300 max-w-3xl mx-auto">
                <div className="text-center space-y-2">
                  <div className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-widest text-stone-500 uppercase">
                    <Sparkles className="w-3.5 h-3.5 text-stone-400" />
                    <span>STEP 4</span>
                  </div>
                  <h2 className="font-serif text-3xl sm:text-4xl text-[#0B2B1B] font-medium">
                    Review &amp; Place Order
                  </h2>
                  <p className="text-xs sm:text-sm text-stone-600 font-sans">
                    Take a quick look at your custom hamper. Place your order and leave the rest to us.
                  </p>
                </div>

                <div className="bg-stone-50 rounded-2xl p-6 sm:p-8 border border-stone-200/90 space-y-6">
                  {/* Selected Box Summary */}
                  <div className="flex items-center gap-4 pb-4 border-b border-stone-200">
                    <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-white border border-stone-200 shrink-0 p-1">
                      <Image src={selectedBox.image} alt={selectedBox.title} fill className="object-contain" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-serif text-base font-bold text-[#0B2B1B]">{selectedBox.title}</h4>
                      <p className="text-xs text-stone-500">Size: {selectedBox.size} • Includes Hand Wrapping &amp; Card</p>
                    </div>
                    <span className="font-serif text-base font-bold text-[#8C6215]">₹{selectedBox.price.toLocaleString("en-IN")}</span>
                  </div>

                  {/* Selected Goodies Summary */}
                  <div>
                    <h5 className="text-xs font-bold uppercase tracking-wider text-stone-700 mb-3">
                      Selected Box Contents ({totalItemsSelected} items)
                    </h5>
                    {totalItemsSelected === 0 ? (
                      <p className="text-xs text-stone-400 italic">No goodies added yet. Go back to Step 2 to add items!</p>
                    ) : (
                      <div className="space-y-2">
                        {Object.entries(selectedGoodies).map(([goodyId, qty]) => {
                          const goody = GOODIES_OPTIONS.find((g) => g.id === goodyId);
                          if (!goody) return null;
                          return (
                            <div key={goodyId} className="flex items-center justify-between text-xs py-1.5 border-b border-stone-100 last:border-b-0">
                              <span className="text-stone-800 font-medium">{qty}x {goody.name}</span>
                              <span className="text-stone-600">₹{(goody.price * qty).toLocaleString("en-IN")}</span>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* Personalization Summary */}
                  <div className="pt-4 border-t border-stone-200 space-y-1 text-xs">
                    <h5 className="text-xs font-bold uppercase tracking-wider text-stone-700 mb-2">Gift Card &amp; Message</h5>
                    <p className="text-stone-700"><strong>To:</strong> {personalization.recipientName || "Valued Recipient"}</p>
                    <p className="text-stone-700"><strong>From:</strong> {personalization.senderName || "With Love"}</p>
                    {personalization.giftNote && <p className="text-stone-600 italic mt-1">&ldquo;{personalization.giftNote}&rdquo;</p>}
                  </div>

                  {/* Price Breakdown & Add to Cart Button */}
                  <div className="pt-6 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div>
                      <span className="text-xs text-stone-500 uppercase tracking-wider block">Grand Total</span>
                      <span className="font-serif text-3xl font-bold text-[#0B2B1B]">₹{grandTotal.toLocaleString("en-IN")}</span>
                    </div>

                    <button
                      onClick={handleAddCustomHamperToCart}
                      className="w-full sm:w-auto bg-[#0B2B1B] text-[#EED08E] hover:bg-[#16442D] px-8 py-3.5 rounded-full text-xs font-bold tracking-widest uppercase transition-all shadow-lg cursor-pointer flex items-center justify-center gap-2"
                    >
                      <Gift className="w-4 h-4" />
                      <span>{addedToCartSuccess ? "ADDED TO CART!" : "ADD CUSTOM HAMPER TO CART"}</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>

      {/* STICKY FLOATING BOTTOM BAR (Matching Screenshot 3) */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-stone-200 px-4 sm:px-8 py-3.5 shadow-2xl">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          {/* Left: Selected Box Info */}
          <div className="flex items-center gap-3 min-w-0">
            <div className="relative w-11 h-11 rounded-lg overflow-hidden bg-[#f5f3ec] border border-stone-200 shrink-0 p-1">
              <Image src={selectedBox.image} alt={selectedBox.title} fill className="object-contain" />
            </div>
            <div className="min-w-0">
              <h4 className="font-serif text-xs sm:text-sm font-bold text-[#0B2B1B] truncate">
                {selectedBox.title}
              </h4>
              <p className="text-[11px] text-stone-500 truncate font-sans">
                ₹{selectedBox.price.toLocaleString("en-IN")} • {totalItemsSelected}/{selectedBox.capacity} items filled
              </p>
            </div>
          </div>

          {/* Right: Total & Next Button */}
          <div className="flex items-center gap-4 shrink-0">
            <div className="text-right">
              <span className="text-[10px] text-stone-400 uppercase tracking-widest block">TOTAL</span>
              <span className="font-serif text-sm sm:text-lg font-bold text-stone-900 leading-none">
                ₹{grandTotal.toLocaleString("en-IN")}
              </span>
            </div>

            {currentStep < 4 ? (
              <button
                onClick={() => setCurrentStep((prev) => (prev + 1) as 1 | 2 | 3 | 4)}
                className="bg-[#121829] hover:bg-[#0B2B1B] text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-full text-xs font-bold uppercase tracking-wider transition-all shadow-md cursor-pointer flex items-center gap-2"
              >
                <span>Next</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleAddCustomHamperToCart}
                className="bg-[#0B2B1B] text-[#EED08E] hover:bg-[#16442D] px-6 sm:px-8 py-2.5 sm:py-3 rounded-full text-xs font-bold uppercase tracking-wider transition-all shadow-md cursor-pointer flex items-center gap-2"
              >
                <span>Add To Cart</span>
                <Check className="w-4 h-4 stroke-[3]" />
              </button>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
