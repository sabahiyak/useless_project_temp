import io
import pytest
import numpy as np
import cv2
from PIL import Image

from app.vision.pipeline import analyze_coconut, ClassicalFibreCounter
from tests.test_fibre_detection import create_synthetic_fibre_image


def test_pipeline_with_fibrous_image():
    synth_gray = create_synthetic_fibre_image(400, 400, num_lines=45)
    synth_bgr = cv2.cvtColor(synth_gray, cv2.COLOR_GRAY2BGR)

    buf = io.BytesIO()
    Image.fromarray(cv2.cvtColor(synth_bgr, cv2.COLOR_BGR2RGB)).save(buf, format="JPEG")
    raw_bytes = buf.getvalue()

    result = analyze_coconut(raw_bytes)
    assert result is not None
    assert result.confidence >= 50
    assert result.status == "estimated"
    assert result.estimated_count is not None
    assert result.estimated_count > 0


def test_pipeline_with_blank_image_triggers_low_confidence():
    # Completely smooth blank grey image (no fibres)
    blank = np.full((300, 300, 3), 120, dtype=np.uint8)
    buf = io.BytesIO()
    Image.fromarray(blank).save(buf, format="PNG")
    raw_bytes = buf.getvalue()

    result = analyze_coconut(raw_bytes)
    assert result.status == "low_confidence"
    assert result.estimated_count is None
    assert result.confidence < 50
    assert "Unable to reliably detect" in result.message
