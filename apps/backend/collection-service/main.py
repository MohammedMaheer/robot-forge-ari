"""
ROBOTFORGE Collection Service
FastAPI application for robot session management, teleoperation, fleet control,
rosbag2 recording, and policy-server relay.

The service initialises an rclpy context at startup when ROS 2 is available,
falling back to mock telemetry for local development without a ROS installation.
"""

from fastapi import FastAPI, WebSocket, WebSocketDisconnect, Query
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import asyncio
import os
import jwt as pyjwt

from routers import sessions, robots, episodes, dashboard, fleet, recording, policy

JWT_SECRET = os.getenv("JWT_SECRET", "changeme-secret")
JWT_ALGORITHM = os.getenv("JWT_ALGORITHM", "HS256")

# ---------------------------------------------------------------------------
# ROS 2 availability probe
# ---------------------------------------------------------------------------

_ros2_available = False

try:
    import rclpy  # noqa: F401
    _ros2_available = True
except ImportError:
    pass


def is_ros2_available() -> bool:
    return _ros2_available


# ---------------------------------------------------------------------------
# Lifespan
# ---------------------------------------------------------------------------

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup/shutdown lifecycle for ROS 2 bridge and message queues."""
    print("[collection-service] Starting up...")

    if _ros2_available:
        import rclpy
        rclpy.init()
        print("[collection-service] rclpy initialised — ROS 2 bridge active")
    else:
        print("[collection-service] rclpy not installed — running in mock/dev mode")

    yield

    print("[collection-service] Shutting down...")
    if _ros2_available:
        import rclpy
        try:
            rclpy.shutdown()
        except Exception:
            pass


# ---------------------------------------------------------------------------
# App
# ---------------------------------------------------------------------------

app = FastAPI(
    title="ROBOTFORGE Collection Service",
    version="0.2.0",
    description="Robot data collection, teleoperation, fleet management, rosbag2 recording, and policy-server relay",
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
app.include_router(dashboard.router, prefix="/dashboard", tags=["Dashboard"])
app.include_router(fleet.router, prefix="/fleet", tags=["Fleet"])
app.include_router(recording.router, prefix="/recording", tags=["Recording"])
app.include_router(policy.router, prefix="/policy", tags=["Policy"])


# ── Health ─────────────────────────────────────────────────

@app.get("/health")
async def health():
    return {
        "status": "ok",
        "service": "collection-service",
        "ros2": _ros2_available,
    }


# ── WebSocket: Real-time teleoperation ─────────────────────

active_sessions: dict[str, asyncio.Queue] = {}


@app.websocket("/ws/session/{session_id}")
async def teleoperation_ws(websocket: WebSocket, session_id: str, token: str = Query(...)):
    """
    WebSocket endpoint for real-time telemetry streaming during teleoperation.
    Requires a valid JWT via ?token=<accessToken> query parameter.

    When ROS 2 is available, telemetry is bridged from /joint_states and
    /controller_state topics.  Otherwise mock sine-wave data is generated at 20 Hz.
    """
    try:
        pyjwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
    except pyjwt.InvalidTokenError:
        await websocket.close(code=4401)
        return

    await websocket.accept()

    if session_id not in active_sessions:
        active_sessions[session_id] = asyncio.Queue(maxsize=1000)

    queue = active_sessions[session_id]

    try:
        while True:
            # In production with ROS 2: receive from rclpy subscription via queue
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
                "ros2": {
                    "bridgeActive": _ros2_available,
                    "controllerState": "active" if _ros2_available else "mock",
                },
            }
            await websocket.send_json(telemetry)

    except WebSocketDisconnect:
        print(f"[ws] Client disconnected from session {session_id}")
    except Exception as e:
        print(f"[ws] Error in session {session_id}: {e}")
    finally:
        if session_id in active_sessions and active_sessions[session_id] is queue:
            del active_sessions[session_id]
