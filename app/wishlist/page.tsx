"use client";

import { useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Heart, ShoppingBag, Trash2, ArrowRight } from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { useWishlist } from "@/lib/wishlist-context";
import { useCart } from "@/lib/cart-context";

export default function WishlistPage() {
  const router = useRouter();
  const { wishlist, removeFromWishlist, clearWishlist, wishlistCount } = useWishlist();
  const { cartCount, addToCart, setIsCartOpen } = useCart();

  const handleMoveToCart = (item: (typeof wishlist)[0]) => {
    addToCart({
      id: item.id,
      skuId: item.skuId || item.id,
      name: item.name,
      price: item.price,
      priceDisplay: item.priceDisplay || `₹${item.price.toLocaleString("en-IN")}`,
      image: item.image,
      quantity: 1,
    });
    removeFromWishlist(item.id);
    setIsCartOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2] text-[#1C1B18]">
      <Navbar cartCount={cartCount} onOpenCart={() => setIsCartOpen(true)} />

      <main className="flex-1 pt-24 sm:pt-28 pb-16 sm:pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        {/* Header Row */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-8 border-b border-[#DDD3C2]/70">
          <div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif font-light text-[#092B20]">
              My Wishlist ({wishlistCount})
            </h1>
          </div>

          {wishlistCount > 0 && (
            <button
              type="button"
              onClick={clearWishlist}
              className="text-xs text-stone-500 hover:text-red-600 underline font-sans cursor-pointer transition-colors self-start sm:self-auto"
            >
              Clear all items
            </button>
          )}
        </div>

        {/* Content Area */}
        {wishlistCount === 0 ? (
          <div className="py-20 text-center max-w-md mx-auto space-y-5">
            <div className="w-16 h-16 rounded-full bg-[#092B20]/5 text-[#C5A45B] border border-[#C5A45B]/30 flex items-center justify-center mx-auto">
              <Heart className="w-8 h-8 stroke-[1.5]" />
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-serif text-[#092B20]">Your Wishlist is Empty</h2>
              <p className="text-xs sm:text-sm text-stone-600 font-sans leading-relaxed">
                Save your favorite artisanal hampers, solid brass burners, and sacred incense suites to revisit them anytime.
              </p>
            </div>
            <div className="pt-2">
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#092B20] hover:bg-[#123D2D] text-[#C5A45B] border border-[#28513B] text-xs font-bold uppercase tracking-widest rounded-full transition-all shadow-sm hover:shadow-md cursor-pointer"
              >
                <span>Explore Collection</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 pt-8">
            {wishlist.map((item) => (
              <div
                key={item.id}
                className="group relative flex flex-col justify-between bg-white rounded-2xl border border-[#DDD3C2]/70 overflow-hidden shadow-xs hover:shadow-md transition-all duration-300"
              >
                {/* Product Image Canvas */}
                <div
                  onClick={() => router.push(`/products/${item.skuId || item.id}`)}
                  className="relative aspect-[3/4] w-full bg-[#F5F2EB] cursor-pointer overflow-hidden flex items-center justify-center"
                >
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    className="object-contain p-2 sm:p-3 group-hover:scale-105 transition-transform duration-500"
                  />

                  {/* Remove Wishlist Button */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFromWishlist(item.id);
                    }}
                    title="Remove from wishlist"
                    aria-label="Remove from wishlist"
                    className="absolute top-2.5 right-2.5 z-10 w-7 h-7 rounded-full bg-white/90 hover:bg-white text-stone-500 hover:text-red-500 flex items-center justify-center shadow-xs cursor-pointer transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Details Row */}
                <div className="p-3 sm:p-4 flex flex-col justify-between flex-1 gap-3">
                  <div className="space-y-1 min-w-0">
                    <h3
                      onClick={() => router.push(`/products/${item.skuId || item.id}`)}
                      className="text-xs sm:text-sm font-medium text-stone-900 group-hover:text-[#8C6215] transition-colors truncate font-serif cursor-pointer"
                    >
                      {item.name}
                    </h3>
                    <div className="text-xs sm:text-sm font-bold text-[#8C6215] font-sans">
                      {item.priceDisplay || `₹${item.price.toLocaleString("en-IN")}`}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleMoveToCart(item)}
                    style={{ backgroundColor: "#28513B" }}
                    className="w-full py-2.5 px-3 bg-[#28513B] hover:bg-[#1e3e2d] text-white text-[10px] sm:text-xs font-bold uppercase tracking-wider rounded-xl flex items-center justify-center transition-colors cursor-pointer"
                  >
                    <span>Move to Cart</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
