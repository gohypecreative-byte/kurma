"use client";

import React, { useState, useRef, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PRODUCTS, ProductSKU } from "@/lib/products";
import { notifyProductUpdated } from "@/lib/products-context";
import {
  ArrowLeft,
  Upload,
  Plus,
  X,
  Save,
  CheckCircle2,
  ChevronDown,
  Sparkles,
  Trash2,
  Check,
  Menu,
} from "lucide-react";
import AdminSidebar from "@/components/admin/AdminSidebar";

const AVAILABLE_TAGS = [
  "Bestseller",
  "Festive Special",
  "Sacred Atelier",
  "Pure Sandalwood",
  "Limited Edition",
  "Temple Exclusive",
  "Handcrafted Brass",
];

function NewProductPageInner() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // General Information State
  const [productName, setProductName] = useState("");
  const [description, setDescription] = useState(
    "Hand-poured pure mysore sandalwood, natural temple resins, heavy sand-cast brass with artisanal finish. Crafted in sacred devotion according to Vedic traditions."
  );

  // Pricing State
  const [basePrice, setBasePrice] = useState<number | "">(2499);
  const [discountPercentage, setDiscountPercentage] = useState<number | "">(25);
  const [discountType, setDiscountType] = useState("Percentage Discount");

  // Inventory State
  const [quantity, setQuantity] = useState<number | "">(25);

  // Variation State
  const [variationType, setVariationType] = useState("Fragrance & Finish");
  const [skuVariation, setSkuVariation] = useState("Royal Sandalwood / Sand-cast Brass");

  // Product Media State
  const [images, setImages] = useState<string[]>([
    "/images/product/image.png",
    "/images/product/marble-box-clean.png",
    "/images/product/turtle-burner.png",
  ]);
  const [isUploading, setIsUploading] = useState(false);

  // Category & Tags State
  const [category, setCategory] = useState("Gift Boxes");
  const [selectedTag, setSelectedTag] = useState("Bestseller");
  const [isTagDropdownOpen, setIsTagDropdownOpen] = useState(false);

  // UI state
  const [isSaving, setIsSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Compute final selling price from base price & discount
  const numBase = typeof basePrice === "number" ? basePrice : 0;
  const numDiscount = typeof discountPercentage === "number" ? discountPercentage : 0;
  const computedSellingPrice =
    discountType === "Percentage Discount" && numDiscount > 0
      ? Math.round(numBase * (1 - numDiscount / 100))
      : numBase;

  // Handle Image Upload
  const handleImageFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (res.ok && data.success && data.url) {
        setImages((prev) => [...prev, data.url]);
        triggerToast("Product photo added successfully!");
      } else {
        const reader = new FileReader();
        reader.onload = () => {
          if (typeof reader.result === "string") {
            setImages((prev) => [...prev, reader.result as string]);
            triggerToast("Product photo added!");
          }
        };
        reader.readAsDataURL(file);
      }
    } catch {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") {
          setImages((prev) => [...prev, reader.result as string]);
          triggerToast("Product photo added!");
        }
      };
      reader.readAsDataURL(file);
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveImage = (index: number) => {
    if (images.length <= 1) {
      triggerToast("At least one product image is required.");
      return;
    }
    setImages(images.filter((_, idx) => idx !== index));
  };

  // Save new product to backend API and database
  const handleSaveProduct = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!productName.trim()) {
      triggerToast("Please enter a product name.");
      return;
    }

    if (!basePrice || Number(basePrice) <= 0) {
      triggerToast("Please enter a valid base price.");
      return;
    }

    setIsSaving(true);

    const generatedId =
      productName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "") || `prod-${Date.now()}`;

    const primaryImage = images[0] || "/images/product/image.png";

    const newProduct: ProductSKU = {
      id: generatedId,
      name: productName.trim(),
      subtitle: `${variationType}: ${skuVariation}`,
      category: category as any,
      price: computedSellingPrice > 0 ? computedSellingPrice : Number(basePrice),
      originalPrice: Number(basePrice),
      image: primaryImage,
      description: description.trim(),
      details: [
        `Variation: ${skuVariation}`,
        `Atelier Category: ${category}`,
        `Stock: ${quantity || 0} units`,
      ],
      customizationFields: [],
    };

    try {
      // 1. Sync local storage
      let existingProducts: ProductSKU[] = PRODUCTS;
      try {
        const stored = localStorage.getItem("kurma_admin_products");
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) existingProducts = parsed;
        }
      } catch {}

      const updatedProducts = [newProduct, ...existingProducts];
      localStorage.setItem("kurma_admin_products", JSON.stringify(updatedProducts));

      let existingStock: Record<string, number> = {};
      try {
        const storedStock = localStorage.getItem("kurma_inventory_stock");
        if (storedStock) existingStock = JSON.parse(storedStock);
      } catch {}

      const updatedStock = {
        ...existingStock,
        [generatedId]: Number(quantity) || 25,
      };
      localStorage.setItem("kurma_inventory_stock", JSON.stringify(updatedStock));

      // 2. Call backend API to persist in Neon DB
      let savedToDb = false;
      try {
        const res = await fetch("/api/admin/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: generatedId,
            name: productName.trim(),
            subtitle: `${variationType}: ${skuVariation}`,
            category,
            price: computedSellingPrice > 0 ? computedSellingPrice : Number(basePrice),
            originalPrice: Number(basePrice),
            stock: Number(quantity) || 25,
            image: primaryImage,
            gallery: images,
            badge: selectedTag,
            description: description.trim(),
            details: [
              `Variation: ${skuVariation}`,
              `Atelier Category: ${category}`,
              `Stock: ${quantity || 0} units`,
            ],
            status: "Active",
          }),
        });

        const resData = await res.json();
        if (res.ok && resData.success) {
          savedToDb = true;
        }
      } catch (apiErr) {
        console.warn("Failed to save product in Neon DB, saved locally", apiErr);
      }

      notifyProductUpdated();
      triggerToast(
        savedToDb
          ? `Product "${productName}" saved to database & catalog!`
          : `Product "${productName}" saved to catalog!`
      );

      setTimeout(() => {
        setIsSaving(false);
        router.push("/admin?route=products");
      }, 700);
    } catch {
      setIsSaving(false);
      triggerToast("Error saving product.");
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-stone-900 selection:bg-[#eed08e] selection:text-[#072515] flex flex-col lg:flex-row antialiased">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#28513B] text-white px-4 py-3 rounded-xl shadow-2xl border border-white/20 flex items-center gap-2.5 text-xs font-semibold animate-in slide-in-from-bottom-5">
          <CheckCircle2 className="size-4 text-white" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Admin Dashboard Sidebar Navigation */}
      <AdminSidebar
        currentRoute="products"
        mobileOpen={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto pb-20">
        {/* Top Header Navigation */}
        <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-black/10 px-4 sm:px-8 py-3.5 shadow-2xs">
          <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setMobileSidebarOpen(true)}
                className="lg:hidden p-2 rounded-xl border border-black/15 bg-white text-black hover:bg-black/5 transition"
                aria-label="Open Sidebar Menu"
              >
                <Menu className="size-4" />
              </button>

              <Link
                href="/admin?route=products"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-black/15 text-xs font-semibold text-black/75 hover:text-black hover:bg-black/5 transition"
              >
                <ArrowLeft className="size-3.5" /> Back to Products
              </Link>

            <div className="hidden sm:block h-4 w-px bg-black/15" />

            <h1 className="text-base sm:text-lg font-serif font-bold text-[#072515]">
              Add New Product
            </h1>
          </div>

          <div className="flex items-center gap-2.5">
            <Link
              href="/admin?route=products"
              className="px-4 py-2 rounded-xl border border-black/15 text-xs font-semibold text-stone-700 hover:bg-stone-100 transition"
            >
              Cancel
            </Link>

            <button
              type="button"
              onClick={() => handleSaveProduct()}
              disabled={isSaving}
              className="px-5 py-2 rounded-xl bg-[#28513B] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#28513B]/90 transition shadow-sm flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <Save className="size-3.5 text-white" />
              <span>{isSaving ? "Saving Product..." : "Save Product"}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Two-Column Layout (Matching Reference Layout) */}
      <main className="max-w-7xl mx-auto px-4 sm:px-8 pt-6">
        <form onSubmit={handleSaveProduct} className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* ================================================================= */}
          {/* LEFT COLUMN (7 COLS): GENERAL INFO, PRICING, INVENTORY, VARIATION */}
          {/* ================================================================= */}
          <div className="lg:col-span-7 space-y-6">
            {/* Card 1: General Information */}
            <section className="bg-white rounded-2xl border border-black/10 shadow-xs p-5 sm:p-6 space-y-4">
              <h2 className="text-sm sm:text-base font-bold text-[#072515]">
                General Information
              </h2>

              <div>
                <label className="block text-xs font-medium text-black/75 mb-1.5">
                  Product Name
                </label>
                <input
                  type="text"
                  required
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  placeholder="e.g. Royal Moradabad Lotus Dhoop Burner"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-black/15 focus:border-[#072515] focus:ring-1 focus:ring-[#072515] text-xs sm:text-sm outline-none bg-[#FAF8F5]/50 focus:bg-white text-black font-medium transition"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-black/75 mb-1.5">
                  Description
                </label>
                <textarea
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Type product description..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-black/15 focus:border-[#072515] focus:ring-1 focus:ring-[#072515] text-xs sm:text-sm outline-none bg-[#FAF8F5]/50 focus:bg-white text-black resize-y transition"
                />
              </div>
            </section>

            {/* Card 2: Pricing */}
            <section className="bg-white rounded-2xl border border-black/10 shadow-xs p-5 sm:p-6 space-y-4">
              <h2 className="text-sm sm:text-base font-bold text-[#072515]">
                Pricing
              </h2>

              <div>
                <label className="block text-xs font-medium text-black/75 mb-1.5">
                  Base Price
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-2.5 text-xs sm:text-sm font-semibold text-black/45">
                    ₹
                  </span>
                  <input
                    type="number"
                    required
                    min={1}
                    value={basePrice}
                    onChange={(e) =>
                      setBasePrice(e.target.value === "" ? "" : Number(e.target.value))
                    }
                    placeholder="1899"
                    className="w-full pl-8 pr-3.5 py-2.5 rounded-xl border border-black/15 focus:border-[#072515] focus:ring-1 focus:ring-[#072515] text-xs sm:text-sm outline-none bg-[#FAF8F5]/50 focus:bg-white font-semibold text-black transition"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-black/75 mb-1.5">
                    Discount Precentage (%)
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={discountPercentage}
                    onChange={(e) =>
                      setDiscountPercentage(
                        e.target.value === "" ? "" : Number(e.target.value)
                      )
                    }
                    placeholder="25%"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-black/15 focus:border-[#072515] focus:ring-1 focus:ring-[#072515] text-xs sm:text-sm outline-none bg-[#FAF8F5]/50 focus:bg-white text-black transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-black/75 mb-1.5">
                    Discount Type
                  </label>
                  <div className="relative">
                    <select
                      value={discountType}
                      onChange={(e) => setDiscountType(e.target.value)}
                      className="w-full appearance-none px-3.5 py-2.5 pr-8 rounded-xl border border-black/15 focus:border-[#072515] focus:ring-1 focus:ring-[#072515] text-xs sm:text-sm outline-none bg-[#FAF8F5]/50 focus:bg-white text-black transition cursor-pointer"
                    >
                      <option value="Percentage Discount">Percentage Discount</option>
                      <option value="Flat Concession">Flat Concession</option>
                      <option value="Seasonal Promo">Seasonal Promo</option>
                      <option value="No Discount">No Discount</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-3 size-4 text-black/45 pointer-events-none" />
                  </div>
                </div>
              </div>

              {numDiscount > 0 && numBase > 0 && (
                <div className="pt-1 text-xs text-emerald-800 bg-emerald-50/70 p-2.5 rounded-xl border border-emerald-200/60 flex items-center justify-between">
                  <span>Storefront Selling Price:</span>
                  <span className="font-bold">
                    ₹{computedSellingPrice.toLocaleString("en-IN")}{" "}
                    <span className="line-through text-stone-400 font-normal ml-1">
                      ₹{numBase.toLocaleString("en-IN")}
                    </span>{" "}
                    ({numDiscount}% OFF)
                  </span>
                </div>
              )}
            </section>

            {/* Card 3: Inventory */}
            <section className="bg-white rounded-2xl border border-black/10 shadow-xs p-5 sm:p-6 space-y-4">
              <h2 className="text-sm sm:text-base font-bold text-[#072515]">
                Inventory
              </h2>

              <div>
                <label className="block text-xs font-medium text-black/75 mb-1.5">
                  Quantity
                </label>
                <input
                  type="number"
                  min={0}
                  value={quantity}
                  onChange={(e) =>
                    setQuantity(e.target.value === "" ? "" : Number(e.target.value))
                  }
                  placeholder="Type product quantity"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-black/15 focus:border-[#072515] focus:ring-1 focus:ring-[#072515] text-xs sm:text-sm outline-none bg-[#FAF8F5]/50 focus:bg-white text-black transition"
                />
              </div>
            </section>

            {/* Card 4: Variation */}
            <section className="bg-white rounded-2xl border border-black/10 shadow-xs p-5 sm:p-6 space-y-4">
              <h2 className="text-sm sm:text-base font-bold text-[#072515]">
                Variation
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-black/75 mb-1.5">
                    Variation Type
                  </label>
                  <input
                    type="text"
                    value={variationType}
                    onChange={(e) => setVariationType(e.target.value)}
                    placeholder="e.g. Fragrance Note, Size, Material"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-black/15 focus:border-[#072515] focus:ring-1 focus:ring-[#072515] text-xs sm:text-sm outline-none bg-[#FAF8F5]/50 focus:bg-white text-black transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-black/75 mb-1.5">
                    SKU Variation
                  </label>
                  <input
                    type="text"
                    value={skuVariation}
                    onChange={(e) => setSkuVariation(e.target.value)}
                    placeholder="e.g. Royal Mysore Sandalwood"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-black/15 focus:border-[#072515] focus:ring-1 focus:ring-[#072515] text-xs sm:text-sm outline-none bg-[#FAF8F5]/50 focus:bg-white text-black transition"
                  />
                </div>
              </div>
            </section>
          </div>

          {/* ================================================================= */}
          {/* RIGHT COLUMN (5 COLS): PRODUCT MEDIA & CATEGORY / TAGS            */}
          {/* ================================================================= */}
          <div className="lg:col-span-5 space-y-6">
            {/* Card 5: Product Media */}
            <section className="bg-white rounded-2xl border border-black/10 shadow-xs p-5 sm:p-6 space-y-4">
              <h2 className="text-sm sm:text-base font-bold text-[#072515]">
                Product Media
              </h2>

              <div>
                <label className="block text-xs font-medium text-black/75 mb-2">
                  Photo Product
                </label>

                {/* Dashed Media Container matching reference */}
                <div className="rounded-2xl border-2 border-dashed border-black/15 p-4 bg-[#FAF8F5]/40 space-y-4">
                  {/* Thumbnails Row */}
                  <div className="flex flex-wrap items-center gap-3">
                    {images.map((imgUrl, index) => (
                      <div
                        key={index}
                        className="relative size-20 sm:size-24 rounded-2xl overflow-hidden border border-black/10 bg-white shadow-2xs group shrink-0"
                      >
                        <Image
                          src={imgUrl}
                          alt={`Product media ${index + 1}`}
                          fill
                          unoptimized
                          className="object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(index)}
                          className="absolute top-1 right-1 size-5 rounded-full bg-black/70 hover:bg-red-600 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition cursor-pointer"
                          title="Remove image"
                        >
                          <X className="size-3" />
                        </button>
                        {index === 0 && (
                          <span className="absolute bottom-1 left-1 bg-[#072515]/90 text-[#eed08e] text-[9px] font-bold px-1.5 py-0.5 rounded-md">
                            Primary
                          </span>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Add More Image Button */}
                  <div className="flex justify-center pt-1">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageFileUpload}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isUploading}
                      className="px-5 py-2 rounded-xl border border-indigo-200 bg-indigo-50/70 hover:bg-indigo-100 text-indigo-700 font-semibold text-xs transition cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
                    >
                      <Plus className="size-3.5" />
                      <span>{isUploading ? "Uploading..." : "Add More Image"}</span>
                    </button>
                  </div>
                </div>
              </div>
            </section>

            {/* Card 6: Category */}
            <section className="bg-white rounded-2xl border border-black/10 shadow-xs p-5 sm:p-6 space-y-4 relative">
              <h2 className="text-sm sm:text-base font-bold text-[#072515]">
                Category
              </h2>

              <div>
                <label className="block text-xs font-medium text-black/75 mb-1.5">
                  Product Category
                </label>
                <div className="relative">
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full appearance-none px-3.5 py-2.5 pr-8 rounded-xl border border-black/15 focus:border-[#072515] focus:ring-1 focus:ring-[#072515] text-xs sm:text-sm outline-none bg-[#FAF8F5]/50 focus:bg-white text-black transition cursor-pointer"
                  >
                    <option value="Gift Boxes">Gift Boxes</option>
                    <option value="Fragrances">Fragrances</option>
                    <option value="Sacred Accessories">Sacred Accessories</option>
                    <option value="Royal Mysore Chandan">Royal Mysore Chandan</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-3 size-4 text-black/45 pointer-events-none" />
                </div>
              </div>

              {/* Product Tags Selector matching reference screenshot */}
              <div className="relative">
                <label className="block text-xs font-medium text-black/75 mb-1.5">
                  Product Tags
                </label>
                <button
                  type="button"
                  onClick={() => setIsTagDropdownOpen(!isTagDropdownOpen)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-black/15 bg-[#FAF8F5]/50 hover:bg-white text-xs sm:text-sm flex items-center justify-between text-black font-medium transition cursor-pointer"
                >
                  <span>{selectedTag}</span>
                  <ChevronDown className="size-4 text-black/45" />
                </button>

                {/* Floating Tags Popup Card */}
                {isTagDropdownOpen && (
                  <div className="absolute top-full left-0 right-0 mt-2 z-30 bg-white rounded-2xl border border-black/15 shadow-xl p-4 space-y-3 animate-in fade-in zoom-in-95 duration-150">
                    <h3 className="text-xs font-bold text-black/80">Product Tags</h3>
                    <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                      {AVAILABLE_TAGS.map((tag) => (
                        <label
                          key={tag}
                          onClick={() => setSelectedTag(tag)}
                          className="flex items-center gap-2.5 text-xs text-stone-800 hover:text-black cursor-pointer py-1 px-1.5 rounded-lg hover:bg-black/5 transition"
                        >
                          <span
                            className={`size-4 rounded-full border flex items-center justify-center ${
                              selectedTag === tag
                                ? "border-[#28513B] bg-[#28513B]"
                                : "border-stone-300 bg-white"
                            }`}
                          >
                            {selectedTag === tag && (
                              <span className="size-1.5 rounded-full bg-white" />
                            )}
                          </span>
                          <span>{tag}</span>
                        </label>
                      ))}
                    </div>

                    <div className="pt-2 border-t border-black/10 flex justify-end">
                      <button
                        type="button"
                        onClick={() => setIsTagDropdownOpen(false)}
                        className="px-4 py-1.5 rounded-xl bg-[#28513B] text-white text-xs font-semibold hover:bg-[#28513B]/90 transition cursor-pointer shadow-xs"
                      >
                        Select Tags
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </section>

            {/* Bottom Actions Card */}
            <div className="bg-white rounded-2xl border border-black/10 p-5 space-y-3">
              <button
                type="submit"
                disabled={isSaving}
                className="w-full py-3 rounded-xl bg-[#28513B] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#28513B]/90 transition shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <Save className="size-4 text-white" />
                <span>{isSaving ? "Saving Product..." : "Save Product"}</span>
              </button>

              <Link
                href="/admin?route=products"
                className="block w-full py-2.5 rounded-xl border border-stone-300 text-xs font-semibold text-stone-700 hover:bg-stone-50 transition text-center"
              >
                Cancel & Return
              </Link>
            </div>
          </div>
        </form>
      </main>
      </div>
    </div>
  );
}

export default function NewProductPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center">
          <div className="text-center space-y-3">
            <div className="size-10 border-2 border-[#072515] border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs uppercase tracking-widest text-[#072515] font-semibold">
              Loading Add Product...
            </p>
          </div>
        </div>
      }
    >
      <NewProductPageInner />
    </Suspense>
  );
}
