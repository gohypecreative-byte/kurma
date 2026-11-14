"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  ShoppingBag,
  Menu,
  X,
  Search,
  User,
  LogOut,
  Gift,
  Package,
  ChevronRight,
  PhoneCall,
  ShieldCheck,
} from "lucide-react";
import { PRODUCTS, formatPrice, ProductSKU } from "@/lib/products";
import { useProducts } from "@/lib/products-context";

interface NavbarProps {
  cartCount: number;
  onOpenCart: () => void;
  onExploreProducts?: () => void;
}

interface UserProfile {
  name: string;
  email: string;
  role?: string;
}

export function Navbar({ cartCount, onOpenCart }: NavbarProps) {
  const router = useRouter();
  const pathname = usePathname();

  // SSR Mount State for React Portals
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  // Popover / Drawer States
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);

  // Search States
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [drawerSearchQuery, setDrawerSearchQuery] = useState("");

  const searchCollections = [
    {
      title: "The 5 Sacred Elements Incense",
      href: "/shop",
      image: "/images/product/earth-front.png",
      itemCount: "5 Sacred Elemental Aromas",
    },
    {
      title: "Gift Trunks & Keepsake Suites",
      href: "/gift-trunks",
      image: "/images/product/marble-box-clean.png",
      itemCount: "4 Heirloom Keepsake Boxes",
    },
    {
      title: "Solid Brass Turtle Burners & Accessories",
      href: "/products/turtle-incense-holder",
      image: "/images/product/turtle-holder-clean.png",
      itemCount: "Handcrafted Solid Brass Burners",
    },
    {
      title: "Sacred Rituals & Meditation",
      href: "/ritual",
      image: "/images/product/banner-heritage-trunk.jpg",
      itemCount: "Morning & Evening Ritual Guides",
    },
  ];

  const { products, getProduct } = useProducts();

  const recommendedProducts = useMemo(() => {
    const defaultIds = [
      { id: "turtle-incense-holder", img: "/images/product/turtle-holder-portrait.jpg" },
      { id: "5-elements-suite", img: "/images/product/suite-portrait.jpg" },
      { id: "marble-gift-box", img: "/images/product/marble-portrait.jpg" },
      { id: "fragrance-earth", img: "/images/product/earth-portrait.jpg" },
      { id: "fragrance-water", img: "/images/product/water-portrait.jpg" },
      { id: "fragrance-fire", img: "/images/product/fire-portrait.jpg" },
      { id: "fragrance-air", img: "/images/product/air-portrait.jpg" },
      { id: "fragrance-space", img: "/images/product/space-portrait.jpg" },
    ];
    const list: Array<ProductSKU & { displayImage?: string }> = [];
    for (const item of defaultIds) {
      const p = getProduct(item.id) || PRODUCTS.find((prod) => prod.id === item.id);
      if (p) {
        list.push({
          ...p,
          displayImage: p.image || item.img,
        });
      }
    }
    return list;
  }, [getProduct]);

  useEffect(() => {
    if (searchOpen) {
      const timer = setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [searchOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && searchOpen) {
        setSearchOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [searchOpen]);

  // Auth User State
  const [user, setUser] = useState<UserProfile | null>(null);

  const isAdmin =
    user?.role === "ADMIN" ||
    user?.email === "admin@kurmaluxury.com" ||
    user?.email === "admin@kurma.com" ||
    user?.email === "vishal1@gmail.com" ||
    user?.email === "vishalsingh123764@gmail.com";
  const userDisplayName = isAdmin ? "Admin" : (user?.name || "Patron");

  // Anti-bounce click timestamp and modal open timestamp refs
  // Guarantees zero double-firing from mobile touch/click synthesis
  // and prevents synthetic click events from immediately dismissing newly opened backdrops
  const lastActionTimeRef = useRef(0);
  const searchOpenedAtRef = useRef(0);
  const mobileMenuOpenedAtRef = useRef(0);

  const guardAction = (action: () => void, threshold = 350) => {
    const now = Date.now();
    if (now - lastActionTimeRef.current < threshold) {
      return;
    }
    lastActionTimeRef.current = now;
    action();
  };

  // Load saved user from localStorage
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem("kurma_user");
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
    } catch {
      // ignore parsing error
    }
  }, []);

  // Auto-close popovers & menus on route navigation
  useEffect(() => {
    setMobileMenuOpen(false);
    setSearchOpen(false);
    setAccountMenuOpen(false);
  }, [pathname]);

  // Lock body scroll cleanly when mobile menu or search modal is open
  useEffect(() => {
    if (!mobileMenuOpen && !searchOpen) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [mobileMenuOpen, searchOpen]);

  // Auto-close mobile drawer on desktop resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Global keyboard shortcut: Cmd+K / Ctrl+K to open search, Esc to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        guardAction(() => {
          setSearchOpen((prev) => {
            const next = !prev;
            if (next) searchOpenedAtRef.current = Date.now();
            return next;
          });
        });
      }
      if (e.key === "Escape") {
        setSearchOpen(false);
        setAccountMenuOpen(false);
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Auto-focus search input when search modal opened (with safe delay for mobile keyboard)
  useEffect(() => {
    if (searchOpen) {
      const timer = setTimeout(() => {
        searchInputRef.current?.focus();
      }, 150);
      return () => clearTimeout(timer);
    } else {
      setSearchQuery("");
    }
  }, [searchOpen]);

  // Unified Toggle Handlers with Touch-safe Guard
  const handleToggleSearch = (e?: React.MouseEvent | React.TouchEvent) => {
    if (e) {
      e.stopPropagation();
    }
    guardAction(() => {
      setMobileMenuOpen(false);
      setAccountMenuOpen(false);
      setSearchOpen((prev) => {
        const next = !prev;
        if (next) searchOpenedAtRef.current = Date.now();
        return next;
      });
    });
  };

  const handleToggleMobileMenu = (e?: React.MouseEvent | React.TouchEvent) => {
    if (e) {
      e.stopPropagation();
    }
    guardAction(() => {
      setSearchOpen(false);
      setAccountMenuOpen(false);
      setMobileMenuOpen((prev) => {
        const next = !prev;
        if (next) mobileMenuOpenedAtRef.current = Date.now();
        return next;
      });
    });
  };

  const handleOpenCartDrawer = (e?: React.MouseEvent | React.TouchEvent) => {
    if (e) {
      e.stopPropagation();
    }
    guardAction(() => {
      setMobileMenuOpen(false);
      setSearchOpen(false);
      setAccountMenuOpen(false);
      onOpenCart();
    });
  };

  const handleToggleAccountMenu = (e?: React.MouseEvent | React.TouchEvent) => {
    if (e) {
      e.stopPropagation();
    }
    guardAction(() => {
      setMobileMenuOpen(false);
      setSearchOpen(false);
      setAccountMenuOpen((prev) => !prev);
    });
  };

  // Safe backdrop dismissal handlers (ignore clicks within 350ms of open to prevent mobile ghost clicks)
  const handleCloseSearchModal = (e: React.MouseEvent) => {
    if (e.target !== e.currentTarget) return;
    if (Date.now() - searchOpenedAtRef.current < 350) return;
    setSearchOpen(false);
  };

  const handleCloseMobileMenu = (e: React.MouseEvent) => {
    if (e.target !== e.currentTarget) return;
    if (Date.now() - mobileMenuOpenedAtRef.current < 350) return;
    setMobileMenuOpen(false);
  };

  // Live product search filtering
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase().trim();
    return products.filter((p) => {
      return (
        p.name.toLowerCase().includes(q) ||
        p.subtitle.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.badge?.toLowerCase().includes(q) ||
        p.elements?.some((el) => el.toLowerCase().includes(q))
      );
    }).slice(0, 6);
  }, [searchQuery, products]);

  // Quick search keywords
  const popularKeywords = [
    "Solid Brass Turtle",
    "5 Elements Suite",
    "Mysore Sandalwood",
    "Marble Gift Box",
    "Water Element",
    "Temple Flora",
  ];

  // Handle Search Result Selection
  const handleSelectProduct = (productId: string) => {
    setSearchOpen(false);
    setSearchQuery("");
    router.push(`/products/${productId}`);
  };

  // Submit search query
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setSearchOpen(false);
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleDrawerSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (drawerSearchQuery.trim()) {
      setMobileMenuOpen(false);
      router.push(`/search?q=${encodeURIComponent(drawerSearchQuery.trim())}`);
    }
  };

  const handleSignOut = () => {
    if (isAdmin) {
      try {
        fetch("/api/auth/admin-session", { method: "POST" });
      } catch {}
    }
    localStorage.removeItem("kurma_user");
    setUser(null);
    setAccountMenuOpen(false);
  };

  const desktopNavLinks = [
    { name: "HOME", href: "/" },
    { name: "SHOP", href: "/shop" },
    { name: "CUSTOMISE", href: "/elements" },
    { name: "ABOUT", href: "/about" },
    { name: "CONTACT", href: "/contact" },
  ];

  const mobileNavLinks = [
    { name: "Home", href: "/", badge: "Sanctuary" },
    { name: "Shop All Creations", href: "/shop", badge: "Collection" },
    { name: "Customise 5 Elements", href: "/elements", badge: "Bespoke" },
    { name: "Ritual & Sacred Guide", href: "/ritual", badge: "Wisdom" },
    { name: "Patron Reviews", href: "/reviews", badge: "Stories" },
    { name: "About Kurma", href: "/about", badge: "Heritage" },
    { name: "Contact & Concierge", href: "/contact", badge: "Support" },
  ];

  return (
    <>
      {/* ========================================================================= */}
      {/* 1. TOP STICKY HEADER (z-[60] to remain securely above standard content) */}
      {/* ========================================================================= */}
      <header className="sticky top-0 z-[60] w-full bg-[#092B20]/95 backdrop-blur-md border-b border-[#28513B]/40 text-[#E8D9AE] shadow-2xs">
        <div className="w-full px-3.5 sm:px-6 md:px-8 lg:px-12 xl:px-16 h-16 sm:h-20 flex items-center justify-between">
          {/* Brand Logo */}
          <Link
            href="/"
            onClick={() => {
              setMobileMenuOpen(false);
              setSearchOpen(false);
              setAccountMenuOpen(false);
            }}
            className="flex items-center group shrink-0"
            aria-label="Kurma Home"
          >
            <div className="relative w-14 h-14 sm:w-[68px] sm:h-[68px] lg:w-[74px] lg:h-[74px] flex items-center justify-center shrink-0">
              <Image
                src="/images/logo-transparent.png"
                alt="Kurma Logo"
                width={80}
                height={80}
                className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105 pointer-events-none"
                priority
              />
            </div>
          </Link>

          {/* Desktop Navigation Links (>= 1024px) */}
          <nav className="hidden lg:flex items-center space-x-7 xl:space-x-8 text-[13px] xl:text-[13.5px] font-semibold uppercase tracking-wider">
            {desktopNavLinks.map((link) => {
              const isActive =
                link.href === "/"
                  ? pathname === "/"
                  : pathname?.startsWith(link.href);

              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`relative py-2 transition-colors cursor-pointer ${
                    isActive
                      ? "text-[#C5A45B] font-semibold"
                      : "text-[#E8D9AE]/85 hover:text-[#C5A45B]"
                  }`}
                >
                  <span>{link.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right Action CTAs: Search, Login/Account, Cart, Hamburger */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0 z-20">
            {/* 1. SEARCH BUTTON */}
            <button
              type="button"
              onClick={handleToggleSearch}
              aria-label={searchOpen ? "Close search modal" : "Search creations"}
              title="Search (Ctrl+K)"
              className={`w-10 h-10 sm:w-11 sm:h-11 shrink-0 rounded-full border flex items-center justify-center transition-colors cursor-pointer touch-manipulation shadow-2xs hover:shadow-xs ${
                searchOpen
                  ? "bg-[#123D2D] text-[#C5A45B] border-[#28513B]/60"
                  : "bg-transparent hover:bg-[#123D2D]/60 active:bg-[#123D2D] text-[#E8D9AE]/90 hover:text-[#C5A45B] border-transparent hover:border-[#28513B]/40"
              }`}
            >
              <Search className="w-4.5 h-4.5 stroke-[1.8] pointer-events-none" />
            </button>

            {/* 2. LOGIN / ACCOUNT BUTTON */}
            <div className="relative shrink-0">
              {user ? (
                // Logged-in State: User Avatar Button & Dropdown
                <>
                  <button
                    type="button"
                    onClick={handleToggleAccountMenu}
                    aria-label={`Account menu for ${userDisplayName}`}
                    className="h-10 sm:h-11 px-3.5 sm:px-4 shrink-0 rounded-full border border-[#28513B]/60 hover:border-[#C5A45B]/60 bg-[#123D2D]/60 hover:bg-[#123D2D] active:bg-[#123D2D] text-[#E8D9AE] hover:text-[#C5A45B] flex items-center justify-center transition-colors shadow-2xs hover:shadow-xs cursor-pointer touch-manipulation"
                  >
                    <span className="text-xs sm:text-[13px] font-semibold tracking-wide max-w-[100px] truncate pointer-events-none">
                      {userDisplayName}
                    </span>
                  </button>

                  {/* Account Popover Menu */}
                  {accountMenuOpen && (
                    <>
                      <div
                        className="fixed inset-0 z-30"
                        onClick={() => setAccountMenuOpen(false)}
                      />
                      <div className="absolute right-0 mt-2 w-56 bg-[#123D2D] rounded-2xl shadow-xl border border-[#28513B] py-2.5 z-40 animate-in fade-in zoom-in-95 duration-150 text-[#E8D9AE]">
                        <div className="px-4 py-2 border-b border-[#28513B]/40">
                          <p className="text-xs font-bold truncate text-white">
                            {userDisplayName}
                          </p>
                          <p className="text-[11px] text-[#E8D9AE]/70 truncate">
                            {user.email}
                          </p>
                        </div>
                        <div className="py-1">
                          {isAdmin && (
                            <button
                              type="button"
                              onClick={() => {
                                setAccountMenuOpen(false);
                                router.push("/admin");
                              }}
                              className="w-full px-4 py-2 text-left text-xs font-semibold text-[#C5A45B] hover:bg-[#092B20] flex items-center gap-2 cursor-pointer transition-colors border-b border-[#28513B]/40"
                            >
                              <ShieldCheck className="w-3.5 h-3.5 text-[#C5A45B] pointer-events-none" />
                              <span>Admin Dashboard</span>
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => {
                              setAccountMenuOpen(false);
                              router.push("/track-order");
                            }}
                            className="w-full px-4 py-2 text-left text-xs text-[#E8D9AE] hover:bg-[#092B20] hover:text-[#C5A45B] flex items-center gap-2 cursor-pointer transition-colors"
                          >
                            <Package className="w-3.5 h-3.5 text-[#E8D9AE]/60 pointer-events-none" />
                            <span>Track Orders &amp; Consignments</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setAccountMenuOpen(false);
                              router.push("/elements");
                            }}
                            className="w-full px-4 py-2 text-left text-xs text-[#E8D9AE] hover:bg-[#092B20] hover:text-[#C5A45B] flex items-center gap-2 cursor-pointer transition-colors"
                          >
                            <Gift className="w-3.5 h-3.5 text-[#E8D9AE]/60 pointer-events-none" />
                            <span>Custom Keepsake Hamper</span>
                          </button>
                        </div>
                        <div className="pt-1 border-t border-[#28513B]/40">
                          <button
                            type="button"
                            onClick={handleSignOut}
                            className="w-full px-4 py-2 text-left text-xs text-red-400 hover:bg-[#092B20] flex items-center gap-2 cursor-pointer transition-colors"
                          >
                            <LogOut className="w-3.5 h-3.5 pointer-events-none" />
                            <span>Sign Out</span>
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </>
              ) : (
                // Guest / Not Logged In Button -> Navigate directly to dedicated login page
                <Link
                  href="/login"
                  prefetch={true}
                  aria-label="Patron Sign In"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setSearchOpen(false);
                    setAccountMenuOpen(false);
                  }}
                  className="w-10 h-10 sm:w-11 sm:h-11 shrink-0 rounded-full border border-transparent hover:border-[#28513B]/40 bg-transparent hover:bg-[#123D2D]/60 active:bg-[#123D2D] text-[#E8D9AE]/90 hover:text-[#C5A45B] flex items-center justify-center transition-colors shadow-2xs hover:shadow-xs cursor-pointer touch-manipulation"
                >
                  <User className="w-4.5 h-4.5 stroke-[1.8] pointer-events-none" />
                </Link>
              )}
            </div>

            {/* 3. CART ICON BUTTON */}
            <button
              type="button"
              onClick={handleOpenCartDrawer}
              aria-label={`View shopping cart with ${cartCount} items`}
              className="relative w-10 h-10 sm:w-11 sm:h-11 shrink-0 rounded-full border border-transparent hover:border-[#28513B]/40 bg-transparent hover:bg-[#123D2D]/60 active:bg-[#123D2D] text-[#E8D9AE]/90 hover:text-[#C5A45B] flex items-center justify-center transition-colors shadow-2xs hover:shadow-xs cursor-pointer touch-manipulation"
            >
              <ShoppingBag className="w-4.5 h-4.5 sm:w-5 sm:h-5 stroke-[1.75] text-[#E8D9AE]/90 pointer-events-none" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[19px] h-[19px] px-1 bg-[#C5A45B] text-[#092B20] border border-[#092B20] rounded-full text-[10px] font-bold flex items-center justify-center shadow-xs pointer-events-none">
                  {cartCount}
                </span>
              )}
            </button>

            {/* 4. MOBILE HAMBURGER TOGGLE BUTTON */}
            <button
              type="button"
              onClick={handleToggleMobileMenu}
              aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-navigation"
              className={`w-10 h-10 sm:w-11 sm:h-11 shrink-0 rounded-full border flex items-center justify-center transition-colors cursor-pointer touch-manipulation shadow-2xs hover:shadow-xs lg:hidden ${
                mobileMenuOpen
                  ? "bg-[#123D2D] text-[#C5A45B] border-[#28513B]/60"
                  : "bg-transparent hover:bg-[#123D2D]/60 active:bg-[#123D2D] text-[#E8D9AE]/90 hover:text-[#C5A45B] border-transparent hover:border-[#28513B]/40"
              }`}
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5 pointer-events-none" />
              ) : (
                <Menu className="w-5 h-5 pointer-events-none" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* 2. MOBILE NAVIGATION DRAWER & SEARCH MODAL (VIA REACT PORTALS)            */}
      {/* Mount directly into document.body to isolate from sticky & transformed    */}
      {/* layouts, guaranteeing 100% reliable touch coordinates on actual mobile    */}
      {/* ========================================================================= */}
      {mounted && typeof document !== "undefined" && (
        <>
          {/* MOBILE NAVIGATION DRAWER */}
          {mobileMenuOpen &&
            createPortal(
              <div
                className="fixed top-16 sm:top-20 inset-x-0 bottom-0 z-[70] lg:hidden flex flex-col justify-start"
                role="dialog"
                aria-modal="true"
                aria-label="Mobile Navigation Menu"
              >
                {/* Backdrop below header */}
                <div
                  className="absolute inset-0 bg-stone-950/60 backdrop-blur-xs transition-opacity duration-200"
                  onClick={handleCloseMobileMenu}
                  aria-hidden="true"
                />

                {/* Slide-Down Drawer Container */}
                <div
                  id="mobile-navigation"
                  className="relative z-10 w-full bg-[#092B20] border-b border-[#28513B]/40 shadow-2xl flex flex-col max-h-[calc(100dvh-4rem)] sm:max-h-[calc(100dvh-5rem)] overflow-y-auto overscroll-contain text-[#E8D9AE] transition-all duration-200 p-4 sm:p-5 space-y-4"
                >
                  {/* 1. In-Drawer Live Search Form */}
                  <form
                    onSubmit={handleDrawerSearchSubmit}
                    className="relative flex items-center bg-[#123D2D] border border-[#28513B]/60 rounded-xl px-3 py-2.5 shadow-2xs focus-within:border-[#C5A45B] focus-within:bg-[#123D2D] transition-all"
                  >
                    <Search className="w-4 h-4 text-[#C5A45B] mr-2 shrink-0 pointer-events-none" />
                    <input
                      type="text"
                      value={drawerSearchQuery}
                      onChange={(e) => setDrawerSearchQuery(e.target.value)}
                      placeholder="Search creations, brass burners, scents..."
                      className="w-full bg-transparent border-none outline-none text-xs sm:text-sm text-[#E8D9AE] placeholder:text-[#E8D9AE]/50 font-sans"
                    />
                    {drawerSearchQuery ? (
                      <button
                        type="button"
                        onClick={() => setDrawerSearchQuery("")}
                        className="p-1 text-[#E8D9AE]/60 hover:text-[#E8D9AE] cursor-pointer touch-manipulation"
                        aria-label="Clear search input"
                      >
                        <X className="w-4 h-4 pointer-events-none" />
                      </button>
                    ) : (
                      <button
                        type="submit"
                        className="text-[11px] font-bold text-[#C5A45B] uppercase tracking-wider shrink-0 cursor-pointer touch-manipulation px-1"
                      >
                        Search
                      </button>
                    )}
                  </form>

                  {/* 2. Navigation Link Cards */}
                  <nav className="space-y-1.5" aria-label="Mobile Navigation Links">
                    {mobileNavLinks.map((link) => {
                      const isActive =
                        link.href === "/"
                          ? pathname === "/"
                          : pathname?.startsWith(link.href);

                      return (
                        <Link
                          key={link.name}
                          href={link.href}
                          prefetch={true}
                          onClick={() => setMobileMenuOpen(false)}
                          className={`flex items-center justify-between px-3.5 py-3 rounded-xl transition-all cursor-pointer touch-manipulation ${
                            isActive
                              ? "bg-[#123D2D] text-[#C5A45B] font-bold border border-[#28513B]/60 shadow-xs"
                              : "bg-[#092B20]/80 hover:bg-[#123D2D] text-[#E8D9AE] border border-[#28513B]/30"
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <span className="text-xs sm:text-sm font-semibold tracking-wide uppercase font-sans">
                              {link.name}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span
                              className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full ${
                                isActive
                                  ? "bg-[#C5A45B]/20 text-[#C5A45B]"
                                  : "bg-[#123D2D] text-[#E8D9AE]/70 border border-[#28513B]/40"
                              }`}
                            >
                              {link.badge}
                            </span>
                            <ChevronRight
                              className={`w-4 h-4 ${
                                isActive ? "text-[#C5A45B]" : "text-[#28513B]"
                              }`}
                            />
                          </div>
                        </Link>
                      );
                    })}
                  </nav>

                  {/* 3. Account / Login Drawer Area */}
                  <div className="pt-2 border-t border-[#28513B]/40">
                    {user ? (
                      <div className="p-3.5 rounded-2xl bg-[#123D2D] border border-[#28513B]/60 space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-full bg-[#092B20] text-[#C5A45B] border border-[#28513B] flex items-center justify-center text-xs font-bold">
                              {userDisplayName.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <p className="text-xs font-bold text-white truncate max-w-[160px]">
                                {userDisplayName}
                              </p>
                              <p className="text-[10px] text-[#E8D9AE]/70 truncate max-w-[160px]">
                                {user.email}
                              </p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={handleSignOut}
                            className="text-xs font-semibold text-red-400 hover:underline cursor-pointer touch-manipulation"
                          >
                            Sign Out
                          </button>
                        </div>

                        {isAdmin && (
                          <button
                            type="button"
                            onClick={() => {
                              setMobileMenuOpen(false);
                              router.push("/admin");
                            }}
                            className="w-full py-2 px-3 rounded-xl bg-[#092B20] text-[#C5A45B] text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer shadow-xs touch-manipulation border border-[#28513B]"
                          >
                            <ShieldCheck className="w-3.5 h-3.5 text-[#C5A45B]" />
                            <span>Open Admin Dashboard</span>
                          </button>
                        )}

                        <div className="grid grid-cols-2 gap-2 pt-0.5">
                          <button
                            type="button"
                            onClick={() => {
                              setMobileMenuOpen(false);
                              router.push("/shop");
                            }}
                            className="py-2.5 px-3 rounded-xl bg-[#092B20] border border-[#28513B] text-[#E8D9AE] text-xs font-semibold text-center hover:bg-[#123D2D] active:bg-[#123D2D] cursor-pointer shadow-2xs touch-manipulation"
                          >
                            My Orders
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setMobileMenuOpen(false);
                              router.push("/elements");
                            }}
                            className="py-2.5 px-3 rounded-xl bg-[#C5A45B] text-[#092B20] text-xs font-semibold text-center hover:bg-[#E8D9AE] active:bg-[#E8D9AE] cursor-pointer shadow-xs touch-manipulation"
                          >
                            Custom Hamper
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 gap-2">
                        <Link
                          href="/login"
                          prefetch={true}
                          onClick={() => setMobileMenuOpen(false)}
                          className="w-full py-3 px-3 rounded-xl bg-[#C5A45B] hover:bg-[#E8D9AE] text-[#092B20] text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer shadow-sm transition-colors touch-manipulation"
                        >
                          <User className="w-3.5 h-3.5 pointer-events-none" />
                          <span>Sign In</span>
                        </Link>
                        <Link
                          href="/signup"
                          prefetch={true}
                          onClick={() => setMobileMenuOpen(false)}
                          className="w-full py-3 px-3 rounded-xl bg-[#123D2D] hover:bg-[#28513B]/40 border border-[#28513B] text-[#E8D9AE] text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer shadow-sm transition-colors touch-manipulation"
                        >
                          <span>Sign Up</span>
                        </Link>
                      </div>
                    )}
                  </div>

                  {/* 4. Mobile Concierge Hotline Snippet */}
                  <div className="pt-2 flex items-center justify-between text-[11px] text-[#E8D9AE]/70 font-sans border-t border-[#28513B]/40">
                    <span className="flex items-center gap-1.5">
                      <PhoneCall className="w-3 h-3 text-[#C5A45B]" />
                      Concierge Assistance
                    </span>
                    <a
                      href="tel:+918005876200"
                      className="font-semibold text-[#E8D9AE] hover:text-[#C5A45B]"
                    >
                      +91 800-KURMA-01
                    </a>
                  </div>
                </div>
              </div>,
              document.body
            )}

          {/* TOP FULL-WIDTH LUXURY SEARCH OVERLAY (ATTACHED TIGHTLY TO TOP WITH SMOOTH SLIDE-DOWN ANIMATION) */}
          {createPortal(
            <AnimatePresence>
              {searchOpen && (
                <div
                  className="fixed inset-0 z-[100] overflow-hidden select-none"
                  role="dialog"
                  aria-modal="true"
                  aria-label="Search Kurma Creations & Collections"
                >
                  {/* Backdrop below panel */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                    className="fixed inset-0 bg-stone-950/65 backdrop-blur-xs"
                    onClick={handleCloseSearchModal}
                    aria-hidden="true"
                  />

                  {/* Top Dropdown Panel Attached Tightly Against Top (top: 0) with Smooth Slide-Down */}
                  <motion.div
                    initial={{ y: "-100%" }}
                    animate={{ y: 0 }}
                    exit={{ y: "-100%" }}
                    transition={{
                      type: "spring",
                      damping: 32,
                      stiffness: 300,
                      mass: 0.8,
                    }}
                    className="fixed top-0 inset-x-0 z-[110] bg-[#092B20] border-b border-[#28513B]/40 rounded-b-2xl shadow-2xl flex flex-col max-h-[calc(100dvh-2rem)] overflow-y-auto overscroll-contain text-[#E8D9AE]"
                  >
                    {/* Top Row: Navigation Links, Kurma Brand Logo & Icons (matching reference header) */}
                    <div className="w-full border-b border-[#28513B]/40 bg-[#092B20] shrink-0">
                      <div className="w-full px-3.5 sm:px-6 md:px-8 lg:px-12 xl:px-16 h-16 sm:h-20 flex items-center justify-between">
                        {/* Brand Logo */}
                        <Link
                          href="/"
                          onClick={() => setSearchOpen(false)}
                          className="flex items-center group shrink-0"
                          aria-label="Kurma Home"
                        >
                          <div className="relative w-14 h-14 sm:w-[68px] sm:h-[68px] lg:w-[74px] lg:h-[74px] flex items-center justify-center shrink-0">
                            <Image
                              src="/images/logo-transparent.png"
                              alt="Kurma Logo"
                              width={80}
                              height={80}
                              className="w-full h-full object-contain pointer-events-none"
                            />
                          </div>
                        </Link>

                        {/* Desktop Navigation Links */}
                        <nav className="hidden lg:flex items-center space-x-7 xl:space-x-8 text-[13px] xl:text-[13.5px] font-semibold uppercase tracking-wider">
                          {desktopNavLinks.map((link) => {
                            const isActive =
                              link.href === "/"
                                ? pathname === "/"
                                : pathname?.startsWith(link.href);

                            return (
                              <Link
                                key={link.name}
                                href={link.href}
                                onClick={() => setSearchOpen(false)}
                                className={`relative py-2 transition-colors cursor-pointer ${
                                  isActive
                                    ? "text-[#C5A45B] font-semibold"
                                    : "text-[#E8D9AE]/85 hover:text-[#C5A45B]"
                                }`}
                              >
                                <span>{link.name}</span>
                              </Link>
                            );
                          })}
                        </nav>

                        {/* Right Action Icons */}
                        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
                          {/* Active Search indicator button */}
                          <div className="w-10 h-10 sm:w-11 sm:h-11 shrink-0 rounded-full border bg-[#123D2D] text-[#C5A45B] border-[#28513B] flex items-center justify-center shadow-2xs">
                            <Search className="w-4.5 h-4.5 stroke-[1.8]" />
                          </div>

                          {/* Login / User button */}
                          <Link
                            href="/login"
                            onClick={() => setSearchOpen(false)}
                            aria-label="Patron Sign In"
                            className="w-10 h-10 sm:w-11 sm:h-11 shrink-0 rounded-full border border-[#28513B] bg-[#123D2D] text-[#E8D9AE] hover:text-[#C5A45B] flex items-center justify-center transition-colors shadow-2xs"
                          >
                            <User className="w-4.5 h-4.5 stroke-[1.8]" />
                          </Link>

                          {/* Cart Button */}
                          <button
                            type="button"
                            onClick={() => {
                              setSearchOpen(false);
                              handleOpenCartDrawer();
                            }}
                            className="relative w-10 h-10 sm:w-11 sm:h-11 shrink-0 rounded-full border border-[#28513B] bg-[#123D2D] text-[#E8D9AE] hover:text-[#C5A45B] flex items-center justify-center transition-colors shadow-2xs cursor-pointer"
                          >
                            <ShoppingBag className="w-4.5 h-4.5 sm:w-5 sm:h-5 stroke-[1.75] text-[#E8D9AE]" />
                            {cartCount > 0 && (
                              <span className="absolute -top-1 -right-1 min-w-[19px] h-[19px] px-1 bg-[#C5A45B] text-[#092B20] border border-[#092B20] rounded-full text-[10px] font-bold flex items-center justify-center shadow-xs">
                                {cartCount}
                              </span>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Search Bar Row & Content Container */}
                    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-6 space-y-6 sm:space-y-7">
                    {/* Search Bar Row (Refined Input with Search Icon + X Close Button beside it) */}
                    <div className="flex items-center gap-3 sm:gap-4 w-full">
                      <form
                        onSubmit={handleSearchSubmit}
                        className="flex-1 relative flex items-center bg-[#123D2D] focus-within:bg-[#123D2D] rounded-xl border border-[#28513B] focus-within:border-[#C5A45B] transition-all p-1.5 pl-4 sm:pl-6 pr-3 shadow-inner"
                      >
                        <input
                          ref={searchInputRef}
                          type="text"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          placeholder="Search here...."
                          className="flex-1 min-w-0 bg-transparent border-none outline-none text-xs sm:text-sm md:text-base text-[#E8D9AE] placeholder:text-[#E8D9AE]/50 font-sans py-1 sm:py-1.5 focus:outline-none focus:ring-0"
                          style={{ outline: "none", boxShadow: "none", border: "none" }}
                        />
                        {searchQuery && (
                          <button
                            type="button"
                            onClick={() => setSearchQuery("")}
                            className="p-1 rounded-full text-[#E8D9AE]/60 hover:text-[#E8D9AE] transition-colors mr-1 cursor-pointer"
                            aria-label="Clear search input"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        )}
                        <button
                          type="submit"
                          aria-label="Submit search"
                          className="p-1 text-[#C5A45B] hover:text-[#E8D9AE] transition-colors cursor-pointer"
                        >
                          <Search className="w-4.5 h-4.5 sm:w-5 sm:h-5 stroke-[1.8]" />
                        </button>
                      </form>

                      {/* Close 'X' Button on the Far Right */}
                      <button
                        type="button"
                        onClick={() => setSearchOpen(false)}
                        aria-label="Close search overlay"
                        className="p-2 sm:p-2.5 rounded-full bg-[#123D2D] hover:bg-[#28513B] text-[#E8D9AE] hover:text-[#C5A45B] transition-colors cursor-pointer shrink-0 touch-manipulation border border-[#28513B]"
                      >
                        <X className="w-5 h-5 sm:w-6 sm:h-6 stroke-[1.9]" />
                      </button>
                    </div>

                    {/* Main Content Area: Collections & Recommended Products when no query */}
                    {!searchQuery.trim() ? (
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-7 sm:gap-8 lg:gap-12 items-start pt-1">
                        {/* LEFT COLUMN: Collections List (exact layout from screenshot) */}
                        <div className="md:col-span-5 lg:col-span-5 space-y-3.5">
                          <div className="flex items-center justify-between pb-1">
                            <h3 className="text-sm sm:text-base font-bold text-[#E8D9AE] font-serif tracking-tight">
                              Collections
                            </h3>
                          </div>

                          <div className="divide-y divide-[#28513B]/40">
                            {searchCollections.map((col) => (
                              <Link
                                key={col.title}
                                href={col.href}
                                onClick={() => setSearchOpen(false)}
                                className="flex items-center gap-3.5 py-3 group cursor-pointer hover:bg-[#123D2D]/60 px-2 rounded-lg transition-all"
                              >
                                <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-md overflow-hidden bg-[#092B20] border border-[#28513B] shrink-0 p-1 shadow-2xs group-hover:scale-103 transition-transform">
                                  <Image
                                    src={col.image}
                                    alt={col.title}
                                    fill
                                    className="object-contain p-0.5 pointer-events-none"
                                  />
                                </div>
                                <div className="min-w-0 flex-1">
                                  <span className="text-xs sm:text-[13.5px] font-semibold text-[#E8D9AE] group-hover:text-[#C5A45B] transition-colors block font-serif truncate">
                                    {col.title}
                                  </span>
                                  <span className="text-[10.5px] text-stone-500 font-sans block mt-0.5">
                                    {col.itemCount}
                                  </span>
                                </div>
                                <ChevronRight className="w-4 h-4 text-stone-400 group-hover:text-[#8b5f10] group-hover:translate-x-0.5 transition-all shrink-0" />
                              </Link>
                            ))}
                          </div>
                        </div>

                        {/* RIGHT COLUMN: Recommended Products (Filling the empty space on the side) */}
                        <div className="md:col-span-7 lg:col-span-7 md:border-l md:border-[#DDD3C2]/70 md:pl-7 lg:pl-10 space-y-3.5">
                          <div className="flex items-center justify-between pb-1">
                            <h3 className="text-sm sm:text-base font-bold text-stone-900 font-serif tracking-tight">
                              Recommended Products
                            </h3>
                          </div>

                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
                            {recommendedProducts.map((product) => (
                              <div
                                key={product.id}
                                onClick={() => handleSelectProduct(product.id)}
                                title={product.name}
                                className="group/item bg-white hover:bg-[#FAF8F5] rounded-lg border border-[#DDD3C2] hover:border-[#8b5f10] p-2 sm:p-2.5 flex flex-col justify-between transition-all shadow-2xs hover:shadow-md cursor-pointer select-none"
                              >
                                <div className="relative w-full aspect-[3/4] rounded-md overflow-hidden bg-[#FAF8F5] flex items-center justify-center">
                                  <Image
                                    src={product.displayImage || product.image}
                                    alt={product.name}
                                    fill
                                    className="object-contain object-center group-hover/item:scale-105 transition-transform duration-500"
                                    sizes="(max-width: 640px) 45vw, 15vw"
                                  />
                                </div>

                                <div className="mt-2 pt-1.5 border-t border-stone-100 flex items-center justify-center">
                                  <span className="text-xs font-bold text-stone-900 group-hover/item:text-[#8b5f10] font-sans tracking-tight transition-colors">
                                    Rs. {product.price.toLocaleString("en-IN")}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ) : (
                      /* Live Search Results View */
                      <div className="space-y-4 pt-1">
                        <div className="flex items-center justify-between pb-2 text-xs text-stone-500 font-sans border-b border-[#DDD3C2]/60">
                          <span>
                            Found <strong className="text-stone-900">{searchResults.length}</strong>{" "}
                            {searchResults.length === 1 ? "creation" : "creations"} matching &ldquo;{searchQuery}&rdquo;
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              setSearchOpen(false);
                              router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
                            }}
                            className="text-[#8b5f10] font-bold hover:underline cursor-pointer touch-manipulation"
                          >
                            View in full catalog &rarr;
                          </button>
                        </div>

                        {searchResults.length > 0 ? (
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                            {searchResults.map((product) => (
                              <div
                                key={product.id}
                                onClick={() => handleSelectProduct(product.id)}
                                className="p-3 rounded-lg bg-white hover:bg-[#FAF8F5] border border-stone-200/90 hover:border-[#8b5f10] flex items-center justify-between gap-3.5 transition-all cursor-pointer group shadow-2xs hover:shadow-xs"
                              >
                                <div className="flex items-center gap-3.5 min-w-0">
                                  <div className="relative w-12 h-12 rounded-md bg-[#FAF8F5] border border-stone-200 overflow-hidden shrink-0 p-1">
                                    <Image
                                      src={product.image}
                                      alt={product.name}
                                      fill
                                      className="object-contain p-0.5 group-hover:scale-105 transition-transform pointer-events-none"
                                    />
                                  </div>
                                  <div className="min-w-0">
                                    <h4 className="text-xs sm:text-sm font-semibold text-stone-900 group-hover:text-[#8b5f10] truncate transition-colors font-serif">
                                      {product.name}
                                    </h4>
                                    <p className="text-[11px] text-stone-500 truncate">
                                      {product.subtitle}
                                    </p>
                                    <span className="inline-block mt-0.5 text-[9px] uppercase tracking-wider font-bold text-[#8b5f10] bg-[#eed08e]/20 px-1.5 py-0.5 rounded">
                                      {product.category}
                                    </span>
                                  </div>
                                </div>

                                <div className="flex items-center gap-2 shrink-0">
                                  <span className="text-xs sm:text-sm font-bold text-stone-900 font-sans tracking-tight">
                                    Rs. {product.price.toLocaleString("en-IN")}
                                  </span>
                                  <ChevronRight className="w-4 h-4 text-stone-400 group-hover:text-[#8b5f10] transition-colors pointer-events-none" />
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="py-10 text-center space-y-3">
                            <div className="w-12 h-12 rounded-full bg-[#FAF8F5] text-[#8b5f10] flex items-center justify-center mx-auto border border-[#DDD3C2]">
                              <Search className="w-6 h-6 stroke-[1.5]" />
                            </div>
                            <p className="text-sm font-medium text-stone-800">
                              No creations found for &ldquo;{searchQuery}&rdquo;
                            </p>
                            <p className="text-xs text-stone-500 max-w-xs mx-auto">
                              Try searching for &ldquo;brass&rdquo;, &ldquo;turtle&rdquo;, &ldquo;sandalwood&rdquo;, &ldquo;trunk&rdquo;, or &ldquo;suite&rdquo;.
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>,
          document.body
        )}
        </>
      )}
    </>
  );
}
