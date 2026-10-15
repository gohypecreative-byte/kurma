"use client";

import { useState, useMemo, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { useCart } from "@/lib/cart-context";
import { PRODUCTS, formatPrice } from "@/lib/products";
import { Search, X, ChevronRight, Filter, ShoppingBag } from "lucide-react";

function SearchContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  const [query, setQuery] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const { cartCount, setIsCartOpen, quickAddToCart } = useCart();

  const categories = [
    { id: "all", label: "All Creations" },
    { id: "Gift Boxes", label: "Luxury Gift Trunks" },
    { id: "Fragrances", label: "The 5 Elements" },
    { id: "Sacred Accessories", label: "Artisanal Accessories" },
  ];

  const popularKeywords = [
    "Solid Brass Turtle",
    "5 Elements Suite",
    "Mysore Sandalwood",
    "Marble Gift Box",
    "Water Element",
    "Temple Flora",
  ];

  const filteredProducts = useMemo(() => {
    const q = query.toLowerCase().trim();
    return PRODUCTS.filter((p) => {
      const matchesCategory =
        selectedCategory === "all" || p.category === selectedCategory;
      if (!matchesCategory) return false;
      if (!q) return true;
      return (
        p.name.toLowerCase().includes(q) ||
        p.subtitle.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.badge?.toLowerCase().includes(q) ||
        p.elements?.some((el) => el.toLowerCase().includes(q))
      );
    });
  }, [query, selectedCategory]);

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-stone-900 selection:bg-[#eed08e] selection:text-[#072515]">
      <Navbar cartCount={cartCount} onOpenCart={() => setIsCartOpen(true)} />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Header */}
        <div className="text-center space-y-2 mb-8">
          <span className="text-xs font-semibold tracking-[0.25em] text-[#8C6215] uppercase">
            SACRED DISCOVERY
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-stone-900 tracking-tight font-normal">
            Search Creations &amp; Rituals
          </h1>
          <p className="text-sm text-stone-600 max-w-lg mx-auto">
            Discover artisanal incense, solid brass burners, and customized heirloom trunks.
          </p>
        </div>

        {/* Big Search Input Field */}
        <div className="max-w-2xl mx-auto mb-6">
          <form
            onSubmit={(e) => e.preventDefault()}
            className="relative flex items-center bg-white rounded-full border border-[#eed08e] hover:border-[#c0881b] shadow-sm focus-within:border-[#8b5f10] focus-within:ring-2 focus-within:ring-[#eed08e]/50 transition-all p-1.5 pl-4 pr-1.5 gap-2"
          >
            <Search className="w-5 h-5 text-[#8b5f10] shrink-0 pointer-events-none" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by scent, element, brass burner, or gift box..."
              className="flex-1 min-w-0 bg-transparent border-none outline-none ring-0 text-sm sm:text-base text-stone-900 placeholder:text-stone-400 font-sans py-1.5 focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0"
              style={{ outline: "none", boxShadow: "none", border: "none" }}
              autoFocus
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="p-1 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 cursor-pointer transition-colors shrink-0"
                aria-label="Clear search"
              >
                <X className="w-4 h-4 pointer-events-none" />
              </button>
            )}
            <button
              type="submit"
              className="shrink-0 px-5 py-2.5 bg-gradient-to-r from-[#072515] to-[#0c3823] hover:from-[#0a311d] hover:to-[#125032] active:bg-[#051a0f] text-[#eed08e] border border-[#eed08e]/35 hover:border-[#eed08e]/70 text-xs font-bold rounded-full uppercase tracking-[0.14em] transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
            >
              <span>Search</span>
              <ChevronRight className="w-3.5 h-3.5 text-[#eed08e]/80 hidden xs:inline-block" />
            </button>
          </form>

          {/* Popular Tag Pills */}
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mt-3 justify-center">
            <span className="text-xs text-stone-400 font-medium mr-1">Popular:</span>
            {popularKeywords.map((kw) => (
              <button
                key={kw}
                type="button"
                onClick={() => setQuery(kw)}
                className={`text-xs px-2.5 py-1 rounded-full border transition-all cursor-pointer ${
                  query === kw
                    ? "bg-[#072515] text-[#eed08e] border-[#072515]"
                    : "bg-white text-stone-600 border-stone-200 hover:border-[#8b5f10] hover:text-[#8b5f10]"
                }`}
              >
                {kw}
              </button>
            ))}
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center justify-center gap-2 overflow-x-auto pb-3 mb-8 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
                selectedCategory === cat.id
                  ? "bg-[#072515] text-[#eed08e] shadow-sm"
                  : "bg-white text-stone-700 border border-stone-200 hover:bg-stone-50"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Results Counter */}
        <div className="flex items-center justify-between pb-4 border-b border-stone-200 mb-6 text-xs text-stone-500">
          <span>
            Showing <strong className="text-stone-900">{filteredProducts.length}</strong> {filteredProducts.length === 1 ? "creation" : "creations"}
            {query && (
              <>
                {" "}for &ldquo;<span className="text-[#8b5f10] font-semibold">{query}</span>&rdquo;
              </>
            )}
          </span>
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="text-xs text-[#8b5f10] hover:underline cursor-pointer"
            >
              Reset Search
            </button>
          )}
        </div>

        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="group bg-white rounded-2xl border border-stone-200/90 hover:border-[#c0881b]/50 shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col overflow-hidden"
              >
                <Link
                  href={`/products/${product.id}`}
                  className="relative aspect-4/3 w-full bg-[#FAF8F5] p-5 flex items-center justify-center overflow-hidden block"
                >
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    unoptimized
                    className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
                  />
                  {product.badge && (
                    <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full text-[10.5px] font-bold tracking-wider uppercase bg-[#072515] text-[#eed08e] border border-[#eed08e]/40 shadow-xs">
                      {product.badge}
                    </span>
                  )}
                </Link>

                <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <span className="text-[11px] font-semibold text-[#8b5f10] uppercase tracking-wider block">
                      {product.category}
                    </span>
                    <Link
                      href={`/products/${product.id}`}
                      className="font-serif text-base sm:text-lg font-normal text-stone-900 group-hover:text-[#8b5f10] transition-colors line-clamp-1 mt-0.5 block"
                    >
                      {product.name}
                    </Link>
                    <p className="text-xs text-stone-500 line-clamp-2 mt-1">
                      {product.subtitle || product.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                    <div>
                      <span className="text-sm sm:text-base font-bold text-stone-900">
                        {formatPrice(product.price)}
                      </span>
                      {product.originalPrice && (
                        <span className="text-xs text-stone-400 line-through ml-2">
                          {formatPrice(product.originalPrice)}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => quickAddToCart(product)}
                        className="px-3 py-1.5 rounded-lg bg-[#072515] hover:bg-[#0c3823] text-[#eed08e] text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                        title="Add to Cart"
                      >
                        <ShoppingBag className="w-3.5 h-3.5 pointer-events-none" />
                        <span>Add</span>
                      </button>
                      <Link
                        href={`/products/${product.id}`}
                        className="p-1.5 rounded-lg border border-stone-200 text-stone-600 hover:text-stone-900 hover:border-stone-400 transition-colors"
                        title="View details"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-16 text-center space-y-4 bg-white rounded-3xl border border-stone-200 p-8">
            <div className="w-14 h-14 rounded-full bg-stone-100 text-stone-400 flex items-center justify-center mx-auto">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-serif text-stone-900">
              No creations found for &ldquo;{query}&rdquo;
            </h3>
            <p className="text-xs text-stone-500 max-w-md mx-auto">
              We couldn&apos;t find any items matching your search. Try searching for &ldquo;brass&rdquo;, &ldquo;sandalwood&rdquo;, or &ldquo;trunk&rdquo;.
            </p>
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setSelectedCategory("all");
              }}
              className="px-5 py-2.5 rounded-xl bg-[#072515] text-[#eed08e] text-xs font-semibold uppercase tracking-wider cursor-pointer"
            >
              Browse All Creations
            </button>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#FAF8F5]">
          <div className="w-8 h-8 rounded-full border-2 border-[#8b5f10] border-t-transparent animate-spin" />
        </div>
      }
    >
      <SearchContent />
    </Suspense>
  );
}
