import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ConfidenceBadge } from "@/components/ConfidenceBadge";
import { LowConfidenceAlert } from "@/components/LowConfidenceAlert";
import { ResultCard } from "@/components/ResultCard";
import {
  CoconutStageClassifier,
  getStageForCount,
} from "@/components/CoconutStageClassifier";
import { AnalysisResponse } from "@/lib/types";

describe("ConfidenceBadge Component", () => {
  it("renders high confidence correctly", () => {
    render(<ConfidenceBadge confidence={82} />);
    expect(screen.getByText("High Confidence")).toBeInTheDocument();
    expect(screen.getByText("Confidence: 82%")).toBeInTheDocument();
  });

  it("renders medium confidence correctly", () => {
    render(<ConfidenceBadge confidence={65} />);
    expect(screen.getByText("Medium Confidence")).toBeInTheDocument();
    expect(screen.getByText("Confidence: 65%")).toBeInTheDocument();
  });

  it("renders low confidence correctly", () => {
    render(<ConfidenceBadge confidence={35} />);
    expect(screen.getByText("Low Confidence")).toBeInTheDocument();
    expect(screen.getByText("Confidence: 35%")).toBeInTheDocument();
  });
});

describe("LowConfidenceAlert Component", () => {
  it("renders the mandatory unable to reliably estimate heading and message", () => {
    render(
      <LowConfidenceAlert
        confidence={24}
        message="The image does not contain enough clear fibre detail."
      />
    );
    expect(screen.getByText("Unable to reliably estimate")).toBeInTheDocument();
    expect(
      screen.getByText("The image does not contain enough clear fibre detail.")
    ).toBeInTheDocument();
  });
});

describe("ResultCard Component", () => {
  it("renders estimated count, confidence and mandatory disclaimer when confidence is sufficient", () => {
    const mockResult: AnalysisResponse = {
      success: true,
      estimated_count: 248,
      confidence: 78,
      status: "estimated",
      processing_time_ms: 650,
      message: "Estimated from visible fibre patterns.",
      diagnostics: {
        image_width: 800,
        image_height: 600,
        sharpness_score: 180.5,
        edge_density: 0.045,
        candidate_filaments: 120,
        husk_area_ratio: 0.11,
        hair_verdict: "Healthy Thick Strands (Coco has great hair!)",
      },
    };

    render(<ResultCard result={mockResult} onReset={vi.fn()} />);

    expect(screen.getByText("≈ 248")).toBeInTheDocument();
    expect(screen.getByText("Confidence: 78%")).toBeInTheDocument();
    expect(screen.getByText("Healthy Thick Strands (Coco has great hair!)")).toBeInTheDocument();
    expect(
      screen.getByText(/This result is an image-processing estimate/i)
    ).toBeInTheDocument();
  });

  it("renders low confidence alert and no estimated count when image quality is poor", () => {
    const mockLowResult: AnalysisResponse = {
      success: false,
      estimated_count: null,
      confidence: 21,
      status: "low_confidence",
      processing_time_ms: 450,
      message: "Unable to reliably detect coconut fibres. Please upload a clearer image.",
    };

    render(<ResultCard result={mockLowResult} onReset={vi.fn()} />);

    expect(screen.getByText("Unable to reliably estimate")).toBeInTheDocument();
    expect(screen.queryByText("Estimated Visible Fibres")).not.toBeInTheDocument();
  });
});

describe("CoconutStageClassifier & getStageForCount", () => {
  it("correctly identifies all exact stage ranges and labels", () => {
    // 0–1500 → 🥚 Bald Coconut
    expect(getStageForCount(0)?.combined).toBe("🥚 Bald Coconut");
    expect(getStageForCount(1500)?.combined).toBe("🥚 Bald Coconut");

    // 1501–3000 → 👶🏻Baby Hair
    expect(getStageForCount(1501)?.combined).toBe("👶🏻Baby Hair");
    expect(getStageForCount(3000)?.combined).toBe("👶🏻Baby Hair");

    // 3001–4500 → 💇🏻♀️ Hairy Coconut
    expect(getStageForCount(3001)?.combined).toBe("💇🏻♀️ Hairy Coconut");
    expect(getStageForCount(4500)?.combined).toBe("💇🏻♀️ Hairy Coconut");

    // 4501–6000 → 🦁 Furry Coconut
    expect(getStageForCount(4501)?.combined).toBe("🦁 Furry Coconut");
    expect(getStageForCount(6000)?.combined).toBe("🦁 Furry Coconut");

    // 6001–7500 → 🫈 Hair Monster
    expect(getStageForCount(6001)?.combined).toBe("🫈 Hair Monster");
    expect(getStageForCount(7500)?.combined).toBe("🫈 Hair Monster");

    // 7501–10000 → 👑 Coconut Rapunzel
    expect(getStageForCount(7501)?.combined).toBe("👑 Coconut Rapunzel");
    expect(getStageForCount(10000)?.combined).toBe("👑 Coconut Rapunzel");

    // Out of bounds
    expect(getStageForCount(-1)).toBeNull();
    expect(getStageForCount(10001)).toBeNull();
  });

  it("interactively checks input and displays hair count, coconut stage and handles validation", () => {
    render(<CoconutStageClassifier />);

    const input = screen.getByPlaceholderText("Enter count (0 - 10,000)...");
    const checkBtn = screen.getByRole("button", { name: /Check My Coconut/i });

    // Test valid number 5500 -> 🦁 Furry Coconut
    fireEvent.change(input, { target: { value: "5500" } });
    fireEvent.click(checkBtn);

    expect(screen.getByText("🦁 Furry Coconut")).toBeInTheDocument();
    expect(screen.getByText("5,500")).toBeInTheDocument();

    // Test out of range > 10,000
    fireEvent.change(input, { target: { value: "12500" } });
    fireEvent.click(checkBtn);
    expect(
      screen.getByText("Hair count must be between 0 and 10,000.")
    ).toBeInTheDocument();
  });
});
