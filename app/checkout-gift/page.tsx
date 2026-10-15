"use client";

import { useState, useEffect, useMemo, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { useCart } from "@/lib/cart-context";
import { formatPrice } from "@/lib/products";
import {
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Lock,
  Gift,
  Truck,
  Tag,
  ChevronRight,
  CreditCard,
  Banknote,
  QrCode,
  Clock,
  Heart,
  Calendar,
  Phone,
  Mail,
  User,
  MapPin,
  Check,
} from "lucide-react";

interface SavedHamper {
  box: {
    id: string;
    title: string;
    size: string;
    capacity: number;
    price: number;
    image: string;
    description?: string;
  };
  goodies: Array<{
    id: string;
    name: string;
    category?: string;
    price: number;
    image: string;
    description?: string;
    quantity: number;
  }>;
  personalization: {
    recipientName?: string;
    senderName?: string;
    giftNote?: string;
    brassPlaqueText?: string;
  };
  grandTotal: number;
  boxPrice: number;
  goodiesPriceTotal: number;
}

function CheckoutGiftContent() {
  const router = useRouter();
  const { cartCount, setIsCartOpen } = useCart();

  const [hamper, setHamper] = useState<SavedHamper | null>(null);
  const [loading, setLoading] = useState(true);
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [couponError, setCouponError] = useState("");
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState("KRM-GIFT-782914");
  const [paymentMethod, setPaymentMethod] = useState<"upi" | "cod" | "card">("upi");

  // Shipping details state
  const [shippingDetails, setShippingDetails] = useState({
    recipientName: "",
    recipientPhone: "",
    address: "",
    city: "",
    state: "Karnataka",
    pincode: "",
    deliveryDate: "immediate",
    senderName: "",
    senderEmail: "",
    senderPhone: "",
    giftInstructions: "Please do not include pricing invoice in gift box",
  });

  // Load hamper from localStorage or fallback
  useEffect(() => {
    try {
      const stored = localStorage.getItem("kurma_custom_hamper");
      if (stored) {
        const parsed = JSON.parse(stored) as SavedHamper;
        if (parsed?.box) {
          setHamper(parsed);
          if (parsed.personalization?.recipientName) {
            setShippingDetails((prev) => ({
              ...prev,
              recipientName: parsed.personalization.recipientName || "",
              senderName: parsed.personalization.senderName || "",
            }));
          }
          setLoading(false);
          return;
        }
      }
    } catch (err) {
      console.error(err);
    }

    // Default fallback gift hamper
    setHamper({
      box: {
        id: "celebration",
        title: "The Celebration Box",
        size: "8 x 8 x 4 cm",
        capacity: 4,
        price: 650,
        image: "/images/product/mdf-box-clean.png",
        description: "Royal debossed Kurma emblem rigid wooden box with plush velvet lining.",
      },
      goodies: [
        {
          id: "vanilla-diffuser",
          name: "Soul & Scents 50ml Vanilla Reed Diffuser",
          price: 339,
          image: "/images/product/turtle-holder-clean.png",
          quantity: 1,
        },
      ],
      personalization: {
        recipientName: "Aditya",
        senderName: "Dev",
        giftNote: "May the sacred elements fill your sanctuary with peace, harmony and divine prosperity.",
      },
      grandTotal: 989,
      boxPrice: 650,
      goodiesPriceTotal: 339,
    });
    setLoading(false);
  }, []);

  const subtotal = useMemo(() => {
    if (!hamper) return 989;
    return hamper.grandTotal;
  }, [hamper]);

  const discountAmount = appliedCoupon ? Math.round(subtotal * 0.1) : 0;
  const isFreeShipping = subtotal >= 499;
  const shippingFee = isFreeShipping ? 0 : 49;
  const finalTotal = Math.max(0, subtotal - discountAmount + shippingFee);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError("");
    if (!couponCode.trim()) return;

    if (
      couponCode.trim().toUpperCase() === "SACRED10" ||
      couponCode.trim().toUpperCase() === "KURMA10" ||
      couponCode.trim().toUpperCase() === "GIFT10"
    ) {
      setAppliedCoupon(couponCode.trim().toUpperCase());
      setCouponCode("");
    } else {
      setCouponError("Invalid coupon. Use 'SACRED10' for 10% off!");
    }
  };

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!shippingDetails.recipientName || !shippingDetails.recipientPhone || !shippingDetails.address) {
      alert("Please provide the recipient's name, phone number, and delivery address.");
      return;
    }
    const newOrderId = `KRM-GIFT-${Math.floor(100000 + Math.random() * 900000)}`;
    setOrderId(newOrderId);
    setOrderPlaced(true);
    try {
      localStorage.removeItem("kurma_custom_hamper");
    } catch {
      // ignore
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center">
        <div className="w-10 h-10 border-3 border-[#072515] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // SUCCESS SCREEN
  if (orderPlaced) {
    return (
      <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-stone-900">
        <Navbar cartCount={cartCount} onOpenCart={() => setIsCartOpen(true)} />
        <main className="flex-1 max-w-3xl w-full mx-auto px-4 sm:px-6 py-12 sm:py-16">
          <div className="bg-white rounded-3xl border border-stone-200/90 shadow-xl p-6 sm:p-10 text-center space-y-6 animate-in fade-in duration-300">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center mx-auto shadow-xs">
              <CheckCircle2 className="w-9 h-9 sm:w-11 sm:h-11" />
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold text-[#8b5f10] uppercase tracking-[0.25em]">
                GIFT HAMPER CONFIRMED
              </span>
              <h1 className="font-serif text-3xl sm:text-4xl text-[#072515] font-normal">
                Sacred Blessings Dispatched
              </h1>
              <p className="text-sm text-stone-600 max-w-md mx-auto">
                Your bespoke gift hamper is safely confirmed and scheduled for hand-wrapping with luxury seal &amp; gold zari ribbon.
              </p>
            </div>

            <div className="inline-block bg-[#FAF8F5] rounded-2xl border border-[#eed08e]/50 px-6 py-3 font-mono text-sm text-stone-800">
              Order ID: <strong className="text-[#072515]">{orderId}</strong>
            </div>

            {/* Hamper details recap */}
            <div className="bg-[#FAF5E9] rounded-2xl p-5 text-left space-y-3 border border-stone-200/80">
              <div className="flex items-center justify-between text-xs text-stone-600 border-b border-stone-200/60 pb-2">
                <span>Gift Box:</span>
                <strong className="text-stone-900 font-serif">{hamper?.box.title}</strong>
              </div>
              <div className="flex items-center justify-between text-xs text-stone-600 border-b border-stone-200/60 pb-2">
                <span>Recipient:</span>
                <strong className="text-stone-900">{shippingDetails.recipientName || hamper?.personalization.recipientName || "Valued Recipient"}</strong>
              </div>
              <div className="flex items-center justify-between text-xs text-stone-600 border-b border-stone-200/60 pb-2">
                <span>Delivery Address:</span>
                <span className="text-stone-900 text-right truncate max-w-xs">{shippingDetails.address || "Doorstep Delivery"}</span>
              </div>
              <div className="flex items-center justify-between text-xs text-stone-600 pt-1">
                <span>Total Amount Paid:</span>
                <strong className="text-base font-serif text-[#072515]">₹{finalTotal.toLocaleString("en-IN")}</strong>
              </div>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/elements"
                className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-[#072515] hover:bg-[#0c3823] text-[#eed08e] text-xs font-bold uppercase tracking-wider transition-all shadow-md"
              >
                Create Another Gift
              </Link>
              <Link
                href="/"
                className="w-full sm:w-auto px-7 py-3.5 rounded-full border border-stone-300 hover:bg-stone-50 text-stone-700 text-xs font-semibold uppercase tracking-wider transition-all"
              >
                Return to Sanctuary
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-stone-900 selection:bg-[#eed08e] selection:text-[#072515]">
      <Navbar cartCount={cartCount} onOpenCart={() => setIsCartOpen(true)} />

      {/* Breadcrumb Header */}
      <div className="bg-[#fbf6ea]/70 border-b border-[#eed08e]/30 py-3 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex items-center gap-2 text-xs text-stone-500 font-sans">
          <Link href="/" className="hover:text-[#072515] transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
          <Link href="/elements" className="hover:text-[#072515] transition-colors">Customise Hamper</Link>
          <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
          <span className="text-[#8b5f10] font-semibold">Checkout Gift</span>
        </div>
      </div>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Page Title */}
        <div className="text-center max-w-2xl mx-auto space-y-2 mb-10">
          <div className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.22em] text-[#8b5f10] uppercase">
            <Gift className="w-4 h-4 text-[#8b5f10]" />
            <span>SACRED GIFT CHECKOUT</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#072515] font-normal tracking-tight">
            Complete Your Gift Hamper
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 font-sans">
            Personalized hand-wrapping, handwritten note, and doorstep delivery included.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT COLUMN: CHECKOUT FORMS (8 Cols) */}
          <div className="lg:col-span-7 xl:col-span-8 space-y-6">
            <form onSubmit={handlePlaceOrder} id="checkout-gift-form" className="space-y-6">
              {/* CARD 1: RECIPIENT & DELIVERY DETAILS */}
              <div className="bg-white rounded-3xl border border-stone-200/90 p-5 sm:p-7 shadow-xs space-y-5">
                <div className="flex items-center gap-3 border-b border-stone-100 pb-3">
                  <div className="w-8 h-8 rounded-full bg-[#072515] text-[#eed08e] flex items-center justify-center font-bold text-xs">
                    1
                  </div>
                  <div>
                    <h2 className="font-serif text-base sm:text-lg font-semibold text-stone-900 leading-tight">
                      Recipient &amp; Delivery Address
                    </h2>
                    <p className="text-xs text-stone-500 font-sans">
                      Where should this auspicious gift hamper be delivered?
                    </p>
                  </div>
                </div>

                <div className="space-y-4 pt-1">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                        Recipient Full Name *
                      </label>
                      <div className="relative">
                        <User className="w-4 h-4 text-stone-400 absolute left-3.5 top-3 pointer-events-none" />
                        <input
                          type="text"
                          required
                          value={shippingDetails.recipientName}
                          onChange={(e) => setShippingDetails({ ...shippingDetails, recipientName: e.target.value })}
                          placeholder="e.g. Radhika Sharma"
                          className="w-full pl-10 pr-4 py-2.5 bg-[#FAF8F5] border border-stone-200 rounded-xl text-xs sm:text-sm focus:border-[#8b5f10] focus:outline-hidden font-sans"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                        Recipient Phone Number *
                      </label>
                      <div className="relative">
                        <Phone className="w-4 h-4 text-stone-400 absolute left-3.5 top-3 pointer-events-none" />
                        <input
                          type="tel"
                          required
                          value={shippingDetails.recipientPhone}
                          onChange={(e) => setShippingDetails({ ...shippingDetails, recipientPhone: e.target.value })}
                          placeholder="+91 98765 43210"
                          className="w-full pl-10 pr-4 py-2.5 bg-[#FAF8F5] border border-stone-200 rounded-xl text-xs sm:text-sm focus:border-[#8b5f10] focus:outline-hidden font-sans"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                      Delivery Street Address *
                    </label>
                    <div className="relative">
                      <MapPin className="w-4 h-4 text-stone-400 absolute left-3.5 top-3 pointer-events-none" />
                      <textarea
                        required
                        rows={2}
                        value={shippingDetails.address}
                        onChange={(e) => setShippingDetails({ ...shippingDetails, address: e.target.value })}
                        placeholder="Flat/House No., Building, Street, Landmark"
                        className="w-full pl-10 pr-4 py-2.5 bg-[#FAF8F5] border border-stone-200 rounded-xl text-xs sm:text-sm focus:border-[#8b5f10] focus:outline-hidden font-sans resize-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                        City *
                      </label>
                      <input
                        type="text"
                        required
                        value={shippingDetails.city}
                        onChange={(e) => setShippingDetails({ ...shippingDetails, city: e.target.value })}
                        placeholder="e.g. Bengaluru"
                        className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-stone-200 rounded-xl text-xs sm:text-sm focus:border-[#8b5f10] focus:outline-hidden font-sans"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                        State
                      </label>
                      <input
                        type="text"
                        value={shippingDetails.state}
                        onChange={(e) => setShippingDetails({ ...shippingDetails, state: e.target.value })}
                        placeholder="Karnataka"
                        className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-stone-200 rounded-xl text-xs sm:text-sm focus:border-[#8b5f10] focus:outline-hidden font-sans"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                        PIN Code *
                      </label>
                      <input
                        type="text"
                        required
                        value={shippingDetails.pincode}
                        onChange={(e) => setShippingDetails({ ...shippingDetails, pincode: e.target.value })}
                        placeholder="560001"
                        className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-stone-200 rounded-xl text-xs sm:text-sm focus:border-[#8b5f10] focus:outline-hidden font-sans"
                      />
                    </div>
                  </div>

                  {/* Delivery Instruction Badge */}
                  <div className="p-3 rounded-xl bg-[#FAF5E9] border border-stone-200/70 flex items-start gap-2.5">
                    <Gift className="w-4 h-4 text-[#8b5f10] shrink-0 mt-0.5" />
                    <p className="text-xs text-stone-600 leading-relaxed font-sans">
                      <strong className="text-stone-900">Discrete Gift Packaging:</strong> All prices and invoices are omitted from the recipient package and emailed strictly to the sender.
                    </p>
                  </div>
                </div>
              </div>

              {/* CARD 2: SENDER DETAILS */}
              <div className="bg-white rounded-3xl border border-stone-200/90 p-5 sm:p-7 shadow-xs space-y-5">
                <div className="flex items-center gap-3 border-b border-stone-100 pb-3">
                  <div className="w-8 h-8 rounded-full bg-[#072515] text-[#eed08e] flex items-center justify-center font-bold text-xs">
                    2
                  </div>
                  <div>
                    <h2 className="font-serif text-base sm:text-lg font-semibold text-stone-900 leading-tight">
                      Sender Contact Information
                    </h2>
                    <p className="text-xs text-stone-500 font-sans">
                      For dispatch tracking notifications and tax invoice
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                      Sender Name
                    </label>
                    <input
                      type="text"
                      value={shippingDetails.senderName}
                      onChange={(e) => setShippingDetails({ ...shippingDetails, senderName: e.target.value })}
                      placeholder="Your Name"
                      className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-stone-200 rounded-xl text-xs sm:text-sm focus:border-[#8b5f10] focus:outline-hidden font-sans"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                      Sender Email *
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-3 pointer-events-none" />
                      <input
                        type="email"
                        required
                        value={shippingDetails.senderEmail}
                        onChange={(e) => setShippingDetails({ ...shippingDetails, senderEmail: e.target.value })}
                        placeholder="you@email.com"
                        className="w-full pl-10 pr-3.5 py-2.5 bg-[#FAF8F5] border border-stone-200 rounded-xl text-xs sm:text-sm focus:border-[#8b5f10] focus:outline-hidden font-sans"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                      Sender Phone Number
                    </label>
                    <input
                      type="tel"
                      value={shippingDetails.senderPhone}
                      onChange={(e) => setShippingDetails({ ...shippingDetails, senderPhone: e.target.value })}
                      placeholder="+91..."
                      className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-stone-200 rounded-xl text-xs sm:text-sm focus:border-[#8b5f10] focus:outline-hidden font-sans"
                    />
                  </div>
                </div>
              </div>

              {/* CARD 3: PAYMENT METHOD SELECTION */}
              <div className="bg-white rounded-3xl border border-stone-200/90 p-5 sm:p-7 shadow-xs space-y-5">
                <div className="flex items-center gap-3 border-b border-stone-100 pb-3">
                  <div className="w-8 h-8 rounded-full bg-[#072515] text-[#eed08e] flex items-center justify-center font-bold text-xs">
                    3
                  </div>
                  <div>
                    <h2 className="font-serif text-base sm:text-lg font-semibold text-stone-900 leading-tight">
                      Sacred Payment Method
                    </h2>
                    <p className="text-xs text-stone-500 font-sans">
                      Select your preferred secure payment channel
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                  {/* UPI */}
                  <div
                    onClick={() => setPaymentMethod("upi")}
                    className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                      paymentMethod === "upi"
                        ? "border-[#072515] bg-[#FAF5E9]/60 shadow-xs"
                        : "border-stone-200 hover:border-stone-300 bg-white"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <QrCode className="w-5 h-5 text-[#8b5f10]" />
                      {paymentMethod === "upi" && (
                        <div className="w-4 h-4 rounded-full bg-[#072515] text-[#eed08e] flex items-center justify-center">
                          <Check className="w-2.5 h-2.5 stroke-[3]" />
                        </div>
                      )}
                    </div>
                    <div className="mt-3">
                      <h4 className="text-xs font-bold text-stone-900">Instant UPI</h4>
                      <p className="text-[10px] text-stone-500 mt-0.5">GPay, PhonePe, Paytm</p>
                    </div>
                  </div>

                  {/* Cards */}
                  <div
                    onClick={() => setPaymentMethod("card")}
                    className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                      paymentMethod === "card"
                        ? "border-[#072515] bg-[#FAF5E9]/60 shadow-xs"
                        : "border-stone-200 hover:border-stone-300 bg-white"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <CreditCard className="w-5 h-5 text-[#8b5f10]" />
                      {paymentMethod === "card" && (
                        <div className="w-4 h-4 rounded-full bg-[#072515] text-[#eed08e] flex items-center justify-center">
                          <Check className="w-2.5 h-2.5 stroke-[3]" />
                        </div>
                      )}
                    </div>
                    <div className="mt-3">
                      <h4 className="text-xs font-bold text-stone-900">Cards / Netbanking</h4>
                      <p className="text-[10px] text-stone-500 mt-0.5">Visa, Mastercard, RuPay</p>
                    </div>
                  </div>

                  {/* COD */}
                  <div
                    onClick={() => setPaymentMethod("cod")}
                    className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                      paymentMethod === "cod"
                        ? "border-[#072515] bg-[#FAF5E9]/60 shadow-xs"
                        : "border-stone-200 hover:border-stone-300 bg-white"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <Banknote className="w-5 h-5 text-[#8b5f10]" />
                      {paymentMethod === "cod" && (
                        <div className="w-4 h-4 rounded-full bg-[#072515] text-[#eed08e] flex items-center justify-center">
                          <Check className="w-2.5 h-2.5 stroke-[3]" />
                        </div>
                      )}
                    </div>
                    <div className="mt-3">
                      <h4 className="text-xs font-bold text-stone-900">Cash on Delivery</h4>
                      <p className="text-[10px] text-stone-500 mt-0.5">Pay upon safe receipt</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2 text-[11px] text-stone-500">
                  <Lock className="w-3.5 h-3.5 text-emerald-600" />
                  <span>256-Bit Encrypted Sacred Checkout • Certified Secure Gateway</span>
                </div>
              </div>
            </form>
          </div>

          {/* RIGHT COLUMN: GIFT HAMPER SUMMARY & TOTALS (4-5 Cols) */}
          <div className="lg:col-span-5 xl:col-span-4 space-y-6 lg:sticky lg:top-24">
            <div className="bg-white rounded-3xl border border-stone-200/90 p-5 sm:p-6 shadow-sm space-y-5">
              <h3 className="font-serif text-lg font-bold text-[#072515] pb-3 border-b border-stone-100">
                <span>Gift Hamper Summary</span>
              </h3>

              {/* Box Thumbnail */}
              {hamper && (
                <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-[#FAF8F5] border border-stone-200/80">
                  <div className="relative w-16 h-16 rounded-xl bg-white border border-stone-200 overflow-hidden shrink-0 p-1">
                    <Image
                      src={hamper.box.image}
                      alt={hamper.box.title}
                      fill
                      unoptimized
                      className="object-contain"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="text-[9.5px] uppercase tracking-wider font-bold text-[#8b5f10] bg-[#eed08e]/30 px-2 py-0.5 rounded-full inline-block mb-0.5">
                      Selected Box
                    </span>
                    <h4 className="font-serif text-sm font-bold text-stone-900 truncate">
                      {hamper.box.title}
                    </h4>
                    <p className="text-[11px] text-stone-500 font-sans">
                      Size: {hamper.box.size}
                    </p>
                    <p className="text-xs font-bold text-[#072515] font-serif mt-0.5">
                      ₹{hamper.box.price.toLocaleString("en-IN")}
                    </p>
                  </div>
                </div>
              )}

              {/* Goodies List */}
              {hamper && hamper.goodies.length > 0 && (
                <div className="space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block font-sans">
                    Included Creations ({hamper.goodies.reduce((s, g) => s + g.quantity, 0)})
                  </span>
                  <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                    {hamper.goodies.map((goody) => (
                      <div
                        key={goody.id}
                        className="flex items-center justify-between gap-3 p-2 rounded-xl bg-stone-50 border border-stone-200/60 text-xs"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="relative w-9 h-9 rounded-lg bg-white border border-stone-200 shrink-0 p-0.5">
                            <Image src={goody.image} alt={goody.name} fill className="object-contain" />
                          </div>
                          <div className="min-w-0">
                            <h5 className="font-medium text-stone-900 truncate text-[11px]">
                              {goody.name}
                            </h5>
                            <span className="text-[10px] text-stone-500">
                              Qty: {goody.quantity}
                            </span>
                          </div>
                        </div>
                        <span className="font-serif font-bold text-stone-900 shrink-0">
                          ₹{(goody.price * goody.quantity).toLocaleString("en-IN")}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Personalization Note Preview */}
              {hamper?.personalization.giftNote && (
                <div className="p-3.5 rounded-2xl bg-[#fbf6ea] border border-[#eed08e]/60 space-y-1.5">
                  <div className="flex items-center justify-between text-[10px] uppercase tracking-wider font-bold text-[#8b5f10]">
                    <span>Handwritten Note Card</span>
                    <span>FREE</span>
                  </div>
                  <p className="text-xs text-stone-700 italic font-serif leading-relaxed line-clamp-3">
                    &ldquo;{hamper.personalization.giftNote}&rdquo;
                  </p>
                  {hamper.personalization.recipientName && (
                    <p className="text-[10px] text-stone-500 font-sans">
                      To: <strong>{hamper.personalization.recipientName}</strong>
                      {hamper.personalization.senderName && ` • From: ${hamper.personalization.senderName}`}
                    </p>
                  )}
                </div>
              )}

              {/* Coupon Form */}
              <form onSubmit={handleApplyCoupon} className="space-y-1.5 pt-2 border-t border-stone-100">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="Coupon code (e.g. SACRED10)"
                    className="flex-1 text-xs px-3 py-2 border border-stone-200 rounded-xl uppercase tracking-wider bg-white placeholder:normal-case focus:border-[#8b5f10] focus:outline-hidden"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#072515] hover:bg-[#0c3823] text-[#eed08e] text-xs font-semibold rounded-xl cursor-pointer transition-colors"
                  >
                    Apply
                  </button>
                </div>
                {appliedCoupon && (
                  <p className="text-[11px] text-emerald-700 font-medium">
                    ✓ Code &apos;{appliedCoupon}&apos; applied (-10%)
                  </p>
                )}
                {couponError && <p className="text-[11px] text-rose-600">{couponError}</p>}
              </form>

              {/* Calculations */}
              <div className="space-y-2 text-xs text-stone-600 pt-2 border-t border-stone-100 font-sans">
                <div className="flex justify-between">
                  <span>Box &amp; Goodies Subtotal</span>
                  <span className="font-semibold text-stone-900">₹{subtotal.toLocaleString("en-IN")}</span>
                </div>

                {appliedCoupon && (
                  <div className="flex justify-between text-emerald-700 font-medium">
                    <span>Sacred Blessing Discount (10%)</span>
                    <span>-₹{discountAmount.toLocaleString("en-IN")}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Handcrafted Box Packaging &amp; Zari</span>
                  <span className="text-emerald-700 font-semibold">FREE</span>
                </div>

                <div className="flex justify-between">
                  <span>Sacred Temple Shipping</span>
                  <span className="text-emerald-700 font-semibold">
                    {isFreeShipping ? "FREE" : "₹49"}
                  </span>
                </div>

                <div className="flex justify-between text-base font-bold text-stone-900 pt-3 border-t border-stone-200">
                  <span className="font-serif">Total Payable</span>
                  <span className="text-xl font-serif text-[#072515]">
                    ₹{finalTotal.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                form="checkout-gift-form"
                className="w-full py-3.5 sm:py-4 px-6 rounded-full bg-gradient-to-r from-[#072515] to-[#0c3823] hover:from-[#0a311d] hover:to-[#125032] text-[#eed08e] text-xs sm:text-sm font-bold uppercase tracking-[0.15em] shadow-lg hover:shadow-xl transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-[0.99] whitespace-nowrap"
              >
                <span>Place Order</span>
                <ArrowRight className="w-4 h-4 text-[#eed08e]" />
              </button>

              <div className="flex items-center justify-center gap-3 text-[10.5px] text-stone-500 pt-1">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  100% Quality Assured
                </span>
                <span>•</span>
                <span>Direct Doorstep Handover</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function CheckoutGiftPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-[#072515] border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <CheckoutGiftContent />
    </Suspense>
  );
}
