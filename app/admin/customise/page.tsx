"use client";

import React, { useState, useEffect, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Package,
  Layers,
  Plus,
  Trash2,
  Check,
  CheckCircle2,
  ExternalLink,
  Save,
  Eye,
  SlidersHorizontal,
  Gift,
  Award,
  Search,
  Tag,
  Pencil,
  X,
  CreditCard,
  Clock,
  Upload,
} from "lucide-react";

// NOTE: Rule 9 strictly prohibits Sparkles icon. Ensure no Sparkles is imported or rendered.
// Replacing with Gift, Award, Layers, etc.

export interface AdminBoxOption {
  id: string;
  title: string;
  size: string;
  capacity: number;
  price: number;
  image: string;
  description: string;
  active: boolean;
}

export interface AdminGoodyOption {
  id: string;
  name: string;
  category: "Candle" | "Incense" | "Brassware" | "Wellness" | "Keepsake";
  price: number;
  image: string;
  description: string;
  stock: number;
  active: boolean;
}

const INITIAL_BOX_OPTIONS: AdminBoxOption[] = [
  {
    id: "celebration",
    title: "The Celebration Box",
    size: "8 x 8 x 4 cm",
    capacity: 4,
    price: 650,
    image: "/images/product/mdf-box-clean.png",
    description: "Royal debossed Kurma emblem rigid wooden box with plush velvet lining.",
    active: true,
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
  },
];

const BOX_IMAGE_PRESETS = [
  { label: "Celebration", url: "/images/product/mdf-box-clean.png" },
  { label: "Heritage", url: "/images/product/image.png" },
  { label: "Wood Small", url: "/images/product/marble-box-clean.png" },
  { label: "Wood Large", url: "/images/product/suite-clean.png" },
  { label: "Rustic Basket", url: "/images/product/image9.png" },
  { label: "Jute Round", url: "/images/product/five-boxes-3d.png" },
  { label: "Cross Pattern", url: "/images/product/turtle-holder-clean.png" },
  { label: "Yellow Tray", url: "/images/product/image7.png" },
  { label: "Jute Tray", url: "/images/product/image8.png" },
];

const INITIAL_GOODIES_OPTIONS: AdminGoodyOption[] = [
  {
    id: "summer-breeze",
    name: "Summer Breeze Soy Candle Refill",
    category: "Candle",
    price: 599,
    image: "/images/product/fire-front.png",
    description: "Fresh ocean air and citrus notes with pure natural soy wax.",
    stock: 24,
    active: true,
  },
  {
    id: "tropical-island",
    name: "Tropical Island Candle Refill",
    category: "Candle",
    price: 599,
    image: "/images/product/earth-front.png",
    description: "Escape with toasted coconut & warm vanilla orchid blooms.",
    stock: 18,
    active: true,
  },
  {
    id: "memory-chamber",
    name: "Memory Chamber Sandalwood Candle",
    category: "Candle",
    price: 599,
    image: "/images/product/water-front.png",
    description: "Warm soothing Mysore sandalwood scent for tranquil meditation.",
    stock: 32,
    active: true,
  },
  {
    id: "brass-turtle-holder",
    name: "Solid Brass Turtle Burner",
    category: "Brassware",
    price: 899,
    image: "/images/product/turtle-burner.png",
    description: "Handcrafted Moradabad solid brass sacred incense holder.",
    stock: 45,
    active: true,
  },
  {
    id: "brass-medallion",
    name: "Five Elements Brass Medallion",
    category: "Keepsake",
    price: 699,
    image: "/images/product/turtle-holder-clean.png",
    description: "Solid dual-tone antique brass coin engraved with 5 cosmic elements.",
    stock: 28,
    active: true,
  },
  {
    id: "pashmina-square",
    name: "Pashmina Pocket Square (Gold Zari)",
    category: "Wellness",
    price: 1199,
    image: "/images/product/pashmina-clean.png",
    description: "Forest green fine cashmere silk blend with embroidered Kurma turtle.",
    stock: 15,
    active: true,
  },
  {
    id: "phool-incense",
    name: "Phool Natural Temple Flora Incense",
    category: "Incense",
    price: 245,
    image: "/images/product/air-front.png",
    description: "Charcoal-free temple flower sticks rolled with organic resins.",
    stock: 60,
    active: true,
  },
  {
    id: "bili-hu-coffee",
    name: "Bili Hu Artisanal Estate Coffee",
    category: "Wellness",
    price: 749,
    image: "/images/product/image8.png",
    description: "Specialty-grade single-origin estate coffee beans from Chikmagalur.",
    stock: 20,
    active: true,
  },
];

function CustomiseAdminInner() {
  const router = useRouter();

  // Active Tab: "boxes" | "goodies" | "simulator" | "personalization"
  const [activeTab, setActiveTab] = useState<"boxes" | "goodies" | "simulator" | "personalization">("boxes");

  // State for boxes and goodies
  const [boxes, setBoxes] = useState<AdminBoxOption[]>(INITIAL_BOX_OPTIONS);
  const [goodies, setGoodies] = useState<AdminGoodyOption[]>(INITIAL_GOODIES_OPTIONS);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Search filter
  const [searchQuery, setSearchQuery] = useState("");

  // Edit Modal State for Box
  const [editingBox, setEditingBox] = useState<AdminBoxOption | null>(null);
  const [isAddBoxModalOpen, setIsAddBoxModalOpen] = useState(false);
  const [newBoxData, setNewBoxData] = useState<Partial<AdminBoxOption>>({
    title: "",
    size: "10 x 8 x 3 cm",
    capacity: 4,
    price: 650,
    image: "/images/product/mdf-box-clean.png",
    description: "",
    active: true,
  });

  // Simulator State (reflecting the 4-step frontend from /elements)
  const [simStep, setSimStep] = useState<1 | 2 | 3 | 4>(1);
  const [simSelectedBox, setSimSelectedBox] = useState<AdminBoxOption>(INITIAL_BOX_OPTIONS[0]);
  const [simSelectedGoodies, setSimSelectedGoodies] = useState<Record<string, number>>({
    "summer-breeze": 1,
    "brass-turtle-holder": 1,
  });
  const [simPersonalization, setSimPersonalization] = useState({
    recipientName: "Aditya & Priya",
    senderName: "The Singhania Family",
    giftNote: "Wishing you profound joy, auspicious blessings, and endless harmony in your new home.",
    brassPlaqueText: "SINGHANIA • MMXXVI",
  });

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

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const storedBoxes = localStorage.getItem("kurma_custom_boxes");
      if (storedBoxes) {
        const parsed = JSON.parse(storedBoxes);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setBoxes(parsed);
          setSimSelectedBox(parsed[0]);
        }
      } else {
        localStorage.setItem("kurma_custom_boxes", JSON.stringify(INITIAL_BOX_OPTIONS));
      }

      const storedGoodies = localStorage.getItem("kurma_custom_goodies");
      if (storedGoodies) {
        const parsed = JSON.parse(storedGoodies);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setGoodies(parsed);
        }
      } else {
        localStorage.setItem("kurma_custom_goodies", JSON.stringify(INITIAL_GOODIES_OPTIONS));
      }
    } catch {}
  }, []);

  // Handle Box Image File Upload
  const handleBoxImageUpload = (e: React.ChangeEvent<HTMLInputElement>, isNew: boolean = false) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      if (isNew) {
        setNewBoxData((prev) => ({ ...prev, image: base64 }));
      } else if (editingBox) {
        setEditingBox({ ...editingBox, image: base64 });
      }
    };
    reader.readAsDataURL(file);
  };

  // Toggle Box Active Status
  const toggleBoxActive = (id: string) => {
    const updated = boxes.map((b) => (b.id === id ? { ...b, active: !b.active } : b));
    setBoxes(updated);
    try {
      localStorage.setItem("kurma_custom_boxes", JSON.stringify(updated));
      window.dispatchEvent(new Event("storage"));
      window.dispatchEvent(new CustomEvent("kurma_custom_boxes_updated"));
    } catch {}
    triggerToast("Box visibility updated on storefront customizer!");
  };

  // Toggle Goody Active Status
  const toggleGoodyActive = (id: string) => {
    const updated = goodies.map((g) => (g.id === id ? { ...g, active: !g.active } : g));
    setGoodies(updated);
    try {
      localStorage.setItem("kurma_custom_goodies", JSON.stringify(updated));
      window.dispatchEvent(new Event("storage"));
    } catch {}
    triggerToast("Item visibility updated in customizer catalog!");
  };

  // Save edited box
  const handleSaveEditedBox = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBox) return;

    const updated = boxes.map((b) => (b.id === editingBox.id ? editingBox : b));
    setBoxes(updated);
    try {
      localStorage.setItem("kurma_custom_boxes", JSON.stringify(updated));
      window.dispatchEvent(new Event("storage"));
      window.dispatchEvent(new CustomEvent("kurma_custom_boxes_updated"));
    } catch {}
    setEditingBox(null);
    triggerToast(`Updated "${editingBox.title}"! Changes are live on /elements.`);
  };

  // Add new box
  const handleAddNewBox = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBoxData.title) return;

    const newBox: AdminBoxOption = {
      id: `box-${Date.now()}`,
      title: newBoxData.title,
      size: newBoxData.size || "10 x 8 x 3 cm",
      capacity: Number(newBoxData.capacity) || 4,
      price: Number(newBoxData.price) || 650,
      image: newBoxData.image || "/images/product/mdf-box-clean.png",
      description: newBoxData.description || "Handcrafted bespoke Kurma luxury presentation keepsake.",
      active: newBoxData.active ?? true,
    };

    const updated = [...boxes, newBox];
    setBoxes(updated);
    try {
      localStorage.setItem("kurma_custom_boxes", JSON.stringify(updated));
      window.dispatchEvent(new Event("storage"));
      window.dispatchEvent(new CustomEvent("kurma_custom_boxes_updated"));
    } catch {}
    setIsAddBoxModalOpen(false);
    setNewBoxData({
      title: "",
      size: "10 x 8 x 3 cm",
      capacity: 4,
      price: 650,
      image: "/images/product/mdf-box-clean.png",
      description: "",
      active: true,
    });
    triggerToast(`Created new bespoke box "${newBox.title}"!`);
  };

  // Simulator Calculations
  const simTotalFilledSlots = Object.values(simSelectedGoodies).reduce((sum, qty) => sum + qty, 0);
  const simGoodiesPrice = Object.entries(simSelectedGoodies).reduce((sum, [id, qty]) => {
    const item = goodies.find((g) => g.id === id);
    return sum + (item ? item.price * qty : 0);
  }, 0);
  const simTotalHamperPrice = (simSelectedBox?.price || 0) + simGoodiesPrice + (simPersonalization.brassPlaqueText ? 350 : 0);

  return (
    <div className="min-h-screen bg-[#F6F5F1] text-stone-900 font-sans selection:bg-[#eed08e] selection:text-[#072515] pb-24">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl bg-[#072515] text-[#eed08e] text-xs font-semibold shadow-2xl border border-[#eed08e]/30 animate-in fade-in slide-in-from-top-3">
          <CheckCircle2 className="size-4 text-[#eed08e]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Edit Box Modal */}
      {editingBox && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="w-full max-w-xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-black/10 max-h-[90vh] flex flex-col">
            <div className="p-4 bg-[#072515] text-[#FAF8F5] flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="size-7 rounded-lg bg-[#eed08e]/20 border border-[#eed08e]/30 flex items-center justify-center text-[#eed08e]">
                  <Package className="size-4" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-sm text-[#eed08e]">Edit Bespoke Gift Trunk</h3>
                  <p className="text-[10px] text-white/60">ID: {editingBox.id} • Live on /elements storefront</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setEditingBox(null)}
                className="text-white/60 hover:text-white cursor-pointer"
              >
                <X className="size-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEditedBox} className="p-5 space-y-4 text-xs overflow-y-auto">
              {/* Live Preview Card */}
              <div className="bg-[#FAF8F5] rounded-xl p-3 border border-black/10 flex items-center gap-3">
                <div className="relative size-16 rounded-lg overflow-hidden bg-white border border-black/10 shrink-0">
                  <Image src={editingBox.image} alt={editingBox.title} fill className="object-contain p-1" unoptimized />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="text-[10px] uppercase font-bold text-[#c89e43] tracking-wider block">Live Preview</span>
                  <h4 className="font-serif font-bold text-sm text-[#072515] truncate">{editingBox.title}</h4>
                  <div className="flex items-center gap-2 mt-0.5 text-[11px] text-black/60">
                    <span>{editingBox.size}</span>
                    <span>•</span>
                    <span className="font-semibold text-emerald-800">{editingBox.capacity} items max</span>
                    <span>•</span>
                    <span className="font-bold text-[#072515]">₹{editingBox.price}</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-black/80 mb-1">Trunk Title</label>
                <input
                  type="text"
                  required
                  value={editingBox.title}
                  onChange={(e) => setEditingBox({ ...editingBox, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-black/20 outline-none focus:border-[#072515]"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-black/80 mb-1">Dimensions</label>
                  <input
                    type="text"
                    value={editingBox.size}
                    onChange={(e) => setEditingBox({ ...editingBox, size: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-black/20 outline-none focus:border-[#072515]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-black/80 mb-1">Slot Capacity</label>
                  <input
                    type="number"
                    min={1}
                    max={15}
                    value={editingBox.capacity}
                    onChange={(e) => setEditingBox({ ...editingBox, capacity: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-lg border border-black/20 outline-none focus:border-[#072515]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-black/80 mb-1">Price (₹)</label>
                  <input
                    type="number"
                    min={0}
                    step={50}
                    value={editingBox.price}
                    onChange={(e) => setEditingBox({ ...editingBox, price: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-lg border border-black/20 outline-none focus:border-[#072515]"
                  />
                </div>
              </div>

              {/* Image Configuration & Upload */}
              <div className="space-y-2">
                <label className="block font-semibold text-black/80">Box Image</label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={editingBox.image}
                    onChange={(e) => setEditingBox({ ...editingBox, image: e.target.value })}
                    placeholder="/images/product/mdf-box-clean.png or data URL"
                    className="flex-1 px-3 py-2 rounded-lg border border-black/20 outline-none text-[11px] font-mono focus:border-[#072515]"
                  />
                  <label className="inline-flex items-center gap-1 px-3 py-2 rounded-lg bg-stone-100 hover:bg-stone-200 border border-stone-300 text-stone-800 font-semibold cursor-pointer shrink-0">
                    <Upload className="size-3.5" />
                    <span>Upload File</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleBoxImageUpload(e, false)}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* Presets Grid */}
                <div>
                  <span className="text-[10px] text-black/50 block mb-1">Or select a preset Kurma chest:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {BOX_IMAGE_PRESETS.map((p) => (
                      <button
                        type="button"
                        key={p.url}
                        onClick={() => setEditingBox({ ...editingBox, image: p.url })}
                        className={`px-2 py-1 rounded-md text-[10px] border transition cursor-pointer ${
                          editingBox.image === p.url
                            ? "bg-[#072515] text-[#eed08e] border-[#072515] font-bold"
                            : "bg-white text-black/70 border-black/15 hover:border-black/40"
                        }`}
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-black/80 mb-1">Editorial Description</label>
                <textarea
                  rows={2}
                  value={editingBox.description}
                  onChange={(e) => setEditingBox({ ...editingBox, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-black/20 outline-none resize-none focus:border-[#072515]"
                />
              </div>

              {/* Storefront Active Toggle */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-stone-50 border border-stone-200">
                <div>
                  <span className="font-semibold text-[#072515] block">Storefront Visibility</span>
                  <span className="text-[11px] text-stone-500">Patrons on /elements can choose this packaging</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingBox.active !== false}
                    onChange={(e) => setEditingBox({ ...editingBox, active: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-stone-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#072515]"></div>
                </label>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-black/10">
                <button
                  type="button"
                  onClick={() => setEditingBox(null)}
                  className="px-3.5 py-2 rounded-lg border border-black/15 font-medium hover:bg-black/5 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-[#072515] text-[#eed08e] font-semibold hover:bg-[#072515]/90 transition shadow-sm cursor-pointer flex items-center gap-1.5"
                >
                  <Check className="size-3.5" />
                  <span>Save Trunk Details</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Box Modal */}
      {isAddBoxModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="w-full max-w-xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-black/10 max-h-[90vh] flex flex-col">
            <div className="p-4 bg-[#072515] text-[#FAF8F5] flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="size-7 rounded-lg bg-[#eed08e]/20 border border-[#eed08e]/30 flex items-center justify-center text-[#eed08e]">
                  <Plus className="size-4" />
                </div>
                <h3 className="font-serif font-bold text-sm text-[#eed08e]">Add New Bespoke Trunk</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsAddBoxModalOpen(false)}
                className="text-white/60 hover:text-white cursor-pointer"
              >
                <X className="size-4" />
              </button>
            </div>
            <form onSubmit={handleAddNewBox} className="p-5 space-y-4 text-xs overflow-y-auto">
              <div>
                <label className="block font-semibold text-black/80 mb-1">Trunk Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Royal Mysore Teakwood Casket"
                  value={newBoxData.title}
                  onChange={(e) => setNewBoxData({ ...newBoxData, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-black/20 outline-none focus:border-[#072515]"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-black/80 mb-1">Dimensions</label>
                  <input
                    type="text"
                    placeholder="12 x 10 x 4 cm"
                    value={newBoxData.size}
                    onChange={(e) => setNewBoxData({ ...newBoxData, size: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-black/20 outline-none focus:border-[#072515]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-black/80 mb-1">Capacity (Slots)</label>
                  <input
                    type="number"
                    min={1}
                    max={15}
                    value={newBoxData.capacity}
                    onChange={(e) => setNewBoxData({ ...newBoxData, capacity: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-lg border border-black/20 outline-none focus:border-[#072515]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-black/80 mb-1">Price (₹)</label>
                  <input
                    type="number"
                    min={0}
                    step={50}
                    value={newBoxData.price}
                    onChange={(e) => setNewBoxData({ ...newBoxData, price: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-lg border border-black/20 outline-none focus:border-[#072515]"
                  />
                </div>
              </div>

              {/* Image Selection & Upload */}
              <div className="space-y-2">
                <label className="block font-semibold text-black/80">Box Image</label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={newBoxData.image}
                    onChange={(e) => setNewBoxData({ ...newBoxData, image: e.target.value })}
                    placeholder="/images/product/mdf-box-clean.png or data URL"
                    className="flex-1 px-3 py-2 rounded-lg border border-black/20 outline-none text-[11px] font-mono focus:border-[#072515]"
                  />
                  <label className="inline-flex items-center gap-1 px-3 py-2 rounded-lg bg-stone-100 hover:bg-stone-200 border border-stone-300 text-stone-800 font-semibold cursor-pointer shrink-0">
                    <Upload className="size-3.5" />
                    <span>Upload File</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleBoxImageUpload(e, true)}
                      className="hidden"
                    />
                  </label>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {BOX_IMAGE_PRESETS.map((p) => (
                    <button
                      type="button"
                      key={p.url}
                      onClick={() => setNewBoxData({ ...newBoxData, image: p.url })}
                      className={`px-2 py-1 rounded-md text-[10px] border transition cursor-pointer ${
                        newBoxData.image === p.url
                          ? "bg-[#072515] text-[#eed08e] border-[#072515] font-bold"
                          : "bg-white text-black/70 border-black/15 hover:border-black/40"
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-semibold text-black/80 mb-1">Description</label>
                <textarea
                  rows={2}
                  placeholder="Describe the artisan wood craftsmanship, velvet bedding, or brass accents..."
                  value={newBoxData.description}
                  onChange={(e) => setNewBoxData({ ...newBoxData, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-black/20 outline-none resize-none focus:border-[#072515]"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-black/10">
                <button
                  type="button"
                  onClick={() => setIsAddBoxModalOpen(false)}
                  className="px-3.5 py-2 rounded-lg border border-black/15 font-medium hover:bg-black/5 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-[#072515] text-[#eed08e] font-semibold hover:bg-[#072515]/90 transition shadow-sm cursor-pointer"
                >
                  Create Bespoke Trunk
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Top Sticky Header */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-black/10 px-4 sm:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-3">
            <Link
              href="/admin?route=products"
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-black/15 bg-white hover:bg-black/5 text-xs font-medium text-black/80 transition"
            >
              <ArrowLeft className="size-3.5" />
              <span>Back to Products</span>
            </Link>

            <span className="text-black/30">|</span>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-serif font-bold text-base sm:text-lg text-[#072515]">
                  Customise Studio
                </h1>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800">
                  Live on /elements
                </span>
              </div>
              <p className="text-[11px] text-black/50">
                Manage 4-step bespoke gift hampers, keepsake trunks, goodies catalog &amp; plaque engraving
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 self-end sm:self-auto">
            <a
              href="/elements"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-black/20 bg-white hover:bg-black/5 text-xs font-semibold text-[#072515] transition shadow-2xs"
            >
              <span>Preview Live Customizer</span>
              <ExternalLink className="size-3 text-[#c89e43]" />
            </a>

            <button
              type="button"
              onClick={() => {
                localStorage.setItem("kurma_custom_boxes", JSON.stringify(boxes));
                localStorage.setItem("kurma_custom_goodies", JSON.stringify(goodies));
                triggerToast("All Customise Studio changes saved!");
              }}
              className="px-4 py-1.5 rounded-lg bg-[#072515] text-[#eed08e] text-xs font-semibold hover:bg-[#072515]/90 transition shadow-sm flex items-center gap-1.5 cursor-pointer"
            >
              <Save className="size-3.5" />
              <span>Save Studio Config</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Studio Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-8 pt-6 space-y-6">
        {/* KPI Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div className="p-4 rounded-2xl bg-white border border-black/10 shadow-xs">
            <span className="text-[10px] uppercase font-bold text-black/45 tracking-wider">
              Bespoke Trunks &amp; Boxes
            </span>
            <div className="mt-1 flex items-baseline justify-between">
              <span className="text-xl font-serif font-bold text-[#072515]">{boxes.length} Active</span>
              <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-1.5 py-0.5 rounded">
                100% Ready
              </span>
            </div>
            <p className="text-[11px] text-black/55 mt-1">Capacities from 3 to 9 items</p>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-black/10 shadow-xs">
            <span className="text-[10px] uppercase font-bold text-black/45 tracking-wider">
              Curated Goodies Catalog
            </span>
            <div className="mt-1 flex items-baseline justify-between">
              <span className="text-xl font-serif font-bold text-[#072515]">{goodies.length} Items</span>
              <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-1.5 py-0.5 rounded">
                5 Categories
              </span>
            </div>
            <p className="text-[11px] text-black/55 mt-1">Candles, brassware, flora &amp; silk</p>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-black/10 shadow-xs">
            <span className="text-[10px] uppercase font-bold text-black/45 tracking-wider">
              Personalization Rules
            </span>
            <div className="mt-1 flex items-baseline justify-between">
              <span className="text-xl font-serif font-bold text-[#072515]">Active</span>
              <span className="text-[10px] text-[#c89e43] font-semibold bg-[#eed08e]/20 px-1.5 py-0.5 rounded">
                Gold Plaque
              </span>
            </div>
            <p className="text-[11px] text-black/55 mt-1">Max 24 chars monogram engraving</p>
          </div>

          <div className="p-4 rounded-2xl bg-[#072515] text-[#FAF8F5] border border-black/10 shadow-xs">
            <span className="text-[10px] uppercase font-bold text-[#eed08e] tracking-wider">
              Avg Custom Hamper Value
            </span>
            <div className="mt-1 flex items-baseline justify-between">
              <span className="text-xl font-serif font-bold text-white">₹3,450</span>
              <span className="text-[10px] text-[#eed08e] font-semibold bg-white/10 px-1.5 py-0.5 rounded">
                High Margin
              </span>
            </div>
            <p className="text-[11px] text-white/60 mt-1">Calculated across live configurations</p>
          </div>
        </div>

        {/* Tab Controls Bar */}
        <div className="flex items-center justify-between border-b border-black/10 pb-3">
          <div className="flex items-center gap-1.5 p-1 bg-black/5 rounded-xl text-xs font-semibold">
            <button
              type="button"
              onClick={() => setActiveTab("boxes")}
              className={`px-3 py-1.5 rounded-lg transition cursor-pointer flex items-center gap-1.5 ${
                activeTab === "boxes" ? "bg-white text-[#072515] shadow-xs" : "text-black/60 hover:text-black"
              }`}
            >
              <Package className="size-3.5" />
              <span>Step 1: Boxes &amp; Trunks ({boxes.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("goodies")}
              className={`px-3 py-1.5 rounded-lg transition cursor-pointer flex items-center gap-1.5 ${
                activeTab === "goodies" ? "bg-white text-[#072515] shadow-xs" : "text-black/60 hover:text-black"
              }`}
            >
              <Gift className="size-3.5" />
              <span>Step 2: Goodies Catalog ({goodies.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("personalization")}
              className={`px-3 py-1.5 rounded-lg transition cursor-pointer flex items-center gap-1.5 ${
                activeTab === "personalization" ? "bg-white text-[#072515] shadow-xs" : "text-black/60 hover:text-black"
              }`}
            >
              <Award className="size-3.5" />
              <span>Step 3: Personalization Rules</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("simulator")}
              className={`px-3 py-1.5 rounded-lg transition cursor-pointer flex items-center gap-1.5 ${
                activeTab === "simulator" ? "bg-white text-[#072515] shadow-xs font-bold" : "text-black/60 hover:text-black"
              }`}
            >
              <SlidersHorizontal className="size-3.5 text-[#c89e43]" />
              <span>Live Customizer Simulator</span>
            </button>
          </div>

          {activeTab === "boxes" && (
            <button
              type="button"
              onClick={() => router.push("/admin/customise/edit?id=new")}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#072515] text-[#eed08e] text-xs font-semibold hover:bg-[#072515]/90 transition cursor-pointer"
            >
              <Plus className="size-3.5" />
              <span>Add Bespoke Box</span>
            </button>
          )}
        </div>

        {/* ================================================================= */}
        {/* TAB 1: BOXES & TRUNKS CATALOG                                     */}
        {/* ================================================================= */}
        {activeTab === "boxes" && (
          <section className="bg-white rounded-2xl border border-black/10 shadow-xs overflow-hidden">
            <div className="p-4 border-b border-black/5 flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-[#072515]">Customizer Gift Trunks &amp; Packaging Suite</h2>
                <p className="text-xs text-black/50">Options available for patrons in Step 1 of the /elements customizer.</p>
              </div>
              <span className="text-xs text-black/50 font-mono">{boxes.length} configurations available</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-[#FAF8F5] text-black/70 border-b border-black/10 font-medium">
                  <tr>
                    <th className="px-4 py-3">Trunk / Box</th>
                    <th className="px-3 py-3">Dimensions</th>
                    <th className="px-3 py-3">Slot Capacity</th>
                    <th className="px-3 py-3">Base Price</th>
                    <th className="px-3 py-3">Status</th>
                    <th className="px-3 py-3 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/5">
                  {boxes.map((box) => (
                    <tr key={box.id} className="hover:bg-black/[0.015] transition">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="relative size-12 rounded-xl overflow-hidden border border-black/10 bg-[#FAF8F5] shrink-0">
                            <Image src={box.image} alt={box.title} fill className="object-cover" unoptimized />
                          </div>
                          <div>
                            <span className="font-bold text-[#072515] block">{box.title}</span>
                            <span className="text-[11px] text-black/50 line-clamp-1">{box.description}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-3 text-black/70 font-mono text-[11px]">{box.size}</td>
                      <td className="px-3 py-3">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#072515]/10 text-[#072515]">
                          {box.capacity} Items
                        </span>
                      </td>
                      <td className="px-3 py-3 font-bold text-[#072515]">{formatINR(box.price)}</td>
                      <td className="px-3 py-3">
                        <button
                          type="button"
                          onClick={() => toggleBoxActive(box.id)}
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold transition ${
                            box.active ? "bg-emerald-100 text-emerald-800" : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          <span className={`size-1.5 rounded-full ${box.active ? "bg-emerald-600" : "bg-gray-400"}`} />
                          <span>{box.active ? "Visible" : "Hidden"}</span>
                        </button>
                      </td>
                      <td className="px-3 py-3 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            type="button"
                            onClick={() => router.push(`/admin/customise/edit?id=${box.id}`)}
                            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#072515] text-[#eed08e] text-xs font-semibold hover:bg-[#072515]/90 transition shadow-2xs cursor-pointer"
                            title={`Edit ${box.title} on separate page`}
                          >
                            <Pencil className="size-3" />
                            <span>Edit Box</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => router.push(`/admin/customise/edit?id=${box.id}`)}
                            className="p-1.5 rounded-lg text-black/50 hover:text-[#072515] hover:bg-black/5 transition cursor-pointer"
                            title="Open Dedicated Edit Box Page"
                          >
                            <ExternalLink className="size-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* ================================================================= */}
        {/* TAB 2: GOODIES & AROMATICS LIBRARY                                */}
        {/* ================================================================= */}
        {activeTab === "goodies" && (
          <section className="bg-white rounded-2xl border border-black/10 shadow-xs overflow-hidden">
            <div className="p-4 border-b border-black/5 flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-[#072515]">Step 2 Goodies Catalog for Custom Hampers</h2>
                <p className="text-xs text-black/50">Items patrons can choose to pack inside their selected bespoke box.</p>
              </div>
              <span className="text-xs text-black/50 font-mono">{goodies.length} items available</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-5">
              {goodies.map((goody) => (
                <div
                  key={goody.id}
                  className="p-3.5 rounded-2xl border border-black/10 bg-[#FAF8F5] flex flex-col justify-between"
                >
                  <div>
                    <div className="relative w-full aspect-square rounded-xl overflow-hidden border border-black/10 bg-white mb-3">
                      <Image src={goody.image} alt={goody.name} fill className="object-cover" unoptimized />
                      <span className="absolute top-2 right-2 px-2 py-0.5 rounded-full text-[9px] font-bold bg-[#072515] text-[#eed08e]">
                        {goody.category}
                      </span>
                    </div>

                    <h4 className="font-bold text-xs text-[#072515] line-clamp-1">{goody.name}</h4>
                    <p className="text-[11px] text-black/50 mt-0.5 line-clamp-2">{goody.description}</p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-black/5 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-[#072515] block">{formatINR(goody.price)}</span>
                      <span className="text-[10px] text-black/50">{goody.stock} in stock</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => toggleGoodyActive(goody.id)}
                      className={`px-2.5 py-1 rounded-full text-[10px] font-semibold transition ${
                        goody.active ? "bg-emerald-100 text-emerald-800" : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {goody.active ? "Enabled" : "Disabled"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ================================================================= */}
        {/* TAB 3: PERSONALIZATION RULES                                      */}
        {/* ================================================================= */}
        {activeTab === "personalization" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-8 space-y-6">
              <section className="bg-white rounded-2xl border border-black/10 p-5 sm:p-6 space-y-5">
                <h3 className="font-serif font-bold text-sm text-[#072515] border-b border-black/5 pb-2">
                  Brass Plaque Monogram Engraving Settings
                </h3>

                <div className="space-y-4 text-xs">
                  <div>
                    <label className="block font-semibold text-black/80 mb-1">
                      Plaque Engraving Fee (₹)
                    </label>
                    <input
                      type="number"
                      defaultValue={350}
                      className="w-48 px-3 py-2 rounded-xl border border-black/15 outline-none font-semibold text-[#072515]"
                    />
                    <p className="text-[11px] text-black/50 mt-1">Included on selected luxury chests or charged as an artisan add-on.</p>
                  </div>

                  <div>
                    <label className="block font-semibold text-black/80 mb-1">
                      Max Inscription Character Limit
                    </label>
                    <input
                      type="number"
                      defaultValue={24}
                      className="w-48 px-3 py-2 rounded-xl border border-black/15 outline-none font-semibold text-[#072515]"
                    />
                    <p className="text-[11px] text-black/50 mt-1">Allows names like &quot;THE SHARMA RESIDENCE&quot; or couple monograms.</p>
                  </div>

                  <div>
                    <label className="block font-semibold text-black/80 mb-1">
                      Default Deckle-Edge Calligraphy Blessing Note Template
                    </label>
                    <textarea
                      rows={3}
                      defaultValue="May divine light, pure botanical fragrance, and auspicious harmony bless your sacred space."
                      className="w-full px-3 py-2 rounded-xl border border-black/15 outline-none text-xs leading-relaxed"
                    />
                  </div>
                </div>
              </section>
            </div>

            <div className="lg:col-span-4 space-y-6">
              <section className="bg-white rounded-2xl border border-black/10 p-5 space-y-4">
                <h3 className="font-serif font-bold text-sm text-[#072515] border-b border-black/5 pb-2">
                  Engraved Plaque Live Preview
                </h3>

                <div className="p-4 rounded-xl bg-[#072515] text-center border-2 border-[#eed08e]/40 shadow-inner">
                  <span className="text-[9px] uppercase tracking-widest text-[#eed08e]/70 block font-mono">
                    SOLID BRASS MEDALLION PLAQUE
                  </span>
                  <p className="font-serif font-bold text-sm tracking-wider text-[#eed08e] mt-1.5 uppercase">
                    SINGHANIA • MMXXVI
                  </p>
                  <span className="text-[8px] text-[#eed08e]/50 block mt-1">HAND-CHISELED BY MORADABAD ARTISANS</span>
                </div>

                <p className="text-[11px] text-black/55 leading-relaxed">
                  Every customized hamper is fitted with a solid satin-finished brass plaque affixed with flush brass screws onto the lid.
                </p>
              </section>
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* TAB 4: LIVE CUSTOMIZER SIMULATOR                                  */}
        {/* ================================================================= */}
        {activeTab === "simulator" && (
          <div className="bg-white rounded-2xl border border-black/10 shadow-xs overflow-hidden">
            <div className="p-4 bg-[#072515] text-[#FAF8F5] flex flex-wrap items-center justify-between gap-3">
              <div>
                <span className="text-[10px] uppercase font-bold text-[#eed08e] tracking-wider block">
                  Interactive Simulator
                </span>
                <h3 className="font-serif font-bold text-base text-white">
                  Frontend Customizer Experience (/elements)
                </h3>
              </div>

              {/* Step Pills */}
              <div className="flex items-center gap-1 bg-white/10 p-1 rounded-xl text-xs">
                {[1, 2, 3, 4].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSimStep(s as any)}
                    className={`px-3 py-1 rounded-lg font-semibold transition cursor-pointer ${
                      simStep === s ? "bg-[#eed08e] text-[#072515]" : "text-white/70 hover:text-white"
                    }`}
                  >
                    Step {s}: {s === 1 ? "Box" : s === 2 ? "Goodies" : s === 3 ? "Personalize" : "Summary"}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-6">
              {/* Step 1 Simulator: Select Box */}
              {simStep === 1 && (
                <div className="space-y-4">
                  <h4 className="font-serif font-bold text-sm text-[#072515]">Step 1: Choose Luxury Keepsake Box</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {boxes.map((box) => (
                      <div
                        key={box.id}
                        onClick={() => {
                          setSimSelectedBox(box);
                          setSimStep(2);
                        }}
                        className={`p-3.5 rounded-2xl border cursor-pointer transition ${
                          simSelectedBox?.id === box.id
                            ? "border-[#072515] ring-2 ring-[#072515] bg-[#FAF8F5]"
                            : "border-black/10 hover:border-black/30 bg-white"
                        }`}
                      >
                        <div className="relative w-full aspect-square rounded-xl overflow-hidden mb-2 bg-[#FAF8F5]">
                          <Image src={box.image} alt={box.title} fill className="object-cover" unoptimized />
                        </div>
                        <h5 className="font-bold text-xs text-[#072515]">{box.title}</h5>
                        <p className="text-[10px] text-black/50">{box.size} • {box.capacity} Slots</p>
                        <span className="font-bold text-xs text-[#072515] block mt-2">{formatINR(box.price)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 2 Simulator: Goodies */}
              {simStep === 2 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-black/10">
                    <div>
                      <h4 className="font-serif font-bold text-sm text-[#072515]">
                        Step 2: Pack Goodies into &quot;{simSelectedBox?.title}&quot;
                      </h4>
                      <p className="text-xs text-black/50">
                        Capacity: {simTotalFilledSlots} of {simSelectedBox?.capacity} slots filled
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSimStep(3)}
                      className="px-4 py-1.5 rounded-lg bg-[#072515] text-[#eed08e] text-xs font-semibold"
                    >
                      Continue to Personalization →
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {goodies.map((goody) => {
                      const count = simSelectedGoodies[goody.id] || 0;
                      return (
                        <div key={goody.id} className="p-3.5 rounded-2xl border border-black/10 bg-[#FAF8F5]">
                          <div className="relative w-full aspect-square rounded-xl overflow-hidden mb-2 bg-white">
                            <Image src={goody.image} alt={goody.name} fill className="object-cover" unoptimized />
                          </div>
                          <h5 className="font-bold text-xs text-[#072515] line-clamp-1">{goody.name}</h5>
                          <span className="font-bold text-xs text-[#072515] block mt-1">{formatINR(goody.price)}</span>

                          <div className="mt-3 flex items-center justify-between">
                            <button
                              type="button"
                              onClick={() => {
                                if (count > 0) {
                                  const next = { ...simSelectedGoodies };
                                  if (count === 1) delete next[goody.id];
                                  else next[goody.id] = count - 1;
                                  setSimSelectedGoodies(next);
                                }
                              }}
                              className="size-7 rounded-lg border border-black/20 bg-white flex items-center justify-center font-bold text-xs"
                            >
                              -
                            </button>
                            <span className="font-semibold text-xs">{count}</span>
                            <button
                              type="button"
                              onClick={() => {
                                if (simTotalFilledSlots < simSelectedBox.capacity) {
                                  setSimSelectedGoodies({
                                    ...simSelectedGoodies,
                                    [goody.id]: count + 1,
                                  });
                                } else {
                                  triggerToast("Box capacity reached! Remove an item or upgrade box.");
                                }
                              }}
                              className="size-7 rounded-lg border border-black/20 bg-white flex items-center justify-center font-bold text-xs"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Step 3 Simulator: Personalization */}
              {simStep === 3 && (
                <div className="max-w-2xl mx-auto space-y-4">
                  <h4 className="font-serif font-bold text-sm text-[#072515]">Step 3: Personalization &amp; Blessing Scroll</h4>
                  <div className="space-y-3 text-xs">
                    <div>
                      <label className="block font-semibold text-black/80 mb-1">Recipient Name</label>
                      <input
                        type="text"
                        value={simPersonalization.recipientName}
                        onChange={(e) => setSimPersonalization({ ...simPersonalization, recipientName: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-black/20"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-black/80 mb-1">Sender Name</label>
                      <input
                        type="text"
                        value={simPersonalization.senderName}
                        onChange={(e) => setSimPersonalization({ ...simPersonalization, senderName: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-black/20"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-black/80 mb-1">Brass Plaque Monogram Engraving</label>
                      <input
                        type="text"
                        maxLength={24}
                        value={simPersonalization.brassPlaqueText}
                        onChange={(e) => setSimPersonalization({ ...simPersonalization, brassPlaqueText: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-black/20 font-mono"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-black/80 mb-1">Gift Note Calligraphy</label>
                      <textarea
                        rows={3}
                        value={simPersonalization.giftNote}
                        onChange={(e) => setSimPersonalization({ ...simPersonalization, giftNote: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-black/20 resize-none"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end pt-3">
                    <button
                      type="button"
                      onClick={() => setSimStep(4)}
                      className="px-4 py-2 rounded-lg bg-[#072515] text-[#eed08e] text-xs font-semibold"
                    >
                      Review Hamper Summary →
                    </button>
                  </div>
                </div>
              )}

              {/* Step 4 Simulator: Summary */}
              {simStep === 4 && (
                <div className="max-w-2xl mx-auto space-y-5">
                  <div className="text-center">
                    <span className="text-[10px] uppercase font-bold text-[#c89e43] tracking-wider block">
                      Auspicious Bespoke Ensemble
                    </span>
                    <h4 className="font-serif font-bold text-lg text-[#072515]">
                      Hamper Assembly &amp; Margin Breakdown
                    </h4>
                  </div>

                  <div className="p-5 rounded-2xl bg-[#FAF8F5] border border-black/10 space-y-3 text-xs">
                    <div className="flex justify-between items-center py-1 border-b border-black/5">
                      <span className="font-semibold text-black/80">Selected Trunk ({simSelectedBox.title})</span>
                      <span className="font-bold text-[#072515]">{formatINR(simSelectedBox.price)}</span>
                    </div>

                    <div className="py-1 border-b border-black/5 space-y-1">
                      <span className="font-semibold text-black/80 block">Packed Goodies:</span>
                      {Object.entries(simSelectedGoodies).map(([id, qty]) => {
                        const item = goodies.find((g) => g.id === id);
                        if (!item) return null;
                        return (
                          <div key={id} className="flex justify-between text-black/60 pl-3">
                            <span>{item.name} × {qty}</span>
                            <span>{formatINR(item.price * qty)}</span>
                          </div>
                        );
                      })}
                    </div>

                    {simPersonalization.brassPlaqueText && (
                      <div className="flex justify-between items-center py-1 border-b border-black/5">
                        <span className="font-semibold text-black/80">
                          Custom Brass Plaque Engraving (&quot;{simPersonalization.brassPlaqueText}&quot;)
                        </span>
                        <span className="font-bold text-[#072515]">{formatINR(350)}</span>
                      </div>
                    )}

                    <div className="flex justify-between items-center pt-2 text-sm">
                      <span className="font-serif font-bold text-[#072515]">Total Custom Hamper Value</span>
                      <span className="font-serif font-bold text-base text-[#072515]">{formatINR(simTotalHamperPrice)}</span>
                    </div>
                  </div>

                  <div className="flex justify-center gap-3">
                    <button
                      type="button"
                      onClick={() => setSimStep(1)}
                      className="px-4 py-2 rounded-lg border border-black/20 text-xs font-semibold hover:bg-black/5"
                    >
                      Restart Simulation
                    </button>
                    <a
                      href="/elements"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 rounded-lg bg-[#072515] text-[#eed08e] text-xs font-semibold hover:bg-[#072515]/90 flex items-center gap-1.5"
                    >
                      <span>Open Customer Customizer</span>
                      <ExternalLink className="size-3.5" />
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default function CustomiseAdminPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#F6F5F1] flex items-center justify-center text-xs text-black/50 font-medium">
          Loading Kurma Customise Studio...
        </div>
      }
    >
      <CustomiseAdminInner />
    </Suspense>
  );
}
