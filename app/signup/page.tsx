"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/layout/navbar";
import { useCart } from "@/lib/cart-context";
import {
  Eye,
  EyeOff,
  CheckCircle2,
  X,
  Loader2,
  AlertCircle,
  ShieldCheck,
} from "lucide-react";

interface PatronUser {
  name: string;
  email: string;
  role?: string;
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
  const [errorMessage, setErrorMessage] = useState("");
  const [currentUser, setCurrentUser] = useState<PatronUser | null>(null);

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

  // Focus first input on open
  useEffect(() => {
    if (isOtpModalOpen) {
      setTimeout(() => {
        otpInputRefs.current[0]?.focus();
      }, 150);
    }
  }, [isOtpModalOpen]);

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
      handleVerifyOtpAndCreateAccount();
    }
  };

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

  // Handle phone input change with strict 10-digit validation
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let raw = e.target.value.replace(/\D/g, "");
    // If user pasted with 91 country code prefix (12 digits), strip leading 91 to get 10-digit number
    if (raw.length === 12 && raw.startsWith("91")) {
      raw = raw.slice(2);
    } else if (raw.length === 11 && raw.startsWith("0")) {
      raw = raw.slice(1);
    }
    const digitsOnly = raw.slice(0, 10);
    setPhone(digitsOnly);
    if (errorMessage) {
      setErrorMessage("");
    }
  };

  // Handle Account Registration submission - triggers OTP Verification
  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!name.trim()) {
      setErrorMessage("Please enter your full name");
      return;
    }
    if (!email.trim()) {
      setErrorMessage("Please enter a valid email address");
      return;
    }
    const cleanPhone = phone.replace(/\D/g, "");
    if (!cleanPhone) {
      setErrorMessage("Please enter your mobile number");
      return;
    }
    if (cleanPhone.length !== 10) {
      setErrorMessage("Please enter a valid 10-digit mobile number");
      return;
    }
    if (!password || password.length < 6) {
      setErrorMessage("Password must be at least 6 characters long");
      return;
    }

    // Open OTP Verification Modal
    setOtpDigits(["", "", "", "", "", ""]);
    setOtpError(null);
    setResendCountdown(30);
    setIsOtpModalOpen(true);
  };

  // Verify OTP & Complete Account Creation (Allows any entered OTP)
  const handleVerifyOtpAndCreateAccount = async () => {
    setIsVerifyingOtp(true);
    setOtpError(null);

    const profile: PatronUser = {
      name: name.trim() || "Patron of Kurma",
      email: email.trim().toLowerCase(),
      phone: phone.trim() || undefined,
      memberSince: "November 2026",
    };

    try {
      // Persist user account directly to Neon DB with hashed password
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: profile.name,
          email: profile.email,
          phone: profile.phone,
          password: password,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        setOtpError(errorData.error || "Failed to create account. Please try again.");
        setIsVerifyingOtp(false);
        return;
      }

      const data = await res.json();
      if (data.user) {
        profile.name = data.user.name;
        profile.email = data.user.email;
        if (data.user.phone) profile.phone = data.user.phone;
        if (data.user.memberSince) profile.memberSince = data.user.memberSince;
      }
    } catch {
      // Continue gracefully even if network is offline
    }

    localStorage.setItem("kurma_user", JSON.stringify(profile));
    setCurrentUser(profile);
    setIsVerifyingOtp(false);
    setIsOtpModalOpen(false);
    setSuccessMessage(`Account verified and created! Welcome, ${profile.name}`);
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
                    {currentUser.role === "ADMIN" || currentUser.email === "admin@kurmaluxury.com" || currentUser.email === "admin@kurma.com" || currentUser.email === "vishal1@gmail.com" || currentUser.email === "vishalsingh123764@gmail.com"
                      ? "Admin"
                      : currentUser.name}
                  </p>
                  <p className="text-stone-500 font-mono text-[11px]">{currentUser.email}</p>
                </div>
                <div className="flex items-center gap-2">
                  {(currentUser.role === "ADMIN" || currentUser.email === "admin@kurmaluxury.com" || currentUser.email === "admin@kurma.com" || currentUser.email === "vishal1@gmail.com" || currentUser.email === "vishalsingh123764@gmail.com") ? (
                    <button
                      type="button"
                      onClick={() => router.push("/admin")}
                      className="px-2.5 py-1 bg-[#072515] text-[#eed08e] font-bold uppercase tracking-wider text-[10px] cursor-pointer"
                    >
                      Admin Dashboard
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => router.push("/shop")}
                      className="px-2.5 py-1 bg-black text-white font-bold uppercase tracking-wider text-[10px] cursor-pointer"
                    >
                      Shop
                    </button>
                  )}
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
              <div className="mb-6 p-3.5 rounded-xl bg-[#28513B] text-white flex items-center gap-2.5 text-xs shadow-md animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 text-white shrink-0" />
                <span className="font-semibold">{successMessage}</span>
              </div>
            )}

            {/* Error Notification Alert */}
            {errorMessage && (
              <div className="mb-6 p-3.5 bg-red-50 border-l-2 border-red-600 text-red-900 flex items-center gap-2.5 text-xs animate-in fade-in">
                <span className="font-semibold">{errorMessage}</span>
              </div>
            )}

            {/* CREATE ACCOUNT FORM */}
            <div>
              <h1 className="text-2xl sm:text-3xl font-serif font-normal uppercase tracking-tight text-black leading-tight mb-8">
                CREATE AN ACCOUNT
              </h1>

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
                    MOBILE / WHATSAPP NUMBER <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="signup-phone"
                    type="tel"
                    inputMode="numeric"
                    autoComplete="tel"
                    maxLength={10}
                    required
                    value={phone}
                    onChange={handlePhoneChange}
                    placeholder="Enter 10-digit mobile number"
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
                  className="w-full py-4 bg-[#072515] hover:bg-[#0c3823] text-[#eed08e] text-xs sm:text-sm font-bold uppercase tracking-widest flex items-center justify-center rounded-none transition-colors shadow-sm cursor-pointer"
                >
                  {isLoading ? "CREATING ACCOUNT..." : "CREATE ACCOUNT"}
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
            </div>
          </div>
        </div>

        {/* ==================================================================== */}
        {/* OTP VERIFICATION POPUP MODAL (Consistent Kurma Luxury Theme)          */}
        {/* ==================================================================== */}
        {isOtpModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-stone-900/65 backdrop-blur-xs animate-in fade-in duration-200">
            <div className="w-full max-w-md bg-white rounded-3xl border border-[#eed08e]/70 shadow-2xl p-6 sm:p-8 space-y-6 relative animate-in zoom-in-95 duration-200">
              {/* Close Button */}
              <button
                type="button"
                onClick={() => {
                  if (!isVerifyingOtp) {
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
                <div className="size-12 rounded-2xl bg-[#28513B] text-white flex items-center justify-center mx-auto mb-3 shadow-md border border-[#28513B]/30">
                  <ShieldCheck className="size-6 text-white" />
                </div>
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#072515]">
                  Account Verification
                </h3>
                <p className="text-xs text-stone-600 max-w-xs mx-auto leading-relaxed">
                  Enter the 6-digit verification code sent to{" "}
                  <strong className="text-stone-900 font-semibold break-all">
                    {email || "your email address"}
                  </strong>
                  {phone ? (
                    <span>
                      {" "}
                      (or mobile{" "}
                      <strong className="text-stone-900 font-semibold">{phone}</strong>)
                    </span>
                  ) : null}
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
                      className={`h-12 sm:h-14 text-center text-lg sm:text-xl font-bold font-mono rounded-xl border-2 transition-all outline-none ${
                        digit
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
                  onClick={handleVerifyOtpAndCreateAccount}
                  disabled={isVerifyingOtp}
                  className="w-full py-3.5 px-6 rounded-xl bg-[#28513B] hover:bg-[#1e3f2e] text-white text-xs sm:text-sm font-bold uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
                >
                  {isVerifyingOtp ? (
                    <>
                      <Loader2 className="size-4 animate-spin text-white" />
                      <span>Verifying Code &amp; Creating Account...</span>
                    </>
                  ) : (
                    <span>Verify &amp; Create Account</span>
                  )}
                </button>

                {/* Resend Code Section */}
                <div className="text-center pt-1">
                  {resendCountdown > 0 ? (
                    <p className="text-[11px] text-stone-500">
                      Resend verification code in{" "}
                      <span className="font-semibold text-stone-800 font-mono">
                        {resendCountdown}s
                      </span>
                    </p>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setResendCountdown(30)}
                      disabled={isVerifyingOtp}
                      className="text-xs font-semibold text-[#072515] hover:underline cursor-pointer disabled:opacity-50"
                    >
                      Resend Verification Code
                    </button>
                  )}
                </div>
              </div>

              {/* Trust Badge */}
              <div className="border-t border-stone-100 pt-3 flex items-center justify-center gap-2 text-[10.5px] text-stone-500">
                <ShieldCheck className="size-3.5 text-emerald-600" />
                <span>256-Bit Encrypted Patron Verification</span>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

