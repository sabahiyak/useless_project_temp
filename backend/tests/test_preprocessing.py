import io
import pytest
import numpy as np
import cv2
from PIL import Image

from app.vision.preprocessing import (
    decode_image_bytes,
    resize_preserve_aspect_ratio,
    normalize_lighting,
    reduce_noise,
    preprocess_coconut_image,
    PreprocessingError,
)


def create_test_image_bytes(width=400, height=300, color=(100, 70, 50)):
    img = Image.new("RGB", (width, height), color=color)
    buf = io.BytesIO()
    img.save(buf, format="JPEG")
    return buf.getvalue()


def test_decode_valid_image():
    data = create_test_image_bytes(200, 150)
    arr = decode_image_bytes(data)
    assert arr is not None
    assert arr.shape == (150, 200, 3)


def test_decode_empty_bytes_raises():
    with pytest.raises(PreprocessingError):
        decode_image_bytes(b"")


def test_decode_corrupt_bytes_raises():
    with pytest.raises(PreprocessingError):
        decode_image_bytes(b"not an image file at all")


def test_resize_preserve_aspect_ratio_large():
    img = np.zeros((1600, 1200, 3), dtype=np.uint8)
    resized, scale = resize_preserve_aspect_ratio(img, max_dim=1024)
    assert max(resized.shape[:2]) == 1024
    assert resized.shape[0] == 1024
    assert resized.shape[1] == 768
    assert scale == pytest.approx(1024 / 1600, 0.01)


def test_resize_preserve_aspect_ratio_small():
    img = np.zeros((300, 400, 3), dtype=np.uint8)
    resized, scale = resize_preserve_aspect_ratio(img, max_dim=1024)
    assert resized.shape == (300, 400, 3)
    assert scale == 1.0


def test_normalize_lighting_clahe():
    gray = np.full((100, 100), 128, dtype=np.uint8)
    enhanced = normalize_lighting(gray)
    assert enhanced.shape == (100, 100)
    assert enhanced.dtype == np.uint8


def test_preprocess_coconut_image():
    bgr = np.zeros((600, 800, 3), dtype=np.uint8)
    resized_bgr, enhanced_gray, filtered_gray, scale = preprocess_coconut_image(bgr, max_dim=500)
    assert max(resized_bgr.shape[:2]) == 500
    assert enhanced_gray.shape == resized_bgr.shape[:2]
    assert filtered_gray.shape == resized_bgr.shape[:2]
