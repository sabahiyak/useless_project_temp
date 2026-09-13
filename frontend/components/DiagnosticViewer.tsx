"use client";

import { useState } from "react";
import { DiagnosticInfo } from "@/lib/types";
import { Sliders, Eye, EyeOff, Info } from "lucide-react";

interface DiagnosticViewerProps {
  diagnostics?: DiagnosticInfo | null;
  processingTimeMs: number;
}

export function DiagnosticViewer({ diagnostics, processingTimeMs }: DiagnosticViewerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showMask, setShowMask] = useState(true);

  if (!diagnostics) return null;

  return (
    <div className="mt-4 pt-4 border-t border-[#D7CCC8]/80 w-full text-left">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full py-2 px-3 rounded-lg bg-[#EFEBE9]/80 hover:bg-[#EFEBE9] text-[#4E342E] text-xs font-semibold transition-colors cursor-pointer"
      >
        <span className="flex items-center gap-1.5">
          <Sliders className="w-3.5 h-3.5 text-amber-700" />
          <span>Computer Vision Diagnostic Metrics & Fibre Mask</span>
        </span>
        <span className="text-[11px] text-[#8D6E63]">{isOpen ? "Hide ▲" : "Inspect ▼"}</span>
      </button>

      {isOpen && (
        <div className="mt-3 p-4 rounded-xl bg-stone-900 text-stone-200 border border-stone-800 text-xs space-y-4 animate-in fade-in duration-200">
          {/* Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div className="p-2.5 rounded-lg bg-stone-800/80 border border-stone-700">
              <div className="text-[10px] text-stone-400 font-medium">Resolution</div>
              <div className="text-sm font-mono font-bold text-amber-300">
                {diagnostics.image_width} × {diagnostics.image_height}
              </div>
            </div>

            <div className="p-2.5 rounded-lg bg-stone-800/80 border border-stone-700">
              <div className="text-[10px] text-stone-400 font-medium">Sharpness (Laplacian)</div>
              <div className="text-sm font-mono font-bold text-emerald-300">
                {diagnostics.sharpness_score.toFixed(1)}
              </div>
            </div>

            <div className="p-2.5 rounded-lg bg-stone-800/80 border border-stone-700">
              <div className="text-[10px] text-stone-400 font-medium">Edge Density</div>
              <div className="text-sm font-mono font-bold text-amber-300">
                {(diagnostics.edge_density * 100).toFixed(2)}%
              </div>
            </div>

            <div className="p-2.5 rounded-lg bg-stone-800/80 border border-stone-700">
              <div className="text-[10px] text-stone-400 font-medium">Candidate Filaments</div>
              <div className="text-sm font-mono font-bold text-sky-300">
                {diagnostics.candidate_filaments}
              </div>
            </div>
          </div>

          {/* Fibre Mask Preview */}
          {diagnostics.fibre_mask_preview && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-stone-300 flex items-center gap-1.5">
                  <Info className="w-3 h-3 text-amber-400" />
                  Processed Ridge & Skeleton Network (Neon Amber):
                </span>
                <button
                  type="button"
                  onClick={() => setShowMask(!showMask)}
                  className="flex items-center gap-1 text-[10px] text-amber-400 hover:text-amber-300 transition-colors cursor-pointer"
                >
                  {showMask ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                  <span>{showMask ? "Hide Overlay" : "Show Overlay"}</span>
                </button>
              </div>

              {showMask && (
                <div className="relative rounded-lg overflow-hidden border border-stone-700 bg-black flex items-center justify-center max-h-[300px]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={diagnostics.fibre_mask_preview}
                    alt="Detected coconut fibre skeleton network"
                    className="object-contain max-h-[300px] w-full"
                  />
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
