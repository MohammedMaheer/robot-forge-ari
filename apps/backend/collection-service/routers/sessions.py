"""Session management router."""

from fastapi import APIRouter, HTTPException
from datetime import datetime
from uuid import uuid4

from models import (
    SessionCreateRequest,
    CollectionSession,
    SessionStatus,
)

router = APIRouter()

# In-memory session store (production: Redis + PostgreSQL)
_sessions: dict[str, CollectionSession] = {}


@router.post("", response_model=dict)
async def create_session(req: SessionCreateRequest):
    """Create a new collection session."""
    session_id = str(uuid4())
    session = CollectionSession(
        id=session_id,
        operator_id="current_user",  # In production: from JWT
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
async def get_session(session_id: str):
    """Get session details."""
    session = _sessions.get(session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    return {"data": session.model_dump()}


@router.post("/{session_id}/start", response_model=dict)
async def start_recording(session_id: str):
    """Start recording on an existing session."""
    session = _sessions.get(session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    session.status = SessionStatus.recording
    return {"data": session.model_dump()}


@router.post("/{session_id}/stop", response_model=dict)
async def stop_recording(session_id: str):
    """Stop recording and begin processing."""
    session = _sessions.get(session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    session.status = SessionStatus.processing
    return {"data": session.model_dump()}


@router.post("/{session_id}/pause", response_model=dict)
async def pause_recording(session_id: str):
    """Pause current recording."""
    session = _sessions.get(session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    session.status = SessionStatus.paused
    return {"data": session.model_dump()}


@router.get("", response_model=dict)
async def list_sessions():
    """List all active sessions."""
    return {"data": [s.model_dump() for s in _sessions.values()]}
