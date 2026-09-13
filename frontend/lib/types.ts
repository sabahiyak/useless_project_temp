export interface DiagnosticInfo {
  image_width: number;
  image_height: number;
  sharpness_score: number;
  edge_density: number;
  candidate_filaments: number;
  husk_area_ratio: number;
  fibre_mask_preview?: string | null;
  hair_verdict?: string | null;
}

export interface AnalysisResponse {
  success: boolean;
  estimated_count: number | null;
  confidence: number;
  status: "estimated" | "low_confidence" | "error";
  processing_time_ms: number;
  message: string;
  diagnostics?: DiagnosticInfo | null;
  analysis_id?: string | null;
}

export interface AnalysisHistoryItem {
  id: string;
  image_path?: string | null;
  estimated_count: number | null;
  confidence: number;
  status: string;
  algorithm_version: string;
  processing_time_ms: number;
  created_at?: string | null;
}
