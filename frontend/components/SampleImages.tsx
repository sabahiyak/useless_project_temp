"use client";

import { useEffect, useState } from "react";
import { Image as ImageIcon, Wand2, ShieldAlert } from "lucide-react";

interface SampleImagesProps {
  onSelectSample: (blob: Blob, name: string) => void;
  disabled?: boolean;
}

export function SampleImages({ onSelectSample, disabled }: SampleImagesProps) {
  const [samplesReady, setSamplesReady] = useState(false);

  // Helper to generate realistic procedural coconut canvases
  const generateSample = (type: "hairy" | "smooth" | "blurry"): Promise<Blob> => {
    return new Promise((resolve) => {
      const canvas = document.createElement("canvas");
      canvas.width = 450;
      canvas.height = 450;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // Background
      ctx.fillStyle = type === "blurry" ? "#443b35" : "#FAF8F5";
      ctx.fillRect(0, 0, 450, 450);

      const centerX = 225;
      const centerY = 225;
      const radius = 160;

      if (type === "smooth") {
        // Smooth young green/yellow coconut
        const grad = ctx.createRadialGradient(centerX - 40, centerY - 40, 20, centerX, centerY, radius);
        grad.addColorStop(0, "#8BC34A");
        grad.addColorStop(0.6, "#558B2F");
        grad.addColorStop(1, "#33691E");
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.ellipse(centerX, centerY, radius * 0.95, radius * 1.15, 0.1, 0, Math.PI * 2);
        ctx.fill();

        // Very sparse subtle texture
        ctx.strokeStyle = "rgba(46, 125, 50, 0.3)";
        ctx.lineWidth = 1;
        for (let i = 0; i < 25; i++) {
          ctx.beginPath();
          const angle = (i / 25) * Math.PI * 2;
          const r = radius * 0.7;
          ctx.moveTo(centerX + Math.cos(angle) * r, centerY + Math.sin(angle) * r);
          ctx.lineTo(centerX + Math.cos(angle) * (r + 20), centerY + Math.sin(angle) * (r + 20));
          ctx.stroke();
        }
      } else if (type === "hairy") {
        // Mature, fibrous brown coconut with dense sharp hair strands
        const grad = ctx.createRadialGradient(centerX - 30, centerY - 40, 20, centerX, centerY, radius);
        grad.addColorStop(0, "#6D4C41");
        grad.addColorStop(0.5, "#4E342E");
        grad.addColorStop(1, "#2D1810");
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.ellipse(centerX, centerY, radius, radius * 1.08, 0, 0, Math.PI * 2);
        ctx.fill();

        // Draw hundreds of sharp fibrous strands radiating and crossing
        ctx.lineWidth = 1.4;
        const colors = [
          "rgba(215, 204, 200, 0.85)",
          "rgba(188, 170, 164, 0.8)",
          "rgba(245, 222, 179, 0.9)",
          "rgba(141, 110, 99, 0.9)",
          "rgba(255, 248, 225, 0.85)",
        ];

        for (let i = 0; i < 280; i++) {
          ctx.strokeStyle = colors[i % colors.length];
          ctx.beginPath();
          const startX = centerX + (Math.random() - 0.5) * (radius * 1.6);
          const startY = centerY + (Math.random() - 0.5) * (radius * 1.6);
          const angle = Math.random() * Math.PI * 2;
          const length = 20 + Math.random() * 45;
          const endX = startX + Math.cos(angle) * length;
          const endY = startY + Math.sin(angle) * length;

          ctx.moveTo(startX, startY);
          // Curvilinear bend
          const midX = (startX + endX) / 2 + (Math.random() - 0.5) * 8;
          const midY = (startY + endY) / 2 + (Math.random() - 0.5) * 8;
          ctx.quadraticCurveTo(midX, midY, endX, endY);
          ctx.stroke();
        }
      } else {
        // Blurry, out-of-focus coconut (triggers honest low-confidence warning)
        ctx.filter = "blur(18px)";
        const grad = ctx.createRadialGradient(centerX, centerY, 30, centerX, centerY, radius);
        grad.addColorStop(0, "#6D4C41");
        grad.addColorStop(1, "#3E2723");
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        ctx.fill();
      }

      canvas.toBlob((blob) => {
        if (blob) resolve(blob);
      }, "image/jpeg", 0.92);
    });
  };

  const loadSample = async (type: "hairy" | "smooth" | "blurry") => {
    const blob = await generateSample(type);
    const titles = {
      hairy: "sample_hairy_mature_coco.jpg",
      smooth: "sample_smooth_young_coco.jpg",
      blurry: "sample_blurry_low_confidence_coco.jpg",
    };
    onSelectSample(blob, titles[type]);
  };

  return (
    <div className="mt-4 pt-4 border-t border-[#D7CCC8]/60">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-semibold text-[#5D4037] uppercase tracking-wider flex items-center gap-1">
          <Wand2 className="w-3.5 h-3.5 text-amber-700" />
          Quick Test with Sample Coconuts:
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        <button
          type="button"
          disabled={disabled}
          onClick={() => loadSample("hairy")}
          className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#EFEBE9] hover:bg-[#D7CCC8]/70 border border-[#BCAAA4] text-xs font-medium text-[#3E2723] transition-colors disabled:opacity-50 text-left cursor-pointer"
        >
          <span className="text-base">🧔🏽</span>
          <div>
            <div className="font-semibold">Hairy Mature Coco</div>
            <div className="text-[10px] text-[#6D4C41]">High detail & contrast</div>
          </div>
        </button>

        <button
          type="button"
          disabled={disabled}
          onClick={() => loadSample("smooth")}
          className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#EFEBE9] hover:bg-[#D7CCC8]/70 border border-[#BCAAA4] text-xs font-medium text-[#3E2723] transition-colors disabled:opacity-50 text-left cursor-pointer"
        >
          <span className="text-base">🥥</span>
          <div>
            <div className="font-semibold">Smooth Young Coco</div>
            <div className="text-[10px] text-[#6D4C41]">Minimal visible strands</div>
          </div>
        </button>

        <button
          type="button"
          disabled={disabled}
          onClick={() => loadSample("blurry")}
          className="flex items-center gap-2 px-3 py-2 rounded-lg bg-rose-50 hover:bg-rose-100/70 border border-rose-200 text-xs font-medium text-rose-900 transition-colors disabled:opacity-50 text-left cursor-pointer"
        >
          <span className="text-base">🌫️</span>
          <div>
            <div className="font-semibold">Blurry / Low-Light</div>
            <div className="text-[10px] text-rose-700">Tests low confidence</div>
          </div>
        </button>
      </div>
    </div>
  );
}
