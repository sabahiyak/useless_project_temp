from abc import ABC, abstractmethod
from dataclasses import dataclass, field
from typing import Optional, Dict, Any
import numpy as np


@dataclass
class AnalysisResult:
    estimated_count: Optional[int]
    confidence: int
    status: str  # "estimated" | "low_confidence" | "error"
    message: str
    diagnostics: Dict[str, Any] = field(default_factory=dict)


class FibreCounter(ABC):
    """
    Abstract interface for coconut fibre counters.
    Subclasses can implement classical CV (ClassicalFibreCounter)
    or machine learning / deep learning approaches (MLFibreCounter).
    """

    @property
    @abstractmethod
    def name(self) -> str:
        """Name and version of the counter model or algorithm."""
        pass

    @abstractmethod
    def analyze(self, image_bgr: np.ndarray) -> AnalysisResult:
        """
        Analyze an image (in OpenCV BGR format) and return an AnalysisResult.
        """
        pass
