"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { X, Heart, ShoppingBag, Trash2, ArrowRight } from "lucide-react";
import { WishlistItem } from "@/lib/wishlist-context";

interface WishlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: WishlistItem[];
  onMoveToCart: (item: WishlistItem) => void;
  onRemoveItem: (id: string) => void;
  onClearAll: () => void;
}

export function WishlistDrawer({
  isOpen,
  onClose,
  items,
  onMoveToCart,
  onRemoveItem,
  onClearAll,
}: WishlistDrawerProps) {
  const router = useRouter();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[85] overflow-hidden select-none">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs transition-opacity duration-300 animate-in fade-in"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Slide-over Panel from Right */}
      <div className="fixed inset-y-0 right-0 flex w-full sm:w-auto max-w-full sm:pl-10">
        <div className="w-full sm:w-[420px] max-w-full bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
          {/* Header - Matching Cart Drawer style */}
          <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-stone-200 bg-[#fbf6ea]/60">
            <div className="flex items-center gap-2.5">
              <Heart className="w-5 h-5 text-[#c0881b] stroke-[2]" />
              <h2 className="text-base sm:text-lg font-serif font-bold text-stone-900">
                Your Wishlist ({items.length})
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-full transition-colors cursor-pointer shrink-0"
              aria-label="Close wishlist"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Items List */}
          <div
            className="flex-1 overflow-y-auto px-4 sm:px-6 py-3 divide-y divide-stone-100"
            data-lenis-prevent
          >
            {items.length === 0 ? (
              <div className="py-12 sm:py-16 text-center space-y-4">
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-[#fbf6ea] text-[#c0881b] rounded-full flex items-center justify-center mx-auto">
                  <Heart className="w-7 h-7 sm:w-8 sm:h-8 stroke-[1.5]" />
                </div>
                <div>
                  <h3 className="text-base font-serif font-bold text-stone-900">
                    Your sacred wishlist is empty
                  </h3>
                  <p className="text-stone-500 text-xs mt-1 max-w-xs mx-auto leading-relaxed">
                    Tap the heart icon on any product or hamper to save it here for later.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    router.push("/shop");
                  }}
                  className="inline-flex items-center gap-2 px-5 sm:px-6 py-2.5 bg-[#1E1E1C] hover:bg-[#33312D] text-white text-xs font-semibold rounded-lg shadow-sm transition-all cursor-pointer"
                >
                  <span>Explore Incense</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div key={item.id} className="py-3.5 sm:py-4 flex gap-3 sm:gap-3.5 items-start">
                  {/* Thumbnail with full edge-to-edge image inside card */}
                  <div
                    onClick={() => {
                      onClose();
                      router.push(`/products/${item.skuId || item.id}`);
                    }}
                    className="relative w-16 h-16 sm:w-18 sm:h-18 rounded-lg overflow-hidden bg-stone-100 shrink-0 border border-stone-200 cursor-pointer p-0"
                  >
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      sizes="80px"
                      className="object-cover w-full h-full hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  {/* Info Column matching Cart Drawer */}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start gap-1.5">
                      <h4
                        onClick={() => {
                          onClose();
                          router.push(`/products/${item.skuId || item.id}`);
                        }}
                        className="text-xs sm:text-sm font-bold text-stone-900 leading-snug line-clamp-2 hover:text-[#c0881b] transition-colors cursor-pointer"
                      >
                        {item.name}
                      </h4>
                      <button
                        type="button"
                        onClick={() => onRemoveItem(item.id)}
                        className="text-stone-400 hover:text-rose-600 transition-colors cursor-pointer p-1 shrink-0 -mr-1"
                        title="Remove item"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="text-xs font-bold text-[#c0881b] mt-1.5 font-sans">
                      {item.priceDisplay || `₹${item.price.toLocaleString("en-IN")}`}
                    </div>

                    {/* Action Row - Website green button without add-to-cart icon */}
                    <div className="flex items-center justify-between mt-2.5">
                      <button
                        type="button"
                        onClick={() => onMoveToCart(item)}
                        style={{ backgroundColor: "#28513B" }}
                        className="inline-flex items-center justify-center px-3.5 py-1.5 bg-[#28513B] hover:bg-[#1e3e2d] text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-all shadow-xs cursor-pointer active:scale-95"
                      >
                        <span>Move to Cart</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Controls matching Cart Drawer */}
          {items.length > 0 && (
            <div className="p-4 sm:p-6 border-t border-stone-200 bg-[#fbf6ea]/40 space-y-3 sm:space-y-4">
              <button
                type="button"
                onClick={() => {
                  items.forEach((item) => onMoveToCart(item));
                }}
                style={{ backgroundColor: "#28513B" }}
                className="w-full py-3 px-4 bg-[#28513B] hover:bg-[#1e3e2d] text-white font-semibold text-xs sm:text-sm uppercase tracking-wider rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
              >
                <span>Move All to Cart</span>
              </button>

              <div className="flex items-center justify-between text-xs pt-0.5">
                <button
                  type="button"
                  onClick={onClearAll}
                  className="text-stone-500 hover:text-rose-600 underline font-sans cursor-pointer transition-colors"
                >
                  Clear all ({items.length})
                </button>
                <Link
                  href="/wishlist"
                  onClick={onClose}
                  className="font-bold text-[#092B20] hover:text-[#c0881b] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span>View Full Wishlist</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
