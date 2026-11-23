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
import { useProducts } from "@/lib/products-context";
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
  AlertCircle,
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

  const {
    cartCount,
    setIsCartOpen,
    addToCart,
    cartItems,
    getProductStock,
    triggerStockWarning,
  } = useCart();
  const [localStockWarning, setLocalStockWarning] = useState<string | null>(null);

  const { getProduct } = useProducts();

  // Load product definition with live DB synchronization
  const product: ProductSKU = useMemo(() => {
    return (
      getProduct(productId) ||
      getProductById(productId) ||
      getProduct("5-elements-suite") ||
      getProductById("5-elements-suite") ||
      PRODUCTS[0]
    );
  }, [getProduct, productId]);

  const isSuite = product.id === "5-elements-suite" || product.id === "marble-gift-box" || product.id === "mdf-gift-box";
  const isFragrance = product.category === "Fragrances";
  const isTurtleHolder =
    product.id === "turtle-incense-holder" ||
    productId === "turtle-incense-holder";
  const isMarbleBox =
    product.id === "marble-gift-box" ||
    productId === "marble-gift-box";
  const isMdfBox =
    product.id === "mdf-gift-box" ||
    productId === "mdf-gift-box";
  const isHamper =
    product.id === "wicker-silk-incense-basket" ||
    productId === "wicker-silk-incense-basket" ||
    product.category === "Gift Boxes" ||
    [
      "wicker-silk-incense-basket",
      "sacred-buddha-wooden-suite",
      "royal-tea-incense-leatherette-hamper",
      "heirloom-slatted-wooden-trunk",
      "devotional-brass-puja-tray",
      "mindfulness-crystal-sanctuary-crate",
      "festive-lotus-brass-leatherette-tray",
      "celebration-keepsake-basket",
    ].includes(product.id);
  // Clean presentation across all product pages
  const hidePromotionalElements = true;

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

  const productStock = useMemo(() => {
    if (typeof product?.stock === "number") return product.stock;
    return getProductStock ? getProductStock(product?.id) : 25;
  }, [product, getProductStock]);

  const inCartQty = useMemo(() => {
    if (!product?.id || !cartItems) return 0;
    return cartItems
      .filter((i) => i.id === product.id || i.skuId === product.id)
      .reduce((sum, i) => sum + i.quantity, 0);
  }, [cartItems, product?.id]);

  const remainingAvailableStock = Math.max(0, productStock - inCartQty);

  const handleIncrementQuantity = () => {
    if (quantity + inCartQty >= productStock) {
      const msg = `Only ${remainingAvailableStock} available in stock for "${product.name}" (${inCartQty} already in your cart).`;
      setLocalStockWarning(msg);
      if (triggerStockWarning) triggerStockWarning(msg);
      setTimeout(() => setLocalStockWarning(null), 4000);
      return;
    }
    setQuantity((q) => q + 1);
  };

  const handleAddToCart = () => {
    if (remainingAvailableStock <= 0) {
      const msg = `Cannot add more "${product.name}". Only ${productStock} items available in stock and all ${productStock} are already in your cart.`;
      setLocalStockWarning(msg);
      if (triggerStockWarning) triggerStockWarning(msg);
      setIsCartOpen(true);
      return;
    }

    const success = addToCart({
      id: createCartItemId(product.id),
      skuId: product.id,
      name: product.name,
      price: unitPrice,
      priceDisplay: formatPrice(unitPrice),
      image: selectedImage || product.image,
      quantity,
      stock: productStock,
      customizations: getReadableCustomizations(),
    });

    if (success) {
      setAdded(true);
      setTimeout(() => setAdded(false), 1400);
    }
  };

  const handleBuyNow = () => {
    const buyNowItem = {
      id: createCartItemId(product.id),
      skuId: product.id,
      name: product.name,
      price: unitPrice,
      priceDisplay: formatPrice(unitPrice),
      image: selectedImage || product.image,
      quantity,
      customizations: getReadableCustomizations(),
    };
    try {
      localStorage.setItem("kurma_buy_now_item", JSON.stringify(buyNowItem));
    } catch {}
    router.push(`/checkout?productId=${encodeURIComponent(product.id)}&quantity=${quantity}`);
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

      <main className="flex-1 w-full max-w-[1440px] mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8 space-y-6 sm:space-y-8 pb-8">
        {/* Breadcrumb Navigation */}
        {!hidePromotionalElements && (
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
        )}

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
            <div className="lg:col-span-5 xl:col-span-5 space-y-3 sm:space-y-4 lg:sticky lg:top-24 min-w-0 max-w-[480px] sm:max-w-[520px] lg:max-w-none mx-auto w-full">
              {/* Main Hero Showcase Canvas */}
              <div className="relative w-full aspect-[3/4] max-h-[560px] sm:max-h-[640px] rounded-2xl sm:rounded-3xl overflow-hidden bg-[#FAF8F5] border border-stone-200/90 shadow-xs flex items-center justify-center p-0 group select-none">
                {/* Visual Perspective Badge (Top-Left) */}
                {!hidePromotionalElements && (
                  <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-10">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full bg-white/95 backdrop-blur-xs border border-stone-200/70 shadow-2xs text-[9.5px] sm:text-[10px] font-cinzel font-semibold tracking-wider uppercase text-stone-700">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#c0881b]" />
                      {galleryImages[activeIndex]?.badge || "Studio Perspective"}
                    </span>
                  </div>
                )}

                {/* Image Counter (Top-Right) */}
                {!hidePromotionalElements && (
                  <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10">
                    <span className="inline-flex items-center px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full bg-white/95 backdrop-blur-xs border border-stone-200/70 shadow-2xs text-[10px] sm:text-[11px] font-mono font-medium text-stone-500">
                      {activeIndex + 1} / {galleryImages.length}
                    </span>
                  </div>
                )}

                {/* Main Centered Product Image */}
                <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
                  <Image
                    src={selectedImage || galleryImages[0]?.src || product.image}
                    alt={galleryImages[activeIndex]?.title || product.name}
                    fill
                    priority
                    className={`w-full h-full ${
                      isFragrance || selectedImage?.includes("-3d") || selectedImage?.includes("-clean")
                        ? "object-contain p-2 sm:p-4"
                        : "object-cover"
                    } object-center drop-shadow-[0_8px_20px_rgba(0,0,0,0.06)] transition-transform duration-500 ease-out group-hover:scale-[1.02]`}
                    sizes="(max-width: 1024px) 100vw, 700px"
                  />
                </div>

                {/* Floating Chevron Navigation (Visible on hover and touch) */}
                {galleryImages.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={prevImage}
                      aria-label="Previous view"
                      className="absolute left-2.5 sm:left-3.5 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/90 hover:bg-white text-stone-700 hover:text-stone-950 shadow-md border border-stone-200/80 flex items-center justify-center cursor-pointer transition-all duration-200 opacity-90 sm:opacity-0 group-hover:opacity-100 hover:scale-105 active:scale-95 z-20"
                    >
                      <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 -ml-0.5" />
                    </button>
                    <button
                      type="button"
                      onClick={nextImage}
                      aria-label="Next view"
                      className="absolute right-2.5 sm:right-3.5 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/90 hover:bg-white text-stone-700 hover:text-stone-950 shadow-md border border-stone-200/80 flex items-center justify-center cursor-pointer transition-all duration-200 opacity-90 sm:opacity-0 group-hover:opacity-100 hover:scale-105 active:scale-95 z-20"
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
                    <span className="text-xs text-[#eed08e] font-semibold">
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
              {!isHamper && (
                <div className="bg-[#fcfaf6] sm:bg-[#fbf6ea]/40 rounded-xl sm:rounded-2xl border border-stone-200/90 sm:border-[#eed08e]/50 p-2 sm:p-3.5 shadow-2xs grid grid-cols-3 divide-x divide-stone-200/80 sm:divide-[#eed08e]/40 text-center">
                  <div className="px-1 sm:px-2 flex flex-col items-center justify-center text-center">
                    <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-[#fbf6ea] border border-[#eed08e]/70 flex items-center justify-center mb-1 shadow-2xs">
                      <Leaf className="w-3 h-3 sm:w-4 sm:h-4 text-[#c0881b]" />
                    </div>
                    <span className="text-[8.5px] sm:text-[11px] font-cinzel font-bold text-stone-900 tracking-wider uppercase leading-tight">
                      Charcoal-Free
                    </span>
                    <p className="text-[7.5px] sm:text-[10px] text-stone-500 font-sans leading-tight mt-0.5">
                      Temple Flora
                    </p>
                  </div>
                  <div className="px-1 sm:px-2 flex flex-col items-center justify-center text-center">
                    <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-[#fbf6ea] border border-[#eed08e]/70 flex items-center justify-center mb-1 shadow-2xs">
                      <Droplets className="w-3 h-3 sm:w-4 sm:h-4 text-[#c0881b]" />
                    </div>
                    <span className="text-[8.5px] sm:text-[11px] font-cinzel font-bold text-stone-900 tracking-wider uppercase leading-tight">
                      Mysore Guilds
                    </span>
                    <p className="text-[7.5px] sm:text-[10px] text-stone-500 font-sans leading-tight mt-0.5">
                      Master Rolled
                    </p>
                  </div>
                  <div className="px-1 sm:px-2 flex flex-col items-center justify-center text-center">
                    <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-[#fbf6ea] border border-[#eed08e]/70 flex items-center justify-center mb-1 shadow-2xs">
                      <ShieldCheck className="w-3 h-3 sm:w-4 sm:h-4 text-[#c0881b]" />
                    </div>
                    <span className="text-[8.5px] sm:text-[11px] font-cinzel font-bold text-stone-900 tracking-wider uppercase leading-tight">
                      Solid Brass
                    </span>
                    <p className="text-[7.5px] sm:text-[10px] text-stone-500 font-sans leading-tight mt-0.5">
                      Moradabad Cast
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* RIGHT COLUMN: Customization, Products to Add into the Element & Express Pay */}
            <div className="lg:col-span-7 xl:col-span-7 min-w-0 bg-white rounded-2xl sm:rounded-3xl border border-stone-200/90 shadow-sm p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-5">
              {/* Product Title & Badge */}
              <div className="space-y-1.5">
                {!hidePromotionalElements && (
                  <div>
                    <span className="inline-block text-[10px] sm:text-[11px] font-sans font-bold tracking-wider uppercase text-white bg-[#072515] px-2.5 py-0.5 rounded-md shadow-2xs">
                      {product.badge || (isFragrance ? "New Arrivals" : "Flagship Suite")}
                    </span>
                  </div>
                )}
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
                    {!hidePromotionalElements && (
                      <span className="text-[11px] text-emerald-700 font-semibold">
                        ₹1,995 MRP Value Included
                      </span>
                    )}
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
              {!isMarbleBox && (
                <div className="space-y-2 pt-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-stone-900">
                      Sacred Keepsakes &amp; Burners
                    </span>
                    {!hidePromotionalElements && (
                      <span className="text-[10px] text-stone-400 uppercase tracking-wider font-cinzel">
                        Optional Add-ons
                      </span>
                    )}
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
              )}

              {/* Quantity Stepper matching reference layout with stock validation */}
              <div className="space-y-1.5 pt-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-stone-900 font-sans">Quantity :</span>
                  <div className="flex items-center gap-3">
                    <span className="text-[11px] text-stone-500 font-medium">
                      Available: <span className={remainingAvailableStock <= 5 ? "text-amber-700 font-bold" : "text-stone-700 font-semibold"}>{remainingAvailableStock}</span>
                    </span>
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
                        onClick={handleIncrementQuantity}
                        className="w-8 h-8 flex items-center justify-center text-stone-600 hover:bg-stone-200 transition-colors cursor-pointer text-sm font-bold"
                        title="Increase quantity"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>

                {localStockWarning && (
                  <div className="flex items-center gap-1.5 p-2 bg-amber-50/90 border border-amber-200 rounded-lg text-amber-900 text-[11px] font-medium animate-in fade-in">
                    <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    <span>{localStockWarning}</span>
                  </div>
                )}
              </div>

              {/* Delivery Estimate matching reference */}
              {!hidePromotionalElements && (
                <div className="flex items-start gap-2.5 text-xs text-stone-700 bg-stone-50/80 p-3 rounded-xl border border-stone-200/70">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span className="leading-snug">
                    Delivery within 2–3 business days. Next-day delivery is available in Delhi NCR.
                  </span>
                </div>
              )}

              {/* Services and benefits 2x2 grid matching reference */}
              {!isTurtleHolder && !isMarbleBox && (
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
              )}

                            {/* Dual Action CTAs matching reference layout */}
              <div className="space-y-2 pt-1">
                <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
                  <button
                    type="button"
                    onClick={handleAddToCart}
                    style={{ backgroundColor: added ? undefined : "#28513B" }}
                    className={`w-full py-3 sm:py-3.5 px-2 sm:px-4 rounded-xl text-xs sm:text-sm font-bold uppercase tracking-wider transition-all shadow-sm flex items-center justify-center gap-1.5 sm:gap-2 cursor-pointer active:scale-98 ${
                      added
                        ? "bg-emerald-700 text-white"
                        : "bg-[#28513B] hover:bg-[#1e3e2d] text-white"
                    }`}
                  >
                    {added ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span className="truncate">Added</span>
                      </>
                    ) : (
                      <span className="truncate">Add to Cart</span>
                    )}
                  </button>

                  <div className="relative w-full">
                    {!hidePromotionalElements && (
                      <div className="absolute -top-2.5 right-2 sm:right-4 z-10 pointer-events-none">
                        <span className="bg-emerald-600 text-white text-[8px] sm:text-[9px] font-bold px-1.5 sm:px-2 py-0.5 rounded-full uppercase tracking-wider shadow-xs whitespace-nowrap">
                          EASY UPI
                        </span>
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={handleBuyNow}
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
              </div>
            </div>
          </div>
        )}
      </main>



      <Footer />
    </div>
  );
}
