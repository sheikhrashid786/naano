import React from 'react';

export default function QuoteSection() {
  return (
    <section id="what-people-think" className="py-24 sm:py-28 px-6 max-w-5xl mx-auto flex flex-col items-center justify-center text-center">
      <img
        src="/lp/logo-zmirov.png"
        alt="Zmirov Communication"
        className="h-[46px] w-auto block object-contain"
      />
      <div className="w-[46px] h-[2px] bg-[#17181C] rounded-full mt-5" />
      <blockquote className="mt-11 max-w-[1160px] text-3xl sm:text-4xl lg:text-[52px] font-medium tracking-[-0.022em] text-[#17181C] leading-[1.2] text-balance">
        “We manage €10M+ of influence budget every year. For B2B, Naano simply makes our life <span className="text-[#0A66C2]">easier</span>”
      </blockquote>
      <img
        src="/lp/photo-david-zmirov.png"
        alt="David Zmirov"
        className="w-[104px] h-[104px] rounded-full object-cover object-[center_18%] mt-12 border-2 border-white shadow-sm"
      />
      <div className="text-[19px] font-bold text-[#17181C] mt-5">David Zmirov</div>
      <div className="text-[16px] text-[#55575E] mt-1.5">CEO, Zmirov Communication</div>
      <div className="text-[15px] text-[#9B9DA3] mt-1">Influence agency</div>
    </section>
  );
}
