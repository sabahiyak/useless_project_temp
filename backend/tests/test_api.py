import io
import pytest
from fastapi.testclient import TestClient
from PIL import Image
import numpy as np

from app.main import app

client = TestClient(app)


def test_health_endpoint():
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ok"
    assert "version" in data


def test_root_endpoint():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json()["status"] == "online"


def test_analyze_unsupported_file_type():
    file_content = b"this is just plain text"
    files = {"file": ("test.txt", file_content, "text/plain")}
    response = client.post("/api/analyze", files=files)
    assert response.status_code == 415


def test_analyze_empty_file():
    files = {"file": ("empty.jpg", b"", "image/jpeg")}
    response = client.post("/api/analyze", files=files)
    assert response.status_code == 400


def test_analyze_corrupt_file():
    files = {"file": ("corrupt.jpg", b"corrupted random data not image", "image/jpeg")}
    response = client.post("/api/analyze", files=files)
    assert response.status_code == 422


def test_analyze_valid_image():
    # Create simple test image
    img = Image.new("RGB", (300, 300), color=(120, 80, 50))
    buf = io.BytesIO()
    img.save(buf, format="JPEG")
    files = {"file": ("coconut.jpg", buf.getvalue(), "image/jpeg")}

    response = client.post("/api/analyze", files=files)
    assert response.status_code == 200
    data = response.json()
    assert "confidence" in data
    assert "status" in data
    assert "processing_time_ms" in data
    assert "message" in data


def test_analyses_history():
    response = client.get("/api/analyses")
    assert response.status_code == 200
    assert isinstance(response.json(), list)
