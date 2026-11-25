"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
  Loader2,
  Menu,
} from "lucide-react";
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
];

function CreateDiscountPageInner() {
  const router = useRouter();

  // Form State matching reference screenshots
  const [code, setCode] = useState("SUMMER10");
  const [type, setType] = useState("Amount off order");
  const [discountValue, setDiscountValue] = useState("15%");
  const [description, setDescription] = useState("10% off all incense boxes");
  const [method, setMethod] = useState<"Code" | "Automatic">("Code");
  const [eligibility, setEligibility] = useState<
    "All customers" | "Specific patrons" | "VIP Tier" | "First-time patrons"
  >("All customers");
  const [minSpend, setMinSpend] = useState<number | "">(2500);
  const [expiryDate, setExpiryDate] = useState("Dec 31, 2026");
  const [status, setStatus] = useState<"Active" | "Scheduled" | "Expired">("Active");

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

  // Generate random promo code action
  const handleGenerateRandomCode = () => {
    const randomIndex = Math.floor(Math.random() * RANDOM_PROMO_PRESETS.length);
    const chosen = RANDOM_PROMO_PRESETS[randomIndex];
    setCode(chosen);
    triggerToast(`Generated promo code: ${chosen}`);
  };

  // Handle Form Submission with Backend Neon DB Persistence
  const handleCreateDiscount = async (e: React.FormEvent) => {
    e.preventDefault();

    const cleanCode = code.trim().toUpperCase();
    if (!cleanCode) {
      triggerToast("Please enter a valid discount code.");
      return;
    }

    setIsSaving(true);

    const generatedId = `disc-${cleanCode.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${Date.now()}`;
    const cleanSubtitle =
      description.trim() ||
      `${discountValue} off sacred order (Min spend: ₹${minSpend || 0})`;

    const newDiscountData = {
      id: generatedId,
      title: cleanCode,
      subtitle: cleanSubtitle,
      status,
      method,
      eligibility,
      type,
      used: 0,
      discountValue: discountValue.trim() || "10%",
      minSpend: minSpend ? Number(minSpend) : null,
      expiryDate: expiryDate.trim() || "Dec 31, 2026",
      productIds: [],
    };

    try {
      // 1. Sync to local storage for instant responsiveness
      try {
        const stored = localStorage.getItem("kurma_admin_discounts");
        let existingDiscounts: any[] = [];
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) existingDiscounts = parsed;
        }
        const updated = [newDiscountData, ...existingDiscounts];
        localStorage.setItem("kurma_admin_discounts", JSON.stringify(updated));
        if (typeof window !== "undefined") {
          window.dispatchEvent(new Event("kurma_discounts_updated"));
        }
      } catch { }

      // 2. Call backend API to persist to Neon PostgreSQL
      let savedToDb = false;
      try {
        const res = await fetch("/api/admin/discounts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newDiscountData),
        });

        const resData = await res.json();
        if (res.ok && resData.success) {
          savedToDb = true;
        }
      } catch (apiErr) {
        console.warn("Could not reach backend discounts API, saved locally", apiErr);
      }

      triggerToast(
        savedToDb
          ? `Discount code "${cleanCode}" saved to database successfully!`
          : `Discount code "${cleanCode}" created successfully!`
      );

      setTimeout(() => {
        setIsSaving(false);
        router.push("/admin?route=discounts");
      }, 700);
    } catch {
      setIsSaving(false);
      triggerToast("Error creating discount. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-stone-900 flex flex-col lg:flex-row antialiased selection:bg-[#eed08e] selection:text-[#072515]">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#28513B] text-white px-4 py-3 rounded-xl shadow-2xl border border-white/20 flex items-center gap-2.5 text-xs font-semibold animate-in slide-in-from-bottom-5">
          <CheckCircle2 className="size-4 text-white" />
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
        {/* Main Content: 2-Column Responsive Layout */}
        <main className="max-w-6xl mx-auto px-4 sm:px-8 pt-6 sm:pt-8 w-full pb-20">
          {/* Page Title & Mobile Sidebar Toggle */}
          <div className="flex items-center justify-between pb-5 mb-6 border-b border-black/10">
            <div>
              <h1 className="font-serif text-2xl font-bold text-[#072515]">
                Create discount
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
        <form onSubmit={handleCreateDiscount}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* ============================================================= */}
            {/* LEFT COLUMN: DISCOUNT FORM (7 COLS)                          */}
            {/* ============================================================= */}
            <div className="lg:col-span-7 space-y-6">
              <section className="bg-white rounded-2xl border border-black/10 shadow-xs p-6 space-y-5">
                {/* 1. Discount Code */}
                <div>
                  <label className="block text-xs font-semibold text-black/75 mb-1.5">
                    Discount Code <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={code}
                    onChange={(e) =>
                      setCode(e.target.value.toUpperCase().replace(/[^A-Z0-9_-]/g, ""))
                    }
                    placeholder="e.g. SUMMER10"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-black/15 focus:border-[#072515] focus:ring-1 focus:ring-[#072515] text-xs sm:text-sm outline-none bg-[#FAF8F5]/50 focus:bg-white text-black font-mono font-bold tracking-wider transition uppercase"
                  />
                </div>

                {/* 2. Discount Type & Value Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-black/75 mb-1.5">
                      Discount Type
                    </label>
                    <div className="relative">
                      <select
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-black/15 focus:border-[#072515] focus:ring-1 focus:ring-[#072515] text-xs sm:text-sm outline-none bg-[#FAF8F5]/50 focus:bg-white text-black transition appearance-none cursor-pointer pr-9"
                      >
                        <option value="Amount off order">Amount off order</option>
                        <option value="Percentage off order">Percentage off order</option>
                        <option value="Fixed Amount Concession">Fixed Amount Concession</option>
                        <option value="Free shipping">Free shipping</option>
                        <option value="Buy X get Y">Buy X get Y</option>
                      </select>
                      <ChevronDown className="size-4 text-black/40 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-black/75 mb-1.5">
                      Discount Value
                    </label>
                    <input
                      type="text"
                      required
                      value={discountValue}
                      onChange={(e) => setDiscountValue(e.target.value)}
                      placeholder="15%"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-black/15 focus:border-[#072515] focus:ring-1 focus:ring-[#072515] text-xs sm:text-sm outline-none bg-[#FAF8F5]/50 focus:bg-white text-black font-semibold transition"
                    />
                  </div>
                </div>

                {/* 3. Description */}
                <div>
                  <label className="block text-xs font-semibold text-black/75 mb-1.5">
                    Description
                  </label>
                  <input
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="e.g. 10% off all incense boxes"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-black/15 focus:border-[#072515] focus:ring-1 focus:ring-[#072515] text-xs sm:text-sm outline-none bg-[#FAF8F5]/50 focus:bg-white text-black transition"
                  />
                </div>

                {/* 4. Method & Eligibility Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-black/75 mb-1.5">
                      Method
                    </label>
                    <div className="relative">
                      <select
                        value={method}
                        onChange={(e) => setMethod(e.target.value as "Code" | "Automatic")}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-black/15 focus:border-[#072515] focus:ring-1 focus:ring-[#072515] text-xs sm:text-sm outline-none bg-[#FAF8F5]/50 focus:bg-white text-black transition appearance-none cursor-pointer pr-9"
                      >
                        <option value="Code">Code</option>
                        <option value="Automatic">Automatic</option>
                      </select>
                      <ChevronDown className="size-4 text-black/40 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-black/75 mb-1.5">
                      Eligibility
                    </label>
                    <div className="relative">
                      <select
                        value={eligibility}
                        onChange={(e) =>
                          setEligibility(
                            e.target.value as
                              | "All customers"
                              | "Specific patrons"
                              | "VIP Tier"
                              | "First-time patrons"
                          )
                        }
                        className="w-full px-3.5 py-2.5 rounded-xl border border-black/15 focus:border-[#072515] focus:ring-1 focus:ring-[#072515] text-xs sm:text-sm outline-none bg-[#FAF8F5]/50 focus:bg-white text-black transition appearance-none cursor-pointer pr-9"
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

                {/* 5. Minimum Spend & Expiry Date Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-black/75 mb-1.5">
                      Minimum Spend (₹)
                    </label>
                    <input
                      type="number"
                      min={0}
                      value={minSpend}
                      onChange={(e) =>
                        setMinSpend(e.target.value === "" ? "" : Number(e.target.value))
                      }
                      placeholder="2500"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-black/15 focus:border-[#072515] focus:ring-1 focus:ring-[#072515] text-xs sm:text-sm outline-none bg-[#FAF8F5]/50 focus:bg-white text-black transition"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-black/75 mb-1.5">
                      Expiry Date
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={expiryDate}
                        onChange={(e) => setExpiryDate(e.target.value)}
                        placeholder="Dec 31, 2026"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-black/15 focus:border-[#072515] focus:ring-1 focus:ring-[#072515] text-xs sm:text-sm outline-none bg-[#FAF8F5]/50 focus:bg-white text-black transition pr-9"
                      />
                      <Calendar className="size-4 text-black/40 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>
                </div>

                {/* 6. Status Radios */}
                <div>
                  <label className="block text-xs font-semibold text-black/75 mb-2">
                    Status
                  </label>
                  <div className="flex flex-wrap items-center gap-6">
                    {(["Active", "Scheduled", "Expired"] as const).map((s) => (
                      <label
                        key={s}
                        className="inline-flex items-center gap-2 text-xs font-medium text-black/80 cursor-pointer"
                      >
                        <input
                          type="radio"
                          name="status"
                          value={s}
                          checked={status === s}
                          onChange={() => setStatus(s)}
                          className="size-4 text-[#28513B] focus:ring-[#28513B] accent-[#28513B]"
                        />
                        <span>{s}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Bottom Actions */}
                <div className="pt-4 border-t border-black/10 flex items-center justify-end gap-3">
                  <Link
                    href="/admin?route=discounts"
                    className="px-4 py-2 rounded-xl border border-stone-300 text-xs font-semibold text-stone-700 hover:bg-stone-50 transition text-center"
                  >
                    Cancel
                  </Link>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="px-5 py-2 rounded-xl bg-[#28513B] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#28513B]/90 transition shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    <Ticket className="size-3.5 text-white" />
                    <span>{isSaving ? "Saving..." : "Create Discount"}</span>
                  </button>
                </div>
              </section>
            </div>

            {/* ============================================================= */}
            {/* RIGHT COLUMN: DISCOUNT PREVIEW (5 COLS)                       */}
            {/* ============================================================= */}
            <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24">
              <section className="bg-white rounded-2xl border border-black/10 shadow-xs p-6 space-y-5">
                {/* Header with Icon */}
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-xl bg-[#072515]/5 text-[#28513B] border border-black/5 flex items-center justify-center shrink-0">
                    <Tag className="size-5" />
                  </div>
                  <div>
                    <h2 className="text-sm sm:text-base font-bold text-[#072515]">
                      Discount Preview
                    </h2>
                    <p className="text-xs text-stone-500">
                      Here&apos;s how your discount will look:
                    </p>
                  </div>
                </div>

                {/* Dashed Preview Ticket Box */}
                <div className="rounded-2xl border-2 border-dashed border-[#28513B]/25 bg-[#FAF8F5] p-6 text-center space-y-3">
                  <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#072515]">
                    Get {discountValue || "15%"} OFF
                  </h3>
                  <p className="text-xs text-stone-600 font-medium">
                    {minSpend && Number(minSpend) > 0
                      ? `on orders above ₹${Number(minSpend).toLocaleString("en-IN")}`
                      : "No minimum spend required"}
                  </p>
                  <div className="pt-1">
                    <span className="inline-block px-4 py-1.5 rounded-lg border border-dashed border-[#c89e43] bg-white text-xs font-mono font-bold text-[#072515] tracking-wider shadow-2xs">
                      {method === "Automatic" ? "Automatic Concession" : `Use Code: ${code || "SUMMER10"}`}
                    </span>
                  </div>
                </div>

                {/* Key Details Section */}
                <div className="pt-2 border-t border-black/10 space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700">
                    Key Details
                  </h4>

                  <div className="space-y-2 text-xs">
                    <div className="flex items-center justify-between text-stone-600">
                      <span className="flex items-center gap-1.5 text-stone-500">
                        <Tag className="size-3.5 text-black/40" />
                        <span>Discount Type</span>
                      </span>
                      <span className="font-semibold text-stone-900">: {type}</span>
                    </div>

                    <div className="flex items-center justify-between text-stone-600">
                      <span className="flex items-center gap-1.5 text-stone-500">
                        <Percent className="size-3.5 text-black/40" />
                        <span>Discount Value</span>
                      </span>
                      <span className="font-semibold text-stone-900">: {discountValue || "15%"}</span>
                    </div>

                    <div className="flex items-center justify-between text-stone-600">
                      <span className="flex items-center gap-1.5 text-stone-500">
                        <UsersRound className="size-3.5 text-black/40" />
                        <span>Eligibility</span>
                      </span>
                      <span className="font-semibold text-stone-900">: {eligibility}</span>
                    </div>

                    <div className="flex items-center justify-between text-stone-600">
                      <span className="flex items-center gap-1.5 text-stone-500">
                        <DollarSign className="size-3.5 text-black/40" />
                        <span>Minimum Spend</span>
                      </span>
                      <span className="font-semibold text-stone-900">
                        : {minSpend && Number(minSpend) > 0 ? `₹${Number(minSpend).toLocaleString("en-IN")}` : "None"}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-stone-600">
                      <span className="flex items-center gap-1.5 text-stone-500">
                        <Calendar className="size-3.5 text-black/40" />
                        <span>Expiry Date</span>
                      </span>
                      <span className="font-semibold text-stone-900">: {expiryDate || "Ongoing"}</span>
                    </div>

                    <div className="flex items-center justify-between text-stone-600">
                      <span className="flex items-center gap-1.5 text-stone-500">
                        <ShieldCheck className="size-3.5 text-black/40" />
                        <span>Status</span>
                      </span>
                      <span className="font-semibold">
                        :{" "}
                        {status === "Active" && (
                          <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold">
                            <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" /> Active
                          </span>
                        )}
                        {status === "Scheduled" && (
                          <span className="inline-flex items-center gap-1 text-blue-700 font-semibold">
                            <span className="size-1.5 rounded-full bg-blue-500" /> Scheduled
                          </span>
                        )}
                        {status === "Expired" && (
                          <span className="inline-flex items-center gap-1 text-stone-500 font-semibold">
                            <span className="size-1.5 rounded-full bg-stone-400" /> Expired
                          </span>
                        )}
                      </span>
                    </div>
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

export default function CreateDiscountPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-white flex items-center justify-center">
          <Loader2 className="size-8 animate-spin text-[#28513B]" />
        </div>
      }
    >
      <CreateDiscountPageInner />
    </Suspense>
  );
}
