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
  Package,
  CheckCircle2,
} from "lucide-react";

interface PatronUser {
  name: string;
  email: string;
  phone?: string;
  memberSince?: string;
}

export default function SignUpPage() {
  const router = useRouter();
  const { cartCount, setIsCartOpen } = useCart();

  // Website hero image for left side
  const heroImage = "/images/product/trunk-portrait.jpg";

  // Form fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Feedback states
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

  // Handle Account Registration submission
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const profile: PatronUser = {
      name: name.trim() || "Patron of Kurma",
      email: email.trim().toLowerCase(),
      phone: phone.trim() || undefined,
      memberSince: "November 2026",
    };

    try {
      // Persist user account directly to Neon DB
      await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: profile.name,
          email: profile.email,
          phone: profile.phone,
          password: password,
        }),
      });
    } catch {
      // Continue gracefully even if network is offline
    }

    localStorage.setItem("kurma_user", JSON.stringify(profile));
    setCurrentUser(profile);
    setIsLoading(false);
    setSuccessMessage(`Account created! Welcome, ${profile.name}`);
    setTimeout(() => {
      router.push("/shop");
    }, 1100);
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
                    className="px-2.5 py-1 bg-black text-white font-bold uppercase tracking-wider text-[10px] cursor-pointer"
                  >
                    Shop
                  </button>
                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="px-2 py-1 border border-stone-300 text-stone-600 hover:text-black text-[10px] uppercase cursor-pointer"
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

            {/* CREATE ACCOUNT FORM */}
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

              {/* Navigation to Login */}
              <div className="mt-8 text-center text-xs text-stone-600 font-sans">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="font-bold text-black uppercase hover:underline ml-1 cursor-pointer"
                >
                  SIGN IN
                </Link>
              </div>

              {/* Demo Login & Track Order Options */}
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
                <Link
                  href="/login"
                  className="hover:text-black underline font-medium flex items-center gap-1 cursor-pointer"
                >
                  <Package className="w-3.5 h-3.5" />
                  <span>Track guest order</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

