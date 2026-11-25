"use client";

import React, { useState, useEffect, use } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  Truck,
  Check,
  SlidersHorizontal,
  Clock,
  MapPin,
  CreditCard,
  User,
  Package,
  Calendar,
  ExternalLink,
  Copy,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Menu,
  ShieldCheck,
  Tag,
  Mail,
  Phone,
} from "lucide-react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { AdminOrder } from "@/app/admin/page";

function formatINR(val: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(val || 0);
}

export default function OrderDetailsPage({
  params,
}: {
  params: Promise<{ id: string }> | { id: string };
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Resolve ID from dynamic route param or fallback to search query ?id=...
  const unwrappedParams = typeof (params as any)?.then === "function" ? use(params as Promise<{ id: string }>) : (params as { id: string });
  const orderId = unwrappedParams?.id || searchParams.get("id") || "";

  const [order, setOrder] = useState<AdminOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [copiedAwb, setCopiedAwb] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Tracking form fields
  const [trackingForm, setTrackingForm] = useState({
    fulfillmentStatus: "Processing",
    paymentStatus: "Paid",
    courier: "BlueDart Express",
    awb: "",
    estimatedDate: "Within 3-5 business days",
    notes: "Order verified and processed in atelier.",
  });

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const copyToClipboard = (text: string) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedAwb(true);
      setTimeout(() => setCopiedAwb(false), 2000);
      triggerToast(`Copied AWB "${text}" to clipboard`);
    }
  };

  // Load order data from API or localStorage
  useEffect(() => {
    let isMounted = true;

    async function loadOrder() {
      if (!orderId) {
        if (isMounted) setLoading(false);
        return;
      }

      setLoading(true);

      // 1. Try local cache first for instant rendering
      try {
        const stored = localStorage.getItem("kurma_admin_orders");
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) {
            const cleanNo = orderId.replace(/^#+/, "").toLowerCase();
            const found = parsed.find(
              (o: any) =>
                o.id === orderId ||
                o.orderNumber?.toLowerCase() === orderId.toLowerCase() ||
                o.orderNumber?.replace(/^#+/, "").toLowerCase() === cleanNo
            );
            if (found && isMounted) {
              setOrder(found);
              setTrackingForm({
                fulfillmentStatus: found.fulfillmentStatus || "Processing",
                paymentStatus: found.paymentStatus || "Paid",
                courier: found.courier || "BlueDart Express",
                awb: found.awb || "",
                estimatedDate: found.estimatedDate || "Within 3-5 business days",
                notes: found.notes || "",
              });
            }
          }
        }
      } catch { }

      // 2. Fetch fresh order details from backend API
      try {
        const res = await fetch(`/api/admin/orders/${encodeURIComponent(orderId)}`);
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.order && isMounted) {
            setOrder(data.order);
            setTrackingForm({
              fulfillmentStatus: data.order.fulfillmentStatus || "Processing",
              paymentStatus: data.order.paymentStatus || "Paid",
              courier: data.order.courier || "BlueDart Express",
              awb: data.order.awb || "",
              estimatedDate: data.order.estimatedDate || "Within 3-5 business days",
              notes: data.order.notes || "",
            });
          }
        }
      } catch (err) {
        console.warn("Could not fetch order from API:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadOrder();

    return () => {
      isMounted = false;
    };
  }, [orderId]);

  // Save tracking & status updates
  const handleSaveTracking = async (overrideUpdates?: Partial<typeof trackingForm>) => {
    if (!order) return;
    setIsSaving(true);

    const merged = { ...trackingForm, ...(overrideUpdates || {}) };
    const updatedOrder: AdminOrder = {
      ...order,
      ...merged,
    };

    // Optimistic UI update
    setOrder(updatedOrder);
    setTrackingForm(merged);

    // Sync localStorage
    try {
      const stored = localStorage.getItem("kurma_admin_orders");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          const idx = parsed.findIndex((o: any) => o.id === order.id || o.orderNumber === order.orderNumber);
          if (idx !== -1) {
            parsed[idx] = updatedOrder;
          } else {
            parsed.unshift(updatedOrder);
          }
          localStorage.setItem("kurma_admin_orders", JSON.stringify(parsed));
          window.dispatchEvent(new Event("kurma_orders_updated"));
        }
      }
    } catch { }

    // Persist to Neon DB via API
    try {
      const res = await fetch(`/api/admin/orders/${encodeURIComponent(order.id || order.orderNumber)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(merged),
      });

      if (res.ok) {
        triggerToast("Order tracking & status updated successfully!");
      } else {
        triggerToast("Saved locally. Could not reach database.");
      }
    } catch (err) {
      console.warn("Failed to persist order tracking to backend:", err);
      triggerToast("Saved to local storage.");
    } finally {
      setIsSaving(false);
    }
  };

  // Delete Order
  const handleDeleteOrder = async () => {
    if (!order) return;
    if (!window.confirm(`Are you sure you want to permanently delete order ${order.orderNumber}?`)) {
      return;
    }

    setIsDeleting(true);

    try {
      // 1. Delete from localStorage
      const stored = localStorage.getItem("kurma_admin_orders");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          const filtered = parsed.filter((o: any) => o.id !== order.id && o.orderNumber !== order.orderNumber);
          localStorage.setItem("kurma_admin_orders", JSON.stringify(filtered));
          window.dispatchEvent(new Event("kurma_orders_updated"));
        }
      }

      // 2. Delete from database
      await fetch(`/api/admin/orders/${encodeURIComponent(order.id || order.orderNumber)}`, {
        method: "DELETE",
      });

      triggerToast(`Order ${order.orderNumber} deleted.`);
      setTimeout(() => {
        router.push("/admin?route=orders");
      }, 700);
    } catch (err) {
      console.error("Error deleting order:", err);
      setIsDeleting(false);
      triggerToast("Error deleting order. Please try again.");
    }
  };

  // Loading State - Clean green spinner matching Admin Dashboard
  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Loader2 className="size-8 animate-spin text-[#28513B]" />
      </div>
    );
  }

  // Not Found State
  if (!order) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] text-stone-900 flex items-center justify-center p-6 text-center">
        <div className="max-w-md bg-white rounded-2xl border border-black/10 p-8 shadow-sm space-y-4">
          <div className="size-12 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
            <AlertCircle className="size-6" />
          </div>
          <h2 className="font-serif text-xl font-bold text-[#072515]">Order Not Found</h2>
          <p className="text-xs text-stone-600 leading-relaxed">
            The order with identifier &ldquo;{orderId}&rdquo; could not be located in our sanctuary registry.
          </p>
          <div className="pt-2">
            <Link
              href="/admin?route=orders"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#28513B] text-white hover:bg-[#1e3e2d] text-xs font-semibold transition shadow-xs"
            >
              <ArrowLeft className="size-4" /> Back to Orders
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const activeFulfillmentStatus = trackingForm.fulfillmentStatus || order.fulfillmentStatus || "Processing";
  const statusOrder = ["Confirmed", "Processing", "Shipped", "Out for Delivery", "Delivered"];
  const currentIdx = activeFulfillmentStatus === "Pending" ? -1 : statusOrder.indexOf(activeFulfillmentStatus);

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
        currentRoute="orders"
        mobileOpen={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <main className="max-w-7xl mx-auto px-4 sm:px-8 pt-6 sm:pt-8 w-full pb-24">
          {/* Top Navigation Row: Back Button & Actions */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-6 mb-6 border-b border-black/10">
            <div className="flex items-center gap-3.5">
              <button
                type="button"
                onClick={() => setMobileSidebarOpen(true)}
                className="lg:hidden p-2 rounded-xl border border-black/15 bg-white text-black/75 hover:text-black hover:bg-black/5 transition"
                aria-label="Open Sidebar Menu"
              >
                <Menu className="size-4" />
              </button>
            </div>

            <div className="flex items-center gap-2.5">
              <Link
                href={`/track-order?orderId=${encodeURIComponent(order.orderNumber.replace(/^#+/, ""))}`}
                target="_blank"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-[#c89e43]/40 bg-[#FAF8F5] text-xs font-semibold text-[#072515] hover:bg-[#FAF8F5]/80 transition shadow-2xs"
              >
                <ExternalLink className="size-3.5 text-[#c89e43]" />
                <span>View Customer Tracking</span>
              </Link>

              <button
                type="button"
                onClick={() => handleSaveTracking()}
                disabled={isSaving}
                className="inline-flex items-center justify-center px-4 py-2 rounded-xl bg-[#28513B] text-white text-xs font-semibold hover:bg-[#1e3e2d] transition shadow-xs cursor-pointer disabled:opacity-50"
              >
                <span>{isSaving ? "Saving Updates..." : "Save Tracking Updates"}</span>
              </button>

              <button
                type="button"
                onClick={handleDeleteOrder}
                disabled={isDeleting || isSaving}
                className="p-2 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 transition text-xs font-semibold cursor-pointer disabled:opacity-50"
                title="Delete this order"
              >
                <Trash2 className="size-4" />
              </button>
            </div>
          </div>

          {/* 2-Column Responsive Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* ============================================================= */}
            {/* LEFT 7 COLUMNS: TRACKING CONTROLS & PRODUCT ITEMS             */}
            {/* ============================================================= */}
            <div className="lg:col-span-7 space-y-6">
              {/* Abandoned Notice if applicable */}
              {order.isAbandoned && (
                <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-start gap-3 text-amber-900 shadow-xs">
                  <div className="size-8 rounded-xl bg-amber-100 flex items-center justify-center text-amber-800 shrink-0 font-bold text-sm">
                    !
                  </div>
                  <div className="space-y-1 text-xs">
                    <p className="font-bold text-sm text-amber-950">Customer Abandoned Checkout</p>
                    <p className="text-amber-800 text-[11px] leading-relaxed">
                      The patron initiated this order but did not complete the transaction. Contact and delivery parameters have been securely preserved for concierge follow-up.
                    </p>
                  </div>
                </div>
              )}

              {/* CARD 1: LIVE MILESTONE PROGRESS STEPPER */}
              <section className="bg-white rounded-2xl border border-black/10 shadow-xs p-6 space-y-5">
                <div className="flex items-center justify-between pb-3 border-b border-black/10">
                  <span className="text-xs font-bold text-[#072515] uppercase tracking-wider flex items-center gap-2">
                    <Truck className="size-4 text-[#c89e43]" />
                    Live Milestone Progress
                  </span>
                  <span
                    className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      activeFulfillmentStatus === "Delivered"
                        ? "bg-emerald-100 text-emerald-800"
                        : activeFulfillmentStatus === "Shipped" || activeFulfillmentStatus === "In Transit"
                        ? "bg-blue-100 text-blue-800"
                        : activeFulfillmentStatus === "Out for Delivery"
                        ? "bg-purple-100 text-purple-800"
                        : "bg-amber-100 text-amber-800"
                    }`}
                  >
                    Current: {activeFulfillmentStatus}
                  </span>
                </div>

                {/* 5-Stage Stepper */}
                <div className="grid grid-cols-5 gap-2 relative text-center pt-2">
                  {[
                    { key: "Confirmed", label: "Confirmed" },
                    { key: "Processing", label: "Atelier Craft" },
                    { key: "Shipped", label: "In Transit" },
                    { key: "Out for Delivery", label: "Out for Delivery" },
                    { key: "Delivered", label: "Delivered" },
                  ].map((step, idx) => {
                    const isDone = idx < currentIdx || (idx === 4 && activeFulfillmentStatus === "Delivered");
                    const isCurrent = idx === currentIdx;

                    return (
                      <div key={step.key} className="flex flex-col items-center">
                        <div
                          className={`size-8 sm:size-9 rounded-full flex items-center justify-center font-bold text-xs transition-all shadow-xs ${
                            isDone
                              ? "bg-[#28513B] text-white"
                              : isCurrent
                              ? "bg-[#28513B] text-white ring-2 ring-[#28513B]/30 ring-offset-2 ring-offset-[#FAF8F5]"
                              : "bg-black/10 text-black/40"
                          }`}
                        >
                          {isDone ? <Check className="size-4" /> : idx + 1}
                        </div>
                        <span
                          className={`mt-2 text-[10px] sm:text-xs font-medium leading-tight ${
                            isCurrent
                              ? "font-bold text-[#072515]"
                              : isDone
                              ? "text-[#28513B] font-semibold"
                              : "text-black/40"
                          }`}
                        >
                          {step.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </section>

              {/* CARD 2: CONSIGNMENT TRACKING CONTROLS */}
              <section className="bg-white rounded-2xl border border-black/10 shadow-xs p-6 space-y-5">
                <div className="flex items-center justify-between pb-3 border-b border-black/10">
                  <div className="flex items-center gap-2">
                    <div className="size-8 rounded-lg bg-[#28513B]/10 text-[#28513B] flex items-center justify-center">
                      <SlidersHorizontal className="size-4" />
                    </div>
                    <div>
                      <h2 className="font-serif text-base font-bold text-[#072515]">
                        Consignment Tracking Controls
                      </h2>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Fulfillment Status */}
                  <div>
                    <label className="text-xs font-semibold text-black/75 block mb-1.5">
                      Tracking / Fulfillment Status
                    </label>
                    <select
                      value={trackingForm.fulfillmentStatus}
                      onChange={(e) => {
                        const newStatus = e.target.value;
                        setTrackingForm((prev) => ({ ...prev, fulfillmentStatus: newStatus }));
                        setOrder((prev) => (prev ? { ...prev, fulfillmentStatus: newStatus } : prev));
                      }}
                      className="w-full bg-[#FAF8F5]/60 border border-black/15 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-[#072515] outline-none focus:border-[#28513B] focus:ring-1 focus:ring-[#28513B] cursor-pointer"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Confirmed">Confirmed</option>
                      <option value="Processing">Processing / Crafting in Atelier</option>
                      <option value="Shipped">Shipped / In Transit</option>
                      <option value="Out for Delivery">Out for Delivery</option>
                      <option value="Delivered">Delivered & Sealed</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>

                  {/* Payment Status */}
                  <div>
                    <label className="text-xs font-semibold text-black/75 block mb-1.5">
                      Payment Status
                    </label>
                    <select
                      value={trackingForm.paymentStatus}
                      onChange={(e) => setTrackingForm({ ...trackingForm, paymentStatus: e.target.value })}
                      className="w-full bg-[#FAF8F5]/60 border border-black/15 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-[#072515] outline-none focus:border-[#28513B] focus:ring-1 focus:ring-[#28513B] cursor-pointer"
                    >
                      <option value="Paid">Paid (Confirmed)</option>
                      <option value="Pending">Payment Pending</option>
                      <option value="Refunded">Refunded</option>
                    </select>
                  </div>

                  {/* Logistics Courier */}
                  <div>
                    <label className="text-xs font-semibold text-black/75 block mb-1.5">
                      Logistics Courier
                    </label>
                    <select
                      value={trackingForm.courier}
                      onChange={(e) => setTrackingForm({ ...trackingForm, courier: e.target.value })}
                      className="w-full bg-[#FAF8F5]/60 border border-black/15 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-medium text-[#072515] outline-none focus:border-[#28513B] focus:ring-1 focus:ring-[#28513B] cursor-pointer"
                    >
                      <option value="BlueDart Express">BlueDart Express (Air Priority)</option>
                      <option value="Delhivery Air">Delhivery Air (Express 24-48h)</option>
                      <option value="DTDC Priority">DTDC Priority (Pan-India)</option>
                      <option value="FedEx Luxury">FedEx Luxury Logistics</option>
                      <option value="India Post Speed">India Post Speed Post</option>
                    </select>
                  </div>

                  {/* Waybill / AWB */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-semibold text-black/75">AWB / Waybill Number</label>
                      <button
                        type="button"
                        onClick={() => {
                          const prefix = trackingForm.courier.startsWith("Delhivery")
                            ? "DEL"
                            : trackingForm.courier.startsWith("DTDC")
                            ? "DTD"
                            : "BLU";
                          const rand = Math.floor(1000 + Math.random() * 9000);
                          const cityCode = order.city.slice(0, 3).toUpperCase() || "IND";
                          setTrackingForm({ ...trackingForm, awb: `${prefix}-${rand}-${cityCode}` });
                        }}
                        className="text-[11px] text-[#28513B] font-bold hover:underline cursor-pointer"
                      >
                        Auto-Generate
                      </button>
                    </div>
                    <div className="relative flex items-center">
                      <input
                        type="text"
                        value={trackingForm.awb}
                        onChange={(e) => setTrackingForm({ ...trackingForm, awb: e.target.value })}
                        placeholder="e.g. BD-73379059"
                        className="w-full bg-[#FAF8F5]/60 border border-black/15 rounded-xl pl-3.5 pr-9 py-2.5 text-xs sm:text-sm font-mono font-medium text-[#072515] outline-none focus:border-[#28513B]"
                      />
                      {trackingForm.awb && (
                        <button
                          type="button"
                          onClick={() => copyToClipboard(trackingForm.awb)}
                          className="absolute right-2.5 text-black/40 hover:text-black cursor-pointer"
                          title="Copy AWB"
                        >
                          {copiedAwb ? (
                            <Check className="size-3.5 text-emerald-600" />
                          ) : (
                            <Copy className="size-3.5" />
                          )}
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Estimated Delivery Date */}
                  <div className="sm:col-span-2">
                    <label className="text-xs font-semibold text-black/75 block mb-1.5">
                      Estimated Delivery Date
                    </label>
                    <input
                      type="text"
                      value={trackingForm.estimatedDate}
                      onChange={(e) => setTrackingForm({ ...trackingForm, estimatedDate: e.target.value })}
                      placeholder="e.g. Within 3-5 business days"
                      className="w-full bg-[#FAF8F5]/60 border border-black/15 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-[#072515] outline-none focus:border-[#28513B]"
                    />
                  </div>

                  {/* Transit Notes */}
                  <div className="sm:col-span-2">
                    <label className="text-xs font-semibold text-black/75 block mb-1.5">
                      Transit Milestone Notes (Visible to Customer on /track-order)
                    </label>
                    <input
                      type="text"
                      value={trackingForm.notes}
                      onChange={(e) => setTrackingForm({ ...trackingForm, notes: e.target.value })}
                      placeholder="e.g. Express order; verified in Kurma atelier."
                      className="w-full bg-[#FAF8F5]/60 border border-black/15 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-[#072515] outline-none focus:border-[#28513B]"
                    />
                  </div>
                </div>

                {/* Order Placed Footer */}
                <div className="pt-3 flex items-center gap-1.5 text-xs text-stone-500 border-t border-black/10">
                  <Clock className="size-3.5 text-[#c89e43]" />
                  <span>Order Placed: {order.date}</span>
                </div>
              </section>

              {/* CARD 3: CURATED ITEMS INCLUDED */}
              <section className="bg-white rounded-2xl border border-black/10 shadow-xs p-6 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-black/10">
                  <div className="flex items-center gap-2">
                    <Package className="size-4 text-[#28513B]" />
                    <h3 className="font-serif text-base font-bold text-[#072515]">
                      Curated Items Included ({order.items.length})
                    </h3>
                  </div>
                  <span className="text-xs text-stone-500 font-medium">
                    Total Qty: {order.itemsCount}
                  </span>
                </div>

                <div className="divide-y divide-black/5 border border-black/10 rounded-xl overflow-hidden bg-stone-50/50">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="p-4 flex items-center justify-between gap-4 bg-white hover:bg-stone-50/60 transition">
                      <div className="flex items-center gap-3.5">
                        <div className="relative size-12 rounded-xl overflow-hidden border border-black/10 bg-[#FAF8F5] shrink-0">
                          <Image src={item.image} alt={item.name} fill className="object-cover" />
                        </div>
                        <div>
                          <p className="font-semibold text-xs sm:text-sm text-stone-900 leading-snug">
                            {item.name}
                          </p>
                          <p className="text-[11px] text-stone-500 mt-0.5">
                            SKU: {item.sku} • Qty: <strong className="text-stone-800">{item.quantity}</strong> × {formatINR(item.price)}
                          </p>
                        </div>
                      </div>
                      <span className="font-bold text-sm text-[#072515] whitespace-nowrap">
                        {formatINR(item.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Subtotal & Breakdown */}
                <div className="pt-2 border-t border-black/10 space-y-2 text-xs">
                  <div className="flex justify-between text-stone-600">
                    <span>Items Subtotal</span>
                    <span>{formatINR(order.totalAmount)}</span>
                  </div>
                  <div className="flex justify-between text-stone-600">
                    <span>Shipping Concession</span>
                    <span className="text-emerald-700 font-medium">Complimentary Express</span>
                  </div>
                  <div className="flex justify-between text-base font-bold text-[#072515] pt-2 border-t border-black/10">
                    <span>Total Amount</span>
                    <span>{formatINR(order.totalAmount)}</span>
                  </div>
                </div>
              </section>

            </div>

            {/* ============================================================= */}
            {/* RIGHT 5 COLUMNS: CUSTOMER, ADDRESS & PAYMENT DETAILS          */}
            {/* ============================================================= */}
            <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-8">
              {/* CARD: CUSTOMER & CONSIGNEE INFO */}
              <section className="bg-white rounded-2xl border border-black/10 shadow-xs p-6 space-y-4">
                <div className="flex items-center gap-2 pb-3 border-b border-black/10">
                  <User className="size-4 text-[#28513B]" />
                  <h3 className="font-serif text-base font-bold text-[#072515]">
                    Customer & Consignee
                  </h3>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <span className="text-[10px] text-stone-500 uppercase tracking-wider block font-semibold">
                      Full Name
                    </span>
                    <span className="font-bold text-sm text-stone-900 block mt-0.5">
                      {order.customerName}
                    </span>
                  </div>

                  {order.customerEmail && (
                    <div className="flex items-center gap-2 text-stone-700">
                      <Mail className="size-3.5 text-stone-400 shrink-0" />
                      <a href={`mailto:${order.customerEmail}`} className="hover:underline truncate">
                        {order.customerEmail}
                      </a>
                    </div>
                  )}

                  {order.customerPhone && (
                    <div className="flex items-center gap-2 text-stone-700">
                      <Phone className="size-3.5 text-stone-400 shrink-0" />
                      <a href={`tel:${order.customerPhone}`} className="hover:underline">
                        {order.customerPhone}
                      </a>
                    </div>
                  )}

                  <div className="pt-2 border-t border-black/5 flex items-center justify-between text-stone-600">
                    <span>Destination City</span>
                    <span className="font-semibold text-stone-900">{order.city}</span>
                  </div>
                </div>
              </section>

              {/* CARD: SHIPPING ADDRESS */}
              <section className="bg-white rounded-2xl border border-black/10 shadow-xs p-6 space-y-4">
                <div className="flex items-center gap-2 pb-3 border-b border-black/10">
                  <MapPin className="size-4 text-[#c89e43]" />
                  <h3 className="font-serif text-base font-bold text-[#072515]">
                    Shipping & Delivery Address
                  </h3>
                </div>

                <div className="text-xs text-stone-700 leading-relaxed">
                  {order.shippingAddress ? (
                    typeof order.shippingAddress === "string" ? (
                      <p>{order.shippingAddress}</p>
                    ) : (
                      <div className="space-y-1">
                        {order.shippingAddress.name && (
                          <p className="font-bold text-stone-900 text-sm">{order.shippingAddress.name}</p>
                        )}
                        {order.shippingAddress.street && <p>{order.shippingAddress.street}</p>}
                        <p>
                          {[
                            order.shippingAddress.city,
                            order.shippingAddress.state,
                            order.shippingAddress.pincode,
                          ]
                            .filter(Boolean)
                            .join(", ")}
                        </p>
                        {order.shippingAddress.country && (
                          <p className="text-stone-500">{order.shippingAddress.country}</p>
                        )}
                        {order.shippingAddress.phone && (
                          <p className="pt-1.5 text-stone-600 font-medium">
                            Recipient Phone: {order.shippingAddress.phone}
                          </p>
                        )}
                      </div>
                    )
                  ) : (
                    <p className="text-stone-500 italic">
                      Standard Pan-India Express Delivery to {order.city}
                    </p>
                  )}
                </div>
              </section>

              {/* CARD: PAYMENT & CHANNEL SPECS */}
              <section className="bg-white rounded-2xl border border-black/10 shadow-xs p-6 space-y-4">
                <div className="flex items-center gap-2 pb-3 border-b border-black/10">
                  <CreditCard className="size-4 text-[#28513B]" />
                  <h3 className="font-serif text-base font-bold text-[#072515]">
                    Payment Details
                  </h3>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-stone-500">Payment Method</span>
                    <span className="font-semibold text-stone-900">{order.paymentMethod}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-stone-500">Payment Status</span>
                    <span
                      className={`inline-block text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                        order.paymentStatus === "Paid"
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {order.paymentStatus}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-stone-500">Order Channel</span>
                    <span className="font-semibold text-stone-900">{order.channel}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-stone-500">Courier / Carrier</span>
                    <span className="font-semibold text-stone-900">{order.courier}</span>
                  </div>

                  {order.awb && (
                    <div className="flex items-center justify-between pt-2 border-t border-black/5">
                      <span className="text-stone-500">Waybill (AWB)</span>
                      <span className="font-mono text-xs font-bold text-[#072515]">{order.awb}</span>
                    </div>
                  )}
                </div>
              </section>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
