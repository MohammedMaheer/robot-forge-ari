"""Episode management router."""

from fastapi import APIRouter, HTTPException
from uuid import uuid4
from datetime import datetime

from models import Episode, EpisodeStatus, EpisodeMetadata, RobotEmbodiment, RobotTask
from deps import CurrentUser

router = APIRouter()

# In-memory episode store
_episodes: dict[str, Episode] = {}


@router.post("", response_model=dict)
async def create_episode(session_id: str, robot_id: str, current_user: CurrentUser, task: str = "manipulation"):
    """Begin recording a new episode within a session."""
    # Look up robot embodiment from connected robots (lazy import to avoid circular refs)
    from routers.robots import _robots
    robot = _robots.get(robot_id)
    embodiment = robot.embodiment if robot else RobotEmbodiment.custom

    episode_id = str(uuid4())
    episode = Episode(
        id=episode_id,
        session_id=session_id,
        robot_id=robot_id,
        embodiment=embodiment,
        task=RobotTask(task),
        status=EpisodeStatus.recording,
        sensor_modalities=["rgb_camera", "joint_positions", "joint_velocities", "end_effector_pose"],
        metadata=EpisodeMetadata(operator_id=current_user["sub"]),
        created_at=datetime.utcnow(),
    )
    _episodes[episode_id] = episode
    return {"data": episode.model_dump()}


@router.get("/{episode_id}", response_model=dict)
async def get_episode(episode_id: str, current_user: CurrentUser):
    """Get episode details."""
    episode = _episodes.get(episode_id)
    if not episode:
        raise HTTPException(status_code=404, detail="Episode not found")
    if episode.metadata.operator_id != current_user["sub"]:
        raise HTTPException(status_code=403, detail="Not authorized to access this episode")
    return {"data": episode.model_dump()}


@router.post("/{episode_id}/stop", response_model=dict)
async def stop_episode(episode_id: str, current_user: CurrentUser):
    """Stop recording an episode and submit for processing."""
    episode = _episodes.get(episode_id)
    if not episode:
        raise HTTPException(status_code=404, detail="Episode not found")
    if episode.metadata.operator_id != current_user["sub"]:
        raise HTTPException(status_code=403, detail="Not authorized to stop this episode")

    episode.status = EpisodeStatus.processing
    episode.duration_ms = int((datetime.utcnow() - episode.created_at).total_seconds() * 1000)

    # In production: close HDF5 file, publish to RabbitMQ for processing
    return {"data": episode.model_dump()}


@router.get("", response_model=dict)
async def list_episodes(current_user: CurrentUser, session_id: str | None = None):
    """List episodes for the authenticated user, optionally filtered by session."""
    user_id = current_user["sub"]
    episodes = [e for e in _episodes.values() if e.metadata.operator_id == user_id]
    if session_id:
        episodes = [e for e in episodes if e.session_id == session_id]
    return {"data": [e.model_dump() for e in episodes]}

