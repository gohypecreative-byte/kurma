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
      <header className="sticky top-0 z-[60] w-full bg-[#FAF7F2]/95 backdrop-blur-md border-b border-[#EAE3D8] text-[#1C1B18] shadow-2xs">
        <div className="w-full px-3.5 sm:px-6 md:px-8 lg:px-12 xl:px-16 h-16 sm:h-20 flex items-center justify-between">
          {/* Brand Logo */}
          <Link
            href="/"
            onClick={() => {
              setMobileMenuOpen(false);
              setSearchOpen(false);
              setAccountMenuOpen(false);
            }}
            className="flex items-center gap-2 sm:gap-3 group shrink-0"
            aria-label="Kurma Home"
          >
            <div className="relative w-9 h-9 sm:w-12 sm:h-12 flex items-center justify-center shrink-0">
              <Image
                src="/images/brand/kurma-turtle-transparent.png"
                alt="Kurma Logo"
                width={48}
                height={48}
                className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105 pointer-events-none"
                priority
              />
            </div>
            <span className="font-serif tracking-[0.16em] sm:tracking-[0.2em] text-lg sm:text-[22px] font-bold text-stone-900 leading-none">
              KURMA
            </span>
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
                      ? "text-[#8b5f10] font-semibold"
                      : "text-stone-700 hover:text-[#8b5f10]"
                  }`}
                >
                  <span>{link.name}</span>
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#1C1B18] rounded-full animate-in fade-in zoom-in-95 duration-200" />
                  )}
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
                  ? "bg-[#1E1E1C] text-white border-[#1E1E1C]"
                  : "bg-[#faf9f6] hover:bg-[#fbf6ea] active:bg-stone-200 text-stone-700 hover:text-[#8b5f10] border-stone-200 hover:border-[#c0881b]"
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
                    className="h-10 sm:h-11 px-2.5 sm:px-3.5 shrink-0 rounded-full border border-[#1E1E1C] bg-[#1E1E1C] text-white hover:bg-[#33312D] active:bg-black flex items-center gap-1.5 sm:gap-2 transition-colors shadow-xs cursor-pointer touch-manipulation"
                  >
                    <div className="w-5 h-5 rounded-full bg-[#1E1E1C] text-white flex items-center justify-center text-[10px] font-bold pointer-events-none">
                      {userDisplayName.charAt(0).toUpperCase()}
                    </div>
                    <span className="hidden md:inline text-xs font-semibold tracking-wide max-w-[90px] truncate pointer-events-none">
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
                      <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-stone-200/90 py-2.5 z-40 animate-in fade-in zoom-in-95 duration-150 text-stone-900">
                        <div className="px-4 py-2 border-b border-stone-100">
                          <p className="text-xs font-bold truncate text-stone-900">
                            {userDisplayName}
                          </p>
                          <p className="text-[11px] text-stone-500 truncate">
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
                              className="w-full px-4 py-2 text-left text-xs font-semibold text-[#072515] hover:bg-[#FAF8F5] flex items-center gap-2 cursor-pointer transition-colors border-b border-stone-100"
                            >
                              <ShieldCheck className="w-3.5 h-3.5 text-[#c5a059] pointer-events-none" />
                              <span>Admin Dashboard</span>
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => {
                              setAccountMenuOpen(false);
                              router.push("/shop");
                            }}
                            className="w-full px-4 py-2 text-left text-xs text-stone-700 hover:bg-stone-50 hover:text-[#8b5f10] flex items-center gap-2 cursor-pointer transition-colors"
                          >
                            <Package className="w-3.5 h-3.5 text-stone-500 pointer-events-none" />
                            <span>My Orders &amp; Rituals</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setAccountMenuOpen(false);
                              router.push("/elements");
                            }}
                            className="w-full px-4 py-2 text-left text-xs text-stone-700 hover:bg-stone-50 hover:text-[#8b5f10] flex items-center gap-2 cursor-pointer transition-colors"
                          >
                            <Gift className="w-3.5 h-3.5 text-stone-500 pointer-events-none" />
                            <span>Custom Keepsake Hamper</span>
                          </button>
                        </div>
                        <div className="pt-1 border-t border-stone-100">
                          <button
                            type="button"
                            onClick={handleSignOut}
                            className="w-full px-4 py-2 text-left text-xs text-red-700 hover:bg-red-50 flex items-center gap-2 cursor-pointer transition-colors"
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
                  className="w-10 h-10 sm:w-11 sm:h-11 shrink-0 rounded-full border border-[#DDD6CB] hover:border-[#B5ADA1] bg-[#F3EFE8] hover:bg-[#EBE5DC] active:bg-stone-200 text-[#1C1B18] hover:text-black flex items-center justify-center transition-colors shadow-2xs hover:shadow-xs cursor-pointer touch-manipulation"
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
              className="relative w-10 h-10 sm:w-11 sm:h-11 shrink-0 rounded-full border border-[#DDD6CB] hover:border-[#B5ADA1] bg-[#F3EFE8] hover:bg-[#EBE5DC] active:bg-stone-200 text-[#1C1B18] hover:text-black flex items-center justify-center transition-colors shadow-2xs hover:shadow-xs cursor-pointer touch-manipulation"
            >
              <ShoppingBag className="w-4.5 h-4.5 sm:w-5 sm:h-5 stroke-[1.75] text-stone-700 pointer-events-none" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[19px] h-[19px] px-1 bg-[#1E1E1C] text-white border border-[#DDD6CB] rounded-full text-[10px] font-bold flex items-center justify-center shadow-xs pointer-events-none">
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
                  ? "bg-[#1E1E1C] text-white border-[#1E1E1C]"
                  : "bg-[#faf9f6] hover:bg-[#fbf6ea] active:bg-stone-200 text-stone-700 hover:text-[#8b5f10] border-stone-200 hover:border-[#c0881b]"
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
                  className="relative z-10 w-full bg-white border-b border-stone-200 shadow-2xl flex flex-col max-h-[calc(100dvh-4rem)] sm:max-h-[calc(100dvh-5rem)] overflow-y-auto overscroll-contain text-stone-900 transition-all duration-200 p-4 sm:p-5 space-y-4"
                >
                  {/* 1. In-Drawer Live Search Form */}
                  <form
                    onSubmit={handleDrawerSearchSubmit}
                    className="relative flex items-center bg-[#FAF8F5] border border-stone-200/90 rounded-xl px-3 py-2.5 shadow-2xs focus-within:border-[#8b5f10] focus-within:bg-white transition-all"
                  >
                    <Search className="w-4 h-4 text-[#8b5f10] mr-2 shrink-0 pointer-events-none" />
                    <input
                      type="text"
                      value={drawerSearchQuery}
                      onChange={(e) => setDrawerSearchQuery(e.target.value)}
                      placeholder="Search creations, brass burners, scents..."
                      className="w-full bg-transparent border-none outline-none text-xs sm:text-sm text-stone-900 placeholder:text-stone-400 font-sans"
                    />
                    {drawerSearchQuery ? (
                      <button
                        type="button"
                        onClick={() => setDrawerSearchQuery("")}
                        className="p-1 text-stone-400 hover:text-stone-700 cursor-pointer touch-manipulation"
                        aria-label="Clear search input"
                      >
                        <X className="w-4 h-4 pointer-events-none" />
                      </button>
                    ) : (
                      <button
                        type="submit"
                        className="text-[11px] font-bold text-[#8b5f10] uppercase tracking-wider shrink-0 cursor-pointer touch-manipulation px-1"
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
                              ? "bg-[#1E1E1C] text-white font-bold shadow-xs"
                              : "bg-[#FAF8F5] hover:bg-stone-100 text-stone-800 border border-stone-200/70"
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
                                  ? "bg-[#eed08e]/20 text-[#eed08e]"
                                  : "bg-white text-stone-500 border border-stone-200/60"
                              }`}
                            >
                              {link.badge}
                            </span>
                            <ChevronRight
                              className={`w-4 h-4 ${
                                isActive ? "text-[#eed08e]" : "text-stone-400"
                              }`}
                            />
                          </div>
                        </Link>
                      );
                    })}
                  </nav>

                  {/* 3. Account / Login Drawer Area */}
                  <div className="pt-2 border-t border-stone-200/80">
                    {user ? (
                      <div className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-stone-200 space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-full bg-[#1E1E1C] text-white flex items-center justify-center text-xs font-bold">
                              {userDisplayName.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <p className="text-xs font-bold text-stone-900 truncate max-w-[160px]">
                                {userDisplayName}
                              </p>
                              <p className="text-[10px] text-stone-500 truncate max-w-[160px]">
                                {user.email}
                              </p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={handleSignOut}
                            className="text-xs font-semibold text-red-700 hover:underline cursor-pointer touch-manipulation"
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
                            className="w-full py-2 px-3 rounded-xl bg-[#072515] text-[#eed08e] text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer shadow-xs touch-manipulation"
                          >
                            <ShieldCheck className="w-3.5 h-3.5 text-[#eed08e]" />
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
                            className="py-2.5 px-3 rounded-xl bg-white border border-stone-200 text-stone-700 text-xs font-semibold text-center hover:bg-stone-50 active:bg-stone-100 cursor-pointer shadow-2xs touch-manipulation"
                          >
                            My Orders
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setMobileMenuOpen(false);
                              router.push("/elements");
                            }}
                            className="py-2.5 px-3 rounded-xl bg-[#1E1E1C] text-white text-xs font-semibold text-center active:bg-[#33312D] cursor-pointer shadow-xs touch-manipulation"
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
                          className="w-full py-3 px-3 rounded-xl bg-[#1E1E1C] hover:bg-[#33312D] active:bg-black text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer shadow-sm transition-colors touch-manipulation"
                        >
                          <User className="w-3.5 h-3.5 pointer-events-none" />
                          <span>Sign In</span>
                        </Link>
                        <Link
                          href="/signup"
                          prefetch={true}
                          onClick={() => setMobileMenuOpen(false)}
                          className="w-full py-3 px-3 rounded-xl bg-[#F3EFE8] hover:bg-[#EBE5DC] border border-[#DDD6CB] active:bg-stone-200 text-[#1C1B18] text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer shadow-sm transition-colors touch-manipulation"
                        >
                          <span>Sign Up</span>
                        </Link>
                      </div>
                    )}
                  </div>

                  {/* 4. Mobile Concierge Hotline Snippet */}
                  <div className="pt-2 flex items-center justify-between text-[11px] text-stone-500 font-sans border-t border-stone-100">
                    <span className="flex items-center gap-1.5">
                      <PhoneCall className="w-3 h-3 text-[#8b5f10]" />
                      Concierge Assistance
                    </span>
                    <a
                      href="tel:+918005876200"
                      className="font-semibold text-stone-800 hover:text-[#8b5f10]"
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
                    className="fixed top-0 inset-x-0 z-[110] bg-[#FAF8F5] border-b border-[#DDD3C2] rounded-b-2xl shadow-2xl flex flex-col max-h-[calc(100dvh-2rem)] overflow-y-auto overscroll-contain text-stone-900"
                  >
                    {/* Top Row: Navigation Links, Kurma Brand Logo & Icons (matching reference header) */}
                    <div className="w-full border-b border-[#EAE3D8] bg-[#FAF8F5] shrink-0">
                      <div className="w-full px-3.5 sm:px-6 md:px-8 lg:px-12 xl:px-16 h-16 sm:h-20 flex items-center justify-between">
                        {/* Brand Logo */}
                        <Link
                          href="/"
                          onClick={() => setSearchOpen(false)}
                          className="flex items-center gap-2 sm:gap-3 group shrink-0"
                          aria-label="Kurma Home"
                        >
                          <div className="relative w-9 h-9 sm:w-12 sm:h-12 flex items-center justify-center shrink-0">
                            <Image
                              src="/images/brand/kurma-turtle-transparent.png"
                              alt="Kurma Logo"
                              width={48}
                              height={48}
                              className="w-full h-full object-contain pointer-events-none"
                            />
                          </div>
                          <span className="font-serif tracking-[0.16em] sm:tracking-[0.2em] text-lg sm:text-[22px] font-bold text-stone-900 leading-none">
                            KURMA
                          </span>
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
                                    ? "text-[#8b5f10] font-semibold"
                                    : "text-stone-700 hover:text-[#8b5f10]"
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
                          <div className="w-10 h-10 sm:w-11 sm:h-11 shrink-0 rounded-full border bg-[#1E1E1C] text-white border-[#1E1E1C] flex items-center justify-center shadow-2xs">
                            <Search className="w-4.5 h-4.5 stroke-[1.8]" />
                          </div>

                          {/* Login / User button */}
                          <Link
                            href="/login"
                            onClick={() => setSearchOpen(false)}
                            aria-label="Patron Sign In"
                            className="w-10 h-10 sm:w-11 sm:h-11 shrink-0 rounded-full border border-[#DDD6CB] hover:border-[#B5ADA1] bg-[#F3EFE8] hover:bg-[#EBE5DC] text-[#1C1B18] flex items-center justify-center transition-colors shadow-2xs"
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
                            className="relative w-10 h-10 sm:w-11 sm:h-11 shrink-0 rounded-full border border-[#DDD6CB] hover:border-[#B5ADA1] bg-[#F3EFE8] hover:bg-[#EBE5DC] text-[#1C1B18] flex items-center justify-center transition-colors shadow-2xs cursor-pointer"
                          >
                            <ShoppingBag className="w-4.5 h-4.5 sm:w-5 sm:h-5 stroke-[1.75] text-stone-700" />
                            {cartCount > 0 && (
                              <span className="absolute -top-1 -right-1 min-w-[19px] h-[19px] px-1 bg-[#1E1E1C] text-white border border-[#DDD6CB] rounded-full text-[10px] font-bold flex items-center justify-center shadow-xs">
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
                        className="flex-1 relative flex items-center bg-[#F1ECE4] hover:bg-[#EBE4DA] focus-within:bg-white rounded-xl border border-[#DDD3C2] focus-within:border-[#8b5f10] focus-within:ring-2 focus-within:ring-[#eed08e]/50 transition-all p-1.5 pl-4 sm:pl-6 pr-3 shadow-inner"
                      >
                        <input
                          ref={searchInputRef}
                          type="text"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          placeholder="Search here...."
                          className="flex-1 min-w-0 bg-transparent border-none outline-none text-xs sm:text-sm md:text-base text-stone-900 placeholder:text-stone-400 font-sans py-1 sm:py-1.5 focus:outline-none focus:ring-0"
                          style={{ outline: "none", boxShadow: "none", border: "none" }}
                        />
                        {searchQuery && (
                          <button
                            type="button"
                            onClick={() => setSearchQuery("")}
                            className="p-1 rounded-full text-stone-400 hover:text-stone-700 transition-colors mr-1 cursor-pointer"
                            aria-label="Clear search input"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        )}
                        <button
                          type="submit"
                          aria-label="Submit search"
                          className="p-1 text-stone-500 hover:text-stone-900 transition-colors cursor-pointer"
                        >
                          <Search className="w-4.5 h-4.5 sm:w-5 sm:h-5 stroke-[1.8]" />
                        </button>
                      </form>

                      {/* Close 'X' Button on the Far Right */}
                      <button
                        type="button"
                        onClick={() => setSearchOpen(false)}
                        aria-label="Close search overlay"
                        className="p-2 sm:p-2.5 rounded-full hover:bg-stone-200/70 text-stone-600 hover:text-stone-950 transition-colors cursor-pointer shrink-0 touch-manipulation"
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
                            <h3 className="text-sm sm:text-base font-bold text-stone-900 font-serif tracking-tight">
                              Collections
                            </h3>
                          </div>

                          <div className="divide-y divide-[#E6DDD0]">
                            {searchCollections.map((col) => (
                              <Link
                                key={col.title}
                                href={col.href}
                                onClick={() => setSearchOpen(false)}
                                className="flex items-center gap-3.5 py-3 group cursor-pointer hover:bg-[#F3EFEA]/80 px-2 rounded-lg transition-all"
                              >
                                <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-md overflow-hidden bg-white border border-[#DDD3C2] shrink-0 p-1 shadow-2xs group-hover:scale-103 transition-transform">
                                  <Image
                                    src={col.image}
                                    alt={col.title}
                                    fill
                                    className="object-contain p-0.5 pointer-events-none"
                                  />
                                </div>
                                <div className="min-w-0 flex-1">
                                  <span className="text-xs sm:text-[13.5px] font-semibold text-stone-900 group-hover:text-[#8b5f10] transition-colors block font-serif truncate">
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
