"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { useCart } from "@/lib/cart-context";
import {
  Lock,
  Mail,
  User,
  Check,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  Package,
  Phone,
  Flame,
  Award,
  ChevronRight,
  Truck,
  ArrowLeft,
  KeyRound,
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

  // Sign in / Sign up form fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [agreeUpdates, setAgreeUpdates] = useState(true);

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
      setSuccessMessage(`Welcome back to the Sanctuary, ${profile.name}`);
      setTimeout(() => {
        router.push("/shop");
      }, 1200);
    }, 600);
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
      setSuccessMessage(`Sacred Account Created! Welcome, ${profile.name}`);
      setTimeout(() => {
        router.push("/shop");
      }, 1200);
    }, 700);
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
      setSuccessMessage("Logged in as Verified Patron Priyesh Sharma");
      setTimeout(() => {
        router.push("/shop");
      }, 900);
    }, 450);
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
    }, 600);
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
    }, 600);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-stone-900 selection:bg-[#eed08e] selection:text-[#072515]">
      {/* Top Navbar */}
      <Navbar cartCount={cartCount} onOpenCart={() => setIsCartOpen(true)} />

      {/* Main Content Area */}
      <main className="flex-1 py-8 sm:py-12 md:py-16 px-3 xs:px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Breadcrumbs & Navigation Aid */}
          <div className="flex items-center justify-between mb-6 sm:mb-8 text-xs text-stone-500 font-sans px-1">
            <div className="flex items-center gap-2">
              <Link
                href="/"
                className="hover:text-[#8b5f10] transition-colors flex items-center gap-1 font-medium"
              >
                <span>Sanctuary Home</span>
              </Link>
              <span className="text-stone-300">/</span>
              <span className="text-[#8b5f10] font-semibold">
                {mode === "signin"
                  ? "Patron Sign In"
                  : mode === "signup"
                  ? "Create Account"
                  : mode === "track"
                  ? "Consignment Tracking"
                  : "Password Recovery"}
              </span>
            </div>

            <Link
              href="/shop"
              className="hidden sm:inline-flex items-center gap-1.5 text-stone-600 hover:text-[#8b5f10] font-medium transition-colors"
            >
              <span>Explore All Creations</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Master Two-Column Sanctuary Container */}
          <div className="grid grid-cols-1 lg:grid-cols-12 rounded-3xl sm:rounded-[2.5rem] bg-white shadow-2xl border border-stone-200/90 overflow-hidden">
            {/* ========================================================================= */}
            {/* LEFT COLUMN: BRAND SANCTUARY & PATRON PRIVILEGES (5 COLS ON LG) */}
            {/* ========================================================================= */}
            <div className="lg:col-span-5 bg-[#072515] text-white p-7 sm:p-10 lg:p-12 relative flex flex-col justify-between overflow-hidden">
              {/* Subtle Ambient Radial Glow */}
              <div
                className="absolute top-0 right-0 w-96 h-96 bg-[#eed08e]/10 rounded-full blur-3xl pointer-events-none"
                aria-hidden="true"
              />
              <div
                className="absolute -bottom-10 -left-10 w-80 h-80 bg-[#c0881b]/10 rounded-full blur-2xl pointer-events-none"
                aria-hidden="true"
              />

              {/* Brand Header */}
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 relative p-1 rounded-2xl bg-white/5 border border-[#eed08e]/30 flex items-center justify-center shrink-0">
                    <Image
                      src="/images/brand/kurma-turtle-transparent.png"
                      alt="Kurma Emblem"
                      fill
                      unoptimized
                      className="object-contain"
                      priority
                    />
                  </div>
                  <div>
                    <h2 className="font-serif tracking-[0.2em] text-lg font-bold text-white uppercase leading-none">
                      KURMA
                    </h2>
                    <p className="text-[11px] text-[#eed08e] font-sans tracking-widest uppercase mt-1">
                      Sacred Sanctuary Portal
                    </p>
                  </div>
                </div>

                <h1 className="font-serif text-2xl sm:text-3xl font-normal leading-tight text-white mb-3">
                  Sacred Gifting &amp; Heirloom Brass Creations
                </h1>
                <p className="text-xs sm:text-sm text-stone-300 font-sans leading-relaxed mb-6">
                  Sign into your patron portal to track ceremonial consignments,
                  manage bespoke engravings, and enjoy seamless one-touch ritual
                  replenishment.
                </p>

                {/* Heirloom Box Showcase Feature */}
                <div className="relative w-full h-44 sm:h-52 rounded-2xl overflow-hidden border border-[#eed08e]/30 mb-6 group shadow-lg">
                  <Image
                    src="/images/hampers/hamper-1.jpg"
                    alt="Kurma Heirloom Sacred Hamper"
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#072515] via-transparent to-black/30" />
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[11px]">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-[#072515]/90 border border-[#eed08e]/50 text-[#eed08e] font-semibold backdrop-blur-xs">
                      Handcrafted Brass &amp; Sandalwood
                    </span>
                    <span className="text-stone-300 font-mono text-[10px]">
                      Authentic Sanctum
                    </span>
                  </div>
                </div>

                {/* Patron Privileges List */}
                <div className="space-y-3.5">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-[#eed08e] font-sans">
                    Sanctuary Patron Privileges
                  </p>

                  <div className="flex items-start gap-3">
                    <div className="w-7 h-7 rounded-lg bg-white/10 text-[#eed08e] flex items-center justify-center shrink-0 mt-0.5">
                      <Flame className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-white">
                        Ceremonial Ritual Reordering
                      </h4>
                      <p className="text-[11px] text-stone-400 leading-normal">
                        One-click replenishment of pure Mysore sandalwood and temple flora agarbatti.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-7 h-7 rounded-lg bg-white/10 text-[#eed08e] flex items-center justify-center shrink-0 mt-0.5">
                      <Award className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-white">
                        Bespoke Engraving Archives
                      </h4>
                      <p className="text-[11px] text-stone-400 leading-normal">
                        Your custom family crests and auspicious dedications preserved indefinitely.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-7 h-7 rounded-lg bg-white/10 text-[#eed08e] flex items-center justify-center shrink-0 mt-0.5">
                      <ShieldCheck className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-white">
                        Private Concierge Access
                      </h4>
                      <p className="text-[11px] text-stone-400 leading-normal">
                        Direct WhatsApp hotline for wedding favors, corporate gifting &amp; festival drops.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Patron Quote & Trust Pillars */}
              <div className="relative z-10 pt-6 mt-6 border-t border-white/10">
                <blockquote className="text-[11.5px] italic text-stone-300 leading-relaxed mb-3">
                  &ldquo;Kurma&rsquo;s brass tortoise idol and sandalwood sticks transformed our daily prayer ritual into an authentic temple experience.&rdquo;
                </blockquote>
                <div className="flex items-center justify-between text-[11px] text-stone-400 font-sans">
                  <span className="font-semibold text-[#eed08e]">
                    Dr. Arvind Varma, Mumbai
                  </span>
                  <span className="text-[10px] uppercase tracking-wider text-stone-400">
                    Verified Patron
                  </span>
                </div>
              </div>
            </div>

            {/* ========================================================================= */}
            {/* RIGHT COLUMN: INTERACTIVE AUTHENTICATION & ORDERS PORTAL (7 COLS ON LG) */}
            {/* ========================================================================= */}
            <div className="lg:col-span-7 p-6 sm:p-10 lg:p-12 flex flex-col justify-between">
              <div>
                {/* Mode Selector Tabs */}
                <div className="flex flex-wrap items-center gap-2 sm:gap-4 border-b border-stone-200 pb-3 mb-6 sm:mb-8 text-xs font-bold uppercase tracking-wider font-sans">
                  <button
                    type="button"
                    onClick={() => {
                      setMode("signin");
                      setSuccessMessage("");
                    }}
                    className={`pb-2.5 px-1 relative transition-all cursor-pointer ${
                      mode === "signin"
                        ? "text-[#8b5f10] font-bold"
                        : "text-stone-400 hover:text-stone-700 font-medium"
                    }`}
                  >
                    <span>Sign In</span>
                    {mode === "signin" && (
                      <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#8b5f10] rounded-full" />
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setMode("signup");
                      setSuccessMessage("");
                    }}
                    className={`pb-2.5 px-1 relative transition-all cursor-pointer ${
                      mode === "signup"
                        ? "text-[#8b5f10] font-bold"
                        : "text-stone-400 hover:text-stone-700 font-medium"
                    }`}
                  >
                    <span>Create Account</span>
                    {mode === "signup" && (
                      <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#8b5f10] rounded-full" />
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setMode("track");
                      setSuccessMessage("");
                    }}
                    className={`pb-2.5 px-1 relative transition-all cursor-pointer ${
                      mode === "track"
                        ? "text-[#8b5f10] font-bold"
                        : "text-stone-400 hover:text-stone-700 font-medium"
                    }`}
                  >
                    <span>Track Order (Guest)</span>
                    {mode === "track" && (
                      <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#8b5f10] rounded-full" />
                    )}
                  </button>
                </div>

                {/* If already signed in: Show Patron Active Account Card */}
                {currentUser && mode !== "track" && (
                  <div className="mb-6 p-4 sm:p-5 rounded-2xl bg-[#072515]/5 border border-[#eed08e]/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-full bg-[#072515] text-[#eed08e] flex items-center justify-center text-sm font-bold shadow-xs">
                        {currentUser.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-bold text-stone-900">
                            {currentUser.name}
                          </p>
                          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#eed08e]/30 text-[#8b5f10]">
                            Active Session
                          </span>
                        </div>
                        <p className="text-xs text-stone-500 font-mono">
                          {currentUser.email}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => router.push("/shop")}
                        className="px-3.5 py-2 rounded-xl bg-[#072515] hover:bg-[#0c3823] text-[#eed08e] text-xs font-bold uppercase tracking-wider cursor-pointer transition-colors shadow-2xs"
                      >
                        Shop Creations
                      </button>
                      <button
                        type="button"
                        onClick={handleSignOut}
                        className="px-3 py-2 rounded-xl border border-stone-300 hover:border-red-300 hover:bg-red-50 text-stone-600 hover:text-red-700 text-xs font-medium cursor-pointer transition-colors"
                      >
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}

                {/* Success Notification Alert */}
                {successMessage && (
                  <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center gap-3 animate-in fade-in zoom-in-95 duration-200">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    <div>
                      <p className="text-xs font-bold">{successMessage}</p>
                      <p className="text-[11px] text-emerald-700">
                        Redirecting you to the sacred collections...
                      </p>
                    </div>
                  </div>
                )}

                {/* ================================================================= */}
                {/* 1. SIGN IN FORM */}
                {/* ================================================================= */}
                {mode === "signin" && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-serif text-2xl font-normal text-stone-900">
                        Welcome Back, Patron
                      </h3>
                      <p className="text-xs text-stone-500 mt-1 font-sans">
                        Enter your credentials to enter your Kurma sanctuary account.
                      </p>
                    </div>

                    {/* 1-Click Patron Demo Login Card */}
                    <button
                      type="button"
                      onClick={handleDemoLogin}
                      disabled={isLoading}
                      className="w-full p-3.5 sm:p-4 rounded-2xl border-2 border-[#eed08e] bg-[#FAF8F5] hover:bg-[#f8f2e1] active:bg-[#f3edd7] text-stone-900 transition-all cursor-pointer flex items-center justify-between group shadow-xs touch-manipulation"
                    >
                      <div className="flex items-center gap-3 text-left">
                        <div className="w-9 h-9 rounded-xl bg-[#072515] text-[#eed08e] flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
                          <User className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-stone-900 tracking-wide">
                            Instant Patron Demo Login
                          </p>
                          <p className="text-[11px] text-stone-500">
                            Sign in immediately as Priyesh Sharma (1-Click)
                          </p>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-[#8b5f10] group-hover:translate-x-1 transition-transform" />
                    </button>

                    <div className="relative flex items-center justify-center my-2">
                      <div className="h-px w-full bg-stone-200" />
                      <span className="px-3 bg-white text-[11px] text-stone-400 uppercase tracking-widest font-sans">
                        Or sign in with email
                      </span>
                    </div>

                    <form onSubmit={handleSignIn} className="space-y-4">
                      <div>
                        <label
                          htmlFor="signin-email"
                          className="block text-[11px] font-bold text-stone-700 uppercase tracking-wider mb-1.5"
                        >
                          Patron Email Address
                        </label>
                        <div className="relative">
                          <input
                            id="signin-email"
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="patron@kurmaluxury.com"
                            className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:border-[#8b5f10] focus:ring-1 focus:ring-[#8b5f10] text-xs outline-none font-sans pl-10 transition-colors"
                          />
                          <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5 pointer-events-none" />
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <label
                            htmlFor="signin-password"
                            className="block text-[11px] font-bold text-stone-700 uppercase tracking-wider"
                          >
                            Password
                          </label>
                          <button
                            type="button"
                            onClick={() => setMode("forgot")}
                            className="text-[11px] text-[#8b5f10] hover:underline font-semibold cursor-pointer"
                          >
                            Forgot Password?
                          </button>
                        </div>
                        <div className="relative">
                          <input
                            id="signin-password"
                            type={showPassword ? "text" : "password"}
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••••••"
                            className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:border-[#8b5f10] focus:ring-1 focus:ring-[#8b5f10] text-xs outline-none font-sans pl-10 pr-10 transition-colors"
                          />
                          <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5 pointer-events-none" />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3.5 top-3.5 text-stone-400 hover:text-stone-700 cursor-pointer"
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

                      <div className="flex items-center justify-between text-xs text-stone-600">
                        <label className="flex items-center gap-2 cursor-pointer select-none">
                          <input
                            type="checkbox"
                            checked={rememberMe}
                            onChange={(e) => setRememberMe(e.target.checked)}
                            className="rounded border-stone-300 text-[#8b5f10] focus:ring-[#8b5f10] cursor-pointer"
                          />
                          <span className="text-[11.5px]">
                            Remember this browser for 30 days
                          </span>
                        </label>
                      </div>

                      <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-3.5 sm:py-4 rounded-xl bg-[#072515] hover:bg-[#0c3823] text-[#eed08e] text-xs font-bold uppercase tracking-widest transition-all shadow-md active:bg-[#051a0f] cursor-pointer touch-manipulation flex items-center justify-center gap-2"
                      >
                        {isLoading ? (
                          <span>Entering Sanctuary...</span>
                        ) : (
                          <>
                            <span>Sign In to Sanctuary</span>
                            <ArrowRight className="w-4 h-4" />
                          </>
                        )}
                      </button>
                    </form>

                    {/* Quick Social & OTP Access */}
                    <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <button
                        type="button"
                        onClick={handleDemoLogin}
                        className="py-2.5 px-3 rounded-xl border border-stone-200 hover:border-stone-300 bg-white hover:bg-stone-50 text-stone-700 text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                      >
                        <svg className="w-4 h-4" viewBox="0 0 24 24">
                          <path
                            fill="#4285F4"
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                          />
                          <path
                            fill="#34A853"
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                          />
                          <path
                            fill="#FBBC05"
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                          />
                          <path
                            fill="#EA4335"
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                          />
                        </svg>
                        <span>Google Sign In</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setMode("track");
                        }}
                        className="py-2.5 px-3 rounded-xl border border-stone-200 hover:border-stone-300 bg-white hover:bg-stone-50 text-stone-700 text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                      >
                        <Package className="w-4 h-4 text-stone-500" />
                        <span>Track Guest Order</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* ================================================================= */}
                {/* 2. CREATE ACCOUNT FORM */}
                {/* ================================================================= */}
                {mode === "signup" && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-serif text-2xl font-normal text-stone-900">
                        Join the Kurma Sanctuary
                      </h3>
                      <p className="text-xs text-stone-500 mt-1 font-sans">
                        Register for bespoke engraving privileges, ritual auto-replenish, and priority gifting.
                      </p>
                    </div>

                    <form onSubmit={handleSignUp} className="space-y-4">
                      <div>
                        <label
                          htmlFor="signup-name"
                          className="block text-[11px] font-bold text-stone-700 uppercase tracking-wider mb-1.5"
                        >
                          Full Patron Name
                        </label>
                        <div className="relative">
                          <input
                            id="signup-name"
                            type="text"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g. Priyesh Sharma"
                            className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:border-[#8b5f10] focus:ring-1 focus:ring-[#8b5f10] text-xs outline-none font-sans pl-10 transition-colors"
                          />
                          <User className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5 pointer-events-none" />
                        </div>
                      </div>

                      <div>
                        <label
                          htmlFor="signup-email"
                          className="block text-[11px] font-bold text-stone-700 uppercase tracking-wider mb-1.5"
                        >
                          Email Address
                        </label>
                        <div className="relative">
                          <input
                            id="signup-email"
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="priyesh@domain.com"
                            className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:border-[#8b5f10] focus:ring-1 focus:ring-[#8b5f10] text-xs outline-none font-sans pl-10 transition-colors"
                          />
                          <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5 pointer-events-none" />
                        </div>
                      </div>

                      <div>
                        <label
                          htmlFor="signup-phone"
                          className="block text-[11px] font-bold text-stone-700 uppercase tracking-wider mb-1.5"
                        >
                          Mobile / WhatsApp Number (Optional for Dispatch SMS)
                        </label>
                        <div className="relative">
                          <input
                            id="signup-phone"
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="+91 98200 00000"
                            className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:border-[#8b5f10] focus:ring-1 focus:ring-[#8b5f10] text-xs outline-none font-sans pl-10 transition-colors"
                          />
                          <Phone className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5 pointer-events-none" />
                        </div>
                      </div>

                      <div>
                        <label
                          htmlFor="signup-password"
                          className="block text-[11px] font-bold text-stone-700 uppercase tracking-wider mb-1.5"
                        >
                          Create Sanctuary Password
                        </label>
                        <div className="relative">
                          <input
                            id="signup-password"
                            type={showPassword ? "text" : "password"}
                            required
                            minLength={6}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="At least 6 characters"
                            className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:border-[#8b5f10] focus:ring-1 focus:ring-[#8b5f10] text-xs outline-none font-sans pl-10 pr-10 transition-colors"
                          />
                          <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5 pointer-events-none" />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3.5 top-3.5 text-stone-400 hover:text-stone-700 cursor-pointer"
                            aria-label={showPassword ? "Hide password" : "Show password"}
                          >
                            {showPassword ? (
                              <EyeOff className="w-4 h-4" />
                            ) : (
                              <Eye className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                        <p className="text-[10px] text-stone-400 mt-1">
                          Password must contain at least 6 characters.
                        </p>
                      </div>

                      <div className="space-y-2 pt-1 text-xs text-stone-600">
                        <label className="flex items-start gap-2.5 cursor-pointer select-none">
                          <input
                            type="checkbox"
                            checked={agreeUpdates}
                            onChange={(e) => setAgreeUpdates(e.target.checked)}
                            className="mt-0.5 rounded border-stone-300 text-[#8b5f10] focus:ring-[#8b5f10] cursor-pointer"
                          />
                          <span className="text-[11.5px] leading-tight">
                            Receive private releases, Diwali &amp; wedding collection drops, and sacred ritual guides.
                          </span>
                        </label>
                      </div>

                      <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-3.5 sm:py-4 rounded-xl bg-[#072515] hover:bg-[#0c3823] text-[#eed08e] text-xs font-bold uppercase tracking-widest transition-all shadow-md active:bg-[#051a0f] cursor-pointer touch-manipulation flex items-center justify-center gap-2 mt-2"
                      >
                        {isLoading ? (
                          <span>Creating Sanctuary Account...</span>
                        ) : (
                          <>
                            <span>Complete Patron Registration</span>
                            <ArrowRight className="w-4 h-4" />
                          </>
                        )}
                      </button>
                    </form>
                  </div>
                )}

                {/* ================================================================= */}
                {/* 3. GUEST ORDER TRACKING */}
                {/* ================================================================= */}
                {mode === "track" && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-serif text-2xl font-normal text-stone-900">
                        Track Sacred Consignment
                      </h3>
                      <p className="text-xs text-stone-500 mt-1 font-sans">
                        Check live dispatch, courier AWB tracking, and expected delivery for your Kurma order.
                      </p>
                    </div>

                    {/* Quick Demo Order Loader */}
                    <div className="flex items-center justify-between p-3 rounded-xl bg-amber-50/70 border border-amber-200/80 text-xs">
                      <span className="text-amber-900 font-medium text-[11.5px]">
                        Need a demonstration tracking reference?
                      </span>
                      <button
                        type="button"
                        onClick={handleLoadDemoOrder}
                        className="px-2.5 py-1 rounded-lg bg-[#072515] text-[#eed08e] text-[10.5px] font-bold uppercase tracking-wider hover:bg-[#0c3823] cursor-pointer transition-colors"
                      >
                        Load #KUR-8842
                      </button>
                    </div>

                    <form onSubmit={handleTrackOrder} className="space-y-4">
                      <div>
                        <label
                          htmlFor="order-id"
                          className="block text-[11px] font-bold text-stone-700 uppercase tracking-wider mb-1.5"
                        >
                          Kurma Order ID / Reference Number
                        </label>
                        <div className="relative">
                          <input
                            id="order-id"
                            type="text"
                            required
                            value={orderId}
                            onChange={(e) => setOrderId(e.target.value)}
                            placeholder="e.g. KUR-2026-8842"
                            className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:border-[#8b5f10] focus:ring-1 focus:ring-[#8b5f10] text-xs outline-none font-sans pl-10 font-mono transition-colors"
                          />
                          <Package className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5 pointer-events-none" />
                        </div>
                      </div>

                      <div>
                        <label
                          htmlFor="order-contact"
                          className="block text-[11px] font-bold text-stone-700 uppercase tracking-wider mb-1.5"
                        >
                          Email or Mobile Used During Checkout
                        </label>
                        <div className="relative">
                          <input
                            id="order-contact"
                            type="text"
                            required
                            value={orderContact}
                            onChange={(e) => setOrderContact(e.target.value)}
                            placeholder="you@domain.com or +91 98200..."
                            className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:border-[#8b5f10] focus:ring-1 focus:ring-[#8b5f10] text-xs outline-none font-sans pl-10 transition-colors"
                          />
                          <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5 pointer-events-none" />
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={isTracking}
                        className="w-full py-3.5 rounded-xl bg-[#072515] hover:bg-[#0c3823] text-[#eed08e] text-xs font-bold uppercase tracking-widest transition-all shadow-md active:bg-[#051a0f] cursor-pointer touch-manipulation flex items-center justify-center gap-2"
                      >
                        {isTracking ? (
                          <span>Querying Consignment Records...</span>
                        ) : (
                          <>
                            <span>Track Sacred Consignment</span>
                            <ArrowRight className="w-4 h-4" />
                          </>
                        )}
                      </button>
                    </form>

                    {/* Order Result Card */}
                    {trackedOrder && (
                      <div className="mt-6 p-5 sm:p-6 rounded-2xl bg-stone-50 border border-stone-200/90 space-y-4 animate-in fade-in duration-200">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-stone-200 gap-2">
                          <div>
                            <span className="text-[10px] uppercase font-bold tracking-wider text-[#8b5f10]">
                              Order #{trackedOrder.id}
                            </span>
                            <h4 className="text-sm font-bold text-stone-900 mt-0.5">
                              {trackedOrder.item}
                            </h4>
                          </div>
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold self-start sm:self-auto">
                            <Truck className="w-3.5 h-3.5" />
                            {trackedOrder.status}
                          </span>
                        </div>

                        {/* Interactive Timeline */}
                        <div className="grid grid-cols-4 gap-2 pt-2 text-center">
                          <div className="space-y-1">
                            <div className="w-7 h-7 mx-auto rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold">
                              ✓
                            </div>
                            <p className="text-[10px] font-bold text-stone-900">
                              Blessed
                            </p>
                            <p className="text-[9px] text-stone-400">12 Oct</p>
                          </div>
                          <div className="space-y-1">
                            <div className="w-7 h-7 mx-auto rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold">
                              ✓
                            </div>
                            <p className="text-[10px] font-bold text-stone-900">
                              Hand-Packed
                            </p>
                            <p className="text-[9px] text-stone-400">13 Oct</p>
                          </div>
                          <div className="space-y-1">
                            <div className="w-7 h-7 mx-auto rounded-full bg-[#072515] text-[#eed08e] flex items-center justify-center text-xs font-bold ring-2 ring-[#eed08e]">
                              3
                            </div>
                            <p className="text-[10px] font-bold text-[#8b5f10]">
                              In Transit
                            </p>
                            <p className="text-[9px] text-stone-500">BlueDart</p>
                          </div>
                          <div className="space-y-1">
                            <div className="w-7 h-7 mx-auto rounded-full bg-stone-200 text-stone-400 flex items-center justify-center text-xs font-bold">
                              4
                            </div>
                            <p className="text-[10px] font-medium text-stone-500">
                              Delivery
                            </p>
                            <p className="text-[9px] text-stone-400">15 Oct</p>
                          </div>
                        </div>

                        <div className="p-3 bg-white rounded-xl border border-stone-200 text-xs space-y-1 text-stone-600">
                          <div className="flex justify-between">
                            <span className="text-stone-400">Carrier:</span>
                            <span className="font-semibold text-stone-800">
                              {trackedOrder.carrier}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-stone-400">Air Waybill (AWB):</span>
                            <span className="font-mono font-semibold text-[#8b5f10]">
                              {trackedOrder.awb}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-stone-400">Estimated Delivery:</span>
                            <span className="font-semibold text-emerald-800">
                              {trackedOrder.estimatedDelivery}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-stone-400">Destination:</span>
                            <span className="font-semibold text-stone-800">
                              {trackedOrder.destination}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* ================================================================= */}
                {/* 4. FORGOT PASSWORD VIEW */}
                {/* ================================================================= */}
                {mode === "forgot" && (
                  <div className="space-y-6">
                    <div>
                      <button
                        type="button"
                        onClick={() => {
                          setMode("signin");
                          setForgotSent(false);
                        }}
                        className="inline-flex items-center gap-1 text-xs text-[#8b5f10] hover:underline font-semibold mb-3 cursor-pointer"
                      >
                        <ArrowLeft className="w-3.5 h-3.5" />
                        <span>Return to Sign In</span>
                      </button>
                      <h3 className="font-serif text-2xl font-normal text-stone-900">
                        Reset Sanctuary Password
                      </h3>
                      <p className="text-xs text-stone-500 mt-1 font-sans">
                        Enter your patron email address. We will dispatch a secure one-time link to create a new password.
                      </p>
                    </div>

                    {forgotSent ? (
                      <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-3">
                        <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto">
                          <Check className="w-6 h-6" />
                        </div>
                        <h4 className="text-sm font-bold text-stone-900">
                          Reset Instructions Dispatched
                        </h4>
                        <p className="text-xs text-stone-600 max-w-sm mx-auto">
                          We have sent a verification code to{" "}
                          <span className="font-semibold font-mono text-stone-900">
                            {forgotEmail || "your email"}
                          </span>
                          . Please check your inbox and spam folder.
                        </p>
                        <button
                          type="button"
                          onClick={() => {
                            setMode("signin");
                            setForgotSent(false);
                          }}
                          className="mt-3 px-5 py-2.5 rounded-xl bg-[#072515] text-[#eed08e] text-xs font-bold uppercase tracking-wider hover:bg-[#0c3823] cursor-pointer transition-colors"
                        >
                          Back to Sign In
                        </button>
                      </div>
                    ) : (
                      <form onSubmit={handleForgotPassword} className="space-y-4">
                        <div>
                          <label
                            htmlFor="forgot-email"
                            className="block text-[11px] font-bold text-stone-700 uppercase tracking-wider mb-1.5"
                          >
                            Registered Patron Email
                          </label>
                          <div className="relative">
                            <input
                              id="forgot-email"
                              type="email"
                              required
                              value={forgotEmail}
                              onChange={(e) => setForgotEmail(e.target.value)}
                              placeholder="patron@kurmaluxury.com"
                              className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:border-[#8b5f10] focus:ring-1 focus:ring-[#8b5f10] text-xs outline-none font-sans pl-10 transition-colors"
                            />
                            <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5 pointer-events-none" />
                          </div>
                        </div>

                        <button
                          type="submit"
                          disabled={isLoading}
                          className="w-full py-3.5 rounded-xl bg-[#072515] hover:bg-[#0c3823] text-[#eed08e] text-xs font-bold uppercase tracking-widest transition-all shadow-md active:bg-[#051a0f] cursor-pointer touch-manipulation flex items-center justify-center gap-2"
                        >
                          {isLoading ? (
                            <span>Dispatching Link...</span>
                          ) : (
                            <>
                              <KeyRound className="w-4 h-4" />
                              <span>Dispatch Reset Link</span>
                            </>
                          )}
                        </button>
                      </form>
                    )}
                  </div>
                )}
              </div>

              {/* Bottom Sanctuary Security & Support Footer */}
              <div className="pt-8 mt-8 border-t border-stone-100 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-400 gap-3">
                <div className="flex items-center gap-2 text-[11px]">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>256-bit Encrypted Sanctuary Security</span>
                </div>

                <div className="flex items-center gap-4 text-[11px]">
                  <Link
                    href="/contact"
                    className="hover:text-[#8b5f10] underline transition-colors"
                  >
                    Sanctum Concierge
                  </Link>
                  <span>&bull;</span>
                  <Link
                    href="/shipping"
                    className="hover:text-[#8b5f10] underline transition-colors"
                  >
                    Insured Transit Policy
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Global Footer */}
      <Footer />
    </div>
  );
}
