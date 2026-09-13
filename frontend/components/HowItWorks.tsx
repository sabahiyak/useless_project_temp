"use client";

import { Sun, Waves, GitFork, Calculator, Info } from "lucide-react";

export function HowItWorks() {
  const steps = [
    {
      step: "01",
      icon: Sun,
      title: "Lighting Normalization",
      desc: "Because coconuts are spherical, sunlight and shadows create uneven exposure. Contrast-Limited Adaptive Histogram Equalization (CLAHE) normalizes lighting across husk curves.",
    },
    {
      step: "02",
      icon: Waves,
      title: "Ridge Feature Extraction",
      desc: "Morphological Top-Hat & Black-Hat filters isolate curvilinear strands from background husk. Combined with bilateral smoothing and adaptive Canny edges, fibres emerge crisply.",
    },
    {
      step: "03",
      icon: GitFork,
      title: "Skeleton Thinning",
      desc: "Mathematical skeletonization reduces thick fibrous ribbons to 1-pixel wide continuous centerlines, allowing exact measurement of strand trajectories, overlaps, and crossing angles.",
    },
    {
      step: "04",
      icon: Calculator,
      title: "Filament Quantification",
      desc: "Connected components decompose tangled hair webs by isolating branch junctions and arc lengths, deriving the estimated visible fibre count alongside an honest confidence score.",
    },
  ];

  return (
    <section id="how-it-works" className="py-12 sm:py-16 border-t border-[#D7CCC8]/60 scroll-mt-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EFEBE9] text-[#5D4037] text-xs font-semibold uppercase tracking-wider mb-3">
            <Info className="w-3.5 h-3.5 text-amber-700" />
            <span>Behind the Algorithms</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-[#3E2723] tracking-tight mb-3">
            How Classical Computer Vision Counts Coconut Hair
          </h2>
          <p className="text-sm sm:text-base text-[#6D4C41]">
            We avoid hallucinating fictional counts. Here is how our classical OpenCV & scikit-image pipeline processes visible hair strands.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-white border border-[#D7CCC8] shadow-sm hover:shadow-md transition-shadow relative flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-[#EFEBE9] flex items-center justify-center text-[#4E342E]">
                      <Icon className="w-5 h-5 text-amber-800" />
                    </div>
                    <span className="text-2xl font-mono font-black text-[#D7CCC8]">
                      {item.step}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-[#3E2723] mb-2">
                    {item.title}
                  </h3>
                  <p className="text-xs text-[#5D4037] leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
