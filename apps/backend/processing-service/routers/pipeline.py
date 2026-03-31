"""Router — pipeline operations."""

from __future__ import annotations

import uuid
from datetime import datetime, timezone
from typing import Any

from fastapi import APIRouter, HTTPException

from models import (
    ProcessingJobResponse,
    ProcessingJobStatus,
    ProcessingStepName,
    ProcessingStepResult,
    QualityReport,
)
from pipeline.steps import (
    annotation,
    compression,
    frame_filtering,
    mcap_ingest,
    packaging,
    quality_scoring,
)
from routers.jobs import _jobs, _quality_reports
from deps import CurrentUser

router = APIRouter()

# ---------------------------------------------------------------------------
# Available steps metadata
# ---------------------------------------------------------------------------
STEP_DESCRIPTIONS: dict[str, dict[str, str]] = {
    ProcessingStepName.mcap_ingest.value: {
        "name": "MCAP Ingest",
        "description": "Ingest rosbag2 MCAP files — extract joint states, camera images, and leader actions.",
    },
    ProcessingStepName.frame_filtering.value: {
        "name": "Frame Filtering",
        "description": "Detect and remove blurry, redundant, or corrupted frames from the episode.",
    },
    ProcessingStepName.compression.value: {
        "name": "Compression",
        "description": "Compress trajectory and sensor data using optimised codecs (zstd, blosc).",
    },
    ProcessingStepName.annotation.value: {
        "name": "Annotation",
        "description": "Auto-annotate action segments, grasp events, and contact transitions.",
    },
    ProcessingStepName.quality_scoring.value: {
        "name": "Quality Scoring",
        "description": "Compute smoothness, completeness, coverage and anomaly metrics.",
    },
    ProcessingStepName.packaging.value: {
        "name": "Packaging",
        "description": "Package into the target format (HDF5, RLDS, LeRobot v3.0, etc.).",
    },
}


# ---------------------------------------------------------------------------
# Endpoints
# ---------------------------------------------------------------------------

@router.post("/run/{episode_id}", response_model=dict)
async def run_full_pipeline(episode_id: str, current_user: CurrentUser) -> dict:
    """Run the complete 5-step pipeline on an episode.

    Creates a job, executes every step sequentially (mock), stores results,
    and returns the finished job.
    """
    job_id = uuid.uuid4().hex
    now = datetime.now(timezone.utc)

    job = ProcessingJobResponse(
        id=job_id,
        episode_id=episode_id,
        operator_id=current_user["sub"],
        status=ProcessingJobStatus.running,
        steps=[],
        started_at=now,
    )
    _jobs[job_id] = job

    episode_data: dict[str, Any] = {"episode_id": episode_id}

    try:
        # 0. MCAP Ingest (when input is a rosbag2 MCAP)
        if episode_data.get("mcap_path") or episode_data.get("input_format") == "mcap":
            job.status = ProcessingJobStatus.running
            result_mcap = await mcap_ingest(episode_data)
            job.steps.append(result_mcap)

        # 1. Frame filtering
        job.status = ProcessingJobStatus.frame_filtering
        result_ff = await frame_filtering(episode_data)
        job.steps.append(result_ff)

        # 2. Compression
        job.status = ProcessingJobStatus.compression
        result_comp = await compression(episode_data)
        job.steps.append(result_comp)

        # 3. Annotation
        job.status = ProcessingJobStatus.annotation
        result_ann = await annotation(episode_data)
        job.steps.append(result_ann)

        # 4. Quality scoring
        job.status = ProcessingJobStatus.quality_scoring
        qs_started = datetime.now(timezone.utc)
        report = await quality_scoring(episode_data)
        _quality_reports[job_id] = report
        job.quality_score = report.overall_score
        job.steps.append(ProcessingStepResult(
            step=ProcessingStepName.quality_scoring,
            status="ok",
            metrics=report.model_dump(),
            started_at=qs_started,
            completed_at=datetime.now(timezone.utc),
        ))

        # 5. Packaging
        job.status = ProcessingJobStatus.packaging
        result_pkg = await packaging(episode_data)
        job.steps.append(result_pkg)

        # Done
        job.status = ProcessingJobStatus.completed
        job.completed_at = datetime.now(timezone.utc)
    except Exception as exc:
        job.status = ProcessingJobStatus.failed
        job.error = str(exc)
        job.completed_at = datetime.now(timezone.utc)
        raise HTTPException(status_code=500, detail=str(exc)) from exc

    return {"data": job.model_dump()}


@router.get("/steps", response_model=dict)
async def list_pipeline_steps(_: CurrentUser) -> dict:
    """List all available pipeline steps with their descriptions."""
    return {"data": list(STEP_DESCRIPTIONS.values())}


@router.post("/quality-score", response_model=dict)
async def compute_quality_score(telemetry: dict[str, Any], _: CurrentUser) -> dict:
    """Compute a quality score from raw telemetry data.

    Accepts a JSON object whose ``"data"`` key contains a list-of-lists
    (representing a NumPy array of telemetry values).  The actual scoring
    is mock; the endpoint validates the shape and delegates to the scorer.
    """
    if "data" not in telemetry:
        raise HTTPException(
            status_code=422,
            detail="Request body must contain a 'data' key with a list-of-lists (NumPy array as JSON).",
        )

    episode_data: dict[str, Any] = {"telemetry": telemetry["data"]}
    report = await quality_scoring(episode_data)
    return {"data": report.model_dump()}
