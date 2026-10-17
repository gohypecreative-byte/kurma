"use client";

import React, { useState, useEffect, useRef, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { PRODUCTS, ProductSKU } from "@/lib/products";
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
  RefreshCw,
  AlertCircle,
  Eye,
  GripVertical,
} from "lucide-react";

export interface AtelierPresetImage {
  id: string;
  label: string;
  path: string;
}

const DEFAULT_PRESET_IMAGES: AtelierPresetImage[] = [
  { id: "preset-mdf", label: "MDF Keepsake", path: "/images/product/mdf-box-clean.png" },
  { id: "preset-marble", label: "Marble Trunk", path: "/images/product/marble-box-clean.png" },
  { id: "preset-celebration", label: "Celebration Box", path: "/images/product/image.png" },
  { id: "preset-turtle", label: "Turtle Burner", path: "/images/product/turtle-burner.png" },
  { id: "preset-temple", label: "Temple Agarbatti", path: "/images/products/agarbatti-brass-burner.jpg" },
  { id: "preset-hamper", label: "Gift Hamper Suite", path: "/images/products/agarbatti-gift-hamper.jpg" },
];

function ProductEditorInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const productId = searchParams.get("id") || "mdf-gift-box";

  // Catalog products and inventory
  const [allProducts, setAllProducts] = useState<ProductSKU[]>(PRODUCTS);
  const [inventoryStock, setInventoryStock] = useState<Record<string, number>>({});
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // Form State
  const [name, setName] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [category, setCategory] = useState<"Gift Boxes" | "Fragrances" | "Sacred Accessories" | string>("Gift Boxes");
  const [status, setStatus] = useState<"Active" | "Draft" | "Archived">("Active");

  // Drag and Drop Preset Images State
  const [presetList, setPresetList] = useState<AtelierPresetImage[]>(DEFAULT_PRESET_IMAGES);
  const [draggedPresetIndex, setDraggedPresetIndex] = useState<number | null>(null);
  const [dragOverPresetIndex, setDragOverPresetIndex] = useState<number | null>(null);
  const [isThumbnailDragOver, setIsThumbnailDragOver] = useState(false);
  const [price, setPrice] = useState<number>(2499);
  const [originalPrice, setOriginalPrice] = useState<number>(2999);
  const [stock, setStock] = useState<number>(12);
  const [lowStockThreshold, setLowStockThreshold] = useState<number>(10);
  const [image, setImage] = useState<string>("/images/product/mdf-box-clean.png");
  const [description, setDescription] = useState("");
  const [details, setDetails] = useState<string[]>([
    "Ethically sourced sacred ingredients",
    "Hand-finished sacred artisan craftsmanship",
    "Complimentary deckle-edge calligraphy blessing",
  ]);
  const [newDetailInput, setNewDetailInput] = useState("");

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Load product from localStorage or fallback PRODUCTS
  useEffect(() => {
    try {
      let catalog: ProductSKU[] = PRODUCTS;
      const stored = localStorage.getItem("kurma_admin_products");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          catalog = parsed;
        }
      }
      setAllProducts(catalog);

      let stockMap: Record<string, number> = {
        "mdf-gift-box": 12,
        "marble-gift-box": 8,
        "brass-turtle-holder": 19,
        "fragrance-earth": 6,
        "fragrance-water": 42,
        "fragrance-fire": 31,
        "fragrance-air": 55,
        "fragrance-space": 24,
      };
      const storedStock = localStorage.getItem("kurma_inventory_stock");
      if (storedStock) {
        stockMap = { ...stockMap, ...JSON.parse(storedStock) };
      }
      setInventoryStock(stockMap);

      // Load saved atelier preset image order if present
      const storedPresets = localStorage.getItem("kurma_atelier_presets");
      if (storedPresets) {
        const parsed = JSON.parse(storedPresets);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setPresetList(parsed);
        }
      }

      // Find current product
      const current = catalog.find((p) => p.id === productId) || catalog[0];
      if (current) {
        setName(current.name);
        setSubtitle(current.subtitle || "Handcrafted Luxury • Sacred Kurma Atelier");
        setCategory(current.category);
        setPrice(current.price);
        setOriginalPrice(current.originalPrice || Math.round(current.price * 1.25));
        setStock(stockMap[current.id] ?? 12);
        setImage(current.image || "/images/product/image.png");
        setDescription(current.description || "");
        if (current.details && current.details.length > 0) {
          setDetails(current.details);
        }
      }
    } catch {
      // ignore
    }
  }, [productId]);

  // Handle Image File Upload (Reads as Data URL for immediate preview and saving)
  const handleImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      triggerToast("Please select a valid image file (PNG, JPG, WEBP).");
      return;
    }

    setIsUploading(true);
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setImage(reader.result);
        triggerToast("Image uploaded successfully!");
      }
      setIsUploading(false);
    };
    reader.onerror = () => {
      triggerToast("Error reading image file.");
      setIsUploading(false);
    };
    reader.readAsDataURL(file);
  };

  // Drag and drop reordering handlers for atelier presets
  const handlePresetDragStart = (e: React.DragEvent, index: number) => {
    setDraggedPresetIndex(index);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", index.toString());
  };

  const handlePresetDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (dragOverPresetIndex !== index) {
      setDragOverPresetIndex(index);
    }
  };

  const handlePresetDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();

    // If external file dropped directly onto a preset slot
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = () => {
          if (typeof reader.result === "string") {
            const newPreset: AtelierPresetImage = {
              id: `custom-${Date.now()}`,
              label: file.name.replace(/\.[^/.]+$/, "").slice(0, 16),
              path: reader.result,
            };
            const updated = [...presetList];
            updated.splice(targetIndex, 0, newPreset);
            setPresetList(updated);
            setImage(reader.result);
            try {
              localStorage.setItem("kurma_atelier_presets", JSON.stringify(updated));
            } catch {}
            triggerToast(`Added and moved "${newPreset.label}" to position ${targetIndex + 1}!`);
          }
        };
        reader.readAsDataURL(file);
      }
      setDraggedPresetIndex(null);
      setDragOverPresetIndex(null);
      return;
    }

    // Normal internal drag and drop reordering
    if (draggedPresetIndex === null || draggedPresetIndex === targetIndex) {
      setDraggedPresetIndex(null);
      setDragOverPresetIndex(null);
      return;
    }

    const updated = [...presetList];
    const [movedItem] = updated.splice(draggedPresetIndex, 1);
    updated.splice(targetIndex, 0, movedItem);

    setPresetList(updated);
    setDraggedPresetIndex(null);
    setDragOverPresetIndex(null);

    try {
      localStorage.setItem("kurma_atelier_presets", JSON.stringify(updated));
    } catch {}

    triggerToast(`Moved "${movedItem.label}" to position ${targetIndex + 1}!`);
  };

  const handlePresetDragEnd = () => {
    setDraggedPresetIndex(null);
    setDragOverPresetIndex(null);
  };

  // Drag and drop onto main product thumbnail
  const handleThumbnailDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsThumbnailDragOver(false);

    // If file dragged from computer
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = () => {
          if (typeof reader.result === "string") {
            setImage(reader.result);
            triggerToast("Thumbnail updated from dropped image file!");
          }
        };
        reader.readAsDataURL(file);
      }
      return;
    }

    // If preset dragged and dropped onto thumbnail
    if (draggedPresetIndex !== null && presetList[draggedPresetIndex]) {
      const droppedPreset = presetList[draggedPresetIndex];
      setImage(droppedPreset.path);
      triggerToast(`Set "${droppedPreset.label}" as current product thumbnail!`);
      setDraggedPresetIndex(null);
      setDragOverPresetIndex(null);
    }
  };

  // Add bullet point
  const handleAddDetail = () => {
    if (!newDetailInput.trim()) return;
    setDetails([...details, newDetailInput.trim()]);
    setNewDetailInput("");
  };

  // Remove bullet point
  const handleRemoveDetail = (index: number) => {
    setDetails(details.filter((_, i) => i !== index));
  };

  // Save changes to localStorage and update state
  const handleSaveProduct = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!name.trim()) {
      triggerToast("Product title cannot be empty.");
      return;
    }

    setIsSaving(true);
    try {
      const updatedCatalog = allProducts.map((p) =>
        p.id === productId
          ? {
              ...p,
              name: name.trim(),
              subtitle: subtitle.trim(),
              category: category as any,
              price: Number(price) || p.price,
              originalPrice: Number(originalPrice) || p.originalPrice,
              image: image || p.image,
              description: description.trim() || p.description,
              details: details.length > 0 ? details : p.details,
            }
          : p
      );

      const updatedStockMap = {
        ...inventoryStock,
        [productId]: Number(stock) || 0,
      };

      setAllProducts(updatedCatalog);
      setInventoryStock(updatedStockMap);

      localStorage.setItem("kurma_admin_products", JSON.stringify(updatedCatalog));
      localStorage.setItem("kurma_inventory_stock", JSON.stringify(updatedStockMap));

      triggerToast(`Saved "${name}" successfully!`);
      setTimeout(() => {
        setIsSaving(false);
        router.push("/admin");
      }, 700);
    } catch {
      setIsSaving(false);
      triggerToast("Error saving product changes.");
    }
  };

  const currentProduct = allProducts.find((p) => p.id === productId) || allProducts[0];

  return (
    <div className="min-h-screen bg-[#F6F5F1] text-stone-900 font-sans selection:bg-[#eed08e] selection:text-[#072515] pb-24">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl bg-[#072515] text-[#eed08e] text-xs font-semibold shadow-2xl border border-[#eed08e]/30 animate-in fade-in slide-in-from-top-3">
          <CheckCircle2 className="size-4 text-[#eed08e]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Sticky Command Bar */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-black/10 px-4 sm:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-3">
            <Link
              href="/admin"
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-black/15 bg-white hover:bg-black/5 text-xs font-medium text-black/80 transition"
            >
              <ArrowLeft className="size-3.5" />
              <span>Back to Products</span>
            </Link>

            <span className="text-black/30">|</span>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-serif font-bold text-base sm:text-lg text-[#072515] truncate max-w-xs sm:max-w-md">
                  {name || "Untitled Creation"}
                </h1>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800">
                  {status}
                </span>
              </div>
              <p className="text-[11px] text-black/50 font-mono">SKU: {productId}</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 self-end sm:self-auto">
            {/* Switch Product Selector Dropdown */}
            <select
              value={productId}
              onChange={(e) => router.push(`/admin/products/edit?id=${encodeURIComponent(e.target.value)}`)}
              className="px-2.5 py-1.5 rounded-lg border border-black/20 bg-white text-xs outline-none text-black/75 hidden md:block"
            >
              {allProducts.map((prod) => (
                <option key={prod.id} value={prod.id}>
                  Switch SKU: {prod.name.slice(0, 28)}...
                </option>
              ))}
            </select>

            <Link
              href="/admin"
              className="px-3 py-1.5 rounded-lg border border-black/20 text-xs font-medium hover:bg-black/5 transition"
            >
              Discard
            </Link>

            <button
              type="button"
              onClick={() => handleSaveProduct()}
              disabled={isSaving}
              className="px-4 py-1.5 rounded-lg bg-[#072515] text-[#eed08e] text-xs font-semibold hover:bg-[#072515]/90 transition shadow-sm flex items-center gap-1.5"
            >
              <Save className="size-3.5" />
              <span>{isSaving ? "Saving Creation..." : "Save Product Changes"}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Form Body */}
      <main className="max-w-7xl mx-auto px-4 sm:px-8 pt-6">
        <form onSubmit={handleSaveProduct} className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* ================================================================= */}
          {/* LEFT 8 COLUMNS: MAIN CONTENT & IMAGE UPLOAD                       */}
          {/* ================================================================= */}
          <div className="lg:col-span-8 space-y-6">
            {/* Card 1: Title & Description */}
            <section className="bg-white rounded-2xl border border-black/10 shadow-xs p-5 sm:p-6 space-y-4">
              <h2 className="text-sm font-bold uppercase tracking-wider text-[#072515] pb-2 border-b border-black/5">
                Product Title & Craftsmanship
              </h2>

              <div>
                <label className="block text-xs font-semibold text-black/80 mb-1.5">
                  Product Name / Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Royal Moradabad Lotus Dhoop Burner"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-black/20 focus:border-[#072515] focus:ring-1 focus:ring-[#072515] text-sm outline-none bg-white font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-black/80 mb-1.5">
                  Artisanal Subtitle & Heritage Tagline
                </label>
                <input
                  type="text"
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  placeholder="e.g. Pure Fragrance • Higher Consciousness"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-black/20 focus:border-[#072515] focus:ring-1 focus:ring-[#072515] text-xs outline-none bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-black/80 mb-1.5">
                  Artisanal Description & Sacred Heritage
                </label>
                <textarea
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Detailed artisanal backstory, spiritual significance, and craftsmanship techniques..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-black/20 focus:border-[#072515] focus:ring-1 focus:ring-[#072515] text-xs outline-none resize-y bg-white"
                />
              </div>
            </section>

            {/* Card 2: Image Upload Feature (Dedicated Section) */}
            <section className="bg-white rounded-2xl border border-black/10 shadow-xs p-5 sm:p-6 space-y-5">
              <div className="flex items-center justify-between pb-2 border-b border-black/5">
                <div>
                  <h2 className="text-sm font-bold uppercase tracking-wider text-[#072515]">
                    Product Media &amp; Image Upload
                  </h2>
                  <p className="text-[11px] text-black/55 mt-0.5">
                    Upload high-resolution photography or select from Kurma atelier library.
                  </p>
                </div>
                <span className="text-[11px] font-mono text-black/40">PNG, JPG, WEBP</span>
              </div>

              {/* Main Image Upload Drop Zone */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 items-start">
                {/* Active Image Preview Box with Drop Support */}
                <div className="sm:col-span-5 flex flex-col items-center">
                  <div
                    onDragOver={(e) => {
                      e.preventDefault();
                      e.dataTransfer.dropEffect = "copy";
                      setIsThumbnailDragOver(true);
                    }}
                    onDragLeave={() => setIsThumbnailDragOver(false)}
                    onDrop={handleThumbnailDrop}
                    className={`relative w-full aspect-square rounded-2xl overflow-hidden border-2 transition-all duration-200 ${
                      isThumbnailDragOver
                        ? "border-[#072515] ring-4 ring-[#072515]/20 scale-[1.02] bg-[#eed08e]/20"
                        : "border-black/10 bg-[#FAF8F5] shadow-xs"
                    } group`}
                  >
                    <Image
                      src={image}
                      alt={name || "Product image"}
                      fill
                      unoptimized={image.startsWith("data:")}
                      className="object-cover"
                    />
                    {isThumbnailDragOver && (
                      <div className="absolute inset-0 bg-[#072515]/80 backdrop-blur-xs flex flex-col items-center justify-center text-[#eed08e] p-4 text-center z-20 animate-in fade-in">
                        <Upload className="size-8 mb-2" />
                        <p className="text-xs font-bold">Drop to Set as Primary Thumbnail</p>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2 z-10">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="px-3 py-1.5 rounded-lg bg-white text-black text-xs font-semibold hover:bg-white/90 shadow-sm"
                      >
                        Replace Image
                      </button>
                    </div>
                  </div>
                  <span className="text-[10px] text-black/50 mt-1.5 font-medium">
                    Current Product Thumbnail
                  </span>
                </div>

                {/* Upload Action Area */}
                <div className="sm:col-span-7 space-y-4">
                  {/* Hidden File Input */}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageFileUpload}
                    className="hidden"
                  />

                  {/* Drag & Click Dropzone */}
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-black/20 hover:border-[#072515] bg-[#FAF8F5]/60 hover:bg-[#FAF8F5] p-6 rounded-2xl text-center cursor-pointer transition flex flex-col items-center justify-center gap-2 group"
                  >
                    <div className="size-11 rounded-xl bg-[#072515]/5 group-hover:bg-[#072515] text-[#072515] group-hover:text-[#eed08e] flex items-center justify-center transition">
                      <Upload className="size-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-black/85">
                        {isUploading ? "Processing Image..." : "Click to Upload New Image"}
                      </p>
                      <p className="text-[11px] text-black/50 mt-0.5">
                        or drag and drop your photo directly from computer
                      </p>
                    </div>
                    <span className="inline-flex px-2.5 py-1 rounded-md text-[10px] font-semibold bg-white border border-black/10 text-[#072515] shadow-2xs">
                      Browse Files
                    </span>
                  </div>

                  {/* Custom URL Input */}
                  <div>
                    <label className="block text-[11px] font-semibold text-black/70 mb-1">
                      Or specify image asset path / URL:
                    </label>
                    <input
                      type="text"
                      value={image}
                      onChange={(e) => setImage(e.target.value)}
                      placeholder="/images/product/custom-creation.png"
                      className="w-full px-3 py-2 rounded-xl border border-black/20 text-xs font-mono outline-none focus:border-[#072515] bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* Preset Kurma Gallery Selector with Drag and Drop Reordering */}
              <div>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 mb-2.5">
                  <div className="flex items-center gap-2">
                    <p className="text-xs font-bold text-black/85">
                      Quick Select Atelier Preset Image:
                    </p>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#072515]/5 text-[#072515] border border-[#072515]/10">
                      <GripVertical className="size-3 text-[#c89e43]" /> Drag &amp; Drop to Reorder
                    </span>
                  </div>
                  <span className="text-[11px] text-black/45">
                    Drag any image to reposition • Drop on thumbnail to set primary
                  </span>
                </div>

                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5">
                  {presetList.map((preset, idx) => {
                    const isDragging = draggedPresetIndex === idx;
                    const isDragOver = dragOverPresetIndex === idx;
                    const isSelected = image === preset.path;

                    return (
                      <div
                        key={preset.id || preset.path}
                        draggable={true}
                        onDragStart={(e) => handlePresetDragStart(e, idx)}
                        onDragOver={(e) => handlePresetDragOver(e, idx)}
                        onDragLeave={() => {
                          if (dragOverPresetIndex === idx) setDragOverPresetIndex(null);
                        }}
                        onDrop={(e) => handlePresetDrop(e, idx)}
                        onDragEnd={handlePresetDragEnd}
                        onClick={() => {
                          setImage(preset.path);
                          triggerToast(`Selected ${preset.label}`);
                        }}
                        className={`group relative p-1.5 rounded-xl border text-left flex flex-col items-center gap-1.5 transition-all duration-200 cursor-grab active:cursor-grabbing select-none ${
                          isDragging
                            ? "opacity-30 scale-90 border-dashed border-[#072515] bg-[#FAF8F5]"
                            : isDragOver
                            ? "border-[#072515] ring-2 ring-[#072515] bg-[#eed08e]/20 scale-105 shadow-md -translate-y-0.5 z-10"
                            : isSelected
                            ? "border-[#072515] ring-2 ring-[#072515]/20 bg-[#FAF8F5] shadow-xs"
                            : "border-black/10 hover:border-black/30 hover:bg-[#FAF8F5]/50 bg-white"
                        }`}
                        title="Drag to reposition • Click to select as active thumbnail"
                      >
                        {/* Position Indicator Badge & Drag Grip Handle */}
                        <div className="absolute top-1 left-1 z-10 flex items-center gap-0.5 px-1 py-0.5 rounded bg-black/60 backdrop-blur-xs text-[9px] font-mono text-white/90 shadow-2xs group-hover:bg-[#072515] transition">
                          <GripVertical className="size-2.5 opacity-70" />
                          <span>{idx + 1}</span>
                        </div>

                        {/* Image Box */}
                        <div className="relative size-12 rounded-lg overflow-hidden bg-[#FAF8F5] border border-black/10 group-hover:scale-102 transition">
                          <Image
                            src={preset.path}
                            alt={preset.label}
                            fill
                            className="object-cover pointer-events-none"
                            unoptimized
                          />
                        </div>

                        {/* Label */}
                        <span className="text-[10px] font-medium text-black/75 truncate w-full text-center">
                          {preset.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>

            {/* Card 3: Key Specifications & Craftsmanship Details */}
            <section className="bg-white rounded-2xl border border-black/10 shadow-xs p-5 sm:p-6 space-y-4">
              <h2 className="text-sm font-bold uppercase tracking-wider text-[#072515] pb-2 border-b border-black/5">
                Key Craftsmanship Highlights (Bullet Points)
              </h2>

              <div className="space-y-2">
                {details.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <span className="size-2 rounded-full bg-[#072515] shrink-0" />
                    <input
                      type="text"
                      value={item}
                      onChange={(e) => {
                        const next = [...details];
                        next[idx] = e.target.value;
                        setDetails(next);
                      }}
                      className="flex-1 px-3 py-1.5 rounded-lg border border-black/15 text-xs outline-none focus:border-[#072515]"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveDetail(idx)}
                      className="p-1.5 text-black/40 hover:text-red-600 transition"
                      title="Remove highlight"
                    >
                      <X className="size-3.5" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Add New Highlight Row */}
              <div className="flex items-center gap-2 pt-2">
                <input
                  type="text"
                  placeholder="e.g. Dimensions: 34cm x 24cm x 8cm with magnetic closure"
                  value={newDetailInput}
                  onChange={(e) => setNewDetailInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddDetail();
                    }
                  }}
                  className="flex-1 px-3 py-2 rounded-lg border border-black/20 text-xs outline-none focus:border-[#072515]"
                />
                <button
                  type="button"
                  onClick={handleAddDetail}
                  className="px-3 py-2 rounded-lg bg-black/5 hover:bg-black/10 text-xs font-semibold text-black/80 transition flex items-center gap-1"
                >
                  <Plus className="size-3" /> Add Highlight
                </button>
              </div>
            </section>
          </div>

          {/* ================================================================= */}
          {/* RIGHT 4 COLUMNS: PRICING, INVENTORY, & CATEGORY                   */}
          {/* ================================================================= */}
          <div className="lg:col-span-4 space-y-6">
            {/* Card 4: Pricing */}
            <section className="bg-white rounded-2xl border border-black/10 shadow-xs p-5 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#072515] pb-2 border-b border-black/5">
                Pricing (INR ₹)
              </h3>

              <div>
                <label className="block text-xs font-semibold text-black/80 mb-1">
                  Selling Price (₹) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-xs font-bold text-black/40">₹</span>
                  <input
                    type="number"
                    required
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full pl-7 pr-3 py-2 rounded-xl border border-black/20 text-sm font-bold text-[#072515] outline-none focus:border-[#072515]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-black/80 mb-1">
                  Compare-at MRP Price (₹)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-xs font-bold text-black/40">₹</span>
                  <input
                    type="number"
                    value={originalPrice}
                    onChange={(e) => setOriginalPrice(Number(e.target.value))}
                    className="w-full pl-7 pr-3 py-2 rounded-xl border border-black/20 text-xs text-black/70 outline-none focus:border-[#072515]"
                  />
                </div>
                {originalPrice > price && (
                  <p className="text-[10px] text-emerald-700 font-medium mt-1">
                    Customer saves ₹{originalPrice - price} ({Math.round(((originalPrice - price) / originalPrice) * 100)}% off)
                  </p>
                )}
              </div>
            </section>

            {/* Card 5: Inventory Stock */}
            <section className="bg-white rounded-2xl border border-black/10 shadow-xs p-5 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#072515] pb-2 border-b border-black/5">
                Live Inventory &amp; Stock
              </h3>

              <div>
                <label className="block text-xs font-semibold text-black/80 mb-1">
                  Current In-Stock Units <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    required
                    value={stock}
                    onChange={(e) => setStock(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-black/20 text-sm font-bold text-[#072515] outline-none focus:border-[#072515]"
                  />
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => setStock(Math.max(0, stock - 1))}
                      className="size-8 rounded-lg border border-black/15 hover:bg-black/5 font-bold flex items-center justify-center text-xs"
                    >
                      -
                    </button>
                    <button
                      type="button"
                      onClick={() => setStock(stock + 1)}
                      className="size-8 rounded-lg border border-black/15 hover:bg-black/5 font-bold flex items-center justify-center text-xs"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-black/80 mb-1">
                  Low Stock Warning Threshold
                </label>
                <input
                  type="number"
                  value={lowStockThreshold}
                  onChange={(e) => setLowStockThreshold(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-black/20 text-xs outline-none focus:border-[#072515]"
                />
                <p className="text-[10px] text-black/50 mt-1">
                  Alert badge appears when stock drops below {lowStockThreshold} units.
                </p>
              </div>

              <div className="pt-2 border-t border-black/5 text-[11px] text-black/60 space-y-1">
                <div className="flex justify-between">
                  <span>Warehouse:</span>
                  <span className="font-semibold text-black/80">Delhi Central Atelier</span>
                </div>
                <div className="flex justify-between">
                  <span>Foundry:</span>
                  <span className="font-semibold text-black/80">Moradabad Brassworks</span>
                </div>
              </div>
            </section>

            {/* Card 6: Organization & Status */}
            <section className="bg-white rounded-2xl border border-black/10 shadow-xs p-5 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#072515] pb-2 border-b border-black/5">
                Organization &amp; Visibility
              </h3>

              <div>
                <label className="block text-xs font-semibold text-black/80 mb-1">
                  Collection Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-black/20 text-xs outline-none bg-white font-medium"
                >
                  <option value="Gift Boxes">Gift Boxes</option>
                  <option value="Fragrances">Fragrances</option>
                  <option value="Sacred Accessories">Sacred Accessories</option>
                  <option value="Royal Mysore Chandan">Royal Mysore Chandan</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-black/80 mb-1">
                  Publication Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl border border-black/20 text-xs outline-none bg-white font-medium"
                >
                  <option value="Active">Active (Live in Store)</option>
                  <option value="Draft">Draft (Hidden)</option>
                  <option value="Archived">Archived</option>
                </select>
              </div>

              <div className="pt-2 border-t border-black/5 text-xs text-black/60">
                <p className="text-[11px] font-semibold text-black/75 mb-1">Sales Channel</p>
                <div className="flex items-center gap-2">
                  <span className="size-2 rounded-full bg-emerald-500" />
                  <span>Kurma Online Sanctuary</span>
                </div>
              </div>
            </section>

            {/* Card 7: Quick Actions */}
            <section className="bg-white rounded-2xl border border-black/10 shadow-xs p-5 space-y-3">
              <button
                type="submit"
                disabled={isSaving}
                className="w-full py-3 rounded-xl bg-[#072515] text-[#eed08e] text-xs font-semibold hover:bg-[#072515]/90 transition shadow-sm flex items-center justify-center gap-2"
              >
                <Save className="size-4" />
                <span>{isSaving ? "Saving..." : "Save Product Changes"}</span>
              </button>

              <Link
                href="/shop"
                target="_blank"
                className="w-full py-2.5 rounded-xl border border-black/20 text-xs font-medium text-black/80 hover:bg-black/5 transition flex items-center justify-center gap-1.5"
              >
                <Eye className="size-3.5" />
                <span>Preview on Live Store</span>
              </Link>
            </section>
          </div>
        </form>
      </main>
    </div>
  );
}

export default function AdminEditProductPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#F6F5F1] flex items-center justify-center text-xs font-medium text-black/60">
          Loading Atelier Product Editor...
        </div>
      }
    >
      <ProductEditorInner />
    </Suspense>
  );
}
