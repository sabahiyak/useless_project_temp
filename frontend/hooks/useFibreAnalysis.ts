"use client";

import { useState, useCallback } from "react";
import { AnalysisResponse } from "@/lib/types";
import { analyzeCoconutImage, ApiError } from "@/lib/api";
import confetti from "canvas-confetti";

export type AnalysisState = "idle" | "ready" | "analyzing" | "success" | "low_confidence" | "error";

export function useFibreAnalysis() {
  const [selectedFile, setSelectedFile] = useState<File | Blob | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [fileSizeMb, setFileSizeMb] = useState<number>(0);
  const [state, setState] = useState<AnalysisState>("idle");
  const [result, setResult] = useState<AnalysisResponse | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSelectFile = useCallback((file: File | Blob, name?: string) => {
    // Revoke previous URL if any
    if (previewUrl && previewUrl.startsWith("blob:")) {
      URL.revokeObjectURL(previewUrl);
    }

    const actualName = name || (file instanceof File ? file.name : "coconut.jpg");
    const url = URL.createObjectURL(file);
    const sizeMb = (file.size / (1024 * 1024));

    setSelectedFile(file);
    setFileName(actualName);
    setPreviewUrl(url);
    setFileSizeMb(Number(sizeMb.toFixed(2)));
    setState("ready");
    setResult(null);
    setErrorMessage(null);
  }, [previewUrl]);

  const handleClear = useCallback(() => {
    if (previewUrl && previewUrl.startsWith("blob:")) {
      URL.revokeObjectURL(previewUrl);
    }
    setSelectedFile(null);
    setFileName("");
    setPreviewUrl(null);
    setFileSizeMb(0);
    setState("idle");
    setResult(null);
    setErrorMessage(null);
  }, [previewUrl]);

  const runAnalysis = useCallback(async () => {
    if (!selectedFile) return;

    setState("analyzing");
    setErrorMessage(null);

    try {
      const response = await analyzeCoconutImage(selectedFile, fileName);
      setResult(response);

      if (response.status === "estimated" && response.estimated_count !== null) {
        setState("success");
        // Trigger celebratory confetti if high confidence and lots of hair!
        if (response.confidence >= 75) {
          try {
            confetti({
              particleCount: 50,
              spread: 60,
              origin: { y: 0.7 },
              colors: ["#8D6E63", "#D97706", "#2E7D32", "#FDFBF7"],
            });
          } catch {
            // Ignore confetti errors
          }
        }
      } else {
        setState("low_confidence");
      }
    } catch (err: any) {
      const msg = err instanceof ApiError ? err.message : "Analysis failed unexpectedly.";
      setErrorMessage(msg);
      setState("error");
    }
  }, [selectedFile, fileName]);

  return {
    selectedFile,
    fileName,
    previewUrl,
    fileSizeMb,
    state,
    result,
    errorMessage,
    handleSelectFile,
    handleClear,
    runAnalysis,
  };
}
