"use client";

import { useState } from "react";
import Image from "next/image";

export function ComboPackBanner() {
  const [imgSrc, setImgSrc] = useState("/images/product/image7.png");

  return (
    <section className="w-full relative overflow-hidden bg-[#04160d] border-t border-b border-[#eed08e]/30 py-6 sm:py-10">
      {/* Full Width High Quality Banner Container */}
      <div className="max-w-7xl mx-auto relative min-h-[220px] sm:min-h-[400px] lg:min-h-[580px] flex items-center justify-center px-3 sm:px-6 lg:px-8">
        <Image
          src={imgSrc}
          alt="Sacred Agarbatti Combo Pack Luxury Suite"
          fill
          loading="lazy"
          onError={() => setImgSrc("/images/product/suite-clean.png")}
          className="object-contain object-center p-2 sm:p-4 transition-all duration-700 hover:scale-102"
          sizes="(max-width: 1024px) 100vw, 1200px"
        />
      </div>
    </section>
  );
}
