import pytest
import numpy as np
import cv2

from app.vision.confidence import (
    compute_sharpness,
    compute_contrast_and_lighting,
    calculate_confidence_score,
)
from tests.test_fibre_detection import create_synthetic_fibre_image


def test_sharpness_high_vs_low():
    sharp_img = create_synthetic_fibre_image(200, 200, num_lines=20)
    blurred_img = cv2.GaussianBlur(sharp_img, (25, 25), 10)

    sharp_val = compute_sharpness(sharp_img)
    blurred_val = compute_sharpness(blurred_img)

    assert sharp_val > blurred_val
    assert blurred_val < 30.0  # Heavily blurred should be below threshold


def test_confidence_on_blank_image_returns_low():
    blank = np.full((300, 300), 128, dtype=np.uint8)
    stats = {
        "candidate_filaments": 0,
        "edge_density": 0.0,
        "skeleton_density": 0.0,
    }
    confidence, tier, metrics = calculate_confidence_score(blank, stats, (300, 300))
    # Must be low confidence (< 50)
    assert confidence < 50
    assert tier == "low"


def test_confidence_on_sharp_fibrous_image():
    synthetic = create_synthetic_fibre_image(400, 400, num_lines=50)
    stats = {
        "candidate_filaments": 45,
        "edge_density": 0.06,
        "skeleton_density": 0.03,
    }
    confidence, tier, metrics = calculate_confidence_score(synthetic, stats, (400, 400))
    # Should be at least medium or high confidence
    assert confidence >= 50
    assert tier in ("medium", "high")
