"""Router — dataset format information."""

from __future__ import annotations

from fastapi import APIRouter, HTTPException

from models import DatasetFormat, FormatInfo

router = APIRouter()

# ---------------------------------------------------------------------------
# Format catalogue
# ---------------------------------------------------------------------------
_FORMATS: dict[str, FormatInfo] = {
    DatasetFormat.hdf5.value: FormatInfo(
        name="HDF5",
        description="Hierarchical Data Format v5 — widely used in robotics research for dense, structured datasets.",
        supported_features=["images", "actions", "observations", "metadata", "chunked_storage", "compression"],
        typical_compression_ratio=0.55,
    ),
    DatasetFormat.rlds.value: FormatInfo(
        name="RLDS",
        description="Reinforcement Learning Datasets — TFRecord-based format used by Google DeepMind.",
        supported_features=["images", "actions", "observations", "metadata", "tf_compatibility"],
        typical_compression_ratio=0.60,
    ),
    DatasetFormat.lerobot.value: FormatInfo(
        name="LeRobot",
        description="Hugging Face LeRobot format — optimised for policy learning with video support.",
        supported_features=["images", "actions", "observations", "video", "metadata", "hf_hub_upload"],
        typical_compression_ratio=0.50,
    ),
    DatasetFormat.huggingface.value: FormatInfo(
        name="Hugging Face Datasets",
        description="Arrow-backed datasets compatible with the Hugging Face Hub ecosystem.",
        supported_features=["images", "actions", "observations", "metadata", "streaming", "hf_hub_upload"],
        typical_compression_ratio=0.45,
    ),
    DatasetFormat.parquet.value: FormatInfo(
        name="Parquet",
        description="Columnar storage format — excellent for analytics and tabular telemetry data.",
        supported_features=["actions", "observations", "metadata", "columnar_queries", "compression"],
        typical_compression_ratio=0.35,
    ),
    DatasetFormat.raw.value: FormatInfo(
        name="Raw",
        description="Unprocessed archive of original files (video, JSON, CSVs) as a ZIP bundle.",
        supported_features=["images", "video", "actions", "observations", "metadata"],
        typical_compression_ratio=0.90,
    ),
}


# ---------------------------------------------------------------------------
# Endpoints
# ---------------------------------------------------------------------------

@router.get("/", response_model=list[FormatInfo])
async def list_formats() -> list[FormatInfo]:
    """List all supported export formats with descriptions."""
    return list(_FORMATS.values())


@router.get("/{format_name}", response_model=FormatInfo)
async def get_format(format_name: str) -> FormatInfo:
    """Get detailed information about a specific format."""
    info = _FORMATS.get(format_name)
    if info is None:
        raise HTTPException(
            status_code=404,
            detail=f"Unknown format '{format_name}'. Available: {list(_FORMATS.keys())}",
        )
    return info
