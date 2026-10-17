"use client";

import React, { useState, useEffect, useRef, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  Upload,
  Check,
  Trash2,
  Image as ImageIcon,
  CheckCircle2,
  Package,
  Layers,
  Plus,
  X,
  ExternalLink,
  Save,
  AlertCircle,
  Eye,
  SlidersHorizontal,
  Search,
  RotateCcw,
} from "lucide-react";

export interface AdminCustomBox {
  id: string;
  title: string;
  size: string;
  capacity: number;
  price: number;
  image: string;
  description: string;
  active: boolean;
  features?: string[];
  allowMonogram?: boolean;
}

export const INITIAL_CUSTOM_BOXES: AdminCustomBox[] = [
  {
    id: "celebration",
    title: "The Celebration Box",
    size: "8 x 8 x 4 cm",
    capacity: 4,
    price: 650,
    image: "/images/product/mdf-box-clean.png",
    description: "Royal debossed Kurma emblem rigid wooden box with plush velvet lining.",
    active: true,
    features: ["Royal debossed Kurma emblem", "Plush velvet interior bedding", "Antiqued Moradabad brass clasp"],
    allowMonogram: true,
  },
  {
    id: "heritage",
    title: "The Heritage Box",
    size: "8 x 8 x 4 cm",
    capacity: 4,
    price: 650,
    image: "/images/product/image.png",
    description: "Classic textured heirloom wood finish with antiqued brass clasp.",
    active: true,
    features: ["Classic textured heirloom wood", "Dual hinge mechanism", "Gold foil debossed band"],
    allowMonogram: true,
  },
  {
    id: "wood-small",
    title: "Premium Wooden Storage Box (Small)",
    size: "9 x 7 x 2.5 cm",
    capacity: 3,
    price: 550,
    image: "/images/product/marble-box-clean.png",
    description: "Solid natural pine wood keepsake box with brass hinged lid.",
    active: true,
    features: ["Solid natural pine wood", "Magnetic flush latch", "Compact vanity footprint"],
    allowMonogram: true,
  },
  {
    id: "wood-large",
    title: "Premium Wooden Storage Box (Large)",
    size: "12 x 10 x 4 cm",
    capacity: 7,
    price: 750,
    image: "/images/product/suite-clean.png",
    description: "Expansive luxury teakwood storage trunk for grand gift ensembles.",
    active: true,
    features: ["Expansive teakwood construction", "Double tiered removable insert", "Velvet base feet"],
    allowMonogram: true,
  },
  {
    id: "rustic-basket",
    title: "Premium Rustic Weave Basket",
    size: "10.5 x 8.5 x 5.5 cm",
    capacity: 9,
    price: 1500,
    image: "/images/product/image9.png",
    description: "Handcrafted natural wicker weave tokri with dual bamboo handles.",
    active: true,
    features: ["Natural wicker artisan weave", "Dual bent bamboo carrying handles", "Unbleached organic cotton liner"],
    allowMonogram: false,
  },
  {
    id: "jute-natural",
    title: "Natural Colour Jute Basket",
    size: "12 x 12 x 3 cm",
    capacity: 4,
    price: 650,
    image: "/images/product/five-boxes-3d.png",
    description: "Eco-elegant hand-braided jute round basket with cotton liner.",
    active: true,
    features: ["100% natural braided raw jute", "Circular vanity silhouette", "Artisan tassel cord"],
    allowMonogram: false,
  },
  {
    id: "jute-cross",
    title: "Natural Beige Cross Pattern Basket",
    size: "13 x 7 x 3 cm",
    capacity: 5,
    price: 950,
    image: "/images/product/turtle-holder-clean.png",
    description: "Artisan cross-weave jute & burlap tokri with satin ribbon trim.",
    active: true,
    features: ["Diamond cross-weave burlap", "Forest green satin ribbon edge", "Reinforced cane rim"],
    allowMonogram: false,
  },
  {
    id: "cardboard-printed",
    title: "Premium Cardboard Printed Box",
    size: "10.25 x 8.25 x 3.25 cm",
    capacity: 6,
    price: 450,
    image: "/images/product/image.png",
    description: "Heavyweight rigid board wrapped in gold mandala motif paper.",
    active: true,
    features: ["Heavyweight 1200 GSM rigid board", "Gold mandala screen print", "Magnetic drop-front flap"],
    allowMonogram: true,
  },
  {
    id: "jute-yellow",
    title: "Butter Yellow Jute Tray",
    size: "15 x 11.5 x 3.25 cm",
    capacity: 7,
    price: 850,
    image: "/images/product/image7.png",
    description: "Vibrant yellow dye handwoven jute platter tray.",
    active: true,
    features: ["Natural turmeric yellow dye", "Sturdy vanity serving tray design", "Hand-twisted golden handles"],
    allowMonogram: true,
  },
  {
    id: "jute-premium",
    title: "Premium Jute Tray",
    size: "15 x 11.5 x 3.25 cm",
    capacity: 7,
    price: 850,
    image: "/images/product/image8.png",
    description: "Sturdy braided jute vanity gift tray with golden handles.",
    active: true,
    features: ["Premium dense braided jute", "Metallic gold leaf accents", "Rigid reinforced base board"],
    allowMonogram: true,
  },
  {
    id: "pink-small",
    title: "Pink Striped Mailer Box (Small)",
    size: "8 x 6 x 2 cm",
    capacity: 4,
    price: 350,
    image: "/images/product/image7.png",
    description: "Chic festive striped gift mailer with gold foil branding.",
    active: true,
    features: ["Rose quartz festive stripes", "Gold foil debossed typography", "Self-locking tuck top"],
    allowMonogram: false,
  },
  {
    id: "pink-large",
    title: "Pink Striped Mailer Box (Large)",
    size: "12 x 9 x 3 cm",
    capacity: 6,
    price: 450,
    image: "/images/product/image8.png",
    description: "Spacious festive mailer crafted for curated multi-item gifting.",
    active: true,
    features: ["Grand festive mailer volume", "Tear-resistant corrugated liner", "Complimentary satin pull ribbon"],
    allowMonogram: false,
  },
];

const BOX_IMAGE_PRESETS = [
  { label: "Celebration Box", url: "/images/product/mdf-box-clean.png" },
  { label: "Heritage Box", url: "/images/product/image.png" },
  { label: "Wood Small", url: "/images/product/marble-box-clean.png" },
  { label: "Wood Large", url: "/images/product/suite-clean.png" },
  { label: "Rustic Basket", url: "/images/product/image9.png" },
  { label: "Natural Jute", url: "/images/product/five-boxes-3d.png" },
  { label: "Cross Pattern", url: "/images/product/turtle-holder-clean.png" },
  { label: "Yellow Jute Tray", url: "/images/product/image7.png" },
  { label: "Premium Jute Tray", url: "/images/product/image8.png" },
];

function BoxEditorInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const boxId = searchParams.get("id") || "celebration";

  // Catalog boxes state
  const [boxes, setBoxes] = useState<AdminCustomBox[]>(INITIAL_CUSTOM_BOXES);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Form Fields
  const [title, setTitle] = useState("");
  const [size, setSize] = useState("");
  const [capacity, setCapacity] = useState<number>(4);
  const [price, setPrice] = useState<number>(650);
  const [image, setImage] = useState<string>("/images/product/mdf-box-clean.png");
  const [description, setDescription] = useState("");
  const [active, setActive] = useState<boolean>(true);
  const [features, setFeatures] = useState<string[]>([]);
  const [newFeatureInput, setNewFeatureInput] = useState("");
  const [allowMonogram, setAllowMonogram] = useState<boolean>(true);

  const [isDragOver, setIsDragOver] = useState(false);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const formatINR = (val: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  // Load from localStorage or initialize
  useEffect(() => {
    try {
      let catalog: AdminCustomBox[] = INITIAL_CUSTOM_BOXES;
      const stored = localStorage.getItem("kurma_custom_boxes");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          catalog = parsed;
        }
      }
      setBoxes(catalog);

      if (boxId.toLowerCase() === "new") {
        setTitle("New Bespoke Keepsake Trunk");
        setSize("10 x 8 x 3 cm");
        setCapacity(4);
        setPrice(650);
        setImage("/images/product/mdf-box-clean.png");
        setDescription("Handcrafted bespoke Kurma luxury presentation keepsake.");
        setActive(true);
        setFeatures([
          "Handcrafted Kurma atelier construction",
          "Includes complimentary notecard & wrapping",
          "Plush interior protective bedding",
        ]);
        setAllowMonogram(true);
        return;
      }

      const target = catalog.find((b) => b.id.toLowerCase() === boxId.toLowerCase()) || catalog[0];
      if (target) {
        setTitle(target.title);
        setSize(target.size);
        setCapacity(target.capacity);
        setPrice(target.price);
        setImage(target.image);
        setDescription(target.description);
        setActive(target.active !== false);
        setFeatures(target.features || [
          "Handcrafted Kurma atelier construction",
          "Includes complimentary notecard & wrapping",
          "Plush interior protective bedding",
        ]);
        setAllowMonogram(target.allowMonogram ?? true);
      }
    } catch {}
  }, [boxId]);

  // Handle Image File Upload (converts to base64 data URL)
  const handleImageFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      triggerToast("Please upload a valid image file (PNG, JPG, WebP).");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result as string);
      triggerToast("Packaging image updated from file upload!");
    };
    reader.readAsDataURL(file);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleImageFile(file);
  };

  // Drag & Drop image file handling
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleImageFile(file);
  };

  // Add Feature
  const handleAddFeature = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFeatureInput.trim()) return;
    setFeatures([...features, newFeatureInput.trim()]);
    setNewFeatureInput("");
  };

  // Remove Feature
  const handleRemoveFeature = (idx: number) => {
    setFeatures(features.filter((_, i) => i !== idx));
  };

  // Reset to initial box defaults
  const handleResetToDefault = () => {
    const initial = INITIAL_CUSTOM_BOXES.find((b) => b.id.toLowerCase() === boxId.toLowerCase());
    if (initial) {
      setTitle(initial.title);
      setSize(initial.size);
      setCapacity(initial.capacity);
      setPrice(initial.price);
      setImage(initial.image);
      setDescription(initial.description);
      setActive(true);
      setFeatures(initial.features || []);
      setAllowMonogram(initial.allowMonogram ?? true);
      triggerToast(`Restored default atelier specifications for "${initial.title}".`);
    }
  };

  // Save changes to localStorage and notify /elements storefront
  const handleSaveBox = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    const isNew = boxId.toLowerCase() === "new";
    const effectiveId = isNew ? `box-${Date.now()}` : boxId;

    const updatedBox: AdminCustomBox = {
      id: effectiveId,
      title: title.trim(),
      size: size.trim(),
      capacity: Number(capacity) || 4,
      price: Number(price) || 0,
      image,
      description: description.trim(),
      active,
      features,
      allowMonogram,
    };

    const updatedList = isNew
      ? [...boxes, updatedBox]
      : boxes.map((b) => (b.id.toLowerCase() === boxId.toLowerCase() ? updatedBox : b));

    setBoxes(updatedList);

    try {
      localStorage.setItem("kurma_custom_boxes", JSON.stringify(updatedList));
      window.dispatchEvent(new Event("storage"));
      window.dispatchEvent(new CustomEvent("kurma_custom_boxes_updated"));
    } catch {}

    setTimeout(() => {
      setIsSaving(false);
      triggerToast(`Saved "${updatedBox.title}"! Changes are immediately live on /elements.`);
      if (isNew) {
        router.push(`/admin/customise/edit?id=${effectiveId}`);
      }
    }, 250);
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#1A1A18] font-sans antialiased flex flex-col selection:bg-[#eed08e]/30 selection:text-[#072515]">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 bg-[#072515] text-[#eed08e] rounded-xl shadow-2xl text-xs font-medium border border-[#eed08e]/30 animate-in slide-in-from-bottom-5">
          <CheckCircle2 className="size-4 shrink-0 text-[#eed08e]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Sticky Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-black/10 px-4 sm:px-8 py-3.5 shadow-2xs">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-3">
            <Link
              href="/admin?route=products&sub=customise"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-black/15 bg-white hover:bg-black/5 text-xs font-semibold text-black/80 transition"
            >
              <ArrowLeft className="size-3.5" />
              <span>Back to Customise</span>
            </Link>

            <span className="text-black/30">|</span>

            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif font-bold text-base sm:text-lg text-[#072515]">
                  Edit Customise Box
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#072515] text-[#eed08e]">
                  Admin Only
                </span>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                    active ? "bg-emerald-100 text-emerald-800" : "bg-stone-200 text-stone-600"
                  }`}
                >
                  {active ? "Live on Storefront" : "Hidden from Patrons"}
                </span>
              </div>
              <p className="text-[11px] text-black/55 font-mono">
                Box ID: {boxId} • Step 1 Customer Packaging
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 self-end sm:self-auto flex-wrap">
            <a
              href={`/elements?box=${boxId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-black/15 bg-white hover:bg-black/5 text-xs font-semibold text-[#072515] transition shadow-2xs"
            >
              <span>Preview Live (/elements)</span>
              <ExternalLink className="size-3 text-[#c89e43]" />
            </a>

            <button
              type="button"
              onClick={handleResetToDefault}
              className="inline-flex items-center gap-1 px-3 py-2 rounded-xl border border-black/15 bg-white hover:bg-black/5 text-xs font-semibold text-stone-700 transition"
              title="Reset fields to factory defaults"
            >
              <RotateCcw className="size-3.5" />
              <span>Reset</span>
            </button>

            <button
              type="button"
              onClick={handleSaveBox}
              disabled={isSaving}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#072515] text-[#eed08e] text-xs font-bold hover:bg-[#072515]/90 transition shadow-sm cursor-pointer disabled:opacity-50"
            >
              <Save className="size-3.5" />
              <span>{isSaving ? "Saving Changes..." : "Save Box Changes"}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-8 py-8 w-full flex-1">
        <form onSubmit={handleSaveBox} className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* =============================================================== */}
          {/* LEFT 2 COLUMNS: CORE BOX SPECIFICATIONS & MEDIA                 */}
          {/* =============================================================== */}
          <div className="lg:col-span-2 space-y-6">
            {/* CARD 1: GENERAL INFORMATION */}
            <div className="rounded-2xl border border-black/10 bg-white p-5 sm:p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-black/10 pb-3">
                <div className="flex items-center gap-2">
                  <div className="size-7 rounded-lg bg-[#072515]/5 border border-black/10 flex items-center justify-center text-[#072515]">
                    <Package className="size-4" />
                  </div>
                  <div>
                    <h2 className="font-serif font-bold text-sm text-[#072515]">Packaging Information</h2>
                    <p className="text-[11px] text-black/50">Primary details shown in Step 1 of the customer customizer</p>
                  </div>
                </div>
                <span className="text-[11px] font-mono text-black/45">Atelier ID: {boxId}</span>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#072515] mb-1.5">
                  Trunk / Box Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. The Celebration Box"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-black/20 outline-none text-xs font-medium focus:border-[#072515] focus:ring-1 focus:ring-[#072515] bg-[#FAF8F5]/30"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#072515] mb-1.5">
                  Artisan Editorial Description
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the materials, lining, woodwork, and sensory presentation..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-black/20 outline-none text-xs leading-relaxed focus:border-[#072515] focus:ring-1 focus:ring-[#072515] resize-none bg-[#FAF8F5]/30"
                />
              </div>

              {/* Handcrafted Features List */}
              <div className="space-y-2 pt-2 border-t border-black/5">
                <label className="block text-xs font-bold text-[#072515]">
                  Craftsmanship Highlights &amp; Features
                </label>
                <div className="space-y-1.5">
                  {features.map((feat, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between gap-2 px-3 py-1.5 rounded-lg bg-stone-50 border border-stone-200 text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <span className="size-1.5 rounded-full bg-[#c89e43]" />
                        <span className="text-stone-800">{feat}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveFeature(idx)}
                        className="text-stone-400 hover:text-red-600 transition p-1"
                        title="Remove highlight"
                      >
                        <Trash2 className="size-3" />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="text"
                    value={newFeatureInput}
                    onChange={(e) => setNewFeatureInput(e.target.value)}
                    placeholder="Add a craftsmanship highlight (e.g. Silk tassel cord)..."
                    className="flex-1 px-3 py-1.5 rounded-lg border border-black/15 text-xs outline-none focus:border-[#072515]"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        if (newFeatureInput.trim()) {
                          setFeatures([...features, newFeatureInput.trim()]);
                          setNewFeatureInput("");
                        }
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      if (newFeatureInput.trim()) {
                        setFeatures([...features, newFeatureInput.trim()]);
                        setNewFeatureInput("");
                      }
                    }}
                    className="px-3 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 border border-stone-300 text-xs font-semibold text-stone-800"
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>

            {/* CARD 2: CAPACITY & PRICING RULES */}
            <div className="rounded-2xl border border-black/10 bg-white p-5 sm:p-6 shadow-xs space-y-4">
              <div className="flex items-center gap-2 border-b border-black/10 pb-3">
                <div className="size-7 rounded-lg bg-[#072515]/5 border border-black/10 flex items-center justify-center text-[#072515]">
                  <SlidersHorizontal className="size-4" />
                </div>
                <div>
                  <h2 className="font-serif font-bold text-sm text-[#072515]">Capacity, Dimensions &amp; Pricing</h2>
                  <p className="text-[11px] text-black/50">Configure hamper volume limits and base packaging charges</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#072515] mb-1">
                    Outer Dimensions <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={size}
                    onChange={(e) => setSize(e.target.value)}
                    placeholder="e.g. 8 x 8 x 4 cm"
                    className="w-full px-3 py-2 rounded-xl border border-black/20 outline-none text-xs font-mono focus:border-[#072515]"
                  />
                  <span className="text-[10px] text-black/45 mt-1 block">Width x Length x Height</span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#072515] mb-1">
                    Slot Capacity <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={15}
                    required
                    value={capacity}
                    onChange={(e) => setCapacity(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-black/20 outline-none text-xs font-bold focus:border-[#072515]"
                  />
                  <span className="text-[10px] text-black/45 mt-1 block">Max items in Step 2</span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#072515] mb-1">
                    Base Price (₹ INR) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    min={0}
                    step={50}
                    required
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-black/20 outline-none text-xs font-bold focus:border-[#072515]"
                  />
                  <span className="text-[10px] text-black/45 mt-1 block">Packaging fee before goodies</span>
                </div>
              </div>

              {/* Quick Capacity Presets */}
              <div className="pt-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-black/45 block mb-1.5">
                  Quick Capacity Presets
                </span>
                <div className="flex flex-wrap gap-2">
                  {[3, 4, 5, 6, 7, 9, 12].map((slots) => (
                    <button
                      type="button"
                      key={slots}
                      onClick={() => setCapacity(slots)}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold border transition cursor-pointer ${
                        capacity === slots
                          ? "bg-[#072515] text-[#eed08e] border-[#072515]"
                          : "bg-white text-stone-700 border-stone-200 hover:border-stone-400"
                      }`}
                    >
                      {slots} Slots
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* CARD 3: ATELIER MEDIA & IMAGE MANAGEMENT */}
            <div className="rounded-2xl border border-black/10 bg-white p-5 sm:p-6 shadow-xs space-y-4">
              <div className="flex items-center gap-2 border-b border-black/10 pb-3">
                <div className="size-7 rounded-lg bg-[#072515]/5 border border-black/10 flex items-center justify-center text-[#072515]">
                  <ImageIcon className="size-4" />
                </div>
                <div>
                  <h2 className="font-serif font-bold text-sm text-[#072515]">Packaging Imagery &amp; Visuals</h2>
                  <p className="text-[11px] text-black/50">Upload bespoke product photos or choose from Kurma studio presets</p>
                </div>
              </div>

              {/* Drag and Drop Upload Area */}
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`rounded-2xl border-2 border-dashed p-6 text-center transition-all ${
                  isDragOver
                    ? "border-[#072515] bg-[#072515]/5 scale-[1.005]"
                    : "border-black/15 bg-stone-50/50 hover:border-black/30"
                }`}
              >
                <div className="max-w-md mx-auto flex flex-col items-center">
                  <div className="relative size-20 rounded-xl overflow-hidden bg-white border border-black/10 shadow-xs mb-3 flex items-center justify-center">
                    <Image src={image} alt={title || "Box image"} fill className="object-contain p-1" unoptimized />
                  </div>

                  <p className="text-xs font-semibold text-[#072515]">
                    Drag and drop your high-resolution box image here
                  </p>
                  <p className="text-[11px] text-black/50 mt-0.5">
                    Supports PNG, JPG, or WebP (transparent background recommended)
                  </p>

                  <div className="mt-3 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#072515] text-[#eed08e] text-xs font-bold hover:bg-[#072515]/90 transition shadow-2xs cursor-pointer"
                    >
                      <Upload className="size-3.5" />
                      <span>Upload Image File</span>
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileInputChange}
                      className="hidden"
                    />
                  </div>
                </div>
              </div>

              {/* One-click Presets Library */}
              <div className="space-y-2 pt-2">
                <span className="text-xs font-bold text-[#072515] block">
                  Select from Kurma Artisan Presets Library
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {BOX_IMAGE_PRESETS.map((p) => {
                    const isSelected = image === p.url;
                    return (
                      <div
                        key={p.url}
                        onClick={() => setImage(p.url)}
                        className={`p-2 rounded-xl border flex items-center gap-2.5 cursor-pointer transition select-none ${
                          isSelected
                            ? "border-[#072515] bg-[#072515]/5 ring-1 ring-[#072515]"
                            : "border-stone-200 bg-white hover:border-stone-400"
                        }`}
                      >
                        <div className="relative size-10 rounded-lg overflow-hidden bg-[#FAF8F5] border border-black/10 shrink-0">
                          <Image src={p.url} alt={p.label} fill className="object-contain p-0.5" unoptimized />
                        </div>
                        <div className="min-w-0 flex-1">
                          <span className="text-[11px] font-semibold text-[#072515] truncate block">
                            {p.label}
                          </span>
                          <span className="text-[10px] text-stone-500">Preset Asset</span>
                        </div>
                        {isSelected && <Check className="size-3.5 text-[#072515] shrink-0" />}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Manual URL Input */}
              <div className="pt-2">
                <label className="block text-xs font-bold text-[#072515] mb-1">
                  Or enter Image Path / URL
                </label>
                <input
                  type="text"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  placeholder="/images/product/mdf-box-clean.png or data URL"
                  className="w-full px-3 py-2 rounded-xl border border-black/20 outline-none text-xs font-mono focus:border-[#072515] bg-[#FAF8F5]/30"
                />
              </div>
            </div>
          </div>

          {/* =============================================================== */}
          {/* RIGHT COLUMN: PREVIEW, VISIBILITY & ACTIONS                     */}
          {/* =============================================================== */}
          <div className="space-y-6">
            {/* CARD 4: STOREFRONT VISIBILITY */}
            <div className="rounded-2xl border border-black/10 bg-white p-5 shadow-xs space-y-4">
              <h3 className="font-serif font-bold text-sm text-[#072515]">Storefront Visibility</h3>

              <div className="flex items-center justify-between p-3.5 rounded-xl bg-stone-50 border border-stone-200">
                <div>
                  <span className="font-semibold text-xs text-[#072515] block">
                    Active on /elements Storefront
                  </span>
                  <span className="text-[11px] text-stone-500">
                    Patrons can view and customize this packaging in Step 1
                  </span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer shrink-0">
                  <input
                    type="checkbox"
                    checked={active}
                    onChange={(e) => setActive(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-10 h-6 bg-stone-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#072515]"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-xl bg-stone-50 border border-stone-200">
                <div>
                  <span className="font-semibold text-xs text-[#072515] block">
                    Brass Plaque Monogram
                  </span>
                  <span className="text-[11px] text-stone-500">
                    Supports gold plaque engraving in Step 3 (+₹350)
                  </span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer shrink-0">
                  <input
                    type="checkbox"
                    checked={allowMonogram}
                    onChange={(e) => setAllowMonogram(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-10 h-6 bg-stone-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#072515]"></div>
                </label>
              </div>
            </div>

            {/* CARD 5: LIVE STEP 1 PATRON CARD PREVIEW */}
            <div className="rounded-2xl border border-black/10 bg-white p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-serif font-bold text-sm text-[#072515]">
                  Live Storefront Preview
                </h3>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#c89e43]">
                  Step 1 Card
                </span>
              </div>
              <p className="text-[11px] text-stone-500">
                This shows the exact interactive card rendered for patrons on `/elements`:
              </p>

              {/* Replica of Step 1 Card on /elements */}
              <div className="rounded-2xl p-4 border-2 border-[#8C281F] bg-[#FAF5F5]/40 shadow-sm flex items-center gap-3.5 select-none">
                <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-[#f5f3ec] shrink-0 border border-stone-200/80 p-1 flex items-center justify-center">
                  <Image src={image} alt={title || "Box"} fill className="object-contain p-1" unoptimized />
                </div>

                <div className="min-w-0 flex-1 space-y-0.5">
                  <h4 className="font-serif text-sm font-semibold text-[#0B2B1B] truncate">
                    {title || "Untitled Box"}
                  </h4>
                  <div className="text-[11px] text-stone-500 space-y-0.5 font-sans">
                    <p>Size : {size || "Not set"}</p>
                    <p className="font-medium text-stone-700">Capacity: {capacity} items</p>
                  </div>
                  <div className="font-serif text-sm font-bold text-[#8C281F] pt-0.5">
                    {formatINR(price)}
                  </div>
                </div>

                <div className="shrink-0">
                  <div className="w-5 h-5 rounded-full border-2 border-[#8C281F] bg-[#8C281F] text-white flex items-center justify-center">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                </div>
              </div>
            </div>

            {/* CARD 6: QUICK SWITCHER TO EDIT OTHER BOXES */}
            <div className="rounded-2xl border border-black/10 bg-white p-5 shadow-xs space-y-3">
              <h3 className="font-serif font-bold text-sm text-[#072515]">
                Switch to Edit Another Box ({boxes.length})
              </h3>
              <p className="text-[11px] text-stone-500">
                Click any chest to edit without leaving this page:
              </p>

              <div className="space-y-1.5 max-h-64 overflow-y-auto pr-1">
                {boxes.map((b) => {
                  const isCurrent = b.id.toLowerCase() === boxId.toLowerCase();
                  return (
                    <button
                      type="button"
                      key={b.id}
                      onClick={() => router.push(`/admin/customise/edit?id=${b.id}`)}
                      className={`w-full p-2 rounded-xl border flex items-center justify-between text-left transition cursor-pointer ${
                        isCurrent
                          ? "bg-[#072515] text-[#eed08e] border-[#072515] font-bold"
                          : "bg-stone-50/70 hover:bg-stone-100 border-black/5 text-stone-800"
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="relative size-8 rounded-lg overflow-hidden bg-white border border-black/10 shrink-0">
                          <Image src={b.image} alt={b.title} fill className="object-contain p-0.5" unoptimized />
                        </div>
                        <span className="text-xs truncate">{b.title}</span>
                      </div>
                      <span className="text-[11px] font-mono shrink-0 ml-2">
                        {formatINR(b.price)}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* CARD 7: SAVE ACTIONS */}
            <div className="rounded-2xl border border-black/10 bg-[#072515] p-5 text-[#FAF8F5] shadow-md space-y-3">
              <span className="text-[10px] uppercase font-bold text-[#eed08e] tracking-wider block">
                Save &amp; Publish
              </span>
              <p className="text-xs text-white/75 leading-relaxed">
                Saving updates the catalog stored in atelier memory. Changes are live on `/elements` customizer immediately.
              </p>
              <div className="pt-2 flex flex-col gap-2">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="w-full py-2.5 rounded-xl bg-[#eed08e] text-[#072515] font-bold text-xs hover:bg-[#eed08e]/90 transition shadow-sm cursor-pointer flex items-center justify-center gap-2"
                >
                  <Save className="size-4" />
                  <span>{isSaving ? "Saving Trunk Changes..." : "Save Box Changes"}</span>
                </button>
                <Link
                  href="/admin?route=products&sub=customise"
                  className="w-full py-2 rounded-xl border border-white/20 text-white/80 hover:text-white hover:bg-white/5 font-semibold text-xs text-center transition"
                >
                  Cancel &amp; Return to Studio
                </Link>
              </div>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
}

export default function BoxEditorPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center p-8">
          <div className="text-center space-y-3">
            <div className="size-10 border-2 border-[#072515] border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="font-serif text-sm font-semibold text-[#072515]">
              Loading Bespoke Box Configuration...
            </p>
          </div>
        </div>
      }
    >
      <BoxEditorInner />
    </Suspense>
  );
}
