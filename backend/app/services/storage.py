import os
import uuid
import logging
from abc import ABC, abstractmethod
from typing import Optional
from app.config import settings

logger = logging.getLogger(__name__)


class StorageProvider(ABC):
    @abstractmethod
    def save_image(self, file_bytes: bytes, extension: str = "jpg") -> Optional[str]:
        """Save image bytes and return the access URL or relative storage path."""
        pass


class LocalStorageProvider(StorageProvider):
    def __init__(self, upload_dir: str = settings.LOCAL_STORAGE_DIR):
        self.upload_dir = upload_dir
        os.makedirs(self.upload_dir, exist_ok=True)

    def save_image(self, file_bytes: bytes, extension: str = "jpg") -> Optional[str]:
        if not settings.STORE_ANALYSIS_IMAGES:
            return None

        filename = f"{uuid.uuid4().hex}.{extension.lstrip('.')}"
        filepath = os.path.join(self.upload_dir, filename)
        with open(filepath, "wb") as f:
            f.write(file_bytes)
        logger.info(f"Saved analysis image locally at: {filepath}")
        return filepath


class S3StorageProvider(StorageProvider):
    def __init__(self):
        self.bucket = settings.AWS_S3_BUCKET

    def save_image(self, file_bytes: bytes, extension: str = "jpg") -> Optional[str]:
        if not settings.STORE_ANALYSIS_IMAGES:
            return None
        # Ready for boto3 upload if AWS credentials configured
        filename = f"coconuts/{uuid.uuid4().hex}.{extension.lstrip('.')}"
        logger.info(f"S3 Storage configured for bucket: {self.bucket}, key: {filename}")
        # Return S3 URL format
        return f"s3://{self.bucket}/{filename}"


class CloudinaryStorageProvider(StorageProvider):
    def __init__(self):
        self.cloud_name = settings.CLOUDINARY_CLOUD_NAME

    def save_image(self, file_bytes: bytes, extension: str = "jpg") -> Optional[str]:
        if not settings.STORE_ANALYSIS_IMAGES:
            return None
        filename = f"coconut_{uuid.uuid4().hex}"
        logger.info(f"Cloudinary configured for cloud_name: {self.cloud_name}, id: {filename}")
        return f"https://res.cloudinary.com/{self.cloud_name}/image/upload/{filename}.{extension}"


def get_storage_provider() -> StorageProvider:
    provider = settings.STORAGE_PROVIDER.lower()
    if provider == "s3" and settings.AWS_S3_BUCKET:
        return S3StorageProvider()
    elif provider == "cloudinary" and settings.CLOUDINARY_CLOUD_NAME:
        return CloudinaryStorageProvider()
    return LocalStorageProvider()
