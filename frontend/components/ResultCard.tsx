"use client";

import { AnalysisResponse } from "@/lib/types";
import { ConfidenceBadge } from "./ConfidenceBadge";
import { LowConfidenceAlert } from "./LowConfidenceAlert";
import { DiagnosticViewer } from "./DiagnosticViewer";
import { Clock, RefreshCcw, AlertCircle, Sparkles } from "lucide-react";
import { getStageForCount } from "./CoconutStageClassifier";

interface ResultCardProps {
  result: AnalysisResponse;
  onReset: () => void;
}

export function ResultCard({ result, onReset }: ResultCardProps) {
  const isLowConfidence =
    result.status === "low_confidence" || result.estimated_count === null;

  return (
    <div className="w-full bg-white rounded-3xl p-6 sm:p-8 border border-[#D7CCC8] shadow-xl text-center transition-all animate-in fade-in slide-in-from-bottom-3 duration-300">
      {/* Top Header & Timing */}
      <div className="flex items-center justify-between pb-4 mb-6 border-b border-[#D7CCC8]/60 text-xs text-[#6D4C41]">
        <div className="flex items-center gap-1.5 font-semibold text-[#5D4037]">
          <span className="text-base">🥥</span>
          <span>Analysis Report</span>
        </div>
        <div className="flex items-center gap-1 bg-[#EFEBE9] px-2.5 py-1 rounded-full font-mono text-[11px] font-semibold">
          <Clock className="w-3 h-3 text-[#8D6E63]" />
          <span>{result.processing_time_ms} ms</span>
        </div>
      </div>

      {isLowConfidence ? (
        /* Low Confidence State */
        <div className="space-y-6">
          <LowConfidenceAlert
            message={result.message}
            confidence={result.confidence}
          />
          <ConfidenceBadge confidence={result.confidence} />
        </div>
      ) : (
        /* Successful Estimation State */
        <div className="space-y-6">
          {/* Verdict Pill */}
          {result.diagnostics?.hair_verdict && (
            <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-amber-100/80 border border-amber-300 text-amber-900 font-bold text-xs sm:text-sm">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>{result.diagnostics.hair_verdict}</span>
            </div>
          )}

          {/* Large Estimated Count */}
          <div>
            <div className="text-xs sm:text-sm uppercase tracking-wider font-extrabold text-[#8D6E63] mb-1">
              Estimated Visible Fibres
            </div>
            <div
              id="estimated-fibre-count"
              className="text-5xl sm:text-7xl font-black text-[#3E2723] tracking-tight"
            >
              ≈ {result.estimated_count?.toLocaleString()}
            </div>
          </div>

          {/* Coconut Stage Condition */}
          {result.estimated_count !== null && (() => {
            const stage = getStageForCount(result.estimated_count);
            if (!stage) return null;
            return (
              <div className={`mt-2 mx-auto w-full max-w-sm p-4 rounded-2xl bg-gradient-to-br ${stage.cardBg} border-2 shadow-sm flex flex-col items-center justify-center`}>
                <div className="text-[10px] font-bold text-[#6D4C41] uppercase tracking-wider mb-2">Condition Output</div>
                <div className="flex items-center gap-4">
                  <div className="inline-block p-3 rounded-2xl bg-white/90 shadow-sm border border-white/60 shrink-0">
                    <span className="text-4xl block animate-wiggle">{stage.emoji}</span>
                  </div>
                  <div className="flex flex-col items-start gap-1">
                    <span className="text-xl font-black text-[#3E2723] tracking-tight underline decoration-amber-500 decoration-wavy decoration-2">
                      {stage.name}
                    </span>
                    <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold border ${stage.badgeStyle}`}>
                      {stage.min.toLocaleString()} – {stage.max.toLocaleString()} hairs
                    </span>
                  </div>
                </div>
              </div>
            );
          })()}


          {/* Confidence Badge */}
          <ConfidenceBadge confidence={result.confidence} />

          {/* Primary Estimate Disclaimer Box */}
          <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E7DED7] text-left text-xs text-[#5D4037] leading-relaxed space-y-2">
            <p className="font-semibold text-[#3E2723] flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 text-amber-700 shrink-0" />
              <span>{result.message}</span>
            </p>
            <p className="text-[11px] text-[#795548]">
              This result is an image-processing estimate. It does not represent an exact biological count.
              Fibres that overlap, are hidden, damaged, blurred, or poorly illuminated may not be detected.
            </p>
          </div>
        </div>
      )}

      {/* Diagnostics Toggle */}
      <DiagnosticViewer
        diagnostics={result.diagnostics}
        processingTimeMs={result.processing_time_ms}
      />

      {/* Reset Action */}
      <div className="mt-6 pt-4 border-t border-[#D7CCC8]/60 flex justify-center">
        <button
          onClick={onReset}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#EFEBE9] hover:bg-[#D7CCC8]/80 text-[#3E2723] font-bold text-sm transition-colors cursor-pointer"
        >
          <RefreshCcw className="w-4 h-4" />
          <span>Upload Another Coconut</span>
        </button>
      </div>
    </div>
  );
}
