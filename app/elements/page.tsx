"use client";

import { useState, useMemo, useEffect, useRef, Suspense } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { useCart } from "@/lib/cart-context";
import {
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
  X,
} from "lucide-react";

interface BoxOption {
  id: string;
  title: string;
  size: string;
  capacity: number;
  price: number;
  image: string;
  description?: string;
  active?: boolean;
}

interface GoodyOption {
  id: string;
  name: string;
  category: "Incense" | "Brassware" | "Keepsake" | "Wellness" | "Candle";
  price: number;
  image: string;
  description: string;
}

const PRODUCT_TO_BOX_MAP: Record<string, string> = {
  "mdf-gift-box": "celebration",
  "marble-gift-box": "heritage",
  "5-elements-suite": "celebration",
  "empty-marble-box": "wood-small",
  "wicker-silk-incense-basket": "rustic-basket",
  "sacred-buddha-wooden-suite": "wood-small",
  "royal-tea-incense-leatherette-hamper": "jute-premium",
  "heirloom-slatted-wooden-trunk": "wood-large",
  "devotional-brass-puja-tray": "jute-premium",
  "mindfulness-crystal-sanctuary-crate": "wood-large",
  "festive-lotus-brass-leatherette-tray": "jute-premium",
  "celebration-keepsake-basket": "rustic-basket",
  "ancient-mantra-wooden-scroll-box": "wood-large",
  "zen-boat-botanical-gift-set": "wood-small",
  "golden-lotus-saffron-leatherette-suite": "jute-yellow",
};

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
    id: "summer-breeze",
    name: "Summer Breeze Refill",
    category: "Candle",
    price: 599,
    image: "/images/product/fire-front.png",
    description: "Summer Breeze is like a deep breath of fresh ocean air and citrus.",
  },
  {
    id: "tropical-island",
    name: "Tropical Island Refill",
    category: "Candle",
    price: 599,
    image: "/images/product/earth-front.png",
    description: "Take a little escape with Tropical Island coconut & vanilla blooms.",
  },
  {
    id: "memory-chamber",
    name: "Memory Chamber Refill",
    category: "Candle",
    price: 599,
    image: "/images/product/water-front.png",
    description: "Let Memory Chamber wrap you in a warm soothing sandalwood scent.",
  },
  {
    id: "amalfi-coast",
    name: "Amalfi Coast Refill",
    category: "Candle",
    price: 599,
    image: "/images/product/space-front.png",
    description: "Inspired by dreamy coastal mornings with Italian lemon & sea salt.",
  },
  {
    id: "house-of-gaea",
    name: "House Of Gaea",
    category: "Candle",
    price: 599,
    image: "/images/product/image.png",
    description: "Gravity Of Hearts Refill Made with a 100% natural soy wax blend.",
  },
  {
    id: "urban-nordic",
    name: "The Urban Nordic",
    category: "Wellness",
    price: 269,
    image: "/images/product/image7.png",
    description: "Eco-Friendly Lemongrass Paper Cover Notebook for daily notes.",
  },
  {
    id: "bili-hu-coffee",
    name: "Bili Hu Coffee, Mokapot Coffee...",
    category: "Wellness",
    price: 749,
    image: "/images/product/image8.png",
    description: "Bili Hu sources its specialty-grade coffee beans directly.",
  },
  {
    id: "phool-incense",
    name: "Phool Natural Incense Sticks Refill Pack -...",
    category: "Incense",
    price: 245,
    image: "/images/product/air-front.png",
    description: "Nagchampa Incense Sticks emanate a sacred floral temple aroma.",
  },
  {
    id: "twinings-tea",
    name: "Twinings The Feel Good Collection...",
    category: "Wellness",
    price: 1079,
    image: "/images/product/image9.png",
    description: "A thoughtful blend of wellness in every single tea sachet.",
  },
  {
    id: "vanilla-diffuser",
    name: "Soul & Scents 50ml Vanilla Reed Diffuse...",
    category: "Wellness",
    price: 339,
    image: "/images/product/turtle-holder-clean.png",
    description: "This diffuser blends creamy vanilla with rich amber warmth.",
  },
  {
    id: "mahogany-diffuser",
    name: "Soul & Scents 50ml Mahogany Reed...",
    category: "Wellness",
    price: 429,
    image: "/images/product/mdf-box-clean.png",
    description: "Experience the warm, comforting scent of dark mahogany wood.",
  },
  {
    id: "llum-teakwood",
    name: "Llum Mahogany Teakwood 30ml Ree...",
    category: "Wellness",
    price: 349,
    image: "/images/product/marble-box-clean.png",
    description: "ORGANIC TOXIN FREE: Llum reed diffuser with natural rattan reeds.",
  },
];

function CustomiseContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { cartCount, setIsCartOpen, addToCart } = useCart();

  // Customizer Step State: 1 | 2 | 3 | 4
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);

  // Dynamic Boxes & Goodies (syncing with admin customize configurations)
  const [boxes, setBoxes] = useState<BoxOption[]>(BOX_OPTIONS);
  const [goodiesList, setGoodiesList] = useState<GoodyOption[]>(GOODIES_OPTIONS);

  // Hydrate from kurma_custom_boxes and kurma_custom_goodies (administered exclusively by admin)
  useEffect(() => {
    const loadAdminConfigurations = () => {
      try {
        const storedBoxes = localStorage.getItem("kurma_custom_boxes");
        if (storedBoxes) {
          const parsed = JSON.parse(storedBoxes);
          if (Array.isArray(parsed) && parsed.length > 0) {
            const activeOnly = parsed.filter((b: BoxOption) => b.active !== false);
            if (activeOnly.length > 0) {
              setBoxes(activeOnly);
            }
          }
        }

        const storedGoodies = localStorage.getItem("kurma_custom_goodies");
        if (storedGoodies) {
          const parsed = JSON.parse(storedGoodies);
          if (Array.isArray(parsed) && parsed.length > 0) {
            const activeOnly = parsed.filter((g: GoodyOption & { active?: boolean }) => g.active !== false);
            if (activeOnly.length > 0) {
              setGoodiesList(activeOnly);
            }
          }
        }
      } catch {}
    };

    loadAdminConfigurations();

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "kurma_custom_boxes" || e.key === "kurma_custom_goodies") {
        loadAdminConfigurations();
      }
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("kurma_custom_boxes_updated", loadAdminConfigurations);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("kurma_custom_boxes_updated", loadAdminConfigurations);
    };
  }, []);

  // Step 1: Selected Box (null by default, or auto-selected from URL searchParams)
  const [selectedBox, setSelectedBox] = useState<BoxOption | null>(null);
  const [showAllBoxes, setShowAllBoxes] = useState(false);

  // Synchronize selectedBox if admin edited its price, capacity, or details
  useEffect(() => {
    if (selectedBox) {
      const fresh = boxes.find((b) => b.id === selectedBox.id);
      if (fresh) {
        if (
          fresh.title !== selectedBox.title ||
          fresh.price !== selectedBox.price ||
          fresh.capacity !== selectedBox.capacity ||
          fresh.size !== selectedBox.size ||
          fresh.image !== selectedBox.image ||
          fresh.description !== selectedBox.description
        ) {
          setSelectedBox(fresh);
        }
      }
    }
  }, [boxes, selectedBox]);

  // Auto-select box if URL searchParams contain box or product ID
  useEffect(() => {
    const rawParam = searchParams.get("box") || searchParams.get("boxId") || searchParams.get("product") || searchParams.get("item");
    if (!rawParam) return;

    const paramLower = rawParam.toLowerCase().trim();
    const mappedBoxId = PRODUCT_TO_BOX_MAP[paramLower];

    let matchedBox = boxes.find((b) => b.id.toLowerCase() === paramLower);

    if (!matchedBox && mappedBoxId) {
      matchedBox = boxes.find((b) => b.id.toLowerCase() === mappedBoxId.toLowerCase());
    }

    if (!matchedBox) {
      matchedBox = boxes.find(
        (b) => b.title.toLowerCase().includes(paramLower) || paramLower.includes(b.id.toLowerCase())
      );
    }

    if (!matchedBox && rawParam) {
      matchedBox = boxes[0];
    }

    if (matchedBox) {
      setSelectedBox(matchedBox);
      setCurrentStep(1);
      setTimeout(() => {
        const el = document.getElementById("stepper-header");
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 150);
    }
  }, [searchParams, boxes]);

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

  // Step 2: Product Detail Modal Popup State
  const [selectedProductModal, setSelectedProductModal] = useState<GoodyOption | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelectedProductModal(null);
      }
    };
    if (selectedProductModal) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [selectedProductModal]);

  // Calculate filled items in box
  const totalItemsSelected = useMemo(() => {
    return Object.values(selectedGoodies).reduce((sum, qty) => sum + qty, 0);
  }, [selectedGoodies]);

  // Helper to get goody by ID (from dynamic admin list or fallback)
  const getGoodyById = (id: string): GoodyOption | undefined => {
    return goodiesList.find((g) => g.id === id) || GOODIES_OPTIONS.find((g) => g.id === id);
  };

  // Calculate total price: Box Price + Goodies Total
  const goodiesPriceTotal = useMemo(() => {
    return Object.entries(selectedGoodies).reduce((sum, [goodyId, qty]) => {
      const item = getGoodyById(goodyId);
      return sum + (item ? item.price * qty : 0);
    }, 0);
  }, [selectedGoodies, goodiesList]);

  const boxPrice = selectedBox ? selectedBox.price : 0;
  const grandTotal = boxPrice + goodiesPriceTotal;

  // Visible box options (first 6 or all)
  const visibleBoxes = showAllBoxes ? boxes : boxes.slice(0, 6);

  const isFirstMount = useRef(true);

  const scrollToStepContent = (step: 1 | 2 | 3 | 4) => {
    const targetMap: Record<number, string> = {
      1: "step-1-choose-box",
      2: "step-2-fill-box",
      3: "make-it-personal-heading",
      4: "step-4-review-hamper",
    };

    const targetId = targetMap[step] || "stepper-header";

    const doScroll = () => {
      const el = document.getElementById(targetId) || document.getElementById("stepper-header");
      if (el) {
        const headerOffset = 85;
        const elementPosition = el.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        window.scrollTo({
          top: Math.max(0, offsetPosition),
          behavior: "smooth",
        });
      }
    };

    doScroll();
    requestAnimationFrame(doScroll);
    setTimeout(doScroll, 40);
    setTimeout(doScroll, 120);
  };

  const handleStepChange = (step: 1 | 2 | 3 | 4) => {
    setCurrentStep(step);
    scrollToStepContent(step);
  };

  useEffect(() => {
    if (isFirstMount.current) {
      isFirstMount.current = false;
      return;
    }
    scrollToStepContent(currentStep);
  }, [currentStep]);

  const handleSelectBox = (box: BoxOption) => {
    setSelectedBox(box);
    handleStepChange(2);
  };

  const handleUpdateGoodyQty = (goodyId: string, delta: number) => {
    setSelectedGoodies((prev) => {
      const currentQty = prev[goodyId] || 0;
      const newQty = Math.max(0, currentQty + delta);
      const capacityLimit = selectedBox ? selectedBox.capacity : 99;

      // Check capacity limit
      if (delta > 0 && totalItemsSelected >= capacityLimit) {
        alert(`Your selected box (${selectedBox ? selectedBox.title : "hamper"}) holds up to ${capacityLimit} items. Upgrade your box in Step 1 to add more!`);
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
    if (!selectedBox) {
      alert("Please select a gift box in Step 1 before adding your custom hamper to cart.");
      setCurrentStep(1);
      return;
    }

    const selectedItems = Object.entries(selectedGoodies)
      .map(([goodyId, qty]) => {
        const item = getGoodyById(goodyId);
        return item && qty > 0 ? { ...item, quantity: qty } : null;
      })
      .filter(Boolean);

    const goodiesSummaryList = selectedItems
      .map((item) => (item ? `${item.quantity}x ${item.name}` : ""))
      .filter(Boolean)
      .join(", ");

    // Save full custom hamper data for the dedicated checkout gift page
    const hamperData = {
      box: selectedBox,
      goodies: selectedItems,
      personalization,
      grandTotal,
      boxPrice,
      goodiesPriceTotal,
    };

    try {
      localStorage.setItem("kurma_custom_hamper", JSON.stringify(hamperData));
    } catch (e) {
      console.error(e);
    }

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
    setIsCartOpen(false);

    // Automatically navigate to the dedicated Checkout Gift page
    router.push("/checkout-gift");
  };



  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-stone-900 selection:bg-[#eed08e] selection:text-[#072515]">
      {/* Top Navigation */}
      <Navbar cartCount={cartCount} onOpenCart={() => setIsCartOpen(true)} />

      <main className="flex-1 w-full">
        {/* HERO BANNER SECTION (Deep Green Theme matching Website) */}
        <section className="relative w-full bg-[#072515] bg-[url('/images/textures/green-texture.png')] bg-repeat text-white border-b border-[#eed08e]/20 overflow-hidden py-12 sm:py-16 lg:py-20 px-4 sm:px-8 md:px-12">
          {/* Subtle Gold Dot Pattern */}
          <div className="absolute inset-0 bg-[radial-gradient(#eed08e_0.5px,transparent_0.5px)] [background-size:24px_24px] opacity-10 pointer-events-none" />

          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            {/* Left Content */}
            <div className="lg:col-span-6 space-y-5 text-left">
              <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.25em] text-[#eed08e] uppercase">
                <Image src="/icon.png" alt="Kurma Emblem" width={16} height={16} className="w-4 h-4 object-contain" />
                <span>CUSTOMISE YOUR GIFT</span>
              </div>

              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-normal text-white leading-[1.15] tracking-tight">
                Born from a love of,<br />
                <span className="italic font-serif font-normal text-[#eed08e]">beautiful gifting</span>
              </h1>

              <div className="pt-2">
                <button
                  onClick={() => scrollToStepContent(currentStep)}
                  className="bg-[#eed08e] hover:bg-white text-[#072515] px-7 py-3.5 rounded-full text-xs font-bold tracking-widest uppercase transition-all shadow-lg hover:shadow-xl inline-flex items-center gap-2 cursor-pointer group"
                >
                  <span>START BUILDING</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>

            {/* Right Hero Image (Restored layout with deep green container frame) */}
            <div className="lg:col-span-6 relative aspect-[4/3] sm:aspect-[16/10] lg:aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl border border-white/20 bg-[#04190e]">
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

        {/* STEPPER PROGRESS HEADER & STEP CONTAINER (Matching User Screenshot 100%) */}
        <section id="stepper-header" className="max-w-6xl mx-auto px-3 sm:px-6 md:px-8 pt-6 sm:pt-12 pb-4 relative z-20 scroll-mt-20 sm:scroll-mt-24">
          <div className="bg-white rounded-2xl sm:rounded-3xl border border-stone-200/90 p-4 sm:p-8 md:p-12 shadow-xl">
            {/* 4-Step Stepper Progress Bar */}
            <div className="relative mb-6 sm:mb-10 pb-6 sm:pb-8 border-b border-stone-200/80">
              {/* Connecting Horizontal Line */}
              <div className="absolute top-5 left-[12%] right-[12%] h-[1.5px] bg-stone-200 -z-0 hidden sm:block" />

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-4 relative z-10 text-center">
                {/* STEP 1 */}
                <button
                  onClick={() => handleStepChange(1)}
                  className="flex flex-col items-center cursor-pointer group"
                >
                  <div
                    className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-serif text-xs sm:text-sm font-bold transition-all duration-300 ${
                      currentStep === 1
                        ? "bg-[#121829] text-white shadow-md scale-110"
                        : currentStep > 1
                        ? "bg-[#0B2B1B] text-[#EED08E]"
                        : "bg-white text-stone-400 border border-stone-300 group-hover:border-stone-400"
                    }`}
                  >
                    {currentStep > 1 ? <Check className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" /> : "1"}
                  </div>
                  <span
                    className={`font-serif text-xs sm:text-base lg:text-lg font-semibold mt-2 sm:mt-3 transition-colors ${
                      currentStep === 1 ? "text-[#0B2B1B]" : "text-stone-700"
                    }`}
                  >
                    Choose your box
                  </span>
                  <span className="text-[11px] sm:text-xs text-stone-500 mt-1 max-w-[170px] leading-relaxed hidden sm:block">
                    Pick a tray or basket that feels right for your gift Start with a base that sets the tone
                  </span>
                </button>

                {/* STEP 2 */}
                <button
                  onClick={() => handleStepChange(2)}
                  className="flex flex-col items-center cursor-pointer group"
                >
                  <div
                    className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-serif text-xs sm:text-sm font-bold transition-all duration-300 ${
                      currentStep === 2
                        ? "bg-[#121829] text-white shadow-md scale-110"
                        : currentStep > 2
                        ? "bg-[#0B2B1B] text-[#EED08E]"
                        : "bg-white text-stone-400 border border-stone-300 group-hover:border-stone-400"
                    }`}
                  >
                    {currentStep > 2 ? <Check className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" /> : "2"}
                  </div>
                  <span
                    className={`font-serif text-xs sm:text-base lg:text-lg font-semibold mt-2 sm:mt-3 transition-colors ${
                      currentStep === 2 ? "text-[#0B2B1B]" : "text-stone-700"
                    }`}
                  >
                    Select Goodies
                  </span>
                  <span className="text-[11px] sm:text-xs text-stone-500 mt-1 max-w-[170px] leading-relaxed hidden sm:block">
                    Add items you love and build it your way Create a hamper that feels thoughtful
                  </span>
                </button>

                {/* STEP 3 */}
                <button
                  onClick={() => handleStepChange(3)}
                  className="flex flex-col items-center cursor-pointer group"
                >
                  <div
                    className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-serif text-xs sm:text-sm font-bold transition-all duration-300 ${
                      currentStep === 3
                        ? "bg-[#121829] text-white shadow-md scale-110"
                        : currentStep > 3
                        ? "bg-[#0B2B1B] text-[#EED08E]"
                        : "bg-white text-stone-400 border border-stone-300 group-hover:border-stone-400"
                    }`}
                  >
                    {currentStep > 3 ? <Check className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" /> : "3"}
                  </div>
                  <span
                    className={`font-serif text-xs sm:text-base lg:text-lg font-semibold mt-2 sm:mt-3 transition-colors ${
                      currentStep === 3 ? "text-[#0B2B1B]" : "text-stone-700"
                    }`}
                  >
                    Personalise It
                  </span>
                  <span className="text-[11px] sm:text-xs text-stone-500 mt-1 max-w-[170px] leading-relaxed hidden sm:block">
                    Add a note or special detail for your recipient Make your gift feel truly personal
                  </span>
                </button>

                {/* STEP 4 */}
                <button
                  onClick={() => handleStepChange(4)}
                  className="flex flex-col items-center cursor-pointer group"
                >
                  <div
                    className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-serif text-xs sm:text-sm font-bold transition-all duration-300 ${
                      currentStep === 4
                        ? "bg-[#121829] text-white shadow-md scale-110"
                        : "bg-white text-stone-400 border border-stone-300 group-hover:border-stone-400"
                    }`}
                  >
                    4
                  </div>
                  <span
                    className={`font-serif text-xs sm:text-base lg:text-lg font-semibold mt-2 sm:mt-3 transition-colors ${
                      currentStep === 4 ? "text-[#0B2B1B]" : "text-stone-700"
                    }`}
                  >
                    Review &amp; Place Order
                  </span>
                  <span className="text-[11px] sm:text-xs text-stone-500 mt-1 max-w-[170px] leading-relaxed hidden sm:block">
                    Take a quick look at your hamper Place your order and leave the rest to us
                  </span>
                </button>
              </div>
            </div>

            {/* STEP 1: CHOOSE YOUR BOX CONTENT */}
            {currentStep === 1 && (
              <div id="step-1-choose-box" className="space-y-8 animate-in fade-in duration-300 scroll-mt-24">
                {/* Header Title Matching Screenshot */}
                <div className="text-center max-w-2xl mx-auto space-y-3 pt-4">
                  <div className="inline-flex items-center gap-1.5 text-xs font-medium tracking-wider text-stone-500 uppercase">
                    <Image src="/icon.png" alt="Kurma Emblem" width={14} height={14} className="w-3.5 h-3.5 object-contain" />
                    <span>STEP 1</span>
                  </div>
                  <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl text-[#0B2B1B] font-medium tracking-tight">
                    Choose your box
                  </h2>
                  <p className="text-xs sm:text-sm text-stone-600 font-sans leading-relaxed max-w-xl mx-auto">
                    Pick the size that fits your gifting moment. Includes: Gift Packaging, Notecard and Hand Wrapping
                  </p>
                </div>

                {/* 2-Column Responsive Box Selection Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
                  {visibleBoxes.map((box) => {
                    const isSelected = selectedBox?.id === box.id;
                    return (
                      <div
                        key={box.id}
                        onClick={() => handleSelectBox(box)}
                        className={`rounded-2xl p-4 sm:p-5 flex items-center gap-4 cursor-pointer transition-all duration-200 select-none group ${
                          isSelected
                            ? "border-2 border-[#8C281F] bg-[#FAF5F5]/40 shadow-md scale-[1.01]"
                            : "border border-stone-200/90 bg-white hover:border-[#8C281F]/60 hover:shadow-xs hover:scale-[1.005]"
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
                <div className="text-center pt-2">
                  <button
                    onClick={() => setShowAllBoxes(!showAllBoxes)}
                    className="border border-stone-300 hover:border-stone-400 text-stone-700 bg-white px-6 py-2 rounded-full text-xs font-medium transition-all shadow-2xs hover:shadow-xs cursor-pointer"
                  >
                    {showAllBoxes ? "Show fewer boxes" : "Load more boxes"}
                  </button>
                </div>

                {/* Dynamically Revealed Summary Card Inside Step 1 (Matching User Screenshot 100%) */}
                {selectedBox ? (
                  <div className="pt-6 border-t border-stone-200/80 space-y-4 animate-in fade-in slide-in-from-bottom-3 duration-300">
                    <div className="bg-white rounded-3xl border border-stone-200/90 p-4 sm:p-6 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
                      {/* Left: Thumbnail & Box Details */}
                      <div className="flex items-center gap-4 min-w-0 w-full sm:w-auto">
                        <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-2xl overflow-hidden bg-[#F5F3EC] border border-stone-200 shrink-0 p-1">
                          <Image
                            src={selectedBox.image}
                            alt={selectedBox.title}
                            fill
                            unoptimized
                            className="object-contain"
                          />
                        </div>
                        <div className="min-w-0">
                          <h4 className="font-serif text-base sm:text-lg font-bold text-[#0B2B1B] truncate">
                            {selectedBox.title}
                          </h4>
                          <p className="text-xs sm:text-sm text-stone-500 font-sans mt-0.5">
                            ₹{selectedBox.price.toLocaleString("en-IN")}
                          </p>
                        </div>
                      </div>

                      {/* Right: Vertical Separator & Total Price */}
                      <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-stone-100">
                        <div className="hidden sm:block h-10 w-[1px] bg-stone-200" />
                        <div className="text-left sm:text-right">
                          <span className="text-[10px] text-stone-400 uppercase tracking-widest block font-sans font-medium">
                            TOTAL
                          </span>
                          <span className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 leading-none">
                            ₹{grandTotal.toLocaleString("en-IN")}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Next Step Action Button */}
                    <div className="flex justify-end pt-2">
                      <button
                        onClick={() => handleStepChange(2)}
                        className="bg-[#121829] hover:bg-[#0B2B1B] text-white px-8 sm:px-10 py-3 rounded-full text-sm font-semibold tracking-wider uppercase transition-all shadow-md hover:shadow-lg cursor-pointer flex items-center gap-2"
                      >
                        <span>Next</span>
                        <ChevronRight className="w-4 h-4 stroke-[2.5]" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center pt-2 pb-4">
                    <p className="text-xs sm:text-sm text-stone-400 italic">
                      Please select a gift box above to continue
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* STEP 2: SELECT GOODIES (Matching User Screenshots 1, 2 & 3) */}
            {currentStep === 2 && (
              <div id="step-2-fill-box" className="space-y-8 animate-in fade-in duration-300 scroll-mt-24">
                {/* Header Title Matching Screenshot 1 */}
                <div className="text-center max-w-2xl mx-auto space-y-3 pt-4">
                  <div className="inline-flex items-center gap-1.5 text-xs font-medium tracking-wider text-stone-500 uppercase">
                    <Image src="/icon.png" alt="Kurma Emblem" width={14} height={14} className="w-3.5 h-3.5 object-contain" />
                    <span>STEP 2</span>
                  </div>
                  <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl text-[#0B2B1B] font-medium tracking-tight">
                    Fill your box
                  </h2>
                  <p className="text-xs sm:text-sm text-stone-600 font-sans leading-relaxed max-w-xl mx-auto">
                    Pick up to {selectedBox ? selectedBox.capacity : 4} items that fit your hamper
                  </p>
                </div>

                {/* Goodies Selection Grid Matching Screenshots 2 & 3 */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-5">
                  {goodiesList.map((item) => {
                    const qty = selectedGoodies[item.id] || 0;
                    return (
                      <div
                        key={item.id}
                        onClick={() => setSelectedProductModal(item)}
                        className={`bg-white rounded-2xl border transition-all duration-200 overflow-hidden flex flex-col justify-between group shadow-2xs hover:shadow-md cursor-pointer ${
                          qty > 0 ? "border-[#0B2B1B] ring-1 ring-[#0B2B1B]" : "border-stone-200/90 hover:border-stone-400"
                        }`}
                      >
                        <div>
                          {/* Vertical Portrait Image Canvas matching home page (Aspect 3:4) */}
                          <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#f5f3ec] rounded-2xl flex items-center justify-center p-2 sm:p-3 mb-3">
                            <Image
                              src={item.image}
                              alt={item.name}
                              fill
                              unoptimized
                              className="object-contain object-center p-2 sm:p-3 group-hover:scale-105 transition-transform duration-500"
                            />
                            {/* Subtle Quick View hover pill badge */}
                            <div className="absolute inset-x-3 bottom-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex justify-center pointer-events-none">
                              <span className="bg-[#0B2B1B]/90 text-[#eed08e] text-[10px] font-semibold tracking-wider uppercase px-3 py-1 rounded-full shadow-md flex items-center gap-1">
                                <span>View Details</span>
                              </span>
                            </div>
                          </div>

                          <div className="px-4">
                            <h4 className="font-serif text-sm font-semibold text-[#0B2B1B] line-clamp-1 group-hover:text-[#8b5f10] transition-colors">
                              {item.name}
                            </h4>
                            <p className="text-[11px] text-stone-500 line-clamp-1 mt-0.5 font-sans">
                              {item.description}
                            </p>
                          </div>
                        </div>

                        {/* Card Footer: Price & Dark Plus Action Button */}
                        <div
                          className="px-4 pb-4 pt-3 flex items-center justify-between"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <span className="font-serif text-sm font-bold text-stone-900">
                            ₹{item.price.toLocaleString("en-IN")}
                          </span>

                          {qty === 0 ? (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleUpdateGoodyQty(item.id, 1);
                              }}
                              aria-label={`Add ${item.name}`}
                              className="w-8 h-8 rounded-full bg-[#121829] hover:bg-[#0B2B1B] text-white flex items-center justify-center transition-all shadow-2xs cursor-pointer active:scale-95"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          ) : (
                            <div className="flex items-center gap-1.5 bg-stone-100 rounded-full p-1 border border-stone-200">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleUpdateGoodyQty(item.id, -1);
                                }}
                                className="w-6 h-6 rounded-full bg-white text-stone-700 flex items-center justify-center hover:bg-stone-200 cursor-pointer text-xs font-bold"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="text-xs font-bold text-stone-900 px-1">
                                {qty}
                              </span>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleUpdateGoodyQty(item.id, 1);
                                }}
                                className="w-6 h-6 rounded-full bg-[#121829] text-white flex items-center justify-center hover:bg-[#0B2B1B] cursor-pointer text-xs font-bold"
                              >
                                <Plus className="w-4 h-4" />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Load More Products Button Matching Screenshot 3 */}
                <div className="text-center pt-2">
                  <button
                    onClick={() => {}}
                    className="border border-stone-300 hover:border-stone-400 text-stone-700 bg-white px-6 py-2 rounded-full text-xs font-medium transition-all shadow-2xs cursor-pointer"
                  >
                    Load more products
                  </button>
                </div>

                {/* Selected Box & Added Goodies Summary Card */}
                {selectedBox && (
                  <div className="pt-4">
                    <div className="bg-white rounded-3xl border border-stone-200/90 p-4 sm:p-6 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-4">
                      {/* Left: Selected Box Info */}
                      <div className="flex items-center gap-4 min-w-0 w-full md:w-auto shrink-0">
                        <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-2xl overflow-hidden bg-[#F5F3EC] border border-stone-200 shrink-0 p-1">
                          <Image
                            src={selectedBox.image}
                            alt={selectedBox.title}
                            fill
                            unoptimized
                            className="object-contain"
                          />
                        </div>
                        <div className="min-w-0">
                          <h4 className="font-serif text-base font-bold text-[#0B2B1B] truncate">
                            {selectedBox.title}
                          </h4>
                          <p className="text-xs text-stone-500 font-sans mt-0.5">
                            ₹{selectedBox.price.toLocaleString("en-IN")}
                          </p>
                        </div>
                      </div>

                      {/* Middle: Added Goodies Item List with Quantity Controls */}
                      <div className="flex-1 max-w-full overflow-x-auto py-1 px-2 scrollbar-thin">
                        <div className="flex items-center gap-3">
                          {Object.entries(selectedGoodies).map(([goodyId, qty]) => {
                            const goody = getGoodyById(goodyId);
                            if (!goody || qty === 0) return null;
                            return (
                              <div
                                key={goodyId}
                                className="relative bg-stone-50 border border-stone-200/90 rounded-2xl p-2.5 flex items-center gap-3 shrink-0 min-w-[240px]"
                              >
                                <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-white border border-stone-200 shrink-0 p-0.5">
                                  <Image src={goody.image} alt={goody.name} fill className="object-contain" />
                                </div>

                                <div className="min-w-0 flex-1">
                                  <h5 className="font-serif text-xs font-semibold text-[#0B2B1B] truncate">
                                    {goody.name}
                                  </h5>
                                  <p className="text-[10px] text-stone-500 font-sans">
                                    ₹{goody.price.toLocaleString("en-IN")}
                                  </p>

                                  <div className="flex items-center gap-1.5 mt-1">
                                    <button
                                      onClick={() => handleUpdateGoodyQty(goodyId, -1)}
                                      className="w-4 h-4 rounded-full bg-white border border-stone-300 text-stone-700 flex items-center justify-center text-[10px] font-bold hover:bg-stone-100 cursor-pointer"
                                    >
                                      -
                                    </button>
                                    <span className="text-[11px] font-bold text-stone-900">{qty}</span>
                                    <button
                                      onClick={() => handleUpdateGoodyQty(goodyId, 1)}
                                      className="w-4 h-4 rounded-full bg-white border border-stone-300 text-stone-700 flex items-center justify-center text-[10px] font-bold hover:bg-stone-100 cursor-pointer"
                                    >
                                      +
                                    </button>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Right: Vertical Separator & Total */}
                      <div className="flex items-center justify-between md:justify-end gap-6 w-full md:w-auto pt-2 md:pt-0 border-t md:border-t-0 border-stone-100 shrink-0">
                        <div className="hidden md:block h-10 w-[1px] bg-stone-200" />
                        <div className="text-left md:text-right">
                          <span className="text-[10px] text-stone-400 uppercase tracking-widest block font-sans font-medium">
                            TOTAL
                          </span>
                          <span className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 leading-none">
                            ₹{grandTotal.toLocaleString("en-IN")}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Bottom Navigation Buttons (Back & Next) Matching Screenshot 3 */}
                <div className="flex items-center justify-between pt-6 border-t border-stone-200/80 mt-6">
                  <button
                    onClick={() => handleStepChange(1)}
                    className="border border-stone-800 text-stone-800 hover:bg-stone-100 px-8 py-2.5 rounded-full text-xs sm:text-sm font-semibold uppercase tracking-wider transition-all cursor-pointer"
                  >
                    Back
                  </button>

                  <button
                    onClick={() => handleStepChange(3)}
                    className="bg-[#121829] hover:bg-[#0B2B1B] text-white px-8 py-2.5 rounded-full text-xs sm:text-sm font-semibold uppercase tracking-wider transition-all shadow-md cursor-pointer"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: MAKE IT PERSONAL (Matching User Screenshots 1, 2 & 3) */}
            {currentStep === 3 && (
              <div id="make-it-personal-form" className="space-y-8 animate-in fade-in duration-300 max-w-4xl mx-auto scroll-mt-24">
                {/* Header Title Matching Screenshot 1 */}
                <div id="make-it-personal-heading" className="text-center max-w-2xl mx-auto space-y-3 pt-4 scroll-mt-24">
                  <div className="inline-flex items-center gap-1.5 text-xs font-medium tracking-wider text-stone-500 uppercase">
                    <Image src="/icon.png" alt="Kurma Emblem" width={14} height={14} className="w-3.5 h-3.5 object-contain" />
                    <span>STEP 3</span>
                  </div>
                  <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl text-[#0B2B1B] font-medium tracking-tight">
                    Make it personal
                  </h2>
                  <p className="text-xs sm:text-sm text-stone-600 font-sans leading-relaxed max-w-xl mx-auto">
                    Free with every gift box — no upsell.
                  </p>
                </div>

                {/* Personalisation Form Fields Matching Screenshots 1 & 2 */}
                <div className="max-w-2xl mx-auto space-y-6 pt-2">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <div>
                      <label className="block font-serif text-sm font-semibold text-stone-800 mb-2">
                        Recipient name
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Riya"
                        value={personalization.recipientName}
                        onChange={(e) => setPersonalization({ ...personalization, recipientName: e.target.value })}
                        className="w-full px-5 py-3.5 rounded-2xl bg-[#FAF5E9] border-none text-stone-900 placeholder:text-stone-400 font-sans focus:outline-none focus:ring-2 focus:ring-[#0B2B1B]/20 text-sm sm:text-base shadow-2xs"
                      />
                    </div>

                    <div>
                      <label className="block font-serif text-sm font-semibold text-stone-800 mb-2">
                        Sender name
                      </label>
                      <input
                        type="text"
                        placeholder="From"
                        value={personalization.senderName}
                        onChange={(e) => setPersonalization({ ...personalization, senderName: e.target.value })}
                        className="w-full px-5 py-3.5 rounded-2xl bg-[#FAF5E9] border-none text-stone-900 placeholder:text-stone-400 font-sans focus:outline-none focus:ring-2 focus:ring-[#0B2B1B]/20 text-sm sm:text-base shadow-2xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-serif text-sm font-semibold text-stone-800 mb-2">
                      Personal note
                    </label>
                    <textarea
                      rows={4}
                      placeholder="A few warm words..."
                      value={personalization.giftNote}
                      onChange={(e) => setPersonalization({ ...personalization, giftNote: e.target.value })}
                      className="w-full px-5 py-3.5 rounded-2xl bg-[#FAF5E9] border-none text-stone-900 placeholder:text-stone-400 font-sans focus:outline-none focus:ring-2 focus:ring-[#0B2B1B]/20 text-sm sm:text-base resize-none shadow-2xs"
                    />
                  </div>

                  {/* Complimentary Greeting Card Card Matching Personal Note Width */}
                  <div>
                    <label className="block font-serif text-sm font-semibold text-stone-800 mb-2">
                      Greeting card
                    </label>
                    <div className="w-full rounded-2xl border border-stone-200/90 bg-white p-3.5 sm:p-4 shadow-2xs hover:shadow-md transition-all group flex flex-row items-center gap-4 sm:gap-5">
                      {/* Vertical Aspect Image on the Left */}
                      <div className="relative w-24 sm:w-36 md:w-40 aspect-[3/4] rounded-xl overflow-hidden bg-[#FAF5E9] shrink-0 border border-stone-100 shadow-2xs">
                        <Image
                          src="/images/product/image.png"
                          alt="Kurma Classic Greeting Card"
                          fill
                          unoptimized
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>

                      {/* Card Details & Pricing on the Right */}
                      <div className="flex-1 min-w-0 flex flex-col justify-between self-stretch py-0.5">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] uppercase font-bold tracking-widest text-[#8b5f10] bg-[#FAF5E9] px-2.5 py-0.5 rounded-full border border-[#eed08e]/40">
                              Complimentary
                            </span>
                          </div>
                          <h4 className="font-serif text-base sm:text-lg font-bold text-[#0B2B1B] mt-1.5 leading-snug">
                            Kurma Classic Greeting Card
                          </h4>
                          <p className="text-xs sm:text-sm text-stone-500 font-sans mt-1 leading-relaxed line-clamp-2">
                            Elegant cream note card framed by a botanical pattern. Included free with every bespoke gift box.
                          </p>
                        </div>

                        <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-stone-100">
                          <div className="flex items-center gap-2">
                            <span className="line-through text-stone-400 text-xs font-sans">₹49</span>
                            <span className="font-serif font-bold text-stone-900 text-base sm:text-lg">₹0</span>
                            <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                              Included
                            </span>
                          </div>

                          <div className="w-7 h-7 rounded-full bg-[#15803D] text-white flex items-center justify-center font-bold shadow-xs shrink-0">
                            <Check className="w-4 h-4 stroke-[3]" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Selected Box Summary & Items Slider Card Matching Screenshot 3 */}
                {selectedBox && (
                  <div className="pt-4">
                    <div className="bg-white rounded-3xl border border-stone-200/90 p-4 sm:p-6 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-4">
                      {/* Left: Selected Box Info */}
                      <div className="flex items-center gap-4 min-w-0 w-full md:w-auto">
                        <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-2xl overflow-hidden bg-[#F5F3EC] border border-stone-200 shrink-0 p-1">
                          <Image
                            src={selectedBox.image}
                            alt={selectedBox.title}
                            fill
                            unoptimized
                            className="object-contain"
                          />
                        </div>
                        <div className="min-w-0">
                          <h4 className="font-serif text-base font-bold text-[#0B2B1B] truncate">
                            {selectedBox.title}
                          </h4>
                          <p className="text-xs text-stone-500 font-sans mt-0.5">
                            ₹{selectedBox.price.toLocaleString("en-IN")}
                          </p>
                        </div>
                      </div>

                      {/* Middle: Added Goodies Item List with Red Remove Badge & Quantity Controls */}
                      <div className="flex-1 max-w-full overflow-x-auto py-1 px-2 scrollbar-thin">
                        <div className="flex items-center gap-3">
                          {Object.entries(selectedGoodies).map(([goodyId, qty]) => {
                            const goody = getGoodyById(goodyId);
                            if (!goody || qty === 0) return null;
                            return (
                              <div
                                key={goodyId}
                                className="relative bg-stone-50 border border-stone-200/90 rounded-2xl p-2.5 flex items-center gap-3 shrink-0 min-w-[240px]"
                              >
                                <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-white border border-stone-200 shrink-0 p-0.5">
                                  <Image src={goody.image} alt={goody.name} fill className="object-contain" />
                                </div>

                                <div className="min-w-0 flex-1">
                                  <h5 className="font-serif text-xs font-semibold text-[#0B2B1B] truncate">
                                    {goody.name}
                                  </h5>
                                  <p className="text-[10px] text-stone-500 font-sans">
                                    ₹{goody.price.toLocaleString("en-IN")}
                                  </p>

                                  <div className="flex items-center gap-1.5 mt-1">
                                    <button
                                      onClick={() => handleUpdateGoodyQty(goodyId, -1)}
                                      className="w-4 h-4 rounded-full bg-white border border-stone-300 text-stone-700 flex items-center justify-center text-[10px] font-bold hover:bg-stone-100 cursor-pointer"
                                    >
                                      -
                                    </button>
                                    <span className="text-[11px] font-bold text-stone-900">{qty}</span>
                                    <button
                                      onClick={() => handleUpdateGoodyQty(goodyId, 1)}
                                      className="w-4 h-4 rounded-full bg-white border border-stone-300 text-stone-700 flex items-center justify-center text-[10px] font-bold hover:bg-stone-100 cursor-pointer"
                                    >
                                      +
                                    </button>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Right: Vertical Separator & Total */}
                      <div className="flex items-center justify-between md:justify-end gap-6 w-full md:w-auto pt-2 md:pt-0 border-t md:border-t-0 border-stone-100">
                        <div className="hidden md:block h-10 w-[1px] bg-stone-200" />
                        <div className="text-left md:text-right">
                          <span className="text-[10px] text-stone-400 uppercase tracking-widest block font-sans font-medium">
                            TOTAL
                          </span>
                          <span className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 leading-none">
                            ₹{grandTotal.toLocaleString("en-IN")}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Bottom Navigation Buttons (Back & Next) Matching Screenshot 3 */}
                <div className="flex items-center justify-between pt-6 border-t border-stone-200/80 mt-6">
                  <button
                    onClick={() => handleStepChange(2)}
                    className="border border-stone-800 text-stone-800 hover:bg-stone-100 px-8 py-2.5 rounded-full text-xs sm:text-sm font-semibold uppercase tracking-wider transition-all cursor-pointer"
                  >
                    Back
                  </button>

                  <button
                    onClick={() => handleStepChange(4)}
                    className="bg-[#121829] hover:bg-[#0B2B1B] text-white px-8 py-2.5 rounded-full text-xs sm:text-sm font-semibold uppercase tracking-wider transition-all shadow-md cursor-pointer"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}

            {/* STEP 4: REVIEW & PLACE ORDER */}
            {currentStep === 4 && (
              <div id="step-4-review-hamper" className="space-y-8 animate-in fade-in duration-300 max-w-4xl mx-auto scroll-mt-24">
                {/* Header */}
                <div className="text-center space-y-2">
                  <div className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-widest text-stone-500 uppercase">
                    <span className="text-stone-400">✦</span>
                    <span>STEP 4</span>
                  </div>
                  <h2 className="font-serif text-3xl sm:text-4xl text-[#0B2B1B] font-medium">
                    Review your hamper
                  </h2>
                  <p className="text-xs sm:text-sm text-stone-600 font-sans">
                    Looks lovely. Anything to tweak?
                  </p>
                </div>

                {/* Warm Summary Table matching User Screenshot 1 */}
                <div className="bg-[#FAF5E9] rounded-2xl border border-stone-200/80 p-6 sm:p-8">
                  <div className="divide-y divide-stone-200/60">
                    {/* Row 1: Box */}
                    <div className="flex items-start sm:items-center justify-between py-4 gap-4">
                      <span className="text-stone-500 font-sans text-xs sm:text-sm shrink-0 w-20">Box</span>
                      <span className="font-serif text-sm sm:text-base font-bold text-stone-900 text-right">
                        {selectedBox?.title || "The Heritage Box"}
                      </span>
                    </div>

                    {/* Row 2: Items */}
                    <div className="flex items-start sm:items-center justify-between py-4 gap-4">
                      <span className="text-stone-500 font-sans text-xs sm:text-sm shrink-0 w-20">Items</span>
                      <span className="font-sans text-xs sm:text-sm font-bold text-stone-900 text-right max-w-2xl leading-relaxed">
                        {Object.entries(selectedGoodies)
                          .filter(([_, qty]) => qty > 0)
                          .map(([goodyId, qty]) => {
                            const goody = getGoodyById(goodyId);
                            return goody ? (qty > 1 ? `${goody.name} (x${qty})` : goody.name) : null;
                          })
                          .filter(Boolean)
                          .join(" | ") || "No goodies added"}
                      </span>
                    </div>

                    {/* Row 3: For */}
                    <div className="flex items-start sm:items-center justify-between py-4 gap-4">
                      <span className="text-stone-500 font-sans text-xs sm:text-sm shrink-0 w-20">For</span>
                      <span className="font-sans text-xs sm:text-sm font-semibold text-stone-900 text-right">
                        {personalization.recipientName ? personalization.recipientName : "—"}
                      </span>
                    </div>

                    {/* Row 4: Card */}
                    <div className="flex items-start sm:items-center justify-between py-4 gap-4">
                      <span className="text-stone-500 font-sans text-xs sm:text-sm shrink-0 w-20">Card</span>
                      <span className="font-sans text-xs sm:text-sm font-semibold text-stone-900 text-right">
                        {personalization.giftNote ? "Personalized Note Included" : "—"}
                      </span>
                    </div>

                    {/* Row 5: Total */}
                    <div className="flex items-center justify-between pt-4 gap-4">
                      <span className="text-stone-500 font-sans text-xs sm:text-sm shrink-0 w-20">Total</span>
                      <span className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 text-right">
                        ₹{grandTotal.toLocaleString("en-IN")}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Selected Box Summary & Items Slider Card Matching Screenshot 2 */}
                {selectedBox && (
                  <div className="pt-2">
                    <div className="bg-white rounded-3xl border border-stone-200/90 p-4 sm:p-6 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-4">
                      {/* Left: Selected Box Info */}
                      <div className="flex items-center gap-4 min-w-0 w-full md:w-auto">
                        <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-2xl overflow-hidden bg-[#F5F3EC] border border-stone-200 shrink-0 p-1">
                          <Image
                            src={selectedBox.image}
                            alt={selectedBox.title}
                            fill
                            unoptimized
                            className="object-contain"
                          />
                        </div>
                        <div className="min-w-0">
                          <h4 className="font-serif text-base font-bold text-[#0B2B1B] truncate">
                            {selectedBox.title}
                          </h4>
                          <p className="text-xs text-stone-500 font-sans mt-0.5">
                            ₹{selectedBox.price.toLocaleString("en-IN")}
                          </p>
                        </div>
                      </div>

                      {/* Middle: Added Goodies Item List with Red Remove Badge & Quantity Controls */}
                      <div className="flex-1 max-w-full overflow-x-auto py-1 px-2 scrollbar-thin">
                        <div className="flex items-center gap-3">
                          {Object.entries(selectedGoodies).map(([goodyId, qty]) => {
                            const goody = getGoodyById(goodyId);
                            if (!goody || qty === 0) return null;
                            return (
                              <div
                                key={goodyId}
                                className="relative bg-stone-50 border border-stone-200/90 rounded-2xl p-2.5 flex items-center gap-3 shrink-0 min-w-[240px]"
                              >
                                <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-white border border-stone-200 shrink-0 p-0.5">
                                  <Image src={goody.image} alt={goody.name} fill className="object-contain" />
                                </div>

                                <div className="min-w-0 flex-1">
                                  <h5 className="font-serif text-xs font-semibold text-[#0B2B1B] truncate">
                                    {goody.name}
                                  </h5>
                                  <p className="text-[10px] text-stone-500 font-sans">
                                    ₹{goody.price.toLocaleString("en-IN")}
                                  </p>

                                  <div className="flex items-center gap-1.5 mt-1">
                                    <button
                                      onClick={() => handleUpdateGoodyQty(goodyId, -1)}
                                      className="w-4 h-4 rounded-full bg-white border border-stone-300 text-stone-700 flex items-center justify-center text-[10px] font-bold hover:bg-stone-100 cursor-pointer"
                                    >
                                      -
                                    </button>
                                    <span className="text-[11px] font-bold text-stone-900">{qty}</span>
                                    <button
                                      onClick={() => handleUpdateGoodyQty(goodyId, 1)}
                                      className="w-4 h-4 rounded-full bg-white border border-stone-300 text-stone-700 flex items-center justify-center text-[10px] font-bold hover:bg-stone-100 cursor-pointer"
                                    >
                                      +
                                    </button>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Right: Vertical Separator & Total */}
                      <div className="flex items-center justify-between md:justify-end gap-6 w-full md:w-auto pt-2 md:pt-0 border-t md:border-t-0 border-stone-100">
                        <div className="hidden md:block h-10 w-[1px] bg-stone-200" />
                        <div className="text-left md:text-right">
                          <span className="text-[10px] text-stone-400 uppercase tracking-widest block font-sans font-medium">
                            TOTAL
                          </span>
                          <span className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 leading-none">
                            ₹{grandTotal.toLocaleString("en-IN")}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Bottom Navigation Buttons: Back & Checkout gift */}
                <div className="flex items-center justify-between pt-6 border-t border-stone-200/80 mt-6">
                  <button
                    onClick={() => handleStepChange(3)}
                    className="border border-stone-800 text-stone-800 hover:bg-stone-100 px-8 py-2.5 rounded-full text-xs sm:text-sm font-semibold uppercase tracking-wider transition-all cursor-pointer"
                  >
                    Back
                  </button>

                  <button
                    onClick={handleAddCustomHamperToCart}
                    className="bg-[#121829] hover:bg-[#0B2B1B] text-white px-8 py-2.5 rounded-full text-xs sm:text-sm font-semibold uppercase tracking-wider transition-all shadow-md cursor-pointer flex items-center gap-2"
                  >
                    {addedToCartSuccess ? "Added!" : "Checkout gift"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>

      {/* STEP 2: PRODUCT DETAILS POPUP MODAL */}
      {selectedProductModal && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200"
          onClick={() => setSelectedProductModal(null)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="relative w-full max-w-lg sm:max-w-2xl bg-[#FAF8F5] rounded-3xl border border-[#eed08e]/50 shadow-2xl overflow-hidden p-5 sm:p-7 animate-in zoom-in-95 duration-200 text-stone-900 max-h-[92vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedProductModal(null)}
              aria-label="Close details"
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-stone-200/80 hover:bg-stone-300 text-stone-700 flex items-center justify-center transition-colors cursor-pointer z-10"
            >
              <X className="w-4 h-4 stroke-[2.5]" />
            </button>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 sm:gap-7 items-center pt-2 sm:pt-0">
              {/* Left Column: Image Canvas */}
              <div className="sm:col-span-5 flex flex-col items-center">
                <div className="relative aspect-[3/4] w-full max-w-[200px] sm:max-w-none rounded-2xl bg-[#F5F3EC] border border-stone-200/80 p-3 flex items-center justify-center overflow-hidden shadow-xs">
                  <Image
                    src={selectedProductModal.image}
                    alt={selectedProductModal.name}
                    fill
                    unoptimized
                    className="object-contain p-2"
                  />
                  {selectedProductModal.category && (
                    <span className="absolute top-2.5 left-2.5 bg-[#0B2B1B] text-[#eed08e] text-[9.5px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-xs">
                      {selectedProductModal.category}
                    </span>
                  )}
                </div>
              </div>

              {/* Right Column: Details & Hamper Actions */}
              <div className="sm:col-span-7 space-y-4">
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-widest text-[#8b5f10]">
                    <span>Sacred Hamper Goody</span>
                  </div>
                  <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#0B2B1B] mt-1 leading-snug">
                    {selectedProductModal.name}
                  </h3>
                  <div className="mt-2 flex items-baseline gap-2">
                    <span className="font-serif text-2xl font-bold text-stone-900">
                      ₹{selectedProductModal.price.toLocaleString("en-IN")}
                    </span>
                    <span className="text-xs text-stone-500 font-sans">
                      (Inclusive of taxes)
                    </span>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-white border border-stone-200/80 space-y-2">
                  <h4 className="text-[11px] font-bold text-stone-800 uppercase tracking-wider">
                    About this Creation
                  </h4>
                  <p className="text-xs sm:text-sm text-stone-600 font-sans leading-relaxed">
                    {selectedProductModal.description}
                  </p>
                </div>

                {/* Gifting Guarantee Badges */}
                <div className="grid grid-cols-2 gap-2 text-[11px] text-stone-600">
                  <div className="flex items-center gap-1.5 p-2 rounded-xl bg-[#FAF5E9] border border-[#eed08e]/30">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                    <span>Pure Natural Blend</span>
                  </div>
                  <div className="flex items-center gap-1.5 p-2 rounded-xl bg-[#FAF5E9] border border-[#eed08e]/30">
                    <Gift className="w-3.5 h-3.5 text-[#8b5f10] shrink-0" />
                    <span>Fragile-Safe Packed</span>
                  </div>
                </div>

                {/* Hamper Capacity & Action CTA */}
                <div className="pt-2 border-t border-stone-200/80 space-y-2.5">
                  <div className="flex items-center justify-between text-xs text-stone-600">
                    <span>Current Hamper Count:</span>
                    <strong className="text-stone-900">
                      {totalItemsSelected} / {selectedBox ? selectedBox.capacity : 4} items
                    </strong>
                  </div>

                  {(() => {
                    const modalQty = selectedGoodies[selectedProductModal.id] || 0;
                    if (modalQty === 0) {
                      return (
                        <button
                          onClick={() => handleUpdateGoodyQty(selectedProductModal.id, 1)}
                          className="w-full py-3.5 px-6 rounded-full bg-[#121829] hover:bg-[#0B2B1B] text-white text-xs sm:text-sm font-semibold uppercase tracking-wider shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
                        >
                          <Plus className="w-4 h-4" />
                          <span>Add to Hamper (+ ₹{selectedProductModal.price})</span>
                        </button>
                      );
                    }
                    return (
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 bg-white rounded-full p-1.5 border border-stone-300 shadow-2xs">
                          <button
                            onClick={() => handleUpdateGoodyQty(selectedProductModal.id, -1)}
                            className="w-7 h-7 rounded-full bg-stone-100 text-stone-700 flex items-center justify-center hover:bg-stone-200 cursor-pointer font-bold"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="font-serif font-bold text-sm text-stone-900 px-3">
                            {modalQty} in box
                          </span>
                          <button
                            onClick={() => handleUpdateGoodyQty(selectedProductModal.id, 1)}
                            className="w-7 h-7 rounded-full bg-[#121829] text-white flex items-center justify-center hover:bg-[#0B2B1B] cursor-pointer font-bold"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <button
                          onClick={() => setSelectedProductModal(null)}
                          className="flex-1 py-3 px-4 rounded-full bg-[#0B2B1B] text-[#eed08e] text-xs font-semibold uppercase tracking-wider hover:bg-[#123e28] transition-colors cursor-pointer text-center"
                        >
                          Done
                        </button>
                      </div>
                    );
                  })()}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

export default function CustomisePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-[#0B2B1B] border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <CustomiseContent />
    </Suspense>
  );
}
