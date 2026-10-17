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
  AlertCircle,
  Eye,
  EyeOff,
  FolderTree,
  Tag,
  Globe,
  SlidersHorizontal,
  Search,
  GripVertical,
} from "lucide-react";

export interface AdminCategory {
  id: string;
  title: string;
  slug: string;
  parentId: string | null;
  productCount: number;
  visible: boolean;
  targetRevenue: number;
  salesProgress: number;
  description?: string;
  image?: string;
  badge?: string;
  channels?: string[];
}

const DEFAULT_CATEGORIES: AdminCategory[] = [
  {
    id: "cat-1",
    title: "Luxury Gift Trunks & Boxes",
    slug: "gift-trunks",
    parentId: null,
    productCount: 2,
    visible: true,
    targetRevenue: 150000,
    salesProgress: 84,
    description: "Curated heirloom keepsake chests, gold-foil debossed trunks, and festive celebration caskets crafted for memorable gifting.",
    image: "/images/product/marble-box-clean.png",
    badge: "Best Seller",
    channels: ["Online Storefront", "Corporate Concierge"],
  },
  {
    id: "cat-2",
    title: "Pancha Mahabhuta Incense",
    slug: "five-elements",
    parentId: null,
    productCount: 5,
    visible: true,
    targetRevenue: 90000,
    salesProgress: 68,
    description: "Sacred elemental aromatics honoring Earth (Prithvi), Water (Jal), Fire (Agni), Air (Vayu), and Space (Akasha) with natural flora extracts.",
    image: "/images/product/image.png",
    badge: "Heritage Series",
    channels: ["Online Storefront", "Private Atelier"],
  },
  {
    id: "cat-3",
    title: "Sacred Brass Heirlooms",
    slug: "sacred-accessories",
    parentId: null,
    productCount: 3,
    visible: true,
    targetRevenue: 65000,
    salesProgress: 72,
    description: "Authentic Moradabad solid brass ritual turtle burners, sacred bell chimers, and antique-finished dhoop accessories.",
    image: "/images/product/turtle-burner.png",
    badge: "Artisan Heirloom",
    channels: ["Online Storefront", "Corporate Concierge", "Private Atelier"],
  },
  {
    id: "cat-4",
    title: "Royal Mysore Chandan",
    slug: "mysore-chandan",
    parentId: "cat-2",
    productCount: 2,
    visible: true,
    targetRevenue: 45000,
    salesProgress: 91,
    description: "Pure Karnataka sandalwood sticks infused with slow-burning organic resins and sacred temple extracts.",
    image: "/images/products/agarbatti-sandalwood.jpg",
    badge: "Temple Grade",
    channels: ["Online Storefront"],
  },
  {
    id: "cat-5",
    title: "Bespoke Personalization",
    slug: "personalization",
    parentId: null,
    productCount: 2,
    visible: true,
    targetRevenue: 30000,
    salesProgress: 56,
    description: "Custom engraved brass plaques, hand-lettered deckle-edge scrolls, and wax-sealed benedictions.",
    image: "/images/product/mdf-box-clean.png",
    badge: "Bespoke",
    channels: ["Online Storefront", "Corporate Concierge"],
  },
];

const PRESET_COLLECTION_IMAGES = [
  { label: "Marble Trunk", path: "/images/product/marble-box-clean.png" },
  { label: "MDF Keepsake", path: "/images/product/mdf-box-clean.png" },
  { label: "Celebration Hamper", path: "/images/product/image.png" },
  { label: "Turtle Burner", path: "/images/product/turtle-burner.png" },
  { label: "Temple Flora Incense", path: "/images/products/agarbatti-brass-burner.jpg" },
  { label: "Mysore Chandan", path: "/images/products/agarbatti-sandalwood.jpg" },
];

function CategoryEditorInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const categoryId = searchParams.get("id") || "cat-1";
  const isNewCategory = searchParams.get("new") === "true";

  // Data lists
  const [allCategories, setAllCategories] = useState<AdminCategory[]>(DEFAULT_CATEGORIES);
  const [allProducts, setAllProducts] = useState<ProductSKU[]>(PRODUCTS);
  const [inventoryStock, setInventoryStock] = useState<Record<string, number>>({});

  // UI state
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [productSearchTerm, setProductSearchTerm] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Form State
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("/images/product/marble-box-clean.png");
  const [parentId, setParentId] = useState<string | null>(null);
  const [visible, setVisible] = useState(true);
  const [targetRevenue, setTargetRevenue] = useState<number>(100000);
  const [salesProgress, setSalesProgress] = useState<number>(75);
  const [badge, setBadge] = useState("Best Seller");
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
  const [channels, setChannels] = useState<string[]>([
    "Online Storefront",
    "Corporate Concierge",
  ]);

  // Drag and drop states for collection presets
  const [presetCollectionList, setPresetCollectionList] = useState(PRESET_COLLECTION_IMAGES);
  const [draggedPresetIndex, setDraggedPresetIndex] = useState<number | null>(null);
  const [dragOverPresetIndex, setDragOverPresetIndex] = useState<number | null>(null);
  const [isBannerDragOver, setIsBannerDragOver] = useState(false);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const formatINR = (val: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  // Load from localStorage or defaults
  useEffect(() => {
    try {
      // 1. Categories
      let cats: AdminCategory[] = DEFAULT_CATEGORIES;
      const storedCats = localStorage.getItem("kurma_admin_categories");
      if (storedCats) {
        const parsed = JSON.parse(storedCats);
        if (Array.isArray(parsed) && parsed.length > 0) {
          cats = parsed;
        }
      } else {
        localStorage.setItem("kurma_admin_categories", JSON.stringify(DEFAULT_CATEGORIES));
      }
      setAllCategories(cats);

      // 2. Products
      let prods: ProductSKU[] = PRODUCTS;
      const storedProds = localStorage.getItem("kurma_admin_products");
      if (storedProds) {
        const parsed = JSON.parse(storedProds);
        if (Array.isArray(parsed) && parsed.length > 0) {
          prods = parsed;
        }
      }
      setAllProducts(prods);

      // 3. Stock
      const storedStock = localStorage.getItem("kurma_inventory_stock");
      if (storedStock) {
        setInventoryStock(JSON.parse(storedStock));
      }

      // Populate current category form
      if (isNewCategory) {
        setTitle("");
        setSlug("");
        setDescription("");
        setImage("/images/product/marble-box-clean.png");
        setParentId(null);
        setVisible(true);
        setTargetRevenue(50000);
        setSalesProgress(0);
        setBadge("New Collection");
        setSelectedProductIds([]);
      } else {
        const current = cats.find((c) => c.id === categoryId) || cats[0];
        if (current) {
          setTitle(current.title);
          setSlug(current.slug);
          setDescription(
            current.description ||
              "Handcrafted ceremonial creations designed for mindful spaces and sacred daily pooja rituals."
          );
          setImage(current.image || "/images/product/marble-box-clean.png");
          setParentId(current.parentId || null);
          setVisible(current.visible !== false);
          setTargetRevenue(current.targetRevenue || 75000);
          setSalesProgress(current.salesProgress || 50);
          setBadge(current.badge || "Curated");
          setChannels(current.channels || ["Online Storefront", "Corporate Concierge"]);

          // Match products assigned to this category
          const matching = prods
            .filter((p) => {
              const pCat = p.category?.toLowerCase() || "";
              const cTitle = current.title.toLowerCase();
              return (
                pCat.includes(cTitle) ||
                cTitle.includes(pCat) ||
                (current.slug === "gift-trunks" && pCat.includes("box")) ||
                (current.slug === "five-elements" && (pCat.includes("fragrance") || p.id.includes("fragrance"))) ||
                (current.slug === "sacred-accessories" && (pCat.includes("accessories") || p.id.includes("turtle"))) ||
                (current.slug === "mysore-chandan" && p.name.toLowerCase().includes("chandan")) ||
                (current.slug === "personalization" && p.name.toLowerCase().includes("keepsake"))
              );
            })
            .map((p) => p.id);

          setSelectedProductIds(matching.length > 0 ? matching : [prods[0].id]);
        }
      }
    } catch {
      // ignore error
    }
  }, [categoryId, isNewCategory]);

  // Auto-generate slug from title if user hasn't explicitly customized slug
  const handleTitleChange = (newTitle: string) => {
    setTitle(newTitle);
    if (!slug || slug === title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")) {
      const generated = newTitle
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
      setSlug(generated);
    }
  };

  // Handle local image file upload
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
        triggerToast("Collection banner uploaded successfully!");
      }
      setIsUploading(false);
    };
    reader.onerror = () => {
      triggerToast("Error reading image file.");
      setIsUploading(false);
    };
    reader.readAsDataURL(file);
  };

  // Toggle product selection in category
  const toggleProduct = (prodId: string) => {
    if (selectedProductIds.includes(prodId)) {
      setSelectedProductIds(selectedProductIds.filter((id) => id !== prodId));
    } else {
      setSelectedProductIds([...selectedProductIds, prodId]);
    }
  };

  // Handle drag and drop reordering of collection presets
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

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = () => {
          if (typeof reader.result === "string") {
            const newPreset = {
              label: file.name.replace(/\.[^/.]+$/, "").slice(0, 16),
              path: reader.result,
            };
            const updated = [...presetCollectionList];
            updated.splice(targetIndex, 0, newPreset);
            setPresetCollectionList(updated);
            setImage(reader.result);
            triggerToast(`Added "${newPreset.label}" at position ${targetIndex + 1}!`);
          }
        };
        reader.readAsDataURL(file);
      }
      setDraggedPresetIndex(null);
      setDragOverPresetIndex(null);
      return;
    }

    if (draggedPresetIndex === null || draggedPresetIndex === targetIndex) {
      setDraggedPresetIndex(null);
      setDragOverPresetIndex(null);
      return;
    }

    const updated = [...presetCollectionList];
    const [moved] = updated.splice(draggedPresetIndex, 1);
    updated.splice(targetIndex, 0, moved);

    setPresetCollectionList(updated);
    setDraggedPresetIndex(null);
    setDragOverPresetIndex(null);
    triggerToast(`Moved "${moved.label}" to position ${targetIndex + 1}!`);
  };

  const handlePresetDragEnd = () => {
    setDraggedPresetIndex(null);
    setDragOverPresetIndex(null);
  };

  const handleBannerDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsBannerDragOver(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = () => {
          if (typeof reader.result === "string") {
            setImage(reader.result);
            triggerToast("Collection banner updated!");
          }
        };
        reader.readAsDataURL(file);
      }
      return;
    }

    if (draggedPresetIndex !== null && presetCollectionList[draggedPresetIndex]) {
      const dropped = presetCollectionList[draggedPresetIndex];
      setImage(dropped.path);
      triggerToast(`Set "${dropped.label}" as banner image!`);
      setDraggedPresetIndex(null);
      setDragOverPresetIndex(null);
    }
  };

  // Toggle channel
  const toggleChannel = (channelName: string) => {
    if (channels.includes(channelName)) {
      if (channels.length === 1) {
        triggerToast("At least one sales channel must remain active.");
        return;
      }
      setChannels(channels.filter((c) => c !== channelName));
    } else {
      setChannels([...channels, channelName]);
    }
  };

  // Compute live collection value
  const collectionTotalValue = selectedProductIds.reduce((sum, pId) => {
    const p = allProducts.find((item) => item.id === pId);
    if (!p) return sum;
    const stock = inventoryStock[p.id] ?? 12;
    return sum + p.price * stock;
  }, 0);

  // Save changes
  const handleSaveCategory = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (!title.trim()) {
      triggerToast("Category title cannot be empty.");
      return;
    }

    const cleanSlug =
      slug.trim() ||
      title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

    setIsSaving(true);
    try {
      let updatedCategories: AdminCategory[] = [];

      if (isNewCategory) {
        const newCat: AdminCategory = {
          id: `cat-${Date.now()}`,
          title: title.trim(),
          slug: cleanSlug,
          parentId: parentId || null,
          productCount: selectedProductIds.length,
          visible,
          targetRevenue: Number(targetRevenue) || 50000,
          salesProgress: Number(salesProgress) || 0,
          description: description.trim(),
          image,
          badge,
          channels,
        };
        updatedCategories = [...allCategories, newCat];
      } else {
        updatedCategories = allCategories.map((c) => {
          if (c.id === categoryId) {
            return {
              ...c,
              title: title.trim(),
              slug: cleanSlug,
              parentId: parentId || null,
              productCount: selectedProductIds.length,
              visible,
              targetRevenue: Number(targetRevenue) || c.targetRevenue,
              salesProgress: Number(salesProgress) || c.salesProgress,
              description: description.trim(),
              image,
              badge,
              channels,
            };
          }
          return c;
        });
      }

      setAllCategories(updatedCategories);
      localStorage.setItem("kurma_admin_categories", JSON.stringify(updatedCategories));

      // Optional: sync product categories in kurma_admin_products
      const updatedProducts = allProducts.map((p) => {
        if (selectedProductIds.includes(p.id)) {
          return { ...p, category: title.trim() as any };
        }
        return p;
      });
      localStorage.setItem("kurma_admin_products", JSON.stringify(updatedProducts));

      triggerToast(`Saved category "${title}" successfully!`);
      setTimeout(() => {
        setIsSaving(false);
        router.push("/admin?route=products&sub=categories");
      }, 650);
    } catch {
      setIsSaving(false);
      triggerToast("Error saving category.");
    }
  };

  // Delete category
  const handleDeleteCategory = () => {
    try {
      const updated = allCategories.filter((c) => c.id !== categoryId);
      setAllCategories(updated);
      localStorage.setItem("kurma_admin_categories", JSON.stringify(updated));
      triggerToast(`Category "${title}" deleted.`);
      setTimeout(() => {
        router.push("/admin?route=products&sub=categories");
      }, 500);
    } catch {
      triggerToast("Failed to delete category.");
    }
  };

  // Filter products in picker
  const filteredProducts = allProducts.filter((p) =>
    p.name.toLowerCase().includes(productSearchTerm.toLowerCase()) ||
    p.category?.toLowerCase().includes(productSearchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#F6F5F1] text-stone-900 font-sans selection:bg-[#eed08e] selection:text-[#072515] pb-24">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl bg-[#072515] text-[#eed08e] text-xs font-semibold shadow-2xl border border-[#eed08e]/30 animate-in fade-in slide-in-from-top-3">
          <CheckCircle2 className="size-4 text-[#eed08e]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden border border-black/10">
            <div className="p-4 bg-[#072515] text-[#FAF8F5] flex items-center justify-between">
              <h3 className="font-serif font-bold text-sm text-[#eed08e]">Delete Sanctuary Category</h3>
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                className="text-white/60 hover:text-white"
              >
                <X className="size-4" />
              </button>
            </div>
            <div className="p-5 space-y-4 text-xs">
              <p className="text-black/70">
                Are you sure you wish to delete <strong className="text-[#072515]">{title}</strong>? Products assigned to this category will not be deleted, but will become uncategorized.
              </p>
              <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-black/10">
                <button
                  type="button"
                  onClick={() => setShowDeleteModal(false)}
                  className="px-3.5 py-2 rounded-lg border border-black/15 font-medium hover:bg-black/5"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleDeleteCategory}
                  className="px-3.5 py-2 rounded-lg bg-red-600 text-white font-semibold hover:bg-red-700"
                >
                  Confirm Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Top Sticky Command Bar */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-black/10 px-4 sm:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-3">
            <Link
              href="/admin?route=products&sub=categories"
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-black/15 bg-white hover:bg-black/5 text-xs font-medium text-black/80 transition"
            >
              <ArrowLeft className="size-3.5" />
              <span>Back to Categories</span>
            </Link>

            <span className="text-black/30">|</span>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-serif font-bold text-base sm:text-lg text-[#072515] truncate max-w-xs sm:max-w-md">
                  {title || "New Sacred Collection"}
                </h1>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                    visible ? "bg-emerald-100 text-emerald-800" : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {visible ? "Visible" : "Hidden"}
                </span>
              </div>
              <p className="text-[11px] text-black/50 font-mono">
                {isNewCategory ? "New Category Draft" : `ID: ${categoryId} • /categories/${slug || "..."}`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 self-end sm:self-auto">
            {/* Quick Switch Category Dropdown */}
            {!isNewCategory && (
              <select
                value={categoryId}
                onChange={(e) => router.push(`/admin/categories/edit?id=${encodeURIComponent(e.target.value)}`)}
                className="px-2.5 py-1.5 rounded-lg border border-black/20 bg-white text-xs outline-none text-black/75 hidden md:block"
              >
                {allCategories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    Switch Category: {cat.title}
                  </option>
                ))}
              </select>
            )}

            <Link
              href="/admin?route=products&sub=categories"
              className="px-3 py-1.5 rounded-lg border border-black/20 text-xs font-medium hover:bg-black/5 transition"
            >
              Discard
            </Link>

            <button
              type="button"
              onClick={() => handleSaveCategory()}
              disabled={isSaving}
              className="px-4 py-1.5 rounded-lg bg-[#072515] text-[#eed08e] text-xs font-semibold hover:bg-[#072515]/90 transition shadow-sm flex items-center gap-1.5 cursor-pointer"
            >
              <Save className="size-3.5" />
              <span>{isSaving ? "Saving Category..." : "Save Category"}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Form Body */}
      <main className="max-w-7xl mx-auto px-4 sm:px-8 pt-6">
        <form onSubmit={handleSaveCategory} className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* ================================================================= */}
          {/* LEFT 8 COLUMNS: MAIN CONTENT, MEDIA, & PRODUCTS                   */}
          {/* ================================================================= */}
          <div className="lg:col-span-8 space-y-6">
            {/* Card 1: Title, Slug & Editorial Story */}
            <section className="bg-white rounded-2xl border border-black/10 shadow-xs p-5 sm:p-6 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-black/5">
                <h2 className="text-sm font-bold uppercase tracking-wider text-[#072515] flex items-center gap-2">
                  <FolderTree className="size-4 text-[#c89e43]" />
                  <span>Category Title & Editorial Narrative</span>
                </h2>
                <span className="text-[11px] text-black/40">Kurma Taxonomy</span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-black/80 mb-1.5">
                  Category Title / Collection Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="e.g. Luxury Gift Trunks & Boxes"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-black/15 bg-white text-sm font-medium text-black outline-none focus:border-[#072515] transition"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-black/80 mb-1.5">
                    URL Slug / Collection Handle
                  </label>
                  <div className="flex items-center rounded-xl border border-black/15 bg-white px-3 py-2 text-xs focus-within:border-[#072515] transition">
                    <span className="text-black/40 font-mono shrink-0 select-none">/categories/</span>
                    <input
                      type="text"
                      value={slug}
                      onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
                      placeholder="gift-trunks"
                      className="w-full bg-transparent font-mono outline-none text-[#072515] font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-black/80 mb-1.5">
                    Parent Category
                  </label>
                  <select
                    value={parentId || ""}
                    onChange={(e) => setParentId(e.target.value ? e.target.value : null)}
                    className="w-full px-3 py-2 rounded-xl border border-black/15 bg-white text-xs outline-none focus:border-[#072515] transition"
                  >
                    <option value="">None (Top-Level Primary Collection)</option>
                    {allCategories
                      .filter((c) => c.id !== categoryId)
                      .map((c) => (
                        <option key={c.id} value={c.id}>
                          Sub-category of: {c.title}
                        </option>
                      ))}
                  </select>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-black/80">
                    Editorial Description & Heritage Story
                  </label>
                  <span className="text-[10px] text-black/45">Displayed on Sanctuary storefront header</span>
                </div>
                <textarea
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the sacred significance, artisanal foundries, aromatic notes, and auspicious occasions for this collection..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-black/15 bg-white text-xs leading-relaxed text-black outline-none focus:border-[#072515] transition"
                />
              </div>
            </section>

            {/* Card 2: Collection Hero Banner & Image Upload */}
            <section className="bg-white rounded-2xl border border-black/10 shadow-xs p-5 sm:p-6 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-black/5">
                <div>
                  <h2 className="text-sm font-bold uppercase tracking-wider text-[#072515] flex items-center gap-2">
                    <ImageIcon className="size-4 text-[#c89e43]" />
                    <span>Collection Banner & Visual Identity</span>
                  </h2>
                  <p className="text-xs text-black/55 mt-0.5">
                    Hero photograph featured on the category header and catalog navigation cards.
                  </p>
                </div>
              </div>

              {/* Primary Image Preview & Upload Zone */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 items-start">
                {/* Visual Preview with Drop Support */}
                <div className="sm:col-span-5 flex flex-col items-center">
                  <div
                    onDragOver={(e) => {
                      e.preventDefault();
                      e.dataTransfer.dropEffect = "copy";
                      setIsBannerDragOver(true);
                    }}
                    onDragLeave={() => setIsBannerDragOver(false)}
                    onDrop={handleBannerDrop}
                    className={`relative w-full aspect-[4/3] rounded-xl overflow-hidden border transition-all duration-200 ${
                      isBannerDragOver
                        ? "border-[#072515] ring-4 ring-[#072515]/20 scale-[1.02] bg-[#eed08e]/20"
                        : "border-black/15 bg-[#FAF8F5] shadow-xs"
                    }`}
                  >
                    {image ? (
                      <Image
                        src={image}
                        alt={title || "Category banner"}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-black/40 p-4 text-center">
                        <ImageIcon className="size-8 mb-2 opacity-50" />
                        <span className="text-xs">No banner assigned</span>
                      </div>
                    )}
                    {isBannerDragOver && (
                      <div className="absolute inset-0 bg-[#072515]/80 backdrop-blur-xs flex flex-col items-center justify-center text-[#eed08e] p-4 text-center z-20 animate-in fade-in">
                        <Upload className="size-8 mb-2" />
                        <p className="text-xs font-bold">Drop to Set as Primary Banner</p>
                      </div>
                    )}
                  </div>
                  {image && (
                    <button
                      type="button"
                      onClick={() => setImage("")}
                      className="mt-2 text-[11px] text-red-600 hover:text-red-700 flex items-center gap-1 font-medium"
                    >
                      <Trash2 className="size-3" />
                      <span>Remove current image</span>
                    </button>
                  )}
                </div>

                {/* Upload & Drag Drop Zone */}
                <div className="sm:col-span-7 space-y-3">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageFileUpload}
                    className="hidden"
                  />

                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-black/20 hover:border-[#072515] rounded-xl p-5 text-center cursor-pointer transition bg-[#FAF8F5]/60 hover:bg-[#FAF8F5]"
                  >
                    <div className="size-10 rounded-full bg-[#072515]/5 text-[#072515] flex items-center justify-center mx-auto mb-2">
                      <Upload className="size-4 text-[#072515]" />
                    </div>
                    <p className="text-xs font-semibold text-[#072515]">
                      {isUploading ? "Uploading photo..." : "Click to upload collection banner"}
                    </p>
                    <p className="text-[11px] text-black/50 mt-1">PNG, JPG, or WEBP up to 10MB</p>
                  </div>

                  {/* Preset Luxury Images from Kurma Atelier with Drag and Drop */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[11px] font-semibold text-black/80 flex items-center gap-1.5">
                        <span>Kurma Atelier Presets</span>
                        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-medium bg-[#072515]/5 text-[#072515]">
                          <GripVertical className="size-2.5 text-[#c89e43]" /> Drag &amp; Drop to Reorder
                        </span>
                      </span>
                      <span className="text-[10px] text-black/45">Drag to reposition</span>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      {presetCollectionList.map((preset, idx) => {
                        const isDragging = draggedPresetIndex === idx;
                        const isDragOver = dragOverPresetIndex === idx;
                        const isSelected = image === preset.path;

                        return (
                          <div
                            key={preset.path}
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
                            className={`group relative aspect-video rounded-lg overflow-hidden border p-0.5 text-left transition-all duration-200 cursor-grab active:cursor-grabbing select-none ${
                              isDragging
                                ? "opacity-30 scale-90 border-dashed border-[#072515]"
                                : isDragOver
                                ? "border-[#072515] ring-2 ring-[#072515] bg-[#eed08e]/20 scale-105 shadow-md -translate-y-0.5 z-10"
                                : isSelected
                                ? "border-[#072515] ring-2 ring-[#072515]/20 shadow-xs"
                                : "border-black/10 hover:border-black/30 bg-white"
                            }`}
                            title="Drag to reposition • Click to select"
                          >
                            {/* Position Badge */}
                            <div className="absolute top-1 left-1 z-10 flex items-center gap-0.5 px-1 py-0.5 rounded bg-black/60 backdrop-blur-xs text-[8px] font-mono text-white/90 shadow-2xs group-hover:bg-[#072515] transition">
                              <GripVertical className="size-2 opacity-70" />
                              <span>{idx + 1}</span>
                            </div>

                            <Image
                              src={preset.path}
                              alt={preset.label}
                              fill
                              className="object-cover pointer-events-none"
                              unoptimized
                            />
                            <span className="absolute bottom-0 inset-x-0 bg-black/60 backdrop-blur-xs text-[9px] text-white px-1 py-0.5 truncate text-center font-medium">
                              {preset.label}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Card 3: Products Included in this Collection */}
            <section className="bg-white rounded-2xl border border-black/10 shadow-xs p-5 sm:p-6 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-2 border-b border-black/5">
                <div>
                  <h2 className="text-sm font-bold uppercase tracking-wider text-[#072515] flex items-center gap-2">
                    <Package className="size-4 text-[#c89e43]" />
                    <span>Products in this Category</span>
                  </h2>
                  <p className="text-xs text-black/55 mt-0.5">
                    Select which artisan creations appear inside this collection storefront view.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-[#072515] text-[#eed08e]">
                    {selectedProductIds.length} items assigned
                  </span>
                </div>
              </div>

              {/* Product Search Filter inside picker */}
              <div className="relative">
                <Search className="size-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-black/40" />
                <input
                  type="text"
                  value={productSearchTerm}
                  onChange={(e) => setProductSearchTerm(e.target.value)}
                  placeholder="Filter available products by title or sku..."
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-black/15 bg-[#FAF8F5] outline-none focus:border-[#072515] transition"
                />
              </div>

              {/* Products Table / Checklist */}
              <div className="border border-black/10 rounded-xl overflow-hidden divide-y divide-black/5 max-h-96 overflow-y-auto">
                {filteredProducts.map((prod) => {
                  const isChecked = selectedProductIds.includes(prod.id);
                  const stock = inventoryStock[prod.id] ?? 12;
                  return (
                    <div
                      key={prod.id}
                      onClick={() => toggleProduct(prod.id)}
                      className={`flex items-center justify-between p-3 cursor-pointer transition text-xs select-none ${
                        isChecked ? "bg-[#072515]/[0.03]" : "hover:bg-black/[0.015]"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {}} // handled by parent div
                          className="size-4 rounded accent-[#072515] cursor-pointer"
                        />
                        <div className="relative size-10 rounded-lg overflow-hidden border border-black/10 bg-[#FAF8F5] shrink-0">
                          <Image src={prod.image} alt={prod.name} fill className="object-cover" />
                        </div>
                        <div>
                          <p className="font-semibold text-[#072515]">{prod.name}</p>
                          <p className="text-[10px] text-black/50">
                            {prod.category} • <span className="font-mono">{prod.id}</span>
                          </p>
                        </div>
                      </div>

                      <div className="text-right flex items-center gap-4">
                        <span className="font-medium text-black/75">
                          {stock} in stock
                        </span>
                        <span className="font-bold text-[#072515] min-w-[70px] text-right">
                          {formatINR(prod.price)}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Card 4: Search Engine (SEO) Preview */}
            <section className="bg-white rounded-2xl border border-black/10 shadow-xs p-5 sm:p-6 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-black/5">
                <h2 className="text-sm font-bold uppercase tracking-wider text-[#072515] flex items-center gap-2">
                  <Globe className="size-4 text-[#c89e43]" />
                  <span>Search Engine (SEO) Listing Preview</span>
                </h2>
                <span className="text-[11px] text-black/40">Google Search Result</span>
              </div>

              <div className="bg-[#FAF8F5] p-4 rounded-xl border border-black/10 space-y-1">
                <p className="text-xs font-mono text-emerald-800 truncate">
                  https://kurmaluxury.com/categories/{slug || "gift-trunks"}
                </p>
                <h3 className="text-base text-blue-700 font-medium hover:underline cursor-pointer line-clamp-1">
                  {title || "Luxury Gift Trunks & Boxes"} | Kurma Sacred Luxury
                </h3>
                <p className="text-xs text-black/65 line-clamp-2 leading-relaxed">
                  {description ||
                    "Curated luxury gift trunks, ceremonial brass accessories, and pure sacred incense crafted for auspicious gifting by Kurma Sanctuary."}
                </p>
              </div>
            </section>
          </div>

          {/* ================================================================= */}
          {/* RIGHT 4 COLUMNS: PUBLISHING, TARGETS, & DANGER ZONE               */}
          {/* ================================================================= */}
          <div className="lg:col-span-4 space-y-6">
            {/* Box 1: Storefront Visibility */}
            <section className="bg-white rounded-2xl border border-black/10 shadow-xs p-5 space-y-4">
              <h2 className="text-sm font-bold uppercase tracking-wider text-[#072515] pb-2 border-b border-black/5 flex items-center justify-between">
                <span>Storefront Visibility</span>
                {visible ? (
                  <Eye className="size-4 text-emerald-600" />
                ) : (
                  <EyeOff className="size-4 text-gray-400" />
                )}
              </h2>

              <div className="space-y-3 text-xs">
                <label className="flex items-start gap-3 p-3 rounded-xl border border-black/10 cursor-pointer hover:bg-black/[0.02] transition">
                  <input
                    type="radio"
                    name="visibility"
                    checked={visible}
                    onChange={() => setVisible(true)}
                    className="mt-0.5 accent-[#072515]"
                  />
                  <div>
                    <span className="font-semibold text-[#072515] block">Visible on Storefront</span>
                    <span className="text-black/55 text-[11px]">
                      Patrons can browse, filter, and discover this collection online.
                    </span>
                  </div>
                </label>

                <label className="flex items-start gap-3 p-3 rounded-xl border border-black/10 cursor-pointer hover:bg-black/[0.02] transition">
                  <input
                    type="radio"
                    name="visibility"
                    checked={!visible}
                    onChange={() => setVisible(false)}
                    className="mt-0.5 accent-[#072515]"
                  />
                  <div>
                    <span className="font-semibold text-black/75 block">Hidden / Draft</span>
                    <span className="text-black/55 text-[11px]">
                      Invisible from menus and store navigation; accessible only via direct link.
                    </span>
                  </div>
                </label>
              </div>

              {/* Publishing Channels */}
              <div className="pt-2 border-t border-black/10 space-y-2">
                <span className="block text-xs font-semibold text-black/80">Sales Channels</span>
                {[
                  "Online Storefront",
                  "Corporate Concierge",
                  "Private Atelier",
                ].map((channel) => (
                  <label key={channel} className="flex items-center gap-2.5 text-xs text-black/75 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={channels.includes(channel)}
                      onChange={() => toggleChannel(channel)}
                      className="size-3.5 rounded accent-[#072515]"
                    />
                    <span>{channel}</span>
                  </label>
                ))}
              </div>
            </section>

            {/* Box 2: Collection Badge & Merchandising */}
            <section className="bg-white rounded-2xl border border-black/10 shadow-xs p-5 space-y-4">
              <h2 className="text-sm font-bold uppercase tracking-wider text-[#072515] pb-2 border-b border-black/5 flex items-center gap-2">
                <Tag className="size-4 text-[#c89e43]" />
                <span>Collection Tag & Badge</span>
              </h2>

              <div>
                <label className="block text-xs font-semibold text-black/80 mb-1.5">
                  Promotional Tag Pill
                </label>
                <select
                  value={badge}
                  onChange={(e) => setBadge(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-black/15 bg-white text-xs outline-none focus:border-[#072515] transition"
                >
                  <option value="Best Seller">Best Seller</option>
                  <option value="Heritage Series">Heritage Series</option>
                  <option value="Artisan Heirloom">Artisan Heirloom</option>
                  <option value="Festive Exclusive">Festive Exclusive</option>
                  <option value="Temple Grade">Temple Grade</option>
                  <option value="Bespoke">Bespoke</option>
                  <option value="Limited Batch">Limited Batch</option>
                </select>
                <div className="mt-2.5 flex items-center gap-2">
                  <span className="text-[11px] text-black/50">Preview badge:</span>
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#072515] text-[#eed08e]">
                    {badge}
                  </span>
                </div>
              </div>
            </section>

            {/* Box 3: Business Targets & Performance */}
            <section className="bg-white rounded-2xl border border-black/10 shadow-xs p-5 space-y-4">
              <h2 className="text-sm font-bold uppercase tracking-wider text-[#072515] pb-2 border-b border-black/5 flex items-center gap-2">
                <SlidersHorizontal className="size-4 text-[#c89e43]" />
                <span>Sales Targets & Progress</span>
              </h2>

              <div className="space-y-3.5 text-xs">
                <div>
                  <label className="block font-semibold text-black/80 mb-1">
                    Monthly Revenue Target (₹)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 font-semibold text-[#072515]">
                      ₹
                    </span>
                    <input
                      type="number"
                      step={5000}
                      min={0}
                      value={targetRevenue}
                      onChange={(e) => setTargetRevenue(Number(e.target.value))}
                      className="w-full pl-8 pr-3 py-2 rounded-xl border border-black/15 bg-white font-semibold text-[#072515] outline-none"
                    />
                  </div>
                  <p className="text-[10px] text-black/45 mt-1">Formatted: {formatINR(targetRevenue)}</p>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="font-semibold text-black/80">Sales Target Progress</label>
                    <span className="font-bold text-[#072515]">{salesProgress}%</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={salesProgress}
                    onChange={(e) => setSalesProgress(Number(e.target.value))}
                    className="w-full accent-[#072515] cursor-pointer"
                  />
                  <div className="w-full bg-black/5 h-2 rounded-full overflow-hidden mt-1">
                    <div
                      className="bg-gradient-to-r from-[#072515] to-[#c89e43] h-full rounded-full transition-all"
                      style={{ width: `${salesProgress}%` }}
                    />
                  </div>
                </div>

                {/* Live Value Card */}
                <div className="pt-3 border-t border-black/10">
                  <div className="bg-[#FAF8F5] p-3 rounded-xl border border-black/10">
                    <span className="block text-[10px] text-black/50 uppercase tracking-wider font-semibold">
                      Total Category Stock Valuation
                    </span>
                    <p className="text-base font-bold text-[#072515] mt-0.5">
                      {formatINR(collectionTotalValue)}
                    </p>
                    <p className="text-[10px] text-black/45 mt-0.5">
                      Aggregated across {selectedProductIds.length} assigned products in atelier.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Box 4: Danger Zone */}
            {!isNewCategory && (
              <section className="bg-red-50/50 rounded-2xl border border-red-200/70 p-5 space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-red-900 flex items-center gap-1.5">
                  <AlertCircle className="size-3.5 text-red-600" />
                  <span>Category Management</span>
                </h3>
                <p className="text-[11px] text-red-800/80 leading-relaxed">
                  Deleting this category removes its taxonomy group from the Kurma Sanctuary navigation and storefront filters.
                </p>
                <button
                  type="button"
                  onClick={() => setShowDeleteModal(true)}
                  className="w-full py-2 px-3 rounded-xl border border-red-300 bg-white hover:bg-red-50 text-red-700 font-semibold text-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Trash2 className="size-3.5" />
                  <span>Delete This Category</span>
                </button>
              </section>
            )}
          </div>
        </form>
      </main>
    </div>
  );
}

export default function CategoryEditPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#F6F5F1] flex items-center justify-center text-xs text-black/50 font-medium">
          Loading Kurma Category Editor...
        </div>
      }
    >
      <CategoryEditorInner />
    </Suspense>
  );
}
