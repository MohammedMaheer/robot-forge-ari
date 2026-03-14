"""Router — processing jobs management."""

from __future__ import annotations

import json
import uuid
from datetime import datetime, timezone
from typing import Optional

import aio_pika
from fastapi import APIRouter, HTTPException, Query

from models import (
    ProcessingJobCreate,
    ProcessingJobResponse,
    ProcessingJobStatus,
    QualityReport,
)

router = APIRouter()

# ---------------------------------------------------------------------------
# In-memory stores (swap for a database / Redis in production)
# ---------------------------------------------------------------------------
_jobs: dict[str, ProcessingJobResponse] = {}
_quality_reports: dict[str, QualityReport] = {}

# Re-use the module-level RabbitMQ objects from main — import lazily at call
# time to avoid circular imports.
RABBITMQ_URL = "amqp://guest:guest@localhost:5672/"
QUEUE_NAME = "processing_tasks"


async def _publish_to_queue(payload: dict) -> None:
    """Best-effort publish to the processing-tasks queue."""
    try:
        connection = await aio_pika.connect_robust(RABBITMQ_URL)
        async with connection:
            channel = await connection.channel()
            await channel.default_exchange.publish(
                aio_pika.Message(
                    body=json.dumps(payload).encode(),
                    delivery_mode=aio_pika.DeliveryMode.PERSISTENT,
                ),
                routing_key=QUEUE_NAME,
            )
    except Exception:
        # Queue unavailable — job stays in-memory with 'queued' status
        pass


# ---------------------------------------------------------------------------
# Endpoints
# ---------------------------------------------------------------------------

@router.post("/", response_model=ProcessingJobResponse, status_code=201)
async def create_job(body: ProcessingJobCreate) -> ProcessingJobResponse:
    """Create a new processing job and enqueue it to RabbitMQ."""
    job_id = uuid.uuid4().hex
    now = datetime.now(timezone.utc)

    job = ProcessingJobResponse(
        id=job_id,
        episode_id=body.episode_id,
        status=ProcessingJobStatus.queued,
        steps=[],
        quality_score=None,
        started_at=now,
        completed_at=None,
        error=None,
    )
    _jobs[job_id] = job

    await _publish_to_queue(
        {
            "job_id": job_id,
            "episode_id": body.episode_id,
            "pipeline_steps": [s.value for s in body.pipeline_steps],
            "priority": body.priority,
        }
    )

    return job


@router.get("/", response_model=list[ProcessingJobResponse])
async def list_jobs(
    status: Optional[ProcessingJobStatus] = Query(None, description="Filter by job status"),
) -> list[ProcessingJobResponse]:
    """List all processing jobs, optionally filtered by status."""
    if status is not None:
        return [j for j in _jobs.values() if j.status == status]
    return list(_jobs.values())


@router.get("/{job_id}", response_model=ProcessingJobResponse)
async def get_job(job_id: str) -> ProcessingJobResponse:
    """Retrieve a single processing job by ID."""
    job = _jobs.get(job_id)
    if job is None:
        raise HTTPException(status_code=404, detail="Job not found")
    return job


@router.post("/{job_id}/cancel", response_model=ProcessingJobResponse)
async def cancel_job(job_id: str) -> ProcessingJobResponse:
    """Cancel a queued or running processing job."""
    job = _jobs.get(job_id)
    if job is None:
        raise HTTPException(status_code=404, detail="Job not found")

    if job.status in (ProcessingJobStatus.completed, ProcessingJobStatus.failed):
        raise HTTPException(
            status_code=409,
            detail=f"Cannot cancel job in '{job.status.value}' state",
        )

    job.status = ProcessingJobStatus.failed
    job.error = "Cancelled by user"
    job.completed_at = datetime.now(timezone.utc)
    return job


@router.get("/{job_id}/report", response_model=QualityReport)
async def get_quality_report(job_id: str) -> QualityReport:
    """Return the quality report for a completed job."""
    job = _jobs.get(job_id)
    if job is None:
        raise HTTPException(status_code=404, detail="Job not found")

    report = _quality_reports.get(job_id)
    if report is None:
        raise HTTPException(
            status_code=404,
            detail="Quality report not available (job may not be completed yet)",
        )
    return report
