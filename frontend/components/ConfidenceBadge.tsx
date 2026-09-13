"use client";

import { CheckCircle2, AlertTriangle, XCircle } from "lucide-react";

interface ConfidenceBadgeProps {
  confidence: number;
}

export function ConfidenceBadge({ confidence }: ConfidenceBadgeProps) {
  let tier: "high" | "medium" | "low" = "low";
  if (confidence >= 75) tier = "high";
  else if (confidence >= 50) tier = "medium";

  const config = {
    high: {
      bg: "bg-emerald-50",
      border: "border-emerald-300",
      text: "text-emerald-900",
      pillBg: "bg-emerald-600",
      icon: CheckCircle2,
      label: "High Confidence",
      barColor: "bg-emerald-500",
    },
    medium: {
      bg: "bg-amber-50",
      border: "border-amber-300",
      text: "text-amber-900",
      pillBg: "bg-amber-600",
      icon: AlertTriangle,
      label: "Medium Confidence",
      barColor: "bg-amber-500",
    },
    low: {
      bg: "bg-rose-50",
      border: "border-rose-300",
      text: "text-rose-900",
      pillBg: "bg-rose-600",
      icon: XCircle,
      label: "Low Confidence",
      barColor: "bg-rose-500",
    },
  }[tier];

  const Icon = config.icon;

  return (
    <div className={`p-3 rounded-xl border ${config.bg} ${config.border} ${config.text} w-full`}>
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-1.5 font-semibold text-xs sm:text-sm">
          <Icon className="w-4 h-4 shrink-0" />
          <span>{config.label}</span>
        </div>
        <span className="font-extrabold text-sm sm:text-base tracking-tight">
          Confidence: {confidence}%
        </span>
      </div>

      {/* Meter */}
      <div className="w-full bg-black/10 rounded-full h-2 overflow-hidden">
        <div
          className={`h-full ${config.barColor} transition-all duration-700 rounded-full`}
          style={{ width: `${Math.max(5, confidence)}%` }}
        />
      </div>
    </div>
  );
}
