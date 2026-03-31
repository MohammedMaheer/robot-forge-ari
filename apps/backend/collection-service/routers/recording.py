"""Rosbag2 recording router — start/stop MCAP recording and convert to LeRobot.

Provides:
  POST /recording/start         — begin rosbag2 recording for a session
  POST /recording/stop          — stop an active recording
  GET  /recording/{id}          — get recording status / metadata
  POST /recording/{id}/convert  — convert MCAP → LeRobot v3.0 dataset
"""

from fastapi import APIRouter, HTTPException
from uuid import uuid4
from datetime import datetime, timezone

from models import (
    RecordingStartRequest,
    RosbagRecording,
    RecordingState,
    StorageFormat,
)
from deps import CurrentUser

router = APIRouter()

# In-memory recording store (production: Redis + MinIO for files)
_recordings: dict[str, RosbagRecording] = {}


@router.post("/start", response_model=dict)
async def start_recording(req: RecordingStartRequest, _: CurrentUser):
    """Begin rosbag2 recording for the given session.

    In production: spawns ``ros2 bag record`` subprocess targeting the
    configured storage plugin (MCAP default) and topic filters.
    Records to ``/data/rosbags/{session_id}/{recording_id}.mcap``.
    """
    recording_id = str(uuid4())
    recording = RosbagRecording(
        id=recording_id,
        session_id=req.session_id,
        status=RecordingState.recording,
        storage_format=req.storage_format,
        topics_recorded=req.topic_filters if req.topic_filters else ["all"],
        started_at=datetime.now(timezone.utc),
    )
    _recordings[recording_id] = recording
    return {"data": recording.model_dump()}


@router.post("/stop", response_model=dict)
async def stop_recording(recording_id: str, _: CurrentUser):
    """Stop an active rosbag2 recording.

    In production: sends SIGINT to the ``ros2 bag record`` process and
    waits for the MCAP file to be finalized.
    """
    recording = _recordings.get(recording_id)
    if not recording:
        raise HTTPException(status_code=404, detail="Recording not found")
    if recording.status != RecordingState.recording:
        raise HTTPException(status_code=409, detail=f"Recording is {recording.status.value}, not active")

    recording.status = RecordingState.stopped
    recording.stopped_at = datetime.now(timezone.utc)

    if recording.started_at:
        recording.duration_seconds = (recording.stopped_at - recording.started_at).total_seconds()

    # Mock file info — in production these come from the MCAP writer
    recording.file_path = f"/data/rosbags/{recording.session_id}/{recording.id}.mcap"
    recording.file_size_mb = round(recording.duration_seconds * 2.5, 2)  # ~2.5 MB/s estimate
    recording.message_count = int(recording.duration_seconds * 200)  # ~200 msg/s estimate

    return {"data": recording.model_dump()}


@router.get("/{recording_id}", response_model=dict)
async def get_recording(recording_id: str, _: CurrentUser):
    """Get status and metadata for a recording."""
    recording = _recordings.get(recording_id)
    if not recording:
        raise HTTPException(status_code=404, detail="Recording not found")
    return {"data": recording.model_dump()}


@router.post("/{recording_id}/convert", response_model=dict)
async def convert_recording(recording_id: str, _: CurrentUser):
    """Convert a stopped MCAP recording to LeRobot v3.0 dataset format.

    In production: submits a processing job that runs the equivalent of
    ``rosbag_to_lerobot`` from the SO-101 pipeline — extracts camera
    frames, joint states, and actions into the LeRobot v3.0 Parquet
    structure with a ``meta/info.json`` manifest.
    """
    recording = _recordings.get(recording_id)
    if not recording:
        raise HTTPException(status_code=404, detail="Recording not found")
    if recording.status not in (RecordingState.stopped, RecordingState.completed):
        raise HTTPException(status_code=409, detail="Recording must be stopped before conversion")

    recording.status = RecordingState.converting

    # In production: publish conversion job to RabbitMQ → processing-service
    # For now, mark as completed immediately
    recording.status = RecordingState.completed

    return {
        "data": {
            "recordingId": recording_id,
            "status": recording.status.value,
            "lerobotDatasetPath": f"/data/lerobot/{recording.session_id}/{recording.id}",
        }
    }
