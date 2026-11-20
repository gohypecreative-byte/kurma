"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  BadgePercent,
  Tag,
  Gift,
  Award,
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
  UsersRound,
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

  // Hydrate discounts from backend API or localStorage fallback
  useEffect(() => {
    let isMounted = true;
    async function loadDiscounts() {
      try {
        const res = await fetch("/api/admin/discounts");
        const data = await res.json();
        if (data.success && Array.isArray(data.discounts) && data.discounts.length > 0 && isMounted) {
          setDiscounts(data.discounts);
          localStorage.setItem("kurma_admin_discounts", JSON.stringify(data.discounts));
          return;
        }
      } catch (err) {
        console.warn("Could not fetch discounts from API, falling back to localStorage", err);
      }

      try {
        const stored = localStorage.getItem("kurma_admin_discounts");
        if (stored && isMounted) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setDiscounts(parsed);
            return;
          }
        }
        localStorage.setItem("kurma_admin_discounts", JSON.stringify(CURATED_MASTER_DISCOUNTS));
        if (isMounted) setDiscounts(CURATED_MASTER_DISCOUNTS);
      } catch {}
    }
    loadDiscounts();
    return () => {
      isMounted = false;
    };
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
  const handleToggleStatus = async (id: string) => {
    const target = discounts.find((d) => d.id === id);
    const nextStatus = target?.status === "Active" ? "Expired" : "Active";
    const updated = discounts.map((d) => {
      if (d.id === id) {
        return { ...d, status: nextStatus as any };
      }
      return d;
    });
    persistDiscounts(updated);

    try {
      await fetch("/api/admin/discounts", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: nextStatus }),
      });
    } catch (err) {
      console.warn("Failed to persist discount status to backend", err);
    }

    triggerNotification("Voucher status updated!");
  };

  // Delete Discount
  const handleDeleteDiscount = async (id: string, title: string) => {
    if (confirm(`Remove voucher code "${title}" from Kurma Sanctuary catalog?`)) {
      const updated = discounts.filter((d) => d.id !== id);
      persistDiscounts(updated);

      try {
        await fetch(`/api/admin/discounts?id=${encodeURIComponent(id)}`, { method: "DELETE" });
      } catch (err) {
        console.warn("Failed to delete discount in backend", err);
      }

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
  const handleSubmitForm = async (e: React.FormEvent) => {
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

      try {
        await fetch("/api/admin/discounts", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: editingDiscountId,
            status: formData.status,
          }),
        });
      } catch (err) {
        console.warn("Failed to update discount on server", err);
      }

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

      try {
        const res = await fetch("/api/admin/discounts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: cleanCode,
            subtitle: formData.subtitle || `${formData.discountValue} concession on sacred gifting ensembles`,
            method: formData.method,
            eligibility: formData.eligibility,
            type: formData.type,
            discountValue: formData.discountValue,
            minSpend: formData.minSpend,
            expiryDate: formData.expiryDate,
          }),
        });
        const resData = await res.json();
        if (resData.success && resData.discount) {
          // Sync with server assigned id if needed
          const serverUpdated = updated.map((d) =>
            d.id === newDisc.id ? { ...d, id: resData.discount.id } : d
          );
          persistDiscounts(serverUpdated);
        }
      } catch (err) {
        console.warn("Failed to create discount on server", err);
      }

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

  return (
    <main className="min-h-full flex-1 bg-[#f5f5f5] p-4 text-black sm:p-5 space-y-4">
      {/* ==================================================================== */}
      {/* 1. HEADER & ACTIONS BAR                                              */}
      {/* ==================================================================== */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="flex items-center gap-2 text-lg font-semibold text-black">
          <BadgePercent className="size-4" />
          Discounts
        </h1>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleLoadCuratedMasterCoupons}
            className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-black/[0.06] px-3 text-xs font-medium hover:bg-black/10 text-black transition"
            title="Reload curated festive vouchers"
          >
            <RefreshCw className="size-3.5" />
            Restore presets
          </button>

          <button
            type="button"
            onClick={handleExportCSV}
            className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-black/[0.06] px-3 text-xs font-medium hover:bg-black/10 text-black transition"
            title="Export discounts list as CSV"
          >
            <Download className="size-3.5" />
            Export
          </button>

          <button
            type="button"
            onClick={handleOpenCreate}
            className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-black px-3 text-xs font-medium text-white transition hover:bg-black/80 shadow-2xs"
          >
            <Plus className="size-3.5" />
            Create discount
          </button>
        </div>
      </div>

      {/* ==================================================================== */}
      {/* 2. SUMMARY STRIP (admin-panel styled)                                */}
      {/* ==================================================================== */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="rounded-xl border border-black/10 bg-white p-4 shadow-sm">
          <p className="w-fit border-b border-dotted border-black/55 text-xs font-medium text-black/75">
            Active discounts
          </p>
          <p className="mt-1 text-base sm:text-lg font-semibold text-black">
            {totalActive} <span className="text-xs font-normal text-black/45">of {discounts.length} active</span>
          </p>
          <div className="mt-2 h-0.5 w-11 bg-[#55c5f7]" />
        </div>

        <div className="rounded-xl border border-black/10 bg-white p-4 shadow-sm">
          <p className="w-fit border-b border-dotted border-black/55 text-xs font-medium text-black/75">
            Total redemptions
          </p>
          <p className="mt-1 text-base sm:text-lg font-semibold text-black">
            {totalUses} <span className="text-xs font-normal text-emerald-700">+26.4%</span>
          </p>
          <div className="mt-2 h-0.5 w-11 bg-[#55c5f7]" />
        </div>

        <div className="rounded-xl border border-black/10 bg-white p-4 shadow-sm">
          <p className="w-fit border-b border-dotted border-black/55 text-xs font-medium text-black/75">
            Patron savings granted
          </p>
          <p className="mt-1 text-base sm:text-lg font-semibold text-black">
            {formatINR(estimatedSavings)}
          </p>
          <div className="mt-2 h-0.5 w-11 bg-[#55c5f7]" />
        </div>

        <div className="rounded-xl border border-black/10 bg-white p-4 shadow-sm">
          <p className="w-fit border-b border-dotted border-black/55 text-xs font-medium text-black/75">
            Average concession
          </p>
          <p className="mt-1 text-base sm:text-lg font-semibold text-black">
            ~14.8% <span className="text-xs font-normal text-black/45">per order</span>
          </p>
          <div className="mt-2 h-0.5 w-11 bg-[#55c5f7]" />
        </div>
      </div>

      {/* ==================================================================== */}
      {/* 3. MAIN TABLE & CONTROLS CONTAINER                                   */}
      {/* ==================================================================== */}
      <section className="overflow-hidden rounded-xl border border-black/10 bg-white shadow-sm">
        {/* Toolbar Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-black/10 px-4 py-3">
          {/* Status Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto">
            {(["All", "Active", "Scheduled", "Expired"] as const).map((tab) => {
              const count =
                tab === "All"
                  ? discounts.length
                  : discounts.filter((d) => d.status === tab).length;

              return (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setStatusFilter(tab)}
                  className={`px-2.5 py-1 rounded-md text-xs transition cursor-pointer ${
                    statusFilter === tab
                      ? "bg-black/[0.08] text-black font-semibold"
                      : "text-black/60 hover:text-black hover:bg-black/[0.03]"
                  }`}
                >
                  <span>{tab}</span>
                  <span className="ml-1.5 text-[11px] text-black/45 font-medium">{count}</span>
                </button>
              );
            })}
          </div>

          {/* Search, Filter & View Mode */}
          <div className="flex items-center gap-2 flex-1 sm:flex-initial justify-end">
            <div className="relative min-w-[180px] sm:min-w-[240px]">
              <Search className="size-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-black/40" />
              <input
                type="text"
                placeholder="Search discounts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1 text-xs rounded-lg border border-black/10 bg-[#fafafa] outline-none focus:border-black placeholder:text-black/40"
              />
            </div>

            <select
              value={methodFilter}
              onChange={(e) => setMethodFilter(e.target.value as any)}
              className="h-7 px-2 text-xs rounded-lg border border-black/10 bg-white text-black/70 outline-none"
            >
              <option value="All">All methods</option>
              <option value="Code">Code</option>
              <option value="Automatic">Automatic</option>
            </select>

            <div className="flex items-center gap-0.5 p-0.5 rounded-lg bg-black/[0.05] text-xs">
              <button
                type="button"
                onClick={() => setViewMode("table")}
                className={`p-1.5 rounded-md transition ${viewMode === "table" ? "bg-white text-black shadow-2xs" : "text-black/50 hover:text-black"}`}
                title="Table view"
              >
                <List className="size-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode("cards")}
                className={`p-1.5 rounded-md transition ${viewMode === "cards" ? "bg-white text-black shadow-2xs" : "text-black/50 hover:text-black"}`}
                title="Cards view"
              >
                <LayoutGrid className="size-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* View 1: Table View */}
        {viewMode === "table" ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] border-collapse text-left text-xs">
              <thead className="bg-black/[0.025] text-black/65">
                <tr>
                  <th className="border-b border-black/10 px-3 py-2.5 font-medium">
                    <input type="checkbox" aria-label="Select all discounts" />
                  </th>
                  <th className="border-b border-black/10 px-3 py-2.5 font-medium">Title</th>
                  <th className="border-b border-black/10 px-3 py-2.5 font-medium">Status</th>
                  <th className="border-b border-black/10 px-3 py-2.5 font-medium">Method</th>
                  <th className="border-b border-black/10 px-3 py-2.5 font-medium">Eligibility</th>
                  <th className="border-b border-black/10 px-3 py-2.5 font-medium">Type</th>
                  <th className="border-b border-black/10 px-3 py-2.5 font-medium">Conditions</th>
                  <th className="border-b border-black/10 px-3 py-2.5 text-right font-medium">Used</th>
                  <th className="border-b border-black/10 px-3 py-2.5 text-center font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5">
                {filteredDiscounts.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="px-4 py-12 text-center text-black/50">
                      No discounts found matching &quot;{searchQuery}&quot;.
                    </td>
                  </tr>
                ) : (
                  filteredDiscounts.map((disc) => (
                    <tr key={disc.id} className="hover:bg-black/[0.02] transition">
                      <td className="border-b border-black/10 px-3 py-3">
                        <input type="checkbox" aria-label={`Select ${disc.title}`} />
                      </td>

                      <td className="border-b border-black/10 px-3 py-3">
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-black">{disc.title}</span>
                            <button
                              type="button"
                              onClick={() => handleCopyCode(disc.title)}
                              className="text-black/40 hover:text-black transition"
                              title="Copy code"
                            >
                              {copiedCode === disc.title ? (
                                <Check className="size-3 text-emerald-600" />
                              ) : (
                                <Copy className="size-3" />
                              )}
                            </button>
                          </div>
                          <p className="text-[11px] text-black/60 max-w-sm line-clamp-1">{disc.subtitle}</p>
                        </div>
                      </td>

                      <td className="border-b border-black/10 px-3 py-3">
                        <button
                          type="button"
                          onClick={() => handleToggleStatus(disc.id)}
                          className="cursor-pointer"
                          title="Click to toggle status"
                        >
                          {disc.status === "Active" ? (
                            <span className="rounded-full bg-emerald-200 px-2 py-0.5 text-[11px] font-medium text-emerald-900">
                              Active
                            </span>
                          ) : disc.status === "Scheduled" ? (
                            <span className="rounded-md bg-amber-200 px-2 py-0.5 text-[11px] font-medium text-amber-900">
                              Scheduled
                            </span>
                          ) : (
                            <span className="rounded-md bg-black/10 px-2 py-0.5 text-[11px] font-medium text-black">
                              Expired
                            </span>
                          )}
                        </button>
                      </td>

                      <td className="border-b border-black/10 px-3 py-3 text-black/75">
                        {disc.method}
                      </td>

                      <td className="border-b border-black/10 px-3 py-3">
                        <span className="inline-flex items-center gap-1.5 text-black/75">
                          <UsersRound className="size-3.5 text-black/50" />
                          {disc.eligibility}
                        </span>
                      </td>

                      <td className="border-b border-black/10 px-3 py-3">
                        <span className="inline-flex items-center gap-1.5 text-black/75">
                          <Tag className="size-3.5 text-black/50" />
                          {disc.type}
                        </span>
                      </td>

                      <td className="border-b border-black/10 px-3 py-3 text-black/65 text-[11px]">
                        {(disc as any).minSpend ? (
                          <span>Min: {formatINR((disc as any).minSpend)}</span>
                        ) : (
                          <span>No min</span>
                        )}
                        <span className="block text-[10px] text-black/45">
                          {(disc as any).expiryDate ? `Exp: ${(disc as any).expiryDate}` : "Ongoing"}
                        </span>
                      </td>

                      <td className="border-b border-black/10 px-3 py-3 text-right font-medium text-black">
                        {disc.used || 0}
                      </td>

                      <td className="border-b border-black/10 px-3 py-3 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(disc)}
                            className="p-1.5 rounded text-black/50 hover:text-black hover:bg-black/5 transition"
                            title="Edit"
                          >
                            <Pencil className="size-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDuplicateDiscount(disc)}
                            className="p-1.5 rounded text-black/50 hover:text-black hover:bg-black/5 transition"
                            title="Duplicate"
                          >
                            <Copy className="size-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteDiscount(disc.id, disc.title)}
                            className="p-1.5 rounded text-red-500 hover:text-red-700 hover:bg-red-50 transition"
                            title="Delete"
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
        ) : (
          /* View 2: Cards View */
          <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {filteredDiscounts.map((disc) => (
              <div
                key={disc.id}
                className="rounded-xl border border-black/10 bg-white p-4 shadow-2xs hover:shadow-sm transition flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className={`text-[11px] font-medium px-2 py-0.5 ${
                        disc.status === "Active"
                          ? "rounded-full bg-emerald-200 text-emerald-900"
                          : disc.status === "Scheduled"
                          ? "rounded-md bg-amber-200 text-amber-900"
                          : "rounded-md bg-black/10 text-black"
                      }`}
                    >
                      {disc.status}
                    </span>
                    <span className="text-[11px] text-black/50">{disc.method}</span>
                  </div>

                  <div className="flex items-center justify-between gap-2 p-2 rounded-lg bg-black/[0.03] border border-black/10">
                    <span className="font-semibold text-black text-xs truncate">{disc.title}</span>
                    <button
                      type="button"
                      onClick={() => handleCopyCode(disc.title)}
                      className="text-xs text-black/60 hover:text-black font-medium inline-flex items-center gap-1"
                    >
                      {copiedCode === disc.title ? <Check className="size-3 text-emerald-600" /> : <Copy className="size-3" />}
                    </button>
                  </div>

                  <p className="mt-2 text-xs text-black/70 line-clamp-2">{disc.subtitle}</p>
                </div>

                <div className="pt-2 border-t border-black/10 flex items-center justify-between text-xs text-black/60">
                  <span>{disc.used || 0} used</span>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(disc)}
                      className="p-1 rounded text-black/50 hover:text-black"
                    >
                      <Pencil className="size-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteDiscount(disc.id, disc.title)}
                      className="p-1 rounded text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ==================================================================== */}
      {/* 4. CREATE / EDIT DISCOUNT DIALOG                                     */}
      {/* ==================================================================== */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 backdrop-blur-2xs p-4">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl overflow-hidden border border-black/10 flex flex-col max-h-[90vh]">
            <div className="px-5 py-4 border-b border-black/10 flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-black text-sm">
                  {editingDiscountId ? "Edit discount" : "Create discount"}
                </h3>
                <p className="text-xs text-black/50 mt-0.5">
                  Configure discount code, rules, and customer eligibility.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="rounded-md p-1 text-black/45 hover:text-black hover:bg-black/5"
              >
                <X className="size-4" />
              </button>
            </div>

            <form onSubmit={handleSubmitForm} className="p-5 space-y-3.5 text-xs overflow-y-auto flex-1">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-medium text-black">Discount code</label>
                  <button
                    type="button"
                    onClick={handleGenerateRandomCode}
                    className="text-[11px] font-medium text-black/65 hover:text-black underline"
                  >
                    Generate random code
                  </button>
                </div>
                <input
                  type="text"
                  required
                  placeholder="e.g. SUMMER10"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  className="w-full px-3 py-2 rounded-lg border border-black/15 outline-none font-semibold text-xs focus:border-black uppercase bg-[#fafafa]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-black mb-1">Discount type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-black/15 outline-none bg-white focus:border-black text-xs"
                  >
                    <option value="Amount off products">Amount off products</option>
                    <option value="Buy X get Y">Buy X get Y</option>
                    <option value="Amount off order">Amount off order</option>
                    <option value="Free shipping">Free shipping</option>
                  </select>
                </div>
                <div>
                  <label className="block font-medium text-black mb-1">Discount value</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 10% or ₹300"
                    value={formData.discountValue}
                    onChange={(e) => setFormData({ ...formData, discountValue: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-black/15 outline-none focus:border-black text-xs bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-black mb-1">Description</label>
                <input
                  type="text"
                  placeholder="e.g. 10% off all incense boxes"
                  value={formData.subtitle}
                  onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-black/15 outline-none focus:border-black text-xs bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-black mb-1">Method</label>
                  <select
                    value={formData.method}
                    onChange={(e) => setFormData({ ...formData, method: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-lg border border-black/15 outline-none bg-white focus:border-black text-xs"
                  >
                    <option value="Code">Code</option>
                    <option value="Automatic">Automatic</option>
                  </select>
                </div>
                <div>
                  <label className="block font-medium text-black mb-1">Eligibility</label>
                  <select
                    value={formData.eligibility}
                    onChange={(e) => setFormData({ ...formData, eligibility: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-lg border border-black/15 outline-none bg-white focus:border-black text-xs"
                  >
                    <option value="All customers">All customers</option>
                    <option value="First-time patrons">First-time customers</option>
                    <option value="VIP Tier">VIP Tier</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-black mb-1">Minimum spend (₹)</label>
                  <input
                    type="number"
                    min={0}
                    placeholder="0"
                    value={formData.minSpend}
                    onChange={(e) => setFormData({ ...formData, minSpend: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-lg border border-black/15 outline-none focus:border-black text-xs bg-white"
                  />
                </div>
                <div>
                  <label className="block font-medium text-black mb-1">Expiry date</label>
                  <input
                    type="text"
                    placeholder="Dec 31, 2026 or Ongoing"
                    value={formData.expiryDate}
                    onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-black/15 outline-none focus:border-black text-xs bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-black mb-1">Status</label>
                <div className="flex items-center gap-4">
                  {(["Active", "Scheduled", "Expired"] as const).map((st) => (
                    <label key={st} className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="radio"
                        name="status"
                        checked={formData.status === st}
                        onChange={() => setFormData({ ...formData, status: st })}
                        className="accent-black"
                      />
                      <span className="text-xs text-black/80">{st}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-black/10 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="h-8 px-3 rounded-lg border border-black/15 text-xs font-medium hover:bg-black/5"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="h-8 px-4 rounded-lg bg-black text-white text-xs font-medium hover:bg-black/80 transition"
                >
                  {editingDiscountId ? "Save changes" : "Create discount"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
