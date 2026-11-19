"use client";

import { useState } from "react";
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
          {/* Header */}
          <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-stone-200 bg-[#FAF7F2]">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#092B20]/10 text-[#C5A45B] flex items-center justify-center">
                <Heart className="w-4 h-4 fill-[#C5A45B] text-[#C5A45B]" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-serif font-bold text-stone-900">
                  My Wishlist ({items.length})
                </h2>
                <p className="text-[10px] text-stone-500 font-sans">
                  Saved Sacred Creations &amp; Hampers
                </p>
              </div>
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
              <div className="py-16 text-center space-y-4">
                <div className="w-16 h-16 bg-[#FAF7F2] text-[#C5A45B] border border-[#C5A45B]/30 rounded-full flex items-center justify-center mx-auto shadow-xs">
                  <Heart className="w-8 h-8 stroke-[1.5]" />
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
                  className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#092B20] hover:bg-[#123D2D] text-[#C5A45B] border border-[#28513B] text-xs font-bold uppercase tracking-wider rounded-full transition-all shadow-xs cursor-pointer mt-2"
                >
                  <span>Explore Collection</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div key={item.id} className="py-3.5 flex items-center gap-3 sm:gap-4 group">
                  {/* Product Thumbnail */}
                  <div
                    onClick={() => {
                      onClose();
                      router.push(`/products/${item.skuId || item.id}`);
                    }}
                    className="relative w-16 h-16 sm:w-18 sm:h-18 rounded-xl bg-[#FAF7F2] border border-stone-200/80 overflow-hidden shrink-0 cursor-pointer p-1"
                  >
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      sizes="80px"
                      className="object-contain group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  {/* Info Column */}
                  <div className="flex-1 min-w-0 space-y-1">
                    <h4
                      onClick={() => {
                        onClose();
                        router.push(`/products/${item.skuId || item.id}`);
                      }}
                      className="text-xs sm:text-[13px] font-medium text-stone-900 hover:text-[#8C6215] transition-colors truncate font-serif cursor-pointer"
                    >
                      {item.name}
                    </h4>
                    <div className="text-xs font-bold text-[#8C6215] font-sans">
                      {item.priceDisplay || `₹${item.price.toLocaleString("en-IN")}`}
                    </div>

                    <div className="pt-0.5">
                      <button
                        type="button"
                        onClick={() => onMoveToCart(item)}
                        className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#092B20] hover:bg-[#123D2D] text-[#C5A45B] border border-[#28513B]/80 text-[10px] font-bold uppercase tracking-wider rounded-lg transition-colors cursor-pointer"
                      >
                        <ShoppingBag className="w-3 h-3" />
                        <span>Move to Cart</span>
                      </button>
                    </div>
                  </div>

                  {/* Delete Button */}
                  <button
                    type="button"
                    onClick={() => onRemoveItem(item.id)}
                    title="Remove item"
                    aria-label="Remove item"
                    className="p-2 text-stone-400 hover:text-red-600 transition-colors cursor-pointer shrink-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Footer Controls */}
          {items.length > 0 && (
            <div className="p-4 sm:p-5 border-t border-stone-200 bg-[#FAF7F2] space-y-2.5">
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={onClearAll}
                  className="text-xs text-stone-500 hover:text-red-600 underline font-sans cursor-pointer transition-colors"
                >
                  Clear all ({items.length})
                </button>
                <Link
                  href="/wishlist"
                  onClick={onClose}
                  className="text-xs font-bold text-[#092B20] hover:text-[#8C6215] hover:underline flex items-center gap-1 cursor-pointer"
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
