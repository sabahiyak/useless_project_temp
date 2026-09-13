"use client";

import { ShieldCheck } from "lucide-react";

export function Footer() {
  return (
    <footer id="about" className="border-t border-[#D7CCC8] bg-[#3E2723] text-[#D7CCC8] py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Main Disclaimer Banner */}
        <div className="p-5 rounded-2xl bg-[#4E342E]/70 border border-[#6D4C41] mb-8 text-xs leading-relaxed flex items-start gap-3 text-[#EFEBE9]">
          <ShieldCheck className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-[#FDFBF7] block mb-1">
              Important Computer Vision & Biological Disclaimer:
            </span>
            <span>
              This result is an image-processing estimate of visible surface fibres. It does not
              represent an exact biological count. Fibres that overlap, are hidden beneath outer husk
              layers, damaged, blurred, or poorly illuminated may not be detected. If an uploaded
              image lacks adequate contrast or sharpness, the system will honestly return a
              low-confidence warning rather than guessing an accurate-looking count.
            </span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#BCAAA4]">
          <div className="flex items-center gap-2">
            <span className="text-xl">🥥</span>
            <span className="font-bold text-[#FDFBF7]">
              Is My Coco Losing Hair??
            </span>
            <span>• Coconut Hair Counter</span>
          </div>

          <div>
            Made with ❤️ at TinkerHub Useless Projects
          </div>
        </div>
      </div>
    </footer>
  );
}
