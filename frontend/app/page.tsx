"use client";

import { useRef } from "react";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { ImageUploader } from "@/components/ImageUploader";
import { ImagePreview } from "@/components/ImagePreview";
import { AnalyzeButton } from "@/components/AnalyzeButton";
import { AnalysisLoader } from "@/components/AnalysisLoader";
import { ResultCard } from "@/components/ResultCard";
import { SampleImages } from "@/components/SampleImages";
import { CoconutStageClassifier } from "@/components/CoconutStageClassifier";
import { HowItWorks } from "@/components/HowItWorks";
import { Footer } from "@/components/Footer";
import { useFibreAnalysis } from "@/hooks/useFibreAnalysis";
import { AlertCircle } from "lucide-react";

export default function Home() {
  const uploadSectionRef = useRef<HTMLDivElement>(null);
  const {
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
  } = useFibreAnalysis();

  const scrollToUpload = () => {
    uploadSectionRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const isAnalyzing = state === "analyzing";
  const hasResult = (state === "success" || state === "low_confidence") && result !== null;

  return (
    <div className="min-h-screen flex flex-col bg-[#FDFBF7] text-[#3E2723] selection:bg-amber-200 selection:text-amber-900">
      {/* Top Header */}
      <Header />

      {/* Hero Section */}
      <Hero onScrollToUpload={scrollToUpload} />

      {/* Main Interactive Workspace */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 pb-16">
        <div ref={uploadSectionRef} className="scroll-mt-20">
          {/* Card Container */}
          <div className="bg-white/80 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-[#D7CCC8] shadow-lg">
            {!hasResult ? (
              <div className="space-y-6">
                <div className="text-center max-w-md mx-auto mb-2">
                  <h2 className="text-xl sm:text-2xl font-black text-[#3E2723] tracking-tight">
                    Coconut Follicle Analyzer
                  </h2>
                  <p className="text-xs sm:text-sm text-[#6D4C41] mt-1">
                    Upload a high-resolution photo of your coconut to estimate visible fibres.
                  </p>
                </div>

                {/* Upload or Preview */}
                {!previewUrl ? (
                  <>
                    <ImageUploader
                      onFileSelect={handleSelectFile}
                      disabled={isAnalyzing}
                    />
                    <SampleImages
                      onSelectSample={handleSelectFile}
                      disabled={isAnalyzing}
                    />
                  </>
                ) : (
                  <div className="space-y-5">
                    <ImagePreview
                      previewUrl={previewUrl}
                      fileName={fileName}
                      fileSizeMb={fileSizeMb}
                      onClear={handleClear}
                      disabled={isAnalyzing}
                    />

                    {/* Loader during CV processing */}
                    {isAnalyzing && <AnalysisLoader />}

                    {/* Action Button */}
                    {!isAnalyzing && (
                      <AnalyzeButton
                        onClick={runAnalysis}
                        disabled={!selectedFile}
                        isLoading={isAnalyzing}
                      />
                    )}
                  </div>
                )}

                {/* Error Banner */}
                {errorMessage && (
                  <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 text-sm flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold block">Analysis Failed</span>
                      <span>{errorMessage}</span>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* Results View */
              <ResultCard result={result} onReset={handleClear} />
            )}
          </div>
        </div>

        {/* Coconut Hair Count Classification System */}
        <CoconutStageClassifier />

        {/* Algorithm Educational Guide */}
        <HowItWorks />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
