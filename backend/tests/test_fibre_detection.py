import pytest
import numpy as np
import cv2

from app.vision.fibre_detection import (
    detect_fibrous_ridges,
    analyze_skeleton_network,
    detect_coconut_fibres,
)


def create_synthetic_fibre_image(width=300, height=300, num_lines=30):
    """Generate an image with distinct coconut-like filament lines."""
    img = np.full((height, width), 80, dtype=np.uint8)
    np.random.seed(42)
    for _ in range(num_lines):
        pt1 = (np.random.randint(20, width - 20), np.random.randint(20, height - 20))
        angle = np.random.uniform(0, np.pi)
        length = np.random.randint(30, 90)
        pt2 = (
            int(pt1[0] + length * np.cos(angle)),
            int(pt1[1] + length * np.sin(angle)),
        )
        thickness = np.random.choice([1, 2])
        color = int(np.random.randint(180, 255))
        cv2.line(img, pt1, pt2, color, thickness)
    return img


def test_detect_fibrous_ridges_blank_image():
    blank = np.full((100, 100), 128, dtype=np.uint8)
    edges = detect_fibrous_ridges(blank)
    # Blank image should have virtually zero edge response
    assert np.count_nonzero(edges) == 0


def test_detect_fibrous_ridges_on_lines():
    synthetic = create_synthetic_fibre_image()
    edges = detect_fibrous_ridges(synthetic)
    assert np.count_nonzero(edges) > 100


def test_analyze_skeleton_network():
    # Create simple cross skeleton
    skeleton = np.zeros((100, 100), dtype=bool)
    skeleton[50, 20:80] = True  # horizontal line, length 60
    skeleton[20:80, 50] = True  # vertical line, length 60

    count, branches, total_px, lengths = analyze_skeleton_network(
        skeleton, min_strand_length=5, avg_strand_length=30.0
    )
    assert count > 0
    assert branches >= 1
    assert total_px > 50


def test_detect_coconut_fibres_synthetic():
    synthetic = create_synthetic_fibre_image(300, 300, num_lines=40)
    count, stats, skel = detect_coconut_fibres(synthetic, scale=1.0)
    assert count > 15
    assert stats["candidate_filaments"] > 10
    assert stats["edge_density"] > 0.01
    assert stats["preview_base64"] is not None
