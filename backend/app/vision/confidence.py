import cv2
import numpy as np
from typing import Dict, Any, Tuple
from app.config import settings


def compute_sharpness(gray: np.ndarray) -> float:
    """
    Computes focus / sharpness using the variance of the Laplacian.
    Higher values indicate sharp edges; very low values indicate motion or defocus blur.
    """
    laplacian = cv2.Laplacian(gray, cv2.CV_64F)
    return float(laplacian.var())


def compute_contrast_and_lighting(gray: np.ndarray) -> Tuple[float, float, float]:
    """
    Measures contrast (std dev), mean brightness, and dynamic range.
    """
    mean_val = float(np.mean(gray))
    std_val = float(np.std(gray))
    p5, p95 = np.percentile(gray, (5, 95))
    dynamic_range = float(p95 - p5)
    return std_val, mean_val, dynamic_range


def calculate_confidence_score(
    gray: np.ndarray,
    detection_stats: Dict[str, Any],
    original_dims: Tuple[int, int],
) -> Tuple[int, str, Dict[str, Any]]:
    """
    Calculates an honest confidence score (0-100) based on measurable image features:
    1. Sharpness / Blur (Laplacian variance)
    2. Contrast & Illumination balance
    3. Fibre edge density
    4. Candidate filament structure count
    5. Resolution adequacy

    Returns:
    (confidence_score: int, confidence_tier: str, metric_breakdown: dict)
    """
    h_orig, w_orig = original_dims
    sharpness = compute_sharpness(gray)
    contrast_std, mean_val, dynamic_range = compute_contrast_and_lighting(gray)

    candidate_filaments = detection_stats.get("candidate_filaments", 0)
    edge_density = detection_stats.get("edge_density", 0.0)
    skeleton_density = detection_stats.get("skeleton_density", 0.0)

    # 1. Sharpness Factor (0.0 to 1.0)
    # Thresholds: < 35 severely blurred, 80 reasonable, 180+ sharp
    if sharpness < 15.0:
        sharpness_factor = 0.05
    elif sharpness < 40.0:
        sharpness_factor = 0.30
    elif sharpness < 100.0:
        sharpness_factor = 0.65
    elif sharpness < 200.0:
        sharpness_factor = 0.85
    else:
        sharpness_factor = 1.00

    # 2. Lighting / Contrast Factor (0.0 to 1.0)
    # Too dark (mean < 25), washed out (mean > 230), or flat contrast (std < 15)
    if contrast_std < 12.0 or dynamic_range < 30.0:
        contrast_factor = 0.10
    elif contrast_std < 25.0 or mean_val < 30.0 or mean_val > 225.0:
        contrast_factor = 0.50
    elif contrast_std < 40.0:
        contrast_factor = 0.80
    else:
        contrast_factor = 1.00

    # 3. Fibre Density Plausibility Factor (0.0 to 1.0)
    # True coconut fibre texture has edge_density typically between 0.015 and 0.40
    if edge_density < 0.005:  # Smooth object, wall, skin, blank surface
        density_factor = 0.05
    elif edge_density < 0.015:
        density_factor = 0.35
    elif 0.015 <= edge_density <= 0.35:
        density_factor = 1.00
    elif edge_density <= 0.55:
        density_factor = 0.70  # Densely cluttered or noisy
    else:
        density_factor = 0.15  # Extreme high-frequency static / noise

    # 4. Filament Evidence Factor (0.0 to 1.0)
    # Must detect distinct elongated filament candidate clusters
    if candidate_filaments == 0:
        filament_factor = 0.0
    elif candidate_filaments < 8:
        filament_factor = 0.20
    elif candidate_filaments < 25:
        filament_factor = 0.55
    elif candidate_filaments < 60:
        filament_factor = 0.85
    else:
        filament_factor = 1.00

    # 5. Resolution Adequacy Factor (0.0 to 1.0)
    min_dim = min(h_orig, w_orig)
    if min_dim < 150:
        res_factor = 0.20
    elif min_dim < 350:
        res_factor = 0.60
    elif min_dim < 600:
        res_factor = 0.85
    else:
        res_factor = 1.00

    # Composite weighted confidence
    # If any critical factor is near-zero (e.g. no filaments or extreme blur), confidence collapses
    geometric_penalty = 1.0
    if sharpness_factor < 0.2:
        geometric_penalty *= 0.4
    if density_factor < 0.2:
        geometric_penalty *= 0.2
    if filament_factor < 0.2:
        geometric_penalty *= 0.2

    weighted_score = (
        sharpness_factor * 0.30
        + contrast_factor * 0.15
        + density_factor * 0.25
        + filament_factor * 0.20
        + res_factor * 0.10
    ) * geometric_penalty

    # Convert to 0-100 integer
    raw_confidence = int(round(weighted_score * 100))
    confidence = max(0, min(100, raw_confidence))

    # Determine tier
    if confidence >= settings.CONFIDENCE_HIGH_THRESHOLD:
        tier = "high"
    elif confidence >= settings.CONFIDENCE_MEDIUM_THRESHOLD:
        tier = "medium"
    else:
        tier = "low"

    metrics = {
        "sharpness": round(sharpness, 2),
        "sharpness_factor": round(sharpness_factor, 2),
        "contrast_std": round(contrast_std, 2),
        "mean_intensity": round(mean_val, 2),
        "contrast_factor": round(contrast_factor, 2),
        "edge_density": round(edge_density, 4),
        "density_factor": round(density_factor, 2),
        "candidate_filaments": candidate_filaments,
        "filament_factor": round(filament_factor, 2),
        "resolution": f"{w_orig}x{h_orig}",
        "tier": tier,
    }

    return confidence, tier, metrics
