from typing import Optional
from pydantic import BaseModel, Field


class DiagnosticInfo(BaseModel):
    image_width: int
    image_height: int
    sharpness_score: float
    edge_density: float
    candidate_filaments: int
    husk_area_ratio: float
    fibre_mask_preview: Optional[str] = None
    hair_verdict: Optional[str] = None  # e.g., "Luscious & Hairy", "Moderate Strands", "Thinning Coco", "Almost Bald!"


class AnalysisResponse(BaseModel):
    success: bool
    estimated_count: Optional[int] = None
    confidence: int = Field(..., ge=0, le=100)
    status: str  # "estimated", "low_confidence", "error"
    processing_time_ms: int
    message: str
    diagnostics: Optional[DiagnosticInfo] = None
    analysis_id: Optional[str] = None


class AnalysisHistoryItem(BaseModel):
    id: str
    image_path: Optional[str] = None
    estimated_count: Optional[int] = None
    confidence: float
    status: str
    algorithm_version: str
    processing_time_ms: int
    created_at: Optional[str] = None


class HealthResponse(BaseModel):
    status: str = "ok"
    version: str = "1.0.0"
    app_name: str = "Is My Coco Losing Hair??"
