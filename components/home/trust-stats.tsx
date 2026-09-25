"use client";

export function TrustStats() {
  const stats = [
    {
      value: "30+",
      label: "Years of Sacred Trust",
    },
    {
      value: "50M+",
      label: "Incense Sticks Lit & Delivered",
    },
    {
      value: "100+",
      label: "Serving Countries",
    },
  ];

  return (
    <section className="w-full bg-[#f3f6ef] py-8 sm:py-16 lg:py-20 border-y border-[#e2e8dc]">
      <div className="w-full px-3 sm:px-6 md:px-8 lg:px-12 xl:px-16">
        <div className="grid grid-cols-3 gap-2 sm:gap-6 lg:gap-8 text-center">
          {stats.map((stat, idx) => (
            <div key={idx} className="flex flex-col items-center justify-center px-1 sm:px-2">
              <span className="text-2xl sm:text-4xl lg:text-6xl font-bold text-[#7b8d54] tracking-tight font-sans leading-none">
                {stat.value}
              </span>
              <span className="text-[10px] sm:text-sm lg:text-base font-bold text-[#12172b] tracking-tight mt-1.5 sm:mt-3 lg:mt-4 font-sans leading-tight sm:leading-snug max-w-[120px] sm:max-w-none">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
