"use client";

import { useState } from "react";
import Image from "next/image";
import {
  ChevronLeft,
  ChevronRight,
  Play,
  X,
  ShoppingBag,
} from "lucide-react";
import { CartItem } from "@/components/cart/cart-drawer";

interface StoryItem {
  id: number;
  skuId: string;
  title: string;
  image: string;
  fallbackImage: string;
  caption: string;
  price: number;
  tag: string;
  duration: string;
}

interface VideoStoriesProps {
  onAddToCart?: (item: CartItem) => void;
  onExploreProducts?: () => void;
}

const storiesData: StoryItem[] = [
  {
    id: 1,
    skuId: "marble-gift-box",
    title: "Elements in Harmony Marble Trunk",
    image: "/images/product/marble-box-clean.png?v=4",
    fallbackImage: "/images/product/image9.png",
    caption: "Unboxing the flagship emerald-veined green marble trunk with the 5 sacred elements.",
    price: 4999,
    tag: "Flagship Suite",
    duration: "0:45",
  },
  {
    id: 2,
    skuId: "5-elements-suite",
    title: "The Five Sacred Essences Suite",
    image: "/images/product/suite-clean.png?v=4",
    fallbackImage: "/images/product/image7.png",
    caption: "Earth, Water, Fire, Air, Space: 100% charcoal-free incense hand-rolled with devotion.",
    price: 1799,
    tag: "Fragrance Ritual",
    duration: "0:30",
  },
  {
    id: 3,
    skuId: "turtle-incense-holder",
    title: "Handcrafted Brass Turtle Stand",
    image: "/images/product/turtle-holder-clean.png?v=4",
    fallbackImage: "/images/product/image8.png",
    caption: "Solid cast brass single-hole burner with antique patina and paisley carvings.",
    price: 899,
    tag: "Artisanal Brass",
    duration: "0:25",
  },
  {
    id: 4,
    skuId: "mdf-gift-box",
    title: "Artisanal MDF Heritage Box",
    image: "/images/product/mdf-box-clean.png?v=4",
    fallbackImage: "/images/product/image.png",
    caption: "Rigid wooden keepsake gift box embossed with metallic gold Kurma turtle insignia.",
    price: 2499,
    tag: "Heirloom Wood",
    duration: "0:35",
  },
  {
    id: 5,
    skuId: "pashmina-pocket-square",
    title: "Embroidered Pashmina Square",
    image: "/images/product/pashmina-clean.png?v=4",
    fallbackImage: "/images/product/image.png",
    caption: "Fine pashmina cashmere wool square with golden zari sacred turtle motif.",
    price: 1199,
    tag: "Sacred Silk",
    duration: "0:20",
  },
];

interface StoryCardProps {
  story: StoryItem;
  index: number;
  onClick: () => void;
}

function StoryCard({ story, index, onClick }: StoryCardProps) {
  const [imgSrc, setImgSrc] = useState(story.image);
  const [hasError, setHasError] = useState(false);

  const handleImageError = () => {
    if (imgSrc !== story.fallbackImage) {
      setImgSrc(story.fallbackImage);
    } else {
      setHasError(true);
    }
  };

  return (
    <div
      onClick={onClick}
      className="relative aspect-[9/14] sm:aspect-[9/15] rounded-lg overflow-hidden border border-[#072515]/15 group cursor-pointer bg-stone-950 shadow-md hover:shadow-xl hover:border-[#c0881b] hover:-translate-y-1 transition-all duration-300 select-none flex flex-col justify-end"
    >
      {/* Background Image */}
      {!hasError ? (
        <Image
          src={imgSrc}
          alt={story.title}
          fill
          unoptimized
          onError={handleImageError}
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
          priority={index < 3}
        />
      ) : (
        <div className="w-full h-full bg-stone-900 flex items-center justify-center p-3 text-center text-xs text-stone-400">
          {story.title}
        </div>
      )}

      {/* Subtle Bottom Gradient for Text Legibility */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent pointer-events-none" />

      {/* Center Luxury Gold Play Button */}
      <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
        <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-black/60 border border-[#eed08e]/70 text-[#eed08e] group-hover:bg-[#eed08e] group-hover:text-black group-hover:scale-110 shadow-lg transition-all duration-300 flex items-center justify-center backdrop-blur-xs">
          <Play className="w-4 h-4 sm:w-4.5 sm:h-4.5 fill-current translate-x-0.5" />
        </div>
      </div>

      {/* Bottom Title & Price */}
      <div className="relative z-10 p-3 space-y-1">
        <h4 className="text-xs sm:text-[13px] font-medium text-white leading-snug line-clamp-2 drop-shadow group-hover:text-[#eed08e] transition-colors">
          {story.title}
        </h4>
        <div className="pt-0.5">
          <span className="text-xs sm:text-[13px] font-bold text-[#eed08e]">
            ₹{story.price.toLocaleString("en-IN")}
          </span>
        </div>
      </div>
    </div>
  );
}

export function VideoStories({ onAddToCart, onExploreProducts }: VideoStoriesProps) {
  const [activeStoryIndex, setActiveStoryIndex] = useState<number | null>(null);

  const handleOpenModal = (index: number) => {
    setActiveStoryIndex(index);
  };

  const handleCloseModal = () => {
    setActiveStoryIndex(null);
  };

  return (
    <section className="w-full bg-[#f3f6ef] py-12 sm:py-16 text-stone-900 border-t border-b border-[#072515]/15">
      <div className="w-full px-4 sm:px-6 lg:px-12 xl:px-16 space-y-7">
        {/* Section Heading */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#072515]" />
              <span className="text-[10px] sm:text-xs font-bold tracking-[0.22em] text-[#072515] uppercase">
                SACRED REELS &amp; UNBOXINGS
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif text-stone-900 tracking-tight font-normal mt-1">
              Kurma Gifting &amp; Craft Stories
            </h2>
            <div className="h-0.5 w-20 bg-[#c0881b] mt-2" />
          </div>

          {onExploreProducts && (
            <button
              onClick={onExploreProducts}
              className="text-xs font-semibold text-[#072515] hover:text-[#c0881b] transition-colors cursor-pointer self-start sm:self-auto inline-flex items-center gap-1.5 group"
            >
              <span>Explore Initial Products</span>
              <span className="transition-transform group-hover:translate-x-0.5">→</span>
            </button>
          )}
        </div>

        {/* 5-Column Balanced Grid Layout */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-5 lg:gap-6">
          {storiesData.map((story, index) => (
            <StoryCard
              key={story.id}
              story={story}
              index={index}
              onClick={() => handleOpenModal(index)}
            />
          ))}
        </div>
      </div>



      {/* FULLSCREEN STORY MODAL */}
      {activeStoryIndex !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200"
          onClick={handleCloseModal}
        >
          {/* Close Button */}
          <button
            onClick={handleCloseModal}
            aria-label="Close story"
            className="absolute top-4 right-4 sm:top-6 sm:right-6 z-30 w-10 h-10 rounded-full bg-white/15 hover:bg-white/30 text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Left Arrow to Previous Story */}
          {activeStoryIndex > 0 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setActiveStoryIndex((curr) =>
                  curr !== null && curr > 0 ? curr - 1 : curr
                );
              }}
              aria-label="Previous story"
              className="hidden sm:flex absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full bg-white/20 hover:bg-white/40 text-white items-center justify-center transition-all cursor-pointer"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
          )}

          {/* Right Arrow to Next Story */}
          {activeStoryIndex < storiesData.length - 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setActiveStoryIndex((curr) =>
                  curr !== null && curr < storiesData.length - 1
                    ? curr + 1
                    : curr
                );
              }}
              aria-label="Next story"
              className="hidden sm:flex absolute right-4 sm:left-8 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full bg-white/20 hover:bg-white/40 text-white items-center justify-center transition-all cursor-pointer"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          )}

          {/* Vertical Reel Phone Frame */}
          <div
            className="relative w-full max-w-[380px] h-[82vh] max-h-[740px] rounded-xl overflow-hidden bg-stone-950 shadow-2xl flex flex-col justify-between border border-[#eed08e]/40"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="absolute inset-0">
              <Image
                src={storiesData[activeStoryIndex].image}
                alt={storiesData[activeStoryIndex].title}
                fill
                unoptimized
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/85 pointer-events-none" />
            </div>

            {/* Simulated Story Progress Bar */}
            <div className="relative z-20 px-3 pt-3">
              <div className="h-1 w-full bg-white/25 rounded-full overflow-hidden">
                <div className="h-full bg-[#eed08e] rounded-full w-2/3 animate-pulse" />
              </div>
            </div>

            {/* Header */}
            <div className="relative z-20 px-4 py-2 flex items-center justify-between text-white">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-stone-900 border border-[#eed08e]/60 flex items-center justify-center text-xs font-bold text-[#eed08e] shadow-xs">
                  K
                </div>
                <div>
                  <h5 className="text-xs font-bold leading-tight">Kurma Sacred Craft</h5>
                  <span className="text-[10px] text-[#eed08e]/90 block">
                    {storiesData[activeStoryIndex].tag}
                  </span>
                </div>
              </div>
              <button
                onClick={handleCloseModal}
                aria-label="Close story"
                className="p-1.5 rounded-full bg-black/50 hover:bg-black/80 text-white cursor-pointer transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Center Subtle Playing Icon */}
            <div className="relative z-20 flex-1 flex items-center justify-center pointer-events-none">
              <div className="w-14 h-14 rounded-full bg-black/60 border border-[#eed08e]/60 text-[#eed08e] flex items-center justify-center backdrop-blur-xs opacity-75">
                <Play className="w-6 h-6 fill-current translate-x-0.5" />
              </div>
            </div>

            {/* Bottom Drawer */}
            <div className="relative z-20 p-4 space-y-2">
              <div className="bg-stone-900/95 backdrop-blur-md rounded-xl p-4 shadow-xl border border-[#eed08e]/30 text-white">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase tracking-wider font-semibold text-[#eed08e]">
                    {storiesData[activeStoryIndex].tag}
                  </span>
                  <span className="text-xs font-bold text-[#eed08e]">
                    ₹{storiesData[activeStoryIndex].price.toLocaleString("en-IN")}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-white mt-1">
                  {storiesData[activeStoryIndex].title}
                </h4>
                <p className="text-xs text-stone-300 mt-1 leading-relaxed">
                  {storiesData[activeStoryIndex].caption}
                </p>
                {onAddToCart && (
                  <button
                    onClick={() => {
                      const story = storiesData[activeStoryIndex];
                      handleCloseModal();
                      onAddToCart({
                        id: `${story.skuId}-${Date.now()}`,
                        skuId: story.skuId,
                        name: story.title,
                        price: story.price,
                        priceDisplay: `₹${story.price.toLocaleString("en-IN")}`,
                        image: story.image,
                        quantity: 1,
                      });
                    }}
                    className="mt-3 w-full py-2.5 px-4 bg-[#eed08e] hover:bg-[#ffe3a8] text-stone-950 text-xs font-bold rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md active:scale-95"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Add to Sacred Cart • ₹{storiesData[activeStoryIndex].price.toLocaleString("en-IN")}</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
