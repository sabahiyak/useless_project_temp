import logging
from typing import List
from fastapi import APIRouter, UploadFile, File, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import desc

from app.config import settings
from app.database import get_db
from app.models.analysis import Analysis
from app.schemas.analysis import AnalysisResponse, AnalysisHistoryItem, HealthResponse
from app.services.counter_service import process_coconut_analysis
from app.vision.preprocessing import PreprocessingError

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api", tags=["Coconut Hair Counter"])

ALLOWED_MIME_TYPES = {
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
}

ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp"}


@router.get("/health", response_model=HealthResponse)
def health_check():
    """Service health and operational status check."""
    return HealthResponse(
        status="ok",
        version=settings.ALGORITHM_VERSION,
        app_name=settings.PROJECT_NAME,
    )


@router.post("/analyze", response_model=AnalysisResponse)
async def analyze_image(
    file: UploadFile = File(..., description="Coconut image file (JPG, PNG, WEBP)"),
    db: Session = Depends(get_db),
):
    """
    Analyzes an uploaded coconut image to estimate visible fibres using computer vision.
    Validates file format, size, and integrity.
    Returns honest confidence percentage and low-confidence warnings when fibres are unreliable.
    """
    # 1. Validate MIME type
    content_type = (file.content_type or "").lower()
    filename = (file.filename or "uploaded_image.jpg").lower()

    # Check extension
    has_valid_ext = any(filename.endswith(ext) for ext in ALLOWED_EXTENSIONS)
    if content_type not in ALLOWED_MIME_TYPES and not has_valid_ext:
        raise HTTPException(
            status_code=status.HTTP_415_UNSUPPORTED_MEDIA_TYPE,
            detail=(
                f"Unsupported file format '{content_type or 'unknown'}'. "
                "Please upload a valid JPG, PNG, or WEBP image."
            ),
        )

    # 2. Read and validate payload size
    try:
        contents = await file.read()
    except Exception as e:
        logger.error(f"Error reading uploaded file: {e}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Failed to read the uploaded file. Please try again.",
        )

    max_bytes = settings.MAX_UPLOAD_SIZE_MB * 1024 * 1024
    if len(contents) > max_bytes:
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail=f"Image size exceeds the maximum limit of {settings.MAX_UPLOAD_SIZE_MB}MB.",
        )

    if len(contents) == 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="The uploaded file is empty. Please select a valid photo.",
        )

    # 3. Execute Computer Vision analysis
    try:
        response = process_coconut_analysis(
            image_bytes=contents,
            original_filename=file.filename or "coconut.jpg",
            db=db,
        )
        return response
    except PreprocessingError as pe:
        logger.warning(f"Preprocessing error on user upload: {pe}")
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=f"Could not parse image: {str(pe)}",
        )
    except Exception as e:
        logger.exception(f"Unexpected error in coconut analysis pipeline: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred while analyzing the image. Please try another photo.",
        )


@router.get("/analyses", response_model=List[AnalysisHistoryItem])
def get_recent_analyses(
    limit: int = 10,
    db: Session = Depends(get_db),
):
    """Retrieve recent analysis runs (if enabled)."""
    try:
        records = (
            db.query(Analysis)
            .order_by(desc(Analysis.created_at))
            .limit(min(limit, 50))
            .all()
        )
        return [
            AnalysisHistoryItem(
                id=r.id,
                image_path=r.image_path,
                estimated_count=r.estimated_count,
                confidence=r.confidence,
                status=r.status,
                algorithm_version=r.algorithm_version,
                processing_time_ms=r.processing_time_ms,
                created_at=r.created_at.isoformat() if r.created_at else None,
            )
            for r in records
        ]
    except Exception as e:
        logger.error(f"Error fetching analyses: {e}")
        return []
