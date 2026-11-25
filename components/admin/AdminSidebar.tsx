"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Home,
  Inbox,
  Package,
  UsersRound,
  BadgePercent,
  ChartNoAxesCombined,
  ChevronRight,
  LogOut,
  X,
} from "lucide-react";
import { useAdminAuth } from "@/components/admin/AdminAuthGuard";

export interface AdminSidebarProps {
  currentRoute?: "home" | "orders" | "products" | "customers" | "discounts" | "analytics";
  currentSubView?: string;
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
  discountsCount?: number;
  customersCount?: number;
  abandonedCount?: number;
  onSelectRoute?: (
    route: "home" | "orders" | "products" | "customers" | "discounts" | "analytics",
    subView?: string
  ) => void;
}

export default function AdminSidebar({
  currentRoute = "discounts",
  currentSubView = "all",
  mobileOpen = false,
  onCloseMobile,
  discountsCount,
  customersCount,
  abandonedCount,
  onSelectRoute,
}: AdminSidebarProps) {
  const router = useRouter();
  const { adminUser, logout } = useAdminAuth();

  const [ordersExpanded, setOrdersExpanded] = useState(true);
  const [productsExpanded, setProductsExpanded] = useState(true);

  const [counts, setCounts] = useState({
    discounts: discountsCount ?? 11,
    customers: customersCount ?? 6,
    abandoned: abandonedCount ?? 1,
  });

  useEffect(() => {
    if (discountsCount !== undefined || customersCount !== undefined || abandonedCount !== undefined) {
      setCounts({
        discounts: discountsCount ?? counts.discounts,
        customers: customersCount ?? counts.customers,
        abandoned: abandonedCount ?? counts.abandoned,
      });
      return;
    }

    let isMounted = true;
    Promise.allSettled([
      fetch("/api/admin/discounts").then((r) => r.json()),
      fetch("/api/admin/customers", { credentials: "include", cache: "no-store" }).then((r) => r.json()),
      fetch("/api/admin/orders").then((r) => r.json()),
    ]).then(([discRes, custRes, ordRes]) => {
      if (!isMounted) return;
      let dCount = counts.discounts;
      let cCount = counts.customers;
      let aCount = counts.abandoned;

      if (discRes.status === "fulfilled" && Array.isArray(discRes.value?.discounts)) {
        dCount = discRes.value.discounts.length;
      }
      if (custRes.status === "fulfilled" && Array.isArray(custRes.value?.customers)) {
        cCount = custRes.value.customers.length;
      }
      if (ordRes.status === "fulfilled" && Array.isArray(ordRes.value?.orders)) {
        aCount = ordRes.value.orders.filter((o: any) => o.isAbandoned).length;
      }

      setCounts({
        discounts: dCount,
        customers: cCount,
        abandoned: aCount,
      });
    });

    return () => {
      isMounted = false;
    };
  }, [discountsCount, customersCount, abandonedCount]);

  const handleNav = (
    route: "home" | "orders" | "products" | "customers" | "discounts" | "analytics",
    subView: string = "all"
  ) => {
    if (onCloseMobile) onCloseMobile();
    if (onSelectRoute) {
      onSelectRoute(route, subView);
    } else {
      if (subView && subView !== "all") {
        router.push(`/admin?route=${route}&subview=${subView}`);
      } else {
        router.push(`/admin?route=${route}`);
      }
    }
  };

  return (
    <>
      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-black/40 z-40 lg:hidden backdrop-blur-xs transition-opacity"
        />
      )}

      {/* Sidebar Aside */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-40 w-72 bg-white text-[#11110f] flex flex-col border-r border-black/10
          transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:sticky lg:top-0 lg:h-screen lg:shrink-0
          ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        {/* Brand Header */}
        <div className="h-20 px-4 border-b border-black/10 flex items-center justify-between">
          <Link
            href="/admin"
            className="flex items-center gap-3.5 rounded-lg group"
            aria-label="Admin Dashboard"
            onClick={onCloseMobile}
          >
            <div className="relative w-16 h-16 sm:w-[72px] sm:h-[72px] shrink-0 flex items-center justify-center">
              <Image
                src="/images/logo-transparent.png"
                alt="Kurma Logo"
                width={80}
                height={80}
                className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105 pointer-events-none"
                priority
              />
            </div>
            <div className="min-w-0 flex-1 text-left">
              <span className="font-semibold text-base sm:text-lg text-[#11110f] tracking-tight block whitespace-nowrap">
                Admin Dashboard
              </span>
            </div>
          </Link>
          <button
            type="button"
            onClick={onCloseMobile}
            className="lg:hidden p-1.5 rounded-md text-black/50 hover:text-black hover:bg-black/5"
            aria-label="Close Sidebar"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1 text-xs">
          {/* 1. Home / Overview */}
          <button
            type="button"
            onClick={() => handleNav("home")}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-all ${
              currentRoute === "home"
                ? "bg-black/[0.08] text-black font-semibold shadow-2xs"
                : "text-black/70 hover:text-black hover:bg-black/[0.04]"
            }`}
          >
            <Home className={`size-4 ${currentRoute === "home" ? "text-black" : "text-black/55"}`} />
            <span className="flex-1 text-left">Home</span>
          </button>

          {/* 2. Orders Group */}
          <div className="pt-1">
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => handleNav("orders", "all")}
                className={`flex-1 flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-all ${
                  currentRoute === "orders" && currentSubView === "all"
                    ? "bg-black/[0.08] text-black font-semibold shadow-2xs"
                    : "text-black/70 hover:text-black hover:bg-black/[0.04]"
                }`}
              >
                <Inbox
                  className={`size-4 ${
                    currentRoute === "orders" && currentSubView === "all" ? "text-black" : "text-black/55"
                  }`}
                />
                <span className="text-left">Orders</span>
              </button>
              <button
                type="button"
                onClick={() => setOrdersExpanded(!ordersExpanded)}
                className="p-2 text-black/45 hover:text-black"
                aria-label="Toggle Orders menu"
              >
                <ChevronRight
                  className={`size-3.5 transition-transform duration-200 ${ordersExpanded ? "rotate-90" : ""}`}
                />
              </button>
            </div>

            {ordersExpanded && (
              <div className="relative ml-5 pl-4 mt-1 space-y-0.5">
                <svg
                  aria-hidden="true"
                  className="pointer-events-none absolute left-0 top-0 overflow-visible text-black/25"
                  width="16"
                  height="42"
                  viewBox="0 0 16 42"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.25"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M1 0 V22" />
                  <path d="M1 18 Q1 22 5 22 H12" />
                  <path d="M10 19 L13 22 L10 25" />
                </svg>

                <button
                  type="button"
                  onClick={() => handleNav("orders", "abandoned")}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-[11px] transition-colors ${
                    currentRoute === "orders" && currentSubView === "abandoned"
                      ? "text-black font-semibold bg-black/5"
                      : "text-black/65 hover:text-black hover:bg-black/5"
                  }`}
                >
                  <span>Abandoned checkouts</span>
                  <span className="px-1.5 py-0.5 rounded text-[10px] bg-amber-100 text-amber-800 font-medium">
                    {counts.abandoned}
                  </span>
                </button>
              </div>
            )}
          </div>

          {/* 3. Products Group */}
          <div className="pt-1">
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => handleNav("products", "all")}
                className={`flex-1 flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-all ${
                  currentRoute === "products" && currentSubView === "all"
                    ? "bg-black/[0.08] text-black font-semibold shadow-2xs"
                    : "text-black/70 hover:text-black hover:bg-black/[0.04]"
                }`}
              >
                <Package
                  className={`size-4 ${
                    currentRoute === "products" && currentSubView === "all" ? "text-black" : "text-black/55"
                  }`}
                />
                <span className="text-left">Products</span>
              </button>
              <button
                type="button"
                onClick={() => setProductsExpanded(!productsExpanded)}
                className="p-2 text-black/45 hover:text-black"
                aria-label="Toggle Products menu"
              >
                <ChevronRight
                  className={`size-3.5 transition-transform duration-200 ${productsExpanded ? "rotate-90" : ""}`}
                />
              </button>
            </div>

            {productsExpanded && (
              <div className="relative ml-5 pl-4 mt-1 space-y-0.5">
                <svg
                  aria-hidden="true"
                  className="pointer-events-none absolute left-0 top-0 overflow-visible text-black/25"
                  width="16"
                  height="42"
                  viewBox="0 0 16 42"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.25"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M1 0 V22" />
                  <path d="M1 18 Q1 22 5 22 H12" />
                  <path d="M10 19 L13 22 L10 25" />
                </svg>

                <button
                  type="button"
                  onClick={() => handleNav("products", "customise")}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-[11px] transition-colors ${
                    currentRoute === "products" && currentSubView === "customise"
                      ? "text-black font-semibold bg-black/5"
                      : "text-black/65 hover:text-black hover:bg-black/5"
                  }`}
                >
                  <span>Customise</span>
                  <span className="px-1.5 py-0.5 rounded text-[10px] bg-[#072515]/10 text-[#072515] font-semibold">
                    Bespoke
                  </span>
                </button>
              </div>
            )}
          </div>

          {/* 4. Customers */}
          <button
            type="button"
            onClick={() => handleNav("customers")}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-all ${
              currentRoute === "customers"
                ? "bg-black/[0.08] text-black font-semibold shadow-2xs"
                : "text-black/70 hover:text-black hover:bg-black/[0.04]"
            }`}
          >
            <UsersRound
              className={`size-4 ${currentRoute === "customers" ? "text-black" : "text-black/55"}`}
            />
            <span className="flex-1 text-left">Customers</span>
            <span className="px-1.5 py-0.5 rounded text-[10px] bg-black/5 text-black/70 font-medium">
              {counts.customers}
            </span>
          </button>

          {/* 5. Discounts (Active for Discount pages) */}
          <button
            type="button"
            onClick={() => handleNav("discounts")}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-all ${
              currentRoute === "discounts"
                ? "bg-black/[0.08] text-black font-semibold shadow-2xs"
                : "text-black/70 hover:text-black hover:bg-black/[0.04]"
            }`}
          >
            <BadgePercent
              className={`size-4 ${currentRoute === "discounts" ? "text-black" : "text-black/55"}`}
            />
            <span className="flex-1 text-left">Discounts</span>
            <span className="px-1.5 py-0.5 rounded text-[10px] bg-black/5 text-black/70 font-medium">
              {counts.discounts}
            </span>
          </button>

          {/* 6. Analytics */}
          <button
            type="button"
            onClick={() => handleNav("analytics")}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-all ${
              currentRoute === "analytics"
                ? "bg-black/[0.08] text-black font-semibold shadow-2xs"
                : "text-black/70 hover:text-black hover:bg-black/[0.04]"
            }`}
          >
            <ChartNoAxesCombined
              className={`size-4 ${currentRoute === "analytics" ? "text-black" : "text-black/55"}`}
            />
            <span className="flex-1 text-left">Analytics</span>
          </button>
        </nav>

        {/* User Profile Footer */}
        <div className="p-3 border-t border-black/10 bg-[#fafafa]">
          <div className="flex items-center gap-2.5 p-2 rounded-lg bg-white border border-black/10 shadow-xs hover:bg-black/[0.02] transition-colors">
            <div className="size-8 rounded-lg bg-black text-white flex items-center justify-center font-semibold text-xs shrink-0">
              {adminUser?.name ? adminUser.name.charAt(0).toUpperCase() : "A"}
            </div>
            <div className="min-w-0 flex-1 text-left">
              <p className="text-xs font-semibold text-black truncate">{adminUser?.name || "Admin"}</p>
              <p className="text-[11px] text-black/50 truncate">{adminUser?.email || "admin@kurmaluxury.com"}</p>
            </div>
            <button
              type="button"
              onClick={logout}
              title="Sign Out"
              className="p-1.5 rounded-md text-black/45 hover:text-black hover:bg-black/5 transition-colors cursor-pointer"
            >
              <LogOut className="size-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
