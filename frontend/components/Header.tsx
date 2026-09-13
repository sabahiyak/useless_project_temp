"use client";

import { useEffect, useState } from "react";
import { checkBackendHealth } from "@/lib/api";
import { Activity, Sparkles } from "lucide-react";

export function Header() {
  const [backendOnline, setBackendOnline] = useState<boolean | null>(null);

  useEffect(() => {
    checkBackendHealth().then(setBackendOnline);
    const interval = setInterval(() => {
      checkBackendHealth().then(setBackendOnline);
    }, 20000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-[#3E2723]/90 text-[#FDFBF7] border-b border-[#5D4037] shadow-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand */}
        <a href="#" className="flex items-center space-x-2.5 group">
          <span className="text-2xl transform group-hover:scale-110 transition-transform">🥥</span>
          <div className="flex flex-col">
            <span className="font-bold text-base sm:text-lg tracking-tight flex items-center gap-1.5 text-[#FDFBF7]">
              Is My Coco Losing Hair??
            </span>
            <span className="text-xs text-[#D7CCC8] -mt-1 font-medium tracking-wide">
              Coconut Hair Counter
            </span>
          </div>
        </a>

        {/* Navigation & Status */}
        <nav className="flex items-center space-x-3 sm:space-x-6 text-sm">
          <a
            href="#hair-stages"
            className="hidden sm:inline-block text-[#D7CCC8] hover:text-[#FDFBF7] transition-colors font-medium"
          >
            Hair Stages
          </a>
          <a
            href="#how-it-works"
            className="hidden sm:inline-block text-[#D7CCC8] hover:text-[#FDFBF7] transition-colors font-medium"
          >
            How It Works
          </a>
          <a
            href="#about"
            className="hidden sm:inline-block text-[#D7CCC8] hover:text-[#FDFBF7] transition-colors font-medium"
          >
            About
          </a>

          {/* Backend Status Pill */}
          <div
            className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${
              backendOnline === true
                ? "bg-emerald-950/70 border-emerald-500/50 text-emerald-300"
                : backendOnline === false
                ? "bg-rose-950/70 border-rose-500/50 text-rose-300"
                : "bg-[#4E342E] border-[#6D4C41] text-[#D7CCC8]"
            }`}
            title={
              backendOnline === true
                ? "FastAPI Computer Vision Backend is Online"
                : backendOnline === false
                ? "Backend unreachable (Ensure backend server is running on :8000)"
                : "Checking backend status..."
            }
          >
            <span
              className={`w-2 h-2 rounded-full ${
                backendOnline === true
                  ? "bg-emerald-400 animate-pulse"
                  : backendOnline === false
                  ? "bg-rose-400"
                  : "bg-amber-400"
              }`}
            />
            <span className="hidden xs:inline">
              {backendOnline === true ? "CV Engine Online" : backendOnline === false ? "CV Offline" : "Connecting..."}
            </span>
          </div>
        </nav>
      </div>
    </header>
  );
}
