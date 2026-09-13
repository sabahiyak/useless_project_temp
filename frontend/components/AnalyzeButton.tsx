"use client";

import { Search, Loader2 } from "lucide-react";

interface AnalyzeButtonProps {
  onClick: () => void;
  disabled: boolean;
  isLoading: boolean;
}

export function AnalyzeButton({ onClick, disabled, isLoading }: AnalyzeButtonProps) {
  return (
    <button
      id="analyze-coconut-button"
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`w-full py-4 px-6 rounded-xl font-bold text-base sm:text-lg flex items-center justify-center gap-2.5 shadow-md transition-all cursor-pointer select-none ${
        disabled
          ? "bg-[#D7CCC8] text-[#8D6E63] cursor-not-allowed opacity-65 shadow-none"
          : isLoading
          ? "bg-[#6D4C41] text-[#FDFBF7] cursor-wait shadow-sm"
          : "bg-gradient-to-r from-[#4E342E] via-[#5D4037] to-[#795548] hover:from-[#3E2723] hover:to-[#6D4C41] text-[#FDFBF7] hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
      }`}
    >
      {isLoading ? (
        <>
          <Loader2 className="w-5 h-5 animate-spin text-amber-400" />
          <span>Analyzing coconut fibres...</span>
        </>
      ) : (
        <>
          <Search className="w-5 h-5 text-amber-300" />
          <span>🔍 Count Coconut Hair</span>
        </>
      )}
    </button>
  );
}
