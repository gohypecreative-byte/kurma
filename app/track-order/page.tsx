"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  Package,
  Mail,
  ArrowRight,
  Truck,
  Calendar,
  Check,
  Headphones,
  RefreshCw,
  AlertCircle,
  MapPin,
  ChevronLeft,
  ChevronRight,
  X,
  Copy,
} from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { useCart } from "@/lib/cart-context";
import { AdminOrder } from "@/lib/orders";
import { PRODUCTS } from "@/lib/products";

function DeliveryBoxGraphic() {
  return (
    <div className="relative w-28 h-28 sm:w-36 sm:h-36 shrink-0 select-none">
      {/* Motion Sparkles */}
      <div className="absolute -top-1 left-10 flex items-center gap-1.5 text-[#C5A45B] animate-pulse">
        <span className="w-1.5 h-3 bg-[#C5A45B] rounded-full rotate-[-25deg] transform origin-bottom" />
        <span className="w-1.5 h-3.5 bg-[#C5A45B] rounded-full transform origin-bottom -translate-y-1" />
        <span className="w-1.5 h-3 bg-[#C5A45B] rounded-full rotate-[25deg] transform origin-bottom" />
      </div>

      {/* 3D Isometric Parcel Box SVG */}
      <svg
        viewBox="0 0 160 160"
        className="w-full h-full drop-shadow-[0_12px_20px_rgba(120,70,30,0.18)]"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Box Shadow */}
        <ellipse cx="80" cy="142" rx="55" ry="14" fill="#000000" fillOpacity="0.08" />

        {/* Left Face (Darker Shade) */}
        <polygon points="26,62 80,94 80,136 26,104" fill="#C59E70" />
        {/* Left Shadow overlay */}
        <polygon points="26,62 80,94 80,136 26,104" fill="#805428" fillOpacity="0.18" />

        {/* Right Face (Medium Shade) */}
        <polygon points="80,94 134,62 134,104 80,136" fill="#B38B5E" />
        {/* Right shadow overlay */}
        <polygon points="80,94 134,62 134,104 80,136" fill="#000000" fillOpacity="0.08" />

        {/* Top Face (Lighter Highlight) */}
        <polygon points="80,22 134,62 80,94 26,62" fill="#E4C499" />

        {/* Kurma Forest Green Ribbon on Top Face */}
        <polygon points="73,27 87,37 61,56 47,46" fill="#092B20" />
        {/* Kurma Forest Green Ribbon on Left Face */}
        <polygon points="47,46 61,56 61,125 47,117" fill="#123D2D" />

        {/* Barcode Shipping Label on Left Face */}
        <g transform="translate(36, 82) rotate(18) skewY(-22)">
          <rect x="0" y="0" width="30" height="18" rx="2" fill="#FFFFFF" fillOpacity="0.95" />
          {/* Barcode lines */}
          <rect x="3" y="3" width="2" height="12" fill="#1C1B18" />
          <rect x="6" y="3" width="1" height="12" fill="#1C1B18" />
          <rect x="8" y="3" width="3" height="12" fill="#1C1B18" />
          <rect x="13" y="3" width="1.5" height="12" fill="#1C1B18" />
          <rect x="16" y="3" width="2" height="12" fill="#1C1B18" />
          <rect x="19" y="3" width="1" height="12" fill="#1C1B18" />
          <rect x="22" y="3" width="2.5" height="12" fill="#1C1B18" />
          <rect x="26" y="3" width="1" height="12" fill="#1C1B18" />
        </g>
      </svg>
    </div>
  );
}

function DottedTrailMapPinGraphic() {
  return (
    <div className="relative w-28 h-28 sm:w-36 sm:h-36 shrink-0 flex items-center justify-end select-none">
      <svg
        viewBox="0 0 160 120"
        className="w-full h-full overflow-visible"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Arched Dotted Flight / Transit Path */}
        <path
          d="M 10,75 C 45,85 70,30 130,42"
          stroke="#C5A45B"
          strokeWidth="2.5"
          strokeDasharray="4 5"
          strokeLinecap="round"
        />

        {/* Map Pin Shadow */}
        <ellipse cx="130" cy="52" rx="9" ry="3.5" fill="#000000" fillOpacity="0.12" />

        {/* Kurma Forest Green Map Pin Body */}
        <g transform="translate(116, 12)">
          <path
            d="M 14,0 C 6.27,0 0,6.27 0,14 C 0,24.5 14,38 14,38 C 14,38 28,24.5 28,14 C 28,6.27 21.73,0 14,0 Z"
            fill="#092B20"
            className="drop-shadow-[0_4px_10px_rgba(9,43,32,0.35)]"
          />
          {/* Inner Pin Dot */}
          <circle cx="14" cy="13" r="5" fill="#E8D9AE" />
        </g>
      </svg>
    </div>
  );
}

function TrackOrderContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { cartCount, setIsCartOpen } = useCart();

  const queryOrderNo = searchParams.get("orderNumber") || searchParams.get("id") || "";
  const queryEmail = searchParams.get("email") || "";

  const [orderIdInput, setOrderIdInput] = useState(queryOrderNo);
  const [emailPhoneInput, setEmailPhoneInput] = useState(queryEmail);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [order, setOrder] = useState<AdminOrder | null>(null);
  const [activeItemIdx, setActiveItemIdx] = useState(0);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [copiedAwb, setCopiedAwb] = useState(false);

  const handleCopyAwb = (awb: string) => {
    navigator.clipboard.writeText(awb);
    setCopiedAwb(true);
    setTimeout(() => setCopiedAwb(false), 2000);
  };

  const fetchOrderTracking = async (refNumber: string, emailOrPhone: string = "") => {
    if (!refNumber.trim() && !emailOrPhone.trim()) return;
    setLoading(true);
    setError(null);
    setActiveItemIdx(0);

    try {
      const params = new URLSearchParams();
      if (refNumber.trim()) params.set("orderNumber", refNumber.trim());
      if (emailOrPhone.trim()) params.set("email", emailOrPhone.trim());

      const res = await fetch(`/api/orders?${params.toString()}`);
      const data = await res.json();

      if (!res.ok || !data.success || !data.order) {
        setError(
          data.error ||
          `No order found matching "${refNumber || emailOrPhone}". Please verify your details.`
        );
        setOrder(null);
      } else {
        setOrder(data.order);
        setError(null);
      }
    } catch (err) {
      console.error("Failed to track order:", err);
      setError("Unable to connect to Kurma tracking network. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (queryOrderNo || queryEmail) {
      setOrderIdInput(queryOrderNo);
      setEmailPhoneInput(queryEmail);
      fetchOrderTracking(queryOrderNo, queryEmail);
    } else {
      // Default view: load demo order #KURMA-1048 so patron sees exact reference layout immediately
      fetchOrderTracking("#KURMA-1048");
      setOrderIdInput("#KURMA-1048");
    }
  }, [queryOrderNo, queryEmail]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderIdInput.trim() && !emailPhoneInput.trim()) return;

    const params = new URLSearchParams();
    if (orderIdInput.trim()) params.set("orderNumber", orderIdInput.trim());
    if (emailPhoneInput.trim()) params.set("email", emailPhoneInput.trim());

    router.push(`/track-order?${params.toString()}`);
    fetchOrderTracking(orderIdInput.trim(), emailPhoneInput.trim());
  };

  // Determine stage progression for the 5-step stepper
  const statusLower = (order?.fulfillmentStatus || "Processing").toLowerCase();

  const isConfirmed = [
    "confirmed",
    "processing",
    "shipped",
    "out for delivery",
    "delivered",
  ].some((s) => statusLower.includes(s));

  const isShipped = ["shipped", "out for delivery", "delivered"].some((s) =>
    statusLower.includes(s)
  );

  const isOutForDelivery = ["out for delivery", "delivered"].some((s) =>
    statusLower.includes(s)
  );

  const isDelivered = statusLower.includes("delivered");

  const orderItems =
    order?.items && order.items.length > 0
      ? order.items
      : [
          {
            sku: "5-elements-suite",
            name: order?.boxTitle || "5 Elements Luxury Incense Suite & Brass Turtle Burner",
            price: order?.totalAmount || 4999,
            quantity: 1,
            image: order?.boxImage || "/images/product/suite-clean.png",
          },
        ];

  const currentItem = orderItems[activeItemIdx] || orderItems[0];

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2] text-[#1C1B18] selection:bg-[#EADBCC] font-sans">
      <Navbar cartCount={cartCount} onOpenCart={() => setIsCartOpen(true)} />

      <main className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12 pb-14 sm:pb-20">
        {/* ========================================================================= */}
        {/* 1. HERO HEADER WITH 3D BOX & LOCATION PIN GRAPHIC                         */}
        {/* ========================================================================= */}
        <div className="relative flex items-center justify-between max-w-4xl mx-auto mb-8 sm:mb-10">
          {/* Left Decorative 3D Parcel Box */}
          <div className="hidden sm:block">
            <DeliveryBoxGraphic />
          </div>

          {/* Center Title & Subtitle */}
          <div className="text-center flex-1 px-4">
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-[46px] font-light text-[#092B20] tracking-normal leading-[1.15]">
              Track Your Order
            </h1>
            <p className="mt-2.5 text-xs sm:text-sm md:text-base text-[#5A5248] font-light leading-relaxed max-w-md mx-auto font-sans">
              Enter your order details to see real-time updates on your delivery.
            </p>
          </div>

          {/* Right Decorative Dotted Path with Map Pin */}
          <div className="hidden sm:block">
            <DottedTrailMapPinGraphic />
          </div>
        </div>



        {/* Error Notice */}
        {error && (
          <div className="max-w-4xl mx-auto p-4 mb-8 bg-rose-50 border border-rose-200/90 rounded-2xl flex items-start gap-3 text-rose-800 text-xs sm:text-sm font-sans">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-rose-600" />
            <div>
              <p className="font-semibold">{error}</p>
              <p className="mt-1 text-xs text-rose-600">
                Please check the Order ID on your invoice or confirmation email.
              </p>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 3. ORDER STATUS CARDS (Individual Card For Each Product)                  */}
        {/* ========================================================================= */}
        {order && (
          <div className="space-y-6 sm:space-y-8 max-w-4xl mx-auto">
            {orderItems.map((item, idx) => {
              const matchedProduct = PRODUCTS.find(
                (p) =>
                  p.id.toLowerCase() === (item.sku || "").toLowerCase() ||
                  p.name.toLowerCase() === item.name.toLowerCase()
              );
              const productHref = matchedProduct ? `/product/${matchedProduct.id}` : "/shop";

              return (
                <div
                  key={item.sku ? `${item.sku}-${idx}` : idx}
                  className="bg-white rounded-2xl sm:rounded-3xl border border-[#EAE3D8] shadow-[0_4px_30px_rgba(9,43,32,0.06)] overflow-hidden transition-all hover:shadow-[0_6px_36px_rgba(9,43,32,0.09)]"
                >
                  {/* Top Header Strip */}
                  <div className="bg-[#F6F2EB] border-b border-[#EAE3D8] px-4 sm:px-8 py-3 sm:py-4 flex flex-wrap items-center justify-between gap-2.5 sm:gap-3 font-sans">
                    <div>
                      <span className="text-[10px] sm:text-[11px] font-semibold text-[#8C8275] uppercase tracking-wider block">
                        ORDER PLACED
                      </span>
                      <span className="text-xs sm:text-sm font-semibold text-[#1C1B18] block mt-0.5">
                        {order.date || "25 October 2026"}
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="text-[11px] sm:text-xs font-semibold text-[#5A5248] block font-mono">
                        ORDER # {order.orderNumber.replace(/^#/, "")}
                      </span>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-4 sm:p-8 space-y-5 sm:space-y-6">
                    {/* Product Showcase */}
                    <div className="flex items-center gap-3.5 sm:gap-6 py-1 sm:py-2 min-w-0">
                      <Link
                        href={productHref}
                        className="relative w-16 h-16 sm:w-28 sm:h-28 rounded-xl bg-[#FAF7F2] border border-[#EAE3D8] p-1.5 sm:p-2 overflow-hidden shrink-0 flex items-center justify-center shadow-2xs hover:border-[#C5A45B] transition-colors group cursor-pointer"
                      >
                        <Image
                          src={item.image || "/images/product/suite-clean.png"}
                          alt={item.name}
                          fill
                          className="object-contain p-1 sm:p-1.5 transition-transform group-hover:scale-105"
                        />
                      </Link>

                      <div className="space-y-1 sm:space-y-1.5 min-w-0 flex-1">
                        <Link
                          href={productHref}
                          className="font-serif font-medium text-sm sm:text-lg text-[#092B20] hover:text-[#C5A45B] tracking-tight leading-snug block line-clamp-2 transition-colors"
                        >
                          {item.name}
                        </Link>
                        <div className="flex items-center gap-2 font-sans text-xs sm:text-[13px]">
                          <span className="font-medium text-[#1C1B18]">
                            Qty: {item.quantity}
                          </span>
                          <span className="text-[#8C8275]">&bull;</span>
                          <span className="font-medium text-[#092B20]">
                            RS. {(item.price * item.quantity).toLocaleString("en-IN")}
                          </span>
                        </div>
                        <div className="pt-0.5 flex flex-wrap items-center gap-2 font-sans">
                          <span className="inline-flex items-center px-2 sm:px-2.5 py-0.5 rounded-full text-[10px] sm:text-[11px] font-semibold bg-[#28513B]/10 text-[#092B20] border border-[#28513B]/25">
                            {order.paymentStatus || "Paid"}
                          </span>
                          <Link
                            href={productHref}
                            className="inline-flex items-center text-[10.5px] sm:text-[11px] font-medium text-[#C5A45B] hover:text-[#092B20] hover:underline transition-colors"
                          >
                            View Product &rarr;
                          </Link>
                        </div>
                      </div>
                    </div>

                    {/* 4. Horizontal 5-Stage Stepper (when order is not cancelled) */}
                    {!statusLower.includes("cancel") && (
                      <div className="pt-4 sm:pt-5 pb-1 sm:pb-2 border-t border-[#F0EBE1]">
                        <div className="relative">
                          {/* 5-Step Grid */}
                          <div className="grid grid-cols-5 gap-1 min-[400px]:gap-2 relative">
                            {/* Step 1: Order Placed */}
                            <div className="relative flex flex-col items-center text-center">
                              <div
                                className={`absolute top-3.5 min-[420px]:top-4 sm:top-5 left-1/2 w-full h-[2px] z-0 ${
                                  isConfirmed ? "bg-[#28513B]" : "bg-[#EAE3D8]"
                                }`}
                              />
                              <div className="relative z-10 w-7 h-7 min-[420px]:w-8 min-[420px]:h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center bg-[#28513B] text-white shadow-xs">
                                <Check className="w-3.5 h-3.5 min-[420px]:w-4 min-[420px]:h-4 sm:w-5 sm:h-5 text-white stroke-[2.5]" />
                              </div>
                              <h4 className="font-serif text-[10px] min-[420px]:text-xs sm:text-sm font-medium text-[#28513B] mt-2 sm:mt-3 leading-tight sm:leading-snug">
                                Order Placed
                              </h4>
                              <p className="text-[8.5px] min-[420px]:text-[10px] sm:text-[11px] text-[#7A6F62] font-medium mt-0.5 font-sans leading-none">
                                {order.date || "18 Nov, 10:30 AM"}
                              </p>
                            </div>

                            {/* Step 2: Order Confirmed */}
                            <div className="relative flex flex-col items-center text-center">
                              <div
                                className={`absolute top-3.5 min-[420px]:top-4 sm:top-5 left-1/2 w-full h-[2px] z-0 ${
                                  isShipped ? "bg-[#28513B]" : "bg-[#EAE3D8]"
                                }`}
                              />
                              <div
                                className={`relative z-10 w-7 h-7 min-[420px]:w-8 min-[420px]:h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all ${
                                  isConfirmed
                                    ? "bg-[#28513B] text-white shadow-xs ring-2 sm:ring-4 ring-[#28513B]/25"
                                    : "bg-[#FAF7F2] text-[#A3998C] border border-[#EAE3D8]"
                                }`}
                              >
                                <Check
                                  className={`w-3.5 h-3.5 min-[420px]:w-4 min-[420px]:h-4 sm:w-5 sm:h-5 stroke-[2.5] ${
                                    isConfirmed ? "text-white" : "text-[#A3998C]"
                                  }`}
                                />
                              </div>
                              <h4
                                className={`font-serif text-[10px] min-[420px]:text-xs sm:text-sm mt-2 sm:mt-3 leading-tight sm:leading-snug ${
                                  isConfirmed ? "font-medium text-[#28513B]" : "font-light text-[#A3998C]"
                                }`}
                              >
                                Order Confirmed
                              </h4>
                              <p className="text-[8.5px] min-[420px]:text-[10px] sm:text-[11px] text-[#7A6F62] font-medium mt-0.5 font-sans leading-none">
                                {isConfirmed ? "18 Nov, 11:00 AM" : "Pending"}
                              </p>
                            </div>

                            {/* Step 3: Shipped */}
                            <div className="relative flex flex-col items-center text-center">
                              <div
                                className={`absolute top-3.5 min-[420px]:top-4 sm:top-5 left-1/2 w-full h-[2px] z-0 ${
                                  isOutForDelivery ? "bg-[#28513B]" : "border-t-2 border-dashed border-[#D9CEBF]"
                                }`}
                              />
                              <div
                                className={`relative z-10 w-7 h-7 min-[420px]:w-8 min-[420px]:h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all ${
                                  isShipped
                                    ? "bg-[#28513B] text-white shadow-xs ring-2 sm:ring-4 ring-[#28513B]/25"
                                    : "bg-[#FAF7F2] text-[#A3998C] border border-[#EAE3D8]"
                                }`}
                              >
                                <Truck
                                  className={`w-3.5 h-3.5 min-[420px]:w-4 min-[420px]:h-4 sm:w-5 sm:h-5 stroke-[2] ${
                                    isShipped ? "text-white" : "text-[#A3998C]"
                                  }`}
                                />
                              </div>
                              <h4
                                className={`font-serif text-[10px] min-[420px]:text-xs sm:text-sm mt-2 sm:mt-3 leading-tight sm:leading-snug ${
                                  isShipped ? "font-medium text-[#28513B]" : "font-light text-[#A3998C]"
                                }`}
                              >
                                Shipped
                              </h4>
                              <p className="text-[8.5px] min-[420px]:text-[10px] sm:text-[11px] text-[#7A6F62] font-medium mt-0.5 font-sans leading-none">
                                {isShipped ? "19 Nov, 09:00 AM" : "Pending"}
                              </p>
                            </div>

                            {/* Step 4: Out for Delivery */}
                            <div className="relative flex flex-col items-center text-center">
                              <div
                                className={`absolute top-3.5 min-[420px]:top-4 sm:top-5 left-1/2 w-full h-[2px] z-0 ${
                                  isDelivered ? "bg-[#28513B]" : "border-t-2 border-dashed border-[#D9CEBF]"
                                }`}
                              />
                              <div
                                className={`relative z-10 w-7 h-7 min-[420px]:w-8 min-[420px]:h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all ${
                                  isOutForDelivery
                                    ? "bg-[#28513B] text-white shadow-xs ring-2 sm:ring-4 ring-[#28513B]/25"
                                    : "bg-[#FAF7F2] text-[#A3998C] border border-[#EAE3D8]"
                                }`}
                              >
                                <Package
                                  className={`w-3.5 h-3.5 min-[420px]:w-4 min-[420px]:h-4 sm:w-5 sm:h-5 stroke-[2] ${
                                    isOutForDelivery ? "text-white" : "text-[#A3998C]"
                                  }`}
                                />
                              </div>
                              <h4
                                className={`font-serif text-[10px] min-[420px]:text-xs sm:text-sm mt-2 sm:mt-3 leading-tight sm:leading-snug ${
                                  isOutForDelivery ? "font-medium text-[#28513B]" : "font-light text-[#A3998C]"
                                }`}
                              >
                                Out for Delivery
                              </h4>
                              <p className="text-[8.5px] min-[420px]:text-[10px] sm:text-[11px] text-[#7A6F62] font-medium mt-0.5 font-sans leading-none">
                                {isOutForDelivery ? "Today" : "Pending"}
                              </p>
                            </div>

                            {/* Step 5: Delivered */}
                            <div className="relative flex flex-col items-center text-center">
                              <div
                                className={`relative z-10 w-7 h-7 min-[420px]:w-8 min-[420px]:h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all ${
                                  isDelivered
                                    ? "bg-[#28513B] text-white shadow-xs ring-2 sm:ring-4 ring-[#28513B]/25"
                                    : "bg-[#FAF7F2] text-[#A3998C] border border-[#EAE3D8]"
                                }`}
                              >
                                <Check
                                  className={`w-3.5 h-3.5 min-[420px]:w-4 min-[420px]:h-4 sm:w-5 sm:h-5 stroke-[2.5] ${
                                    isDelivered ? "text-white" : "text-[#A3998C]"
                                  }`}
                                />
                              </div>
                              <h4
                                className={`font-serif text-[10px] min-[420px]:text-xs sm:text-sm mt-2 sm:mt-3 leading-tight sm:leading-snug ${
                                  isDelivered ? "font-medium text-[#28513B]" : "font-light text-[#A3998C]"
                                }`}
                              >
                                Delivered
                              </h4>
                              <p className="text-[8.5px] min-[420px]:text-[10px] sm:text-[11px] text-[#7A6F62] font-medium mt-0.5 font-sans leading-none">
                                {isDelivered ? order.estimatedDate || "Delivered" : "Pending"}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {/* 5. Need Help / Concierge Support Banner */}
            <div className="bg-[#FAF7F2] border border-[#EAE3D8] rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 font-sans">
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-full bg-white border border-[#EAE3D8] flex items-center justify-center text-[#092B20] shrink-0 shadow-2xs">
                  <Headphones className="w-5 h-5 stroke-[1.8]" />
                </div>
                <div>
                  <h4 className="font-serif font-medium text-[#092B20] text-sm sm:text-base leading-snug">
                    Need Help?
                  </h4>
                  <p className="text-xs text-[#5A5248] mt-0.5 font-sans font-light">
                    Our concierge support team is here to assist you.
                  </p>
                </div>
              </div>

              <Link
                href="/contact"
                className="bg-white hover:bg-[#FAF7F2] border border-[#D9CEBF] hover:border-[#C5A45B] text-[#092B20] text-xs sm:text-sm font-semibold px-5 py-2.5 rounded-full flex items-center gap-2 transition-all shadow-xs hover:shadow-sm cursor-pointer shrink-0 uppercase tracking-wider font-sans"
              >
                <span>Contact Concierge</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#C5A45B]" />
              </Link>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 6. ORDER DETAILS SLIDE-OVER / MODAL ("View order details")                */}
        {/* ========================================================================= */}
        {showDetailsModal && order && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div
              className="bg-white rounded-3xl border border-[#EAE3D8] shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 sm:p-7 space-y-5 animate-in zoom-in-95 duration-200"
              data-lenis-prevent
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between pb-3.5 border-b border-[#F0EBE1]">
                <div>
                  <h3 className="font-serif text-lg sm:text-xl font-bold text-[#092B20]">
                    Order Details
                  </h3>
                  <p className="text-xs text-[#8C8275] mt-0.5 font-mono">
                    {order.orderNumber} &bull; {order.date || "25 Oct 2026"}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowDetailsModal(false)}
                  className="w-8 h-8 rounded-full bg-[#FAF7F2] hover:bg-stone-200 text-[#5A5248] flex items-center justify-center transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="space-y-4 text-xs font-sans">
                {/* Recipient & Destination */}
                <div className="p-3.5 rounded-2xl bg-[#FAF7F2] border border-[#EAE3D8] space-y-1">
                  <span className="font-semibold text-[#092B20] uppercase tracking-wider text-[11px] block">
                    Shipping Destination
                  </span>
                  <p className="text-sm font-serif font-medium text-[#1C1B18]">
                    {order.customerName || "Patron"}
                  </p>
                  <p className="text-[#8C8275]">
                    {order.customerPhone} &bull; {order.customerEmail}
                  </p>
                  <p className="text-[#5A5248] font-medium pt-0.5">
                    {order.city || "Mumbai, Maharashtra, India"}
                  </p>
                </div>

                {/* Carrier & AWB */}
                {order.awb && (
                  <div className="p-3.5 rounded-2xl bg-[#FAF7F2] border border-[#EAE3D8] flex items-center justify-between gap-3">
                    <div>
                      <span className="text-[#8C8275] block text-[11px] font-semibold uppercase tracking-wider">
                        Carrier Consignment
                      </span>
                      <span className="font-semibold text-[#092B20] block mt-0.5">
                        {order.courier || "BlueDart Express"}
                      </span>
                      <code className="font-mono text-xs text-[#5A5248] font-bold mt-0.5 block">
                        {order.awb}
                      </code>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopyAwb(order.awb)}
                      className="px-3 py-1.5 rounded-xl bg-white border border-[#EAE3D8] text-[11px] font-semibold text-[#092B20] hover:bg-[#FAF7F2] flex items-center gap-1.5 cursor-pointer shadow-2xs"
                    >
                      {copiedAwb ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="w-3.5 h-3.5 text-[#C5A45B]" />
                      )}
                      <span>{copiedAwb ? "Copied!" : "Copy AWB"}</span>
                    </button>
                  </div>
                )}

                {/* Consignment Items */}
                <div className="space-y-2">
                  <span className="font-semibold text-[#092B20] uppercase tracking-wider text-[11px] block">
                    Consignment Items ({orderItems.length})
                  </span>
                  <div className="max-h-48 overflow-y-auto space-y-2 pr-1">
                    {orderItems.map((it, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-2.5 rounded-xl bg-[#FAF7F2] border border-[#EAE3D8]"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="relative w-9 h-9 rounded-lg bg-white shrink-0 overflow-hidden border border-[#EAE3D8] p-1 flex items-center justify-center">
                            <Image
                              src={it.image || "/images/product/suite-clean.png"}
                              alt={it.name}
                              fill
                              className="object-contain p-0.5"
                            />
                          </div>
                          <div className="min-w-0">
                            <p className="truncate font-serif font-medium text-stone-900 text-xs">
                              {it.name}
                            </p>
                            <p className="text-[11px] text-stone-500 font-sans">
                              Qty: {it.quantity} &times; ₹{it.price.toLocaleString("en-IN")}
                            </p>
                          </div>
                        </div>
                        <span className="font-semibold text-stone-900 shrink-0 ml-3 font-mono text-xs">
                          ₹{(it.price * it.quantity).toLocaleString("en-IN")}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Payment Breakdown */}
                <div className="pt-3 border-t border-[#F0EBE1] flex items-center justify-between text-xs sm:text-sm font-semibold">
                  <span className="text-[#5A5248]">
                    Total Paid ({order.paymentMethod || "Prepaid"}):
                  </span>
                  <span className="font-serif text-base sm:text-lg font-bold text-[#092B20]">
                    ₹{(order.totalAmount || 4999).toLocaleString("en-IN")}
                  </span>
                </div>
              </div>

              {/* Close Button */}
              <button
                type="button"
                onClick={() => setShowDetailsModal(false)}
                className="w-full bg-[#092B20] hover:bg-[#123D2D] text-[#E8D9AE] font-semibold py-3 rounded-full text-xs uppercase tracking-wider transition-colors cursor-pointer"
              >
                Close Details
              </button>
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
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center font-serif text-[#092B20] text-sm">
          Loading live consignment telemetry...
        </div>
      }
    >
      <TrackOrderContent />
    </Suspense>
  );
}
