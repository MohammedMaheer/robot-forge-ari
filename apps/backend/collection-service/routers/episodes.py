"""Episode management router."""

from fastapi import APIRouter, HTTPException
from uuid import uuid4
from datetime import datetime

from models import Episode, EpisodeStatus, EpisodeMetadata, RobotEmbodiment, RobotTask

router = APIRouter()

# In-memory episode store
_episodes: dict[str, Episode] = {}


@router.post("", response_model=dict)
async def create_episode(session_id: str, robot_id: str, task: str = "manipulation"):
    """Begin recording a new episode within a session."""
    episode_id = str(uuid4())
    episode = Episode(
        id=episode_id,
        session_id=session_id,
        robot_id=robot_id,
        embodiment=RobotEmbodiment.custom,
        task=RobotTask(task),
        status=EpisodeStatus.recording,
        sensor_modalities=["rgb_camera", "joint_positions", "joint_velocities", "end_effector_pose"],
        metadata=EpisodeMetadata(operator_id="current_user"),
        created_at=datetime.utcnow(),
    )
    _episodes[episode_id] = episode
    return {"data": episode.model_dump()}


@router.get("/{episode_id}", response_model=dict)
async def get_episode(episode_id: str):
    """Get episode details."""
    episode = _episodes.get(episode_id)
    if not episode:
        raise HTTPException(status_code=404, detail="Episode not found")
    return {"data": episode.model_dump()}


@router.post("/{episode_id}/stop", response_model=dict)
async def stop_episode(episode_id: str):
    """Stop recording an episode and submit for processing."""
    episode = _episodes.get(episode_id)
    if not episode:
        raise HTTPException(status_code=404, detail="Episode not found")

    episode.status = EpisodeStatus.processing
    episode.duration_ms = int((datetime.utcnow() - episode.created_at).total_seconds() * 1000)

    # In production: close HDF5 file, publish to RabbitMQ for processing
    return {"data": episode.model_dump()}


@router.get("", response_model=dict)
async def list_episodes(session_id: str | None = None):
    """List episodes, optionally filtered by session."""
    episodes = list(_episodes.values())
    if session_id:
        episodes = [e for e in episodes if e.session_id == session_id]
    return {"data": [e.model_dump() for e in episodes]}
