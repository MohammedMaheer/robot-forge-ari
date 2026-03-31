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
    lerobot_v3 = "lerobot_v3"
    huggingface = "huggingface"
    parquet = "parquet"
    raw = "raw"


class InputSource(str, Enum):
    """Supported input sources for packaging."""

    episodes = "episodes"
    mcap = "mcap"
    rosbag2_sqlite3 = "rosbag2_sqlite3"


class ExportRequest(BaseModel):
    """Request to create a dataset export."""

    dataset_id: str = Field(..., description="ID of the source dataset / collection")
    format: DatasetFormat = Field(..., description="Target output format")
    input_source: InputSource = Field(
        default=InputSource.episodes,
        description="Where the raw data comes from (episodes, MCAP rosbag, etc.)",
    )
    mcap_path: Optional[str] = Field(
        None, description="Path to MCAP file when input_source is mcap",
    )
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
        default=0.5, ge=0.0, le=1.0, description="Approximate ratio (compressed / raw)"
    )
