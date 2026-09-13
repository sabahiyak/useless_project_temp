"use client";

import { ShieldAlert, Sun, Camera, Focus } from "lucide-react";

interface LowConfidenceAlertProps {
  message?: string;
  confidence: number;
}

export function LowConfidenceAlert({ message, confidence }: LowConfidenceAlertProps) {
  return (
    <div className="w-full rounded-2xl bg-amber-50/90 border-2 border-amber-300 p-5 sm:p-6 text-[#4E342E] shadow-sm">
      <div className="flex items-start gap-3.5 mb-3">
        <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-900 shrink-0">
          <ShieldAlert className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-[#3E2723] tracking-tight">
            Unable to reliably estimate
          </h3>
          <p className="text-sm text-[#5D4037] mt-1 leading-relaxed">
            {message ||
              "The image does not contain enough clear fibre detail. Please upload a closer, sharper image with good lighting."}
          </p>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-amber-200/80">
        <div className="text-xs font-bold text-amber-950 uppercase tracking-wider mb-2">
          Tips for a reliable estimation:
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs text-[#5D4037]">
          <div className="flex items-center gap-2 p-2 rounded-lg bg-white/70 border border-amber-200">
            <Focus className="w-4 h-4 text-amber-700 shrink-0" />
            <span>Get closer to the husk texture</span>
          </div>
          <div className="flex items-center gap-2 p-2 rounded-lg bg-white/70 border border-amber-200">
            <Sun className="w-4 h-4 text-amber-700 shrink-0" />
            <span>Use bright, even lighting</span>
          </div>
          <div className="flex items-center gap-2 p-2 rounded-lg bg-white/70 border border-amber-200">
            <Camera className="w-4 h-4 text-amber-700 shrink-0" />
            <span>Avoid motion blur or harsh glare</span>
          </div>
        </div>
      </div>
    </div>
  );
}
