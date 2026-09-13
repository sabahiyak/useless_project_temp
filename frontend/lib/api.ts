import { AnalysisResponse } from "./types";

// ─── API Base URL ────────────────────────────────────────────────────────────
// Set NEXT_PUBLIC_API_URL in Vercel → Project → Settings → Environment Variables
// For local dev, create frontend/.env.local with:
//   NEXT_PUBLIC_API_URL=https://useless-project-temp-xjij.onrender.com/
const API_BASE_URL = (
  process.env.NEXT_PUBLIC_API_URL || "https://useless-project-temp-xjij.onrender.com/"
).replace(/\/$/, "");

// ─── Error Class ─────────────────────────────────────────────────────────────
export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number = 500) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
function friendlyNetworkError(err: any): ApiError {
  // AbortController fired → request timed out
  if (err.name === "AbortError") {
    return new ApiError(
      "The request timed out. The backend may be waking up from sleep — please try again in a few seconds.",
      408
    );
  }
  // Already an ApiError — pass through
  if (err instanceof ApiError) return err;

  // Generic network failure (CORS will also surface here as a TypeError)
  const msg: string = err?.message || "";
  if (
    msg.includes("Failed to fetch") ||
    msg.includes("NetworkError") ||
    msg.includes("net::ERR")
  ) {
    return new ApiError(
      "Cannot reach the backend server. This may be a network issue or the server is still waking up. Please try again.",
      503
    );
  }

  return new ApiError(msg || "An unexpected error occurred.", 500);
}

// ─── Analyse Coconut Image ────────────────────────────────────────────────────
export async function analyzeCoconutImage(
  file: File | Blob,
  filename: string = "coconut.jpg"
): Promise<AnalysisResponse> {
  const formData = new FormData();
  // Do NOT set Content-Type manually — the browser sets the multipart boundary
  formData.append("file", file, filename);

  const controller = new AbortController();
  // 60 s for Render free-tier cold-start + image processing
  const timeoutId = setTimeout(() => controller.abort(), 60000);

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
        if (errorData?.detail) {
          errorMessage =
            typeof errorData.detail === "string"
              ? errorData.detail
              : JSON.stringify(errorData.detail);
        } else if (errorData?.message) {
          errorMessage = errorData.message;
        }
      } catch {
        // JSON parse failed — keep the status-code message
      }

      // Map common HTTP status codes to user-friendly messages
      if (response.status === 413) {
        errorMessage = "Image is too large. Please upload an image under 10 MB.";
      } else if (response.status === 422) {
        errorMessage = "Invalid file. Please upload a JPEG, PNG, or WebP image.";
      } else if (response.status === 429) {
        errorMessage = "Too many requests. Please wait a moment and try again.";
      } else if (response.status >= 500) {
        errorMessage =
          "The backend encountered an error processing your image. Please try again.";
      }

      throw new ApiError(errorMessage, response.status);
    }

    return (await response.json()) as AnalysisResponse;
  } catch (err: any) {
    clearTimeout(timeoutId);
    throw friendlyNetworkError(err);
  }
}

// ─── Health Check ─────────────────────────────────────────────────────────────
export async function checkBackendHealth(): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/health`, {
      method: "GET",
      cache: "no-store",
      signal: AbortSignal.timeout(8000), // 8 s max for health check
    });
    return res.ok;
  } catch {
    return false;
  }
}

