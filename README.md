# 🥥 Is My Coco Losing Hair?? (Coconut Hair Counter)

<div align="center">

![Coconut Hair Counter Banner](https://img.shields.io/badge/%F0%9F%A5%A5_Coconut-Hair_Counter-6F4E37?style=for-the-badge)
![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)
![OpenCV](https://img.shields.io/badge/OpenCV-5C3EE8?style=for-the-badge&logo=opencv&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js_15-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)

<p align="center">
  <strong>An AI-assisted Computer Vision web application for estimating visible coconut fibres and diagnosing your coconut's hair density.</strong>
</p>

</div>

---

## Basic Details

### Team Name: **CocoLocks Research & Co.**
### Project Title: **Is My Coco Losing Hair?? 🥥 (Coconut Hair Counter)**

### Project Description
An end-to-end full-stack application that applies classical computer vision (morphological ridge filtering, adaptive thresholding, and skeleton graph thinning) to analyze the fibrous husk of a coconut. It computes an **estimated visible fibre count** and an honest **confidence score**, diagnosing whether your coconut is sporting a luscious wild afro or suffering from coconut pattern baldness.

### The Problem (that doesn't exist)
Billions of coconuts around the globe wake up every single morning wondering if they are balding, shedding excessively, or losing their natural rugged texture. Until now, coconut owners had no objective, high-throughput way to audit their coconut's hair count and monitor follicular loss.

### The Solution (that nobody asked for)
**"Is My Coco Losing Hair??"** provides rapid, image-processing estimates of visible coconut hair strands. More importantly, it is engineered with **scientific integrity**: if a photo is blurry, dark, or lacks measurable fibrous texture, it honestly reports **"Unable to reliably estimate"** rather than hallucinating false precision.

---

## 1. Project Overview & Features

- 📸 **Drag & Drop Upload:** Accepts JPEG, PNG, and WEBP images up to 10 MB.
- 🧪 **Sample Test Coconut Palette:** One-click demo images (Hairy Mature Coconut, Smooth Young Green Coconut, Blurry Low-Light Coconut) to test all confidence tiers instantly.
- 🔬 **Rigorous Classical CV Pipeline:** Multi-scale Top-Hat / Black-Hat ridge enhancement, bilateral filtering, CLAHE contrast balance, adaptive Canny thresholding, and skeleton graph thinning.
- 🛡️ **Honest Confidence Engine:** Evaluates Laplacian variance (sharpness), edge density, aspect-ratio coherence, and signal-to-noise ratio. Scores below 50% cleanly trigger a low-confidence warning with zero invented counts.
- 👁️ **Interactive Diagnostic Mask:** Toggle a live visual overlay of detected fibre skeletons and edge gradients.
- 🗄️ **Full-Stack Persistence:** PostgreSQL analysis records with SQLAlchemy ORM, Alembic migrations, and automatic SQLite fallback for zero-config local runs.
- 🐳 **Complete Docker Compose Stack:** One command brings up frontend, backend, and PostgreSQL with robust health checks.

> [!IMPORTANT]
> **Computer Vision Disclaimer:**
> This result is an image-processing estimate. It does not represent an exact biological count. Fibres that overlap, are hidden beneath husk layers, damaged, blurred, or poorly illuminated may not be detected.

---

## 2. Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Next.js Frontend (React 19)              │
│       Tailwind CSS • Responsive • Lucide Icons • Vitest     │
└──────────────────────────────┬──────────────────────────────┘
                               │ Multipart Upload / JSON
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                    FastAPI Backend (Python 3.12+)           │
│  ┌───────────────────────────────────────────────────────┐  │
│  │ Vision Pipeline (ClassicalFibreCounter / ML Ready)    │  │
│  │ 1. Pillow Verification & Safe Array Decode            │  │
│  │ 2. Aspect-Ratio Preserving Resize (max 1024px)        │  │
│  │ 3. CLAHE Normalization & Bilateral Noise Reduction    │  │
│  │ 4. Ridge Filter + Adaptive Canny Edge Detection       │  │
│  │ 5. Morphological Skeletonization (Centerline Thinning)│  │
│  │ 6. Connected Component & Branch Junction Graph        │  │
│  │ 7. Multi-factor Confidence Scoring (0-100%)           │  │
│  └───────────────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────────┐  │
│  │ Storage Provider (Local / AWS S3 / Cloudinary)        │  │
│  └───────────────────────────────────────────────────────┘  │
└──────────────────────────────┬──────────────────────────────┘
                               │ SQLAlchemy ORM / Alembic
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                 PostgreSQL 16 Database                      │
│            (analyses table with UUID primary key)           │
└─────────────────────────────────────────────────────────────┘
```

---

## 3. Technology Stack

### Frontend
- **Framework:** Next.js 15+ (App Router)
- **Library:** React 19, TypeScript
- **Styling:** Vanilla Tailwind CSS with custom Coconut & Tropical color tokens
- **Icons:** Lucide React
- **HTTP Client:** Fetch API with timeout and strict TypeScript response typing

### Backend
- **Framework:** FastAPI (Python 3.12+)
- **Validation:** Pydantic v2 & Pydantic-Settings
- **Computer Vision:** OpenCV (`opencv-python-headless`), scikit-image, NumPy, SciPy, Pillow
- **Server:** Uvicorn ASGI
- **Database ORM:** SQLAlchemy 2.0
- **Migrations:** Alembic
- **Testing:** Pytest, HTTPX TestClient

### Infrastructure
- **Containerization:** Docker & Docker Compose
- **Database:** PostgreSQL 16 Alpine
- **Storage:** Local file storage (default), AWS S3 / Cloudinary ready

---

## 4. Environment Variables

Create a `.env` file in the root directory (see `.env.example`):

| Variable | Default | Description |
| :--- | :--- | :--- |
| `DATABASE_URL` | `postgresql://postgres:postgres@localhost:5432/coconut_counter` | PostgreSQL database connection string |
| `DATABASE_SQLITE_FALLBACK` | `sqlite:///./coconut_counter.db` | Fallback SQLite database for local development |
| `CORS_ORIGINS` | `http://localhost:3000,http://127.0.0.1:3000` | Allowed origins for CORS |
| `MAX_UPLOAD_SIZE_MB` | `10` | Maximum allowable upload file size |
| `STORE_ANALYSIS_IMAGES` | `false` | Whether to permanently persist uploaded photos |
| `STORAGE_PROVIDER` | `local` | Storage provider: `local`, `s3`, or `cloudinary` |
| `ALGORITHM_VERSION` | `1.0.0` | Semantic version string of the CV pipeline |
| `CONFIDENCE_HIGH_THRESHOLD` | `75.0` | Threshold score for high confidence tier |
| `CONFIDENCE_MEDIUM_THRESHOLD` | `50.0` | Threshold score for medium confidence tier |
| `NEXT_PUBLIC_API_URL` | `http://localhost:8000` | Backend API URL accessed by the frontend |

---

## 5. Local Development Setup

### Prerequisites
- Python 3.12 or higher
- Node.js 20 or higher
- Git

### 1. Backend Setup
```bash
cd backend

# Create virtual environment
python -m venv .venv

# Activate virtual environment
# Windows:
.venv\Scripts\activate
# macOS/Linux:
source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run backend development server
uvicorn app.main:app --reload --port 8000
```
The backend will automatically initialize its database schema and start at `http://localhost:8000`.
Swagger API documentation: `http://localhost:8000/docs`.

### 2. Frontend Setup
```bash
cd frontend

# Install dependencies
npm install

# Start Next.js dev server
npm run dev
```
Open `http://localhost:3000` in your web browser.

---

## 6. Docker Compose Setup

Run the entire production stack (Frontend, Backend, PostgreSQL) with a single command:

```bash
docker compose up --build
```

Access endpoints:
- **Frontend Dashboard:** [http://localhost:3000](http://localhost:3000)
- **Backend API:** [http://localhost:8000](http://localhost:8000)
- **Interactive API Docs:** [http://localhost:8000/docs](http://localhost:8000/docs)

To stop services:
```bash
docker compose down
```

---

## 7. API Documentation

### `POST /api/analyze`
Submits an image for computer vision analysis.

**Request:** `multipart/form-data`
- `file`: Image file (JPG, JPEG, PNG, WEBP; max 10MB)

**Response (High/Medium Confidence):**
```json
{
  "success": true,
  "estimated_count": 248,
  "confidence": 78,
  "status": "estimated",
  "processing_time_ms": 612,
  "message": "Estimated from visible fibre patterns. Overlapping, hidden, broken, or blurred fibres may not be detected.",
  "diagnostics": {
    "image_width": 1024,
    "image_height": 768,
    "sharpness_score": 240.5,
    "edge_density": 0.052,
    "candidate_filaments": 164,
    "husk_area_ratio": 0.13,
    "fibre_mask_preview": "data:image/jpeg;base64,...",
    "hair_verdict": "Healthy Thick Strands (Coco has great hair!)"
  },
  "analysis_id": "8cf552bb-b08c-4f11-9e73-b3c1d4a04d2e"
}
```

**Response (Low Confidence / Poor Quality):**
```json
{
  "success": false,
  "estimated_count": null,
  "confidence": 21,
  "status": "low_confidence",
  "processing_time_ms": 489,
  "message": "Unable to reliably detect coconut fibres. The image does not contain enough clear fibre detail, contrast, or lighting. Please upload a closer, sharper photo with good lighting."
}
```

### `GET /api/health`
**Response:**
```json
{
  "status": "ok",
  "version": "1.0.0",
  "app_name": "Is My Coco Losing Hair??"
}
```

### `GET /api/analyses`
Returns up to 50 recent analysis records from the database.

---

## 8. Computer Vision Algorithm Deep Dive

The classical computer vision pipeline follows an analytical 7-stage workflow:

1. **Aspect-Preserving Normalization:** Standardizes resolution to a maximum dimension of 1024px to ensure consistent spatial filtering scales across varying smartphone sensors.
2. **CLAHE Illumination Normalization:** Coconuts are spherical, leading to severe lighting gradients between highlights and shaded flanks. Contrast-Limited Adaptive Histogram Equalization (`clipLimit=2.5`, `tileGridSize=(8,8)`) balances lighting locally.
3. **Bilateral Noise Filtering:** Smooths sensor noise without blurring sharp filament borders (`sigmaColor=40`, `sigmaSpace=40`).
4. **Morphological Ridge Feature Extraction:** Applies combined Top-Hat and Black-Hat transforms with elliptical structuring elements to extract thin bright and dark curvilinear ridges against husk texture.
5. **Adaptive Thresholding & Automatic Canny:** Uses local Gaussian thresholding combined with median-derived hysteresis thresholds to extract high-frequency edges.
6. **Skeletonization (Thinning):** Utilizes Lee's morphological thinning algorithm via `skimage.morphology.skeletonize` to reduce fibrous bands into single-pixel centerlines.
7. **Filament Graph & Branch Analysis:** Computes neighbor convolutions (3x3 kernel). Endpoints have 1 neighbor; crossing branches have $\ge 3$ neighbors. Curvilinear arc lengths are quantified and factored into individual strand counts ($N \approx \sum \frac{L_i}{L_{avg}} + 0.4 \times J$).

---

## 9. Confidence System & Thresholds

Confidence is mathematically computed from 5 weighted physical indicators:

1. **Sharpness Index (Laplacian Variance):** $\sigma^2(\nabla^2 I)$. Blurry images produce near-zero variance.
2. **Contrast & Dynamic Range:** Standard deviation of intensity. Prevents washed-out or pitch-black frames.
3. **Fibre Density Window:** Checks that edge density falls within the natural range of coconut husk texture ($0.015 \le \rho_{edge} \le 0.35$).
4. **Filament Cluster Count:** Verifies presence of elongated curvilinear clusters rather than monolithic blobs or isolated dust particles.
5. **Resolution Adequacy:** Penalizes low-resolution images (< 300px).

**Thresholds:**
- **High Confidence ($\ge 75\%$):** Sharp details, distinct filaments, optimal lighting.
- **Medium Confidence ($50\% - 74\%$):** Visible fibres with minor blur, shadow, or dense overlapping.
- **Low Confidence ($< 50\%$):** Fails criteria; `status="low_confidence"` and `estimated_count=null` returned.

---

## 10. Limitations

1. **2D Surface Estimation:** Cannot detect fibres situated inside internal husk layers or on the obscured back side of the coconut.
2. **Extreme Matting / Dense Tangles:** In dense clumps, intertwined fibres are estimated via branch-junction decomposition and average strand lengths rather than individual 3D strand separation.
3. **Lighting Extremes:** Heavy flash glares or deep shadows can obscure delicate hair strands.

---

## 11. Testing

### Run Backend Tests:
```bash
cd backend
$env:PYTHONPATH = "backend"; .venv\Scripts\pytest -v
```
All 23 unit and integration tests validate:
- Preprocessing, aspect ratio, CLAHE
- Synthetic fibre line detection
- Skeleton graph branch detection
- Honest low-confidence triggering on smooth/blank surfaces
- High confidence on sharp fibrous textures
- All FastAPI endpoints, payload limits, and error handling

---

## 12. Future ML Model Roadmap

The architecture features an abstract `FibreCounter` base class designed for drop-in machine learning models:

```python
class MLFibreCounter(FibreCounter):
    def __init__(self, model_path: str = "weights/coconut_yolo_seg.pt"):
        self.model = YOLO(model_path)

    def analyze(self, image_bgr: np.ndarray) -> AnalysisResult:
        # Instance segmentation on individual fibres
        results = self.model.predict(image_bgr)
        ...
```

To integrate an ML model:
1. Annotate a dataset of coconut husks with filament polygon segmentations.
2. Train a YOLOv8-seg or Mask2Former architecture.
3. Place weights in `backend/app/vision/weights/`.
4. Switch `default_counter = MLFibreCounter()` in `backend/app/vision/pipeline.py`.
The API response format and frontend contracts remain 100% identical!

---

<div align="center">
  Made with 🥥 at TinkerHub Useless Projects
</div>
