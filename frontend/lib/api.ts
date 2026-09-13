import { AnalysisResponse } from "./types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number = 500) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

export async function analyzeCoconutImage(
  file: File | Blob,
  filename: string = "coconut.jpg"
): Promise<AnalysisResponse> {
  const formData = new FormData();
  formData.append("file", file, filename);

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 45000); // 45s timeout

  try {
    const response = await fetch(`${API_BASE_URL}/api/analyze`, {
      method: "POST",
      body: formData,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      let errorMessage = `Server error (${response.status})`;
      try {
        const errorData = await response.json();
        if (errorData && errorData.detail) {
          errorMessage = typeof errorData.detail === "string" ? errorData.detail : JSON.stringify(errorData.detail);
        }
      } catch {
        // use fallback message
      }
      throw new ApiError(errorMessage, response.status);
    }

    return (await response.json()) as AnalysisResponse;
  } catch (err: any) {
    clearTimeout(timeoutId);
    if (err.name === "AbortError") {
      throw new ApiError("Analysis request timed out. Please try a smaller image.", 408);
    }
    if (err instanceof ApiError) {
      throw err;
    }
    throw new ApiError(
      err.message || "Failed to connect to backend computer vision service. Please ensure the backend is running.",
      503
    );
  }
}

export async function checkBackendHealth(): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/health`, { method: "GET", cache: "no-store" });
    return res.ok;
  } catch {
    return false;
  }
}
