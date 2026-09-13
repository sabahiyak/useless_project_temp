import logging
from typing import Optional, Dict, Any
import numpy as np

from app.config import settings
from app.vision.base import FibreCounter, AnalysisResult
from app.vision.preprocessing import (
    decode_image_bytes,
    preprocess_coconut_image,
    PreprocessingError,
)
from app.vision.fibre_detection import detect_coconut_fibres
from app.vision.confidence import calculate_confidence_score

logger = logging.getLogger(__name__)


def derive_hair_verdict(estimated_count: Optional[int], confidence: int) -> str:
    """Fun, playful coconut hair verdict for 'Is My Coco Losing Hair??'"""
    if estimated_count is None or confidence < 50:
        return "Uncertain Mane (Needs clearer photo!)"
    if estimated_count >= 350:
        return "Luscious Wild Afro (100% Not Balding! 🥥✨)"
    elif estimated_count >= 200:
        return "Healthy Thick Strands (Coco has great hair!)"
    elif estimated_count >= 90:
        return "Moderate Hair Day (Slightly trimmed or weathered)"
    elif estimated_count >= 30:
        return "Thinning Coco (Early stages of coconut pattern baldness 👨‍🦲)"
    else:
        return "Smooth & Nearly Bald Coco! 🏖️"


class ClassicalFibreCounter(FibreCounter):
    """
    Classical Computer Vision implementation of coconut visible fibre estimation.
    Uses CLAHE contrast normalization, bilateral smoothing, morphological ridge filtering,
    adaptive Canny thresholding, skeletonization, and connected component filament quantification.
    """

    @property
    def name(self) -> str:
        return f"ClassicalFibreCounter-v{settings.ALGORITHM_VERSION}"

    def analyze(self, image_bgr: np.ndarray) -> AnalysisResult:
        h_orig, w_orig = image_bgr.shape[:2]

        # 1. Preprocess image
        resized_bgr, enhanced_gray, filtered_gray, scale = preprocess_coconut_image(
            image_bgr, max_dim=1024
        )

        # 2. Detect fibres & generate skeleton
        estimated_count, detection_stats, skeleton = detect_coconut_fibres(
            filtered_gray, scale=scale, generate_preview=True
        )

        # 3. Calculate honest confidence score
        confidence, tier, metrics = calculate_confidence_score(
            filtered_gray, detection_stats, (h_orig, w_orig)
        )

        # 4. Handle Low Confidence Gate (< 50%)
        if confidence < settings.CONFIDENCE_MEDIUM_THRESHOLD:
            # Low confidence: Do NOT hallucinate an estimate!
            message = (
                "Unable to reliably detect coconut fibres. "
                "The image does not contain enough clear fibre detail, contrast, or lighting. "
                "Please upload a closer, sharper photo with good lighting."
            )
            diagnostics = {
                "image_width": w_orig,
                "image_height": h_orig,
                "sharpness_score": metrics.get("sharpness", 0.0),
                "edge_density": metrics.get("edge_density", 0.0),
                "candidate_filaments": detection_stats.get("candidate_filaments", 0),
                "husk_area_ratio": round(detection_stats.get("edge_density", 0.0) * 2.5, 3),
                "hair_verdict": derive_hair_verdict(None, confidence),
                "tier": tier,
                "metrics": metrics,
                "fibre_mask_preview": detection_stats.get("preview_base64"),
            }
            return AnalysisResult(
                estimated_count=None,
                confidence=confidence,
                status="low_confidence",
                message=message,
                diagnostics=diagnostics,
            )

        # 5. Sufficient Confidence Result (>= 50%)
        hair_verdict = derive_hair_verdict(estimated_count, confidence)
        message = (
            "Estimated from visible fibre patterns. "
            "Overlapping, hidden, broken, or blurred fibres may not be detected."
        )
        diagnostics = {
            "image_width": w_orig,
            "image_height": h_orig,
            "sharpness_score": metrics.get("sharpness", 0.0),
            "edge_density": metrics.get("edge_density", 0.0),
            "candidate_filaments": detection_stats.get("candidate_filaments", 0),
            "husk_area_ratio": min(1.0, round(detection_stats.get("edge_density", 0.0) * 2.5, 3)),
            "hair_verdict": hair_verdict,
            "tier": tier,
            "metrics": metrics,
            "fibre_mask_preview": detection_stats.get("preview_base64"),
        }

        return AnalysisResult(
            estimated_count=estimated_count,
            confidence=confidence,
            status="estimated",
            message=message,
            diagnostics=diagnostics,
        )


class MLFibreCounter(FibreCounter):
    """
    Extensibility Placeholder for future Deep Learning / Machine Learning models
    (e.g., YOLOv8-seg, Mask2Former, or custom fine-tuned coconut fibre segmentation).
    """

    @property
    def name(self) -> str:
        return "MLFibreCounter-YOLOv8-experimental"

    def analyze(self, image_bgr: np.ndarray) -> AnalysisResult:
        raise NotImplementedError(
            "ML model support is architected and ready for future model weights. "
            "Set COUNTER_ENGINE=classical to use the production computer vision pipeline."
        )


# Global default counter instance
default_counter = ClassicalFibreCounter()


def analyze_coconut(
    image_bytes: bytes, counter: Optional[FibreCounter] = None
) -> AnalysisResult:
    """
    High-level entry point: decodes image bytes and runs the fibre counter pipeline.
    """
    if counter is None:
        counter = default_counter

    image_bgr = decode_image_bytes(image_bytes)
    return counter.analyze(image_bgr)
