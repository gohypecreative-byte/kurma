"use client";

import { useState, useMemo, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  getProductById,
  ProductSKU,
  formatPrice,
  createCartItemId,
  PRODUCTS,
} from "@/lib/products";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { useCart } from "@/lib/cart-context";
import {
  Star,
  ShieldCheck,
  Check,
  PenTool,
  Lock,
  ArrowRight,
  QrCode,
  CreditCard,
  Banknote,
  CheckCircle2,
  Printer,
  RotateCcw,
  Leaf,
  ShoppingBag,
  Layers,
  ChevronRight,
  ChevronLeft,
  Plus,
  Minus,
  Mountain,
  Droplets,
  Flame,
  Wind,
  Compass,
  Gift,
  Truck,
  Share2,
  Copy,
  Bookmark,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

// Sacred Element Fragrances that make up the Suite
const ELEMENT_FRAGRANCES = [
  {
    id: "fragrance-earth",
    name: "Prithvi (Earth)",
    icon: Mountain,
    notes: "Sacred Vetiver (Khus), Sandalwood & Forest Moss",
    image: "/images/product/earth-front.png",
    price: 399,
    accent: "text-amber-800 bg-amber-50 border-amber-200",
  },
  {
    id: "fragrance-water",
    name: "Jal (Water)",
    icon: Droplets,
    notes: "Blue Lotus, Crisp Rain & Himalayan Amber",
    image: "/images/product/water-front.png",
    price: 399,
    accent: "text-sky-800 bg-sky-50 border-sky-200",
  },
  {
    id: "fragrance-fire",
    name: "Agni (Fire)",
    icon: Flame,
    notes: "Golden Ceylon Clove, Cassia & Smoked Dammar",
    image: "/images/product/fire-front.png",
    price: 399,
    accent: "text-orange-800 bg-orange-50 border-orange-200",
  },
  {
    id: "fragrance-air",
    name: "Vayu (Air)",
    icon: Wind,
    notes: "Desi Gulab Petals, Camphor & Morning Dew",
    image: "/images/product/air-front.png",
    price: 399,
    accent: "text-teal-800 bg-teal-50 border-teal-200",
  },
  {
    id: "fragrance-space",
    name: "Akasha (Space)",
    icon: Compass,
    notes: "Wild Oudh (Agarwood), Frankincense & Rare Myrrh",
    image: "/images/product/space-front.png",
    price: 399,
    accent: "text-purple-800 bg-purple-50 border-purple-200",
  },
];

// Sacred Accessories available to add into the suite / box
interface AccessoryAddon {
  id: string;
  name: string;
  price: number;
  image: string;
  badge: string;
  description: string;
}

const ACCESSORY_ADDONS: AccessoryAddon[] = [
  {
    id: "turtle-incense-holder",
    name: "Solid Brass Turtle Burner",
    price: 699,
    image: "/images/product/turtle-holder-clean.png",
    badge: "Pure Solid Brass",
    description: "Moradabad cast brass single-hole burner with antique hand patina",
  },
  {
    id: "medallion",
    name: "Sacred 5 Elements Medallion",
    price: 499,
    image: "/images/product/medallion-clean.png",
    badge: "Antique Talisman",
    description: "Heavy brass meditation coin engraved with the 5 sacred elements",
  },
  {
    id: "bookmark",
    name: "Silk Tassel Gold Bookmark",
    price: 199,
    image: "/images/product/bookmark-clean.png",
    badge: "Deckle Paper",
    description: "Textured paper tag with gold foil Kurma emblem & emerald silk tassel",
  },
  {
    id: "pashmina-pocket-square",
    name: "Embroidered Pashmina Square",
    price: 999,
    image: "/images/product/pashmina-clean.png",
    badge: "Pure Cashmere Blend",
    description: "Dark forest green pashmina with hand-embroidered gold zari Kurma turtle",
  },
];

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const rawId = params?.id as string;
  const productId = rawId || "5-elements-suite";

  const { cartCount, setIsCartOpen, addToCart } = useCart();

  // Load product definition
  const product: ProductSKU = useMemo(() => {
    return getProductById(productId) || getProductById("5-elements-suite") || PRODUCTS[0];
  }, [productId]);

  const isSuite = product.id === "5-elements-suite" || product.id === "marble-gift-box" || product.id === "mdf-gift-box";
  const isFragrance = product.category === "Fragrances";

  // Curate high-res gallery perspectives with authentic 3D & studio assets
  const galleryImages = useMemo(() => {
    const list: { src: string; title: string; badge: string }[] = [];

    // 1. Primary main visual (front view)
    list.push({
      src: product.image,
      title: `${product.name} Front View`,
      badge: "Front Presentation",
    });

    // 2. 3D Studio perspective angle
    const elemKey = product.id.replace("fragrance-", "");
    const threeDMap: Record<string, string> = {
      water: "/images/product/water-3d.png",
      earth: "/images/product/earth-3d.png",
      fire: "/images/product/fire-3d.png",
      air: "/images/product/air-3d.png",
      space: "/images/product/space-3d.png",
    };

    if (threeDMap[elemKey]) {
      list.push({
        src: threeDMap[elemKey],
        title: `${product.name} 3D Angle`,
        badge: "3D Studio Angle",
      });
    }

    // 3. Five Elements Ensemble
    if (product.id === "5-elements-suite" || product.id === "marble-gift-box" || product.id === "mdf-gift-box") {
      list.push({
        src: "/images/product/suite-clean.png",
        title: "Curated Keepsake Trunk Layout",
        badge: "Heirloom Trunk Open View",
      });
      list.push({
        src: "/images/product/five-boxes-3d.png",
        title: "All 5 Elemental Incense Boxes",
        badge: "5 Elements Ensemble",
      });
    } else {
      list.push({
        src: "/images/product/five-boxes-3d.png",
        title: "Five Sacred Elements Harmony",
        badge: "Complete Suite Pairing",
      });
    }

    // 4. Solid Brass Accessory / Heirloom Burner
    list.push({
      src: "/images/product/turtle-holder-clean.png",
      title: "Solid Brass Turtle Burner",
      badge: "Pure Moradabad Brass",
    });

    // 5. If product has custom gallery items
    if (product.gallery && product.gallery.length > 0) {
      product.gallery.forEach((img, idx) => {
        if (!list.some((item) => item.src === img)) {
          list.push({
            src: img,
            title: `Artisanal Detail ${idx + 1}`,
            badge: "Artisanal Detail",
          });
        }
      });
    }

    return list;
  }, [product]);

  const [selectedImage, setSelectedImage] = useState<string>(product.image);

  useEffect(() => {
    setSelectedImage(product.image);
  }, [product.image]);

  const activeIndex = useMemo(() => {
    const idx = galleryImages.findIndex((img) => img.src === (selectedImage || galleryImages[0].src));
    return idx >= 0 ? idx : 0;
  }, [galleryImages, selectedImage]);

  const nextImage = () => {
    const nextIdx = (activeIndex + 1) % galleryImages.length;
    setSelectedImage(galleryImages[nextIdx].src);
  };

  const prevImage = () => {
    const prevIdx = (activeIndex - 1 + galleryImages.length) % galleryImages.length;
    setSelectedImage(galleryImages[prevIdx].src);
  };

  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);

  // Included Elements Selection in Suite (All 5 selected by default)
  const [selectedElements, setSelectedElements] = useState<Record<string, boolean>>({
    "fragrance-earth": true,
    "fragrance-water": true,
    "fragrance-fire": true,
    "fragrance-air": true,
    "fragrance-space": true,
  });

  // Additional Elements added if viewing an individual fragrance
  const [additionalElements, setAdditionalElements] = useState<Record<string, boolean>>({});

  // Add-on Sacred Accessories state
  const [selectedAddons, setSelectedAddons] = useState<Record<string, boolean>>({});

  // Customization fields state (engraving, wrap, blessing)
  const [customValues, setCustomValues] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    product.customizationFields.forEach((f) => {
      if (f.defaultValue) initial[f.id] = f.defaultValue;
      else if (f.options && f.options.length > 0) initial[f.id] = f.options[0].value;
      else initial[f.id] = "";
    });
    return initial;
  });

  const [openAccordions, setOpenAccordions] = useState<Record<string, boolean>>({
    description: true,
    notes: false,
    craftsmanship: false,
  });
  const [copiedPromo, setCopiedPromo] = useState(false);
  const [copiedShare, setCopiedShare] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const toggleAccordion = (key: string) => {
    setOpenAccordions((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Toggle included element in suite
  const toggleSuiteElement = (elementId: string) => {
    setSelectedElements((prev) => {
      const activeCount = Object.values(prev).filter(Boolean).length;
      // Keep at least 1 element selected
      if (prev[elementId] && activeCount <= 1) return prev;
      return { ...prev, [elementId]: !prev[elementId] };
    });
  };

  // Toggle accessory add-on
  const toggleAddon = (addonId: string) => {
    setSelectedAddons((prev) => ({
      ...prev,
      [addonId]: !prev[addonId],
    }));
  };

  // Toggle additional element (for single fragrance pages)
  const toggleAdditionalElement = (elementId: string) => {
    setAdditionalElements((prev) => ({
      ...prev,
      [elementId]: !prev[elementId],
    }));
  };

  // Calculate unit price including add-on products and field deltas
  const addonsTotal = useMemo(() => {
    return Object.entries(selectedAddons).reduce((sum, [id, isSelected]) => {
      if (!isSelected) return sum;
      const item = ACCESSORY_ADDONS.find((a) => a.id === id);
      return sum + (item ? item.price : 0);
    }, 0);
  }, [selectedAddons]);

  const extraElementsTotal = useMemo(() => {
    return Object.entries(additionalElements).reduce((sum, [_, isSelected]) => {
      if (!isSelected) return sum;
      return sum + 399;
    }, 0);
  }, [additionalElements]);

  const fieldsDeltaTotal = useMemo(() => {
    let delta = 0;
    product.customizationFields.forEach((field) => {
      if (field.options) {
        const selectedOpt = field.options.find(
          (opt) => opt.value === customValues[field.id]
        );
        if (selectedOpt?.priceDelta) {
          delta += selectedOpt.priceDelta;
        }
      }
    });
    return delta;
  }, [product.customizationFields, customValues]);

  const unitPrice = product.price + addonsTotal + extraElementsTotal + fieldsDeltaTotal;
  const totalPrice = unitPrice * quantity;

  // Checkout form state
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

  const [copiedUpi, setCopiedUpi] = useState(false);
  const upiId = "kurma.vedic@icici";

  const handleFieldChange = (id: string, val: string) => {
    setCustomValues((prev) => ({ ...prev, [id]: val }));
  };

  const getReadableCustomizations = () => {
    const readable: Record<string, string> = {};

    // Standard fields (engraving, etc.)
    product.customizationFields.forEach((f) => {
      const val = customValues[f.id];
      if (val && val.trim() !== "" && val !== "None") {
        readable[f.label] = val;
      }
    });

    // Included suite elements
    if (isSuite) {
      const included = Object.entries(selectedElements)
        .filter(([_, active]) => active)
        .map(([id]) => ELEMENT_FRAGRANCES.find((e) => e.id === id)?.name || id)
        .join(", ");
      readable["Elements in Suite"] = included || "All 5 Elements";
    }

    // Additional elements (if on fragrance page)
    if (isFragrance) {
      const extra = Object.entries(additionalElements)
        .filter(([_, active]) => active)
        .map(([id]) => ELEMENT_FRAGRANCES.find((e) => e.id === id)?.name || id);
      if (extra.length > 0) {
        readable["Additional Elements"] = extra.join(" + ");
      }
    }

    // Selected sacred accessories
    const activeAddons = Object.entries(selectedAddons)
      .filter(([_, active]) => active)
      .map(([id]) => ACCESSORY_ADDONS.find((a) => a.id === id)?.name || id);
    if (activeAddons.length > 0) {
      readable["Sacred Accessories Added"] = activeAddons.join(" + ");
    }

    return readable;
  };

  const handleAddToCart = () => {
    addToCart({
      id: createCartItemId(product.id),
      skuId: product.id,
      name: product.name,
      price: unitPrice,
      priceDisplay: formatPrice(unitPrice),
      image: selectedImage || product.image,
      quantity,
      customizations: getReadableCustomizations(),
    });

    setAdded(true);
    setTimeout(() => setAdded(false), 1400);
  };

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customer.name.trim() || !customer.phone.trim() || !customer.address.trim()) {
      alert("Please provide recipient name, phone, and complete delivery address.");
      return;
    }

    setIsProcessing(true);
    setTimeout(() => {
      const generatedId = `KRM-${Math.floor(100000 + Math.random() * 900000)}`;
      setOrderConfirmation({
        orderId: generatedId,
        total: totalPrice,
        placedAt: new Date().toLocaleDateString("en-IN", {
          day: "numeric",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
      });

      addToCart({
        id: createCartItemId(product.id),
        skuId: product.id,
        name: product.name,
        price: unitPrice,
        priceDisplay: formatPrice(unitPrice),
        image: selectedImage || product.image,
        quantity,
        customizations: getReadableCustomizations(),
      });

      setIsProcessing(false);
    }, 1100);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-stone-900 selection:bg-[#eed08e] selection:text-[#072515]">
      <Navbar cartCount={cartCount} onOpenCart={() => setIsCartOpen(true)} />

      <main className="flex-1 w-full max-w-[1440px] mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8 space-y-6 sm:space-y-8 pb-20 sm:pb-8">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs font-sans text-stone-400">
          <Link href="/" className="hover:text-stone-800 transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3 h-3 text-stone-300" />
          <Link href="/elements" className="hover:text-stone-800 transition-colors">
            5 Elements
          </Link>
          <ChevronRight className="w-3 h-3 text-stone-300" />
          <span className="text-stone-800 font-medium truncate max-w-[200px] sm:max-w-none">
            {product.name}
          </span>
        </nav>

        {/* ORDER SUCCESS SCREEN */}
        {orderConfirmation ? (
          <div className="bg-white rounded-3xl border border-[#eed08e]/80 shadow-2xl p-6 sm:p-12 max-w-2xl mx-auto text-center space-y-6 animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-full bg-[#fbf6ea] border-2 border-[#eed08e] text-[#c0881b] flex items-center justify-center mx-auto shadow-sm">
              <CheckCircle2 className="w-9 h-9 stroke-[2.2]" />
            </div>

            <div className="space-y-1">
              <span className="text-[11px] font-cinzel uppercase tracking-widest text-[#8b5f10] font-bold">
                Order Confirmed &amp; Sanctified
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif text-stone-900 font-normal">
                Thank You, {customer.name || "Devotee"}!
              </h2>
              <p className="text-xs text-stone-500 max-w-md mx-auto leading-relaxed">
                Your customized sacred elemental creation has been confirmed and queued for immediate artisan packing in Mysore.
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
                  <span>Product:</span>
                  <span className="font-medium text-stone-900">{product.name} (x{quantity})</span>
                </div>
                {Object.entries(getReadableCustomizations()).map(([label, val]) => (
                  <div key={label} className="flex justify-between">
                    <span>{label}:</span>
                    <span className="font-medium text-stone-900">{val}</span>
                  </div>
                ))}
                <div className="flex justify-between">
                  <span>Delivery Address:</span>
                  <span className="font-medium text-stone-900 truncate max-w-[200px]">
                    {customer.address}, {customer.city}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Payment Mode:</span>
                  <span className="font-bold text-emerald-700 uppercase">
                    {paymentMethod === "cod" ? "Cash on Delivery" : "Paid Online"}
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
                onClick={() => setOrderConfirmation(null)}
                className="flex-1 py-3 px-4 rounded-xl bg-[#072515] hover:bg-[#0c3823] text-[#eed08e] text-xs font-cinzel font-semibold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-colors"
              >
                <span>Continue Shopping</span>
              </button>
            </div>
          </div>
        ) : (
          /* MAIN TWO-COLUMN PRODUCT DETAIL & CUSTOMIZATION STAGE (Balanced 6-Col / 6-Col Grid) */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-10 xl:gap-12 items-start w-full">
            {/* LEFT COLUMN: Luxury Studio Gallery with Interactive Canvas & Heritage Guarantee */}
            <div className="lg:col-span-6 xl:col-span-6 space-y-3 sm:space-y-4 lg:sticky lg:top-24 min-w-0">
              {/* Main Hero Showcase Canvas */}
              <div className="relative w-full aspect-square sm:aspect-[4/4.2] lg:aspect-[4/4.5] max-h-[440px] sm:max-h-[560px] rounded-2xl sm:rounded-3xl overflow-hidden bg-[#FAF8F5] border border-stone-200/90 shadow-xs flex items-center justify-center p-3 sm:p-8 group select-none">
                {/* Visual Perspective Badge (Top-Left) */}
                <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-10">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full bg-white/95 backdrop-blur-xs border border-stone-200/70 shadow-2xs text-[9.5px] sm:text-[10px] font-cinzel font-semibold tracking-wider uppercase text-stone-700">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#c0881b]" />
                    {galleryImages[activeIndex]?.badge || "Studio Perspective"}
                  </span>
                </div>

                {/* Image Counter (Top-Right) */}
                <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10">
                  <span className="inline-flex items-center px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full bg-white/95 backdrop-blur-xs border border-stone-200/70 shadow-2xs text-[10px] sm:text-[11px] font-mono font-medium text-stone-500">
                    {activeIndex + 1} / {galleryImages.length}
                  </span>
                </div>

                {/* Main Centered Product Image */}
                <div className="relative w-full h-full flex items-center justify-center">
                  <Image
                    src={selectedImage || galleryImages[0]?.src || product.image}
                    alt={galleryImages[activeIndex]?.title || product.name}
                    fill
                    priority
                    className="object-contain p-2 sm:p-4 drop-shadow-[0_12px_24px_rgba(0,0,0,0.08)] transition-transform duration-500 ease-out group-hover:scale-[1.04]"
                    sizes="(max-width: 1024px) 100vw, 600px"
                  />
                </div>

                {/* Floating Chevron Navigation (Visible on hover and touch) */}
                {galleryImages.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={prevImage}
                      aria-label="Previous view"
                      className="absolute left-2.5 sm:left-3.5 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/90 hover:bg-white text-stone-700 hover:text-stone-950 shadow-md border border-stone-200/80 flex items-center justify-center cursor-pointer transition-all duration-200 opacity-90 sm:opacity-0 group-hover:opacity-100 hover:scale-105 active:scale-95 z-10"
                    >
                      <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 -ml-0.5" />
                    </button>
                    <button
                      type="button"
                      onClick={nextImage}
                      aria-label="Next view"
                      className="absolute right-2.5 sm:right-3.5 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/90 hover:bg-white text-stone-700 hover:text-stone-950 shadow-md border border-stone-200/80 flex items-center justify-center cursor-pointer transition-all duration-200 opacity-90 sm:opacity-0 group-hover:opacity-100 hover:scale-105 active:scale-95 z-10"
                    >
                      <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 -mr-0.5" />
                    </button>
                  </>
                )}

                {/* Live Debossed Monogram Preview Overlay */}
                {customValues["lid_engraving"] && (
                  <div className="absolute bottom-3 inset-x-3 sm:bottom-4 sm:inset-x-4 bg-stone-900/90 backdrop-blur-md border border-[#eed08e]/60 rounded-xl p-2.5 sm:p-3 flex items-center justify-between text-white shadow-xl animate-in fade-in duration-200 z-10">
                    <div className="flex items-center gap-2">
                      <PenTool className="w-3.5 h-3.5 text-[#eed08e]" />
                      <span className="text-[10px] uppercase font-cinzel tracking-wider text-stone-300">
                        Live Debossed Monogram
                      </span>
                    </div>
                    <span className="font-serif text-xs text-[#eed08e] font-semibold italic">
                      &quot;{customValues["lid_engraving"]}&quot;
                    </span>
                  </div>
                )}
              </div>

              {/* Thumbnails Selector Strip */}
              {galleryImages.length > 1 && (
                <div className="grid grid-cols-5 gap-2 sm:gap-2.5 w-full">
                  {galleryImages.map((img, idx) => {
                    const isSelected = selectedImage === img.src || (idx === 0 && !selectedImage);
                    return (
                      <button
                        key={img.src + idx}
                        type="button"
                        onClick={() => setSelectedImage(img.src)}
                        className={`relative aspect-square rounded-xl overflow-hidden bg-[#FAF8F5] border p-1 sm:p-2 transition-all duration-200 cursor-pointer flex items-center justify-center group ${
                          isSelected
                            ? "border-[#c0881b] ring-2 ring-[#c0881b]/35 shadow-xs bg-white"
                            : "border-stone-200/80 hover:border-stone-400 hover:bg-white/60 shadow-2xs"
                        }`}
                        title={img.title}
                      >
                        <div className="relative w-full h-full">
                          <Image
                            src={img.src}
                            alt={img.title}
                            fill
                            className="object-contain p-0.5 group-hover:scale-105 transition-transform duration-200"
                            sizes="120px"
                          />
                        </div>
                        {isSelected && (
                          <span className="absolute bottom-1 w-3.5 h-0.5 rounded-full bg-[#c0881b]" />
                        )}
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Heritage Craftsmanship Guarantee Bar */}
              <div className="bg-[#fcfaf6] sm:bg-[#fbf6ea]/40 rounded-xl sm:rounded-2xl border border-stone-200/90 sm:border-[#eed08e]/50 p-2.5 sm:p-3.5 shadow-2xs grid grid-cols-3 divide-x divide-stone-200/80 sm:divide-[#eed08e]/40 text-center">
                <div className="px-1 sm:px-2 flex flex-col items-center justify-center text-center">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#fbf6ea] border border-[#eed08e]/70 flex items-center justify-center mb-1.5 shadow-2xs">
                    <Leaf className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#c0881b]" />
                  </div>
                  <span className="text-[9px] sm:text-[11px] font-cinzel font-bold text-stone-900 tracking-wider uppercase leading-tight whitespace-nowrap">
                    Charcoal-Free
                  </span>
                  <p className="text-[8px] sm:text-[10px] text-stone-500 font-sans leading-tight mt-0.5 whitespace-nowrap">
                    Temple Flora &amp; Resins
                  </p>
                </div>
                <div className="px-1 sm:px-2 flex flex-col items-center justify-center text-center">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#fbf6ea] border border-[#eed08e]/70 flex items-center justify-center mb-1.5 shadow-2xs">
                    <Droplets className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#c0881b]" />
                  </div>
                  <span className="text-[9px] sm:text-[11px] font-cinzel font-bold text-stone-900 tracking-wider uppercase leading-tight whitespace-nowrap">
                    Mysore Guilds
                  </span>
                  <p className="text-[8px] sm:text-[10px] text-stone-500 font-sans leading-tight mt-0.5 whitespace-nowrap">
                    Master Hand-Rolled
                  </p>
                </div>
                <div className="px-1 sm:px-2 flex flex-col items-center justify-center text-center">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#fbf6ea] border border-[#eed08e]/70 flex items-center justify-center mb-1.5 shadow-2xs">
                    <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#c0881b]" />
                  </div>
                  <span className="text-[9px] sm:text-[11px] font-cinzel font-bold text-stone-900 tracking-wider uppercase leading-tight whitespace-nowrap">
                    Heirloom Brass
                  </span>
                  <p className="text-[8px] sm:text-[10px] text-stone-500 font-sans leading-tight mt-0.5 whitespace-nowrap">
                    Solid Moradabad Cast
                  </p>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: Customization, Products to Add into the Element & Express Pay */}
            <div className="lg:col-span-6 xl:col-span-6 min-w-0 bg-white rounded-2xl sm:rounded-3xl border border-stone-200/90 shadow-sm p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-5">
              {/* Product Title & Badge */}
              <div className="space-y-1.5">
                <div>
                  <span className="inline-block text-[10px] sm:text-[11px] font-sans font-bold tracking-wider uppercase text-white bg-[#072515] px-2.5 py-0.5 rounded-md shadow-2xs">
                    {product.badge || (isFragrance ? "New Arrivals" : "Flagship Suite")}
                  </span>
                </div>
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-serif font-bold text-stone-900 tracking-tight leading-tight">
                  {product.name}
                </h1>
                <p className="text-xs sm:text-sm text-stone-500 font-sans leading-relaxed">
                  {product.subtitle || "Handcrafted Vedic formulation with pure Mysore botanicals & temple flower resins"}
                </p>
              </div>

              {/* Price & Taxes Row */}
              <div className="space-y-0.5 pt-0.5">
                <div className="flex items-baseline gap-2.5">
                  <span className="text-2xl sm:text-3xl font-bold font-serif text-stone-900 tracking-tight">
                    {formatPrice(unitPrice)}
                  </span>
                  {product.originalPrice && product.originalPrice > unitPrice && (
                    <>
                      <span className="text-sm sm:text-base text-stone-400 line-through font-sans">
                        {formatPrice(product.originalPrice)}
                      </span>
                      <span className="text-xs sm:text-sm font-bold text-emerald-600 font-sans">
                        {Math.round(((product.originalPrice - unitPrice) / product.originalPrice) * 100)}% off
                      </span>
                    </>
                  )}
                </div>
                <p className="text-[11px] text-stone-400 font-sans">
                  (MRP Inclusive of all taxes)
                </p>
              </div>

              {/* Complementary Elemental Pairings (for single fragrance) */}
              {isFragrance && (
                <div className="space-y-2 pt-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-stone-900">
                      Pair with Complementary Elements
                    </span>
                    <span className="text-[11px] text-[#8b5f10] font-medium">+₹399 each</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {ELEMENT_FRAGRANCES.filter((el) => el.id !== product.id).map((element) => {
                      const isAdded = !!additionalElements[element.id];
                      return (
                        <button
                          type="button"
                          key={element.id}
                          onClick={() => toggleAdditionalElement(element.id)}
                          className={`p-2.5 rounded-xl border text-left transition-all flex items-center gap-2.5 cursor-pointer ${
                            isAdded
                              ? "border-[#c0881b] bg-[#fbf6ea] shadow-xs"
                              : "border-stone-200 bg-white hover:border-stone-300"
                          }`}
                        >
                          <div className="relative w-9 h-11 rounded-lg overflow-hidden bg-[#FAF8F5] shrink-0 border border-stone-200 p-0.5">
                            <Image src={element.image} alt={element.name} fill className="object-contain" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <span className="text-xs font-semibold text-stone-900 block truncate">
                              {element.name}
                            </span>
                            <span className="text-[11px] text-stone-500 font-mono">
                              {isAdded ? "✓ Added" : "+₹399"}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Included Elements in Suite (for Gift Trunks/Suite) */}
              {isSuite && (
                <div className="space-y-2 pt-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-stone-900">
                      Included in Suite (5 Boxes)
                    </span>
                    <span className="text-[11px] text-emerald-700 font-semibold">
                      ₹1,995 MRP Value Included
                    </span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {ELEMENT_FRAGRANCES.map((element, idx) => {
                      const isIncluded = !!selectedElements[element.id];
                      return (
                        <button
                          type="button"
                          key={element.id}
                          onClick={() => toggleSuiteElement(element.id)}
                          className={`p-2 rounded-xl border text-left transition-all flex items-center gap-2 cursor-pointer ${
                            isIncluded
                              ? "border-[#c0881b] bg-[#fbf6ea]"
                              : "border-stone-200 bg-stone-50 opacity-60"
                          } ${idx === 4 ? "col-span-2 sm:col-span-1" : ""}`}
                        >
                          <div className="relative w-7 h-9 rounded overflow-hidden shrink-0 border border-stone-200 bg-white p-0.5">
                            <Image src={element.image} alt={element.name} fill className="object-contain" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <span className="text-[11px] font-semibold text-stone-900 block truncate">
                              {element.name}
                            </span>
                            <span className="text-[10px] text-emerald-700 block">
                              {isIncluded ? "Included" : "Removed"}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Optional Sacred Keepsake Addons */}
              <div className="space-y-2 pt-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-stone-900">
                    Sacred Keepsakes &amp; Burners
                  </span>
                  <span className="text-[10px] text-stone-400 uppercase tracking-wider font-cinzel">
                    Optional Add-ons
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {ACCESSORY_ADDONS.slice(0, 2).map((addon) => {
                    const isSelected = !!selectedAddons[addon.id];
                    return (
                      <button
                        type="button"
                        key={addon.id}
                        onClick={() => toggleAddon(addon.id)}
                        className={`p-2.5 sm:p-3 rounded-xl border text-left transition-all flex items-center justify-between gap-3 cursor-pointer ${
                          isSelected
                            ? "border-[#c0881b] bg-[#fbf6ea] shadow-xs"
                            : "border-stone-200 bg-white hover:border-stone-300"
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0 flex-1">
                          <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-stone-100 shrink-0 border border-stone-200">
                            <Image src={addon.image} alt={addon.name} fill className="object-cover" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <span className="text-xs font-semibold text-stone-900 block">
                              {addon.name}
                            </span>
                            <span className="text-[10px] text-stone-500 font-sans block">
                              {addon.id === "turtle-incense-holder" ? "Solid cast brass stand" : "Heirloom brass token"}
                            </span>
                          </div>
                        </div>
                        <span className="text-xs font-bold text-[#8b5f10] font-mono shrink-0">
                          {isSelected ? "✓ Added" : `+${formatPrice(addon.price)}`}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Quantity Stepper matching reference layout */}
              <div className="flex items-center justify-between pt-1">
                <span className="text-xs font-bold text-stone-900 font-sans">Quantity :</span>
                <div className="flex items-center border border-stone-200 rounded-lg overflow-hidden bg-stone-50 shadow-2xs">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="w-8 h-8 flex items-center justify-center text-stone-600 hover:bg-stone-200 transition-colors cursor-pointer text-sm font-bold"
                    title="Decrease quantity"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-10 text-center text-xs font-bold text-stone-900 font-mono">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => q + 1)}
                    className="w-8 h-8 flex items-center justify-center text-stone-600 hover:bg-stone-200 transition-colors cursor-pointer text-sm font-bold"
                    title="Increase quantity"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Delivery Estimate matching reference */}
              <div className="flex items-start gap-2.5 text-xs text-stone-700 bg-stone-50/80 p-3 rounded-xl border border-stone-200/70">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span className="leading-snug">
                  Delivery within 2–3 business days. Next-day delivery is available in Delhi NCR.
                </span>
              </div>

              {/* Services and benefits 2x2 grid matching reference */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-stone-900">Services and benefits</h4>
                <div className="rounded-2xl border border-stone-200/90 bg-stone-50/60 p-4">
                  <div className="grid grid-cols-2 gap-y-3.5 gap-x-4 text-xs text-stone-700">
                    <div className="flex items-center gap-2.5">
                      <Truck className="w-4 h-4 text-stone-900 shrink-0" />
                      <span className="font-medium text-stone-800">Fast, Free Shipping</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <ShieldCheck className="w-4 h-4 text-stone-900 shrink-0" />
                      <span className="font-medium text-stone-800">100% Charcoal-Free</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <CreditCard className="w-4 h-4 text-stone-900 shrink-0" />
                      <span className="font-medium text-stone-800">Lowest Price Guarantee</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <ShieldCheck className="w-4 h-4 text-stone-900 shrink-0" />
                      <span className="font-medium text-stone-800">Mysore Artisan Crafted</span>
                    </div>
                  </div>
                </div>
              </div>

                            {/* Dual Action CTAs matching reference layout */}
              <div className="space-y-2 pt-1">
                <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
                  <button
                    type="button"
                    onClick={handleAddToCart}
                    className={`w-full py-3 sm:py-3.5 px-2 sm:px-4 rounded-xl text-xs sm:text-sm font-bold uppercase tracking-wider transition-all shadow-sm flex items-center justify-center gap-1.5 sm:gap-2 cursor-pointer active:scale-98 ${
                      added
                        ? "bg-emerald-700 text-white"
                        : "bg-[#072515] hover:bg-[#0c3823] text-white"
                    }`}
                  >
                    {added ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span className="truncate">Added</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-4 h-4 text-[#eed08e] shrink-0" />
                        <span className="truncate">Add to Cart</span>
                      </>
                    )}
                  </button>

                  <div className="relative w-full">
                    <div className="absolute -top-2.5 right-2 sm:right-4 z-10 pointer-events-none">
                      <span className="bg-emerald-600 text-white text-[8px] sm:text-[9px] font-bold px-1.5 sm:px-2 py-0.5 rounded-full uppercase tracking-wider shadow-xs whitespace-nowrap">
                        EASY UPI
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setShowCheckout(!showCheckout);
                        if (!showCheckout) {
                          setTimeout(() => {
                            const el = document.getElementById("express-checkout-form");
                            if (el) el.scrollIntoView({ behavior: "smooth" });
                          }, 100);
                        }
                      }}
                      className="w-full py-3 sm:py-3.5 px-2 sm:px-4 rounded-xl bg-[#c0881b] hover:bg-[#a97514] text-white text-xs sm:text-sm font-bold uppercase tracking-wider transition-all shadow-sm flex items-center justify-center gap-1.5 sm:gap-2 cursor-pointer active:scale-98"
                    >
                      <span className="truncate">Buy Now</span>
                      <span className="hidden xs:inline-flex items-center gap-0.5 bg-white/95 px-1 py-0.5 rounded-xs shadow-2xs text-stone-900 shrink-0">
                        <span className="font-bold text-[9px] text-blue-600">G</span>
                        <span className="font-bold text-[8.5px] text-[#002e6e]">Pay</span>
                      </span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Inline Express Checkout Form (toggled on Buy Now) */}
              {showCheckout && (
                <form
                  id="express-checkout-form"
                  onSubmit={handlePlaceOrder}
                  className="bg-white border border-[#eed08e]/70 rounded-2xl p-4 sm:p-5 space-y-4 animate-in fade-in duration-200 mt-2 shadow-md"
                >
                  <div className="flex items-center justify-between border-b border-stone-200 pb-2">
                    <h4 className="font-serif text-sm font-bold text-stone-900">
                      Express Delivery Destination
                    </h4>
                    <span className="text-[10px] text-stone-500 font-cinzel uppercase">
                      256-Bit SSL Secured
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
                    <div>
                      <label className="block text-[11px] font-semibold text-stone-700 mb-0.5">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={customer.name}
                        onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
                        placeholder="Radhika Sharma"
                        className="w-full text-xs px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg focus:outline-hidden focus:border-[#c0881b]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-stone-700 mb-0.5">
                        Phone (WhatsApp) *
                      </label>
                      <input
                        type="tel"
                        required
                        value={customer.phone}
                        onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                        placeholder="+91 98765 43210"
                        className="w-full text-xs px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg focus:outline-hidden focus:border-[#c0881b]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-stone-700 mb-0.5">
                      Delivery Address *
                    </label>
                    <textarea
                      rows={2}
                      required
                      value={customer.address}
                      onChange={(e) => setCustomer({ ...customer, address: e.target.value })}
                      placeholder="Flat 402, Street, Landmark"
                      className="w-full text-xs px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg focus:outline-hidden focus:border-[#c0881b]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
                    <div>
                      <label className="block text-[11px] font-semibold text-stone-700 mb-0.5">
                        City *
                      </label>
                      <input
                        type="text"
                        required
                        value={customer.city}
                        onChange={(e) => setCustomer({ ...customer, city: e.target.value })}
                        placeholder="Bengaluru"
                        className="w-full text-xs px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg focus:outline-hidden focus:border-[#c0881b]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-stone-700 mb-0.5">
                        Pincode *
                      </label>
                      <input
                        type="text"
                        required
                        maxLength={6}
                        value={customer.pincode}
                        onChange={(e) => setCustomer({ ...customer, pincode: e.target.value })}
                        placeholder="560001"
                        className="w-full text-xs px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg focus:outline-hidden focus:border-[#c0881b]"
                      />
                    </div>
                  </div>

                  {/* Payment Mode Selection */}
                  <div className="space-y-1.5 pt-1">
                    <label className="block text-[11px] font-semibold text-stone-700">
                      Payment Mode
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        type="button"
                        onClick={() => setPaymentMethod("upi")}
                        className={`p-2 rounded-lg border text-center text-xs flex flex-col items-center gap-1 cursor-pointer transition-all ${
                          paymentMethod === "upi"
                            ? "border-[#c0881b] bg-[#fbf6ea] font-bold text-stone-900"
                            : "border-stone-200 bg-white text-stone-600"
                        }`}
                      >
                        <QrCode className="w-3.5 h-3.5 text-[#c0881b]" />
                        <span>UPI / QR</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setPaymentMethod("card")}
                        className={`p-2 rounded-lg border text-center text-xs flex flex-col items-center gap-1 cursor-pointer transition-all ${
                          paymentMethod === "card"
                            ? "border-[#c0881b] bg-[#fbf6ea] font-bold text-stone-900"
                            : "border-stone-200 bg-white text-stone-600"
                        }`}
                      >
                        <CreditCard className="w-3.5 h-3.5 text-[#c0881b]" />
                        <span>Card</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setPaymentMethod("cod")}
                        className={`p-2 rounded-lg border text-center text-xs flex flex-col items-center gap-1 cursor-pointer transition-all ${
                          paymentMethod === "cod"
                            ? "border-[#c0881b] bg-[#fbf6ea] font-bold text-stone-900"
                            : "border-stone-200 bg-white text-stone-600"
                        }`}
                      >
                        <Banknote className="w-3.5 h-3.5 text-[#c0881b]" />
                        <span>COD</span>
                      </button>
                    </div>

                    {paymentMethod === "upi" && (
                      <div className="p-2.5 bg-stone-50 rounded-lg border border-stone-200 flex items-center justify-between text-xs mt-2">
                        <span className="font-mono text-[11px] text-stone-800 font-bold">{upiId}</span>
                        <button
                          type="button"
                          onClick={() => {
                            navigator.clipboard.writeText(upiId);
                            setCopiedUpi(true);
                            setTimeout(() => setCopiedUpi(false), 2000);
                          }}
                          className="px-2 py-0.5 text-[10px] bg-stone-900 text-white rounded cursor-pointer"
                        >
                          {copiedUpi ? "Copied!" : "Copy VPA"}
                        </button>
                      </div>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={isProcessing}
                    className="w-full py-3 px-4 rounded-xl bg-[#c0881b] hover:bg-[#a97514] text-white font-cinzel font-semibold text-xs sm:text-sm uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
                  >
                    {isProcessing ? (
                      <>
                        <RotateCcw className="w-4 h-4 animate-spin" />
                        <span>Confirming Sacred Order...</span>
                      </>
                    ) : (
                      <>
                        <Lock className="w-3.5 h-3.5" />
                        <span>Pay {formatPrice(totalPrice)} &amp; Complete Order</span>
                      </>
                    )}
                  </button>
                </form>
              )}

              {/* Accordions matching reference layout */}
              <div className="border-t border-stone-200/90 pt-3 space-y-2">
                {/* Description Accordion */}
                <div className="rounded-xl border border-stone-200 overflow-hidden bg-white">
                  <button
                    type="button"
                    onClick={() => toggleAccordion("description")}
                    className="w-full p-4 text-left flex items-center justify-between text-xs font-bold text-stone-900 cursor-pointer hover:bg-stone-50 transition-colors"
                  >
                    <span>Description</span>
                    <div className="w-6 h-6 rounded-full bg-stone-900 text-white flex items-center justify-center text-xs">
                      {openAccordions["description"] ? <Minus className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                    </div>
                  </button>
                  {openAccordions["description"] && (
                    <div className="px-4 pb-4 text-xs text-stone-600 space-y-2 leading-relaxed border-t border-stone-100 pt-3">
                      <p>{product.description}</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
                        {product.details.map((detail, idx) => (
                          <div key={idx} className="flex items-start gap-2 text-[11px] text-stone-600">
                            <span className="text-[#c0881b] mt-0.5">•</span>
                            <span>{detail}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Fragrance Notes Accordion */}
                <div className="rounded-xl border border-stone-200 overflow-hidden bg-white">
                  <button
                    type="button"
                    onClick={() => toggleAccordion("notes")}
                    className="w-full p-4 text-left flex items-center justify-between text-xs font-bold text-stone-900 cursor-pointer hover:bg-stone-50 transition-colors"
                  >
                    <span>Fragrance Notes &amp; Elemental Resonance</span>
                    <div className="w-6 h-6 rounded-full bg-stone-900 text-white flex items-center justify-center text-xs">
                      {openAccordions["notes"] ? <Minus className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                    </div>
                  </button>
                  {openAccordions["notes"] && (
                    <div className="px-4 pb-4 text-xs text-stone-600 space-y-2 leading-relaxed border-t border-stone-100 pt-3">
                      <p>Formulated using pure temple flower resins, therapeutic essential oils, and organic wood powders according to ancient Gandhashastra scriptures.</p>
                      <p className="font-semibold text-stone-800">100% Charcoal-Free • Zero Phthalates • 45 Minute Burn Time per stick</p>
                    </div>
                  )}
                </div>

                {/* Artisanal Heritage Accordion */}
                <div className="rounded-xl border border-stone-200 overflow-hidden bg-white">
                  <button
                    type="button"
                    onClick={() => toggleAccordion("craftsmanship")}
                    className="w-full p-4 text-left flex items-center justify-between text-xs font-bold text-stone-900 cursor-pointer hover:bg-stone-50 transition-colors"
                  >
                    <span>Artisanal Craftsmanship &amp; Burning Time</span>
                    <div className="w-6 h-6 rounded-full bg-stone-900 text-white flex items-center justify-center text-xs">
                      {openAccordions["craftsmanship"] ? <Minus className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                    </div>
                  </button>
                  {openAccordions["craftsmanship"] && (
                    <div className="px-4 pb-4 text-xs text-stone-600 space-y-2 leading-relaxed border-t border-stone-100 pt-3">
                      <p>Each stick is hand-rolled by master women artisans in Mysore, honoring multi-generational perfumery heritage. The slow, clean burn ensures no acrid black smoke, leaving only serene temple tranquility.</p>
                    </div>
                  )}
                </div>

                {/* Optional Monogram Engraving Accordion */}
                {product.customizationFields.some((f) => f.id === "lid_engraving") && (
                  <div className="rounded-xl border border-stone-200 overflow-hidden bg-white">
                    <button
                      type="button"
                      onClick={() => toggleAccordion("engraving")}
                      className="w-full p-4 text-left flex items-center justify-between text-xs font-bold text-stone-900 cursor-pointer hover:bg-stone-50 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <PenTool className="w-3.5 h-3.5 text-[#c0881b]" />
                        <span>Complimentary Lid Engraving &amp; Monogram</span>
                      </div>
                      <div className="w-6 h-6 rounded-full bg-stone-900 text-white flex items-center justify-center text-xs">
                        {openAccordions["engraving"] ? <Minus className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                      </div>
                    </button>
                    {openAccordions["engraving"] && (
                      <div className="px-4 pb-4 text-xs text-stone-600 space-y-2 leading-relaxed border-t border-stone-100 pt-3">
                        <label className="block text-[11px] font-semibold text-stone-700">
                          Custom Name / Initials to Deboss on Lid
                        </label>
                        <input
                          type="text"
                          maxLength={24}
                          value={customValues["lid_engraving"] || ""}
                          onChange={(e) => handleFieldChange("lid_engraving", e.target.value)}
                          placeholder="e.g. ARYA &amp; MEERA"
                          className="w-full text-xs px-3.5 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:border-[#c0881b] focus:outline-hidden"
                        />
                        <p className="text-[10px] text-stone-400">
                          Gold foil hot-stamped into the keepsake box. Free of charge.
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Social Share Bar matching the bottom row of the screenshot */}
              <div className="flex items-center gap-2 pt-2 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(typeof window !== "undefined" ? window.location.href : "")}`, "_blank")}
                  className="w-10 h-10 rounded-xl border border-stone-200 bg-white hover:bg-stone-50 flex items-center justify-center text-stone-600 transition-colors cursor-pointer"
                  title="Share on Facebook"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                  </svg>
                </button>

                <button
                  type="button"
                  onClick={() => window.open("https://instagram.com", "_blank")}
                  className="w-10 h-10 rounded-xl border border-stone-200 bg-white hover:bg-stone-50 flex items-center justify-center text-stone-600 transition-colors cursor-pointer"
                  title="Follow on Instagram"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </button>

                <button
                  type="button"
                  onClick={() => setIsWishlisted(!isWishlisted)}
                  className={`w-10 h-10 rounded-xl border flex items-center justify-center transition-colors cursor-pointer ${
                    isWishlisted
                      ? "border-[#c0881b] bg-[#fbf6ea] text-[#c0881b]"
                      : "border-stone-200 bg-white text-stone-600 hover:bg-stone-50"
                  }`}
                  title={isWishlisted ? "Saved to Wishlist" : "Save to Wishlist"}
                >
                  <Bookmark className={`w-4 h-4 ${isWishlisted ? "fill-[#c0881b]" : ""}`} />
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({
                        title: product.name,
                        text: product.subtitle,
                        url: window.location.href,
                      });
                    } else {
                      navigator.clipboard.writeText(window.location.href);
                      setCopiedShare(true);
                      setTimeout(() => setCopiedShare(false), 2000);
                    }
                  }}
                  className="w-10 h-10 rounded-xl border border-stone-200 bg-white hover:bg-stone-50 flex items-center justify-center text-stone-600 transition-colors cursor-pointer"
                  title="Share Product"
                >
                  <Share2 className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    setCopiedShare(true);
                    setTimeout(() => setCopiedShare(false), 2000);
                  }}
                  className="w-10 h-10 rounded-xl border border-stone-200 bg-white hover:bg-stone-50 flex items-center justify-center text-stone-600 transition-colors cursor-pointer"
                  title="Copy Link"
                >
                  <Copy className="w-4 h-4" />
                </button>

                {copiedShare && (
                  <span className="text-[11px] font-semibold text-emerald-700 animate-in fade-in ml-1">
                    Link copied!
                  </span>
                )}
              </div>

              {/* Insured Dispatch Guarantee */}
              <div className="flex items-center justify-center gap-3 text-[10.5px] text-stone-500 pt-1">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  100% Handcrafted in India
                </span>
                <span>•</span>
                <span>Insured Doorstep Dispatch</span>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Sticky Mobile Quick Buy Bar for Phones */}
      <div className="fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-stone-200/90 px-4 py-2.5 sm:hidden shadow-[0_-4px_20px_rgba(0,0,0,0.08)] flex items-center justify-between gap-3">
        <div className="min-w-0">
          <span className="text-[10px] text-stone-400 block font-sans leading-none">Total Price</span>
          <span className="text-base font-bold font-serif text-stone-900 leading-tight">
            {formatPrice(totalPrice)}
          </span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handleAddToCart}
            className={`p-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
              added
                ? "bg-emerald-700 text-white border-emerald-700"
                : "border-stone-300 text-stone-800 bg-white hover:bg-stone-50"
            }`}
            aria-label="Add to cart"
            title="Add to Cart"
          >
            {added ? <Check className="w-4 h-4 text-emerald-400" /> : <ShoppingBag className="w-4 h-4 text-stone-800" />}
          </button>
          <button
            type="button"
            onClick={() => {
              setShowCheckout(true);
              setTimeout(() => {
                const el = document.getElementById("express-checkout-form");
                if (el) el.scrollIntoView({ behavior: "smooth" });
              }, 100);
            }}
            className="py-2.5 px-4 rounded-xl bg-[#c0881b] hover:bg-[#a97514] text-white text-xs font-bold uppercase tracking-wider shadow-sm flex items-center gap-1.5 cursor-pointer active:scale-98"
          >
            <span>Buy Now</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
}
