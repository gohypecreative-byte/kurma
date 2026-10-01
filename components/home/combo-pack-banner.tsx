"use client";

import { useState } from "react";
import Image from "next/image";

export function ComboPackBanner() {
  const [imgSrc, setImgSrc] = useState("/images/product/image7.png");

  return (
    <section className="w-full relative overflow-hidden bg-[#04160d] border-t border-b border-[#eed08e]/30">
      {/* Full Width High Quality Banner Container */}
      <div className="w-full relative min-h-[350px] sm:min-h-[480px] lg:min-h-[620px] flex items-center justify-center">
        <Image
          src={imgSrc}
          alt="Sacred Agarbatti Combo Pack Luxury Suite"
          fill
          unoptimized
          onError={() => setImgSrc("/images/product/suite-clean.png")}
          className="object-cover object-center transition-all duration-700 hover:scale-102"
          sizes="100vw"
          priority
        />
      </div>
    </section>
  );
}
