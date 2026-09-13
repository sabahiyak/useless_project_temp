from typing import List, Union
from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    PROJECT_NAME: str = "Is My Coco Losing Hair?? (Coconut Hair Counter)"
    PROJECT_SLUG: str = "coconut-hair-counter"
    ALGORITHM_VERSION: str = "1.0.0"
    DEBUG: bool = False

    # Database
    DATABASE_URL: str = "postgresql://postgres:postgres@localhost:5432/coconut_counter"
    DATABASE_SQLITE_FALLBACK: str = "sqlite:///./coconut_counter.db"

    # CORS
    CORS_ORIGINS: Union[List[str], str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:8000",
    ]

    # Uploads & Storage
    MAX_UPLOAD_SIZE_MB: int = 10
    STORE_ANALYSIS_IMAGES: bool = False
    STORAGE_PROVIDER: str = "local"  # "local", "s3", "cloudinary"
    LOCAL_STORAGE_DIR: str = "uploads"

    # Cloud Storage (optional)
    AWS_ACCESS_KEY_ID: str = ""
    AWS_SECRET_ACCESS_KEY: str = ""
    AWS_REGION: str = "us-east-1"
    AWS_S3_BUCKET: str = ""

    CLOUDINARY_CLOUD_NAME: str = ""
    CLOUDINARY_API_KEY: str = ""
    CLOUDINARY_API_SECRET: str = ""

    # Computer Vision & Confidence Thresholds
    CONFIDENCE_HIGH_THRESHOLD: float = 75.0
    CONFIDENCE_MEDIUM_THRESHOLD: float = 50.0

    # Rate Limiting
    RATE_LIMIT_PER_MINUTE: int = 30

    @field_validator("CORS_ORIGINS", mode="before")
    @classmethod
    def assemble_cors_origins(cls, v: Union[str, List[str]]) -> List[str]:
        if isinstance(v, str) and not v.startswith("["):
            return [i.strip() for i in v.split(",") if i.strip()]
        elif isinstance(v, (list, str)):
            return v
        raise ValueError(v)

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore",
    )


settings = Settings()
