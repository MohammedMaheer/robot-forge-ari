"""Pydantic models for the ROBOTFORGE Packaging Service."""

from __future__ import annotations

from datetime import datetime
from enum import Enum
from typing import Optional

from pydantic import BaseModel, Field


class DatasetFormat(str, Enum):
    """Supported dataset output formats."""

    hdf5 = "hdf5"
    rlds = "rlds"
    lerobot = "lerobot"
    huggingface = "huggingface"
    parquet = "parquet"
    raw = "raw"


class ExportRequest(BaseModel):
    """Request to create a dataset export."""

    dataset_id: str = Field(..., description="ID of the source dataset / collection")
    format: DatasetFormat = Field(..., description="Target output format")
    episode_ids: list[str] = Field(
        default_factory=list,
        description="Specific episode IDs to include (empty = all)",
    )
    include_raw_video: bool = Field(
        default=False,
        description="Whether to bundle raw video files alongside structured data",
    )
    compression_level: int = Field(
        default=6,
        ge=0,
        le=9,
        description="Compression level (0 = none, 9 = max)",
    )


class ExportResponse(BaseModel):
    """Representation of an export job."""

    id: str
    status: str = Field(..., description="queued | running | completed | failed")
    format: DatasetFormat
    download_url: Optional[str] = None
    file_size_bytes: Optional[int] = None
    created_at: datetime


class FormatInfo(BaseModel):
    """Metadata describing a supported export format."""

    name: str
    description: str
    supported_features: list[str] = Field(default_factory=list)
    typical_compression_ratio: float = Field(
        ..., ge=0.0, le=1.0, description="Approximate ratio (compressed / raw)"
    )
