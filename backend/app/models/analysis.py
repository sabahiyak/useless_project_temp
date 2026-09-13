import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Integer, Float, DateTime
from app.database import Base


class Analysis(Base):
    __tablename__ = "analyses"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    image_path = Column(String(512), nullable=True)
    estimated_count = Column(Integer, nullable=True)
    confidence = Column(Float, nullable=False)
    status = Column(String(50), nullable=False, index=True)
    algorithm_version = Column(String(50), nullable=False)
    processing_time_ms = Column(Integer, nullable=False)
    created_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    def to_dict(self):
        return {
            "id": self.id,
            "image_path": self.image_path,
            "estimated_count": self.estimated_count,
            "confidence": self.confidence,
            "status": self.status,
            "algorithm_version": self.algorithm_version,
            "processing_time_ms": self.processing_time_ms,
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }
