"use client";

import React, { useRef, useState } from "react";
import { UploadCloud, AlertCircle } from "lucide-react";

interface ImageUploaderProps {
  onFileSelect: (file: File) => void;
  disabled?: boolean;
}

const MAX_SIZE_MB = 10;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

export function ImageUploader({ onFileSelect, disabled }: ImageUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const validateAndSelect = (file: File) => {
    setUploadError(null);

    // Validate MIME type
    if (!ALLOWED_TYPES.includes(file.type) && !file.name.match(/\.(jpg|jpeg|png|webp)$/i)) {
      setUploadError("Unsupported format. Please upload a JPG, PNG, or WEBP image.");
      return;
    }

    // Validate size (10 MB)
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      setUploadError(`File is too large (${(file.size / (1024 * 1024)).toFixed(1)}MB). Max allowed is ${MAX_SIZE_MB}MB.`);
      return;
    }

    onFileSelect(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (disabled) return;

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndSelect(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndSelect(e.target.files[0]);
    }
  };

  return (
    <div className="w-full">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !disabled && fileInputRef.current?.click()}
        className={`relative flex flex-col items-center justify-center p-8 sm:p-12 border-2 border-dashed rounded-2xl transition-all cursor-pointer select-none ${
          isDragging
            ? "border-amber-600 bg-amber-500/10 scale-[1.01]"
            : "border-[#BCAAA4] hover:border-[#8D6E63] bg-white/60 hover:bg-[#FDFBF7]"
        } ${disabled ? "opacity-60 cursor-not-allowed" : ""}`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
          onChange={handleFileInputChange}
          disabled={disabled}
          className="hidden"
          id="coconut-file-input"
        />

        {/* Icon */}
        <div className="w-16 h-16 rounded-full bg-[#EFEBE9] flex items-center justify-center text-[#5D4037] mb-4 shadow-inner">
          <UploadCloud className="w-8 h-8" />
        </div>

        {/* Text */}
        <h3 className="text-lg font-bold text-[#3E2723] mb-1">
          Drop your coconut photo here, or <span className="text-amber-700 underline">browse</span>
        </h3>
        <p className="text-sm text-[#6D4C41] mb-4">
          Capture high-contrast, close-up angles for the most reliable fibre estimation.
        </p>

        {/* Badges */}
        <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-[#8D6E63]">
          <span className="px-2.5 py-1 rounded-md bg-[#EFEBE9] font-medium">JPG, PNG, WEBP</span>
          <span>•</span>
          <span className="px-2.5 py-1 rounded-md bg-[#EFEBE9] font-medium">Max 10 MB</span>
        </div>
      </div>

      {/* Validation Error Alert */}
      {uploadError && (
        <div className="mt-3 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
          <span>{uploadError}</span>
        </div>
      )}
    </div>
  );
}
