"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Lock,
  Mail,
  KeyRound,
  Eye,
  EyeOff,
  Loader2,
  AlertCircle,
  CheckCircle2,
  ArrowLeft,
} from "lucide-react";

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: "ADMIN";
  memberSince?: string;
}

interface AdminAuthContextType {
  adminUser: AdminUser | null;
  logout: () => Promise<void>;
  refreshSession: () => Promise<void>;
  isAuthenticated: boolean;
}

const AdminAuthContext = createContext<AdminAuthContextType>({
  adminUser: null,
  logout: async () => {},
  refreshSession: async () => {},
  isAuthenticated: false,
});

export const useAdminAuth = () => useContext(AdminAuthContext);

export default function AdminAuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  // "checking" | "authenticated" | "unauthenticated"
  const [authStatus, setAuthStatus] = useState<"checking" | "authenticated" | "unauthenticated">("checking");
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);

  // Login form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Check admin session from server or sync active authenticated session
  const checkSession = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/admin-session", {
        method: "GET",
        headers: { "Cache-Control": "no-cache" },
        cache: "no-store",
      });

      if (res.ok) {
        const data = await res.json();
        if (data.authenticated && data.user && data.user.role === "ADMIN") {
          setAdminUser({ ...data.user, name: "Admin" });
          setAuthStatus("authenticated");
          return;
        }
      }
    } catch {
      // Network or offline error
    }

    // Auto-verify if the user is already logged in on client with an admin role
    try {
      const stored = localStorage.getItem("kurma_user");
      if (stored) {
        const parsed = JSON.parse(stored);
        const isAdminEmail =
          parsed?.email === "admin@kurmaluxury.com" ||
          parsed?.email === "admin@kurma.com" ||
          parsed?.email === "vishal1@gmail.com" ||
          parsed?.email === "vishalsingh123764@gmail.com" ||
          parsed?.role === "ADMIN";

        if (isAdminEmail && parsed?.email) {
          const syncRes = await fetch("/api/auth/admin-session", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action: "sync", email: parsed.email }),
          });

          if (syncRes.ok) {
            const syncData = await syncRes.json();
            if (syncData.authenticated && syncData.user?.role === "ADMIN") {
              setAdminUser({ ...syncData.user, name: "Admin" });
              setAuthStatus("authenticated");
              return;
            }
          }
        }
      }
    } catch {
      // ignore parsing error
    }

    setAdminUser(null);
    setAuthStatus("unauthenticated");
  }, []);

  useEffect(() => {
    checkSession();
  }, [checkSession]);

  // Handle Admin Sign In
  const handleAdminSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const res = await fetch("/api/auth/admin-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.error || "Authentication failed. Administrator privileges required.");
        setIsLoading(false);
        return;
      }

      setSuccessMessage("Administrator authenticated successfully.");
      setAdminUser({ ...data.user, name: "Admin" });
      setAuthStatus("authenticated");

      try {
        localStorage.setItem(
          "kurma_user",
          JSON.stringify({ ...data.user, name: "Admin", role: "ADMIN" })
        );
      } catch {}

      // Check if there was a redirect URL
      if (typeof window !== "undefined") {
        const urlParams = new URLSearchParams(window.location.search);
        const redirect = urlParams.get("redirect");
        if (redirect && redirect.startsWith("/admin") && redirect !== "/admin") {
          router.push(redirect);
        }
      }
    } catch (err: any) {
      setErrorMessage(err?.message || "Failed to connect to authentication server.");
    } finally {
      setIsLoading(false);
    }
  };

  // Logout handler
  const logout = async () => {
    try {
      await fetch("/api/auth/admin-session", { method: "POST" });
    } catch {
      // ignore
    }
    try {
      localStorage.removeItem("kurma_user");
    } catch {
      // ignore
    }
    setAdminUser(null);
    setAuthStatus("unauthenticated");
    router.replace("/login");
  };

  // Context value
  const contextValue: AdminAuthContextType = {
    adminUser,
    logout,
    refreshSession: checkSession,
    isAuthenticated: authStatus === "authenticated",
  };

  // 1. Loading / Verification State
  if (authStatus === "checking") {
    return (
      <div className="min-h-screen bg-[#FAF8F5] flex flex-col items-center justify-center p-6 text-[#1A1A18] selection:bg-[#eed08e]/30">
        <div className="flex flex-col items-center max-w-sm text-center space-y-4">
          <div className="size-16 rounded-2xl bg-[#072515] text-[#eed08e] flex items-center justify-center shadow-lg border border-[#eed08e]/30 relative animate-pulse">
            <span className="font-serif font-bold text-2xl tracking-widest text-[#eed08e]">K</span>
          </div>
          <div className="space-y-1">
            <h2 className="font-serif text-lg font-semibold tracking-wide text-[#072515]">KURMA ATELIER</h2>
            <p className="text-xs text-black/55 tracking-wider uppercase font-medium">Administration Security Console</p>
          </div>
          <div className="flex items-center gap-2 text-xs text-[#072515] font-medium pt-2">
            <Loader2 className="size-4 animate-spin text-[#072515]" />
            <span>Verifying administrator credentials...</span>
          </div>
        </div>
      </div>
    );
  }

  // 2. Unauthenticated State -> Render Admin Logon Form
  if (authStatus === "unauthenticated") {
    return (
      <div className="min-h-screen bg-[#072515] text-[#FAF8F5] flex flex-col justify-between selection:bg-[#eed08e] selection:text-[#072515] relative overflow-hidden">
        {/* Subtle Luxury Background Motif */}
        <div className="absolute inset-0 opacity-5 pointer-events-none bg-[radial-gradient(#eed08e_1px,transparent_1px)] [background-size:24px_24px]" />

        {/* Top Minimal Bar */}
        <header className="px-6 py-5 flex items-center justify-between border-b border-[#eed08e]/15 relative z-10">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="size-9 rounded-xl bg-[#FAF8F5] text-[#072515] flex items-center justify-center shadow-md font-serif font-bold text-base group-hover:scale-105 transition-transform">
              K
            </div>
            <div>
              <span className="font-serif text-sm tracking-widest font-bold text-[#eed08e] block">KURMA</span>
              <span className="text-[10px] text-[#FAF8F5]/60 tracking-wider uppercase font-light">Haute Fragrance & Gifting</span>
            </div>
          </Link>

          <Link
            href="/"
            className="flex items-center gap-1.5 text-xs text-[#eed08e]/80 hover:text-[#eed08e] transition-colors"
          >
            <ArrowLeft className="size-3.5" />
            <span>Return to Storefront</span>
          </Link>
        </header>

        {/* Central Admin Login Card */}
        <main className="flex-1 flex items-center justify-center px-4 py-12 relative z-10">
          <div className="w-full max-w-md">
            {/* Card Frame */}
            <div className="bg-[#FAF8F5] text-[#1A1A18] rounded-2xl shadow-2xl border border-[#eed08e]/40 p-8 sm:p-10 relative">
              {/* Title Section: ONLY "Admin Administration" */}
              <div className="text-center mb-6">
                <h1 className="font-serif text-2xl font-bold tracking-tight text-[#072515]">
                  Admin Administration
                </h1>
              </div>

              {/* Error Message */}
              {errorMessage && (
                <div className="mb-5 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-900 text-xs flex items-start gap-2.5 animate-shake">
                  <AlertCircle className="size-4 text-red-600 shrink-0 mt-0.5" />
                  <p className="leading-snug">{errorMessage}</p>
                </div>
              )}

              {/* Success Message */}
              {successMessage && (
                <div className="mb-5 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-center gap-2.5">
                  <CheckCircle2 className="size-4 text-emerald-600 shrink-0" />
                  <p className="font-medium">{successMessage}</p>
                </div>
              )}

              {/* Login Form */}
              <form onSubmit={handleAdminSignIn} className="space-y-4">
                {/* Email Field */}
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-black/70 mb-1.5">
                    Administrator Email
                  </label>
                  <div className="relative">
                    <Mail className="size-4 text-black/40 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="admin@kurmaluxury.com"
                      required
                      autoComplete="username"
                      className="w-full bg-white border border-black/15 rounded-xl pl-10 pr-4 py-2.5 text-xs text-black placeholder:text-black/35 focus:outline-hidden focus:border-[#072515] focus:ring-1 focus:ring-[#072515] transition-all font-sans"
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-black/70">
                      Security Password
                    </label>
                  </div>
                  <div className="relative">
                    <KeyRound className="size-4 text-black/40 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      required
                      autoComplete="current-password"
                      className="w-full bg-white border border-black/15 rounded-xl pl-10 pr-10 py-2.5 text-xs text-black placeholder:text-black/35 focus:outline-hidden focus:border-[#072515] focus:ring-1 focus:ring-[#072515] transition-all font-sans"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="p-1.5 text-black/40 hover:text-black absolute right-2.5 top-1/2 -translate-y-1/2 rounded-md"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                    </button>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full mt-2 py-3 px-4 rounded-xl bg-[#072515] hover:bg-[#0b3820] text-[#eed08e] font-medium text-xs tracking-wider uppercase transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed group cursor-pointer"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="size-4 animate-spin text-[#eed08e]" />
                      <span>Verifying Credentials...</span>
                    </>
                  ) : (
                    <>
                      <Lock className="size-3.5 text-[#eed08e]" />
                      <span>Authenticate Sovereign Admin</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </main>

        {/* Bottom Bar */}
        <footer className="px-6 py-4 text-center text-[11px] text-[#FAF8F5]/40 border-t border-[#eed08e]/10 relative z-10">
          Kurma Luxury Atelier & Co. • Restricted Administrative System • All Rights Reserved
        </footer>
      </div>
    );
  }

  // 3. Authenticated State -> Render Children in Context
  return (
    <AdminAuthContext.Provider value={contextValue}>
      {children}
    </AdminAuthContext.Provider>
  );
}
