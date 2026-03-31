"""Session management router."""

from fastapi import APIRouter, HTTPException
from datetime import datetime
from uuid import uuid4

from models import (
    SessionCreateRequest,
    CollectionSession,
    SessionStatus,
)
from deps import CurrentUser

router = APIRouter()

# In-memory session store (production: Redis + PostgreSQL)
_sessions: dict[str, CollectionSession] = {}


@router.post("", response_model=dict)
async def create_session(req: SessionCreateRequest, current_user: CurrentUser):
    """Create a new collection session."""
    session_id = str(uuid4())
    session = CollectionSession(
        id=session_id,
        operator_id=current_user["sub"],
        task=req.task,
        status=SessionStatus.idle,
        mode=req.mode,
        episode_count=0,
        started_at=datetime.utcnow(),
        target_episodes=req.target_episodes,
        robots=[],
    )
    _sessions[session_id] = session
    return {"data": session.model_dump()}


@router.get("/{session_id}", response_model=dict)
async def get_session(session_id: str, current_user: CurrentUser):
    """Get session details."""
    session = _sessions.get(session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    if session.operator_id != current_user["sub"]:
        raise HTTPException(status_code=403, detail="Not authorized to access this session")
    return {"data": session.model_dump()}


@router.post("/{session_id}/start", response_model=dict)
async def start_recording(session_id: str, current_user: CurrentUser):
    """Start recording on an existing session."""
    session = _sessions.get(session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    if session.operator_id != current_user["sub"]:
        raise HTTPException(status_code=403, detail="Not authorized to control this session")
    session.status = SessionStatus.recording
    return {"data": session.model_dump()}


@router.post("/{session_id}/stop", response_model=dict)
async def stop_recording(session_id: str, current_user: CurrentUser):
    """Stop recording and begin processing."""
    session = _sessions.get(session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    if session.operator_id != current_user["sub"]:
        raise HTTPException(status_code=403, detail="Not authorized to control this session")
    session.status = SessionStatus.processing
    return {"data": session.model_dump()}


@router.post("/{session_id}/pause", response_model=dict)
async def pause_recording(session_id: str, current_user: CurrentUser):
    """Pause current recording."""
    session = _sessions.get(session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    if session.operator_id != current_user["sub"]:
        raise HTTPException(status_code=403, detail="Not authorized to control this session")
    session.status = SessionStatus.paused
    return {"data": session.model_dump()}


@router.get("", response_model=dict)
async def list_sessions(current_user: CurrentUser):
    """List sessions belonging to the authenticated user."""
    user_id = current_user["sub"]
    return {"data": [s.model_dump() for s in _sessions.values() if s.operator_id == user_id]}

