"""Policy server relay router — connect to external policy inference servers.

Supports ACT, SmolVLA, π₀ and other models served via gRPC or ZMQ,
mirroring the SO-101 policy_server architecture.

Provides:
  POST /policy/connect     — connect to a remote policy server
  POST /policy/disconnect  — disconnect from the policy server
  POST /policy/infer       — send observation → receive action
  GET  /policy/status      — current connection and inference stats
"""

from fastapi import APIRouter, HTTPException
from datetime import datetime, timezone

from models import PolicyConnectRequest, PolicyServerStatus, PolicyProtocol
from deps import CurrentUser

router = APIRouter()

# Singleton policy state (production: per-robot policy bindings in Redis)
_policy: PolicyServerStatus = PolicyServerStatus()


@router.post("/connect", response_model=dict)
async def connect_policy(req: PolicyConnectRequest, _: CurrentUser):
    """Connect to a remote policy inference server.

    In production: establishes a gRPC channel or ZMQ socket to the
    policy server, verifies the model is loaded, and binds output
    actions to the specified robot's forward_controller.
    """
    global _policy

    if _policy.connected:
        raise HTTPException(status_code=409, detail="Already connected — disconnect first")

    _policy = PolicyServerStatus(
        connected=True,
        address=req.address,
        protocol=req.protocol,
        model_name=req.model_name,
        bound_robot_id=req.robot_id,
        avg_latency_ms=0,
        inference_count=0,
    )

    return {"data": _policy.model_dump()}


@router.post("/disconnect", response_model=dict)
async def disconnect_policy(_: CurrentUser):
    """Disconnect from the policy server and stop inference relay."""
    global _policy

    if not _policy.connected:
        raise HTTPException(status_code=409, detail="No policy server connected")

    _policy = PolicyServerStatus()
    return {"data": {"message": "Policy server disconnected"}}


@router.post("/infer", response_model=dict)
async def infer(observation: dict, _: CurrentUser):
    """Send an observation frame to the policy server and return the predicted action.

    In production: serialises the observation (camera images + joint state)
    into the model's expected format, sends via gRPC/ZMQ, and returns the
    raw action vector plus timing metadata.

    The gateway or a streaming loop can call this at the control frequency
    (e.g. 50 Hz for ACT) to drive autonomous execution.
    """
    if not _policy.connected:
        raise HTTPException(status_code=409, detail="No policy server connected")

    import time
    start = time.monotonic()

    # Mock inference — in production: forward to gRPC/ZMQ server
    action = {
        "jointPositions": [0.0] * 6,
        "gripperPosition": 0.5,
        "modelName": _policy.model_name,
    }

    latency = (time.monotonic() - start) * 1000
    _policy.inference_count += 1
    _policy.avg_latency_ms = round(
        (_policy.avg_latency_ms * (_policy.inference_count - 1) + latency) / _policy.inference_count, 2
    )
    _policy.last_inference_at = datetime.now(timezone.utc)

    return {
        "data": {
            "action": action,
            "latencyMs": round(latency, 2),
            "inferenceCount": _policy.inference_count,
        }
    }


@router.get("/status", response_model=dict)
async def policy_status(_: CurrentUser):
    """Return current policy server connection and inference stats."""
    return {"data": _policy.model_dump()}
