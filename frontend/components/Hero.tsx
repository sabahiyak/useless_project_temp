"use client";

import { Sparkles, ArrowDown } from "lucide-react";

interface HeroProps {
  onScrollToUpload: () => void;
}

export function Hero({ onScrollToUpload }: HeroProps) {
  return (
    <section className="relative overflow-hidden pt-10 pb-8 sm:pt-14 sm:pb-12 text-center">
      {/* Subtle coconut ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-600/10 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Playful Pill Badge */}
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#EFEBE9] border border-[#D7CCC8] text-[#5D4037] text-xs sm:text-sm font-semibold mb-5 shadow-xs">
          <Sparkles className="w-4 h-4 text-amber-600" />
          <span>Scientific Coconut Follicle Auditing</span>
        </div>

        {/* Main Title */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#3E2723] leading-tight mb-4">
          Count Coconut Hair with Computer Vision 🥥
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-lg text-[#5D4037] max-w-2xl mx-auto leading-relaxed mb-8">
          Upload a coconut image and get an AI-assisted estimate of its visible hair.
          Diagnose if your coco is sporting a luscious mane or experiencing coconut-pattern baldness!
        </p>

        {/* Primary CTA Button */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={onScrollToUpload}
            className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-gradient-to-r from-[#4E342E] to-[#6D4C41] hover:from-[#3E2723] hover:to-[#5D4037] text-[#FDFBF7] font-semibold text-base shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Upload Coconut Image</span>
            <ArrowDown className="w-4 h-4" />
          </button>

          <a
            href="#how-it-works"
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white/80 hover:bg-white text-[#5D4037] font-semibold text-base border border-[#D7CCC8] shadow-xs hover:shadow-sm transition-all text-center"
          >
            How Algorithm Works
          </a>
        </div>
      </div>
    </section>
  );
}
