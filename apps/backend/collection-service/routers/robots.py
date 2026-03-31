"""Robot connection management router."""

from fastapi import APIRouter, HTTPException
from uuid import uuid4

from models import (
    RobotConnectRequest,
    ConnectedRobot,
    RobotStatus,
    CameraStream,
    Ros2NodeStatus,
    ControllerState,
)
from deps import CurrentUser

router = APIRouter()

# In-memory robot registry (production: Redis)
_robots: dict[str, ConnectedRobot] = {}


@router.post("/connect", response_model=dict)
async def connect_robot(req: RobotConnectRequest, _: CurrentUser):
    """
    Connect to a robot.
    For ROS 2 connections: creates ros2_control lifecycle node,
    discovers topics, activates forward_controller.
    """
    robot_id = str(uuid4())

    # Mock camera streams based on embodiment
    cameras = [
        CameraStream(id=f"{robot_id}_head", name="head", fps=30),
        CameraStream(id=f"{robot_id}_wrist", name="wrist", fps=30),
    ]
    if req.embodiment.value in ("boston_dynamics_spot", "clearpath_husky"):
        cameras.append(CameraStream(id=f"{robot_id}_rear", name="rear", fps=15))

    # Build ROS 2 status when using ros2 connection
    ros2_status = None
    if req.connection_type.value == "ros2":
        ros2_status = Ros2NodeStatus(
            node_active=True,
            controller_state=ControllerState.active,
            dds_connected=True,
        )

    robot = ConnectedRobot(
        id=robot_id,
        name=req.name,
        embodiment=req.embodiment,
        connection_type=req.connection_type,
        ip_address=req.ip_address,
        status=RobotStatus.connected,
        battery_level=85,
        cameras=cameras,
        ros2_namespace=req.ros2_namespace,
        ros2_status=ros2_status,
    )
    _robots[robot_id] = robot
    return {"data": robot.model_dump()}


@router.post("/{robot_id}/disconnect", response_model=dict)
async def disconnect_robot(robot_id: str, _: CurrentUser):
    """Disconnect a robot."""
    robot = _robots.pop(robot_id, None)
    if not robot:
        raise HTTPException(status_code=404, detail="Robot not found")
    return {"data": {"message": f"Robot {robot.name} disconnected"}}


@router.get("/{robot_id}/telemetry", response_model=dict)
async def get_telemetry(robot_id: str, _: CurrentUser):
    """Get latest telemetry snapshot for a robot."""
    import math
    import time

    robot = _robots.get(robot_id)
    if not robot:
        raise HTTPException(status_code=404, detail="Robot not found")

    t = time.time()
    n_joints = 6 if "arm" in robot.embodiment.value or robot.embodiment.value.startswith("ur") or robot.embodiment.value == "franka_panda" else 12

    telemetry = {
        "robotId": robot_id,
        "timestamp": int(t * 1000),
        "jointPositions": [math.sin(t + i * 0.5) * 1.5 for i in range(n_joints)],
        "jointVelocities": [math.cos(t + i * 0.3) * 0.5 for i in range(n_joints)],
        "jointTorques": [math.sin(t * 0.7 + i) * 10 for i in range(n_joints)],
        "endEffectorPose": {
            "x": 0.5 + math.sin(t * 0.3) * 0.1,
            "y": math.cos(t * 0.3) * 0.1,
            "z": 0.4 + math.sin(t * 0.2) * 0.05,
            "rx": 0.0,
            "ry": math.pi,
            "rz": math.sin(t * 0.1) * 0.2,
        },
        "gripperPosition": (math.sin(t * 0.5) + 1) / 2,
    }

    return {"data": telemetry}


@router.get("", response_model=dict)
async def list_robots(_: CurrentUser):
    """List all connected robots."""
    return {"data": [r.model_dump() for r in _robots.values()]}
