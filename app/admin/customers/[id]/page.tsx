"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Package,
  Calendar,
  CheckCircle2,
  Copy,
  ExternalLink,
  Eye,
  Truck,
  AlertCircle,
  X,
  Search,
  UsersRound,
} from "lucide-react";

interface OrderItem {
  sku?: string;
  name: string;
  quantity: number;
  price: number;
  image?: string;
}

interface CustomerOrder {
  id: string;
  orderNumber: string;
  date: string;
  boxTitle?: string;
  boxImage?: string;
  itemsCount: number;
  items: OrderItem[];
  totalAmount: number;
  paymentMethod: string;
  paymentStatus: string;
  fulfillmentStatus: string;
  channel?: string;
  courier?: string;
  awb?: string;
  estimatedDate?: string;
  notes?: string;
  shippingAddress?: {
    fullName?: string;
    phone?: string;
    street?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
  };
  personalization?: {
    recipientName?: string;
    senderName?: string;
    giftNote?: string;
    greetingCard?: boolean;
    monogram?: string;
  };
}

interface CustomerDetails {
  id: string;
  name: string;
  email: string;
  phone?: string;
  initials?: string;
  location: string;
  ordersCount: number;
  amountSpent: number;
  averageOrderValue?: number;
  subscription: "Subscribed" | "Unsubscribed" | "Not subscribed";
  tier: "Patron" | "Sovereign VIP" | "Heritage Circle";
  lastOrderDate: string;
  memberSince?: string;
  notes?: string;
  shippingAddress?: {
    fullName?: string;
    phone?: string;
    street?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
  };
  orders?: CustomerOrder[];
}

function formatINR(val: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(val || 0);
}

export default function CustomerDetailsPage() {
  const router = useRouter();
  const routeParams = useParams();
  const customerId = decodeURIComponent(
    (typeof routeParams?.id === "string"
      ? routeParams.id
      : Array.isArray(routeParams?.id)
        ? routeParams.id[0]
        : "") || ""
  );

  const [customer, setCustomer] = useState<CustomerDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [orderSearchQuery, setOrderSearchQuery] = useState("");
  const [inspectOrder, setInspectOrder] = useState<CustomerOrder | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  useEffect(() => {
    let isMounted = true;
    async function fetchCustomer() {
      if (!customerId) return;
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/admin/customers/${encodeURIComponent(customerId)}`);
        if (!res.ok) {
          throw new Error("Failed to load customer profile");
        }
        const data = await res.json();
        if (data.customer && isMounted) {
          setCustomer(data.customer);
        }
      } catch (err: any) {
        if (isMounted) {
          console.warn("Could not fetch customer from API, attempting local fallback:", err);
          setError(err.message || "Customer not found");
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    fetchCustomer();
    return () => {
      isMounted = false;
    };
  }, [customerId]);

  const handleCopy = (text: string, label: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    triggerToast(`Copied ${label} to clipboard`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center p-6">
        <div className="size-10 rounded-full border-3 border-[#28513B]/20 border-t-[#28513B] animate-spin" />
      </div>
    );
  }

  if (error || !customer) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] text-[#072515] p-6 sm:p-10 flex flex-col items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-2xl border border-black/10 p-8 text-center space-y-4 shadow-sm">
          <div className="size-12 rounded-full bg-amber-50 text-amber-700 flex items-center justify-center mx-auto">
            <AlertCircle className="size-6" />
          </div>
          <h2 className="font-serif text-2xl font-bold text-[#072515]">Patron Record Not Found</h2>
          <p className="text-xs text-black/60 leading-relaxed">
            We could not locate customer profile for identifier &quot;{customerId}&quot;. The patron may have been removed or entered incorrectly.
          </p>
          <div className="pt-2">
            <Link
              href="/admin?route=customers"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#072515] text-[#eed08e] hover:bg-[#28513B] text-xs font-semibold transition"
            >
              <ArrowLeft className="size-4" /> Return to Customers Directory
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const filteredOrders = (customer.orders || []).filter((o) => {
    if (!orderSearchQuery) return true;
    const query = orderSearchQuery.toLowerCase();
    const orderNo = o.orderNumber.toLowerCase();
    const boxTitle = (o.boxTitle || "").toLowerCase();
    const itemMatch = o.items.some((it) => it.name.toLowerCase().includes(query));
    return orderNo.includes(query) || boxTitle.includes(query) || itemMatch;
  });

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-black pb-24 font-sans selection:bg-[#eed08e]/40">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 flex items-center gap-2.5 rounded-xl bg-[#072515] px-4 py-3 text-xs font-medium text-[#FAF8F5] shadow-2xl border border-[#eed08e]/30 animate-fade-in">
          <CheckCircle2 className="size-4 text-[#eed08e]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header / Sticky Bar */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-black/10 px-4 sm:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              href="/admin?route=customers"
              className="inline-flex items-center justify-center size-9 rounded-xl border border-black/15 bg-white text-black hover:bg-black/5 transition shadow-2xs group"
              title="Return to Customers"
            >
              <ArrowLeft className="size-4 group-hover:-translate-x-0.5 transition-transform" />
            </Link>
            <div>
              <div className="flex items-center gap-2 text-[11px] text-black/50">
                <Link href="/admin?route=home" className="hover:text-black transition">Admin</Link>
                <span>/</span>
                <Link href="/admin?route=customers" className="hover:text-black transition">Customers</Link>
                <span>/</span>
                <span className="text-[#072515] font-medium truncate max-w-[180px]">{customer.name}</span>
              </div>
              <h1 className="font-serif text-lg sm:text-xl font-bold text-[#072515] leading-tight">
                {customer.name}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {customer.email && (
              <a
                href={`mailto:${customer.email}`}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-black/15 text-black hover:bg-black/5 text-xs font-semibold transition shadow-2xs"
              >
                <Mail className="size-3.5 text-black/60" />
                <span className="hidden sm:inline">Email Customer</span>
              </a>
            )}
            {customer.phone && (
              <a
                href={`https://wa.me/${customer.phone.replace(/[^0-9]/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 hover:bg-emerald-100 text-xs font-semibold transition shadow-2xs"
              >
                <Phone className="size-3.5 text-emerald-600" />
                <span className="hidden sm:inline">WhatsApp</span>
              </a>
            )}
            <Link
              href="/admin?route=customers"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#072515] text-[#eed08e] hover:bg-[#28513B] text-xs font-semibold transition shadow-2xs"
            >
              <UsersRound className="size-3.5" />
              <span>All Customers</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-8 pt-6 sm:pt-8 space-y-6">
        {/* ==================================================================== */}
        {/* CUSTOMER HERO CARD                                                   */}
        {/* ==================================================================== */}
        <section className="bg-white rounded-2xl border border-[#eed08e]/30 shadow-xs p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-full bg-gradient-to-l from-[#eed08e]/10 to-transparent pointer-events-none" />
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 relative z-10">
            <div className="flex items-center gap-4">
              <div className="size-16 rounded-2xl bg-[#072515] text-[#eed08e] font-serif font-bold text-2xl flex items-center justify-center border-2 border-[#eed08e]/40 shadow-md shrink-0">
                {customer.initials || customer.name.slice(0, 2).toUpperCase()}
              </div>
              <div className="space-y-1">
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#072515]">
                  {customer.name}
                </h2>
                <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-black/60">
                  <span className="flex items-center gap-1">
                    <Mail className="size-3.5 text-black/40" />
                    <span>{customer.email}</span>
                  </span>
                  {customer.phone && (
                    <span className="flex items-center gap-1">
                      <Phone className="size-3.5 text-black/40" />
                      <span>{customer.phone}</span>
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <MapPin className="size-3.5 text-black/40" />
                    <span>{customer.location}</span>
                  </span>
                  {customer.memberSince && (
                    <span className="flex items-center gap-1">
                      <Calendar className="size-3.5 text-black/40" />
                      <span>Member since {customer.memberSince}</span>
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 self-stretch sm:self-auto justify-end">
              <button
                type="button"
                onClick={() => handleCopy(customer.email, "Email")}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-black/15 text-xs text-black hover:bg-black/5 transition"
              >
                <Copy className="size-3.5 text-black/50" /> Copy Email
              </button>
            </div>
          </div>
        </section>

        {/* ==================================================================== */}
        {/* 2-COLUMN MAIN CONTENT (8 COLS / 4 COLS)                               */}
        {/* ==================================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* ================================================================= */}
          {/* LEFT COLUMN: ORDER HISTORY & RECENT ACTIVITY (8 COLS)             */}
          {/* ================================================================= */}
          <div className="lg:col-span-8 space-y-6">
            {/* Orders Section */}
            <section className="bg-white rounded-2xl border border-black/10 shadow-xs overflow-hidden">
              <div className="p-5 border-b border-black/10 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="size-8 rounded-xl bg-[#072515]/5 text-[#072515] flex items-center justify-center">
                    <Package className="size-4 text-[#072515]" />
                  </div>
                  <div>
                    <h3 className="font-serif text-base font-bold text-[#072515]">
                      Order History ({customer.orders?.length || 0})
                    </h3>
                    <p className="text-[11px] text-black/50">
                      All completed, processing, and historical consignments
                    </p>
                  </div>
                </div>

                <div className="relative min-w-48 sm:min-w-64">
                  <Search className="size-3.5 text-black/40 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    value={orderSearchQuery}
                    onChange={(e) => setOrderSearchQuery(e.target.value)}
                    placeholder="Search by order # or product..."
                    className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-black/15 bg-[#FAF8F5]/50 focus:bg-white outline-none focus:border-[#072515] transition"
                  />
                </div>
              </div>

              {filteredOrders.length === 0 ? (
                <div className="p-10 text-center space-y-2">
                  <Package className="size-8 text-black/20 mx-auto" />
                  <p className="font-serif text-sm font-semibold text-black/70">No Orders Match Filter</p>
                  <p className="text-xs text-black/40">
                    {orderSearchQuery ? "Try searching for a different order number or clear the search query." : "No past orders recorded yet for this customer."}
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-black/5">
                  {filteredOrders.map((ord) => (
                    <div
                      key={ord.id || ord.orderNumber}
                      className="p-5 hover:bg-black/[0.015] transition-colors space-y-3"
                    >
                      {/* Order Header Row */}
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-xs text-[#072515] bg-[#eed08e]/20 border border-[#eed08e]/50 px-2 py-0.5 rounded-md">
                            {ord.orderNumber}
                          </span>
                          <span className="text-xs text-black/50">{ord.date}</span>
                          {ord.channel && (
                            <span className="text-[10px] bg-black/5 text-black/60 px-2 py-0.5 rounded-full font-medium">
                              {ord.channel}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          {/* Payment status badge */}
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider ${
                              ord.paymentStatus === "Paid"
                                ? "bg-emerald-100 text-emerald-800"
                                : ord.paymentStatus === "Refunded"
                                  ? "bg-stone-100 text-stone-700"
                                  : "bg-amber-100 text-amber-800"
                            }`}
                          >
                            {ord.paymentStatus}
                          </span>

                          {/* Fulfillment status badge */}
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider ${
                              ord.fulfillmentStatus === "Delivered"
                                ? "bg-emerald-100 text-emerald-800"
                                : ord.fulfillmentStatus === "Shipped" || ord.fulfillmentStatus === "In Transit"
                                  ? "bg-blue-100 text-blue-800"
                                  : ord.fulfillmentStatus === "Out for Delivery"
                                    ? "bg-purple-100 text-purple-800"
                                    : "bg-amber-100 text-amber-800"
                            }`}
                          >
                            {ord.fulfillmentStatus}
                          </span>

                          {/* Inspect button */}
                          <button
                            type="button"
                            onClick={() => setInspectOrder(ord)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-black/5 hover:bg-[#072515] hover:text-[#eed08e] text-black text-[11px] font-medium transition"
                          >
                            <Eye className="size-3" />
                            <span>Inspect</span>
                          </button>
                        </div>
                      </div>

                      {/* Items Preview */}
                      <div className="bg-[#FAF8F5] rounded-xl p-3 border border-black/5 space-y-2">
                        <div className="flex items-center justify-between text-xs text-black/60 pb-1.5 border-b border-black/5">
                          <span className="font-medium text-black">
                            {ord.boxTitle || `${ord.itemsCount} Products`}
                          </span>
                          <span className="font-serif font-bold text-[#072515]">
                            {formatINR(ord.totalAmount)}
                          </span>
                        </div>

                        <div className="space-y-1.5">
                          {ord.items.map((it, idx) => (
                            <div key={idx} className="flex items-center justify-between text-xs">
                              <div className="flex items-center gap-2">
                                <span className="size-1.5 rounded-full bg-[#c89e43]" />
                                <span className="text-black/80">{it.name}</span>
                                <span className="text-[11px] text-black/40 font-mono">
                                  × {it.quantity}
                                </span>
                              </div>
                              <span className="text-black/70 font-medium">
                                {formatINR(it.price * it.quantity)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>

          {/* ================================================================= */}
          {/* RIGHT COLUMN: CONTACT & SHIPPING ADDRESS DETAILS (4 COLS)          */}
          {/* ================================================================= */}
          <div className="lg:col-span-4 space-y-6">
            {/* 1. Contact Information Card */}
            <section className="bg-white rounded-2xl border border-black/10 shadow-xs p-5 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-black/10">
                <h3 className="font-serif text-sm font-bold text-[#072515]">
                  Personal & Contact
                </h3>
                <span className="text-[10px] font-mono text-black/40">
                  ID: {customer.id.slice(0, 10)}
                </span>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <span className="block text-[11px] text-black/50 font-medium">Full Name</span>
                  <span className="font-semibold text-black">{customer.name}</span>
                </div>

                <div>
                  <span className="block text-[11px] text-black/50 font-medium">Email Address</span>
                  <div className="flex items-center justify-between">
                    <span className="text-black/80 font-mono break-all">{customer.email}</span>
                    <button
                      type="button"
                      onClick={() => handleCopy(customer.email, "Email")}
                      className="text-black/40 hover:text-black p-1"
                      title="Copy email"
                    >
                      <Copy className="size-3.5" />
                    </button>
                  </div>
                </div>

                <div>
                  <span className="block text-[11px] text-black/50 font-medium">Phone Number</span>
                  <div className="flex items-center justify-between">
                    <span className="text-black/80 font-mono">{customer.phone || "+91 98201 44821"}</span>
                    {customer.phone && (
                      <button
                        type="button"
                        onClick={() => handleCopy(customer.phone!, "Phone")}
                        className="text-black/40 hover:text-black p-1"
                        title="Copy phone"
                      >
                        <Copy className="size-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                <div>
                  <span className="block text-[11px] text-black/50 font-medium">Primary Region</span>
                  <span className="text-black/80">{customer.location}</span>
                </div>
              </div>
            </section>

            {/* 2. Primary Shipping Address Card */}
            <section className="bg-white rounded-2xl border border-black/10 shadow-xs p-5 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-black/10">
                <h3 className="font-serif text-sm font-bold text-[#072515] flex items-center gap-1.5">
                  <MapPin className="size-3.5 text-[#c89e43]" />
                  <span>Delivery Address</span>
                </h3>
                <span className="text-[10px] bg-emerald-50 text-emerald-800 font-semibold px-2 py-0.5 rounded-full border border-emerald-200">
                  Primary
                </span>
              </div>

              {customer.shippingAddress ? (
                <div className="text-xs space-y-1.5 text-black/75 leading-relaxed bg-[#FAF8F5] p-3.5 rounded-xl border border-black/5">
                  <p className="font-bold text-black">
                    {customer.shippingAddress.fullName || customer.name}
                  </p>
                  {customer.shippingAddress.street && (
                    <p>{customer.shippingAddress.street}</p>
                  )}
                  <p>
                    {[
                      customer.shippingAddress.city,
                      customer.shippingAddress.state,
                      customer.shippingAddress.postalCode,
                    ]
                      .filter(Boolean)
                      .join(", ")}
                  </p>
                  <p className="text-black/50">
                    {customer.shippingAddress.country || "India"}
                  </p>
                  {customer.shippingAddress.phone && (
                    <p className="text-[11px] font-mono text-black/60 pt-1">
                      Tel: {customer.shippingAddress.phone}
                    </p>
                  )}
                </div>
              ) : (
                <div className="text-xs text-black/50 bg-[#FAF8F5] p-3.5 rounded-xl border border-black/5">
                  <p className="font-semibold text-black">{customer.name}</p>
                  <p>{customer.location}</p>
                  <p>India</p>
                </div>
              )}
            </section>
          </div>
        </div>
      </main>

      {/* ==================================================================== */}
      {/* MODAL: INSPECT CUSTOMER ORDER & TRACKING DETAILS                     */}
      {/* ==================================================================== */}
      {inspectOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-3 sm:p-4 animate-fade-in">
          <div className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-[#eed08e]/40 flex flex-col max-h-[92vh]">
            {/* Header */}
            <div className="p-4 bg-[#072515] text-[#FAF8F5] flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-[#eed08e] bg-[#eed08e]/10 px-2 py-0.5 rounded border border-[#eed08e]/30">
                    {inspectOrder.orderNumber}
                  </span>
                  <span className="text-[11px] text-white/60">
                    {customer.name} • {inspectOrder.date}
                  </span>
                </div>
                <h3 className="font-serif font-bold text-base text-white mt-1">
                  {inspectOrder.boxTitle || "Bespoke Patron Hamper"}
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <Link
                  href={`/track-order?orderNumber=${encodeURIComponent(inspectOrder.orderNumber)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#eed08e] text-[#072515] hover:bg-white text-xs font-semibold transition shadow-xs"
                >
                  <ExternalLink className="size-3.5" /> View Tracking
                </Link>
                <button
                  type="button"
                  onClick={() => setInspectOrder(null)}
                  className="p-1 rounded-md text-white/70 hover:text-white"
                >
                  <X className="size-5" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-5 overflow-y-auto space-y-4 text-xs">
              {/* Visual 5-Stage Stepper */}
              <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#c89e43]/30">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-bold text-[#072515] uppercase tracking-wider flex items-center gap-1.5">
                    <Truck className="size-3.5 text-[#c89e43]" />
                    Live Milestone Progress
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      inspectOrder.fulfillmentStatus === "Delivered"
                        ? "bg-emerald-100 text-emerald-800"
                        : inspectOrder.fulfillmentStatus === "Shipped" || inspectOrder.fulfillmentStatus === "In Transit"
                          ? "bg-blue-100 text-blue-800"
                          : inspectOrder.fulfillmentStatus === "Out for Delivery"
                            ? "bg-purple-100 text-purple-800"
                            : "bg-amber-100 text-amber-800"
                    }`}
                  >
                    Current: {inspectOrder.fulfillmentStatus}
                  </span>
                </div>

                <div className="grid grid-cols-5 gap-1 relative text-center">
                  {[
                    { key: "Confirmed", label: "Confirmed" },
                    { key: "Processing", label: "Atelier Craft" },
                    { key: "Shipped", label: "In Transit" },
                    { key: "Out for Delivery", label: "Out for Delivery" },
                    { key: "Delivered", label: "Delivered" },
                  ].map((step, idx) => {
                    const statusOrder = ["Confirmed", "Processing", "Shipped", "Out for Delivery", "Delivered"];
                    const currentIdx = Math.max(0, statusOrder.indexOf(inspectOrder.fulfillmentStatus));
                    const isDone = idx < currentIdx;
                    const isCurrent = idx === currentIdx;

                    return (
                      <div key={step.key} className="flex flex-col items-center">
                        <div
                          className={`size-6 rounded-full flex items-center justify-center font-bold text-[10px] mb-1 transition-colors ${
                            isDone
                              ? "bg-emerald-600 text-white"
                              : isCurrent
                                ? "bg-[#072515] text-[#eed08e] ring-2 ring-[#c89e43]"
                                : "bg-black/10 text-black/40"
                          }`}
                        >
                          {isDone ? "✓" : idx + 1}
                        </div>
                        <span
                          className={`text-[10px] font-medium leading-tight ${
                            isCurrent ? "font-bold text-[#072515]" : "text-black/50"
                          }`}
                        >
                          {step.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Items Breakdown */}
              <div className="space-y-2">
                <h4 className="font-semibold text-black text-xs uppercase tracking-wider">
                  Ordered Products ({inspectOrder.itemsCount})
                </h4>
                <div className="border border-black/10 rounded-xl overflow-hidden divide-y divide-black/5">
                  {inspectOrder.items.map((it, idx) => (
                    <div key={idx} className="p-3 flex items-center justify-between gap-3 bg-white">
                      <div>
                        <p className="font-semibold text-black">{it.name}</p>
                        <p className="text-[11px] text-black/50">
                          Qty: {it.quantity} × {formatINR(it.price)}
                        </p>
                      </div>
                      <p className="font-mono font-bold text-[#072515]">
                        {formatINR(it.price * it.quantity)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Summary Totals */}
              <div className="p-4 rounded-xl bg-[#FAF8F5] border border-black/5 space-y-1.5">
                <div className="flex justify-between text-black/70">
                  <span>Payment Method:</span>
                  <span className="font-semibold text-black">{inspectOrder.paymentMethod || "UPI"}</span>
                </div>
                <div className="flex justify-between text-black/70">
                  <span>Payment Status:</span>
                  <span className="font-semibold text-emerald-800">{inspectOrder.paymentStatus}</span>
                </div>
                <div className="flex justify-between text-black font-bold text-sm pt-2 border-t border-black/10">
                  <span>Grand Total:</span>
                  <span className="text-[#072515]">{formatINR(inspectOrder.totalAmount)}</span>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-black/[0.02] border-t border-black/10 flex items-center justify-end">
              <button
                type="button"
                onClick={() => setInspectOrder(null)}
                className="px-4 py-2 rounded-xl bg-[#072515] text-[#eed08e] hover:bg-[#28513B] text-xs font-semibold transition"
              >
                Close Order View
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
