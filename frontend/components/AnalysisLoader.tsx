"use client";

import { useEffect, useState } from "react";
import { Loader2, Scan, Sparkles, Layers, GitBranch } from "lucide-react";

const STAGES = [
  { label: "Normalizing contrast & lighting (CLAHE)", icon: Sparkles },
  { label: "Extracting fibrous ridges & gradients", icon: Layers },
  { label: "Computing morphological skeleton network", icon: Scan },
  { label: "Decomposing filaments & evaluating confidence", icon: GitBranch },
];

export function AnalysisLoader() {
  const [activeStage, setActiveStage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStage((prev) => (prev + 1) % STAGES.length);
    }, 900);
    return () => clearInterval(interval);
  }, []);

  const CurrentIcon = STAGES[activeStage].icon;

  return (
    <div className="w-full py-10 px-6 rounded-2xl bg-[#EFEBE9]/80 border border-[#D7CCC8] flex flex-col items-center justify-center text-center animate-pulse">
      {/* Animated Pulse Icon */}
      <div className="relative mb-5">
        <div className="w-20 h-20 rounded-2xl bg-[#4E342E] text-amber-300 flex items-center justify-center shadow-lg transform rotate-3">
          <CurrentIcon className="w-10 h-10 animate-pulse text-amber-300" />
        </div>
        <div className="absolute -bottom-2 -right-2 p-1.5 rounded-full bg-white shadow-md">
          <Loader2 className="w-5 h-5 animate-spin text-amber-700" />
        </div>
      </div>

      <h3 className="text-xl font-extrabold text-[#3E2723] mb-1.5">
        Analyzing coconut fibres...
      </h3>
      <p className="text-sm font-medium text-[#6D4C41] mb-6 max-w-md">
        Running classical computer vision to detect visible hair patterns and evaluate image clarity.
      </p>

      {/* Dynamic Visual Stages */}
      <div className="w-full max-w-sm space-y-2 text-left">
        {STAGES.map((stage, idx) => {
          const isDone = idx < activeStage;
          const isCurrent = idx === activeStage;
          return (
            <div
              key={idx}
              className={`flex items-center gap-2.5 px-3.5 py-2 rounded-lg text-xs transition-all ${
                isCurrent
                  ? "bg-[#3E2723] text-[#FDFBF7] font-semibold shadow-xs"
                  : isDone
                  ? "text-emerald-800 bg-emerald-50 font-medium"
                  : "text-[#8D6E63] bg-white/40 opacity-50"
              }`}
            >
              <div
                className={`w-2 h-2 rounded-full ${
                  isCurrent ? "bg-amber-400 animate-ping" : isDone ? "bg-emerald-500" : "bg-[#BCAAA4]"
                }`}
              />
              <span className="truncate">{stage.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
