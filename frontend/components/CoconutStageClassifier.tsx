"use client";

import React, { useState } from "react";
import { Sparkles, Dices, AlertCircle, ArrowRight } from "lucide-react";

export interface StageInfo {
  min: number;
  max: number;
  emoji: string;
  name: string;
  combined: string; // [emoji + stage name]
  description: string;
  badgeStyle: string;
  cardBg: string;
}

const STAGES: StageInfo[] = [
  {
    min: 0,
    max: 1500,
    emoji: "🥚",
    name: "Bald Coconut",
    combined: "🥚 Bald Coconut",
    description: "Smooth like a polished cue ball! Needs sunscreen or an emergency tropical toupee.",
    badgeStyle: "bg-stone-200 text-stone-900 border-stone-300",
    cardBg: "from-stone-50 to-amber-50/60 border-stone-300",
  },
  {
    min: 1501,
    max: 3000,
    emoji: "👶🏻",
    name: "Baby Hair",
    combined: "👶🏻Baby Hair",
    description: "Just sprouting the sweetest little peach fuzz strands. Handle with gentle care!",
    badgeStyle: "bg-sky-100 text-sky-900 border-sky-300",
    cardBg: "from-sky-50/60 to-amber-50/60 border-sky-200",
  },
  {
    min: 3001,
    max: 4500,
    emoji: "💇🏻‍♀️",
    name: "Hairy Coconut",
    combined: "💇🏻♀️ Hairy Coconut",
    description: "A solid, respectable everyday mane. Looking stylish and properly textured!",
    badgeStyle: "bg-amber-100 text-amber-900 border-amber-300",
    cardBg: "from-amber-50 to-orange-50/60 border-amber-300",
  },
  {
    min: 4501,
    max: 6000,
    emoji: "🦁",
    name: "Furry Coconut",
    combined: "🦁 Furry Coconut",
    description: "Majestic king of the jungle locks! Thick, glorious, and completely untamed.",
    badgeStyle: "bg-orange-100 text-orange-950 border-orange-300",
    cardBg: "from-orange-50 to-amber-100/60 border-orange-300",
  },
  {
    min: 6001,
    max: 7500,
    emoji: "🫈",
    name: "Hair Monster",
    description: "Comb hazard warning! Wild, unruly filaments taking over the entire countertop.",
    combined: "🫈 Hair Monster",
    badgeStyle: "bg-purple-100 text-purple-950 border-purple-300",
    cardBg: "from-purple-50/60 to-amber-50/60 border-purple-200",
  },
  {
    min: 7501,
    max: 10000,
    emoji: "👑",
    name: "Coconut Rapunzel",
    combined: "👑 Coconut Rapunzel",
    description: "Royal mythological follicular abundance! Let down your fibres from the highest palm.",
    badgeStyle: "bg-yellow-200 text-yellow-950 border-yellow-400",
    cardBg: "from-yellow-50 to-amber-100/80 border-yellow-300",
  },
];

export function getStageForCount(count: number): StageInfo | null {
  if (count < 0 || count > 10000) return null;
  return STAGES.find((s) => count >= s.min && count <= s.max) || null;
}

export function CoconutStageClassifier() {
  const [inputValue, setInputValue] = useState<string>("");
  const [activeResult, setActiveResult] = useState<{
    count: number;
    stage: StageInfo;
    key: number;
  } | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleCheck = (overrideValue?: string) => {
    const raw = overrideValue !== undefined ? overrideValue : inputValue.trim();

    if (raw === "") {
      setErrorMessage("Please enter a coconut hair count between 0 and 10,000.");
      setActiveResult(null);
      return;
    }

    // Must be valid non-negative integer
    if (!/^\d+$/.test(raw)) {
      setErrorMessage("Only whole positive numbers are allowed.");
      setActiveResult(null);
      return;
    }

    const num = Number(raw);
    if (num < 0 || num > 10000) {
      setErrorMessage("Hair count must be between 0 and 10,000.");
      setActiveResult(null);
      return;
    }

    setErrorMessage(null);
    const stage = getStageForCount(num);
    if (stage) {
      setActiveResult({
        count: num,
        stage,
        key: Date.now(), // triggers re-animation
      });
    }
  };

  const handleGenerateRandom = () => {
    // Generate an interesting random count from 0 to 10,000
    const randomCount = Math.floor(Math.random() * 10001);
    setInputValue(randomCount.toString());
    handleCheck(randomCount.toString());
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleCheck();
    }
  };

  return (
    <section id="hair-stages" className="mt-12 scroll-mt-20">
      <div className="bg-white/90 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-[#D7CCC8] shadow-lg">
        {/* Title */}
        <div className="text-center max-w-xl mx-auto mb-6">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-amber-100/70 border border-amber-300 text-amber-950 text-xs font-bold mb-3 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-700" />
            <span>Classification System</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-[#3E2723] tracking-tight flex items-center justify-center gap-2">
            <span>🥥 Coconut Hair Count</span>
          </h2>
          <p className="text-xs sm:text-sm text-[#6D4C41] mt-1.5">
            Enter or generate a hair count from <strong>0 to 10,000</strong> to reveal your coconut&apos;s official stage!
          </p>
        </div>

        {/* Form Controls */}
        <div className="max-w-md mx-auto space-y-3">
          <div className="flex flex-col sm:flex-row gap-2.5">
            <div className="relative flex-1">
              <input
                id="coconut-hair-count-input"
                type="number"
                min={0}
                max={10000}
                value={inputValue}
                onChange={(e) => {
                  setInputValue(e.target.value);
                  if (errorMessage) setErrorMessage(null);
                }}
                onKeyDown={handleKeyDown}
                placeholder="Enter count (0 - 10,000)..."
                className="w-full px-4 py-3 rounded-xl border border-[#BCAAA4] focus:border-amber-700 focus:ring-2 focus:ring-amber-500/20 bg-[#FDFBF7] text-[#3E2723] placeholder:text-[#8D6E63]/70 font-semibold text-base outline-none transition-all"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-[#8D6E63] pointer-events-none">
                hairs
              </span>
            </div>

            <button
              id="check-coconut-btn"
              type="button"
              onClick={() => handleCheck()}
              className="px-5 py-3 rounded-xl bg-gradient-to-r from-[#4E342E] to-[#6D4C41] hover:from-[#3E2723] hover:to-[#5D4037] text-[#FDFBF7] font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
            >
              <span>Check My Coconut</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Generator helper button */}
          <div className="flex items-center justify-between text-xs px-1">
            <span className="text-[#8D6E63]">Range: 0 – 10,000 hairs</span>
            <button
              type="button"
              onClick={handleGenerateRandom}
              className="inline-flex items-center gap-1 text-amber-800 hover:text-amber-950 font-semibold transition-colors cursor-pointer"
            >
              <Dices className="w-3.5 h-3.5" />
              <span>Surprise Me (Random)</span>
            </button>
          </div>

          {/* Validation Error */}
          {errorMessage && (
            <div
              id="hair-count-error"
              className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 text-xs font-medium flex items-center gap-2 animate-in fade-in"
            >
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{errorMessage}</span>
            </div>
          )}
        </div>

        {/* Result Card Display with animated hair / coconut effect */}
        {activeResult && (
          <div
            key={activeResult.key}
            id="coconut-stage-result"
            className={`mt-6 max-w-lg mx-auto p-6 sm:p-7 rounded-2xl border-2 bg-gradient-to-br ${activeResult.stage.cardBg} shadow-lg text-center transition-all animate-in zoom-in-95 duration-300 relative overflow-hidden`}
          >
            {/* Animated background floating coconut hairs effect */}
            <div className="absolute inset-0 pointer-events-none opacity-20 overflow-hidden">
              <span className="absolute -top-2 left-6 text-3xl animate-bounce delay-100">🥥</span>
              <span className="absolute top-8 right-8 text-2xl animate-pulse delay-200">✨</span>
              <span className="absolute -bottom-2 left-1/3 text-2xl animate-bounce delay-300">🌴</span>
            </div>

            {/* Main Stage Presentation */}
            <div className="relative z-10 space-y-3">
              {/* Bouncy Big Stage Emoji with hair wave animation */}
              <div className="inline-block p-4 rounded-3xl bg-white/90 shadow-md border border-white/60 transform hover:scale-110 transition-transform">
                <span className="text-5xl sm:text-6xl block animate-wiggle">
                  {activeResult.stage.emoji}
                </span>
              </div>

              {/* Exact Required Fields: Hair Count & Coconut Stage */}
              <div className="space-y-1">
                <div className="text-xs uppercase tracking-wider font-extrabold text-[#6D4C41]">
                  Hair Count: <span className="font-mono text-[#3E2723] text-sm">{activeResult.count.toLocaleString()}</span>
                </div>
                <div className="text-xl sm:text-2xl font-black text-[#3E2723] tracking-tight">
                  Coconut Stage:{" "}
                  <span className="underline decoration-amber-500 decoration-wavy decoration-2">
                    {activeResult.stage.combined}
                  </span>
                </div>
              </div>

              {/* Humorous description */}
              <p className="text-xs sm:text-sm text-[#5D4037] max-w-md mx-auto leading-relaxed pt-1">
                {activeResult.stage.description}
              </p>

              {/* Pill badge showing boundary */}
              <div className="pt-2">
                <span className={`inline-block px-3 py-1 rounded-full text-[11px] font-bold border ${activeResult.stage.badgeStyle}`}>
                  Stage Bracket: {activeResult.stage.min.toLocaleString()} – {activeResult.stage.max.toLocaleString()} hairs
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Reference Legend Grid */}
        <div className="mt-8 pt-6 border-t border-[#D7CCC8]/70">
          <div className="text-xs font-bold text-[#5D4037] uppercase tracking-wider text-center mb-3">
            All 6 Coconut Follicle Stages:
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
            {STAGES.map((s, idx) => {
              const isSelected = activeResult?.stage.name === s.name;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    const mid = Math.round((s.min + s.max) / 2);
                    setInputValue(mid.toString());
                    handleCheck(mid.toString());
                  }}
                  className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                    isSelected
                      ? "bg-amber-100 border-amber-600 ring-2 ring-amber-500/30 shadow-xs"
                      : "bg-[#FAF8F5] hover:bg-white border-[#D7CCC8] hover:border-[#BCAAA4]"
                  }`}
                >
                  <div className="text-xl mb-0.5">{s.emoji}</div>
                  <div className="text-xs font-bold text-[#3E2723] leading-tight truncate">
                    {s.name}
                  </div>
                  <div className="text-[10px] text-[#8D6E63] font-mono">
                    {s.min}–{s.max}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
