"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  BadgePercent,
  Tag,
  Gift,
  Award,
  Flame,
  Copy,
  Check,
  Plus,
  Trash2,
  Pencil,
  Download,
  Search,
  Filter,
  CheckCircle2,
  AlertCircle,
  Calendar,
  Clock,
  Truck,
  DollarSign,
  Percent,
  Layers,
  LayoutGrid,
  List,
  RefreshCw,
  X,
  ArrowUpRight,
} from "lucide-react";
import { AdminDiscount } from "@/app/admin/page";

// ============================================================================
// CURATED MASTER DISCOUNTS & FESTIVE COUPONS
// ============================================================================

export const CURATED_MASTER_DISCOUNTS: AdminDiscount[] = [
  {
    id: "disc-diwali",
    title: "DIWALI2026",
    subtitle: "15% off festive gift trunks • Minimum spend ₹3,000",
    status: "Active",
    method: "Code",
    eligibility: "All customers",
    type: "Amount off product",
    used: 42,
    discountValue: "15%",
    minSpend: 3000,
    expiryDate: "Nov 15, 2026",
  },
  {
    id: "disc-royalship",
    title: "ROYALSHIP",
    subtitle: "Free Pan-India Air Express Delivery on orders above ₹2,500",
    status: "Active",
    method: "Automatic",
    eligibility: "All customers",
    type: "Free shipping",
    used: 112,
    discountValue: "Free Air Shipping",
    minSpend: 2500,
    expiryDate: "Dec 31, 2026",
  },
  {
    id: "disc-welcome",
    title: "KURMAWELCOME",
    subtitle: "Flat ₹300 off on your maiden sanctuary order above ₹1,999",
    status: "Active",
    method: "Code",
    eligibility: "First-time patrons",
    type: "Amount off order",
    used: 68,
    discountValue: "₹300 OFF",
    minSpend: 1999,
    expiryDate: "Ongoing",
  },
  {
    id: "disc-sovereign",
    title: "SOVEREIGN20",
    subtitle: "Exclusive 20% off high-value keepsake trunks for Sovereign VIP patrons",
    status: "Active",
    method: "Code",
    eligibility: "VIP Tier",
    type: "Amount off order",
    used: 24,
    discountValue: "20%",
    minSpend: 5000,
    expiryDate: "Dec 31, 2026",
  },
  {
    id: "disc-brass",
    title: "FESTIVEBRASS",
    subtitle: "Buy 2 Elements Boxes, get 1 Brass Turtle Holder at 50% off",
    status: "Active",
    method: "Automatic",
    eligibility: "All customers",
    type: "Buy X get Y",
    used: 19,
    discountValue: "50% Off Accessory",
    minSpend: 1500,
    expiryDate: "Nov 30, 2026",
  },
  {
    id: "disc-sacred10",
    title: "SACRED10",
    subtitle: "Instant 10% privilege discount on all handcrafted artisan creations",
    status: "Active",
    method: "Code",
    eligibility: "All customers",
    type: "Amount off order",
    used: 89,
    discountValue: "10%",
    minSpend: 1000,
    expiryDate: "Ongoing",
  },
  {
    id: "disc-heritage",
    title: "HERITAGE10",
    subtitle: "10% off entire pooja sanctuary suite for returning patrons",
    status: "Active",
    method: "Code",
    eligibility: "Specific patrons",
    type: "Amount off order",
    used: 16,
    discountValue: "10%",
    minSpend: 2000,
    expiryDate: "Dec 31, 2026",
  },
  {
    id: "disc-wedding",
    title: "WEDDINGBLESSINGS",
    subtitle: "Flat ₹1,000 off curated bulk wedding celebration hampers above ₹8,000",
    status: "Active",
    method: "Code",
    eligibility: "Specific patrons",
    type: "Amount off order",
    used: 11,
    discountValue: "₹1,000 OFF",
    minSpend: 8000,
    expiryDate: "Dec 15, 2026",
  },
  {
    id: "disc-flora",
    title: "VEDICFLORA",
    subtitle: "Complimentary Phool Natural Temple Flora Incense on orders above ₹1,500",
    status: "Active",
    method: "Automatic",
    eligibility: "All customers",
    type: "Buy X get Y",
    used: 37,
    discountValue: "Free Incense Box",
    minSpend: 1500,
    expiryDate: "Nov 20, 2026",
  },
  {
    id: "disc-cheti",
    title: "CHETI2026",
    subtitle: "Auspicious New Moon seasonal blessing: ₹250 off any handcrafted brass burner",
    status: "Scheduled",
    method: "Code",
    eligibility: "All customers",
    type: "Amount off product",
    used: 0,
    discountValue: "₹250 OFF",
    minSpend: 1200,
    expiryDate: "Starts Nov 01, 2026",
  },
  {
    id: "disc-summer",
    title: "SUMMERSANCTUARY",
    subtitle: "Early summer season 12% voucher on cooling herbal dhoop cones",
    status: "Expired",
    method: "Code",
    eligibility: "All customers",
    type: "Amount off order",
    used: 53,
    discountValue: "12%",
    minSpend: 1800,
    expiryDate: "Expired Jun 30, 2026",
  },
];

// Helper to format Indian Rupee currency
function formatINR(val: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(val);
}

export interface AdminDiscountsSectionProps {
  discounts: AdminDiscount[];
  setDiscounts: React.Dispatch<React.SetStateAction<AdminDiscount[]>>;
  triggerNotification: (msg: string) => void;
}

export default function AdminDiscountsSection({
  discounts,
  setDiscounts,
  triggerNotification,
}: AdminDiscountsSectionProps) {
  // Search & Filtering State
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | "Active" | "Scheduled" | "Expired" | "VIP Tier">("All");
  const [methodFilter, setMethodFilter] = useState<"All" | "Code" | "Automatic">("All");

  // View Mode: Table vs. Luxury Voucher Ticket Cards
  const [viewMode, setViewMode] = useState<"table" | "cards">("table");

  // Clipboard feedback map { [code]: boolean }
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Modal State for Create / Edit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDiscountId, setEditingDiscountId] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState<{
    code: string;
    subtitle: string;
    type: string;
    discountValue: string;
    method: "Code" | "Automatic";
    eligibility: "All customers" | "Specific patrons" | "VIP Tier" | "First-time patrons";
    minSpend: number;
    expiryDate: string;
    status: "Active" | "Scheduled" | "Expired";
  }>({
    code: "",
    subtitle: "",
    type: "Amount off order",
    discountValue: "15%",
    method: "Code",
    eligibility: "All customers",
    minSpend: 2500,
    expiryDate: "Dec 31, 2026",
    status: "Active",
  });

  // Hydrate discounts from localStorage or set master list
  useEffect(() => {
    try {
      const stored = localStorage.getItem("kurma_admin_discounts");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setDiscounts(parsed);
          return;
        }
      }
      // If nothing stored or empty, initialize with curated master list
      localStorage.setItem("kurma_admin_discounts", JSON.stringify(CURATED_MASTER_DISCOUNTS));
      setDiscounts(CURATED_MASTER_DISCOUNTS);
    } catch {}
  }, [setDiscounts]);

  // Sync to localStorage whenever discounts changes
  const persistDiscounts = (updated: AdminDiscount[]) => {
    setDiscounts(updated);
    try {
      localStorage.setItem("kurma_admin_discounts", JSON.stringify(updated));
      window.dispatchEvent(new Event("storage"));
      window.dispatchEvent(new CustomEvent("kurma_discounts_updated"));
    } catch {}
  };

  // 1-Click Copy Code to Clipboard
  const handleCopyCode = (code: string) => {
    try {
      navigator.clipboard.writeText(code);
      setCopiedCode(code);
      triggerNotification(`Voucher code "${code}" copied to clipboard!`);
      setTimeout(() => setCopiedCode(null), 2500);
    } catch {
      triggerNotification(`Code: ${code}`);
    }
  };

  // Toggle Active / Paused Status
  const handleToggleStatus = (id: string) => {
    const updated = discounts.map((d) => {
      if (d.id === id) {
        const nextStatus = d.status === "Active" ? "Expired" : "Active";
        return { ...d, status: nextStatus as any };
      }
      return d;
    });
    persistDiscounts(updated);
    triggerNotification("Voucher status updated!");
  };

  // Delete Discount
  const handleDeleteDiscount = (id: string, title: string) => {
    if (confirm(`Remove voucher code "${title}" from Kurma Sanctuary catalog?`)) {
      const updated = discounts.filter((d) => d.id !== id);
      persistDiscounts(updated);
      triggerNotification(`Voucher "${title}" removed.`);
    }
  };

  // Duplicate / Clone Discount
  const handleDuplicateDiscount = (disc: AdminDiscount) => {
    const clone: AdminDiscount = {
      ...disc,
      id: `disc-${Date.now()}`,
      title: `${disc.title}-COPY`,
      subtitle: `${disc.subtitle} (Duplicate)`,
      used: 0,
      status: "Active",
    };
    const updated = [clone, ...discounts];
    persistDiscounts(updated);
    triggerNotification(`Duplicated coupon "${disc.title}" as "${clone.title}".`);
  };

  // Open Edit Modal
  const handleOpenEdit = (disc: AdminDiscount) => {
    setEditingDiscountId(disc.id);
    setFormData({
      code: disc.title,
      subtitle: disc.subtitle,
      type: disc.type,
      discountValue: disc.discountValue,
      method: disc.method,
      eligibility: (disc.eligibility as any) || "All customers",
      minSpend: (disc as any).minSpend || 2500,
      expiryDate: (disc as any).expiryDate || "Dec 31, 2026",
      status: disc.status,
    });
    setIsModalOpen(true);
  };

  // Open Create Modal
  const handleOpenCreate = () => {
    setEditingDiscountId(null);
    setFormData({
      code: "",
      subtitle: "",
      type: "Amount off order",
      discountValue: "15%",
      method: "Code",
      eligibility: "All customers",
      minSpend: 2500,
      expiryDate: "Dec 31, 2026",
      status: "Active",
    });
    setIsModalOpen(true);
  };

  // Generate Random Luxury Code
  const handleGenerateRandomCode = () => {
    const prefixes = ["KURMA", "SACRED", "ROYAL", "VEDIC", "MANDALA", "ATELIER", "HERITAGE"];
    const suffixes = ["15", "20", "25", "GOLD", "GIFT", "FESTIVE", "BLESS"];
    const randPrefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    const randSuffix = suffixes[Math.floor(Math.random() * suffixes.length)];
    const code = `${randPrefix}${randSuffix}`;
    setFormData((prev) => ({
      ...prev,
      code,
      subtitle: prev.subtitle || `${prev.discountValue} privilege concession on sacred gifting ensembles`,
    }));
  };

  // Handle Form Submit (Create or Edit)
  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.code.trim()) return;

    const cleanCode = formData.code.trim().toUpperCase();

    if (editingDiscountId) {
      // Edit existing
      const updated = discounts.map((d) => {
        if (d.id === editingDiscountId) {
          return {
            ...d,
            title: cleanCode,
            subtitle: formData.subtitle || `${formData.discountValue} concession on sacred gifting`,
            type: formData.type as any,
            discountValue: formData.discountValue,
            method: formData.method,
            eligibility: formData.eligibility,
            status: formData.status,
            minSpend: formData.minSpend,
            expiryDate: formData.expiryDate,
          };
        }
        return d;
      });
      persistDiscounts(updated);
      triggerNotification(`Updated voucher "${cleanCode}"!`);
    } else {
      // Create new
      const newDisc: AdminDiscount = {
        id: `disc-${Date.now()}`,
        title: cleanCode,
        subtitle: formData.subtitle || `${formData.discountValue} concession on sacred gifting ensembles`,
        status: formData.status,
        method: formData.method,
        eligibility: formData.eligibility,
        type: formData.type as any,
        used: 0,
        discountValue: formData.discountValue,
        minSpend: formData.minSpend,
        expiryDate: formData.expiryDate,
      };
      const updated = [newDisc, ...discounts];
      persistDiscounts(updated);
      triggerNotification(`Created new voucher "${cleanCode}"!`);
    }

    setIsModalOpen(false);
  };

  // Export Discounts to CSV
  const handleExportCSV = () => {
    try {
      const lines: string[] = [];
      lines.push("KURMA SACRED LUXURY SANCTUARY - ACTIVE DISCOUNTS & FESTIVE VOUCHERS");
      lines.push(`Generated: ${new Date().toLocaleString()}`);
      lines.push("");
      lines.push("Code,Discount Value,Type,Method,Eligibility,Status,Redemptions,Min Spend (INR),Expiry Date,Description");
      discounts.forEach((d) => {
        lines.push(
          `"${d.title}","${d.discountValue}","${d.type}","${d.method}","${d.eligibility}","${d.status}",${d.used},${
            (d as any).minSpend || 0
          },"${(d as any).expiryDate || "Ongoing"}","${d.subtitle}"`
        );
      });

      const csvContent = "data:text/csv;charset=utf-8,\uFEFF" + encodeURIComponent(lines.join("\n"));
      const link = document.createElement("a");
      link.setAttribute("href", csvContent);
      link.setAttribute("download", `kurma_discounts_catalog_${Date.now()}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      triggerNotification("Discounts catalog exported to CSV!");
    } catch {
      triggerNotification("Exported discounts list.");
    }
  };

  // Load All Curated Coupons Preset
  const handleLoadCuratedMasterCoupons = () => {
    persistDiscounts(CURATED_MASTER_DISCOUNTS);
    triggerNotification("Loaded 11 curated festive coupons into Kurma Sanctuary!");
  };

  // Filtered List
  const filteredDiscounts = useMemo(() => {
    return discounts.filter((d) => {
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesTitle = d.title.toLowerCase().includes(q);
        const matchesSubtitle = d.subtitle.toLowerCase().includes(q);
        const matchesValue = d.discountValue.toLowerCase().includes(q);
        const matchesType = d.type.toLowerCase().includes(q);
        if (!matchesTitle && !matchesSubtitle && !matchesValue && !matchesType) return false;
      }

      // Status
      if (statusFilter !== "All") {
        if (statusFilter === "VIP Tier" && d.eligibility !== "VIP Tier") return false;
        if (statusFilter !== "VIP Tier" && d.status !== statusFilter) return false;
      }

      // Method
      if (methodFilter !== "All" && d.method !== methodFilter) return false;

      return true;
    });
  }, [discounts, searchQuery, statusFilter, methodFilter]);

  // Executive Statistics
  const totalActive = discounts.filter((d) => d.status === "Active").length;
  const totalUses = discounts.reduce((sum, d) => sum + (d.used || 0), 0);
  const estimatedSavings = totalUses * 442; // Avg ~₹442 saved per voucher
  const topDiscount = [...discounts].sort((a, b) => (b.used || 0) - (a.used || 0))[0];

  return (
    <main className="flex-1 p-4 sm:p-6 bg-[#FAF8F5] space-y-6">
      {/* ==================================================================== */}
      {/* 1. HEADER & CONTROLS BAR                                             */}
      {/* ==================================================================== */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-2 border-b border-black/10">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl sm:text-2xl font-serif font-bold text-[#072515] tracking-tight flex items-center gap-2">
              <BadgePercent className="size-6 text-[#c89e43]" />
              <span>Discounts &amp; Festive Vouchers</span>
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#eed08e]/30 text-[#072515] border border-[#eed08e]/50">
              {discounts.length} Coupons Managed
            </span>
          </div>
          <p className="text-xs text-black/60 mt-1 max-w-2xl">
            Manage promotional coupon codes, automated checkout concessions, VIP patron privileges, and festive celebration benefits.
          </p>
        </div>

        {/* Global Action Buttons */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            type="button"
            onClick={handleLoadCuratedMasterCoupons}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white hover:bg-stone-50 border border-black/15 text-xs font-semibold text-[#072515] transition shadow-2xs cursor-pointer"
            title="Reload all 11 curated Kurma luxury vouchers"
          >
            <RefreshCw className="size-3.5 text-[#c89e43]" />
            <span>Restore Master Presets</span>
          </button>

          <button
            type="button"
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white hover:bg-stone-50 border border-black/15 text-xs font-semibold text-[#072515] transition shadow-2xs cursor-pointer"
            title="Export discounts list as CSV"
          >
            <Download className="size-3.5 text-[#c89e43]" />
            <span>Export CSV</span>
          </button>

          <button
            type="button"
            onClick={handleOpenCreate}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#072515] text-[#eed08e] text-xs font-bold hover:bg-[#072515]/90 transition shadow-sm cursor-pointer"
          >
            <Plus className="size-3.5 text-[#eed08e]" />
            <span>Create Discount</span>
          </button>
        </div>
      </div>

      {/* ==================================================================== */}
      {/* 2. FOUR EXECUTIVE KPI METRIC CARDS                                    */}
      {/* ==================================================================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* CARD 1: ACTIVE VOUCHERS */}
        <div className="p-4 rounded-2xl bg-white border border-black/10 shadow-xs relative overflow-hidden flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] uppercase font-bold text-black/50 tracking-wider">Active Concessions</span>
            <div className="size-8 rounded-lg bg-[#072515]/5 text-[#072515] flex items-center justify-center">
              <BadgePercent className="size-4 text-[#c89e43]" />
            </div>
          </div>
          <div className="mt-2">
            <span className="text-2xl font-serif font-bold text-[#072515] block">
              {totalActive} <span className="text-sm font-normal text-black/50">of {discounts.length} Active</span>
            </span>
            <span className="text-[11px] text-emerald-700 font-semibold mt-1 block">
              ✓ Ready for patron redemption at checkout
            </span>
          </div>
          <div className="mt-3 pt-2.5 border-t border-black/5 text-[11px] text-black/60 flex justify-between">
            <span>Automated in Cart:</span>
            <span className="font-bold text-[#072515]">
              {discounts.filter((d) => d.method === "Automatic").length} Vouchers
            </span>
          </div>
        </div>

        {/* CARD 2: TOTAL REDEMPTIONS */}
        <div className="p-4 rounded-2xl bg-white border border-black/10 shadow-xs relative overflow-hidden flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] uppercase font-bold text-black/50 tracking-wider">Total Redemptions</span>
            <div className="size-8 rounded-lg bg-[#072515]/5 text-[#072515] flex items-center justify-center">
              <Tag className="size-4 text-[#072515]" />
            </div>
          </div>
          <div className="mt-2">
            <span className="text-2xl font-serif font-bold text-[#072515] block">
              {totalUses} <span className="text-sm font-normal text-black/50">times</span>
            </span>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                <ArrowUpRight className="size-3" />
                +26.4%
              </span>
              <span className="text-[11px] text-black/50">festive season uptake</span>
            </div>
          </div>
          <div className="mt-3 pt-2.5 border-t border-black/5 text-[11px] text-black/60 flex justify-between">
            <span>Avg Uses per Code:</span>
            <span className="font-bold text-[#072515]">{(totalUses / discounts.length).toFixed(0)} uses</span>
          </div>
        </div>

        {/* CARD 3: ESTIMATED PATRON SAVINGS */}
        <div className="p-4 rounded-2xl bg-white border border-black/10 shadow-xs relative overflow-hidden flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] uppercase font-bold text-black/50 tracking-wider">Patron Savings Granted</span>
            <div className="size-8 rounded-lg bg-[#072515]/5 text-[#072515] flex items-center justify-center">
              <DollarSign className="size-4 text-[#c89e43]" />
            </div>
          </div>
          <div className="mt-2">
            <span className="text-2xl font-serif font-bold text-[#072515] block">
              {formatINR(estimatedSavings)}
            </span>
            <span className="text-[11px] text-black/50 mt-1 block">
              Subsidized gifting privileges
            </span>
          </div>
          <div className="mt-3 pt-2.5 border-t border-black/5 text-[11px] text-black/60 flex justify-between">
            <span>Avg Concession:</span>
            <span className="font-bold text-emerald-700">~14.8% per basket</span>
          </div>
        </div>

        {/* CARD 4: TOP PERFORMING VOUCHER */}
        <div className="p-4 rounded-2xl bg-[#072515] text-[#FAF8F5] border border-black/10 shadow-md relative overflow-hidden flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-[#eed08e] tracking-wider flex items-center gap-1">
              <Flame className="size-3.5 text-[#eed08e]" />
              Top Gifting Coupon
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#eed08e]/20 text-[#eed08e]">
              #1 Used
            </span>
          </div>
          <div className="mt-2">
            <span className="font-mono font-bold text-lg text-white block tracking-wider">
              {topDiscount?.title || "ROYALSHIP"}
            </span>
            <span className="text-xs text-[#eed08e] font-semibold mt-0.5 block truncate">
              {topDiscount?.subtitle || "Free Pan-India Express Air Shipping"}
            </span>
          </div>
          <div className="mt-3 pt-2.5 border-t border-white/10 text-[11px] text-white/70 flex justify-between">
            <span>Total Redemptions:</span>
            <span className="font-bold text-[#eed08e]">{topDiscount?.used || 112} orders</span>
          </div>
          <div className="absolute -right-6 -bottom-6 size-20 rounded-full bg-[#eed08e]/10 pointer-events-none" />
        </div>
      </div>

      {/* ==================================================================== */}
      {/* 3. SEARCH, STATUS TABS & VIEW MODE CONTROLS                          */}
      {/* ==================================================================== */}
      <div className="space-y-3">
        {/* Status Filter Tabs */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-1.5 p-1 bg-stone-200/60 rounded-xl text-xs font-semibold w-fit max-w-full overflow-x-auto">
            {(["All", "Active", "Scheduled", "Expired", "VIP Tier"] as const).map((tab) => {
              const count =
                tab === "All"
                  ? discounts.length
                  : tab === "VIP Tier"
                  ? discounts.filter((d) => d.eligibility === "VIP Tier").length
                  : discounts.filter((d) => d.status === tab).length;

              return (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setStatusFilter(tab)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition whitespace-nowrap cursor-pointer ${
                    statusFilter === tab
                      ? "bg-[#072515] text-[#eed08e] shadow-2xs font-bold"
                      : "text-stone-700 hover:text-black hover:bg-white/60"
                  }`}
                >
                  <span>{tab}</span>
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                      statusFilter === tab ? "bg-[#eed08e]/20 text-[#eed08e]" : "bg-black/10 text-black/70"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* View Mode Toggle: Table vs Cards */}
          <div className="flex items-center gap-1 p-1 bg-white rounded-xl border border-black/10 shadow-2xs text-xs font-semibold self-start sm:self-auto">
            <button
              type="button"
              onClick={() => setViewMode("table")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition cursor-pointer ${
                viewMode === "table" ? "bg-[#072515] text-[#eed08e] font-bold shadow-2xs" : "text-black/60 hover:text-black"
              }`}
            >
              <List className="size-3.5" />
              <span>Table</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode("cards")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition cursor-pointer ${
                viewMode === "cards" ? "bg-[#072515] text-[#eed08e] font-bold shadow-2xs" : "text-black/60 hover:text-black"
              }`}
            >
              <LayoutGrid className="size-3.5" />
              <span>Voucher Cards</span>
            </button>
          </div>
        </div>

        {/* Search Bar & Method Filter */}
        <div className="bg-white rounded-xl border border-black/10 p-3 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex-1 relative">
            <Search className="size-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-black/40" />
            <input
              type="text"
              placeholder="Search coupon codes, descriptions, or discount amounts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-black/10 text-xs outline-none focus:border-[#072515] bg-stone-50/50"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-black/50 font-medium">Method:</span>
            <select
              value={methodFilter}
              onChange={(e) => setMethodFilter(e.target.value as any)}
              className="px-2.5 py-1.5 rounded-lg border border-black/15 text-xs font-medium outline-none bg-white focus:border-[#072515] cursor-pointer"
            >
              <option value="All">All Methods</option>
              <option value="Code">Code Required</option>
              <option value="Automatic">Automatic at Cart</option>
            </select>
          </div>
        </div>
      </div>

      {/* ==================================================================== */}
      {/* 4. MAIN VIEW: TABLE OR LUXURY VOUCHER TICKET CARDS                   */}
      {/* ==================================================================== */}
      {viewMode === "table" ? (
        /* TABLE VIEW */
        <section className="overflow-hidden rounded-2xl border border-black/10 bg-white shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[840px] border-collapse text-left text-xs">
              <thead className="bg-[#FAF8F5] text-black/70 border-b border-black/10 font-medium">
                <tr>
                  <th className="px-4 py-3">Code &amp; Voucher Title</th>
                  <th className="px-3 py-3">Benefit</th>
                  <th className="px-3 py-3">Status</th>
                  <th className="px-3 py-3">Method</th>
                  <th className="px-3 py-3">Eligibility</th>
                  <th className="px-3 py-3">Conditions</th>
                  <th className="px-3 py-3 text-center">Redeemed</th>
                  <th className="px-3 py-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5">
                {filteredDiscounts.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-12 text-center text-black/50">
                      No vouchers found matching &quot;{searchQuery}&quot;.
                    </td>
                  </tr>
                ) : (
                  filteredDiscounts.map((disc) => (
                    <tr key={disc.id} className="hover:bg-black/[0.015] transition">
                      {/* Code & Title with 1-Click Copy */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleCopyCode(disc.title)}
                            className="group font-mono font-bold text-xs text-[#072515] bg-[#072515]/5 hover:bg-[#072515] hover:text-[#eed08e] px-2.5 py-1 rounded-md border border-[#072515]/15 transition flex items-center gap-1.5 cursor-pointer"
                            title="Click to copy coupon code"
                          >
                            <span>{disc.title}</span>
                            {copiedCode === disc.title ? (
                              <Check className="size-3 text-emerald-600 group-hover:text-[#eed08e]" />
                            ) : (
                              <Copy className="size-3 text-black/40 group-hover:text-[#eed08e]" />
                            )}
                          </button>
                        </div>
                        <p className="text-[11px] text-black/55 mt-1 max-w-sm line-clamp-1">{disc.subtitle}</p>
                      </td>

                      {/* Benefit */}
                      <td className="px-3 py-3 whitespace-nowrap">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#eed08e]/30 text-[#072515] border border-[#eed08e]/50">
                          {disc.discountValue}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="px-3 py-3 whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => handleToggleStatus(disc.id)}
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold transition cursor-pointer ${
                            disc.status === "Active"
                              ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                              : disc.status === "Scheduled"
                              ? "bg-amber-100 text-amber-800 hover:bg-amber-200"
                              : "bg-stone-200 text-stone-600 hover:bg-stone-300"
                          }`}
                          title="Click to toggle status"
                        >
                          <span
                            className={`size-1.5 rounded-full ${
                              disc.status === "Active"
                                ? "bg-emerald-600"
                                : disc.status === "Scheduled"
                                ? "bg-amber-600"
                                : "bg-stone-500"
                            }`}
                          />
                          <span>{disc.status}</span>
                        </button>
                      </td>

                      {/* Method */}
                      <td className="px-3 py-3 whitespace-nowrap">
                        <span className="text-black/70 font-medium">
                          {disc.method === "Automatic" ? "Automated at Cart" : "Code Input"}
                        </span>
                      </td>

                      {/* Eligibility */}
                      <td className="px-3 py-3 whitespace-nowrap">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-medium ${
                            disc.eligibility === "VIP Tier"
                              ? "bg-[#072515] text-[#eed08e] font-bold"
                              : disc.eligibility === "First-time patrons"
                              ? "bg-amber-100 text-amber-800"
                              : "bg-stone-100 text-stone-700"
                          }`}
                        >
                          {disc.eligibility}
                        </span>
                      </td>

                      {/* Conditions */}
                      <td className="px-3 py-3 text-black/60 text-[11px] whitespace-nowrap">
                        {(disc as any).minSpend ? (
                          <span>Min Spend: {formatINR((disc as any).minSpend)}</span>
                        ) : (
                          <span>No Min Spend</span>
                        )}
                        <span className="block text-[10px] text-black/45">
                          {(disc as any).expiryDate ? `Exp: ${(disc as any).expiryDate}` : "No expiry"}
                        </span>
                      </td>

                      {/* Redeemed Count */}
                      <td className="px-3 py-3 text-center font-bold text-[#072515] whitespace-nowrap">
                        <span className="px-2 py-0.5 rounded-full bg-stone-100 font-mono text-xs">
                          {disc.used || 0}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-3 py-3 text-center whitespace-nowrap">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(disc)}
                            className="p-1.5 rounded-lg text-black/50 hover:text-[#072515] hover:bg-black/5 transition cursor-pointer"
                            title="Edit Voucher"
                          >
                            <Pencil className="size-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDuplicateDiscount(disc)}
                            className="p-1.5 rounded-lg text-black/50 hover:text-[#072515] hover:bg-black/5 transition cursor-pointer"
                            title="Duplicate Voucher"
                          >
                            <Copy className="size-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteDiscount(disc.id, disc.title)}
                            className="p-1.5 rounded-lg text-red-500 hover:text-red-700 hover:bg-red-50 transition cursor-pointer"
                            title="Delete Voucher"
                          >
                            <Trash2 className="size-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      ) : (
        /* LUXURY VOUCHER TICKET CARDS VIEW */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDiscounts.map((disc) => (
            <div
              key={disc.id}
              className={`rounded-2xl border transition-all duration-200 relative overflow-hidden flex flex-col justify-between ${
                disc.status === "Active"
                  ? "bg-white border-black/10 hover:shadow-md hover:border-[#072515]/30"
                  : "bg-stone-50 border-stone-200 opacity-75"
              }`}
            >
              {/* Gold Top Band */}
              <div className="h-1.5 w-full bg-gradient-to-r from-[#072515] via-[#eed08e] to-[#072515]" />

              <div className="p-4 space-y-3">
                {/* Header: Status and Type */}
                <div className="flex items-center justify-between">
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      disc.status === "Active"
                        ? "bg-emerald-100 text-emerald-800"
                        : disc.status === "Scheduled"
                        ? "bg-amber-100 text-amber-800"
                        : "bg-stone-200 text-stone-600"
                    }`}
                  >
                    {disc.status}
                  </span>
                  <span className="text-[10px] font-semibold text-black/45 uppercase tracking-wider">
                    {disc.method === "Automatic" ? "Automated Voucher" : "Coupon Code"}
                  </span>
                </div>

                {/* Main Code Box with Copy Button */}
                <div className="p-3 rounded-xl bg-[#FAF8F5] border border-black/10 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <span className="font-mono font-bold text-sm text-[#072515] tracking-wider block truncate">
                      {disc.title}
                    </span>
                    <span className="text-[10px] text-black/50 block">Click code or copy to share</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleCopyCode(disc.title)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#072515] text-[#eed08e] text-xs font-bold hover:bg-[#072515]/90 transition shadow-2xs cursor-pointer shrink-0"
                  >
                    {copiedCode === disc.title ? (
                      <>
                        <Check className="size-3 text-emerald-400" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="size-3" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Concession Highlight */}
                <div className="flex items-baseline justify-between">
                  <span className="text-xl font-serif font-bold text-[#072515]">{disc.discountValue}</span>
                  <span className="text-[11px] text-black/50 font-medium">{disc.type}</span>
                </div>

                <p className="text-xs text-black/65 line-clamp-2 leading-relaxed">{disc.subtitle}</p>

                {/* Details Footer */}
                <div className="pt-2 border-t border-black/5 flex items-center justify-between text-[11px] text-black/50">
                  <span>
                    {(disc as any).minSpend ? `Min: ${formatINR((disc as any).minSpend)}` : "No Min Spend"}
                  </span>
                  <span>{disc.used || 0} times claimed</span>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="p-3 bg-stone-50 border-t border-black/5 flex items-center justify-between text-xs">
                <span className="text-[10px] text-black/45 font-mono">
                  {(disc as any).expiryDate ? `Exp: ${(disc as any).expiryDate}` : "Ongoing"}
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleOpenEdit(disc)}
                    className="p-1 text-black/50 hover:text-[#072515] transition cursor-pointer"
                    title="Edit"
                  >
                    <Pencil className="size-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDuplicateDiscount(disc)}
                    className="p-1 text-black/50 hover:text-[#072515] transition cursor-pointer"
                    title="Duplicate"
                  >
                    <Copy className="size-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteDiscount(disc.id, disc.title)}
                    className="p-1 text-red-500 hover:text-red-700 transition cursor-pointer"
                    title="Delete"
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ==================================================================== */}
      {/* 5. CREATE / EDIT DISCOUNT VOUCHER MODAL                              */}
      {/* ==================================================================== */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden border border-black/15 flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="p-4 bg-[#072515] text-[#FAF8F5] flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="size-8 rounded-lg bg-[#eed08e]/20 border border-[#eed08e]/30 flex items-center justify-center text-[#eed08e]">
                  <BadgePercent className="size-4" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-sm text-[#eed08e]">
                    {editingDiscountId ? "Edit Festive Voucher" : "Create New Sacred Voucher"}
                  </h3>
                  <p className="text-[10px] text-white/60">Configure code, concession type, and eligibility rules</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-white/60 hover:text-white cursor-pointer"
              >
                <X className="size-4" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmitForm} className="p-5 space-y-4 text-xs overflow-y-auto flex-1">
              {/* Code & Generator */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-semibold text-black/80">Voucher / Coupon Code</label>
                  <button
                    type="button"
                    onClick={handleGenerateRandomCode}
                    className="text-[11px] font-bold text-[#072515] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>Generate Luxury Code</span>
                  </button>
                </div>
                <input
                  type="text"
                  required
                  placeholder="e.g. DIWALI2026 or KURMAGIFT20"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  className="w-full px-3 py-2 rounded-lg border border-black/20 outline-none uppercase font-mono font-bold text-sm focus:border-[#072515] bg-stone-50/50"
                />
              </div>

              {/* Type and Value */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-black/80 mb-1">Concession Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-black/20 outline-none bg-white focus:border-[#072515]"
                  >
                    <option value="Amount off order">Amount off order (%)</option>
                    <option value="Amount off product">Amount off product (₹)</option>
                    <option value="Buy X get Y">Buy X get Y (BOGO)</option>
                    <option value="Free shipping">Free shipping</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-black/80 mb-1">Concession Benefit</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 15% or ₹500 or Free Shipping"
                    value={formData.discountValue}
                    onChange={(e) => setFormData({ ...formData, discountValue: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-black/20 outline-none focus:border-[#072515]"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block font-semibold text-black/80 mb-1">Editorial Description &amp; Terms</label>
                <input
                  type="text"
                  placeholder="e.g. 15% off festive gift trunks on orders above ₹3,000"
                  value={formData.subtitle}
                  onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-black/20 outline-none focus:border-[#072515]"
                />
              </div>

              {/* Method & Eligibility */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-black/80 mb-1">Redemption Method</label>
                  <select
                    value={formData.method}
                    onChange={(e) => setFormData({ ...formData, method: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-lg border border-black/20 outline-none bg-white focus:border-[#072515]"
                  >
                    <option value="Code">Customer Enters Code</option>
                    <option value="Automatic">Automatic at Checkout</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-black/80 mb-1">Patron Eligibility</label>
                  <select
                    value={formData.eligibility}
                    onChange={(e) => setFormData({ ...formData, eligibility: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-lg border border-black/20 outline-none bg-white focus:border-[#072515]"
                  >
                    <option value="All customers">All Patrons</option>
                    <option value="First-time patrons">First-Time Patrons</option>
                    <option value="Specific patrons">Returning Patrons</option>
                    <option value="VIP Tier">Sovereign VIP Club Only</option>
                  </select>
                </div>
              </div>

              {/* Minimum Spend & Expiry */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-black/80 mb-1">Minimum Order Spend (₹)</label>
                  <input
                    type="number"
                    min={0}
                    step={100}
                    placeholder="2500"
                    value={formData.minSpend}
                    onChange={(e) => setFormData({ ...formData, minSpend: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-lg border border-black/20 outline-none focus:border-[#072515]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-black/80 mb-1">Expiry Date / Season</label>
                  <input
                    type="text"
                    placeholder="e.g. Dec 31, 2026 or Ongoing"
                    value={formData.expiryDate}
                    onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-black/20 outline-none focus:border-[#072515]"
                  />
                </div>
              </div>

              {/* Status */}
              <div>
                <label className="block font-semibold text-black/80 mb-1">Voucher Status</label>
                <div className="flex items-center gap-3">
                  {(["Active", "Scheduled", "Expired"] as const).map((st) => (
                    <label key={st} className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="radio"
                        name="status"
                        checked={formData.status === st}
                        onChange={() => setFormData({ ...formData, status: st })}
                        className="accent-[#072515]"
                      />
                      <span>{st}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Modal Actions */}
              <div className="pt-3 border-t border-black/10 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3.5 py-2 rounded-lg border border-black/20 text-xs font-semibold hover:bg-black/5 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-[#072515] text-[#eed08e] text-xs font-bold hover:bg-[#072515]/90 transition shadow-sm cursor-pointer flex items-center gap-1.5"
                >
                  <Check className="size-3.5" />
                  <span>{editingDiscountId ? "Save Changes" : "Create Voucher"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
