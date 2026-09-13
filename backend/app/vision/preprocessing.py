import io
import cv2
import numpy as np
from PIL import Image
from typing import Tuple, Optional


class PreprocessingError(Exception):
    pass


def decode_image_bytes(image_bytes: bytes) -> np.ndarray:
    """
    Safely decode raw image bytes into an OpenCV BGR numpy array.
    Validates magic bytes and verifies image integrity using Pillow before decoding.
    """
    if not image_bytes:
        raise PreprocessingError("Image file is empty.")

    # Validate image using Pillow first to catch corrupted data / zip bombs
    try:
        pil_img = Image.open(io.BytesIO(image_bytes))
        pil_img.verify()
    except Exception as e:
        raise PreprocessingError(f"Corrupted or invalid image file: {str(e)}")

    # Re-open after verify() (verify exhausts file stream)
    try:
        pil_img = Image.open(io.BytesIO(image_bytes))
        # Handle RGBA / Palette images
        if pil_img.mode in ("RGBA", "LA") or (pil_img.mode == "P" and "transparency" in pil_img.info):
            pil_img = pil_img.convert("RGB")
        bgr_array = cv2.cvtColor(np.array(pil_img), cv2.COLOR_RGB2BGR)
    except Exception as e:
        raise PreprocessingError(f"Failed to process image pixels: {str(e)}")

    if bgr_array is None or bgr_array.size == 0:
        raise PreprocessingError("Could not decode image pixel buffer.")

    return bgr_array


def resize_preserve_aspect_ratio(
    image: np.ndarray, max_dim: int = 1024
) -> Tuple[np.ndarray, float]:
    """
    Resize image so that its longest side is at most `max_dim`,
    preserving aspect ratio. Returns (resized_image, scale_factor).
    """
    height, width = image.shape[:2]
    longest = max(height, width)

    if longest <= max_dim:
        return image.copy(), 1.0

    scale = max_dim / float(longest)
    new_width = int(round(width * scale))
    new_height = int(round(height * scale))

    resized = cv2.resize(image, (new_width, new_height), interpolation=cv2.INTER_AREA)
    return resized, scale


def normalize_lighting(gray: np.ndarray) -> np.ndarray:
    """
    Applies Contrast Limited Adaptive Histogram Equalization (CLAHE)
    to locally balance uneven lighting across curved coconut husks.
    """
    clahe = cv2.createCLAHE(clipLimit=2.5, tileGridSize=(8, 8))
    return clahe.apply(gray)


def reduce_noise(gray: np.ndarray) -> np.ndarray:
    """
    Applies bilateral filtering to smooth high-frequency sensor noise
    while strictly preserving sharp linear ridge boundaries of fibres.
    """
    return cv2.bilateralFilter(gray, d=5, sigmaColor=40, sigmaSpace=40)


def preprocess_coconut_image(
    image_bgr: np.ndarray, max_dim: int = 1024
) -> Tuple[np.ndarray, np.ndarray, np.ndarray, float]:
    """
    Full preprocessing pipeline:
    Returns (resized_bgr, enhanced_gray, filtered_gray, scale_factor).
    """
    if image_bgr is None or image_bgr.size == 0:
        raise PreprocessingError("Invalid image array provided to preprocessor.")

    resized_bgr, scale = resize_preserve_aspect_ratio(image_bgr, max_dim=max_dim)
    gray = cv2.cvtColor(resized_bgr, cv2.COLOR_BGR2GRAY)
    enhanced_gray = normalize_lighting(gray)
    filtered_gray = reduce_noise(enhanced_gray)

    return resized_bgr, enhanced_gray, filtered_gray, scale
