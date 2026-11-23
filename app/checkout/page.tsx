"use client";

import React, { useState, useEffect, useMemo, useRef, Suspense, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { useCart } from "@/lib/cart-context";
import { useProducts } from "@/lib/products-context";
import {
  ProductSKU,
  getProductById,
  createCartItemId,
} from "@/lib/products";
import {
  ShieldCheck,
  Lock,
  Check,
  Truck,
  ShoppingBag,
  Plus,
  Minus,
  Trash2,
  RotateCcw,
  Tag,
  AlertCircle,
  CreditCard,
  Banknote,
  Loader2,
  X,
  ChevronDown,
  Calendar,
} from "lucide-react";

const INDIAN_STATES = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chandigarh",
  "Chhattisgarh",
  "Delhi",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jammu and Kashmir",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
];

interface CheckoutItem {
  id: string;
  skuId?: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  customizations?: Record<string, string>;
  category?: string;
}

function getStoredCartItems(): CheckoutItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem("kurma_cart");
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter(
        (item: any) =>
          item &&
          item.id !== "init-marble-box" &&
          item.skuId !== "init-marble-box" &&
          item.name &&
          typeof item.price === "number" &&
          item.price > 0 &&
          typeof item.quantity === "number" &&
          item.quantity > 0
      )
      .map((c: any) => ({
        id: c.id,
        skuId: c.skuId,
        name: c.name,
        price: c.price,
        image: c.image || "/images/product/image.png",
        quantity: c.quantity,
        customizations: c.customizations,
        category: c.category,
      }));
  } catch {
    return [];
  }
}

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { cartItems, cartCount, setIsCartOpen, clearCart, updateQuantity, removeItem } = useCart();
  const { products, getProduct } = useProducts();

  const isCartCheckout =
    searchParams.get("from") === "cart" ||
    (!searchParams.get("productId") && !searchParams.get("id"));

  const [checkoutItems, setCheckoutItems] = useState<CheckoutItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Form Fields matching reference layout
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    country: "India",
    streetAddress: "",
    apartment: "",
    city: "",
    state: "Maharashtra",
    pincode: "",
    notes: "",
  });

  // Card information fields for card payment visualization
  const [cardInfo, setCardInfo] = useState({
    number: "",
    expiry: "",
    cvv: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [paymentMethod, setPaymentMethod] = useState<"card" | "cod">("card");
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [isValidatingCoupon, setIsValidatingCoupon] = useState(false);
  const [couponMessage, setCouponMessage] = useState<{
    text: string;
    isError: boolean;
  } | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderConfirmed, setOrderConfirmed] = useState<any | null>(null);

  // OTP Verification Modal State
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
  const [otpDigits, setOtpDigits] = useState<string[]>(["", "", "", "", "", ""]);
  const [otpError, setOtpError] = useState<string | null>(null);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [resendCountdown, setResendCountdown] = useState(30);
  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Timer countdown for resending OTP
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isOtpModalOpen && resendCountdown > 0) {
      timer = setTimeout(() => setResendCountdown((prev) => prev - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [isOtpModalOpen, resendCountdown]);

  // Initialize selected product(s) dynamically
  useEffect(() => {
    const productId = searchParams.get("productId") || searchParams.get("id");
    const isFromCart = searchParams.get("from") === "cart";
    const quantityParam = searchParams.get("quantity") || searchParams.get("qty");
    const parsedQty = Math.max(1, parseInt(quantityParam || "1", 10) || 1);

    // CASE 1: USER CAME FROM CART OR CHECKOUT WITHOUT PRODUCTID
    // Must display strictly and only the products currently in the user's cart
    if (isFromCart || !productId) {
      try {
        localStorage.removeItem("kurma_buy_now_item");
      } catch { }

      const itemsFromContext =
        cartItems && cartItems.length > 0
          ? cartItems.map((c) => ({
              id: c.id,
              skuId: c.skuId,
              name: c.name,
              price: c.price,
              image: c.image || "/images/product/image.png",
              quantity: c.quantity,
              customizations: c.customizations,
            }))
          : [];

      const itemsFromStorage = getStoredCartItems();
      const activeItems = itemsFromContext.length > 0 ? itemsFromContext : itemsFromStorage;

      setCheckoutItems(activeItems);
      setLoading(false);
      return;
    }

    // CASE 2: DIRECT SINGLE-PRODUCT "BUY NOW"
    if (productId && !isFromCart) {
      const matched = getProduct(productId) || getProductById(productId);

      let storedCustomizations: Record<string, string> | undefined = undefined;
      let storedImage: string | undefined = undefined;
      try {
        const storedBuyNow = localStorage.getItem("kurma_buy_now_item");
        if (storedBuyNow) {
          const parsed = JSON.parse(storedBuyNow);
          if (parsed && (parsed.skuId === productId || parsed.id === productId)) {
            storedCustomizations = parsed.customizations;
            storedImage = parsed.image;
          }
        }
      } catch { }

      if (matched) {
        setCheckoutItems([
          {
            id: createCartItemId(matched.id),
            skuId: matched.id,
            name: matched.name,
            price: matched.price,
            image: storedImage || matched.image,
            quantity: parsedQty,
            customizations: storedCustomizations,
            category: matched.category,
          },
        ]);
        setLoading(false);
        return;
      }
    }

    // CASE 3: NO PRODUCT SELECTED -> CLEAN EMPTY CHECKOUT
    setCheckoutItems([]);
    setLoading(false);
  }, [searchParams, products, cartItems, getProduct]);

  // Keep checkout synced if cartItems updates in context
  useEffect(() => {
    if (isCartCheckout && cartItems && cartItems.length > 0) {
      setCheckoutItems(
        cartItems.map((c) => ({
          id: c.id,
          skuId: c.skuId,
          name: c.name,
          price: c.price,
          image: c.image || "/images/product/image.png",
          quantity: c.quantity,
          customizations: c.customizations,
        }))
      );
    }
  }, [cartItems, isCartCheckout]);

  // Handle Item Quantity stepper (+ / -)
  const handleUpdateQuantity = (id: string, delta: number) => {
    setCheckoutItems((prev) => {
      const nextItems = prev
        .map((item) => {
          if (item.id === id) {
            const nextQty = item.quantity + delta;
            return nextQty > 0 ? { ...item, quantity: nextQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CheckoutItem[];

      if (isCartCheckout) {
        updateQuantity(id, delta);
        try {
          localStorage.setItem("kurma_cart", JSON.stringify(nextItems));
        } catch { }
      }

      return nextItems;
    });
  };

  const handleRemoveItem = (id: string) => {
    setCheckoutItems((prev) => {
      const nextItems = prev.filter((item) => item.id !== id);
      if (isCartCheckout) {
        removeItem(id);
        try {
          localStorage.setItem("kurma_cart", JSON.stringify(nextItems));
        } catch { }
      }
      return nextItems;
    });
  };

  // Calculations
  const subtotal = useMemo(() => {
    return checkoutItems.reduce((acc, it) => acc + it.price * it.quantity, 0);
  }, [checkoutItems]);

  const shippingFee = 0; // Free Pan-India insured delivery
  const grandTotal = Math.max(0, subtotal + shippingFee - couponDiscount);

  // Abandoned Checkout tracking state
  const [abandonedCheckoutId, setAbandonedCheckoutId] = useState<string | null>(() => {
    if (typeof window !== "undefined") {
      return sessionStorage.getItem("kurma_active_abandoned_id");
    }
    return null;
  });

  // Track customer checkout progress
  const syncAbandonedCheckout = useCallback(
    async (overrideData?: typeof formData) => {
      if (orderConfirmed || checkoutItems.length === 0) return;

      const currentForm = overrideData || formData;
      const completeStreetAddress = currentForm.apartment.trim()
        ? `${currentForm.streetAddress.trim()}, ${currentForm.apartment.trim()}`
        : currentForm.streetAddress.trim();

      const payload = {
        checkoutId:
          abandonedCheckoutId ||
          (typeof window !== "undefined"
            ? sessionStorage.getItem("kurma_active_abandoned_id")
            : null),
        customerName: currentForm.fullName.trim() || "Guest Patron",
        customerEmail: currentForm.email.trim().toLowerCase(),
        customerPhone: currentForm.phone.trim(),
        city: currentForm.city.trim()
          ? `${currentForm.city.trim()}, ${currentForm.state.trim()}`
          : "Online Storefront",
        shippingAddress: {
          fullName: currentForm.fullName.trim(),
          phone: currentForm.phone.trim(),
          street: completeStreetAddress,
          city: currentForm.city.trim(),
          state: currentForm.state.trim(),
          pincode: currentForm.pincode.trim(),
          country: currentForm.country,
          fullAddress: completeStreetAddress
            ? `${completeStreetAddress}, ${currentForm.city.trim()}, ${currentForm.state.trim()}`
            : "",
        },
        items: checkoutItems.map((item) => ({
          productId: item.skuId || item.id,
          sku: item.skuId || item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
          customizations: item.customizations || null,
        })),
        totalAmount: grandTotal,
      };

      try {
        const res = await fetch("/api/checkout/abandoned", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (data.success && data.checkoutId) {
          setAbandonedCheckoutId(data.checkoutId);
          try {
            sessionStorage.setItem("kurma_active_abandoned_id", data.checkoutId);
          } catch {}
        }
      } catch (trackErr) {
        console.warn("Abandoned checkout tracking background sync failed:", trackErr);
      }
    },
    [checkoutItems, formData, grandTotal, orderConfirmed, abandonedCheckoutId]
  );

  // Auto-sync abandoned checkout whenever customer details or items change
  useEffect(() => {
    if (orderConfirmed || checkoutItems.length === 0) return;

    // Trigger debounced tracking when customer has items and interacts with checkout
    const hasAnyInfo =
      Boolean(formData.fullName.trim()) ||
      Boolean(formData.email.trim()) ||
      Boolean(formData.phone.trim()) ||
      Boolean(formData.streetAddress.trim());

    if (hasAnyInfo) {
      const timer = setTimeout(() => {
        syncAbandonedCheckout();
      }, 1200);

      return () => clearTimeout(timer);
    }
  }, [
    formData.fullName,
    formData.email,
    formData.phone,
    formData.streetAddress,
    formData.city,
    checkoutItems,
    syncAbandonedCheckout,
    orderConfirmed,
  ]);

  // Track on page unload / navigation if order not completed
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (orderConfirmed || checkoutItems.length === 0) return;
      const completeStreetAddress = formData.apartment.trim()
        ? `${formData.streetAddress.trim()}, ${formData.apartment.trim()}`
        : formData.streetAddress.trim();

      const payload = {
        checkoutId:
          abandonedCheckoutId ||
          (typeof window !== "undefined"
            ? sessionStorage.getItem("kurma_active_abandoned_id")
            : null),
        customerName: formData.fullName.trim() || "Guest Patron",
        customerEmail: formData.email.trim().toLowerCase(),
        customerPhone: formData.phone.trim(),
        city: formData.city.trim()
          ? `${formData.city.trim()}, ${formData.state.trim()}`
          : "Online Storefront",
        shippingAddress: {
          fullName: formData.fullName.trim(),
          phone: formData.phone.trim(),
          street: completeStreetAddress,
          city: formData.city.trim(),
          state: formData.state.trim(),
          pincode: formData.pincode.trim(),
          country: formData.country,
        },
        items: checkoutItems.map((item) => ({
          productId: item.skuId || item.id,
          sku: item.skuId || item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
          customizations: item.customizations || null,
        })),
        totalAmount: grandTotal,
      };

      try {
        fetch("/api/checkout/abandoned", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
          keepalive: true,
        });
      } catch {}
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [abandonedCheckoutId, checkoutItems, formData, grandTotal, orderConfirmed]);

  // Coupon handling with real backend validation against database
  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    setCouponMessage(null);
    const code = couponCode.trim().toUpperCase();

    if (!code) {
      setCouponMessage({ text: "Please enter a voucher code", isError: true });
      return;
    }

    setIsValidatingCoupon(true);

    try {
      const res = await fetch("/api/discounts/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code,
          items: checkoutItems,
          subtotal,
          customerEmail: formData.email.trim(),
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setCouponDiscount(data.discountAmount || 0);
        setAppliedCoupon(data.code);
        setCouponMessage({
          text: data.message || `Voucher ${data.code} applied! ₹${(data.discountAmount || 0).toLocaleString("en-IN")} saved`,
          isError: false,
        });
      } else {
        setCouponDiscount(0);
        setAppliedCoupon(null);
        setCouponMessage({
          text: data.error || `Invalid voucher code "${code}".`,
          isError: true,
        });
      }
    } catch (err) {
      console.error("Coupon validation error:", err);
      setCouponMessage({
        text: "Unable to validate coupon. Please check your network connection.",
        isError: true,
      });
    } finally {
      setIsValidatingCoupon(false);
    }
  };

  // Automatically revalidate applied coupon if user adjusts quantities or items change
  useEffect(() => {
    if (!appliedCoupon) return;

    let isCurrent = true;
    fetch("/api/discounts/validate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        code: appliedCoupon,
        items: checkoutItems,
        subtotal,
        customerEmail: formData.email.trim(),
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (!isCurrent) return;
        if (data.success) {
          setCouponDiscount(data.discountAmount || 0);
          setCouponMessage({
            text: data.message || `Voucher ${data.code} applied! ₹${(data.discountAmount || 0).toLocaleString("en-IN")} saved`,
            isError: false,
          });
        } else {
          setAppliedCoupon(null);
          setCouponDiscount(0);
          setCouponMessage({
            text: data.error || `Voucher ${appliedCoupon} is no longer applicable to your order.`,
            isError: true,
          });
        }
      })
      .catch(() => { });

    return () => {
      isCurrent = false;
    };
  }, [subtotal, checkoutItems]);

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponDiscount(0);
    setCouponCode("");
    setCouponMessage(null);
  };

  // Validation
  const validateForm = () => {
    const errs: Record<string, string> = {};

    if (!formData.fullName.trim()) {
      errs.fullName = "Please enter your full name";
    }

    if (!formData.email.trim()) {
      errs.email = "Email address is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errs.email = "Please enter a valid email address";
    }

    const cleanPhone = formData.phone.replace(/[^0-9]/g, "");
    if (!cleanPhone) {
      errs.phone = "Phone number is required";
    } else if (cleanPhone.length < 10) {
      errs.phone = "Please enter a valid 10-digit mobile number";
    }

    if (!formData.streetAddress.trim()) {
      errs.streetAddress = "Please provide your street address";
    }

    if (!formData.city.trim()) {
      errs.city = "City is required";
    }

    const cleanPin = formData.pincode.replace(/[^0-9]/g, "");
    if (!cleanPin) {
      errs.pincode = "PIN / Postal code is required";
    } else if (cleanPin.length !== 6) {
      errs.pincode = "Please enter a valid 6-digit postal code";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // Step 1: Initiate Order Placement & Trigger OTP Popup
  const handleInitiateOrder = (e: React.FormEvent) => {
    e.preventDefault();

    if (checkoutItems.length === 0) {
      alert("No products in checkout. Please select a product to continue.");
      return;
    }

    if (!validateForm()) {
      const firstError = document.getElementById("checkout-form-container");
      if (firstError) {
        firstError.scrollIntoView({ behavior: "smooth" });
      }
      return;
    }

    // Form is valid: open OTP verification popup
    setOtpDigits(["", "", "", "", "", ""]);
    setOtpError(null);
    setResendCountdown(30);
    setIsOtpModalOpen(true);

    setTimeout(() => {
      otpInputRefs.current[0]?.focus();
    }, 120);
  };

  // OTP Input & Paste Handlers
  const handleOtpChange = (index: number, val: string) => {
    const clean = val.replace(/[^0-9]/g, "");

    if (clean.length > 1) {
      const pasted = clean.slice(0, 6).split("");
      const next = [...otpDigits];
      for (let i = 0; i < pasted.length; i++) {
        if (index + i < 6) next[index + i] = pasted[i];
      }
      setOtpDigits(next);
      setOtpError(null);
      const nextFocus = Math.min(index + pasted.length, 5);
      otpInputRefs.current[nextFocus]?.focus();
      return;
    }

    const next = [...otpDigits];
    next[index] = clean ? clean.slice(-1) : "";
    setOtpDigits(next);
    setOtpError(null);

    if (clean && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otpDigits[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowLeft" && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    } else if (e.key === "Enter") {
      e.preventDefault();
      handleVerifyOtpAndPlaceOrder();
    }
  };

  // Step 2: Verify OTP & Finalize Order (validation removed: accept any entered OTP)
  const handleVerifyOtpAndPlaceOrder = async () => {
    setIsVerifyingOtp(true);
    setOtpError(null);

    await executeFinalizeOrder();
  };

  // Step 3: Save order to backend & database
  const executeFinalizeOrder = async () => {
    setIsSubmitting(true);

    const randomSuffix = Math.floor(10000 + Math.random() * 90000);
    const generatedOrderNumber = `KURMA-${randomSuffix}`;

    const completeStreetAddress = formData.apartment.trim()
      ? `${formData.streetAddress.trim()}, ${formData.apartment.trim()}`
      : formData.streetAddress.trim();

    const orderPayload = {
      abandonedCheckoutId:
        abandonedCheckoutId ||
        (typeof window !== "undefined"
          ? sessionStorage.getItem("kurma_active_abandoned_id")
          : null),
      orderNumber: generatedOrderNumber,
      customerName: formData.fullName.trim(),
      customerEmail: formData.email.trim().toLowerCase(),
      customerPhone: formData.phone.trim(),
      city: `${formData.city.trim()}, ${formData.state.trim()}`,
      totalAmount: grandTotal,
      couponCode: appliedCoupon || null,
      discountAmount: couponDiscount,
      paymentMethod: paymentMethod === "cod" ? "Cash on Delivery" : "Debit / Credit / UPI",
      paymentStatus: paymentMethod === "cod" ? "Payment pending" : "Paid",
      fulfillmentStatus: "Processing",
      channel: "Online Storefront",
      carrier: "BlueDart Express",
      shippingAddress: {
        fullName: formData.fullName.trim(),
        phone: formData.phone.trim(),
        street: completeStreetAddress,
        city: formData.city.trim(),
        state: formData.state.trim(),
        pincode: formData.pincode.trim(),
        country: formData.country,
        fullAddress: `${completeStreetAddress}, ${formData.city.trim()}, ${formData.state.trim()} - ${formData.pincode.trim()}`,
      },
      notes: formData.notes.trim() || "Express order",
      items: checkoutItems.map((item) => ({
        productId: item.skuId || item.id,
        sku: item.skuId || item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image,
        customizations: item.customizations || null,
      })),
    };

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderPayload),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        try {
          localStorage.removeItem("kurma_buy_now_item");
        } catch { }

        if (isCartCheckout) {
          clearCart();
          try {
            localStorage.removeItem("kurma_cart");
          } catch { }
        }

        try {
          sessionStorage.removeItem("kurma_active_abandoned_id");
        } catch { }

        setIsOtpModalOpen(false);
        setOrderConfirmed({
          orderNumber: generatedOrderNumber,
          customerName: formData.fullName.trim(),
          customerEmail: formData.email.trim(),
          customerPhone: formData.phone.trim(),
          address: `${completeStreetAddress}, ${formData.city.trim()}, ${formData.state.trim()} - ${formData.pincode.trim()}`,
          total: grandTotal,
          paymentMethod: paymentMethod === "cod" ? "Cash on Delivery" : "Debit / Credit / UPI",
          items: checkoutItems,
        });
      } else {
        setOtpError(data.error || "Could not complete order. Please try again.");
      }
    } catch (err: any) {
      console.error("Error creating order:", err);
      setOtpError("Network error while submitting order. Please check your connection.");
    } finally {
      setIsVerifyingOtp(false);
      setIsSubmitting(false);
    }
  };

  // ORDER CONFIRMED VIEW
  if (orderConfirmed) {
    return (
      <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-stone-900 selection:bg-[#eed08e] selection:text-[#072515]">
        <Navbar cartCount={cartCount} onOpenCart={() => setIsCartOpen(true)} />

        <main className="flex-1 max-w-3xl w-full mx-auto px-4 sm:px-6 py-12 sm:py-16">
          <div className="bg-white rounded-3xl border border-[#eed08e]/50 shadow-xl p-6 sm:p-10 text-center space-y-6">
            <div className="size-20 bg-[#28513B] text-white rounded-full flex items-center justify-center mx-auto shadow-lg ring-4 ring-[#28513B]/20">
              <Check className="size-10 stroke-[2.5]" />
            </div>

            <div className="space-y-2">
              <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-[#072515] font-bold">
                Thank You, {orderConfirmed.customerName}
              </h1>
              <p className="text-xs sm:text-sm text-stone-600 max-w-md mx-auto">
                Your sacred order has been safely placed and transmitted to the Kurma Atelier for ritual dispatch.
              </p>
            </div>

            {/* Order Ref Banner */}
            <div className="bg-[#FAF8F5] rounded-2xl p-4 border border-[#c89e43]/30 flex flex-col sm:flex-row items-center justify-between gap-3 text-left">
              <div>
                <span className="text-[10px] uppercase font-bold text-stone-500 block">
                  Order Reference ID
                </span>
                <span className="font-mono text-base font-bold text-[#072515]">
                  {orderConfirmed.orderNumber}
                </span>
              </div>
              <div className="sm:text-right">
                <span className="text-[10px] uppercase font-bold text-stone-500 block">
                  Logistics Carrier
                </span>
                <span className="text-xs font-semibold text-stone-800 flex items-center gap-1.5">
                  <Truck className="size-3.5 text-[#c0881b]" /> BlueDart Express (Air Priority)
                </span>
              </div>
            </div>

            {/* Order Summary Recap */}
            <div className="border border-stone-200 rounded-2xl divide-y divide-stone-100 overflow-hidden text-left bg-stone-50/50">
              <div className="p-4 bg-stone-100/60 font-semibold text-xs text-[#072515] flex justify-between items-center">
                <span>Selected Sacred Creations</span>
                <span>Qty</span>
              </div>
              {orderConfirmed.items.map((it: CheckoutItem) => (
                <div key={it.id} className="p-3.5 sm:p-4 flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-3">
                    <div className="relative size-12 rounded-lg overflow-hidden bg-white border border-stone-200 shrink-0">
                      <Image src={it.image} alt={it.name} fill className="object-contain p-1" />
                    </div>
                    <div>
                      <p className="font-semibold text-stone-900">{it.name}</p>
                      <p className="text-[11px] text-[#c0881b] font-medium">₹{it.price.toLocaleString("en-IN")}</p>
                    </div>
                  </div>
                  <span className="font-bold text-stone-800">x{it.quantity}</span>
                </div>
              ))}
              <div className="p-4 bg-white flex justify-between items-center text-sm font-bold text-[#072515]">
                <span>Total Amount</span>
                <span>₹{orderConfirmed.total.toLocaleString("en-IN")}</span>
              </div>
            </div>

            {/* Delivery Destination */}
            <div className="bg-[#FAF8F5] rounded-xl p-4 text-left border border-stone-200 text-xs text-stone-700 space-y-1">
              <span className="text-[10px] uppercase font-bold text-stone-500 block">
                Delivery Destination
              </span>
              <p className="font-semibold text-stone-900">{orderConfirmed.customerName} ({orderConfirmed.customerPhone})</p>
              <p className="text-stone-600">{orderConfirmed.address}</p>
              <p className="text-[11px] text-stone-500 pt-1">
                Payment Mode: <strong className="text-stone-800">{orderConfirmed.paymentMethod}</strong>
              </p>
            </div>

            {/* Action CTAs */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href={`/track-order?orderNumber=${encodeURIComponent(orderConfirmed.orderNumber)}`}
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-[#28513B] hover:bg-[#28513B]/90 text-white text-xs font-bold uppercase tracking-wider transition-all shadow-md flex items-center justify-center"
              >
                <span>Track Your Consignment</span>
              </Link>
              <Link
                href="/shop"
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl border border-stone-300 hover:bg-stone-50 text-stone-800 text-xs font-semibold uppercase tracking-wider transition-all"
              >
                Return to Storefront
              </Link>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  // EMPTY CHECKOUT VIEW
  if (!loading && checkoutItems.length === 0) {
    return (
      <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-stone-900 selection:bg-[#eed08e] selection:text-[#072515]">
        <Navbar cartCount={cartCount} onOpenCart={() => setIsCartOpen(true)} />

        <main className="flex-1 max-w-lg w-full mx-auto px-4 py-16 text-center space-y-6">
          <div className="size-20 bg-[#FAF8F5] text-[#c0881b] border border-[#c89e43]/40 rounded-full flex items-center justify-center mx-auto shadow-xs">
            <ShoppingBag className="size-9 stroke-[1.4]" />
          </div>

          <div className="space-y-2">
            <h1 className="font-serif text-2xl sm:text-3xl text-[#072515] font-bold">
              Your Checkout is Empty
            </h1>
            <p className="text-xs sm:text-sm text-stone-600 max-w-sm mx-auto leading-relaxed">
              No creation has been selected for instant checkout. Please select a product from our sanctuary collection.
            </p>
          </div>

          <div className="pt-2">
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 px-7 py-3.5 bg-[#28513B] hover:bg-[#28513B]/90 text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-md transition-all"
            >
              <span>Explore Products</span>
            </Link>
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-stone-900 selection:bg-[#eed08e] selection:text-[#072515]">
      <Navbar cartCount={cartCount} onOpenCart={() => setIsCartOpen(true)} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* 2-Column Responsive Layout matching Reference Screenshots */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* ================================================================= */}
          {/* LEFT COLUMN: SECURE CHECKOUT FORM (7 COLS)                        */}
          {/* ================================================================= */}
          <div className="lg:col-span-7" id="checkout-form-container">
            <div className="bg-white rounded-3xl border border-stone-200/80 shadow-xs p-6 sm:p-8 space-y-8">
              {/* Card Header */}
              <div>
                <h1 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
                  Secure Checkout
                </h1>
                <p className="text-xs sm:text-sm text-stone-500 mt-1">
                  Complete your order safely with our encrypted payment system.
                </p>
              </div>

              <form onSubmit={handleInitiateOrder} id="main-checkout-form" className="space-y-8">
                {/* 1. Contact Info Section */}
                <div className="space-y-4">
                  <h2 className="text-base sm:text-lg font-bold text-stone-900">
                    Contact Info
                  </h2>

                  <div className="space-y-3.5">
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                        Email Address <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="Enter your email"
                        value={formData.email}
                        onChange={(e) => {
                          setFormData({ ...formData, email: e.target.value });
                          if (errors.email) setErrors({ ...errors, email: "" });
                        }}
                        className={`w-full px-4 py-3 rounded-xl border text-xs sm:text-sm outline-none transition bg-white ${errors.email
                          ? "border-red-500 focus:border-red-500"
                          : "border-stone-200 hover:border-stone-300 focus:border-[#072515]"
                          }`}
                      />
                      {errors.email && (
                        <p className="text-[11px] text-red-600 mt-1 flex items-center gap-1">
                          <AlertCircle className="size-3" /> {errors.email}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                        Phone Number <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="Enter your phone number"
                        value={formData.phone}
                        onChange={(e) => {
                          const val = e.target.value.replace(/[^0-9]/g, "");
                          setFormData({ ...formData, phone: val });
                          if (errors.phone) setErrors({ ...errors, phone: "" });
                        }}
                        className={`w-full px-4 py-3 rounded-xl border text-xs sm:text-sm outline-none transition bg-white ${errors.phone
                          ? "border-red-500 focus:border-red-500"
                          : "border-stone-200 hover:border-stone-300 focus:border-[#072515]"
                          }`}
                      />
                      {errors.phone && (
                        <p className="text-[11px] text-red-600 mt-1 flex items-center gap-1">
                          <AlertCircle className="size-3" /> {errors.phone}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* 2. Delivery Address Section */}
                <div className="space-y-4 pt-2 border-t border-stone-100">
                  <h2 className="text-base sm:text-lg font-bold text-stone-900">
                    Delivery Address
                  </h2>

                  <div className="space-y-3.5">
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Enter your full name"
                        value={formData.fullName}
                        onChange={(e) => {
                          setFormData({ ...formData, fullName: e.target.value });
                          if (errors.fullName) setErrors({ ...errors, fullName: "" });
                        }}
                        className={`w-full px-4 py-3 rounded-xl border text-xs sm:text-sm outline-none transition bg-white ${errors.fullName
                          ? "border-red-500 focus:border-red-500"
                          : "border-stone-200 hover:border-stone-300 focus:border-[#072515]"
                          }`}
                      />
                      {errors.fullName && (
                        <p className="text-[11px] text-red-600 mt-1 flex items-center gap-1">
                          <AlertCircle className="size-3" /> {errors.fullName}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                        Country / Region
                      </label>
                      <div className="relative">
                        <select
                          value={formData.country}
                          onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                          className="w-full appearance-none px-4 py-3 rounded-xl border border-stone-200 hover:border-stone-300 text-xs sm:text-sm outline-none bg-white focus:border-[#072515] transition cursor-pointer pr-10"
                        >
                          <option value="India">India</option>
                          <option value="United States">United States</option>
                          <option value="United Kingdom">United Kingdom</option>
                          <option value="United Arab Emirates">United Arab Emirates</option>
                          <option value="Singapore">Singapore</option>
                        </select>
                        <ChevronDown className="size-4 text-stone-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                        Street Address <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Enter your address"
                        value={formData.streetAddress}
                        onChange={(e) => {
                          setFormData({ ...formData, streetAddress: e.target.value });
                          if (errors.streetAddress) setErrors({ ...errors, streetAddress: "" });
                        }}
                        className={`w-full px-4 py-3 rounded-xl border text-xs sm:text-sm outline-none transition bg-white ${errors.streetAddress
                          ? "border-red-500 focus:border-red-500"
                          : "border-stone-200 hover:border-stone-300 focus:border-[#072515]"
                          }`}
                      />
                      {errors.streetAddress && (
                        <p className="text-[11px] text-red-600 mt-1 flex items-center gap-1">
                          <AlertCircle className="size-3" /> {errors.streetAddress}
                        </p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <div>
                        <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                          City <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="Enter your city"
                          value={formData.city}
                          onChange={(e) => {
                            setFormData({ ...formData, city: e.target.value });
                            if (errors.city) setErrors({ ...errors, city: "" });
                          }}
                          className={`w-full px-4 py-3 rounded-xl border text-xs sm:text-sm outline-none transition bg-white ${errors.city
                            ? "border-red-500 focus:border-red-500"
                            : "border-stone-200 hover:border-stone-300 focus:border-[#072515]"
                            }`}
                        />
                        {errors.city && (
                          <p className="text-[11px] text-red-600 mt-1 flex items-center gap-1">
                            <AlertCircle className="size-3" /> {errors.city}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                          Postal Code <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          maxLength={6}
                          placeholder="Enter zip/postal code"
                          value={formData.pincode}
                          onChange={(e) => {
                            const val = e.target.value.replace(/[^0-9]/g, "");
                            setFormData({ ...formData, pincode: val });
                            if (errors.pincode) setErrors({ ...errors, pincode: "" });
                          }}
                          className={`w-full px-4 py-3 rounded-xl border text-xs sm:text-sm outline-none transition bg-white ${errors.pincode
                            ? "border-red-500 focus:border-red-500"
                            : "border-stone-200 hover:border-stone-300 focus:border-[#072515]"
                            }`}
                        />
                        {errors.pincode && (
                          <p className="text-[11px] text-red-600 mt-1 flex items-center gap-1">
                            <AlertCircle className="size-3" /> {errors.pincode}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* 3. Payment Method Section */}
                <div className="space-y-4 pt-2 border-t border-stone-100">
                  <h2 className="text-base sm:text-lg font-bold text-stone-900">
                    Payment Method
                  </h2>

                  {/* 2 Toggle Tabs: Debit/Credit Card vs Bank/Cash */}
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod("card")}
                      className={`p-4 rounded-xl border-2 flex items-center justify-center gap-2.5 transition cursor-pointer text-sm font-semibold ${paymentMethod === "card"
                        ? "bg-[#28513B] text-white border-[#28513B] shadow-xs"
                        : "bg-white text-stone-700 border-stone-200 hover:border-stone-300"
                        }`}
                    >
                      <CreditCard className="size-4 shrink-0" />
                      <span>Debit / Credit Card</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod("cod")}
                      className={`p-4 rounded-xl border-2 flex items-center justify-center gap-2.5 transition cursor-pointer text-sm font-semibold ${paymentMethod === "cod"
                        ? "bg-[#28513B] text-white border-[#28513B] shadow-xs"
                        : "bg-white text-stone-700 border-stone-200 hover:border-stone-300"
                        }`}
                    >
                      <Banknote className="size-4 shrink-0" />
                      <span>Cash on Delivery</span>
                    </button>
                  </div>

                  {/* Card Information Sub-Form when Card is selected */}
                  {paymentMethod === "card" && (
                    <div className="space-y-3.5 pt-2 animate-in fade-in duration-200">
                      <h3 className="text-xs sm:text-sm font-semibold text-stone-800">
                        Card Information
                      </h3>

                      <div>
                        <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                          Card Number
                        </label>
                        <input
                          type="text"
                          placeholder="Input card number"
                          value={cardInfo.number}
                          onChange={(e) => setCardInfo({ ...cardInfo, number: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl border border-stone-200 hover:border-stone-300 text-xs sm:text-sm outline-none bg-white focus:border-[#072515] transition"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3.5">
                        <div>
                          <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                            Expiration Date
                          </label>
                          <div className="relative">
                            <input
                              type="text"
                              placeholder="Select date"
                              value={cardInfo.expiry}
                              onChange={(e) => setCardInfo({ ...cardInfo, expiry: e.target.value })}
                              className="w-full px-4 py-3 rounded-xl border border-stone-200 hover:border-stone-300 text-xs sm:text-sm outline-none bg-white focus:border-[#072515] transition pr-10"
                            />
                            <Calendar className="size-4 text-stone-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                            Security Code (CVV)
                          </label>
                          <input
                            type="password"
                            maxLength={4}
                            placeholder="Enter Security Code (CVV)"
                            value={cardInfo.cvv}
                            onChange={(e) => setCardInfo({ ...cardInfo, cvv: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl border border-stone-200 hover:border-stone-300 text-xs sm:text-sm outline-none bg-white focus:border-[#072515] transition"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Cash on Delivery Notice when COD is selected */}
                  {paymentMethod === "cod" && (
                    <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-600 space-y-1 animate-in fade-in duration-200">
                      <p className="font-semibold text-stone-900">Cash on Delivery (COD) Selected</p>
                      <p>Pay comfortably via cash or UPI upon delivery by BlueDart express courier.</p>
                    </div>
                  )}
                </div>

                {/* Hidden submit trigger */}
                <button type="submit" className="hidden" aria-hidden="true" />
              </form>
            </div>
          </div>

          {/* ================================================================= */}
          {/* RIGHT COLUMN: STACKED CARDS MATCHING REFERENCE (5 COLS)           */}
          {/* ================================================================= */}
          <div className="lg:col-span-5 space-y-5">
            {/* CARD 1: ORDER OVERVIEW */}
            <div className="bg-white rounded-3xl border border-stone-200/80 shadow-xs p-5 sm:p-6 space-y-4">
              <div>
                <h2 className="font-serif text-lg sm:text-xl font-bold text-stone-900">
                  Order Overview
                </h2>
                <p className="text-xs text-stone-500 mt-0.5">
                  {checkoutItems.reduce((acc, it) => acc + it.quantity, 0)} Item
                  {checkoutItems.reduce((acc, it) => acc + it.quantity, 0) !== 1 ? "s" : ""} in Your Order
                </p>
              </div>

              {/* Items List */}
              <div className="space-y-4 divide-y divide-stone-100 max-h-[380px] overflow-y-auto pr-1">
                {checkoutItems.map((item) => (
                  <div key={item.id} className="pt-4 first:pt-0 flex gap-4 items-center">
                    {/* Square Thumbnail */}
                    <div className="relative size-20 rounded-2xl overflow-hidden bg-[#FAF8F5] border border-stone-200/80 shrink-0">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-contain p-2"
                      />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0 space-y-1">
                      <h3 className="text-xs sm:text-sm font-semibold text-stone-900 leading-snug line-clamp-1">
                        {item.name}
                      </h3>
                      <p className="text-sm font-bold text-stone-900">
                        ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                      </p>

                      <div className="flex items-center gap-3 pt-1">
                        {/* Stepper */}
                        <div className="flex items-center border border-stone-200 rounded-lg bg-stone-50 overflow-hidden">
                          <button
                            type="button"
                            onClick={() => handleUpdateQuantity(item.id, -1)}
                            className="px-2 py-0.5 text-stone-600 hover:bg-stone-200 transition text-xs font-bold"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="size-3" />
                          </button>
                          <span className="px-2 text-xs font-semibold text-stone-800 min-w-4 text-center">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleUpdateQuantity(item.id, 1)}
                            className="px-2 py-0.5 text-stone-600 hover:bg-stone-200 transition text-xs font-bold"
                            aria-label="Increase quantity"
                          >
                            <Plus className="size-3" />
                          </button>
                        </div>

                        {/* Remove Button */}
                        {checkoutItems.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveItem(item.id)}
                            className="inline-flex items-center gap-1 text-[11px] font-medium text-stone-500 hover:text-red-600 transition cursor-pointer"
                          >
                            <Trash2 className="size-3" />
                            <span>Remove</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* CARD 2: HAVE A DISCOUNT CODE? */}
            <div className="bg-white rounded-3xl border border-stone-200/80 shadow-xs p-5 sm:p-6 space-y-3">
              <div>
                <h2 className="font-serif text-base sm:text-lg font-bold text-stone-900">
                  Have a Discount Code?
                </h2>
                <p className="text-xs text-stone-500 mt-0.5">
                  Apply your promo or membership code to unlock savings.
                </p>
              </div>

              <form onSubmit={handleApplyCoupon} className="flex gap-2 pt-1">
                <input
                  type="text"
                  placeholder="write your promo code"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-stone-200 bg-stone-50/60 text-xs sm:text-sm uppercase outline-none focus:bg-white focus:border-[#072515] transition"
                />
                <button
                  type="submit"
                  disabled={isValidatingCoupon}
                  className="px-5 py-2.5 rounded-xl bg-[#28513B] hover:bg-[#28513B]/90 disabled:opacity-50 text-white text-xs font-semibold uppercase tracking-wider transition cursor-pointer min-w-[75px] flex items-center justify-center"
                >
                  {isValidatingCoupon ? (
                    <Loader2 className="size-3.5 animate-spin text-white" />
                  ) : (
                    "Apply"
                  )}
                </button>
              </form>

              {couponMessage && (
                <p
                  className={`text-[11px] mt-1 flex items-center justify-between ${couponMessage.isError ? "text-red-600" : "text-emerald-700 font-medium"
                    }`}
                >
                  <span>{couponMessage.text}</span>
                  {appliedCoupon && (
                    <button
                      type="button"
                      onClick={handleRemoveCoupon}
                      className="text-[10px] text-stone-500 hover:text-red-600 underline cursor-pointer ml-2"
                    >
                      Remove
                    </button>
                  )}
                </p>
              )}
            </div>

            {/* ORDER SUMMARY & PLACE ORDER BUTTON */}
            <div className="bg-white rounded-3xl border border-stone-200/80 shadow-xs p-5 sm:p-6 space-y-4">
              <h2 className="font-serif text-base sm:text-lg font-bold text-stone-900">
                Order Summary
              </h2>

              <div className="space-y-2.5 text-xs sm:text-sm">
                <div className="flex justify-between text-stone-600">
                  <span>Subtotal</span>
                  <span className="font-semibold text-stone-900">
                    ₹{subtotal.toLocaleString("en-IN")}
                  </span>
                </div>

                <div className="flex justify-between text-stone-600">
                  <span>Delivery</span>
                  <span className="font-semibold text-emerald-700 uppercase">
                    Free
                  </span>
                </div>

                {couponDiscount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-semibold bg-emerald-50/60 p-2 rounded-lg border border-emerald-100">
                    <span>Discount ({appliedCoupon})</span>
                    <span>- ₹{couponDiscount.toLocaleString("en-IN")}</span>
                  </div>
                )}

                <div className="border-t border-stone-200 pt-3 flex justify-between items-baseline">
                  <span className="text-base font-bold text-stone-900">Total</span>
                  <span className="font-serif text-xl font-bold text-[#072515]">
                    ₹{grandTotal.toLocaleString("en-IN")}
                  </span>
                </div>
                <p className="text-[10px] text-stone-400 text-right">
                  Inclusive of all taxes & packaging
                </p>
              </div>

              {/* PLACE ORDER BUTTON - Color #28513B & White Text */}
              <button
                type="submit"
                form="main-checkout-form"
                onClick={handleInitiateOrder}
                disabled={isSubmitting || isOtpModalOpen}
                className="w-full py-4 px-6 rounded-xl bg-[#28513B] hover:bg-[#28513B]/90 text-white text-sm sm:text-base font-bold uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75 mt-2"
              >
                {isSubmitting ? (
                  <>
                    <RotateCcw className="size-4 animate-spin text-white" />
                    <span>Securing Your Sacred Order...</span>
                  </>
                ) : (
                  <>
                    <Lock className="size-4 text-white" />
                    <span>Place Order • ₹{grandTotal.toLocaleString("en-IN")}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* ==================================================================== */}
        {/* OTP VERIFICATION POPUP MODAL (Consistent Kurma Luxury Design)        */}
        {/* ==================================================================== */}
        {isOtpModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-stone-900/65 backdrop-blur-xs animate-in fade-in duration-200">
            <div className="w-full max-w-md bg-white rounded-3xl border border-[#eed08e]/70 shadow-2xl p-6 sm:p-8 space-y-6 relative animate-in zoom-in-95 duration-200">
              {/* Close Button */}
              <button
                type="button"
                onClick={() => {
                  if (!isVerifyingOtp) {
                    try {
          sessionStorage.removeItem("kurma_active_abandoned_id");
        } catch { }

        setIsOtpModalOpen(false);
                    setOtpError(null);
                  }
                }}
                disabled={isVerifyingOtp}
                className="absolute top-4 right-4 p-2 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition disabled:opacity-40 cursor-pointer"
                aria-label="Close OTP popup"
              >
                <X className="size-4" />
              </button>

              {/* Header */}
              <div className="text-center space-y-1.5 pt-1">
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#072515]">
                  Order Verification
                </h3>
                <p className="text-xs text-stone-600 max-w-xs mx-auto leading-relaxed">
                  Enter the 6-digit verification code sent to{" "}
                  <strong className="text-stone-900 font-semibold break-all">
                    {formData.email || "your email address"}
                  </strong>
                </p>
              </div>

              {/* 6 Digit Input Boxes */}
              <div className="space-y-3">
                <div className="grid grid-cols-6 gap-2 sm:gap-2.5">
                  {otpDigits.map((digit, idx) => (
                    <input
                      key={idx}
                      ref={(el) => {
                        otpInputRefs.current[idx] = el;
                      }}
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(idx, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                      disabled={isVerifyingOtp}
                      className={`h-12 sm:h-14 text-center text-lg sm:text-xl font-bold font-mono rounded-xl border-2 transition-all outline-none ${digit
                        ? "border-[#072515] bg-white ring-2 ring-[#eed08e]/30 text-[#072515]"
                        : "border-stone-200 bg-[#FAF8F5] text-stone-800 focus:border-[#072515] focus:bg-white"
                        } ${otpError ? "border-red-500 focus:border-red-500" : ""}`}
                    />
                  ))}
                </div>

                {/* Error Message */}
                {otpError && (
                  <p className="text-[11px] text-red-600 font-medium flex items-center justify-center gap-1.5 animate-in fade-in">
                    <AlertCircle className="size-3.5 shrink-0" />
                    <span>{otpError}</span>
                  </p>
                )}
              </div>

              {/* CTA Buttons */}
              <div className="space-y-2.5">
                <button
                  type="button"
                  onClick={handleVerifyOtpAndPlaceOrder}
                  disabled={isVerifyingOtp}
                  className="w-full py-3.5 px-6 rounded-xl bg-[#28513B] hover:bg-[#28513B]/90 text-white text-xs sm:text-sm font-bold uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
                >
                  {isVerifyingOtp ? (
                    <>
                      <Loader2 className="size-4 animate-spin text-white" />
                      <span>Verifying Code &amp; Securing Order...</span>
                    </>
                  ) : (
                    <span>Confirm &amp; Place Order • ₹{grandTotal.toLocaleString("en-IN")}</span>
                  )}
                </button>

                {/* Resend Code Countdown */}
                <div className="flex items-center justify-between text-xs text-stone-500 pt-1">
                  <span>Didn&apos;t receive the code?</span>
                  {resendCountdown > 0 ? (
                    <span className="font-mono text-stone-400">
                      Resend in {resendCountdown}s
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        setResendCountdown(30);
                        setOtpError(null);
                        setOtpDigits(["", "", "", "", "", ""]);
                        otpInputRefs.current[0]?.focus();
                      }}
                      className="font-semibold text-[#072515] hover:text-[#c0881b] hover:underline cursor-pointer"
                    >
                      Resend Code
                    </button>
                  )}
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

export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center">
          <div className="text-center space-y-3">
            <div className="size-10 border-2 border-[#072515] border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs uppercase tracking-widest text-[#072515] font-semibold">
              Preparing Sacred Checkout...
            </p>
          </div>
        </div>
      }
    >
      <CheckoutContent />
    </Suspense>
  );
}
