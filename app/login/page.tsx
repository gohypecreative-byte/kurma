"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/layout/navbar";
import { useCart } from "@/lib/cart-context";
import {
  ArrowUpRight,
  Eye,
  EyeOff,
  User,
  Check,
  Package,
  Truck,
  CheckCircle2,
} from "lucide-react";

interface PatronUser {
  name: string;
  email: string;
  phone?: string;
  memberSince?: string;
}

export default function LoginPage() {
  const router = useRouter();
  const { cartCount, setIsCartOpen } = useCart();

  // Mode: "signin" | "signup" | "track" | "forgot"
  const [mode, setMode] = useState<"signin" | "signup" | "track" | "forgot">("signin");

  // Website hero image for left side
  const heroImage = "/images/product/trunk-portrait.jpg";

  // Sign in / Sign up form fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Guest Order Tracking fields
  const [orderId, setOrderId] = useState("");
  const [orderContact, setOrderContact] = useState("");
  const [trackedOrder, setTrackedOrder] = useState<null | {
    id: string;
    date: string;
    item: string;
    status: string;
    carrier: string;
    awb: string;
    estimatedDelivery: string;
    destination: string;
  }>(null);
  const [isTracking, setIsTracking] = useState(false);

  // Forgot password fields
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotSent, setForgotSent] = useState(false);

  // Interactive feedback states
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [currentUser, setCurrentUser] = useState<PatronUser | null>(null);

  // Load existing session from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem("kurma_user");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed?.name) {
          setCurrentUser(parsed);
        }
      }
    } catch {
      // ignore
    }
  }, []);

  // Handle Sign In submission
  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const displayName = email.split("@")[0] || "Valued Patron";
    const profile: PatronUser = {
      name: displayName.charAt(0).toUpperCase() + displayName.slice(1),
      email: email.trim().toLowerCase(),
      memberSince: "October 2026",
    };

    setTimeout(() => {
      localStorage.setItem("kurma_user", JSON.stringify(profile));
      setCurrentUser(profile);
      setIsLoading(false);
      setSuccessMessage(`Welcome back, ${profile.name}`);
      setTimeout(() => {
        router.push("/shop");
      }, 1100);
    }, 550);
  };

  // Handle Account Registration submission
  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const profile: PatronUser = {
      name: name.trim() || "Patron of Kurma",
      email: email.trim().toLowerCase(),
      phone: phone.trim() || undefined,
      memberSince: "October 2026",
    };

    setTimeout(() => {
      localStorage.setItem("kurma_user", JSON.stringify(profile));
      setCurrentUser(profile);
      setIsLoading(false);
      setSuccessMessage(`Account created! Welcome, ${profile.name}`);
      setTimeout(() => {
        router.push("/shop");
      }, 1100);
    }, 600);
  };

  // 1-Click Instant Demo Login
  const handleDemoLogin = () => {
    setIsLoading(true);
    const demoProfile: PatronUser = {
      name: "Priyesh Sharma",
      email: "priyesh.sharma@kurmaluxury.com",
      phone: "+91 98201 44821",
      memberSince: "November 2024",
    };

    setTimeout(() => {
      localStorage.setItem("kurma_user", JSON.stringify(demoProfile));
      setCurrentUser(demoProfile);
      setIsLoading(false);
      setSuccessMessage("Signed in as Priyesh Sharma");
      setTimeout(() => {
        router.push("/shop");
      }, 800);
    }, 400);
  };

  // Handle Sign Out
  const handleSignOut = () => {
    localStorage.removeItem("kurma_user");
    setCurrentUser(null);
    setSuccessMessage("");
  };

  // Guest Order Tracking lookup
  const handleTrackOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setIsTracking(true);

    setTimeout(() => {
      setIsTracking(false);
      setTrackedOrder({
        id: orderId.trim() || "KUR-2026-8842",
        date: "12 Oct 2026",
        item: "Imperial Brass Kurma Tortoise & Temple Flora Agarbatti Box",
        status: "Dispatched & In Transit",
        carrier: "BlueDart Express Sacred Transit",
        awb: "BD8892104-IN",
        estimatedDelivery: "15 Oct 2026 (Before 4:00 PM)",
        destination: "Bandra West, Mumbai, MH",
      });
    }, 500);
  };

  const handleLoadDemoOrder = () => {
    setOrderId("KUR-2026-8842");
    setOrderContact("priyesh.sharma@kurmaluxury.com");
    setTrackedOrder({
      id: "KUR-2026-8842",
      date: "12 Oct 2026",
      item: "Imperial Brass Kurma Tortoise & Temple Flora Agarbatti Box",
      status: "Dispatched & In Transit",
      carrier: "BlueDart Express Sacred Transit",
      awb: "BD8892104-IN",
      estimatedDelivery: "15 Oct 2026 (Before 4:00 PM)",
      destination: "Bandra West, Mumbai, MH",
    });
  };

  // Handle Forgot Password submission
  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setForgotSent(true);
    }, 500);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-stone-900 selection:bg-black selection:text-white">
      {/* Top Navbar */}
      <Navbar cartCount={cartCount} onOpenCart={() => setIsCartOpen(true)} />

      {/* 50/50 SPLIT SCREEN LAYOUT MATCHING REFERENCE IMAGE */}
      <main className="flex-1 w-full grid grid-cols-1 lg:grid-cols-2 min-h-[calc(100vh-76px)]">
        {/* =================================================================== */}
        {/* LEFT COLUMN: FULL-HEIGHT EDITORIAL WEBSITE IMAGE                    */}
        {/* =================================================================== */}
        <div className="relative hidden lg:block w-full h-full min-h-[640px] bg-stone-100 overflow-hidden">
          <Image
            src={heroImage}
            alt="Kurma Atelier Sacred Creation"
            fill
            priority
            sizes="50vw"
            className="object-cover object-center"
          />
        </div>

        {/* =================================================================== */}
        {/* RIGHT COLUMN: CLEAN MINIMALIST FORM IDENTICAL TO REFERENCE IMAGE   */}
        {/* =================================================================== */}
        <div className="w-full bg-white flex flex-col justify-center items-center px-4 sm:px-12 lg:px-16 xl:px-24 py-8 sm:py-16">
          <div className="w-full max-w-md">
            {/* Active User Session Notice */}
            {currentUser && (
              <div className="mb-6 p-4 rounded-none bg-stone-50 border border-stone-200 flex items-center justify-between text-xs">
                <div>
                  <p className="font-bold text-black uppercase tracking-wider">
                    {currentUser.name}
                  </p>
                  <p className="text-stone-500 font-mono text-[11px]">{currentUser.email}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => router.push("/shop")}
                    className="px-2.5 py-1 bg-black text-white font-bold uppercase tracking-wider text-[10px]"
                  >
                    Shop
                  </button>
                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="px-2 py-1 border border-stone-300 text-stone-600 hover:text-black text-[10px] uppercase"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            )}

            {/* Success Notification Alert */}
            {successMessage && (
              <div className="mb-6 p-3.5 bg-stone-100 border-l-2 border-black text-black flex items-center gap-2.5 text-xs animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="font-semibold">{successMessage}</span>
              </div>
            )}

            {/* =============================================================== */}
            {/* 1. SIGN IN VIEW (EXACTLY MATCHING REFERENCE IMAGE)              */}
            {/* =============================================================== */}
            {mode === "signin" && (
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold uppercase tracking-tight text-black font-sans leading-tight">
                  SIGN IN TO YOUR ACCOUNT
                </h1>
                <p className="text-xs sm:text-sm text-stone-500 mt-2.5 mb-8 font-sans leading-relaxed">
                  Access your saved products, track your orders, and manage your member profile.
                </p>

                <form onSubmit={handleSignIn} className="space-y-6">
                  {/* Email Input */}
                  <div>
                    <label
                      htmlFor="signin-email"
                      className="block text-xs font-bold uppercase tracking-wider text-black mb-2 font-sans"
                    >
                      EMAIL ADDRESS <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="signin-email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full px-4 py-3.5 border border-stone-300 focus:border-black outline-none text-sm placeholder:text-stone-400 rounded-none bg-white font-sans transition-colors"
                    />
                  </div>

                  {/* Password Input */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label
                        htmlFor="signin-password"
                        className="block text-xs font-bold uppercase tracking-wider text-black font-sans"
                      >
                        PASSWORD
                      </label>
                      <button
                        type="button"
                        onClick={() => setMode("forgot")}
                        className="text-xs text-stone-500 hover:text-black underline font-sans cursor-pointer transition-colors"
                      >
                        Forgot password?
                      </button>
                    </div>
                    <div className="relative w-full">
                      <input
                        id="signin-password"
                        type={showPassword ? "text" : "password"}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="6+ characters"
                        className="w-full px-4 py-3.5 border border-stone-300 focus:border-black outline-none text-sm placeholder:text-stone-400 rounded-none bg-white pr-10 font-sans transition-colors"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-3.5 text-stone-400 hover:text-black cursor-pointer"
                        aria-label={showPassword ? "Hide password" : "Show password"}
                      >
                        {showPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Checkbox: Keep me signed in on this device */}
                  <div className="flex items-center gap-2.5 pt-1">
                    <input
                      id="keep-signed-in"
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 rounded-none border-stone-300 text-black focus:ring-black cursor-pointer"
                    />
                    <label
                      htmlFor="keep-signed-in"
                      className="text-xs text-stone-600 font-sans cursor-pointer select-none"
                    >
                      Keep me signed in on this device
                    </label>
                  </div>

                  {/* Submit Button: SIGN IN  ↗ */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-4 bg-black hover:bg-stone-800 text-white text-xs sm:text-sm font-bold uppercase tracking-widest flex items-center justify-center gap-2 rounded-none transition-colors shadow-xs cursor-pointer"
                  >
                    {isLoading ? (
                      <span>SIGNING IN...</span>
                    ) : (
                      <>
                        <span>SIGN IN</span>
                        <ArrowUpRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>

                {/* Bottom Link: Don't have an account? CREATE ONE */}
                <div className="mt-8 text-center text-xs text-stone-600 font-sans">
                  Don&apos;t have an account?{" "}
                  <button
                    type="button"
                    onClick={() => setMode("signup")}
                    className="font-bold text-black uppercase hover:underline ml-1 cursor-pointer"
                  >
                    CREATE ONE
                  </button>
                </div>

                {/* Subtle Instant Demo Login Option */}
                <div className="mt-8 pt-6 border-t border-stone-200/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-stone-500 font-sans">
                  <button
                    type="button"
                    onClick={handleDemoLogin}
                    disabled={isLoading}
                    className="hover:text-black underline font-medium flex items-center gap-1 cursor-pointer"
                  >
                    <User className="w-3.5 h-3.5" />
                    <span>Instant Demo Login (Priyesh Sharma)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setMode("track")}
                    className="hover:text-black underline font-medium flex items-center gap-1 cursor-pointer"
                  >
                    <Package className="w-3.5 h-3.5" />
                    <span>Track guest order</span>
                  </button>
                </div>
              </div>
            )}

            {/* =============================================================== */}
            {/* 2. CREATE ACCOUNT VIEW                                          */}
            {/* =============================================================== */}
            {mode === "signup" && (
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold uppercase tracking-tight text-black font-sans leading-tight">
                  CREATE AN ACCOUNT
                </h1>
                <p className="text-xs sm:text-sm text-stone-500 mt-2.5 mb-8 font-sans leading-relaxed">
                  Join Kurma to access saved creations, track bespoke orders, and enjoy member benefits.
                </p>

                <form onSubmit={handleSignUp} className="space-y-5">
                  <div>
                    <label
                      htmlFor="signup-name"
                      className="block text-xs font-bold uppercase tracking-wider text-black mb-2 font-sans"
                    >
                      FULL NAME <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="signup-name"
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Priyesh Sharma"
                      className="w-full px-4 py-3.5 border border-stone-300 focus:border-black outline-none text-sm placeholder:text-stone-400 rounded-none bg-white font-sans transition-colors"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="signup-email"
                      className="block text-xs font-bold uppercase tracking-wider text-black mb-2 font-sans"
                    >
                      EMAIL ADDRESS <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="signup-email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full px-4 py-3.5 border border-stone-300 focus:border-black outline-none text-sm placeholder:text-stone-400 rounded-none bg-white font-sans transition-colors"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="signup-phone"
                      className="block text-xs font-bold uppercase tracking-wider text-black mb-2 font-sans"
                    >
                      MOBILE / WHATSAPP NUMBER (OPTIONAL)
                    </label>
                    <input
                      id="signup-phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98200 00000"
                      className="w-full px-4 py-3.5 border border-stone-300 focus:border-black outline-none text-sm placeholder:text-stone-400 rounded-none bg-white font-sans transition-colors"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="signup-password"
                      className="block text-xs font-bold uppercase tracking-wider text-black mb-2 font-sans"
                    >
                      PASSWORD <span className="text-red-500">*</span>
                    </label>
                    <div className="relative w-full">
                      <input
                        id="signup-password"
                        type={showPassword ? "text" : "password"}
                        required
                        minLength={6}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="6+ characters"
                        className="w-full px-4 py-3.5 border border-stone-300 focus:border-black outline-none text-sm placeholder:text-stone-400 rounded-none bg-white pr-10 font-sans transition-colors"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-3.5 text-stone-400 hover:text-black cursor-pointer"
                        aria-label={showPassword ? "Hide password" : "Show password"}
                      >
                        {showPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 pt-1">
                    <input
                      id="signup-keep-signed"
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 rounded-none border-stone-300 text-black focus:ring-black cursor-pointer"
                    />
                    <label
                      htmlFor="signup-keep-signed"
                      className="text-xs text-stone-600 font-sans cursor-pointer select-none"
                    >
                      Keep me signed in on this device
                    </label>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-4 bg-black hover:bg-stone-800 text-white text-xs sm:text-sm font-bold uppercase tracking-widest flex items-center justify-center gap-2 rounded-none transition-colors shadow-xs cursor-pointer"
                  >
                    {isLoading ? (
                      <span>CREATING ACCOUNT...</span>
                    ) : (
                      <>
                        <span>CREATE ACCOUNT</span>
                        <ArrowUpRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>

                <div className="mt-8 text-center text-xs text-stone-600 font-sans">
                  Already have an account?{" "}
                  <button
                    type="button"
                    onClick={() => setMode("signin")}
                    className="font-bold text-black uppercase hover:underline ml-1 cursor-pointer"
                  >
                    SIGN IN
                  </button>
                </div>
              </div>
            )}

            {/* =============================================================== */}
            {/* 3. FORGOT PASSWORD VIEW                                         */}
            {/* =============================================================== */}
            {mode === "forgot" && (
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold uppercase tracking-tight text-black font-sans leading-tight">
                  RESET YOUR PASSWORD
                </h1>
                <p className="text-xs sm:text-sm text-stone-500 mt-2.5 mb-8 font-sans leading-relaxed">
                  Enter your email address and we will send you a link to reset your account password.
                </p>

                {forgotSent ? (
                  <div className="p-6 bg-stone-50 border border-stone-200 text-center space-y-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto">
                      <Check className="w-5 h-5" />
                    </div>
                    <h3 className="font-bold text-black uppercase tracking-wider text-sm">
                      Reset Link Sent
                    </h3>
                    <p className="text-xs text-stone-600 leading-relaxed">
                      We have sent password recovery instructions to{" "}
                      <span className="font-bold font-mono text-black">{forgotEmail || "your email"}</span>.
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setMode("signin");
                        setForgotSent(false);
                      }}
                      className="mt-3 px-6 py-2.5 bg-black text-white text-xs font-bold uppercase tracking-widest hover:bg-stone-800 cursor-pointer"
                    >
                      RETURN TO SIGN IN
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleForgotPassword} className="space-y-6">
                    <div>
                      <label
                        htmlFor="forgot-email"
                        className="block text-xs font-bold uppercase tracking-wider text-black mb-2 font-sans"
                      >
                        EMAIL ADDRESS <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="forgot-email"
                        type="email"
                        required
                        value={forgotEmail}
                        onChange={(e) => setForgotEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="w-full px-4 py-3.5 border border-stone-300 focus:border-black outline-none text-sm placeholder:text-stone-400 rounded-none bg-white font-sans transition-colors"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full py-4 bg-black hover:bg-stone-800 text-white text-xs sm:text-sm font-bold uppercase tracking-widest flex items-center justify-center gap-2 rounded-none transition-colors shadow-xs cursor-pointer"
                    >
                      {isLoading ? (
                        <span>SENDING LINK...</span>
                      ) : (
                        <>
                          <span>SEND RESET LINK</span>
                          <ArrowUpRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </form>
                )}

                <div className="mt-8 text-center text-xs text-stone-600 font-sans">
                  Remembered your password?{" "}
                  <button
                    type="button"
                    onClick={() => {
                      setMode("signin");
                      setForgotSent(false);
                    }}
                    className="font-bold text-black uppercase hover:underline ml-1 cursor-pointer"
                  >
                    SIGN IN
                  </button>
                </div>
              </div>
            )}

            {/* =============================================================== */}
            {/* 4. TRACK ORDER VIEW                                             */}
            {/* =============================================================== */}
            {mode === "track" && (
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold uppercase tracking-tight text-black font-sans leading-tight">
                  TRACK GUEST ORDER
                </h1>
                <p className="text-xs sm:text-sm text-stone-500 mt-2.5 mb-6 font-sans leading-relaxed">
                  Enter your order reference ID to check live dispatch and courier tracking.
                </p>

                {/* Quick Demo Loader */}
                <div className="flex items-center justify-between p-3 bg-stone-50 border border-stone-200 text-xs mb-5">
                  <span className="text-stone-700">Need a demo reference?</span>
                  <button
                    type="button"
                    onClick={handleLoadDemoOrder}
                    className="px-2.5 py-1 bg-black text-white text-[10px] font-bold uppercase tracking-wider hover:bg-stone-800 cursor-pointer"
                  >
                    Load #KUR-8842
                  </button>
                </div>

                <form onSubmit={handleTrackOrder} className="space-y-5">
                  <div>
                    <label
                      htmlFor="order-id"
                      className="block text-xs font-bold uppercase tracking-wider text-black mb-2 font-sans"
                    >
                      ORDER REFERENCE ID <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="order-id"
                      type="text"
                      required
                      value={orderId}
                      onChange={(e) => setOrderId(e.target.value)}
                      placeholder="KUR-2026-8842"
                      className="w-full px-4 py-3.5 border border-stone-300 focus:border-black outline-none text-sm placeholder:text-stone-400 rounded-none bg-white font-mono transition-colors"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="order-contact"
                      className="block text-xs font-bold uppercase tracking-wider text-black mb-2 font-sans"
                    >
                      EMAIL OR PHONE <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="order-contact"
                      type="text"
                      required
                      value={orderContact}
                      onChange={(e) => setOrderContact(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full px-4 py-3.5 border border-stone-300 focus:border-black outline-none text-sm placeholder:text-stone-400 rounded-none bg-white font-sans transition-colors"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isTracking}
                    className="w-full py-4 bg-black hover:bg-stone-800 text-white text-xs sm:text-sm font-bold uppercase tracking-widest flex items-center justify-center gap-2 rounded-none transition-colors shadow-xs cursor-pointer"
                  >
                    {isTracking ? (
                      <span>TRACKING CONSIGNMENT...</span>
                    ) : (
                      <>
                        <span>TRACK ORDER</span>
                        <ArrowUpRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>

                {/* Tracked Order Result */}
                {trackedOrder && (
                  <div className="mt-6 p-4 bg-stone-50 border border-stone-200 text-xs space-y-3">
                    <div className="flex items-center justify-between pb-2 border-b border-stone-200">
                      <span className="font-bold text-black uppercase font-mono">#{trackedOrder.id}</span>
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                        <Truck className="w-3 h-3" />
                        {trackedOrder.status}
                      </span>
                    </div>
                    <div className="space-y-1 text-stone-600">
                      <p><span className="text-stone-400">Item:</span> {trackedOrder.item}</p>
                      <p><span className="text-stone-400">Carrier:</span> {trackedOrder.carrier} ({trackedOrder.awb})</p>
                      <p><span className="text-stone-400">Est. Delivery:</span> <span className="font-semibold text-emerald-800">{trackedOrder.estimatedDelivery}</span></p>
                    </div>
                  </div>
                )}

                <div className="mt-8 text-center text-xs text-stone-600 font-sans">
                  <button
                    type="button"
                    onClick={() => setMode("signin")}
                    className="font-bold text-black uppercase hover:underline cursor-pointer"
                  >
                    RETURN TO SIGN IN
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
