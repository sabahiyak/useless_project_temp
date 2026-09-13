"use client";

import { X, RefreshCw, FileText } from "lucide-react";

interface ImagePreviewProps {
  previewUrl: string;
  fileName: string;
  fileSizeMb: number;
  onClear: () => void;
  disabled?: boolean;
}

export function ImagePreview({
  previewUrl,
  fileName,
  fileSizeMb,
  onClear,
  disabled,
}: ImagePreviewProps) {
  return (
    <div className="w-full bg-[#EFEBE9]/60 rounded-2xl p-4 border border-[#D7CCC8]">
      <div className="relative aspect-4/3 sm:aspect-16/10 w-full rounded-xl overflow-hidden bg-stone-900/10 shadow-inner flex items-center justify-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={previewUrl}
          alt="Uploaded coconut preview"
          className="w-full h-full object-contain max-h-[380px]"
        />

        {/* Floating Remove Button */}
        {!disabled && (
          <button
            onClick={onClear}
            className="absolute top-3 right-3 p-2 rounded-full bg-black/60 hover:bg-black/80 text-white backdrop-blur-xs transition-colors cursor-pointer shadow-md"
            title="Remove image"
            aria-label="Remove image"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Meta details bar */}
      <div className="mt-3 flex items-center justify-between text-xs text-[#5D4037]">
        <div className="flex items-center gap-1.5 truncate max-w-[70%]">
          <FileText className="w-3.5 h-3.5 shrink-0 text-[#8D6E63]" />
          <span className="font-semibold truncate">{fileName}</span>
          <span className="text-[#8D6E63] shrink-0">({fileSizeMb} MB)</span>
        </div>

        {!disabled && (
          <button
            onClick={onClear}
            className="flex items-center gap-1 text-amber-800 hover:text-amber-950 font-semibold transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Change</span>
          </button>
        )}
      </div>
    </div>
  );
}
