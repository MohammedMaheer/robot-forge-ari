"""
ROBOTFORGE Collection Service
FastAPI application for robot session management, teleoperation, and episode recording.
"""

from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import asyncio
import os

from routers import sessions, robots, episodes

# ---------------------------------------------------------------------------
# Lifespan
# ---------------------------------------------------------------------------

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup/shutdown lifecycle for ROS 2 bridge and message queues."""
    print("[collection-service] Starting up...")
    # In production: rclpy.init(), connect to RabbitMQ, etc.
    yield
    print("[collection-service] Shutting down...")
    # In production: rclpy.shutdown()


# ---------------------------------------------------------------------------
# App
# ---------------------------------------------------------------------------

app = FastAPI(
    title="ROBOTFORGE Collection Service",
    version="0.1.0",
    description="Robot data collection, teleoperation, and session management",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[os.getenv("CORS_ORIGIN", "http://localhost:5173")],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Routers ────────────────────────────────────────────────

app.include_router(sessions.router, prefix="/sessions", tags=["Sessions"])
app.include_router(robots.router, prefix="/robots", tags=["Robots"])
app.include_router(episodes.router, prefix="/episodes", tags=["Episodes"])


# ── Health ─────────────────────────────────────────────────

@app.get("/health")
async def health():
    return {"status": "ok", "service": "collection-service"}


# ── WebSocket: Real-time teleoperation ─────────────────────

# In-memory session tracking (production: Redis or dedicated service)
active_sessions: dict[str, asyncio.Queue] = {}


@app.websocket("/ws/session/{session_id}")
async def teleoperation_ws(websocket: WebSocket, session_id: str):
    """
    WebSocket endpoint for real-time telemetry streaming during teleoperation.
    Client subscribes and receives continuous telemetry updates.
    """
    await websocket.accept()

    if session_id not in active_sessions:
        active_sessions[session_id] = asyncio.Queue(maxsize=1000)

    queue = active_sessions[session_id]

    try:
        while True:
            # In production: receive from ROS 2 bridge via queue
            # For now, generate mock telemetry at 20Hz
            await asyncio.sleep(0.05)  # 20Hz

            import math
            import time

            t = time.time()
            telemetry = {
                "robotId": f"robot_{session_id[:8]}",
                "timestamp": int(t * 1000),
                "jointPositions": [math.sin(t + i * 0.5) * 1.5 for i in range(6)],
                "jointVelocities": [math.cos(t + i * 0.3) * 0.5 for i in range(6)],
                "jointTorques": [math.sin(t * 0.7 + i) * 10 for i in range(6)],
                "endEffectorPose": {
                    "x": 0.5 + math.sin(t * 0.3) * 0.1,
                    "y": 0.0 + math.cos(t * 0.3) * 0.1,
                    "z": 0.4 + math.sin(t * 0.2) * 0.05,
                    "rx": 0.0,
                    "ry": math.pi,
                    "rz": math.sin(t * 0.1) * 0.2,
                },
                "gripperPosition": (math.sin(t * 0.5) + 1) / 2,
            }
            await websocket.send_json(telemetry)

    except WebSocketDisconnect:
        print(f"[ws] Client disconnected from session {session_id}")
    except Exception as e:
        print(f"[ws] Error in session {session_id}: {e}")
    finally:
        if session_id in active_sessions and active_sessions[session_id] is queue:
            del active_sessions[session_id]
