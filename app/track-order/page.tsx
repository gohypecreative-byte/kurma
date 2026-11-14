"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  Search,
  Package,
  Truck,
  CheckCircle2,
  Clock,
  MapPin,
  ExternalLink,
  Copy,
  Check,
  RefreshCw,
  Phone,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  Calendar,
  AlertCircle,
} from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { useCart } from "@/lib/cart-context";
import { AdminOrder, TrackingStep } from "@/lib/orders";

function TrackOrderContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { cartCount, setIsCartOpen } = useCart();

  const queryOrderNo = searchParams.get("orderNumber") || searchParams.get("id") || "";
  const [searchInput, setSearchInput] = useState(queryOrderNo);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [order, setOrder] = useState<AdminOrder | null>(null);
  const [timeline, setTimeline] = useState<TrackingStep[]>([]);
  const [copiedAwb, setCopiedAwb] = useState(false);

  const fetchOrderTracking = async (refNumber: string) => {
    if (!refNumber.trim()) return;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/orders?orderNumber=${encodeURIComponent(refNumber.trim())}`);
      const data = await res.json();

      if (!res.ok || !data.success || !data.order) {
        setError(data.error || `Consignment "${refNumber}" not found. Please verify your reference number.`);
        setOrder(null);
        setTimeline([]);
      } else {
        setOrder(data.order);
        setTimeline(data.timeline || []);
        setError(null);
      }
    } catch (err: any) {
      console.error("Failed to track consignment:", err);
      setError("Unable to connect to Kurma tracking network. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (queryOrderNo) {
      setSearchInput(queryOrderNo);
      fetchOrderTracking(queryOrderNo);
    } else {
      // Default initial view: load demo order #KURMA-1048 so page is rich and populated immediately
      fetchOrderTracking("#KURMA-1048");
      setSearchInput("#KURMA-1048");
    }
  }, [queryOrderNo]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchInput.trim()) return;
    router.push(`/track-order?orderNumber=${encodeURIComponent(searchInput.trim())}`);
    fetchOrderTracking(searchInput.trim());
  };

  const handleCopyAwb = (awb: string) => {
    navigator.clipboard.writeText(awb);
    setCopiedAwb(true);
    setTimeout(() => setCopiedAwb(false), 2000);
  };

  const getStatusColor = (status: string = "") => {
    const s = status.toLowerCase();
    if (s.includes("deliver")) return "bg-emerald-100 text-emerald-800 border-emerald-300";
    if (s.includes("out for delivery")) return "bg-amber-100 text-amber-900 border-amber-300";
    if (s.includes("ship") || s.includes("transit")) return "bg-blue-100 text-blue-900 border-blue-300";
    if (s.includes("process") || s.includes("prep")) return "bg-purple-100 text-purple-900 border-purple-300";
    if (s.includes("cancel")) return "bg-rose-100 text-rose-800 border-rose-300";
    return "bg-stone-100 text-stone-800 border-stone-300";
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2] text-[#1C1B18] selection:bg-[#EADBCC]">
      <Navbar cartCount={cartCount} onOpenCart={() => setIsCartOpen(true)} />

      <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-14">
        {/* Editorial Heading */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#8b5f10]/10 border border-[#8b5f10]/20 text-[#8b5f10] text-xs font-semibold uppercase tracking-widest mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Sacred Consignment Telemetry</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal text-[#1C1B18] tracking-tight">
            Live Order <span className="italic font-serif">Tracking</span>
          </h1>
          <p className="mt-2.5 text-xs sm:text-sm text-stone-600 font-sans leading-relaxed">
            Follow the journey of your hand-poured botanical incense, Moradabad brassware, and bespoke heirloom gift suites from our atelier to your sanctuary.
          </p>
        </div>

        {/* Search Bar & Quick Demo Chips */}
        <div className="max-w-2xl mx-auto mb-10">
          <form
            onSubmit={handleSearchSubmit}
            className="relative flex items-center bg-white rounded-2xl border border-stone-300 shadow-md p-1.5 focus-within:border-[#8b5f10] focus-within:ring-2 focus-within:ring-[#8b5f10]/15 transition-all"
          >
            <div className="pl-3.5 pr-2 text-stone-400">
              <Search className="w-5 h-5" />
            </div>
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Enter Order # (e.g. #KURMA-1048) or AWB Tracking #"
              className="w-full py-2.5 pr-3 text-xs sm:text-sm bg-transparent outline-none font-mono placeholder:font-sans placeholder:text-stone-400"
            />
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 bg-[#1E1E1C] hover:bg-[#33312D] text-white text-xs font-semibold tracking-wider uppercase rounded-xl transition-all shadow-xs flex items-center gap-1.5 cursor-pointer shrink-0 disabled:opacity-70"
            >
              {loading ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <span>Track</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>

          {/* Quick reference chips */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-3 text-xs text-stone-500">
            <span className="font-medium text-[11px]">Quick samples:</span>
            {["#KURMA-1048", "#KURMA-1047", "#KURMA-1046", "#KURMA-1045"].map((demoNo) => (
              <button
                key={demoNo}
                type="button"
                onClick={() => {
                  setSearchInput(demoNo);
                  fetchOrderTracking(demoNo);
                }}
                className={`px-2.5 py-0.5 rounded-full text-[11px] font-mono border transition-all cursor-pointer ${
                  order?.orderNumber === demoNo
                    ? "bg-[#072515] text-[#eed08e] border-[#072515] font-bold"
                    : "bg-white text-stone-700 border-stone-200 hover:border-stone-400"
                }`}
              >
                {demoNo}
              </button>
            ))}
          </div>
        </div>

        {/* Error Notice */}
        {error && (
          <div className="max-w-2xl mx-auto p-4 mb-8 bg-rose-50 border border-rose-200 rounded-2xl flex items-start gap-3 text-rose-800 text-xs sm:text-sm">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-rose-600" />
            <div>
              <p className="font-semibold">{error}</p>
              <p className="mt-1 text-xs text-rose-600">
                Tip: Order numbers are formatted like <code className="font-mono bg-white px-1 py-0.5 rounded">#KURMA-1048</code> or check your email receipt.
              </p>
            </div>
          </div>
        )}

        {/* Order Details & Tracking Card */}
        {order && (
          <div className="bg-white rounded-3xl border border-[#EAE3D8] shadow-xl overflow-hidden transition-all space-y-0">
            {/* Top Bar: Order Reference, Carrier, Refresh Button */}
            <div className="p-6 sm:p-8 bg-[#FAF8F5] border-b border-[#EAE3D8] flex flex-wrap items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-serif text-2xl sm:text-3xl font-bold text-[#1C1B18] tracking-tight">
                    {order.orderNumber}
                  </span>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider border ${getStatusColor(
                      order.fulfillmentStatus
                    )}`}
                  >
                    {order.fulfillmentStatus}
                  </span>
                </div>
                <p className="text-xs text-stone-500 font-sans">
                  Placed on <span className="font-medium text-stone-800">{order.date}</span> &bull; Consignment Destination:{" "}
                  <span className="font-medium text-stone-800">{order.city}</span>
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => fetchOrderTracking(order.orderNumber)}
                  disabled={loading}
                  className="px-3.5 py-2 bg-white hover:bg-stone-50 border border-stone-200 text-stone-700 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
                  title="Check live status from database"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
                  <span>Refresh Status</span>
                </button>
              </div>
            </div>

            {/* Courier & Waybill Strip */}
            <div className="px-6 sm:px-8 py-4 bg-[#F2EDE4]/60 border-b border-[#EAE3D8] flex flex-wrap items-center justify-between gap-4 text-xs font-sans">
              <div className="flex items-center gap-6 flex-wrap">
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-[#8b5f10]" />
                  <span className="text-stone-500">Logistics Carrier:</span>
                  <span className="font-semibold text-stone-900">{order.courier || "BlueDart Express"}</span>
                </div>

                {order.awb && (
                  <div className="flex items-center gap-2">
                    <span className="text-stone-500">Air Waybill (AWB):</span>
                    <span className="font-mono font-bold text-stone-900 bg-white px-2 py-0.5 rounded border border-stone-300">
                      {order.awb}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopyAwb(order.awb)}
                      className="p-1 hover:bg-stone-200 text-stone-600 rounded transition cursor-pointer"
                      title="Copy AWB Number"
                    >
                      {copiedAwb ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-1.5 text-emerald-800 font-medium">
                <Calendar className="w-4 h-4 text-emerald-700" />
                <span>Estimated Arrival:</span>
                <strong className="font-semibold">{order.estimatedDate || "Within 3-5 business days"}</strong>
              </div>
            </div>

            {/* 6-Stage Visual Stepper Timeline */}
            <div className="p-6 sm:p-10 border-b border-[#EAE3D8]">
              <h3 className="font-serif text-lg font-medium text-[#1C1B18] mb-6 flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#8b5f10]" />
                <span>Consignment Progress Milestones</span>
              </h3>

              <div className="relative">
                {/* Horizontal / Vertical Stepper List */}
                <div className="grid grid-cols-1 md:grid-cols-6 gap-6 relative">
                  {timeline.map((step, idx) => {
                    const isDone = step.status === "completed";
                    const isCurr = step.status === "current";

                    return (
                      <div key={idx} className="relative flex md:flex-col items-start md:items-center text-left md:text-center group">
                        {/* Connecting Line between steps on Desktop */}
                        {idx < timeline.length - 1 && (
                          <div
                            className={`hidden md:block absolute top-4 left-1/2 w-full h-0.5 z-0 ${
                              isDone ? "bg-[#8b5f10]" : "bg-stone-200"
                            }`}
                          />
                        )}

                        {/* Step Icon Badge */}
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 z-10 transition-all ${
                            isDone
                              ? "bg-[#8b5f10] text-white shadow-md ring-4 ring-[#8b5f10]/15"
                              : isCurr
                              ? "bg-[#072515] text-[#eed08e] shadow-md ring-4 ring-[#072515]/20 animate-pulse"
                              : "bg-stone-100 text-stone-400 border border-stone-200"
                          }`}
                        >
                          {isDone ? (
                            <Check className="w-4 h-4 stroke-[2.5]" />
                          ) : (
                            <span className="text-xs font-mono font-bold">{idx + 1}</span>
                          )}
                        </div>

                        {/* Text Details */}
                        <div className="ml-3.5 md:ml-0 md:mt-3">
                          <h4
                            className={`text-xs font-serif font-medium leading-tight ${
                              isDone || isCurr ? "text-[#1C1B18] font-bold" : "text-stone-400"
                            }`}
                          >
                            {step.title}
                          </h4>
                          <p className="mt-1 text-[11px] text-stone-500 font-sans leading-snug">
                            {step.description}
                          </p>
                          {step.date && (
                            <span className="mt-1 inline-block text-[10px] font-mono text-[#8b5f10] font-semibold">
                              {step.date}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {order.notes && (
                <div className="mt-8 p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200/80 text-xs text-amber-900 flex items-start gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">Latest Atelier Note: </span>
                    <span>{order.notes}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Consignment Items & Summary */}
            <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
              {/* Left Column: Items in package */}
              <div className="md:col-span-7 space-y-4">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-500">
                  Consignment Items ({order.items.length})
                </h4>

                <div className="space-y-3">
                  {order.items.map((it, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-2xl bg-stone-50 border border-stone-200 flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-12 rounded-xl bg-white border border-stone-200 overflow-hidden shrink-0 flex items-center justify-center">
                          <Image
                            src={it.image || "/images/product/image.png"}
                            alt={it.name}
                            fill
                            className="object-contain p-1"
                          />
                        </div>
                        <div>
                          <p className="font-serif font-medium text-stone-900 text-sm">{it.name}</p>
                          <p className="text-stone-500 text-[11px]">Quantity: {it.quantity} &times; ₹{it.price}</p>
                        </div>
                      </div>
                      <span className="font-mono font-bold text-stone-900">₹{it.price * it.quantity}</span>
                    </div>
                  ))}
                </div>

                {order.personalization?.giftNote && (
                  <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#EAE3D8] text-xs space-y-1">
                    <span className="font-bold text-[#8b5f10] uppercase tracking-wider text-[10px]">
                      Deckle-Edge Gift Scroll Inscription
                    </span>
                    <p className="italic font-serif text-stone-800 text-sm">
                      &ldquo;{order.personalization.giftNote}&rdquo;
                    </p>
                    <p className="text-stone-500 text-[11px]">
                      &mdash; From {order.personalization.senderName} to {order.personalization.recipientName}
                    </p>
                  </div>
                )}
              </div>

              {/* Right Column: Customer & Delivery Address */}
              <div className="md:col-span-5 bg-[#FAF8F5] p-5 rounded-2xl border border-[#EAE3D8] space-y-4 text-xs font-sans">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-500">
                  Patron &amp; Delivery Destination
                </h4>

                <div className="space-y-2 text-stone-700">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-[#8b5f10] shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-stone-900">{order.customerName}</p>
                      <p>{order.city}</p>
                      {order.customerPhone && <p className="text-stone-500">{order.customerPhone}</p>}
                      {order.customerEmail && <p className="text-stone-500">{order.customerEmail}</p>}
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-stone-200/80 flex items-center justify-between">
                  <span className="text-stone-500">Total Consignment Value:</span>
                  <span className="font-serif text-lg font-bold text-[#072515]">₹{order.totalAmount}</span>
                </div>

                <div className="flex items-center justify-between text-[11px] text-stone-500">
                  <span>Payment Method:</span>
                  <span className="font-semibold text-stone-800">
                    {order.paymentMethod} ({order.paymentStatus})
                  </span>
                </div>

                <div className="pt-2">
                  <Link
                    href="/contact"
                    className="w-full py-2.5 px-3 rounded-xl bg-white hover:bg-stone-100 border border-stone-300 text-stone-800 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5 text-[#8b5f10]" />
                    <span>Contact Kurma Concierge</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default function TrackOrderPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center">Loading tracking telemetry...</div>}>
      <TrackOrderContent />
    </Suspense>
  );
}

