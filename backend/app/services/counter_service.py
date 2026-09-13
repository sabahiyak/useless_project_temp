import time
import logging
from typing import Optional
from sqlalchemy.orm import Session

from app.config import settings
from app.models.analysis import Analysis
from app.schemas.analysis import AnalysisResponse, DiagnosticInfo
from app.vision.pipeline import analyze_coconut, default_counter
from app.services.storage import get_storage_provider

logger = logging.getLogger(__name__)


def process_coconut_analysis(
    image_bytes: bytes,
    original_filename: str,
    db: Optional[Session] = None,
) -> AnalysisResponse:
    """
    Executes end-to-end coconut fibre analysis:
    1. Runs computer vision algorithm with precise timing.
    2. Conditionally stores uploaded image based on configuration.
    3. Persists analysis record in the database.
    4. Formats and returns client response.
    """
    start_time = time.perf_counter()

    # Run computer vision pipeline
    result = analyze_coconut(image_bytes, counter=default_counter)

    elapsed_ms = int((time.perf_counter() - start_time) * 1000)

    # Optional image storage
    image_path = None
    if settings.STORE_ANALYSIS_IMAGES:
        storage = get_storage_provider()
        ext = original_filename.rsplit(".", 1)[-1] if "." in original_filename else "jpg"
        image_path = storage.save_image(image_bytes, extension=ext)

    # Database persistence
    analysis_record_id = None
    if db is not None:
        try:
            record = Analysis(
                image_path=image_path,
                estimated_count=result.estimated_count,
                confidence=float(result.confidence),
                status=result.status,
                algorithm_version=settings.ALGORITHM_VERSION,
                processing_time_ms=elapsed_ms,
            )
            db.add(record)
            db.commit()
            db.refresh(record)
            analysis_record_id = record.id
        except Exception as e:
            logger.error(f"Failed to record analysis to database: {e}")
            db.rollback()

    diagnostics = None
    if result.diagnostics:
        diagnostics = DiagnosticInfo(
            image_width=result.diagnostics.get("image_width", 0),
            image_height=result.diagnostics.get("image_height", 0),
            sharpness_score=result.diagnostics.get("sharpness_score", 0.0),
            edge_density=result.diagnostics.get("edge_density", 0.0),
            candidate_filaments=result.diagnostics.get("candidate_filaments", 0),
            husk_area_ratio=result.diagnostics.get("husk_area_ratio", 0.0),
            fibre_mask_preview=result.diagnostics.get("fibre_mask_preview"),
            hair_verdict=result.diagnostics.get("hair_verdict"),
        )

    is_success = (result.status == "estimated")

    return AnalysisResponse(
        success=is_success,
        estimated_count=result.estimated_count,
        confidence=result.confidence,
        status=result.status,
        processing_time_ms=elapsed_ms,
        message=result.message,
        diagnostics=diagnostics,
        analysis_id=analysis_record_id,
    )
