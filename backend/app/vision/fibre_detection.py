import base64
import cv2
import numpy as np
from skimage.morphology import skeletonize
from typing import Dict, Any, Tuple, List


def detect_fibrous_ridges(gray: np.ndarray) -> np.ndarray:
    """
    Isolate fine curvilinear ridge structures using combined
    Top-Hat/Black-Hat transforms, adaptive thresholding, and Canny edges.
    """
    # 1. Morphological Top-Hat & Black-Hat to extract thin bright and dark ridges
    kernel_ridge = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (5, 5))
    top_hat = cv2.morphologyEx(gray, cv2.MORPH_TOPHAT, kernel_ridge)
    black_hat = cv2.morphologyEx(gray, cv2.MORPH_BLACKHAT, kernel_ridge)
    ridge_features = cv2.add(top_hat, black_hat)

    # 2. Adaptive thresholding on filtered image to catch high-contrast local fibre edges
    adaptive_thresh = cv2.adaptiveThreshold(
        gray,
        255,
        cv2.ADAPTIVE_THRESH_GAUSSIAN_C,
        cv2.THRESH_BINARY_INV,
        blockSize=15,
        C=3,
    )

    # 3. Canny edge detection
    # Compute median intensity to derive automatic Canny thresholds
    v = np.median(gray)
    sigma = 0.33
    lower_thresh = int(max(25, (1.0 - sigma) * v))
    upper_thresh = int(min(200, (1.0 + sigma) * v))
    canny_edges = cv2.Canny(gray, lower_thresh, upper_thresh)

    # 4. Combine ridge intensity with adaptive threshold and edge detection
    _, ridge_binary = cv2.threshold(ridge_features, 15, 255, cv2.THRESH_BINARY)
    combined = cv2.bitwise_or(adaptive_thresh, canny_edges)
    combined = cv2.bitwise_or(combined, ridge_binary)

    # 5. Clean isolated noise pixels with small morphological opening
    kernel_clean = cv2.getStructuringElement(cv2.MORPH_RECT, (2, 2))
    cleaned = cv2.morphologyEx(combined, cv2.MORPH_OPEN, kernel_clean)

    return cleaned


def analyze_skeleton_network(
    skeleton: np.ndarray, min_strand_length: int = 10, avg_strand_length: float = 35.0
) -> Tuple[int, int, float, List[int]]:
    """
    Analyzes skeletonized fibre network to estimate individual visible fibres.
    Computes strand segments, junction branch points, and total curvilinear length.
    """
    # Skeleton is boolean array (True for fibre pixel)
    skel_uint8 = (skeleton.astype(np.uint8)) * 255
    if np.count_nonzero(skel_uint8) == 0:
        return 0, 0, 0.0, []

    # Count neighbors using 3x3 convolution to find endpoints and branch junctions
    kernel_neighbors = np.array(
        [[1, 1, 1],
         [1, 0, 1],
         [1, 1, 1]], dtype=np.uint8
    )
    neighbor_count = cv2.filter2D(skeleton.astype(np.uint8), -1, kernel_neighbors)
    neighbor_count = neighbor_count * skeleton.astype(np.uint8)

    # Endpoints have exactly 1 neighbor; branch points have >= 3 neighbors
    endpoints = np.count_nonzero(neighbor_count == 1)
    branch_points = np.count_nonzero(neighbor_count >= 3)

    # Connected component analysis on skeleton
    num_labels, labels, stats, centroids = cv2.connectedComponentsWithStats(
        skel_uint8, connectivity=8
    )

    component_lengths = []
    estimated_fibres = 0
    total_fibre_pixels = 0

    for i in range(1, num_labels):
        pixel_count = stats[i, cv2.CC_STAT_AREA]
        if pixel_count < min_strand_length:
            continue

        total_fibre_pixels += pixel_count
        component_lengths.append(pixel_count)

        # For a single strand without branches, length / avg_strand_length ~ 1
        # For overlapping clusters with multiple branches, decompose cluster into strands
        estimated_in_component = max(1, int(round(pixel_count / avg_strand_length)))
        estimated_fibres += estimated_in_component

    # Adjust for branch crossings (each crossing branch typically represents 2 intersecting fibres)
    crossing_fibres = int(branch_points * 0.4)
    total_estimated = estimated_fibres + crossing_fibres

    return total_estimated, branch_points, float(total_fibre_pixels), component_lengths


def detect_coconut_fibres(
    filtered_gray: np.ndarray,
    scale: float = 1.0,
    generate_preview: bool = True,
) -> Tuple[int, Dict[str, Any], np.ndarray]:
    """
    Performs full fibre detection and quantification.
    Returns (estimated_count, detection_stats, skeleton_image).
    """
    # 1. Detect candidate ridge/filament binary mask
    fibre_mask = detect_fibrous_ridges(filtered_gray)

    # 2. Skeletonize to 1-pixel wide centerlines
    bool_mask = fibre_mask > 0
    skeleton = skeletonize(bool_mask)

    # 3. Analyze skeleton network
    # Scale strand length expectations according to normalized scale
    adjusted_avg_length = max(20.0, 35.0 * scale)
    min_length = max(6, int(10 * scale))

    estimated_count, branch_points, total_length, lengths = analyze_skeleton_network(
        skeleton, min_strand_length=min_length, avg_strand_length=adjusted_avg_length
    )

    # 4. Compute texture & density statistics
    total_image_pixels = filtered_gray.shape[0] * filtered_gray.shape[1]
    edge_density = float(np.count_nonzero(fibre_mask)) / float(total_image_pixels)
    skeleton_density = float(total_length) / float(total_image_pixels)

    preview_base64 = None
    if generate_preview:
        # Create an attractive neon-gold on dark overlay preview of detected fibres
        h, w = filtered_gray.shape
        preview_bgr = np.zeros((h, w, 3), dtype=np.uint8)
        # Dilate skeleton slightly for crisp visibility in frontend
        skel_display = cv2.dilate((skeleton.astype(np.uint8)) * 255, np.ones((2, 2), np.uint8))
        # Warm golden amber for detected hairs: BGR (30, 180, 245)
        preview_bgr[skel_display > 0] = [30, 180, 245]
        # Dim background image
        bg_dim = cv2.cvtColor(cv2.addWeighted(filtered_gray, 0.4, np.zeros_like(filtered_gray), 0, 0), cv2.COLOR_GRAY2BGR)
        overlay = cv2.add(bg_dim, preview_bgr)

        # Encode to web-friendly JPEG
        success, encoded = cv2.imencode(".jpg", overlay, [cv2.IMWRITE_JPEG_QUALITY, 85])
        if success:
            preview_base64 = f"data:image/jpeg;base64,{base64.b64encode(encoded).decode('utf-8')}"

    detection_stats = {
        "candidate_filaments": len(lengths),
        "total_fibre_pixels": total_length,
        "branch_junctions": branch_points,
        "edge_density": round(edge_density, 5),
        "skeleton_density": round(skeleton_density, 5),
        "preview_base64": preview_base64,
        "raw_cluster_count": len(lengths),
    }

    return estimated_count, detection_stats, (skeleton.astype(np.uint8) * 255)
