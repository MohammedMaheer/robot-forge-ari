"""Router — export operations."""

from __future__ import annotations

import hashlib
import random
import uuid
from datetime import datetime, timezone

from fastapi import APIRouter, HTTPException

from deps import CurrentUser
from models import ExportRequest, ExportResponse

router = APIRouter()

# ---------------------------------------------------------------------------
# In-memory store (swap for a database / Redis in production)
# ---------------------------------------------------------------------------
_exports: dict[str, ExportResponse] = {}


@router.post("/", response_model=dict, status_code=201)
async def create_export(body: ExportRequest, _: CurrentUser) -> dict:
    """Create a new export job.

    In production this would enqueue a background task.  Here we simulate
    an immediate "completed" state with mock file metadata.
    """
    export_id = uuid.uuid4().hex
    now = datetime.now(timezone.utc)

    # Simulate realistic file size based on episode count & format
    base_size = random.randint(50_000_000, 500_000_000)
    episode_count = max(len(body.episode_ids), 1)
    file_size = base_size * episode_count

    export = ExportResponse(
        id=export_id,
        status="completed",
        format=body.format,
        download_url=None,  # populated via /download endpoint
        file_size_bytes=file_size,
        created_at=now,
    )
    _exports[export_id] = export
    return {"data": export.model_dump()}


@router.get("/{export_id}", response_model=dict)
async def get_export(export_id: str, _: CurrentUser) -> dict:
    """Retrieve the status of an export job."""
    export = _exports.get(export_id)
    if export is None:
        raise HTTPException(status_code=404, detail="Export not found")
    return {"data": export.model_dump()}


@router.get("/{export_id}/download")
async def download_export(export_id: str, _: CurrentUser) -> dict:
    """Generate a presigned download URL (mock).

    Returns a fake S3 presigned URL that expires in 1 hour.
    """
    export = _exports.get(export_id)
    if export is None:
        raise HTTPException(status_code=404, detail="Export not found")

    if export.status != "completed":
        raise HTTPException(
            status_code=409,
            detail=f"Export is not ready for download (status={export.status})",
        )

    # Build a deterministic-looking mock presigned URL
    token = hashlib.sha256(export_id.encode()).hexdigest()[:32]
    presigned_url = (
        f"https://robotforge-exports.s3.amazonaws.com/"
        f"{export_id}/{export.format.value}/dataset.zip"
        f"?X-Amz-Signature={token}&X-Amz-Expires=3600"
    )

    # Persist the URL on the export record
    export.download_url = presigned_url

    return {"data": {"download_url": presigned_url, "expires_in_seconds": 3600}}
