"use client";

import React, { useState, useEffect, useMemo, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams, useParams } from "next/navigation";
import {
  ArrowLeft,
  Tag,
  Calendar,
  Save,
  CheckCircle2,
  Ticket,
  ChevronDown,
  Layers,
  DollarSign,
  Percent,
  Clock,
  ShieldCheck,
  UsersRound,
  Trash2,
  Search,
  Check,
  X,
  AlertCircle,
  Copy,
  Sparkles,
  ExternalLink,
  HelpCircle,
  Boxes,
  Loader2,
  Menu,
} from "lucide-react";
import { PRODUCTS, ProductSKU } from "@/lib/products";
import { CURATED_MASTER_DISCOUNTS } from "@/components/admin/AdminDiscountsSection";
import { AdminDiscount } from "@/app/admin/page";
import AdminSidebar from "@/components/admin/AdminSidebar";

const RANDOM_PROMO_PRESETS = [
  "ROYAL25",
  "SACRED15",
  "KURMA20",
  "VEDIC10",
  "FESTIVE2026",
  "TEMPLE30",
  "MYSORE500",
  "ATELIERVIP",
  "SOVEREIGN50",
  "DIWALI2026",
];

function formatINR(val: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(val || 0);
}

function EditDiscountPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const routeParams = useParams();
  const pathId = typeof routeParams?.id === "string" ? routeParams.id : Array.isArray(routeParams?.id) ? routeParams.id[0] : "";
  const discountId = searchParams.get("id") || pathId || "";

  // Loading & State
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Form Fields
  const [id, setId] = useState("");
  const [code, setCode] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState<string>("Amount off order");
  const [discountValue, setDiscountValue] = useState("15%");
  const [method, setMethod] = useState<"Code" | "Automatic">("Code");
  const [eligibility, setEligibility] = useState<
    "All customers" | "Specific patrons" | "VIP Tier" | "First-time patrons" | string
  >("All customers");
  const [hasMinSpend, setHasMinSpend] = useState(true);
  const [minSpend, setMinSpend] = useState<number | "">(2500);
  const [startDate, setStartDate] = useState("Aug 01, 2026");
  const [hasExpiry, setHasExpiry] = useState(true);
  const [expiryDate, setExpiryDate] = useState("Dec 31, 2026");
  const [status, setStatus] = useState<"Active" | "Scheduled" | "Expired">("Active");
  const [hasMaxUses, setHasMaxUses] = useState(false);
  const [maxUses, setMaxUses] = useState<number | "">("");
  const [usedCount, setUsedCount] = useState<number>(0);

  // Applicable Products Selection
  const [appliesTo, setAppliesTo] = useState<"all" | "specific">("all");
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
  const [productSearchQuery, setProductSearchQuery] = useState("");

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Load existing discount details on page mount
  useEffect(() => {
    let isMounted = true;

    async function loadDiscountDetails() {
      if (!discountId) {
        if (isMounted) setLoading(false);
        return;
      }

      setLoading(true);
      setErrorMessage(null);

      let foundDisc: any = null;

      // 1. Try fetching from Backend Neon DB API
      try {
        const res = await fetch(`/api/admin/discounts?id=${encodeURIComponent(discountId)}`, {
          credentials: "include",
          cache: "no-store",
        });

        if (res.ok) {
          const data = await res.json();
          if (data.success && data.discount) {
            foundDisc = data.discount;
          }
        }
      } catch (err) {
        console.warn("Could not fetch discount from API, trying local cache:", err);
      }

      // 2. Try fetching from localStorage if API didn't return
      if (!foundDisc && typeof window !== "undefined") {
        try {
          const stored = localStorage.getItem("kurma_admin_discounts");
          if (stored) {
            const parsed = JSON.parse(stored);
            if (Array.isArray(parsed)) {
              foundDisc = parsed.find(
                (d: any) =>
                  d.id?.toLowerCase() === discountId.toLowerCase() ||
                  d.title?.toUpperCase() === discountId.toUpperCase()
              );
            }
          }
        } catch { }
      }

      // 3. Try finding in Curated Master Discounts fallback
      if (!foundDisc) {
        foundDisc = CURATED_MASTER_DISCOUNTS.find(
          (d) =>
            d.id.toLowerCase() === discountId.toLowerCase() ||
            d.title.toUpperCase() === discountId.toUpperCase()
        );
      }

      if (isMounted) {
        if (foundDisc) {
          setId(foundDisc.id);
          setCode(foundDisc.title || "");
          setDescription(foundDisc.subtitle || "");
          setType(foundDisc.type || "Amount off order");
          setDiscountValue(foundDisc.discountValue || "15%");
          setMethod(foundDisc.method === "Automatic" ? "Automatic" : "Code");
          setEligibility(foundDisc.eligibility || "All customers");

          const discMinSpend = foundDisc.minSpend;
          if (discMinSpend !== null && discMinSpend !== undefined && discMinSpend > 0) {
            setHasMinSpend(true);
            setMinSpend(Number(discMinSpend));
          } else {
            setHasMinSpend(false);
            setMinSpend("");
          }

          setStartDate(foundDisc.startDate || "Aug 01, 2026");

          const discExpiry = foundDisc.expiryDate;
          if (discExpiry && discExpiry !== "Ongoing" && discExpiry !== "Never") {
            setHasExpiry(true);
            setExpiryDate(discExpiry);
          } else {
            setHasExpiry(false);
            setExpiryDate("Ongoing");
          }

          setStatus(foundDisc.status || "Active");

          if (foundDisc.maxUses && Number(foundDisc.maxUses) > 0) {
            setHasMaxUses(true);
            setMaxUses(Number(foundDisc.maxUses));
          } else {
            setHasMaxUses(false);
            setMaxUses("");
          }

          setUsedCount(Number(foundDisc.used) || 0);

          if (Array.isArray(foundDisc.productIds) && foundDisc.productIds.length > 0) {
            setAppliesTo("specific");
            setSelectedProductIds(foundDisc.productIds);
          } else {
            setAppliesTo("all");
            setSelectedProductIds([]);
          }
        } else {
          setErrorMessage(`Discount voucher "${discountId}" was not found.`);
        }
        setLoading(false);
      }
    }

    loadDiscountDetails();

    return () => {
      isMounted = false;
    };
  }, [discountId]);

  // Generate random promo code action
  const handleGenerateRandomCode = () => {
    const randomIndex = Math.floor(Math.random() * RANDOM_PROMO_PRESETS.length);
    const chosen = RANDOM_PROMO_PRESETS[randomIndex];
    setCode(chosen);
    triggerToast(`Applied random promo code: ${chosen}`);
  };

  // Toggle active/inactive state quickly
  const handleToggleActiveSwitch = () => {
    if (status === "Active") {
      setStatus("Expired");
      triggerToast("Discount disabled (marked Expired)");
    } else {
      setStatus("Active");
      triggerToast("Discount enabled (marked Active)");
    }
  };

  // Toggle specific product selection
  const handleToggleProduct = (prodId: string) => {
    setSelectedProductIds((prev) =>
      prev.includes(prodId) ? prev.filter((id) => id !== prodId) : [...prev, prodId]
    );
  };

  // Filtered product catalog for selection
  const filteredProducts = useMemo(() => {
    if (!productSearchQuery.trim()) return PRODUCTS;
    const q = productSearchQuery.toLowerCase();
    return PRODUCTS.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.id.toLowerCase().includes(q)
    );
  }, [productSearchQuery]);

  // Copy code to clipboard
  const handleCopyCode = () => {
    if (!code) return;
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    triggerToast(`Copied code "${code}" to clipboard`);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  // Save changes handler
  const handleSaveChanges = async (e: React.FormEvent) => {
    e.preventDefault();

    const cleanCode = code.trim().toUpperCase();
    if (!cleanCode) {
      setErrorMessage("Discount code cannot be empty.");
      triggerToast("Please enter a valid discount code.");
      return;
    }

    const cleanVal = discountValue.trim();
    if (!cleanVal) {
      setErrorMessage("Discount value cannot be empty.");
      triggerToast("Please enter a discount value.");
      return;
    }

    setIsSaving(true);
    setErrorMessage(null);

    const targetId = id || discountId || `disc-${cleanCode.toLowerCase()}-${Date.now()}`;
    const cleanSubtitle =
      description.trim() ||
      `${cleanVal} concession • ${hasMinSpend && minSpend ? `Min spend ₹${Number(minSpend).toLocaleString("en-IN")}` : "No minimum spend"}`;

    const updatedDiscountData: AdminDiscount & { startDate?: string; maxUses?: number | null } = {
      id: targetId,
      title: cleanCode,
      subtitle: cleanSubtitle,
      status,
      method,
      eligibility,
      type,
      used: usedCount,
      discountValue: cleanVal,
      minSpend: hasMinSpend && minSpend ? Number(minSpend) : undefined,
      startDate: startDate.trim() || undefined,
      expiryDate: hasExpiry && expiryDate.trim() ? expiryDate.trim() : "Ongoing",
      maxUses: hasMaxUses && maxUses ? Number(maxUses) : undefined,
      productIds: appliesTo === "specific" ? selectedProductIds : [],
    };

    // 1. Immediately update localStorage for real-time frontend responsiveness
    try {
      const stored = localStorage.getItem("kurma_admin_discounts");
      let existingDiscounts: any[] = [];
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) existingDiscounts = parsed;
      }

      const matchIndex = existingDiscounts.findIndex(
        (d: any) =>
          d.id?.toLowerCase() === targetId.toLowerCase() ||
          d.title?.toUpperCase() === cleanCode.toUpperCase()
      );

      let updatedList: any[];
      if (matchIndex >= 0) {
        updatedList = [...existingDiscounts];
        updatedList[matchIndex] = { ...existingDiscounts[matchIndex], ...updatedDiscountData };
      } else {
        updatedList = [updatedDiscountData, ...existingDiscounts];
      }

      localStorage.setItem("kurma_admin_discounts", JSON.stringify(updatedList));

      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("kurma_discounts_updated"));
      }
    } catch (storageErr) {
      console.warn("Storage sync warning:", storageErr);
    }

    // 2. Persist to Neon PostgreSQL Database via Backend API
    let savedToDatabase = false;
    try {
      const res = await fetch("/api/admin/discounts", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(updatedDiscountData),
      });

      if (res.ok) {
        const resData = await res.json();
        if (resData.success) {
          savedToDatabase = true;
        }
      }
    } catch (apiErr) {
      console.warn("Could not reach backend API, changes saved to local cache:", apiErr);
    }

    triggerToast(
      savedToDatabase
        ? `Discount code "${cleanCode}" saved to database successfully!`
        : `Discount code "${cleanCode}" updated successfully!`
    );

    setTimeout(() => {
      setIsSaving(false);
      router.push("/admin?route=discounts");
    }, 700);
  };

  // Delete discount handler
  const handleDeleteDiscount = async () => {
    const targetId = id || discountId;
    if (!targetId) return;

    if (!confirm(`Are you sure you want to permanently delete discount "${code}"?`)) {
      return;
    }

    setIsDeleting(true);

    // 1. Remove from localStorage
    try {
      const stored = localStorage.getItem("kurma_admin_discounts");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          const filtered = parsed.filter(
            (d: any) =>
              d.id?.toLowerCase() !== targetId.toLowerCase() &&
              d.title?.toUpperCase() !== code.toUpperCase()
          );
          localStorage.setItem("kurma_admin_discounts", JSON.stringify(filtered));
          if (typeof window !== "undefined") {
            window.dispatchEvent(new Event("kurma_discounts_updated"));
          }
        }
      }
    } catch { }

    // 2. Remove from backend database
    try {
      await fetch(`/api/admin/discounts?id=${encodeURIComponent(targetId)}`, {
        method: "DELETE",
        credentials: "include",
      });
    } catch (apiErr) {
      console.warn("Could not reach backend API to delete discount", apiErr);
    }

    triggerToast(`Discount "${code}" deleted.`);

    setTimeout(() => {
      setIsDeleting(false);
      router.push("/admin?route=discounts");
    }, 600);
  };

  // ==========================================================================
  // RENDER: LOADING STATE
  // ==========================================================================
  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Loader2 className="size-8 animate-spin text-[#28513B]" />
      </div>
    );
  }

  // ==========================================================================
  // RENDER: NOT FOUND ERROR
  // ==========================================================================
  if (errorMessage && !code) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] text-stone-900 flex flex-col items-center justify-center p-6 text-center">
        <div className="max-w-md bg-white rounded-2xl border border-black/10 p-8 shadow-sm space-y-4">
          <div className="size-12 rounded-full bg-red-50 text-red-600 flex items-center justify-center mx-auto">
            <AlertCircle className="size-6" />
          </div>
          <h2 className="font-serif text-xl font-bold text-[#072515]">
            Discount Not Found
          </h2>
          <p className="text-xs text-stone-600 leading-relaxed">
            {errorMessage}
          </p>
          <div className="pt-2">
            <Link
              href="/admin?route=discounts"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#28513B] text-white hover:bg-[#1e3e2d] text-xs font-semibold transition shadow-xs"
            >
              <ArrowLeft className="size-4" /> Return to Discounts
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-stone-900 flex flex-col lg:flex-row antialiased selection:bg-[#eed08e] selection:text-[#072515] font-sans">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#28513B] text-white px-4 py-3 rounded-xl shadow-2xl border border-white/20 flex items-center gap-2.5 text-xs font-semibold animate-in slide-in-from-bottom-5">
          <CheckCircle2 className="size-4 text-white shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Admin Dashboard Sidebar Navigation */}
      <AdminSidebar
        currentRoute="discounts"
        mobileOpen={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* ==================================================================== */}
        {/* MAIN CONTAINER: 2-COLUMN RESPONSIVE LAYOUT                           */}
        {/* ==================================================================== */}
        <main className="max-w-7xl mx-auto px-4 sm:px-8 pt-6 sm:pt-8 w-full pb-24">
          {/* Page Title & Mobile Sidebar Toggle */}
          <div className="flex items-center justify-between pb-5 mb-6 border-b border-black/10">
            <div>
              <h1 className="font-serif text-2xl font-bold text-[#072515]">
                Edit discount
              </h1>
              <p className="text-xs text-stone-500 mt-1">
                Configure discount code, rules, and customer eligibility.
              </p>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => setMobileSidebarOpen(true)}
                className="lg:hidden p-2 rounded-xl border border-black/15 bg-white text-black/75 hover:text-black hover:bg-black/5 transition"
                aria-label="Open Sidebar Menu"
              >
                <Menu className="size-4" />
              </button>
            </div>
          </div>

          <form onSubmit={handleSaveChanges}>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* ============================================================= */}
              {/* LEFT COLUMN: EDIT FORM FIELDS (7 COLUMNS)                     */}
            {/* ============================================================= */}
            <div className="lg:col-span-7 space-y-6">
              {/* CARD 1: DISCOUNT CODE & DESCRIPTION */}
              <section className="bg-white rounded-2xl border border-black/10 shadow-xs p-6 space-y-5">
                <div className="flex items-center justify-between border-b border-black/10 pb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="size-8 rounded-lg bg-[#28513B]/10 text-[#28513B] flex items-center justify-center">
                      <Ticket className="size-4" />
                    </div>
                    <div>
                      <h2 className="font-serif text-base font-bold text-[#072515]">
                        Discount Code & Description
                      </h2>
                    </div>
                  </div>
                </div>

                {/* Discount Code Input */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-semibold text-black/80">
                      Discount Code <span className="text-red-500">*</span>
                    </label>
                    <span className="text-[10px] text-stone-400 font-mono">
                      UPPERCASE ALPHANUMERIC
                    </span>
                  </div>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={code}
                      onChange={(e) =>
                        setCode(e.target.value.toUpperCase().replace(/[^A-Z0-9_-]/g, ""))
                      }
                      placeholder="e.g. ROYALSHIP"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-black/15 focus:border-[#28513B] focus:ring-2 focus:ring-[#28513B]/20 text-sm outline-none bg-[#FAF8F5]/50 focus:bg-white text-black font-mono font-bold tracking-wider transition uppercase pr-10"
                    />
                    <button
                      type="button"
                      onClick={handleCopyCode}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700"
                      title="Copy code"
                    >
                      {copiedCode ? (
                        <Check className="size-4 text-emerald-600" />
                      ) : (
                        <Copy className="size-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Description / Subtitle */}
                <div>
                  <label className="block text-xs font-semibold text-black/80 mb-1.5">
                    Description & Subtitle
                  </label>
                  <input
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="e.g. Complimentary pan-India insured express delivery (₹250 concession)"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-black/15 focus:border-[#28513B] focus:ring-2 focus:ring-[#28513B]/20 text-xs sm:text-sm outline-none bg-[#FAF8F5]/50 focus:bg-white text-black transition"
                  />
                  <p className="text-[11px] text-stone-500 mt-1">
                    Displayed to patrons in checkout breakdown and invoice summaries.
                  </p>
                </div>

                {/* Method & Eligibility Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                  <div>
                    <label className="block text-xs font-semibold text-black/80 mb-1.5">
                      Application Method
                    </label>
                    <div className="relative">
                      <select
                        value={method}
                        onChange={(e) => setMethod(e.target.value as "Code" | "Automatic")}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-black/15 focus:border-[#28513B] focus:ring-2 focus:ring-[#28513B]/20 text-xs sm:text-sm outline-none bg-[#FAF8F5]/50 focus:bg-white text-black transition appearance-none cursor-pointer pr-9"
                      >
                        <option value="Code">Code (Patron enters code)</option>
                        <option value="Automatic">Automatic (Applied at checkout)</option>
                      </select>
                      <ChevronDown className="size-4 text-black/40 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-black/80 mb-1.5">
                      Customer Eligibility
                    </label>
                    <div className="relative">
                      <select
                        value={eligibility}
                        onChange={(e) => setEligibility(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-black/15 focus:border-[#28513B] focus:ring-2 focus:ring-[#28513B]/20 text-xs sm:text-sm outline-none bg-[#FAF8F5]/50 focus:bg-white text-black transition appearance-none cursor-pointer pr-9"
                      >
                        <option value="All customers">All customers</option>
                        <option value="Specific patrons">Specific patrons</option>
                        <option value="VIP Tier">VIP Tier</option>
                        <option value="First-time patrons">First-time patrons</option>
                      </select>
                      <ChevronDown className="size-4 text-black/40 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>
                </div>
              </section>

              {/* CARD 2: VALUE, TYPE & ACTIVE STATUS */}
              <section className="bg-white rounded-2xl border border-black/10 shadow-xs p-6 space-y-5">
                <div className="flex items-center justify-between border-b border-black/10 pb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="size-8 rounded-lg bg-[#28513B]/10 text-[#28513B] flex items-center justify-center">
                      <Percent className="size-4" />
                    </div>
                    <div>
                      <h2 className="font-serif text-base font-bold text-[#072515]">
                        Discount Type & Concession Value
                      </h2>
                      <p className="text-[11px] text-stone-500">
                        Specify how the calculation affects the cart order total.
                      </p>
                    </div>
                  </div>

                  {/* Enable / Disable Quick Switch */}
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-stone-700">
                      {status === "Active" ? "Active" : "Disabled"}
                    </span>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={status === "Active"}
                      onClick={handleToggleActiveSwitch}
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${status === "Active" ? "bg-[#28513B]" : "bg-stone-300"
                        }`}
                    >
                      <span
                        className={`pointer-events-none inline-block size-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${status === "Active" ? "translate-x-5" : "translate-x-0"
                          }`}
                      />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Discount Type */}
                  <div>
                    <label className="block text-xs font-semibold text-black/80 mb-1.5">
                      Discount Type
                    </label>
                    <div className="relative">
                      <select
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-black/15 focus:border-[#28513B] focus:ring-2 focus:ring-[#28513B]/20 text-xs sm:text-sm outline-none bg-[#FAF8F5]/50 focus:bg-white text-black transition appearance-none cursor-pointer pr-9"
                      >
                        <option value="Amount off order">Amount off order (₹ or %)</option>
                        <option value="Percentage off order">Percentage off order (%)</option>
                        <option value="Fixed Amount Concession">Fixed Amount Concession (₹)</option>
                        <option value="Amount off product">Amount off specific products</option>
                        <option value="Free shipping">Free shipping</option>
                        <option value="Buy X get Y">Buy X get Y</option>
                      </select>
                      <ChevronDown className="size-4 text-black/40 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>

                  {/* Discount Value */}
                  <div>
                    <label className="block text-xs font-semibold text-black/80 mb-1.5">
                      Discount Value <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={discountValue}
                      onChange={(e) => setDiscountValue(e.target.value)}
                      placeholder="e.g. 15% or ₹250"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-black/15 focus:border-[#28513B] focus:ring-2 focus:ring-[#28513B]/20 text-sm outline-none bg-[#FAF8F5]/50 focus:bg-white text-black font-semibold transition"
                    />
                  </div>
                </div>

                {/* Quick Presets for Discount Value */}
                <div>
                  <span className="block text-[11px] text-stone-500 mb-1.5">
                    Quick value presets:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {["10%", "15%", "20%", "25%", "₹250", "₹500", "₹1,000"].map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => setDiscountValue(preset)}
                        className={`px-2.5 py-1 text-xs rounded-lg border transition cursor-pointer font-medium ${discountValue === preset
                          ? "bg-[#28513B] text-white border-[#28513B]"
                          : "bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100"
                          }`}
                      >
                        {preset}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Detailed Status Selector */}
                <div className="pt-2 border-t border-black/10">
                  <label className="block text-xs font-semibold text-black/80 mb-2">
                    Status State
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {(["Active", "Scheduled", "Expired"] as const).map((s) => (
                      <label
                        key={s}
                        className={`flex items-center gap-2.5 p-3 rounded-xl border cursor-pointer transition ${status === s
                          ? "bg-[#28513B]/5 border-[#28513B] text-[#072515] font-semibold"
                          : "border-black/10 hover:bg-black/[0.02] text-black/70"
                          }`}
                      >
                        <input
                          type="radio"
                          name="statusRadio"
                          value={s}
                          checked={status === s}
                          onChange={() => setStatus(s)}
                          className="size-4 text-[#28513B] focus:ring-[#28513B] accent-[#28513B]"
                        />
                        <div className="text-xs">
                          <span className="block">{s}</span>
                          <span className="text-[10px] text-stone-500">
                            {s === "Active"
                              ? "Live for checkout"
                              : s === "Scheduled"
                                ? "Begins on start date"
                                : "Temporarily disabled"}
                          </span>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              </section>

              {/* CARD 3: MINIMUM SPEND & USAGE LIMITS */}
              <section className="bg-white rounded-2xl border border-black/10 shadow-xs p-6 space-y-5">
                <div className="flex items-center gap-2.5 border-b border-black/10 pb-3">
                  <div className="size-8 rounded-lg bg-[#28513B]/10 text-[#28513B] flex items-center justify-center">
                    <DollarSign className="size-4" />
                  </div>
                  <div>
                    <h2 className="font-serif text-base font-bold text-[#072515]">
                      Purchase Requirements & Usage Limits
                    </h2>
                    <p className="text-[11px] text-stone-500">
                      Prevent coupon abuse by specifying threshold constraints.
                    </p>
                  </div>
                </div>

                {/* Minimum Spend Section */}
                <div className="space-y-3">
                  <label className="block text-xs font-semibold text-black/80">
                    Minimum Purchase Requirement
                  </label>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <label className="flex items-center gap-2.5 text-xs text-black/80 cursor-pointer">
                      <input
                        type="radio"
                        name="minSpendOption"
                        checked={!hasMinSpend}
                        onChange={() => setHasMinSpend(false)}
                        className="size-4 text-[#28513B] focus:ring-[#28513B] accent-[#28513B]"
                      />
                      <span>No minimum spend</span>
                    </label>

                    <label className="flex items-center gap-2.5 text-xs text-black/80 cursor-pointer">
                      <input
                        type="radio"
                        name="minSpendOption"
                        checked={hasMinSpend}
                        onChange={() => setHasMinSpend(true)}
                        className="size-4 text-[#28513B] focus:ring-[#28513B] accent-[#28513B]"
                      />
                      <span>Minimum purchase amount (₹)</span>
                    </label>
                  </div>

                  {hasMinSpend && (
                    <div className="pt-1">
                      <div className="relative max-w-xs">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-500 font-semibold text-xs">
                          ₹
                        </span>
                        <input
                          type="number"
                          min={0}
                          value={minSpend}
                          onChange={(e) =>
                            setMinSpend(e.target.value === "" ? "" : Number(e.target.value))
                          }
                          placeholder="2500"
                          className="w-full pl-8 pr-3.5 py-2.5 rounded-xl border border-black/15 focus:border-[#28513B] focus:ring-2 focus:ring-[#28513B]/20 text-xs sm:text-sm outline-none bg-[#FAF8F5]/50 focus:bg-white text-black font-semibold"
                        />
                      </div>
                      <p className="text-[11px] text-stone-500 mt-1">
                        Only applies if patron cart subtotal reaches {formatINR(Number(minSpend) || 0)}.
                      </p>
                    </div>
                  )}
                </div>

                {/* Usage Limits Section */}
                <div className="pt-3 border-t border-black/10 space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-semibold text-black/80">
                      Usage Limits
                    </label>
                    <span className="text-[11px] text-stone-500">
                      Times redeemed: <strong className="text-stone-900">{usedCount}</strong>
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <label className="flex items-center gap-2.5 text-xs text-black/80 cursor-pointer">
                      <input
                        type="radio"
                        name="usageLimitOption"
                        checked={!hasMaxUses}
                        onChange={() => setHasMaxUses(false)}
                        className="size-4 text-[#28513B] focus:ring-[#28513B] accent-[#28513B]"
                      />
                      <span>Unlimited uses</span>
                    </label>

                    <label className="flex items-center gap-2.5 text-xs text-black/80 cursor-pointer">
                      <input
                        type="radio"
                        name="usageLimitOption"
                        checked={hasMaxUses}
                        onChange={() => setHasMaxUses(true)}
                        className="size-4 text-[#28513B] focus:ring-[#28513B] accent-[#28513B]"
                      />
                      <span>Limit total redemptions</span>
                    </label>
                  </div>

                  {hasMaxUses && (
                    <div className="pt-1 max-w-xs">
                      <input
                        type="number"
                        min={1}
                        value={maxUses}
                        onChange={(e) =>
                          setMaxUses(e.target.value === "" ? "" : Number(e.target.value))
                        }
                        placeholder="e.g. 100"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-black/15 focus:border-[#28513B] focus:ring-2 focus:ring-[#28513B]/20 text-xs sm:text-sm outline-none bg-[#FAF8F5]/50 focus:bg-white text-black font-semibold"
                      />
                      <p className="text-[11px] text-stone-500 mt-1">
                        Disables automatically when total redemptions reach this limit.
                      </p>
                    </div>
                  )}
                </div>
              </section>

              {/* BOTTOM ACTIONS BAR */}
              <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={handleDeleteDiscount}
                  disabled={isDeleting || isSaving}
                  className="px-4 py-2.5 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 text-xs font-semibold transition flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Trash2 className="size-3.5" />
                  <span>Delete Discount</span>
                </button>

                <div className="flex items-center gap-3">
                  <Link
                    href="/admin?route=discounts"
                    className="px-4 py-2.5 rounded-xl border border-stone-300 text-xs font-semibold text-stone-700 hover:bg-stone-50 transition"
                  >
                    Cancel
                  </Link>

                  <button
                    type="submit"
                    disabled={isSaving || isDeleting}
                    className="px-6 py-2.5 rounded-xl bg-[#28513B] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#1e3e2d] transition shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    <Save className="size-3.5 text-white" />
                    <span>{isSaving ? "Saving Changes..." : "Save Changes"}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* ============================================================= */}
            {/* RIGHT COLUMN: LIVE DISCOUNT PREVIEW & SUMMARY (5 COLUMNS)     */}
            {/* ============================================================= */}
            <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-20">
              {/* CARD: LIVE INTERACTIVE PREVIEW TICKET */}
              <section className="bg-white rounded-2xl border border-black/10 shadow-xs p-6 space-y-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="size-8 rounded-lg bg-[#28513B]/10 text-[#28513B] flex items-center justify-center">
                      <Tag className="size-4" />
                    </div>
                    <div>
                      <h3 className="font-serif text-sm font-bold text-[#072515]">
                        Live Discount Preview
                      </h3>
                      <p className="text-[11px] text-stone-500">
                        Visualizing checkout voucher appearance
                      </p>
                    </div>
                  </div>

                  <span className="text-[10px] uppercase font-bold text-stone-400 tracking-wider">
                    Interactive
                  </span>
                </div>

                {/* Luxury Ticket Card Motif */}
                <div className="rounded-2xl border-2 border-dashed border-[#28513B]/30 bg-[#FAF8F5] p-6 text-center space-y-3 relative overflow-hidden shadow-2xs">
                  {/* Subtle Luxury Watermark */}
                  <div className="absolute top-2 right-2 text-[9px] font-mono tracking-widest text-stone-300 uppercase">
                    KURMA ATELIER
                  </div>

                  {/* Status Indicator */}
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white border border-black/5 shadow-2xs">
                    {status === "Active" ? (
                      <span className="flex items-center gap-1.5 text-emerald-800 font-bold">
                        <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                        Active & Redeemable
                      </span>
                    ) : status === "Scheduled" ? (
                      <span className="flex items-center gap-1.5 text-blue-800 font-bold">
                        <span className="size-2 rounded-full bg-blue-500" />
                        Scheduled for Launch
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5 text-stone-600 font-bold">
                        <span className="size-2 rounded-full bg-stone-400" />
                        Inactive / Expired
                      </span>
                    )}
                  </div>

                  {/* Headline Value */}
                  <h4 className="font-serif text-3xl font-bold text-[#072515] tracking-tight">
                    Get {discountValue || "15%"} OFF
                  </h4>

                  {/* Description / Subtitle */}
                  <p className="text-xs text-stone-600 font-medium px-2">
                    {description ||
                      (hasMinSpend && minSpend
                        ? `Valid on sacred temple orders above ${formatINR(Number(minSpend))}`
                        : "No minimum purchase threshold required")}
                  </p>

                  {/* Code Pill */}
                  <div className="pt-1">
                    <span className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-dashed border-[#c89e43] bg-white text-xs font-mono font-bold text-[#072515] tracking-widest shadow-2xs">
                      {method === "Automatic" ? (
                        <span>AUTOMATIC DISCOUNT</span>
                      ) : (
                        <>
                          <span>{code || "DISCOUNT"}</span>
                          <button
                            type="button"
                            onClick={handleCopyCode}
                            className="text-stone-400 hover:text-stone-800 ml-1"
                            title="Copy code"
                          >
                            <Copy className="size-3.5" />
                          </button>
                        </>
                      )}
                    </span>
                  </div>
                </div>

                {/* Configuration Specs Breakdown */}
                <div className="pt-2 border-t border-black/10 space-y-2.5 text-xs">
                  <h4 className="text-[11px] font-bold uppercase tracking-wider text-stone-500">
                    Configuration Parameters
                  </h4>

                  <div className="flex items-center justify-between text-stone-600 py-1 border-b border-black/5">
                    <span className="flex items-center gap-1.5 text-stone-500">
                      <Tag className="size-3.5 text-stone-400" />
                      <span>Discount Type</span>
                    </span>
                    <span className="font-semibold text-stone-900">{type}</span>
                  </div>

                  <div className="flex items-center justify-between text-stone-600 py-1 border-b border-black/5">
                    <span className="flex items-center gap-1.5 text-stone-500">
                      <Percent className="size-3.5 text-stone-400" />
                      <span>Concession Value</span>
                    </span>
                    <span className="font-semibold text-stone-900">{discountValue || "—"}</span>
                  </div>

                  <div className="flex items-center justify-between text-stone-600 py-1 border-b border-black/5">
                    <span className="flex items-center gap-1.5 text-stone-500">
                      <UsersRound className="size-3.5 text-stone-400" />
                      <span>Patron Eligibility</span>
                    </span>
                    <span className="font-semibold text-stone-900">{eligibility}</span>
                  </div>

                  <div className="flex items-center justify-between text-stone-600 py-1 border-b border-black/5">
                    <span className="flex items-center gap-1.5 text-stone-500">
                      <DollarSign className="size-3.5 text-stone-400" />
                      <span>Minimum Spend</span>
                    </span>
                    <span className="font-semibold text-stone-900">
                      {hasMinSpend && minSpend ? formatINR(Number(minSpend)) : "No minimum"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-stone-600 py-1">
                    <span className="flex items-center gap-1.5 text-stone-500">
                      <ShieldCheck className="size-3.5 text-stone-400" />
                      <span>Usage Limits</span>
                    </span>
                    <span className="font-semibold text-stone-900">
                      {hasMaxUses && maxUses ? `Max ${maxUses} redemptions` : "Unlimited"}
                    </span>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </form>
      </main>
      </div>
    </div>
  );
}

export default function EditDiscountPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-white flex items-center justify-center">
          <Loader2 className="size-8 animate-spin text-[#28513B]" />
        </div>
      }
    >
      <EditDiscountPageInner />
    </Suspense>
  );
}
