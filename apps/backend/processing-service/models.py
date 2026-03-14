"""Pydantic models for the ROBOTFORGE Processing Service."""

from __future__ import annotations

from datetime import datetime
from enum import Enum
from typing import Any, Optional

from pydantic import BaseModel, Field


class ProcessingJobStatus(str, Enum):
    """Status progression for a processing job."""

    queued = "queued"
    running = "running"
    frame_filtering = "frame_filtering"
    compression = "compression"
    annotation = "annotation"
    quality_scoring = "quality_scoring"
    packaging = "packaging"
    completed = "completed"
    failed = "failed"


class ProcessingStepName(str, Enum):
    """Available processing pipeline steps."""

    frame_filtering = "frame_filtering"
    compression = "compression"
    annotation = "annotation"
    quality_scoring = "quality_scoring"
    packaging = "packaging"


class ProcessingJobCreate(BaseModel):
    """Request body to create a new processing job."""

    episode_id: str = Field(..., description="ID of the episode to process")
    pipeline_steps: list[ProcessingStepName] = Field(
        default_factory=lambda: list(ProcessingStepName),
        description="Ordered list of pipeline steps to execute",
    )
    priority: int = Field(
        default=0,
        ge=0,
        le=10,
        description="Job priority (0 = normal, 10 = highest)",
    )


class ProcessingStepResult(BaseModel):
    """Result produced by a single pipeline step."""

    step: ProcessingStepName
    status: str = Field(..., description="ok | failed")
    metrics: dict[str, Any] = Field(default_factory=dict)
    started_at: datetime
    completed_at: datetime


class ProcessingJobResponse(BaseModel):
    """Full representation of a processing job."""

    id: str
    episode_id: str
    status: ProcessingJobStatus
    steps: list[ProcessingStepResult] = Field(default_factory=list)
    quality_score: Optional[float] = Field(
        None, description="Overall quality score (0-1) when available"
    )
    started_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None
    error: Optional[str] = None


class QualityReport(BaseModel):
    """Multi-factor quality assessment of an episode."""

    overall_score: float = Field(..., ge=0.0, le=1.0)
    smoothness: float = Field(..., ge=0.0, le=1.0)
    completeness: float = Field(..., ge=0.0, le=1.0)
    coverage: float = Field(..., ge=0.0, le=1.0)
    anomaly_score: float = Field(
        ..., ge=0.0, le=1.0, description="Lower is better (0 = no anomalies)"
    )
    recommendations: list[str] = Field(default_factory=list)
