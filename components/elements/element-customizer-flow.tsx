"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
  Check,
  ShieldCheck,
  CreditCard,
  QrCode,
  Banknote,
  PenTool,
  Gift,
  CheckCircle2,
  Copy,
  Printer,
  RotateCcw,
  Tag,
  Lock,
  ChevronDown,
} from "lucide-react";
import { formatPrice } from "@/lib/products";
import { useCart } from "@/lib/cart-context";

export type ElementKey = "all" | "Earth" | "Water" | "Fire" | "Air" | "Space";
export type FormatOption = "suite" | "single" | "trio" | "trunk";

export interface ElementCustomizerFlowProps {
  activeElementKey: ElementKey;
  onElementChange: (key: ElementKey) => void;
}

const ELEMENT_DATA: Record<
  string,
  {
    name: string;
    subtitle: string;
    sanskrit: string;
    notes: string;
    time: string;
    intention: string;
    image: string;
    gallery?: string[];
    price: number;
    originalPrice?: number;
    color: string;
  }
> = {
  all: {
    name: "5 Elements Complete Fragrance Suite",
    subtitle: "Complete Pancha Mahabhuta Collection • 135 Sticks",
    sanskrit: "Pancha Mahabhuta (All 5 Elements)",
    notes: "Mysore Sandalwood, Blue Lotus, Ceylon Clove, Desi Rose, Rare Wild Oudh",
    time: "Dawn through Twilight & Midnight Meditation",
    intention: "Total prana harmonization, elemental balance, and sacred space sanctification.",
    image: "/images/product/suite-clean.png",
    gallery: ["/images/product/suite-clean.png", "/images/product/image7.png"],
    price: 1799,
    originalPrice: 2199,
    color: "#8B6F38",
  },
  Earth: {
    name: "Earth Luxury Incense (Prithvi)",
    subtitle: "Ground • Nourish • Belong • 27 Sticks",
    sanskrit: "Prithvi (Earth Element)",
    notes: "Sacred Vetiver (Khus), Warm Indian Sandalwood, Forest Moss",
    time: "Brahma Muhurta & Dawn",
    intention: "Grounding erratic energy, root chakra awakening, deep calm & stability.",
    image: "/images/product/earth-front.png",
    price: 399,
    originalPrice: 499,
    color: "#2D5A27",
  },
  Water: {
    name: "Water Luxury Incense (Jal)",
    subtitle: "Flow • Purify • Renew • 27 Sticks",
    sanskrit: "Jal (Water Element)",
    notes: "Sacred Blue Lotus, Crisp Rain Accord, Himalayan Golden Amber",
    time: "Morning Ablution & Midday",
    intention: "Emotional cleansing, releasing mental blockages, fluidity & creative receptivity.",
    image: "/images/product/water-front.png",
    price: 399,
    originalPrice: 499,
    color: "#1B4965",
  },
  Fire: {
    name: "Fire Luxury Incense (Agni)",
    subtitle: "Transform • Clarify • Ascend • 27 Sticks",
    sanskrit: "Agni (Fire Element)",
    notes: "Golden Ceylon Clove, Cassia Bark, Sacred Smoked Dammar Resin",
    time: "Twilight Sandhya & Dusk",
    intention: "Purification of stagnant prana, mental focus, ignition of divine courage.",
    image: "/images/product/fire-front.png",
    price: 399,
    originalPrice: 499,
    color: "#8B2635",
  },
  Air: {
    name: "Air Luxury Incense (Vayu)",
    subtitle: "Elevate • Expand • Breathe • 27 Sticks",
    sanskrit: "Vayu (Air Element)",
    notes: "Desi Gulab Petals, Temple Camphor, Crisp Himalayan Morning Dew",
    time: "Pranayama & Afternoon",
    intention: "Heart chakra opening, expansiveness, freedom from anxiety & mental fatigue.",
    image: "/images/product/air-front.png",
    price: 399,
    originalPrice: 499,
    color: "#4A6B82",
  },
  Space: {
    name: "Space Luxury Incense (Akasha)",
    subtitle: "Transcend • Stillness • Awaken • 27 Sticks",
    sanskrit: "Akasha (Space Element)",
    notes: "Rare Wild Oudh (Agarwood), Frankincense (Loban), Somalian Myrrh",
    time: "Deep Night Meditation & Solitude",
    intention: "Connection to the cosmic void, crown chakra stillness, deep transcendent awareness.",
    image: "/images/product/space-front.png",
    price: 399,
    originalPrice: 499,
    color: "#483C6C",
  },
};

const ARTISANAL_ADDONS = [
  {
    id: "turtle-burner",
    title: "Moradabad Solid Brass Turtle Burner",
    desc: "Pure cast brass heirloom burner",
    price: 699,
    image: "/images/product/turtle-holder-clean.png",
  },
  {
    id: "medallion",
    title: "Pancha Mahabhuta Talisman Medallion",
    desc: "Antiqued engraved keepsake brass medallion",
    price: 349,
    image: "/images/product/medallion-clean.png",
  },
  {
    id: "gift-wrap",
    title: "Imperial Gold Wax Seal & Emerald Wrap",
    desc: "Hand-poured wax seal with deckle scroll",
    price: 149,
    image: "/images/product/bookmark-clean.png",
  },
];

const RITUAL_INTENTIONS = [
  "Root Grounding & Deep Stability",
  "Emotional Purification & Creative Flow",
  "Divine Courage & Prana Ignition",
  "Heart Opening & Anxiety Relief",
  "Cosmic Stillness & Meditation",
];

export function ElementCustomizerFlow({
  activeElementKey,
  onElementChange,
}: ElementCustomizerFlowProps) {
  const { addToCart } = useCart();
  const upiId = "kurma.vedic@icici";
  const [copiedUpi, setCopiedUpi] = useState(false);

  // Active format: 'suite' | 'single' | 'trio' | 'trunk'
  const [format, setFormat] = useState<FormatOption>(
    activeElementKey === "all" ? "suite" : "single"
  );

  // Sync format if activeElementKey changes
  useEffect(() => {
    if (activeElementKey === "all") {
      setFormat((prev) => (prev === "trunk" ? "trunk" : "suite"));
    } else {
      setFormat((prev) => (prev === "trio" ? "trio" : "single"));
    }
  }, [activeElementKey]);

  // Selected Triad elements (if format === 'trio')
  const [trioSelection, setTrioSelection] = useState<string[]>([
    "Earth",
    "Water",
    "Fire",
  ]);

  // Personalization
  const [engraving, setEngraving] = useState("Om Shanti • Blessings");
  const [intention, setIntention] = useState(RITUAL_INTENTIONS[0]);
  const [selectedAddons, setSelectedAddons] = useState<string[]>(["turtle-burner"]);

  // Checkout View State: 'configure' | 'checkout' | 'success'
  const [viewState, setViewState] = useState<"configure" | "checkout" | "success">("configure");

  // Delivery Details
  const [customer, setCustomer] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
    pincode: "",
  });
  const [paymentMethod, setPaymentMethod] = useState<"upi" | "card" | "cod">("upi");
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderConfirmation, setOrderConfirmation] = useState<{
    orderId: string;
    total: number;
    placedAt: string;
  } | null>(null);

  // Coupon
  const [couponCode, setCouponCode] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState(0);

  // Determine current product data
  const currentElementData = ELEMENT_DATA[activeElementKey] || ELEMENT_DATA.all;

  // Base price computation
  const basePrice = (() => {
    if (format === "trunk") return 4999;
    if (format === "suite") return 1799;
    if (format === "trio") return 1079;
    return currentElementData.price;
  })();

  const addonsPrice = selectedAddons.reduce((sum, id) => {
    const item = ARTISANAL_ADDONS.find((a) => a.id === id);
    return sum + (item ? item.price : 0);
  }, 0);

  const subtotal = basePrice + addonsPrice;
  const grandTotal = Math.max(0, subtotal - appliedDiscount);

  // Active display image
  const displayImage = (() => {
    if (format === "trunk") return "/images/product/marble-box-clean.png";
    if (format === "suite") return "/images/product/suite-clean.png";
    if (format === "trio") return "/images/product/suite-clean.png";
    return currentElementData.image;
  })();

  const handleToggleAddon = (id: string) => {
    setSelectedAddons((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = couponCode.trim().toUpperCase();
    if (clean === "SACRED10" || clean === "KURMA10") {
      setAppliedDiscount(Math.round(subtotal * 0.1));
      setCouponCode("");
    }
  };

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customer.name.trim() || !customer.phone.trim() || !customer.address.trim()) {
      alert("Please provide your delivery recipient name, phone, and complete address.");
      return;
    }

    setIsProcessing(true);
    setTimeout(() => {
      const generatedId = `KRM-${Math.floor(100000 + Math.random() * 900000)}`;
      setOrderConfirmation({
        orderId: generatedId,
        total: grandTotal,
        placedAt: new Date().toLocaleDateString("en-IN", {
          day: "numeric",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
      });

      // Synchronize with cart context
      addToCart({
        id: `custom-${Date.now()}`,
        name:
          format === "trunk"
            ? "Marble Heirloom Trunk (Customized)"
            : format === "suite"
            ? "5 Elements Complete Suite (Customized)"
            : format === "trio"
            ? `Sacred Triad (${trioSelection.join(", ")})`
            : `${currentElementData.name} (Customized)`,
        price: grandTotal,
        priceDisplay: formatPrice(grandTotal),
        image: displayImage,
        quantity: 1,
        customizations: {
          "Format / Pack":
            format === "trunk"
              ? "Heirloom Marble Trunk"
              : format === "suite"
              ? "5 Elements Suite (135 sticks)"
              : format === "trio"
              ? `Triad (${trioSelection.join(", ")})`
              : "Single Element Box (27 sticks)",
          "Gold Foil Engraving": engraving || "None",
          "Ritual Intention": intention,
          Keepsakes:
            selectedAddons
              .map((id) => ARTISANAL_ADDONS.find((a) => a.id === id)?.title)
              .filter(Boolean)
              .join(", ") || "None",
        },
      });

      setIsProcessing(false);
      setViewState("success");
    }, 1100);
  };

  const handleReset = () => {
    setViewState("configure");
    setOrderConfirmation(null);
  };

  return (
    <div className="w-full">
      {/* SUCCESS CONFIRMATION MODAL / PANEL */}
      {viewState === "success" && orderConfirmation && (
        <div className="bg-white rounded-3xl border border-[#eed08e]/80 shadow-2xl p-6 sm:p-10 max-w-2xl mx-auto text-center space-y-6 animate-in zoom-in-95 duration-200">
          <div className="w-16 h-16 rounded-full bg-[#fbf6ea] border-2 border-[#eed08e] text-[#c0881b] flex items-center justify-center mx-auto shadow-sm">
            <CheckCircle2 className="w-9 h-9 stroke-[2.2]" />
          </div>

          <div className="space-y-1">
            <span className="text-[11px] font-cinzel uppercase tracking-widest text-[#8b5f10] font-bold">
              Bespoke Order Confirmed
            </span>
            <h3 className="text-2xl sm:text-3xl font-serif text-stone-900 font-normal">
              Thank You, {customer.name || "Devotee"}!
            </h3>
            <p className="text-xs text-stone-500 max-w-md mx-auto leading-relaxed">
              Your customized sacred creation has been sanctified and queued for doorstep dispatch.
            </p>
          </div>

          <div className="bg-[#FAF8F5] border border-[#eed08e]/60 rounded-2xl p-5 text-left text-xs space-y-3">
            <div className="flex items-center justify-between border-b border-stone-200 pb-2.5">
              <div>
                <span className="text-[10px] text-stone-400 uppercase font-cinzel">Order ID</span>
                <p className="font-mono font-bold text-sm text-stone-900">{orderConfirmation.orderId}</p>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-stone-400 uppercase font-cinzel">Total Paid</span>
                <p className="font-bold text-[#c0881b] text-sm">₹{orderConfirmation.total}</p>
              </div>
            </div>

            <div className="space-y-1.5 text-stone-600">
              <div className="flex justify-between">
                <span>Formulation:</span>
                <span className="font-medium text-stone-900">
                  {format === "trunk"
                    ? "Marble Heirloom Trunk"
                    : format === "suite"
                    ? "5 Elements Suite (135 Sticks)"
                    : format === "trio"
                    ? `Sacred Triad (${trioSelection.join(", ")})`
                    : currentElementData.name}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Engraving:</span>
                <span className="italic font-medium text-stone-900">&quot;{engraving}&quot;</span>
              </div>
              <div className="flex justify-between">
                <span>Payment Mode:</span>
                <span className="font-bold text-emerald-700 uppercase">
                  {paymentMethod === "cod" ? "Cash on Delivery" : "Paid Online"}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Destination:</span>
                <span className="font-medium text-stone-900 truncate max-w-[200px]">
                  {customer.address}, {customer.city}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              type="button"
              onClick={() => window.print()}
              className="flex-1 py-3 px-4 rounded-xl border border-stone-300 text-stone-700 hover:bg-stone-50 text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Sacred Receipt</span>
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="flex-1 py-3 px-4 rounded-xl bg-[#072515] hover:bg-[#0c3823] text-[#eed08e] text-xs font-cinzel font-semibold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-colors"
            >
              <span>Customise Another Product</span>
            </button>
          </div>
        </div>
      )}

      {/* MAIN TWO-COLUMN BESPOKE STUDIO (Configure & Pay) */}
      {viewState !== "success" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          {/* LEFT COLUMN: Visual Presentation & Botanical Essence */}
          <div className="lg:col-span-5 space-y-5 lg:sticky lg:top-24">
            {/* Main Visual Display */}
            <div className="relative aspect-4/5 w-full rounded-2xl overflow-hidden bg-[#F4F1EA] border border-stone-200 shadow-md flex items-center justify-center">
              <Image
                src={displayImage}
                alt={currentElementData.name}
                fill
                priority
                className="object-contain p-4 transition-all duration-500 drop-shadow-md"
                sizes="(max-width: 1024px) 100vw, 450px"
              />

              {/* Live Gold Foil Monogram Badge (Overlaid on image) */}
              {engraving && (
                <div className="absolute bottom-4 inset-x-4 bg-black/60 backdrop-blur-md border border-[#eed08e]/50 rounded-xl p-3 flex items-center justify-between text-white shadow-lg">
                  <div className="flex items-center gap-2">
                    <PenTool className="w-3.5 h-3.5 text-[#eed08e]" />
                    <span className="text-[10px] uppercase font-cinzel tracking-wider text-stone-300">
                      Personalized Engraving
                    </span>
                  </div>
                  <span className="font-serif text-xs text-[#eed08e] font-semibold italic">
                    &quot;{engraving}&quot;
                  </span>
                </div>
              )}
            </div>

            {/* Quiet Botanical & Intention Card */}
            <div className="bg-white rounded-2xl border border-stone-200/80 p-5 space-y-3 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="text-[10.5px] font-cinzel uppercase tracking-wider text-[#8b5f10] font-bold">
                  {currentElementData.sanskrit}
                </span>
                <span className="text-[11px] text-stone-500 font-sans">
                  Optimal: {currentElementData.time}
                </span>
              </div>

              <div>
                <span className="text-[11px] text-stone-400 uppercase font-cinzel block">
                  Pure Botanicals
                </span>
                <p className="text-xs text-stone-800 font-medium mt-0.5">
                  {currentElementData.notes}
                </p>
              </div>

              <div className="pt-2 border-t border-stone-100">
                <span className="text-[11px] text-stone-400 uppercase font-cinzel block">
                  Sacred Intention
                </span>
                <p className="text-xs text-stone-600 leading-relaxed mt-0.5">
                  {currentElementData.intention}
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Interactive Customizer & Express Checkout */}
          <div className="lg:col-span-7 bg-white rounded-2xl sm:rounded-3xl border border-stone-200/90 shadow-sm p-6 sm:p-8 space-y-7">
            {/* Header: Title & Dynamic Price */}
            <div className="border-b border-stone-100 pb-5">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl sm:text-3xl font-serif text-stone-900 font-normal">
                    {format === "trunk"
                      ? "Elements in Harmony Marble Keepsake Trunk"
                      : format === "suite"
                      ? "5 Elements Complete Fragrance Suite"
                      : format === "trio"
                      ? "Custom 3-Element Sacred Triad"
                      : currentElementData.name}
                  </h2>
                  <p className="text-xs text-stone-500 font-sans mt-1">
                    {format === "trunk"
                      ? "All 5 fragrance boxes + Moradabad Brass Turtle + Medallion in carved Bidasar marble"
                      : format === "suite"
                      ? "135 pure charcoal-free botanical sticks in a keepsake presentation sleeve"
                      : format === "trio"
                      ? "Curate three sacred elements tailored to your dosha (81 sticks)"
                      : currentElementData.subtitle}
                  </p>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-2xl font-bold text-stone-900 block">
                    ₹{basePrice}
                  </span>
                  <span className="text-[10.5px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                    FREE Shipping
                  </span>
                </div>
              </div>
            </div>

            {/* VIEW A: CONFIGURE YOUR ITEMS & OTHER THINGS */}
            {viewState === "configure" && (
              <div className="space-y-6">
                {/* 1. Format Selection Pills */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-stone-800 uppercase tracking-wider font-cinzel">
                    1. Select Formulation Format
                  </label>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setFormat("single");
                        if (activeElementKey === "all") onElementChange("Earth");
                      }}
                      className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                        format === "single"
                          ? "border-[#c0881b] bg-[#fbf6ea] font-bold text-stone-900 shadow-2xs"
                          : "border-stone-200 hover:border-stone-300 text-stone-600 bg-white"
                      }`}
                    >
                      <span className="text-xs block">Single Box</span>
                      <span className="text-[11px] text-[#c0881b] font-semibold">₹399</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setFormat("trio")}
                      className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                        format === "trio"
                          ? "border-[#c0881b] bg-[#fbf6ea] font-bold text-stone-900 shadow-2xs"
                          : "border-stone-200 hover:border-stone-300 text-stone-600 bg-white"
                      }`}
                    >
                      <span className="text-xs block">Sacred Trio</span>
                      <span className="text-[11px] text-[#c0881b] font-semibold">₹1,079</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setFormat("suite");
                        onElementChange("all");
                      }}
                      className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                        format === "suite"
                          ? "border-[#c0881b] bg-[#fbf6ea] font-bold text-stone-900 shadow-2xs"
                          : "border-stone-200 hover:border-stone-300 text-stone-600 bg-white"
                      }`}
                    >
                      <span className="text-xs block">5-Element Suite</span>
                      <span className="text-[11px] text-[#c0881b] font-semibold">₹1,799</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setFormat("trunk");
                        onElementChange("all");
                      }}
                      className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                        format === "trunk"
                          ? "border-[#c0881b] bg-[#fbf6ea] font-bold text-stone-900 shadow-2xs"
                          : "border-stone-200 hover:border-stone-300 text-stone-600 bg-white"
                      }`}
                    >
                      <span className="text-xs block">Marble Trunk</span>
                      <span className="text-[11px] text-[#c0881b] font-semibold">₹4,999</span>
                    </button>
                  </div>
                </div>

                {/* Element Selector if Single Box is active */}
                {format === "single" && (
                  <div className="space-y-1.5 pt-1">
                    <span className="text-[11px] font-semibold text-stone-700 block">
                      Choose Sacred Element:
                    </span>
                    <div className="grid grid-cols-5 gap-1.5">
                      {[
                        { key: "Earth", label: "Prithvi", note: "Vetiver" },
                        { key: "Water", label: "Jal", note: "Lotus" },
                        { key: "Fire", label: "Agni", note: "Clove" },
                        { key: "Air", label: "Vayu", note: "Rose" },
                        { key: "Space", label: "Akasha", note: "Oudh" },
                      ].map((el) => {
                        const isSelected = activeElementKey === el.key;
                        return (
                          <button
                            type="button"
                            key={el.key}
                            onClick={() => onElementChange(el.key as ElementKey)}
                            className={`p-2 rounded-xl border text-center transition-all cursor-pointer ${
                              isSelected
                                ? "border-[#c0881b] bg-[#fbf6ea] text-stone-900 font-bold shadow-2xs ring-1 ring-[#c0881b]/30"
                                : "border-stone-200 hover:border-stone-300 text-stone-600 bg-white"
                            }`}
                          >
                            <span className="text-xs font-serif block">{el.label}</span>
                            <span className="text-[10px] text-stone-400 block">{el.note}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Sub-selector if Trio format is picked */}
                {format === "trio" && (
                  <div className="p-4 bg-[#FAF8F5] rounded-xl border border-stone-200 space-y-2">
                    <span className="text-xs font-semibold text-stone-800 block">
                      Choose Your 3 Sacred Elements ({trioSelection.length}/3 selected):
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {["Earth", "Water", "Fire", "Air", "Space"].map((el) => {
                        const isChosen = trioSelection.includes(el);
                        return (
                          <button
                            type="button"
                            key={el}
                            onClick={() => {
                              if (isChosen) {
                                if (trioSelection.length > 1) {
                                  setTrioSelection(trioSelection.filter((item) => item !== el));
                                }
                              } else {
                                if (trioSelection.length < 3) {
                                  setTrioSelection([...trioSelection, el]);
                                } else {
                                  setTrioSelection([trioSelection[1], trioSelection[2], el]);
                                }
                              }
                            }}
                            className={`px-3 py-1.5 rounded-lg text-xs font-cinzel font-semibold transition-all cursor-pointer ${
                              isChosen
                                ? "bg-[#c0881b] text-white shadow-2xs"
                                : "bg-white border border-stone-300 text-stone-600 hover:border-stone-400"
                            }`}
                          >
                            {el}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* 2. Personalize: Gold Foil Engraving */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-stone-800 uppercase tracking-wider font-cinzel flex items-center gap-1.5">
                      <PenTool className="w-3.5 h-3.5 text-[#c0881b]" />
                      <span>2. Custom Gold Foil Engraving</span>
                    </label>
                    <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-medium">
                      Complimentary
                    </span>
                  </div>

                  <input
                    type="text"
                    maxLength={32}
                    value={engraving}
                    onChange={(e) => setEngraving(e.target.value)}
                    placeholder="e.g. Om Shanti • The Sharma Sanctuary"
                    className="w-full text-xs px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:border-[#c0881b] focus:outline-hidden"
                  />
                </div>

                {/* 3. Ritual Intention */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-stone-800 uppercase tracking-wider font-cinzel">
                    3. Ritual Blessing Focus
                  </label>
                  <select
                    value={intention}
                    onChange={(e) => setIntention(e.target.value)}
                    className="w-full text-xs p-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:border-[#c0881b] focus:outline-hidden cursor-pointer"
                  >
                    {RITUAL_INTENTIONS.map((int) => (
                      <option key={int} value={int}>
                        {int}
                      </option>
                    ))}
                  </select>
                </div>

                {/* 4. Sacred Keepsake Add-ons ("Other Things") */}
                <div className="space-y-2.5 pt-1">
                  <label className="text-xs font-bold text-stone-800 uppercase tracking-wider font-cinzel">
                    4. Artisanal Brass Keepsakes &amp; Gifting
                  </label>

                  <div className="space-y-2">
                    {ARTISANAL_ADDONS.map((addon) => {
                      const isChecked = selectedAddons.includes(addon.id);
                      return (
                        <div
                          key={addon.id}
                          onClick={() => handleToggleAddon(addon.id)}
                          className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                            isChecked
                              ? "border-[#c0881b] bg-[#fbf6ea]"
                              : "border-stone-200 bg-stone-50/50 hover:bg-stone-50"
                          }`}
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-white shrink-0 border border-stone-200">
                              <Image
                                src={addon.image}
                                alt={addon.title}
                                fill
                                className="object-cover"
                                sizes="40px"
                              />
                            </div>
                            <div className="min-w-0">
                              <span className="text-xs font-bold text-stone-900 block truncate">
                                {addon.title}
                              </span>
                              <span className="text-[11px] text-stone-500 block truncate">
                                {addon.desc}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-3 shrink-0">
                            <span className="text-xs font-bold text-[#c0881b]">
                              +₹{addon.price}
                            </span>
                            <div
                              className={`w-4 h-4 rounded-md border flex items-center justify-center ${
                                isChecked
                                  ? "bg-[#c0881b] border-[#c0881b] text-white"
                                  : "border-stone-300 bg-white"
                              }`}
                            >
                              {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Bottom CTA to Proceed to Express Pay */}
                <div className="pt-4 border-t border-stone-100 flex items-center justify-between gap-4">
                  <div>
                    <span className="text-[10px] text-stone-400 uppercase font-cinzel block">
                      Total Package
                    </span>
                    <span className="text-xl font-bold text-stone-900">
                      ₹{subtotal}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => setViewState("checkout")}
                    className="flex-1 max-w-xs py-3.5 px-6 rounded-xl bg-[#c0881b] hover:bg-[#a97514] active:scale-98 text-white font-cinzel font-semibold text-xs sm:text-sm uppercase tracking-wider transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Lock className="w-3.5 h-3.5" />
                    <span>Proceed to Pay (₹{subtotal})</span>
                  </button>
                </div>
              </div>
            )}

            {/* VIEW B: EXPRESS CHECKOUT & INSTANT PAYMENT */}
            {viewState === "checkout" && (
              <form onSubmit={handlePlaceOrder} className="space-y-6 animate-in fade-in duration-200">
                <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                  <h3 className="font-serif text-lg font-bold text-stone-900">
                    Express Delivery &amp; Payment
                  </h3>
                  <button
                    type="button"
                    onClick={() => setViewState("configure")}
                    className="text-xs text-stone-500 hover:text-stone-900 cursor-pointer"
                  >
                    ← Edit Formulation
                  </button>
                </div>

                {/* Delivery Form */}
                <div className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                        Recipient Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={customer.name}
                        onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
                        placeholder="Radhika Sharma"
                        className="w-full text-xs px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:border-[#c0881b] focus:outline-hidden"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                        Phone (WhatsApp Dispatch) *
                      </label>
                      <input
                        type="tel"
                        required
                        value={customer.phone}
                        onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                        placeholder="+91 98765 43210"
                        className="w-full text-xs px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:border-[#c0881b] focus:outline-hidden"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                      Complete Delivery Address *
                    </label>
                    <textarea
                      rows={2}
                      required
                      value={customer.address}
                      onChange={(e) => setCustomer({ ...customer, address: e.target.value })}
                      placeholder="House/Flat No., Apartment, Street, Landmark"
                      className="w-full text-xs px-3.5 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:border-[#c0881b] focus:outline-hidden"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                        City *
                      </label>
                      <input
                        type="text"
                        required
                        value={customer.city}
                        onChange={(e) => setCustomer({ ...customer, city: e.target.value })}
                        placeholder="Bengaluru"
                        className="w-full text-xs px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:border-[#c0881b] focus:outline-hidden"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                        Pincode *
                      </label>
                      <input
                        type="text"
                        required
                        maxLength={6}
                        value={customer.pincode}
                        onChange={(e) => setCustomer({ ...customer, pincode: e.target.value })}
                        placeholder="560001"
                        className="w-full text-xs px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:border-[#c0881b] focus:outline-hidden"
                      />
                    </div>
                  </div>
                </div>

                {/* Payment Selection */}
                <div className="space-y-3 pt-2">
                  <label className="block text-xs font-bold text-stone-800 uppercase tracking-wider font-cinzel">
                    Payment Method
                  </label>

                  <div className="grid grid-cols-3 gap-2.5">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod("upi")}
                      className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1 ${
                        paymentMethod === "upi"
                          ? "border-[#c0881b] bg-[#fbf6ea] font-bold text-stone-900"
                          : "border-stone-200 bg-stone-50 text-stone-600"
                      }`}
                    >
                      <QrCode className="w-4 h-4 text-[#c0881b]" />
                      <span className="text-xs">UPI / QR</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod("card")}
                      className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1 ${
                        paymentMethod === "card"
                          ? "border-[#c0881b] bg-[#fbf6ea] font-bold text-stone-900"
                          : "border-stone-200 bg-stone-50 text-stone-600"
                      }`}
                    >
                      <CreditCard className="w-4 h-4 text-[#c0881b]" />
                      <span className="text-xs">Cards</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod("cod")}
                      className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1 ${
                        paymentMethod === "cod"
                          ? "border-[#c0881b] bg-[#fbf6ea] font-bold text-stone-900"
                          : "border-stone-200 bg-stone-50 text-stone-600"
                      }`}
                    >
                      <Banknote className="w-4 h-4 text-[#c0881b]" />
                      <span className="text-xs">COD</span>
                    </button>
                  </div>

                  {paymentMethod === "upi" && (
                    <div className="p-3 bg-[#FAF8F5] rounded-xl border border-stone-200 flex items-center justify-between text-xs">
                      <div>
                        <span className="text-stone-500 block text-[10px]">Instant VPA</span>
                        <span className="font-mono font-bold text-stone-900">{upiId}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText(upiId);
                          setCopiedUpi(true);
                          setTimeout(() => setCopiedUpi(false), 2000);
                        }}
                        className="px-2.5 py-1 text-[11px] bg-stone-900 text-white rounded-md cursor-pointer hover:bg-stone-800"
                      >
                        {copiedUpi ? "Copied!" : "Copy VPA"}
                      </button>
                    </div>
                  )}
                </div>

                {/* Final Breakdown & Pay CTA */}
                <div className="pt-2 border-t border-stone-100 space-y-3">
                  <div className="flex justify-between items-baseline text-stone-900">
                    <span className="font-serif text-sm font-bold">Total Amount Due</span>
                    <span className="text-xl font-bold text-[#c0881b]">₹{grandTotal}</span>
                  </div>

                  <button
                    type="submit"
                    disabled={isProcessing}
                    className="w-full py-3.5 px-4 rounded-xl bg-[#c0881b] hover:bg-[#a97514] active:scale-98 text-white font-cinzel font-semibold text-xs sm:text-sm uppercase tracking-wider transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
                  >
                    {isProcessing ? (
                      <>
                        <RotateCcw className="w-4 h-4 animate-spin" />
                        <span>Confirming Sacred Order...</span>
                      </>
                    ) : (
                      <>
                        <Lock className="w-4 h-4" />
                        <span>Pay ₹{grandTotal} &amp; Complete Order</span>
                      </>
                    )}
                  </button>

                  <div className="flex items-center justify-center gap-3 text-[10.5px] text-stone-500">
                    <span className="flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      100% Charcoal-Free
                    </span>
                    <span>•</span>
                    <span>Temple Insured Dispatch</span>
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
